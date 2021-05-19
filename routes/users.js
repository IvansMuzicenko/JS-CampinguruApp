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
router.post('/register-check', users.registerCheck);

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
router.post('/login-check', function (req, res, next) {
	passport.authenticate('local', { session: false }, function (err, user, info) {
		if (user) {
			return res.send({});
		}
		return res.send(info);
	})(req, res, next);
});

router.get('/logout', users.logout);

router.route('/profile').get(isLoggedIn, users.renderProfile);

router.post(
	'/passChange',
	isLoggedIn,
	function (req, res, next) {
		passport.authenticate(
			'local',
			{ session: false },
			function (err, user, info) {
				if (!user) {
					return res.send([
						{
							input: 'password',
							message: 'Incorrect password'
						}
					]);
				} else {
					next();
				}
			}
		)(req, res, next);
	},
	users.passChange
);

router.post('/editProfile', isLoggedIn, users.editProfile);

module.exports = router;
