const express = require('express');
const moment = require('moment');

const knex = require('../db');

const router = express.Router();

router.route('/:user_id').get((req, res) => {
  const user_id = req.params.user_id;
  return knex
    .raw('SELECT * FROM purchases WHERE user_id = ?', [user_id])
    .then(resp => {
      const rowCount = resp.rowCount;
      if (rowCount === 0) {
        return res.json({ message: 'No products' });
      }
      console.log(resp);
      return res.json(resp);
    })
    .catch(err => {
      return res.status(500).json(err);
    });
});

router.route('/:user_id/checkout').get((req, res) => {
  const user_id = req.params.user_id;
  return knex
    .raw('SELECT * FROM purchases WHERE user_id = ?', [user_id])
    .then(resp => {
      const rowCount = resp.rowCount;
      if (rowCount === 0) {
        return res.json({ message: 'No products' });
      }
      console.log(resp);
      return res.json(resp);
    })
    .catch(err => {
      return res.status(500).json(err);
    });
});

router.route('/:user_id/:months').get((req, res) => {
  const user_id = req.params.user_id;
  const months = req.params.months;

  let timeframeDate = moment
    .utc()
    .subtract(months, 'month')
    .format('YYYY-MM-DD');

  return knex
    .raw('SELECT * FROM purchases WHERE user_id = ? AND created_at > ?', [
      user_id,
      timeframeDate
    ])
    .then(resp => {
      const rowCount = resp.rowCount;
      if (rowCount === 0) {
        return res.json({ message: 'No products' });
      }
      console.log(resp);
      return res.json(resp);
    })
    .catch(err => {
      return res.status(500).json(err);
    });
});

router.route('/:user_id/:months/:years').get((req, res) => {
  const user_id = req.params.user_id;
  const months = req.params.months;
  const years = req.params.years;

  let timeframeDate = moment
    .utc()
    .subtract(years, 'year')
    .subtract(months, 'month')
    .format('YYYY-MM-DD');

  return knex
    .raw('SELECT * FROM purchases WHERE user_id = ? AND created_at > ?', [
      user_id,
      timeframeDate
    ])
    .then(resp => {
      const rowCount = resp.rowCount;
      if (rowCount === 0) {
        return res.json({ message: 'No products' });
      }
      console.log(resp);
      return res.json(resp);
    })
    .catch(err => {
      return res.status(500).json(err);
    });
});

module.exports = router;
