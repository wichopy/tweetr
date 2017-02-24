"use strict";

// Basic express setup:

const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "mongodb://localhost:27017/tweeter";
const PORT = 8080;
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const app = express();
// const track = require('express-tracking');
// app.use(track());
// const trace = require('express-trace');
const cookieSession = require('cookie-session');
app.use(cookieSession({
  keys: ['user_id', 'datevisit'],
  maxAge: 24 * 60 * 60 * 1000 //expires after 1 day.
}));
// trace(app);app.use(bodyParser.urlencoded({ extended: true }));
const morgan = require("morgan");
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
const methodOverride = require('method-override');
app.use(methodOverride());
console.log(methodOverride);
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method;
    console.log('inside method override.');
    console.log(req.body);
    delete req.body._method;
    return method;
  }
}));

app.use(express.static("public"));
//mongodb returns its database connection.
var db;
MongoClient.connect(MONGODB_URI, (err, database) => {
  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }
  // We have a connection to the "tweeter" db, starting here.
  console.log(`Connected to mongodb: ${MONGODB_URI}`);

  //Want to run other server functions once we have connection with database..
  db = database;

  //pass db into helpers and listen once database is connect!

  const DataHelpers = require("./lib/data-helpers.js")(db);
  const tweetsRoutes = require("./routes/tweets")(DataHelpers);
  const usersRoutes = require("./routes/users")(db);
  const likesRoutes = require("./routes/likes")(db);
  app.use("/tweets", tweetsRoutes);
  app.use("/users", usersRoutes);
  app.use("/likes", likesRoutes);

  app.listen(PORT, () => {
    console.log("Example app listening on port " + PORT);
  });
});