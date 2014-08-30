Botinder.LikeView = Ember.View.extend({
  itemView: Ember.View.extend({
    tagName: 'div',
    classNames: ['item'],
    templateName: 'like.item',

    photoView: Ember.View.extend({
      tagName: 'div',
      classNames: ['photo-container'],
      attributeBindings: ['style'],
      style: function() {
        console.log('photo', this.get('photo'));
        return 'background-image: url(' + this.get('photo') + ');';
      }.property('photo')
    })
  }),
});