Flamite.LikeView = Ember.View.extend({
  itemView: Ember.View.extend({
    tagName: 'div',
    classNames: ['item'],
    templateName: 'like.item',

    likeValue: 'Like',
    dislikeValue: 'Dislike',

    like: function(like) {
      var self = this;

      if (this.get('user.disableLike')) {
        return;
      }

      if (like) {
        this.set('user.liked', true);
        this.set('likeValue', 'Liked!');
      } else {
        this.set('user.disliked', true);
        this.set('dislikeValue', 'Disliked!');
      }

      this.get('controller').send('like', like, this.get('user'), function(result) {
        if (result.match) {
          self.set('user.matchId', result.match._id);
        }
      });
      
      this.set('user.disableLike', true);
    },

    didInsertElement: function() {
      if (this.get('controller.running') && this.get('controller.likeAuto')) {
        if (!this.get('controller.dislikeAuto') || (Math.random() > 0.15)) {
          this.like(true);
        } else {
          this.like(false);
        }
      }
    },

    photoView: Ember.View.extend({
      tagName: 'div',
      classNames: ['photo-container'],
      attributeBindings: ['style'],
      style: function() {
        return 'background-image: url(' + this.get('photo.small') + ');';
      }.property('photo')
    })
  }),
});