const mongoose = require('mongoose');

const { Schema } = mongoose;

// Setting up schema for the  Testimonial-
const testimonialSchema = {
        author:{
            type: String,
            required: true
        },
        views: {
            type: String,
            required: true,
        }

};

// Making a MongoDB model for the schema-
module.exports = mongoose.model('Testimonial', testimonialSchema);
