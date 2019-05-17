var express = require("express");
var bodyParser = require("body-parser");
var routes = require("./routes/routes.js");
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*

  The App.js file directs all incoming and outgoing traffic.

  1.) Determines who made the request
  2.) Allows CORS to pass data back to either of the white listes Addresses
  3.) Determines route
  4.) Populates response with data from Database
  5.) Sends response back to whom it was requested

*/

app.use(function (req, res, next) {

    var whitelist = [
        'http://capstone-app.s3-website-us-east-1.amazonaws.com',
        'http://localhost:3000',
      ];
      var origin = req.headers.origin;
      if (whitelist.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

routes(app);

var server = app.listen(3000, function () {
    console.log("app running on port.", server.address().port);
});
