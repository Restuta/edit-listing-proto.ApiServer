var express = require('express');
var router = express.Router();
var _ = require('lodash')
var db = require('./db'); //file-based storage of fake api data

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
            primaryPhoneNumber: {
                type: 0,
                countryCode: 0,
                number: 0,
                extension: null,
                areaCode: null,
                isPrimary: true,
                formattedNumber: null
            },
            profilePicture:{
                id: 0,
                primaryVersion: {
                  fileName: null,
                  directoryName: null,
                  url: null,
                  width: 0,
                  height: 0,
                  alternateText: null
                  },
                originalVersion: {
                  fileName: null,
                  directoryName: null,
                  url: null,
                  width: 0,
                  height: 0,
                  alternateText: null
                  },
                thumbnailVersion: {
                  fileName: null,
                  directoryName: null,
                  url: null,
                  width: 0,
                  height: 0,
                  alternateText: null
                  },
                size75Version: {
                  fileName: null,
                  directoryName: null,
                  url: null,
                  width: 0,
                  height: 0,
                  alternateText: null
                  },
                isAssociatedWithService: false
            },
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
        //return res.status(500).send('catxdfff');
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
        var draftId = req.body.listing.listingDraftId;
        console.log(draftId);

        var newListingId = draftId;
        var newListing = _.find(db.listing.drafts, {'id': draftId});

        if (!newListing) {
            return res.status(500).send({error:'Draft with id "' 
                + newListingId + '"must be present to be able to create a listing.'});
        }

        db.listings.push(newListing);

        return res.status(201).send({ 'listing': newListing });
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


router.route('/pictures')
    .post(function (req, res) {
        var uploadedPicture = _.find(db.pictures, {'id': 8989});

        res.send(uploadedPicture);
    });

module.exports = router;