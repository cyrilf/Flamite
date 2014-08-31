Botinder.LikeController = Ember.ArrayController.extend({
  delay: 1500,
  running: false,
  getMore: false,
  displayNb: 0,
  users: [],

  start: function() {
    return this.get('running') ? 'Break!' : 'Start!';
  }.property('running'),

  renderUser: function() {
    var users = this.get('users');
    var displayNb = this.get('displayNb');

    // check running status
    if (!this.get('running') || this.get('getMore')) {
      return;
    }

    // check users length
    if (users.length === 0) {
      this.set('getMore', true);
      this.get('target').send('getMore');
      return;
    }

    // display user
    this.unshiftObject(users[0]);

    users.shift();

    if (displayNb >= 8) {
      this.popObject();
    }

    this.set('users', users);
    this.set('displayNb', displayNb + 1);

    setTimeout(function(context) {
      context.renderUser.call(context);
    }, this.get('delay'), this);
  },

  runningChanged: function() {
    if (this.get('running')) {
      this.renderUser();
    }
  }.observes('running'),

  gotMore: function(users) {
    this.set('users', this.get('users').concat(users));
    this.set('getMore', false);
    this.renderUser();
  },

  actions: {
    changeRunningStatus: function() {
      this.toggleProperty('running');
    },

    like: function(like, user, callback) {
      chrome.runtime.sendMessage({
        type: 'request',
        path: (like ? 'like' : 'dislike') + '/' + user.id
      }, function(result) {
        callback(result);
      });
    }
  }
});