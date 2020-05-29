const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const cloudinary = require('cloudinary')
var fs = require('fs');

const checkAuth = require('../middleware/checkAuth')
const libFunction = require('../lib/function')
const dataProcess = require('../lib/dataProcess')
const constructorModel = require('../lib/constructorModel')
const Project = require('../models/projectModel')
const User = require('../models/userModel')
const Comment = require('../models/commentModel')
const Waiting = require('../models/waitingModel')
const SavedProject = require('../models/savedProjectModel')

const Transaction = require('../models/transactionModel')
const SellDetail = require('../models/selldetailModel')
const RentDetail = require('../models/rentdetailModel')

const constant = require('../lib/constant')

cloudinary.config({
    cloud_name: 'dne3aha8f',
    api_key: '464146278492844',
    api_secret: 'JdBsEVQDxp4_1jsZrT-qM7T8tns'
})

router.get('/all/:page', (req, res, next) => {
    const page = parseInt(req.params.page) - 1
    Project.find({
        verify: true,
        $or: [{statusProject: 1},{statusProject: 3}],
    }).sort({ 'createTime': -1 }).skip(page*constant.numItem).limit(constant.numItem)
        .select('_id url publicId codelist name investor price unit area address type info lat long ownerid fullname phone email avatar statusProject amount createTime updateTime verify allowComment __v')
        .exec()
        .then(results => {
            res.status(200).json({
                status: 200,
                count: results.length,
                page: page + 1,
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

router.get('/allv2/:page', (req, res, next) => {
    const areaParam = libFunction.convertArrayToString(req.body.projects)
    console.log(areaParam);
    const page = parseInt(req.params.page) - 1
    Project.find({
        verify: true,
        $or: [{statusProject: 1},{statusProject: 3}],
    }).sort({ 'createTime': -1 }).skip(page*constant.numItem).limit(constant.numItem)
        .select(areaParam)
        .exec()
        .then(results => {
            res.status(200).json({
                status: 200,
                count: results.length,
                page: page + 1,
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
//for mongodb online
// router.post('/home', (req, res, next) => {
//     const radius = req.body.radius
//     const lat = req.body.lat
//     const long = req.body.long
//     Project.find({
//         verify: true,
//         $or: [{statusProject: 1}, {statusProject: 3}]
//     })
//         .sort({ 'createTime': -1 })
//         .select('_id url publicId codelist name investor price unit area address type info lat long ownerid fullname phone email avatar statusProject amount createTime updateTime verify allowComment __v')
//         .exec()
//         .then(temp => {
//             const results = libFunction.distanceListPlace(temp, radius, lat, long)
//             if (results.length > 0) {
//                 res.status(200).json({
//                     status: 200,
//                     count: results.length,
//                     projects: results,
//                 })
//             } else {
//                 res.status(200).json({
//                     status: 200,
//                     count: 0,
//                     projects: [],
//                 })
//             }
//         })
//         .catch(err => {
//             console.trace(err)
//             res.status(500).json({
//                 status: 500,
//                 error: err
//             })
//         })
// })
// //for mongodb online
// router.post('/searchmap', (req, res, next) => {
//     const statusParam = req.body.statusProject
//     const areaParam = libFunction.convertData(req.body.area)
//     const priceParam = libFunction.convertData(req.body.price)
//     const radius = req.body.radius
//     const lat = req.body.lat
//     const long = req.body.long
//     const typeParam = req.body.type
//     Project.find({
//         verify: true,
//         type: typeParam == '0' ? { $gte: 1, $lte: 4 } : typeParam,
//         statusProject: statusParam,
//         area: { $gte: areaParam.start, $lte: areaParam.end },
//         price: { $gte: priceParam.start, $lte: priceParam.end },
//     })
//         .sort({ 'createTime': -1 })
//         .select('_id url publicId codelist name investor price unit area address type info lat long ownerid fullname phone email avatar statusProject amount createTime updateTime verify allowComment __v')
//         .exec()
//         .then(temp => {
//             const results = libFunction.distanceListPlace(temp, radius, lat, long)
//             if (results.length > 0) {
//                 res.status(200).json({
//                     status: 200,
//                     message: 'get list project success',
//                     count: results.length,
//                     projects: results,
//                 })
//             } else {
//                 res.status(200).json({
//                     status: 200,
//                     message: 'get list project success',
//                     count: 0,
//                     projects: [],
//                 })
//             }
//         })
//         .catch(err => {
//             console.log(err)
//             res.status(500).json({
//                 status: 500,
//                 error: err
//             })
//         })
// })

//for mongodb local
router.post('/home', (req, res, next) => {
    const radius = req.body.radius
    const lat = req.body.lat
    const long = req.body.long
    const query =   '{ ' +
                        '"verify": "true", ' +
                        '"$or": [{"statusProject": "1"}, {"statusProject": "3"}], ' +
                        '"$where": "function() { ' +
                                'var R = 6371; ' +
                                'var dLat = (this.lat - ' + lat + ')  * (Math.PI / 180); ' +
                                'var dLong = (this.long - ' + long + ')  * (Math.PI / 180); ' +
                                'var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + ' +
                                ' Math.cos(' + lat + ' * (Math.PI / 180)) * Math.cos(this.lat * (Math.PI / 180) ) * ' +
                                ' Math.sin(dLong / 2) * Math.sin(dLong / 2); ' +
                                'var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); ' +
                                'var d = R * c; ' +
                                ' return d <= ' + radius + 
                            '}" ' +
                    '}'
    Project.find(JSON.parse(query))
        .sort({ 'createTime': -1 })
        .select(' _id url publicId codelist name investor price unit area address type info lat long ownerid fullname phone email avatar statusProject amount createTime updateTime verify allowComment __v')
        .exec()
        .then(temp => {
            const results = temp
            if (results.length > 0) {
                res.status(200).json({
                    status: 200,
                    count: results.length,
                    projects: results,
                })
            } else {
                res.status(200).json({
                    status: 200,
                    count: 0,
                    projects: [],
                })
            }
        })
        .catch(err => {
            console.trace(err)
            res.status(500).json({
                status: 500,
                error: err
            })
        })
})
//for mongodb local
router.post('/searchmap', (req, res, next) => {
    const statusParam = req.body.statusProject
    const areaParam = libFunction.convertData(req.body.area)
    const priceParam = libFunction.convertData(req.body.price)
    const radius = req.body.radius
    const lat = req.body.lat
    const long = req.body.long
    const typeParam = req.body.type == '0' ? '{ "$gte": 1, "$lte": 4 }': req.body.type
    const query =   '{ ' +
                        '"verify": "true", ' +
                        '"type": ' + typeParam + ',' +
                        '"statusProject": ' + statusParam + ', ' +
                        '"area": { "$gte": ' + areaParam.start + ', "$lte": ' +  areaParam.end + '}, ' +
                        '"price": { "$gte": ' + priceParam.start + ', "$lte": ' + priceParam.end + '}, ' +
                        '"$where": "function() { ' +
                                'var R = 6371; ' +
                                'var dLat = (this.lat - ' + lat + ')  * (Math.PI / 180); ' +
                                'var dLong = (this.long - ' + long + ')  * (Math.PI / 180); ' +
                                'var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + ' +
                                ' Math.cos(' + lat + ' * (Math.PI / 180)) * Math.cos(this.lat * (Math.PI / 180) ) * ' +
                                ' Math.sin(dLong / 2) * Math.sin(dLong / 2); ' +
                                'var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); ' +
                                'var d = R * c; ' +
                                ' return d <= ' + radius + 
                            '}" ' +
                    '}'
    Project.find(JSON.parse(query))
        .sort({ 'createTime': -1 })
        .select('_id url publicId codelist name investor price unit area address type info lat long ownerid fullname phone email avatar statusProject amount createTime updateTime verify allowComment __v')
        .exec()
        .then(temp => {
            const results = temp
            if (results.length > 0) {
                res.status(200).json({
                    status: 200,
                    message: 'get list project success',
                    count: results.length,
                    projects: results,
                })
            } else {
                res.status(200).json({
                    status: 200,
                    message: 'get list project success',
                    count: 0,
                    projects: [],
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

router.get('/:id', (req, res, next) => {
    const id = req.params.id
    Project.findById(id)
        .select('_id url publicId codelist name investor price unit area address type info lat long ownerid fullname phone email avatar statusProject amount createTime updateTime verify allowComment __v')
        .exec()
        .then(result => {
            if (result != null) {
                res.status(200).json({
                    status: 200,
                    message: 'get info project success',
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

router.post('/', checkAuth, (req, res, next) => {
    const codelist = req.body.codelist !== undefined && req.body.codelist.length > 0 ? req.body.codelist : ['dummy']
    const project = constructorModel.constructorProject(req.body.name, req.body.investor, req.body.price, req.body.unit, req.body.area, req.body.address, req.body.type, req.body.info,
        req.body.lat, req.body.long, req.userData.id, req.body.fullname, req.body.phone, req.body.email, req.body.avatar, req.body.statusProject, libFunction.createCodeList(codelist), req.body.createTime, req.body.url, req.body.publicId)
    User.findOne({
        _id: req.userData.id,
        verify: true,
    })
    .exec()
    .then(resultuser => {
        dataProcess.countProjectOwner(req.userData.id)
        .then(countProject => {
            if(resultuser.statusAccount === 1 && countProject >= 5) {
                res.status(203).json({
                    status: 203,
                    message: 'your account has maximum 5 project, upgrade your account for more',
                })
            } else if (resultuser.statusAccount === 2 && countProject >= 50) {
                res.status(204).json({
                    status: 204,
                    message: 'your account has maximum 40 project',
                })
            } else {
                if(resultuser.permission === true) {
                    project.verify = true
                }
                project
                .save()
                .then(result => {
                    const temp = countProject + 1
                    User.findOneAndUpdate({_id: req.userData.id}, {totalProject: temp})
                    .exec()
                    .then(ex => {
                        console.log('update total project success: ' + temp)
                        res.status(201).json({
                            status: 201,
                            message: 'add project success',
                            project: result,
                        })
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
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                status: 500,
                error: err,
            })
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
router.post('/edit/:id', checkAuth, (req, res, next) => {
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
    const ownerid = req.userData.id
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
        ownerid: req.userData.id,
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

router.delete('/:id', checkAuth, (req, res, next) => {
    const projectid = req.params.id
    const userid = req.userData.id
    User.findOne({
        _id: userid,
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

router.post('/searchprojects', (req, res, next) => {
    const typeParam = req.body.type
    const statusParam = req.body.statusProject
    const addressParam = req.body.address
    const areaParam = libFunction.convertData(req.body.area)
    const priceParam = libFunction.convertData(req.body.price)
    Project.find({
        verify: true,
        type: typeParam == '0' ? { $gte: 1, $lte: 4 } : typeParam,  
        statusProject: statusParam,
        area: { $gte: areaParam.start, $lte: areaParam.end },
        price: { $gte: priceParam.start, $lte: priceParam.end },
        address: { $regex: `.*${addressParam}.*` },
    }).sort({ 'createTime': -1 })
        .select('_id url publicId codelist name investor price unit area address type info lat long ownerid fullname phone email avatar statusProject amount createTime updateTime verify allowComment __v')
        .exec()
        .then(results => {
            if (results.length >= 0) {
                res.status(200).json({
                    status: 200,
                    count: results.length,
                    projects: results,
                })
            } else {
                res.status(200).json({
                    status: 200,
                    count: 0,
                    projects: [],
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

router.post('/searchaddress', (req, res, next) => {
    const addressParam = req.body.address
    const areaParam = libFunction.convertData(req.body.area)
    const priceParam = libFunction.convertData(req.body.price)
    Project.find({
        verify: true,
        $or: [{statusProject: 1},{statusProject: 3}],
        area: { $gte: areaParam.start, $lte: areaParam.end },
        price: { $gte: priceParam.start, $lte: priceParam.end },
        address: { $regex: `.*${addressParam}.*` },
    }).sort({ 'createTime': -1 })
        .select('_id url publicId codelist name investor price unit area address type info lat long ownerid fullname phone email avatar statusProject amount createTime updateTime verify allowComment __v')
        .exec()
        .then(results => {
            if (results.length >= 0) {
                res.status(200).json({
                    status: 200,
                    count: results.length,
                    projects: results,
                })
            } else {
                res.status(200).json({
                    status: 200,
                    count: 0,
                    projects: [],
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

router.post('/search', (req, res, next) => {
    const typeParam = req.body.type
    const statusParam = req.body.statusProject
    const addressParam = req.body.address
    const areaParam = libFunction.convertData(req.body.area)
    const priceParam = libFunction.convertData(req.body.price)
    Project.find({
        verify: true,
        type: typeParam == '0' ? { $gte: 1, $lte: 4 } : typeParam,
        statusProject: statusParam == '1' || statusParam == '3' ? statusParam : 1,
        area: { $gte: areaParam.start, $lte: areaParam.end },
        price: { $gte: priceParam.start, $lte: priceParam.end },
    }).sort({ 'createTime': -1 })
        .select('_id url publicId codelist name investor price unit area address type info lat long ownerid fullname phone email avatar statusProject amount createTime updateTime verify allowComment __v')
        .exec()
        .then(temp => {
            // const results = temp
            const results = libFunction.searchLevenshtein(temp, addressParam)
            if (results.length >= 0) {
                res.status(200).json({
                    status: 200,
                    count: results.length,
                    projects: results,
                })
            } else {
                res.status(200).json({
                    status: 200,
                    count: 0,
                    projects: [],
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

router.post('/deleteImages', (req, res, next) => {
    console.log(req.body)
    publicId = req.body.publicId
    console.log(publicId)
    cloudinary.v2.uploader.destroy(publicId,
        function (error, result) { console.log(result, error) })
})

router.get('/test', (req, res, next) => {
    // User.find()
    // .select()
    //     .exec()
    //     .then(results => {
    //         if (results.length > 0) {
    //             var json = JSON.stringify(results);
    //             fs.writeFile('D:\\Do an tot nghiep\\DATN-Backend\\config\\SampleData\\user.json', json, 'utf8', (err => console.log(err)));
    //             res.status(200).json({
    //                 status: 200,
    //                 count: results.length,
    //                 result: results,
    //             })
    //         } else {
    //             res.status(404).json({
    //                 status: 404,
    //                 message: 'No valid entry found',
    //             })
    //         }
    //     })
    //     .catch(err => {
    //         console.log(err)
    //         res.status(500).json({
    //             status: 500,
    //             error: err
    //         })
    //     })
})

module.exports = router
