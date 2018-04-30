var express = require('express');
var router = express.Router()

router.get('/coupon',function(req,res,next){
    res.render('coupon');
})

router.get('/rePrintCoupon', function(req, res, next) {
    res.render('rePrintCoupon')
})
module.exports = router;