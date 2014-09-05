var Botinder = Ember.Application.create({
  rootElement: '#app'
});

Botinder.Router.map(function() {
  this.route('like', {path: '/'});
  this.resource('matches', function() {
    this.route('match', {path: '/:match_id'});
  });
  this.route('account');
});

Botinder.Engine = Ember.Object.extend(Ember.Evented, {
  update: function() {
    this.trigger('update');
  }
}).create();