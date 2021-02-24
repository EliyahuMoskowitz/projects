var express = require('express');
var router = express.Router();


router.get('/:game', function(req, res, next) {
    let title = req.params.game.toUpperCase();
  res.render('layout', { title: title, partials: {content: req.params.game} });
});

module.exports = router;
