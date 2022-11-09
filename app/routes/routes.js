const fs = require('fs')
const multer = require('multer');
const { env } = require('process');
const routesController = require('../controllers/routesController.js')
const upload = routesController.multerUpl(multer, fs)
const uplPdf = routesController.multerPdf(multer, fs)
const progress = routesController.progress
const formsData = require('./forms/formstosql.js')
const paypal = require('../controllers/paypal')

module.exports = (app, models) => {
    const Order = models.order;
    const User = models.user;

    app.get('/', (req, res) => res.render('index', {
        message: req.flash('message'),
        error: req.flash('error'),
        user: req.user,
        title: res.locals.title,
        sitedescription: res.locals.sitedescription
    }))
    app.get('/landing', (req, res) => res.render('404', {
        message: req.flash('message'),
        success: req.flash('success'),
        error: req.flash('error'),
        user: req.user,
        title: "szparowanie.pl - usuwanie tła ze zdjęć"
    }))

    app.get('/addorder', (req, res) => {
        res.render('addorder', {
            message: req.flash('error'),
            user: req.user,
            title: "szparowanie zdjęć - wyślij pliki"
        });
    });
    app.post('/addorder',
        progress,
        upload,
        async (req, res) => {
            var data = formsData.ordersform(req, res); // form to sql relation
            const or = await Order.create(data).catch((error) => {
                console.error('Failed to create a new record : ', error);
            })
            res.locals.order_ref = or.order_ref
            res.locals.order_id = or.order_id
            req.flash('success', 'Zlecenie zostało dodane, skontaktujemy się z Tobą niebawem.');

            routesController.send_NewOrder(req, res);

            res.redirect(`/order/${or.order_ref}`)
        });
        
    app.post('/contact', (req, res)=>{
        routesController.send_Message(req, res)
        req.flash('success', 'Wiadomość została wysłana.')
        res.redirect('/landing')
    }
        // upload,
        // async (req, res) => {
        //     var data = formsData.ordersform(req, res); // form to sql relation
        //     const or = await Order.create(data).catch((error) => {
        //         console.error('Failed to create a new record : ', error);
        //     })
        //     res.locals.order_ref = or.order_ref
        //     res.locals.order_id = or.order_id
        //     req.flash('success', 'Zlecenie zostało dodane, skontaktujemy się z Tobą niebawem.');

        //     routesController.send_NewOrder(req, res);

        //     res.redirect(`/order/${or.order_ref}`)
        // }
        );

    app.get('/order/:ref', async (req, res) => {

        const ordersList = await Order.findAll({
            where: {
                order_ref: req.params.ref
            }
        }).catch((error) => {
            console.error('Failed to update data', error)
            req.flash('error', 'nie udało się załadować bazy danych.')
            return res.redirect('/landing')
        })
        if (ordersList[0] == undefined || ordersList == undefined) {
            req.flash('message', 'Zlecenia o tym numerze referencyjnym nie ma w naszej bazie, spróbuj ponownie.')
            return res.redirect('/landing')
        }
        if (ordersList[0].dataValues.payment_status == 'oczekuje' && (ordersList[0].dataValues.order_status == 'potwierdzone' || ordersList[0].dataValues.order_status == 'do realizacji' || ordersList[0].dataValues.order_status == 'gotowe')) {
            req.flash('message', 'To zlecenie ma nieuregulowaną płatność.')
        }
        res.render('orders', {
            success: req.flash('success'),
            message: req.flash('message'),
            error: req.flash('error'),
            data: ordersList,
            user: req.user,
            title: "szparowanie.pl - zlecenie"
        })



    });
    app.put('/abort/:ref', async (req, res) => {

        await Order.update({
            order_status: "anulowane",
        }, {
            where: {
                order_ref: req.params.ref
            }
        }).catch((error) => {
            console.error('Failed to update data', error) // For DB connection errors
            req.flash('error', 'nie udało się załadować bazy danych.')
            return res.redirect('/landing')
        })
        req.flash('error', 'Zlecenie zostało usunięte.')
            return res.redirect('/landing')
    });
    app.get('/forgotPass', (req, res) => {
        res.render('forgotPass', {
            success: req.flash('success'),
            message: req.flash('error'),
            user: req.user,
            title: "usuwanie tła zdjęć - zapomniałem hasła"
        })
    })
    app.post('/resetPass', async (req, res) => {
        const user = await User.findAll({
            where: {
                email: req.body.email
            }
        }).catch((error) => {
            console.error('Failed to update data', error)
            req.flash('error', 'Failed to check database')
            return res.redirect('/forgotPass')
        })
        if (user[0] == undefined || user == undefined) {
            req.flash('error', 'Podanego adresu email nie ma w naszej bazie, spróbuj ponownie.')
            return res.redirect('/forgotPass')
        } else {
            res.locals.userRef = user[0].dataValues.user_ref
            routesController.sendResetLink(req, res)
            req.flash('message', 'Link do resetowania hasła został wysłany na podany adres email. Jeśli nie widzisz wiadomości, sprawdź folder spam.')
            return res.redirect('/landing')
        }
    })

    app.get('/accept/:ref', async (req, res) => {

        const order = await Order.findAll({ // do zmiany na findOne
            where: {
                order_ref: req.params.ref
            }
        }).catch((error) => {
            console.error('Failed to update data', error)
            req.flash('error', 'nie można załadować bazy danych.')
            return res.redirect('/landing')
        })

        // NIE KWALIFIKUJĄ SIĘ DO POTWIERDZENIA I PŁATNOSCI

        if (order[0] == undefined || order == undefined) {
            req.flash('error', 'Zlecenie o tym numerze nie widnieje w naszej bazie.')
            return res.redirect('/landing')

        } else if (order[0].dataValues.order_status == 'anulowane') {
            req.flash('error', 'To zlecenie zostało anulowane.')
            return res.redirect('/landing')

        } else if (order[0].dataValues.payment_status == 'darmowa wycena') {
            req.flash('success', 'To zlecenie nie wymaga płatności')
            return res.redirect(`/order/${req.params.ref}`)

        } else if (order[0].dataValues.order_status == 'do wyceny') {
            req.flash('error', 'To zlecenie nie zostało jeszcze wycenione.')
            return res.redirect('/landing')

        } else if (order[0].dataValues.order_status == 'gotowe' && order[0].dataValues.payment_status == 'zapłacone') {
            req.flash('success', 'To zlecenie zostało zrealizaowane, dziękujemy i zapraszamy ponownie!')
            return res.redirect(`/order/${req.params.ref}`)

        } else if (order[0].dataValues.order_status == 'gotowe' && order[0].dataValues.payment_status == 'odroczone') {
            req.flash('message', 'To zlecie ma odroczoną płatność - można je opłacić zbiorczo wraz z kolejnymi zleceniami, na koniec okresu rozliczeniowego otrzymasz fakturę.')
            return res.render('client_accept_pay', {
                message: req.flash('message'),
                data: order,
                user: req.user,
                title: "szparowanie.pl - potwierdź i opłać"
            })

            // DO POTWIERDZENIA I PŁATNOSCI 
            // WYMAGA POTWIERDZENIA  (LVL 1)
        } else if (
            // order[0].dataValues.order_status == 'do wyceny' || 
            order[0].dataValues.order_status == 'do akceptacji' || order[0].dataValues.order_status == 'odrzucone') {
            // NIE MOŻE TU WEJSC 
            if (order[0].dataValues.payment_status != 'oczekuje') { /////// tutaj
                return res.redirect(`/order/${req.params.ref}`)
            }
            return res.render('client_accept', {
                data: order,
                user: req.user
            })
            // WYMAGA OPŁACENIA PRZED REALIZACJĄ (LVL 2)
        } else if (order[0].dataValues.payment_status == 'oczekuje') {
            return res.render('client_accept_pay', {
                message: req.flash('message'),
                data: order,
                user: req.user
            })
            // ZOBACZY POCZEKAJ NA SPRAWDZENIE WPŁATY (LVL 2,5)
        } else if (order[0].dataValues.payment_status == 'potwierdzenie pdf') {
            return res.render('client_accept_pay_wait', {
                data: order,
                user: req.user
            })
            // ZOBACZY DZIĘKUJEMY ZA WPŁATĘ (LVL 3)
        } else if (order[0].dataValues.payment_status == 'zapłacone') {
            return res.render('client_accept_pay_success', {
                success: req.flash('success'),
                error: req.flash('error'),
                email: order[0].dataValues.user_email,
                user: req.user
            })

        } else {
            return res.redirect(`/order/${req.params.ref}`)
        }


    });

    // POTWIERDZONE
    app.get('/confirm/:ref', async (req, res) => {
        await Order.update({
            order_status: "potwierdzone",
        }, {
            where: {
                order_ref: req.params.ref
            }
        }).catch((error) => {
            console.error('Failed to update data', error) // For DB connection errors
            req.flash('error', 'nie można załadować bazy danych.')
            return res.redirect('/landing')
        })
        return res.redirect(`/accept/${req.params.ref}`)

    })
    // POTWIERDZENIE PDF
    app.put('/confirmsend/:ref', uplPdf, async (req, res) => {
        await Order.update({
            payment_status: "potwierdzenie pdf",
        }, {
            where: {
                order_ref: req.params.ref
            }
        }).catch((error) => {
            console.error('Failed to update data', error) // For DB connection errors
            req.flash('error', 'nie można załadować bazy danych.')
            return res.redirect(`/order/${req.params.ref}`)
        })
        routesController.send_Pdf(req, res)
        return res.redirect(`/accept/${req.params.ref}`)
    })

    // ODRZUCONE
    app.get('/decline/:ref', async (req, res) => {

        const order = await Order.findAll({
            where: {
                order_ref: req.params.ref
            }
        }).catch((error) => {
            console.error('Failed to update data', error)
            req.flash('error', 'nie można załadować bazy danych.')
            return res.redirect('/landing')
        })

        await Order.update({
            order_status: "odrzucone",
            payment_status: "odrzucone",
        }, {
            where: {
                order_ref: req.params.ref
            }
        }).catch((error) => {
            console.error('Failed to update data', error) // For DB connection errors
            req.flash('error', 'nie można załadować bazy danych.')
            return res.redirect('/landing')
        })

        res.locals.order_ref = req.params.ref
        res.locals.order_id = order[0].dataValues.order_id
        res.locals.user_email = order[0].dataValues.user_email

        routesController.send_decline(req, res)

        res.render('client_decline', {
            data: order,
            user: req.user 
        })
    })
    app.put('/decline/:ref', async (req, res) => {
        let additional_information = `Przyczyna odrzucenia: ${req.body.reason_select} / ${req.body.reason_desc}`
        await Order.update({
            additional_information: additional_information,
        }, {
            where: {
                order_ref: req.params.ref
            }
        }).catch((error) => {
            console.error('Failed to update data', error) // For DB connection errors
            req.flash('error', 'nie można załadować bazy danych.')
            return res.redirect('/landing')
        })
        
        req.flash('message', 'Dziękujemy za wypełnienie ankiety.')

        res.redirect('/landing')
    })

    // TEST ROUTE - CREATE an ORDER FOR EACH and ALL POSSIBLE OPTIONS
    //     app.get('/createTest', (req, res)=> {
    //         orderTypes = ['do wyceny', 'do akceptacji', 'anulowane', 'potwierdzone', 'do realizacji', 'gotowe', 'odrzucone']
    //         paymentTypes = ['darmowa wycena','oczekuje', 'odroczone', 'potwierdzenie pdf', 'zapłacone', 'odrzucone']
    //         let ref_nr = 200
    //         orderTypes.forEach(element => {
    //             let link = ''
    //             if(element == 'gotowe') {
    //                 link = 'http://www.szparowanie.pl/gotowe/41MJJA_A12312.zip'
    //             }

    //              paymentTypes.forEach (async el => {

    //                 ref_nr += 1
    //                 let or = await Order.create(

    //                     {   
    //                         user_email: 'test@wp.pl',
    //                         order_ref: ref_nr,
    //                         order_status: element,
    //                         payment_status: el,
    //                         completion_date: '2022-09-16 00:00:00.000000',
    //                         order_price: 123.45,
    //                         ready_package_link: link,
    //                     }

    //                 ).catch((error) => {
    //                     console.error('Failed to create a new record : ', error);
    //                 })
    //                 console.log(`Order ${ref_nr} zosatał utworzony`)

    //             })
    //         })
    //         res.send('Chyba się udało')
    //     })
    app.post('/paypal/:ref', paypal.createPayment)

    app.get('/paypalsuccess/:ref', paypal.executePayment)

    app.get('/paypalcancel/:ref', (req, res) => {
        console.log('Cancelled')
        req.flash('error', 'Transakcja PayPal została anulowana.')
        res.redirect(`/order/${req.params.ref}`)
    });
    // ARTYKUŁY 

    app.get('/articles/:ref', (req, res)=>{
        let title = req.params.ref // get title from params
        title = title.charAt(0).toUpperCase() + title.slice(1)
        title = title.replace("_", " ")
        res.render(`art_${req.params.ref}`, {
            user: req.user,
            title: "szparowanie.pl - " + title,
            sitedescription: title + " - obróka zdjęć - profesjonalne usługi dla fotografów i e-commerce"
        })
    })
}