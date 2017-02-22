"use strict";

//USED THIS TO GET MY MONGO RUNNING!
//https://zellwk.com/blog/crud-express-mongodb/

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  // console.log("thisis out db:");
  // console.log(db);
  return {

    // Saves a tweet to `db`

    // Saves a tweet to `db`
    saveTweet: function (newTweet, callback) {
      //returns value in callback.
      db.collection("tweets").insertOne(newTweet, (err, result) => {
        if (err) {
          return callback(err);
        }
        console.log('successful save!');

        callback(null, true);
      });
    },
    // Get all tweets in `db`, sorted by newest first
    getTweets: function (callback) {

      function getTweets(callback) {
        db.collection("tweets").find().toArray((err, tweets) => {
          if (err) {
            return callback(err);
          }
          callback(null, tweets);
        });
      }
      getTweets(function (err, tweets) {
        if (err) callback(err);
        //console.log('grabbed tweets!');
        // console.log(tweets);
        const sortNewestFirst = (a, b) => b.created_at - a.created_at;
        callback(null, tweets.sort(sortNewestFirst)); //Call parent callback function.

      });
      //for sorting the db from newest to oldest


    }

  };
}