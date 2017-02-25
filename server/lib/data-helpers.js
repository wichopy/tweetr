"use strict";
//USED THIS TO GET MY MONGO RUNNING!
//https://zellwk.com/blog/crud-express-mongodb/

// Defines helper functions for saving and getting tweets, using the database `db`
// passed in from the mongo connect function.
module.exports = function makeDataHelpers(db) {
  const mongo = require('mongodb');
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
    getTweets: function (Main_callback) {
      //Get list of tweets and likes, combine likes with tweets.
      //
      //
      //*************** */
      //Helper functions:
      function getTweets(getTweets_callback) {
        db.collection("tweets").find().toArray((err, tweets) => {
          if (err) {
            getTweets_callback(err);
          }
          // console.log(tweets);
          getTweets_callback(null, tweets);
        });
      }
      //End of helper functions
      //************* */
      getTweets(function (err, tweets) {
        if (err) Main_callback(err);
        const sortNewestFirst = (a, b) => b.created_at - a.created_at;
        Main_callback(null, tweets.sort(sortNewestFirst)); //Call parent callback function.
      });
    },
    updateLikes: function (userId, tweetId, updateLikes_callback) {
      // console.log(userId);

      var o_id = new mongo.ObjectID(tweetId);

      function db_updateLikes(userId, objId, db_updateLikes_cb) {
        console.log("in update likes callback");
        //Had to run a mongo command to update my tweets database:
        //db.tweets.updateMany( {"likes" : null},{ $set: {"likes" : []} }  )

        db.collection("tweets").update({ '_id': objId }, { $push: { "likes": userId } },
          function (err, valid) {
            console.log("In db update function");
            if (err) {
              db_updateLikes_cb(err);
              return;
            }
            // console.log(err, valid);
            db_updateLikes_cb(null, valid);
          }
        );
      }
      db_updateLikes(userId, o_id, function (err, valid) {
        if (err) {
          updateLikes_callback(err, false);
          return;
        }
        console.log("in datahelper callback function");
        console.log(valid);
        updateLikes_callback(null, valid);
      });
    }
  };
}