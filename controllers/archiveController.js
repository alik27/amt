const {Archive, HistoryDescription, History, Description} = require('../models/models')
const ApiError = require('../error/ApiError')

class ArchiveController {
    async create (req, res, next) {
        const {id} = req.params
        if(!id) {
            return next(ApiError.badRequest('Некорректный идентификатор'))
        }
        const check = await Archive.findOne({where: {id}})
        if(check) {
            return next(ApiError.badRequest('Запись уже в архиве'))
        }
        const unique = await HistoryDescription.findOne({
            where: {id},
            include: [
                {model: History, as: "entryId", attributes: ['id', 'date', 'image'], required: false},
                {model: History, as: "exitId", attributes: ['id', 'date', 'image'], required: false},
                {model: Description, as: "description", required: false}
            ],
        })
        if(!unique) {
            return next(ApiError.badRequest('Идентификатор не найден'))
        }
        let number = null
        if(unique.description && unique.description.number) {
            number = unique.description.number
        } else if(unique.entryId && unique.entryId.number) {
            number = unique.entryId.number
        } else if(unique.exitId && unique.exitId.number) {
            number = unique.exitId.number
        }
        const archive = await Archive.create({
            number: number, 
            brand: unique.description.brand, 
            series: unique.description.series, 
            pass_number: unique.description.pass_number, 
            pass_type: unique.description.pass_type, 
            belonging: unique.description.belonging, 
            name_inventory_items: unique.description.name_inventory_items, 
            weight_inventory_items: unique.description.weight_inventory_items, 
            full_name_inventory_items: unique.description.full_name_inventory_items,
            entrance_date: unique.entryId.date,
            entrance_image: unique.entryId.image, 
            exit_date: unique.exitId.date, 
            exit_image: unique.exitId.image
        })

        if(unique && unique.description && unique.description.id) await Description.destroy({where: {id: unique.description.id}})
        if(unique && unique.entryId && unique.entryId.id) await History.destroy({where: {id: unique.entryId.id}})
        if(unique && unique.exitId && unique.exitId.id) await History.destroy({where: {id: unique.exitId.id}})
        if(unique && unique.id) await HistoryDescription.destroy({where: {id: unique.id}})
        
        if(!archive) {
            return res.json({success: false})
        }
        return res.json(archive)
    }

    async delete (req, res, next) {
        const {id} = req.params
        if(!id || typeof id !== 'number') {
            return next(ApiError.badRequest('Некорректный идентификатор'))
        }
        const unique = await Archive.findOne({where: {id}})
        if(!unique) {
            return next(ApiError.badRequest('Идентификатор не найден'))
        }
        const archive = await Archive.destroy({where: {id: unique.id}})
        if(archive) {
            return res.json({success: true})
        }
        return res.json({success: false})
    }

    async getAll (req, res, next) {
        let {limit, page} = req.query
        page = Number(page) || 1
        limit = Number(limit) || 10
        let offset = page * limit - limit
        const archive = await Archive.findAndCountAll({limit, offset})
        return res.json(archive)
    }

    async getOne (req, res, next) {
        const {id} = req.params
        const archive = await Archive.findOne({where: {id}})
        return res.json(archive)
    }
}

module.exports = new ArchiveController