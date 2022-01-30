const { getData, createOrUpdateData } = require('../utils/functions')
const xlsxPopulate = require('xlsx-populate')
const financialServices = require('../services/financial.services')
const { v4: uuidv4 } = require('uuid');
module.exports = {
    async insertFinancialData(req, res) {
        /*        
        #swagger.tags = ['Financial']
        #swagger.auto = false
        #swagger.path = '/financial/{userId}'
        #swagger.method = 'post'
        #swagger.description = 'Endpoint for Insert financial data'
        #swagger.consumes = ['multipart/form-data'] 
        #swagger.parameters['userId'] = {
            in: 'path',
            description: 'User id to create or update Financial Data.',
            required: true,
            type: 'integer'
        } 
        #swagger.parameters['file'] = {
              in: 'formData',
              type: 'file',
              name: 'financialData',
              required: 'true',
              description: 'Xlsx archive with the following columns (or first row) in the order presented: price-typesofexpenses-date-name',
              accept: '/',
        } 
        */
        let extensionValidation = req.file.originalname.split('.')
        // #swagger.responses [400] = { description: 'Invalid file extension. Only accepts files with the xlsx extension.' }
        if(extensionValidation[extensionValidation.length -1] !== "xlsx") return res.status(400).send({ message: `Invalid file extension. Only accepts files with the xlsx extension` })
        const xlsxFinancialData = await xlsxPopulate.fromDataAsync(req.file.buffer)
        const { userId } = req.params
        const rows = xlsxFinancialData.sheet(0).usedRange().value()
        const firstRow = rows[0]
        const validateXlsx = await financialServices.finalcialFieldsVerify(firstRow)
        // #swagger.responses [422] = { description: 'The fields of the file is not valid. The correct sequence of columns is: price-typesofexpenses-date-name. No other columns besides these will be accepted.' }
        if (validateXlsx) return res.status(422).send({ message: `${validateXlsx.message}` })
        rows.shift()
        //verifica se usuario existe
        const userData = getData('user.json')
        const user = userData.find(user => user.id === Number(userId))
        // #swagger.responses [404] = { description: 'User not found.' }
        if (!user) return res.status(404).send({ message: `User ID not found!` })
        const accountData = getData('financial.json')
        // verifica se a conta existe
        const financial = accountData.find(financial => financial.userId === Number(userId))
        if (financial) {
            const financialData = await financialServices.financialObjectGen(rows)
            // insere novos dados no financialData
            financial.financialData.push(...financialData)
            createOrUpdateData('financial.json', financial, financial.id)
            // #swagger.responses [200] = { description: 'Financial data updated.' }
            return res.status(200).send({ message: `Financial Data for account ${financial.id} successfully updated` })
        } else {
            const financialData = await financialServices.financialObjectGen(rows)
            createOrUpdateData('financial.json', { userId: Number(userId), financialData })
            // #swagger.responses [200] = { description: 'Financial data created.' }
            return res.status(200).send({ message: `User ${user.name} opened an account at conta365 bank. 😃` })

        }

    },
    async deleteFinancialData(req, res) {
        /*        
        #swagger.tags = ['Financial']
        #swagger.auto = false
        #swagger.path = '/financial/{userId}/{financialId}'
        #swagger.method = 'delete'
        #swagger.description = 'Endpoint for delete financial data by userId and financialId'
        #swagger.parameters['userId'] = {
            in: 'path',
            description: 'User ID for location of financial data',
            example: '12',
            required: 'true',
            type: 'integer'
        }
        #swagger.parameters['financialId'] = {
            in: 'path',
            description: 'Financial ID for location of financial data to delete',
            required: 'true',
            example: '649695277368',
            type: 'number'
        }
        */

        try {
            const { userId, financialId } = req.params
            console.log(!Number(userId))
            // #swagger.responses [422] = { description: 'Invalid format for userId (Only accepts Number(INT)).' }
            if (!Number(userId)) return res.status(422).send({ message: `Invalid format for userId` })
            // #swagger.responses [422] = { description: 'Invalid format for financialId (Only accepts Number(INT)).' }
            if (!financialId || financialId.toString().length < 8) return res.status(422).send({ message: `Invalid format for financialId` })
            const financialData = getData('financial.json')
            const financial = financialData.find(financial => financial.userId === Number(userId))
            // #swagger.responses [404] = { description: 'Financial data for this userID not found.' }
            if (!financial) return res.status(404).send({ message: `UserID not found!` })
            const financialDataId = financial.financialData.find(financialData => financialData.id === Number(financialId))
            // #swagger.responses [404] = { description: 'Financial data not found.' }
            if (!financialDataId) return res.status(404).send({ message: `Financial ID not found!` })
            financial.financialData.splice(financial.financialData.indexOf(financialDataId), 1)
            createOrUpdateData('financial.json', financial, financial.id)
            // #swagger.responses [200] = { description: 'Financial data deleted.' }
            return res.status(200).send({ message: `Financial Data for account ${userId} successfully deleted` })
        } catch (err) {
            return res.status(400).send({ message: `UserID and FinancialID are required!` })
        }
    },
    async getFinancialDataByDate(req, res) {
        /*        
        #swagger.tags = ['Financial']
        #swagger.auto = false
        #swagger.path = '/financial/{userId}/{date}'
        #swagger.method = 'get'
        #swagger.description = 'Endpoint for get financial data by userId and months/years'
        #swagger.parameters['userId'] = {
            in: 'path',
            description: 'User ID for location of financial data',
            required: 'true',
            type: 'integer'
        }
        #swagger.parameters['query'] = {
            in: 'query',
            name: 'typesOfExpenses',
            description: 'typesOfExpenses, filter by typesOfExpenses',
            example: 'Mercado',
            required: 'false',
            type: 'string'
        }
        */
        try {
            const { userId } = req.params
            const { typesOfExpenses } = req.query
            // #swagger.responses [422] = { description: 'Invalid format for userId (Only accepts Number(INT)).' }
            if (!Number(userId)) return res.status(422).send({ message: `Invalid format for userId` })
            const financialData = getData('financial.json')
            const financial = financialData.find(financial => financial.userId === Number(userId))
            // #swagger.responses [404] = { description: 'Financial data for this userID not found!' }
            if (!financial) return res.status(404).send({ message: `Financial data for this ID not found!` })
            const financialDataByDate = await financialServices.financialByDateGen(financial, typesOfExpenses)
            // #swagger.responses [200] = { description: 'No registry found for this filter.' }
            if (Object.keys(financialDataByDate).length === 0) return res.status(200).send({ message: `No registry found for this filter.` })
            // #swagger.responses [200] = { description: 'Financial data by date and/or query.' }
            return res.status(200).send({ ...financialDataByDate })
        } catch (err) {
            return res.status(422).send({ message: `UserID and Date are required! ${err.message}` })
        }
    }
}


