const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const path = require('path');
const handlebars = require('handlebars');
const fs = require('fs');
const dotenv = require('dotenv');
const moment = require('moment');
const User = require('../models/User.model');
const Blog = require('../models/Blog.model');

dotenv.config();

const oAuth2Client = new google.auth.OAuth2(
	process.env.CLIENT_ID,
	process.env.CLIENT_SECRET,
	process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({
	refresh_token: process.env.REFRESH_TOKEN,
});

const htmlFile = fs.readFileSync(
	path.join(path.resolve(), '/views/newsletter.html'),
	{ encoding: 'utf-8' },
	(err, html) => {
		if (err) console.log(err);
		return html;
	}
);

let subscribedUsers = [];

const getMailList = async () => {
	await User.find(
		{
			subscriptionStatus: true,
		},
		{ email: 1, _id: 0 }
		// eslint-disable-next-line no-return-assign
	).then((emails) => (subscribedUsers = emails.map((email) => email.email)));

	console.log(subscribedUsers);
};

const composeMessage = async () => {
	const {
		blogTitle,
		blogContent,
		category,
		author,
		timestamps,
		noOfViews,
		likes,
	} = await Blog.findOne({ status: 'Public' }).sort({ noOfViews: -1 });

	const { firstName, lastName } = await User.findById(author);
	// eslint-disable-next-line prettier/prettier
	const authorBlog = `${firstName  } ${  lastName}`;
	const timeOfPost = moment(new Date(timestamps)).format(
		'dddd, MMMM Do YYYY, h:mm:ss a'
	);
	const content = blogContent.slice(3, blogContent.length - 6);

	const blogData = {
		title: blogTitle,
		content,
		category,
		timestamps: timeOfPost,
		author: authorBlog,
		views: noOfViews,
		likes,
	};

	console.log(blogData);
	return blogData;
};

const sendNewsletter = async () => {
	const noOfBlogs = await Blog.find().count();
	if (noOfBlogs) {
		try {
			getMailList();
			const blogData = await composeMessage();
			const template = handlebars.compile(htmlFile);
			const htmlToSend = template(blogData);

			const accessToken = await oAuth2Client.getAccessToken();

			const transport = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					type: 'OAUTH2',
					user: 'alphavio16@gmail.com',
					clientId: process.env.CLIENT_ID,
					clientSecret: process.env.CLIENT_SECRET,
					refreshToken: process.env.REFRESH_TOKEN,
					accessToken: accessToken,
				},
			});

			const mailOptions = {
				from: 'ALPHAVIO <alphavio16@gmail.com',
				to: subscribedUsers,
				subject: 'WordNook Newsletter',
				html: htmlToSend,
			};

			const result = await transport.sendMail(mailOptions);

			return result;
		} catch (error) {
			return error;
		}
	} else {
		console.log('No blogs found!!');
	}
};

module.exports = sendNewsletter;
