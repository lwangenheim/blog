(function() {
  var Blog;

  Blog = angular.module('Blog', []);

  Blog.config([
    '$routeProvider', function($routeProvider) {
      $routeProvider.when('/post/new', {
        templateUrl: '../assets/mainCreatePost.html.haml',
        controller: 'CreatePostCtrl'
      }).when('/post/:postId', {
        templateUrl: '../assets/mainPost.html.haml',
        controller: 'PostCtrl'
      });
      return $routeProvider.otherwise({
        templateUrl: '../assets/mainIndex.html.haml',
        controller: 'IndexCtrl'
      });
    }
  ]);

  Blog.config([
    "$httpProvider", function(provider) {
      return provider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
    }
  ]);

}).call(this);
(function() {
  angular.module('Blog').factory('postData', [
    '$http', function($http) {
      var postData;
      postData = {
        data: {
          posts: [
            {
              title: 'Loading',
              contents: ''
            }
          ]
        },
        isLoaded: false
      };
      postData.loadPosts = function(deferred) {
        if (!postData.isLoaded) {
          return $http.get('./posts.json').success(function(data) {
            postData.data.posts = data;
            postData.isLoaded = true;
            return console.log('Successfully loaded posts.');
          }).error(function() {
            console.error('Failed to load posts.');
            if (deferred) {
              return deferred.resolve();
            }
          });
        } else {
          if (deferred) {
            return deferred.resolve();
          }
        }
      };
      postData.createPost = function(newPost) {
        var data;
        if (newPost.newPostTitle === '' || newPost.newPostContents === '') {
          alert('Neither the Tile nor the Body are allowed to be blank.');
          return false;
        }
        data = {
          new_post: {
            title: newPost.newPostTitle,
            contents: newPost.newPostContents
          }
        };
        $http.post('./posts.json', data).success(function(data) {
          postData.data.posts.push(data);
          return console.log('Successfully created post.');
        }).error(function() {
          return console.error('Failed to create new post.');
        });
        return true;
      };
      return postData;
    }
  ]);

}).call(this);
(function() {
  this.CreatePostCtrl = function($scope, $location, postData) {
    $scope.data = postData.data;
    postData.loadPosts(null);
    $scope.formData = {
      newPostTitle: '',
      newPostContents: ''
    };
    $scope.navNewPost = function() {
      return $location.url('/post/new');
    };
    $scope.navHome = function() {
      return $location.url('/');
    };
    $scope.createPost = function() {
      return postData.createPost($scope.formData);
    };
    return $scope.clearPost = function() {
      $scope.formData.newPostTitle = '';
      return $scope.formData.newPostContents = '';
    };
  };

  this.CreatePostCtrl.$inject = ['$scope', '$location', 'postData'];

}).call(this);
(function() {
  this.IndexCtrl = function($scope, $location, $http, postData) {
    $scope.data = postData.data;
    postData.loadPosts(null);
    $scope.viewPost = function(postId) {
      return $location.url('/post/' + postId);
    };
    return $scope.navNewPost = function() {
      return $location.url('/post/new');
    };
  };

  this.IndexCtrl.$inject = ['$scope', '$location', '$http', 'postData'];

}).call(this);
(function() {
  this.PostCtrl = function($scope, $routeParams, $location, $q, postData) {
    $scope.data = {
      postData: postData.data,
      currentPost: {
        title: 'Loading...',
        contents: ''
      }
    };
    $scope.data.postId = $routeParams.postId;
    $scope.navNewPost = function() {
      return $location.url('/post/new');
    };
    $scope.navHome = function() {
      return $location.url('/');
    };
    $scope.prepPostData = function() {
      var post;
      post = _.findWhere(postData.data.posts, {
        id: parseInt($scope.data.postId)
      });
      $scope.data.currentPost.title = post.title;
      return $scope.data.currentPost.contents = post.contents;
    };
    this.deferred = $q.defer();
    this.deferred.promise.then($scope.prepPostData);
    return postData.loadPosts(this.deferred);
  };

  this.PostCtrl.$inject = ['$scope', '$routeParams', '$location', '$q', 'postData'];

}).call(this);
