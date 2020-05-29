var User = require('../models/userModel')
var mongoose = require('mongoose')

exports.upsertGoogleUser = function(accessToken, refreshToken, profile, cb) {
    User.findOne({
        email: profile.emails[0].value
    }, function(err, user) {
        // no user was found, lets create a new one
        if (!user) {
            var newUser = new User({
                _id: new mongoose.Types.ObjectId(),
                fullname: profile.displayName,
                identify: '',
                address: '',
                phone: '',
                description: '',
                email: profile.emails[0].value,
                googleProvider: {
                    id: profile.id,
                    token: accessToken
                },
                totalProject: 0,
                statusAccount: 1,
                avatar: profile._json['picture'],
                company: '0',
                lock: false,
                verify: true,
                permission: false,
                hash: 0,
            })

            newUser.save(function(error, savedUser) {
                if (error) {
                    console.log(error)
                }
                return cb(error, savedUser)
            })
        } else {
            return cb(err, user)
        }
    })
}