// const cookieParser = require('cookie-parser');
// console.log(cookieSession);
const express = require('express');
// const app = express();
const userRoutes = express.Router();
// app.use(userRoutes);

const randomString = require('../lib/util/randomString');
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

  function register(userData, register_cb) {
    db.collection('users').insertOne(userData, (err, result) => {
      if (err) {
        return register_cb(err);
      } else {
        register_cb(null, true);
      }
    });
  }
  //routes for user authentication

  //register
  userRoutes.put("/", function (req, res) {
    if (req.session.user_id) {
      res.status(403).send("dont need to be here");
    } else {
      let user_id = randomString();
      let userData = {
        user_id: user_id,
        email: req.body.email,
        password: req.body.password,
        handle: req.body.handle,
        name: req.body.name
      };
      register(userData, (err, valid) => {
        if (valid) {
          req.session.user_id = user_id;
          res.json({ cookie: "cookies on" });
        } else {
          res.status(301).send("something went wrong with registration");
        }
      });
    }
  });
  //logout
  userRoutes.delete("/", function (req, res) {
    if (req.session.user_id) {
      console.log("in route for delete");
      console.log(req.body);
      console.log(req.session.user_id);
      req.session = null;
      res.status(200).send();
    } else {
      res.status(403).send("you shouldn't be here");
    }
    // res.json()
  });
  userRoutes.post("/", function (req, res) {
    console.log('post works! req.body is :');
    console.log(req.body);
    login(req.body.email, req.body.password, function (err, valid) {
      if (err || !valid) {
        console.log("something went wrong with login");
        res.status(500).send("login didint work");
      } else {
        console.log("login worked!!!");
        console.log("Creating cookies");
        // console.log(valid);
        // console.log(cookieSession);
        // console.log(req.login);
        console.log("req.session:");
        console.log(req.session);
        // console.log(cookieSession);
        req.session.user_id = valid;
        console.log(req.session.user_id);
        console.log(res.cookie);
        res.json({ cookie: "cookies on" });
      }
    });
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