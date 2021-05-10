const express = require('express');
const router = express.Router();
const passport = require('passport');
const users = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, redirect } = require('../middleware');
router
	.route('/register')
	.get(redirect, users.renderRegister)
	.post(redirect, catchAsync(users.register));
router.route('/register-check').post(users.registerCheck);
router
	.route('/login')
	.get(redirect, users.renderLogin)
	.post(
		redirect,
		passport.authenticate('local', {
			failureFlash: true,
			failureRedirect: '/login'
		}),
		users.login
	);

router
	.route('/profile')
	.get(isLoggedIn, users.renderProfile)
	.post(isLoggedIn, users.passChange);

router.get('/logout', users.logout);

module.exports = router;
