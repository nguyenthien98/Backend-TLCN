const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const checkAuth = require('../../middleware/checkAuth')
const libFunction = require('../../lib/function')
const constructorModel = require('../../lib/constructorModel')
const dataProcess = require('../../lib/dataProcess')
const User = require('../../models/userModel')
const Project = require('../../models/projectModel')
const Company = require('../../models/companyModel')
const Transaction = require('../../models/transactionModel')
const SellDetail = require('../../models/selldetailModel')
const RentDetail = require('../../models/rentdetailModel')
const Waiting = require('../../models/waitingModel')

const constant = require('../../lib/constant')

router.get('/listrequest/:projectid', checkAuth, (req, res, next) => {
    const projectid = req.params.projectid
    Waiting.find({
        project: projectid,
    })
    .populate({path:'project requests.user'})
    .exec()
    .then(result => {
        res.status(200).json({
            status: 200,
            message: 'get list requests success',
            count: result.length > 0 ? result[0].requests.length : 0,
            result: result,
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

router.post('/addwaitingrequest', checkAuth, (req, res, next) => {
    const projectid = req.body.projectid
    const userid = req.userData.id
    const createTime = req.body.createTime
    const money = req.body.money
    const description = req.body.description
    Waiting.find({
        project: projectid,
    })
    .exec()
    .then(result => {
        if (result.length === 0) {
            const waiting = new Waiting({
                _id: new mongoose.Types.ObjectId(),
                project: projectid,
                requests: [{
                    user: userid,
                    createdTransaction: false,
                    createTime: createTime,
                    money: money,
                    description: description,
                }],
            })
            waiting
            .save()
            .then(result => {
                res.status(201).json({
                    status: 201,
                    message: 'create new list request project success',
                    result: result,
                })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    status: 500,
                    error: err,
                })
            })
        } else if (result.length >= 1) {
            if(result[0].requests.length >= 50)  {
                return res.status(204).json({
                    status: 204,
                    message: 'can not add more request transaction to this project',
                })
            }
            const isInArray = result[0].requests.some(temp => {
                return temp.user === userid
            })
            if (isInArray) {
                return res.status(206).json({
                    status: 206,
                    message: 'user has requested transaction to this project',
                })
            } else if (!isInArray) {
                const request = {
                    user: userid,
                    createTime: createTime,
                    money: money,
                    description: description,
                }
                Waiting.findOneAndUpdate({ project: projectid }, { $push: { requests: request } })
                .exec()
                .then(ex => {
                    res.status(201).json({
                        status: 201,
                        message: 'add to list request success',
                        result: request,
                    })
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({
                        status: 500,
                        error: err,
                    })
                })
            }
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

router.post('/deletewaitingrequest', checkAuth, (req, res, next) => {
    const projectid = req.body.projectid
    const userid = req.userData.id
    Waiting.find({
        project: projectid,
    })
    .exec()
    .then(result => {
        const isInArray = result[0].requests.some(temp => {
            return temp.user === userid
        })
        if (result[0].createdTransaction === true) {
            res.status(203).json({
                status: 203,
                message: 'this project is now in transaction',
            })
        } else if (result.length >= 1 && isInArray) {
            Waiting.findOneAndUpdate({ project: projectid }, { $pull: { requests: { user: userid} } })
            .exec()
            .then(ex => {
                res.status(201).json({
                    status: 201,
                    message: 'delete user from list requests success',
                })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    status: 500,
                    error: err,
                })
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

router.post('/create', checkAuth, (req, res, next) => {
    var transaction = constructorModel.constructorTransaction(req.body.step, req.body.typeproject, req.body.typetransaction, req.body.project, req.body.code, req.userData.id, req.body.buyer,  req.body.company, req.body.createTime)
    dataProcess.checkCodeAvailable(req.userData.id, req.body.buyer, req.body.project, req.body.code, req.userData.id)
    .then(resultcheck => {
        console.log(resultcheck)        
        if(transaction.typetransaction === 1) {
            const transactiondetail = SellDetail({
                _id: new mongoose.Types.ObjectId(),
                seller: req.userData.id,
                buyer: req.body.buyer,
                transactionid: transaction._id,
            })
            transactiondetail
            .save()
            .then(resultdetail => {
                transaction.selldetail=transactiondetail._id
                transaction
                .save()
                .then(result => {
                    res.status(201).json({
                        status: 201,
                        message: 'create sell transaction success',
                        transaction: result,
                        transactiondetail: resultdetail,
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
        } else if(transaction.typetransaction === 2) {
            const transactiondetail = RentDetail({
                _id: new mongoose.Types.ObjectId(),
                seller: req.userData.id,
                buyer: req.body.buyer,
                transactionid: transaction._id,
            })
            transactiondetail
            .save()
            .then(resultdetail => {
                transaction.rentdetail=transactiondetail._id
                transaction
                .save()
                .then(result => {
                    res.status(201).json({
                        status: 201,
                        message: 'create rent transaction success',
                        transaction: result,
                        transactiondetail: resultdetail,
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
        } else {
            res.status(409).json({
                status: 409,
                error: 'request fail'
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            status: 500,
            error: err
        })
    })    
})

router.post('/changeactive', checkAuth, (req, res, next) => {
    const transactionid = req.body.transactionid
    const active = req.body.active
    Transaction.updateOne({
        _id: transactionid,
        verify: false,
        status: 1,
        seller: req.userData.id,
    },{
        active: active,
    })
    .exec()
    .then(result => {
        if (result.nModified > 0) {
            res.status(200).json({
                status: 200,
                message: 'change status transaction success',
                transactionid: transactionid,
                active: active,
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

router.post('/complete', checkAuth, (req, res, next) => {
    const transactionid = req.body.transactionid
    Transaction.updateOne({
        _id: transactionid,
        verify: false,
        status: 1,
        seller: req.userData.id,
    },{
        status: 2,
    })
    .exec()
    .then(result => {
        if (result.nModified > 0) {
            res.status(200).json({
                status: 200,
                message: 'change status transaction success',
                transactionid: transactionid,
                status: 2,
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

router.post('/cancel', checkAuth, (req, res, next) => {
    const transactionid = req.body.transactionid
    const type = parseInt(req.body.type)
    const transactiondetail = req.body.transactiondetail
    const projectid = req.body.projectid
    const seller = req.body.seller
    const buyer = req.body.buyer
    Transaction.deleteOne({
        _id: transactionid,
        verify: false,
        status: 1,
        seller: seller,
    })
    .exec()
    .then(result => {
        if (result.n > 0) {
            if(type === 1) {
                SellDetail.deleteOne({
                    _id: transactiondetail,
                    transactionid: transactionid,
                })
                .exec()
                .then(console.log('delete selldetail success'))
            } else if(type === 2) {
                RentDetail.deleteOne({
                    _id: transactiondetail,
                    transactionid: transactionid,
                })
                .exec()
                .then(console.log('delete rentdetail success'))
            }
            Waiting.findOneAndUpdate({ project: projectid }, { $pull: { requests: { user: buyer }}})
            .exec()
            .then(console.log('remove request success'))
            res.status(200).json({
                status: 200,
                message: 'cancel transaction success',
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

router.get('/history/:page', checkAuth, (req, res, next) => {
    const userid = req.userData.id
    const page = parseInt(req.params.page) - 1
    Transaction.find({
        $or: [{seller: userid},{buyer: userid}]
    }).sort({ 'createTime': -1 }).skip(page*constant.numItem).limit(constant.numItem)
    .populate({
        path: 'project'
    })
    .exec()
    .then(result => {
        res.status(200).json({
            status: 200,
            message: 'get history transaction success',
            count: result.length,
            history: result,
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

router.get('/detail/:id/:type', checkAuth, (req, res, next) => {
    const id = req.params.id
    const type = Number(req.params.type)
    const userid = req.userData.id
    Transaction.findOne({
        _id: id,
        $or: [{seller: userid},{buyer: userid}],
    })
    .populate({
        path: type === 1 ? 'project selldetail' : 'project rentdetail',
    })
    .exec()
    .then(result => {
        res.status(200).json({
            status: 200,
            message: 'get detail transaction success',
            transaction: result,
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

router.get('/test/:seller/:buyer', (req, res, next) => {
    const seller = req.params.seller
    const buyer = req.params.buyer
    dataProcess.getNumberTransaction(seller, buyer)
    .then(result => {
        res.status(200).json({
            status: 200,
            message: 'get num of transaction success',
            result: result,
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

module.exports = router
