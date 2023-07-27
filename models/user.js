const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Users = sequelize.define('user',{
    id:{
        type: Sequelize.INTEGER,
        unique:true,
        autoIncrement: true,
        primaryKey:true,
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false,
        unique:true
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    },
    ispremiumuser:{
        type: Sequelize.BOOLEAN
    },
    totalExpense:{
        type: Sequelize.INTEGER,
        defaultValue :0
    }
});

module.exports = Users;