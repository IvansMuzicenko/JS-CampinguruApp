const express = require('express');
const router = express.Router({ mergeParams: true });
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const {
	isLoggedIn,
	isAuthor,
	validateCampground,
	isOwner,
	geoFind
} = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const tinify = require('tinify');
tinify.key = process.env.TINIFY_KEY;

router.route('/').get(catchAsync(campgrounds.index));

router
	.route('/new')
	.get(isOwner, isLoggedIn, campgrounds.renderNewForm)
	.post(
		isLoggedIn,
		isOwner,
		upload.array('image'),
		validateCampground,
		catchAsync(campgrounds.createCampground)
	);
router.get('/map', catchAsync(campgrounds.map));

router
	.route('/:id')
	.get(catchAsync(campgrounds.showCampground))
	.delete(
		isLoggedIn,
		isOwner,
		isAuthor,
		catchAsync(campgrounds.deleteCampground)
	);

router
	.route('/:id/edit')
	.get(isLoggedIn, isAuthor, isOwner, catchAsync(campgrounds.renderEditForm))
	.put(
		isLoggedIn,
		isOwner,
		isAuthor,
		upload.array('image'),
		validateCampground,
		catchAsync(campgrounds.updateCampground)
	);

module.exports = router;
