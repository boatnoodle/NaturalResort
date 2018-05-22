var db = require("../config/mysql")
module.exports = {
  getAgent: function(req, res, next) {
    var sql = `SELECT * FROM agent WHERE 1`
    db.query(sql, function(error, result) {
      if (error) {
        throw error
      } else {
        var data = {}
        var arr = []
        result.forEach(element => {
          if(element.statusWalkIn == 0){
            var statusName = "No walk in"
          }else{
            var statusName = "Walk in"
          }
          data = {
            agentId: element.agentId,
            agentName: element.agentName,
            statusWalkIn: element.statusWalkIn,
            statusName: statusName
          }
          arr.push(data)
        })
        res.render("setting/agent", { data: arr, status: req.flash() })
      }
    })
  },
  getAgentById: function(req, res, next){
    var agentId = req.params.id
    db.query(`SELECT * FROM agent WHERE agentId = ${agentId}`,function(error,rows){
        if(error){
          throw error
        }else{
          res.json(rows[0])
        }
    })
  },
  addAgent: function(req, res, next) {
    var agentName = req.body.agentName,
        statusWalkIn = req.body.statusWalkIn
        if(statusWalkIn == undefined){
          statusWalkIn = 0
        }
        sql = `INSERT INTO agent (agentName,statusWalkIn) VALUES ('${agentName}',${statusWalkIn})`
    db.query(sql, function(error, result) {
      if (error) {
        req.flash("error", "เพิ่มข้อมูลไม่สำเร็จ")
      } else {
        req.flash("success", "เพิ่มข้อมูลสำเร็จ")
      }
      res.redirect("/setting/agent")
    })
  },
  updateAgent: function(req, res, next){
    var agentId = req.body.agentId,
        agentName = req.body.agentName,
        statusWalkIn = req.body.statusWalkIn
        console.log(statusWalkIn)
    db.query(`UPDATE agent SET agentName = '${ agentName }', statusWalkIn = ${statusWalkIn} WHERE agentId = ${ agentId }`, function(error, rows){
      if (error){
        req.flash("error", "ไม่สามารถแก้ไขข้อมูลตัวแทนได้")
      } else{
        req.flash("success", "แก้ไขข้อมูลตัวแทนสำเร็จ")
      }
      res.redirect("/setting/agent")
    })
  },
  deleteAgent: function(req, res, next){
    var agentId = req.params.id
    db.query(`DELETE FROM agent WHERE agentId = ${agentId}`,function(error, rows){
      if(error){
        req.flash('error', 'ไม่สามารถลบตัวแทนได้')
      }else{
        req.flash('success', 'ลบตัวแทนสำเร็จ')
      }
      res.redirect("/setting/agent")
    })
  }
}
