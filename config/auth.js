'use strict';

let jwt = require('jwt-simple');
let User = require('../models/user');

module.exports = function(req, res, next){
  let token - req.cookies.token;
  let payload;
  try {
    payload = jwt.decode(token, process.env.JWT_SECRET);
  }
  catch (err) {
    console.log('an error happened: ', err);
    res.status(401).send();
  }

  let userId = payload.userId;

  User.findById(userId, function(err, user){
    if(err || !user) return res.status(401).send(err || 'Authentication required.');
    next();
  });
};
