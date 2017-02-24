"use strict";

const userHelper = require("../lib/util/user-helper")
const express = require('express');
const tweetsRoutes = express.Router();
module.exports = function (DataHelpers) {
  tweetsRoutes.get("/", function (req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        console.log("error getting tweets");
        res.status(500).json({ error: err.message });
      } else {
        if (req.session.user_id) {
          res.json({ tweets: tweets, cookie: "cookies on" });
        } else {
          res.json({ tweets: tweets });
        }
      }
    });
  });
  //Receive new tweets
  tweetsRoutes.post("/", function (req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body' });
      return;
    }

    const user = req.body.user ? req.body.user : userHelper.generateRandomUser();
    const tweet = {
      user: user,
      content: {
        text: req.body.text
      },
      created_at: Date.now()
    };
    let userId = req.session.user_id;
    //Add tweet to database
    DataHelpers.saveTweet(tweet, userId, (err) => {
      if (err) {
        console.log("error saving");
        res.status(500).json({ error: err.message });
      } else {
        console.log("saving worked");
        res.status(201).send();

      }
    });
  });
  return tweetsRoutes;
};