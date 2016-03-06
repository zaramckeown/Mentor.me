'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Conversations Schema
 */
var conversationsSchema = new Schema({
  sender:{
    type: Schema.ObjectId,
    ref: 'User'
  },
  recipient: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  messages:{
    type: Schema.ObjectId,
    ref: 'Messages'
  }
});

mongoose.model('Conversations', conversationsSchema);
var deepPopulate = require('mongoose-deep-populate')(mongoose);
conversationsSchema.plugin(deepPopulate);
