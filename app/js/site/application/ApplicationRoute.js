Laforce.ApplicationRoute = Ember.Route.extend(Laforce.SessionApplicationRouteMixin, {
  afterModel: function() {
    this.controllerFor('application').set('user', Laforce.user);
  }
});