'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Show the current user
 */
exports.read = function (req, res) {
  res.json(req.model);
};

/**
 * List of Users
 */
exports.list = function (req, res) {
  User.find({}, '-salt -password -accessToken -refreshToken').sort('-created').where('roles', 'mentor').
  populate('user', 'displayName').exec(function (err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.json(users);
  });
};

exports.topMentors = function(req, res) {

};

exports.recommendedMentors = function(req,res) {

  User.findById(req.params.userId).deepPopulate('profile').exec(function (err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
  //userProfile.profile.interests

    var userSchoolsCoursename = [];
    var userSchoolName = [];

    for(var count = 0; count < users.profile.education.length; count++) {
      userSchoolsCoursename.push(users.profile.education.courseTitle);
      userSchoolName.push(users.profile.education.schoolName);
    }

    var userExperience = [];

    for(var countExperience = 0; countExperience < users.profile.experience.length; countExperience++) {
      userExperience.push(users.profile.experience.company);
    }

//{ '$and': [ { "roles":{ $all:[ 'mentor' ]} }]}
    //{ "roles":{ $all:[ 'mentor' ]} }
    User.find({ "$or": [{ "profile.interests": { "$in" : users.profile.interests } },
      { "profile.location": users.profile.location}, { "profile.education.courseTitle": { "$in" : userSchoolsCoursename } },
      { "profile.education.schoolName": { "$in" : userSchoolName } }, { "profile.experience.company": userExperience }]},  '-salt -password' +
      ' -accessToken' +
      ' -refreshToken').where('roles', 'mentor').exec(function(err, mentors) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      //console.log(mentors);
      /*for(var userCheck = 0; userCheck < mentors.length; userCheck++) {
        //console.log(mentors[userCheck]);
        if(mentors[userCheck].id === req.params.userId) {
          mentors.splice(userCheck, 1);
        }
      }*/
      if (!mentors)
      {
        User.find({}, '-salt -password -accessToken -refreshToken').where('roles', 'mentor').populate('user', 'displayName').exec(function (err, users) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          }
          res.json(users);
        });
      }
      else {
        res.json(mentors);
      }
    });
  });
};

exports.search = function(req, res){

  var findQuery = {};

  if(req.query.helpswith) {

    if (req.query.helpswith === "cv") {
      findQuery['profile.helpsWith.cvChecked'] = true;
    }

    else if(req.query.helpswith === "general advice") {
      findQuery['profile.helpsWith.questionsChecked'] = true;
    }

    else if(req.query.helpswith === "interviews") {
      findQuery['profile.helpsWith.checkedInterviews'] = true;
    }
  }

  if (req.query.firstname) {
    findQuery.firstName = new RegExp(req.query.firstname, "i");
  }

  if (req.query.experience) {
    findQuery['profile.experience.company'] = new RegExp(req.query.experience, "i");
  }

  if (req.query.education) {
    findQuery['profile.education.schoolName'] = new RegExp(req.query.education, "i");
  }

  if (req.query.interest) {
    findQuery['profile.interest.interest'] = new RegExp(req.query.interest, "i");
  }

  if (req.query.location) {
    findQuery['profile.location'] = new RegExp(req.query.location, "i");
  }

  //the query text also has to go in somewhere

  User.find(findQuery, '-salt -password -accessToken -refreshToken').where('roles', 'mentor').populate('user', 'displayName').exec(function(err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.json(users);
  });
};

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findById(id, '-salt -password -accessToken -refreshToken').exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load user ' + id));
    }

    req.model = user;
    next();
  });
};

exports.points = function(req, res) {
  User.findById(req.params.userId).exec(function(err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    users.points += 1;
    users.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    });
  });
};
