const express = require('express')
const fs = require('fs')
const app = express()
const path = require("path")
const passport = require('passport')
const session = require('express-session')
const env = require('dotenv').config()
const models = require("./app/models") //SeQuLelize
const ejs = require('ejs')
const expressLayouts = require('express-ejs-layouts')
const flash = require('connect-flash')
const methodOverride = require('method-override')

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.use(expressLayouts)
// For Passport
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    // cookie: {
    //     sameSite: 'none', // check
    //   }
}))

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(flash());

//STYLING
app.use(express.static(path.join(__dirname, '/app/public')));
app.use(methodOverride('_method'))


//For EJS
app.set('views', './app/views');
app.set('view engine', '.ejs');
app.set('layout', 'layouts/layout')
app.use(function (req, res, next) {
    res.locals.sitedescription = "Obróbka zdjęć - Profesjonalne usługi dla fotografów i e-handlu. Usuwanie tła zdjęć i postprodukcja.";
    res.locals.title = "szparowanie.pl - usługi dla fotografów i e-handlu";
    next();
  });
require('./app/config/passport/passport.js')(passport, models.user); //////// USER data

//Sync Database
models.sequelize.sync()
    .then(function () {
        console.log('Nice! Database looks fine')
    }).catch(function (err) {
        console.log(err, "Something went wrong with the Database Update!")
    });

//Routes

const authRoute = require('./app/routes/auth.js')(app, passport, models);

require('./app/routes/routes')(app, models)

const adminCPRoute = require('./app/routes/adminCPanel.js')
app.use('/adminCPanel', adminCPRoute)

app.use((req,res)=>{
    res.status(404).render('404', {
        error: 'Chyba zabłądziłeś, wygląda na to że link nie działa.',
        message: '',
        success: '',
        user: req.user
    });
});

app.listen(5000, function (err) {
    if (!err)
        console.log("Site is live");
    else console.log(err)
});