const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const moment = require('moment')

const checkAuthAdmin = require('../middleware/checkAuthAdmin')
const libFunction = require('../lib/function')
const dataProcess = require('../lib/dataProcess')
const constructorModel = require('../lib/constructorModel')
const User = require('../models/userModel')
const Project = require('../models/projectModel')
const SavedProject = require('../models/savedProjectModel')

router.post('/', (req, res, next) => {
    const start = req.body.start
    const end = req.body.end
    const match = '{ "$match": { "createTime": { "$gte": '+ start + ', "$lt": ' + end + '} } }'
    const limit = '{ $limit: ' + req.body.limit + '}'
    Project.aggregate([
        JSON.parse(match),
        { $group: { _id: "$ownerid", number: { $sum: 1 } } },
        { $sort: { number: -1 } },
        JSON.parse(limit),
    ])
    .exec()
    .then(ex  => {
        res.status(200).json({
            status: 200,
            message: 'statistic data success',
            result: ex,
        })
    })
    .catch(err => {
        res.status(500).json({
            status: 500,
            error: err,
        })
    })
})

module.exports = router
