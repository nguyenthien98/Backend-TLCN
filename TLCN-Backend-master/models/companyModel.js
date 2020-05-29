const mongoose = require('mongoose')
const Schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    password: {
        type: String,
        required: false,
    },
    companyname: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        trim: true, unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    phone: {
        type: String,
        required: false,
    },
    website: {
        type: String,
        required: true,
    },
    totalProject: {
        type: Number,
        required: true,
    },
    employees: [{
        employee: {
            type: String,
            ref: 'User',
            required: true,
        },
        createTime: {
            type: Number,
            required: true,
        },
    }],
    status: {
        type: Number,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    lock: {
        type: Boolean,
        required: true,
    },
    createTime: {
        type: Number,
        required: true,
    },
    updateTime: {
        type: Number,
        required: true,
    },
    verify: {
        type: Boolean,
        required: true,
    },
    hash: {
        type: Number,
        required: true,
    },
    createBy: {
        type: String,
        required: true,
    }
})

// Export the model
module.exports = mongoose.model('Company', Schema)