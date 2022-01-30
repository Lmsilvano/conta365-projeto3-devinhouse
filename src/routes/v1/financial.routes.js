const express = require('express')
const financialRoutes = express.Router()
const financialController = require('../../controllers/financialController')
const multer = require('multer')
const upload = multer()
financialRoutes.post('/v1/finance/:userId', upload.single('financialData'), financialController.insertFinancialData)
financialRoutes.delete('/v1/finance/:userId/:financialId', financialController.deleteFinancialData)
financialRoutes.get('/v1/finance/:userId', financialController.getFinancialDataByDate)


module.exports = financialRoutes
