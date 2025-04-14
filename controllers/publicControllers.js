const organiserDAO = require("../models/organiserModel");
const courseDAO = require("../models/courseModel");
const { getUserFromToken } = require("../utils/authHelpers");

const courseDB = new courseDAO("courses.db");
courseDB.init();

exports.landing_page = function(req, res) {
  const user = getUserFromToken(req);

  res.render("public/home", {
    title: "Home",
    user: user
  });
};

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
  res.redirect("/dashboard")
  };

exports.show_courses = function(req, res) {
  const user = getUserFromToken(req);
  
  courseDB.getAllCourses()
  .then((list) => {
    console.log("Course list:", list);
    res.render("public/courses", {
      title: "All courses",
      user: user,
      courses: list
    });
    console.log("promise succesful");
  })
  .catch((err) => {
    console.log("promise rejected", err);
  });
}

exports.show_dashboard = function(req, res){
  res.render("organiser/dashboard", {
    title: "Dance Class",
    user: req.user.username
  });
  console.log("req.user is:", req.user);
}

