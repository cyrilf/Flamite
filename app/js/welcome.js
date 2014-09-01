$('.ready').on('click', function() {
  chrome.runtime.sendMessage({
    type: 'openFacebookAuthTab'
  });
});