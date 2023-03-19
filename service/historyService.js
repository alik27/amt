const {History, Description} = require('../models/models')
const ApiError = require('../error/ApiError')
const {Op} = require('sequelize')
const fs = require('fs');

class HistoryService {
    async filterHistory (checkpoints) {
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
    
        const descriptionAll = await this.filterDescription(descriptionSql)
    
        //return descriptionSql
        return this.filterEntryExit(entryAll, exitAll, descriptionAll)
    }

    plusHour (date, hour) {
        return new Date(new Date(date).getTime() + hour * 60 * 60 * 1000)
    }
    minusHour (date, hour) {
        return new Date(new Date(date).getTime() - hour * 60 * 60 * 1000)
    }
    async filterDescription (description) {
        let descriptionAll = [];
        description.forEach(element => {
            descriptionAll[element.number] = element.id
        })
        return descriptionAll
    }
    async filterEntryExit (entryAll, exitAll, descriptionAll) {
        let all = []
        entryAll.forEach(entryElement => {
            let tmp = {}
            tmp.historyId = entryElement.id
            if(descriptionAll[entryElement.number]) {
                tmp.descriptionId = descriptionAll[entryElement.number]
            }
            exitAll.forEach(exitElement => {
                if(exitElement.date >= this.minusHour(entryElement.date,1) && exitElement.date <= this.plusHour(entryElement.date,1)) {
                    tmp.historyId_exit = exitElement.id
                }
            })
            all.push(tmp)
        })
        return all
    }

    splitTrim (id, name, string) {
        string = string.split(name)
        if(!string) return false
        string = string[id]
        if(!string) return false
        return string.trim()
    }
    
    async insertHistory (fileContent, element) {
        fileContent = fileContent.split('\r\n')
        for (let index = 0; index < fileContent.length; index++) {
            let string = fileContent[index]
            if(!string) return false
            string = string.trim();
            const date = this.splitTrim(0, 'number:', string);
            const number = this.splitTrim(0, ',', this.splitTrim(1, 'number:', string));
            const image = this.splitTrim(1, 'direction:', string);
            if (date && number) {
                const history = await History.findOne({ where: {checkpointId: element.id ,date: date, number: number} });
                if (!history) {
                    const result = await History.create({checkpointId: element.id ,date: date, number: number, image: image});
                }
            }
        }
    }
    
    async readStreamFile (checkpoints, stream_path) {
        for (let index = 0; index < checkpoints.length; index++) {
            let element = checkpoints[index]
            let fileContent = fs.readFileSync(stream_path.value + '/' + element.name + '/recognition.txt', 'utf8')
            if (!fileContent) {
                return next(ApiError.badRequest('Проблема чтения файла'))
            }
            await this.insertHistory(fileContent, element)
        }
        return true
    }
}

module.exports = new HistoryService
