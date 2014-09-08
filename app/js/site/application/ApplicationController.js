Botinder.ApplicationController = Ember.Controller.extend({
  user: null,

  init: function() {
    this.set('user', Botinder.User);

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