var express = require('express');
var router = express.Router();
const UserModel = require('../models/user');
const ListingModel = require('../models/listing');
const PhotoModel = require('../models/photo');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/logout', function(req, res, next) {
  req.session.destroy((err) => {
    res.status(500).send(err);
  });
  res.redirect('/login');
});

router.get('/profile/:username/edit', function(req, res) {
  res.render('edit_profile', {user: res.locals.user});
});

router.post('/profile/:username/edit', async function(req, res) {
  if(res.locals.user.username == req.params.username) {
    //If the user has uploaded a photo
    if(req.files) {
      //If the user already has a photo, delete it
      if(res.locals.user.photo) {
        res.locals.user.photo.deleteOne();
      }
      //Upload new profile photo
      try {
        const photo = await PhotoModel.createWithData(req.files.photo);
        req.body.photo = photo._id;
      } catch (err) {
        console.log(err);
      }
    }
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
