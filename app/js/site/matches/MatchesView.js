Botinder.MatchesView = Ember.View.extend({
  refreshScroll: function() {
    var height = (window.innerHeight - $('.header-main').height());

    $('.matches').css('height', height + 'px');
    $('.match').css('height', height + 'px');
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