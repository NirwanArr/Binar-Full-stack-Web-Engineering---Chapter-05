"use strict";

const { User } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("Users", [
            {
                name: "nirwan",
                address: "Tangerang",
                age: 23,
                role: "super_admin",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);

        const users = await User.findAll();

        await queryInterface.bulkInsert(
            "Auths",
            [
                {
                    email: "admin@mail.com",
                    password:
                        "$2a$12$8IPKe/qmQiKlRyAb/rcH3uQ.ZLnJqU9dhnpFrdIljACr7UKK/K8IS",
                    userId: users[0].id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete(
            "Users",
            null,
            {}
        );
        await queryInterface.bulkDelete(
            "Auths",
            null,
            {}
        );
    },
};
