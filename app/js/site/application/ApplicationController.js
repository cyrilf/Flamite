Botinder.ApplicationController = Ember.Controller.extend({
  updateOngo: false,
  
  init: function() {
    var self = this;

    setInterval(function() {
      self.set('updateOngo', true);
      chrome.runtime.sendMessage({type: 'update'}, function(status) {
        self.set('updateOngo', false);
      });
    }, 15000);
  }
});