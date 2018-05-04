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
  .put((req, res) => {
    const product_id = req.params.product_id;
    const data = req.body;
    const validFields = ['title', 'description', 'inventory', 'price'];
    let productFields = [];
    let productValues = [];
    for (const key in data) {
      if (validFields.includes(key)) {
        productFields.push(key);
        productValues.push(data[key]);
      }
    }

    productValues.push(product_id);

    let setString = productFields
      .map(function(elem) {
        return `${elem} = ?`;
      })
      .join(',');

    let query = `UPDATE products SET ${setString}, updated_at = now() WHERE id = ? RETURNING *`;

    return knex
      .raw(query, productValues)
      .then(resp => {
        let rowCount = resp.rowCount;
        if (rowCount !== 1) {
          return res.status(404).json({ error: 'Product not found' });
        }
        // let product = resp.rows[0];
        // return res.json(product);
        return res.json({ message: `Product ${product_id} has been updated` });
      })
      .catch(err => {
        return res.status(500).json({ error: err });
      });
  })
  .delete((req, res) => {
    const product_id = req.params.product_id;
    return knex
      .raw('DELETE FROM products WHERE id = ? RETURNING *', [product_id])
      .then(resp => {
        let rowCount = resp.rowCount;
        if (rowCount !== 1) {
          return res.status(404).json({ error: 'Product not found' });
        }
        // let product = resp.rows[0];
        return res.json({
          message: `Product id:${product_id} successfully deleted`
        });
      })
      .catch(err => {
        return res.status(500).json({ error: err });
      });
  });

router.route('/new').post((req, res) => {
  const data = req.body;
  const validFields = ['title', 'description', 'inventory', 'price'];
  const dataFields = Object.keys(data);

  let allFields = validFields.every(function(value) {
    return dataFields.includes(value);
  });

  if (!allFields) {
    return res.status(404).json({ error: 'Must POST all product fields' });
  }

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
        return res.status(400).json({ error: 'Insert error?' });
      }
      let product = resp.rows[0];
      return res.json(product);
    })
    .catch(err => {
      return res.status(500).json({ error: err });
    });
});

module.exports = router;
