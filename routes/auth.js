const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');
const {body, validationResult} = require('express-validator');

//Login Page
router.get('/login', function(req, res) {
    res.render('login');
});

router.post(
    '/login', 
    body('username').trim().escape(),
    body('password').escape().custom((password, {req}) => {
        return UserModel.findOne({username: req.body.username}).then(async function(user) {
            if(user) {
                const result = await user.comparePassword(password);
                if(!result) {
                    return Promise.reject("Incorrect Password");
                }
            } else {
                return Promise.reject("No such user found");
            }
        })
    }),
    async function(req, res, next) {
        const validationErrors = validationResult(req);
        if(validationErrors.isEmpty()) {
            const db_user = await UserModel.findOne({username: req.body.username});
            req.session.loggedIn = true;
            req.session.user_id = db_user._id;
            res.redirect('/');
        } else {
            res.render('login', {errors: validationErrors.mapped()});
        }
    }
);

//Register Page
router.get('/register', function(req, res) {
    res.render('register');
})

router.post(
    '/register', 
    body('username').isLength({min:3}).bail().trim().escape().withMessage('Username must be at least 3 characters long').custom(value => {
        return UserModel.findOne({username: value}).then(user => {
            if(user) {
                return Promise.reject('Username is already in use');
            }
        })
    }),
    body('email').isEmail().bail().withMessage('Invalid Email').normalizeEmail().custom(value => {
        return UserModel.findOne({email: value}).then(user => {
            if(user) {
                return Promise.reject('E-mail already in use');
            }
        });
    }),
    body('password').escape().isLength({min: 6}).bail().withMessage('Password must be at least 6 characters long'),
    body('repassword').custom((value, {req}) => {
        if(value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
    async function(req, res) {
        const validationErrors = validationResult(req);
        if(validationErrors.isEmpty()) {
            const user = new UserModel(req.body);
            await user.save();
            res.redirect('/login');
        } else {
            res.render('register', {errors: validationErrors.mapped()});
        }
    }
);

module.exports = router;