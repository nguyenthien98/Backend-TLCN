var mongoose = require('mongoose')
var Schema = mongoose.Schema

var savedProjectSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userid: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true,
    },
    projects: [{
        project: {
            type: String,
            ref: 'Project',
            required: true,
        },
        createTime: {
            type: Number,
            required: true,
        },
    }]
    
})

// Export the model
module.exports = mongoose.model('SavedProject', savedProjectSchema)
