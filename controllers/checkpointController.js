const {Checkpoint} = require('../models/models')
const ApiError = require('../error/ApiError')

class CheckpointController {
    async create (req, res, next) {
        const {type, name} = req.body
        if(!type || !name || typeof type !== 'number' || typeof name !== 'string') {
            return next(ApiError.badRequest('Некорректный тип или наименование КПП'))
        }
        const unique = await Checkpoint.findOne({where: {name}})        
        if(unique) {
            return next(ApiError.badRequest('Данный КПП уже существует'))
        }
        const checkpoint = await Checkpoint.create({type, name})
        
        if(!checkpoint) {
            return res.json({success: false})
        }
        return res.json(checkpoint)
    }

    async delete (req, res, next) {
        const {name} = req.body
        if(!name || typeof name !== 'string') {
            return next(ApiError.badRequest('Некорректное наименование КПП'))
        }
        const unique = await Checkpoint.findOne({where: {name}})
        if(!unique) {
            return next(ApiError.badRequest('КПП не найден'))
        }
        const checkpoint = await Checkpoint.destroy({where: {id: unique.id}})
        if(checkpoint) {
            return res.json({success: true})
        }
        return res.json({success: false})
    }

    async getAll (req, res, next) {
        const checkpoint = await Checkpoint.findAll()
        return res.json(checkpoint)
    }

    async getOne (req, res, next) {
        const {id} = req.params
        const checkpoint = await Checkpoint.findOne({where: {id}})
        return res.json(checkpoint)
    }
}

module.exports = new CheckpointController