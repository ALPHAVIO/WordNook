// requiring dependencies, models and middlewares
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const User = require('../models/User.model');
const auth = require('../middlewares/auth');
const {
	signupValidation,
	loginValidation,
} = require('../middlewares/validations/user.js');
const Blog = require('../models/Blog.model');

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

// GET request for Sign Up
router.get('/sign-up', auth, async (req, res) => {
	if (req.user) {
		res.redirect('/');
	} else {
		res.render('./auth/signUp', {
			error: '',
			data: {
				firstName: '',
				lastName: '',
				userName: '',
				password: '',
				email: '',
				confirmPassword: '',
			},
		});
	}
});

// GET request for Log In
router.get('/log-in', auth, async (req, res) => {
	if (req.user) {
		res.redirect('/');
	} else {
		res.render('./auth/logIn', {
			error: '',
			data: {
				email: '',
				password: '',
			},
		});
	}
});

// to view own profile
router.get('/read-profile', auth, async (req, res) => {
	const _id = req.user;
	const user = await User.findById(_id);
	const blogs = await Blog.find({ author: req.params.id })
		.populate('author')
		.sort({ timestamps: 'desc' })
		.lean();
	res.render('./useritems/read-profile', {
		user,
		blogs,
		isAuthenticated: !!req.user,
	});
});
router.post('/read-profile', upload.single('photo'), auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = [
		'firstName',
		'lastName',
		'userName',
		'email',
		'password',
	];
	const isValid = updates.every((update) => allowedUpdates.includes(update));

	if (!isValid) {
		res.status(400).send('invalid update property');
	}
	if (req.file) {
		updates.push('photo');
		req.body.photo = req.file.path;
	}
	try {
		const id = await req.user;
		const user = await User.findById(id._id);
		// eslint-disable-next-line
		updates.forEach((update) => (user[update] = req.body[update]));
		await user.save();
		res.redirect('/');
	} catch (e) {
		res.status(500).send(e);
	}
});

// POST request for sign up
router.post(
	'/sign-up',
	upload.single('photo'),
	signupValidation,
	async (req, res) => {
		const {
			firstName,
			lastName,
			userName,
			email,
			password,
			confirmPassword,
		} = req.body;

		// Check if the username or email already taken
		User.findOne({ $or: [{ email }, { userName }] }, () => {
			User.findOne({ userName }, (err, doc) => {
				if (doc) {
					return res.status(401).render('./auth/logIn', {
						error: 'Username already taken!',
						data: {
							firstName,
							lastName,
							userName,
							password,
							email,
							confirmPassword,
						},
					});
				}
				let photo = '';
				if (req.file) {
					photo = req.file.path;
				}
				const newUser = new User({
					firstName,
					lastName,
					userName,
					password,
					email,
					photo,
				});

				newUser.save((err, doc) => {
					if (err || !doc) {
						return res.status(422).render('./auth/logIn', {
							error: 'Oops something went wrong!',
							data: {
								firstName,
								lastName,
								userName,
								email,
								password,
							},
						});
					}
					const token = jwt.sign(
						{ _id: doc._id },
						process.env.SECRET_KEY
					);

					// Send back the token to the user as a httpOnly cookie
					res.cookie('token', token, {
						httpOnly: true,
					});
					res.redirect('/');
				});
			});
		});
	}
);

// POST request for log in
router.post('/log-in', loginValidation, async (req, res) => {
	const { email, password } = req.body;

	User.findOne({ email }, (err, doc) => {
		if (err || !doc) {
			return res.status(401).render('./auth/logIn', {
				error: 'Invalid email or password!',
				data: {
					email,
					password,
				},
			});
		}
		bcrypt.compare(password, doc.password, (err, matched) => {
			if (err || !matched) {
				return res.status(401).render('./auth/logIn', {
					error: 'Invalid email or password!',
					data: {
						email,
						password,
					},
				});
			}

			const token = jwt.sign(
				{ _id: doc._id, email },
				process.env.SECRET_KEY
			);

			res.cookie('token', token, {
				httpOnly: true,
			});

			res.redirect('/');
		});
	});
});

// Post route for log-out
router.post('/log-out', auth, async (req, res) => {
	res.clearCookie('token');
	res.redirect('/');
});

//* route    /author/:id
//* desc     Fetch the required user's blogs
router.get('/author/:id', auth, async (req, res) => {
	// If the requested author is the currently logged in user then redirect them to their dashbaord
	if (req.user) {
		if (req.params.id.toString() === req.user._id.toString())
			return res.redirect('/dashboard');
	} else {
		return res.redirect('/log-in');
	}
	try {
		try {
			const user = await User.findById(req.params.id);
			if (!user) return res.redirect('/error');
			let toggleunfollow = false;
			user.followers.forEach((item) => {
				if (item.toString() === req.user._id.toString()) {
					toggleunfollow = true;
				}
			});
			const likedBlogs = await Blog.find({
				_id: { $in: user.likedPosts },
				status: 'Public',
			});
			const blogs = await Blog.find({
				author: req.params.id,
				status: 'Public',
			})
				.populate('author')
				.sort({ timestamps: 'desc' })
				.lean();
			return res.render('./useritems/author', {
				user,
				toggleunfollow,
				posts: blogs,
				isAuthenticated: !!req.user,
				likedBlogs: likedBlogs,
			});
		} catch (error) {
			return res.redirect('/error');
		}
	} catch (error) {
		return res.redirect('/error');
	}
});

//* route    /dashboard/
//* desc     Fetch the logged in user's blogs
router.get('/dashboard', auth, async (req, res) => {
	if (!req.user) return res.redirect('/log-in');
	try {
		try {
			const user = await User.findById(req.user._id);
			if (!user) return res.redirect('/error');
			const blogs = await Blog.find({ author: req.user._id })
				.populate('author')
				.sort({ timestamps: 'desc' })
				.lean();
			const allusers = await User.find({});
			const likedBlogs = await Blog.find({
				_id: { $in: user.likedPosts },
			});
			return res.render('./useritems/dashboard', {
				user,
				allusers,
				posts: blogs,
				isAuthenticated: !!req.user,
				likedBlogs: likedBlogs,
			});
		} catch (error) {
			return res.redirect('/error');
		}
	} catch (error) {
		return res.redirect('/error');
	}
});

router.get('/follow/:id', auth, async (req, res) => {
	if (!req.user) return res.redirect('/log-in');

	User.findByIdAndUpdate(
		req.params.id,
		{
			$push: { followers: req.user._id },
		},
		{ new: true },
		(err) => {
			if (err) {
				return res.status(422).json({ error: err });
			}
			User.findByIdAndUpdate(
				req.user._id,
				{
					$push: { following: req.params.id },
				},
				{ new: true }
			)
				.select('-password')
				.then(() => res.redirect(`/author/${req.params.id}`))
				.catch((err) => res.status(422).json({ error: err }));
		}
	);
});

router.get('/unfollow/:id', auth, async (req, res) => {
	if (!req.user) return res.redirect('/log-in');

	User.findByIdAndUpdate(
		req.params.id,
		{
			$pull: { followers: req.user._id },
		},
		{ new: true },
		(err) => {
			if (err) {
				return res.status(422).json({ error: err });
			}
			User.findByIdAndUpdate(
				req.user._id,
				{
					$pull: { following: req.params.id },
				},
				{ new: true }
			)
				.select('-password')
				.then(() => res.redirect(`/author/${req.params.id}`))
				.catch((err) => res.status(422).json({ error: err }));
		}
	);
});

module.exports = router;
