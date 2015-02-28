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
app.use(router);

router.get('/', function(req, res){
  res.send('hello world');
})

router.route('/listings/drafts')
    .get(function(req, res) {
        res.send({'listingDrafts' : db.listing.drafts});
    })
    .post(function(req, res) {

        var lastDraft = _.max(db.listing.drafts, function(draft) {
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

router.route('/listings/drafts/:id')
    .get(function(req, res) {
        var id = _.parseInt(req.params.id);

        var draft = _.find(db.listing.drafts, {'id': id});

        if (draft) {
            res.send({
                'listingDraft': _.find(db.listing.drafts, {'id': id})
            });
        } else {
            res.status(404).send();
        }
        
    })
    .put(function(req, res){
        var id = _.parseInt(req.params.id);

        var draftToUpdate = _.find(db.listing.drafts, {'id': id});
        var draft = req.body.listingDraft;

        _.merge(draftToUpdate, draft);

        res.send({'listingDraft' : draftToUpdate});
    });

router.route('/listings')
    .get(function (req, res) {
        res.send({ 'listings': db.listings });
    })
    .post(function (req, res) {
        var listing = req.body.listing;

        var lastListing = _.max(db.listings, function(listing) {
            return listing.id;
        })

        var newId = lastListing.id + 1;

        var newListing = {
            id: newId,
            primaryPhoneNumber: '(425) 999-99-89',
            categoryId: 0,
            advisorName: 'Boris Shumyater',
            title: '',
            approach: '',
            backgroundInfo: '',
            HTMLDescription: '<marquee>This is how advisors have their html description. <b>Its all crazy</b></marquee>'
        }

        db.listings.push(newListing);

        res.status(201).send({ 'listing': newListing });
    });

router.route('/listings/:id')
    .get(function(req, res) {
        var id = _.parseInt(req.params.id);

        var listing = _.find(db.listings, {'id': id});

        if (listing) {
            res.send({
                'listing': _.find(db.listings, {'id': id})
            });
        } else {
            res.status(404).send();
        }
    })
    .put(function (req, res) {
        var id = _.parseInt(req.params.id);

        var listingToUpdate = _.find(db.listings, {'id': id});
        var listing = req.body.listing;

        _.merge(listingToUpdate, listing);

        res.send({ 'listing': listingToUpdate });
    });


router.get('/listing-categories', function(req, res) {
    var response = {
        'listingCategories' : db.listing.categories
    };

    res.send(response);
});

router.get('/specializations-skills-languages', function(req, res){
    var response = {
        'specializations' : db.listing.specializations,
        'skills' : db.listing.skills,
        'languages' : db.listing.languages
    }
    res.send(response);
});

router.get('/domain-info', function(req, res){
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