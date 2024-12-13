# Backend for DWITIN

This repository contains the backend code for the DWITIN project, a platform for managing transactions, user profiles, and file uploads. The backend is built with Node.js, Express, Sequelize, and integrates with Google Cloud services.

## Table of Contents

1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Environment Variables](#environment-variables)
4. [Getting Started](#getting-started)
   - [Local Setup](#local-setup)
   - [Deployment](#deployment)
5. [API Documentation](#api-documentation)
   - [Base URL](#base-url)
   - [Authentication](#authentication)
     - [Register User](#register-user)
     - [Login User](#login-user)
   - [Users](#users)
     - [Get User Profile](#get-user-profile)
     - [Upload Profile Image](#upload-profile-image)
   - [Transactions](#transactions)
     - [Create Transaction](#create-transaction)
     - [Get All Transactions](#get-all-transactions)
     - [Get Transaction by ID](#get-transaction-by-id)
     - [Delete Transaction](#delete-transaction)
6. [License](#license)

## Features
- User authentication (register and login).
- Manage transactions (create, read, delete).
- Upload and retrieve user profile images.
- Google Cloud Storage integration for storing uploaded images.

## Prerequisites

Before you begin, ensure you have the following:

- Node.js and npm installed.
- MySQL database instance.
- Google Cloud service account key file for accessing Google Cloud Storage.
- Compute Engine instance with the backend deployed.

## Environment Variables

- The following environment variables must be defined in a `.env` file:

```plaintext
PORT=5000
JWT_SECRET=your_jwt_secret_key
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASS=your_database_password
DB_NAME=your_database_name
GOOGLE_CLOUD_PROJECT=your_google_cloud_project_id
GOOGLE_APPLICATION_CREDENTIALS=./credentials/service-account-key.json
```

- The following credential variables must be defined in a ./credentials/`serviceAccountKey.json` file:

```json
{
    "type": "service_account",
    "project_id": "your_project_id",
    "private_key_id": "your_private_key_id",
    "private_key": "your_private_key",
    "client_email": "your_client_email",
    "client_id": "your_client_id",
    "auth_uri": "your_auth_uri",
    "token_uri": "your_token_uri",
    "auth_provider_x509_cert_url": "your_auth_provider_x509_cert_url",
    "client_x509_cert_url": "your_client_cert_url"
}
```

## Getting Started

### Local Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Sealonk/dwitin-backend.git
   cd dwitin-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Add the required environment variables in a `.env` file in the root directory.

4. Create a `credentials` directory and place your Google Cloud service account key file inside.

5. Start the server:

   ```bash
   npm run start
   ```

### Deployment

The backend is deployed to Google Compute Engine at:

```
http://35.219.51.198:5000
```

Ensure that the Compute Engine instance has:
- Node.js installed.
- Environment variables configured.
- Required ports (e.g., 5000) open in the firewall settings.

## API Documentation

### Base URL
```
http://35.219.51.198:5000/api
```

### Authentication

#### 1. Register User
- **Endpoint:** `POST /auth/register`
- **Description:** Registers a new user.
- **Request Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response:**
  ```json
  {
    "error": false,
    "message": "User Created"
  }
  ```

#### 2. Login User
- **Endpoint:** `POST /auth/login`
- **Description:** Logs in an existing user and generates a JWT token.
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response:**
  ```json
  {
    "error": false,
    "message": "success",
    "loginResult": {
      "userId": 1,
      "name": "John Doe",
      "token": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
  ```

### Users

#### 1. Get User Profile
- **Endpoint:** `GET /users/user`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <JWT_TOKEN>"
  }
  ```
- **Description:** Fetches the profile of the authenticated user.
- **Response:**
  ```json
  {
    "error": false,
    "message": "User profile fetched successfully",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "johndoe@example.com",
      "profileImage": "null",
      "darkMode": false,
      "language": "en",
      "balance": 10000
    }
  }
  ```

#### 2. Upload Profile Image
- **Endpoint:** `POST /users/user/profile-image`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <JWT_TOKEN>"
  }
  ```
- **Description:** Uploads a profile image for the authenticated user.
- **Request Form Data:**
  - Key: `profileImage`
  - Value: Image file
- **Response:**
  ```json
  {
    "error": false,
    "message": "Profile image uploaded successfully",
    "profileImage": "https://storage.googleapis.com/dwitin-bucket/profile_image_url.jpg"
  }
  ```

### Transactions

#### 1. Create Transaction
- **Endpoint:** `POST /transactions`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <JWT_TOKEN>"
  }
  ```
- **Request Body:**
  ```json
  {
    "title": "string",
    "amount": "number",
    "type": "income | expense",
    "description": "string"
  }
  ```
- **Response:**
  ```json
  {
    "error": false,
    "message": "Transaction added successfully",
    "transactionData": {
      "id": 22,
      "title": "Monthly Salary",
      "amount": 50000,
      "type": "income",
      "description": "Salary for December",
      "userId": 1,
      "createdAt": "2024-12-11T04:54:20.697Z",
      "updatedAt": "2024-12-11T04:54:20.697Z"
    }
  }
  ```

#### 2. Get All Transactions
- **Endpoint:** `GET /transactions`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <JWT_TOKEN>"
  }
  ```
- **Response:**
  ```json
  {
    "error": false,
    "message": "Transactions fetched successfully",
    "listTransaction": [
      {
        "id": 11,
        "title": "Shopping",
        "amount": 100,
        "type": "expense",
        "description": "Groceries",
        "imageUrl": null,
        "createdAt": "2024-12-10T06:31:03.000Z",
        "updatedAt": "2024-12-10T06:31:03.000Z"
      }
    ]
  }
  ```

#### 3. Get Transaction by ID
- **Endpoint:** `GET /transactions/:id`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <JWT_TOKEN>"
  }
  ```
- **Response:**
  ```json
  {
    "error": false,
    "message": "Transaction fetched successfully",
    "transaction": {
      "id": 22,
      "title": "Monthly Salary",
      "amount": 50000,
      "type": "income",
      "description": "Salary for December",
      "userId": 1,
      "createdAt": "2024-12-11T04:54:20.697Z",
      "updatedAt": "2024-12-11T04:54:20.697Z"
    }
  }
  ```

#### 4. Delete Transaction
- **Endpoint:** `DELETE /transactions/:id`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <JWT_TOKEN>"
  }
  ```
- **Response:**
  ```json
  {
    "error": false,
    "message": "Transaction deleted successfully",
    "balance": 45000
  }
  ```

---

## License
This project is licensed under the MIT License.
