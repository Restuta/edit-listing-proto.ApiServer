var express = require('express')
    , app = express()
    , logger = require('./logger')
    , router = express.Router()
    , _ = require('lodash')
    , bodyParser = require('body-parser')
    , argv = require('minimist')(process.argv.slice(2))
    , chalk = require('chalk')
    ;

var port = 3008;

logger.setOptions({
    apiLatency: argv.latency,
    groupRequestsMadeInBetween: argv.grouping
});

var apiLatency = argv.latency || 0;

//to parse json from incoming requests to req.body
app.use(bodyParser.json());
app.use(logger); //custom logger to log all requests made to console

//CORS
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
})

var drafts = [{
    id: 1,
    primaryPhoneNumber: '4259999989',
    categoryId: 642,
    chatEnabled: true,
    minuteRate: 2.99,
    supportBonus: true,

    title: 'Sample title1',
    advisorName: 'James Bond',
    salesPitch: 'Sample sales pitch 1',
    profileImage: 'http://imgupload.dev.ingenio.com/ad-products.cdn.originalmemberphotos/22768920-2133904112.jpg',

    //todo:
    specializedSituations: [{id:1},{id:2}],   //array of numbers
    skills: [{id:1},{id:6},{id:12}],  //array of numbers
    languages: [{id:1},{id:2},{id:3}],   //array of numbers

    approach: 'My sample approach',
    backgroundInfo: 'My background info',
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
    backgroundInfo: '',
    HTMLDescription: '<marquee>This is how advisors have their html description. <b>Its all crazy</b></marquee>'
}];


app.get('/', function(req, res){
  res.send('hello world');
});

app.get('/drafts', function(req, res) {
    res.send({'drafts':drafts});
});

app.get('/drafts/:id', function(req, res) {
    var id = _.parseInt(req.param('id'));

    var draft = _.find(drafts, {'id': id});

    if (draft) {
        res.send({
            'draft': _.find(drafts, {'id': id})
        });
    } else {
        res.status(404);
        res.send();   
    }
    
});

app.put('/drafts/:id', function(req, res){
    var id = _.parseInt(req.param('id'));

    var draftToUpdate = _.find(drafts, {'id': id});
    var draft = req.body.draft;

    _.merge(draftToUpdate, draft);

    res.status(200).send({'draft' : draftToUpdate});
});

app.post('/drafts', function(req, res) {

    var lastDraft = _.max(drafts, function(draft) {
        return draft.id;
    })

    var newId = lastDraft.id + 1;

    var newDraft = {
        id: newId,
        name: '',
        minuteRate: 0
    }

    drafts.push(newDraft);
    res.status(201).send({'draft': newDraft });     
});


app.get('/listingCategories-flat', function(req, res) {
    var response = {
        'listingCategories' : [
            {'id':589,'name':'Dream Interpretation','parentId':198},
            {'id':636,'name':'Life Questions','parentId':198},
            {'id':637,'name':'Otherworld Connections','parentId':198},
            {'id':642,'name':'Pet Psychics','parentId':198},
            {'id':705,'name':'Financial Outlook','parentId':198},
            {'id':754,'name':'Psychic Mediums','parentId':198},
            {'id':758,'name':'Recorded Forecasts','parentId':196},
            {'id':764,'name':'Astrologers','parentId':196},
            {'id':765,'name':'Chinese Astrologers','parentId':196},
            {'id':801,'name':'Straight Females','parentId':800},
            {'id':802,'name':'Straight Males','parentId':800},
            {'id':803,'name':'Gay Males','parentId':800},
            {'id':804,'name':'Lesbians','parentId':800},
            {'id':15890,'name':'Mayan Astrology','parentId':196},
            {'id':15891,'name':'Vedic Astrology','parentId':196},
            {'id':15892,'name':'Feng Shui','parentId':198},
            {'id':15893,'name':'Numerology','parentId':198},
            {'id':200,'name':'Spiritual Readings','parentId':195},
            {'id':867,'name':'Psíquicos','parentId':195},
            {'id':211,'name':'Social/Entertainment','parentId':1},
            {'id':202,'name':'Other','parentId':195},
            {'id':198,'name':'Psychics','parentId':195},
            {'id':588,'name':'Tarot Readers','parentId':195},
            {'id':215,'name':'Friends','parentId':211},
            {'id':195,'name':'Psychic Readings','parentId':1},
            {'id':800,'name':'Flirting','parentId':211},
            {'id':693,'name':'Celebrity Models','parentId':211},
            {'id':635,'name':'Love & Relationships','parentId':195},
            {'id':196,'name':'Astrology Readings','parentId':195}
        ]
    };

    res.send(response);
});

app.get('/listingCategories', function(req, res) {
    var response = {
         'listingCategories' : [{
             'id': 1,
             'name': 'Relationship Coaching',
             'subCategories' : [10, 11, 12]
         },{
             'id': 2,
             'name': 'Health and Wellness',
             'subCategories' : [20, 21, 22, 23, 24]
         }],
         'subCategories' : [{
                 'id' : 10,
                 'name' : 'Couples'
             },{
                 'id' : 11,
                 'name' : 'Singles'
             },{
                 'id' : 12,
                 'name' : 'Divorced Singles'
             },{
                 'id' : 20,
                 'name' : 'Nutrition'
             },{
                 'id' : 21,
                 'name' : 'Career'
             },{
                 'id' : 22,
                 'name' : 'Pregnancy'
             },{
                 'id' : 23,
                 'name' : 'Eating Disorder'
             },{
                 'id' : 24,
                 'name' : 'Weightloss'
             }]
     };

    res.send(response);
});

app.get('/listingCategories-inline', function(req, res) {
    var response = {
                'listingCategories' : [{
                    'id': 1,
                    'name': 'Relationship Coaching',
                    'subCategories' : [{
                        'id' : 10,
                        'name' : 'Couples'
                    },{
                        'id' : 11,
                        'name' : 'Singles'
                    },{
                        'id' : 12,
                        'name' : 'Divorced Singles'
                    }]
                },{
                    'id': 2,
                    'name': 'Health and Wellness',
                    'subCategories' : [{
                        'id' : 20,
                        'name' : 'Nutrition'
                    },{
                        'id' : 21,
                        'name' : 'Career'
                    },{
                        'id' : 22,
                        'name' : 'Pregnancy'
                    },{
                        'id' : 23,
                        'name' : 'Eating Disorder'
                    },{
                        'id' : 24,
                        'name' : 'Weightloss'
                    }]
                }]
            }

    res.send(response);
});

app.get('/specializations-skills-languages', function(req, res){
    var response = {
        'specializations' : [{
                'id': 1,
                'value': 'spec1'
            },{
                'id': 2,
                'value': 'spec2'
            },{
                'id': 3,
                'value': 'spec3'
            },{
                'id': 4,
                'value': 'spec4'
            },{
                'id': 5,
                'value': 'spec5'
            }],
        'skills' : [{
                'id': 1,
                'value': 'Angel readings'
            },{
                'id': 2,
                'value': 'Chinese astrology'
            },{
                'id': 3,
                'value': 'Mayan astrology'
            },{
                'id': 4,
                'value': 'Veidc astrology'
            },{
                'id': 5,
                'value': 'Channelling'
            },{
                'id': 6,
                'value': 'Clairaudient'
            },{
                'id': 7,
                'value': 'Clairsentient'
            },{
                'id': 8,
                'value': 'Clairvoyant'
            },{
                'id': 9,
                'value': 'Crystals'
            },{
                'id': 10,
                'value': 'Dream Interpretation'
            },{
                'id': 11,
                'value': 'Empath'
            },{
                'id': 12,
                'value': 'Feng Shui'
            },{
                'id': 13,
                'value': 'I-Ching'
            }],
        'languages' : [{
                'id': 1,
                'value': 'English'
            },{
                'id': 2,
                'value': 'Ukrainian'
            },{
                'id': 3,
                'value': 'Sanskrit'
            },{
                'id': 4,
                'value': 'French'
            },{
                'id': 5,
                'value': 'Latin'
            }]
    }

    res.send(response);
});
    

app.listen(port, function() {
    if (apiLatency > 0) {
        console.log(chalk.green('Running API Server with artificial latency ') 
            +  chalk.grey(apiLatency + 'ms')
            + ' at ' 
            + chalk.magenta('localhost:' + port + '...'));
    } else {
        console.log(chalk.green('Running API Server at ') 
            + chalk.magenta('localhost:' + port + '...'));
    }
    
});