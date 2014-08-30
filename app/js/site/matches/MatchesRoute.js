Botinder.MatchesRoute = Ember.Route.extend({
  queryParams: {
    page: {
      refreshModel: true
    }
  },

  renderTemplate: function() {
    this.render();
    this.render('matchesSide', {
      outlet: 'side'
    });
  },
  
  model: function(params) {
    return new Ember.RSVP.Promise(function(resolve) {
      chrome.runtime.sendMessage({
        type: 'matches',
        offset: params.queryParams.page ? params.queryParams.page : null
      }, function(results) {
        for (var i = 0; i < results.length; i++) {
          var match = results[i];
          
          if (!match.person) {
            console.log('error with match', match._id);
            continue;
          }

          if (match.person.photos.length > 0) {
            match.id = match._id;
            match.person.photo = match.person.photos[0].processedFiles[3].url;
          }

          results[i] = match;
        }
        resolve(results);
      });
    });
  }
});