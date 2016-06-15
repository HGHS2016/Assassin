function createDropDown(killer, killed, notes) {
  return "<ul class = 'collapsible' data-collapsible = 'accordion'>" +
            "<div class = 'collapsible-header black-text'>" +
              "<tr>" +
                "<th class = 'table-header'>" + killer + "</th>" +
                "<th class = 'table-header'>" + killed + "</th>" +
              "</tr>" +
            "</div>" +
            "<div class = 'collapsible-body'>" +
              "<p> hi </p>" +
            "</div>" +
          "</ul>";
}

function generatePendingDropDowns(){
  var body = $("#body");
  console.log("hi!");
  $.get("/confirmkill", function(data) {
    var html = '';
    console.log(data);
    //var kills = JSON.parse(data);
  }
}

$(generatePendingDropDowns);
