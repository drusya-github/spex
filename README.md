# SPEX API

## Repository Link

https://github.com/drusya-github/SPEX

---

## Overview

SPEX API is a REST API built with Node.js, Express, TypeScript, and PostgreSQL. It implements JWT-based authentication and authenticated resource management as part of an interview take-home assignment focused on code structure, validation, authentication correctness, and security awareness.

The project is designed around a layered backend architecture with clear separation between routes, controllers, services, models, and middleware, which aligns with the project specification for maintainability and clarity.

---

## Project Goals

This API was built to satisfy the following goals:

- Provide secure user registration and login
- Issue JWTs for authenticated requests
- Allow authenticated users to create resources
- Keep responses structured and consistent
- Validate incoming payloads
- Demonstrate backend security best practices

These goals directly reflect the take-home requirements.

---

## Features

- User registration with email and password
- User login with JWT token generation
- Protected resource creation endpoint
- Protected endpoint to retrieve the authenticated user's resources
- Request validation with structured error responses
- Centralized error handling
- Basic request logging
- Health check endpoint for operational visibility

---

## Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- JSON Web Token (JWT)
- bcrypt
- dotenv

---

## API Endpoints

The take-home spec requires these functional endpoints:

### Health Check

- `GET /health`

Returns a basic status response indicating the API is running.

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`

### Resources

- `POST /api/resources`
- `GET /api/resources`

Both resource routes require a valid Bearer token.

---

## Standard Response Shape

The project specification asks for a consistent JSON response envelope like this:

```json
{
  "success": true,
  "message": "human-readable string",
  "data": {},
  "errors": []
}
```

Typical HTTP status codes expected by the spec include:

| Code | Meaning |
|------|---------|
| `200` | Successful GET requests and login |
| `201` | Successful registration and resource creation |
| `400` | Validation or malformed input |
| `401` | Missing or invalid authentication |
| `404` | Unknown routes |
| `409` | Duplicate registration attempts |
| `500` | Unexpected server errors |

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/drusya-github/SPEX.git
cd SPEX
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root.

Example:

```env
PORT=3000
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_very_long_random_secret_here
JWT_EXPIRES_IN=1h
NODE_ENV=development
```

### 4. Set up the database

Run the schema file against PostgreSQL:

```bash
psql "$DATABASE_URL" -f schema.sql
```


### 5. Start the development server

```bash
npm run dev
```

The API should now be running at:

```
http://localhost:3000
```

The recommended local workflow is: install dependencies, configure `.env`, run migrations, start the dev server, and test endpoints using curl or Postman.

---

## Example Requests

### Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Password123"}'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Password123"}'
```

### Create Resource

```bash
curl -X POST http://localhost:3000/api/resources \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"My first resource","description":"Optional description"}'
```

### List Resources

```bash
curl -X GET http://localhost:3000/api/resources \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Architecture Decisions

### Layered Architecture

The project follows a layered architecture in which:

- **Routes** map endpoints to handlers
- **Controllers** handle request and response logic
- **Services** contain business rules and authentication logic
- **Models** interact with PostgreSQL
- **Middleware** handles authentication, logging, not found handling, and centralized error handling

This structure was chosen because it improves separation of concerns, readability, and maintainability, and it matches the architecture proposed in the assignment specification.

### TypeScript

TypeScript improves correctness, code clarity, and developer experience through static typing, especially in request handling, middleware, and service logic.

### PostgreSQL

PostgreSQL was used as the persistence layer because it is a reliable relational database that fits well for structured user and resource data. The project spec explicitly calls for PostgreSQL, with Supabase allowed as an option.

### JWT Authentication

JWT was used for stateless authentication. After a successful login, the API returns a signed token that the client sends as a Bearer token for protected routes.

### Centralized Error Handling

A shared error-handling flow keeps responses consistent and avoids duplicating error response logic in every controller.

### Request Validation

The spec emphasizes validation on all incoming request payloads, and this project is structured to validate inputs before business logic and persistence.

---

## Security Considerations

Security awareness is one of the explicit evaluation areas in the project brief.

### Password Hashing

Passwords are hashed before storage and never returned in API responses. The specification explicitly requires that plaintext passwords are never exposed and recommends bcrypt for secure password storage.

### Minimal Token Payload

The JWT payload should remain minimal. The specification recommends including only `userId` and avoiding sensitive data.

### Protected Routes

Protected routes require a Bearer token, and authentication middleware rejects invalid or missing tokens with a `401 Unauthorized` response.

### Data Isolation

Resources should always be scoped to the authenticated user so users cannot read or write other users' data. This is a key security requirement in the project specification.

### Validation and Error Exposure

Malformed input and invalid request bodies should be rejected with `400` responses. Internal server errors should not expose stack traces or sensitive implementation details to clients.

### Parameterized Queries

Database access should use parameterized SQL queries to reduce SQL injection risk. The specification explicitly calls this out as a requirement.

### Secrets Management

Environment files should be excluded from version control. A committed `.env.example` file is the safer pattern for documenting required configuration.

---

## What I Would Improve

If I had more time, I would make the following improvements:

### 1. Add Automated Tests

Add unit and integration tests for:

- Registration and login flows
- Auth middleware behavior
- Validation failures
- Protected resource creation
- Authenticated resource listing
- Error handling behavior

### 2. Strengthen Validation

Use a dedicated validation library consistently across all request bodies for cleaner schema reuse and stronger field-level error reporting.

### 3. Add Refresh Tokens

Introduce refresh token rotation and token revocation to improve session management and reduce the impact of token leakage.

### 4. Add Rate Limiting

Apply rate limiting to authentication endpoints to reduce brute-force risk.


### 5. Add Pagination and Filtering

The resource listing endpoint could be improved with pagination, sorting, and filtering for better scalability and query clarity.

### 6. Improve Logging and Observability

Add structured logging, monitoring, and request tracing for better debugging and production support.

### 7. Add Roles or Authorization Extensions

If the project grew, role-based access control would make the authorization layer more flexible.

---

## Notes for Reviewers

This project was built to emphasize the evaluation focus areas listed in the assignment:

- Structure
- Validation
- Authentication correctness
- Security awareness
- Query clarity

The implementation centers on clean separation of concerns, clear endpoint behavior, secure authentication, and predictable JSON responses.

---

## Submission Checklist

- [x] GitHub repository link included
- [x] Setup instructions included
- [x] Architecture decisions included
- [x] Security considerations included
- [x] Improvements section included
