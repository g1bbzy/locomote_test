function search(date){
	//Get values from the interface

	var from_destination = document.getElementById('from-destination').value;
	var to_destination = document.getElementById('to-destination').value;
	var when;
	if (date){
		when = date;
	}
	else
	{
		when = $('#date-picker').datepicker({ dateFormat: 'yy-mm-dd' }).val();
	}

	if (!from_destination){
		document.getElementById('from-destination').className += ' input-invalid';
		return;
	}

	if(!to_destination){
		document.getElementById('to-destination').className += ' input-invalid';
		return;
	}
	if (!when){
		document.getElementById('date-picker').className += ' input-invalid';
		return;
	}
	//variables to store codes returned from server, needed to perform a valid search
	var from_code = '';
	var to_code = '';

	if (isValidDate(when)){
		$.blockUI({message: '<h1>Just a moment...</h1>', css: { backgroundColor: 'none', color: '#fff', border: 'none'} });
		$.get("http://localhost:8080/airports?q="+from_destination, function(data, status){
			// make sure one result is returned to garentee correct airport selection
			if (data.length == 1){

				from_code = data[0].airportCode;
				$.get("http://localhost:8080/airports?q="+to_destination, function(data, status){
					// make sure one result is return to garentee the right code
					if (data.length == 1){
						to_code = data[0].airportCode;

						$.get("http://localhost:8080/search?date="+when.toString()+"&to="+to_code+"&from="+from_code, function(data, status){
							//style the page to support results
							document.getElementById('search-container').className = 'search-container with-results';
							document.getElementById('from-destination').className = 'input-with-results';
							document.getElementById('to-destination').className = 'input-with-results';
							document.getElementById('date-picker').className = 'input-with-results unstyled';
							document.getElementById('from-title').className = 'float-left-to-title';
							document.getElementById('to-title').className = 'float-left';
							document.getElementById('date-title').className = 'float-left';
							document.getElementById('search-button').className = 'search-button-results';
							document.getElementById('title').className = 'title left';
							document.getElementById('results-container').className = 'results-container';
							$.unblockUI();
							localStorage.setItem('flights', JSON.stringify(data));
							renderTabs(when);
						}).fail(function() {
					    	$.unblockUI(); // or whatever
						    alert('Something went wrong, please try again.');
						});
					}
					else{
						// there needs to be a unique airport name selected
						$.unblockUI();
						alert('Please select a valid destination airport');
						document.getElementById('to-destination').className += ' input-invalid';
					}
			    }).fail(function() {
				    $.unblockUI(); // or whatever
				    alert('Something went wrong, please try again.');
				});
			}
			else{
				$.unblockUI();
				alert('Please select a valid departure airport');
				document.getElementById('from-destination').className += ' input-invalid';
			}
	    }).fail(function() {
		    $.unblockUI(); // or whatever
		    alert('Something went wrong, please try again.');
		});
	}
	
}
// Makes sure date is greater than today, returns a true or false.
function isValidDate(date){
    var inputDate = new Date(date);
    var todaysDate = new Date();
    if(inputDate.setHours(0,0,0,0) > todaysDate.setHours(0,0,0,0))
    {
		return true;
    }
    else{
    	document.getElementById('date-picker').className += ' input-invalid';
    	alert("Please select a date greater than today");
    	return false;
    }
}

// With a given date, this function creates the tabs with correct dates and displays all data from server in a neat table
// This function gets called by search()
function renderTabs(when){
	var innerhtml = "<div class='tabs'>";
	// First tab, two days before chosen date
	var firstTab = new Date(when);
 	firstTab.setDate(firstTab.getDate()-2);
 	firstTab = formatDate(firstTab).toString();
 	// Second tab
 	var secondTab = new Date(when);
 	secondTab.setDate(secondTab.getDate()-1);
 	secondTab = formatDate(secondTab).toString();
 	//third tab is middle tab, this is the chosen date
 	var thirdTab = when.toString();
 	//fourth tab, which is + one day
 	var forthTab = new Date(when);
 	forthTab.setDate(forthTab.getDate()+1);
 	forthTab = formatDate(forthTab).toString();
 	//fifth tab plus 2 days
	var fifthTab = new Date(when);
 	fifthTab.setDate(fifthTab.getDate()+2);
 	fifthTab = formatDate(fifthTab).toString();

 	// create html for tabs now that we have correct dates.
 	innerhtml += "<div class='tab-item' style='display:inline-block;' onclick='search(&quot;"+firstTab.toString()+"&quot;)'>"+firstTab+"</div>";
 	innerhtml += "<div class='tab-item' style='display:inline-block;' onclick='search(&quot;"+secondTab+"&quot;)'>"+secondTab+"</div>";
	innerhtml += "<div class='tab-item selected' style='display:inline-block;' onclick='search(&quot;"+thirdTab+"&quot;)'>"+thirdTab+"</div>";
	innerhtml += "<div class='tab-item' style='display:inline-block;' onclick='search(&quot;"+forthTab+"&quot;)'>"+forthTab+"</div>";
	innerhtml += "<div class='tab-item' style='display:inline-block;' onclick='search(&quot;"+fifthTab+"&quot;)'>"+fifthTab+"</div>";
	
	innerhtml += "</div>";

	// Create a display for our data, loops through data putting each property into a table
	innerhtml += "<div class='flights-container'>";
	var flights = JSON.parse(localStorage.getItem('flights'));
	innerhtml += "<table class='table table-striped'><thead><tr><th>Flight Number</th><th>Departure Time</th><th>Arrival Time</th><th>Price</th><th>Duration</th><th>Extra Info</th></tr></thead><tbody>";
	for (var i = 0; i < flights.length; i++) {
		if(flights[i].length > 0){
			for (var j = 0; j < flights[i].length; j++) {
				if (flights[i][j].flightNum){

					var m = flights[i][j].durationMin % 60;
					var h = (flights[i][j].durationMin-m)/60;
					var HRSMINS = h.toString() + ":" + (m<10?"0":"") + m.toString();

					innerhtml += "<tr><td>"+flights[i][j].flightNum+"</td>";
					innerhtml += "<td>"+ new Date(flights[i][j].start.dateTime).toLocaleString()+"</td>";
					innerhtml += "<td>"+new Date(flights[i][j].finish.dateTime).toLocaleString()+"</td>";
					innerhtml += "<td>"+"$"+flights[i][j].price.formatMoney(2)+"</td>";
					innerhtml += "<td>"+HRSMINS+"</td>";
					innerhtml += "<td><button>Book!</button></td></tr>";
				}
			};
		}
	};
	innerhtml += "</div>";


	//Display the tabs and data
	document.getElementById('results-container').innerHTML = innerhtml;

	// set date picker to chosen date, for selecting by tabs 
	$( "#date-picker" ).val(when);
}