const mongoose = require('mongoose')
const Schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    seller: {
        type: String,
        ref: 'User',
        default: '0',
    },
    buyer: {
        type: String,
        ref: 'User',
        default: '0',
    },
    transactionid: {
        type: String,
        ref: 'Transaction',
        default: '0',
    },
    deal: {
        total: {
            type: Number,
            default: 0,
        },
        deposit: {
            type: Number,
            default: 0,
        },
        typeofpay: {
            type: Number,
            default: 0,
        },
        datedeal: {
            type: Number,
            default: 0,
        },
        description: {
            type: String,
            default: '0',
        },
        complete: {
            type: Boolean,
            default: false,
        },
    },
    legality: {
        government: [{
            url: String,
            id: String,
        }],
        certificate: [{
            url: String,
            id: String,
        }],
        contract: [{
            url: String,
            id: String,
        }],
        complete: {
            type: Boolean,
            default: false,
        },
    },
    deposit: {
        detail: [{
            ratio: Number,
            description: String,
            createTime: Number
        }],
        rest: {
            type: String,
            default: 'Chua thanh toan',
        },
        complete: {
            type: Boolean,
            default: false,
        },
    },
    contract: {
        datesign: {
            type: Number,
            default: 0,
        },
        number: {
            type: String,
            default: '0',
        },
        image: [{
            url: String,
            id: String,
        }],
        complete: {
            type: Boolean,
            default: false,
        },
    },
    confirmation: {
        image: [{
            url: String,
            id: String,
        }],
        complete: {
            type: Boolean,
            default: false,
        },
    },
    tax: {
        seller: {
            datepay: {
                type: Number,
                default: 0,
            },
            place: {
                type: String,
                default: '0',
            },
            amountmoney: {
                type: Number,
                default: 0,
            },
        },
        buyer: {
            datepay: {
                type: Number,
                default: 0,
            },
            place: {
                type: String,
                default: '0',
            },
            amountmoney: {
                type: Number,
                default: 0,
            },
        },
        complete: {
            type: Boolean,
            default: false,
        },
    },
    delivery: {
        datecomplete: {
            type: Number,
            default: 0,
        },
        apartmentcode: {
            type: String,
            default: 0,
        },
        room: {
            type: Number,
            default: 0,
        },
        datein:  {
            type: Number,
            default: 0,
        },
        tax: {
            type: Number,
            default: 0,
        },
        complete: {
            type: Boolean,
            default: false,
        },
    },
    transfer: {
        image: [{
            url: String,
            id: String,
        }],
        complete: {
            type: Boolean,
            default: false,
        },
    },
})

// Export the model
module.exports = mongoose.model('SellDetail', Schema)