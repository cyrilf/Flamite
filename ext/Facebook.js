/**
 * Facebook
 */

Botinder.Facebook = (function(Botinder) {

  function facebookAuthSuccess(facebook_token, tabId) {
    Botinder.Tinder.request('auth', 'POST', {
      facebook_token: facebook_token
    }, {
      tabId: tabId
    }).done(function(result) {
      Botinder.setUser(result.user);
      Botinder.Tinder.setToken(result.token);
      Botinder.openAppTab(tabId);
    });
  }

  function openAuthTab(tabId) {
    chrome.tabs.update(tabId, {
      url : 'https://www.facebook.com/v2.0/dialog/oauth?response_type=token&display=popup&api_key=464891386855067&redirect_uri=fbconnect%3A%2F%2Fsuccess&scope=user_about_me%2Cuser_activities%2Cuser_education_history%2Cuser_location%2Cuser_photos%2Cuser_relationship_details%2Cuser_status'
    });
  }

  function chromeEvent() {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

      // Facebook auth
      if (request.type === 'facebookAuth') {
        if (request.token) {
          facebookAuthSuccess(request.token, sender.tab.id);      
        }
      } 
    });
  }

  return {
    init: function() {
      chromeEvent();
    },
    openAuthTab: openAuthTab
  };
})(Botinder);