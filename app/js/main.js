/**
 * Flamite
 */

// Init app
$('.wait').remove();

// Analytics
if (config && config.ga) {
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', config.ga]);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
}

var Flamite = Ember.Application.create({
  rootElement: '#app'
});

// Router
Flamite.Router.map(function() {
  this.route('like', {path: '/'});
  this.route('profile', {path: '/profile/:user'});
  
  this.resource('matches', function() {
    this.route('match', {path: '/:match_id'});
  });
});

// SessionApplicationRouteMixin
Flamite.SessionApplicationRouteMixin = Ember.Mixin.create({
  beforeModel: function(transition) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      chrome.runtime.sendMessage({type: 'user'}, function(user) {
        if (user) {
          Flamite.user = user;
          Flamite.user.photo = user.photos[0].processedFiles[3].url;
          resolve();
        }
      });
    });
  }
});