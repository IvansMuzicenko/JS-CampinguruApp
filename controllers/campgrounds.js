const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;

const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary, storage } = require('../cloudinary');

module.exports.map = async (req, res) => {
	const campgrounds = await Campground.find({}).populate('popupText');
	res.render('campgrounds/map', { campgrounds });
};

module.exports.index = async (req, res) => {
	let pageCount = await Campground.count({});
	pageCount = Math.ceil(pageCount / 25);
	let page = parseInt(req.query.page) || 1;
	if (page > pageCount) {
		page = 1;
	}
	const campgrounds = await Campground.find(
		{},
		{},
		{ skip: (page - 1) * 25, limit: 25 }
	).populate('popupText');

	let pages = [...Array(pageCount).keys()].map((x) => ++x);
	const start = page - 6;
	const before = pages.slice(start);
	const all = before.concat(pages);
	const pagination = all.slice(0, 11);

	const prevPage = pages.slice(page - 2).slice(0, 1);

	const nextPage = pages.concat(pages).slice(page, page + 1);

	res.render('campgrounds/index', {
		campgrounds,
		page,
		pages,
		pagination,
		prevPage,
		nextPage
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
	res.render('campgrounds/show', { campground });
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
	campground.images.forEach(function (img) {
		cloudinary.uploader.destroy(img.filename);
	});
	await Campground.findByIdAndDelete(id);
	req.flash('success', 'Campground deleted!');
	res.redirect('/campgrounds');
};
