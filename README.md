# SW2026 E-commerce REST API

## Description

In-memory e-commerce REST API built with JavaScript and Express. Consumers can register, log in to receive a JWT, and checkout products. Users, products, and stock live in memory. No database is used.

Layered layout under `src`:

- `routes` — HTTP route definitions
- `middleware` — JWT authentication and error handling
- `controllers` — request/response handling
- `services` — business rules
- `models` — in-memory users and products

## Installation

Requirements: Node.js 18 or later.

```bash
git clone <repository-url>
cd sw2026
git checkout feature/ecommerce-rest-api
npm install
```

## How to Run

```bash
npm start
```

The API listens on `http://localhost:3000` by default. Optional environment variables:

- `PORT` — server port (default `3000`)
- `JWT_SECRET` — secret used to sign JWT tokens

Swagger UI is available at `http://localhost:3000/docs`.

## Rules

- Checkout accepts only `cash` or `credit_card`.
- Paying with `cash` applies a 10% discount on the subtotal.
- Only authenticated users can checkout. Send `Authorization: Bearer <token>` obtained from `/login` or `/register`.
- Product stock is decreased after a successful checkout. Insufficient stock is rejected.
- All data is stored in memory and resets when the process restarts.

## Existent Data

The API starts with 3 users and 3 products.

### Users

| ID | Name | Email | Password |
| --- | --- | --- | --- |
| 1 | John Doe | john@example.com | password123 |
| 2 | Jane Smith | jane@example.com | password123 |
| 3 | Admin User | admin@example.com | admin123 |

### Products

| ID | Name | Price | Stock |
| --- | --- | --- | --- |
| 1 | Laptop | 1200 | 10 |
| 2 | Wireless Mouse | 25 | 50 |
| 3 | Mechanical Keyboard | 75 | 30 |

## How to Use the Rest API

Business endpoints: `POST /register`, `POST /login`, `POST /checkout`, `GET /healthcheck`. Interactive documentation is served at `GET /docs`.

### Healthcheck

```bash
curl http://localhost:3000/healthcheck
```

### Register

```bash
curl -X POST http://localhost:3000/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Alice Cooper\",\"email\":\"alice@example.com\",\"password\":\"secret123\"}"
```

Response includes a `token` that can be used for checkout.

### Login

```bash
curl -X POST http://localhost:3000/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

Save the returned `token`.

### Checkout (cash — 10% discount)

```bash
curl -X POST http://localhost:3000/checkout ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer <token>" ^
  -d "{\"paymentMethod\":\"cash\",\"items\":[{\"productId\":1,\"quantity\":1},{\"productId\":2,\"quantity\":2}]}"
```

Example: laptop ($1200) + two mice ($50) = $1250 subtotal, $125 cash discount, **$1125 total**.

### Checkout (credit card — no discount)

```bash
curl -X POST http://localhost:3000/checkout ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer <token>" ^
  -d "{\"paymentMethod\":\"credit_card\",\"items\":[{\"productId\":3,\"quantity\":1}]}"
```

### Swagger UI

Open `http://localhost:3000/docs` in a browser. The page is generated from `swagger.yaml` in the project root.
