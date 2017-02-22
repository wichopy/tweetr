"use strict";
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "mongodb://localhost:27017/tweeter";


// Simulates the kind of delay we see with network or filesystem operations
// const simulateDelay = require("./util/simulate-delay");

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  // console.log("thisis out db:");
  // console.log(db);
  return {

    // Saves a tweet to `db`
    // Saves a tweet to `db`
    saveTweet: function (newTweet, callback) {




      saveTweet(newTweet, (err) => {
        if (err) throw err;
        db.close();
      });

    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function (callback) {


      //for sorting the db from newest to oldest
      const sortNewestFirst = (a, b) => b.created_at - a.created_at;
      callback(null, db.tweets.sort(sortNewestFirst));

    }

  };
}