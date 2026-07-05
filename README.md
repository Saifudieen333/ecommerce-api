# 🛒 E-Commerce Backend API

A professional RESTful API for an e-commerce platform built with Node.js, Express, and MongoDB. This API handles everything from product management to shopping cart and order processing.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)

## ✨ Features

- **Product Management**: Full CRUD operations with advanced filtering
- **Category Management**: Organize products into categories
- **Shopping Cart**: Add/remove items, automatic total calculation
- **Order Processing**: Complete checkout flow with stock reduction
- **Order Tracking**: Update order status
- **Error Handling**: Centralized error handling

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose

## 📦 Installation

### 1. Clone the repository
```bash
git clone https://github.com/Saifudieen333/ecommerce-api.git
cd ecommerce-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create .env file
Create a file named `.env` in the root folder:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/ecommerce-db
NODE_ENV=development
```

### 4. Seed the database
```bash
npm run seed
```

### 5. Start the server
```bash
npm run dev
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `MONGO_URI` | MongoDB connection | Required |
| `NODE_ENV` | Environment mode | `development` |

## 📡 API Endpoints

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| POST | `/api/categories` | Create category |
| PUT | `/api/categories/:id` | Update category |
| DELETE | `/api/categories/:id` | Delete category |

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

### Cart

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/cart/items` | Add item to cart |
| PATCH | `/api/cart/items/:id` | Update cart item |
| DELETE | `/api/cart/items/:id` | Remove item |
| GET | `/api/cart` | Get cart |
| DELETE | `/api/cart` | Clear cart |

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order |
| GET | `/api/orders` | Get all orders |
| GET | `/api/orders/:id` | Get order by ID |
| PATCH | `/api/orders/:id/status` | Update status |

## 📁 Project Structure

```
ecommerce-api/
├── controllers/
├── models/
├── routes/
├── middleware/
├── utils/
├── db/
├── app.js
├── package.json
└── README.md
```

## 📮 Postman Collection

A complete Postman collection and environment are included in the `/postman` folder.

### How to Import:

1. **Open Postman**

2. **Import Collection:**
   - Click **Import** button (top left)
   - Drag and drop `E-Commerce-API.postman_collection.json`
   - Or click "Choose Files" and select it

3. **Import Environment:**
   - Click **Import** button again
   - Drag and drop `E-Commerce-API-Dev.postman_environment.json`

4. **Set Environment:**
   - Click the environment dropdown (top right)
   - Select "E-Commerce API Dev"

5. **Update IDs:**
   - Run "Get All Categories" request
   - Copy a category `_id` from the response
   - Click the eye icon 👁️
   - Paste it into `categoryId` Current Value
   - Repeat for `productId`, `cartId`, and `orderId`



## 👨‍💻 Author

**Saif El-Dien Eslam** - DECI First Term Project