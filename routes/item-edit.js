'use strict';

let Item = require('../models/item');
let express = require('express');
let router = express.Router();
let auth = require('../config/auth');

router.get('/:itemId', auth.isAuth, (req, res) => {
  Item.findOne({_id: req.params.itemId, owner: req.userId}, (err, doc) => {
    if (err) {
      checkError(err, res);
    }
    else if (!doc) {
      checkError('Item not found', res);
    }
    else {
      res.render('item-edit', {item: doc});
    }
  });
});

router.get('/', auth.isAuth, (req, res) => {
  res.render('item-new');
});

module.exports = router;
