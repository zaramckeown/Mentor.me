'use strict';

// Configuring the Articles module
angular.module('messages').run(['Menus',
  function (Menus) {
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Messages',
      state: 'messages.list',
      type: 'item',
      roles: ['admin', 'student', 'mentor']
    });
  }
]);
