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


function createTargetTableRow(name, target, time) {
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
  console.log(table);
  var toggle = true;
  $.get("/teamlist", function(data) {
    var teams = JSON.parse(data);
    var html = '';
    organizeTeams(teams).forEach(function(team) {
      toggle = !toggle;
      html = html.concat(createTeamTableRow(team.name, team.player1.name, team.player2.name, team.target.current, toggle));
    });
    table.last().after(html);
  });
}

/**
 * Populate the hiscore table by retrieving top 10 scores from the DB.
 * Called when the DOM is fully loaded.
 */
function populateTargetTable() {
  var table = $("#target_table tr");
  var toggle = false;
  $.get("/targetlist", function (data) {
    console.log(data);
    var targets = JSON.parse(data);
    console.log('targets value: ' + targets);
    for(var target in targets){
      toggle = !toggle;
      console.log(target);
      var html = createTeamTableRow(target.name, target.player1.name, target.player2.name, target.target.current, toggle);
      table.last().after(html);
    };
  });
}


function organizeTeams(teams){
  teams.sort();
  var ret = new Array();
  ret.push(teams[0])
  console.log(ret[0]);
  var i = 0;
  var j = 0;
  while(ret < teams){
    if(ret[i].target == teams[j].name){
      ret.push(teams[j]);
      j = 0;
      i++;
    } else {
      j++;
    }
  }
  ret.forEach(function(value){
    console.log(value);
  });
  return ret;
}

$(populatePlayerTable);
$(populateTeamTable);
$(populateTargetTable);
