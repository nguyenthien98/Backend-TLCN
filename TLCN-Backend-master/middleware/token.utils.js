var jwt = require("jsonwebtoken")
var createToken = function (auth) {
    return jwt.sign({
        id: auth.id,
        email: auth.email
    }, 'shhhhh',
        {
            expiresIn: "24h"
        })
}

module.exports = {
    generateToken: function (req, res, next) {
        req.token = createToken(req.auth)
        return next()
    },
    sendToken: function (req, res) {
        return res.status(200).json({
            status: 200,
            message: 'login google success',
            user: req.user,
            token: req.token,
        })
    }
}