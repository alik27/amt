const {History, Description} = require('../models/models')
const ApiError = require('../error/ApiError')
const {Op} = require('sequelize')
const fs = require('fs');

const filterHistory = async (checkpoints) => {
    let entryType = [], exitType = [];
    checkpoints.forEach(element => {
        if(element.type == 1) {
            entryType.push({checkpointId: element.id})
        } else {
            exitType.push({checkpointId: element.id})
        }
    })

    const entryAll = await History.findAll({attributes: ['id', 'date', 'number'], where: {[Op.or]: entryType}})
    const exitAll = await History.findAll({attributes: ['id', 'date'], where: {[Op.or]: exitType}})
    const descriptionSql = await Description.findAll({attributes: ['id', 'number']})

    const descriptionAll = await filterDescription(descriptionSql)

    //return descriptionSql
    return filterEntryExit(entryAll, exitAll, descriptionAll)
}

const plusHour = (date, hour) => {
    return new Date(new Date(date).getTime() + hour * 60 * 60 * 1000)
}
const minusHour = (date, hour) => {
    return new Date(new Date(date).getTime() - hour * 60 * 60 * 1000)
}

const filterDescription = async (description) => {
    let descriptionAll = [];
    description.forEach(element => {
        descriptionAll[element.number] = element.id
    })
    return descriptionAll
}

const filterEntryExit = async (entryAll, exitAll, descriptionAll) => {
    let all = []
    entryAll.forEach(entryElement => {
        let tmp = {}
        tmp.historyId = entryElement.id
        if(descriptionAll[entryElement.number]) {
            tmp.descriptionId = descriptionAll[entryElement.number]
        }
        exitAll.forEach(exitElement => {
            if(exitElement.date >= minusHour(entryElement.date,1) && exitElement.date <= plusHour(entryElement.date,1)) {
                tmp.historyId_exit = exitElement.id
            }
        })
        all.push(tmp)
    })
    return all
}

const splitTrim = (id, name, string) => {
    string = string.split(name)
    if(!string) return false
    string = string[id]
    if(!string) return false
    return string.trim()
}

const insertHistory = async (fileContent, element) => {
    fileContent = fileContent.split('\r\n')
    for (let index = 0; index < fileContent.length; index++) {
        string = fileContent[index]
        if(!string) return false
        string = string.trim();
        const date = splitTrim(0, 'number:', string);
        const number = splitTrim(0, ',', splitTrim(1, 'number:', string));
        const image = splitTrim(1, 'direction:', string);
        if (date && number) {
            const history = await History.findOne({ where: {checkpointId: element.id ,date: date, number: number} });
            if (!history) {
                const result = await History.create({checkpointId: element.id ,date: date, number: number, image: image});
            }
        }
    }
}

const readStreamFile = async (checkpoints, stream_path) => {
    for (let index = 0; index < checkpoints.length; index++) {
        element = checkpoints[index]
        let fileContent = fs.readFileSync(stream_path.value + '/' + element.name + '/recognition.txt', 'utf8')
        if (!fileContent) {
            return next(ApiError.badRequest('Проблема чтения файла'))
        }
        await insertHistory(fileContent, element)
    }
    return true
}

module.exports = {
    filterEntryExit, filterDescription, plusHour, minusHour, splitTrim, insertHistory, readStreamFile, filterHistory
};