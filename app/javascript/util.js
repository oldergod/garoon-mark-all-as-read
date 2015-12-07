goog.provide('garoon.maar.util');

goog.require('goog.json');

// function xhrRequest(method, url) {
//     return new Promise(function (resolve, reject) {
//         var xhr = new XMLHttpRequest();
//         xhr.open(method, url);
//         xhr.onload = resolve;
//         xhr.onerror = reject;
//         xhr.send();
//     });
// };

garoon.maar.util.parsePathnameAndSearch = function(urlAsString) {
  console.log('url to parse', urlAsString);
  var url = new URL(urlAsString);
  return url.pathname + url.search;
};

/**
 * @return {Promise}
 */
garoon.maar.util.getUnreadNotifications = function() {
  var url = '/g/v1/notification/list';
  var method = 'POST';
  var headers = new Headers();
  headers.append('Content-Type', 'text/json');
  var body = goog.json.serialize({
    'start': '2015-10-15T00:00:00Z'
  });
  var cache = 'no-cache';
  var credentials = 'include';
  return fetch(url, /** @type {RequestInit} */ ({
    method: method,
    headers: headers,
    body: body,
    cache: cache,
    credentials: credentials
  })).then(function(response) {
    console.log('response: ', response.clone());
    if (response.ok && response.headers.get("content-type") &&
      response.headers.get("content-type").toLowerCase().indexOf("application/json") >= 0) {
      return response.json()
    } else {
      throw new TypeError()
    }
  }, function(error) {
    throw 'There has been a problem with your fetch operation: ' + error.message;
  });
};
