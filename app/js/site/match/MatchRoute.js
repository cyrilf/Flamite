Botinder.MatchesMatchRoute = Ember.Route.extend({
  timeout: null,
  updateEvent: false,
  ts: false,
  
  activate: function() {
    var self = this;

    this.set('ts', setInterval(function() {
      self.refresh();
    }, 6000));
  },

  deactivate: function() {
    clearInterval(this.get('ts'));
  },

  model: function(params) {
    return new Ember.RSVP.Promise(function(resolve) {
      chrome.runtime.sendMessage({
        type: 'match',
        id: params.match_id
      }, function(_match) {
        var _user = _match.person;

        // dates
        var birth_date = new Date(_user.birth_date);
        var created_date = new Date(_match.created_date);

        var person = {
          id: _user._id,
          name: _user.name,
          age: Botinder.calculateAge(birth_date),
          photo: _user.photos[0].processedFiles[3].url
        };

        var limit = 60;
        var offset = _match.messages.length > limit ? _match.messages.length - limit : 0;

        var messages = [];
        for (var i = offset; i < _match.messages.length; i++) {
          var message = _match.messages[i];

          if (message.from == Botinder.user._id) {
            var author = {
              name: Botinder.user.name,
              photo: Botinder.user.photo
            };
          } else {
            var author = {
              name: person.name,
              photo: person.photo
            };
          }

          messages.push({
            timestamp: message.timestamp,
            content: message.message,
            author: author
          });
        }

        var match = {
          id: _match._id,
          person: person,
          created_date: Botinder.formatDate(created_date, true),
          messages: messages
        };

        resolve(match);
      });
    });
  }
});