
'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let messageSchema = mongoose.Schema({
    from: {type: Schema.Types.ObjectId, ref: 'persons'},
    to: {type: Schema.Types.ObjectId, ref: 'persons'},
    text: {type: String, required: true},
    updated: {type: Date, default: Date.now}
  }
);

module.exports = mongoose.model('message', messageSchema);
