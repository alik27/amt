const {Description} = require('../models/models')
const ApiError = require('../error/ApiError')
const descriptionService = require('../service/descriptionService')

class DescriptionController {
    async create (req, res, next) {
        const {number, brand, series, pass_number, pass_type, belonging, name_inventory_items, weight_inventory_items, full_name_inventory_items} = req.body
        if(descriptionService.typeofValidAll(number, brand, series, pass_number, pass_type, belonging, name_inventory_items, weight_inventory_items, full_name_inventory_items)) {
            return next(ApiError.badRequest('Описание введено некорректно'))
        }
        const unique = await Description.findOne({where: {number}})
        if(unique) {
            return next(ApiError.badRequest('Описание по этому номеру уже существует'))
        }
        const description = await Description.create({number, brand, series, pass_number, pass_type, belonging, name_inventory_items, weight_inventory_items, full_name_inventory_items})
        if(!description) {
            return res.json({success: false})
        }
        return res.json(description)
    }

    async edit (req, res, next) {
        const {number, brand, series, pass_number, pass_type, belonging, name_inventory_items, weight_inventory_items, full_name_inventory_items} = req.body
        if(descriptionService.typeofValidAll(number, brand, series, pass_number, pass_type, belonging, name_inventory_items, weight_inventory_items, full_name_inventory_items)) {
            return next(ApiError.badRequest('Описание введено некорректно'))
        }
        const unique = await Description.findOne({where: {number}})
        if(!unique) {
            return next(ApiError.badRequest('Описание по этому номеру не найдено'))
        }
        const description = await Description.update({number, brand, series, pass_number, pass_type, belonging, name_inventory_items, weight_inventory_items, full_name_inventory_items}, {where: {id: unique.id}})
        if(!description) {
            return res.json({success: false})
        }
        return res.json({success: true})
    }

    async delete (req, res, next) {
        const {id} = req.params
        if(!id) {
            return next(ApiError.badRequest('Некорректный идентификатор описания'))
        }
        const unique = await Description.findOne({where: {id}})
        if(!unique) {
            return next(ApiError.badRequest('Описание не найдено'))
        }
        const description = await Description.destroy({where: {id: unique.id}})
        if(description) {
            return res.json({success: true})
        }
        return res.json({success: false})
    }

    async getAll (req, res, next) {
        let {limit, page} = req.query
        page = Number(page) || 1
        limit = Number(limit) || 10
        let offset = page * limit - limit
        const description = await Description.findAndCountAll({limit, offset})
        return res.json(description)
    }

    async getOne (req, res, next) {
        const {id} = req.params
        const description = await Description.findOne({where: {id}})
        return res.json(description)
    }
}

module.exports = new DescriptionController