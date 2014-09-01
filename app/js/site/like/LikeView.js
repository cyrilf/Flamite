Botinder.LikeView = Ember.View.extend({
  itemView: Ember.View.extend({
    tagName: 'div',
    classNames: ['item'],
    templateName: 'like.item',

    like: function(like) {
      var self = this;

      if (this.get('user.disableLike')) {
        return;
      }

      if (like) {
        this.set('user.liked', true);
      } else {
        this.set('user.disliked', true);
      }

      this.get("controller").send('like', like, this.get('user'), function(result) {
        if (result.match) {
          self.set('user.match', result.match._id);
        }
      });
      
      this.set('user.disableLike', true);
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
        return 'background-image: url(' + this.get('photo.small') + ');';
      }.property('photo')
    })
  }),
});