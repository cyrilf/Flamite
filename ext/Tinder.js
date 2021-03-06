/**
 * Tinder
 */

Flamite.Tinder = (function(Flamite) {
  var token = false;
  var updated = false;
  var last_update = null;

  function request(path, method, data, options) {
    return $.ajax({
      url: 'https://api.gotinder.com/' + path,
      type: method,
      data: data,
      beforeSend: function(request) {
        if (path !== 'auth') {
          request.setRequestHeader('X-Auth-Token', token);
          request.setRequestHeader('os-version', 21);
          request.setRequestHeader('app-version', 767);
          request.setRequestHeader('platform', 'android');
        }
      }
    }).fail(function(error) {
      if (error.status == 401) {
        Flamite.openWelcomeTab(options ? options.tabId : null);
      }
    });
  }

  function setToken(_token) {
    localStorage.setItem('linter_token', _token);
    token = _token;
  }

  function getToken() {
    return token;
  }

  function updateTinderData(tabId, callback) {
    var last_activity_date = localStorage.getItem('last_activity_date');
    var user = Flamite.getUser();

    // check if update is allow
    if (updated || (last_update && last_update > (new Date().getTime() - 2000))) {
      callback && callback(false);
      return;
    }

    // set settings
    updated = true;
    last_update = new Date().getTime();

    // make Tinder update request
    var prm = Flamite.Tinder.request('updates', 'POST', {
      last_activity_date: last_activity_date ? last_activity_date : ''
    }, {
      tabId: tabId
    });

    prm.done(function(obj) {
      var matchsNb = obj.matches.length;

      // save all new matches
      for (var i in obj.matches) {
        var match = obj.matches[i];

        (function(match, i) {
          var os = Flamite.db.transaction(['matches'], 'readwrite').objectStore('matches');
          var req = os.get(match['_id']);

          req.onsuccess = function(e) {
            var data = e.target.result;

            if (data) {
              data.messages = data.messages.concat(match.messages);
              data.last_activity_date = match.last_activity_date;

              // last message
              var last_message = match.messages[match.messages.length - 1];
              if (last_message && last_message.from != user._id) {
                data.new_data = true;
              } else {
                data.new_data = false;
              }

              os.put(data);
            } else {
              os.add(match);
            }

            // refresh view
            if ((matchsNb - 1) == i) {
              updated = false;
              callback && callback('done', true);
            }
          };
        })(match, i);
      }

      if (matchsNb == 0) {
        updated = false;
        callback && callback('done', false);
      }

      // set settings
      localStorage.setItem('last_activity_date', obj.last_activity_date);
    })

    prm.fail(function() {
      updated = false;
      callback && callback('fail');
    });
  }

  function chromeEvent() {

    // edit user-agent for api
    chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
      for (var i = 0; i < details.requestHeaders.length; ++i) {
        if (details.requestHeaders[i].name === 'User-Agent') {
          details.requestHeaders[i].value = 'Tinder Android Version 4.0.3';
        }
      }
      return {requestHeaders: details.requestHeaders};
    }, {urls: ["*://api.gotinder.com/*"]}, ["blocking", "requestHeaders"]);

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      
      // Tinder request
      if (request.type === 'request') {
        var prm = Flamite.Tinder.request(
          request.path, 
          request.method ? request.method : 'GET', 
          request.data ? request.data : {},
          {tabId: sender.tab.id}
        );

        prm.done(function(obj) {
          sendResponse(obj);
        });

        prm.fail(function(obj) {
          sendResponse(false);
        });
      }

      // matches
      else if (request.type === 'matches') {
        var last_activity_date = localStorage.getItem('last_activity_date');

        if (request.last_activity_date == last_activity_date) {
          sendResponse({
            last_activity_date: last_activity_date
          });

          return;
        }

        Flamite.IndexedDB.getMatches(null, null, function(matches) {
          sendResponse({
            matches: matches,
            last_activity_date: last_activity_date
          });
        });
      }

      // match
      else if (request.type === 'match') {
        var last_activity_date = localStorage.getItem('last_activity_date');

        if (request.force == false && request.last_activity_date == last_activity_date) {
          sendResponse({
            last_activity_date: last_activity_date
          });

          return;
        }

        var os = Flamite.db.transaction(['matches'], 'readwrite').objectStore('matches');
        var req = os.get(request.id);

        req.onsuccess = function(e) {
          var data = e.target.result;

          if (data) {
            data.new_data = false;
            os.put(data);
          }

          sendResponse({
            match: data,
            last_activity_date: last_activity_date
          });
        };
      }

      // post message
      else if (request.type === 'message_post') {
        Flamite.Tinder.request('user/matches/' + request.id, 'POST', {
          message: request.message
        });

        return false;
      }

      // update data
      else if (request.type === 'update') {
        updateTinderData(sender.tab.id);
        return false;
      }

      return true;
    });
  }

  return {
    init: function() {
      token = localStorage.getItem('linter_token');
      chromeEvent();
    },
    request: request,
    setToken: setToken,
    getToken: getToken
  };
})(Flamite);