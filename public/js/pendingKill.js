function createDropDown(killer, killed, notes) {
  return "<li>" +
            "<div class = 'collapsible-header blue-grey darken-1'>" +
              "<div class='row'>" +
                "<div class='col s12 m6 flow-text'><u>Killer:</u> " + killer + "</h1></div>" +
                "<div class='col s12 m6 flow-text'><u>Killed:</u> " + killed + "<h1></div>" +
              "</div>" +
            "</div>" +
            "<div class = 'collapsible-body white darken-1 black-text'>" +
              "<p>"+ notes +" </p>" +
            "</div>" +
          "</li>";
}

function generatePendingDropDowns(){
  var body = $("#list");
  console.log(body);
  $.get("/confirmkill", function(data) {
    var html = '';
    var kills = JSON.parse(data);
    kills.forEach(function(info) {
      html = html.concat(createDropDown(info.killer,info.killed,info.notes))
    });

    body.append(html);
  });
}

$(generatePendingDropDowns);
