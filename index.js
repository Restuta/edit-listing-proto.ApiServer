var express = require('express')
    ,app = express()
    ,router = express.Router()
    ,_ = require('lodash');

//CORS
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
})

var drafts = [{
    id: 1,
    name: 'First listing',
    minuteRate: 2.99
}, {
    id: 2,
    name: 'Second listing',
    minuteRate: 5.88
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
        setTimeout(function(){
            res.send({
            'draft': _.find(drafts, {'id': id})
        }); 
        }, 1000)
        // res.send({
        //     'draft': _.find(drafts, {'id': id})
        // }); 
    } else {
        res.status(404);
        res.send();   
    }
    
});

app.put('/drafts/:id', function(req, res){
    var id = _.parseInt(req.param('id'));

    var draftToUpdate = _.find(drafts, {'id': id});

    res.status(500);
    res.send();   
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
    res.status(201);

    res.send({'draft': newDraft });     
});

app.get('/listingCategories', function(req, res) {
    res.send({
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
    })
});

app.get('/listingCategories-inline', function(req, res) {

    setTimeout(
        function() {res.send({
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
        })
},1000);
    });
    

app.listen(3008);