const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const checkAuthAdmin = require('../../middleware/checkAuthAdmin')
const libFunction = require('../../lib/function')
const User = require('../../models/userModel')
const Project = require('../../models/projectModel')
const Comment = require('../../models/commentModel')
const SavedProject = require('../../models/savedProjectModel')

const constant = require('../../lib/constant')

router.get('/all/:page', checkAuthAdmin, (req, res, next) => {
    const page = parseInt(req.params.page) - 1
    User.find().skip(page*constant.numItem).limit(constant.numItem)
    .select()
    .exec()
    .then(results => {
        if (results.length > 0) {
            res.status(200).json({
                status: 200,
                count: results.length,
                page: page + 1,
                accounts: results,
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
    const id = req.params.id
    User.findById(id)
    .exec()
    .then(result => {
        if (result !== null) {
            res.status(200).json({
                status: 200,
                account: result,
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

router.post('/edit/:id', checkAuthAdmin, (req, res, next) => {
    const id = req.params.id
    const fullname = req.body.fullname
    const identify = req.body.identify
    const address = req.body.address
    const email = req.body.email
    const phone = req.body.phone
    const totalProject = req.body.totalProject
    const statusAccount = req.body.statusAccount
    const description = req.body.description
    User.updateOne({
        _id: id,
        email: email,
    }, {
        fullname: fullname,
        identify: identify,
        address: address,
        phone: phone,
        totalProject: totalProject,
        statusAccount: statusAccount,
        description: description,
    })
    .exec()
    .then(result => {
        if (result.nModified > 0) {
            res.status(200).json({
                status: 200,
                message: 'update account success',
                account: {
                    _id: id,
                    fullname: fullname,
                    identify: identify,
                    address: address,
                    email: email,
                    phone: phone,
                    totalProject: totalProject,
                    statusAccount: statusAccount,
                    description: description,
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


router.delete('/:id', checkAuthAdmin, (req, res, next) => {
    User.deleteOne({
        _id: req.params.id,
    })
    .exec()
    .then(result => {
        Project.deleteMany({ownerid: req.params.id}).exec().then(result => console.log('delete project success'))
        Comment.deleteMany({userid: req.params.id}).exec().then(result => console.log('delete comment success'))
        SavedProject.deleteOne({userid: req.params.id}).exec().then(result => console.log('delete saved project success'))
        if(result.n > 0) {
            res.status(200).json({
                status: 200,
                message: 'account deleted',
                result: result
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

router.post('/changeLock/:id', checkAuthAdmin, (req, res, next) => {
    User.updateOne({
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

router.post('/changePermission/:id', checkAuthAdmin, (req, res, next) => {
    User.updateOne({
        _id: req.params.id,
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
            error: err,
        })
    })
})

module.exports = router
