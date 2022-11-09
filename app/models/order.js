module.exports = function (sequelize, Sequelize) {


var Order = sequelize.define("order", {

    order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    order_ref: {
        type: Sequelize.STRING,
        allowNull: false
    },
    user_email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    user_phone: {
        type: Sequelize.STRING,
        defaultValue: 'nie podano'
    },
    order_type: {
        type: Sequelize.STRING,
    },
    transfer_type: {
        type: Sequelize.STRING,
        defaultValue: 'nie zaznaczono'
    },
    line1: {
        type: Sequelize.STRING,
    },
    line2: {
        type: Sequelize.STRING,
    },
    line3: {
        type: Sequelize.STRING,
    },
    line4: {
        type: Sequelize.STRING,
    },
    completion_date: {
        type: Sequelize.DATE(6),
    },
    number_of_files: {
        type: Sequelize.INTEGER,
        defaultValue: 1
    },
    order_price: {
        type: Sequelize.INTEGER,
    },
    order_status: {
        type: Sequelize.STRING,
        defaultValue: 'do wyceny'
    },
    payment_status: {
        type: Sequelize.STRING,
        defaultValue: 'darmowa wycena'
    },    
    invoice_link: {
        type: Sequelize.STRING,
    },
    order_description: {
        type: Sequelize.STRING,
        defaultValue: 'nie zaznaczono'
    },
    output_file_format: {
        type: Sequelize.STRING,
        defaultValue: 'nie zaznaczono'
    },
    clipping_options: {
        type: Sequelize.STRING,
        defaultValue: 'nie zaznaczono'
    },
    additional_options_retouch: {
        type: Sequelize.ENUM('tak', 'nie'),
            defaultValue: 'nie'
    },
    additional_options_light_color: {
        type: Sequelize.ENUM('tak', 'nie'),
            defaultValue: 'nie'
    },
    additional_options_crop: {
        type: Sequelize.ENUM('tak', 'nie'),
            defaultValue: 'nie'
    },
    additional_options_shadow: {
        type: Sequelize.ENUM('tak', 'nie'),
        defaultValue: 'nie'
    },
    ready_package_link: {
        type: Sequelize.STRING,
    },
    additional_information: {
        type: Sequelize.STRING,
    },
    sentDate: { 
        type: Sequelize.DATE, 
        defaultValue: Sequelize.NOW 
    }

},{
    initialAutoIncrement: 1000
})

return Order;
}