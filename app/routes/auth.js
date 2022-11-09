var authController = require('../controllers/authController.js');

module.exports = function (app, passport, models) {
    app.get('/signup', isNotLoggedIn, authController.signup);
    app.get('/signin', isNotLoggedIn, authController.signin);
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/dashboard',
        failureRedirect: '/signup',
        failureFlash: true
    }));
    app.get('/dashboard', isLoggedIn, authController.dashboard);
    app.get('/logout', authController.logout);
    app.post('/signin', passport.authenticate('local-signin', {
        successRedirect: '/dashboard',
        failureRedirect: '/signin',
        failureFlash: true
    }))
    app.get('/admin',  isNotAdmin, authController.signinAdmin);
    app.post('/admin_login', passport.authenticate('local-signin', {
        successRedirect: '/adminCPanel',
        failureRedirect: '/admin',
        failureFlash: true
    }))
    app.get('/client', isLoggedIn, authController.user)
    app.get('/client_edit', isLoggedIn, authController.user_edit)
    app.put('/client_edit', isLoggedIn, authController.user_edit_put)
    app.get('/resetpassword/:user_ref', authController.reset)
    app.post('/resetpassword/reset_pass/:user_ref', authController.newPass)

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) 
            return next();
        
        res.redirect('/signin');
    }

    function isNotAdmin(req, res, next) {
        if (!req.isAuthenticated()) {
            return next()
        } else if (!req.user.is_admin) {
            res.redirect('/dashboard')
        } else {
            res.redirect('/adminCPanel');
        }
    }

    function isNotLoggedIn(req, res, next) {
        if (! req.isAuthenticated()) 
            return next();
        
        res.redirect('/dashboard');
    }
};
