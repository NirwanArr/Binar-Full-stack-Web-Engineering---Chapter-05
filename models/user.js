'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Auth, {
        foreignKey: {
          name: "userId",
        },
      });
    }
  }
  User.init({
    name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    role: {
      type: DataTypes.ENUM(["super_admin", "admin", "member"]),
      defaultValue: "member",
    },
    address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};