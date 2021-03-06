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
  messages:[{
    type: Schema.ObjectId,
    ref: 'Messages'
  }],
  recipientDeleted: {
    type: Boolean
  },
  senderDeleted: {
    type: Boolean
  }
});

mongoose.model('Conversations', conversationsSchema);
var deepPopulate = require('mongoose-deep-populate')(mongoose);
//conversationsSchema.plugin(deepPopulate);
conversationsSchema.plugin(deepPopulate, {
  populate: {
    'recipient': {
      select: 'firstName lastName displayName email profileImageURL roles profile',
      options: {
      }
    },
    'sender': {
      select: 'firstName lastName displayName email profileImageURL roles profile'
    },
    'messages.sender':{
      select: 'firstName lastName displayName email profileImageURL roles profile'
    }
  }
});
