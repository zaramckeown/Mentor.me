'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Messages Schema
 */
var MessagesSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  content: {
    type: String,
    default: '',
    trim: true
  }
});

mongoose.model('Messages', MessagesSchema);
