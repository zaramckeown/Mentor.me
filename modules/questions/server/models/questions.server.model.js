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

QuestionsSchema.methods.upvote = function (user, callback) {
  // If this user hasnom't upvoted yet:
  if (this.usersWhoUpvoted.indexOf(user._id) === -1) {
    this.usersWhoUpvoted.push(user._id);
    this.upvotes++;

    // If this user has downvoted, revert the downvote:
    if (this.usersWhoDownvoted.indexOf(user._id) !== -1) {
      this.usersWhoDownvoted.splice(this.usersWhoDownvoted.indexOf(user._id), 1);
      this.downvotes--;
    }

    this.save(callback);
  } else {
    // TODO this violates idempotency of PUT, we should have another PUT method for reverting an upvote - or does it?
    this.usersWhoUpvoted.splice(this.usersWhoUpvoted.indexOf(user._id), 1);
    this.upvotes--;

    this.save(callback);
  }
};

QuestionsSchema.methods.downvote = function (user, callback) {
  if (this.usersWhoDownvoted.indexOf(user._id) === -1) {
    this.usersWhoDownvoted.push(user._id);
    this.downvotes++;

    // If this user has upvoted, revert the upvote:
    if (this.usersWhoUpvoted.indexOf(user._id) !== -1) {
      this.usersWhoUpvoted.splice(this.usersWhoUpvoted.indexOf(user._id), 1);
      this.upvotes--;
    }

    this.save(callback);
  } else {
    // TODO this violates idempotency of PUT, we should have another PUT method for reverting an upvote
    this.usersWhoDownvoted.splice(this.usersWhoDownvoted.indexOf(user._id), 1);
    this.downvotes--;

    this.save(callback);
  }
};

mongoose.model('Questions', QuestionsSchema);
var deepPopulate = require('mongoose-deep-populate')(mongoose);
QuestionsSchema.plugin(deepPopulate);
