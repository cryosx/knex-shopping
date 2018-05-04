const express = require('express');

const router = express.Router();

router.route('/').get();

router
  .route('/:product_id')
  .get()
  .put()
  .delete();

router.route('/new').post();

module.exports = router;
