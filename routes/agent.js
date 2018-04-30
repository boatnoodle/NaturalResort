var express = require('express');
var router = express.Router();
var db = require('../config/mysql');

router.get('/getDataAgent', function(req,res,next){
    db.query(`SELECT * FROM agent WHERE 1`, (err,rows) =>{
        if(err){
            throw err;
        }else{
            res.json(rows)
        }
    })
})

module.exports = router;