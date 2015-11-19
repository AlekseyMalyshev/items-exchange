'use strict';

let Item = require('../models/item');
let express = require('express');
let router = express.Router();
let auth = require('../config/auth');

router.get('/:itemId', auth.isAuth, (req, res) => {
  Item.findOne({_id: req.params.itemId, owner: {$ne: req.userId}})
    .populate('owner', 'username email avatar')
    .exec((err, doc) => {
    if (err) {
      checkError(err, res);
    }
    else if (!doc) {
      checkError('Item not found', res);
    }
    else {
      Item.find({owner: req.userId}, null, {sort: '-updated'}, (err, items) => {
        if (!err) {
          res.render('item-review', {item: doc, items: items});
        }
        else {
          res.status(400);
        }
      });
    }
  });
});

module.exports = router;
