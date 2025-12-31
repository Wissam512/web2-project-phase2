const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// optional: seed sample products
router.post('/seed', async (req, res) => {
  try {
    const sample = req.body.products || [
      { title: 'Sample Product', description: 'A sample', price: 9.99 }
    ];
    const created = await Product.bulkCreate(sample);
    res.json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
