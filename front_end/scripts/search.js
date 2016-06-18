	var data = [
		{
			dateone: [],
			flight_date: "2016-06-14"
		},
		{
			datetwo: [],
			flight_date: "2016-06-15"
		},
		{
			datethree: [],
			flight_date: "2016-06-16"
		},
		{
			datefour: [],
			flight_date: "2016-06-17"
		},
		{
			datefive: [],
			flight_date: "2016-06-18"
		}
	];
function search(){
	//Get values from interface
	var from_destination = document.getElementById('from-destination').value;
	var to_destination = document.getElementById('to-destination').value;
	var when = document.getElementById('date-picker').value;
	var from_code = '';
	var to_code = '';

	$.get("http://localhost:8080/airports?q="+from_destination, function(data, status){
		if (data.length == 1){
			//success
			from_code = data[0].airportCode;
			$.get("http://localhost:8080/airports?q="+to_destination, function(data, status){
				if (data.length == 1){
					//success
					to_code = data[0].airportCode;
					$.get("http://localhost:8080/search?date="+when.toString()+"&to="+to_code+"&from="+from_code, function(data, status){
						console.log(data);
						//style the page to support results
						document.getElementById('search-container').className = 'search-container with-results';
						document.getElementById('from-destination').className = 'input-with-results';
						document.getElementById('to-destination').className = 'input-with-results';
						document.getElementById('date-picker').className = 'input-with-results';
						document.getElementById('from-title').className = 'float-left-to-title';
						document.getElementById('to-title').className = 'float-left';
						document.getElementById('date-title').className = 'float-left';
						document.getElementById('search-button').className = 'search-button-results';
						document.getElementById('title').className = 'title left';
						document.getElementById('results-container').className = 'results-container';
						renderTabs(when);
					});
				}
		    });
		}
    });
}

function renderTabs(when){
	var innerhtml = '<div class="tabs">';
	console.log(when);
	for (var i = 0; i < data.length; i++) {

		if(data[i].flight_date){
			if (data[i].flight_date == when){
				innerhtml += "<div class='tab-item selected' style='display:inline-block;' onclick='renderTabs(`"+data[i].flight_date+"`)'>"+data[i].flight_date+"</div>";
			}
			else
			{
				innerhtml += "<div class='tab-item' style='display:inline-block;' onclick='renderTabs(`"+data[i].flight_date+"`)'>"+data[i].flight_date+"</div>";
			}
			
		}
	};
	innerhtml += '</div>';
	innerhtml += '<div class="flights-container"><p>flight one</p><p>flight one</p><p>flight one</p><p>flight one</p></div>'
	document.getElementById('results-container').innerHTML = innerhtml;

}