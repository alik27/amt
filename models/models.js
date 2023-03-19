const sequelize = require('../db')
const { DataTypes, Op } = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    login: {type: DataTypes.STRING, unique: true},
    pass: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: 'USER'}
})

const Checkpoint = sequelize.define('checkpoint', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    type: {type: DataTypes.INTEGER, allowNull: false},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Params = sequelize.define('params', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    value: {type: DataTypes.STRING, allowNull: false},
})

const History = sequelize.define('history', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    date: {type: DataTypes.DATE, allowNull: false},
    number: {type: DataTypes.STRING, allowNull: false},
    image: {type: DataTypes.STRING, defaultValue: ''},
})

const Description = sequelize.define('description', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    number: {type: DataTypes.STRING, unique: true, allowNull: false},
    brand: {type: DataTypes.STRING, defaultValue: ''},
    series: {type: DataTypes.STRING, defaultValue: ''},
    pass_number: {type: DataTypes.INTEGER, defaultValue: null},
    pass_type: {type: DataTypes.STRING, defaultValue: ''},
    belonging: {type: DataTypes.STRING, defaultValue: ''},
    name_inventory_items: {type: DataTypes.STRING, defaultValue: ''},
    weight_inventory_items: {type: DataTypes.INTEGER, defaultValue: null},
    full_name_inventory_items: {type: DataTypes.STRING, defaultValue: ''},
})

const HistoryDescription = sequelize.define('history_description', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Archive = sequelize.define('archive', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    number: {type: DataTypes.STRING, allowNull: false},
    brand: {type: DataTypes.STRING, defaultValue: ''},
    series: {type: DataTypes.STRING, defaultValue: ''},
    pass_number: {type: DataTypes.INTEGER, defaultValue: null},
    pass_type: {type: DataTypes.STRING, defaultValue: ''},
    belonging: {type: DataTypes.STRING, defaultValue: ''},
    name_inventory_items: {type: DataTypes.STRING, defaultValue: ''},
    weight_inventory_items: {type: DataTypes.INTEGER, defaultValue: null},
    full_name_inventory_items: {type: DataTypes.STRING, defaultValue: ''},
    entrance_date: {type: DataTypes.DATE, defaultValue: null},
    entrance_image: {type: DataTypes.STRING, defaultValue: ''},
    exit_date: {type: DataTypes.DATE, defaultValue: null},
    exit_image: {type: DataTypes.STRING, defaultValue: ''},
})

Checkpoint.hasMany(History)
History.belongsTo(Checkpoint)


History.hasMany(HistoryDescription)
HistoryDescription.belongsTo(History, {
    as: 'entryId',
    foreignKey: {
      name: 'historyId',
      allowNull: true
    }
})

HistoryDescription.belongsTo(History, {
    as: 'exitId',
    foreignKey: {
      name: 'historyId_exit',
      allowNull: true
    }
})

Description.hasMany(HistoryDescription)
HistoryDescription.belongsTo(Description, {
    as: 'description',
    foreignKey: {
      name: 'descriptionId',
      allowNull: true
    }
})

Description.afterCreate(async description => {
    const check = await HistoryDescription.findAndCountAll({
        attributes: ['id'],
        raw: true,
        where: {
            [Op.and]: [
                {descriptionId: null},
                {[Op.or]: [{"$entryId.number$": description.number}, {"$exitId.number$": description.number}]}
            ]
        },
        include: [
            {model: History, as: "entryId", attributes: [], required: false},
            {model: History, as: "exitId", attributes: [], required: false}
        ],
    })
    if(check.count > 0) {
        return await HistoryDescription.update({descriptionId: description.id}, {where: {[Op.or]: check.rows}})
    }
    return false
})

module.exports = {
    User, Checkpoint, Params, History, Description, HistoryDescription, Archive
}