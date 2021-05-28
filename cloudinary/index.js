const Campground = require('../models/campground');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const fs = require('fs');
const tinify = require('tinify');
tinify.key = process.env.TINIFY_KEY;

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		// format: async (req, file) => {
		// 	return '';
		// },
		transformation: [{ quality: 'auto' }],
		folder: async (req, file) => {
			// const files = Object.entries(file);
			// // console.log(files);
			// // console.log(files[1][1]);
			// const buff = Buffer.from(files, 'base64');
			// console.log(buff);

			// tinify.fromBuffer(buff).toBuffer(function (err, resultData) {
			// 	if (err) throw err;
			// 	console.log(resultData);
			// });
			// fs.readFile(files[1][1], function (err, sourceData) {
			// 	if (err) throw err;
			// 	tinify.fromBuffer(sourceData).toBuffer(function (err, resultData) {
			// 		if (err) throw err;
			// 		// ...
			// 	});
			// });
			// if (condition) {
			// 	let result = cloudinary.api.sub_folders(
			// 		'campinguru/campgrounds',
			// 		function (error, result) {
			// 			return result;
			// 		}
			// 	);
			// }
			// let pathModifier = 0;
			// let modifiedTitle = req.body.campground.title;

			// for (let i = 0; i < result.folders.length; i++) {
			// 	if (modifiedTitle == result.folders[i].name) {
			// 		pathModifier++;
			// 		i = 0;
			// 		modifiedTitle = req.body.campground.title + '-' + pathModifier;
			// 	}
			// }
			let location = req.body.campground.location;

			location = location.replace(',', '');

			let titleFull = `${req.body.campground.title}_${location}`;
			titleFull = titleFull.split('/').join('-');
			const title = titleFull.replace(/ /g, '-');
			return `campinguru/campgrounds/${title}`;
		},
		allowedFormats: ['jpeg', 'png', 'jpg']
	}
});

module.exports = {
	cloudinary,
	storage
};
