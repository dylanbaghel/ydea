const mongoose = require('mongoose');

const IdeaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    details: {
        type: String,
        required: true
    },
    _creator: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});


const Idea = mongoose.model('Idea', IdeaSchema);

module.exports = { Idea };