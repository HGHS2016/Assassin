/*eslint-env node, express*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

//hi!!
var express = require('express');
var app = express();
var session = require('client-sessions');
var pass = "";

function requireHTTPS(req, res, next) {
		if (req.headers && req.headers.$wssp === "80") {
	return res.redirect('https://' + req.get('host') + req.url);
		}
		next();
}

app.use(requireHTTPS);

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
					if(body.role == "god") {
						res.redirect('/god');
					} else {
						var user = req.userSession.user;
						// expose the user to the template
						res.locals.user = user;
						// render the home page
						res.render('home.jade', {pageData: {
					title : "HOME",
					"user" : user,
						}});
					}
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
				res.redirect("/login");
			}
			else {
				res.redirect("/signupfailed");
			}
		});
	}
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
				if(err){
					req.userSession.reset();
					req.redirect('/login')
				} else {
					if(body.role == "assassin") {
						req.redirect('/home');
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
				}
			});
		} else {
			res.redirect('/login');
		}
});

app.get('/test', function(req, res){
	res.render('test.jade', {pageData: {
		"title" : "test",
		"user"  : "non-existant",
	}})
});

app.get('/unassignedplayers', function(req, res) {
		datamodule.unassignedplayers(cloudant, res);
});

app.get('/createTeam', function(req, res) {
		if (req.userSession && req.userSession.user) { //Check if session exists
			// lookup the user in the DB by pulling their username from session
			assassin.get(req.userSession.user, function(err, body){
				if(err){
					req.userSession.reset();
					req.redirect('/login')
				} else {
					if(body.role == "assassin") {
						res.redirect('/home');
					} else {
						var user = req.userSession.user;
						// expose the user to the template
						res.locals.user = user;
						// render the new team page
						res.render('newteam.jade', {pageData: {
						title: "Create a Team",
						user: req.userSession.user,
							}});
					}
				}
			});
		} else {
			res.redirect('/login');
		}
});

app.get('/creatingTeam', function(req, res) {
	assassin.view('team', 'teams', {include_docs: true}, function(err, body) {
		var i = 0;
		var last = body.rows.length-1;
		body.rows.forEach(function(team) {
			if (team.doc.name == req.query['teamname']) {
				console.log("idiot");
				res.render('newteam.jade', {pageData: {
					title: "LET'S TRY AGAIN",
					error: 'Team name taken'
				}});
			}
			i++
			if(i == last){
				if(req.query['p1'] == req.query['p2']){
					console.log("moron");
					res.render('newteam.jade', {pageData: {
						title: "LET'S TRY AGAIN",
						error: 'p1 and p2 are the same'
					}});
				}
				else {
					var id = req.query['teamname'];
					var p1 = req.query['p1'];
					var p2 = req.query['p2'];
					var teamname = req.query['teamname'];
					assassin.insert({type:"team", name:teamname, player1:p1, player2:p2, target:"none", score:"0"}, id, function(err, body, header) {
						if(!err){
							res.redirect('/resettargets');
						}
						if(err){
							res.render('newteam.jade', {pageData: {
								title: "LET'S TRY AGAIN",
								error: 'unknown error'
							}});
						}
					});
				}
			}
		});
	});
});

app.get('/kill', function(req, res){
	if(req.userSession && req.userSession.user) { //Check if session exists
		// lookup the user in the DB by pulling their username from session
		assassin.get(req.userSession.user, function(err, body){
			if(err){
				req.userSession.reset();
				req.redirect('/login')
			} else {
					if(body.role == "god"){
						req.redirect
					}
					var user = req.userSession.user;
					// expose the user to the template
					res.locals.user = user;
					// render the kill page
					res.render('kill.jade', {pageData: {
						title: "LET'S KILL"
					}});
				}
			});
		}
	});

app.get('/resettargets', function(req, res){
	assassin.view('team', 'teams', {include_docs: true}, function(err, body) {
		var firstteam = body.rows[0];
		var i = 0;
		var last = body.rows.length-1;
		var teams = [];
		body.rows.forEach(function(team) {
			if (i != last) {
				team.doc.target = body.rows[i+1].doc.name;
			}
			else {
				team.doc.target = firstteam.doc.name;
			}
			teams[i] = team.doc;
			i++;
		});
		console.log(JSON.stringify(teams));
		assassin.bulk({'docs': teams}, function(err, body){
		res.redirect('/god');
		});
	});
});

app.get('/sendingkill', function(req, res) {
	var rawlatlong = req.param('location');
	var longlat;
	var long;
	var lat;
	var count = 0;
	if(rawlatlong == "") {
		longlat = "";
	}
	else {
		while(rawlatlong.charAt(count) != ' ') {
			count++;
		}
		lat = rawlatlong.substring(0, count);
		count+=3;
		count2 = count;
		while(rawlatlong.charAt(count2) != ' ') {
			count2++;
		}
		long = rawlatlong.substring(count2, count);
		longlat = long + "+" + lat;
	}
	assassin.view('players', 'players-index', {include_docs: true},  function(err, body) {
		if(!err) {
			//searches through all players to find entered in unique id
			var count = 0;
			var found = false;
			body.rows.forEach(function(row) {
				count++;
				if(row.doc.uniqueid == req.param('DeceasedID')) {
					//gets the document for the found unique id
					assassin.get(row.doc._id, function(err2, body2) {
						if(!err2) {
							//finds path for geo view to check to see if the point is in any safezones
							if(longlat.length != 0) {
								var opts = {};
								opts.db = "assassin";
								opts.method = "get";
								opts.content_type = "json";
								opts.path = "_design/location/_geo/safezoneindex?g=POINT(" + longlat + ")&include_docs=true";
								cloudant.request(opts, function(err,body3) {
									if (err) {
										console.log("[cloudant error" + JSON.stringify(err));
										return;
									}
									//goes here if there are no safezone conflicts (i.e. array of safezone conflicts is 0)
									if(body3.rows.length == 0) {
										assassin.insert({"properties":{"type":"kill", "killer":req.userSession.user, "killed":body2._id, "lookedat":"false", "confirmed":"false", "notes":"needs approval"}, "geometry":{"type":"Point", "coordinates":[parseFloat(long), parseFloat(lat)]}}, function(err3, body4, header) {
											if(!err3) {
												res.redirect('/home');
											}
											else {
												res.send("err3");
											}
										});
									}
									//goes here if there is/are safezone conflicts
									else {
										assassin.insert({"properties":{"type":"kill", "killer":req.userSession.user, "killed":body2._id, "lookedat":"false", "confirmed":"false", "notes":"safezone fail"}, "geometry":{"type":"Point", "coordinates":[parseFloat(long), parseFloat(lat)]}}, function(err3, body4, header) {
											if(!err3) {
												res.redirect('/home');
											}
											else {
												res.send("err3");
											}
										});
									}
								});
							}
							else {
								//goes here if location was not recorded
								assassin.insert({"properties":{"type":"kill", "killer":req.userSession.user, "killed":body2._id, "lookedat":"false", "confirmed":"false", "notes":"location not recorded"}, "geometry":{"type":"Point", "coordinates":[]}}, function(err3, body4, header) {
									if(!err3) {
										res.redirect('/home');
									}
									else {
										res.send("err3");
									}
								});
							}
						}
						else {
							res.send("err2");//error if no docs found under row.doc._id (shouldn't ever hit this error)
						}
					});
					found = true;
				}
				else if(count == body.rows.length && !found) {
					res.redirect('/kill');
				}
			});
		}
		else {
			res.send("err");//error for unfound view? (shouldn't ever hit this error)
		}
	});
});

app.get('/confirmkill', function(req, res) {
	assassin.view('kill', 'unseenkill-view', {include_docs: true},  function(err, body) {
		if(!err) {
			var kills = [];
			if(body.rows.length != 0) {
				var curkill = body.rows[0].key.kill;
				var killrow = {};
				killrow._id = curkill;
				body.rows.forEach(function(row) {
					if (curkill != row.key.kill) {
						kills.push(killrow);
						curkill = row.key.kill;
						killrow = {};
						killrow.name = curkill;
					}
					if (row.key.field == 'killer')
						killrow.killer = row.doc.first.concat(' ').concat(row.doc.last);
					if (row.key.field == 'killed')
						killrow.killed = row.doc.first.concat(' ').concat(row.doc.last);
					if (row.key.field == 'about') {
						killrow.confirmed = row.doc.properties.confirmed;
						killrow.notes = row.doc.properties.notes;
					}
				});
				kills.push(killrow);
				res.send(JSON.stringify(kills));
			}
			else {
				res.send(JSON.stringify(kills));
			}
		}
		else {
			res.send("error");
		}
	});
});

app.get('/confirmingkill', function(req, res) {
	var id = "e8fcac94548af4a12aae93b6c15c67e5";//to be coded later
	assassin.get(id, function(err, body) {
		if(!err) {
			var geometry = body.geometry;
			var confirmation = "false";//to be coded later
			var notes = "How was he not killed!?";//to be coded later
			if(notes.length == 0) {
				notes = "none";
			}
			assassin.insert({"_id":id, "_rev":body._rev, "properties":{"type":"kill", "killer":body.properties.killer, "killed":body.properties.killed, "lookedat":"true", "confirmed":confirmation, "notes":notes}, "geometry":geometry}, function(err2, body2, header) {
				if(!err2) {
					if(confirmation == "true") {
						res.redirect('/killingplayer?killed=' + body.properties.killed);
					}
					else {
						res.redirect('/pendingKill');//to be coded later
					}
				}
				else {
					res.send("err2: cannot insert");
				}
			});
		}
		else {
			res.send("err: unfound id");
		}
	});
});

app.get('/pendingKill', function(req, res){
	res.render('pendingKill.jade', {pageData: {
		title : "DEATH TO ALL!",
		user : "",
	}});
});

app.get('/killingplayer', function(req, res) {
	var id = req.param('killed');
	assassin.get(id, function(err, body) {
		if(!err) {
			assassin.insert({"_id":id, "_rev":body._rev, "password":body.password, "uniqueid":body.uniqueid, "type":body.type, "first":body.first, "last":body.last, "role":body.role, "status":"dead"}, function(err2, body2, header) {
				res.redirect('/pendingKill');
			});
		}
		else {
			console.log("err: unfound killed");
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
