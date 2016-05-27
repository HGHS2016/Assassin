/**
 * Target List
 */

function createTableRow(name, target, time) {
  return '<tr> <td>' + name + '</td><td>' + target + '</td><td>' + time + '</td></tr>';
}

/**
 * Populate the hiscore table by retrieving top 10 scores from the DB. 
 * Called when the DOM is fully loaded.
 */
function populateTable() {	
  var table = $("#target_table tr");
  $.get("/targetlist", function (data) {
    var targets = JSON.parse(data);
    targets.forEach(function (target) {
      var html = createTableRow(target.name, target.target, target.time);
      table.last().after(html);		
    });
  });	
}

$(populateTable);