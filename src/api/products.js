const express = require('express');
const db = require('monk')('localhost/products_CRUD');

const router = express.Router();

const products = db.get('products');

router.get('/', async (req, res) => {
  const p = await products.find({});

  res.json(p);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const product = await products.findOne({ _id: id });

  res.json({
    success: true,
    product,
  });
});

router.post('/', async (req, res) => {
  const product = await req.body;

  await products.insert(product);

  res.json({
    success: true,
    product
  });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const product = await req.body;

  await products.findOneAndUpdate({ _id: id }, { $set: product });

  res.json({
    success: true,
    product: {
      _id: id,
      ...product
    }
  });
});

router.delete('/:id', async (req, res) => {
  const { id } = await req.params;
  await products.remove({ _id: id });

  res.json({
    success: true,
    message: 'Deleted'
  });
});

module.exports = router;
