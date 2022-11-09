const randomstring = require('randomstring')

var exports = module.exports = {}

exports.ordersform = function (req, res) {
    const data = {
        user_email: req.body.user_email,
        user_phone: req.body.user_phone,
        order_ref: randomstring.generate(12),
        transfer_type: req.body.transfer_type,
        line1: req.body.line1,
        line2: req.body.line2,
        line3: req.body.line3,
        line4: req.body.line4,
        // create_date: new Date().toISOString().slice(0, 19).replace('T', ' '),            no need (created at in DB table)
        // completion_date: req.body.completion_date,
        number_of_files: Object.keys(req.files).length,
        // order_price: req.body.order_price,
        // order_status: req.body.order_status,
        // payment_status: req.body.payment_status,
        order_description: req.body.order_description,
        output_file_format: req.body.utput_file_format,
        clipping_options: req.body.clipping_options,
        additional_options_retouch: req.body.additional_options_retouch,
        additional_options_light_color: req.body.additional_options_light_color,
        additional_options_crop: req.body.additional_options_crop,
        additional_options_shadow: req.body.additional_options_shadow,
        // ready_package_link: req.body.ready_package_link,}}
    }
    return data
}
