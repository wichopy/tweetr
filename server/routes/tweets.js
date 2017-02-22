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

        console.log("successfully retreived tweets");
        console.log(tweets);
        res.json(tweets);
      }
    });
  });

  tweetsRoutes.post("/", function (req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body' });
      return;
    }
    console.log(req.body);
    const user = req.body.user ? req.body.user : userHelper.generateRandomUser();
    const tweet = {
      user: user,
      content: {
        text: req.body.text
      },
      created_at: Date.now()
    };

    DataHelpers.saveTweet(tweet, (err) => {
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

}