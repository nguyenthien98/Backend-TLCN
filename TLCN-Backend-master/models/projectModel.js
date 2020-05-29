var mongoose = require('mongoose')
var Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
var projectSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    investor: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },
    area: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    type: {
        type: Number,
        required: true,
    },
    info: {
        type: String,
        required: true,
    },
    lat: {
        type: Number,
        required: true,
    },
    long: {
        type: Number,
        required: true,
    },
    ownerid: {
        type: String,
        required: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    statusProject: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
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
    allowComment: {
        type: Boolean,
        required: true,
    },
    codelist: [{
        code:  {
            type: String,
            required: true,
        },
        sold: {
            type: Boolean,
            required: true,
        },
    }],
    url: [{
        type: String,
        required: true,
    }],
    publicId: [{
        type: String,
        required: true,
    }],
})

// Export the mode
const  Project =  mongoose.model('Project', projectSchema)
module.exports = Project

