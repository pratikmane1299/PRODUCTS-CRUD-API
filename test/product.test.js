/* eslint-disable no-undef */
const request = require('supertest');
const chai = require('chai');

const { expect } = chai;

const app = require('../src/app');
const { db } = require('../src/db/db');

describe('Products API', () => {
  let products;
  // eslint-disable-next-line no-undef
  before(() => {
    products = db.create('products');
  });

  // eslint-disable-next-line no-undef
  after(() => {
    products.drop();
  });

  describe('GET /api/v1/products', () => {
    it('Get all products', (done) => {
      request(app)
        .get('/api/v1/products')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  describe('GET /api/v1/products/:id', () => {
    let product;
    before(async () => {
      product = await products.insert({
        name: 'Pizza',
        price: 200,
        stock: 8
      });
    });

    it('Get product by id', (done) => {
      request(app)
        .get(`/api/v1/products/${product._id}`)
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('success').equal(true);
          expect(res.body).to.have.property('product').a('object');
          expect(res.body.product).to.have.property('_id');
          expect(res.body.product).to.have.property('name');
          expect(res.body.product).to.have.property('price');
          expect(res.body.product).to.have.property('stock');
          done();
        });
    });

    after(async () => {
      await products.remove({ _id: product._id });
    });
  });

  describe('POST /api/v1/products', () => {
    it('Add new product', (done) => {
      const product = {
        name: 'Red Velvet Cake',
        price: 360,
        stock: 5
      };
      request(app)
        .post('/api/v1/products')
        .send(product)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('success').equal(true);
          expect(res.body).to.have.property('product').a('object');
          expect(res.body.product).to.have.property('_id');
          expect(res.body.product).to.have.property('name');
          expect(res.body.product).to.have.property('price');
          expect(res.body.product).to.have.property('stock');
          done();
        });
    });
  });

  describe('PUT /api/v1/products/:id', () => {
    let product;
    before(async () => {
      product = await products.insert({
        name: 'Pizza',
        price: 200,
        stock: 8
      });
    });

    it('Should update a product', (done) => {
      const newProduct = {
        name: 'Paneer Cheese Pizza',
        price: 220,
        stock: 5
      };
      request(app)
        .put(`/api/v1/products/${product._id}`)
        .send(newProduct)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('success').equal(true);
          expect(res.body).to.have.property('product').a('object');
          expect(res.body.product).to.have.property('_id');
          expect(res.body.product).to.have.property('name');
          expect(res.body.product).to.have.property('price');
          expect(res.body.product).to.have.property('stock');
          done();
        });
    });

    after(async () => {
      await products.remove({ _id: product._id });
    });
  });

  describe('DELETE /api/v1/products/:id', () => {
    let product;
    before(async () => {
      product = await products.insert({
        name: 'Pizza',
        price: 200,
        stock: 8
      });
    });

    it('Delete a product by id', (done) => {
      request(app)
        .delete(`/api/v1/products/${product._id}`)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('success').equal(true);
          expect(res.body).to.have.property('message').equal('Deleted');
          done();
        });
    });

    after(async () => {
      await products.remove({ _id: product._id });
    });
  });
});
