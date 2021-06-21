const mongoose = require('mongoose');

// eslint-disable-next-line
const { Schema } = mongoose;

// Setting up schema for the collection-
const testimonialSchema = {
	author: String,
	views: String,
};

// Making a MongoDB model for the schema-
module.exports = mongoose.model('Testimonial', testimonialSchema);
