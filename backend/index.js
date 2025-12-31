require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const Product = require('./models/Product');
const CartItem = require('./models/CartItem');

const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/auth', require('./routes/auth'));

app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
