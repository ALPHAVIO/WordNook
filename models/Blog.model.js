const mongoose = require('mongoose');
const UserModel = require('./User.model');
const Schema  = mongoose.Schema;

//Setting up schema for the collection-
const blogSchema = new Schema({
    blogTitle: String,
    blogContent: String,
    comments: [{
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      content: String,
      timestamps:Number
    }],
    timestamps: {
      type: Date,
      default: Date.now
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  })

  //Making a MongoDB model for the schema-
  module.exports = mongoose.model("Blog", blogSchema);