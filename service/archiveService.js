const {Archive, HistoryDescription, History, Description} = require('../models/models')

class ArchiveService {
    async searchId (id) {
        return await HistoryDescription.findOne({
            where: {id},
            include: [
                {model: History, as: "entryId", attributes: ['id', 'date', 'image'], required: false},
                {model: History, as: "exitId", attributes: ['id', 'date', 'image'], required: false},
                {model: Description, as: "description", required: false}
            ],
        })
    }

    descriptionJson (description) {
        if(!description) return null
        return {
            brand: description.brand, 
            series: description.series, 
            pass_number: description.pass_number, 
            pass_type: description.pass_type, 
            belonging: description.belonging, 
            name_inventory_items: description.name_inventory_items, 
            weight_inventory_items: description.weight_inventory_items, 
            full_name_inventory_items: description.full_name_inventory_items
        }
    }

    entranceJson (entryId) {
        if(!entryId) return null
        return {
            entrance_date: entryId.date,
            entrance_image: entryId.image
        }
    }

    exitJson (exitId) {
        if(!exitId) return null
        return {
            exit_date: exitId.date, 
            exit_image: exitId.image
        }
    }

    numberJson (description, entryId, exitId) {
        let number = null
        if(description && description.number) {
            number = description.number
        } else if(entryId && entryId.number) {
            number = entryId.number
        } else if(exitId && exitId.number) {
            number = exitId.number
        }
        return {number: number}
    }

    async createJson (archive) {
        let description = this.descriptionJson(archive.description)
        let entry = this.entranceJson(archive.entryId)
        let exit = this.entranceJson(archive.exitId)
        let number = this.numberJson(archive.description, archive.entryId, archive.exitId)

        if(!number.number) return false

        const archiveJson = Object.assign({}, number, description, entry, exit);
        return await Archive.create(archiveJson)
    }

    async destroyJson (archive) {
        let results = {}
        if(archive.description) {
            results.description = await Description.destroy({where: {id: archive.description.id}})
        }
        if(archive.entryId) {
            results.entryId = await History.destroy({where: {id: archive.entryId.id}})
        }
        if(archive.exitId) {
            results.exitId = await History.destroy({where: {id: archive.exitId.id}})
        }
        if(archive.id) {
            results.historyDescription = await HistoryDescription.destroy({where: {id: archive.id}})
        }
        return results
    }
}

module.exports = new ArchiveService