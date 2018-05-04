const express = require('express');
const router = express.Router();
const knex = require('../db');

router.route('/').get((req, res) => {
  return knex
    .raw('SELECT * FROM products', [])
    .then(resp => {
      let products = resp.rows;
      return res.json(products);
    })
    .catch(err => {
      return res.status(500).json({ error: err });
    });
});

router
  .route('/:product_id')
  .get((req, res) => {
    const product_id = req.params.product_id;
    return knex
      .raw('SELECT * FROM products WHERE id = ?', [product_id])
      .then(resp => {
        let rowCount = resp.rowCount;
        if (rowCount !== 1) {
          return res.status(404).json({ error: 'Product not found' });
        }
        let product = resp.rows[0];
        return res.json(product);
      })
      .catch(err => {
        return res.status(500).json({ error: err });
      });
  })
  .put((req, res) => {})
  .delete();

router.route('/new').post((req, res) => {
  const data = req.body;
  const title = data.title.trim();
  const description = data.description.trim();
  const inventory = Number.parseInt(data.inventory);
  const price = Number.parseFloat(data.price);

  return knex
    .raw(
      'INSERT INTO products (title,description,inventory,price) VALUES(?,?,?,?) RETURNING *',
      [title, description, inventory, price]
    )
    .then(resp => {
      let rowCount = resp.rowCount;
      if (rowCount !== 1) {
        return res.status(404).json({ error: 'Must POST all product fields' });
      }
      let product = resp.rows[0];
      return res.json(product);
    })
    .catch(err => {
      return res.status(500).json({ error: err });
    });
});

module.exports = router;
