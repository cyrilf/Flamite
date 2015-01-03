Flamite.MatchesMatchRoute = Ember.Route.extend({
  timeout: null,
  updateEvent: false,
  ts: false,
  last_activity_date: null,
  match_id: null,
  
  activate: function() {
    var self = this;

    this.set('ts', setInterval(function() {
      self.refresh();
    }, 2000));
  },

  deactivate: function() {
    this.set('last_activity_date', null);
    clearInterval(this.get('ts'));
  },

  model: function(params) {
    var self = this;
    var force = self.get('match_id') != params.match_id;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      chrome.runtime.sendMessage({
        type: 'match',
        id: params.match_id,
        last_activity_date: self.get('last_activity_date'),
        force: force
      }, function(result) {

        // no update
        if (force == false && result.last_activity_date == self.get('last_activity_date')) {
            reject('no update');
            return;
        }

        var user = result.match.person;

        // dates
        var birth_date = new Date(user.birth_date);
        var created_date = new Date(result.match.created_date);

        // person
        var person = {
          id: user._id,
          name: user.name,
          age: Flamite.calculateAge(birth_date),
          photo: user.photos[0].processedFiles[3].url
        };

        // messages list
        var messages = [];
        var user_on = null;
        var limit = 60;
        var offset = result.match.messages.length > limit ? result.match.messages.length - limit : 0;

        for (var i = offset; i < result.match.messages.length; i++) {
          var message = result.match.messages[i];

          if (message.from == Flamite.user._id) {
            var author = {
              name: Flamite.user.name,
              photo: Flamite.user.photo,
              its_me: true
            };
          } else {
            var author = {
              name: person.name,
              photo: person.photo
            };
          }

          console.log('a', user_on != author.name);

          messages.push({
            timestamp: message.timestamp,
            content: message.message,
            author: author,
            display_photo: user_on != author.name
          });

          if (user_on != author.name) {
            user_on = author.name;
          }
        }

        var match = {
          id: result.match._id,
          person: person,
          created_date: Flamite.formatDate(created_date, true),
          messages: messages
        };

        self.set('last_activity_date', result.last_activity_date);
        self.set('match_id', result.match._id);
        resolve(match);
      });
    });
  },

  actions: {
    error: function(reason) {}
  }
});