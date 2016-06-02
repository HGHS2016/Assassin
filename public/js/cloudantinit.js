module.exports.loaddata = reinitdata
module.exports.computetargets = computetargets

var csv = require('csv-array');
var HashMap = require('hashmap');

var local; 
var assassin;

function computetargets(cloudant, callback) {
    local = cloudant;
    assassin = local.db.use('assassin');
    assassin.view('team', 'team-index', {include_docs: true}, function(err, body) {
	if(err) return err;
	teams = afterteam(err, body);
	callback(teams);
    });
}

function initteamrow(curteam) {
    var teamrow = {};
    teamrow.name = curteam;
    teamrow.player1 = {};
    teamrow.player2 = {}
    teamrow.target = {};
    return teamrow;
}

function computeteamstatus(team) {
    if (team.player1.status != 'alive' && team.player2.status != 'alive')
	team.status = 'dead';
    else team.status = 'alive';
    if (team.name == "grape" || team.name == "cantalope") team.status = 'dead';
}

function afterteam(err, body) {
    if (err) return err;   
    var teams = new HashMap();
    var curtarget;
    var curteam = body.rows[0].key.team;
    var teamrow = initteamrow(curteam);
    body.rows.forEach(function(row) {
	if (curteam != row.key.team) {
	    computeteamstatus(teamrow);
	    teams.set(teamrow.name, teamrow);
	    curteam = row.key.team;
	    teamrow = initteamrow(curteam);
	};
	if (row.key.field == 'player1') {
	    teamrow.player1.name = row.doc.first.concat(' ').concat(row.doc.last);
	    teamrow.player1.status = row.doc.status;
	};
	
	if (row.key.field == 'player2') {
	    teamrow.player2 = row.doc.first.concat(' ').concat(row.doc.last);
	    teamrow.player2.status = row.doc.status;
	};
	
	if (row.key.field == 'target') {
	    teamrow.target.original = row.doc.name;
	    teamrow.target.current =  row.doc.name;
	};
    });
    computeteamstatus(teamrow);
    teams.set(teamrow.name, teamrow);
    teams.forEach(function(team) {
	curtarget = teams.get(team.target.current);
	console.log(JSON.stringify(curtarget));
	while (curtarget.status == 'dead' && curtarget != team) {
	    team.target.current = curtarget.target.current
	    curtarget = teams.get(team.target.current);
	}
    });
    console.log(JSON.stringify(teams));
    return teams;
}

function reinitdata(cloudant) {
    local = cloudant;
    local.db.destroy('assassin', afterdestroy);
}

function afterdestroy(err) {
    if(err) return err;
    console.log('You have destroyed the assassin database.');
    local.db.create('assassin', afterdbcreate);
    assassin  = local.db.use('assassin');
}

function afterdbcreate(err) {
    if(err) return err;
    console.log('You have created the assassin database');
    var indices = [
	{
	    "_id": "_design/players",
	    "views": {
		"players-index": {
		    "map": "function (player) {\n  if (player.type == 'player')\n  {\n    emit({role:player.role, last:player.last}, {name: player.first.concat(' ').concat(player.last), role: player.role, status: player.status });\n  }\n}"
		}
	    },
	    "language": "javascript"
	},
	{
	    "_id": "_design/team",
	    "views": {
		"team-index": {
		    "map": "function (team) {\n  if(team.type == 'team') {\n    emit({team:team.name, field:\"player1\"}, {_id:team.player1});\n    emit({team:team.name, field:\"player2\"}, {_id:team.player2});\n    emit({team:team.name, field:\"target\"}, {_id:team.target});\n  } \n} "
		}
	    },
	    "language": "javascript"
	}
	];
    assassin.bulk( {'docs': indices}, afterindexcreate);
}

function afterindexcreate(err, body, header) {
    if(!err) {
        console.log('You have created the indicies.');
        console.log(body);
	err = csv.parseCSV("public/data/players.csv", insertplayers, true);
    }
    if(!err) 
	err = csv.parseCSV("public/data/teams.csv", insertteams, true);
    return err;
}

function insertplayers(data) {
    data.forEach(function(player) {
	    var id = player.first.substr(0,2).concat(player.last).toLowerCase();
	    assassin.insert(player, id, function afterplayerinsert(err, body, header) {
		    if (err) 
			{ return console.log('[assassin.insert] ', err.message) };
		    console.log('You have inserted the player.');
		    console.log(body);
		});
	})}


function insertteams(data) {
    data.forEach(function(team) {
	    assassin.insert(team, team.name, function afterteaminsert(err, body, header) {
		    if (err) 
			{ return console.log('[assassin.insert] ', err.message) };
		    console.log('You have inserted the team.');
		    console.log(body);
		});
	})}

