const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer")

const checkAuth = require('../middleware/checkAuth')
const libFunction = require('../lib/function')
const Company = require('../models/companyModel')
const User = require('../models/userModel')
const Project = require('../models/projectModel')

var transporter = nodemailer.createTransport({ // config mail server
    service: 'Gmail',
    auth: {
        user: 'myreales.company@gmail.com',
        pass: 'datdeptrai',
    }
})

const constant = require('../lib/constant')

router.post('/verifyemloyee', (req, res, next) => {
    const id = req.body.id
    const company = req.body.company
    const hash = req.body.hash
    User.updateOne({
        _id: id,
        hash: hash,
        company: company,
        verify: false,
    }, {
        verify: true,
    })
    .exec()
    .then(result => {
        if (result.nModified > 0) {
            res.status(200).json({
                status: 200,
                message: 'verify employee account success, please login',
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

router.post('/resetpassword', (req, res, next) => {
    const email = req.body.email
    User.find({
        email: email,
        verify: true,
        lock: false,
    })
    .exec()
    .then(user=>{
        if (user.length <= 0) {
            return res.status(404).json({
                status: 404,
                message: 'your account does not exists or has been locked',
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
                    var EmailEmployeeModel = require('../lib/emailEmployeeModel')
                    var emailModel = new EmailEmployeeModel()
                    emailModel.resetMail(email, pass)
                    User.updateOne({
                        email: email
                    }, {
                        password: hash,
                    })
                    .then(result => {
                        if (result.nModified > 0) {
                            transporter.sendMail(emailModel.mail, function (err, info) {
                                if (err) {
                                    console.log('send email error ' + err)
                                    res.status(500).json({
                                        status: 500,
                                        message: 'send email error',
                                        error: err,
                                    })
                                } else {
                                    res.status(200).json({
                                        status: 200,
                                        message: 'mail reset password has send, check your email to get new password',
                                        email: email,
                                    })
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

router.post('/changepassword', checkAuth, (req, res, next) => {
    User.find({
        email: req.userData.email,
        _id: req.userData.id,
        verify: true,
        lock: false,
    })
    .exec()
    .then(user => {
        if (user.length <= 0) {
            return res.status(401).json({
                status: 401,
                message: 'Account not found or has been locked',
            })
        }
        bcrypt.compare(req.body.currentPassword, user[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
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
                        User.updateOne({
                            email: req.userData.email,
                            _id: req.userData.id,
                        }, {
                            password: hash
                        })
                        .exec()
                        .then(result => {
                            if (result.nModified > 0) {
                                res.status(200).json({
                                    status: 200,
                                    message: 'Change password success',
                                    email: req.userData.email,
                                    _id: req.userData.id,
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

module.exports = router;