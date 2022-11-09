const models = require("../models")
const Order = models.order;
const User = models.user
var bCrypt = require('bcryptjs');
var exports = module.exports = {};

exports.signup = (req, res) => {
    res.render('signup', { 
        message: req.flash('error'),
        success: req.flash('success'),
        user: req.user,
        title: "usuwanie tła usługi - stwórz konto" });

}

exports.signin = (req, res) => {
    res.render('signin', { 
        message: req.flash('error'),
        success: req.flash('success'),
        user: req.user,
        title: "szparowanie.pl - zaloguj się" });
};
exports.signinAdmin = (req, res) => {
    res.render('admin', { message: req.flash('error'),
    user: req.user,
    title: "usuwanie tła - zaloguj się" 
    });
};
exports.dashboard = async (req, res) => {
    let username = req.user.email;
    const ordersList = await Order.findAll({
        where: {
            user_email: username
        },
        order: [
            ['order_id', 'DESC']
        ]
    })

    res.render('dashboard',
        {
            success: req.flash('success'),
            username: username,
            error: req.flash('error'),
            data: ordersList,
            user: req.user,
            title: "szparowanie - konto klienta"
        }
    );
};
exports.user = async (req, res) => {
    // let userData = req.user;
    // const userData = await User.findAll({
    //     where: {
    //         email: username
    //     }
    // }).catch((error) => {
    //     console.error('Failed to fetch data', error) 
    //     return res.send('Failed to fetch data', error)
    // })

    res.render('client',
        {
            success: req.flash('success'),
            message: req.flash('error'),
            // userData: userData,
            user: req.user,
            title: "szparowanie.pl - dane klienta"
        }
    );
};
exports.user_edit = async (req, res) => {
    // let userData = req.user;
    // const userData = await User.findAll({
    //     where: {
    //         email: username
    //     }
    // }).catch((error) => {
    //     console.error('Failed to fetch data', error) 
    //     return res.send('Failed to fetch data', error)
    // })

    res.render('client_edit',
        {
            success: req.flash('success'),
            message: req.flash('error'),
            // userData: userData,
            user: req.user,
            title: "szparowanie.pl - edytuj dane klienta"
        }
    );
};
exports.user_edit_put = async (req, res) => {
    await User.update({
        first_last_name: req.body.first_last_name,
        phone: req.body.phone,
        comp_name: req.body.comp_name,
        tax_number: req.body.tax_number,
        country: req.body.country,
        address_line1: req.body.address_line1,
        address_line2: req.body.address_line2,
        address_line3: req.body.address_line3
    }, {
        where: {
            email: req.body.email
        }
    }).catch((error) => {
        console.error('Failed to update data', error) // For DB connection errors
        req.flash('error', 'nie udało się zaktualizować bazy danych. Poinformuj nas proszę o tym błędzie. Przepraszamy za niedogodności.')
        return res.redirect('/')
    })
    req.flash('success', 'Dane zostały zmienione.')
    res.redirect('/client');
};
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/signin');
    });
}

exports.reset = async (req, res) => {
    let ref = req.params.user_ref
    let user = await User.findAll({
        where: {
            user_ref: ref
        }
    })

    if (user[0] == undefined || user == undefined) {
        return res.send('Użytkownik o tym numerze nie widnieje w naszej bazie')
    }
    // if (user[0].dataValues.user_ref != req.params.user_ref ){
    //     console.log(Order.user_ref, 'orderUserRef', req.params.user_ref )
    //    return res.send('Wrong user reference token')
    // }

    res.render('resetPass', {
        email: user[0].dataValues.email, 
        ref: ref,
        user: req.user
    })
}
exports.newPass = async (req, res) => {
    let ref = req.params.user_ref

    const generateHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
    }
    let userPassword = generateHash(req.body.password)
    await User.update({
        password: userPassword,
    }, {
        where: {
            user_ref: ref
        }
    }).catch((error) => {
        console.error('Failed to update data', error) // For DB connection errors
        req.flash('error', 'nie udało się załadować bazy danych.')
        return res.redirect('/')
    })
    req.flash('success', 'Password has been reset');
    res.redirect('/signin')
}
