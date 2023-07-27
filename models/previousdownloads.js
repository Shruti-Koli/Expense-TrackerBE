const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const PreviousDownload = sequelize.define('PreviousDownloads', {
    id:{
        type: Sequelize.INTEGER,
        unique:true,
        autoIncrement: true,
        primaryKey:true,
    },
    fileURL:{
        type: Sequelize.STRING,
        allowNull: false
    }
})


module.exports =  PreviousDownload