const mongoose = require('mongoose')

const User = require('../models/userModel')
const Project = require('../models/projectModel')
const Company = require('../models/companyModel')
const Transaction = require('../models/transactionModel')
const SellDetail = require('../models/selldetailModel')
const RentDetail = require('../models/rentdetailModel')
const Waiting = require('../models/waitingModel')

function constructorUser(identify, fullname, address, phone, description, email, statusAccount, avatar, company, hash) {
    var temp = User({
        _id: new mongoose.Types.ObjectId(),
        identify: identify ? identify : '0',
        fullname: fullname ? fullname : '0',
        address: address ? address : '0',
        phone: phone ? phone : '0',
        description: description ? description:  'no info',
        email: email,
        totalProject: 0,
        statusAccount: statusAccount ? statusAccount : 1,
        avatar: avatar ? avatar : '',
        company: company ? company : '0',
        lock: false,
        verify: true,
        permission: false,
        hash: hash,
    })
    return temp
}

function constructorProject (name, investor, price, unit, area, address, type, info, lat, long, ownerid, fullname, phone, email, avatar, statusProject, codelist, createTime, url, publicId) {
    var project = new Project({
        _id: new mongoose.Types.ObjectId(),
        name: name ? name : '0',
        investor: investor ? investor : '0',
        price: price ? price : 0,
        unit: unit ? unit : '0',
        area: area ? area : 0,
        address: address ? address : '0',
        type: type,
        info: info ? info : '0',
        lat: lat ? lat : 0,
        long: long ? long : 0,
        ownerid: ownerid ? ownerid : '0',
        fullname: fullname ? fullname : '0',
        phone: phone ? phone : '0',
        email: email ? email : '0',
        avatar: avatar ? avatar : '0',
        statusProject: statusProject && statusProject == 3 ? statusProject : 1,
        amount: codelist.length,
        createTime: createTime ? createTime : 0,
        updateTime: createTime ? createTime : 0,
        verify: false,
        allowComment: true,
        codelist: codelist,
        url: url,
        publicId: publicId,
    })
    return project
}

function constructorCompany (hash, companyname, address, email, phone, website, status, avatar, description, createTime, createBy) {
    var company= new Company({
        _id: new mongoose.Types.ObjectId(),
        password: hash,
        companyname: companyname ? companyname : '0',
        address: address ? address : '0',
        email: email ? email : '0',
        phone: phone ? phone : '0',
        website: website ? website : '0',
        totalProject: 0,
        status: status ? status : 0,
        avatar: avatar ? avatar : '0',
        description: description ? description:  'no info',
        createTime: createTime ? createTime : 0,
        updateTime: createTime ? createTime : 0,
        createBy: createBy,
        lock: false,
        verify: false,
        hash: 0,
        employees: [],
    })
    return company
}

function constructorTransaction (step, typeproject, typetransaction, project, code, seller, buyer, company, createTime) {
    var transaction = Transaction({
        _id: new mongoose.Types.ObjectId(),
        active: true,
        verify: false,
        complete: false,
        step: step ? step : 0,
        typeproject: typeproject ? typeproject : 0,
        typetransaction: typetransaction ? typetransaction : 0,
        status: 1,
        project: project ? project : '0',
        code: code ? code : '0',
        seller: seller ? seller : '0',
        buyer: buyer ? buyer : '0',
        company: company ? company : '0',
        createTime: createTime ? createTime : 0,
        updateTime: createTime ? createTime : 0,
        selldetail: '0',
        rentdetail: '0',
    })
    return transaction
}

module.exports.constructorUser = constructorUser
module.exports.constructorProject = constructorProject
module.exports.constructorCompany = constructorCompany
module.exports.constructorTransaction = constructorTransaction
