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

$(".index").click(function(event) {
  if (event.target.parentNode.firstChild.nextSibling.value) {
    var input = {type: event.target.classList[0], input: event.target.parentNode.firstChild.nextSibling.value};
    while (input.input.includes(" ")) {
      input.input = input.input.replace(" ", "%2B");
    }
    var search = "https://jsonp.afeld.me/?url=http%3A%2F%2Fapi.brewerydb.com%2Fv2%2Fsearch%3Fq%3D" + input.input + "%26type%3D" + input.type + "%26key%3Df76910d92fc27802ff77fb5e24ae5ff2";
    if (input.type=== "beer") {
      ajax('GET', search, beerSearch, [true, '.main-area', 'col-xs-3', 'medium']);
    }
    else {
      ajax('GET', search, brewSearch);
    }
    var inputs = document.querySelectorAll("input");
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].value = "";
    }

  }
});

function beerSearch(err, data, info) {
  if (!err) {
    var beers = [];
    var i = 0;
    var j = 0;
    while (i < 3 || j < data.data.length) {
      if (data.data[j].labels) {
        if (info[4]) {
          if (info[4][0].name !== data.data[j].name) {
            beers.push(data.data[j]);
            i++;
          }
        }
        else {
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
      console.log(brewery);
      var id = data.data[0].id;
      var search = "https://jsonp.afeld.me/?url=http%3A%2F%2Fapi.brewerydb.com%2Fv2%2Fbrewery%2F" + id + "%2Fbeers%3F%26key%3Df76910d92fc27802ff77fb5e24ae5ff2";
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
    var length = Math.min(300, data.data.length) - 1;
    console.log(length);
    console.log(data);
    while (j < length) {
      if (data.data[j] !== undefined) {
        if (data.data[j].labels !== undefined || data.data[j].images !== undefined) {
          console.log(data.data[j]);
          console.log(j);
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
  var length = Math.min(data.length, 3);
  for (var i = 0; i < length; i++) {
    var target="beerLink" + i;
    if (document.querySelector("#" + target)) {
      document.querySelector("#" + target).id = "";
    }
    if (data.length === 1) {
      $(info[1]).append("<div class='main-content'><div class='col-xs-8 chosenOne'></div><div class='col-xs-4 recommended'></div></div>");
      info[1] = '.chosenOne';
    }
    $(info[1]).append("<div id='" + target + "' class='" + info[2] + " beercontainer'><div class='picture'><img class='beerImage' alt='No Image'></div><div class='title'><h1 class='beerName'></h1></div><div class='style'><h4 class='beerStyle'></h4></div><div class='description'></div></div>");
    if (data[i].labels) {
      $('#' + target + ' .beerImage').attr('src', data[i].labels[info[3]]);
    }
    if (data[i].images) {
      $('#' + target + ' .beerImage').attr('src', data[i].images[info[3]]);
    }
    $("#" + target + ' .beerName').append(data[i].name);
    $('#' + target + ' .beerStyle').append(data[i].style.name);
    if (info[1] === ".main-area" || info[1] === '.chosenOne') {
      if (data[i].description) {
        if (info[1] === '.chosenOne') {
          $('#' + target + ' .description').append("<textarea style='border-width: 0px; text-align: center; background-color: transparent' class='beerDesc' rows='12' cols='50'></textarea>");
        }
        else {
          $('#' + target + ' .description').append("<textarea style='border-width: 0px; background-color: transparent; text-align: center' class='beerDesc' rows='12'></textarea>");
        }
        $('#' + target + ' .beerDesc').append(data[i].description);
      }
    }
  }
  if (info[2] === 'row' && length > 1 ) {
    $(info[1]).prepend("<div class='row leftScroll'><button type='submit' class='scroll-left' disabled><span class='glyphicon glyphicon-chevron-up'></span></button></div>");
    $(info[1]).append("<div class='row'><button type='submit' class='scroll-right'><span class='glyphicon glyphicon-chevron-down'></span></button></div>");
  } else if (info[2] === 'col-xs-3') {
    $(info[1]).prepend("<div class='col-xs-1 leftScroll'><button type='submit' class='scroll-left' disabled><span class='glyphicon glyphicon-chevron-left'></span></button></div>");
    $(info[1]).append("<div class='col-xs-1'><button type='submit' class='scroll-right'><span class='glyphicon glyphicon-chevron-right'></span></button></div>");
  }

  if (data.length < 4) {
    $(".scroll-right").prop("disabled", true);
  }

  $(".beercontainer").click(function() {
    var id = this.id;
    var name = document.querySelector("#" + id + " .beerName").innerHTML;
    var thisBeer = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i].name === name) {
        thisBeer = [data[i]];
      }
    }
    if (thisBeer[0].name === "Bud Light") {
      thisBeer[0].description = "Commonly described as a Liquid John Mayer Song, this beer contains the clean, crisp finish of the ghost of a dead lemon.  Created using a secret formula of allowing a soda to go flat and then giving it to a homeless man to rinse off pidgeons, it has a classic aftertaste that is exactly the same as water strained from a gutter full of dog's teeth.  If water could just go bad, it would taste exactly like Bud Light.  The perfect beer for removing NO from your vocabulary!";
    }
    console.log(thisBeer);
    beerGenerator(thisBeer, [true, '.main-area', 'row', 'medium']);
    recommend(thisBeer);
  });

  $(".scroll-right").click(function() {
    $(".scroll-left").prop("disabled", false);
    var prevTarget = document.querySelector(".scroll-right").parentNode.previousSibling.id;
    var toAddNum = 0;
    var toRemoveNum = 0;
    for (var i = prevTarget.length; i > 0; i--) {
      if (!isNaN(prevTarget[i])) {
        toAddNum = parseInt(prevTarget[i]) + 1;
        toRemoveNum = parseInt(prevTarget[i]) - 2;
      }
    }
    var toRemove = "beerLink" + toRemoveNum;
    document.querySelector("#" + toRemove).remove();

    var toAdd = "beerLink" + toAddNum;
    $("<div id='" + toAdd + "' class='" + info[2] + " beercontainer'><div class='picture'><img class='beerImage' alt='No Image'></div><div class='title'><h1 class='beerName'></h1></div><div class='style'><h4 class='beerStyle'></h4></div><div class='description'></div></div>").insertAfter(("#" + prevTarget));
    if (data[toAddNum].labels) {
      $('#' + toAdd + ' .beerImage').attr('src', data[toAddNum].labels[info[3]]);
    }
    $("#" + toAdd + ' .beerName').append(data[toAddNum].name);
    $('#' + toAdd + ' .beerStyle').append(data[toAddNum].style.name);
    if (info[1] === ".main-area" || info[1] === '.chosenOne') {
      if (data[toAddNum].description) {
        $('#' + toAdd + ' .description').append("<textarea style='border-width: 0px; background-color: transparent; text-align: center' class='beerDesc' rows='12'></textarea>");
        $('#' + toAdd + ' .beerDesc').append(data[toAddNum].description);
      }
    }
    if (!data[toAddNum + 1]) {
      $(".scroll-right").prop("disabled", true);
    }
    $(".beercontainer").click(function() {
      var id = this.id;
      var name = document.querySelector("#" + id + " .beerName").innerHTML;
      var thisBeer = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].name === name) {
          thisBeer = [data[i]];
        }
      }
      beerGenerator(thisBeer, [true, '.main-area', 'row', 'medium']);
      recommend(thisBeer);
    });

  });

  $(".scroll-left").click(function() {
    var prevTarget = document.querySelector(".scroll-right").parentNode.previousSibling.id;
    var toAddNum;
    for (var i = prevTarget.length; i > 0; i--) {
      if (!isNaN(prevTarget[i])) {
        toAddNum = parseInt(prevTarget[i]) - 3;
      }
    }
    var toAdd = "beerLink" + toAddNum;
    $("#" + prevTarget).remove();
    console.log(toAdd);
    console.log(toAddNum);
    $("<div id='" + toAdd + "' class='" + info[2] + " beercontainer'><div class='picture'><img class='beerImage' alt='No Image'></div><div class='title'><h1 class='beerName'></h1></div><div class='style'><h4 class='beerStyle'></h4></div><div class='description'></div></div>").insertAfter(".leftScroll");
    if (data[toAddNum].labels) {
      $('#' + toAdd + ' .beerImage').attr('src', data[toAddNum].labels[info[3]]);
    }
    $("#" + toAdd + ' .beerName').append(data[toAddNum].name);
    $('#' + toAdd + ' .beerStyle').append(data[toAddNum].style.name);
    if (info[1] === ".main-area" || info[1] === '.chosenOne') {
      if (data[toAddNum].description) {
        $('#'+ toAdd + ' .description').append("<textarea style='border-width: 0px; background-color: transparent' class='beerDesc' rows='12' ></textarea>");
        $('#' + toAdd + ' .beerDesc').append(data[toAddNum].description);
      }
    }
    if (toAddNum === 0) {
      $(".scroll-left").prop("disabled", true);
    }
    $(".beercontainer").click(function() {
      var id = this.id;
      var name = document.querySelector("#" + id + " .beerName").innerHTML;
      var thisBeer = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].name === name) {
          thisBeer = [data[i]];
        }
      }
      beerGenerator(thisBeer, [true, '.main-area', 'row', 'medium']);
      recommend(thisBeer);
    });

  });

}

function recommend(data) {
  var acceptable = false;
  var add;
  var search = "https://jsonp.afeld.me/?url=http%3A%2F%2Fapi.brewerydb.com%2Fv2%2Fbeers";
  if (data[0].styleId) {
    var styleid = data[0].styleId;
    acceptable = true;
    add = "%3FstyleId%3D" + styleid;
    search += add;
  }
  if (data[0].ibu) {
    var ibu = data[0].ibu;
    acceptable = true;
    add = "%3Fibu%3D" + ibu;
    search += add;
  }
  if (data[0].abv) {
    var abv = Math.floor(data[0].abv);
    acceptable = true;
    add = "%3Fabv%3D" + abv;
    search += add;
  }
  var easter = "American-Style Light (Low Calorie) Lager";
  var water = false;
  if (data[0].style.name === easter) {
    water = true;
  }
  var waterData = [
    {
      name: "Nestle Pure Life Bottled Water",
      labels: {
        icon: "http://i.ebayimg.com/images/g/kCQAAOSwrklVUeOo/s-l64.jpg",
        medium: "http://static.wixstatic.com/media/9c74a3_dfbf5e4ef74343928c1640b2cf163703.jpg_256"
      },
      style: {
        name: "American-Style Light (Low Calorie) Lager"
      },
      description: "This delectable brew is as fresh as they come.  Straight from the mountains, this concoction contains every bit of the flavor (and more) of a light beer."
    },
    {
      name: "Dasani Natural Spring Water",
      labels: {
        icon: "http://thesmartlocal.com/media/reviews/photos/thumbnail/64x64c/e5/e0/2a/5648_bottle-1365056060.jpg",
        medium: "http://static.wixstatic.com/media/6651ab_232d480dc2dc4e84917cded580bcb53c.jpg_256"
      },
      style: {
        name: "American-Style Light (Low Calorie) Lager"
      },
      description: "This delectable brew is as fresh as they come.  Straight from the mountains, this concoction contains every bit of the flavor (and more) of a light beer."
    },
    {
      name: "Glaceau Smart Water",
      labels: {
        icon: "http://www.datadesk.co.uk/media/catalog/product/cache/1/small_image/64x/9df78eab33525d08d6e5fb8d27136e95/g/l/gleacu_smart_water.jpg",
        medium: "http://static.wixstatic.com/media/ac82ec_2fa68ca571584cd389a257e168cf1e0b.jpg_256"
      },
      style: {
        name: "American-Style Light (Low Calorie) Lager"
      },
      description: "This delectable brew is as fresh as they come.  Straight from the mountains, this concoction contains every bit of the flavor (and more) of a light beer."
    }];
  search += "%3F%26key%3Df76910d92fc27802ff77fb5e24ae5ff2";
  $(".recommended").append("<h2>Recommended for You</h2>");
  if (acceptable === true && water === false) {
    console.log(document.querySelector(".recommended"));
    ajax('GET', search, beerSearch, [false, '.recommended', 'row', 'icon', data]);
  } else if (water === true) {
    beerGenerator(waterData, [false, '.recommended', 'row', 'icon']);
  }
}

$(".searchbar").keyup(function(event){
    if(event.keyCode === 13){
        $(".index").click();
    }
});
