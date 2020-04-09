let mongoose = require('mongoose');

// Article Schema
let aritcleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    Author: {
        type: String,
        required: false
    } 
});

let Article = module.exports = mongoose.model('Article',aritcleSchema);