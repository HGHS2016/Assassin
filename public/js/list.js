/**
 * Player List
 */

function createTableRow(name, role, status) {
  return '<tr><td>' + name + '</td><td>' + role + '</td><td>' + status + '</td></tr>';
}

function createTableRow(name, player1, player2, target) {
  return '<tr><td>' + name + '</td><td>' + player1 + '</td><td>' + player2 + '</td><td>' + target + '</td></tr>';
}

function createTableRow(name, target, time) {
  return '<tr> <td>' + name + '</td><td>' + target + '</td><td>' + time + '</td></tr>';
}

/**
 * Populate the hiscore table by retrieving top 10 scores from the DB.
 * Called when the DOM is fully loaded.
 */
function populatePlayerTable() {
  var table = $("#player_table tr");
  $.get("/playerlist", function (data) {
    var players = JSON.parse(data);
    players.forEach(function (player) {
      var html = createTableRow(player.name, player.role, player.status);
      table.last().after(html);
    });
  });
}

function populateTeamTable() {
  var table = $("#team_table tr");
  $.get("/teamlist", function(data) {
    var teams = JSON.parse(data);
    teams.forEach(function(team) {
      var html = createTableRow(team.name, team.player1, team.player2, team.target);
      table.last().after(html);
    });
  });
}

$(populatePlayerTable);
$(populateTeamTable);
