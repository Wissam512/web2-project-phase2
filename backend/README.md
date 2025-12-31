# Server (Node + Express + Sequelize + MySQL)

1. Copy `.env.example` to `.env` and set MySQL credentials.

2. Install deps and run:

```bash
cd server
npm install
npm run dev
```

3. Endpoints:
- `GET /api/products`
- `POST /api/products/seed` - seed sample products (body: { products: [...] })
- `GET /api/cart`
- `POST /api/cart` - add cart item `{ productId, quantity }`
- `DELETE /api/cart/:id`
