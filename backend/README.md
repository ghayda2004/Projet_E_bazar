# El Bazar Backend API

Backend API for the El Bazar e-commerce platform.

## Features

- User authentication (JWT-based)
- Product management (CRUD)
- Order management
- Contact form submission
- Role-based access control (Client/Seller)

## Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your configuration

## Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)
- `PUT /api/auth/profile` - Update user profile (requires auth)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/seller` - Get seller's products (requires seller auth)
- `POST /api/products` - Create product (requires seller auth)
- `PUT /api/products/:id` - Update product (requires seller auth)
- `DELETE /api/products/:id` - Delete product (requires seller auth)

### Orders
- `POST /api/orders` - Create order (requires auth)
- `GET /api/orders/user` - Get user's orders (requires auth)
- `GET /api/orders/seller` - Get seller's orders (requires seller auth)
- `PUT /api/orders/:id/status` - Update order status (requires seller auth)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contacts (requires seller auth)

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Test Accounts

**Buyer Account:**
- Email: buyer@example.com
- Password: password123

**Seller Account:**
- Email: seller@example.com
- Password: password123

## Database

Currently using in-memory storage for development. In production, replace with a real database (MongoDB, PostgreSQL, etc.) by modifying `src/models/database.js`.

## Technologies Used

- Node.js
- Express.js
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests
