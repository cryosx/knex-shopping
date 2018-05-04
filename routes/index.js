const express = require('express');

const users = require('./users.js');
const products = require('./products.js');
const cart = require('./cart.js');

const router = express.Router();

router.use('/users', users);
router.use('/products', products);
router.use('/cart', cart);

module.exports = router;
