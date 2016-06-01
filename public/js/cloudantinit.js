module.exports.loaddata = reinitdata

var csv = require('csv-array');

var local; 
var assassin;

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

