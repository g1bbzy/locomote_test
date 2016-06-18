
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');    // For JSON posts
var request = require('request');           // For ajax calls to locomote

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//***cors, only allow requests from localhost***
var permitCrossDomainRequests = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    // some browsers send a pre-flight OPTIONS request to check if CORS is enabled so you have to also respond to that
    if ('OPTIONS' === req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
app.use(permitCrossDomainRequests);

// define the port
var port = process.env.PORT || 8080;        

// ROUTES 
// =============================================================================
var router = express.Router(); 

router.route('/airlines')
    .get(function(req, res){
        request('http://node.locomote.com/code-task/airlines', function (error, response, body) {
          if (!error && response.statusCode == 200) {
            //data now exists in the var 'body'
            res.send(body);
          }
        })
    })

router.route('/airports')
    .get(function(req, res){
        request('http://node.locomote.com/code-task/airports?q='+req.query.q, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            //data now exists in the var 'body'
            res.send(JSON.parse(body));
          }
        })
    })
router.route('/search')
    .get(function(req, res) {
        var ourFlights = [];
        var airlines = 0;
        request('http://node.locomote.com/code-task/airlines', function (error, response, body) {
          if (!error && response.statusCode == 200) {
            //data now exists in the var 'body'
            body = JSON.parse(body);
            if (body){
                airlines = body.length;
                console.log('got list of airlines');
                console.log('airlines length '+airlines);
            }
            //Have to use forEach loop so values still exist for callbacks
            body.forEach(function(entry){
                if (entry.code){
                    request('http://node.locomote.com/code-task/flight_search/'+entry.code+'?date='+req.query.date+'&from='+req.query.from+'&to='+req.query.to,
                     function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            console.log('http://node.locomote.com/code-task/flight_search/'+entry.code+'?date='+req.query.date+'&from='+req.query.from+'&to='+req.query.to);
                            if (body.length){
                                ourFlights.push(JSON.parse(body));
                                airlines --;
                            }
                            if (airlines <= 0) {
                                res.send(ourFlights);
                            }
                        }
                    })
                }
            });

          }
        })
    });

app.use(router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server running...');