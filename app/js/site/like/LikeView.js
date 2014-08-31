Botinder.LikeView = Ember.View.extend({
  itemView: Ember.View.extend({
    tagName: 'div',
    classNames: ['item'],
    templateName: 'like.item',
    liked: false,
    disliked: false,
    likeOptions: true,
    match: false,

    like: function(like) {
      var self = this;

      if (!this.get('likeOptions')) {
        return;
      }

      if (like) {
        this.set('liked', true);
      } else {
        this.set('disliked', true);
      }

      this.get("controller").send('like', like, this.get('user'), function(result) {
        if (result.match) {
          self.set('match', result.match._id);
        }
      });
      
      this.set('likeOptions', false);
    },

    didInsertElement: function() {
      if (this.get('controller.likeAuto')) {
        this.like(1);
      }
    },

    photoView: Ember.View.extend({
      tagName: 'div',
      classNames: ['photo-container'],
      attributeBindings: ['style'],
      style: function() {
        return 'background-image: url(' + this.get('photo') + ');';
      }.property('photo')
    })
  }),
});