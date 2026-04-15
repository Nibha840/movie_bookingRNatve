# 🎬 CineBook — Movie Ticket Booking App

A complete **React Native (Expo)** movie ticket booking app with a modern dark cinematic UI.

---

## 📁 Folder Structure

```
MovieBookingApp/
├── App.js                          # Root entry point
├── app.json                        # Expo config
├── package.json
├── babel.config.js
└── src/
    ├── screens/
    │   ├── LoginScreen.js          # Auth: Login
    │   ├── RegisterScreen.js       # Auth: Register
    │   ├── HomeScreen.js           # User: Movie list with search
    │   ├── MovieDetailsScreen.js   # User: Movie details + Book CTA
    │   ├── SeatSelectionScreen.js  # User: Seat grid A1–A10, B1–B10
    │   ├── PaymentScreen.js        # User: UPI payment + spinner
    │   ├── BookingConfirmationScreen.js  # User: Ticket + success
    │   ├── MyBookingsScreen.js     # User: All bookings list
    │   ├── ProfileScreen.js        # User: Profile + logout
    │   ├── AdminDashboardScreen.js # Admin: Stats + quick actions
    │   └── AddMovieScreen.js       # Admin: Add new movie
    ├── components/
    │   └── index.js                # Button, Input, Card, Badge, MovieCard, etc.
    ├── navigation/
    │   ├── RootNavigator.js        # Auth gate
    │   ├── AuthNavigator.js        # Login / Register stack
    │   ├── AppNavigator.js         # Main stack (user + admin)
    │   └── UserTabNavigator.js     # Bottom tabs: Home, Bookings, Profile
    ├── services/
    │   └── api.js                  # Axios client + all API functions
    ├── context/
    │   └── AuthContext.js          # Auth state + AsyncStorage persistence
    └── utils/
        ├── theme.js                # Colors, fonts, spacing, radius, shadows
        └── helpers.js              # formatCurrency, formatDate, generateTransactionId
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
cd MovieBookingApp
npm install
```

### 2. Set your backend URL

Edit `src/services/api.js`:
```js
const BASE_URL = 'http://localhost:5000'; // ← change to your server IP/URL
```

> **Note:** On Android emulator use `http://10.0.2.2:5000`. On a physical device, use your machine's local IP (e.g. `http://192.168.1.x:5000`).

### 3. Start the app

```bash
npx expo start
```

Then press:
- `a` for Android emulator
- `i` for iOS simulator
- Scan QR code with Expo Go app on your device

---

## 🔌 API Endpoints Used

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login, returns token |
| GET | `/api/movies` | Get all movies |
| POST | `/api/movies` | Add a movie (admin) |
| POST | `/api/payment/process` | Process UPI payment |
| POST | `/api/bookings/book` | Create a booking |
| GET | `/api/bookings/user/:userId` | Get user's bookings |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#0A0A0F` |
| Surface | `#12121A` |
| Card | `#1A1A26` |
| Primary (Red) | `#E50914` |
| Accent (Gold) | `#F5A623` |
| Success (Green) | `#00C896` |
| Text | `#FFFFFF` |

---

## ✨ Features

### User
- 🔐 Register & Login with role detection
- 🏠 Home screen with movie grid + search
- 🎬 Movie details with poster, genre, synopsis
- 💺 Seat selection (A1–A10, B1–B10 grid), multi-select, ₹250/seat
- 💳 UPI payment with 2-second processing animation
- 🎟️ Beautiful ticket confirmation screen
- 📋 My Bookings with transaction IDs and dates
- 👤 Profile with stats + logout

### Admin
- 🛡️ Admin Dashboard with stats
- ➕ Add Movie with genre picker
- 🎬 View all movies

### Technical
- ✅ Token persistence via AsyncStorage
- ✅ Protected routes (auth gate)
- ✅ Axios interceptors for auth headers
- ✅ Pull-to-refresh on lists
- ✅ Loading spinners & error states
- ✅ Form validation
- ✅ Keyboard-avoiding views
- ✅ Safe area handling

---

## 📱 Navigation Flow

```
Auth Gate
├── Not Logged In → AuthNavigator
│   ├── LoginScreen
│   └── RegisterScreen
│
└── Logged In
    ├── User → AppNavigator
    │   ├── Tabs: Home | MyBookings | Profile
    │   └── Stack: MovieDetails → SeatSelection → Payment → BookingConfirmation
    │
    └── Admin → AppNavigator
        ├── AdminDashboard
        └── AddMovie
```

---

## 🧩 Dependencies

```json
{
  "@react-native-async-storage/async-storage": "1.21.0",
  "@react-navigation/bottom-tabs": "^6.5.20",
  "@react-navigation/native": "^6.1.17",
  "@react-navigation/native-stack": "^6.9.26",
  "axios": "^1.6.8",
  "expo": "~50.0.14",
  "expo-linear-gradient": "~12.7.2",
  "expo-status-bar": "~1.11.1",
  "react-native-safe-area-context": "4.8.2",
  "react-native-screens": "~3.29.0"
}
```

---

## 🔧 Customization

### Change Seat Price
In `src/utils/helpers.js`:
```js
export const PRICE_PER_SEAT = 250; // ← change this
```

### Add More Seat Rows
In `src/screens/SeatSelectionScreen.js`:
```js
const ROWS = ['A', 'B', 'C', 'D']; // ← add rows here
```

### Change API Base URL
In `src/services/api.js`:
```js
const BASE_URL = 'https://your-api.com'; // ← your backend
```

---

## 📝 Notes

- The app gracefully handles API failures on the Booking Confirmation screen — it shows success even if the booking API is down, using local data.
- Pre-booked seats (A3, A7, B2, B5, B9) are hardcoded for demo; integrate with your showtime API to make these dynamic.
- Ratings and show times on the detail/seat screens are placeholder values; wire them up to your showtimes API.
