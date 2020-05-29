const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer")

const host = require('../../config/host')
const checkAuthAdmin = require('../../middleware/checkAuthAdmin')
const libFunction = require('../../lib/function')
const constructorModel = require('../../lib/constructorModel')
const Company = require('../../models/companyModel')
const User = require('../../models/userModel')
const Project = require('../../models/projectModel')
const Comment = require('../../models/commentModel')

const constant = require('../../lib/constant')

var transporter = nodemailer.createTransport({ // config mail server
    service: 'Gmail',
    auth: {
        user: 'myreales.company@gmail.com',
        pass: 'datdeptrai',
    }
})

router.get('/all/:page', checkAuthAdmin, (req, res, next) => {
    const page = parseInt(req.params.page) - 1
    Company.find().sort({'createTime': -1}).skip(page*constant.numItem).limit(constant.numItem)
    .select()
    .exec()
    .then(results => {
        if (results.length > 0) {
            res.status(200).json({
                status: 200,
                count: results.length,
                page: page + 1,
                company: results,
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

router.get('/:id', checkAuthAdmin, (req, res, next) => {
    const id = req.params.id;
    Company.findById(id)
    .exec()
    .then(result => {
        if (result !== null) {
            res.status(200).json({
                status: 200,
                company: result,
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

router.post('/', checkAuthAdmin, (req, res, next) => {
    Company.find({
        email: req.body.email,
    })
    .exec()
    .then(result => {
        if (result.length >= 1) {
            return res.status(409).json({
                status: 409,
                message: 'company exists',
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
                    console.log(pass)
                    var company = constructorModel.constructorCompany(hash, req.body.companyname, req.body.address, req.body.email, req.body.phone, req.body.website, 0,
                        req.body.avatar, req.body.description, req.body.createTime, req.adminData.id)
                    company.hash = libFunction.hashString(company._id.toString())
                    var link = host.hostWeb + '/verifycompany/' + company._id + '/' + company.hash;
                    var EmailCompanyModel = require('../../lib/emailCompanyModel')
                    var emailModel = new EmailCompanyModel()
                    emailModel.verifyMail(company.email, link, pass)
                    company
                    .save()
                    .then(result => {
                        transporter.sendMail(emailModel.mail, function (err, info) {
                            if (err) {
                                console.log('send email error ' + err)
                                res.status(500).json({
                                    status: 500,
                                    message: 'send email error',
                                    email: company.email,
                                    error: err,
                                })
                            } else {
                                res.status(201).json({
                                    status: 201,
                                    message: 'company created, check email to verify account',
                                    email: company.email,
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

router.post('/edit/:id', checkAuthAdmin, (req, res, next) => {
    const id = req.params.id;
    const companyname = req.body.companyname;
    const address = req.body.address;
    const email = req.body.email;
    const phone = req.body.phone;
    const website = req.body.website;
    const totalProject = req.body.totalProject;
    const status = req.body.status;
    const description = req.body.description;
    const createTime = req.body.createTime;
    const updateTime= req.body.updateTime;
    Company.updateOne({
        _id: id,
        email: email,
    }, {
        companyname: companyname,
        address: address,
        phone: phone,
        website: website,
        status: status,
        description: description,
        updateTime: updateTime,
    })
    .exec()
    .then(result => {
        if (result.nModified > 0) {
            res.status(200).json({
                status: 200,
                message: 'update company success',
                company: {
                    _id: id,
                    companyname: companyname,
                    address: address,
                    phone: phone,
                    website: website,
                    totalProject: totalProject,
                    status: status,
                    description: description,
                    createTime: createTime,
                    updateTime: updateTime,
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

router.delete('/:id', checkAuthAdmin, (req, res, next) => {
    Company.deleteOne({
        _id: req.params.id,
    })
    .exec()
    .then(result => {
        if(result.n > 0) {
            res.status(200).json({
                status: 200,
                message: 'company deleted',
                result: result
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

router.post('/changeLock/:id', checkAuthAdmin, (req, res, next) => {
    Company.updateOne({
        _id: req.params.id,
    }, {
        lock: req.body.lock,
    })
    .exec()
    .then(result => {
        if (result.nModified > 0) {
            res.status(200).json({
                status: 200,
                message: 'change account state success',
                lock: req.body.lock,
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

module.exports = router
