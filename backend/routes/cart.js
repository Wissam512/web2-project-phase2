const express = require('express');
const router = express.Router();
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const items = await CartItem.findAll();
    const results = await Promise.all(items.map(async item => {
      const product = await Product.findByPk(item.productId);
      return { id: item.id, quantity: item.quantity, product };
    }));
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId) return res.status(400).json({ error: 'productId required' });
    const item = await CartItem.create({ productId, quantity: quantity || 1 });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await CartItem.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: 'not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
