/*eslint-env node, express*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

var express = require('express');
var app = express();

//var http = require('http')

//var host = "localhost"
//var port = 3030;

var cloudanturl = {
  url:"https://edbede34-5fac-45c8-a2a9-a066bb3d6000-bluemix:6d0fd78d822e7fa111e98b26c317ebddb5464fecf17d2731d7a0bb50ddd01c7b@edbede34-5fac-45c8-a2a9-a066bb3d6000-bluemix.cloudant.com"	 		 
};

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// Parse out Cloudant settings

if (!appEnv.isLocal) {
   cloudanturl = appEnv.getServiceCreds(/Cloudant/);
}

var cloudant = require('cloudant')(cloudanturl.url);
var assassin = cloudant.db.use('assassin');

// Set path to JavaScript files
app.set('js', __dirname + '/js');

// Set path to image files
app.set('images', __dirname + '/images');

// Set path to Jade template directory
app.set('views', __dirname + '/views');

// Set path to Jade template directory
app.set('data', __dirname + '/data');

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// Bind the root '/' URL to the login page
app.get('/', function(req, res){
  res.render('welcome.jade', {title: "LET'S PLAY ASSASSINS"});
});

// Bind the root '/' URL to the login page
app.get('/login', function(req, res){
  res.render('login.jade', {title: "LET'S PLAY ASSASSINS"});
});

app.get('/signup', function(req, res){
  res.render('signup.jade', {title: "Sign Up!"});
});

app.get('/create', function(req, res){
  res.render('create.jade', {title: "Make a Game!"});
});

app.get('/gods', function(req, res){
  res.render('gods.jade', {title: "gods view!"});
});

app.get('/playerlist', function(request, response) {
	assassin.view('players', 'players-index', function(err, body) {
    	if(!err) {
    		var players = [];
    		body.rows.forEach(function(doc) {
    			players.push(doc.value);
    		});
    		response.send(JSON.stringify(players));
    	}
    });
}); 

app.get('/learn', function(request, response) {
	var opts = {};
        opts.db = "assassin"; 
        opts.method = "get";
        opts.path 
    
	assassin.get('jobass', function(err,body) {
		if (!err) {
		    console.log(body);
		}});
 	response.send("Hello");
    });


app.get('/teamlist', function(request, response) {
	assassin.view('team', 'team-index', {include_docs: true},  function(err, body) {
		if(!err) {
		    var teams = [];
		    var curteam = body.rows[0].key.team;
		    var teamrow = {};
		    teamrow.name = curteam;
		    body.rows.forEach(function(row) {
			    if (curteam != row.key.team) {
				teams.push(teamrow);
				curteam = row.key.team;
				teamrow = {};
				teamrow.name = curteam;
			    };
			    if (row.key.field == 'player1')
				teamrow.player1 = row.doc.first.concat(' ').concat(row.doc.last);
			    if (row.key.field == 'player2')
				teamrow.player2 = row.doc.first.concat(' ').concat(row.doc.last);
			    if (row.key.field == 'target')
				teamrow.target = row.doc.name; 
			});
		    teams.push(teamrow);
		    response.send(JSON.stringify(teams));
		}
	    });
    });

app.get('/targetlist', function(request,response) {
    var targets = []; 
    targets.push({"name": "Hanzhi Zou", "target": "Sonya", "time": "2 hours"});
    targets.push({"name": "Jon Bass", "target": "Gangrene", "time": "2 minutes"});
    response.send(JSON.stringify(targets));
});


app.get('/initdata', function(request,response) {
    var initialize = require('./public/js/cloudantinit.js');
    initialize.loaddata(cloudant);
    response.send('data loading');
    });


// start server on the specified port and binding host
var server = app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
	console.log("server starting on port %d on host %s url %s ", server.address().port, appEnv.bind, appEnv.url);
});
