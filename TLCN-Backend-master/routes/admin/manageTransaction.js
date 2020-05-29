const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const checkAuthAdmin = require('../../middleware/checkAuthAdmin')
const libFunction = require('../../lib/function')
const constructorModel = require('../../lib/constructorModel')
const Transaction = require('../../models/transactionModel')
const SellDetail = require('../../models/selldetailModel')
const RentDetail = require('../../models/rentdetailModel')
const Project = require('../../models/projectModel')
const Waiting = require('../../models/waitingModel')

const constant = require('../../lib/constant')

router.get('/all/:page', (req, res, next) => {
    const page = parseInt(req.params.page) - 1
    Transaction.find().sort({'createTime': -1}).skip(page*constant.numItem).limit(constant.numItem)
    .select()
    .exec()
    .then(results => {
        if (results.length > 0) {
            res.status(200).json({
                status: 200,
                count: results.length,
                page: page + 1,
                transaction: results,
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

router.get('/detail/:id/:type', (req, res, next) => {
    const id = req.params.id
    const type = Number(req.params.type)
    Transaction.findById(id)
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

module.exports = router
