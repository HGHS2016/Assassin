
function populateplayers() {

	var toggle = false;

	//console.log(req);
	$.get("/unassignedPlayers", function(data){
		var list = JSON.parse(data);
		console.log(list);
		list.forEach(function(player) {
			console.log(player.id + ", " + player.name);
			$("#p1").append("<option value='" + player.id + "'>" + player.name + "</option>");
			$("#p2").append("<option value='" + player.id + "'>" + player.name + "</option>");
		});
	});
}

$(populateplayers());
