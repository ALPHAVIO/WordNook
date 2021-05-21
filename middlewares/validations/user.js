// eslint-disable-next-line
const express = require('express');
const User = require('../../models/User.model');

const emailRegx = new RegExp(
	/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);
const pwdRegex = new RegExp(
	/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
);
const firstAndLastNameRegex = new RegExp(/^[a-zA-Z]+$/);

function checkUsername(userName) {
	if (userName.length < 6 || userName.length > 12) {
		return 'Username is invalid!';
	}

	User.findOne({ userName }, (err, doc) => {
		if (doc) {
			return 'Username already taken!';
		}
	});
}

function checkFirstName(firstName) {
	if (!firstAndLastNameRegex.test(firstName.trim())) {
		return 'First name should only have alphabets';
	}
}

function checkLastName(lastName) {
	if (!firstAndLastNameRegex.test(lastName.trim())) {
		return 'Last name should only have alphabets';
	}
}

function checkEmail(email) {
	if (!emailRegx.test(email)) {
		return 'Email invalid!';
	}

	User.findOne({ email }, (err, doc) => {
		if (doc) {
			return 'Username already exists!';
		}
	});
}

function checkPassword(password) {
	if (!pwdRegex.test(password)) {
		return 'Your password must contain a minimum of 8 letter, with at least a symbol, upper and lower case letters and a number';
	}
}

module.exports.signupValidation = (req, res, next) => {
	// prettier-ignore
	const {
		firstName,
		lastName,
		userName,
		email,
		password,
		confirmPassword,
	} = req.body;

	let error;
	const data = {
		firstName: firstName || '',
		lastName: lastName || '',
		userName: userName || '',
		email: email || '',
		password: password || '',
		confirmPassword: confirmPassword || ' ',
	};

	// Check if all the fields are filled
	if (
		!firstName ||
		!lastName ||
		!userName ||
		!email ||
		!password ||
		!confirmPassword
	) {
		return res.status(422).render('./auth/signUp', {
			error: 'Please add all the fields!',
			data: data,
		});
	}

	// check first name last name
	error = checkFirstName(firstName);
	if (error) {
		return res
			.status(422)
			.render('./auth/signup', { error: error, data: data });
	}
	error = checkLastName(lastName);
	if (error) {
		return res
			.status(422)
			.render('./auth/signup', { error: error, data: data });
	}
	error = checkUsername(userName);
	if (error) {
		return res
			.status(422)
			.render('./auth/signup', { error: error, data: data });
	}
	error = checkEmail(email.toLowerCase());
	if (error) {
		return res
			.status(422)
			.render('./auth/signup', { error: error, data: data });
	}
	error = checkPassword(password);
	if (error) {
		return res
			.status(422)
			.render('./auth/signup', { error: error, data: data });
	}
	// check password == confirm password
	if (password !== confirmPassword) {
		return res.status(500).render('./auth/signUp', {
			error: 'Password does not match',
			data: data,
		});
	}

	return next();
};

module.exports.updateValidation = async (req, res, next) => {
	const { firstName, lastName, userName, email, password } = req.body;
	const userId = req.user._id;
	const user = await User.findById({ _id: userId });
	let error;
	let otherUser;

	error = checkFirstName(firstName);
	if (error) {
		return res.status(422).render('./useritems/read-profile', {
			user,
			isAuthenticated: !!req.user,
			error,
		});
	}
	error = checkLastName(lastName);
	if (error) {
		return res.status(422).render('./useritems/read-profile', {
			user,
			isAuthenticated: !!req.user,
			error,
		});
	}

	// check userName
	if (userName.length < 6 || userName.length > 12) {
		error = 'Username is invalid!';
	}

	otherUser = await User.findOne({ userName });

	if (otherUser) {
		if (otherUser._id.toString() !== userId.toString()) {
			error = 'Username already taken!';
		}
	}

	if (error) {
		return res.render('./useritems/read-profile', {
			user,
			isAuthenticated: !!req.user,
			error,
		});
	}

	// check email
	if (!emailRegx.test(email)) {
		error = 'Email invalid!';
	}

	otherUser = await User.findOne({ email: email.toLowerCase() });
	if (otherUser) {
		if (otherUser._id.toString() !== userId.toString()) {
			error = 'Email already registered with other account';
		}
	}
	if (error) {
		return res.render('./useritems/read-profile', {
			user,
			isAuthenticated: !!req.user,
			error,
		});
	}

	error = checkPassword(password);
	if (error) {
		return res.render('./useritems/read-profile', {
			user,
			isAuthenticated: !!req.user,
			error,
		});
	}

	return next();
};

module.exports.loginValidation = (req, res, next) => {
	const { email, password } = req.body;

	const data = {
		email: email || '',
		password: password || '',
	};

	if (!email || !password) {
		res.status(401).render('./auth/logIn', {
			error: 'Please add all the fields!',
			data: data,
		});
	}

	// check email

	if (!emailRegx.test(email)) {
		return res.status(422).render('./auth/loginIn', {
			error: 'Email invalid',
			data: data,
		});
	}

	// check password

	if (!emailRegx.test(email)) {
		return res.status(422).render('./auth/loginIn', {
			error: 'Password invalid',
			data: data,
		});
	}

	return next();
};
