// const cookieParser = require('cookie-parser');
// console.log(cookieSession);
const express = require('express');
// const app = express();
const userRoutes = express.Router();
// app.use(userRoutes);
const bcrypt = require('bcrypt');
const rendomString = require('../lib/util/randomString');
// app.use(cookieParser());
// app.use(cookieSession());
module.exports = function (db) {
  //db request for getting users:
  function getUsers(getUsers_cb) {
    db.collection('users').find().toArray((err, users) => {
      if (err) {
        return getUsers_cb(err);
      }
      getUsers_cb(null, users);
    });
  }
  //db request for logging in.
  function login(userEmail, userPassword, login_cb) {
    db.collection('users').findOne({ email: userEmail }, (err, user) => {
      if (err) {
        return login_cb(err);
      }
      if (user) {
        console.log(user);
        if (user.password == userPassword) {
          // db.collection('users').findOne()
          return login_cb(null, user.user_id);
        }
        console.log("Password was wrong");
        return login_cb(null, false);
      } else {
        console.log("could not find user");
        return login_cb(null, false);
      }
    });
  }

  //routes for user authentication

  userRoutes.post("/", function (req, res) {
    console.log('post works!');
    console.log(req.body);
    // login(req.body.email, req.body.password, function (err, valid) {
    //   if (err || !valid) {
    //     console.log("something went wrong with login");
    //   } else {

    console.log("login worked!!!");
    console.log("Creating cookies");
    // console.log(valid);
    // console.log(cookieSession);
    // console.log(req.login);
    console.log("req.session:");
    console.log(req.session);
    // console.log(cookieSession);

    req.session.user_id = '123poi';
    console.log(req.session.user_id);
    res.status(201);
    // }
    // })

    // res.status(500).send("login didint work");
    // db.users.insertOne(req.body.)
  });


  userRoutes.get("/", function (req, res) {
    getUsers((err, users) => {
      if (err) {
        res.status(500).send("something went wrong :(");
      } else {
        console.log("successful get request!!");
        res.json(users);
      }
    });
  });
  return userRoutes;
};