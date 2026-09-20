# E-Commerce Backend API

A production-style RESTful e-commerce backend built with **Node.js, Express.js, and MongoDB**.

The API provides secure authentication, role-based authorization, product management, shopping cart functionality, and order management.

---

## 🚀 Features

- 🔐 User registration and login
- 🔑 JWT-based authentication
- 👤 Role-based authorization (User/Admin)
- 🔒 Password hashing with bcryptjs
- 📦 Product CRUD operations
- 🛒 Shopping cart management
- 📊 Product stock validation
- 🧾 Order creation from cart
- 📉 Automatic stock deduction after order creation
- 📋 User order history
- ⚙️ Admin order management
- 🔄 Order status management
- 🏗️ MVC architecture
- 🌐 RESTful API
- 🔧 Environment variable configuration
- 🗄️ MongoDB database integration

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | Backend runtime |
| **Express.js** | REST API framework |
| **MongoDB** | Database |
| **Mongoose** | MongoDB ODM |
| **JWT** | Authentication |
| **bcryptjs** | Password hashing |
| **dotenv** | Environment variables |
| **CORS** | Cross-Origin Resource Sharing |
| **Postman** | API testing |

---

## 📁 Project Structure

```text
ecommerce-backend/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   │
│   └── routes/
│       ├── authRoute.js
│       ├── productRoute.js
│       ├── cartRoute.js
│       └── orderRoute.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js
````

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/tahirabatool218-uoe/ecommerce-backend.git
cd ecommerce-backend
```

### 2. Install Dependencies

```bash
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
```
---

## ▶️ Running the Server

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

The server runs by default at:

```text
http://localhost:5000
```

---

# 📡 API Documentation

## 🔐 Authentication APIs

| Method | Endpoint             | Access | Description            |
| ------ | -------------------- | ------ | ---------------------- |
| `POST` | `/api/auth/register` | Public | Register a new user    |
| `POST` | `/api/auth/login`    | Public | Login an existing user |

### Register

```http
POST /api/auth/register
```

Example request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

### Login

```http
POST /api/auth/login
```

Example request:

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

A successful login returns a JWT token that is used to access protected routes.

---

# 📦 Product APIs

| Method   | Endpoint            | Access | Description          |
| -------- | ------------------- | ------ | -------------------- |
| `GET`    | `/api/products`     | Public | Get all products     |
| `GET`    | `/api/products/:id` | Public | Get a single product |
| `POST`   | `/api/products`     | Admin  | Create a product     |
| `PUT`    | `/api/products/:id` | Admin  | Update a product     |
| `DELETE` | `/api/products/:id` | Admin  | Delete a product     |

### Product Fields

```json
{
  "name": "Wireless Mouse",
  "description": "Ergonomic wireless mouse",
  "price": 2500,
  "category": "Electronics",
  "stock": 10,
  "image": "https://example.com/mouse.jpg"
}
```

---

# 🛒 Cart APIs

| Method   | Endpoint               | Access | Description              |
| -------- | ---------------------- | ------ | ------------------------ |
| `GET`    | `/api/cart`            | User   | Get current user's cart  |
| `POST`   | `/api/cart`            | User   | Add product to cart      |
| `PUT`    | `/api/cart/:productId` | User   | Update product quantity  |
| `DELETE` | `/api/cart/:productId` | User   | Remove product from cart |
| `DELETE` | `/api/cart`            | User   | Clear the cart           |

### Add Product to Cart

```http
POST /api/cart
```

Example request:

```json
{
  "productId": "PRODUCT_ID",
  "quantity": 2
}
```

The API validates product existence and available stock before adding the product.

---

# 🧾 Order APIs

| Method   | Endpoint                 | Access     | Description                 |
| -------- | ------------------------ | ---------- | --------------------------- |
| `POST`   | `/api/orders`            | User       | Create order from cart      |
| `GET`    | `/api/orders/my-orders`  | User       | Get logged-in user's orders |
| `GET`    | `/api/orders/:id`        | User/Admin | Get a single order          |
| `GET`    | `/api/orders`            | Admin      | Get all orders              |
| `PUT`    | `/api/orders/:id/status` | Admin      | Update order status         |
| `DELETE` | `/api/orders/:id`        | Admin      | Delete an order             |

### Create Order

```http
POST /api/orders
```

Example request:

```json
{
  "shippingAddress": "Faisalabad, Punjab, Pakistan"
}
```

When an order is created:

1. The cart is validated.
2. Product availability is checked.
3. The order total is calculated.
4. Product stock is automatically reduced.
5. The order is created.
6. The user's cart is cleared.

---

## 🔄 Order Status

Orders can have the following statuses:

```text
Pending
Processing
Shipped
Delivered
Cancelled
```

Admin users can update the order status through:

```http
PUT /api/orders/:id/status
```

Example request:

```json
{
  "status": "Processing"
}
```

---

# 🔑 Authentication

Protected routes require a valid JWT token in the request header.

```http
Authorization: Bearer <your_jwt_token>
```

### Access Levels

| Role      | Access                                  |
| --------- | --------------------------------------- |
| **User**  | Cart and personal order operations      |
| **Admin** | Product management and order management |

Admin-only routes are protected using both:

* JWT authentication middleware
* Admin authorization middleware

---

# 🧪 API Testing

The backend APIs were tested using **Postman**.

Tested functionality includes:

* User registration
* User login
* JWT authentication
* Admin authorization
* Product creation
* Product retrieval
* Product update
* Product deletion
* Cart creation
* Add product to cart
* Update cart quantity
* Remove product from cart
* Clear cart
* Order creation
* User order history
* Single order retrieval
* Admin order management
* Order status update
* Order deletion
* Product stock validation

---

# 🔒 Security

The application implements several basic security practices:

* Passwords are hashed using **bcryptjs**.
* JWT is used for authentication.
* Protected routes require a valid JWT.
* Admin routes require the `admin` role.
* Sensitive configuration is stored in environment variables.
* `.env` is excluded from Git version control.

---

# 🏗️ Architecture

The backend follows the **MVC (Model-View-Controller)** architecture.

```text
Client / Postman
       │
       ▼
    Routes
       │
       ▼
  Middleware
       │
       ▼
 Controllers
       │
       ▼
    Models
       │
       ▼
   MongoDB
```

### Request Flow

```text
Request
   ↓
Route
   ↓
Authentication / Authorization
   ↓
Controller
   ↓
Mongoose Model
   ↓
MongoDB
   ↓
Response
```

---

# 📌 Project Scope

## Included

* Authentication
* JWT authorization
* Role-based access
* Product management
* Shopping cart
* Order management
* Stock management
* RESTful APIs
* MongoDB integration
* MVC architecture

## Not Included

The current version does not include:

* Payment gateway
* Product reviews and ratings
* Wishlist
* Coupon system
* External shipping API
* Advanced product search
* Refresh token system

---

# 🚀 Future Scope

Possible future improvements include:

* 💳 Payment gateway integration
* ⭐ Product reviews and ratings
* ❤️ Wishlist functionality
* 🎟️ Coupon and discount management
* 🔎 Advanced product search and filtering
* 🚚 Shipping API integration
* 🔄 Refresh token authentication
* 📊 Advanced admin analytics

---

# 👩‍💻 Author

**Tahira Batool**

BS Computer Science
University of Education, Jauharabad Campus

---

## 📄 License

This project is developed for educational and portfolio purposes.

