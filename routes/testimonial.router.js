const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const auth = require('../middlewares/auth');
const User = require('../models/User.model');
const testimonials = require('../dummy-data/testimonial');

const router = express.Router();
router.use(methodOverride('_method'));
router.use(bodyParser.json());

// Get request for testimonial-wall
router.get('/testimonial-wall', auth, async (req, res) => {
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
	testimonials.push({
		views: inputViews,
		author: inputAuthor,
	});
	res.redirect('/testimonial-wall');
});

module.exports = router;
