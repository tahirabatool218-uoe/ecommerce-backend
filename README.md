# E-Commerce Backend API

A full-stack e-commerce application with a production-style RESTful backend built using **Node.js, Express.js, and MongoDB**, and a modern **React + Vite frontend**.

The application supports secure authentication, role-based authorization, product management, Cloudinary image uploads, shopping cart operations, checkout, order management, and dedicated user and admin interfaces.

## 🌐 Live Demo

* **[Frontend](https://ecommerce-backend-5pbo.vercel.app)**
* **[Backend API](https://ecommerce-backend-six-red.vercel.app)**

---

## 🚀 Features

### Backend

* JWT-based authentication and authorization
* User registration and login
* Role-based access control for Users and Admins
* Password hashing with bcryptjs
* Product CRUD operations
* Product image uploads using Cloudinary
* Shopping cart management
* Product stock validation
* Automatic stock deduction after order creation
* Order creation and management
* User order history
* Admin order management
* Order status management
* MVC architecture
* RESTful API design
* MongoDB database integration

### Frontend

* React + Vite user interface
* User authentication
* Product browsing and product details
* Shopping cart and checkout workflow
* Order history and order details
* Admin dashboard
* Admin product management
* Admin order management
* Responsive interface

---

## 🛠️ Tech Stack

| Technology | Purpose                             |
| ---------- | ----------------------------------- |
| React      | Frontend user interface             |
| Vite       | Frontend development and build tool |
| Node.js    | Backend runtime                     |
| Express.js | REST API framework                  |
| MongoDB    | Database                            |
| Mongoose   | MongoDB ODM                         |
| JWT        | Authentication                      |
| bcryptjs   | Password hashing                    |
| Multer     | File upload handling                |
| Cloudinary | Product image storage and delivery  |
| CORS       | Cross-Origin Resource Sharing       |
| dotenv     | Environment variable configuration  |
| Postman    | API testing                         |
| Vercel     | Deployment                          |

---

## 📁 Project Structure

```text
ecommerce-backend/

│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── cart/
│   │   │   ├── home/
│   │   │   ├── layout/
│   │   │   ├── orders/
│   │   │   ├── product/
│   │   │   └── ui/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   └── ...
│   │   ├── services/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── config.js
│   │   ├── main.jsx
│   │   └── ...
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── README.md
│
├── src/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── uploadController.js
│   ├── middleware/
│   │   ├── adminMiddleware.js
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoute.js
│   │   ├── cartRoute.js
│   │   ├── orderRoute.js
│   │   ├── productRoute.js
│   │   └── uploadRoute.js
│   └── utils/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

> `.env` is used only for local configuration and must not be committed to GitHub.

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/tahirabatool218-uoe/ecommerce-backend.git
cd ecommerce-backend
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## 🔐 Environment Variables

### Backend

Create `.env` in the project root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend

Create `.env` inside the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Shopfront
VITE_CURRENCY=PKR
```

Never commit `.env` files or production secrets to GitHub.

---

## ▶️ Running Locally

### Start the Backend

From the project root:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

### Start the Frontend

From the `frontend` directory:

```bash
npm run dev
```

The Vite development server will provide the local frontend URL.

---

# 📡 API Documentation

## 🔐 Authentication

| Method | Endpoint             | Access | Description            |
| ------ | -------------------- | ------ | ---------------------- |
| `POST` | `/api/auth/register` | Public | Register a new user    |
| `POST` | `/api/auth/login`    | Public | Login an existing user |

### Register

```http
POST /api/auth/register
```

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

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

A successful login returns a JWT token for protected routes.

---

## 📦 Products

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
  "image": "Cloudinary secure image URL"
}
```

---

## 🖼️ Product Image Upload

Product images are uploaded to Cloudinary through an admin-protected endpoint.

| Method | Endpoint                    | Access | Description          |
| ------ | --------------------------- | ------ | -------------------- |
| `POST` | `/api/upload/product-image` | Admin  | Upload product image |

**Supported formats:** JPG, JPEG, PNG, WEBP
**Maximum file size:** 5 MB

Request:

```http
POST /api/upload/product-image
Authorization: Bearer <admin_jwt_token>
Content-Type: multipart/form-data
```

Form-data:

```text
image: <selected image file>
```

The image is stored in Cloudinary, while its secure URL is saved in the product's `image` field.

---

## 🛒 Cart

| Method   | Endpoint               | Access | Description             |
| -------- | ---------------------- | ------ | ----------------------- |
| `GET`    | `/api/cart`            | User   | Get current user's cart |
| `POST`   | `/api/cart`            | User   | Add product to cart     |
| `PUT`    | `/api/cart/:productId` | User   | Update quantity         |
| `DELETE` | `/api/cart/:productId` | User   | Remove product          |
| `DELETE` | `/api/cart`            | User   | Clear cart              |

Example:

```json
{
  "productId": "PRODUCT_ID",
  "quantity": 2
}
```

The API validates product availability and stock before updating the cart.

---

## 🧾 Orders

| Method   | Endpoint                 | Access     | Description            |
| -------- | ------------------------ | ---------- | ---------------------- |
| `POST`   | `/api/orders`            | User       | Create order from cart |
| `GET`    | `/api/orders/my-orders`  | User       | Get user's orders      |
| `GET`    | `/api/orders/:id`        | User/Admin | Get a single order     |
| `GET`    | `/api/orders`            | Admin      | Get all orders         |
| `PUT`    | `/api/orders/:id/status` | Admin      | Update order status    |
| `DELETE` | `/api/orders/:id`        | Admin      | Delete an order        |

### Create Order

```json
{
  "shippingAddress": "Faisalabad, Punjab, Pakistan"
}
```

Order creation automatically:

1. Validates the cart.
2. Checks product availability.
3. Calculates the order total.
4. Deducts product stock.
5. Creates the order.
6. Clears the user's cart.

### Order Status

```text
Pending
Processing
Shipped
Delivered
Cancelled
```

---

## 🔑 Authentication & Authorization

Protected endpoints require:

```http
Authorization: Bearer <your_jwt_token>
```

| Role  | Access                                      |
| ----- | ------------------------------------------- |
| User  | Cart and personal order operations          |
| Admin | Product, image upload, and order management |

Admin endpoints use both JWT authentication and role-based authorization middleware.

---

## 🧪 API Testing

The backend API was tested using **Postman**.

Testing covered:

* User registration and login
* JWT authentication
* Admin authorization
* Product CRUD
* Product image upload
* Cloudinary integration
* Cart operations
* Stock validation
* Order creation
* User order history
* Admin order management
* Order status updates
* Order deletion

---

## 🏗️ Architecture

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

### Product Image Upload Flow

```text
Admin
  ↓
Upload Route
  ↓
Authentication + Authorization
  ↓
Multer
  ↓
Cloudinary
  ↓
Secure Image URL
  ↓
Product.image
  ↓
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

## 🔒 Security

The application implements the following security practices:

* Password hashing using bcryptjs
* JWT-based authentication
* Protected private routes
* Role-based admin authorization
* Admin-only product image uploads
* Environment-based secret configuration
* `.env` excluded from Git version control

---

## 📌 Project Scope

### Included

* User authentication
* JWT authorization
* Role-based access control
* Product management
* Cloudinary image uploads
* Shopping cart
* Checkout and order management
* Stock management
* RESTful APIs
* MongoDB integration
* MVC architecture
* React frontend
* Admin dashboard
* User order management

### Not Included

* Payment gateway
* Product reviews and ratings
* Wishlist
* Coupon system
* External shipping API
* Advanced product search
* Refresh token system

---

## 🚀 Deployment

The application is deployed on **Vercel**.

The frontend and backend are deployed as separate services and communicate through the REST API.

* **[Live Frontend](https://ecommerce-backend-5pbo.vercel.app)**
* **[Live Backend API](https://ecommerce-backend-six-red.vercel.app)**

MongoDB is used for database management, while Cloudinary handles product image storage and delivery.

Production environment variables are configured in the deployment platform and are not stored in the repository.

---

## 🔮 Future Scope

Potential future improvements include:

* Payment gateway integration
* Product reviews and ratings
* Wishlist functionality
* Coupon and discount management
* Advanced product search and filtering
* Shipping API integration
* Refresh token authentication
* Advanced admin analytics

---

## 👩‍💻 Author

**Tahira Batool**

BS Computer Science
University of Education, Jauharabad Campus

---

## 📄 License

This project is developed for educational and portfolio purposes.
