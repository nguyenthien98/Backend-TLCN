const mongoose = require('mongoose')

const User = require('../models/userModel')
const Project = require('../models/projectModel')
const News = require('../models/newsModel')
const Company = require('../models/companyModel')
const Transaction = require('../models/transactionModel')
const SellDetail = require('../models/selldetailModel')
const RentDetail = require('../models/rentdetailModel')
const Waiting = require('../models/waitingModel')
const SavedProject = require('../models/savedProjectModel')

function countAccount(){
    return new Promise((resolve,reject) => {
        User.countDocuments({}, (err, count) => {
            if(err)
                reject(err)
            resolve(count)
        })
    })
}

function countProject(){
    return new Promise((resolve,reject) => {
        Project.countDocuments({}, (err, count) => {
            if(err)
                reject(err)
            resolve(count)
        })
    })
}

function countNews(){
    return new Promise((resolve,reject) => {
        News.countDocuments({}, (err, count) => {
            if(err)
                reject(err)
            resolve(count)
        })
    })
}

function countCompany(){
    return new Promise((resolve,reject) => {
        Company.countDocuments({}, (err, count) => {
            if(err)
                reject(err)
            resolve(count)
        })
    })
}

function countProjectUser(ownerid){
    return new Promise((resolve,reject) => {
        Project.countDocuments({ownerid: ownerid, verify: true}, (err, count) => {
            if(err)
                reject(err)
            resolve(count)
        })
    })
}

function countProjectOwner(ownerid){
    return new Promise((resolve,reject) => {
        Project.countDocuments({ownerid: ownerid}, (err, count) => {
            if(err)
                reject(err)
            resolve(count)
        })
    })
}

function countAgent(){
    return new Promise((resolve,reject) => {
        User.countDocuments({statusAccount: 2, lock: false, verify: true}, (err, count) => {
            if(err)
                reject(err)
            resolve(count)
        })
    })
}

function getNumberTransaction(seller, buyer) {
    return new Promise((resolve,reject) => {
        Transaction.find({
            $or: [{seller: seller}, {buyer: buyer}]
        })
        .exec()
        .then(results => {
            var temp = {
                seller: 0,
                buyer: 0,
            }
            results.forEach(element => {
                if(element.seller === seller)
                    temp.seller += 1
                if(element.buyer === buyer)
                    temp.buyer +=1
            })
            resolve(temp)
        })
        .catch(err => {
            console.log(err)
            reject('connect database error')
        })
    })
}

function getNumberTransactionInProcess(seller, buyer) {
    return new Promise((resolve,reject) => {
        Transaction.find({
            $or: [{seller: seller}, {buyer: buyer}],
            $or: [{status: 1}, {status: 2}],
        })
        .exec()
        .then(results => {
            var temp = {
                seller: 0,
                buyer: 0,
            }
            results.forEach(element => {
                if(element.seller === seller)
                    temp.seller += 1
                if(element.buyer === buyer)
                    temp.buyer +=1
            })
            resolve(temp)
        })
        .catch(err => {
            console.log(err)
            reject('connect database error')
        })
    })
}

function checkCodeAvailable(seller, buyer, project, code, ownerid) {
    return new Promise((resolve, reject) => {
        getNumberTransactionInProcess(seller, buyer)
        .then(temp => {
            if(temp.buyer >= 3) {
                console.log(temp)
                reject('buyer has 3 or more transaction in process')
            } else {
                Project.findOne({
                    _id: project,
                    ownerid: ownerid,
                    'codelist.code': code,
                    'codelist.sold': false,
                })
                .exec()
                .then(result => {
                    if(result === null) {
                        console.log(code + ' is not available')
                        reject('can not create transaction because the code or project is not available')
                    } else {
                        Waiting.updateOne({
                            project: project,
                            'requests.user': buyer,
                        }, {
                            'requests.$.createdTransaction': true,
                        })
                        .exec()
                        .then(ex => {
                            if(ex.nModified === 0) {
                                console.log('this account created transaction before')
                                reject('this account created transaction before')
                            } else {
                                resolve('this request can be created transaction')
                            }
                        })
                        .catch(err => {
                            console.log(err)
                            reject('connect database error')
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                    reject('connect database error')
                }) 
            }
        })
        .catch(err => {
            console.log(err)
            reject('connect database error')
        })    
    })
}

function checkListSavedStatus(temp) {
    return new Promise((resolve, reject)=> {
        var result = temp
        if(temp === null) {
            return reject('null array')
        }
        var idListNull = []
        result.projects = temp.projects.filter(e => {
            if(e.project === null) {
                idListNull.push(e._id)
            } else {
                return e
            }
        })
        console.log(idListNull)
        if(idListNull.length > 0) {
            SavedProject.findOneAndUpdate({ userid: result.userid }, { $pull: { projects: { _id: { $in: idListNull } } } })
            .exec()
            .then((ex) => {
                console.log('delete null project success')
            })
        }
        return resolve(result)
    })
}

module.exports.countAccount = countAccount
module.exports.countProject = countProject
module.exports.countNews = countNews
module.exports.countCompany = countCompany
module.exports.countProjectUser = countProjectUser
module.exports.countProjectOwner = countProjectOwner
module.exports.countAgent = countAgent
module.exports.getNumberTransaction = getNumberTransaction
module.exports.getNumberTransactionInProcess = getNumberTransactionInProcess
module.exports.checkCodeAvailable = checkCodeAvailable
module.exports.checkListSavedStatus = checkListSavedStatus
