Flamite.ApplicationRoute = Ember.Route.extend(Flamite.SessionApplicationRouteMixin, {
  afterModel: function() {
    this.controllerFor('application').set('user', Flamite.user);
  }
});