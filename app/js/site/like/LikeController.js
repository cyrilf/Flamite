Botinder.LikeController = Ember.Controller.extend({
  activated: function() {
    console.log('act');
  },
  init: function() {
    var users = [];

    function getRecs(callback) {
      chrome.runtime.sendMessage({
        type: 'request',
        path: 'recs',
        data: {}
      }, function(obj) {
        for (var i = 0; i < obj.results.length; i++) {
          var _user = obj.results[i];
          var photos = [];

          for (var ii = 0; ii < _user.photos.length; ii++) {
            var _photos = _user.photos[ii];
            photos[ii] = _photos.processedFiles[0].url;
          }

          users.push({
            id: _user._id,
            name: _user.name,
            photos: photos
          });
        }

        callback();
      });
    }

    function go() {
      getRecs(function() {
        var ite = setInterval(function() {
          var user = users.shift();

          if (user) {
            console.log('user', user);
            $('.like-list').prepend('<img src="' + user.photos[0] + '" width=200 height=200>');
          } else {
            console.log('clearInterval');
            clearInterval(ite);
            //go();
          }
        }, 500);
      });
    }

    go();
  }
});