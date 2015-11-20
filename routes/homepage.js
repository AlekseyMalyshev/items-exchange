'use strict';

let Offer = require('../models/offer');
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
          Offer.find({from: req.userId, accepted: null}, null, {sort: '-updated'})
            .populate('to', 'username email')
            .populate('for offer')
            .exec((err, bids) => {
            if (!err) {
              Offer.find({to: req.userId, accepted: null}, null, {sort: '-updated'})
                .populate('from', 'username email')
                .populate('for offer')
                .exec((err, offers) => {
                if (!err) {
                  console.log('offers: ', offers);
                  console.log('bids: ', bids);
                  res.render('homepage', {items: items, listings: listings, bids: bids, offers: offers});
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
