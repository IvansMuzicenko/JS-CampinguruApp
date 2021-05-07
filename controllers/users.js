const User = require('../models/user');
const Review = require('../models/review');
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');

module.exports.renderRegister = (req, res) => {
	res.render('users/register');
};

module.exports.register = async (req, res, next) => {
	try {
		const { email, username, password } = req.body;
		const user = new User({ email, username });
		const registeredUser = await User.register(user, password);
		req.login(registeredUser, (err) => {
			if (err) return next(err);
			req.flash('success', 'Welcome to CampinGuru');
			const redirectUrl = req.session.returnTo || '/';
			res.redirect(redirectUrl);
		});
	} catch (e) {
		req.flash('error', e.message);
		res.redirect('/register');
	}
};

module.exports.registerCheck = async (req, res, next) => {
	const { username, email } = req.body;
	console.log(req.body);
	const usernameCheck = await User.find({ username });
	const emailCheck = await User.find({ email });

	let response = [];

	if (usernameCheck.length) {
		response.push({ input: 'username', message: 'Username already registered' });
	}
	if (emailCheck.length) {
		response.push({ input: 'email', message: 'E-mail already registered' });
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

module.exports.passChange = async (req, res, next) => {
	try {
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

		const { username } = req.user;
		User.findByUsername(username).then(function (sanitizedUser) {
			if (sanitizedUser) {
				sanitizedUser.changePassword(password, newPassword, async (err) => {
					await sanitizedUser.save();
					if (err) return next(err);
				});
			}
		});

		req.flash('success', 'Password changed!');
		res.redirect('/profile');
	} catch (e) {
		req.flash('error', e.message);
		res.redirect('/profile');
	}
};
