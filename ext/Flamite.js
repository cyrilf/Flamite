/**
 * Flamite
 */

var Flamite = (function() {
  var user = null;

  function openAppTab(tabId) {
    if (tabId) {
      chrome.tabs.update(tabId, {
        url: '/app/index.html'
      });
    } else {
      chrome.tabs.create({
        url : '/app/index.html'
      });
    }
  }

  function openWelcomeTab(tabId) {
    if (tabId) {
      chrome.tabs.update(tabId, {
        url: '/app/welcome.html'
      });
    } else {
      chrome.tabs.create({
        url : '/app/welcome.html'
      });
    }
  }

  function setUser(_user) {
    localStorage.setItem('user', JSON.stringify(_user));
    user = _user;
  }

  function getUser() {
    return user;
  }

  function resetLocalStorage() {
    localStorage.removeItem('last_activity_date');
    localStorage.removeItem('last_update');
    localStorage.removeItem('linter_token');
    localStorage.removeItem('user');
  }

  function reset() {
    resetLocalStorage();
    Flamite.Tinder.setToken(null);
    Flamite.IndexedDB.reset();
  }

  function chromeEvent() {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

      // get user account
      if (request.type === 'user') {
        var user = localStorage.getItem('user');

        if (user) {
          sendResponse(JSON.parse(localStorage.getItem('user')));
        } else {
          openWelcomeTab(sender.tab.id);
          sendResponse(false);
        }
      }

      if (request.type === 'reset') {
        reset();
        openWelcomeTab(sender.tab.id);
        return false;
      }

      return true;
    });

    // listen Flamite button
    chrome.browserAction.onClicked.addListener(function(tab) {

      // if Tinder token get update
      if (Flamite.Tinder.getToken()) {
        openAppTab();
      }

      // else open Facebook auth tab
      else {
        openWelcomeTab();
      }
    });
  }

  return {
    openAppTab: openAppTab,
    openWelcomeTab: openWelcomeTab,
    setUser: setUser,
    getUser: getUser,
    user: user,
    init: function() {
      Flamite.IndexedDB.init(function(result) {

        // init
        Flamite.Tinder.init();
        Flamite.Facebook.init();

        // reset localstorage if IndexedDB need upgrade
        if (result.upgradeneeded) {
          resetLocalStorage();
          Flamite.Tinder.setToken(null);
        }

        // user
        var user = localStorage.getItem('user');
        if (user) {
          setUser(JSON.parse(user));
        }

        // listen Chrome event
        chromeEvent();
      });
    }
  };
})();