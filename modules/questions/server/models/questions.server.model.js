'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var QuestionsSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    required: 'Title cannot be blank'
  },
  content: {
    type: String
  },
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
  comments: [{
    type: Schema.Types.ObjectId,
    ref: "Comments"
  }]
});

mongoose.model('Questions', QuestionsSchema);
var deepPopulate = require('mongoose-deep-populate')(mongoose);
//QuestionsSchema.plugin(deepPopulate);
QuestionsSchema.plugin(deepPopulate, {
  populate: {
    'comments': {
      select: 'body upvotes downvotes usersWhoUpvoted usersWhoDownvoted user question created',
      options: {
        limit: 1,
        sort: { created: -1 }
      },
      'user': {
        select: 'firstName lastName displayName email profileImageURL roles profile'
      },
      'comments.user': {
        select: 'firstName lastName displayName email profileImageURL roles profile'
      }
    }
  }
});
