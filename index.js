var express = require('express')
    , app = express()
    , logger = require('./logger')
    , router = express.Router()
    , _ = require('lodash')
    , bodyParser = require('body-parser')
    , argv = require('minimist')(process.argv.slice(2))
    , chalk = require('chalk')
    , db = require('./db') //file-based storage of fake api data
    ;

var port = 3008;

logger.setOptions({
    apiLatency: argv.latency,
    groupRequestsMadeInBetween: argv.grouping,
    logBody: argv.logBody
});

//logging syntax sugar
var log = console.log.bind(console);

var apiLatency = argv.latency || 0;
var grouping = argv.grouping || 200;

var corsSettings = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-EpcApi-ID');
    next();
};

//to parse json from incoming requests to req.body
app.use(bodyParser.json());
app.use(logger); //custom logger to log all requests made to console
app.use(corsSettings); //allowing cross-domain requests


app.get('/', function(req, res){
  res.send('hello world');
});


app.get('/listings/drafts', function(req, res) {
    res.send({'listingDrafts' : db.listing.drafts});
});

app.get('/listings/drafts/:id', function(req, res) {
    var id = _.parseInt(req.params.id);

    var draft = _.find(db.listing.drafts, {'id': id});

    if (draft) {
        res.send({
            'listingDraft': _.find(db.listing.drafts, {'id': id})
        });
    } else {
        res.status(404).send();
    }
    
});

app.put('/listings/drafts/:id', function(req, res){
    var id = _.parseInt(req.params.id);

    var draftToUpdate = _.find(db.listing.drafts, {'id': id});
    var draft = req.body.listingDraft;

    _.merge(draftToUpdate, draft);

    //res.status(500);
    res.send({'listingDraft' : draftToUpdate});
});

app.post('/listings/drafts', function(req, res) {

    var lastDraft = _.max(drafts, function(draft) {
        return draft.id;
    })

    var newId = lastDraft.id + 1;

    var newDraft = {
        id: newId,
        primaryPhoneNumber: '(425) 999-99-89',
        categoryId: 0,
        advisorName: 'Boris Shumyater',
        title: '',
        approach: '',
        backgroundInfo: '',
        HTMLDescription: '<marquee>This is how advisors have their html description. <b>Its all crazy</b></marquee>'
    }

    db.listing.drafts.push(newDraft);
    res.status(201);
    res.send({'listingDraft': newDraft });     
});


app.get('/listings/:id', function(req, res) {
    var id = _.parseInt(req.params.id);

    var listing = _.find(db.listings, {'id': id});

    if (listing) {
        res.send({
            'listing': _.find(db.listings, {'id': id})
        });
    } else {
        res.status(404);
        res.send();
    }

});


app.get('/listing-categories', function(req, res) {
    var response = {
        'listingCategories' : db.listing.categories
    };

    res.send(response);
});

app.get('/specializations-skills-languages', function(req, res){
    var response = {
        'specializations' : db.listing.specializations,
        'skills' : db.listing.skills,
        'languages' : db.listing.languages
    }
    res.send(response);
});

app.get('/domain-info', function(req, res){
    var response = { 
        'domainInfo': {
            'connectionCharges' : 0.2,
            'domainFeePercentage' : '30'
        }
    };

    res.send(response);
});
    

app.listen(port, function() {
    if (apiLatency > 0) {
        console.log(chalk.green('Running API Server with artificial latency ') 
            +  chalk.grey(apiLatency + 'ms')
            + ' at ' 
            + chalk.yellow('localhost:' + port + '...'));
    } else {
        console.log(chalk.green('Running API Server at ') 
            + chalk.yellow('localhost:' + port + '...'));
    }

    if (grouping > 0) {
        console.log(chalk.grey(' grouping requests happened in-between ')
            + chalk.white(grouping + 'ms'));
    }
    
});