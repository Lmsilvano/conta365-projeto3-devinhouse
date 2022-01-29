const { getData, createOrUpdateData } = require('../utils/functions')
const userServices = require('../services/user.services')
const axios = require('axios')
module.exports = {
    async create(req, res) {

        /*  
        #swagger.tags = ['User']    
        #swagger.auto = false
        #swagger.path = '/user'
        #swagger.method = 'post'
        #swagger.produces = ['application/json']
        #swagger.consumes = ['application/json']
        #swagger.description = 'Endpoint for create a new user'
        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Data For user create.',
            required: true,
            schema: {
                name: "Test User",
                email: "test.user@email.com"
            }
        }
        */
        const validateFilters = await userServices.fieldsVerify(req.body)
        // #swagger.responses[422] = { description: 'Some field was not filled in correctly (with strings, or was left blank) or some field besides name and email was sent in the request.' }
        if (validateFilters) return res.status(422).send({ message: `${validateFilters.message}` })
        createOrUpdateData('user.json', req.body)
        // #swagger.responses[201] = { description: 'User registered successfully.' }
        return res.status(200).send({ message: `User ${req.body.name} successfully created! 😃` })

    },
    async updateOneUser(req, res) {
        /*
        #swagger.tags = ['User']
        #swagger.auto = false
        #swagger.path = '/users/{id}'
        #swagger.method = 'patch'
        #swagger.produces = ['application/json']
        #swagger.consumes = ['application/json']
        #swagger.description = 'Endpoint for update a user by ID'
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'User id to update.',
            required: true,
            type: 'integer'
        }
    
        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'User data for update',
            required: true,
            schema: {
                name: "Test UpdateUser",
                email: "test.update@email.com"
            }
        }
        */
        const { id } = req.params
        const validateFilters = await userServices.fieldsVerify(req.body)
        // #swagger.responses[422] = { description: 'Some field was not filled in correctly (with strings, or was left blank) or some field besides name and email was sent in the request.' }
        if (validateFilters) return res.status(422).send({ message: `${validateFilters.message}` })
        const users = getData('user.json')
        const existUser = users.find((item) => item.id === Number(id))
        // #swagger.responses[404] = { description: 'User ID not found.' }
        if (!existUser) res.status(404).send({ message: "User id not found" })
        await createOrUpdateData('user.json', req.body, Number(id))
        // #swagger.responses[200] = { description: 'User successfully updated' }
        return res.status(200).send({ message: `User ${existUser.name} successfully updated.` })
    },
    async getOneUser(req, res) {
        /*
        #swagger.tags = ['User']
        #swagger.auto = false
        #swagger.description = 'Endpoint for get a user by ID'
            #swagger.parameters['id'] = {
            in: 'path',
            description: 'Searched user id.',
            required: true,
            type: 'integer'
        }
        */
        const { id } = req.params
        const users = getData('user.json')
        const existUser = users.find((item) => item.id === Number(id))
        if (!existUser) res.status(404).send({ message: "User id not found" })
        return res.status(200).send({ user: existUser })
    },
    async populateDb(req, res) {
        try {
            const response = await axios.get('https://random-data-api.com/api/users/random_user?size=35')
            response.data.map((item) => {
                return createOrUpdateData('user.json', { name: `${item.first_name} ${item.last_name}`, email: item.email })
            })
            return res.status(200).send({ message: 'Database de usuários povoado com sucesso.' })
        } catch (error) {
            return res.status(400).json({ error: error.message })
        }
    }

}