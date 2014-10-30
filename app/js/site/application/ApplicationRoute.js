Capri.ApplicationRoute = Ember.Route.extend(Capri.SessionApplicationRouteMixin, {
  afterModel: function() {
    this.controllerFor('application').set('user', Capri.user);
  }
});