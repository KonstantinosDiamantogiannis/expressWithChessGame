let mysql = require("mysql2");
const db = require('../models/index'); // equivalent mysql
const TestChessPlayersDiams = db.sequelize.models.TestChessPlayersDiams; // Model Testplayer
var express = require('express');
const testplayer = require("../models/testchessplayersdiams");
var router = express.Router();

// list
router.get('/', async function (req, res) {
    // let players = await getplayers();
    let players = await TestChessPlayersDiams.findAll({ attributes: ['id', 'firstName', 'lastName', 'email'] });
    // console.log(players);
    res.render('players/list',
        {
            title: 'Express 002 - Players page',
            // list: getplayers()
            list: players
        });
});

// GET create
router.get('/create', (req, res) => {
    res.render('players/create-update', {
        title: 'Express 002 - New Player page',
        message: 'New Player',
        action: 'create',
        player: {}
    });
})

// POST create 
router.post('/create', async (req, res) => {
    await TestChessPlayersDiams.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    });
    res.redirect('/players');
});

// GET update
router.get('/edit/:id', async (req, res) => {
    let player = await TestChessPlayersDiams.findByPk(req.params.id, { attributes: ['id', 'firstName', 'lastName', 'email'] });
    // console.log(player);
    res.render('players/create-update', {
        title: 'Express 002 - Edit Player page',
        message: 'Edit a Player',
        action: 'update',
        player: player
    });
})

// POST update 
router.post('/update', async (req, res) => {
    let player = await TestChessPlayersDiams.findByPk(req.body.id, { attributes: ['id', 'firstName', 'lastName', 'email'] });
    if (player.id == req.body.id) {
        player.firstName = req.body.firstName;
        player.lastName = req.body.lastName;
        player.email = req.body.email;
        await player.save();
    }
    res.redirect('/players');
})

router.get('/listjson', async function (req, res) {
    // let players = await getplayers();
    let players = await TestChessPlayersDiams.findAll({ attributes: ['id', 'firstName', 'lastName', 'email'] });
    res.json(players);
});

// npx sequelize model:generate --name TestPlayer --attributes firstName:string,lastName:string,email:string
// npx sequelize-cli db:migrate
// npx sequelize-cli db:migrate:undo

// npx sequelize model:generate --name TestProduct --attributes name:string,price:double
// npx sequelize-cli db:migrate

// npx sequelize model:generate --name TestOrder --attributes quantity:integer,totalPrice:double
// npx sequelize-cli db:migrate

// amend the player,product,order with associations

// /player/delete

// http://localhost:4000/players/delete?id=1&firstName=John // req.query.id
// http://localhost:4000/players/delete/1/John // req.params.id

router.get('/delete', async function (req, res) {
    // let players = await getPlayers();
    // let players = await Testplayer.findAll();
    // console.log(players);
    await TestChessPlayersDiams.destroy({ where: { id: req.query.id } }).then((deleted) => {
        if (deleted === 1) {
            res.render('players/deleted',
                {
                    title: 'Express 002 - Players delete page',
                    // list: getplayers()
                    message: `You deleted Player with id: ${req.query.id}`
                });
        }
    },
        (error) => {
            res.render('players/deleted',
                {
                    title: 'Express 002 - Players delete page',
                    // list: getplayers()
                    message: `<div><p>There was an error deleting player with id: ${req.query.id}</p>
                                   <p>Error: ${error}</p></div>`
                });
        });

});


async function getPlayers() {
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
    const sql = "SELECT * FROM TestChessPlayersDiams";

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