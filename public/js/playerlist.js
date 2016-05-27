/**
 * Player List
 */

function createTableRow(name, role, id) {
  return '<tr> <td>' + name + '</td><td>' + role + '</td><td>' + id + '</td></tr>';
}

/**
 * Populate the hiscore table by retrieving top 10 scores from the DB. 
 * Called when the DOM is fully loaded.
 */
function populateTable() {	
  var table = $("#player_table tr");
  $.get("/playerlist", function (data) {
    var players = JSON.parse(data);
    players.forEach(function (player) {
      var html = createTableRow(player.name, player.role, player.id);
      table.last().after(html);		
    });
  });	
}

$(populateTable);