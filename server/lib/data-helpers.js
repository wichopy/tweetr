"use strict";
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "mongodb://localhost:27017/tweeter";

//Function for new tweet
function addNewTweet(tweet, db) {


}
// Simulates the kind of delay we see with network or filesystem operations
// const simulateDelay = require("./util/simulate-delay");

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  console.log("thisis out db:");
  console.log(db);
  return {

    // Saves a tweet to `db`
    // Saves a tweet to `db`
    saveTweet: function (newTweet, callback) {
      console.log("DB before save");
      console.log(db);

      MongoClient.connect(MONGODB_URI, (err, newTweet) => {
        if (err) {
          console.error(`Failed to connect: ${MONGODB_URI}`);
          throw err;
        }

        // We have a connection to the "tweeter" db, starting here.
        console.log(`Connected to mongodb: ${MONGODB_URI}`);

        function saveTweet(newTweet, callback) {
          db.collection("tweets").insertOne(newTweet);
          if (err) return callback(err);
        }

        saveTweet(newTweet, (err) => {
          if (err) throw err;
          db.close();
        });
      });
      console.log("After updating.");
      console.log(db);
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function (callback) {

      const sortNewestFirst = (a, b) => a.created_at - b.created_at;
      callback(null, db.tweets.sort(sortNewestFirst));

    }

  };
}