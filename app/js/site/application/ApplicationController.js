Laforce.ApplicationController = Ember.Controller.extend({
  user: null,

  init: function() {
    this.set('user', Laforce.User);

    setInterval(function() {
      chrome.runtime.sendMessage({type: 'update'});
    }, 4000);
  },

  actions: {
    reset: function() {
      chrome.runtime.sendMessage({type: 'reset'});
    }
  }
});