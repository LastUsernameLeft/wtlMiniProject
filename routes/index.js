var express = require('express');
var router = express.Router();

var  Cart = require('../models/cart');
var Order = require('../models/order');
var Product = require('../models/product');

/* GET home page. */
router.get('/', function(req, res, next)
{
  var successMsg = req.flash('success')[0];
  Product.find(function (err, docs)
  {
      res.render('index', { title: 'Gamestop Shop', products: docs, successMsg: successMsg, noMessages: !successMsg});
  });
  //res.render('index', { title: 'Shopping Cart', products: products});
});

router.get('/add-to-cart/:id', function (req, res, next)
{
    var productID = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

    Product.findById(productID, function (err, product)
    {
       if(err)
       {
           return res.redirect('/');
       }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/');
    });
});

router.get('/shopping-cart', function (req, res, next)
{
    if(!req.session.cart)
    {
        return res.render('shopping-cart', {products: null});
    }
    var cart = new Cart(req.session.cart);
    res.render('shopping-cart',
        {
            products: cart.generateArray(),
            totalPrice: cart.totalPrice
        });
});

router.get('/checkout', isLoggedIn, function (req, res, next)
{
    if(!req.session.cart)
    {
        return res.redirect('shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.get('/reduce/:id', function (req, res, next)
{
    var productID = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

    cart.reduceByOne(productID);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/remove/:id', function (req, res, next)
{
    var productID = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

    cart.removeItem(productID);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.post('/checkout', isLoggedIn, function (req, res, next)
{
    if(!req.session.cart)
    {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var stripe = require("stripe")(
        "sk_test_ygrjLxIIXqVXvFWxBlYEtkDf"
    );

    stripe.charges.create(
    {
        amount: cart.totalPrice * 100,
        currency: 'usd',
        source:  req.body.stripeToken, // obtained with Stripe.js
        description: "Test Charge"
    },
    function(err, charge)
    {
        // asynchronously called
        if (err)
        {
            req.flash('error',err.message);
            console.log(err.message);
            return res.redirect('/');
        }
        var order = new Order(
            {
                user: req.user,
                cart: cart,
                address: req.body.address,
                name: req.body.name,
                paymentID: charge.id
            });
        order.save(function (err, result)
        {
            if (err)
            {
                //req.flash('error',err.message);
                console.log(err.message);
                return res.redirect('/');
            }
            req.flash('success', 'Successfully paid');
            req.session.cart = null;
            res.redirect('/');
        });
    });
});

module.exports = router;

function isLoggedIn(req, res ,next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}