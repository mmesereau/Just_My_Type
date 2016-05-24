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
      ajax('GET', search, beerSearch, [true, '.main-area', 'col-xs-4', 'medium']);
    }
    else {
      ajax('GET', search, brewSearch);
    }
  }
});

function beerSearch(err, data, info) {
  if (!err) {
    var beers = [];
    var i = 0;
    var j = 0;
    while (i < 3) {
      if (data.data[j].availableId && data.data[j].labels) {
        if (data.data[j].availableId == 1) {
        beers.push(data.data[j]);
        i++;
        }
      }
      j++;
    }
    beerGenerator(beers, info);
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
    $('.main-area').empty();
    $(".main-area").append("<div class='col-xs-12 main-content'><div class='col-md-8 brewinfo'><div class='brewlogo'><img alt='No Image' id='brewLogo'></div><div class='brewname'><h1 id='brewName'></h1></div><div class='brewsite'><a id='brewLink'><p id='brewURL'></p></a></div><div class='brewinfo'><p id='brewInfo'></p></div></div><div class='col-md-2 brewbeers'></div></div>");
    $("#brewLogo").attr('src', brewery.images.medium);
    document.querySelector("#brewName").innerHTML = brewery.name;
    $("#brewLink").attr('href', brewery.website);
    document.querySelector("#brewURL").innerHTML = brewery.website;
    document.querySelector("#brewInfo").innerHTML = brewery.description;
    var beers = [];
    var i = 0;
    var j = 0;
    while (i < 3) {
      if (data.data[j].availableId && data.data[j].labels) {
        if (data.data[j].availableId == 1) {
          beers.push(data.data[j]);
          i++;
        }
      }
      j++;
    }
    beerGenerator(beers, [false, ".brewbeers", "row", "icon"]);
  }
}

function beerGenerator(data, info) {
  if (info[0]) {
    $('.main-area').empty();
  }
  for (var i = 0; i < data.length; i++) {
    var target="beerLink" + i;
    if (data.length == 1) {
      $(info[1]).append("<div class='main-content'></div>");
      info[1] = '.main-content';
    }
    $(info[1]).append("<div id='" + target + "' class='" + info[2] + " beercontainer'><div class='picture'><img class='beerImage' alt='No Image'></div><div class='title'><h1 class='beerName'></h1></div><div class='style'><h4 class='beerStyle'></h4></div><div class='description'><p class='beerDesc'></p></div></div>");
    if (data[i].labels) {
      $('#' + target + ' .beerImage').attr('src', data[i].labels[info[3]]);
    }
    $("#" + target + ' .beerName').append(data[i].name);
    $('#' + target + ' .beerStyle').append(data[i].style.name);
    if (info[1] == ".main-area" || info[1] == '.main-content') {
      if (data[i].description) {
        $('#' + target + ' .beerDesc').append(data[i].description);
      }
    }
  }
  $(".beercontainer").click(function() {
    var id = this.id;
    var name = document.querySelector("#" + id + " .beerName").innerHTML;
    var thisBeer = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i].name == name) {
        thisBeer = [data[i]];
        console.log(thisBeer);
      }
    }
    beerGenerator(thisBeer, [true, '.main-area', 'row', 'medium']);
  });
}
