'use strict';

function ajax(method, url, handler, data) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status === 200) {
        handler(null, JSON.parse(xhr.responseText), data);
      } else {
        handler(this.status, null, data);
      }
    }
  };
  xhr.open(method, url);
  xhr.send();
}

$("button").click(function(event) {
  if (event.target.parentNode.firstChild.nextSibling.value) {
    var input = {type: event.target.classList[0], input: event.target.parentNode.firstChild.nextSibling.value};
    while (input.input.includes(" ")) {
      input.input = input.input.replace(" ", "%2B");
    }
    var search = "http://jsonp.afeld.me/?url=http%3A%2F%2Fapi.brewerydb.com%2Fv2%2Fsearch%3Fq%3D" + input.input + "%26type%3D" + input.type + "%26key%3Df76910d92fc27802ff77fb5e24ae5ff2";
    if (input.type=== "beer") {
      ajax('GET', search, beerSearch);
    }
    else {
      ajax('GET', search, brewSearch);
    }
  }
});

function beerSearch(err, data) {
  if (!err) {
    var beer = data.data[0];
  }
}

function brewSearch(err, data) {
  if (!err) {
    if (data) {
      var brewery = data.data[0];
      var id = data.data[0].id;
      var search = "http://jsonp.afeld.me/?url=http%3A%2F%2Fapi.brewerydb.com%2Fv2%2Fbrewery%2F" + id + "%2Fbeers%3F%26key%3Df76910d92fc27802ff77fb5e24ae5ff2";
      ajax('GET', search, brewGenerator, brewery);
    }
  }
}

function brewGenerator(err, data, brewery) {
  if (!err) {
    console.log(data);
    console.log(brewery);
  }
}
