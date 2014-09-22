Botinder.ProfileRoute = Ember.Route.extend({
  model: function(params) {
    return new Ember.RSVP.Promise(function(resolve) {
      chrome.runtime.sendMessage({
        type: 'request',
        path: 'user/' + params.user
      }, function(obj) {
        var _user = obj.results;
        var photos = [];

        for (var i = 0; i < 6; i++) {
          photos[i] = _user.photos[i] ? {
            big: _user.photos[i].processedFiles[0].url,
            small: _user.photos[i].processedFiles[2].url
          } : false;
        }

        var birth_date = new Date(_user.birth_date);
        var ping_time = new Date(_user.ping_time);

        _gaq && _gaq.push(['_trackEvent', 'profile', 'hit']);

        resolve({
          id: _user._id,
          name: _user.name,
          bio: Botinder.formatBio(_user.bio),
          age: Botinder.calculateAge(birth_date),
          ping_time: Botinder.formatDate(ping_time, true),
          distance_km: Math.round(_user.distance_mi * 1.609),
          distance_mi: _user.distance_mi,
          photos: photos
        });
      });
    });
  }
});
