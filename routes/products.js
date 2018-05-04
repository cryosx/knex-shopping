const express = require('express');
const router = express.Router();
const knex = require('../db');

router.route('/').get((req, res) => {
  knex
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
  .get()
  .put()
  .delete();

router.route('/new').post();

module.exports = router;
