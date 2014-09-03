/**
 * Tinder
 */

Botinder.Tinder = (function(Botinder) {
  var token = false;
  var updateOngo = false;

  function request(path, method, data, options) {
    return $.ajax({
      url: 'https://api.gotinder.com/' + path,
      type: method,
      data: data,
      beforeSend: function(request) {
        if (path !== 'auth') {
          request.setRequestHeader('X-Auth-Token', token);
        }
      }
    }).fail(function(error) {
      if (error.status == 401) {
        Botinder.openWelcomeTab(options ? options.tabId : null);
      }
    });
  }

  function setToken(_token) {
    localStorage.setItem('tinder_token', _token);
    token = _token;
  }

  function getToken() {
    return token;
  }

  function updateTinderData(callback) {
    var last_update = localStorage.getItem('last_update');
    var last_activity_date = localStorage.getItem('last_activity_date');

    var user = Botinder.getUser();

    // check if update is allow
    if (updateOngo || last_update > (new Date().getTime() - 2000)) {
      callback(false);
      return;
    }

    // set settings
    updateOngo = true;
    localStorage.setItem('last_update', new Date().getTime());

    // make Tinder update request
    var prm = Botinder.Tinder.request('updates', 'POST', {
      last_activity_date: last_activity_date ? last_activity_date : ''
    })

    prm.done(function(obj) {

      // save all new matches
      for (var i in obj.matches) {
        var match = obj.matches[i];

        (function(match, i) {
          var os = Botinder.db.transaction(['matches'], 'readwrite').objectStore('matches');
          var req = os.get(match['_id']);

          req.onsuccess = function(e) {
            var data = e.target.result;

            if (data) {
              data.messages = match.messages;
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
          };
        })(match, i);
      }

      // set settings
      localStorage.setItem('last_activity_date', obj.matches.length === 0 ? last_activity_date : obj.last_activity_date);
      updateOngo = false;

      callback('done', (obj.matches.length ? true : false));
    })

    prm.fail(function() {
      updateOngo = false;
      callback('fail');
    });
  }

  function chromeEvent() {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      
      // Tinder request
      if (request.type === 'request') {
        var prm = Botinder.Tinder.request(
          request.path, 
          request.method ? request.method : 'GET', 
          request.data ? request.data : {}
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
        Botinder.IndexedDB.getMatches(request.limit, request.offset, function(matches) {
          sendResponse(matches);
        });
      }

      // match
      else if (request.type === 'match') {
        var os = Botinder.db.transaction(['matches'], 'readwrite').objectStore('matches');
        var req = os.get(request.id);

        req.onsuccess = function(e) {
          var data = e.target.result;
          data.new_data = false;
          os.put(data);
          sendResponse(data);
        };
      }

      // post message
      else if (request.type === 'message_post') {
        Botinder.Tinder.request('user/matches/' + request.id, 'POST', {
          message: request.message
        });

        return false;
      }

      // update data
      else if (request.type === 'update') {
        updateTinderData(function(status, update) {

          if (status == 'fail') {
            Botinder.openWelcomeTab(sender.tab.id);
          }

          sendResponse({
            status: status,
            update: update
          });
        });
      }

      return true;
    });
  }

  return {
    init: function() {
      token = localStorage.getItem('tinder_token');
      chromeEvent();
    },
    request: request,
    setToken: setToken,
    getToken: getToken
  };
})(Botinder);