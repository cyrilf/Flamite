Flamite.MatchesRoute = Ember.Route.extend({
  updateEvent: false,
  ts: false,
  last_activity_date: null,

  activate: function() {
    var self = this;

    this.set('ts', setInterval(function() {
      self.refresh();
    }, 6000));
  },

  deactivate: function() {
    this.set('last_activity_date', null);
    clearInterval(this.get('ts'));
  },

  renderTemplate: function() {
    this.render();
    this.render('matchesSide', {
      outlet: 'side'
    });
  },
  
  model: function(params) {
    var self = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      chrome.runtime.sendMessage({
        type: 'matches',
        last_activity_date: self.get('last_activity_date')
      }, function(result) {

        // no update
        if (result.last_activity_date == self.get('last_activity_date')) {
          reject('no update');
          return;
        }

        // matches parse
        result.matches.map(function(match, index) {
          match.id = match._id;

          if (match.person.photos.length > 0) {
            match.person.photo = match.person.photos[0].processedFiles[3].url;
          }

          if (index == 0) {
            
          }
        });

        self.set('last_activity_date', result.last_activity_date);
        resolve(result.matches);
      });
    });
  },

  actions: {
    error: function(reason) {}
  }
});