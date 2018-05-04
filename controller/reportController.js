var db = require("../config/mysql");

module.exports = {
  getDataReportDaily: function(req, res, next) {
    var date = req.body.date
    var sql = `SELECT * FROM couponDetail LEFT JOIN agent ON couponDetail.agentId = agent.agentId WHERE created LIKE '${date}%' ORDER BY type ASC`;
      console.log(sql)
    db.query(sql, function(err,rows){
      if(err){
        throw err;
      }else{
        res.json(rows);
      }
    })
  },
  getDataReportMonthly: function(req, res, next){
    var from = req.body.from,
        to = req.body.to
        
    var sql = `SELECT agentName, SUM(pax) AS totalPax, DATE(created) AS created 
                FROM couponDetail
                LEFT JOIN agent ON agent.agentId = couponDetail.agentId
                WHERE DATE(created) BETWEEN '${from}' AND '${to}' AND type = 1
                GROUP BY DATE(created),couponDetail.agentId`;
    db.query(sql ,function(err, rows){
      if(err){
        throw err;
      }else{
        res.json(rows);
      }
    })        
  },
  getUserPax: function(req, res, next){
    var date = req.body.date
    var sql = `SELECT user.name, SUM(pax) as totalPax, DATE(created) as created
                FROM couponDetail 
                LEFT JOIN user ON user.userId = couponDetail.userId
                WHERE DATE(created) = '${date}'
                GROUP BY couponDetail.userId`
    db.query(sql ,function(err, rows){
      if(err){
        throw err;
      }else{
        res.json(rows);
      }
    })  
  }
};
