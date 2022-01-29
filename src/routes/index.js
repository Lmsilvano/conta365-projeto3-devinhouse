const express = require('express')
const routes = express.Router()
const financialRoutes = require('./v1/financial.routes')
const userRoutes = require('./v1/user.routes')

routes.use('/api', [financialRoutes, userRoutes])


module.exports = routes