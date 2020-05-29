const express = require('express')
const router = express.Router()
const checkAuthAdmin = require('../../middleware/checkAuthAdmin')
const libFunction = require('../../lib/function')
const constructorModel = require('../../lib/constructorModel')
const Project = require('../../models/projectModel')
const User = require('../../models/userModel')
const Comment = require('../../models/commentModel')
const Waiting = require('../../models/waitingModel')

const Transaction = require('../../models/transactionModel')
const SellDetail = require('../../models/selldetailModel')
const RentDetail = require('../../models/rentdetailModel')

const constant = require('../../lib/constant')

router.get('/all/:page', checkAuthAdmin, (req, res, next) => {
    const page = parseInt(req.params.page) - 1
    Project.find().sort({'createTime': -1}).skip(page*constant.numItem).limit(constant.numItem)
    .select('_id url publicId codelist name investor price unit area address type info lat long ownerid fullname phone email avatar statusProject amount createTime updateTime verify allowComment __v')
    .exec()
    .then(results => {
        if (results.length > 0) {
            res.status(200).json({
                status: 200,
                count: results.length,
                page: page + 1,
                projects: results,
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
    // console.log('id:', id);
    // Project.findById(id).then(resp => res.json(resp)).catch(e=> console.log(e.message) ||  next(e))
    Project.findById(id)
    .select(' _id url publicId codelist name investor price unit area address type info lat long ownerid fullname phone email avatar statusProject amount createTime updateTime verify allowComment __v')
    .exec()
    .then(result => {
        if(result!=null){
            res.status(200).json({
                status: 200,
                project: result,
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
    const codelist = req.body.codelist !== undefined && req.body.codelist.length > 0 ? req.body.codelist : ['dummy']
    const project = constructorModel.constructorProject(req.body.name, req.body.investor, req.body.price, req.body.unit, req.body.area, req.body.address, req.body.type, req.body.info,
        req.body.lat, req.body.long, 'admin:'+req.adminData.id, req.body.fullname, req.body.phone, req.body.email, req.body.avatar, req.body.statusProject, libFunction.createCodeList(codelist), req.body.createTime, req.body.url, req.body.publicId)
    project
    .save()
    .then(result => {
        res.status(201).json({
            status: 201,
            message: 'add project success',
            project: result,
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            status: 500,
            error: err,
        })
    })
})
router.put('/update/:id', checkAuthAdmin,(req,res, next)=>{
    
    const id = req.params._id
    Project.updateOne({
        _id: id,
    }, 
    )
    .exec()
    .then(result => {
        if (result.nModified > 0) {
            res.status(200).json({
                status: 200,
                message: 'update project success',
                project: {
                    _id: id,
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
                    ownerid: ownerid,
                    fullname: fullname,
                    phone: phone,
                    email: email,
                    avatar: avatar,
                    statusProject: statusProject,
                    createTime: createTime,
                    updateTime: updateTime,
                    url: url,
                    publicId: publicId,
                    codelist: codelist
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



router.post('/edit/:id', checkAuthAdmin, (req, res, next) => {
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
    const statusProject = req.body.statusProject
    const createTime = req.body.createTime
    const updateTime = req.body.updateTime
    const url = req.body.url ?  req.body.url : []
    const publicId = req.body.publicId ?  req.body.publicId : []
    const codelist = req.body.codelist ?  req.body.codelist : []
    Project.updateOne({
        _id: id,
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
        statusProject: statusProject,
        updateTime: updateTime,
        // url: url,
        // publicId: publicId,
        // codelist: codelist
    })
    .exec()
    .then(result => {
        if (result.nModified > 0) {
            res.status(200).json({
                status: 200,
                message: 'update project success',
                project: {
                    _id: id,
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
                    ownerid: ownerid,
                    fullname: fullname,
                    phone: phone,
                    email: email,
                    avatar: avatar,
                    statusProject: statusProject,
                    createTime: createTime,
                    updateTime: updateTime,
                    url: url,
                    publicId: publicId,
                    codelist: codelist,
                    
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
    const projectid = req.params.id
    Project.deleteOne({
        _id: projectid
    })
    .exec()
    .then(result => {
        if (result.n > 0) {
            // const temp = resultuser.totalProject - 1
            // User.findOneAndUpdate({_id: req.userData.id, verify: true}, {totalProject: temp})
            // .exec()
            // .then(ex1 => console.log('update total project success: ' + temp))
            Comment.deleteMany({ projectid: projectid }).exec().then(ex2 => console.log('delete comment success'))
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


router.post('/changeVerify/:id', checkAuthAdmin, (req, res, next) => {
    Project.updateOne({
        _id: req.params.id,
    }, {
        verify: req.body.verify,
    })
    .exec()
    .then(result => {
        if (result.nModified > 0) {
            res.status(200).json({
                status: 200,
                message: 'change verify success',
                verify: req.body.verify,
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

router.post('/changeAllowComment/:id', checkAuthAdmin, (req, res, next) => {
    Project.updateOne({
        _id: req.params.id,
    }, {
        allowComment: req.body.allowComment,
    })
    .exec()
    .then(result => {
        if (result.nModified > 0) {
            res.status(200).json({
                status: 200,
                message: 'change allow comment success',
                allowComment: req.body.allowComment,
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

router.get('/allcomment/:id', checkAuthAdmin, (req, res, next) => {
    const projectid = req.params.id
    Comment.find({
        projectid: projectid,
    })
    .populate({path:'user'})
    .sort({'createTime': -1})
    .select()
    .exec()
    .then(results => {
        if (results.length > 0) {
            const temp = results.map(element=>{
                return {
                    _id: element._id,
                    user: {
                        id: element.user._id,
                        email: element.user.email,
                        fullname: element.user.fullname,
                        avatar: element.user.avatar,
                    },
                    updateTime: element.updateTime,
                    createTime: element.createTime,
                    projectid: element.projectid,
                    content: element.content,
                    star: element.star,
                }
            })
            res.status(200).json({
                status: 200,
                count: temp.length,
                comments: temp,
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

module.exports = router
