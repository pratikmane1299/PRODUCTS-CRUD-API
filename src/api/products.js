const express = require('express');
const db = require('monk')('localhost/products_CRUD');
const yup = require('yup');

const router = express.Router();

const productSchema = yup.object().shape({
  name: yup.string().trim().required(),
  price: yup.number().required(),
  stock: yup.number().required(),
});

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

router.post('/', async (req, res, next) => {
  try {
    const product = await req.body;

    await productSchema.validate(product);

    await products.insert(product);

    res.json({
      success: true,
      product
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      error.status = 400;
    }
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await req.body;

    await productSchema.validate(product);

    await products.findOneAndUpdate({ _id: id }, { $set: product });

    res.json({
      success: true,
      product: {
        _id: id,
        ...product
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      error.status = 400;
    }
    next(error);
  }
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
