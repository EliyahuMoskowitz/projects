var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('layout', { title: 'Our Apps!!', partials: {content: 'index'} });
});

router.get('/contacts', function(req, res, next) {
  res.render('layout', { title: 'Your Contacts!', partials: {content: 'contacts'},
       contacts: "These are your Contacts on the Database", noticeOfOther: 'You can use another browser and have them in sync'});
});

router.get('/location-weather', function(req, res, next) {
  res.render('layout', { title: 'Get Location and / or Weather!!', partials: {content: 'weather'} });
});

router.get('/flickr', function(req, res, next) {
  res.render('layout', { title: 'PICTURES', partials: {content: 'flickr'} });
});
module.exports = router;
