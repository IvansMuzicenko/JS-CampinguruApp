const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const reviews = require('../controllers/reviews');
const {
	validateReview,
	isLoggedIn,
	isReviewAuthor,
	isGuest
} = require('../middleware');

router.post(
	'/',
	isLoggedIn,
	isGuest,
	validateReview,
	catchAsync(reviews.createReview)
);

router.delete(
	'/:reviewId',
	isLoggedIn,
	isGuest,
	isReviewAuthor,
	catchAsync(reviews.deleteReview)
);

module.exports = router;
