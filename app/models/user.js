module.exports = function (sequelize, Sequelize) {

    var User = sequelize.define('user', {

        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },

        first_last_name: {
            type: Sequelize.STRING,
        },

        comp_name: {
            type: Sequelize.STRING,
        },

        country: {
            type: Sequelize.STRING,
        },

        address_line1: {
            type: Sequelize.TEXT
        },

        address_line2: {
            type: Sequelize.TEXT
        },

        address_line3: {
            type: Sequelize.TEXT
        },

        tax_number: {
            type: Sequelize.TEXT
        },

        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true
            }
        },
        phone: {
            type: Sequelize.STRING
        },

        password: {
            type: Sequelize.STRING,
            allowNull: false
        },

        last_login: {
            type: Sequelize.DATE
        },

        is_admin: {
            type: Sequelize.BOOLEAN,
            defaultValue: false

        },
        user_ref: {
            type: Sequelize.STRING,
            allowNull: false
        },

        status: {
            type: Sequelize.ENUM('active', 'inactive'),
            defaultValue: 'active'
        },
        info_1: {
            type: Sequelize.STRING,
        },
        info_2: {
            type: Sequelize.STRING,
        },
        info_3: {
            type: Sequelize.STRING,
        }
    });

    return User;

}