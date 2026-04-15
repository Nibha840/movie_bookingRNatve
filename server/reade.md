Base URL
http://localhost:5000
Make sure the server is running: cd server && npm run dev or npm start.
All APIs
1. Register user
POST http://localhost:5000/api/auth/register
Headers:
Content-Type: application/json
Body (raw JSON):
{  "name": "John Doe",  "email": "john@example.com",  "password": "password123",  "role": "user"}
role is optional (default: "user"). Use "admin" for admin.
2. Login
POST http://localhost:5000/api/auth/login
Headers:
Content-Type: application/json
Body (raw JSON):
{  "email": "john@example.com",  "password": "password123"}
Response example:
{  "message": "Login successful",  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  "user": {    "id": 1,    "name": "John Doe",    "role": "user"  }}
Copy the token for other APIs (if you add auth middleware later).
3. Get all movies
GET http://localhost:5000/api/movies
No body needed. Returns all movies.
Response example:
[  {    "id": 1,    "title": "Inception",    "description": "A mind-bending thriller",    "poster_url": "https://...",    "genre": "Sci-Fi"  }]
4. Add movie (Admin)
POST http://localhost:5000/api/movies
Headers:
Content-Type: application/json
Body (raw JSON):
{  "title": "Inception",  "description": "A mind-bending thriller",  "poster_url": "https://example.com/poster.jpg",  "genre": "Sci-Fi"}
5. Process payment (mock UPI)
POST http://localhost:5000/api/payment/process
Headers:
Content-Type: application/json
Body (raw JSON):
{  "upiId": "user@paytm",  "amount": 350}
Use upiId: "fail@upi" to simulate payment failure.
Response comes after ~2 seconds.
Response example:
{  "success": true,  "message": "Payment Successful",  "transactionId": "UPI-123456789012",  "method": "UPI",  "amount": 350}
6. Create booking
POST http://localhost:5000/api/bookings/book
Headers:
Content-Type: application/json
Body (raw JSON):
{  "userId": 1,  "showtimeId": 1,  "seats": ["A1", "A2"],  "totalPrice": 500,  "userEmail": "john@example.com",  "transactionId": "UPI-123456789012"}
transactionId should match a payment from /api/payment/process.
showtimeId must exist in showtimes table.
userEmail is used for the confirmation email.
7. Get user bookings
GET http://localhost:5000/api/bookings/user/:userId
Example: http://localhost:5000/api/bookings/user/1
Returns all bookings for that user.
Recommended test order
Register: POST /api/auth/register
Login: POST /api/auth/login
Get movies: GET /api/movies
(Optional) Add movie: POST /api/movies
Process payment: POST /api/payment/process
Create booking: POST /api/bookings/book (use userId and transactionId from above)
Get bookings: GET /api/bookings/user/1
/////////////////////////////////

run    npm start



/////////////////
Aapke screenshots aur errors dekh kar pata chal raha hai ki aapke paas 3 alag-alag problems hain. Tension mat lijiye, hum inhe ek-ek karke fix karenge.

Sabse badi problem yeh hai ki aapka MySQL Server band (OFF) hai aur aapka Code run karne ka command galat hai.

Step 1: MySQL Server Start Karein (Sabse Zaruri)
Error Could not connect... Unable to connect to 127.0.0.1:3306 ka matlab hai ki aapka database server chal hi nahi raha hai.

Apne Laptop par Windows Key dabayein aur search karein: "Services".

Services app ko open karein.

List mein niche scroll karke MySQL80 (ya sirf MySQL) dhundein.

Us par Right-Click karein aur Start dabayein.

(Agar wo pehle se "Running" dikha raha hai, toh Restart dabayein).


//////////

Ye steps follow karein:

Main Screen par: Upar menu mein Database par click karein.

List mein se Manage Connections... select karein.

Ab wahi purana box khul jayega.

Us box ke Neeche Right Side (Bottom Right) dekhein, wahan "Test Connection" likha hoga.