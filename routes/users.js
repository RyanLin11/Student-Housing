var express = require('express');
var router = express.Router();
const UserModel = require('../models/user');
const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res) {
  res.render('login');
})

router.post('/login', async function(req, res, next) {
  const db_user = await UserModel.findOne({username: req.body.username});
  console.log(req.body.password);
  console.log(db_user.password);
  bcrypt.compare(req.body.password, db_user.password, function(err, result) {
    if(err) {
      res.status(500).send(err);
    } else if(result) {
      //log user in
      req.session.loggedIn = true;
      req.session.username = req.body.username;
      res.redirect('/listing');
    } else {
      res.render('login', {errorMessage: 'Incorrect Username or Password'});
    }
  });
});

router.get('/logout', function(req, res, next) {
  req.session.destroy((err) => {
    res.status(500).send(err);
  });
  res.redirect('/users/login');
});

router.get('/register', function(req, res) {
  res.render('register');
})

router.post('/register', function(req, res) {
  if(UserModel.findOne(req.body.username)){
    res.render('register', {errorMessage: 'Username is already taken.'});
  } else if(req.body.password == req.body.repassword) {
      bcrypt.hash(req.body.password, 10, function(err, hash) {
        if(err) {
          res.status(500).send(err);
        } else {
          req.body.password = hash;
          const user = new UserModel(req.body);
          user.save();
          res.redirect('/users/login');
        }
      });
  } else {
    res.render('register', {errorMessage: 'Passwords do not match.'});
  }
});

router.get('/profile/edit', function(req, res) {
  UserModel.findOne({username: req.session.username}, function(err, result) {
    if(err) {
      res.status(500).send(err);
    }
    if(result) {
      res.render('editprofile', {user: result});
    } else {
      res.render('notfound');
    }
  });
});

router.post('/profile/edit', async function(req, res) {
  await UserModel.findOneAndUpdate({username: req.session.username}, req.body);
  res.redirect(`/users/profile/${req.session.username}`);
});

router.get('/profile/:username', function(req, res) {
  UserModel.findOne({username: req.params.username}, function(err, result) {
    if(err) {
      res.status(500).send(err);
    }
    if(result) {
      res.render('profile', {user: result});
    } else {
      res.render('notfound');
    }
  });
});

module.exports = router;
