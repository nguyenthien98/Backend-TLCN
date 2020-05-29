const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const cloudinary = require('cloudinary')

const checkAuthAdmin = require('../../middleware/checkAuthAdmin')
const libFunction = require('../../lib/function')
const News = require('../../models/newsModel')

const constant = require('../../lib/constant')

cloudinary.config({
    cloud_name: 'dne3aha8f',
    api_key: '464146278492844',
    api_secret: 'JdBsEVQDxp4_1jsZrT-qM7T8tns'
})

router.get('/all/:page', checkAuthAdmin, (req, res, next) => {
    const page = parseInt(req.params.page) - 1
    News.find().sort({'createTime': -1}).skip(page*constant.numItem).limit(constant.numItem)
    .select()
    .exec()
    .then(results => {
        if (results.length > 0) {
            res.status(200).json({
                status: 200,
                count: results.length,
                page: page + 1,
                news: results,
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
    News.findById(id)
    .exec()
    .then(result => {
        res.status(200).json({
            status: 200,
            newsResult: result,
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

router.post('/', checkAuthAdmin, (req, res, next) => {
    const imageTemp = {
        url: '',
        id: '',
    }
    const news= new News({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        image: req.body.image ? req.body.image : imageTemp,
        infoImage: req.body.infoImage ? req.body.infoImage : '',
        content: req.body.content,
        type: req.body.type,
        createTime: req.body.createTime,
        updateTime: req.body.updateTime,
    })
    news
    .save()
    .then(result => {
        res.status(201).json({
            status: 201,
            message: 'add news success',
            news: result,
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

router.post('/edit/:id', checkAuthAdmin, (req, res, next) => {
    const id = req.params.id
    const title = req.body.title
    const image = req.body.image
    const infoImage = req.body.infoImage ? req.body.infoImage : ''
    const content = req.body.content
    const type = req.body.type
    const createTime = req.body.createTime
    const updateTime = req.body.updateTime
    const isChooseImage = req.body.isChooseImage

    News.findOneAndUpdate({
        _id: id
    }, {
        title: title,
        content: content,
        image: image,
        infoImage: infoImage,
        type: type,
        updateTime: updateTime,
    })
    .exec()
    .then(ex => {
        if(isChooseImage) {
            cloudinary.v2.api.delete_resources([ex.image.id], { invalidate: true },
                function (error, result) { console.log(result) })
        }
        res.status(200).json({
            status: 200,
            message: 'update news success',
            news: {
                _id: id,
                title: title,
                image: image,
                infoImage: infoImage,
                content: content,
                type: type,
                createTime: createTime,
                updateTime: updateTime, 
            },
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

router.delete('/:id', checkAuthAdmin, (req, res, next) => {
    const id = req.params.id
    News.deleteOne({
        _id: id
    })
    .exec()
    .then(result => {
        if (result.n > 0) {
            res.status(200).json({
                status: 200,
                message: 'delete news success',
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
