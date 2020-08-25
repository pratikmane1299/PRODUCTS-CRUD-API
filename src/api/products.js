const express = require('express');
const { v4: uuid } = require('uuid');

const router = express.Router();

let products = [];

router.get('/', (req, res) => {
  res.json(products);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const product = products.find((p) => p.id === id);

  res.json({
    success: true,
    product,
  });
});

router.post('/', async (req, res) => {
  let product = await req.body;
  product = { id: uuid(), ...product };

  products.push(product);

  res.json({
    success: true,
    product
  });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const product = await req.body;

  products = products.map((p) => {
    if (p.id === id) {
      return {
        id: p.id,
        // ...product
        name: product.name,
        price: product.price,
        stock: product.stock
      };
    }
    return p;
  });

  res.json({
    success: true,
    product: {
      id,
      ...product
    }
  });
});

router.delete('/:id', async (req, res) => {
  const { id } = await req.params;
  products = products.filter((p) => p.id !== id);
  res.json({
    success: true,
    message: 'Deleted'
  });
});

module.exports = router;
