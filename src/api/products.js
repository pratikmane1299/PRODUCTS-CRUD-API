const express = require('express');
const yup = require('yup');
const { db } = require('../db/db');

const router = express.Router();
const products = db.get('products');

const productSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required('Name is required'),
  price: yup
    .number('Price is not a valid number')
    .required('Price is required')
    .positive('Price must be greater than 0'),
  description: yup
    .string()
    .trim()
    .required('Description is required')
    .max(100, 'Description should not have more than 100 chars'),
  imageUrl: yup
    .string()
    .url('Image Url is not a valid Url')
    .trim().required('Image Url is required'),
  stock: yup
    .number()
    .required('Stock is required')
    .positive()
    .integer(),
});

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

    await productSchema.validate(product, { abortEarly: false });

    await products.insert(product);

    res.json({
      success: true,
      product
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      error.status = 400;
      let errors = {};
      error.inner.forEach((e) => {
        errors = {
          ...errors,
          [e.path]: e.message
        };
      });
      error.validationErrors = errors;
    }
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await req.body;

    await productSchema.validate(product, { abortEarly: false });

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
      let errors = {};
      error.inner.forEach((e) => {
        errors = {
          ...errors,
          [e.path]: e.message
        };
      });
      error.validationErrors = errors;
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
