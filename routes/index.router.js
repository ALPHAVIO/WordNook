// requiring dependencies, models and middlewares
const express = require('express');
const multer = require('multer');
const auth = require('../middlewares/auth');
const Blog = require('../models/Blog.model');
const testimonial = require('../dummy-data/testimonial');

const sendMail =
	process.env.NODE_ENV === 'production'
		? require('../middlewares/mail')
		: 'development';

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads/');
	},
	filename: function (req, file, cb) {
		cb(
			null,
			new Date().toISOString().replace(/:/g, '-') + file.originalname
		);
	},
});

const fileFilter = (req, file, cb) => {
	// reject a file
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5,
	},
	fileFilter: fileFilter,
});

const router = express.Router();

// Default Texts-
const homeStartingContent =
	"I'm WordNook, your best pal. What do I do? Well, I'm here to help you out. I'll be there to listen to your thoughts or share with you my pal's ideas and few amazing blogs.That's all? Not yet. I'm here to take you on a wonderful journey of unlimited thoughts and help you find your twin souls too!!! Sounds great? Here we go....Let's get started.";
const aboutContent =
	"'Blog' and 'blogging' are now loosely used for content creation and sharing on social media, especially when the content is long-form and one creates and shares content on regular basis.";
const contactContent =
	"Got a query to ask? Have an amazing idea? Loved our page? Okay! All you have to do is shoot a mail and we'll get back to you shortly.";

const categories = [
	'IT & Software',
	'Business',
	'Personality Development',
	'Design',
	'Marketing',
	'Lifestyle',
	'Photography',
	'Health & Fitness',
	'Music',
	'Academics',
	'Language',
	'Sports',
	'Social media',
	'History',
	'Space and Research',
];

// Get request for home route-
router.get(
	['/', '/page/:page', '/page/:perPage', '/page/:page/:perPage', '/category'],
	auth,
	async (req, res) => {
		let perPage = parseInt(req.params.perPage) || 5;
		if (req.query.perPage > 0) perPage = parseInt(req.query.perPage);
		const currentPage = req.params.page || 1;
		const order = req.query.order || 'new one first';
		Blog.find({ status: 'Public' })
			.sort({ timestamps: order === 'new one first' ? 'desc' : 'asc' })
			.populate('author')
			.skip(perPage * currentPage - perPage)
			.limit(perPage)
			.exec((err, foundBlogs) => {
				// eslint-disable-next-line
				Blog.count().exec((err, count) => {
					if (err) console.log(err);
					else {
						res.render('./navitems/home', {
							homeStartingContent: homeStartingContent,
							posts: foundBlogs,
							categories,
							current: currentPage,
							pages: Math.ceil(foundBlogs.length / perPage),
							search: '',
							perPage: perPage,
							order: order,
							isAuthenticated: !!req.user,
							testimonial,
							// currentUser: req.user,
						});
					}
				});
			});
	}
);

// Get request for about page-
router.get('/about', auth, async (req, res) => {
	res.render('./navitems/about', {
		aboutContent: aboutContent,
		isAuthenticated: !!req.user,
	});
});

// Get request for contact page-
router.get('/contact', auth, async (req, res) => {
	res.render('./navitems/contact', {
		contactContent: contactContent,
		error: '',
		formData: {
			subject: '',
			email: '',
			message: '',
		},
		isAuthenticated: !!req.user,
	});
});

// post request for contact page
router.post('/contact', async (req, res) => {
	const { subject, email, message } = req.body;
	sendMail(subject, email, message, (err) => {
		if (err) res.status(500).json({ message: 'Error occurred!' });
		else {
			res.render('./navitems/contact', {
				contactContent: 'Email was sent successfully!',
				error: '',
				formData: {
					subject: '',
					email: '',
					message: '',
				},
				isAuthenticated: !!req.user,
			});
		}
	});
});

// Get request for compose blog page-
router.get('/compose', auth, async (req, res) => {
	const { user } = req;
	if (!user) {
		return res.status(401).redirect('/log-in');
	}
	res.render('./postitems/compose', {
		categories,
		isAuthenticated: true,
	});
});

// Capitalizing the first letter of the title of the blog
function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

// Post request to save the new blogs to the DB
router.post('/compose', auth, upload.single('photo'), async (req, res) => {
	const { user } = req;
	if (!user) {
		return res.status(401).redirect('/log-in');
	}
	const postTitle = capitalize(req.body.postTitle);
	const { category } = req.body;
	const { status } = req.body;
	const postContent = req.body.postBody;

	let photo = '';

	if (req.file) {
		photo = req.file.path;
	}

	const blog = new Blog({
		blogTitle: postTitle,
		blogContent: postContent,
		category,
		status,
		photo,
		comments: [],
		author: user._id,
	});
	blog.save();
	res.redirect('/');
});

module.exports = router;
