var x = document.getElementById("demo");
function getLocation(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
    callback(position);
});
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
}

function logPosition(position) {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function showPosition(position) {
        document.getElementById("location").value = position.coords.latitude + " N " + position.coords.longitude + " S ";
        callback(position);
});
  } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function clear(){
  document.getElementById("location").value = "add location";
}
