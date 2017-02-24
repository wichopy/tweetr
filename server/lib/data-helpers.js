"use strict";

//USED THIS TO GET MY MONGO RUNNING!
//https://zellwk.com/blog/crud-express-mongodb/

// Defines helper functions for saving and getting tweets, using the database `db`
// passed in from the mongo connect function.
module.exports = function makeDataHelpers(db) {
  return {
    checkUserId: function (userId, checkId_callback) {
      console.log(`This is your userId: ${userId}`);
      //query database and see if ID exists. if itdoes, return an error. If it does, return true.
      db.collection('users').findOne({ 'user_id': userId }, (err, user) => {
        console.log(err);
        console.log(user);
        if (err) {
          return checkId_callback(err, false);
        }
        console.log("returnning value");
        checkId_callback(null, user);
      });
    },
    saveTweet: function (newTweet, userId, saveTweet_callback) {
      // console.log(newTweet);
      // console.log(userId);
      console.log("Now attempting to save tweet.");

      db.collection("tweets").insertOne(newTweet, (err, result) => {
        if (err) {
          return saveTweet_callback(err);
        }
        console.log("going back to save tweet.");
        saveTweet_callback(null, true);
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