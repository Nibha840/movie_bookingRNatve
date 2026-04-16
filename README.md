# 🎬 CineBook — Movie Ticket Reservation System

A **full-stack Movie Ticket Reservation System** built with **React Native (Expo)** and **Node.js/Express** backend, featuring real-time seat selection, Razorpay payment integration, email confirmations, and an admin dashboard.

---

## 📸 Features

| Feature                           | Description                                                                  |
| --------------------------------- | ---------------------------------------------------------------------------- |
| 🔐 **Authentication**             | Secure user registration & login with JWT tokens and bcrypt password hashing |
| 🎥 **Movie Browsing**             | Browse movies with posters, genres, and detailed descriptions                |
| 💺 **Interactive Seat Selection** | Visual seat map with real-time availability and multi-seat selection         |
| 💳 **Razorpay Payments**          | Secure payment processing via Razorpay (UPI, Cards, Net Banking, Wallets)    |
| 📧 **Email Confirmation**         | Automated booking confirmation emails via Nodemailer                         |
| 🎫 **My Bookings**                | View booking history with transaction details                                |
| 👤 **User Profile**               | Profile management with personalized dashboard                               |
| 🛡️ **Admin Dashboard**            | Admin panel to add/manage movies and view all bookings                       |
| 📱 **Cross-Platform**             | Runs on Android, iOS, and Web via Expo                                       |

---

## 🛠️ Tech Stack

### Frontend

| Technology       | Purpose                                   |
| ---------------- | ----------------------------------------- |
| React Native     | Cross-platform mobile UI framework        |
| Expo             | Development platform & build tools        |
| React Navigation | Screen routing & navigation (Stack + Tab) |
| Context API      | Global state management (Auth)            |
| Expo SecureStore | Secure token storage                      |

### Backend

| Technology   | Purpose                     |
| ------------ | --------------------------- |
| Node.js      | Server runtime              |
| Express.js   | REST API framework          |
| MySQL        | Relational database         |
| JWT          | Token-based authentication  |
| bcryptjs     | Password hashing            |
| Razorpay SDK | Payment gateway integration |
| Nodemailer   | Email service               |

---

## 📁 Project Structure

```
movie-reservation-system/
│
├── MovieBookingApp/                # React Native Frontend (Expo)
│   └── src/
│       ├── components/             # Reusable UI components
│       │   ├── index.js            # Button, Input, MovieCard, etc.
│       │   └── RazorpayCheckout.js # Razorpay payment component
│       ├── context/
│       │   └── AuthContext.js      # Authentication context provider
│       ├── navigation/
│       │   ├── RootNavigator.js    # Root navigation controller
│       │   ├── AuthNavigator.js    # Login/Register stack
│       │   ├── AppNavigator.js     # Main app stack navigator
│       │   └── UserTabNavigator.js # Bottom tab navigation
│       ├── screens/
│       │   ├── HomeScreen.js       # Movie listing & browsing
│       │   ├── LoginScreen.js      # User login
│       │   ├── RegisterScreen.js   # User registration
│       │   ├── MovieDetailsScreen.js    # Movie details & showtime
│       │   ├── SeatSelectionScreen.js   # Interactive seat picker
│       │   ├── PaymentScreen.js         # Razorpay checkout
│       │   ├── BookingConfirmationScreen.js  # Booking success
│       │   ├── MyBookingsScreen.js      # Booking history
│       │   ├── ProfileScreen.js         # User profile
│       │   ├── AdminDashboardScreen.js  # Admin panel
│       │   └── AddMovieScreen.js        # Add new movie (Admin)
│       ├── services/
│       │   └── api.js              # Axios API service layer
│       └── utils/
│           ├── theme.js            # Design system (colors, fonts, spacing)
│           └── helpers.js          # Utility functions
│
├── server/                         # Node.js Backend
│   ├── config/
│   │   └── db.js                   # MySQL database connection
│   ├── controllers/
│   │   ├── authController.js       # Register & Login logic
│   │   ├── movieController.js      # Movie CRUD operations
│   │   ├── bookingController.js    # Booking management
│   │   └── paymentController.js    # Razorpay order & verification
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth/*
│   │   ├── movieRoutes.js          # /api/movies/*
│   │   ├── bookingRoutes.js        # /api/bookings/*
│   │   └── paymentRoutes.js        # /api/payment/*
│   ├── utils/
│   │   └── emailService.js         # Nodemailer email utility
│   ├── index.js                    # Server entry point
│   ├── .env                        # Environment variables
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites

- **Node.js** (v18+)
- **MySQL** (v8.0+)
- **Expo CLI** (`npm install -g expo-cli`)
- **Razorpay Account** (for payment integration — [dashboard.razorpay.com](https://dashboard.razorpay.com))

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/movie-reservation-system.git
cd movie-reservation-system
```

### 2. Setup MySQL Database

Open MySQL Workbench or terminal and create the database:

```sql
CREATE DATABASE movie_db;
USE movie_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    poster_url VARCHAR(500),
    genre VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE showtimes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT,
    show_date DATE,
    show_time TIME,
    FOREIGN KEY (movie_id) REFERENCES movies(id)
);

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    showtime_id INT,
    seats JSON,
    total_price DECIMAL(10,2),
    transaction_id VARCHAR(100),
    status ENUM('confirmed', 'cancelled') DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (showtime_id) REFERENCES showtimes(id)
);
```

### 3. Setup Backend Server

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=movie_db

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=1h

# Email (Gmail App Password)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Razorpay (Get from dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

Start the server:

```bash
npm run dev     # Development (with nodemon)
# or
npm start       # Production
```

Server will run on `http://localhost:5000`

### 4. Setup Frontend App

```bash
cd MovieBookingApp
npm install
npx expo start
```

- Press `w` for Web
- Press `a` for Android (Expo Go app required)
- Press `i` for iOS (macOS only)

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint             | Description           |
| ------ | -------------------- | --------------------- |
| `POST` | `/api/auth/register` | Register a new user   |
| `POST` | `/api/auth/login`    | Login & get JWT token |

### Movies

| Method | Endpoint      | Description             |
| ------ | ------------- | ----------------------- |
| `GET`  | `/api/movies` | Get all movies          |
| `POST` | `/api/movies` | Add a new movie (Admin) |

### Bookings

| Method | Endpoint                     | Description                |
| ------ | ---------------------------- | -------------------------- |
| `POST` | `/api/bookings/book`         | Create a new booking       |
| `GET`  | `/api/bookings/user/:userId` | Get user's booking history |

### Payments (Razorpay)

| Method | Endpoint                    | Description              |
| ------ | --------------------------- | ------------------------ |
| `POST` | `/api/payment/create-order` | Create Razorpay order    |
| `POST` | `/api/payment/verify`       | Verify payment signature |

### Utility

| Method | Endpoint          | Description              |
| ------ | ----------------- | ------------------------ |
| `POST` | `/api/test-email` | Test email configuration |

---

## 💳 Razorpay Payment Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │     │   Backend    │     │   Razorpay   │
│  (React Native)    │  (Express)   │     │   Server     │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │ 1. Pay Button      │                    │
       ├───────────────────►│                    │
       │                    │ 2. Create Order    │
       │                    ├───────────────────►│
       │                    │ 3. Order ID        │
       │                    │◄───────────────────┤
       │ 4. Order Details   │                    │
       │◄───────────────────┤                    │
       │                    │                    │
       │ 5. Razorpay Checkout (UPI/Card/Wallet) │
       ├────────────────────────────────────────►│
       │ 6. Payment Response                     │
       │◄────────────────────────────────────────┤
       │                    │                    │
       │ 7. Verify Payment  │                    │
       ├───────────────────►│                    │
       │                    │ 8. Signature Check │
       │                    ├───────────────────►│
       │ 9. Booking Confirmed                    │
       │◄───────────────────┤                    │
       └────────────────────┴────────────────────┘
```

---

## 🧪 Testing Razorpay (Test Mode)

Razorpay test mode **does not support international cards** (like `4111 1111 1111 1111`). Use the following methods instead:

### ✅ Working Test Methods

| Method | How to Test |
|---|---|
| **Net Banking** | Select any bank → Click "Pay" → Auto-succeeds in test mode |
| **UPI** | Enter `success@razorpay` as UPI ID → Payment succeeds |
| **Wallets** | Select any wallet → Click "Pay" → Auto-succeeds |

### ❌ Not Working in Test Mode

| Method | Reason |
|---|---|
| **Debit/Credit Cards** | International cards not supported; Indian test cards require Razorpay's specific test card setup |

> **💡 Tip:** For quick testing, use **Net Banking** — just select any bank and click Pay. It auto-completes instantly.

---

## 📱 App Screens

| Screen                   | Description                                             |
| ------------------------ | ------------------------------------------------------- |
| **Login / Register**     | JWT-based authentication with form validation           |
| **Home**                 | Movie listing with search and genre filtering           |
| **Movie Details**        | Movie info, poster, and showtime selection              |
| **Seat Selection**       | Interactive visual seat map with category-based pricing |
| **Payment**              | Razorpay secure checkout with order summary             |
| **Booking Confirmation** | Success screen with booking details and transaction ID  |
| **My Bookings**          | View all past and current bookings                      |
| **Profile**              | User profile and account management                     |
| **Admin Dashboard**      | Movie management and booking overview (Admin only)      |
| **Add Movie**            | Form to add new movies to the platform (Admin only)     |

---

## 🔒 Security Features

- ✅ **JWT Authentication** — Stateless token-based auth with configurable expiry
- ✅ **Password Hashing** — bcryptjs with salt rounds for secure storage
- ✅ **Razorpay Signature Verification** — Server-side HMAC-SHA256 verification
- ✅ **Environment Variables** — Sensitive data stored in `.env` (never committed)
- ✅ **CORS Protection** — Cross-Origin Resource Sharing configured
- ✅ **Secure Token Storage** — Expo SecureStore for mobile, AsyncStorage fallback for web

---

## 👥 User Roles

| Role      | Access                                                      |
| --------- | ----------------------------------------------------------- |
| **User**  | Browse movies, book tickets, make payments, view bookings   |
| **Admin** | All user features + Add/manage movies, view admin dashboard |

---

## 🚀 Future Enhancements

- [ ] Movie search & filter by genre
- [ ] Showtime management for admins
- [ ] Booking cancellation & refunds
- [ ] Push notifications for booking reminders
- [ ] Movie ratings & reviews
- [ ] Multiple theater/screen support
- [ ] QR code-based ticket generation

---

## 📄 License

This project is built for educational and portfolio purposes.

---

<p align="center">
  Built with ❤️ using React Native + Node.js + MySQL + Razorpay
</p>
