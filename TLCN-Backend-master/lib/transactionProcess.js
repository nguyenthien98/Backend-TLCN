const mongoose = require('mongoose')
const moment = require('moment')

const User = require('../models/userModel')
const Project = require('../models/projectModel')
const News = require('../models/newsModel')
const Company = require('../models/companyModel')
const Transaction = require('../models/transactionModel')
const SellDetail = require('../models/selldetailModel')
const RentDetail = require('../models/rentdetailModel')
const Waiting = require('../models/waitingModel')

const  constant = require('./constant')

function checkExpireTransaction() {
    setInterval(() => {
        const now = moment().unix()
        Transaction.updateMany({
            verify: false,
            status: 1,
            createTime: {$lt: now - constant.dayExpire * 86400},
        }, {
            $set: {
                status: 4,
            }
        })
        .exec()
        .then(result => {
            console.log(moment.unix(now).format('DD/MM/YYYY h:mm a')+ ' ' + result.nModified)
        })
        .catch(err => console.log(err))
    },86400000)
}

module.exports.checkExpireTransaction = checkExpireTransaction
