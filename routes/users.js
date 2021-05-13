const express = require('express');
const router = express.Router();
const passport = require('passport');
const users = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, redirect } = require('../middleware');
router
	.route('/register')
	.get(redirect, users.renderRegister)
	.post(catchAsync(users.register));
router.route('/register-check').post(users.registerCheck);
router.post('/login-check', function (req, res, next) {
	passport.authenticate('local', { session: false }, function (err, user, info) {
		if (user) {
			return res.send({});
		}
		return res.send(info);
	})(req, res, next);
});
router
	.route('/login')
	.get(redirect, users.renderLogin)
	.post(
		passport.authenticate('local', {
			failureFlash: false,
			failureRedirect: '/login'
		}),
		users.login
	);

router
	.route('/profile')
	.get(isLoggedIn, users.renderProfile)
	.post(isLoggedIn, users.passChange);

router.route('/changeprofile').post(isLoggedIn, users.changeprofile);

router.get('/logout', users.logout);

module.exports = router;
