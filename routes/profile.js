'use strict';

let User = require('../models/user');
let express = require('express');
let router = express.Router();
let auth = require('../config/auth');

router.get('/', auth.isAuth, (req, res) => {
  let id = req.userId;
  User.findOne({_id: id}, (err, user) => {
    if (err) {
      checkError(err, res);
    }
    else if (!user) {
      res.status(401).send('Authentication error');
    } 
    else {
      console.log('user: ', user);
      res.render('profile', {user: user});
    }
  });
});

module.exports = router;
