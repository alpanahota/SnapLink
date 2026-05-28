# SnapLink Backend

This is the REST API backend for the SnapLink URL shortener service.

## Features
- **URL Shortening**: Shortens URLs using unique `nanoid` codes.
- **Custom Aliases**: Allows optional custom aliases for URLs.
- **Redirection**: Fast 302 redirects to original URLs.
- **Analytics**: Tracks total clicks and last visited timestamps.
- **Expiration**: Optional link expiration dates.
- **Authentication**: JWT and bcrypt based user authentication (register, login, me).
- **Security**: Basic protections using Helmet and CORS.
- **Pagination & Filtering**: Fetch all URLs with pagination, search, sorting, and filtering.

## Technologies Used
- Node.js
- Express
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Joi (Validation)
- nanoid (Short code generation)

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB (Local instance or MongoDB Atlas cluster)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and configure your environment variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/snaplink
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile (Protected)

### URLs
- `POST /api/url/shorten` - Create a short URL (Optional Auth)
- `GET /api/url/all` - Get all URLs (Public)
  - Query params: `page`, `limit`, `sort`, `search`, `isExpired`
- `GET /api/url/analytics/:shortCode` - Get URL analytics
- `DELETE /api/url/:id` - Delete a URL (Protected)

### Redirection
- `GET /:shortCode` - Redirect to original URL
