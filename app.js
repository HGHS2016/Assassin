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

// Set path to Fonts template directory
app.set('fonts', __dirname + '/fonts');

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// Bind the root '/' URL to the login page
app.get('/', function(req, res){
	res.render('welcome.jade', {title: "LET'S PLAY ASSASSINS"});
});

app.get('/home', function(req, res){
	res.render('home.jade', {title: "HOME"});
});

// Bind the root '/' URL to the login page
app.get('/login', function(req, res){
	res.render('login.jade', {pageData: {title: "LET'S PLAY ASSASSINS"}, failed: 'false'});
});

app.get('/loginfailed', function(req, res){
	res.render('login.jade', {pageData: {title: "LET'S TRY TO LOGIN AGAIN", failed: 'true'}});
});

app.get('/signup', function(req, res){
	res.render('signup.jade', {pageData: {title: "Sign Up!", failed: false}});
});

app.get('/signupfailed', function(req, res){
	res.render('signup.jade', {pageData: {title: "Sign Up Failed!", failed: true}});
});

app.get('/create', function(req, res){
	res.render('create.jade', {title: "Make a Game!"});
});

app.get('/god', function(req, res){
	res.render('god.jade', {title: "gods view!"});
});

app.get('/createTeam', function(req, res){
	res.render('newteam.jade', {title: "Create a Team"});
});

app.get('/kill', function(req, res){
	res.render('kill.jade', {title: "LET'S KILL"});
});

app.get('/sendingkill', function(req, res){
  console.log(req.getLat());
  res.send("Hello");
});

app.get('/playerlist', function(request, response) {
//<<<<<<< HEAD
	 /* var players = [];
'characters/all',        players.push({"name": "Hanzhi Zou", "role": "God", "id": "gangrene"});
				players.push({"name": "Pineapple Joe", "role": "Player", "id": "iluvfruit98095843141234234"});
			response.send(JSON.stringify(players));
			*/
//=======
//>>>>>>> 8a8b8e3a6d04bb35d6cc5477682ba44d20b1bce3
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

app.get('/loggingin', function(request, response) {
	assassin.get(request.param('user'), function(err, body) {
		if(!err) {
			console.log("THIS IS THE BODY: " + JSON.stringify(body));
			if(body.role == "god") {
				response.redirect("/god");
			}
			else if(body.role == "assassin") {
				response.redirect("/home");
			}
		}
		else {
			response.redirect("/loginfailed");
		}
	});
	//response.send("Hi");
});

app.get('/signingup', function(request, response) {
	if(request.param('pass') != request.param('pass2')) {
		response.redirect("/signupfailed");
	}
	else {
		var id = request.param('user');
		assassin.insert({type:"player", first:request.param('first'), last:request.param('last'), role:"assassin", status:"alive"}, id, function(err, body, header) {
			if(!err) {
				response.redirect("/home");
			}
			else {
				response.redirect("/signupfailed");
			}
		});
	}
});


//<<<<<<< HEAD
//app.get('/initdata', function(request,response) {
		/* stub for really dropping and recreating the database. for now we'll just load
			 cloudant.db.destroy('assassin', function(err) {
			 if (!err) {
		 cloudant.db.create('assassin', function(err) {
			 if (!err) {
					 assassin = cloudant.db.use('assassin'); }})}})
		*/
/*
			 csv.parseCSV("public/data/players.csv", function(data){
			data.forEach(function(player) {
									var id = player.first.substr(0,2).concat(player.last).toLowerCase();
						assassin.insert(player, id, function(err, body, header) {
				if (err)
						{ return console.log('[assassin.insert] ', err.message) };
				console.log('You have inserted the player.');
													console.log(body);
					})
					})}, true);

			 csv.parseCSV("public/data/teams.csv", function(data){
			data.forEach(function(team) {
									assassin.insert(team, team.name, function(err, body, header) {
				if (err)
						{ return console.log('[assassin.insert] ', err.message) };
				console.log('You have inserted the team.');
													console.log(body);
					})
				})}, true);
			 response.send('data loading');
		});
*/
//=======
app.get('/initdata', function(request,response) {
		var initialize = require('./public/js/cloudantinit.js');
		initialize.loaddata(cloudant);
		response.send('data loading');
		});

//>>>>>>> 8a8b8e3a6d04bb35d6cc5477682ba44d20b1bce3

// start server on the specified port and binding host
var server = app.listen(appEnv.port, '0.0.0.0', function() {
	// print a message when the server starts listening
	console.log("server starting on port %d on host %s url %s ", server.address().port, appEnv.bind, appEnv.url);
});
