const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const auth = require('../middlewares/auth');
const User = require('../models/User.model');
const testimonials = require('../dummy-data/testimonial');
const Testimonial = require('../models/Testimonial.model');

const router = express.Router();
router.use(methodOverride('_method'));
router.use(bodyParser.json());

// Get request for testimonial-wall
router.get('/testimonial-wall', auth, async (req, res) => {
	// fetching all the testimonials from the database
	const testimonial = await Testimonial.find();

	// adding it to predefined testimonials
	testimonial.map(function (test) {
		return testimonials.push(test);
	});

	res.render('./testimonials/testimonial-wall', {
		isAuthenticated: !!req.user,
		testimonials,
	});
});

// Post request for testimonial-wall
router.post('/testimonial-wall', auth, async (req, res) => {
	const inputViews = req.body.views;
	const _id = req.user;
	const user = await User.findById(_id);
	const inputAuthor = `${user.firstName} ${user.lastName}`;
	// Adding a new Testimonial in the database
	const newtestimonial = new Testimonial({
		author: inputAuthor,
		views: inputViews,
	});
	const com = await newtestimonial.save();

	res.redirect('/testimonial-wall');
});

module.exports = router;
