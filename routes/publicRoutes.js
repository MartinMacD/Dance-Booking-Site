const express = require('express');
const router = express.Router();
const controller = require('../controllers/publicControllers.js');
const {login} = require('../auth/auth')
const {verify} = require('../auth/auth')

router.get('/login', controller.show_login);
router.post('/login', login, controller.handle_login);
router.get('/dashboard', verify, controller.show_dashboard)
router.get('/register', controller.show_register_page); 
router.post('/register', controller.post_new_organiser);
router.get('/courses', controller.show_courses_with_classes);
router.get('/classes', controller.show_classes);
router.get('/newclass', verify, controller.show_new_class_form);
router.post('/newclass', verify, controller.create_new_class);
router.get("/newcourse", verify, controller.show_new_course_form);
router.post("/newcourse", verify, controller.create_new_course);
router.post("/class/delete/:classID", verify, controller.delete_class);
router.post('/courses/delete/:courseID', verify, controller.delete_course);
router.get("/", controller.landing_page);

router.get("/logout", (req, res) => {
    res.clearCookie("jwt"); 
    res.redirect("/"); 
  });

router.use(function(req, res) {
    res.status(404);
    res.type('text/plain');
    res.send('404 Not found.');
})
router.use(function(err, req, res, next) {
    res.status(500);
    res.type('text/plain');
    res.send('Internal Server Error.');
})
module.exports = router;