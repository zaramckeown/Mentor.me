'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Admin Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['student', 'mentor', 'admin'],
    allows: [{
      resources: '/api/users',
      permissions: ['get']
    }, {
      resources: '/api/search',
      permissions: ['get']
    }, {
      resources: '/api/users/:userId/profile',
      permissions: ['get']
    }, {
      resources: '/api/users/:userId',
      permissions: ['get']
    }, {
      resources: '/api/recommendedMentor/:userId',
      permissions: ['get']
    }, {
      resources: '/api/points/:userId',
      permissions: ['post']
    }, {
      resources: '/api/topMentor',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Admin Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
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
