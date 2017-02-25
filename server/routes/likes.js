const express = require('express');
const likesRoutes = express.Router();




module.exports = function (db) {
  function getLikes(getLikes_cb) {
    db.collection('likes').find()
  }
  likesRoutes.get("/", function (req, res) {
    getLikes((err, likes) => {
      if (err) {
        res.status(500).send("something went wrong :(");
      } else {
        res.json(likes);
      }
    });
  });

  return likesRoutes;
};