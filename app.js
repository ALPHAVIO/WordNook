// Acquiring Dependencies-
// const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cron = require('node-cron');

const sendNewsletter = require('./middlewares/newsletter');

const PORT = process.env.PORT || 3000;
const connectDB = require('./config/db');

// Setting up the app middlewares and the ejs view engine-
const app = express();

app.locals.moment = require('moment');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// When in development mode then only require the dotenv module
if (process.env.NODE_ENV !== 'production') {
	dotenv.config({ path: './.env' });
}

// Connecting to Mongo Database using ODM Mongoose-
connectDB();
// mongoose.set('useCreateIndex', true);

// router for the requests from home page
app.use(require('./routes/index.router'));

// Router for user login and sign in
app.use(require('./routes/user.router'));

// router for post and search related urls
app.use(require('./routes/post.router'));

// router for testimonials
app.use(require('./routes/testimonial.router'));

// router for newsletter
app.use(require('./routes/newsletter.router'));

// routing to 404 in case of unavilable urls.
app.use('*', (req, res) => {
	res.render('404', {
		isAuthenticated: !!req.user,
	});
});

// Launching the server on port 3000 in development mode-
app.listen(PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`Server started on port: ${PORT}`);
});

// mails would be send every first day of a month
// for checking you may change the first parameter to '*/15 * * * * *' so that emails are sent every 15 secs
// after checking successfully, please change it to '0 0 1 * *' so emails are sent every month
cron.schedule('0 0 1 * *', () => {
	sendNewsletter()
		.then((result) => {
			if (typeof result !== 'undefined')
				console.log('Email sent....', result);
		})
		.catch((error) => console.log('Error....', error));
});
