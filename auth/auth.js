const bcrypt = require("bcrypt");
const organiserModel = require("../models/organiserModel");
const jwt = require("jsonwebtoken");

exports.login = function (req, res,next) {
    let username = req.body.username;
    let password = req.body.password;
  
    organiserModel.lookup(username, function (err, organiser) {
      if (err) {
        console.log("error looking up user", err);
        return res.status(401).send();
      }
      if (!organiser) {
        console.log("organiser ", username, " not found");
        return res.render("public/home");
      }
      //compare provided password with stored password
      bcrypt.compare(password, organiser.password, function (err, result) {
        if (result) {
          //use the payload to store information about the user such as username.
          let payload = { username: username };
          //create the access token 
          let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET,{expiresIn: 300}); 
          res.cookie("jwt", accessToken);
          next();
        } else {
          return res.render("organiser/login"); //res.status(403).send();
        }
      });
    });
  };
  
  exports.verify = function (req, res, next) {
    let accessToken = req.cookies.jwt;
    if (!accessToken) {
      return res.status(403).send();
    }
    let payload;
    try {
      payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      next();
    } catch (e) {
      //if an error occured return request unauthorized error
      res.status(401).send();
    }
  };