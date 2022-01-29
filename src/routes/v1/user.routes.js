const express = require('express')
const userRoutes = express.Router()
const userController = require('../../controllers/userController')

userRoutes.post('/v1/user', userController.create)
userRoutes.get('/v1/user/:id', userController.getOneUser)
userRoutes.patch('/v1/user/:id', userController.updateOneUser)
userRoutes.post('/v1/userDbPopulate', userController.populateDb)

module.exports = userRoutes