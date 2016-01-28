'use strict';

// Configuring the Articles module
angular.module('profile').run(['Menus',
  function (Menus) {
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Search Mentors',
      state: 'profile',
      type: 'item',
      roles: ['admin', 'student', 'mentor']
    });
  }
]);
