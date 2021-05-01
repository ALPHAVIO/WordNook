const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const auth = require('../middlewares/auth');
const testimonials = require('../dummy-data/testimonial');


const router = express.Router();
router.use(methodOverride('_method'));
router.use(bodyParser.json());

// Get request for testimonial-wall
router.get('/testimonial-wall', auth, async (req, res) => {
	res.render('./postitems/testimonial-wall', {
		isAuthenticated: !!req.user,
		testimonials,
	});
}); 

router.post('/testimonial-wall', auth, async (req, res) => {
	var inputViews = req.body.views;
	testimonials.push({
		views: inputViews,
		author: req.user.name,
	});
	console.log(inputViews);
	console.log(req.user.name);
	res.redirect('/testimonial-wall');
});
 
// // Get request for testimonial-write page-
// router.get('/testimonial-write', auth, async (req, res) => {
// 	const { user } = req;
// 	if (!user) {
// 		return res.status(401).redirect('/log-in');
// 	}
// 	res.render('./postitems/testimonial-write', {
// 		isAuthenticated: true,
// 	});
// 	// res.redirect('/');
// });
// router.post('/testimonial-write', auth, async (req, res) => {
// 	const { user } = req;
// 	if (!user) {
// 		return res.status(401).redirect('/log-in');
// 	}
// 	// res.redirect('/');
// });
module.exports = router;
