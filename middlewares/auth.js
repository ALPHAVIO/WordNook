const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

module.exports = (req, res, next) => {
	const { token } = req.cookies;

	// Check if there is a token
	if (!token) {
		return next();
	}

	// Check if it is valid
	jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
		if (err || !payload) {
			return next();
		}

		User.findById(payload._id, (err, user) => {
			if (err) {
				return res.status(422).json('Oops! something went wrong!');
			}

			if (!user) {
				return next();
			}

			req.user = {
				_id: user._id,
				name: user.userName,
			};

			next();
		});
	});
};
