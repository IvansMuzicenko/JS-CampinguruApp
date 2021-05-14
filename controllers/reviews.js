const Campground = require('../models/campground');
const Review = require('../models/review');

const ratingUpdate = (campground) => {
	let rating = 0;
	let ratingCount = 0;
	let avgRating = 0;

	for (let review of campground.reviews) {
		ratingCount++;
		rating += review.rating;
		avgRating = Math.round(rating / ratingCount);
	}
	campground.rating = avgRating;
	campground.save();
};

module.exports.createReview = async (req, res) => {
	const campground = await Campground.findById(req.params.id).populate({
		path: 'reviews'
	});
	const review = new Review(req.body.review);

	review.author = req.user._id;
	campground.reviews.push(review);
	await review.save();

	ratingUpdate(campground);

	req.flash('success', 'Created a new review!');
	res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res) => {
	const { id, reviewId } = req.params;
	await Campground.findByIdAndUpdate(id, {
		$pull: { reviews: reviewId }
	});
	await Review.findByIdAndDelete(reviewId);
	const campground = await Campground.findById(req.params.id).populate({
		path: 'reviews'
	});

	ratingUpdate(campground);
	req.flash('success', 'Successfully deleted review');
	res.redirect(`/campgrounds/${id}`);
};
