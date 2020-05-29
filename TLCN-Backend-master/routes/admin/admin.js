const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer")

const host = require('../../config/host')
const libFunction = require('../../lib/function')
const constructorModel = require('../../lib/constructorModel')
const dataProcess = require('../../lib/dataProcess')
const checkAuthAdmin = require('../../middleware/checkAuthAdmin')
const Admin = require('../../models/adminModel')
const User = require('../../models/userModel')
const Project = require('../../models/projectModel')
const News = require('../../models/newsModel')
const Company = require('../../models/companyModel')

var transporter = nodemailer.createTransport({ // config mail server
    service: 'Gmail',
    auth: {
        user: 'myreales.company@gmail.com',
        pass: 'datdeptrai',
    }
})

router.post('/signup', checkAuthAdmin, (req, res, next) => {
    Admin.find({
        email: req.body.email,
    })
    .exec()
    .then(admin => {
        if (admin.length >= 1) {
            return res.status(409).json({
                status: 409,
                message: 'admin exists',
            })
        } else {
            const pass = libFunction.randomPassword(10)
            bcrypt.hash(pass, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        status: 500,
                        error: err,
                    })
                } else {
                    var admin = Admin({
                        _id: new mongoose.Types.ObjectId(),
                        password: hash,
                        fullname: req.body.fullname,
                        address: req.body.address,
                        email: req.body.email,
                        phone: req.body.phone,
                        createBy: req.adminData.id,
                        createTime: req.body.createTime,
                        avatar: req.body.avatar,
                        verify: false,
                        hash: 0,    
                    })
                    admin.hash = libFunction.hashString(admin._id.toString())
                    var link = host.hostAdmin + '/verify/' + admin._id + '/' + admin.hash
                    var EmailAdminModel = require('../../lib/emailAdminModel')
                    var emailModel = new EmailAdminModel()
                    emailModel.verifyMail(admin.email, link, pass)
                    admin
                    .save()
                    .then(result => {
                        transporter.sendMail(emailModel.mail, function (err, info) {
                            if (err) {
                                console.log('send email error ' + err)
                                res.status(500).json({
                                    status: 500,
                                    message: 'send email error',
                                    email: admin.email,
                                    error: err,
                                })
                            } else {
                                res.status(201).json({
                                    status: 201,
                                    message: 'admin created, check email to verify account',
                                    email: admin.email,
                                    info: info.response,
                                })
                            }
                        })
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({
                            status: 500,
                            error: err
                        })
                    })
                                    
                }
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            status: 500,
            error: err
        })
    })
})

router.post('/verify', (req, res, next) => {
    const id = req.body.id
    const hash = req.body.hash
    Admin.updateOne({
        _id: id,
        hash: hash,
        verify: false,
    }, {
        verify: true,
    })
    .exec()
    .then(result => {
        if (result.nModified > 0) {
            res.status(200).json({
                status: 200,
                message: 'verify admin success, please login again',
            })
        } else {
            res.status(404).json({
                status: 404,
                message: 'No valid entry found',
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            status: 500,
            error: err
        })
    })
})

router.post('/login', (req, res, next) => {
    Admin.find({
        email: req.body.email,
        verify: true,
    })
    .exec()
    .then(admin => {
        if (admin.length <= 0) {
            return res.status(401).json({
                status: 401,
                message: 'Auth failed email,'
            })
        }
        bcrypt.compare(req.body.password, admin[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    status: 401,
                    message: 'Auth failed password'
                })
            }
            if (result) {
                const token = jwt.sign({
                    id: admin[0]._id,
                    email: admin[0].email,
                    adminname: admin[0].adminname,
                    fullname: admin[0].fullname,
                    address: admin[0].address,
                    status: 'adminaccount',
                    }, 'HS256', {
                    expiresIn: "24h"
                })
                return res.status(200).json({
                    status: 200,
                    message: 'successful',
                    id: admin[0]._id,
                    email: admin[0].email,
                    adminname: admin[0].adminname,
                    fullname: admin[0].fullname,
                    address: admin[0].address,
                    phone: admin[0].phone,
                    avatar: admin[0].avatar,
                    token: token,
                })
            }
            return res.status(401).json({
                status: 401,
                message: 'Auth failed'
            })
        })
    })
    .catch(err => {
        console.log(err)
        return res.status(401).json({
            status: 401,
            message: 'Auth failed',
            error: err,
        })
    })
})

router.get('/:id', checkAuthAdmin, (req, res, next) => {
    const id = req.params.id
    Admin.findById(id)
    .exec()
    .then(result => {
        if (result !== null) {
            res.status(200).json({
                status: 200,
                admin: result,
            })
        } else {
            res.status(404).json({
                status: 404,
                message: 'No valid entry found',
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            status: 500,
            error: err,
        })
    })
})

router.post('/edit', checkAuthAdmin, (req, res, next) => {
    const id = req.adminData.id
    const fullname = req.body.fullname
    const address = req.body.address
    const email = req.body.email
    const phone = req.body.phone
    const createBy = req.body.createBy

    Admin.updateOne({
        _id: id,
        email:email,
        verify: true,
    }, {
        fullname: fullname,
        address: address,
        phone: phone,
    })
    .exec()
    .then(result => {
        if (result.nModified > 0) {
            res.status(200).json({
                status: 200,
                message: 'update admin success',
                admin: {
                    id: id,
                    fullname: fullname,
                    address: address,
                    email: email,
                    phone: phone,
                    createBy: createBy,
                },
                request: {
                    type: 'PATCH',
                }
            })
        } else {
            res.status(404).json({
                status: 404,
                message: 'No valid entry found',
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            status: 500,
            error: err,
        })
    })
})

router.post('/changepassword', checkAuthAdmin, (req, res, next) => {
    Admin.find({
        email: req.adminData.email,
        _id: req.adminData.id,
        verify: true,
    })
    .exec()
    .then(admin => {
        if (admin.length <= 0) {
            return res.status(401).json({
                status: 401,
                message: 'Account not found'
            })
        }
        bcrypt.compare(req.body.currentPassword, admin[0].password, (err, result) => {
            if (err) {
                return res.status(40).json({
                    status: 401,
                    message: 'Change password failed 1',
                })
            }
            if (result) {
                bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            status: 500,
                            error: err,
                        })
                    } else {
                        Admin.updateOne({
                            email: req.adminData.email,
                            _id: req.adminData.id,
                        }, {
                            password: hash
                        })
                        .exec()
                        .then(result => {
                            if (result.nModified > 0) {
                                res.status(200).json({
                                    status: 200,
                                    message: 'Change password success',
                                    email: req.adminData.email,
                                    _id: req.adminData.id,
                                })
                            } else {
                                res.status(404).json({
                                    status: 404,
                                    message: 'Change password failed 2'
                                })
                            }
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(500).json({
                                status: 500,
                                error: err,
                                message: 'Change password failed 3',
                            })
                        })     
                    }
                }) 
            } else {
                return res.status(401).json({
                    status: 401,
                    message: 'Change password failed 4',
                })
            }
        })
    })
    .catch(err => {
        console.log(err)
        return res.status(401).json({
            status: 401,
            error: err,
            message: 'Change password failed 5',
        })
    })
})

router.post('/changeavatar', checkAuthAdmin, (req, res, next) => {
    const id = req.adminData.id
    const avatar = req.body.avatar

    Admin.updateOne({
        _id: id,
        verify: true,
    }, {
        avatar: avatar,
    })
    .exec()
    .then(result => {
        if (result.nModified > 0) {
            res.status(200).json({
                status: 200,
                message: 'change avatar admin success',
                admin: {
                    id: id,
                    avatar: avatar
                },
            })
        } else {
            res.status(404).json({
                status: 404,
                message: 'No valid entry found'
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            status: 500,
            error: err
        })
    })
})

router.post('/statisticdata', checkAuthAdmin, (req, res, next) => {
    Promise.all([dataProcess.countAccount(), dataProcess.countProject(), dataProcess.countNews(), dataProcess.countCompany()])
    .then((arrayOfResults) => {
        const [account, project, news, company] = arrayOfResults
        res.status(200).json({
            status: 200,
            message: 'get data success',
            countAccount: account,
            countProject: project,
            countNews: news,
            countCompany: company,
        })
    })
    .catch(err => {
        res.status(500).json({
            status: 500,
            error: err
        })
    })
})

module.exports = router
