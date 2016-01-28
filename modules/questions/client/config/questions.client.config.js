'use strict';

// Configuring the Articles module
angular.module('questions').run(['Menus',
  function (Menus) {
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Questions',
      state: 'questions',
      type: 'dropdown',
      roles: ['user', 'admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'questions', {
      title: 'List Questions',
      state: 'questions.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'questions', {
      title: 'Create Questions',
      state: 'questions.create'
    });
  }
]);
