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

 var drafts = [
 {"status":1,"title":null,"HTMLDescription":null,"salesPitch":null,"approach":null,"background":null,
 "primaryPhoneNumber":{"type":-1,"countryCode":-1,"number":null,"extension":null,"areaCode":null,"isPrimary":false,"formattedNumber":null},
 "domainId":1,"ListingType":0,"categoryId":0,"minuteRate":0.0000,"chatEnabled":false,"videoChatEnabled":false,"systemOfferEnabled":false,
 "tippingEnabled":false,"profilePicture":null,"specializedSituations":[],"skills":[],"languages":[],"id":713},

 {
    id: 1,
    primaryPhoneNumber: {
        type:0,
        countryCode:0,
        number:4259999610,
        extension:null,
        areaCode:null,
        isPrimary:true,
        formattedNumber:null
    },
    categoryId: 642,
    chatEnabled: true,
    minuteRate: 2.99,
    tippingEnabled: true,

    title: 'Sample title1',
    advisorName: 'James Bond',
    salesPitch: 'Sample sales pitch 1',
    //use HTML from http://www.keen.com/psychic-readings/love-relationships/mignon-divine-medium/6604438 as a test =)
    profilePicture: 'http://imgupload.dev.ingenio.com/ad-products.cdn.originalmemberphotos/22768920-2133904112.jpg',

    //todo:
    specializedSituations: [{id:1},{id:2}],   //array of numbers
    skills: [{id:1},{id:6},{id:12}],  //array of numbers
    languages: [{id:1},{id:2},{id:3}],   //array of numbers

    approach: 'My sample approach',
    background: 'My background info',
    HTMLDescription: '<marquee>This is how advisors have their html description. <b>Its all crazy</b></marquee>'
}
, {
    id: 2,
    primaryPhoneNumber: {
        type:0,
        countryCode:0,
        number:4259999989,
        extension:null,
        areaCode:null,
        isPrimary:true,
        formattedNumber:null
    },
    categoryId: 642,
    advisorName: 'Muthu Vynogradenko',
    title: '',

    //todo:
    // specializedSituations: [{id:1},{id:2}],   //array of numbers
    // skills: [{id:1},{id:6},{id:12}],  //array of numbers
    // languages: [{id:1},{id:2},{id:3}],   //array of numbers

    approach: '',
    background: '',
    HTMLDescription: '<marquee>This is how advisors have their html description. <b>Its all crazy</b></marquee>'
}];

var listings = [{
    id: 1,
    primaryPhoneNumber: {
        type:0,
        countryCode:0,
        number:4259999610,
        extension:null,
        areaCode:null,
        isPrimary:true,
        formattedNumber:null
    },
    categoryId: 642,
    chatEnabled: true,
    minuteRate: 2.99,
    tippingEnabled: true,

    title: 'Sample title1',
    advisorName: 'James Bond',
    salesPitch: 'Sample sales pitch 1',
    profilePicture: 'http://imgupload.dev.ingenio.com/ad-products.cdn.originalmemberphotos/22768920-2133904112.jpg',

    //todo:
    specializedSituations: [{id:1},{id:2}],   //array of numbers
    skills: [{id:1},{id:6},{id:12}],  //array of numbers
    languages: [{id:1},{id:2},{id:3}],   //array of numbers

    approach: 'My sample approach',
    background: 'My background info',
    HTMLDescription: '<marquee>This is how advisors have their html description. <b>Its all crazy</b></marquee>'
}, {
    id: 2,
    primaryPhoneNumber: '(425) 999-99-89',
    categoryId: 642,
    advisorName: 'Muthu Vynogradenko',
    title: '',

    //todo:
    // specializedSituations: [{id:1},{id:2}],   //array of numbers
    // skills: [{id:1},{id:6},{id:12}],  //array of numbers
    // languages: [{id:1},{id:2},{id:3}],   //array of numbers

    approach: '',
    background: '',
    HTMLDescription: '<marquee>This is how advisors have their html description. <b>Its all crazy</b></marquee>'
}];


app.get('/', function(req, res){
  res.send('hello world');
});


app.get('/listings/drafts', function(req, res) {
    res.send({'listingDrafts' : drafts});
});

app.get('/listings/drafts/:id', function(req, res) {
    var id = _.parseInt(req.params.id);

    var draft = _.find(drafts, {'id': id});

    if (draft) {
        res.send({
            'listingDraft': _.find(drafts, {'id': id})
        });
    } else {
        res.status(404).send();
    }
    
});

app.put('/listings/drafts/:id', function(req, res){
    var id = _.parseInt(req.params.id);

    var draftToUpdate = _.find(drafts, {'id': id});
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

    drafts.push(newDraft);
    res.status(201);
    res.send({'listingDraft': newDraft });     
});


app.get('/listings/:id', function(req, res) {
    var id = _.parseInt(req.params.id);

    var listing = _.find(listings, {'id': id});

    if (listing) {
        res.send({
            'listing': _.find(listings, {'id': id})
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