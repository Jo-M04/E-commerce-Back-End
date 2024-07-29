// import important parts of sequelize library
const { Model, DataTypes } = require('sequelize');
// import our database connection from config.js
const sequelize = require('../config/connection');

// Initialize Product model (table) by extending off Sequelize's Model class
class Product extends Model {}

// set up fields and rules for Product model
Product.init(
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
      allowNull: false
    },
    name: {
      // string type
      type: DataTypes.STRING,
      // not null
      allowNull: false
    },
    price: {
      // decimal type
      type: DataTypes.DECIMAL(10, 2),
      // not null
      allowNull: false
    },
    stock: {
      // integer type
      type: DataTypes.INTEGER,
      // default value
      defaultValue: 0
    },
    category_id: {
      // integer type
      type: DataTypes.INTEGER,
      references: {
        model: 'category',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product',
  }
);

module.exports = Product;
