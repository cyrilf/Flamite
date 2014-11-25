Flamer.ProfileView = Ember.View.extend({
  refreshScroll: function() {
    var $content = $('.page-profile .content');
    var height = window.innerHeight - $('.page-profile .profil').height();
    
    $content.css('height', height + 'px');
  },

  didInsertElement: function() {
    var self = this;

    $(window).on('scroll.page-profile', this.refreshScroll);
    $(window).on('resize.page-profile', this.refreshScroll);

    this.refreshScroll();
  },

  willDestroyElement: function() {
    $(window).off('scroll.page-profile');
    $(window).off('resize.page-profile');
  }
});