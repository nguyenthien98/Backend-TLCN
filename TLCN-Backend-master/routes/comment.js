const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const checkAuth = require('../middleware/checkAuth')
const libFunction = require('../lib/function')
const User = require('../models/userModel')
const Comment = require('../models/commentModel')

router.get('/all/:id', (req, res, next) => {
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
            res.status(200).json({
                status: 200,
                count: 0,
                comments: [],
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
    Comment.find({
        user: req.userData.id,
        projectid: req.body.projectid
    })
    .exec()
    .then(result => {
        if(result.length >= 3) {
            return res.status(403).json({
                status: 403,
                message: 'user can not add more comment to this project',
            })
        } else {
            const comment = Comment({
                _id: new mongoose.Types.ObjectId(),
                user: req.userData.id,
                projectid: req.body.projectid,
                createTime: req.body.createTime,
                updateTime: req.body.updateTime,
                content: req.body.content,
                star: req.body.star,
            })
            comment
            .save()
            .then(result => {
                return res.status(201).json({
                    status: 201,
                    message: 'add comment success',
                    comment: result,
                })
            })
            .catch(err => {
                console.log(err)
                return res.status(500).json({
                    status: 500,
                    error: err
                })
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

router.post('/edit/:id', checkAuth, (req, res, next) => {
    const id = req.params.id
    const userid = req.userData.id
    const createTime = req.body.createTime
    const updateTime = req.body.updateTime
    const content = req.body.content
    const star = req.body.star
    const projectid = req.body.projectid

    Comment.updateOne({
        _id: id,
        user: userid,
    }, {
        updateTime: updateTime,
        content: content,
        star: star,
    })
    .exec()
    .then(result => {
        if (result.nModified > 0) {
            res.status(200).json({
                status: 200,
                message: 'edit comment success',
                comment: {
                    _id: id,
                    user: userid,
                    projectid: projectid,
                    createTime: createTime,
                    updateTime: updateTime,
                    content: content,
                    star: star,
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

router.delete('/:id', checkAuth, (req, res, next) => {
    Comment.deleteOne({
        _id: req.params.id,
        user: req.userData.id,
    })
    .exec()
    .then(result => {
        if(result.n > 0) {
            res.status(200).json({
                status: 200,
                message: 'comment deleted',
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

module.exports = router
