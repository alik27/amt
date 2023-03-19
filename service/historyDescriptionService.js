const { Sequelize } = require('../db')
const {History, Description, HistoryDescription} = require('../models/models')

class HistoryDescriptionService {
    async getData () {
        return await HistoryDescription.findAndCountAll({
            attributes: [
                'id',
                [Sequelize.literal('entryId.number'), "number"],
                [Sequelize.literal('description.brand'), "brand"],
                [Sequelize.literal('description.series'), "series"],
                [Sequelize.literal('description.pass_number'), "pass_number"],
                [Sequelize.literal('description.pass_type'), "pass_type"],
                [Sequelize.literal('description.belonging'), "belonging"],
                [Sequelize.literal('description.name_inventory_items'), "name_inventory_items"],
                [Sequelize.literal('description.weight_inventory_items'), "weight_inventory_items"],
                [Sequelize.literal('description.full_name_inventory_items'), "full_name_inventory_items"],
                [Sequelize.literal('entryId.number'), "entrance_number"],
                [Sequelize.literal('entryId.date'), "entrance_date"],
                [Sequelize.literal('entryId.image'), "entrance_image"],
                [Sequelize.literal('exitId.number'), "exit_number"],
                [Sequelize.literal('exitId.date'), "exit_date"],
                [Sequelize.literal('exitId.image'), "exit_image"],
                'createdAt',
                'updatedAt',
            ],
            include: [
                {model: History, as: "entryId", required: false},
                {model: History, as: "exitId", required: false},
                {model: Description, as: "description", required: false}
            ],
        })
    }
}

module.exports = new HistoryDescriptionService
