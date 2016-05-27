/**
 * Player List
 */

function createTableRow(first, last, role, id) {
  return '<tr> <td>' + first + '</td><td>' + last + '</td><td>' + role + '</td><td>' + id + '</td></tr>';
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
      var html = createTableRow(player.first, player.last, player.role, player.id);
      table.last().after(html);		
    });
  });	
}

$(populateTable);