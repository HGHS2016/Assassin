var x;
function loader(){
  var x = document.getElementById("coords");
}
function logPosition(callback) {
    console.log(x);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function showPosition(position) {
          document.getElementById("coords").value = position.coords.latitude + " N " + position.coords.longitude + " S ";
        });
    } else {
        document.getElementById("coords").value = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
}
/**
function logPosition(callback) {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function showPosition(position) {
        document.getElementById("coords").value = position.coords.latitude + " N " + position.coords.longitude + " S ";
        callback(position);
});
  } else {
      document.getElementById("coords").value = "Geolocation is not supported by this browser.";
  }
}
*/
function clear(){
  console.log('boop');
  var clear = "";
  document.getElementById("coords").value = "hi";
  callback(clear);
}

$(loader);
