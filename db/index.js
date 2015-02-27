var listing = require('./specs-skills-langs');
listing.categories = require('./listing-categories');
listing.drafts = require('./listing-drafts')

var listings = require('./listings');

module.exports = {
    listing : listing,
    listings : listings
}