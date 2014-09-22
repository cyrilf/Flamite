Botinder.MatchesMatchView = Ember.View.extend({
  refreshScroll: function() {
    var $messages = $('.match .messages');
    var height = window.innerHeight - $('.match .profil').height() - $('.match .write').height();
    
    $messages.css('height', height + 'px');
    $messages.scrollTop($messages[0].scrollHeight);
  },

  didInsertElement: function() {
    $(window).on('scroll.match', this.refreshScroll);
    $(window).on('resize.match', this.refreshScroll);

    this.refreshScroll();
    this.get('controller').on('scroll', this, this.refreshScroll);

    $('.message-field').focus();
  },

  willDestroyElement: function() {
    $(window).off('scroll.match');
    $(window).off('resize.match');

    this.get('controller').off('scroll', this, this.refreshScroll);
  }
});