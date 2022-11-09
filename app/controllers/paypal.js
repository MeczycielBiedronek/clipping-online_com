const paypal = require('paypal-rest-sdk')
require('dotenv').config()
const express = require('express')
const app = express()
const models = require("../models")
const Order = models.order
const routesController = require('../controllers/routesController.js')
// checks if client sends the right amount
let toBeSend = {
  amount: 0,
  currency: "PLN",
  id: 0,
  email: ''
}

paypal.configure({
  'mode': 'live', //sandbox or live
  'client_id': process.env.PAYPAL_CL_ID,
  'client_secret': process.env.PAYPAL_CL_SECRET
});

const createPayment = async (req, res) => {
  const orderData = await Order.findAll({
    where: {
      order_ref: req.params.ref
    }

  }).catch((error) => {
    console.error('Failed to update data', error)
    req.flash('error', 'Failed to check database')
    return res.redirect('/forgotPass')
  })
  toBeSend.amount = orderData[0].dataValues.order_price
  toBeSend.id = orderData[0].dataValues.order_id
  toBeSend.email = orderData[0].dataValues.user_email
  // console.log(toBeSend.amount + " " + toBeSend.currency + " do zapłaty 1")
  const create_payment_json = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      "return_url": `${process.env.ABSOLUTE_PATH}/paypalsuccess/${req.params.ref}`,
      "cancel_url": `${process.env.ABSOLUTE_PATH}/paypalcancel/${req.params.ref}`
    },
    "transactions": [{
      "item_list": {
        "items": [{
          "name": `szparowanie.pl - Order no.${toBeSend.id}`,
          "sku": "001",
          "price": `${toBeSend.amount}`,
          "currency": `${toBeSend.currency}`,
          "quantity": 1
        }]
      },
      "amount": {
        "currency": `${toBeSend.currency}`,
        "total": `${toBeSend.amount}`,
      },
      "description": "cyfrowa obróbka fotografii (Digital Images Processing)"
    }]
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      req.flash('error', `Nie udało się dokonać płatności. Spróbuj jeszcze raz lub skorzystaj z innej metody płatności. Szczegóły błędu: ${error}`)
      return res.redirect(`/order/${req.params.ref}`)
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          res.redirect(payment.links[i].href);
        }
      }
    }
  });

};

 const executePayment = (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  console.log(toBeSend.amount + " " + toBeSend.currency + " do zapłaty 2")

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
      "amount": {
        "currency": toBeSend.currency,
        "total": toBeSend.amount // Compares the amount SENT to the amount REQUIRED
      }
    }]
  };

  // Obtains the transaction details from paypal
  paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
    //When error occurs when due to non-existent transaction, throw an error else log the transaction details in the console then send a Success string reposponse to the user.
    if (error) {
      console.log(error.response);
      req.flash('error', 'Nie udało się dokonać płatności. Spróbuj jeszcze raz lub skorzystaj z innej metody płatności.')
      return res.redirect(`/order/${req.params.ref}`)
    } else {
      req.flash('success', 'Płatność została zrealizowana.')

      await Order.update({ // UPDATE DATABASE - ZAPŁACONE
        payment_status: "zapłacone",
      }, {
        where: {
          order_ref: req.params.ref
        }
      }).catch((error) => {
        console.error('Failed to update data', error) // For DB connection errors
        req.flash('error', 'Nie udało się zaktualizować statusu zlecenia - powiadom o błędzie administratora strony "admin@szparowanie.pl, przepraszamy za komplikacje.')
      })
      
      // res.locals.payment_paid_amount = payment.transactions[0].amount.total
      // res.locals.payment_currency = payment.transactions[0].amount.currency
      // res.locals.payment_method = payment.payer.payment_method
      // res.locals.payment_fee = payment.transactions[0].related_resources[0].sale.transaction_fee.value
      
      // res.locals.payment_ = payment.
      // res.locals.payment_ = payment.
      // res.locals.payment_ = payment.
      res.locals.payment_order_ref = req.params.ref
      res.locals.payment = payment
      res.locals.user_email = toBeSend.email
      res.locals.order_id = toBeSend.id
      
      routesController.send_Paid(req, res)
      res.render('client_accept_pay_success', {
        error: req.flash('error'),
        success: req.flash('success'),
        email: toBeSend.email,
        payerData: payment,
        user: req.user,
        title: "szparowanie - udana płatność"
      });
    }

  });
};


module.exports.createPayment = createPayment;
module.exports.executePayment = executePayment;