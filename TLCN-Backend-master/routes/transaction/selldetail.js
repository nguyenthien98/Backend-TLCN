const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const cloudinary = require('cloudinary')

const checkAuth = require('../../middleware/checkAuth')
const libFunction = require('../../lib/function')
const User = require('../../models/userModel')
const Project = require('../../models/projectModel')
const Company = require('../../models/companyModel')
const Transaction = require('../../models/transactionModel')
const SellDetail = require('../../models/selldetailModel')
const RentDetail = require('../../models/rentdetailModel')

const constant = require('../../lib/constant')

cloudinary.config({
    cloud_name: 'dne3aha8f',
    api_key: '464146278492844',
    api_secret: 'JdBsEVQDxp4_1jsZrT-qM7T8tns'
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

const deleteImageInCloudinary = ((images, imagesupdate) => {
    imageDelete = compare(images, imagesupdate)
    console.log(imageDelete)
    if (imageDelete.length > 0) {
        cloudinary.v2.api.delete_resources(imageDelete, { invalidate: true },
            function (error, result) { console.log(result) })
    }
})

router.post('/deal', checkAuth, (req, res, next) => {
    const id = req.body.id
    const deal = {
        total: Number(req.body.total),
        deposit: Number(req.body.deposit),
        typeofpay: Number(req.body.typeofpay),
        datedeal: Number(req.body.datedeal),
        description: req.body.description,
        complete: JSON.parse(req.body.complete),
    }
    Transaction.findOneAndUpdate({
        _id: req.body.transactionid,
        seller: req.userData.id,
    },{
        $set: {
            updateTime: req.body.updateTime,
        }
    })
    .exec()
    .then(result => console.log(req.body.updateTime))
    .catch(err  => console.log(err))
    if(deal.complete === true) {
        SellDetail.findOneAndUpdate({
            _id: id,
            seller: req.userData.id,
        },{
            $set: {
                deal: deal,
            }
        })
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    status: 200,
                    message: 'update deal selldetail complete: true',
                    deal: deal,
                    prev: result,
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
    } else if(deal.complete === false) {
        SellDetail.findOneAndUpdate({
            _id: id,
            seller: req.userData.id,
        },{
            $set: {
                'deal.complete': deal.complete,
            }
        })
        .exec()
        .then(result => {
            if (result) {
                deal.total = result.deal.total
                deal.deposit = result.deal.deposit
                deal.typeofpay = result.deal.typeofpay
                deal.datedeal = result.deal.datedeal
                deal.description = result.deal.description 
                res.status(200).json({
                    status: 200,
                    message: 'update deal selldetail complete: false',
                    deal: deal,
                    prev: result,
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
    } else {
        res.status(409).json({
            status: 409,
            error: 'request fail',
        })
    }
})

router.post('/legality', checkAuth, (req, res, next) => {
    const id = req.body.id
    const legality = {
        government: req.body.government,
        certificate: req.body.certificate,
        contract: req.body.contract,
        complete: JSON.parse(req.body.complete),
    }
    Transaction.findOneAndUpdate({
        _id: req.body.transactionid,
        seller: req.userData.id,
    },{
        $set: {
            updateTime: req.body.updateTime,
        }
    })
    .exec()
    .then(result => console.log(req.body.updateTime))
    .catch(err  => console.log(err))
    if(legality.complete === true) {
        SellDetail.findOneAndUpdate({
            _id: id,
            seller: req.userData.id,
        },{
            $set: {
                legality: legality,
            }
        })
        .exec()
        .then(result => {
            deleteImageInCloudinary(result.legality.government, legality.government)
            deleteImageInCloudinary(result.legality.certificate, legality.certificate)
            deleteImageInCloudinary(result.legality.contract, legality.contract) 
            if (result) {
                res.status(200).json({
                    status: 200,
                    message: 'update legality selldetail complete: true',
                    legality: legality,
                    prev: result,
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
    } else if(legality.complete === false) {
        SellDetail.findOneAndUpdate({
            _id: id,
            seller: req.userData.id,
        },{
            $set: {
                'legality.complete': legality.complete,
            }
        })
        .exec()
        .then(result => {
            if (result) {
                legality.government = result.legality.government
                legality.certificate = result.legality.certificate
                legality.contract = result.legality.contract
                res.status(200).json({
                    status: 200,
                    message: 'update legality selldetail complete: false',
                    legality: legality,
                    prev: result,
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
    } else {
        res.status(409).json({
            status: 409,
            error: 'request fail',
        })
    }
})

router.post('/deposit', checkAuth, (req, res, next) => {
    const id = req.body.id
    const deposit = {
        rest: req.body.rest,
        detail: req.body.detail,
        complete: JSON.parse(req.body.complete),
    }
    Transaction.findOneAndUpdate({
        _id: req.body.transactionid,
        seller: req.userData.id,
    },{
        $set: {
            updateTime: req.body.updateTime,
        }
    })
    .exec()
    .then(result => console.log(req.body.updateTime))
    .catch(err  => console.log(err))
    if(deposit.complete === true) {
        SellDetail.findOneAndUpdate({
            _id: id,
            seller: req.userData.id,
        },{
            $set: {
                deposit: deposit,
            }
        })
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    status: 200,
                    message: 'update deposit selldetail complete: true',
                    deposit: deposit,
                    prev: result,
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
    } else if(deposit.complete === false) {
        SellDetail.findOneAndUpdate({
            _id: id,
            seller: req.userData.id,
        },{
            $set: {
                'deposit.complete': deposit.complete,
            }
        })
        .exec()
        .then(result => {
            if (result) {
                deposit.rest = result.deposit.rest
                deposit.detail = result.deposit.detail
                res.status(200).json({
                    status: 200,
                    message: 'update deposit selldetail complete: false',
                    deposit: deposit,
                    prev: result,
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
    } else {
        res.status(409).json({
            status: 409,
            error: 'request fail',
        })
    }
})

router.post('/contract', checkAuth, (req, res, next) => {
    const id = req.body.id
    const contract = {
        datesign: req.body.datesign,
        number: req.body.number,
        image: req.body.image,
        complete: JSON.parse(req.body.complete),
    }
    Transaction.findOneAndUpdate({
        _id: req.body.transactionid,
        seller: req.userData.id,
    },{
        $set: {
            updateTime: req.body.updateTime,
        }
    })
    .exec()
    .then(result => console.log(req.body.updateTime))
    .catch(err  => console.log(err))
    if(contract.complete === true) {
        SellDetail.findOneAndUpdate({
            _id: id,
            seller: req.userData.id,
        },{
            $set: {
                contract: contract,
            }
        })
        .exec()
        .then(result => {
            deleteImageInCloudinary(result.contract.image, contract.image)
            if (result) {
                res.status(200).json({
                    status: 200,
                    message: 'update contract selldetail complete: true',
                    contract: contract,
                    prev: result,
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
    } else if(contract.complete === false) {
        SellDetail.findOneAndUpdate({
            _id: id,
            seller: req.userData.id,
        },{
            $set: {
                'contract.complete': contract.complete,
            }
        })
        .exec()
        .then(result => {
            if (result) {
                contract.datesign = result.contract.datesign
                contract.number = result.contract.number
                contract.image = result.contract.image
                res.status(200).json({
                    status: 200,
                    message: 'update contract selldetail complete: false',
                    contract: contract,
                    prev: result,
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
    } else {
        res.status(409).json({
            status: 409,
            error: 'request fail',
        })
    }
})

router.post('/confirmation', checkAuth, (req, res, next) => {
    const id = req.body.id
    const confirmation = {
        image: req.body.image,
        complete: JSON.parse(req.body.complete),
    }
    Transaction.findOneAndUpdate({
        _id: req.body.transactionid,
        seller: req.userData.id,
    },{
        $set: {
            updateTime: req.body.updateTime,
        }
    })
    .exec()
    .then(result => console.log(req.body.updateTime))
    .catch(err  => console.log(err))
    if(confirmation.complete === true) {
        SellDetail.findOneAndUpdate({
            _id: id,
            seller: req.userData.id,
        },{
            $set: {
                confirmation: confirmation,
            }
        })
        .exec()
        .then(result => {
            deleteImageInCloudinary(result.confirmation.image, confirmation.image)
            if (result) {
                res.status(200).json({
                    status: 200,
                    message: 'update confirmation selldetail complete: true',
                    confirmation: confirmation,
                    prev: result,
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
    } else if(confirmation.complete === false) {
        SellDetail.findOneAndUpdate({
            _id: id,
            seller: req.userData.id,
        },{
            $set: {
                'confirmation.complete': confirmation.complete,
            }
        })
        .exec()
        .then(result => {
            if (result) {
                confirmation.image = result.confirmation.image
                res.status(200).json({
                    status: 200,
                    message: 'update confirmation selldetail complete: false',
                    confirmation: confirmation,
                    prev: result,
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
    } else {
        res.status(409).json({
            status: 409,
            error: 'request fail',
        })
    }
})

router.post('/tax', checkAuth, (req, res, next) => {
    const id = req.body.id
    const tax = {
        seller: {
            datepay: req.body.datepay1,
            place: req.body.place1,
            amountmoney: req.body.amountmoney1,
        },
        buyer: {
            datepay: req.body.datepay2,
            place: req.body.place2,
            amountmoney: req.body.amountmoney2,
        },
        complete: JSON.parse(req.body.complete),
    }
    Transaction.findOneAndUpdate({
        _id: req.body.transactionid,
        seller: req.userData.id,
    },{
        $set: {
            updateTime: req.body.updateTime,
        }
    })
    .exec()
    .then(result => console.log(req.body.updateTime))
    .catch(err  => console.log(err))
    if(tax.complete === true) {
        SellDetail.findOneAndUpdate({
            _id: id,
            seller: req.userData.id,
        },{
            $set: {
                tax: tax,
            }
        })
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    status: 200,
                    message: 'update tax selldetail complete: true',
                    tax: tax,
                    prev: result,
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
    } else if(tax.complete === false) {
        SellDetail.findOneAndUpdate({
            _id: id,
            seller: req.userData.id,
        },{
            $set: {
                'tax.complete': tax.complete,
            }
        })
        .exec()
        .then(result => {
            if (result) {
                tax.seller.datepay = result.tax.seller.datepay
                tax.seller.place = result.tax.seller.place
                tax.seller.amountmoney = result.tax.seller.amountmoney
                tax.buyer.datepay = result.tax.buyer.datepay
                tax.buyer.place = result.tax.buyer.place
                tax.buyer.amountmoney = result.tax.buyer.amountmoney
                res.status(200).json({
                    status: 200,
                    message: 'update tax selldetail complete: false',
                    tax: tax,
                    prev: result,
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
    } else {
        res.status(409).json({
            status: 409,
            error: 'request fail',
        })
    }
})

router.post('/delivery', checkAuth, (req, res, next) => {
    const id = req.body.id
    const delivery = {
        datecomplete: req.body.datecomplete,
        apartmentcode: req.body.apartmentcode,
        room: req.body.room,
        datein: req.body.datein,
        tax: req.body.tax,
        complete: JSON.parse(req.body.complete),
    }
    Transaction.findOneAndUpdate({
        _id: req.body.transactionid,
        seller: req.userData.id,
    },{
        $set: {
            updateTime: req.body.updateTime,
        }
    })
    .exec()
    .then(result => console.log(req.body.updateTime))
    .catch(err  => console.log(err))
    if(delivery.complete === true) {
        SellDetail.findOneAndUpdate({
            _id: id,
            seller: req.userData.id,
        },{
            $set: {
                delivery: delivery,
            }
        })
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    status: 200,
                    message: 'update delivery selldetail complete: true',
                    delivery: delivery,
                    prev: result,
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
    } else if(delivery.complete === false) {
        SellDetail.findOneAndUpdate({
            _id: id,
            seller: req.userData.id,
        },{
            $set: {
                'delivery.complete': delivery.complete,
            }
        })
        .exec()
        .then(result => {
            if (result) {
                delivery.datecomplete = result.delivery.datecomplete
                delivery.apartmentcode = result.delivery.apartmentcode
                delivery.room = result.delivery.room
                delivery.datein = result.delivery.datein
                delivery.tax = result.delivery.tax
                res.status(200).json({
                    status: 200,
                    message: 'update tax selldetail complete: false',
                    delivery: delivery,
                    prev: result,
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
    } else {
        res.status(409).json({
            status: 409,
            error: 'request fail',
        })
    }
})

router.post('/transfer', checkAuth, (req, res, next) => {
    const id = req.body.id
    const transfer = {
        image: req.body.image,
        complete: JSON.parse(req.body.complete),
    }
    Transaction.findOneAndUpdate({
        _id: req.body.transactionid,
        seller: req.userData.id,
    },{
        $set: {
            updateTime: req.body.updateTime,
        }
    })
    .exec()
    .then(result => console.log(req.body.updateTime))
    .catch(err  => console.log(err))
    if(transfer.complete === true) {
        SellDetail.findOneAndUpdate({
            _id: id,
            seller: req.userData.id,
        },{
            $set: {
                transfer: transfer,
            }
        })
        .exec()
        .then(result => {
            deleteImageInCloudinary(result.transfer.image, transfer.image)
            if (result) {
                res.status(200).json({
                    status: 200,
                    message: 'update transfer selldetail complete: true',
                    transfer: transfer,
                    prev: result,
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
    } else if(transfer.complete === false) {
        SellDetail.findOneAndUpdate({
            _id: id,
            seller: req.userData.id,
        },{
            $set: {
                'transfer.complete': transfer.complete,
            }
        })
        .exec()
        .then(result => {
            if (result) {
                transfer.image = result.transfer.image
                res.status(200).json({
                    status: 200,
                    message: 'update transfer selldetail complete: false',
                    transfer: transfer,
                    prev: result,
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
    } else {
        res.status(409).json({
            status: 409,
            error: 'request fail',
        })
    }
})

module.exports = router
