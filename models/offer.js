
'use strict';

let mongoose = require('mongoose');

let offerSchema = mongoose.Schema({
    to: {type: Schema.Types.ObjectId, ref: 'user'},
    for: {type: Schema.Types.ObjectId, ref: 'item'},
    from: {type: Schema.Types.ObjectId, ref: 'user'},
    item: {type: Schema.Types.ObjectId, ref: 'item'},
    comment: String,
    updated: {type: Date, default: Date.now},
  });

module.exports = mongoose.model('offers', offerSchema);
