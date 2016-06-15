
function createDropDown(id, killer, killed, notes) {
  return "<li>" +
            "<div class = 'collapsible-header blue-grey darken-1'>" +
              "<div class='row'>" +
                "<div class='col s12 m6 l4 flow-text'><i class='material-icons'>person</i> " + killer + "</h1></div>" +
                "<div class='col s12 m6 l4 flow-text'><i class='material-icons'>fingerprint</i> " + killed + "</div>" +
                "<div class='col s12 m6 l4 flow-text'><i class='material-icons'>assignment</i>" + notes + "</div>" +
              "</div>" +
            "</div>" +
            "<div class = 'collapsible-body blue-grey darken-2 black-text'>" +
              "<div class='row'>" +
                "<form class='col s12' action='/confirmingkill'>" +
                  "<div class='input-field'>" +
                    "<input type='hidden' name='Killer' value'" + killer + "'>" +
                  "</div>" +
                  "<div class='input-field'>" +
                    "<input type='hidden' name='id' value'" + id + "'>" +
                  "</div>" +
                  "<div class='input-field'>" +
                    "<input type='hidden' name='Killed' value'" + killed + "'>" +
                  "</div>" +
                  "<div class='input-field' col s12>" +
                    "<i class='material-icons prefix white-text'>mode_edit</i>" +
                    "<textarea class='materialize-textarea white-text' name='notes' id='notes'>" + notes + "</textarea>" +
                  "</div>" +
                  "<div class='row'>"+
                    "<button class='card btn waves-effect waves-light col' type='submit' name='confirm' value='false'>" +
                      "<i class='material-icons'>thumb_down</i>" +
                    "</button>" +
                    "<button class='card btn waves-effect waves-light col' type='submit' name='confirm' value='true'>" +
                      "<i class='material-icons'>thumb_up</i>" +
                    "</button>" +
                  "</div>" +
                " </form>" +
              "</div>" +
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
      html = html.concat(createDropDown(info.id, info.killer,info.killed,info.notes))
    });

    body.append(html);
  });
}

function goodkill(){

}
$(generatePendingDropDowns);
