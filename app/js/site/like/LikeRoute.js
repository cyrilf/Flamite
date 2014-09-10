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
      path: 'recs'
    }, function(obj) {
      var users = [];

      if (!obj || !obj.results) {
        callback([]);
        return;
      }

      for (var i = 0; i < obj.results.length; i++) {
        var _user = obj.results[i];
        var photos = [];

        for (var ii = 0; ii < 6; ii++) {
          photos[ii] = _user.photos[ii] ? {
            small: _user.photos[ii].processedFiles[2].url,
            big: _user.photos[ii].url
          } : false;
        }

        var birth_date = new Date(_user.birth_date);
        var ping_time = new Date(_user.ping_time);

        users.push({
          id: _user._id,
          name: _user.name,
          age: Botinder.calculateAge(birth_date),
          ping_time: Botinder.formatDate(ping_time, true),
          distance_km: Math.round(_user.distance_mi * 1.609),
          distance_mi: _user.distance_mi,
          photos: photos
        });
      }

      callback(users);
    });
  },

  deactivate: function() {
    this.controllerFor('like').set('running', false);
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