var express = require("express");
var router = express.Router();
var db = require("../config/mysql");

router.get("/getLastIdCoupon", function(req, res, next) {
  db.query(
    `SELECT couponId, runNoStart,runNoEnd FROM couponDetail WHERE 1 AND type = 1 ORDER BY  couponId DESC  LIMIT 1`,
    (err, rows) => {
      if (err) {
        throw err;
      } else {
        res.json(rows[0]);
        //   res.json(rows);
      }
    }
  );
});

router.post("/addCoupon", function(req, res, next) {
  var data = {
    runNoStart: req.body.runNoStart,
    runNoEnd: req.body.runNoEnd,
    agentId: req.body.agent.agentId,
    roomNo: req.body.roomNo,
    checkIn: req.body.checkIn,
    checkOut: req.body.checkOut,
    totalDate: req.body.totalDate,
    pax: req.body.pax,
    remarks: req.body.remarks
  };
  var sql = `INSERT INTO couponDetail (runNoStart,runNoEnd,agentId,roomNo,checkIn,checkOut,totalDate,pax,remarks) 
              VALUES ('${data.runNoStart}','${data.runNoEnd}','${
    data.agentId
  }','${data.roomNo}','${data.checkIn}'
                      ,'${data.checkOut}','${data.totalDate}','${data.pax}','${
    data.remarks
  }')`;
  db.query(sql, function(err, rows) {
    if (err) {
      throw err;
    } else {
      var couponId = rows.insertId;
      var dateObj = new Date(data.checkIn);
      var start = dateObj.setDate(dateObj.getDate() + 1);
      var end = new Date(data.checkOut);
      var runNo = data.runNoStart;

      for (let i = 0; i < data.pax; i++) {
        var loop = new Date(start);
        while (loop <= end) {
          var dd = loop.getDate();
          var mm = loop.getMonth() + 1;
          var yyyy = loop.getFullYear();

          if (dd < 10) {
            dd = "0" + dd;
          }
          if (mm < 10) {
            mm = "0" + mm;
          }

          var date = yyyy + "-" + mm + "-" + dd;
          db.query(
            `INSERT INTO couponList (couponId,runNo,date) VALUES ('${couponId}','${runNo}','${date}')`,
            function(err, rows) {
              if (err) {
                throw err;
              }
            }
          );

          runNo = parseInt(runNo) + 1;
          var newDate = loop.setDate(loop.getDate() + 1);
          loop = new Date(newDate);
        }
      }
      res.json("บันทึกรายการสำเร็จ");
    }
  });
});

router.get("/getLastedCoupon", function(req, res, next) {
  var sql = `SELECT * FROM couponDetail LEFT JOIN agent ON couponDetail.agentId = agent.agentId WHERE 1 AND type = 1  ORDER BY  couponDetail.couponId DESC LIMIT 0,5`;
  db.query(sql, function(err, rows) {
    if (err) {
      throw err;
    } else {
      res.json(rows);
    }
  });
});

router.post("/getBetweenCoupon", function(req, res, next) {
  var runNoStart = req.body.runNoStart;
  var runNoEnd = req.body.runNoEnd;
  if(runNoStart != '' && runNoEnd != ''){
      var sql = `SELECT * FROM couponList 
                  LEFT JOIN couponDetail ON couponList.couponId = couponDetail.couponId 
                  LEFT JOIN agent ON couponDetail.agentId = agent.agentId
                  WHERE runNo BETWEEN ${runNoStart} AND ${runNoEnd}`;
      db.query(sql, function(err, rows) {
        if (err) {
          throw err;
        } else {
          res.json(rows);
        }
      });
  }else{
    res.json([])
  }
});

router.post("/reprintCoupon", function(req, res, next) {
  var sql = `INSERT INTO couponDetail (runNoStart,runNoEnd,remarks,type) VALUES ('${req.body.runNoStart}','${req.body.runNoEnd}','${req.body.remark}','2')`;
  db.query(sql ,function(err, rows){
    if(err){
      throw err;
    }else{
      res.send('บันทึกข้อมูลสำเร็จ')
    }
  })
});

router.get("/getReprint", function(req, res, next){
  var sql = `SELECT couponId,runNoStart,runNoEnd,remarks, created FROM couponDetail WHERE 1 AND type = 2 ORDER BY couponId DESC`
  db.query(sql, function(err, rows){
    if(err){
      throw err;
    }else{
      // var data = {
      //   "responseData": rows
      // }
      res.json(rows)
    }
  })
})
module.exports = router;
