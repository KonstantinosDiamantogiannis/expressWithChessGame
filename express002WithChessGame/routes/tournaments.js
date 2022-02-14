const db = require('../models/index'); // equivalent mysql
const TestTournamentsDiam = db.sequelize.models.TestTournamentsDiam; // Model TestTournament
const TestChessPlayersDiams = db.sequelize.models.TestChessPlayersDiams; // Model TestPlayers
var express = require('express');
const _ = require('underscore');
const { Op } = require("sequelize");
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


router.get('/delete', async function (req, res) {
    // let tournaments = await gettournaments();
    // let tournaments = await Testtournament.findAll();
    // console.log(tournaments);
    await TestTournamentsDiam.destroy({ where: { id: req.query.id } }).then((deleted) => {
        if (deleted === 1) {
            res.render('tournaments/deleted',
                {
                    title: 'Express 002 - Tournaments delete page',
                    // list: gettournaments()
                    message: `You deleted Tournament with id: ${req.query.id}`
                });
        }
    },
        (error) => {
            res.render('tournaments/deleted',
                {
                    title: 'Express 002 - Tournaments delete page',
                    // list: gettournaments()
                    message: `<div><p>There was an error deleting tournament with id: ${req.query.id}</p>
                                   <p>Error: ${error}</p></div>`
                });
        });

});


router.get('/start', async function (req, res) {

    let tournament = await TestTournamentsDiam.findByPk(req.query.id);
    let participantsNo = tournament.tplayers;
    let players = await TestChessPlayersDiams.findAll({
        where: {
            createdAt: { [Op.lt]: new Date(tournament.tdate) }
        }
    });

    let shuffledArray = _.shuffle(players);
    // console.log(shuffledArray);

    let round = 1,
        bracket = [],
        participants = [];

    for (i = 0; i < participantsNo; i++) {
        participants.push(shuffledArray[i])
    };

    console.log(participants);
    console.log(participants.length);

    // while(participantsNo == 2) {

    // }
});



module.exports = router;