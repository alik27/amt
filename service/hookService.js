
const hookCheckNumberAll = (description) => {
    return HistoryDescription.findAndCountAll({
        attributes: ['id'],
        raw: true,
        where: {descriptionId: null},
        include: [
            {
                model: History, 
                as: "entryId", 
                attributes: [], 
                required: false, 
                where: {
                    number: description.number
                }
            },
            {
                model: History, 
                as: "exitId", 
                attributes: [], 
                required: false, 
                where: {
                    number: description.number
                }
            }
        ],
    })
}

module.exports = {
    hookCheckNumberAll
};