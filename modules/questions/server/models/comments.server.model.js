'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CommentSchema = new Schema({
  body: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: 'User cannot be left blank'
  },
  upvotes: {
    type: Number,
    default: 0
  },
  downvotes: {
    type: Number,
    default: 0
  },
  usersWhoUpvoted: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  usersWhoDownvoted: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  question: {
    type: Schema.Types.ObjectId, ref: 'Questions'
  }
});

mongoose.model('Comments', CommentSchema);
var deepPopulate = require('mongoose-deep-populate')(mongoose);
CommentSchema.plugin(deepPopulate);
