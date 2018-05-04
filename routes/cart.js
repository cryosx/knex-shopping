const express = require('express');

const knex = require('../db');

const router = express.Router();

router.route('/:user_id').get((req, res) => {
  const user_id = req.params.user_id;
  return knex
    .raw(
      'SELECT * FROM cart INNER JOIN users ON users.id = cart.user_id INNER JOIN products ON products.id = cart.products_id WHERE users.id = ?',
      [user_id]
    )
    .then(resp => {
      console.log(resp);
      let products = resp.rows;
      return res.json(products);
    })
    .catch(err => {
      return res.status(500).json({ error: err });
    });
});

router
  .route('/:user_id/:product_id')
  .post((req, res) => {
    const user_id = req.params.user_id;
    const product_id = req.params.product_id;
    return knex
      .raw('INSERT INTO cart (user_id, products_id) VALUES (?,?) RETURNING *', [
        user_id,
        product_id
      ])
      .then(resp => {
        // console.log(resp);
        // let cart = resp.rows[0];
        return res.json({ success: true });
      })
      .catch(err => {
        if (err.code === '22P02') {
          return res
            .status(400)
            .json({ error: 'invalid input syntax for type numeric' });
        } else {
          return res.status(500).json({ error: err });
        }
      });
  })
  .delete((req, res) => {
    const user_id = req.params.user_id;
    const product_id = req.params.product_id;
    return (
      knex
        // .raw(
        //   'DELETE FROM cart WHERE cart.user_id = ? AND cart.products_id = ? LIMIT 1 RETURNING *',
        //   [user_id, product_id]
        // )
        .raw(
          'DELETE FROM cart WHERE cart.id IN (SELECT id FROM cart WHERE user_id= ? AND products_id = ? ORDER BY created_at DESC LIMIT 1) RETURNING *',
          [user_id, product_id]
        )
        .then(resp => {
          const cartItem = resp.rows[0];
          const rowCount = resp.rowCount;
          if (rowCount === 0) {
            return res.status(404).json({ message: 'Cart item not found' });
          }
          // console.log(resp);
          // let cart = resp.rows[0];
          return res.json({ success: true });
        })
        .catch(err => {
          return res.status(500).json({ error: err });
        })
    );
  });

module.exports = router;
