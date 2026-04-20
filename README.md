# 🛒 MERN E-Commerce App (Electronics Store)

A full-stack **E-Commerce Web Application** built using the MERN stack with authentication, payments, admin dashboard, and analytics.

---

## 🚀 Features

### 👤 User Features

* User Authentication (Login / Register / Email Verification)
* Browse Electronics Products
* View Single Product Details
* Add to Cart
* Address Management
* Secure Checkout with Razorpay
* Order Success Page
* My Orders Page

---

### 🛠️ Admin Features

* Protected Admin Dashboard
* Sales Analytics (Last 30 Days Chart)
* Add / Manage Products
* Manage Orders
* Manage Users
* View Individual User Info & Orders

---

## 🧭 Application Routes

### 🌐 Public Routes

* `/` → Home
* `/about` → About Page
* `/products` → All Products
* `/products/:id` → Single Product

---

### 🔐 Auth Routes

* `/signup` → Register
* `/login` → Login
* `/verify` → OTP Verification
* `/verify/:token` → Email Verification

---

### 👤 Protected User Routes

* `/profile/:userId` → User Profile
* `/cart` → Cart Page
* `/address` → Address Form
* `/orders` → My Orders
* `/order-success` → Order Success Page

---

### 🛠️ Admin Routes (Protected)

* `/dashboard` → Admin Dashboard

  * `/dashboard/sales` → Sales Analytics
  * `/dashboard/add-product` → Add Product
  * `/dashboard/products` → Manage Products
  * `/dashboard/orders` → Manage Orders
  * `/dashboard/users` → Manage Users
  * `/dashboard/users/:userId` → User Info
  * `/dashboard/users/orders/:userId` → User Orders

---

## 🧠 Project Highlights

* Complete MERN Stack Implementation
* Role-based Protected Routes (User / Admin)
* Sales Analytics using MongoDB Aggregation
* Razorpay Payment Integration
* Clean & Responsive UI using **shadcn/ui + Tailwind CSS**

---

## 📦 Tech Stack

**Frontend:**

* React.js
* React Router DOM
* Tailwind CSS
* shadcn/ui
* Recharts

**Backend:**

* Node.js
* Express.js
* MongoDB
* Mongoose

**Other Tools:**

* Razorpay API
* JWT Authentication
* Axios

---

## 📊 Admin Dashboard Includes

* Total Users
* Total Products
* Total Orders
* Total Sales
* Sales Chart (Last 30 Days)

---

## 🔐 Security Features

* JWT Authentication
* Protected Routes (Admin & User)
* Secure API Handling
* Environment Variables for Sensitive Data

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/surajsingh-tech/-mern-ecommerce-platform.git
cd ./-mern-ecommerce-platform
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm start
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create `.env` in backend:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```

---

## 🚧 Deployment

> Currently running locally. Deployment will be added soon.

---

## 📌 Future Improvements

* Multiple categories (currently Electronics only)
* Product Reviews & Ratings
* Wishlist Feature
* Advanced Filters & Search

---

## 🙌 Conclusion

This project demonstrates a **real-world full-stack application** including authentication, payments, admin control, and analytics dashboard.


