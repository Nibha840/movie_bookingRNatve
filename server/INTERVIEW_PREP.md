# Movie Reservation System — Interview Preparation Guide

> **Brutally honest guide based on YOUR actual codebase**

---

## Table of Contents
1. [Project Understanding](#1-project-understanding)
2. [Tech Stack Q&A](#2-tech-stack-questions)
3. [System Design](#3-system-design)
4. [Live Demo Q&A](#4-live-demo-questions)
5. [Coding Questions](#5-coding-questions)
6. [Behavioral Questions](#6-behavioral--project-questions)
7. [Security](#7-security)
8. [Deployment](#8-deployment)
9. [Top 20 Questions Cheat Sheet](#9-final-interview-cheat-sheet)

---

## 1. Project Understanding

### What problem does this project solve?

*"Movie theatres need users to browse movies, pay, and reserve seats online instead of standing in queues. This API lets users register, see movies, simulate UPI payment, and receive booking confirmations via email."*

### Who are the users?

- **End Users** — Browse movies, pay, book seats
- **Admins** — Add new movies (commented as "Admin Only" but **no auth check** in code)

### Main Workflow

```
Register → Login (get JWT) → Browse Movies → Process Payment → Create Booking → Email Confirmation
```

### Core Features

| Feature | Status | How It Works (Your Code) |
|--------|--------|--------------------------|
| User Registration | ✅ | bcrypt hash (10 rounds) + INSERT into `users` |
| Login + JWT | ✅ | Compare password → `jwt.sign({id, role})` → return token |
| List Movies | ✅ | `SELECT * FROM movies` |
| Add Movie | ✅ | Anyone can POST — no admin check |
| UPI Payment Simulation | ✅ | `fail@upi` = failure, else fake transactionId + 2s delay |
| Create Booking | ✅ | INSERT into `bookings` + `sendEmail()` (fire-and-forget) |
| Get User Bookings | ✅ | `SELECT * FROM bookings WHERE user_id = ?` — no auth |

### Architecture

| Layer | Technology | Status |
|-------|------------|--------|
| **Frontend** | None | API-only project |
| **Backend** | Node.js + Express 5 | ✅ |
| **Database** | MySQL (mysql2) | ✅ |

### Data Flow (Text Diagram)

```
┌─────────────┐     HTTP/JSON      ┌──────────────┐
│  Postman /  │ ─────────────────► │   Express    │
│  Client     │                    │   index.js   │
└─────────────┘                    └──────┬───────┘
       ▲                                  │
       │         JSON Response            │  express.json() + cors
       └──────────────────────────────────┤
                                          │
         ┌────────────────────────────────┼────────────────────────────────┐
         ▼                                ▼                                ▼
  ┌──────────────┐                ┌──────────────┐                ┌──────────────┐
  │ authRoutes   │                │ movieRoutes  │                │bookingRoutes │
  │ paymentRoutes│                └──────┬───────┘                └──────┬───────┘
  └──────┬───────┘                       │                               │
         │                               └───────────────┬───────────────┘
         ▼                                               ▼
  ┌──────────────┐                               ┌──────────────┐
  │ Controllers  │ ─────────────────────────────►│  MySQL DB    │
  │ (auth,movie, │                               │  + Nodemailer│
  │  booking,    │                               └──────────────┘
  │  payment)    │
  └──────────────┘
```

### Folder Structure

```
movie-reservation-system/
├── .gitignore
├── server/
│   ├── index.js              # Entry point — Express app, middleware, routes
│   ├── package.json          # Dependencies: express, mysql2, bcryptjs, jwt, nodemailer
│   ├── config/
│   │   └── db.js             # mysql.createConnection() — single connection
│   ├── controllers/
│   │   ├── authController.js # register, login (bcrypt + jwt)
│   │   ├── movieController.js# getAllMovies, createMovie
│   │   ├── bookingController.js # createBooking, getUserBookings
│   │   └── paymentController.js # processPayment (mock UPI)
│   ├── routes/
│   │   ├── authRoutes.js     # POST /register, /login
│   │   ├── movieRoutes.js    # GET /, POST /
│   │   ├── bookingRoutes.js  # POST /book, GET /user/:userId
│   │   └── paymentRoutes.js  # POST /process
│   └── utils/
│       └── emailService.js   # nodemailer + Gmail, tls.rejectUnauthorized: false
```

"This is a mock UPI payment controller. It validates UPI IDs, simulates success/failure, generates a fake transaction ID, and mimics network delay. I avoided real payment integration because that requires linking bank accounts and incurs platform charges. For demo purposes, this mock setup is safer, faster, and sufficient to test the booking flow."

### Important Files & Logic

| File | Key Logic |
|------|-----------|
| `index.js` | `express.json()`, `cors()`, mounts routes under `/api/*` |
| `db.js` | `mysql.createConnection()` — connects once at startup |
| `authController.js` | `bcrypt.hash(password, 10)`, `jwt.sign({id, role})`, parameterized queries |
| `bookingController.js` | Validates `userId, showtimeId, seats, totalPrice, transactionId` → INSERT → `sendEmail()` (no await) |
| `paymentController.js` | Validates UPI format, `fail@upi` = fail, else `setTimeout` 2s → return fake transactionId |
| `emailService.js` | Gmail transport, `rejectUnauthorized: false` |

### Demo Script (2 minutes)

> *"I'll walk you through the flow. First, I register a user — POST to `/api/auth/register` with name, email, password. Then login — POST to `/api/auth/login` — and we get a JWT back. Next, I fetch movies — GET `/api/movies`. For payment, I POST to `/api/payment/process` with UPI ID and amount — it simulates a 2-second delay and returns a transaction ID. I use that in the booking — POST to `/api/bookings/book` with userId, showtimeId, seats, totalPrice, and the transactionId. The server saves the booking and sends a confirmation email. Finally, GET `/api/bookings/user/1` shows that user's bookings. Auth uses bcrypt for passwords and JWT for sessions."*

---

## 2. Tech Stack Questions

### Frontend

| Question | Your Project | Answer |
|----------|--------------|--------|
| Framework/library | None | *"Backend-only API. A frontend would use React/Vue/Next.js and call these REST endpoints."* |
| Component structure | N/A | *"Would use components for Auth, MovieList, BookingForm, PaymentForm."* |
| State management | N/A | *"Would use React Context or Redux for auth state and booking flow."* |
| Forms | N/A | *"Controlled components with validation. Server-side validation with express-validator."* |
| API integration | N/A | *"Axios/fetch to `http://localhost:5000/api/*` with `Authorization: Bearer <token>`."* |
| Performance | N/A | *"Lazy loading, memo, code splitting for frontend."* |
| Error handling | N/A | *"Try-catch, error boundaries, toast/alert for API errors."* |

### Backend

| Question | Your Code | Answer |
|----------|-----------|--------|
| **API design** | REST, prefixed `/api` | *"RESTful. Auth under `/api/auth`, resources under `/api/movies`, `/api/bookings`, `/api/payment`."* |
| **Controllers/Services** | Controllers only, no service layer | *"Controllers handle request/response and DB directly. Could add service layer for business logic."* |
| **Authentication** | JWT on login | *"Login returns JWT with `{id, role}`. Token is not validated on any route currently."* |
| **Authorization** | None | *"No middleware checks JWT or role. Add-on needed for admin-only routes."* |
| **Middleware** | `express.json()`, `cors()` | *"Global JSON parser and CORS. No custom auth middleware."* |
| **Exception handling** | Minimal | *"Most controllers rely on DB callback `err`. Register has try-catch. No global error handler."* |
| **Pagination** | None | *"`getAllMovies` returns all. Add `LIMIT/OFFSET` or cursor-based for production."* |
| **Validation** | Manual in controllers | *"Basic checks like `!userId \|\| !showtimeId`. No schema validation (express-validator/Joi)."* |

### Database

| Question | Your Design | Answer |
|----------|-------------|--------|
| **Schema** | Inferred from queries | `users` (id, name, email, password, role), `movies`, `showtimes`, `bookings` |
| **Relationships** | FKs implied | `bookings.user_id` → users, `bookings.showtime_id` → showtimes |
| **Indexing** | Not defined in code | *"Would add index on `users.email`, `bookings.user_id`, `bookings.showtime_id`."* |
| **Normalization** | Yes | Separate tables, no redundant user/movie data in bookings |
| **Queries** | Parameterized | All use `?` placeholders — SQL injection protected |
| **Transactions** | None | *"Booking insert is single query. Would use transactions for payment + seat lock."* |

---

## 3. System Design

### High-Level Architecture

```
                    ┌─────────────┐
                    │   Client    │  (Postman / Frontend)
                    └──────┬──────┘
                           │ HTTP/JSON
                    ┌──────▼──────┐
                    │  Express    │  Port 5000
                    │  Server     │
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
   ┌──────────┐     ┌──────────┐     ┌──────────┐
   │  MySQL   │     │ Nodemailer│     │  .env    │
   │ movie_db │     │  Gmail    │     │ secrets  │
   └──────────┘     └──────────┘     └──────────┘
```

### Scaling to 10k Users

| Current | Scaling Approach |
|---------|------------------|
| Single Node process | Multiple instances behind load balancer |
| Single DB connection | `mysql2.createPool()` + read replicas |
| No caching | Redis for movies, sessions |
| Email in request | Queue (Bull/BullMQ) — async worker |
| No CDN | CDN for poster images |

### Performance Improvements

| Issue | Fix |
|-------|-----|
| `SELECT *` | Select only needed columns |
| No pagination | `LIMIT`, `OFFSET` or cursor |
| Single connection | Connection pool |
| Email blocks response | Queue + background worker |
| No caching | Redis cache for movie list |

### Caching Strategy

- **Movies**: Cache 5–10 min, invalidate on create/update
- **User bookings**: Short TTL or cache per user
- **Auth**: JWT stateless; optional Redis for refresh tokens

### Deployment Architecture

```
[GitHub] → CI/CD → [Build] → [Deploy to Railway/Render/AWS]
                              │
                              ├── Node.js (PM2)
                              ├── MySQL (RDS/PlanetScale)
                              └── Env vars from secrets
```

### CI/CD

| Step | Tool | Status |
|------|------|--------|
| Lint | ESLint | Not configured |
| Test | Jest | `npm test` exits 1 |
| Build | N/A | No frontend build |
| Deploy | Manual | No pipeline |

**Suggested**: GitHub Actions — lint → test → deploy to Railway/Render

---

## 4. Live Demo Questions

| Question | Exact Answer (Based on Your Code) |
|----------|-----------------------------------|
| **Why did you build this?** | *"To practice full-stack flow: auth, CRUD, payment simulation, email, DB integration."* |
| **Walk me through login** | *"POST body has email and password. We `SELECT * FROM users WHERE email = ?`, then `bcrypt.compare(password, user.password)`. If match, `jwt.sign({id, role})` with `JWT_SECRET` and `JWT_EXPIRES_IN`, return token and user object."* |
| **What happens when user creates a booking?** | *"Controller validates userId, showtimeId, seats, totalPrice, transactionId. Converts seats array to comma string, INSERT into bookings, calls sendEmail without await, returns bookingId."* |
| **How is API called?** | *"REST over HTTP. JSON body. Auth endpoints return JWT. Other endpoints would use `Authorization: Bearer <token>` — but we don't verify it yet."* |
| **Where is data stored?** | *"MySQL: users, movies, showtimes, bookings. Passwords hashed with bcrypt. JWT is stateless."* |
| **Edge cases?** | *"Payment fails with `fail@upi`. Duplicate email on register. Invalid showtimeId. Missing fields return 400."* |
| **Failure scenarios?** | *"DB down → connection error. Email fails → booking still succeeds (fire-and-forget). JWT_SECRET missing → possible crash."* |
| **Security risks?** | *"No auth on routes. Anyone can add movies or view any user's bookings. Need JWT middleware."* |

---

## 5. Coding Questions

### CRUD Operations

| Resource | Create | Read | Update | Delete |
|----------|--------|------|--------|--------|
| Users | POST /register | — | — | — |
| Movies | POST /movies | GET /movies | ❌ | ❌ |
| Bookings | POST /bookings/book | GET /user/:userId | ❌ | ❌ |

**Possible questions**: Add GET movie by ID, UPDATE booking, DELETE movie (admin).

### REST APIs

- Use proper status codes: 200, 201, 400, 401, 404, 500
- Consistent response shape: `{ success, data?, error? }`
- Nouns for resources, HTTP verbs for actions

### DSA Used

- `seats.join(',')` — array to string
- Random transaction ID generation
- No complex data structures; DB does the heavy lifting

### Refactoring Suggestions

1. Add JWT verification middleware
2. Add global error handler
3. Use connection pool instead of single connection
4. Add express-validator for input validation
5. Move nodemon to devDependencies

---

## 6. Behavioral + Project Questions

| Question | Suggested Answer |
|----------|------------------|
| **Biggest challenge** | *"Integrating payment simulation with booking flow and email. Decided to return transactionId from payment and pass it to booking."* |
| **Bugs faced** | *"Email failing. Gmail was blocking — fixed with App Password and TLS config."* |
| **How you debugged** | *"console.error in catch blocks, Postman for API testing, checked DB directly."* |
| **What you'd improve** | *"Add auth middleware, input validation, transactions for booking, schema.sql file."* |
| **Team contribution** | *"Solo project. Would apply same structure in a team — controllers, routes, config."* |
| **Deadline handling** | *"Prioritized core flow first: auth → movies → payment → booking, then email."* |

---

## 7. Security

| Topic | Your Code | Status |
|-------|-----------|--------|
| **SQL Injection** | Parameterized queries (`?`) | ✅ Protected |
| **XSS** | JSON API, no HTML rendering | ✅ N/A |
| **CSRF** | No cookies, stateless | ✅ N/A |
| **Auth vulnerabilities** | JWT not enforced on routes | ⚠️ Critical |
| **Password hashing** | bcrypt, 10 rounds | ✅ Good |
| **JWT/Session** | JWT with id, role, expiresIn | ✅ Good |
| **Role-based access** | `role` in user, never checked | ⚠️ Missing |
| **tls.rejectUnauthorized** | Set to `false` in email | ⚠️ Risk |

### Improvements

- Add JWT verify middleware; protect booking/movie routes
- Check `role === 'admin'` for create movie
- Set `tls.rejectUnauthorized: true` for production
- Add rate limiting (express-rate-limit)
- Validate/sanitize all inputs

---

## 8. Deployment

| Topic | Your Project |
|-------|--------------|
| **How deployed** | Local only; no deploy config |
| **Environment variables** | `.env`: JWT_SECRET, JWT_EXPIRES_IN, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, EMAIL_USER, EMAIL_PASS |
| **Production build** | `npm start` → `node index.js` |
| **Docker** | Not implemented |

### Suggested Dockerfile

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "index.js"]
```

---

## 9. Final Interview Cheat Sheet

### Top 20 Questions — Short Answers

| # | Question | One-Line Answer |
|---|----------|-----------------|
| 1 | What does this project do? | Movie ticket booking API with auth, payment simulation, email |
| 2 | Tech stack? | Node, Express 5, MySQL, JWT, bcrypt, Nodemailer |
| 3 | How does auth work? | Register hashes password; login returns JWT with id, role |
| 4 | SQL injection? | Parameterized queries with `?` |
| 5 | How are passwords stored? | bcrypt hash, 10 salt rounds |
| 6 | Why JWT? | Stateless; no session store |
| 7 | What is CORS? | Allows frontend on different origin to call API |
| 8 | Single MySQL connection? | Demo only; use pool in production |
| 9 | Payment failure? | `fail@upi` simulates; frontend should not proceed to booking |
| 10 | 2-second delay in payment? | Simulates real payment gateway processing |
| 11 | How does email work? | Nodemailer with Gmail; fires after booking (no await) |
| 12 | Email fails? | Booking still succeeds; fire-and-forget |
| 13 | Transactions? | None; would add for booking + seat lock |
| 14 | Admin-only route? | Add middleware: verify JWT, check role === 'admin' |
| 15 | Express 5? | Requires Node 18+; better promise handling |
| 16 | Scale to 10k? | Multiple instances, pool, Redis, queue |
| 17 | Frontend? | None; API-only |
| 18 | Showtimes? | Referenced in bookings; no showtimes API yet |
| 19 | Main security risk? | No auth on protected routes |
| 20 | What would you improve? | Auth middleware, validation, transactions, pagination |

### Red Flags to Avoid

1. ❌ Saying "we use JWT for security" without mentioning it's not enforced
2. ❌ Claiming "admin-only" for add movie when there's no check
3. ❌ Saying you use transactions when you don't
4. ❌ Not knowing your schema (users, movies, showtimes, bookings)
5. ❌ Saying it's production-ready as-is
6. ❌ Can't explain `seats.join(',')` or booking flow
7. ❌ Not knowing getUserBookings has no auth
8. ❌ Not knowing what `rejectUnauthorized: false` does

### Honest Summary

**Strengths**: Clean structure, parameterized queries, bcrypt, JWT, modular controllers  
**Weaknesses**: No auth middleware, no role check, no validation library, no transactions  
**Fix first**: JWT verification + role-based protection on sensitive routes

---

*Good luck with your interview.*
