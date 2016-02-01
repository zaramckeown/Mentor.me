'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Articles Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/questions',
      permissions: '*'
    }, {
      resources: '/api/questions/:questionId',
      permissions: '*'
    }, {
      resources: '/api/questions/:questionId/upvote',
      permissions: ['*']
    }, {
      resources: '/api/questions/:questionId/downvote',
      permissions: ['*']
    }, {
      resources: '/api/questions/:questionId/upvotecomments',
      permissions: ['*']
    }, {
      resources: '/api/questions/:questionId/downvotecomments',
      permissions: ['*']
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/questions',
      permissions: ['get', 'post']
    }, {
      resources: '/api/questions/:questionId',
      permissions: ['get']
    }, {
      resources: '/api/questions/:questionId/upvote',
      permissions: ['post']
    }, {
      resources: '/api/questions/:questionId/downvote',
      permissions: ['post']
    }, {
      resources: '/api/questions/:questionId/upvotecomments',
      permissions: ['post']
    }, {
      resources: '/api/questions/:questionId/downvotecomments',
      permissions: ['post']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/questions',
      permissions: ['']
    }, {
      resources: '/api/questions/:questionId',
      permissions: ['']
    }]
  }]);
};
/**
 * Check If Articles Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  /*
   // If an article is being processed and the current user created it then allow any manipulation
   if (req.question && req.user && req.question.user.id === req.user.id) {
   return next();
   }

   */

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred.
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
