# Hunting & Fishing Database API Documentation

## Overview
The Hunting & Fishing Database API provides endpoints for managing and retrieving information related to hunting and fishing activities, including licenses, seasons, species, and regulations.

## Base URL
`https://api.example.com/v1`

## Endpoints

### 1. List All Species
- **Endpoint:** `/species`
- **Method:** `GET`
- **Request Example:**
    ```
    GET /species
    ```
- **Response Example:**
    ```json
    [
        {
            "id": 1,
            "name": "Deer",
            "category": "Mammal"
        },
        {
            "id": 2,
            "name": "Bass",
            "category": "Fish"
        }
    ]
    ```

### 2. Get Species Details
- **Endpoint:** `/species/{id}`
- **Method:** `GET`
- **Request Example:**
    ```
    GET /species/1
    ```
- **Response Example:**
    ```json
    {
        "id": 1,
        "name": "Deer",
        "category": "Mammal",
        "habitat": "Forests",
        "status": "Protected"
    }
    ```

### 3. Create a License
- **Endpoint:** `/licenses`
- **Method:** `POST`
- **Request Body Example:**
    ```json
    {
        "user_id": 123,
        "type": "Hunting",
        "valid_from": "2026-02-21",
        "valid_to": "2027-02-21"
    }
    ```
- **Response Example:**
    ```json
    {
        "license_id": 456,
        "message": "License created successfully."
    }
    ```

### Error Handling
- **Error Response Format:**
    ```json
    {
        "error": {
            "code": 400,
            "message": "Invalid request."
        }
    }
    ```

### Database Schema
- **Species Table:**
    - `id` (INTEGER, PRIMARY KEY)
    - `name` (TEXT)
    - `category` (TEXT)
    - `habitat` (TEXT)
    - `status` (TEXT)
- **Licenses Table:**
    - `license_id` (INTEGER, PRIMARY KEY)
    - `user_id` (INTEGER)
    - `type` (TEXT)
    - `valid_from` (DATE)
    - `valid_to` (DATE)

## Testing Instructions
1. Use Postman or similar tool to test endpoints.
2. Ensure you have valid API keys if required.
3. Test the various request methods (`GET`, `POST`) with valid and invalid data to verify error handling and responses.

## Conclusion
This API allows for the efficient management of hunting and fishing data, making it easier for agencies and users to comply with regulations and access necessary resources.