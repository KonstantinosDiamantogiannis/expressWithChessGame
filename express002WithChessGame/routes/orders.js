const db = require('../models/index'); // equivalent mysql
const TestOrder = db.sequelize.models.TestOrder; // Model TestOrder
const TestCustomer = db.sequelize.models.TestCustomer;
const TestProduct = db.sequelize.models.TestProduct;
var express = require('express');
var router = express.Router();

/* GET home page. */
// http://localhost:4000/orders
router.get('/', async function (req, res, next) {
    let orders = await TestOrder.findAll({ attributes: ['id', 'customerId', 'productId', 'quantity', 'totalPrice'] });
    let ordersDTO = [];
    for(let element of orders){
        let customer = await TestCustomer.findByPk(element.customerId, { attributes: ['firstName', 'lastName'] });
        let customerName = customer.firstName + " " + customer.lastName;
        let product = await TestProduct.findByPk(element.productId, { attributes: ['name']});
        ordersDTO.push({
            id: element.id, 
            customer: { 
                id: element.customerId, 
                name: customerName
            },
            product: {
                id: element.productId,
                name: product.name
            },
            quantity: element.quantity,
            totalPrice: element.totalPrice
        });    
    };
    res.render('orders/list', {
        title: 'Express 002 - Orders Page',
        message: "Orders",
        list: ordersDTO
    });
});

// GET create
router.get('/create', async (req, res) => {
    let customers = await TestCustomer.findAll({ attributes: ['id', 'firstName', 'lastName'] });
    let products =  await TestProduct.findAll({ attributes: ['id', 'name']});
    res.render('orders/create-update', {
        title: 'Express 002 - New Order page',
        message: 'New Order',
        action: 'create',
        order: {},
        customers: customers,
        products: products
    });
})

// POST create 
router.post('/create', async (req, res) => {
    let selectedProduct = await TestProduct.findByPk(req.body.products, { attributes: ['price']});
    await TestOrder.create({
        customerId: req.body.customers,
        productId: req.body.products,
        quantity: req.body.quantity,
        totalPrice: req.body.quantity * selectedProduct.price
    });
    res.redirect('/orders');
});

// http://localhost:4000/orders/listjson
router.get('/listjson', async function(req, res) {
    let orders = await TestOrder.findAll({ attributes: ['id', 'customerId', 'productId', 'quantity', 'totalPrice'] });
    res.json(orders);
});


module.exports = router;