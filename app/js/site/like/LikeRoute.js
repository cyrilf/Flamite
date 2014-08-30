Botinder.LikeRoute = Ember.Route.extend({
  renderTemplate: function() {
    this.render();
    this.render('likeSide', {
      outlet: 'side'
    });
  },

  fetch: function(callback) {
    chrome.runtime.sendMessage({
      type: 'request',
      path: 'recs',
      data: {}
    }, function(obj) {
      var users = [];

      for (var i = 0; i < obj.results.length; i++) {
        var _user = obj.results[i];
        var photos = [];

        for (var ii = 0; ii < 6; ii++) {
          photos[ii] = _user.photos[ii] ? _user.photos[ii].processedFiles[0].url : false;
        }

        users.push({
          id: _user._id,
          name: _user.name,
          photos: photos
        });
      }

      callback(users);
    });
  },

  actions: {
    getMore: function() {
      var self = this;
      this.fetch(function(users) {
        self.get('controller').gotMore(users);
      });
    }
  }
});