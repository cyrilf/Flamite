var Botinder = Ember.Application.create({
  rootElement: '#app'
});

chrome.runtime.sendMessage({type: 'user'}, function(user) {
  Botinder.User = user;
});

Botinder.Router.map(function() {
  this.route('home', {path: '/'});
  this.route('liker');
  this.resource('matches', function() {
    this.route('match', {path: '/:match_id'});
  });
  this.route('account');
});