const organiserDAO = require("../models/organiserModel");

exports.landing_page = function(req, res){
    res.render("public/home");
}

exports.show_register_page = function(req, res) {
    res.render("organiser/register");
    };

exports.post_new_organiser = function (req, res) {
        const user = req.body.username;
        const password = req.body.pass;
      
        if (!user || !password) {
          res.send(401, "no user or no password");
          return;
        }
        organiserDAO.lookup(user, function (err, u) {
          if (u) {
            res.send(401, "User exists:", user);
            return;
          }
          organiserDAO.create(user, password);
          console.log("register user", user, "password", password);
          res.redirect("/login");
        });
      };

exports.show_login = function (req, res) {
    res.render("organiser/login");
  };

exports.handle_login = function (req, res) {
    // res.redirect("/new");
    res.render("organiser/dashboard", {
      title: "Dance Class",
      user: "user"
    });
  };

