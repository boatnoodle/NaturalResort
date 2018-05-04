var passport = require('passport')
var express = require('express');
var router = express.Router();

router.post('/signin', passport.authenticate('local-signin',{
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true  
    })
);

router.get('/signout', function(req,res,next){
    req.logout();
    res.redirect('/');
})

module.exports = router
