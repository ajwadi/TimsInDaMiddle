/*
var addSearchBox = function () {


    var box = "<input>";
    $('#searchBoxes').append(box);

}

*/
var counter = 2;
var locationArray = [];
var autoCompleteArray = [];

function addInput(divName){
  var newdiv = document.createElement('div');
  newdiv.id = ("d" + counter);
  newdiv.innerHTML = "<input id='point" + counter + "' class='controls' type='text' placeholder='Enter a location'>";
  document.getElementById(divName).appendChild(newdiv);
  counter++;
  this.initMap();;
}
function minusInput(divName){
    if(2 < counter) {
        document.getElementById(divName).removeChild(document.getElementById('d' + (counter - 1)));
        counter--;
        this.initMap();;
    } else {
        alert("Cannot find midpoint of a single location");
    }
}

var row = counter;
var map;
var markerArr = [];

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 10,
        mapTypeControl: false,
        streetViewControl: false,
        scrollwheel: false
    });

    // HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    for (var i = 0; i < counter; i++) {
        var input = (document.getElementById('point' + i));
        var autoComplete = new google.maps.places.Autocomplete(input);
        autoComplete.bindTo('bounds', map);
        autoCompleteArray.push(autoComplete);
    }

    var infowindow = new google.maps.InfoWindow();

    for (var a = 0; a < autoCompleteArray.length; a++){
        
        var placeObject = autoCompleteArray[a];
            console.log(placeObject.getPlace());


            placeObject.addListener('place_changed', function() {
            var place = this.getPlace();

            locationArray.push([place.geometry.location.lat(),place.geometry.location.lng()]);
            paint (place, locationArray);
        });
    }

    function paint(place, locationArray){
        for (var i = 0; i < locationArray.length; i++){

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(locationArray[i][0], locationArray[i][1]),
                map: map
            });

            markerArr.push(marker);

            marker.setIcon(/** @type {google.maps.Icon} */({
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(35, 35)
            }));

            marker.setVisible(true);

            var address = '';
            if (place.address_components) {
                address = [
                    (place.address_components[0] && place.address_components[0].short_name || ''),
                    (place.address_components[1] && place.address_components[1].short_name || ''),
                    (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
            }

            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
            infowindow.open(map, marker);
        }
    }

    function findMidPoint(locationArray) {
        /*
        var lat1 = locationArray[0][0];
        var lat2 = locationArray[1][0];

        var lng1 = locationArray[0][1];
        var lng2 = locationArray[1][1];

        var mid = [];

        mid[0] = (lat1 + lat2) / 2;
        mid[1] = (lng1 + lng2) / 2;

        console.log(mid[0]);
        console.log(mid[1]);

        */
        var mid = [];

        var latlong_to_rad = [];
        for (var i = 0; i < row; i++){
            latlong_to_rad.push([locationArray[i][0] * Math.PI/180, locationArray[i][1] * Math.PI/180]);
        }
        var X_array = [];
        for(var i = 0; i < row; i++){
            X_array.push(Math.cos(latlong_to_rad[i][0])*Math.cos(latlong_to_rad[i][1]));
        }

        var Y_array = [];
        for(var i = 0; i < row; i++){
            Y_array.push(Math.cos(latlong_to_rad[i][0])*Math.sin(latlong_to_rad[i][1]));
        }

        var Z_array = [];
        for(var i = 0; i < row; i++){
            Z_array.push(Math.sin(latlong_to_rad[i][0]));
        }

        var X = 0;
        var Y = 0;
        var Z = 0;

        for (var i = 0; i< row; i++){
            X += X_array[i];
            Y += Y_array[i];
            Z += Z_array[i];
        }

        var X = X/row;
        var Y = Y/row;
        var Z = Z/row;

        var Long = Math.atan2(Y,X);
        var Hyp = Math.sqrt(X*X + Y*Y);
        var Lati = Math.atan2(Z, Hyp);

        mid[0] = Lati * 180/Math.PI; //lat
        mid[1] = Long * 180/Math.PI; //long


       return mid;
    }


    $("#findButton").click(function(){
        var mid = findMidPoint(locationArray);
        findTims(mid);

        locationArray = [];

    });
}

function findTims(mid) {
    console.log(mid[0]);
    console.log(mid[1]);
    var bounds = new google.maps.LatLng(mid[0],mid[1]);
    var request = {
        location: bounds,
        types: ['cafe'],
        keyword: 'Tim Horton',
        rankBy: google.maps.places.RankBy.DISTANCE
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);

    function callback(results, status) {
        var lat = results[0].geometry.location.lat();
        var lng = results[0].geometry.location.lng();
        console.log(lat);
        console.log(lng);
        paintTims(lat, lng);

    }

}


function paintTims(lat, lng) {
    var infowindow = new google.maps.InfoWindow();
    infowindow.setContent('<a href=\'https://www.google.ca/maps/'+'@'+lat+','+lng+'\''+'>Directions</a>');
    infowindow.open(map, marker);


    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: map,
        icon: 'http://i.imgur.com/L3uPOwE.png'
    });

    marker.setIcon(({
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(35, 35)
    }));

    marker.setVisible(true);

    var bounds = new google.maps.LatLng(lat,lng);
    map.setCenter(bounds);

}




function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}



$(document).ready(initMap);
