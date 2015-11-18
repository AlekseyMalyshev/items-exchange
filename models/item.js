
'use strict';

let mongoose = require('mongoose');

let itemSchema = mongoose.Schema({
    owner: {type: Schema.Types.ObjectId, ref: 'items'},
    name: {type: String, required: true},
    description: String,
    email: String,
    location: String,
    forSale: Boolean,
    updated: {type: Date, default: Date.now},
  });

module.exports = mongoose.model('items', itemSchema);
