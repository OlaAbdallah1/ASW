const router = require ("express").Router();
const db = require("../app");
const bodyParser = require("body-parser");
const authController = require('../controllers/auth.controller');
const http = require('http');

// const bodyParser = require("body-parser"); //get request -data from user

router.get('/signup', authController.getSignup );
router.post(
	"/signup",
	bodyParser.urlencoded({ //middle ware to get user's data
		extended:true}),
		authController.postSignup
		);

router.get("/login" , authController.getLogin);
router.post("/login", authController.postLogin);
// router.all('/logout',authController.logout);
router.get('/home', function(request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		// Output username
		response.send('Welcome back, ' + request.session.name + '!');
	} else {
		// Not logged in
		response.send('Please login to view this page!');
	}
	response.end();
});

module.exports = router;