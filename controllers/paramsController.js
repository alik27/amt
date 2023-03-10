const {Params} = require('../models/models')
const ApiError = require('../error/ApiError')

class ParamsController {
    async create (req, res) {
        const {name} = req.body
        const params = await Params.create({name})
        return res.json(params)
    }
    
    async getAll (req, res) {
        const params = await Params.findAll()
        return res.json(params)
    }

    async getOne (req, res) {
        const {id} = req.params
        const params = await Params.findAll({where: {id}})
        return res.json(params)
    }
}

module.exports = new ParamsController