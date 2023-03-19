const historyDescriptionService = require('../service/historyDescriptionService')

class HistoryDescriptionController {
    async getAll (req, res, next) {
        let {limit, page} = req.query
        page = Number(page) || 1
        limit = Number(limit) || 10
        let offset = page * limit - limit
        const description = await historyDescriptionService.getData()
        return res.json(description)
    }
}

module.exports = new HistoryDescriptionController