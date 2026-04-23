🛒 MERN E-Commerce Platform (Electronics Store)

A full-stack E-Commerce Web Application built using the MERN stack with authentication, payments, admin dashboard, and analytics.

🔗 Live Demo: https://mern-ecommerce-platform-seven.vercel.app

🚀 Features

👤 User Features
User Authentication (Login / Register / Email Verification)
Browse Electronics Products
View Product Details
Add to Cart / Remove from Cart
Address Management
Secure Checkout with Razorpay
Order Confirmation Page
My Orders History

🛠️ Admin Features
Secure Admin Dashboard
Sales Analytics (Last 30 Days)
Add / Update / Delete Products
Manage Orders
Manage Users
View User Details & Orders

🧭 Application Routes

🌐 Public Routes
/ → Home Page
/about → About Page
/products → All Products
/products/:id → Product Details

🔐 Authentication Routes
/signup → Register User
/login → Login User
/verify → OTP Verification
/verify/:token → Email Verification

👤 User Protected Routes
/profile/:userId → User Profile
/cart → Cart Page
/address → Address Form
/orders → My Orders
/order-success → Order Success Page

🛠️ Admin Protected Routes
/dashboard → Admin Dashboard
/dashboard/sales → Sales Analytics
/dashboard/add-product → Add Product
/dashboard/products → Manage Products
/dashboard/orders → Manage Orders
/dashboard/users → Manage Users
/dashboard/users/:userId → User Info
/dashboard/users/orders/:userId → User Orders

🧠 Architecture
Frontend (React + Tailwind + shadcn/ui)
        ↓ REST API (Axios)
Backend (Node.js + Express.js)
        ↓
MongoDB Atlas (Database)
        ↓
Razorpay (Payments)

📊 Admin Dashboard Includes
Total Users
Total Products
Total Orders
Total Revenue
Sales Analytics Chart (Last 30 Days)|

🔐 Security Features
JWT Authentication
Role-Based Access Control (User / Admin)
Protected API Routes
Environment Variables for Sensitive Data
Secure Payment Flow (Razorpay)
⚙️ Tech Stack

Frontend
- React.js
- Redux Toolkit (State Management)
- React Router DOM
- Tailwind CSS
- shadcn/ui
- Recharts
- Axios

Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication

Services
- Razorpay Payment Gateway
- MongoDB Atlas
- Vercel (Frontend Hosting)
- Render (Backend Hosting)

🚀 Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/surajsingh-tech/-mern-ecommerce-platform.git
cd -mern-ecommerce-platform
2️⃣ Backend Setup
cd backend
npm install
npm start
3️⃣ Frontend Setup
cd frontend
npm install
npm run dev

🔑 Environment Variables

Create .env file in backend:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret

🧠 System Design Highlights
REST API Architecture
Modular MVC Structure
Scalable Folder Structure
Aggregation Pipeline for Analytics
Secure Payment Flow

📚 What I Learned
Full-stack MERN development workflow
Deployment using Vercel & Render
Authentication & Authorization (JWT)
Payment gateway integration (Razorpay)
Real-world admin dashboard development
MongoDB aggregation for analytics

🚧 Future Improvements
Product Reviews & Ratings
Wishlist Feature
Advanced Search & Filters
Coupon / Discount System
Email Notifications
🙌 Conclusion

This project is a real-world full-stack e-commerce application with authentication, payment integration, admin control, and analytics dashboard — fully deployed and production-ready.
