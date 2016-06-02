/**
 * Player List
 */

function createPlayerTableRow(name, role, status, toggle) {

  var state = '';
  var job = '';

  if(role != 'god'){
    if(status == 'alive'){
      state = '<i class="material-icons">check</i>';
    } else {
      state = '<i class="material-icons">close</i>';
    }
  } else {
    state = '<i class="material-icons">remove</i>';
  }

  if(role == 'god'){
    job = '<i class="material-icons">flash_on</i>';
  } else {
    job = '<i class="material-icons">person</i>';
  }
    if(toggle){
      return '<tr class = "blue-grey darken-2"><td>' + name + '</td><td class = "center">' + job + '</td><td class = "center">' + state + '</td></tr>';
    } else {
      return '<tr><td>' + name + '</td><td class = "center">' + job + '</td><td class = "center">' + state + '</td></tr>';
    }
}

function createTeamTableRow(name, player1, player2, target, toggle) {
  if(toggle){
    return '<tr class= "amber darken-3"><td>' + name + '</td><td class = "center">' + player1 + '</td><td class = "center">' + player2 + '</td><td class = "center">' + target + '</td></tr>';
  } else {
    return '<tr><td>' + name + '</td><td class = "center">' + player1 + '</td><td class = "center">' + player2 + '</td><td class = "center">' + target + '</td></tr>';
  }
}


function createTableRow(name, target, time) {
    return '<tr><td>' + name + '</td><td class="center">' + target.toUpperCase() + '</td><td>' + time + '</td></tr>';
}

/**
 * Populate the hiscore table by retrieving top 10 scores from the DB.
 * Called when the DOM is fully loaded.
 */
function populatePlayerTable() {
  var table = $("#player_table tr");
  var toggle = false;
  $.get("/playerlist", function (data) {
    var players = JSON.parse(data);
    players.forEach(function (player) {
      toggle = !toggle;
      var html = createPlayerTableRow(player.name, player.role, player.status, toggle);
      table.last().after(html);
    });
  });
}

function populateTeamTable() {
  var table = $("#team_table tr");
  var toggle = true;
  $.get("/teamlist", function(data) {
    var teams = JSON.parse(data);
    teams.forEach(function(team) {
      toggle = !toggle;
      var html = createTeamTableRow(team.name, team.player1, team.player2, team.target, toggle);
      table.last().after(html);
    });
  });
}

$(populatePlayerTable);
$(populateTeamTable);
