const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Course = sequelize.define('Course', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    classNumber: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

module.exports = Course;
