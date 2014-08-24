/**
 * IndexedDB
 */

Botinder.IndexedDB = (function(Botinder) {
  Botinder.db = null;

  function initDatabase(callback) {
    var request = indexedDB.open('botinder', 11);
    var upgradeneeded = false;

    request.onupgradeneeded = function(e) {
      var _db = e.target.result;
      upgradeneeded = true;

      // matches
      if (_db.objectStoreNames.contains('matches')) {
        _db.deleteObjectStore('matches');
      }

      var os = _db.createObjectStore('matches', {
        keyPath: '_id'
      });

      os.createIndex('last_activity_date', 'last_activity_date', { unique: false });
    };

    request.onsuccess = function(e) {
      Botinder.db = e.target.result;
      callback && callback({
        upgradeneeded: upgradeneeded
      });
    };
  }

  function getMatches(limit, offset, callback) {
    var os = Botinder.db.transaction(['matches']).objectStore('matches');
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
    initDatabase: initDatabase,
    getMatches: getMatches
  };
})(Botinder);