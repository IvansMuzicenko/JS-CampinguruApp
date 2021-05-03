const User = require('../models/user');
const Review = require('../models/review');
const Campground = require('../models/campground');

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
			res.redirect('/campgrounds');
		});
	} catch (e) {
		req.flash('error', e.message);
		res.redirect('/register');
	}
};

module.exports.renderLogin = (req, res) => {
	res.render('users/login');
};

module.exports.login = (req, res) => {
	req.flash('success', 'Logged in!');
	const redirectUrl = req.session.returnTo || '/campgrounds';
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
