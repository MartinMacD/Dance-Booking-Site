const express = require('express');
const router = express.Router(); //Instantiate new router to handle routes
const controller = require('../controllers/publicControllers.js'); //Import controller functions
const {login} = require('../auth/auth') //Used to authenticate logins
const {verify} = require('../auth/auth') //Used to verify user data

//Directs to the login page
router.get('/login', controller.show_login);
//Directs to the handle login function to manage logging in
router.post('/login', login, controller.handle_login);
//Directs to the dashboard
router.get('/dashboard', verify, controller.show_dashboard)
//Directs to the register page
router.get('/register', controller.show_register_page); 
//Directs to the post new organiser function to manage registering a new organiser
router.post('/register', controller.post_new_organiser);
//Directs to the courses page
router.get('/courses', controller.show_courses_with_classes);
//Directs to the classes page
router.get('/classes', controller.show_classes);
//Directs to the new class page
router.get('/newclass', verify, controller.show_new_class_form);
//Directs to the create new class function to create a new class
router.post('/newclass', verify, controller.create_new_class);
//Directs to the new course page
router.get("/newcourse", verify, controller.show_new_course_form);
//Directs to the create new course function to create a new course
router.post("/newcourse", verify, controller.create_new_course);
//Directs to the delete class function to delete the specified class
router.post("/class/delete/:classID", verify, controller.delete_class);
//Directs to the delete course function to delete the specified course
router.post('/courses/delete/:courseID', verify, controller.delete_course);
//Directs to the edit class form for the specified class
router.get("/editclass/:classID", verify, controller.show_edit_class_form);
//Directs to the update class page
router.post("/updateclass", verify, controller.update_class);
//Directs to the enrolment page for the specified class ID
router.get("/enrol/class/:classID", controller.show_class_enrolment_form);
//Directs to the enrolment page for the specified course ID
router.get("/enrol/course/:courseID", controller.show_course_enrolment_form);
//Directs to the submit enrol function to handle enroling a new participant
router.post("/enrol", controller.submit_enrolment);
//Directs to the enrolled page
router.get("/enrolled", controller.show_enrolled_page);
//Directs to the participants page for the specified class
router.get("/participants/class/:classID", verify, controller.show_class_participants);
//Directs to the participants page for the specified course
router.get("/participants/course/:courseID", verify, controller.show_course_participants);
//Directs to the all participants page
router.get("/participants/all", verify, controller.show_all_participants);
//Directs to the new organiser page
router.get("/neworganiser", verify, controller.show_new_organiser_form);
//Directs to the create new organiser function to create a new organiser
router.post("/neworganiser", verify, controller.create_new_organiser_form); 
//Directs to the all organisers page
router.get('/allorganisers', verify, controller.show_all_organisers);
//Directs to the delete organiser function to delete a specified organiser
router.post('/organisers/delete/:username', verify, controller.delete_organiser);
//Directs to the landing page
router.get("/", controller.landing_page);

//Used to handle logging out by deleting the jwt cookie and directing back to the landing page
router.get("/logout", (req, res) => {
    res.clearCookie("jwt"); 
    res.redirect("/"); 
  });

  //404 error handling for undefined routing
router.use(function(req, res) {
    res.status(404);
    res.type('text/plain');
    res.send('404 Not found.');
})
//500 Error handling for internal server errors
router.use(function(err, req, res, next) {
    res.status(500);
    res.type('text/plain');
    res.send('Internal Server Error.');
})
module.exports = router;