const {History, Params, Checkpoint, HistoryDescription} = require('../models/models')
const ApiError = require('../error/ApiError')
const historyService = require('../service/historyService')
const { Sequelize } = require('../db')

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
        await historyService.readStreamFile(checkpoints, stream_path)
        await HistoryDescription.destroy({
            truncate: true
        })
        const all = await historyService.filterHistory(checkpoints)
        const result = await HistoryDescription.bulkCreate(all)
        return res.json({success: result})
    }

    async getAll (req, res, next) {
        let {limit, page} = req.query
        page = Number(page) || 1
        limit = Number(limit) || 1000
        let offset = page * limit - limit
        const history = await History.findAll({limit, offset,
            attributes: [
                'id',
                'date',
                'number',
                'image',
                'createdAt',
                'updatedAt',
                //[Sequelize.literal('checkpoint.type'), "checkpointType"],
                [Sequelize.literal('checkpoint.name'), "checkpointName"],
            ],
            include: [
                {model: Checkpoint, required: false},
            ],
        })

        history.forEach(obj => {
            let checkpointType = (obj.checkpoint.type == 1 ? "Въезд" : "Выезд")
            obj.setDataValue('checkpointType', checkpointType);
        });

        return res.json(history)
    }

    async getOne (req, res, next) {
        const {id} = req.params
        const history = await History.findOne({where: {id}})
        return res.json(history)
    }
}

module.exports = new HistoryController