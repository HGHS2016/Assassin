/**
 * Populate mytarget
 */


function populateMyTarget() {
    var span = $("#mytarget");
    var toggle = false;
    var req = "/mytarget?user=" + local_data.user;

    //added res, not sure why this worked
    $.get(req, res, function(data) {
	var target = JSON.parse(data);
	if (target != "") {
	    var html = '';
	    if (target)
	    {
		console.log(JSON.stringify(target));
		var targetstr = '<tr><td> Target Team: </td><td>' + target.name + '</td></tr>';
		var player2 = '<tr><td> Player 2: </td><td> ' + target.player2.name + '</td></tr>';
		var player1 = '<tr><td> Player 1: </td><td> ' + target.player1.name + '</td></tr>';
		html = targetstr.concat(player1).concat(player2);
		span.last().after(html);
		console.log(html);
	    }
	}
	else {
		//doesn't redirect, but stops server from crashing...
		res.redirect('/signup');
	}
    });
}

$(populateMyTarget);
