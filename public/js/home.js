/**
 * Populate mytarget
 */
function populateMyTarget() {
    var span = $("#mytarget");
    var toggle = false;
    $.get("/mytarget?user=jastillman", function(data) {
	var target = JSON.parse(data);
	var html = '';
	if (target)
	{
	    console.log(JSON.stringify(target));
	    var targetstr = '<p id="target"> ' + target.name + '</p>';
	    var player2 = '<p id="player2"> ' + target.player2.name + '</p>';
	    var player1 = '<p id="player1"> ' + target.player1.name + '</p>';
            html = targetstr.concat(player1).concat(player2);
	    span.last().after(html);
	    console.log(html);
	}});
}

$(populateMyTarget);
