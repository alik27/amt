const {Params} = require('../models/models')
const ApiError = require('../error/ApiError')
const { Op } = require("sequelize");

class ParamsController {
    async create (req, res, next) {
        const {name, value} = req.body
        if(!name || !value) {
            return next(ApiError.badRequest('Некорректный наименование или значение параметра'))
        }
        const unique = await Params.findOne({where: {name}})
        if(unique) {
            return next(ApiError.badRequest('Данный параметр уже существует'))
        }
        const params = await Params.create({name, value})
        return res.json(params)
    }
    
    async update (req, res, next) {
        const {name, value} = req.body
        if(!name || !value) {
            return next(ApiError.badRequest('Некорректный наименование или значение параметра'))
        }
        const unique = await Params.findOne({where: {name, value: {[Op.ne]: value}}})
        if(!unique) {
            return next(ApiError.badRequest('Параметр не найден'))
        }
        const params = await Params.update({value},{where: {id: unique.id}})
        if(params) {
            return res.json({success: true})
        }
        return res.json({success: false})
    }

    async delete (req, res, next) {
        const {name} = req.body
        if(!name) {
            return next(ApiError.badRequest('Некорректный наименование или значение параметра'))
        }
        const unique = await Params.findOne({where: {name}})
        if(!unique) {
            return next(ApiError.badRequest('Параметр не найден'))
        }
        const params = await Params.destroy({where: {id: unique.id}})
        if(params) {
            return res.json({success: true})
        }
        return res.json({success: false})
    }

    async getAll (req, res, next) {
        const params = await Params.findAll()
        return res.json(params)
    }

    async getOne (req, res, next) {
        const {id} = req.params
        const params = await Params.findAll({where: {id}})
        return res.json(params)
    }
}

module.exports = new ParamsController