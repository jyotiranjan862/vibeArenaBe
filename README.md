# VibeArena - Backend API

Production-ready, highly scalable, and optimized backend engine for **VibeArena**, an enterprise real-time chat and collaboration platform. Built with **Node.js**, **Express 5**, **TypeScript**, and **MongoDB (Mongoose)**, following clean architecture, strict modularity, and high-performance patterns.

---

## 🚀 Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/) (LTS)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Framework**: [Express 5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose 9](https://mongoosejs.com/)
- **Validation**: [Zod](https://zod.dev/) (Centralized, strict schema validation)
- **Logging**: [Pino](https://getpino.io/) & [Pino-HTTP](https://github.com/pinojs/pino-http) (High-performance JSON logger)
- **Security & Compression**: [Helmet](https://helmetjs.github.io/), [CORS](https://github.com/expressjs/cors), [Compression](https://github.com/expressjs/compression), [Express-Rate-Limit](https://github.com/express-rate-limit/express-rate-limit)
- **Development Tooling**: [tsx](https://github.com/privatenumber/tsx) (Zero-overhead TypeScript executor)

---

## 🏛️ Architectural Highlights

- **Modular Domain Design**: Modules encapsulate routes, controllers, services, repositories, schemas, and models.
- **Repository Pattern**: Strict decoupling of database queries from business rules.
- **Zero Business Logic in Controllers**: Controllers handle solely HTTP serialization/deserialization; services encapsulate pure domain logic.
- **Centralized Validation**: Zero unvalidated client input passes into the domain layer (`validateRequest` middleware using Zod).
- **Graceful Shutdown**: Safe termination handling `SIGINT`/`SIGTERM` with clean database disconnection and pending request flushing.

---

## 📂 Project Structure

```
vibeareana/
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── ARCHITECTURE.md           # In-depth architectural blueprint
├── package.json              # Project dependencies and lifecycle scripts
├── tsconfig.json             # TypeScript compiler configuration
└── src/
    ├── app.ts                # Express application configuration & middleware chain
    ├── server.ts             # Process entrypoint & graceful shutdown
    ├── config/               # Typed environment variables validation
    ├── constants/            # Global status codes, enums, and event names
    ├── database/             # MongoDB connection manager (Singleton)
    ├── errors/               # Custom AppError hierarchy
    ├── middlewares/          # Global middlewares (validation, auth, error handler)
    ├── utils/                # Logging (Pino) & standardized API responses
    └── modules/              # Domain modules
        ├── auth/             # Authentication & session token management
        ├── user/             # User profiles, search, and presence
        ├── chat/             # Direct chats, group rooms, and participant management
        ├── message/          # Real-time messages, pagination, read receipts
        └── socket/           # Real-time WebSocket / Socket gateway
```

---

## ⚡ Getting Started

### 1. Prerequisites
- Node.js >= 20.x
- MongoDB instance (local or MongoDB Atlas)

### 2. Environment Setup
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```
Update `.env` with your MongoDB URI and port settings.

### 3. Install Dependencies
```bash
npm install
```

### 4. Running the Application
```bash
# Start in development mode with hot reloading (tsx)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 🛡️ Security & Performance
- **Input Sanitization & Schema Validation**: Rejects malformed payloads before hitting controllers.
- **Payload Limits**: 10kb JSON limit to prevent denial-of-service memory pressure.
- **Rate Limiting**: Defends authentication and messaging routes against brute force attacks.
- **Security Headers**: OWASP-aligned security headers via Helmet.
- **High-Throughput Compression**: Gzip/Brotli payload compression for minimal latency.
