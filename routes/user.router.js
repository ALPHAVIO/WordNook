// requiring dependencies, models and middlewares
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const auth = require('../middlewares/auth');
const {
    signupValidation,
    loginValidation,
} = require('../middlewares/validations/user.js');
const Blog = require('../models/Blog.model');
const nodemailer = require('nodemailer');

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

router.post('/read-profile', auth, async (req, res) => {
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

    try {
        const id = await req.user;
        const user = await User.findById(id._id);
        updates.forEach((update) => (user[update] = req.body[update]));
        await user.save();
        res.redirect('/');
    } catch (e) {
        res.status(500).send(e);
    }
});

// POST request for sign up
router.post('/sign-up', signupValidation, async (req, res) => {
    const {
        firstName,
        lastName,
        userName,
        email,
        password,
        confirmPassword,
    } = req.body;

    // Check if the username or email already taken
    User.findOne({ $or: [{ email }, { userName }] }, (err, doc) => {
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
            //This means that this is a valid new user
            req.body.status = 'Pending';
            req.body.confirmationCode = jwt.sign(
                { email: req.body.email },
                process.env.SECRET_KEY
            );
            const newUser = new User(req.body);

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
                } else {
                    //Sending the Confermation email
                    const transport = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: {
                            user: process.env.EMAIL,
                            pass: process.env.PASS,
                        },
                    });
                    transport
                        .sendMail({
                            from: process.env.EMAIL,
                            to: email,
                            subject: 'Please confirm your account',
                            html: `<h1>Email Confirmation</h1>
                            <h2>Hello ${userName}</h2>
                            <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
                            <a href=https://alphavio-daily-journal.herokuapp.com/confirm/${req.body.confirmationCode}> Click here</a>
                            </div>`,
                        })
                        .catch((err) => {
                            if (err) {
                                console.log(err);
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
                        });
                    return res.status(401).render('./auth/logIn', {
                        error: 'Pending Account. Please Verify Your Email',
                        data: {
                            email,
                            password,
                        },
                    });
                }
            });
        });
    });
});

//This route will recieve a get request when the user clicks on the confirmation link
router.get('/confirm/:confirmationCode', (req, res, next) => {
    //find the user with this confirmation code
    User.findOne({
        confirmationCode: req.params.confirmationCode,
    })
        .then((user) => {
            if (!user) {
                return res.status(404).send({ message: 'User Not found.' });
            }
            user.status = 'Active';
            const email = user.email;
            const password = '';
            user.save((err) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                } else {
                    return res.status(401).render('./auth/logIn', {
                        error: 'Account verified. Please Login Your Email',
                        data: {
                            email,
                            password,
                        },
                    });
                }
            });
        })
        .catch((e) => console.log('error : ', e));
});

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
        if (doc.status != 'Active') {
            return res.status(401).render('./auth/logIn', {
                error: 'Pending Account. Please Verify Your Email',
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
        (err, result) => {
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
                .then((result) => res.redirect(`/author/${req.params.id}`))
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
        (err, result) => {
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
                .then((result) => res.redirect(`/author/${req.params.id}`))
                .catch((err) => res.status(422).json({ error: err }));
        }
    );
});

module.exports = router;
