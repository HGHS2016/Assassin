var x;
function loader(){
  x = document.getElementById("coords");
  console.log(x);
  console.log(x.value);
}
function logPosition(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function showPosition(position) {
          x.value = position.coords.latitude + " N " + position.coords.longitude + " S ";
          console.log(x.value);
        });
    } else {
        x.value = "Geolocation is not supported by this browser.";
        console.log(x.value);
    }
}

/**
function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
}

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
  x.value = '';
}

$(loader);
$(clear);
