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
		const { username, password } = req.body;
		const nickname = username.slice(0, username.indexOf('@'));
		const user = new User({ username, nickname });
		const registeredUser = await User.register(user, password);
		req.login(registeredUser, (err) => {
			if (err) return next(err);
			req.flash(
				'registered',
				'Welcome to CampinGuru, visit and add more information!'
			);
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
			message: 'Password must be at least 8 characters long!'
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
	try {
		const { username } = req.user;
		const user = await User.findByUsername(username);
		console.log(user, user.passChange + 1000 * 60 * 60);
		if (Date.now() < user.passChange + 1000 * 60 * 60) {
			req.flash('error', 'Password can be changed once in 1 hour');
			return res.redirect('/profile');
		}
		const { password, newPassword, confirmPassword } = req.body;
		if (!newPassword) {
			req.flash('error', 'Must provide new password');
			return res.redirect('/profile');
		}

		if (newPassword.length < 8) {
			req.flash('error', 'Password must be at least 8 characters long');
			return res.redirect('/profile');
		}

		if (!confirmPassword) {
			req.flash('error', 'Must provide new password confirmation');
			return res.redirect('/profile');
		}

		if (newPassword !== confirmPassword) {
			req.flash('error', 'Password does not match');
			return res.redirect('/profile');
		}

		User.findByUsername(username).then(function (sanitizedUser) {
			if (sanitizedUser) {
				sanitizedUser.changePassword(password, newPassword, async (err) => {
					// User.findOneAndUpdate({ username }, { passChange: new Date() });
					sanitizedUser.passChange = Date.now();
					await sanitizedUser.save();
					if (err) return next(err);
				});
			}
		});

		req.flash('success', 'Password changed!');
		res.cookie('passChange', 'changed', { maxAge: 3600000 });
		res.redirect('/profile');
	} catch (e) {
		req.flash('error', e.message);
		res.redirect('/profile');
	}
};
