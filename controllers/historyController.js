const {History, Params, Checkpoint} = require('../models/models')
const ApiError = require('../error/ApiError')
const fs = require('fs');

const splitTrim = (id, name, string) => {
    string = string.split(name)
    if(!string) return false
    string = string[id]
    if(!string) return false
    return string.trim()
}

const insertHistory = async (fileContent, element) => {
    fileContent = fileContent.split('\r\n')
    fileContent.forEach(async (string) => {
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
    })
}

const readStreamFile = (checkpoints, stream_path) => {
    checkpoints.forEach(element => {
        let fileContent = fs.readFileSync(stream_path.value + '/' + element.name + '/recognition.txt', 'utf8')
        if (!fileContent) {
            return next(ApiError.badRequest('Проблема чтения файла'))
        }
        insertHistory(fileContent, element)
    })
}

class HistoryController {
    async read (req, res, next) {
        const stream_path = await Params.findOne({where: {name: "stream_path"}})
        if(!stream_path) {
            return next(ApiError.badRequest('Не найден путь к файлу'))
        }
        const checkpoints = await Checkpoint.findAll()
        if(!checkpoints) {
            return next(ApiError.badRequest('Не найдены КПП'))
        }
        readStreamFile(checkpoints, stream_path)
        return res.json({success: true})
    }

    async getAll (req, res, next) {
        let {limit, page} = req.query
        page = Number(page) || 1
        limit = Number(limit) || 10
        let offset = page * limit - limit
        const history = await History.findAndCountAll({limit, offset})
        return res.json(history)
    }

    async getOne (req, res, next) {
        const {id} = req.params
        const history = await History.findOne({where: {id}})
        return res.json(history)
    }
}

module.exports = new HistoryController