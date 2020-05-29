const fs = require('fs')
const mongoose = require('mongoose')

const Admin = require('../models/adminModel')
const Comment = require('../models/commentModel')
const Company = require('../models/companyModel')
const News = require('../models/newsModel')
const Project = require('../models/projectModel')
const RentDetail = require('../models/rentdetailModel')
const SavedProject = require('../models/savedProjectModel')
const SellDetail = require('../models/selldetailModel')
const Transaction = require('../models/transactionModel')
const User = require('../models/userModel')
const Waiting = require('../models/waitingModel')
const mongo = require('./mongo')

mongoose.connect(mongo.url, mongo.options)
.then(success => {
    console.log('test')
    console.log('Connect Database Success')
})
.catch(err => {
    console.log('Connect Database Failed: ' + err)
    process.exit()
})

// insert admin
function insertAdmin() {
    return new Promise((resolve, reject) => {
        var filedata = fs.readFileSync(__dirname + '/SampleData/admin.json')
        var admin = JSON.parse(filedata)
        Admin.insertMany(admin).then(result => {
            console.log('insert admin success!')
            resolve('insert admin success!')
        })
        .catch(err => {
            console.log(err)
            reject('error')
        })
    })
}

// inserrt comment
function insertComment() {
    return new Promise((resolve, reject) => {
        var filedata = fs.readFileSync(__dirname + '/SampleData/comment.json')
        var comment = JSON.parse(filedata)
        Comment.insertMany(comment).then(result => {
            console.log('insert comment success!')
            resolve('insert comment success!')
        })
        .catch(err => {
            console.log(err)
            reject('error')
        })
    })
}

// insert company
function insertCompany() {
    return new Promise((resolve, reject) => {
        var filedata = fs.readFileSync(__dirname + '/SampleData/company.json')
        var company = JSON.parse(filedata)
        Company.insertMany(company).then(result => {
            console.log('insert company success!')
            resolve('insert company success!')
        })
        .catch(err => {
            console.log(err)
            reject('error')
        })
    })
}

// insert news
function insertNews() {
    return new Promise((resolve, reject) => {
        var filedata = fs.readFileSync(__dirname + '/SampleData/news.json')
        var news = JSON.parse(filedata)
        News.insertMany(news).then(result => {
            console.log('insert news success!')
            resolve('insert news success!')
        })
        .catch(err => {
            console.log(err)
            reject('error')
        })
    })
}

// insert  project
function insertProject() {
    return new Promise((resolve, reject) => {
        var filedata = fs.readFileSync(__dirname + '/SampleData/project.json')
        var project = JSON.parse(filedata)
        Project.insertMany(project).then(result => {
            console.log('insert project success!')
            resolve('insert project success!')
        })
        .catch(err => {
            console.log(err)
            reject('error')
        })
    })
}

// insert rentdetail
function insertRentDetail() {
    return new Promise((resolve, reject) => {
        var filedata = fs.readFileSync(__dirname + '/SampleData/rentdetail.json')
        var rentdetail = JSON.parse(filedata)
        RentDetail.insertMany(rentdetail).then(result => {
            console.log('insert rentdetail success!')
            resolve('insert rentdetail success!')
        })
        .catch(err => {
            console.log(err)
            reject('error')
        })
    })
}

// insert savedproject
function insertSavedProject() {
    return new Promise((resolve, reject) => {
        var filedata = fs.readFileSync(__dirname + '/SampleData/savedproject.json')
        var savedproject = JSON.parse(filedata)
        SavedProject.insertMany(savedproject).then(result => {
            console.log('insert rentdetail success!')
            resolve('insert rentdetail success!')
        })
        .catch(err => {
            console.log(err)
            reject('error')
        })
    })
}

// insert selldetail
function insertSellDetail() {
    return new Promise((resolve, reject) => {
        var filedata = fs.readFileSync(__dirname + '/SampleData/selldetail.json')
        var selldetail = JSON.parse(filedata)
        SellDetail.insertMany(selldetail).then(result => {
            console.log('insert selldetail success!')
            resolve('insert selldetail success!')
        })
        .catch(err => {
            console.log(err)
            reject('error')
        })
    })
}

// insert transaction
function insertTransaction() {
    return new Promise((resolve, reject) => {
        var filedata = fs.readFileSync(__dirname + '/SampleData/transaction.json')
        var transaction = JSON.parse(filedata)
        Transaction.insertMany(transaction).then(result => {
            console.log('insert transaction success!')
            resolve('insert transaction success!')
        })
        .catch(err => {
            console.log(err)
            reject('error')
        })
    })
}

// insert user
function insertUser() {
    return new Promise((resolve, reject) => {
        var filedata = fs.readFileSync(__dirname + '/SampleData/user.json')
        var user = JSON.parse(filedata)
        User.insertMany(user).then(result => {
            console.log('insert user success!')
            resolve('insert user success!')
        })
        .catch(err => {
            console.log(err)
            reject('error')
        })
    })
}

// insert waiting
function insertWaiting() {
    return new Promise((resolve, reject) => {
        var filedata = fs.readFileSync(__dirname + '/SampleData/waiting.json')
        var waiting = JSON.parse(filedata)
        Waiting.insertMany(waiting).then(result => {
            console.log('insert waiting success!')
            resolve('insert waiting success!')
        })
        .catch(err => {
            console.log(err)
            reject('error')
        })
    })
}
//const concac = () => {
    Promise.all([insertAdmin(), insertComment(), insertCompany(), insertProject(), insertNews(), insertRentDetail(), insertSavedProject(), insertSellDetail(), insertTransaction(), insertUser(), insertWaiting()])
    .then(result => {
        console.log(result)
        process.exit()
    })
    .catch(err => {
        console.log('seed data fail, exit!')
        process.exit()
    })
//}
//module.exports = concac

