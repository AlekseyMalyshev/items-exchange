
'use strict';

let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var mongoose = require('mongoose');

let messageApi = require('./routes/messages');
let userApi = require('./routes/users');

let index = require('./routes/index');


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
app.use(cookieParser());

app.use('/api/messages', messageApi);
app.use('/api/users', userApi);

app.use('/', index);

let port = process.env.PORT || 3000;
let listener = app.listen(port);

console.log('express in listening on port: ' + PORT);

process.on('exit', (code) => {
  mongoose.disconnect();
  console.log('About to exit with code:', code);
});
