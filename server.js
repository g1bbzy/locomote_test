
var express    = require('express');        // Call express
var app        = express();                 // Define our app using express
var bodyParser = require('body-parser');    // For JSON posts
var request = require('request');           // For ajax calls to locomote
var path = require('path');

// Configure app to use bodyParser()
// This will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//***Cors, allow request to server***
var permitCrossDomainRequests = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    // Some browsers send a pre-flight OPTIONS request to check if CORS is enabled so you have to also respond to that
    if ('OPTIONS' === req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
//Middleware enable cors
app.use(permitCrossDomainRequests);
//Allow access to static font end files such as CSS
app.use(express.static('public'));
// define the port
var port = process.env.PORT || 8080;        

// ROUTES 
// =============================================================================
// Serve up the front end
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

// Use express router for defining routes
var router = express.Router(); 
router.route('/airlines')
    .get(function(req, res){
        //When thhe user requests the end point "/airlines" go off to locomote flight api and request all the airlines
        request('http://node.locomote.com/code-task/airlines', function (error, response, body) {
            if (error){
                // An error occurred, respond with an error code.
                res.status(501).send('Something went wrong');
            }
            if (!error && response.statusCode == 200) {
                // success, data now exists in the var 'body'. Return data back to client.
                res.send(body);
            }
        })
    })

router.route('/airports')
    .get(function(req, res){
        // request all airports with a query/string located in req.query.q
        request('http://node.locomote.com/code-task/airports?q='+req.query.q, function (error, response, body) {
            if (error){
                //return an error code
                res.status(501).send('something Went wrong');
            }
            if (!error && response.statusCode == 200) {
                //data now exists in the var 'body'
                res.send(JSON.parse(body));
            }
        })
    })
router.route('/search')
    .get(function(req, res) {
        //Create an Array for our flights
        var ourFlights = [];
        //Set var for signalling that all airlines have been searched.
        var airlines = 0;
        //Request list of airlines
        request('http://node.locomote.com/code-task/airlines', function (error, response, body) {
            if (error){
                //return an error status, rather than a 200;
                res.status(501).send('something Went wrong');
            }
            if (!error && response.statusCode == 200) {
                //data now exists in the var 'body'
                body = JSON.parse(body);
                // if airlines are returned set 'airlines' to its length;
                if (body){
                    airlines = body.length;
                }
                //Create date from input value
                var inputDate = new Date(req.query.date);

                //Get today's date
                var todaysDate = new Date();

                //Only call flight api if the given search date is greater than todays date.
                if(inputDate.setHours(0,0,0,0) > todaysDate.setHours(0,0,0,0))
                {
                    //Loop through airlines, Have to use forEach loop so values still exist for callbacks
                    body.forEach(function(entry){
                        // If current airlines has a code we are good to go.
                        if (entry.code){
                            // request a search for the current airline on success push data into ourflights variable
                            request('http://node.locomote.com/code-task/flight_search/'+entry.code+'?date='+req.query.date+'&from='+req.query.from+'&to='+req.query.to,
                             function (error, response, body) {
                                if (!error && response.statusCode == 200) {
                                    if (body.length){
                                        ourFlights.push(JSON.parse(body));
                                        // Success one airline done.
                                        airlines --;
                                    }
                                    // Check if we have any more airline, if not then finish up and return our list of flights to the client.
                                    if (airlines <= 0) {
                                        res.send(ourFlights);
                                    }
                                }
                            })
                        }
                    });
                } 
                else{
                    // if date is less than or equal to today, then return "not implemented error"
                    res.status(501).send('Wrong date');
                }
            }
        })
    });

// Init our router
app.use(router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server running...');