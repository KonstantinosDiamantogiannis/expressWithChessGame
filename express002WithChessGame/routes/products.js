const db = require('../models/index'); // equivalent mysql
const TestProduct = db.sequelize.models.TestProduct; // Model TestProduct
var express = require('express');
var router = express.Router();

/* GET home page. */
// http://localhost:4000/products
router.get('/', async function (req, res, next) {
    let products = await TestProduct.findAll({ attributes: ['id', 'name', 'price'] });
    res.render('products/list', {
        title: 'Express 002 - Products Page',
        message: "Products",
        list: products
    });
});

// GET create
router.get('/create', (req, res) => {
    res.render('products/create-update', {
        title: 'Express 002 - New Product page',
        message: 'New Product',
        action: 'create',
        product: {}
    });
})

// POST create 
router.post('/create', async (req, res) => {
    await TestProduct.create({
        name: req.body.name,
        price: req.body.price
    });
    res.redirect('/products');
});

module.exports = router;