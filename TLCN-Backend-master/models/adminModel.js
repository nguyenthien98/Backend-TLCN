const mongoose = require('mongoose')
const Schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: false,
    },
    verify: {
        type: Boolean,
        required: true,
    },
    createBy: {
        type: String,
        required: true,
    },
    createTime: {
        type: Number,
        required: true,
    },
    hash: {
        type: Number,
        required: true,
    },
})

// Export the model
module.exports = mongoose.model('Admin', Schema)