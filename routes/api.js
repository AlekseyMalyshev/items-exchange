
'use strict';

let express = require('express');
let router = express.Router();

let Item = require('../models/item');
let Offer = require('../models/offer');
let User = require('../models/user');

let checkError = (err, res, user) => {
  if (err) {
    console.log('err: ', err);
    res.status(400).send(err);
  }
  else {
    res.json(user);
  }
}

// user registration
router.post('/register', (req, res) => {
  console.log(req.body);
  User.findOne({name: req.body.name}, (err, user) => {
    if (err) {
      checkError(err, res);
    }
    else if (user !== null) {
      res.status(401).send('User already exists');
    }
    else {
      let user = new User(req.body);
      user.encryptPass((err) => {
        if (err) {
          res.status(500).send('Encryption failed');
        }
        else {
          user.save((err, doc) => {
            if (!err) {
              doc.pass = null;
            }
            checkError(err, res, doc);
          });
        }
      });
    }
  });
});

// User authentication
router.post('/authenticate', (req, res) => {
  User.findOne({name: req.body.name}, (err, user) => {
    if (err) {
      checkError(err, res);
    }
    else if (user === null) {
      res.status(404).send('Authentication failed');
    }
    else {
      user.comparePass(req.body.pass, (err) => {
        if (err) {
          res.status(404).send('Authentication failed');
        }
        else {
          let token = user.token();
          user.pass = null;
          res.cookie('userId', user._id, { maxAge: 900000, httpOnly: true });
          res.cookie('token', token, { maxAge: 900000, httpOnly: true });
          res.json(user);
        }
      });
    }
  });
});

// the user may request their details
router.get('/me', (req, res) => {
  let id = req.cookies.userId;
  console.log('id', id);
  if (!id) {
    res.status(401).send('Not authenticated');
  }
  else {
    User.findOne({_id: id}, (err, user) => {
      if (err) {
        checkError(err, res);
      }
      else if (!user) {
        res.status(401).send('Not authenticated');
      } 
      else {
        res.json(user);
      }
    });
  }
});

// the user may update their record
router.put('/me', (req, res) => {
  let id = req.cookies.userId;
  console.log('id', id);
  if (!id) {
    res.send('');
  }
  else {
    let user = new User(req.body);
    user._id = id;
    console.log(user);
    user.encryptPass((err) => {
      if (err) {
        checkError(err, res);
      }
      else {
        User.findOneAndUpdate({_id: id}, user, (err, doc) => {
          if (err) {
            checkError(err, res);
          }
          else {
            res.json('');
          }
        });
      }
    });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('userId');
  res.send('');
});

// The user may post an item
// req.body contains a new item
router.post('/item', (req, res) => {
  let item = new Item(req.body);
  item.owner = req.user.token;

});

// The user may update an item
// req.body contains an existing item
router.put('/item', (req, res) => {

});

// The user may delete their items
router.delete('/item/:itemId', (req, res) => {

});

// The user may request a list of his items
// Items are selecetd based on the user ID
router.get('/items', (req, res) => {

});

// The user may request a list of all items for sale
// All items that are marked 'forSale' are returned 
router.get('/listings', (req, res) => {

});

// The user may offer and item for an exchange
// The user may offer more than one item
router.post('/offer', (req, res) => {

});

// The user may revoke an offer before it is accepted
router.delete('/offer/:offerId', (req, res) => {

});

// The user may request a list of all his offers
router.get('/offers', (req, res) => {

});

// This is a special request when the user accepts
// one offer. As a result the items change hands
// and all offers are deleted
router.get('/offer', (req, res) => {

});

module.exports = router;
