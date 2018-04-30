var passport = require('passport')
var express = require('express');
var router = express.Router();
var agentController = require('../controller/agentController');
var userController = require('../controller/userController');

router.get('/agent', agentController.getAgent);
router.get('/getAgentById/:id', agentController.getAgentById);
router.post('/addAgent', agentController.addAgent);
router.post('/updateAgent', agentController.updateAgent);
router.get('/deleteAgent/:id', agentController.deleteAgent);

router.get('/user', userController.getUser);
router.get('/getUserById/:id',userController.getUserById);
router.post('/addUser', passport.authenticate('local-signup',{
        successRedirect: '/setting/user',
        failureRedirect: '/setting/user',
        failureFlash: true  
    })
);
router.post('/updateUser',passport.authenticate('local-update',{
        successRedirect: '/setting/user',
        failureRedirect: '/setting/user',
        failureFlash: true  
    })
)
router.get('/deleteUser/:id',userController.deleteUser)

module.exports = router
