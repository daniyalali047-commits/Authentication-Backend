# Authentication Backend

Simple Express backend for user signup, email verification, login, and JWT auth.

## Run
```bash
npm install
npm run dev
```

Server runs at:
```bash
http://localhost:3000
```

## Environment
Create a `.env` file:

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
GOOGLE_USER=your_email
```

## Main Routes

### Register
```http
POST /api/auth/register
```
Body:
```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "123456"
}
```

### Verify Email
```http
POST /api/auth/verify-email
```
Body:
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

### Login
```http
POST /api/auth/login
```
Body:
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

### Get Current User
```http
GET /api/auth/get-me
```
Header:
```http
Authorization: Bearer <access_token>
```

### Refresh Token
```http
GET /api/auth/refresh-token
```

### Logout
```http
GET /api/auth/logout
```

### Logout All Devices
```http
GET /api/auth/logout-all
```

## Notes
- User must verify email before login.
- OTP is sent by email during registration.
- Access token is used for protected routes.
- Refresh token is handled through cookies.
