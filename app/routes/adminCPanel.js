const express = require('express')
const router = express.Router()
const models = require("../models")
const Order = models.order;
const User = models.user;
const fs = require('fs')
const path = require('path')
const routesController = require('../controllers/routesController.js')

router.use(isAdminLoggedIn, isAdmin) // Prevents unauthorized access)

router.get('/', queryOrders, adminCPanel);

router.route('/orders/:ref')
    .get(sqlGETorder, (req, res) => res.render('adminOrders', {
        layout: 'layouts/admin',
        data: res.locals.or,
        title: "usuwanie tła ze zdjęcia - zlecenia"
    }))
    .put(sqlPut, routesController.sendNextStep, (req, res) => {
        req.flash('info', 'Update successful!')
        res.redirect('/adminCPanel')
    })
    .delete(sqlDelete, (req, res) => {
        req.flash('info', 'Entry removed from the database')
        res.redirect('/adminCPanel')
    })
router.route('/clients/:client/:ref')
    .get(sqlGETcleints, (req, res) => res.render('adminClients', {
        layout: 'layouts/admin',
        user: res.locals.clients,
        currentOrder: req.params.ref
    }))
// router.route('/files/:id/:ref')
//     .get(getFiles, (req, res) => res.render('adminFiles', {
//         layout: 'layouts/admin',
//         user: res.locals.clients,
//         currentOrder: req.params.id,
//         currentOrderRef: req.params.ref,
//         files: res.locals.filesDir,
//         dir: process.env.ABSOLUTE_PATH
//     }))


    // .put(sqlPut, routesController.sendNextStep, (req, res) => {
    //     req.flash('info', 'Update successful!')
    //     res.redirect('/adminCPanel')
    // })
    // .delete(sqlDelete, (req, res) => {
    //     req.flash('info', 'Entry removed from the database')
    //     res.redirect('/adminCPanel')
    // })

module.exports = router

function isAdminLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();


    res.redirect('/admin');
}

function isAdmin(req, res, next) {
    if (req.user.is_admin)
        return next();


    res.redirect('/dashboard');

}
async function queryOrders(req, res, next) {
    let Order = models.order //?//
    const ordersList = await Order.findAll({
        order: [
            ['order_id', 'DESC']
        ]
    });
    res.locals.ordersList = ordersList;
    // console.log(ordersList)
    return next()
}
async function adminCPanel(req, res) {
    res.render('adminCPanel', {
        layout: 'layouts/admin',
        success: req.flash('info'),
        message: req.flash('message'),
        error: req.flash('error'),
        data: res.locals.ordersList
    })
}
/////////////  FINDALL 
async function sqlGETorder(req, res, next) {
    const getOrder = await Order.findAll({
        where: {
            order_ref: req.params.ref
        }
    }).catch((error) => {
        console.error('Failed to load data', error) // For DB connection errors
        req.flash('error', 'Failed to load data')
        res.redirect('/landing')
    })
    if (getOrder[0] == undefined || getOrder == undefined) {
        return res.send('no result for this query')
    } else {
        res.locals.or = getOrder
        return next()
    }
    // console.log("getOrder = "+ typeof getOrder, getOrder[0])
}
async function sqlPut(req, res, next) {
    // req.body.user_email, 
    // req.body.order_id
    await Order.update({
        completion_date: req.body.completion_date,
        order_price: req.body.order_price,
        order_status: req.body.order_status,
        payment_status: req.body.payment_status,
        ready_package_link: req.body.ready_package_link

    }, {
        where: {
            order_ref: req.params.ref
        }
    }).catch((error) => {
        console.error('Failed to update data', error) // For DB connection errors
        return res.send('Failed to update data', error)
    })

    return next()
}

async function sqlDelete(req, res, next) {

    await Order.destroy({
        where: {
            order_ref: req.params.ref
        }
    }).catch((error) => {
        console.error('Failed to delete data', error) // For DB connection errors
        return res.send('Failed to delete data', error)
    })

    return next()
}
async function sqlGETcleints(req, res, next) {
    const client = await User.findAll({
        where: {
            email: req.params.client
        }
    }).catch((error) => {
        console.error('Failed to load data', error) // For DB connection errors
        req.flash('error', 'Failed to load data')
        res.redirect('/landing')
    })
    console.log(client)
    if (client[0] == undefined || client == undefined) {
        return res.send('no result for this query')
    } else {
        res.locals.clients = client[0].dataValues
        return next()
    }
    // console.log("getOrder = "+ typeof getOrder, getOrder[0])
}
// async function getFiles(req, res, next) {
//     const folder = path.join(__dirname, '..', 'public', 'pdf', req.params.id + "_" + req.params.ref)
//     let filesDir = '' // gives the name of the files
//     try {
//         filesDir = await fs.readdirSync(folder)
//         // path.join(folder, ' ').replace(/\s/g, '')

//     } catch (error) {
//         console.log('nie ma plików w tym folderze')
//     } 
//     res.locals.filesDir = filesDir
//     return next()
// }

// async function getPDFFile(req, res, next) {
//     const folder = path.join(__dirname, '..', 'public', 'pdf', req.params.id + "_" + req.params.ref)
//     const files = []
//     res.locals.path = {}
//     try {
//         await fs.readdirSync(folder).forEach(file => {
//             console.log(typeof(path.join(folder, file)));
          
//           });
//     } catch (error) {
//         console.log('nie ma plików w tym folderze')
//     } 


//     return next()
// }