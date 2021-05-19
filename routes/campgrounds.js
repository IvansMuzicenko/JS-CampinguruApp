const express = require('express');
const router = express.Router({ mergeParams: true });
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const {
	isLoggedIn,
	isAuthor,
	validateCampground,
	isOwner,
	isGuest
} = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const tinify = require('tinify');
tinify.key = process.env.TINIFY_KEY;

router
	.route('/')
	.get(catchAsync(campgrounds.index))
	.post(
		isLoggedIn,
		isOwner,
		upload.array('image'),
		validateCampground,
		catchAsync(campgrounds.createCampground)
	);

router.get('/new', isOwner, isLoggedIn, campgrounds.renderNewForm);
router.get('/map', catchAsync(campgrounds.map));

router
	.route('/:id')
	.get(catchAsync(campgrounds.showCampground))
	.put(
		isLoggedIn,
		isOwner,
		isAuthor,
		upload.array('image'),
		validateCampground,
		catchAsync(campgrounds.updateCampground)
	)
	.delete(
		isLoggedIn,
		isOwner,
		isAuthor,
		catchAsync(campgrounds.deleteCampground)
	);

router.get(
	'/:id/edit',
	isLoggedIn,
	isAuthor,
	isOwner,
	catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
