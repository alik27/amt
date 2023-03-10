const sequelize = require('../db')
const { DataTypes } = require('sequelize')

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
    number: {type: DataTypes.STRING, allowNull: false},
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

Checkpoint.hasMany(History)
History.belongsTo(Checkpoint)

History.hasMany(HistoryDescription)
HistoryDescription.belongsTo(History)

Description.hasMany(HistoryDescription)
HistoryDescription.belongsTo(Description)

module.exports = {
    User, Checkpoint, Params, History, Description, HistoryDescription
}