let mysql = require("mysql2");
const db = require('../models/index'); // equivalent mysql
const TestCustomer = db.sequelize.models.TestCustomer; // Model TestCustomer
var express = require('express');
const testcustomer = require("../models/testcustomer");
var router = express.Router();

// list
router.get('/', async function (req, res) {
    // let customers = await getCustomers();
    let customers = await TestCustomer.findAll({ attributes: ['id', 'firstName', 'lastName', 'email'] });
    // console.log(customers);
    res.render('customers/list',
        {
            title: 'Express 002 - Customers page',
            // list: getCustomers()
            list: customers
        });
});

// GET create
router.get('/create', (req, res) => {
    res.render('customers/create-update', {
        title: 'Express 002 - New Customer page',
        message: 'New Customer',
        action: 'create',
        customer: {}
    });
})

// POST create 
router.post('/create', async (req, res) => {
    await TestCustomer.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    });
    res.redirect('/customers');
});

// GET update
router.get('/edit/:id', async (req, res) => {
    let customer = await TestCustomer.findByPk(req.params.id, { attributes: ['id', 'firstName', 'lastName', 'email'] });
    // console.log(customer);
    res.render('customers/create-update', {
        title: 'Express 002 - Edit Customer page',
        message: 'Edit a Customer',
        action: 'update',
        customer: customer
    });
})

// POST update 
router.post('/update', async (req, res) => {
    let customer = await TestCustomer.findByPk(req.body.id, { attributes: ['id', 'firstName', 'lastName', 'email'] });
    if (customer.id == req.body.id) {
        customer.firstName = req.body.firstName;
        customer.lastName = req.body.lastName;
        customer.email = req.body.email;
        await customer.save();
    }
    res.redirect('/customers');
})

router.get('/listjson', async function (req, res) {
    // let customers = await getCustomers();
    let customers = await TestCustomer.findAll({ attributes: ['id', 'firstName', 'lastName', 'email'] });
    res.json(customers);
});

// npx sequelize model:generate --name TestCustomer --attributes firstName:string,lastName:string,email:string
// npx sequelize-cli db:migrate
// npx sequelize-cli db:migrate:undo

// npx sequelize model:generate --name TestProduct --attributes name:string,price:double
// npx sequelize-cli db:migrate

// npx sequelize model:generate --name TestOrder --attributes quantity:integer,totalPrice:double
// npx sequelize-cli db:migrate

// amend the customer,product,order with associations

// /customer/delete

// http://localhost:4000/customers/delete?id=1&firstName=John // req.query.id
// http://localhost:4000/customers/delete/1/John // req.params.id

router.get('/delete', async function (req, res) {
    // let customers = await getCustomers();
    // let customers = await TestCustomer.findAll();
    // console.log(customers);
    await TestCustomer.destroy({ where: { id: req.query.id } }).then((deleted) => {
        if (deleted === 1) {
            res.render('customers/deleted',
                {
                    title: 'Express 002 - Customers delete page',
                    // list: getCustomers()
                    message: `You deleted customer with id: ${req.query.id}`
                });
        }
    },
        (error) => {
            res.render('customers/deleted',
                {
                    title: 'Express 002 - Customers delete page',
                    // list: getCustomers()
                    message: `<div><p>There was an error deleting customer with id: ${req.query.id}</p>
                                   <p>Error: ${error}</p></div>`
                });
        });

});


async function getCustomers() {
    try {
        let dbResult = await dbLogin();
        if (dbResult) {
            return (dbResult);
        }
    }
    catch (error) {
        return (false);
    }
}

async function dbLogin() {
    const poolConfigDetails = {
        connectionLimit: 1,
        host: 'ra1.anystream.eu',
        port: '5420',
        user: 'cb12ptjs',
        password: 'cb12ptjs',
        database: 'cb12ptjs'
    };
    const pool = mysql.createPool(poolConfigDetails);
    const sql = "SELECT * FROM customer";

    // let result = pool.execute().then(resolve => {}, reject => {});
    // return(result);

    return (new Promise(
        (resolve, reject) => {
            pool.execute(sql, [], (error, rows) => {
                if (error) {
                    pool.end();
                    return (reject(error));
                } else {
                    console.log(rows);
                    return (resolve(rows));
                    // if (rows.length == 1) {
                    //     pool.end();
                    //     return (resolve(true));
                    // }
                    // rows.length != 1
                    // else {
                    //     pool.end();
                    //     return (resolve(false));
                    // }
                }
            })
        }
    ));
}

module.exports = router;