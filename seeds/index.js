if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const mongoose = require('mongoose');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const Review = require('../models/review');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const fs = require('fs');
const citiesObj = JSON.parse(
	fs.readFileSync(
		'node_modules/all-countries-and-cities-json/countries.min.json'
	)
);

let dbUrl = '';
let author = '';

// if (process.env.NODE_ENV !== 'production') {
// 	dbUrl = 'mongodb://localhost:27017/campinguru';
// 	author = '607f0d484fff0121cc161ef2';
// } else {
// }
dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/campinguru';
author = '60894166d55a7e004aa5f6f6';

mongoose.connect(dbUrl, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Database connected');
	seedDB().then(() => {
		mongoose.connection.close();
	});
});
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	await Review.deleteMany({});
	Campground.images.forEach(function (img) {
		cloudinary.uploader.destroy(img.filename);
	});
	for (const [country, city] of Object.entries(citiesObj)) {
		const cityArr = [];
		for (let i = 0; i < 40 && i < city.length; i++) {
			cityArr.push(city[i]);
		}
		for (const name of cityArr) {
			const location = `${name}, ${country}`;
			console.log(location);
			const geoData = await geocoder
				.forwardGeocode({
					query: location,
					limit: 1
				})
				.send();
			const geometry = geoData.body.features[0].geometry;
			const price = Math.floor(Math.random() * 20) + 10;
			const camp = new Campground({
				author,
				location,
				title: `${sample(descriptors)} ${sample(places)}`,
				description:
					'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
				price,
				geometry,
				images: [
					{
						url:
							'https://res.cloudinary.com/cateyken/image/upload/v1618999000/campinguru/campfire_wbrg1s.jpg',
						filename: 'campinguru/campfire_wbrg1s.jpg'
					},
					{
						url:
							'https://res.cloudinary.com/cateyken/image/upload/v1618999002/campinguru/river_ayeamb.jpg',
						filename: 'campinguru/river_ayeamb.jpg'
					}
				]
			});
			await camp.save();
		}
	}
};

// const seedDB = async () => {
// 	await Campground.deleteMany({});
// 	for (let i = 0; i < 1000; i++) {
// 		const random1000 = Math.floor(Math.random() * 1000);
// 		const price = Math.floor(Math.random() * 20) + 10;
// 		const camp = new Campground({
// 			author: '60883767a70532004a39c317',
// 			location: `${cities[random1000].city}, ${cities[random1000].state}`,
// 			title: `${sample(descriptors)} ${sample(places)}`,
// 			description:
// 				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
// 			price,
// 			geometry: {
// 				type: 'Point',
// 				coordinates: [cities[random1000].longitude, cities[random1000].latitude]
// 			},
// 			images: [
// 				{
// 					url:
// 						'https://res.cloudinary.com/drhbngwfh/image/upload/v1618999000/campinguru/campfire_wbrg1s.jpg',
// 					filename: 'campinguru/campfire_wbrg1s.jpg'
// 				},
// 				{
// 					url:
// 						'https://res.cloudinary.com/drhbngwfh/image/upload/v1618999002/campinguru/river_ayeamb.jpg',
// 					filename: 'campinguru/river_ayeamb.jpg'
// 				}
// 			]
// 		});
// 		await camp.save();
// 	}
// };
