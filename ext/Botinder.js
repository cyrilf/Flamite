/**
 * Botinder
 */

var Botinder = (function() {
  var sgl = {
    update_tinder_data_ongo: false
  };

  function openAppTab() {
    chrome.tabs.create({
      url : '/app/index.html'
    });
  }

  function updateTabToApp(tabId) {
    chrome.tabs.update(tabId, {
      url: '/app/index.html'
    });
  }

  function chromeEvent() {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.type === 'user') {
        sendResponse(JSON.parse(localStorage.getItem('user')));
      }
    });
  }

  return {
    sgl: sgl,
    updateTabToApp: updateTabToApp,
    openAppTab: openAppTab,
    init: function() {
      Botinder.IndexedDB.initDatabase(function(result) {

        // init
        Botinder.Tinder.init();
        Botinder.Facebook.init();

        // reset localstorage if IndexedDB need upgrade
        if (result.upgradeneeded) {
          localStorage.removeItem('last_activity_date');
          localStorage.removeItem('last_update');
          localStorage.removeItem('tinder_token');
          localStorage.removeItem('user');
        } else {
          Botinder.Tinder.setToken(localStorage.getItem('tinder_token'));
        }

        // listen Chrome event
        chromeEvent();

        // listen Botinder button
        chrome.browserAction.onClicked.addListener(function(tab) {

          // if Tinder token get update
          if (localStorage.getItem('tinder_token')) {
            var prm = Botinder.Tinder.updateTinderData();
            if (prm) {
              prm.done(function() {
                openAppTab();
              }).fail(function() {
                Botinder.Facebook.openAuthTab();
              });
            }
          } 

          // else open Facebook auth tab
          else {
            Botinder.Facebook.openAuthTab();
          }
        });
      });
    }
  };
})();