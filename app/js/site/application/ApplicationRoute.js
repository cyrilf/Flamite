Flamer.ApplicationRoute = Ember.Route.extend(Flamer.SessionApplicationRouteMixin, {
  afterModel: function() {
    this.controllerFor('application').set('user', Flamer.user);
  }
});