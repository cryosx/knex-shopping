const express = require('express');
const router = express.Router();
const knex = require('../db');

router
  .route('/:user_id')
  .get((req, res) => {
    const user_id = req.params.user_id;
    knex
      .raw('SELECT * FROM users WHERE id = ?', [user_id])
      .then(resp => {
        let rowCount = resp.rowCount;
        let user = resp.rows[0];
        if (rowCount !== 1) {
          return res.status(404).json({ message: 'User not found' });
        }
        return res.json(user);
      })
      .catch(err => {
        return res.status(500).json({ error: err });
      });
  })
  .delete();

router.route('/:user_id/forgot-password').put();

router.route('/login').post((req, res) => {
  const email = req.body.email;
  const attemptPassword = req.body.password;
  knex
    .raw('SELECT * FROM users WHERE email = ?', [email])
    .then(resp => {
      let rowCount = resp.rowCount;
      let user = resp.rows[0];
      if (rowCount !== 1) {
        return res.status(404).json({ message: 'User not found' });
      }
      let userPassword = user.password;
      if (attemptPassword != userPassword) {
        return res.status(401).json({ message: 'Incorrect password' });
      }
      return res.json(user);
    })
    .catch(err => {
      return res.status(500).json({ error: err });
    });
});

router.route('/register').post((req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  knex
    .raw('SELECT * FROM users WHERE email = ?', [email])
    .then(resp => {
      let rowCount = resp.rowCount;
      let user = resp.rows[0];
      if (rowCount !== 0) {
        return res.status(400).json({ message: 'User already exists' });
      }
      knex
        .raw('INSERT INTO users (email,password) VALUES(?,?) RETURNING *', [
          email,
          password
        ])
        .then(resp => {
          let user = resp.rows[0];
          return res.json(user);
        })
        .catch(err => {
          return res.status(500).json({ error: err });
        });
    })
    .catch(err => {
      return res.status(500).json({ error: err });
    });
});

module.exports = router;
