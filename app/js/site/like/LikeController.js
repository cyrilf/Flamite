Botinder.LikeController = Ember.ArrayController.extend({
  delay: 1000,
  running: false,
  getMore: false,
  users: [],

  renderUser: function() {
    var users = this.get('users');
    
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
    console.log('user', users[0]);

    users.shift();
    this.set('users', users);

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

    //this.pushObjects(users);
  },

  actions: {
    changeRunningStatus: function() {
      this.toggleProperty('running');
    }
  }
});