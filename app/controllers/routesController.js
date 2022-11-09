const nodemailer = require('nodemailer');
const mailoptions = require('../controllers/mailoptions')
const path = require('path')

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.MAILER_HOST_NAME,
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASS // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false
    }
});

var exports = module.exports = {};

////////////  SEND EMAIL
exports.send_NewOrder = (req, res) => {

    // send mail to ADMIN - SZPAROWANIE.PL
    transporter.sendMail(mailoptions.szparowanie_NewOrder(req, res), (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message to szparowanie.pl sent: %s', info.messageId);
    });

    //  send mail to CLIENT
    transporter.sendMail(mailoptions.client_NewOrder(req, res), (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message to client sent: %s', info.messageId);
    });
}
exports.send_Message = (req, res) => {

    // send mail to ADMIN - SZPAROWANIE.PL
    transporter.sendMail(mailoptions.szparowanie_message(req, res), (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message to szparowanie.pl sent: %s', info.messageId);
    });
}
exports.send_Pdf = (req, res) => {

    // send mail to ADMIN - SZPAROWANIE.PL
    transporter.sendMail(mailoptions.szparowanie_confirmed_pdf(req, res), (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message to szparowanie.pl sent: %s', info.messageId);
    });
}
exports.send_Paid = (req, res) => {

    // send mail to ADMIN - SZPAROWANIE.PL
    transporter.sendMail(mailoptions.szparowanie_paid(req, res), (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message to szparowanie.pl sent: %s', info.messageId);
    });

    //  send mail to CLIENT
    // transporter.sendMail(mailoptions.client_NewOrder(req, res), (error, info) => {
    //     if (error) {
    //         return console.log(error);
    //     }
    //     console.log('Message to client sent: %s', info.messageId);
    // });
}
exports.send_decline = (req, res) => {

    // send mail to ADMIN - SZPAROWANIE.PL
    transporter.sendMail(mailoptions.szparowanie_decline(req, res), (error, info) => {
        if (error) {
            console.log(error);
        }
    });
}

exports.sendResetLink = (req, res) => {
    transporter.sendMail(mailoptions.resetLink(req, res), (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
}

///          THIS DEALS WITH APRISAL/ACCEPT/PAY - 
///          all the user-admin back and forth logic       

exports.sendNextStep = (req, res, next) => {
    console.log(req.body.payment_status)
    console.log(req.body.order_id, 'to jest ten log')

    if (req.body.dont_send == 1) {
        req.flash('error', 'Wiadomość nie została wysłana.')
        return next()
    }

    /// STEP 1 APRISAL 
    if (req.body.order_status == 'do realizacji' && (req.body.payment_status == 'odroczone' || // CASE FOTOFOCUS
            req.body.payment_status == 'zapłacone')) { // CASE potwierdznie PDF po sprawdzeniu

        //  send mail to CLIENT
        transporter.sendMail(mailoptions.client_Processing_order(req, res), (error, info) => {
            if (error) {
                console.log(error);
                return res.send(error)
            }
            console.log('Admin przygotował wycenę, zaakceptuj i zapłać: %s', info.messageId);
        });

        req.flash('message', 'Wiadomość do ' + req.body.user_email + ' została wysłana.')

    } else if (req.body.order_status == 'do akceptacji' && req.body.payment_status == 'oczekuje') {
        //  send mail to CLIENT
        transporter.sendMail(mailoptions.client_Accept_and_Pay(req, res), (error, info) => {
            if (error) {
                console.log(error);
                return res.send(error)
            }
            console.log('Message to client sent: %s', info.messageId);
        });
        req.flash('message', 'Wiadomość do ' + req.body.user_email + ' została wysłana.')

        /// STEP 3 GOTOWE ZDJĘCIA 
    } else if (req.body.order_status == 'gotowe' && req.body.ready_package_link.length > 10) {
        if (req.body.payment_status == 'darmowa wycena') {







            console.log('przesyłam wycenę wraz z gotowym zdjęciem przykładowym, zapraszam do współpracy.')
        } else {
            //  send mail to CLIENT
            transporter.sendMail(mailoptions.client_Ready_Link(req, res), (error, info) => {
                if (error) {
                    console.log(error);
                    return res.send(error)
                }
                console.log('Message to client sent: %s', info.messageId);
            });
            req.flash('message', 'Wiadomość do ' + req.body.user_email + ' została wysłana.')
            console.log('przesyłam gotowe zdjęcia, dziękuję i zapraszam ponownie')
        }

    } else {
        req.flash('error', 'Zmiany nie spełniały kryteriów do wysłania wiadomości.')
    }

    next()
}

////////////  UPLOAD FILES
exports.multerUpl = (multer, fs) => {
    const storage = multer.diskStorage({

        destination: (req, file, cb) => { // Generates new date (y m d)
            let dateObj = new Date();
            let year = dateObj.getUTCFullYear().toString();
            let month = ("0" + (dateObj.getUTCMonth() + 1)).slice(-2)
            let day = ("0" + dateObj.getUTCDate()).slice(-2)
            let newdate = year + month + day + "_";

            // Generates new folder
            const dest = "app/public/uploads/" + newdate + req.body.user_email;
            fs.access(dest, function (error) {
                if (error) {
                    console.log("Directory created");
                    return fs.mkdir(dest, (error) => cb(error, dest));
                } else {
                    // console.log("Directory exists.");
                    return cb(null, dest);
                }
            })

            // console.log(req.files[0].files.length + 'z funkcji multera')
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);

        }


    });

    const uploadStorage = multer({
        storage: storage
    })
    return upload = uploadStorage.array('multi_files')

    // function checkFileType(file, cb) {
    //     // Allowed file ext
    //     const filetypes = /jpeg|jpg|png|gif|psd|tif/;
    //     // Check the ext
    //     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //     // Check mimeTypes
    //     const mimetype = filetypes.test(file.mimetype);

    //     if (mimetype && extname) {
    //         return cb(null,true);
    //     } else {
    //         cb('Error: Images Only');
    //     }
    // }


} // PDF send
exports.multerPdf = (multer, fs) => {

    const storage = multer.diskStorage({

        destination: (req, file, cb) => { // Generates new date (y m d)
            // Generates new folder
            const dest = "app/public/pdf/" + req.body.order_id + "_" + req.body.order_ref;
            fs.access(dest, function (error) {
                if (error) {
                    console.log("Directory created");
                    return fs.mkdir(dest, (error) => cb(error, dest));
                } else {
                    return cb(null, dest);
                }
            })
        },
        filename: (req, file, cb) => {
            cb(null, req.body.order_id + "_" + req.body.order_ref + path.extname(file.originalname));

        }


    });

    const uploadStorage = multer({
        storage: storage,
        limits: {
            fileSize: 500000000
        },
        fileFilter: function (req, file, cb) {
            checkFileType(file, cb)
        }
    })
    return upload = uploadStorage.single('pdf')

    function checkFileType(file, cb) {
        // Allowed file ext
        const filetypes = /jpeg|png|jpg|pdf/;
        // Check the ext
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        // Check mimeTypes
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Tylko pliki o formacie PDF, jpg, jpeg, i png, spróbuj ponownie.');
        }
    }
}
// PROGRESS BAR

exports.progress = (req, res, next) => {
    let progress = 0;
    const file_size = req.headers["content-length"];

    // set event listener
    req.on("data", (chunk) => {
        progress += chunk.length;
        const percentage = (progress / file_size) * 100;
        // console.log(percentage)
        // other code ...
    });

    // invoke next middleware
    next();
}