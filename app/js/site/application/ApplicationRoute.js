Bolinter.ApplicationRoute = Ember.Route.extend(Bolinter.SessionApplicationRouteMixin, {
  afterModel: function() {
    this.controllerFor('application').set('user', Bolinter.user);
  }
});