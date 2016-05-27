/**
 * Target List
 */

function createTableRow(first, last, target, time) {
  return '<tr> <td>' + first + '</td><td>' + last + '</td><td>' + target + '</td><td>' + time + '</td></tr>';
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
      var html = createTableRow(target.first, target.last, target.target, target.time);
      table.last().after(html);		
    });
  });	
}

$(populateTable);