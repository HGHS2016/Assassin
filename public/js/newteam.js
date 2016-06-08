function createPlayerOption(id, name){
    return ("<option value='" + id + "'>" + name + "</option>")
}

function populateplayers1(list) {
    var dropDown = $("#p1 option");
    var html = '';
    list.forEach(function(player) {
	html = html.concat(createPlayerOption(player.id, player.name));
	console.log("HTML " + html);
    });
    dropDown.last().after(html);
}

function populateplayers2(list) {
    var dropDown = $("#p2 option");
    var html = '';
    list.forEach(function(player) {
	html = html.concat(createPlayerOption(player.id, player.name));
	console.log("HTML " + html);
		dropDown.last().after(html)
    });
    dropDown.last().after(html);
}

function populateplayers() {
    $.get("/unassignedPlayers", function(data){
	var list = JSON.parse(data);
	populateplayers1(list);
	populateplayers2(list);
	$('select').material_select();
//	Materialize.updateTextFields();
    });
}

$(populateplayers());
//$(document).ready(function() {
//    $('select').material_select();
//});
//$('select').material_select('destroy');
