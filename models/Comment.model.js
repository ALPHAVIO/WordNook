const mongoose = require('mongoose');

const commentSchema = {
	content: String,
	name: String,
	authorId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	timestamps: {
		type: Date,
		default: Date.now,
	},
	flags: Array,
	replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
};
// Making a MongoDB model for the schema-
module.exports = mongoose.model('Comment', commentSchema);
