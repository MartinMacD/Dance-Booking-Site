const bcrypt = require("bcrypt"); //Used for hashing passwords
const organiserModel = require("../models/organiserModel"); //Data model
const jwt = require("jsonwebtoken"); //Handles JWT tokens

//Function to handle logins
exports.login = function (req, res,next) {
  //Username and password are received from the login form
    let username = req.body.username;
    let password = req.body.password;
  
    //Check if organiser exists using username
    organiserModel.lookup(username, function (err, organiser) {
      if (err) {
        //Couldn't perform lookup
        console.log("error looking up user", err);
        return res.status(401).send();
      }
      //If organiser doesn't exist, display login page with message in log
      if (!organiser) {
        console.log("organiser ", username, " not found");
        return res.render("organiser/login", { loginFailed: true });
      }
      //compare provided password with stored password
      bcrypt.compare(password, organiser.password, function (err, result) {
        if (result) {
          //use the payload to store information about the user such as username.
          let payload = { username: username };
          //create the access token 
          let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET,{expiresIn: 300}); 
          res.cookie("jwt", accessToken);
          console.log("JWT cookie set:", accessToken);
          next();
        } else {
          return res.render("organiser/login", { loginFailed: true });
        }
      });
    });
  };
  
  //Function to verify JWT tokens
  exports.verify = function (req, res, next) {
    //Retrieve access token from cookie
    let accessToken = req.cookies.jwt;
    if (!accessToken) {
      //If access token doesn't exist, reject request
      return res.status(403).send();
    }
    let payload;
    try {
      //Verify token using the access token secret
      payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      console.log("Payload:", payload);
      req.user = payload;
      next();
    } catch (e) {
      //if an error occured return request unauthorized error
      res.status(401).send();
    }
  };