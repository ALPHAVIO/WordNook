const mongoose = require('mongoose');

// eslint-disable-next-line
const { Schema } = mongoose;

// Setting up schema for the collection-
const blogSchema = {
	blogTitle: String,
	blogContent: String,
	category: String,
	status: String,
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
	photo: {
		type: String,
	},
	timestamps: {
		type: Date,
		default: Date.now,
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	noOfViews: {
		type: Number,
		default: 0,
	},

	likes: {
		type: Number,
		default: 0,
	},
};

// Making a MongoDB model for the schema-
module.exports = mongoose.model('Blog', blogSchema);
