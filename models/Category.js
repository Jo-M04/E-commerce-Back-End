const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection.js');

class Category extends Model {}

Category.init(
  {
    // define columns
    id: {
      // integer type
      type: DataTypes.INTEGER,
      // auto increment
      autoIncrement: true,
      // primary key
      primaryKey: true,
      // not null
      allowNull: false,
    },
    category_name: {
      // string type
      type: DataTypes.STRING,
      // not null
      allowNull: false,
      // unique constraint
      unique: true,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'category',
  }
);

module.exports = Category;
