var listing = require('./specs-skills-langs');
listing.categories = require('./listing-categories');
listing.drafts = require('./listing-drafts')

var listings = require('./listings');

var pictures = require('./pictures')

module.exports = {
    listing : listing,
    listings : listings,
    pictures : pictures
}