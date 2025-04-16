//Import required models 
const organiserDAO = require("../models/organiserModel");
const courseDAO = require("../models/courseModel");
const classDAO = require("../models/classModel");
const EnrolmentDAO = require("../models/enrolmentModel");
const { getUserFromToken } = require("../utils/authHelpers");

//Instantiate DAO classes for database access
const courseDB = new courseDAO("courses.db");
const classDB = new classDAO("classes.db");
const enrolmentDB = new EnrolmentDAO("enrolments.db");

//Displays landing page, uses title and user for extra functionality
exports.landing_page = function(req, res) {
  const user = getUserFromToken(req);

  res.render("public/home", {
    title: "Home",
    user: user
  });
};

//Displays registration page
exports.show_register_page = function(req, res) {
    res.render("organiser/register", {
      title: "Register"
    });
    };

//Handles registration
exports.post_new_organiser = function (req, res) {
        //Username and password are received from the login form
        const user = req.body.username;
        const password = req.body.pass;
      
        //If username or password aren't present, return an error
        if (!user || !password) {
          res.send(401, "no user or no password");
          return;
        }
        //Check if the user already exists
        organiserDAO.lookup(user, function (err, u) {
          if (u) {
            res.send(401, "User exists:", user);
            return;
          }
          //Create the new organiser
          organiserDAO.create(user, password);
          console.log("register user", user, "password", password);
          res.redirect("/login");
        });
      };

//Display the login page
exports.show_login = function (req, res) {
    res.render("organiser/login",{
      title: "Login"
    });
  };

//Redirects to dashboard after a succesful login
exports.handle_login = function (req, res) {
  res.redirect("/dashboard")
  };

//Display all courses
exports.show_courses = function(req, res) {
  const user = getUserFromToken(req);

  //Cycle through each course in the database and pass them to courseswithclasses.mustache
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

//Display all classes
exports.show_classes = function(req, res) {
  const user = getUserFromToken(req);

  //Cycle through each class in the database and pass them to classes.mustache
  classDB.getAllClasses()
    .then((list) => {
      console.log("Class list:", list);
      res.render("public/classes", {
        title: "Classes",
        user: user,
        classes: list
      });
      console.log("Promise successful");
    })
    .catch((err) => {
      console.log("Promise rejected", err);
    });
};

//Display the dashboard page
exports.show_dashboard = function(req, res){
  res.render("organiser/dashboard", {
    title: "Dashboard",
    user: req.user.username
  });
  console.log("req.user is:", req.user);
}

//Displays all courses and their associated classes
exports.show_courses_with_classes = function(req, res) {
  //Get user data from JWT token
  const user = getUserFromToken(req)

  //Get all courses from the datbase
  courseDB.getAllCourses()
    .then((courses) => {
      console.log("Courses fetched:", courses);
      
      //For each course, get its related classes
      const coursePromises = courses.map((course) => {
        console.log("Fetching classes for courseId:", course.courseID); 
        
        //Get classes by course ID and combine them with course
        return classDB.getClassesByCourseId(course.courseID) 
          .then((classes) => {
            return { ...course, classes };
          });
      });

      //After all classes have been received
      Promise.all(coursePromises)
        .then((coursesWithClasses) => {
          console.log("Courses with classes:", coursesWithClasses); // Log final result
          
          //Display the courseswithclasses page with a title, user info and all courses and classes
          res.render("public/courseswithclasses", {
            title: "Courses",
            user: user,
            courses: coursesWithClasses
          });
        })
        .catch((err) => {
          //Returns an error if classes couldn't be received
          console.error("Error fetching classes", err);
          res.status(500).send("Internal server error");
        });
    })
    .catch((err) => {
      //Returns an error if courses couldn't be received
      console.error("Error fetching courses", err);
      res.status(500).send("Internal server error");
    });
};

//Used to add a new class
exports.create_new_class = function (req, res) {
  console.log("processing create_new_class controller");
  try{
    //Uses all fields to add new class to the model
    classDB.addClass(req.body.classID, req.body.courseID, req.body.name, req.body.date, req.body.time, req.body.description, req.body.location, req.body.price);
    res.redirect("/classes");
  }
 catch (err) {
  //Returns an error if that wasn't possible
  console.error("Error creating new class:", err);
    res.status(500).send("Error creating new class");
}
};

//Display the new class page
exports.show_new_class_form = function (req, res) {
  const user = getUserFromToken(req);
  res.render('organiser/newclass', {
    title: 'Create New Class',
    user: user
  });
};

//Used to delete a class using its ID
exports.delete_class = function (req, res) {
  //Receive classID from the page
  const classID = req.params.classID;
  //Attempt to delete the class
  classDB.deleteClass(classID)
    .then(() => {
      //If class can be deleted, either go to previous page or classes page
      const referer = req.get('Referer'); // Gets previous page
      res.redirect(referer || "/classes"); 
    })
    .catch((err) => {
      //Return an error if class couldn't be deleted
      console.log("Error deleting class:", err);
      res.status(500).send("Error deleting class");
    });
};

//Used to delete a course and any associated classes
exports.delete_course = function(req, res) {
  const courseID = req.params.courseID;

  // First, delete all classes associated with this course
  classDB.deleteClassesByCourseId(courseID)
    .then(() => {
      // Now, delete the course itself
      courseDB.deleteCourse(courseID)
        .then(() => {
          //If succesful, redirect back to courses
          res.redirect("/courses");
        })
        .catch((err) => {
          //If not succesful, display an error
          console.error("Error deleting course:", err);
          res.status(500).send("Error deleting course");
        });
    })
    .catch((err) => {
      //Display error classes couldn't be deleted
      console.log("Error deleting classes:", err);
      res.status(500).send("Error deleting associated classes");
    });
};

//Display new course page
exports.show_new_course_form = function (req, res) {
  const user = getUserFromToken(req);
  res.render("organiser/newcourse", {
    title: "Create New Course",
    user: user
  });
};

//Used to add a new course to the model
exports.create_new_course = function (req, res) {
  console.log("Processing create_new_course");

  try {
    //Attempt to add a new course using the info given by the organiser
    courseDB.addCourse( req.body.courseID, req.body.name, req.body.duration, req.body.description);
    res.redirect("/courses");
  } catch (err) {
    //If not possible, return an error
    console.error("Error creating new course:", err);
    res.status(500).send("Error creating new course");
  }
};

//Display page to edit a class
exports.show_edit_class_form = function (req, res) {
  const classID = req.params.classID;

  //Attempt to get the class by ID
  classDB.getClassById(classID)
    .then((classData) => {
      if (!classData) {
        //If not succesful, return an error
        return res.status(404).send("Class not found");
      }

      //If succesful, display edit class apge
      const user = getUserFromToken(req);
      res.render("organiser/editclass", {
        title: "Edit Class",
        user: user,
        class: classData
      });
    })
    .catch((err) => {
      //If class couldn't be loaded, display error
      console.error("Error loading class for edit:", err);
      res.status(500).send("Internal Server Error");
    });
};

//Used to update an existing class
exports.update_class = function (req, res) {
  //Receive data from the current page
  const {
    classID, courseID, name, date, time, description, location, price
  } = req.body;

  //Attempt to update class from data received
  classDB.updateClass(classID, {courseID, name, date, time, description, location, price
  })
  .then(() => {
    //Redirect to classes page
    res.redirect("/classes");
  })
  .catch((err) => {
    //If an error is encountered, display error
    console.error("Error updating class:", err);
    res.status(500).send("Failed to update class");
  });
};

//Display the page to enrol in a class
exports.show_class_enrolment_form = (req, res) => {
  const classID = req.params.classID;
  res.render("public/enrol", {
    title: "Enrol in Class",
    classID: classID
  });
};

//Display the page to enrol in a course
exports.show_course_enrolment_form = (req, res) => {
  const courseID = req.params.courseID;
  res.render("public/enrol", {
    title: "Enrol in Course",
    courseID: courseID
  });
};

//Used to submit enrolment
exports.submit_enrolment = function (req, res) {
  //Take in data from current pages fields
  const { classID, courseID, name, email } = req.body;

  console.log("Enrolment form data:", req.body);

  try {
    //Attempt to add enrolment 
    enrolmentDB.addEnrolment(classID || null, courseID || null, name, email);
    res.redirect("/enrolled");
  } catch (err) {
    //If enrolment failed, display error message
    console.error("Enrolment error:", err);
    res.status(500).send("Failed to enrol");
  }
};

//Display enrolled page
exports.show_enrolled_page = (req, res) => {
  res.render("public/enrolled");
}

//Used to display all participants of a specified class
exports.show_class_participants = (req, res) => {
  //Receive logged in user from JWT token
  const user = getUserFromToken(req);
  //Receive classID from submitted classID field on page
  const classID = req.params.classID;

  //Find all participants using the class ID
  enrolmentDB.getEnrolmentsByClassID(classID)
    .then((enrolments) => {
      res.render("organiser/participants", {
        title: "Class Participants",
        participants: enrolments,
        user: user
      });
    })
    .catch((err) => {
      //If not possible, display error
      console.error("Error fetching class enrolments:", err);
      res.status(500).send("Internal server error");
    });
};

//Used to display all participants of a spcecific course
exports.show_course_participants = (req, res) => {
  //Receive courseID from submitted courseID field on page
  const courseID = req.params.courseID;
  //Receive logged in user from JWT token
  const user = getUserFromToken(req);

  //Find all participants using the courseID
  enrolmentDB.getEnrolmentsByCourseID(courseID)
    .then((enrolments) => {
      res.render("organiser/participants", {
        title: "Course Participants",
        participants: enrolments,
        user: user
      });
    })
    .catch((err) => {
       //If not possible, display error
      console.error("Error fetching course enrolments:", err);
      res.status(500).send("Internal server error");
    });
};

//Used to display all participants of all courses and classes
exports.show_all_participants = function (req, res) {
  //Receive logged in user from JWT token
  const user = getUserFromToken(req);

  enrolmentDB.db.find({}, (err, enrolments) => {
    if (err) {
      console.error("Error retrieving enrolments:", err);
      return res.status(500).send("Internal server error");
    }

    res.render("organiser/allparticipants", {
      title: "All Enrolments",
      user: user,
      enrolments: enrolments
    });
  });
};

//Displays new organiser page
exports.show_new_organiser_form = function (req, res) {
  const user = getUserFromToken(req);
  res.render("organiser/neworganiser", { title: "Add New Organiser", user: user });
};

//Used to create a new organiser, slightly different than register
exports.create_new_organiser_form = function (req, res) {
        //Receive user and password from fields on the page
        const user = req.body.username;
        const password = req.body.pass;
      
        //If either username or password are not present, return an error
        if (!user || !password) {
          res.send(401, "no user or no password");
          return;
        }
        //Check if the organiser already exists
        organiserDAO.lookup(user, function (err, u) {
          if (u) {
            //If they do, return an error
            res.send(401, "User exists:", user);
            return;
          }
          //Create the new organiser and load dashboard
          organiserDAO.create(user, password);
          console.log("register user", user, "password", password);
          res.redirect("/dashboard");
        });
      };

//Used to display all organisers
exports.show_all_organisers = function (req, res) {
  //Receive logged in user from JWT token
        const user = getUserFromToken(req);

        //Receive all organisers from the model
        organiserDAO.getAllOrganisers()
          .then((organisers) => {
            res.render("organiser/allorganisers", {
              title: "All Organisers",
              organisers: organisers,
              user: user

            });
          })
          //If there's an issue, display an error
          .catch((err) => {
            console.error("Error fetching organisers:", err);
            res.status(500).send("Internal server error");
          });
      };
      
//Used to delete a specified organiser
exports.delete_organiser = function (req, res) {
  //Receive logged in user from JWT token
  const username = req.params.username;
  //Delete the organiser from the model
  organiserDAO.deleteOrganiser(username)
          .then(() => {
            res.redirect("/allorganisers");
          })
          .catch((err) => {
            //If there's an issue, display an error
            console.error("Error deleting organiser:", err);
            res.status(500).send("Failed to delete organiser");
          });
      };
      


