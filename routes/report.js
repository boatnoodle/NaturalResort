var express = require('express')
var router = express.Router()
var reportController = require('../controller/reportController')

router.get('/reportDaily',function(req,res,next){
    res.render('reports/reportDaily')
})

router.get('/reportMonthly', function(req, res, next) {
    res.render('reports/reportMonthly')
})

router.get('/reportRange', function(req, res, next) {
    res.render('reports/reportRange')
})

router.post('/getDataReportDaily', reportController.getDataReportDaily)

router.post('/getDataReportMonthly', reportController.getDataReportMonthly)

router.post('/getDataReportRange', reportController.getDataReportRange)

router.post('/getUserPax', reportController.getUserPax)


module.exports = router