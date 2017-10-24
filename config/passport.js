var  passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;


//tells passport how to store the user in the session (serialize user by id)
passport.serializeUser(function (user, done)
    {
        done(null, user.id);
    }
);

//retrieve user by id
passport.deserializeUser(function (id, done)
    {
        User.findById(id, function (err, user)
            {
                done(err, user);
            }
        );
    }
);

//middleware to create new user (SIGN UP)
passport.use('local.signup', new  LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, email, password, done)
    {
        req.checkBody('email','Invalid email').notEmpty().isEmail();
        req.checkBody('password','Invalid password').notEmpty().isLength({min:4});
        var errors = req.validationErrors();
        if (errors)
        {
            var messages = [];
            errors.forEach(function (error)
                {
                    messages.push(error.msg);
                });
            return done(null, false, req.flash('error', messages));
        }
        User.findOne({'email': email}, function (err, user)
            {
                if(err)
                {return done(err);}
                if(user)
                {return done(null,false, {message: 'Email is already in use'});}
                var newUser = new User();
                newUser.email = email;
                newUser.password = newUser.encryptPassword(password);
                newUser.save(function (err, result)
                    {
                        if(err)
                        {return done(err);}
                        return done(null, newUser);
                    });
            });
    }
));

//middleware to login user (SIGN IN)

passport.use('local.signin', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, email, password, done)
    {
        req.checkBody('email', 'Invalid email').notEmpty().isEmail();
        req.checkBody('password', 'Invalid password').notEmpty();
        var errors = req.validationErrors();
        if (errors)
        {
            var messages = [];
            errors.forEach(function (error)
                {
                    messages.push(error.msg);
                });
            return done(null, false, req.flash('error', messages));
        }
        User.findOne({'email': email}, function (err, user)
        {
            if(err)
            {return done(err);}
            if(!user)
            {return done(null,false, {message: 'No such email found'});}
            if(!user.validPassword(password))
            {return done(null, false, {message: 'Incorrect Password'});}
            return done(null, user);
        });
    }
));