// format number to display as currency, used to display price of a flight
Number.prototype.formatMoney = function(c, d, t){
var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

// Returns a date in the format of yyyy-mm-dd
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

$( document ).ready(function() {
	// on load hide the results container, Not needed yet	
	document.getElementById('results-container').className = 'results-container hide';

	// set the format of the date picker to: year, month, day
	$( "#date-picker" ).datepicker({ dateFormat: 'yy-mm-dd'});

	// Add an event listners to input boxes
	$('#from-destination').keyup(function() {
	    fromOnKeyUp($('#from-destination').val());
	});
	$('#to-destination').keyup(function() {
	    toOnKeyUp($('#to-destination').val());
	});

	// Ajax request for autocomplete/suggestions
	var fromOnKeyUp = function(value) {
		if (value.length >= 2){
			$.get("http://localhost:8080/airports?q="+value, function(data, status){
				var airports = [];
		        for (var i = 0; i < data.length; i++) {
		        	airports.push(data[i].airportName);
		        };
		        // when data comes back, add it to suggestions dropdown
		        $( "#from-destination" ).autocomplete({
				  source: airports
				});
		    });
		}		
	}
	// Ajax request for autocomplete/suggestions
	var toOnKeyUp = function(value) {
		if (value.length >= 2){
			$.get("http://localhost:8080/airports?q="+value, function(data, status){
				var airports = [];
		        for (var i = 0; i < data.length; i++) {
		        	airports.push(data[i].airportName);
		        };
		        // when data comes back, add it to suggestions dropdown
		        $( "#to-destination" ).autocomplete({
				  source: airports
				});
		    });
		}		
	}
});