const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
	url: String,
	filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
	return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema(
	{
		title: String,
		images: [ImageSchema],
		geometry: {
			type: {
				type: String,
				enum: ['Point'],
				required: true
			},
			coordinates: {
				type: [Number],
				required: true
			}
		},
		price: Number,
		description: String,
		location: String,
		author: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		reviews: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Review'
			}
		]
	},
	opts
);

CampgroundSchema.virtual('properties.popupMarkup').get(function () {
	return `<div class="black by-3"><a href="/campgrounds/${
		this._id
	}"><img class="w-100 cover" src='${this.images.length ? this.images[0].url : 'https://res.cloudinary.com/cateyken/image/upload/w_200/v1618999000/campinguru/campfire_wbrg1s.jpg'}'><div class="card mb-3 black ">
	<div class="card-body">
		<h5 class="card-title">
			<a href="/campgrounds/${this._id}">${this.title}</a>
		</h5>
		<p class="card-text">${this.description}</p>
		<ul class="list-group list-group-flush">
		<li class="list-group-item text-muted">${this.location} </li>
		<li class="list-group-item">$${this.price}/night</li>
		</ul>
	</div>
	<a class="btn btn-outline-primary" href="/campgrounds/${this._id}"
						>View ${this.title}</a
					>
</a></div>`;
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
	if (doc) {
		await Review.deleteMany({
			_id: {
				$in: doc.reviews
			}
		});
	}
});

CampgroundSchema.post('save', function (doc) {
	console.log('%s has been saved', doc._id);
});

module.exports = mongoose.model('Campground', CampgroundSchema);
