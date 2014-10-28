/**
 * IndexedDB
 */

Laforce.IndexedDB = (function(Laforce) {
  Laforce.db = null;

  function reset(request) {
    Laforce.db.close();
    indexedDB.deleteDatabase('bolinter');
    init();
  }

  function create(db) {
    // matches
    if (db.objectStoreNames.contains('matches')) {
      db.deleteObjectStore('matches');
    }

    var os = db.createObjectStore('matches', {
      keyPath: '_id'
    });

    os.createIndex('last_activity_date', 'last_activity_date', { unique: false });
  }

  function init(callback) {
    var request = indexedDB.open('bolinter', 14);
    var upgradeneeded = false;

    request.onupgradeneeded = function(e) {
      upgradeneeded = true;
      create(e.target.result);
    };

    request.onsuccess = function(e) {
      Laforce.db = e.target.result;
      callback && callback({
        upgradeneeded: upgradeneeded
      });
    };
  }

  function getMatches(limit, offset, callback) {
    var os = Laforce.db.transaction(['matches']).objectStore('matches');
    var index = os.index('last_activity_date');
    var offset = offset ? IDBKeyRange.upperBound(offset) : null;
    var limit = limit ? limit : 50;
    var forIndex = 1;
    var matches = [];

    index.openCursor(offset, 'prev').onsuccess = function(event) {
      var cursor = event.target.result;
      
      if (cursor) {
        matches.push(cursor.value);

        if (forIndex < limit) {
          cursor.continue();
          forIndex++;
        } else {
          callback(matches);
        }
      } else {
        callback(matches);
      }
    };
  }

  return {
    init: init,
    reset: reset,
    getMatches: getMatches
  };
})(Laforce);