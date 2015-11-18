
'use strict';

let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let session = require('express-session');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;

let api = require('./routes/api');
let index = require('./routes/index');

var passportSupport = require('./passport-support');

let database = process.env.MONGOLAB_URI || 'mongodb://localhost/profileEditor';
console.log('Connecting to mongodb: ', database);
mongoose.connect(database);

let app = express();

app.set('view engine', 'jade');
app.use(express.static('public'));
app.use(express.static('bower_components'));
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({secret: 'top secret', resave: false, saveUninitialized: true}));

passport.use(new LocalStrategy(passportSupport.strategy));
passport.serializeUser(passportSupport.serialize);
passport.deserializeUser(passportSupport.deserialize);

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes(passport)); // <-----

app.use('/api/user', api);

app.use('/', index);

let port = process.env.PORT || 3000;
let listener = app.listen(port);

console.log('express in listening on port: ' + PORT);

process.on('exit', (code) => {
  mongoose.disconnect();
  console.log('About to exit with code:', code);
});
