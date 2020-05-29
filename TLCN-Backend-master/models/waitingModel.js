var mongoose = require('mongoose')
var Schema = mongoose.Schema

var waitingSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    project: {
        type: String,
        ref: 'Project',
        required: true,
    },
    requests: [{
        user: {
            type: String,
            ref: 'User',
            required: true,
        },
        createdTransaction: {
            type: Boolean,
            required: true,
        },
        createTime: {
            type: Number,
            required: true,
        },
        money: {
            type: Number,
            default: 0,
        },
        description: {
            type: String,
            default: 'info',
        },
    }]
})

// Export the model
module.exports = mongoose.model('Waiting', waitingSchema)
