
function createPlayerOption(id, name){
	return "<option value='" + player.id + "'>" + player.name + "</option>"
}

function populateplayers() {
	var dropDown = $("#p1 option");
	//console.log(req);
	$.get("/unassignedPlayers", function(data){
		var html = '';
		var list = JSON.parse(data);
		console.log(list);
		list.forEach(function(player) {
			html = html.concat(createPlayerOption(player.id, player.name));
			console.log(player.id + ", " + player.name);
		});
		dropDown.last().after(html)
		$('select').material_select();
	});
}

$(populateplayers());
$(document).ready(function() {
    $('select').material_select();
});
$('select').material_select('destroy');
