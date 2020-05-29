const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const decoded = jwt.verify(token, 'shhhhh')
        // console.log(decoded)
        req.companyData = decoded
        next()
    } catch (error) {
        return res.status(401).json({
            status: 401,
            message: 'token failed'
        })
    }
}
