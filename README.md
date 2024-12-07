# Clothing Store Backend

This is the backend API for the Clothing Store application. It handles user authentication, product management, and order processing for the e-commerce platform.

## Installation

Follow these steps to get the backend up and running locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yinkus89/clothing-backend.git
   cd clothing-backend
npm install
JWT_SECRET=your_secret_key
DATABASE_URL=your_database_connection_string
npm start
Usage
The backend provides several API endpoints for user registration, login, and managing products and orders.

Base URL: http://localhost:5000/api
Auth Endpoints:
POST /api/auth/register: Register a new user.
POST /api/auth/login: Login and receive a JWT token.
Product Endpoints:
GET /api/products: Get a list of products.
POST /api/products: Add a new product (Admin only).
PUT /api/products/:id: Update an existing product (Admin only).
DELETE /api/products/:id: Delete a product (Admin only).
Order Endpoints:
GET /api/orders: Get a list of orders.
POST /api/orders: Place a new order.
Technologies Used
Node.js
Express
Prisma (for database ORM)
JWT (JSON Web Tokens for authentication)
dotenv (for managing environment variables)
Contributing
Contributions are welcome! To contribute to this project, please follow these steps:

Fork the repository.
Create a new branch: git checkout -b feature-branch.
Make your changes and commit them: git commit -am 'Add new feature'.
Push your branch: git push origin feature-branch.
Create a pull request with a description of the changes.
License;MIT License 


