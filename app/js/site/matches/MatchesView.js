Laforce.MatchesView = Ember.View.extend({
  refreshScroll: function() {
    var height = (window.innerHeight - $('.main-side .top').height() - 1);
    $('.side').css('height', height + 'px');
  },

  didInsertElement: function() {
    $(window).on('scroll.matches', this.refreshScroll);
    $(window).on('resize.matches', this.refreshScroll);
    
    this.refreshScroll();
  },

  willDestroyElement: function() {
    $(window).off('scroll.matches');
    $(window).off('resize.matches');
  },
});