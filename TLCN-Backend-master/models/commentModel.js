const mongoose = require('mongoose')
const Schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: String,
        required: true,
        ref: 'User',
    },
    projectid: {
        type: String,
        required: true,
    },
    createTime: {
        type: Number,
        requireed: true,
    },
    updateTime: {
        type: Number,
        requireed: true,
    },
    content: {
        type: String,
        required: true
    },
    star: {
        type: Number,
        required: true
    }, 
})

// Export the model
module.exports = mongoose.model('Comment', Schema)