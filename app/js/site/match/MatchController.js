Botinder.MatchesMatchController = Ember.Controller.extend({
  needs: ['matches'],
  message: '',
  
  actions: {
    submit: function() {
      var match = this.get('model');
      
      chrome.runtime.sendMessage({
        type: 'message_post',
        id: match.id,
        message: this.get('message')
      }, function() {
        console.log('posted');
      });
    }
  }
});