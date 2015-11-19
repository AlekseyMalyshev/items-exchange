'use strict';

let Item = require('../models/item');
let express = require('express');
let router = express.Router();
let auth = require('../config/auth');

router.get('/', auth.isAuth, (req, res) => {
  Item.find({owner: req.userId}, null, {sort: '-updated'}, (err, items) => {
    if (!err) {
      Item.find({forSale: true, owner: {$ne: req.userId}}, null, {sort: '-updated'})
        .populate('owner', 'username email avatar')
        .exec((err, listings) => {
        if (!err) {
          res.render('homepage', {items: items, listings: listings});
        }
        else {
          res.status(400);
        }
      });
    }
    else {
      res.status(400);
    }
  });
});

module.exports = router;
