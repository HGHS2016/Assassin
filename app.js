/*eslint-env node, express*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

var express = require('express');
var app = express();
var session = require('client-sessions');

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

var datamodule = require('./public/js/cloudantinit.js');

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

//session handler middleware
app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

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
	
	res.send("HI");
	
});

app.get('/playerlist', function(request, response) {
    assassin.view('players', 'players-index',  function(err, body) {
    	    if(!err) {
    		var players = [];
    		body.rows.forEach(function(doc) {
    			players.push(doc.value);
    		});
    		response.send(JSON.stringify(players));
    	}
    });
});

app.get('/badkill', function(request, response) {
    var opts = {};
    opts.db = "assassin";
    opts.method = "get";
    opts.content_type = "json";
    opts.path = "_design/location/_geo/newGeoIndex?g=POINT(-73.757322+41.174823)&include_docs=true";
    cloudant.request(opts, function(err,body) {
	if (err) {
	    console.log("[badkill, cloudant error" + JSON.stringify(err));
	    return;
	}
 	response.send(JSON.stringify(body.rows));
    });
});

app.get('/goodkill', function(request, response) {
    var opts = {};
    opts.db = "assassin";
    opts.method = "get";
    opts.content_type = "json";
    opts.path = "_design/location/_geo/newGeoIndex?g=point(10+10)&include_docs=true";
    cloudant.request(opts, function(err,body) {
	if (err) {
	    console.log("[goodkill, cloudant error" + JSON.stringify(err));
	    return;
	}
 	response.send(JSON.stringify(body.rows));
    });
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
    datamodule.computetargets(cloudant, response)
});

//    targets.push({"name": "Hanzhi Zou", "target": "Sonya", "time": "2 hours"});
//    targets.push({"name": "Jon Bass", "target": "Gangrene", "time": "2 minutes"});



app.get('/welcomehome', function(request, response) {
	console.log("THIS IS THE LOG FOR THE REQUEST: " + request.param('user'));
		var targets = [];
		targets.push({"name": "Hanzhi Zou", "target": "Sonya", "time": "2 hours"});
		targets.push({"name": "Jon Bass", "target": "Gangrene", "time": "2 minutes"});
		response.send(JSON.stringify(targets));
});

app.get('/loggingin', function(request, response) {
	assassin.get(request.param('user'), function(err, body) {
		if(!err) {
			if(body.password == request.param('pass')) {
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
		}
		else {
			response.redirect("/loginfailed");
		}
	});
	//response.send("Hi");
});

//login should use post, but this is not working
/*app.post('/login', function(req, res){
	assassin.get(req.param('user'), function(err, body) {
		console.log("THIS IS USER: " + req.param('user'));
		if(!err){
			console.log("not error!");
			console.log(JSON.stringify(body));
			if(body.password == req.param('pass')) {
				console.log("correct pass!");
				if(body.role == "god") {
					console.log("god");
					res.redirect("/god");
				}
				else if(body.role == "assassin") {
					console.log("assassin");
					res.redirect("/home");
				} else {
					res.render("login.jade", {error: 'something failed'});
				}
			}
			else {
				console.log("fail2");
				res.render("login.jade", {error: 'Invalid username or password.'});
			}
		}
		else {
			console.log("fail");
			res.render("login.jade", {error: 'Invalid username or password.'});
		}
	});
});*/

app.get('/signingup', function(request, response) {
	if(request.param('pass') != request.param('pass2')) {
		response.redirect("/signupfailed");
	}
	else {
		var id = request.param('user');
		var d1 = Math.floor(Math.random() * 10).toString();
		var d2 = Math.floor(Math.random() * 10).toString();
		var d3 = Math.floor(Math.random() * 10).toString();
		var uid = d1.concat(d2, d3);
		var possibleletters = "abcdefghijklmnopqrstuvwxyz";
		for(var i = 0; i <= 2; i++) {
			uid = possibleletters.charAt(Math.floor(Math.random() * 26)).concat(uid);
		}
		assassin.insert({password:request.param('pass'), uniqueid:uid, type:"player", first:request.param('first'), last:request.param('last'), role:"assassin", status:"alive"}, id, function(err, body, header) {
			if(!err) {
				response.redirect("/home");
			}
			else {
				response.redirect("/signupfailed");
			}
		});
	}
});


app.get('/initdata', function(request,response) {
    datamodule.loaddata(cloudant, function() {
	response.send('data loading');})
});

// start server on the specified port and binding host
var server = app.listen(appEnv.port, '0.0.0.0', function() {
	// print a message when the server starts listening
	console.log("server starting on port %d on host %s url %s ", server.address().port, appEnv.bind, appEnv.url);
});
