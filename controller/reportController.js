var db = require("../config/mysql");

module.exports = {
  getDataReportDaily: function(req, res, next) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    var today = yyyy + "-" + mm + "-" + dd;
    var sql = `SELECT * FROM couponDetail LEFT JOIN agent ON couponDetail.agentId = agent.agentId WHERE created LIKE '${today}%' ORDER BY type ASC`;
    db.query(sql, function(err,rows){
      if(err){
        throw err;
      }else{
        res.json(rows);
      }
    })
  },
  getDataReportMonthly: function(req, res, next){
    var month = req.body.month,
        year = req.body.year,
        yearMonth = year + '-' + month;
        
    var sql = `SELECT agentName, SUM(pax) AS totalPax, DATE(created) AS created 
                FROM couponDetail
                LEFT JOIN agent ON agent.agentId = couponDetail.agentId
                WHERE created LIKE '${yearMonth}%' AND type = 1
                GROUP BY DATE(created),couponDetail.agentId`;
    db.query(sql ,function(err, rows){
      if(err){
        throw err;
      }else{
        res.json(rows);
      }
    })        
  }
};
