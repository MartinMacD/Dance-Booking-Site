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
router.get('/courses', controller.show_courses);
router.get("/", controller.landing_page);

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