const mongoose = require('mongoose')
const Schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    active: {
        type: Boolean,
        required: true,
    },
    verify: {
        type: Boolean,
        required: true,
    },
    step: {
        type: Number,
        required: true,
    },
    typeproject: {
        type: Number,
        required: true,
    },
    typetransaction: {
        type: Number,
        required: true,
    },
    status: {  //1 la in process, 2 la complete and wait verify, 3 la da verify, 4 la expire
        type: Number,
        required: true,
    },
    project: {
        type: String,
        ref: 'Project',
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    seller: {
        type: String,
        ref: 'User',
        required: true,
    },
    buyer: {
        type: String,
        ref: 'User',
        required: true,
    },
    company: {
        type: String,
        ref: 'Company',
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
    selldetail: {
        type: String,
        ref: 'SellDetail',
        required: true,
    },
    rentdetail: {
        type: String,
        ref: 'RentDetail',
        required: true,
    },
})

// Export the model
module.exports = mongoose.model('Transaction', Schema)