const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');

class ProductTag extends Model {}

ProductTag.init(
  {
    // define columns
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'product', // Name of the model being referenced
        key: 'id',        // Key in the referenced model
      },
    },
    tag_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tag',     // Name of the model being referenced
        key: 'id',        // Key in the referenced model
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_tag',
  }
);

module.exports = ProductTag;
