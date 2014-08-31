Botinder.ApplicationController = Ember.Controller.extend({
  user: null,
  updateOngo: false,
  
  init: function() {
    var self = this;

    chrome.runtime.sendMessage({type: 'user'}, function(user) {
      Botinder.User = user;
      Botinder.User.photo = user.photos[0].processedFiles[3].url;
      self.set('user', user);
    });

    setInterval(function() {
      self.set('updateOngo', true);
      chrome.runtime.sendMessage({type: 'update'}, function(res) {
        if (res.update) {
          Botinder.Engine.update();
        }
        self.set('updateOngo', false);
      });
    }, 4000);
  }
});