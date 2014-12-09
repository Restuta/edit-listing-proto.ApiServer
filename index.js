var express = require('express');
var app = express();
var router = express.Router();
var _ = require('lodash');

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
        res.send({
            'draft': _.find(drafts, {'id': id})
        }); 
    } else {
        res.status(404);
        res.send();   
    }
    
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
})

app.listen(3008);