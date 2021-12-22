var express = require('express');
var router = express.Router();
const UserModel = require('../models/user');
const ListingModel = require('../models/listing');
const bcrypt = require('bcrypt');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
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

router.get('/logout', function(req, res, next) {
  req.session.destroy((err) => {
    res.status(500).send(err);
  });
  res.redirect('/login');
});

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

router.get('/profile/:username/edit', function(req, res) {
    res.render('edit_profile', {user: res.locals.user});
});

router.put('/profile/:username', async function(req, res) {
  if(res.locals.user.username == req.params.username) {
    await UserModel.findByIdAndUpdate(req.session.user_id, req.body);
    res.redirect(`/users/profile/${res.locals.user.username}`);
  } else {
    res.status(403).send("You do not have permission to edit.");
  }
});

router.get('/profile/:username', async function(req, res) {
  const listings = await ListingModel.find({user: res.locals.user}).populate('suite').populate({path: 'suite', populate: {path: 'building'}});
  res.render('profile', {user: res.locals.user, listings: listings});
});

module.exports = router;
