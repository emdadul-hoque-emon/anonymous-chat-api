# HypoMatrix - Real-Time Chat Server

<p align="center">
  <img alt="NestJS" src="https://img.shields.io/badge/NestJS-11.0-red?style=flat-square&logo=nestjs">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-Latest-green?style=flat-square&logo=node.js">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript">
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-Latest-336791?style=flat-square&logo=postgresql">
  <img alt="Redis" src="https://img.shields.io/badge/Redis-Latest-dc382d?style=flat-square&logo=redis">
  <img alt="License" src="https://img.shields.io/badge/License-UNLICENSED-yellow?style=flat-square">
</p>

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Database Setup](#database-setup)
- [Project Structure](#project-structure)
- [API Modules](#api-modules)
- [WebSocket Events](#websocket-events)
- [Testing](#testing)
- [Development Guidelines](#development-guidelines)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

HypoMatrix is a robust, production-ready real-time chat server built with NestJS. It provides a comprehensive backend for multi-room chat applications with user authentication, real-time messaging via WebSockets, and persistent data storage. The server is designed to handle concurrent connections efficiently with Redis-backed session management and Socket.IO adapter integration.

## ✨ Key Features

- **Real-Time Messaging**: WebSocket-based communication using Socket.IO with Redis adapter for horizontal scaling
- **Multi-Room Support**: Create and manage multiple chat rooms with room-specific messaging
- **User Authentication**: JWT-based authentication with secure token management
- **Database Persistence**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Redis Integration**: Session caching and pub/sub for scalable real-time features
- **Error Handling**: Comprehensive exception handling with custom filters and global error management
- **CORS Support**: Configured for cross-origin requests from frontend applications
- **Input Validation**: Class-based validation with DTO (Data Transfer Objects)
- **Response Standardization**: Global response interceptor for consistent API responses
- **Testing**: Complete test suite with unit and e2e tests
- **Code Quality**: ESLint and Prettier configured for code consistency

## 🛠 Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) 11.0 (TypeScript framework)
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **Cache/Messaging**: Redis with [ioredis](https://github.com/luin/ioredis)
- **Real-Time**: Socket.IO with Redis adapter
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Class Validator & Class Transformer
- **Testing**: Jest with Supertest
- **Code Quality**: ESLint, Prettier, TypeScript

## 📦 Prerequisites

- **Node.js**: v16.0 or higher
- **npm**: v8.0 or higher (or yarn/pnpm)
- **PostgreSQL**: v12 or higher
- **Redis**: Latest version (for local development)
- **Git**: For version control

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd HypoMatrix
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install PostgreSQL and Redis (if not already installed)

**On macOS (using Homebrew):**

```bash
brew install postgresql redis
brew services start postgresql
brew services start redis
```

**On Ubuntu/Debian:**

```bash
sudo apt-get install postgresql postgresql-contrib redis-server
sudo service postgresql start
sudo service redis-server start
```

**On Windows:**

- Download PostgreSQL from https://www.postgresql.org/download/windows/
- Download Redis from https://github.com/microsoftarchive/redis/releases

## 🔧 Environment Setup

### 1. Create Environment File

Copy the example environment file to create your local configuration:

```bash
cp .env.example .env
```

### 2. Configure Environment Variables

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=4000
ENVIRONMENT=development

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/hypomatrix?schema=public"

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN="24h"

# Redis Configuration
REDIS_URL="redis://localhost:6379"
```

### Key Environment Variables:

- **PORT**: Server port (default: 3000, configured: 4000)
- **DATABASE_URL**: PostgreSQL connection string
  - Format: `postgresql://username:password@host:port/database?schema=public`
  - Replace `username`, `password`, `host`, `port`, and `database` with your values
- **JWT_SECRET**: Secret key for signing JWT tokens (change in production!)
- **JWT_EXPIRES_IN**: Token expiration time (e.g., "24h", "7d")
- **REDIS_URL**: Redis connection string (default: `redis://localhost:6379`)

## ▶️ Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
# or
npm run start:dev
```

The server will start and watch for file changes, automatically restarting when you save files.

### Production Mode

```bash
# Build the application
npm run build

# Start the production server
npm run start:prod
```

### Debug Mode

```bash
npm run start:debug
```

The server will start with debugging enabled on port 9229.

### Default Server URL

Once running, the server is available at:

```
http://localhost:4000
```

## 🗄️ Database Setup

### 1. Create PostgreSQL Database

```bash
createdb chat_room
```

### 2. Run Migrations

The project uses Drizzle ORM for schema management:

```bash
# Push the schema to the database
npx drizzle-kit push

# Generate migration files
npx drizzle-kit generate

# Drop and reset database (development only!)
npx drizzle-kit drop
```

### 3. Verify Database Connection

The application will log database connection status on startup. Check the console output for confirmation.

### Database Schema

The application uses the following main tables:

- **users**: User accounts with authentication details
- **rooms**: Chat rooms
- **messages**: Chat messages
- **Additional tables**: Created as needed by the application modules

View the schema files in `src/*/schema.ts` for detailed table structures.

## 📂 Project Structure

```
HypoMatrix/
├── src/
│   ├── auth/                    # Authentication module (JWT)
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── config/
│   │   │   └── jwt.config.ts
│   │   └── guards/
│   │       └── jwt-auth/
│   │           └── jwt-auth.guard.ts
│   ├── common/                  # Shared utilities and configurations
│   │   ├── exceptions/          # Custom exception classes
│   │   │   ├── app.exception.ts
│   │   │   ├── http.exceptions.ts
│   │   │   ├── room.exceptions.ts
│   │   │   └── user.exceptions.ts
│   │   ├── filters/
│   │   │   └── global-exception.filter.ts
│   │   └── interceptors/
│   │       └── response.interceptor.ts
│   ├── database/                # Database configuration and connection
│   │   ├── database.module.ts
│   │   ├── database.ts
│   │   └── constant.ts
│   ├── messages/                # Messages module (business logic)
│   │   ├── messages.controller.ts
│   │   ├── messages.service.ts
│   │   ├── schema.ts            # Database schema
│   │   └── dto/
│   │       └── create-message.request.ts
│   ├── redis/                   # Redis integration module
│   │   ├── redis.module.ts
│   │   └── redis.service.ts
│   ├── rooms/                   # Rooms module
│   │   ├── rooms.controller.ts
│   │   ├── rooms.service.ts
│   │   ├── schema.ts
│   │   └── dto/
│   │       └── create-room.request.ts
│   ├── users/                   # Users module
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── schema.ts
│   │   └── dto/
│   │       └── create-user.request.ts
│   ├── websocket/               # WebSocket/Socket.IO module
│   │   ├── chat.gateway.ts      # Main WebSocket gateway
│   │   ├── message.publisher.ts # Pub/sub publisher
│   │   ├── message.subscriber.ts # Pub/sub subscriber
│   │   ├── redis.adapter.ts     # Redis adapter configuration
│   │   └── websocket.module.ts
│   ├── app.module.ts            # Root module
│   └── main.ts                  # Entry point
├── test/                        # E2E tests
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── drizzle/                     # Database migrations
│   ├── meta/                    # Migration metadata
│   └── *.sql                    # Migration files
├── .env.example                 # Environment variables template
├── drizzle.config.ts            # Drizzle configuration
├── nest-cli.json                # NestJS CLI configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Project dependencies
└── README.md                    # This file
```

## 📡 API Modules

### Users Module

Handles user registration, authentication, and profile management.

**Endpoints:**

- `POST /users` - Create a new user
- `GET /users` - Get all users

**Authentication:** JWT Protected

### Rooms Module

Manages chat room creation, updates, and retrieval.

**Endpoints:**

- `POST /rooms` - Create a new room
- `GET /rooms` - Get all rooms
- `GET /rooms/:id` - Get room by ID
- `DELETE /rooms/:id` - Delete room

**Authentication:** JWT Protected

### Messages Module

Handles message creation and retrieval within rooms.

**Endpoints:**

- `POST /rooms/:roomId/messages` - Create a new message
- `GET /rooms/:roomId/messages` - Get messages in a room

**Authentication:** JWT Protected

### Auth Module

Manages user authentication and token generation.

**Endpoints:**

- `POST /login` - Login user or register user
  and get JWT token

## 🔌 WebSocket Events

The application uses Socket.IO for real-time communication. Connect to the WebSocket server and listen for events:

### Connection Events

- `connect` - User connects to WebSocket while joining a room
- `disconnect` - User disconnects

### Room Events

- `room:joined` - Join a specific room
- `room:user_joined` - when other users join same room
- `room:user_left` - user left from the room

### Message Events

- `message:new` - Send a message in a room (broadcase to the room)

### Example WebSocket Connection (Client-Side)

```javascript
import io from 'socket.io-client';

const handleJoinRoom = (roomId) => {
  const socket = io('http://localhost:4000', {
    query: {
      token: 'your_jwt_token_here',
      roomId,
    },
  });
};
```

## 🧪 Testing

### Run Unit Tests

```bash
npm run test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run E2E Tests

```bash
npm run test:e2e
```

### Generate Coverage Report

```bash
npm run test:cov
```

Coverage reports are generated in the `coverage/` directory.

### Running Specific Tests

```bash
# Run tests for a specific file
npm run test -- users.service.spec.ts

# Run tests matching a pattern
npm run test -- --testNamePattern="UserService"
```

## 📝 Development Guidelines

### Code Style and Formatting

```bash
# Format code with Prettier
npm run format

# Lint and fix code with ESLint
npm run lint
```

### Creating New Modules

The application follows NestJS conventions. To create a new module:

```bash
nest g module module-name
nest g service module-name
nest g controller module-name
```

### Database Schema Changes

1. Update the schema file in `src/module/schema.ts`
2. Generate migration:
   ```bash
   npx drizzle-kit generate
   ```
3. Review the generated migration in `drizzle/`
4. Push to database:
   ```bash
   npx drizzle-kit push
   ```

### Creating DTOs

DTOs (Data Transfer Objects) are used for request/response validation:

```typescript
import { IsString, IsEmail, MinLength } from 'class-validator';

export class LoginRequest {
  @IsString()
  @MinLength(2)
  @MaxLength(24)
  username: string;
}
```

### Error Handling

Use custom exceptions from `src/common/exceptions/`:

```typescript
throw new roomExceptions.NOT_FOUND(
  'Room with id room_x9y8z7 does not exis',
  'ROOM_NOT_FOUND',
);
throw new HttpException.UNAUTHORIZED('Unauthorized', 'UNAUTHORIZED', 401);
```

## 🔍 Troubleshooting

### Database Connection Error

**Issue:** `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solution:**

1. Ensure PostgreSQL is running: `brew services list` (macOS) or `sudo service postgresql status` (Linux)
2. Check DATABASE_URL in `.env` file
3. Verify PostgreSQL credentials and database exists

### Redis Connection Error

**Issue:** `Error: connect ECONNREFUSED 127.0.0.1:6379`

**Solution:**

1. Start Redis: `redis-server` or `brew services start redis` (macOS)
2. Check REDIS_URL in `.env` file
3. Verify Redis is accessible on the configured port

### Port Already in Use

**Issue:** `Error: listen EADDRINUSE: address already in use :::4000`

**Solution:**

```bash
# Find and kill process on port 4000
lsof -i :4000
kill -9 <PID>

# Or use a different port
PORT=5000 npm run dev
```

### JWT Token Expired

**Issue:** `UnauthorizedException: Invalid token`

**Solution:**

- Request a new token by logging in again
- Adjust JWT_EXPIRES_IN in `.env` for longer expiration (e.g., "7d")

### Migration Errors

**Issue:** `Error: relation "users" already exists`

**Solution:**

```bash
# Reset database (development only!)
npx drizzle-kit drop

# Re-push all migrations
npx drizzle-kit push
```

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and commit: `git commit -am 'Add new feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Open a Pull Request

### Code Standards

- Follow TypeScript and NestJS best practices
- Write tests for new features
- Run `npm run lint` before submitting PR
- Ensure all tests pass: `npm run test`

## 📜 License

This project is UNLICENSED. See the LICENSE file for details.
