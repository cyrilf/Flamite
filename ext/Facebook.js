/**
 * Facebook
 */

Botinder.Facebook = (function(Botinder) {

  function facebookAuthSuccess(facebookToken, tabId) {
    Botinder.Tinder.auth(facebookToken).done(function(result) {
      localStorage.setItem('tinder_token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));

      Botinder.Tinder.setToken(result.token);

      var prm = Botinder.Tinder.updateTinderData()
      if (prm) {
        prm.done(function() {
          Botinder.updateTabToApp(tabId);
        }).fail(function() {
          chrome.tabs.remove(tabId, function() {
            Botinder.openAuthTab();
          });
        });
      }
    });
  }

  function openAuthTab() {
    chrome.tabs.create({
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

  chromeEvent();

  return {
    openAuthTab: openAuthTab,
    facebookAuthSuccess: facebookAuthSuccess
  };
})(Botinder);