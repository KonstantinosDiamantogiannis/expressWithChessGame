const db = require('../models/index'); // equivalent mysql
const TestTournamentsDiam = db.sequelize.models.TestTournamentsDiam; // Model Testtournament
var express = require('express');
var router = express.Router();

/* GET home page. */
// http://localhost:4000/tournaments
router.get('/', async function (req, res, next) {
    let tournaments = await TestTournamentsDiam.findAll({ attributes: ['id', 'title', 'tdate', 'tplayers'] });
    res.render('tournaments/list', {
        title: 'Express 002 - Tournaments Page',
        message: "Tournaments",
        list: tournaments
    });
});

// GET create
router.get('/create', (req, res) => {
    res.render('tournaments/create-update', {
        title: 'Express 002 - New Tournament page',
        message: 'New Tournament',
        action: 'create',
        tournament: {}
    });
})

// POST create 
router.post('/create', async (req, res) => {
    await TestTournamentsDiam.create({
        title: req.body.title,
        tdate: req.body.tdate,
        tplayers: req.body.tplayers
    });
    res.redirect('/tournaments');
});

module.exports = router;