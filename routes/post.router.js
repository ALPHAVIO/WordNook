// requiring dependencies, models and middlewares
const express = require('express');
// eslint-disable-next-line
const _ = require('lodash');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const auth = require('../middlewares/auth');
const Blog = require('../models/Blog.model');
const UserModel = require('../models/User.model');

const router = express.Router();
router.use(methodOverride('_method'));
router.use(bodyParser.json());

const homeStartingContent =
	"I'm WordNook, your best pal. What do I do? Well, I'm here to help you out. I'll be there to listen to your thoughts or share with you my pal's ideas and few amazing blogs.That's all? Not yet. I'm here to take you on a wonderful journey of unlimited thoughts and help you find your twin souls too!!! Sounds great? Here we go....Let's get started.";

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

// Get request for posts page-
router.get(
	[
		'/posts/:postId',
		'/page/posts/:postId',
		'/page/:page/posts/:postId',
		'/search/:query/posts/:postId',
		'/search/:query/:page/posts/:postId',
	],
	auth,
	async (req, res) => {
		const { user } = req;
		let isAuthor = false;
		const requestedPostId = req.params.postId;
		Blog.findOne({ _id: requestedPostId }, async (err, post) => {
			if (!err) {
				// Check if the user and author of this post are same
				if (
					user &&
					JSON.stringify(user._id) === JSON.stringify(post.author)
				) {
					isAuthor = true;
				}

				if (
					post.status === 'Public' ||
					(user && post.author._id.toString() === user._id.toString())
				) {
					// increment no. of views of the post.
					post.noOfViews++;
					post.save();
					// Sort the comments to show the recent one
					post.comments = post.comments.sort((a, b) =>
						a.timestamps > b.timestamps
							? -1
							: a.timestamps < b.timestamps
							? 1
							: 0
					);
					// console.log(post.status);
					const author = await UserModel.findById(post.author);
					let isLiked = false;
					let currUser;
					if (user) {
						currUser = await UserModel.findById(user._id);
						isLiked = !!currUser.likedPosts.includes(
							req.params.postId
						);
					}
					res.render('./postitems/post', {
						title: post.blogTitle,
						content: post.blogContent,
						id: post._id,
						photo: post.photo,
						comments: post.comments,
						category: post.category,
						likesCount: post.likes,
						noOfViews: post.noOfViews,
						author,
						timestamps: post.timestamps,
						isAuthor,
						isAuthenticated: !!user,
						currentUser: currUser,
						isLiked: isLiked,
					});
				} else {
					return res.redirect('/');
				}
			} else {
				console.log(err);
			}
		});
	}
);

// Post request to create a comment
router.post('/posts/:postId/comment', auth, async (req, res) => {
	try {
		const loggedUser = req.user;
		const { content } = req.body;
		// check if the user is authenticated
		if (!loggedUser) {
			return res.status(401).redirect(`${req.baseUrl}/sign-up`);
		}
		// Server side form validation
		if (content === '') {
			res.redirect(`/posts/${req.params.postId}`);
		} else {
			const doc = await Blog.findOne({ _id: req.params.postId });
			doc.comments.push({
				name: loggedUser.name,
				authorId: loggedUser._id,
				content: content,
				timestamps: Math.floor(Date.now() / 1000),
				flags: [],
			});

			await Blog.updateOne(
				{ _id: req.params.postId },
				{ comments: doc.comments }
			);
			res.redirect(`/posts/${req.params.postId}`);
		}
	} catch (err) {
		if (err) console.log(err);
		return res.redirect('back');
	}
});

// Delete comment Route
router.post('/posts/:postId/comments/:commentNum', auth, async (req, res) => {
	const isUser = !!req.user;
	const requestedPostId = req.params.postId;
	const { commentNum } = req.params;
	if (!isUser) {
		// checking if user is authenticated
		return res.status(401).redirect(`${req.baseUrl}/sign-up`);
	}
	const foundPost = await Blog.findOne({ _id: requestedPostId });
	foundPost.comments = foundPost.comments.sort((a, b) =>
		a.timestamps > b.timestamps ? -1 : a.timestamps < b.timestamps ? 1 : 0
	);
	if (
		foundPost.comments[commentNum].authorId.toString() ===
		req.user._id.toString()
	) {
		foundPost.comments.splice(commentNum, 1);
		await Blog.updateOne(
			{ _id: requestedPostId },
			{ comments: foundPost.comments },
			(err) => {
				if (err) console.log(err);
			}
		);
		res.redirect(`/posts/${requestedPostId}`);
	} else {
		res.render('404', { isAuthenticated: isUser });
	}
});

router.post(
	'/posts/:postId/comments/:commentNum/flag',
	auth,
	async (req, res) => {
		const isUser = !!req.user;
		const requestedPostId = req.params.postId;
		const { commentNum } = req.params;
		if (!isUser) {
			// checking if user is authenticated
			return res.status(401).redirect(`${req.baseUrl}/sign-up`);
		}
		const foundPost = await Blog.findOne({ _id: requestedPostId });
		foundPost.comments = foundPost.comments.sort((a, b) =>
			a.timestamps > b.timestamps
				? -1
				: a.timestamps < b.timestamps
				? 1
				: 0
		);
		const currUser = await UserModel.findById({ _id: req.user._id });
		if (foundPost.comments[commentNum].flags.includes(currUser.userName)) {
			// This user have already flagged this comment
			return res.redirect(`/posts/${requestedPostId}`);
		}
		foundPost.comments[commentNum].flags.push(currUser.userName);
		// If number of flags is greater than or equal to 3 delete that comment
		if (foundPost.comments[commentNum].flags.length >= 3) {
			foundPost.comments.splice(commentNum, 1);
		}
		await Blog.updateOne(
			{ _id: requestedPostId },
			{ comments: foundPost.comments },
			(err) => {
				if (err) console.log(err);
			}
		);
		res.redirect(`/posts/${requestedPostId}`);
	}
);

// Post request to search by title
router.post(['/search'], auth, async (req, res) => {
	const query = req.body.query || req.params.query;
	const perPage = 5;
	const currentPage = req.params.page || 1;

	Blog.find({
		blogTitle: { $regex: query, $options: 'i' },
		status: 'Public',
	})
		.skip(perPage * currentPage - perPage)
		.sort({ timestamps: 'desc' })
		.populate('author')
		.limit(perPage)
		.exec((err, posts) => {
			Blog.countDocuments(
				{ blogTitle: { $regex: query, $options: 'i' } },
				(err, count) => {
					res.render('./navitems/home', {
						homeStartingContent: homeStartingContent,
						posts: posts,
						current: currentPage,
						categories,
						pages: Math.ceil(count / perPage),
						search: query,
						perPage: perPage,
						order: 'new one first',
						isAuthenticated: !!req.user,
					});
				}
			);
		});
});

// GET request for search to support pagination
router.get(
	[
		'/search/:query/:page',
		'/search/:query',
		'/search/:query/:page/:perPage',
		'/search/:query',
	],
	auth,
	async (req, res) => {
		const { query } = req.params;
		let perPage = parseInt(req.params.perPage) || 5;
		if (req.query.perPage > 0) perPage = parseInt(req.query.perPage);
		const order = req.query.order || 'new one first';
		const currentPage = req.params.page || 1;

		Blog.find({
			blogTitle: { $regex: query, $options: 'i' },
			status: 'Public',
		})
			.populate('author')
			.sort({ timestamps: order === 'new one first' ? 'desc' : 'asc' })
			.skip(perPage * currentPage - perPage)
			.limit(perPage)
			.exec((err, posts) => {
				Blog.countDocuments(
					{ blogTitle: { $regex: query, $options: 'i' } },
					(err, count) => {
						res.render('./navitems/home', {
							homeStartingContent: homeStartingContent,
							posts: posts,
							current: currentPage,
							pages: Math.ceil(count / perPage),
							search: query,
							perPage: perPage,
							order: order,
							isAuthenticated: !!req.user,
						});
					}
				);
			});
	}
);

// delete post route
router.post('/posts/:postId/delete', auth, async (req, res) => {
	const { user } = req;
	if (!user) {
		return res.status(401).redirect('/log-in');
	}

	const requestedPostId = req.params.postId;
	// console.log(requestedPostId)
	Blog.deleteOne({ _id: requestedPostId, author: user._id })
		.then(() => {
			res.redirect('/');
		})
		.catch((error) => {
			res.status(400).json({
				error: error,
			});
		});
});

router.post('/category', auth, async (req, res) => {
	const { category } = req.body;
	if (!category) {
		res.redirect('/');
	}
	const posts = await Blog.find({ category, status: 'Public' }).populate(
		'author'
	);
	res.render('./postitems/category', {
		category,
		posts,
		isAuthenticated: !!req.user,
	});
});

// Edit Post route
router.get('/posts/:id/edit', auth, async (req, res) => {
	Blog.findById(req.params.id, (err, fndBlog) => {
		if (err) {
			console.log(err);
		} else {
			res.render('./postitems/edit', {
				blog: fndBlog,
				categories,
				isAuthenticated: !!req.user,
			});
		}
	});
});

// Like functionality routes
router.put('/posts/:id/like', auth, async (req, res) => {
	const { user } = req;
	if (!user) {
		return res.redirect('/log-in');
	}
	const foundBlog = await Blog.findById({ _id: req.params.id });

	if (foundBlog == null) {
		return res.sendStatus(404);
	}
	const currUser = await UserModel.findById({ _id: req.user._id });
	currUser.likedPosts.push(foundBlog._id);
	foundBlog.likes++;
	foundBlog.save();
	currUser.save();
	res.redirect(`/posts/${req.params.id}`);
});
router.put('/posts/:id/dislike', auth, async (req, res) => {
	const foundBlog = await Blog.findById({ _id: req.params.id });

	if (foundBlog == null) {
		return res.sendStatus(404);
	}
	if (!req.user) {
		return res.redirect('/log-in');
	}
	const currUser = await UserModel.findById({ _id: req.user._id });
	const index = currUser.likedPosts.indexOf(foundBlog._id);
	currUser.likedPosts.splice(index, 1);
	foundBlog.likes--;
	foundBlog.save();
	currUser.save();
	res.redirect(`/posts/${req.params.id}`);
});

module.exports = router;
