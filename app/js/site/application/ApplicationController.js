Botinder.ApplicationController = Ember.Controller.extend({
  user: null,

  activated: function() {
    console.log('act');
  },
  
  init: function() {
    this.set('user', Botinder.User);

    setInterval(function() {
      chrome.runtime.sendMessage({type: 'update'}, function(res) {
        if (res.update) {
          Botinder.Engine.update();
        }
      });
    }, 3000);
  }
});