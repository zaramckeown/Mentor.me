'use strict';

// Configuring the Articles module
angular.module('careers').run(['Menus',
  function (Menus) {
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Careers',
      state: 'careers',
      type: 'dropdown',
      roles: ['student', 'mentor']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'careers', {
      title: 'List Careers',
      state: 'careers.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'careers', {
      title: 'Create a Listing',
      state: 'careers.create',
      roles: ['student', 'mentor']
    });
  }
]);
