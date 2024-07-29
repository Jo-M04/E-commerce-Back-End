const { Model, DataTypes } = require("sequelize");

const sequelize = require("../config/connection.js");

class Tag extends Model {}

Tag.init(
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
    tag_name: {
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
    modelName: "tag",
  }
);

module.exports = Tag;
