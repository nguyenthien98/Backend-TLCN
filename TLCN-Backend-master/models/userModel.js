const mongoose = require('mongoose')
const Schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    password: {
        type: String,
        required: false,
    },
    fullname: {
        type: String,
        required: true,
    },
    identify: {
        type: String,
        default: '0',
    },
    address: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        trim: true, unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    googleProvider: {
        type: {
            id: String,
            token: String
        },
        select: false,
    },
    phone: {
        type: String,
        required: false,
    },
    totalProject: {
        type: Number,
        required: true,
    },
    statusAccount: {
        type: Number,
        required: true,
    },
    avatar: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    company: {
        type: String,
        ref: 'Company',
        required: true,
    },
    lock: {
        type: Boolean,
        required: true,
    },
    verify: {
        type: Boolean,
        required: true,
    },
    permission: {
        type: Boolean,
        required: true,
    },
    hash: {
        type: Number,
        required: false,
    }
})

// Export the model
module.exports = mongoose.model('User', Schema)