# Book Swap API

A modular RESTful API for a Book Swap platform built with Express.js, MongoDB, and JWT authentication, supporting user auth, book listings, and swap request management with centralized error handling and request validation.

---

## Features

- Modular architecture (auth / users / books / swaps)
- JWT authentication with bcrypt password hashing
- Request validation via Joi
- NoSQL injection prevention (`express-mongo-sanitize`)
- XSS protection (`xss-clean`)
- Security headers (`helmet`)
- Rate limiting (`express-rate-limit`)
- Centralized error handling with consistent JSON responses
- Proper HTTP status codes

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Maham38/Book_Swap.git
cd Book_Swap

# 2. Install dependencies
npm install

# 3. Copy and configure environment variables
cp .env.example .env
# Edit .env with your values

# 4. Start the server
npm start          # production
npm run dev        # development (nodemon)
```

### Environment Variables

| Variable       | Description                          | Default                                  |
|----------------|--------------------------------------|------------------------------------------|
| `PORT`         | Server port                          | `5000`                                   |
| `MONGODB_URI`  | MongoDB connection string            | `mongodb://localhost:27017/book_swap`    |
| `JWT_SECRET`   | Secret key for JWT signing           | *(required)*                             |
| `JWT_EXPIRES_IN` | JWT token expiry                   | `7d`                                     |
| `CORS_ORIGIN`  | Allowed CORS origin                  | `*`                                      |
| `NODE_ENV`     | Environment (`development`/`production`) | `development`                        |

---

## API Endpoints

Base URL: `/api/v1`

### Auth

| Method | Endpoint            | Auth | Description               |
|--------|---------------------|------|---------------------------|
| POST   | `/auth/register`    | No   | Register a new user        |
| POST   | `/auth/login`       | No   | Login and receive a token  |
| GET    | `/auth/me`          | Yes  | Get current user info      |

### Users

| Method | Endpoint      | Auth | Description               |
|--------|---------------|------|---------------------------|
| GET    | `/users/me`   | Yes  | Get current user profile  |
| PATCH  | `/users/me`   | Yes  | Update current user profile |

### Books

| Method | Endpoint      | Auth      | Description                                       |
|--------|---------------|-----------|---------------------------------------------------|
| GET    | `/books`      | No        | List/search books (search, filter, sort, paginate) |
| GET    | `/books/:id`  | No        | Get a specific book                               |
| POST   | `/books`      | Yes       | Create a book listing                             |
| PATCH  | `/books/:id`  | Yes+Owner | Update a book listing                             |
| DELETE | `/books/:id`  | Yes+Owner | Delete a book listing                             |

**Query parameters for `GET /books`:**

| Param      | Type   | Description                                              |
|------------|--------|----------------------------------------------------------|
| `search`   | string | Full-text search on title, author, category              |
| `category` | string | Filter by category                                       |
| `condition`| string | `new`, `like new`, `good`, `fair`, `poor`               |
| `status`   | string | `available`, `reserved`, `swapped`                      |
| `owner`    | string | Filter by owner ID                                       |
| `sortBy`   | string | `createdAt` (default), `title`, `author`                |
| `order`    | string | `desc` (default), `asc`                                 |
| `page`     | number | Page number (default: 1)                                 |
| `limit`    | number | Results per page (default: 20, max: 100)                |

### Swaps

| Method | Endpoint                  | Auth | Description                                             |
|--------|---------------------------|------|---------------------------------------------------------|
| POST   | `/swaps`                  | Yes  | Create a swap request                                   |
| GET    | `/swaps/incoming`         | Yes  | List incoming swap requests (for your books)            |
| GET    | `/swaps/outgoing`         | Yes  | List your outgoing swap requests                        |
| GET    | `/swaps/:id`              | Yes+Participant | Get a specific swap                        |
| PATCH  | `/swaps/:id/accept`       | Yes+BookOwner  | Accept a pending swap request              |
| PATCH  | `/swaps/:id/reject`       | Yes+BookOwner  | Reject a pending swap request              |
| PATCH  | `/swaps/:id/complete`     | Yes+Participant | Mark swap as completed (must be accepted) |
| PATCH  | `/swaps/:id/cancel`       | Yes+Participant | Cancel a pending or accepted swap         |

---

## Response Format

All responses follow a consistent format:

**Success:**
```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "...",
  "errors": ["..."]
}
```

---

## Team Division / Contribution Guide

This project is divided between 2 partners for collaborative development:

### **Collaborator 1: Authentication & User Management**

**Responsible for:**
- User authentication (register, login)
- User profile management
- JWT-based authorization middleware
- Request validation setup

**File Structure for Collaborator 1**
```
src/modules/auth/
├── auth.controller.js
├── auth.routes.js
├── auth.service.js
└── auth.validation.js

src/modules/users/
├── user.controller.js
├── user.model.js
├── user.routes.js
├── user.service.js
└── user.validation.js

src/middlewares/
├── auth.js
└── validate.js

src/utils/
├── ApiError.js
└── catchAsync.js

src/config/
├── env.js
└── db.js
```

### **Student 2: Books & Swaps (Core Business Logic)**

**Responsible for:**
- Book management (CRUD operations)
- Book search and filtering
- Swap/exchange operations
- Error handling and response formatting

**File Structure for Collaborator 2**
```
src/modules/books/
├── book.controller.js
├── book.model.js
├── book.routes.js
├── book.service.js
└── book.validation.js

src/modules/swaps/
├── swap.controller.js
├── swap.model.js
├── swap.routes.js
├── swap.service.js
└── swap.validation.js

src/middlewares/
├── errorHandler.js
├── notFound.js
└── xssSanitize.js

src/utils/
├── pick.js
└── sendResponse.js
```

## Complete Project Structure

```
src/
├── app.js                    # Express app setup
├── server.js                 # Entry point (connect DB + listen)
├── config/
│   ├── db.js                 # MongoDB connection
│   └── env.js                # Environment config
├── middlewares/
│   ├── auth.js               # JWT authentication
│   ├── errorHandler.js       # Centralized error handler
│   ├── notFound.js           # 404 handler
│   └── validate.js           # Joi validation middleware
├── modules/
│   ├── auth/                 # Auth routes, controller, service, validation
│   ├── users/                # User model, routes, controller, service, validation
│   ├── books/                # Book model, routes, controller, service, validation
│   └── swaps/                # Swap model, routes, controller, service, validation
└── utils/
    ├── ApiError.js           # Custom error class
    ├── catchAsync.js         # Async error wrapper
    ├── pick.js               # Object key picker
    └── sendResponse.js       # Consistent response helper
```

## Authors
Saira Ahmed
Maham Maryam
