const router = require('express').Router()
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./../swagger.json')
 

router.use('/', swaggerUi.serve)
const options = {
    explorer : false,
    
  }
router.get('/', swaggerUi.setup(swaggerDocument,options))
module.exports = router