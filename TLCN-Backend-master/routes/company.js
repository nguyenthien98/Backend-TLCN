const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer")

const host = require('../config/host')
const checkAuthCompany = require('../middleware/checkAuthCompany')
const dataProcess = require('../lib/dataProcess')
const libFunction = require('../lib/function')
const Company = require('../models/companyModel')
const User = require('../models/userModel')
const Project = require('../models/projectModel')
const Comment = require('../models/commentModel')
const Waiting = require('../models/waitingModel')

const Transaction = require('../models/transactionModel')
const SellDetail = require('../models/selldetailModel')
const RentDetail = require('../models/rentdetailModel')

var transporter = nodemailer.createTransport({ // config mail server
    service: 'Gmail',
    auth: {
        user: 'myreales.company@gmail.com',
        pass: 'datdeptrai',
    }
})

const constant = require('../lib/constant')

router.post('/verifycompany', (req, res, next) => {
    const id = req.body.id
    const hash = req.body.hash
    Company.updateOne({
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
                message: 'verify company account success, please login',
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
    Company.find({
        email: email,
        verify: true,
        lock: false,
    })
    .exec()
    .then(company=>{
        if (company.length <= 0) {
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
                    var EmailCompanyModel = require('../lib/emailCompanyModel')
                    var emailModel = new EmailCompanyModel()
                    emailModel.resetMail(email, pass)
                    Company.updateOne({
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

router.post('/changepassword', checkAuthCompany, (req, res, next) => {
    Company.find({
        email: req.companyData.email,
        _id: req.companyData.id,
        verify: true,
        lock: false,
    })
    .exec()
    .then(company => {
        if (company.length <= 0) {
            return res.status(401).json({
                status: 401,
                message: 'Account not found or has been locked',
            })
        }
        bcrypt.compare(req.body.currentPassword, company[0].password, (err, result) => {
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
                        Company.updateOne({
                            email: req.companyData.email,
                            _id: req.companyData.id,
                        }, {
                            password: hash
                        })
                        .exec()
                        .then(result => {
                            if (result.nModified > 0) {
                                res.status(200).json({
                                    status: 200,
                                    message: 'Change password success',
                                    email: req.companyData.email,
                                    _id: req.companyData.id,
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

router.post('/login', (req, res, next) => {
    Company.find({
        email: req.body.email,
        verify: true,
    })
    .exec()
    .then(company => {
        if (company.length <= 0) {
            return res.status(401).json({
                status: 401,
                message: 'Auth failed email,'
            })
        }
        bcrypt.compare(req.body.password, company[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    status: 401,
                    message: 'Auth failed password'
                })
            }
            if (result) {
                const token = jwt.sign({
                    id: company[0]._id,
                    email: company[0].email,
                    companyname: company[0].companyname,
                    address: company[0].address,
                    phone: company[0].phone,
                    totalProject: company[0].totalProject,
                    employess: company[0].employess,
                    status: company[0].status,
                }, 'shhhhh', {
                        expiresIn: "5h"
                    })

                if(company[0].lock === true) {
                    return res.status(500).json({
                        status: 500,
                        message: 'this account company has been locked',
                    })
                } else {
                    return res.status(200).json({
                        status: 200,
                        message: 'successful',
                        id: company[0]._id,
                        email: company[0].email,
                        companyname: company[0].companyname,
                        address: company[0].address,
                        totalProject: company[0].totalProject,
                        status: company[0].status,
                        avatar: company[0].avatar,
                        employess: company[0].employess,
                        description: company[0].description,
                        createTime: company[0].createTime,
                        updateTime: company[0].updateTime,
                        verify: company[0].verify,
                        token: token,
                    })
                }
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
            error: err
        })
    })
})

router.get('/all/:page', (req, res, next) => {
    const page = parseInt(req.params.page) - 1
    Company.find({
        verify: true,
        lock: false,
    }).sort({'createTime': -1}).skip(page*constant.numItem).limit(constant.numItem)
    .select('_id companyname address email phone website totalProject status avatar description createTime updateTime createBy lock verify hash employees __v')
    .exec()
    .then(result => {
        dataProcess.countCompany()
        .then(countCompany=> {
            res.status(200).json({
                status: 200,
                message: 'successful',
                page: page + 1,
                count: countCompany,
                result: result,
            })
        })
          
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            status: 500,
            error: err
        })
    })
})

router.get('/info/:id', (req, res, next) => {
    const id = req.params.id
    Company.findOne({
        _id: id,
        verify: true,
    })
    .select('_id companyname address email phone website totalProject status avatar description createTime updateTime createBy lock verify hash employees __v')
    .populate({
        path: 'employees.employee'
    })
    .exec()
    .then(result => {
        if(result.lock === true) {
            return res.status(500).json({
                status: 500,
                message: 'this account company has been locked',
            })
        } else {
            res.status(200).json({
                status: 200,
                message: 'successful',
                company: result,
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

router.get('/infoprivate', checkAuthCompany, (req, res, next) => {
    const id = req.companyData.id
    Company.findById(id)
    .select('_id companyname address email phone website totalProject status avatar description createTime updateTime createBy lock verify hash employees __v')
    .populate({
        path: 'employees.employee'
    })
    .exec()
    .then(result => {
        if(result.lock === true) {
            return res.status(500).json({
                status: 500,
                message: 'this account company has been locked',
            })
        } else {
            res.status(200).json({
                status: 200,
                message: 'successful',
                company: result,
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

router.post('/edit', checkAuthCompany, (req, res, next) => {
    const id = req.companyData.id
    const email = req.companyData.email
    const companyname = req.body.companyname
    const address = req.body.address
    const phone = req.body.phone
    const website = req.body.website
    const status = req.body.status
    const avatar = req.body.avatar
    const description = req.body.description
    const updateTime = req.body.updateTime
    Company.updateOne({
        _id: id,
        email: email,
        verify: true,
        lock: false,
    }, {
        companyname: companyname,
        address: address,
        phone: phone,
        website: website,
        status: status,
        avatar: avatar,
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
                    email: email,
                    companyname: companyname,
                    address: address,
                    phone: phone,
                    status: status,
                    avatar: avatar,
                    description: description,
                    updateTime: updateTime,
                },
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

router.get('/infoemployee/:id/:page', checkAuthCompany, (req, res, next) => {
    const id = req.companyData.id
    const employeeid = req.params.id
    const page = parseInt(req.params.page) - 1
    User.find({
        _id: employeeid,
        company: id,
    })
    .exec()
    .then(result => {
        Project.find({
            ownerid: employeeid,
        }).sort({ 'createTime': -1 }).skip(page*constant.numItem).limit(constant.numItem)
        .select()
        .exec()
        .then(results => {
            res.status(200).json({
                status: 200,
                message: 'successful',
                page: page + 1,
                info: result[0],
                projects: results,
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                status: 500,
                error: err
            })
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            status: 500,
            error: err
        })
    })
})

router.post('/addemployee', checkAuthCompany, (req, res, next) => {
    User.find({
        email: req.body.email,
    })
    .exec()
    .then(user => {
        if (user.length >= 1) {
            return res.status(409).json({
                status: 409,
                message: 'user exists',
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
                    const user = User({
                        _id: new mongoose.Types.ObjectId(),
                        password: hash,
                        fullname: req.body.fullname,
                        identify: req.body.identify,
                        address: req.body.address,
                        phone: req.body.phone,
                        description: req.body.description,
                        email: req.body.email,
                        totalProject: 0,
                        statusAccount: 2,
                        avatar: req.body.avatar,
                        company: req.companyData.id,
                        lock: false,
                        verify: false,
                        permission: false,
                        hash: 0,

                    })
                    const employeeTemp = {
                        employee: user._id,
                        createTime: req.body.createTime
                    }
                    user.hash = libFunction.hashString(user._id.toString())
                    var link = host.hostWeb + '/verifyemployee/' + user.company + '/' + user._id + '/' + user.hash
                    var EmailEmployeeModel = require('../lib/emailEmployeeModel')
                    var emailModel = new EmailEmployeeModel()
                    emailModel.verifyMail(user.email, link, pass)
                    user
                    .save()
                    .then(result => {
                        Company.findOneAndUpdate({ _id: req.companyData.id }, { $push: { employees: employeeTemp }})
                        .exec()
                        .then(resultUpdate => {
                            transporter.sendMail(emailModel.mail, function (err, info) {
                                if (err) {
                                    console.log('send email error ' + err)
                                    res.status(500).json({
                                        status: 500,
                                        message: 'send email error',
                                        employee: user,
                                        error: err,
                                    })
                                } else {
                                    res.status(201).json({
                                        status: 201,
                                        message: 'employee created in company',
                                        employee: user,
                                        info: info.response,
                                    })
                                }
                            })
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(500).json({
                                status: 500,
                                message: 'Update Company Error',
                                error: err
                            })
                        })
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({
                            status: 500,
                            message: 'Insert User Error',
                            error: err
                        })
                    })
                }
            })
        }
    })
})


router.post('/editemployee', checkAuthCompany, (req, res, next) => {
    const id = req.body.id
    const email= req.body.email
    const fullname = req.body.fullname
    const identify = req.body.identify
    const address = req.body.address
    const phone = req.body.phone
    const statusAccount = req.body.statusAccount
    const avatar = req.body.avatar
    const description = req.body.description
    User.updateOne({
        _id: id,
    },{
        email: email,
        fullname: fullname,
        identify: identify,
        address: address,
        phone: phone,
        statusAccount: statusAccount,
        avatar: avatar,
        description: description,
    })
    .exec()
    .then(result => {
        if(result.nModified > 0){
            res.status(200).json({
                status:200,
                message:'update employee success',
            })
        } else {
            res.status(404).json({
                status: 404,
                message:'No valid entry found',
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            status: 500,
            message: 'Edit Employee Error',
        })
    })
})

router.post('/deleteemployee', checkAuthCompany, (req, res, next) => {
    const id = req.body.id
    Company.find({
        _id: req.companyData.id,
        email: req.companyData.email,
        verify: true,
        lock: false,
    })
    .exec()
    .then(datacompany => {
        if (datacompany.length > 0) {
            const found = datacompany[0].employees.some(element => {
                return element.employee === id
            })
            if (found === true) {
                Company.findOneAndUpdate({ _id: req.companyData.id }, { $pull: { employees: { employee: id }}})
                .exec()
                .then(
                    User.deleteOne({
                        _id: id,
                        verify: false,
                    })
                    .exec()
                    .then(
                        res.status(200).json({
                            status: 200,
                            message: 'employee was deleted or was verified',
                        })
                    )
                )
            } else {
                res.status(404).json({
                    status: 404,
                    message: 'Employee does not exist'
                })
            }
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            status: 500,
            message: 'Delete Employee Error'
        })
    })
})

router.post('/changeLockEmployee', checkAuthCompany, (req, res, next) => {
    User.updateOne({
        _id: req.body.id,
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


router.post('/changePermission', checkAuthCompany, (req, res, next) => {
    User.updateOne({
        _id: req.body.id,
    }, {
        permission: req.body.permission,
    })
    .exec()
    .then(result => {
        if (result.nModified > 0) {
            res.status(200).json({
                status: 200,
                message: 'change account permission success',
                permission: req.body.permission,
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

const compare = function (arr1, arr2) {
    const finalarray = []
    var flag = false
    for (i = 0; i < arr1.length; i++) {
        flag = false
        for (j = 0; j < arr2.length; j++) {
            if (arr1[i] === arr2[j]) {
                flag = true
                break
            }
        }
        if (flag == false) {
            finalarray.push(arr1[i])
        }
    }
    return finalarray
}
router.post('/editProject/:id', checkAuthCompany, (req, res, next) => {
    const id = req.params.id
    const name = req.body.name
    const investor = req.body.investor
    const price = req.body.price
    const unit = req.body.unit
    const area = req.body.area
    const address = req.body.address
    const type = req.body.type
    const info = req.body.info
    const lat = req.body.lat
    const long = req.body.long
    const ownerid = req.body.ownerid
    const fullname = req.body.fullname
    const phone = req.body.phone
    const email = req.body.email
    const avatar = req.body.avatar
    const updateTime = req.body.updateTime
    const url = req.body.url ? req.body.url : []
    const publicId = req.body.publicId ? req.body.publicId : []
    const codelist = req.body.codelist ? req.body.codelist : []

    Project.find({
        _id: id,
        ownerid: ownerid,
        $or: [{statusProject: 1}, {statusProject: 3}],
    })
    .exec()
    .then(doc => {
        if (doc.length > 0) {
            const publicIdInDataBase = doc[0].publicId
            const publicIdDelete = compare(publicIdInDataBase, publicId)
            // console.log(publicIdDelete)
            if (publicIdDelete.length > 0) {
                cloudinary.v2.api.delete_resources(publicIdDelete, { invalidate: true },
                    function (error, result) { console.log(result) })
            }
        }
    })

    Project.updateOne({
        _id: id,
        ownerid: ownerid,
        $or: [{statusProject: 1}, {statusProject: 3}],
    }, {
        name: name,
        investor: investor,
        price: price,
        unit: unit,
        area: area,
        address: address,
        type: type,
        info: info,
        lat: lat,
        long: long,
        fullname: fullname,
        phone: phone,
        email: email,
        avatar: avatar,
        updateTime: updateTime,
        url: url,
        publicId: publicId, 
        codelist: codelist
    })
    .exec()
    .then(result => {
        if (result.nModified > 0) {
            res.status(200).json({
                status: 200,
                message: 'update project success',
            })
        } else {
            res.status(200).json({
                status: 200,
                message: 'No info change or project does not exist',
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

router.delete('/:id', checkAuthCompany, (req, res, next) => {
    const companyid =  req.companyData.id
    const projectid = req.params.id
    const userid = req.body.userid
    User.findOne({
        _id: userid,
        company: companyid,
        verify: true,
    })
    .exec()
    .then(resultuser => {
        Project.deleteOne({
            _id: projectid,
            ownerid: userid,
        })
        .exec()
        .then(result => {
            if (result.n > 0) {
                const temp = resultuser.totalProject - 1
                User.findOneAndUpdate({_id: userid, verify: true}, {totalProject: temp})
                .exec()
                .then(ex1 => console.log('update total project success: ' + temp))
                Comment.deleteOne({ projectid: projectid }).exec().then(ex2 => console.log('delete comment success'))
                Waiting.deleteOne({ project: projectid }).exec().then(ex3 => console.log('delete waiting request success'))
                Transaction.findOneAndRemove({project: projectid}).exec().then(ex4 => {
                    console.log('delete transaction success')
                    if(ex4 && ex4.typetransaction === 1) {
                        SellDetail.deleteOne({transactionid: ex4._id}).exec().then(ex5 => console.log('delete selldetail success'))
                    } else if(ex4 && ex4.typetransaction === 2) {
                        RentDetail.deleteOne({transactionid: ex4._id}).exec().then(ex6 => console.log('delete rentdetail success'))
                    }
                })
                res.status(200).json({
                    status: 200,
                    message: 'delete project success',
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
})

module.exports = router
