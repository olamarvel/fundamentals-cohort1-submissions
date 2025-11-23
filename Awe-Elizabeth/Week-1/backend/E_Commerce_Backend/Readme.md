### E-Commerce Backend (Microservices Architecture)

This project is a Node.js + TypeScript backend for Tradai, built with a microservices architecture to ensure scalability and efficiency
It uses Express, MongoDB (Mongoose), RabbitMQ, and JWT authentication.
The architecture aims to keep strict separation of concerns between services.

### Auth Service
Manages User Authentication and Login
Hashes password using a javascript library (bcrypt)
Manages communication with other services asynchronously using RabbitMQ

### Cart Service
Stores user carts in MongoDB.
Consumes UserCreated events → automatically creates an empty cart for new users.
Validates product availability (via Product Service) before adding items.
Stores { productId, quantity, product name, price } instead of full product data.
Supports CRUD operations on cart items

### Product Service
Manages product catalog.
Stores product details in MongoDB:
name, description, price, stock, category
Returns only products with stock > 1 to customers.
Provides APIs for product management (CRUD).
Can publish ProductUpdated events to notify other services (e.g., Cart, Order).

### Getting Started
git clone https://github.com/Awe-Elizabeth/e-commerce-checkout-system.git
cd e-commerce-checkout-system

### Install All Dependencies
cd auth-service && npm install
cd cart-service && npm install
cd product-service && npm install

### Auth Service Example env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/auth
JWT_SECRET=your_secret_key
RABBITMQ_URL=amqps://<cloud_instance_url>

### Cart Service Example Env
PORT=5001
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/cart
PRODUCT_SERVICE_URL=http://localhost:5002/api/products
RABBITMQ_URL=amqps://<cloud_instance_url>

### Product Service Example Env
PORT=5002
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/products

### To run a service
cd auth-service
npm run dev


### Frontend GitHub Link
https://github.com/Awe-Elizabeth/Tradai-Frontend.git