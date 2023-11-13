// index.js
// where your node app starts

// init project
require('dotenv').config();
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});



// your first API endpoint... 
app.get("/api", (req, res) => {
  const date = new Date();

  const timestamp = date.getTime();
  const dateToday = date.toUTCString();

  res.status(200).json({
    "unix": timestamp,
    "utc": dateToday
  });
});


app.get("/api/:date", function (req, res) {
  const date = req.params.date;

  // if unix time is given
  if (!isNaN(date)) {
    const timestamp = parseInt(date, 10);

    if (!isNaN(timestamp) && timestamp >= 0) {
      const dateObject = new Date(timestamp);

      res.status(200).json({
        "unix": timestamp,
        "utc": dateObject.toUTCString()
      });
    }
    else
      res.status(400).json({ error: "Invalid Date" });
  }
  // if yyyy-mm-dd time is given
  else {
    let dateObject = new Date(date);
    const timestampIST = dateObject.getTime();

    // converting ist to gmt by adding (+5:30)
    const timestampGMT = timestampIST + (5 * 60 + 30) * 60 * 1000;

    dateObject = new Date(timestampGMT);

    if (!isNaN(timestampGMT)) {
      res.status(200).json({
        "unix": timestampGMT,
        "utc": dateObject.toUTCString()
      });
    }
    else
      res.status(400).json({ error: "Invalid Date" });
  }
});


// listen for requests :)
var listener = app.listen((process.env.PORT || 3000), function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
