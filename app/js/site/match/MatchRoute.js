Botinder.MatchesMatchRoute = Ember.Route.extend({
  timeout: null,
  activate: function() {
    var self = this;
    this.set('timeout', setInterval(function() {
      self.refresh();
    }, 10000));
  },
  deactivate: function() {
    clearTimeout(this.get('timeout'));
  },
  model: function(params) {
    return new Ember.RSVP.Promise(function(resolve) {
      chrome.runtime.sendMessage({
        type: 'match',
        id: params.match_id
      }, function(match) {
        var matchResponse = {
          id: match._id,
          user: match.person,
          created_date: match.created_date,
          last_activity_date: match.last_activity_date,
          messages: []
        };

       for (var i = 0; i < match.messages.length; i++) {
          var message = match.messages[i];

          if (message.from == match.person._id) {
            var from = match.person;
          } else {
            var from = Botinder.User;
          }

          matchResponse.messages.push({
            timestamp: message.timestamp,
            message: message.message,
            user: from
          });
        }

        resolve(matchResponse);
      });
    });
  }
});