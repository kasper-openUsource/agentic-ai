# API Documentation

## Overview
This document provides detailed API documentation for the Agentic AI service, detailing endpoints, request/response structures, error codes, and usage guidelines.

## Endpoints

### 1. User Authentication
- **Endpoint:** `/api/auth/login`
- **Method:** POST
- **Description:** Authenticates a user and returns a token.
- **Request Example:**
  ```json
  {
    "username": "exampleUser",
    "password": "examplePassword"
  }
  ```
- **Response Example:**
  ```json
  {
    "token": "your_jwt_token_here"
  }
  ```
- **Error Codes:**
  - `401`: Unauthorized - Invalid credentials.

### 2. Get User Profile
- **Endpoint:** `/api/user/profile`
- **Method:** GET
- **Description:** Retrieves the authenticated user's profile.
- **Request Example:**
  ```
  GET /api/user/profile
  Authorization: Bearer your_jwt_token_here
  ```
- **Response Example:**
  ```json
  {
    "id": "123",
    "username": "exampleUser",
    "email": "user@example.com"
  }
  ```
- **Error Codes:**
  - `403`: Forbidden - Token is missing or invalid.

## Usage Guidelines
1. Ensure that all requests to protected endpoints include the `Authorization` header with a valid Bearer token.
2. Check response codes to handle errors appropriately in your application.
3. For further assistance, refer to the support section of our documentation or contact our support team.