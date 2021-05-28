const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const fs = require('fs');

const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary, storage } = require('../cloudinary');
const { search } = require('../routes/campgrounds');

module.exports.map = async (req, res) => {
	const campgrounds = await Campground.find({}).populate('popupText');
	req.session.returnTo = req.originalUrl;
	res.render('campgrounds/map', { campgrounds });
};

module.exports.index = async (req, res) => {
	const citiesObj = JSON.parse(
		fs.readFileSync(
			'node_modules/all-countries-and-cities-json/countries.min.json'
		)
	);
	let countries = [];
	for (const [country, city] of Object.entries(citiesObj)) {
		countries.push(country);
	}
	//------------Geolocation cookie--

	let geoCountry = '';
	let geoCity = '';
	if (req.cookies.geolocation) {
		const geoCookie = JSON.parse(req.cookies.geolocation);
		geoCountry = await geoCookie.country_name;
		geoCity = await geoCookie.city;
	}

	//------------Search------------------
	const query = req.query;
	const location = `${query.city ? `${query.city},` : ''} ${query.country}`;
	let search = {};
	if (query.q) {
		const keyObj = query.s;
		const value = query.q;
		search[keyObj] = { $regex: value, $options: 'i' };
		if (query.s == '') {
		}
		if (query.s == 'all') {
			search = {
				$or: [
					{ title: { $regex: value, $options: 'i' } },
					{ location: { $regex: value, $options: 'i' } },
					{ description: { $regex: value, $options: 'i' } }
				]
			};
		}
	}
	if (query.country) {
		search.location = { $regex: location, $options: 'i' };
	}
	if (query.priceMin || query.priceMax) {
		search.price = { $gt: query.priceMin, $lt: query.priceMax };
	}
	//--------------Sort--------
	let sort = {};
	if (query.sortTitle) {
		sort = { title: query.sortTitle == 'asc' ? 1 : -1 };
	}
	if (query.sortPrice) {
		sort = { price: query.sortPrice == 'asc' ? 1 : -1 };
	}
	if (query.sortRating) {
		sort = { rating: query.sortRating == 'asc' ? 1 : -1 };
	}

	//------currentURL-------------
	let currentReq = req.url.slice(req.url.lastIndexOf('/') + 1);
	currentReq = currentReq.slice(currentReq.indexOf('?') + 1);
	currentReq = currentReq.split('&');
	currentReq.forEach((el) => {
		if (el.includes('page=')) {
			currentReq.splice(currentReq.indexOf(el), 1);
		}
	});

	if (typeof currentReq == 'object' || typeof currentReq == 'array') {
		currentReq = currentReq.join('&');
	}
	if (currentReq.length) {
		currentReq = currentReq + '&';
	}

	//--------------pageCount-------------------------
	let pageCount = await Campground.countDocuments(search);
	const limit = 25;
	pageCount = Math.ceil(pageCount / limit);
	let pages = [...Array(pageCount).keys()].map((x) => ++x);
	let all;
	let pagination;
	let page = parseInt(query.page) || 1;
	if (page > pageCount) {
		page = 1;
	}
	let campgrounds = await Campground.find(
		search,
		{},
		{ skip: (page - 1) * limit, limit: limit }
	).sort(sort);

	let nearCamps = [];
	let searchNear;
	if (geoCountry.length) {
		searchNear = { location: { $regex: geoCountry, $options: 'i' } };
		nearCamps = await Campground.find(searchNear, 'title location price images', {
			limit: 10
		});
	}
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

	let showNearCheck = false;
	if (
		(!currentReq.includes(`country=${geoCountry}`) ||
			currentReq.includes(`city=`)) &&
		nearCamps.length
	) {
		showNearCheck = true;
	}
	req.session.returnTo = req.originalUrl;

	res.render('campgrounds/index', {
		campgrounds,
		nearCamps,
		page,
		pages,
		pagination,
		pagination2,
		prevPage,
		nextPage,
		pageCount,
		query,
		currentReq,
		countries,
		citiesObj,
		search,
		geoCountry,
		geoCity,
		showNearCheck
	});
};

module.exports.renderNewForm = (req, res) => {
	res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res) => {
	req.body.campground.title = req.body.campground.title.split('/');
	req.body.campground.location = req.body.campground.location.split('/');
	req.body.campground.title = req.body.campground.title.join('-');
	req.body.campground.location = req.body.campground.location.join('-');
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
	req.body.campground.title = req.body.campground.title.split('/');
	req.body.campground.location = req.body.campground.location.split('/');
	req.body.campground.title = req.body.campground.title.join('-');
	req.body.campground.location = req.body.campground.location.join('-');
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

	if (campground.images.length) {
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
	}

	await Campground.findByIdAndDelete(id);
	req.flash('success', 'Campground deleted!');
	res.redirect('/campgrounds');
};
