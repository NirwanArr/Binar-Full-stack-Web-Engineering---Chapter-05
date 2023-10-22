"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Car extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Car.belongsTo(models.User, {
                foreignKey: {
                    name: "createByUserId",
                },
                as: "createBy",
            });

            Car.belongsTo(models.User, {
                foreignKey: {
                    name: "updateByUserId",
                },
                as: "updateBy",
            });

            Car.belongsTo(models.User, {
                foreignKey: {
                    name: "deleteByUserId",
                },
                as: "deleteBy",
            });
        }
    }
    Car.init(
        {
            name: DataTypes.STRING,
            price: DataTypes.FLOAT,
            category: DataTypes.ENUM([
                "small",
                "medium",
                "large",
            ]),
            image: {
                type: DataTypes.TEXT,
                defaultValue:
                    "https://tse2.mm.bing.net/th?id=OIP.U2iQ7wNK6ZzTW_traW_-PQHaHa&pid=Api&P=0&h=180",
            },
            createByUserId: DataTypes.INTEGER,
            updateByUserId: DataTypes.INTEGER,
            deleteByUserId: DataTypes.INTEGER,
        },
        {
            sequelize,
            paranoid: true,
            modelName: "Car",
        }
    );
    return Car;
};
