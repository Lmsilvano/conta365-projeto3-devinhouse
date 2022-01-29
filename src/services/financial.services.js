const { getData } = require('../utils/functions')

module.exports = {
    async finalcialFieldsVerify(firstXlsxRow, allXlsxRows) {
        let keys = ['price', 'typesofexpenses', 'date', 'name']
        let rowStringify = firstXlsxRow.map((item) => item === undefined ? 'null' : item)
        let firstRowValidate = rowStringify.filter((item, i) => item.toLowerCase().trim() === keys[i])

        if (firstRowValidate.length !== keys.length || firstXlsxRow.length !== keys.length) {
            return response = { message: `The fields of the file is not valid. The correct sequence of columns is: ${keys.join(', ')}. No other columns besides these will be accepted.` }
        } else return false
    },
    async financialObjectGen(rows) {
        let financialDataGen = []
        await rows.map((item) => financialDataGen.push({
            id: Math.floor(Date.now() * Math.random(7)),
            price: item[0] === undefined ? 'Null' : item[0],
            typesofexpenses: item[1] === undefined ? 'Null' : item[1],
            date: item[2] === undefined ? 'Null' : item[2],
            name: item[3] === undefined ? 'Null' : item[3]
        }))
        return financialDataGen;
    },
    async financialByDateGen(financial, typesOfExpenses = false) {
        const mounths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let years = {}
        if (!typesOfExpenses) {
            await financial.financialData.map((item) => {
                let date = new Date(item.date.trim())
                let year = date.getFullYear()
                const month = date.getMonth()
                if (!years[year]) {
                    years[year] = {}
                    years[year][mounths[month]] = Number(item.price)
                } else if (years[year]) {
                    if (years[year][mounths[month]]) {
                        return years[year][mounths[month]] += Number(item.price)
                    } else return years[year][mounths[month]] = Number(item.price)
                }
            })
            return years
        } else {
            await financial.financialData.map((item) => {
                console.log('pelo menos entrou aqui', item.typesofexpenses === typesOfExpenses)
                if (item.typesofexpenses === typesOfExpenses) {
                    let date = new Date(item.date.trim())
                    let year = date.getFullYear()
                    const month = date.getMonth()
                    if (!years[year]) {
                        years[year] = {}
                        years[year][mounths[month]] = Number(item.price)
                    } else if (years[year]) {
                        if (years[year][mounths[month]]) {
                            return years[year][mounths[month]] += Number(item.price)
                        } else return years[year][mounths[month]] = Number(item.price)
                    }
                } else return
            })
            return years
        }
    }

}

