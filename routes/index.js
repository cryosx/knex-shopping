const express = require('express');

const users = require('./users.js');
const products = require('./products.js');
const cart = require('./cart.js');
const purchases = require('./purchases.js');

const router = express.Router();

router.use('/users', users);
router.use('/products', products);
router.use('/cart', cart);
router.use('/purchases', purchases);

module.exports = router;
