/**
 * TeamList
 */

function createTableRow(teamName, player1, player2, target) {
  return '<tr> <td>' + teamName + '</td><td>' + player1 + '</td><td>' + player2 + '</td><td>' + target + '</td></tr>';
}

/**
 * Populate the hiscore table by retrieving top 10 scores from the DB. 
 * Called when the DOM is fully loaded.
 */
function populateTable() {	
  var table = $("#team_table tr");
  $.get("/teamlist", function (data) {
    var teams = JSON.parse(data);
    teams.forEach(function (team) {
      var html = createTableRow(team.teamName, team.player1, team.player2, team.target);
      table.last().after(html);		
    });
  });	
}

$(populateTable);