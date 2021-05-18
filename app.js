if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');

const User = require('./models/user');
const ExpressError = require('./utils/ExpressError');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

const app = express();

const MongoStore = require('connect-mongo');

let dbUrl = '';

// if (process.env.NODE_ENV !== 'production') {
// 	dbUrl = 'mongodb://localhost:27017/campinguru';
// } else {
// }
dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/campinguru';

mongoose.connect(dbUrl, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, '-Connection error:'));
db.once('open', () => console.log('-Database connected-'));

app.engine('ejs', ejsMate);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(
	mongoSanitize({
		replaceWith: '_'
	})
);

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

app.use(cookieParser(secret));

const sessionConfig = {
	store: MongoStore.create({
		mongoUrl: dbUrl,
		touchAfter: 24 * 60 * 60
	}),
	name: 'session',
	secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
};

app.use(session(sessionConfig));
app.use(flash());

app.use(helmet());

const scriptSrcUrls = [
	'https://stackpath.bootstrapcdn.com',
	'https://api.tiles.mapbox.com',
	'https://api.mapbox.com',
	'https://kit.fontawesome.com',
	'https://cdnjs.cloudflare.com',
	'https://cdn.jsdelivr.net'
];
const styleSrcUrls = [
	'https://kit-free.fontawesome.com',
	'https://stackpath.bootstrapcdn.com',
	'https://api.mapbox.com',
	'https://api.tiles.mapbox.com',
	'https://fonts.googleapis.com',
	'https://use.fontawesome.com',
	'https://fonts.gstatic.com'
];
const connectSrcUrls = [
	'https://api.mapbox.com',
	'https://a.tiles.mapbox.com',
	'https://b.tiles.mapbox.com',
	'https://events.mapbox.com',
	'https://extreme-ip-lookup.com'
];
const fontSrcUrls = [];
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: ['https://res.cloudinary.com/cateyken/'],
			connectSrc: ["'self'", ...connectSrcUrls],
			scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
			styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
			workerSrc: ["'self'", 'blob:'],
			objectSrc: [],
			imgSrc: [
				"'self'",
				'blob:',
				'data:',
				'https://res.cloudinary.com/cateyken/',
				'https://images.unsplash.com',
				'https://source.unsplash.com'
			],
			fontSrc: ["'self'", ...fontSrcUrls]
		}
	})
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	res.locals.registered = req.flash('registered');
	next();
});

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
	res.render('home');
});

app.all('*', (req, res, next) => {
	next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = 'Something went wrong. Try again!';
	res.status(statusCode).render('error', { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Serving on port ${port}`);
});
