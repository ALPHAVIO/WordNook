const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const UserSchema = new Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	userName: {
		type: String,
		unique: true,
		required: true,
	},
	email: {
		type: String,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	photo: {
		type: String,
		default: '/images/Default_Profile.jpg',
	},
	followers: [{ type: ObjectId, ref: 'User' }],
	following: [{ type: ObjectId, ref: 'User' }],
	likedPosts: [{ type: ObjectId, ref: 'Blog' }],
	subscriptionStatus: {
		type: Boolean,
		default: false,
	},
});
// hash the password if it is modified
UserSchema.pre('save', async function (next) {
	const user = this;
	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});
module.exports = mongoose.model('User', UserSchema);
