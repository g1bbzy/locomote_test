$( document ).ready(function() {
	document.getElementById('results-container').className = 'results-container hide';

	$('#from-destination').keyup(function() {
	    fromOnKeyUp($('#from-destination').val());
	});
	$('#to-destination').keyup(function() {
	    toOnKeyUp($('#to-destination').val());
	});

	var fromOnKeyUp = function(value) {
		if (value.length >= 2){
			$.get("http://localhost:8080/airports?q="+value, function(data, status){
				var airports = [];
		        for (var i = 0; i < data.length; i++) {
		        	airports.push(data[i].airportName);
		        };
		        console.log(airports);
		        $( "#from-destination" ).autocomplete({
				  source: airports
				});
		    });
		}		
	}
	
	var toOnKeyUp = function(value) {
		if (value.length >= 2){
			$.get("http://localhost:8080/airports?q="+value, function(data, status){
				var airports = [];
		        for (var i = 0; i < data.length; i++) {
		        	airports.push(data[i].airportName);
		        };
		        console.log(airports);
		        $( "#to-destination" ).autocomplete({
				  source: airports
				});
		    });
		}		
	}
});
