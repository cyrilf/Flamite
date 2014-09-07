Botinder.ApplicationRoute = Ember.Route.extend(Botinder.SessionApplicationRouteMixin, {
  afterModel: function() {
    this.controllerFor('application').set('user', Botinder.user);
  }
});