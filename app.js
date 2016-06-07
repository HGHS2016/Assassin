/*eslint-env node, express*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

var express = require('express');
var app = express();
var session = require('client-sessions');
var pass = "";

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
	cookieName: 'userSession',
	secret: 'ducks',
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
	secure: false,
	httpOnly: false,
}));

// Bind the root '/' URL to the login page
app.get('/', function(req, res){
	res.render('welcome.jade', {pageData: {
		"title": "LET'S PLAY ASSASSINS",
	}});
});

app.get('/home', function(req, res){
	if (req.userSession && req.userSession.user) { //Check if session exists
		// lookup the user in the DB by pulling their username from session
		assassin.get(req.userSession.user, function(err, body){
			if(err){
				req.userSession.reset();
				req.redirect('/login')
			} else {
				var user = req.userSession.user
				// expose the user to the template
				res.locals.user = user;
				// render the player page

    		res.render('home.jade', {pageData: {
					title : "HOME",
					"user" : user,
				}});
				}
		});
	} else {
		res.redirect('/login');
	}
});

app.get('/login', function(req, res){
	res.render('login.jade', {pageData: {
		title: "LET'S PLAY ASSASSINS"},
		failed: 'false'
	});
});

app.get('/loggingin', function(req, res) {
    var user = req.query['user'];
    var pass = req.query['pass'];
    assassin.get(req.query['user'], function(err, body) {
	if(!err) {
	    if(body.password == req.query['pass']) {
				// sets a cookie with the user's info
				req.userSession.user = user;
				req.userSession.role = body.role;
		if(body.role == "god") {
		    res.redirect("/god");
		}
		else if(body.role == "assassin") {
		    res.redirect("/home");
		}
	    }
	    else {
				console.log("failed");
				res.render('login.jade', {pageData: {
					title: "LET'S TRY TO LOGIN AGAIN",
					error: 'Invalid username or password.'
				}});
	    }
	}
	else {
	    console.log("failed");
	    res.render('login.jade', {pageData: {
				title: "LET'S TRY TO LOGIN AGAIN",
				error: 'Invalid username or password.'
			}});
	}
    });
    //res.send("Hi");
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

app.get('/signup', function(req, res){
	res.render('signup.jade', {pageData: {
			title: "Sign Up!",
			failed: false
		}});
});

app.get('/signupfailed', function(req, res){
	res.render('signup.jade', {pageData: {
		title: "Sign Up Failed!",
		failed: true
	}});
});

app.get('/create', function(req, res){
	res.render('create.jade', {pageData: {
		title: "Make a Game!"
	}});
});

app.get('/god', function(req, res){
		if (req.userSession && req.userSession.user) { //Check if session exists
			// lookup the user in the DB by pulling their username from session
			assassin.get(req.userSession.user, function(err, body){
				if(err || !req.userSession.user){
					req.userSession.reset();
					req.redirect('/login')
				} else {
					var user = req.userSession.user;
					// expose the user to the template
					res.locals.user = user;
					// render the god page
					res.render('god.jade', {pageData: {
						"title": "gods view!",
						"user" : user,
					}});
				}
			});
		} else {
			res.redirect('/login');
		}
});

app.get('/createTeam', function(req, res){
	//res.render('newteam.jade', {title: "Create a Team"});
	console.log(res.locals.user);
	datamodule.computeplayers(cloudant, res)
});

app.get('/kill', function(req, res){
	res.render('kill.jade', {pageData: {
		title: "LET'S KILL"
	}});
});


app.get('/sendingkill', function(req, res) {
	assassin.view('players', 'players-index', {include_docs: true},  function(err, body) {
		if(!err) {
			//searches through all players to find entered in unique id
			var count = 0;
			var found = false;
			body.rows.forEach(function(row) {
				count++;
				if(row.doc.uniqueid == "abc122") {
					//gets the document for the found unique id
					assassin.get(row.doc._id, function(err2, body2) {
						if(!err2) {
							//finds path for geo view to check to see if the point is in any safezones
							var opts = {};
							opts.db = "assassin";
							opts.method = "get";
							opts.content_type = "json";
							opts.path = "_design/location/_geo/newGeoIndex?g=POINT(-10+10)&include_docs=true";
							cloudant.request(opts, function(err,body) {
								if (err) {
									console.log("[cloudant error" + JSON.stringify(err));
									return;
								}
								//goes here if there are no safezone conflicts (i.e. array of safezone conflicts is 0)
								if(body.rows.length == 0) {
									//res.locals.user
									assassin.insert({"properties":{"type":"kill", "killer":"jobass", "killed":body2._id, "confirmed":"true", "notes":"none"}, "geometry":{"type":"Point", "coordinates":{}}}, function(err3, body, header) {
										if(!err3) {
											res.send("Kill Submitted");
										}
										else {
											res.send("err3");
										}
									});
								}
								//goes here if there is/are safezone conflicts
								else {
									//res.locals.user
									assassin.insert({"properties":{"type":"kill", "killer":"jobass", "killed":body2._id, "confirmed":"false", "notes":"safezone fail"}, "geometry":{"type":"Point", "coordinates":{}}}, function(err3, body, header) {
										if(!err3) {
											res.send("Kill Submitted");
										}
										else {
											res.send("err3");
										}
									});
								}
							});
						}
						else {
							res.send("err2");//error if no docs found under row.doc._id (shouldn't ever hit this error)
						}
					});
					found = true;
				}
				else if(count == body.rows.length && !found) {
					res.send("unique id not found");
				}
			});
		}
		else {
			res.send("err");//error for unfound view? (shouldn't ever hit this error)
		}
	});
});

app.get('/playerlist', function(req, res) {
	datamodule.computeplayers(cloudant, res)
});

app.get('/badkill', function(req, res) {
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
	 res.send(JSON.stringify(body.rows));
		});
});

app.get('/goodkill', function(req, res) {
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
	 res.send(JSON.stringify(body.rows));
		});
});

// New version of teamlist
app.get('/teamlist', function(req, res) {
    datamodule.computeteams(cloudant, res)
});

/* Old version of teamlist
app.get('/teamlist', function(req, res) {
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
				res.send(JSON.stringify(teams));
		}
			});
		});
*/

app.get('/targetlist', function(req, res) {
    datamodule.computeteams(cloudant, res)
});

app.get('/mytarget', function(req, res) {
    user = req.query['user'];
    datamodule.computemytarget(cloudant, user, res)
});

//    targets.push({"name": "Hanzhi Zou", "target": "Sonya", "time": "2 hours"});
//    targets.push({"name": "Jon Bass", "target": "Gangrene", "time": "2 minutes"});



app.get('/welcomehome', function(req, res) {
	console.log("THIS IS THE LOG FOR THE req: " + req.query['user']);
		var targets = [];
		targets.push({"name": "Hanzhi Zou", "target": "Sonya", "time": "2 hours"});
		targets.push({"name": "Jon Bass", "target": "Gangrene", "time": "2 minutes"});
		res.send(JSON.stringify(targets));
});

//17,576,000 uniqueid possibilites meaning there is a chance that 2 people get the same one
app.get('/signingup', function(req, res) {
    if(req.query['pass'] != req.query['pass2']) {
		res.redirect("/signupfailed");
	}
	else {
		var id = req.query['user'];
		var d1 = Math.floor(Math.random() * 10).toString();
		var d2 = Math.floor(Math.random() * 10).toString();
		var d3 = Math.floor(Math.random() * 10).toString();
		var uid = d1.concat(d2, d3);
		var possibleletters = "abcdefghijklmnopqrstuvwxyz";
		for(var i = 0; i <= 2; i++) {
			uid = possibleletters.charAt(Math.floor(Math.random() * 26)).concat(uid);
		}
		assassin.insert({password:req.query['pass'], uniqueid:uid, type:"player", first:req.query['first'], last:req.query['last'], role:"assassin", status:"alive"}, id, function(err, body, header) {
			if(!err) {
				res.redirect("/home");
			}
			else {
				res.redirect("/signupfailed");
			}
		});
	}
});


app.get('/initdata', function(req,res) {
		datamodule.loaddata(cloudant, function() {
	res.send('data loading');})
});

app.get('/logout', function(req,res){
	delete req.userSession.user;
	res.redirect('/');
});

// start server on the specified port and binding host
var server = app.listen(appEnv.port, '0.0.0.0', function() {
	// print a message when the server starts listening
	console.log("server starting on port %d on host %s url %s ", server.address().port, appEnv.bind, appEnv.url);
});
