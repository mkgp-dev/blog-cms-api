# blog-cms-api

API-only backend for my personal blog system.

## Features
- Public read-only access to published posts and comments.
- Admin authoring, publishing, and moderation via JWT.
- Search for posts and comments on the admin side.

## Built with
- Node.js + Express
- Prisma (PostgreSQL)
- JWT authentication
- Zod validation
- Pino logging

## Compatible
- Vercel
- Railway

## Setup
1) Install dependencies
    ```bash
    npm install
    ```

2) Create .env
    ```env
    DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
    DIRECT_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
    NODE_ENV=development
    PORT=3000
    JWT_SECRET=change_me_to_a_long_random_string
    JWT_EXPIRES_IN=1h
    CORS_ORIGIN=http://localhost:5173
    RATE_LIMIT_WINDOW_MS=900000
    RATE_LIMIT_MAX=100
    AUTH_RATE_LIMIT_MAX=10
    TRUST_PROXY=false
    ADMIN_EMAIL=you@example.com
    ADMIN_PASSWORD=change_me
    ADMIN_NAME=Author
    ```

3) Generate Prisma client and migrate
    ```bash
    npx prisma generate
    npx prisma migrate dev --name init
    --------- OR ---------
    npm run prisma:generate
    npm run prisma:migrate
    ```

4) Seed the author account
    ```bash
    npx prisma db seed
    ```

5) Start the server
    ```bash
    npm run dev
    ```

## Authentication
- Admin routes require a JWT in the Authorization header.
- Login response contains a bearer token.
- Store token in the client and send by `Authorization: Bearer <token>`.

### Login
**POST** `/api/auth/login`
```json
{
  "email": "you@example.com",
  "password": "change_me"
}
```

## Response Format
**Success**
```json
{ "data": { } }
```

**List response**
```json
{
  "data": [],
  "meta": { "page": 1, "pageSize": 10, "total": 0 }
}
```

**Error**
```json
{
  "error": {
    "code": "not_found",
    "message": "Route not found",
    "details": {},
    "requestId": "uuid"
  }
}
```

## Public Endpoints
| Method | Endpoint | Description |
| :----- | :------- | :---------- |
| GET | /api/public/posts?page=1&pageSize=10 | List published posts |
| GET | /api/public/posts/:id | Get a published post |
| GET | /api/public/posts/:id/comments?page=1&pageSize=10 | List comments for a published post |

### Create comment on a published post
**POST** `/api/public/posts/:id/comments`
```json
{
  "username": "Guest",
  "content": "Nice post"
}
```

## Admin Endpoints (JWT required)
### Posts
- **GET** `/api/admin/posts?page=1&pageSize=10`
- **GET** `/api/admin/posts/:id`
- **POST** `/api/admin/posts`
```json
{
  "title": "My Post",
  "content": "<p>Hello</p>",
  "published": false
}
```
- **PUT** `/api/admin/posts/:id`
```json
{
  "title": "Updated",
  "content": "<p>Updated</p>",
  "published": true
}
```
- **DELETE** `/api/admin/posts/:id`

### Comments
- **GET** `/api/admin/comments?page=1&pageSize=10`
- **DELETE** `/api/admin/comments/:id`

## Admin Search (JWT required)

### Search posts
**GET** `/api/admin/search/posts`

Query params:
- q (string, optional)
- published (true|false, optional)
- dateFrom (ISO 8601, optional)
- dateTo (ISO 8601, optional)
- sort (createdAt:desc|createdAt:asc|title:asc|title:desc)
- page, pageSize

Example:
```text
/api/admin/search/posts?q=hello&published=true&dateFrom=2025-01-01&dateTo=2025-12-31&page=1&pageSize=10&sort=createdAt:desc
```

### Search comments
**GET** `/api/admin/search/comments`

Query params:
- q (string, optional)
- dateFrom (ISO 8601, optional)
- dateTo (ISO 8601, optional)
- sort (createdAt:desc|createdAt:asc)
- page, pageSize

Example:
```text
/api/admin/search/comments?q=nice&page=1&pageSize=10&sort=createdAt:desc
```

## License

This is a source-available project. You can use it and modify it for personal, non-commercial purposes, but you may not redistribute it or claim it as your own. See the [LICENSE](./LICENSE) file for full details.