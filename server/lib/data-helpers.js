"use strict";

//USED THIS TO GET MY MONGO RUNNING!
//https://zellwk.com/blog/crud-express-mongodb/

// Defines helper functions for saving and getting tweets, using the database `db`
// passed in from the mongo connect function.
module.exports = function makeDataHelpers(db) {
  return {
    saveTweet: function (newTweet, callback) {
      db.collection("tweets").insertOne(newTweet, (err, result) => {
        if (err) {
          return callback(err);
        }
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
    }
  };
}