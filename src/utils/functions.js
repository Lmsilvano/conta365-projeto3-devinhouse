const fileSystem = require('fs');

function getData(fileName) {
    try {
        const result = JSON.parse(fileSystem.readFileSync('src/database/' + fileName, 'utf8'));
        return result
    }
    catch (err) {
        return []
    }
}

async function createOrUpdateData(fileName, data, updateDb = false) {

    if (!updateDb) {
        // Criação de novo dado
        const actualDb = getData(fileName)
        const newDb = !actualDb ? [{ id: 1, ...data }] : [...actualDb, { id: actualDb.length + 1, ...data }]
        return fileSystem.writeFileSync('src/database/' + fileName, JSON.stringify(newDb));
    }
    else {
        // Atualização de dados existentes
        const actualDb = getData(fileName)
        const newDb = actualDb.map((item) => {
            if (item.id === Number(updateDb)) {
                return { ...item, ...data }
            }
            else {
                return { ...item }
            }
        })
        return fileSystem.writeFileSync('src/database/' + fileName, JSON.stringify(newDb));
    }

}

module.exports = {
    getData,
    createOrUpdateData
}