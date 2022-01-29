const { getData } = require('../utils/functions')

module.exports = {
    async fieldsVerify({ name = '', email = '', ...nonexistentFields }) {
        let filters = { name, email }
        const filtersValidation = Object.keys(filters).filter((item) => !filters[item])
        if (filtersValidation.length > 0) {
            return response = { message: `the following field(s) must be filled: ${filtersValidation.join(', ')}` }
        } else if (typeof name !== 'string' || typeof email !== 'string') {
            return response = { message: 'name and email must be text (strings)' }
        } else if (Object.keys(nonexistentFields).length > 0) {
            return response = { message: 'the following field(s) does not exist: ' + Object.keys(nonexistentFields).join(', ') }
        } else return false
    }

}