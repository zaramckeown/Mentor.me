'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
  // Init module configuration options
  var applicationModuleName = 'mean';
  var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ngMessages', 'ui.router', 'ui.bootstrap', 'ui.utils', 'angularFileUpload', 'ngMaterial', 'angularjs-dropdown-multiselect', 'ngDialog', 'angular-advanced-searchbox'];

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$httpProvider',
  function ($locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');

    $httpProvider.interceptors.push('authInterceptor');
  }
]);

angular.module(ApplicationConfiguration.applicationModuleName).run(["$rootScope", "$state", "Authentication", function ($rootScope, $state, Authentication) {

  // Check authentication before changing state
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
      var allowed = false;
      toState.data.roles.forEach(function (role) {
        if ((role === 'guest') || (Authentication.user && Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1)) {
          allowed = true;
          return true;
        }
      });

      if (!allowed) {
        event.preventDefault();
        if (Authentication.user !== undefined && typeof Authentication.user === 'object') {
          $state.go('forbidden');
        } else {
          $state.go('authentication.signin').then(function () {
            storePreviousState(toState, toParams);
          });
        }
      }
    }
  });

  // Record previous state
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    storePreviousState(fromState, fromParams);
  });

  // Store previous state
  function storePreviousState(state, params) {
    // only store this state if it shouldn't be ignored 
    if (!state.data || !state.data.ignoreState) {
      $state.previous = {
        state: state,
        params: params,
        href: $state.href(state, params)
      };
    }
  }
}]);

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash && window.location.hash === '#_=_') {
    if (window.history && history.pushState) {
      window.history.pushState('', document.title, window.location.pathname);
    } else {
      // Prevent scrolling by storing the page's current scroll offset
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = '';
      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('careers');

(function (app) {
  'use strict';

  app.registerModule('chat');
  app.registerModule('chat.routes', ['ui.router']);
})(ApplicationConfiguration);

'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('core');
ApplicationConfiguration.registerModule('core.admin', ['core']);
ApplicationConfiguration.registerModule('core.admin.routes', ['ui.router']);
ApplicationConfiguration.registerModule('core.profile', ['core']);

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('messages');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('questions');
ApplicationConfiguration.registerModule('questions.comments');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users', ['core']);
ApplicationConfiguration.registerModule('users.admin', ['core.admin']);
ApplicationConfiguration.registerModule('users.admin.routes', ['core.admin.routes']);
ApplicationConfiguration.registerModule('users.profile.routes');

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

'use strict';

// Setting up route
angular.module('careers').config(['$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider
      .state('careers', {
        abstract: true,
        url: '/careers',
        template: '<ui-view/>'
      })
      .state('careers.list', {
        url: '',
        templateUrl: 'modules/careers/client/views/list-careers.client.view.html'
      })
      .state('careers.create', {
        url: '/create',
        templateUrl: 'modules/careers/client/views/create-careers.client.view.html',
        data: {
          roles: ['student', 'mentor']
        }
      })
      .state('careers.view', {
        url: '/:articleId',
        templateUrl: 'modules/careers/client/views/view-careers.client.view.html'
      })
      .state('careers.edit', {
        url: '/:articleId/edit',
        templateUrl: 'modules/careers/client/views/edit-careers.client.view.html',
        data: {
          roles: ['student', 'mentor']
        }
      });
  }
]);

'use strict';

// Articles controller
angular.module('careers').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
  function ($scope, $stateParams, $location, Authentication, Articles) {
    $scope.authentication = Authentication;

    // Create new Article
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      // Create new Article object
      var article = new Articles({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      article.$save(function (response) {
        $location.path('articles/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Article
    $scope.remove = function (article) {
      if (article) {
        article.$remove();

        for (var i in $scope.articles) {
          if ($scope.articles[i] === article) {
            $scope.articles.splice(i, 1);
          }
        }
      } else {
        $scope.article.$remove(function () {
          $location.path('articles');
        });
      }
    };

    // Update existing Article
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      var article = $scope.article;

      article.$update(function () {
        $location.path('articles/' + article._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Articles
    $scope.find = function () {
      $scope.articles = Articles.query();
    };

    // Find existing Article
    $scope.findOne = function () {
      $scope.article = Articles.get({
        articleId: $stateParams.articleId
      });
    };
  }
]);

'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('careers').factory('Articles', ['$resource',
  function ($resource) {
    return $resource('api/careers/:careersId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

(function () {
  'use strict';

  angular
    .module('chat')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Chat',
      state: 'chat',
      roles: ['mentor', 'admin', 'student']
    });
  }
})();

(function () {
  'use strict';

  angular
    .module('chat.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('chat', {
        url: '/chat',
        templateUrl: 'modules/chat/client/views/chat.client.view.html',
        controller: 'ChatController',
        controllerAs: 'vm',
        data: {
          roles: ['student', 'mentor', 'admin']
        }
      });
  }
})();

(function () {
  'use strict';

  angular.module('chat').controller('ChatController', ['$scope', '$state', 'Authentication', 'Socket',
    function ($scope, $state, Authentication, Socket) {
      var vm = this;

      vm.messages = [];
      vm.messageText = '';
      vm.sendMessage = sendMessage;

      init();

      function init() {
        // If user is not signed in then redirect back home
        if (!Authentication.user) {
          $state.go('home');
        }

        // Make sure the Socket is connected
        if (!Socket.socket) {
          Socket.connect();
        }

        // Add an event listener to the 'chatMessage' event
        Socket.on('chatMessage', function (message) {
          vm.messages.unshift(message);
        });

        // Remove the event listener when the controller instance is destroyed
        $scope.$on('$destroy', function () {
          Socket.removeListener('chatMessage');
        });
      }

      // Create a controller method for sending messages
      function sendMessage() {
        // Create a new message object
        var message = {
          text: vm.messageText
        };

        // Emit a 'chatMessage' message event
        Socket.emit('chatMessage', message);

        // Clear the message text
        vm.messageText = '';
      }
    }]);
})();

'use strict';

angular.module('core.admin').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Admin',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin']
    });
  }
]);

'use strict';

// Setting up route
angular.module('core.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      });
  }
]);

'use strict';

// Configuring the Articles module
angular.module('core.profile').run(['Menus',
  function (Menus) {
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Search Mentors',
      state: 'profile.search',
      type: 'item',
      roles: ['admin', 'student']
    });
  }
]);

(function () {
  'use strict';

  angular
  .module('core')
  .run(MenuConfig);

  MenuConfig.$inject = ['Menus'];

  function MenuConfig(Menus) {

    Menus.addMenu('account', {
      roles: ['student', 'mentor']
    });

    Menus.addMenuItem('account', {
      title: '',
      state: 'settings',
      type: 'dropdown',
      roles: ['student', 'mentor']
    });

    Menus.addSubMenuItem('account', 'settings', {
      title: 'Edit Profile',
      state: 'settings.profile'
    });

    Menus.addSubMenuItem('account', 'settings', {
      title: 'Change Password',
      state: 'settings.password'
    });

    Menus.addSubMenuItem('account', 'settings', {
      title: 'Manage Social Accounts',
      state: 'settings.accounts'
    });

  }

})();

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
    .state('home', {
      url: '/',
      abstract: true,
      template: '<ui-view/>',
      controller: 'HomeController'
    })
    .state('home.mentor', {
      url:'student',
      templateUrl: 'modules/core/client/views/mentor.client.view.html'
    })
    .state('home.student', {
      url:'mentor',
      templateUrl: 'modules/core/client/views/student.client.view.html'
    })
    .state('home.default', {
      url:'',
      templateUrl: 'modules/core/client/views/home.client.view.html'
    })
    .state('contact', {
      url:'/contact',
      templateUrl: 'modules/core/client/views/contact.client.view.html'
    })
    .state('aboutus', {
      url:'/aboutus',
      templateUrl: 'modules/core/client/views/aboutus.client.view.html'
    })
    .state('not-found', {
    url: '/not-found',
    templateUrl: 'modules/core/client/views/404.client.view.html',
    data: {
      ignoreState: true
    }
    })
    .state('bad-request', {
      url: '/bad-request',
      templateUrl: 'modules/core/client/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('forbidden', {
      url: '/forbidden',
      templateUrl: 'modules/core/client/views/403.client.view.html',
      data: {
        ignoreState: true
      }
    });
  }
]);

'use strict';

angular.module('core').controller('ContactFormController', ['$scope', '$http', '$mdToast', '$animate',
  function($scope, $http, $mdToast, $animate) {

    $scope.toastPosition = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };
    $scope.getToastPosition = function () {
      return Object.keys($scope.toastPosition)
        .filter(function (pos) {
          return $scope.toastPosition[pos];
        })
        .join(' ');
    };

    $scope.sendMail = function (isValid) {

      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'contactForm');
        return false;
      }

      var data = ({
        contactName : this.contactName,
        contactEmail : this.contactEmail,
        contactMsg : this.contactMsg
      });

      // Simple POST request example (passing data) :
      $http.post('/contact-form', data).
      success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available

        // Clear form fields
        $scope.contactName = '';
        $scope.contactEmail = '';
        $scope.contactMsg = '';

        $mdToast.show(
          $mdToast.simple()
            .content('Thanks for your message ' + data.contactName + ' we will get back to you soon!')
            .position($scope.getToastPosition())
            .hideDelay(5000)
        );

      }).
      error(function(data, status, headers, config) {
          $scope.error = data.message;
      });

    };
  }
]);

'use strict';

angular.module('core').controller('DefaultController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;


  }
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
  function ($scope, $state, Authentication, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Get the account menu
    $scope.accountMenu = Menus.getMenu('account').items[0];

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);

'use strict';
new WOW().init();
angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$state',
  function ($scope, Authentication, $state) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    if ($scope.authentication.user !== "") {

      if ($scope.authentication.user.roles[0] === 'mentor') {
        $state.go('home.mentor');
      }

      if ($scope.authentication.user.roles[0] === 'student') {
        $state.go('home.student');
      }
    }
    else {
      $state.go('home.default');
    }
  }
]);

'use strict';

angular.module('core').controller('MentorController', ['$scope', 'Authentication', '$http',
  function ($scope, Authentication, $http) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    $http.get('/api/mentor/questions').then(function(successCallback) {
      $scope.newQuestions = successCallback.data;
    }, function (errorCallback) {
      console.log(errorCallback);
    });

    $http.get('/api/messages').then(function(successCallback) {
      $scope.messages = successCallback.data;
    }, function (errorCallback) {
      console.log(errorCallback);
    });

    $http.get('/api/topMentor').then(function(successCallback) {
      $scope.topMentors = successCallback.data;
    }, function (errorCallback) {
      console.log(errorCallback);
    });

    $scope.passForMessages = function(index) {
      $scope.messages.splice(index, 1);
    };

    $scope.passForQuestions = function (index) {
      $scope.newQuestions.splice(index, 1);
    };
  }
]);

'use strict';

angular.module('core').controller('StudentController', ['$scope', 'Authentication', '$http',
  function ($scope, Authentication, $http) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    $http.get('/api/recommendedMentor/'+$scope.authentication.user.id).then(function(successCallback) {

      $scope.mentors = successCallback.data;
    }, function(errorCallback) {

    });

    $http.get('/api/topMentor').then(function(successCallback) {
      $scope.topMentors = successCallback.data;
    }, function (errorCallback) {
      console.log(errorCallback);
    });

    $http.get('/api/student/questions').then(function(successCallback) {

      $scope.newQuestions = successCallback.data;
    }, function(errorCallback) {

    });

    $scope.passForQuestion = function(index) {
      $scope.newQuestions.splice(index, 1);
    };

    $scope.passForMentor = function(index) {
      $scope.mentors.splice(index, 1);
    };
  }
]);

'use strict';

/**
 * Edits by Ryan Hutchison
 * Credit: https://github.com/paulyoder/angular-bootstrap-show-errors */

angular.module('core')
  .directive('showErrors', ['$timeout', '$interpolate', function ($timeout, $interpolate) {
    var linkFn = function (scope, el, attrs, formCtrl) {
      var inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses,
        initCheck = false,
        showValidationMessages = false,
        blurred = false;

      options = scope.$eval(attrs.showErrors) || {};
      showSuccess = options.showSuccess || false;
      inputEl = el[0].querySelector('.form-control[name]') || el[0].querySelector('[name]');
      inputNgEl = angular.element(inputEl);
      inputName = $interpolate(inputNgEl.attr('name') || '')(scope);

      if (!inputName) {
        throw 'show-errors element has no child input elements with a \'name\' attribute class';
      }

      var reset = function () {
        return $timeout(function () {
          el.removeClass('has-error');
          el.removeClass('has-success');
          showValidationMessages = false;
        }, 0, false);
      };

      scope.$watch(function () {
        return formCtrl[inputName] && formCtrl[inputName].$invalid;
      }, function (invalid) {
        return toggleClasses(invalid);
      });

      scope.$on('show-errors-check-validity', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          initCheck = true;
          showValidationMessages = true;

          return toggleClasses(formCtrl[inputName].$invalid);
        }
      });

      scope.$on('show-errors-reset', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          return reset();
        }
      });

      toggleClasses = function (invalid) {
        el.toggleClass('has-error', showValidationMessages && invalid);
        if (showSuccess) {
          return el.toggleClass('has-success', showValidationMessages && !invalid);
        }
      };
    };

    return {
      restrict: 'A',
      require: '^form',
      compile: function (elem, attrs) {
        if (attrs.showErrors.indexOf('skipFormGroupCheck') === -1) {
          if (!(elem.hasClass('form-group') || elem.hasClass('input-group'))) {
            throw 'show-errors element does not have the \'form-group\' or \'input-group\' class';
          }
        }
        return linkFn;
      }
    };
  }]);

'use strict';

angular.module('core').factory('authInterceptor', ['$q', '$injector', 'Authentication',
  function ($q, $injector, Authentication) {
    return {
      responseError: function(rejection) {
        if (!rejection.config.ignoreAuthModule) {
          switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              $injector.get('$state').transitionTo('authentication.signin');
              break;
            case 403:
              $injector.get('$state').transitionTo('forbidden');
              break;
          }
        }
        // otherwise, default behaviour
        return $q.reject(rejection);
      }
    };
  }
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [
  function () {
    // Define a set of default roles
    this.defaultRoles = ['student', 'mentor'];

    // Define the menus object
    this.menus = {};

    // A private function for rendering decision
    var shouldRender = function (user) {
      if (!!~this.roles.indexOf('*')) {
        return true;
      } else {
        if(!user) {
          return false;
        }
        for (var userRoleIndex in user.roles) {
          for (var roleIndex in this.roles) {
            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
              return true;
            }
          }
        }
      }

      return false;
    };

    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exist');
        }
      } else {
        throw new Error('MenuId was not provided');
      }

      return false;
    };

    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      return this.menus[menuId];
    };

    // Add new menu object by menu id
    this.addMenu = function (menuId, options) {
      options = options || {};

      // Create the new menu
      this.menus[menuId] = {
        roles: options.roles || this.defaultRoles,
        items: options.items || [],
        shouldRender: shouldRender
      };

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      delete this.menus[menuId];
    };

    // Add menu item object
    this.addMenuItem = function (menuId, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Push new menu item
      this.menus[menuId].items.push({
        title: options.title || '',
        state: options.state || '',
        type: options.type || 'item',
        class: options.class,
        roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.defaultRoles : options.roles),
        position: options.position || 0,
        items: [],
        shouldRender: shouldRender
      });

      // Add submenu items
      if (options.items) {
        for (var i in options.items) {
          this.addSubMenuItem(menuId, options.state, options.items[i]);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Add submenu item object
    this.addSubMenuItem = function (menuId, parentItemState, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === parentItemState) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: options.title || '',
            state: options.state || '',
            roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : options.roles),
            position: options.position || 0,
            shouldRender: shouldRender
          });
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === menuItemState) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].state === submenuItemState) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    //Adding the topbar menu
    this.addMenu('topbar', {
      roles: ['*']
    });
  }
]);

'use strict';

// Create the Socket.io wrapper service
angular.module('core').service('Socket', ['Authentication', '$state', '$timeout',
  function (Authentication, $state, $timeout) {
    // Connect to Socket.io server
    this.connect = function () {
      // Connect only when authenticated
      if (Authentication.user) {
        this.socket = io();
      }
    };
    this.connect();

    // Wrap the Socket.io 'on' method
    this.on = function (eventName, callback) {
      if (this.socket) {
        this.socket.on(eventName, function (data) {
          $timeout(function () {
            callback(data);
          });
        });
      }
    };

    // Wrap the Socket.io 'emit' method
    this.emit = function (eventName, data) {
      if (this.socket) {
        this.socket.emit(eventName, data);
      }
    };

    // Wrap the Socket.io 'removeListener' method
    this.removeListener = function (eventName) {
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
    };
  }
]);

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

'use strict';

// Setting up route
angular.module('messages').config(['$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider
      .state('messages', {
        abstract: true,
        url: '/messages/:userId',
        template: '<ui-view/>'
      })
      .state('messages.create', {
        url: '/create',
        templateUrl: 'modules/messages/client/views/messages.client.view.html',
        data: {
          roles: ['student','mentor', 'admin']
        }
      })
      .state('messages.view', {
        url: '/:messageId',
        templateUrl: 'modules/messages/client/views/messages.client.view.html'
      })
      .state('messages.list', {
        url: '',
        templateUrl: 'modules/messages/client/views/messages.client.view.html'
      });
  }
]);

'use strict';

// Messages controller
angular.module('messages').controller('MessagesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Messages', '$filter', '$http', '$window',
  function ($scope, $stateParams, $location, Authentication, Messages, $filter, $http, $window) {
    $scope.authentication = Authentication;

    // Create new Message
    $scope.create = function (convoId, isValid) {

      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'messageForm');
        return false;
      }

      // Create new Message object
      var message = new Messages.lookup({
        content: this.content,
        conversationId: convoId
      });

      // Redirect after save
      message.$save(function (response) {
        $scope.showMessages = Messages.messageByIdLookUp.get({
          messageId: convoId
        });
        $location.path('messages/');

        // Clear form fields
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      if ($scope.authentication.user.roles[0] === 'mentor') {
        $http.post('/api/points/'+$scope.authentication.user.id);
      }
    };

    $scope.removeConvo = function (message) {
      $http.post('/api/messages/' + message._id).then(
        function (response) {
          for (var i = 0; i < $scope.messages.length; i++) {
            if ($scope.messages[i]._id === message._id) {
              $scope.messages.splice([i], 1);

              $scope.showMessages = Messages.messageByIdLookUp.get({
                messageId: $scope.messages[0]._id
              });
            }
          }
        },
        function (response) {
          $scope.error = response.message;
        }
      );
    };

    $scope.find = function (messageId) {

      $scope.showMessages = Messages.messageByIdLookUp.get({
        messageId: messageId
      });
    };

    $scope.formatDate = function (date) {
      var dateOut = new Date(date);
      return dateOut;
    };

    // Find a list of messages for user
    $scope.findMessages = function () {
      $scope.messages = Messages.lookup.query(function(data) {

        if ($stateParams.userId !== "") {
          $scope.showMessages = Messages.messageByIdLookUp.get({
            messageId: $stateParams.userId
          });

          if (!data[0].messages.length) {
            $scope.content = "Below is a potential template to initiate the conversation: \n\nHi ______, \n\nMy name" +
              " is" +
              " _________. I am" +
              " currently" +
              " studying ______" +
              " at _______." +
              " \n" +
              "I am wondering  if you could help me with ____________. \n\nThanks, \n_______.";
          }
        }
        else {

          if ($scope.messages.length !== 0) {
            var convoId;

            for (var count = 0; count < data.length; count++){
              convoId = data[0]._id;
              if (!data[0].messages.length) {
                $scope.content = "Below is a potential template to initiate the conversation: \n\nHi ______, \n\nMy name" +
                  " is" +
                  " _________. I am" +
                  " currently" +
                  " studying ______" +
                  " at _______." +
                  " \n" +
                  "I am wondering  if you could help me with ____________. \n\nThanks, \n_______.";
              }
            }

            $scope.showMessages = Messages.messageByIdLookUp.get({
              messageId: convoId
            });

          }
          else{

            $scope.messages = null;
            $scope.showMessages = null;
          }
        }
      }, function(error) {
        console.log(error);
      });
    };
  }
]);

angular.module('messages').filter('cut', function () {
  return function (value, wordwise, max, tail) {
    if (!value) return '';

    max = parseInt(max, 10);
    if (!max) return value;
    if (value.length <= max) return value;

    value = value.substr(0, max);
    if (wordwise) {
      var lastspace = value.lastIndexOf(' ');
      if (lastspace !== -1) {
        //Also remove . and , so its gives a cleaner result.
        if (value.charAt(lastspace-1) === '.' || value.charAt(lastspace-1) === ',') {
          lastspace = lastspace - 1;
        }
        value = value.substr(0, lastspace);
      }
    }

    return value + (tail || ' …');
  };
});


'use strict';

angular.module('messages').factory('Messages', ['$resource',
  function ($resource) {
    return {
      lookup: $resource('api/messages', {
      }, {
        update: {
          method: 'PUT'
        }
      }),
      messageByIdLookUp: $resource('/api/messages/:messageId',{
        messageId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      })
    };
  }
]);

'use strict';

// Setting up route
angular.module('questions.comments').config(['$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider
    .state('comments.addComment', {
      url: '/:id/comments',
      templateUrl: 'modules/questions/client/views/view-question.client.view.html',
      controller: 'QuestionsController'
    });
  }
]);

'use strict';

// Configuring the Articles module
angular.module('questions').run(['Menus',
  function (Menus) {
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Questions',
      state: 'questions',
      type: 'dropdown',
      roles: ['mentor', 'admin', 'student']
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

'use strict';

// Setting up route
angular.module('questions').config(['$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider
      .state('questions', {
        abstract: true,
        url: '/questions',
        template: '<ui-view/>'
      })
      .state('questions.list', {
        url: '',
        templateUrl: 'modules/questions/client/views/list-question.client.view.html'
      })
      .state('questions.create', {
        url: '/create',
        templateUrl: 'modules/questions/client/views/create-question.client.view.html'
      })
      .state('questions.view', {
        url: '/:questionId',
        templateUrl: 'modules/questions/client/views/view-question.client.view.html'
      })
      .state('questions.edit', {
        url: '/:questionId/edit',
        templateUrl: 'modules/questions/client/views/edit-question.client.view.html'
      });
  }
]);

'use strict';

// Questions controller
angular.module('questions').controller('QuestionsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Comments', 'Questions', 'ngDialog', '$filter',
  function ($scope, $http, $stateParams, $location, Authentication, Comments, Questions, ngDialog, $filter) {
    $scope.authentication = Authentication;
    $scope.currentUser = Authentication.user.id;

    // Create new Question
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'questionForm');
        return false;
      }

      // Create new Question object
      var question = new Questions({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      question.$save(function (response) {
        $location.path('questions/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.upvote = function (questionId) {
      var currentQuestion = $scope.pagedItems;
      for (var i=0; i<$scope.pagedItems.length; i++)
      {
        if(currentQuestion[i]._id === questionId)
        {
          if (currentQuestion[i].user._id === $scope.currentUser) {
            $scope.ownerQuestion();
            return;
          }

          if (currentQuestion[i].usersWhoUpvoted.indexOf($scope.currentUser) === -1) {
            var path = '/api/questions/' + questionId + '/upvote';
            $http.post(path);
            location.reload();
          } else {
            $scope.alreadyVoted();
          }
        }
      }

      if ($scope.authentication.user.roles[0] === 'mentor') {
        $http.post('/api/points/'+$scope.currentUser);
      }
    };

    $scope.downvote = function (questionId) {
      var currentQuestion = $scope.pagedItems;

      for (var i=0; i<$scope.pagedItems.length; i++) {
        if (currentQuestion[i]._id === questionId) {

          if (currentQuestion[i].user._id === $scope.currentUser) {
            $scope.ownerQuestion();
            return;
          }

          if (currentQuestion[i].usersWhoDownvoted.indexOf($scope.currentUser) === -1) {
            var path = '/api/questions/' + questionId + '/downvote';
            $http.post(path);
            location.reload();
          } else {
            $scope.alreadyVoted();
          }
        }
      }
      if ($scope.authentication.user.roles[0] === 'mentor') {
        $http.post('/api/points/'+$scope.currentUser);
      }
    };

    $scope.addComment = function () {
      var comment = new Comments({
        body: this.comment,
        question: this.question.question
      });

      if ($scope.comment === '') {
        return;
      }
      // Redirect after save
      comment.$save({ id: $stateParams.questionId }, function (response) {
        location.reload();
        // Clear form fields
        $scope.body = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });

      if ($scope.authentication.user.roles[0] === 'mentor') {
        $http.post('/api/points/' + $scope.currentUser);
      }
    };

    $scope.upvoteComment = function (questionId, commentId) {
      var currentQuestion = $scope.pagedItems;
      var comments = '';
      for (var i=0; i<$scope.pagedItems.length; i++) {
        if (currentQuestion[i]._id === questionId) {
          comments = currentQuestion[i].comments;
        }
      }
      // find comment here
      var commentIndex = -1;
      for (var index = 0; index < comments.length; index = index + 1) {
        if (comments[index]._id === commentId) {
          commentIndex = index;
          break;
        }
      }

      if (commentIndex === -1) {
        return;
      }

      var comment = comments[commentIndex];
      if (comment.user._id === $scope.currentUser) {
        $scope.ownerComment();
        return;
      }
      if (comment.usersWhoUpvoted.indexOf($scope.currentUser) === -1) {
        var path = '/api/questions/' + questionId + '/upvoteComments/' + commentId;
        $http.post(path);
        location.reload();
      } else {
        $scope.votedComment();
      }

      if ($scope.authentication.user.roles[0] === 'mentor') {
        $http.post('/api/points/'+$scope.currentUser);
      }
    };

    $scope.downvoteComment = function (questionId, commentId) {
      var currentQuestion = $scope.pagedItems;
      var comments = '';
      for (var i=0; i<$scope.pagedItems.length; i++) {
        if (currentQuestion[i]._id === questionId) {
          comments = currentQuestion[i].comments;
        }
      }
      
      // find comment here
      var commentIndex = -1;
      for (var index = 0; index < comments.length; index = index + 1) {
        if (comments[index]._id === commentId) {
          commentIndex = index;
          break;
        }
      }
      
      if (commentIndex === -1) {
        return;
      }
      
      var comment = comments[commentIndex];
      if (comment.user._id === $scope.currentUser) {
        $scope.ownerComment();
        return;
      }
      if (comment.usersWhoDownvoted.indexOf($scope.currentUser) === -1) {
        var path = '/api/questions/' + questionId + '/downvoteComments/' + commentId;
        $http.post(path);
        location.reload();    
      } else {
        $scope.votedComment();
      }

      if ($scope.authentication.user.roles[0] === 'mentor') {
        $http.post('/api/points/'+$scope.currentUser);
      }
    };

    // Remove existing Article
    $scope.remove = function (question) {
      if (question) {
        question.$remove();

        for (var i in $scope.question) {
          if ($scope.question[i] === question) {
            $scope.question.splice(i, 1);
          }
        }
      } else {
        $scope.question.$remove(function () {
          $location.path('questions');
        });
      }
    };

    // Update existing Article
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'questionsForm');

        return false;
      }

      var question = $scope.question;

      question.$update(function () {
        $location.path('questions/' + question._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
/*
    // Find a list of all questions
    $scope.find = function () {
      $scope.questions = Questions.query();
      $scope.buildPager();
    };*/

    Questions.query(function (data) {
      $scope.questions = data;
      $scope.buildPager();
    });

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 4;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.questions, {
        $: $scope.search
      });

      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };

    // Find existing Article
    $scope.findOne = function () {
      $scope.question = Questions.get({
        questionId: $stateParams.questionId
      },
        function (successResponse) {

          if (successResponse.usersWhoUpvoted.length > 0){
            $scope.upvotedOrNot = successResponse.usersWhoUpvoted.indexOf($scope.currentUser._str) === -1;
          }
          else{
            $scope.upvotedOrNot = false;
          }

          if (successResponse.usersWhoDownvoted.length > 0){
            $scope.downvotedOrNot = successResponse.usersWhoDownvoted.indexOf($scope.currentUser._str) === -1;
          }
          else {
            $scope.downvotedOrNot = false;
          }
          $scope.buildPagerForOneQuestion();
        },
        function (errorResponse) {
          // failure callback
          console.log(errorResponse);
        }
      );

    };

    $scope.buildPagerForOneQuestion = function () {
      $scope.pagedItemsForOneQuestion = [];
      $scope.itemsPerPageForOneQuestion = 4;
      $scope.currentPageForOneQuestion = 1;
      $scope.figureOutItemsToDisplayForOneQuestion();
    };

    $scope.figureOutItemsToDisplayForOneQuestion = function () {
      $scope.filteredItemsForOneQuestion = $filter('filter')($scope.question.comments, {
        $: $scope.search
      });

      $scope.filterLengthForOneQuestion = $scope.filteredItemsForOneQuestion.length;
      var begin = (($scope.currentPageForOneQuestion - 1) * $scope.itemsPerPageForOneQuestion);
      var end = begin + $scope.itemsPerPageForOneQuestion;
      $scope.pagedItemsForOneQuestion = $scope.filteredItemsForOneQuestion.slice(begin, end);
    };

    $scope.pageChangedForOneQuestion = function () {
      $scope.figureOutItemsToDisplayForOneQuestion();
    };

    $scope.alreadyVoted = function () {
      ngDialog.open({ template: 'firstDialogId' });
    };

    $scope.ownerQuestion = function () {
      ngDialog.open({ template: 'ownerQuestion' });
    };
    
    $scope.votedComment = function () {
      ngDialog.open({ template: 'votedComment' });
    };

    $scope.ownerComment = function () {
      ngDialog.open({ template: 'ownerComment' });
    };
    
  }
]);

'use strict';

//Articles service used for communicating with the articles REST endpoints

angular.module('questions.comments').factory('Comments', ['$resource',
  function ($resource) {
    return $resource('api/questions/:id/comments', {
      update: {
        method: 'PUT'
      }
    });
  }
]);

'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('questions').factory('Questions', ['$resource',
  function ($resource) {
    return $resource('api/questions/:questionId', {
      questionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

'use strict';

// Setting up route
angular.module('users.profile.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('profile', {
        abstract: true,
        url: '/mentorSearch',
        template: '<ui-view/>',
        data: {
          roles: ['mentor', 'student']
        }
      })
      .state('profile.search', {
        url: '',
        templateUrl: 'modules/users/client/views/profile/profile.client.view.html',
        controller: 'MentorListController'
      })
      .state('profile.view', {
        url: '/users/:userId/profile',
        templateUrl: '/modules/users/client/views/profile/view-profile.client.view.html',
        controller: 'DisplayUserProfileController'
      });
  }
]);

'use strict';

// Configuring the Users module
angular.module('users.admin').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Users',
      state: 'admin.users'
    });
  }
]);

'use strict';

// Setting up route
angular.module('users.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        templateUrl: 'modules/users/client/views/admin/list-users.client.view.html',
        controller: 'UserListController'
      })
      .state('admin.user', {
        url: '/users/:userId',
        templateUrl: 'modules/users/client/views/admin/view-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      })
      .state('admin.user-edit', {
        url: '/users/:userId/edit',
        templateUrl: 'modules/users/client/views/admin/edit-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      });
  }
]);

'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider
      .state('settings', {
        abstract: true,
        url: '/settings',
        templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
        data: {
          roles: ['mentor', 'admin', 'student', 'newUser']
        }
      })
      .state('settings.profile', {
        url: '/profile',
        templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html'
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: 'modules/users/client/views/settings/change-password.client.view.html'
      })
      .state('settings.accounts', {
        url: '/accounts',
        templateUrl: 'modules/users/client/views/settings/manage-social-accounts.client.view.html'
      })
      .state('settings.role', {
        url: '/role',
        templateUrl: 'modules/users/client/views/settings/choose-role.html',
        data: {
          roles: ['newUser']
        }
      })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html'
      })
      .state('authentication.signup', {
        url: '/signup',
        templateUrl: 'modules/users/client/views/authentication/signup.client.view.html'
      })
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: 'modules/users/client/views/authentication/signin.client.view.html'
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: 'modules/users/client/views/password/forgot-password.client.view.html'
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: 'modules/users/client/views/password/reset-password-invalid.client.view.html'
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: 'modules/users/client/views/password/reset-password-success.client.view.html'
      })
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: 'modules/users/client/views/password/reset-password.client.view.html'
      });
  }
]);

'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin',
  function ($scope, $filter, Admin) {
    Admin.query(function (data) {
      $scope.users = data;
      $scope.buildPager();
    });

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };
  }
]);

'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'userResolve',
  function ($scope, $state, Authentication, userResolve) {
    $scope.authentication = Authentication;
    $scope.user = userResolve;

    $scope.remove = function (user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('admin.users');
          });
        }
      }
    };

    $scope.update = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = $scope.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator',
  function ($scope, $state, $http, $location, $window, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    $scope.signup = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page

        $window.location.href = '/settings/role';
       // $state.go('/settings/role');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };
  }
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'PasswordValidator',
  function ($scope, $stateParams, $http, $location, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    // Submit forgotten password account id
    $scope.askForPasswordReset = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'forgotPasswordForm');

        return false;
      }

      $http.post('/api/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;

      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };

    // Change user password
    $scope.resetUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'resetPasswordForm');

        return false;
      }

      $http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;

        // Attach user profile
        Authentication.user = response;

        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('core.profile').controller('MentorListController', ['$scope', '$filter', 'Profile', '$http', '$location',
  function ($scope, $filter, Profile, $http, $location) {

    Profile.Users.query(function (data) {
      $scope.users = data;
      $scope.buildPager();
    });

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.searchParams = {};
    $scope.availableSearchParams = [
      { key: "firstname", name: "Firstname", placeholder: "Name..." },
      { key: "location", name: "Location", placeholder: "Location..." },
      { key: "education", name: "Education", placeholder: "Education..." },
      { key: "experience", name: "Company", placeholder: "Company..." },
      { key: "interests", name: "Interest", placeholder: "Interest..." },
      { key: "helpswith", name: "Helps with", placeholder: "Helps with...", suggestedValues: ['cv', 'general advice', 'interviews'], restrictToSuggestedValues: true }
    ];

    $scope.$on('advanced-searchbox:addedSearchParam', function (event, searchParameter) {
      ///
    });

    $scope.$on('advanced-searchbox:removedSearchParam', function (event, searchParameter) {
      ///
    });

    $scope.$on('advanced-searchbox:removedAllSearchParam', function (event) {
      ///
    });

    $scope.$on('advanced-searchbox:enteredEditMode', function (event, searchParameter) {
      ///
    });

    $scope.$on('advanced-searchbox:leavedEditMode', function (event, searchParameter) {
      ///
    });

    $scope.$on('advanced-searchbox:modelUpdated', function (event, model) {
      Profile.Search.query(model, function(result)
      {
        $scope.users = result;
        $scope.buildPager();
      });
    });

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });

      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };

    $scope.sendMessage = function (userId) {

      $scope.messages = Profile.Messages.get({ recipientId: userId },
        function (successResponse) {
          var result = JSON.stringify($scope.messages);
          //console.log(Object.keys(result).length);

          if (Object.keys(result).length === 2) {
            var path = '/api/messages/create/' + userId;
            $http.post(path).then(function (success) {
              var messageId = success.data._id;
              $location.path('messages/' + messageId);
            }, function (error) {
              console.log(error);
            });
          }
          else {
            //console.log(successResponse);
            var messageId = successResponse._id;
            $location.path('messages/' + messageId);
          }
        },
        function (errorResponse) {
          // failure callback
          console.log(errorResponse);
        }
      );
    };
  }
]);

'use strict';

angular.module('users').controller('ChangePasswordController', ['$scope', '$http', 'Authentication', 'PasswordValidator',
  function ($scope, $http, Authentication, PasswordValidator) {
    $scope.user = Authentication.user;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Change user password
    $scope.changeUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'passwordForm');

        return false;
      }

      $http.post('/api/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.$broadcast('show-errors-reset', 'passwordForm');
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'FileUploader',
  function ($scope, $timeout, $window, Authentication, FileUploader) {
    $scope.user = Authentication.user;
    $scope.imageURL = $scope.user.profileImageURL;

    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/users/picture',
      alias: 'newProfilePicture'
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate user object
      $scope.user = Authentication.user = response;

      // Clear upload buttons
      $scope.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadProfilePicture = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.user.profileImageURL;
    };
  }
]);

'use strict';

angular.module('users').controller('ChangeRole', ['$scope', '$timeout', '$window', 'Authentication', 'Users',
  function ($scope, $timeout, $window, Authentication, Users) {
    $scope.user = Authentication.user;

    // Update a user profile
    $scope.updateUserProfile = function () {
      var user = new Users($scope.user);
      user.roles = "mentor";

      user.$update(function (response) {
        Authentication.user = response;
        $window.location.href = '/settings/profile';
      }, function (response) {
        $scope.error = response.data.message;
      });
    };

    $scope.updateUserProfileRoleStudent = function () {
      var user = new Users($scope.user);
      user.roles = "student";

      user.$update(function (response) {
        Authentication.user = response;
        $window.location.href = '/settings/profile';

      }, function (response) {
        $scope.error = response.data.message;
      });
    };

  }
]);

'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;

    $scope.eduD = {};
    $scope.eduD.sdt = [];
    $scope.eduD.edt = [];
    for (var i = 0; i < $scope.user.profile.education.length; i += 1) {
      $scope.eduD.sdt.push({ dt : new Date($scope.user.profile.education[i].startDate) });
      $scope.eduD.edt.push({ dt : new Date($scope.user.profile.education[i].endDate) });
    }

    $scope.expD = {};
    $scope.expD.sdt = [];
    $scope.expD.edt = [];
    for (i = 0; i < $scope.user.profile.experience.length; i += 1) {
      $scope.expD.sdt.push({ dt : new Date($scope.user.profile.experience[i].startDate) });
      $scope.expD.edt.push({ dt : new Date($scope.user.profile.experience[i].endDate) });
    }

    $scope.awardD = {};
    $scope.awardD.sdt = [];
    for (i = 0; i < $scope.user.profile.awards.length; i += 1) {
      $scope.awardD.sdt.push({ dt : new Date($scope.user.profile.awards[i].date) });
    }

    $scope.addNewEducation = function() {
      $scope.user.profile.education.push({ schoolName: '', description : '', startDate : new Date(), endDate : new Date(), courseTitle : '' });
      $scope.eduD.sdt.push({ dt : new Date($scope.user.profile.education[$scope.user.profile.education.length - 1].startDate) });
      $scope.eduD.edt.push({ dt : new Date($scope.user.profile.education[$scope.user.profile.education.length - 1].endDate) });
    };

    $scope.removeEducation = function(index) {
      $scope.user.profile.education.splice(index, 1);
      $scope.eduD.sdt.splice(index, 1);
      $scope.eduD.edt.splice(index, 1);
    };

    $scope.addNewExperience = function() {
      $scope.user.profile.experience.push({ company : '', description : '', startDate : new Date(), endDate : new Date() });
      $scope.expD.sdt.push({ dt : new Date($scope.user.profile.experience[$scope.user.profile.experience.length - 1].startDate) });
      $scope.expD.edt.push({ dt : new Date($scope.user.profile.experience[$scope.user.profile.experience.length - 1].endDate) });
    };

    $scope.removeExperience = function(index) {
      $scope.user.profile.experience.splice(index, 1);
      $scope.expD.sdt.splice(index, 1);
      $scope.expD.edt.splice(index, 1);
    };

    $scope.addNewAward = function() {
      $scope.user.profile.awards.push({ title : '', description : '', issuer : '', date : new Date() });
      $scope.awardD.sdt.push({ dt : new Date($scope.user.profile.awards[$scope.user.profile.awards.length - 1].date) });
    };

    $scope.removeAward = function(index) {
      $scope.user.profile.awards.splice(index, 1);
      $scope.awardD.sdt.splice(index, 1);
    };

    $scope.addNewInterest = function() {
      $scope.user.profile.interests.push({ item : '' });
    };

    $scope.removeInterest = function(index) {
      $scope.user.profile.interests.splice(index, 1);
    };

    $scope.addNewLink = function() {
      $scope.user.profile.links.push({ url : '' });
    };

    $scope.removeLink = function(index) {
      $scope.user.profile.links.splice(index, 1);
    };

    if ($scope.user.profile.education.length === 0) {
      $scope.addNewEducation();
    }

    if ($scope.user.profile.experience.length === 0) {
      $scope.addNewExperience();
    }

    if ($scope.user.profile.awards.length === 0) {
      $scope.addNewAward();
    }

    if ($scope.user.profile.interests.length === 0) {
      $scope.addNewInterest();
    }
    if ($scope.user.profile.links.length === 0) {
      $scope.addNewLink();
    }

    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = new Users($scope.user);

      user.profile.description = $scope.user.profile.description;
      user.profile.education = $scope.user.profile.education;
      user.profile.experience = $scope.user.profile.experience;
      user.profile.interests = $scope.user.profile.interests;
      user.profile.links = $scope.user.profile.links;
      user.profile.awards = $scope.user.profile.awards;

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('SocialAccountsController', ['$scope', '$http', 'Authentication',
  function ($scope, $http, Authentication) {
    $scope.user = Authentication.user;

    // Check if there are additional accounts
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }

      return false;
    };

    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
    };

    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;

      $http.delete('/api/users/accounts', {
        params: {
          provider: provider
        }
      }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    $scope.user = Authentication.user;
  }
]);

'use strict';

angular.module('core.profile').controller('DisplayUserProfileController', ['$scope', '$state', 'Authentication', '$stateParams', '$http', 'Profile', '$location',
  function ($scope, $state, Authentication, $stateParams, $http, Profile, $location) {
    $scope.authentication = Authentication;

    var path = '/api/users/' + $stateParams.userId;
    $http.get(path).success(function(data) {
      $scope.user = data;

      $scope.eduD = {};
      $scope.eduD.sdt = [];
      $scope.eduD.edt = [];

      for (var i = 0; i < $scope.user.profile.education.length; i += 1) {
        $scope.eduD.sdt.push({ dt : new Date($scope.user.profile.education[i].startDate) });
        $scope.eduD.edt.push({ dt : new Date($scope.user.profile.education[i].endDate) });
      }

      $scope.expD = {};
      $scope.expD.sdt = [];
      $scope.expD.edt = [];
      for (i = 0; i < $scope.user.profile.experience.length; i += 1) {
        $scope.expD.sdt.push({ dt : new Date($scope.user.profile.experience[i].startDate) });
        $scope.expD.edt.push({ dt : new Date($scope.user.profile.experience[i].endDate) });
      }

      $scope.awardD = {};
      $scope.awardD.sdt = [];
      for (i = 0; i < $scope.user.profile.awards.length; i += 1) {
        $scope.awardD.sdt.push({ dt : new Date($scope.user.profile.awards[i].date) });
      }
    });

    $scope.sendMessage = function (userId) {

      $scope.messages = Profile.Messages.get({ recipientId: userId },
        function (successResponse) {
          var result = JSON.stringify($scope.messages);
          //console.log(Object.keys(result).length);

          if (Object.keys(result).length === 2) {
            var path = '/api/messages/create/' + userId;
            $http.post(path).then(function (success) {
              var messageId = success.data._id;
              $location.path('messages/' + messageId);
            }, function (error) {
              console.log(error);
            });
          }
          else {
            //console.log(successResponse);
            var messageId = successResponse._id;
            $location.path('messages/' + messageId);
          }
        },
        function (errorResponse) {
          // failure callback
          console.log(errorResponse);
        }
      );
    };
  }
]);

'use strict';

angular.module('users').directive("verifyPassword", function() {
  return {
    require: "ngModel",
    scope: {
      passwordVerify: '='
    },
    link: function(scope, element, attrs, ctrl) {
      scope.$watch(function() {
        var combined;

        if (scope.passwordVerify || ctrl.$viewValue) {
          combined = scope.passwordVerify + '_' + ctrl.$viewValue;
        }
        return combined;
      }, function(value) {
        if (value) {
          ctrl.$parsers.unshift(function(viewValue) {
            var origin = scope.passwordVerify;
            if (origin !== viewValue) {
              ctrl.$setValidity("passwordVerify", false);
              return undefined;
            } else {
              ctrl.$setValidity("passwordVerify", true);
              return viewValue;
            }
          });
        }
      });
    }
  };
});

'use strict';

angular.module('users')
  .directive('passwordValidator', ['PasswordValidator', function(PasswordValidator) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$validators.requirements = function (password) {
          var status = true;
          if (password) {
            var result = PasswordValidator.getResult(password);
            var requirementsIdx = 0;

            // Requirements Meter - visual indicator for users
            var requirementsMeter = [
              { color: 'danger', progress: '20' },
              { color: 'warning', progress: '40' },
              { color: 'info', progress: '60' },
              { color: 'primary', progress: '80' },
              { color: 'success', progress: '100' }
            ];

            if (result.errors.length < requirementsMeter.length) {
              requirementsIdx = requirementsMeter.length - result.errors.length - 1;
            }

            scope.requirementsColor = requirementsMeter[requirementsIdx].color;
            scope.requirementsProgress = requirementsMeter[requirementsIdx].progress;

            if (result.errors.length) {
              scope.popoverMsg = PasswordValidator.getPopoverMsg();
              scope.passwordErrors = result.errors;
              status = false;
            } else {
              scope.popoverMsg = '';
              scope.passwordErrors = [];
              status = true;
            }
          }
          return status;
        };
      }
    };
  }]);

'use strict';

angular.module('users')
  .directive('passwordVerify', [function() {
    return {
      require: 'ngModel',
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, ngModel) {
        var status = true;
        scope.$watch(function() {
          var combined;
          if (scope.passwordVerify || ngModel) {
            combined = scope.passwordVerify + '_' + ngModel;
          }
          return combined;
        }, function(value) {
          if (value) {
            ngModel.$validators.passwordVerify = function (password) {
              var origin = scope.passwordVerify;
              return (origin !== password) ? false : true;
            };
          }
        });
      }
    };
  }]);

'use strict';

// Users directive used to force lowercase input
angular.module('users').directive('lowercase', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, modelCtrl) {
      modelCtrl.$parsers.push(function (input) {
        return input ? input.toLowerCase() : '';
      });
      element.css('text-transform', 'lowercase');
    }
  };
});

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
  function ($window) {
    var auth = {
      user: $window.user
    };

    return auth;
  }
]);

'use strict';

// PasswordValidator service used for testing the password strength
angular.module('users').factory('PasswordValidator', ['$window',
  function ($window) {
    var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;

    return {
      getResult: function (password) {
        var result = owaspPasswordStrengthTest.test(password);
        return result;
      },
      getPopoverMsg: function () {
        var popoverMsg = 'Please enter a passphrase or password with greater than 10 characters, numbers, lowercase, upppercase, and special characters.';
        return popoverMsg;
      }
    };
  }
]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
  function ($resource) {
    return $resource('api/users', {}, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

//TODO this should be Users service
angular.module('users.admin').factory('Admin', ['$resource',
  function ($resource) {
    return $resource('api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

angular.module('core.profile').factory('Profile', ['$resource',
  function ($resource) {
    return {
      Users: $resource('api/users'),
      Search: $resource('api/search'),
      Messages: $resource('api/messages/create/:recipientId')
    };
  }
]);




