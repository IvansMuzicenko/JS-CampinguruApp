const User = require('../models/user');
const Review = require('../models/review');
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');

module.exports.renderRegister = (req, res) => {
	res.render('users/register');
};

module.exports.register = async (req, res, next) => {
	try {
		const { username, password, accType } = req.body;
		const nickname = username.slice(0, username.indexOf('@'));
		const user = new User({ username, nickname, accType });
		const registeredUser = await User.register(user, password);
		req.login(registeredUser, (err) => {
			if (err) return next(err);
			req.flash('registered', 'Welcome!');
			const redirectUrl = req.session.returnTo || '/';
			res.redirect(redirectUrl);
		});
	} catch (e) {
		req.flash('error', e.message);
		res.redirect('/register');
	}
};

module.exports.registerCheck = async (req, res, next) => {
	const { username, password } = req.body;
	const usernameCheck = await User.find({ username });
	const mailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	let response = [];

	if (!mailFormat.test(username)) {
		response.push({ input: 'login', message: 'Provide a valid e-mail!' });
	}
	if (usernameCheck.length) {
		response.push({ input: 'login', message: 'E-mail already taken' });
	}
	if (password.includes(username)) {
		response.push({
			input: 'password',
			message: 'Password can not contain e-mail'
		});
	}
	if (password.length < 8) {
		response.push({
			input: 'password',
			message: 'Password must contain at least 8 characters'
		});
	}

	return res.send(response);
};

module.exports.renderLogin = (req, res) => {
	res.render('users/login');
};

module.exports.login = (req, res) => {
	req.flash('success', 'Logged in!');
	const redirectUrl = req.session.returnTo || '/';
	delete req.session.returnTo;
	res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
	req.logout();
	req.flash('success', 'Logged out!');
	const redirectUrl = req.session.returnTo || '/';
	delete req.session.returnTo;
	res.redirect(redirectUrl);
};

module.exports.renderProfile = async (req, res, next) => {
	const campgrounds = await Campground.find(
		{ author: `${req.user._id}` },
		'title location _id reviews author'
	)
		.populate({
			path: 'reviews',
			populate: {
				path: 'author'
			}
		})
		.populate('author');
	const reviewCount = await Review.countDocuments({ author: `${req.user._id}` });
	const campgroundCount = await Campground.countDocuments({
		author: `${req.user._id}`
	});
	res.render('users/profile', {
		campgrounds,
		reviewCount,
		campgroundCount
	});
};
module.exports.changeprofile = async (req, res, next) => {
	try {
		const user = await User.findByIdAndUpdate(
			req.user._id,
			{ ...req.body },
			{ new: true }
		);

		await user.save();

		res.send(user);
	} catch (e) {
		req.flash('error', e.message);
		res.redirect('/profile');
	}
};

module.exports.passChange = async (req, res, next) => {
	const { username } = req.user;
	const { passChange } = await User.findByUsername(username);
	let response = [];

	if (passChange && new Date() < passChange) {
		const now = new Date();
		const remaining = Math.round((passChange.getTime() - now.getTime()) / 60000);
		response.push({
			input: 'timer',
			message: `You can change password after ${remaining} minutes`
		});
		return res.send(response);
	}
	const { password, newPassword, confirmPassword } = req.body;
	if (!newPassword) {
		response.push({
			input: 'newPassword',
			message: 'Must provide new password'
		});
	}

	if (newPassword.length < 8) {
		response.push({
			input: 'newPassword',
			message: 'Password must contain at least 8 characters'
		});
	}

	if (newPassword.includes(username)) {
		response.push({
			input: 'newPassword',
			message: 'Password can not contain e-mail'
		});
	}

	if (!confirmPassword) {
		response.push({
			input: 'confirmPassword',
			message: 'Must provide new password confirmation'
		});
	}

	if (newPassword !== confirmPassword) {
		response.push({
			input: 'confirmPassword',
			message: 'Confirm password does not match'
		});
	}
	if (!response.length) {
		User.findByUsername(username).then(function (sanitizedUser) {
			if (sanitizedUser) {
				sanitizedUser.changePassword(password, newPassword, async (err) => {
					const expires = new Date();
					expires.setHours(expires.getHours() + 1);
					sanitizedUser.passChange = expires;
					// console.log(sanitizedUser.passChange);
					await sanitizedUser.save();
					if (err) return next(err);
				});
			}
		});
	}

	return res.send(response);
};
