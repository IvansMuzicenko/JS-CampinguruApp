const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;

const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary, storage } = require('../cloudinary');
const { search } = require('../routes/campgrounds');

module.exports.map = async (req, res) => {
	const campgrounds = await Campground.find({}).populate('popupText');
	req.session.returnTo = req.originalUrl;
	res.render('campgrounds/map', { campgrounds });
};

module.exports.index = async (req, res) => {
	const query = req.query;
	// let search = req.cookies.geolocation
	search = {};
	if (req.query.q) {
		const keyObj = query.s;
		const value = query.q;
		search[keyObj] = value;
	}
	let currentReq = req.url;
	currentReq = currentReq.slice(currentReq.indexOf('/') + 1);
	currentReq = currentReq.slice(currentReq.indexOf('?') + 1);
	currentReq = currentReq.split('&');
	if (currentReq[currentReq.length - 1].includes('page=')) {
		currentReq = currentReq.pop();
	}
	if (typeof currentReq == 'object' || typeof currentReq == 'array') {
		currentReq = currentReq.join('&');
	}
	if (currentReq.length) {
		currentReq = currentReq + '&';
	}

	let pageCount = await Campground.countDocuments(search);
	const limit = 25;
	pageCount = Math.ceil(pageCount / limit);
	let pages = [...Array(pageCount).keys()].map((x) => ++x);
	let all;
	let pagination;
	let page = parseInt(req.query.page) || 1;
	if (page > pageCount) {
		page = 1;
	}
	const campgrounds = await Campground.find(
		search,
		{},
		{ skip: (page - 1) * limit, limit: limit }
	).populate('popupText');

	if (page < 6) {
		pagination = pages.slice(0, 10);
	} else if (page > pageCount - 5) {
		pagination = pages.slice(-10);
	} else {
		all = pages.slice(page - 6);
		pagination = all.slice(1, 10);
	}

	if (page < 3) {
		pagination2 = pages.slice(0, 5);
	} else if (page > pageCount - 3) {
		pagination2 = pages.slice(-5);
	} else {
		all = pages.slice(page - 4);
		pagination2 = all.slice(1, 6);
	}

	const prevPage = pages.slice(page - 2).slice(0, 1);

	const nextPage = pages.concat(pages).slice(page, page + 1);

	req.session.returnTo = req.originalUrl;

	res.render('campgrounds/index', {
		campgrounds,
		page,
		pages,
		pagination,
		pagination2,
		prevPage,
		nextPage,
		pageCount,
		query,
		currentReq
	});
};

module.exports.renderNewForm = (req, res) => {
	res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res) => {
	const campground = new Campground(req.body.campground);
	const geoData = await geocoder
		.forwardGeocode({
			query: req.body.campground.location,
			limit: 1
		})
		.send();
	campground.geometry = geoData.body.features[0].geometry;
	campground.images = req.files.map((f) => ({
		url: f.path,
		filename: f.filename
	}));
	campground.author = req.user._id;
	await campground.save();
	req.flash('success', 'New campground created!');
	res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
	const campground = await Campground.findById(req.params.id)
		.populate({
			path: 'reviews',
			populate: {
				path: 'author'
			}
		})
		.populate('author');
	if (!campground) {
		req.flash('error', 'Campground not found!');
		return res.redirect('/campgrounds');
	}

	let rating = 0;
	let ratingCount = 0;
	let avgRating = 0;

	for (let review of campground.reviews) {
		ratingCount++;
		rating += review.rating;
		avgRating = Math.round(rating / ratingCount);
	}
	req.session.returnTo = req.originalUrl;
	res.render('campgrounds/show', { campground, avgRating });
};

module.exports.renderEditForm = async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	if (!campground) {
		req.flash('error', 'Campground not found!');
		return res.redirect('/campgrounds');
	}
	res.render('campgrounds/edit', { campground });
};

module.exports.updateCampground = async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findByIdAndUpdate(
		id,
		{ ...req.body.campground },
		{ new: true }
	);
	const geoData = await geocoder
		.forwardGeocode({
			query: req.body.campground.location,
			limit: 1
		})
		.send();
	campground.geometry = geoData.body.features[0].geometry;
	const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
	campground.images.push(...imgs);
	if (req.body.deleteImages) {
		for (let filename of req.body.deleteImages) {
			await cloudinary.uploader.destroy(filename);
		}
		await campground.updateOne({
			$pull: { images: { filename: { $in: req.body.deleteImages } } }
		});
	}
	await campground.save();
	req.flash('success', 'Campground updated!');
	res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	for (let image of campground.images) {
		await cloudinary.uploader.destroy(image.filename);
	}

	const fullPath = campground.images[0].filename;
	const splited = fullPath.split('/');
	const folderSplit = splited.slice(
		splited.indexOf('campinguru'),
		splited.length - 1
	);
	const folderPath = folderSplit.join('/');
	await cloudinary.api.delete_folder(folderPath, function (error, result) {
		if (error) console.log(error);
	});

	await Campground.findByIdAndDelete(id);
	req.flash('success', 'Campground deleted!');
	res.redirect('/campgrounds');
};
