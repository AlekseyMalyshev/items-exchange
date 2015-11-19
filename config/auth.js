'use strict';

let jwt = require('jsonwebtoken');

let User = require('../models/user');

module.exports.auth = (req, res, next) => {
  let token = req.header('X-Authenticate');
  console.log(token);
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (!err) {
      req.userId = decoded.id;
    }
    next();
  });
}

module.exports.isAuth = (req, res, next) => {
  if (!req.userId) {
    res.status(401).send('Unauthorised');
  }
  else {
    next();
  }
}
