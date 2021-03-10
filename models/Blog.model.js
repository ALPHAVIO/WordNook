const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Setting up schema for the collection-
const blogSchema = {
    blogTitle: String,
    blogContent: String,
    comments: Array,
    timestamps: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}

//Making a MongoDB model for the schema-
const Blog = new mongoose.model("Blog", blogSchema);

//Export the model
module.exports = Blog