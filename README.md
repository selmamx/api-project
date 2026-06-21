# api-project

A backend API for an internal employee portal, built with Node.js, Express.js, and
PostgreSQL. Includes JWT-based authentication and modules for tickets,
leave requests, and announcements.

## Features
- User authentication (signup/login/logout) with JWT in httpOnly cookies
- Password hashing with bcrypt
- Ticket management
- Leave request system
- Company announcements
- Parameterized SQL queries (SQL injection protection)

## Tech Stack
- Node.js / Express
- PostgreSQL
- JWT (jsonwebtoken)
- bcrypt

## Getting Started

```bash
git clone https://github.com/selmamx/api-project.git
cd api-project
npm install
cp .env.example .env
npm run dev
```

## Project Structure

```
src/
├── config/        # database connection
├── controllers/   # business logic for auth, tickets, leave, announcements
├── middleware/    # JWT verification
├── routes/        # API endpoint definitions
└── utils/         # helper functions (e.g. token generation)
```

## License
MIT

