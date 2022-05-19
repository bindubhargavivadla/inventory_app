'use strict';
const bcrypt = require('bcrypt');
let salt = bcrypt.genSaltSync(10);

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            'Users',
            [
                {
                    firstName: 'Bhargavi',
                    lastName: 'Vadla',
                    email: 'bhargavi@gmail.com',
                    password: bcrypt.hashSync('123456', salt),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    firstName: 'Mani',
                    lastName: 'Vadla',
                    email: 'mani@gmail.com',
                    password: bcrypt.hashSync('654321', salt),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    firstName: 'Nandini',
                    lastName: 'Kotla',
                    email: 'nandini@gmail.com',
                    password: bcrypt.hashSync('123asd', salt),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    },
};
