const express = require('express');

const router = express.Router();

router.route('/:user_id').get();

router
  .route('/:user_id/:product_id')
  .post()
  .delete();

module.exports = router;
