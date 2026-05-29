# E-Commerce REST API Documentation

This API supports user authentication (JWT via cookies) and full CRUD operations for e-commerce products with multiple image upload support (up to 5 images) and category filtering.

## Base URL
`/api`

---

## Authentication Endpoints

### 1. Register User
Register a new user account in the system.

*   **Route**: `/api/register`
*   **Method**: `POST`
*   **Authentication Requirement**: None
*   **Required Fields**: `name`, `email`, `mobile`, `password`
*   **Request Body**:
    ```json
    {
      "name": "John Doe",
      "email": "johndoe@example.com",
      "mobile": "+1234567890",
      "password": "strongPassword123"
    }
    ```
*   **Response Format**: JSON
*   **Example Response (201 Created)**:
    *   *Sets `accessToken` and `refreshToken` cookies.*
    ```json
    {
      "success": true,
      "message": "User created successfully"
    }
    ```
*   **Error Responses**:
    *   **400 Bad Request** (Missing fields, validation error, or duplicate email):
        ```json
        {
          "success": false,
          "message": "All fields are required"
        }
        ```
    *   **400 Bad Request** (Duplicate entry):
        ```json
        {
          "success": false,
          "message": "Duplicate entry error: The email 'johndoe@example.com' is already in use."
        }
        ```

---

### 2. Login User
Authenticate user and generate session tokens.

*   **Route**: `/api/login`
*   **Method**: `POST`
*   **Authentication Requirement**: None
*   **Required Fields**: `email`, `password`
*   **Request Body**:
    ```json
    {
      "email": "johndoe@example.com",
      "password": "strongPassword123"
    }
    ```
*   **Response Format**: JSON
*   **Example Response (200 OK)**:
    *   *Sets `accessToken` and `refreshToken` cookies.*
    ```json
    {
      "success": true,
      "message": "User logged in successfully",
      "user": {
        "_id": "60d5ec49f3e46c23d4600123",
        "name": "John Doe",
        "email": "johndoe@example.com",
        "mobile": "+1234567890",
        "createdAt": "2026-05-30T00:00:00.000Z",
        "updatedAt": "2026-05-30T00:00:00.000Z"
      }
    }
    ```
*   **Error Responses**:
    *   **400 Bad Request** (Missing fields):
        ```json
        {
          "success": false,
          "message": "All fields are required"
        }
        ```
    *   **404 Not Found** (User does not exist):
        ```json
        {
          "success": false,
          "message": "User with this email does not exist"
        }
        ```
    *   **401 Unauthorized** (Wrong password):
        ```json
        {
          "success": false,
          "message": "You entered a wrong password"
        }
        ```

---

## Product Endpoints

### 3. Get All Products
Retrieve all products from the database, supporting category filtering.

*   **Route**: `/api/products` (Optionally with filter: `/api/products?category=electronics`)
*   **Method**: `GET`
*   **Authentication Requirement**: None
*   **Required Fields**: None
*   **Request Body**: None
*   **Response Format**: JSON
*   **Example Response (200 OK)**:
    ```json
    {
      "success": true,
      "count": 1,
      "products": [
        {
          "_id": "60d5ec49f3e46c23d4600456",
          "name": "Wireless Mouse",
          "description": "Ergonomic 2.4G wireless optical mouse",
          "price": 19.99,
          "category": "electronics",
          "images": [
            "1716382029990-123456789.png"
          ],
          "createdAt": "2026-05-30T01:00:00.000Z",
          "updatedAt": "2026-05-30T01:00:00.000Z"
        }
      ]
    }
    ```
*   **Error Responses**:
    *   **500 Internal Server Error**:
        ```json
        {
          "success": false,
          "message": "Failed to retrieve products due to a database/server error"
        }
        ```

---

### 4. Get Product By ID
Retrieve details of a single product using its unique ID.

*   **Route**: `/api/products/:id`
*   **Method**: `GET`
*   **Authentication Requirement**: None
*   **Required Fields**: None
*   **Request Body**: None
*   **Response Format**: JSON
*   **Example Response (200 OK)**:
    ```json
    {
      "success": true,
      "product": {
        "_id": "60d5ec49f3e46c23d4600456",
        "name": "Wireless Mouse",
        "description": "Ergonomic 2.4G wireless optical mouse",
        "price": 19.99,
        "category": "electronics",
        "images": [
          "1716382029990-123456789.png"
        ],
        "createdAt": "2026-05-30T01:00:00.000Z",
        "updatedAt": "2026-05-30T01:00:00.000Z"
      }
    }
    ```
*   **Error Responses**:
    *   **400 Bad Request** (Invalid product ID format):
        ```json
        {
          "success": false,
          "message": "Invalid Product ID format"
        }
        ```
    *   **404 Not Found** (Product not found):
        ```json
        {
          "success": false,
          "message": "Product not found"
        }
        ```

---

### 5. Create Product
Add a new product with details and optional image attachments.

*   **Route**: `/api/products`
*   **Method**: `POST`
*   **Authentication Requirement**: Required (valid JWT `accessToken` in cookie)
*   **Required Fields**: `name`, `price` (via Request Body / Form-Data)
*   **Request Body** (Send as `multipart/form-data`):
    *   `name`: "Wireless Keyboard"
    *   `price`: 45.50
    *   `category`: "electronics"
    *   `description`: "Mechanical keyboard with backlight support"
    *   `images`: [File binary 1, File binary 2] *(Maximum 5)*
*   **Response Format**: JSON
*   **Example Response (201 Created)**:
    ```json
    {
      "success": true,
      "message": "Product created successfully",
      "product": {
        "_id": "60d5ec49f3e46c23d4600789",
        "name": "wireless keyboard",
        "description": "Mechanical keyboard with backlight support",
        "price": 45.5,
        "category": "electronics",
        "images": [
          "1716382098000-987654321.jpg",
          "1716382098010-876543210.jpg"
        ],
        "createdAt": "2026-05-30T02:00:00.000Z",
        "updatedAt": "2026-05-30T02:00:00.000Z"
      }
    }
    ```
*   **Error Responses**:
    *   **401 Unauthorized** (No token / invalid token):
        ```json
        {
          "success": false,
          "message": "Access Denied: No active session found"
        }
        ```
    *   **400 Bad Request** (Validation errors on name or price):
        ```json
        {
          "success": false,
          "message": "Validation failed",
          "errors": [
            {
              "field": "name",
              "message": "Product name is required"
            },
            {
              "field": "price",
              "message": "Product price cannot be negative"
            }
          ]
        }
        ```
    *   **400 Bad Request** (Multer upload exceeds 5 images):
        ```json
        {
          "success": false,
          "message": "File upload limit exceeded: Maximum 5 images are allowed."
        }
        ```

---

### 6. Update Product
Modify fields of an existing product.

*   **Route**: `/api/products/:id`
*   **Method**: `PUT`
*   **Authentication Requirement**: Required (valid JWT `accessToken` in cookie)
*   **Required Fields**: `name`, `price` (if modified, validates validation schema)
*   **Request Body** (Send as `multipart/form-data` or `application/json`):
    *   `price`: 39.99
    *   `description`: "Wireless mechanical keyboard on sale!"
*   **Response Format**: JSON
*   **Example Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Product updated successfully",
      "product": {
        "_id": "60d5ec49f3e46c23d4600789",
        "name": "wireless keyboard",
        "description": "Wireless mechanical keyboard on sale!",
        "price": 39.99,
        "category": "electronics",
        "images": [
          "1716382098000-987654321.jpg",
          "1716382098010-876543210.jpg"
        ],
        "createdAt": "2026-05-30T02:00:00.000Z",
        "updatedAt": "2026-05-30T02:30:00.000Z"
      }
    }
    ```
*   **Error Responses**:
    *   **401 Unauthorized**:
        ```json
        {
          "success": false,
          "message": "Access Denied: No active session found"
        }
        ```
    *   **400 Bad Request** (Invalid Product ID format):
        ```json
        {
          "success": false,
          "message": "Invalid Product ID format"
        }
        ```
    *   **404 Not Found**:
        ```json
        {
          "success": false,
          "message": "Product not found to update"
        }
        ```

---

### 7. Delete Product
Remove a product by ID.

*   **Route**: `/api/products/:id`
*   **Method**: `DELETE`
*   **Authentication Requirement**: Required (valid JWT `accessToken` in cookie)
*   **Required Fields**: None
*   **Request Body**: None
*   **Response Format**: JSON
*   **Example Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Product deleted successfully",
      "product": {
        "_id": "60d5ec49f3e46c23d4600789",
        "name": "wireless keyboard",
        "price": 39.99
      }
    }
    ```
*   **Error Responses**:
    *   **401 Unauthorized**:
        ```json
        {
          "success": false,
          "message": "Access Denied: No active session found"
        }
        ```
    *   **400 Bad Request** (Invalid Product ID format):
        ```json
        {
          "success": false,
          "message": "Invalid Product ID format"
        }
        ```
    *   **404 Not Found**:
        ```json
        {
          "success": false,
          "message": "Product not found to delete"
        }
        ```
