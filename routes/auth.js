const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const UserModel = require('../models/user');

//Login Page
router.get('/login', function(req, res) {
    res.render('login');
});

router.post('/login', async function(req, res, next) {
    const db_user = await UserModel.findOne({username: req.body.username});
    bcrypt.compare(req.body.password, db_user.password, function(err, result) {
        if(err) {
        res.status(500).send(err);
        } else if(result) {
        req.session.loggedIn = true;
        req.session.user_id = db_user._id;
        res.redirect('/');
        } else {
        res.render('login', {errorMessage: 'Incorrect Username or Password'});
        }
    });
});

//Register Page
router.get('/register', function(req, res) {
    res.render('register');
})

router.post('/register', async function(req, res) {
    const username_in_db = await UserModel.exists({username: req.body.username});
    if(username_in_db){
        res.render('register', {errorMessage: 'Username is already taken.'});
    }
    if(req.body.password == req.body.repassword) {
        bcrypt.hash(req.body.password, 10, async function(err, hash) {
        if(err) {
            res.status(500).send(err);
        } else {
            req.body.password = hash;
            const user = new UserModel(req.body);
            await user.save();
            res.redirect('/login');
        }
        });
    } else {
        res.render('register', {errorMessage: 'Passwords do not match.'});
    }
});

module.exports = router;