const {Archive, HistoryDescription, History, Description} = require('../models/models')
const ApiError = require('../error/ApiError')
const archiveService = require('../service/archiveService')

class ArchiveController {
    async create (req, res, next) {
        const {id} = req.params
        if(!id) {
            return next(ApiError.badRequest('Некорректный идентификатор'))
        }
        const check = await HistoryDescription.findOne({where: {id}})
        if(!check) {
            return next(ApiError.badRequest('Запись уже в архиве'))
        }
        const unique = await archiveService.searchId(id)
        if(!unique) {
            return next(ApiError.badRequest('Идентификатор не найден'))
        }

        const createArchive = await archiveService.createJson(unique)
        const destroyArchive = await archiveService.destroyJson (unique)
        
        return res.json({
            unique: unique, 
            createArchive: createArchive, 
            destroyArchive: destroyArchive
        })
    }

    async delete (req, res, next) {
        const {id} = req.params
        if(!id) {
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