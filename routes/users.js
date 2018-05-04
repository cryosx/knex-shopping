const express = require('express');
const router = express.Router();
const knex = require('../db');

router
  .route('/:user_id')
  .get((req, res) => {
    const user_id = req.params.user_id;
    return knex
      .raw('SELECT * FROM users WHERE id = ?', [user_id])
      .then(resp => {
        let rowCount = resp.rowCount;
        if (rowCount !== 1) {
          return res.status(404).json({ message: 'User not found' });
        }
        let user = resp.rows[0];
        return res.json(user);
      })
      .catch(err => {
        return res.status(500).json({ error: err });
      });
  })
  .delete((req, res) => {
    const user_id = req.params.user_id;
    return knex
      .raw('DELETE FROM users WHERE id = ? RETURNING *', [user_id])
      .then(resp => {
        console.log(resp);
        let rowCount = resp.rowCount;
        if (rowCount !== 1) {
          return res.status(404).json({ message: 'User ID not found' });
        }
        let user = resp.rows[0];
        return res.json({ message: `User id:${user_id} successfully deleted` });
      })
      .catch(err => {
        return res.status(500).json({ error: err });
      });
  });

router.route('/:user_id/forgot-password').put((req, res) => {
  const user_id = req.params.user_id;
  const updatedPassword = req.body.password;
  return knex
    .raw('SELECT * FROM users WHERE id = ?', [user_id])
    .then(resp => {
      let rowCount = resp.rowCount;
      if (rowCount !== 1) {
        return res.status(404).json({ message: 'Something is up' });
      }
      knex
        .raw('UPDATE users SET password = ? WHERE id = ?', [
          updatedPassword,
          user_id
        ])
        .then(resp => {
          return res.json({ message: 'New password created!' });
        })
        .catch(err => {
          return res.status(500).json({ error: err });
        });
    })
    .catch(err => {
      return res.status(500).json({ error: err });
    });
});

router.route('/login').post((req, res) => {
  const email = req.body.email;
  const attemptPassword = req.body.password;
  return knex
    .raw('SELECT * FROM users WHERE email = ?', [email])
    .then(resp => {
      let rowCount = resp.rowCount;
      if (rowCount !== 1) {
        return res.status(404).json({ message: 'User not found' });
      }
      let user = resp.rows[0];
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
  return knex
    .raw('SELECT * FROM users WHERE email = ?', [email])
    .then(resp => {
      let rowCount = resp.rowCount;
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
