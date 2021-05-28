const request = require('request');
const rp = require('request-promise');
const cookieParser = require('cookie-parser');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		req.flash('error', 'You must be signed in!');
		return res.redirect('/login');
	}
	next();
};

module.exports.redirect = (req, res, next) => {
	const redirectUrl = req.session.returnTo || '/';
	if (req.isAuthenticated()) {
		res.redirect(redirectUrl);
	}
	next();
};

module.exports.validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

module.exports.isAuthor = async (req, res, next) => {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	if (!campground.author.equals(req.user._id)) {
		req.flash('error', 'You do not have permission to do that!');
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
};

module.exports.validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

module.exports.isReviewAuthor = async (req, res, next) => {
	const { id, reviewId } = req.params;
	const review = await Review.findById(reviewId);
	if (!review.author.equals(req.user._id)) {
		req.flash('error', 'You do not have permission to do that!');
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
};

module.exports.isOwner = async (req, res, next) => {
	const redirectUrl = req.session.returnTo || '/';
	if (req.user) {
		const { accType } = req.user;

		if (accType && accType !== 'Owner') {
			return res.redirect(redirectUrl);
		}
	}
	next();
};

module.exports.isGuest = async (req, res, next) => {
	const redirectUrl = req.session.returnTo || '/';
	if (req.user) {
		const { accType } = req.user;

		if (accType && accType !== 'Guest') {
			return res.redirect(redirectUrl);
		}
	}
	next();
};

module.exports.geoFind = async (req, res, next) => {
	if (
		!req.cookies.geolocation ||
		typeof req.cookies.geolocation != 'object' ||
		!req.cookies.geolocation.country.length
	) {
		let ip = (
			req.headers['x-forwarded-for'] ||
			req.connection.remoteAddress ||
			''
		)
			.split(',')[0]
			.trim();

		if (ip == '127.0.0.1') ip = '';

		await rp({
			url: `https://geolocation-db.com/json/${ip}`,
			headers: {
				'User-Agent': 'Request-Promise'
			},
			resolveWithFullResponse: true,
			json: true
		})
			.then(async (response) => {
				const body = JSON.stringify(response.body);
				res.cookie('geolocation', body, {
					maxAge: 3600000
				});
			})
			.catch(function (err) {
				console.log('Geolocation failed');
			});
	}

	next();
};
