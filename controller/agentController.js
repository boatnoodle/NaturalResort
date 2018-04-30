var db = require("../config/mysql");
module.exports = {
  getAgent: function(req, res, next) {
    var sql = `SELECT * FROM agent WHERE 1`;
    db.query(sql, function(error, result) {
      if (error) {
        throw error;
      } else {
        res.render("setting/agent", { data: result, status: req.flash() });
      }
    });
  },
  getAgentById: function(req, res, next){
    var agentId = req.params.id;
    db.query(`SELECT * FROM agent WHERE agentId = ${agentId}`,function(error,rows){
        if(error){
          throw error;
        }else{
          res.json(rows[0]);
        }
    })
  },
  addAgent: function(req, res, next) {
    var agentName = req.body.agentName,
        sql = `INSERT INTO agent (agentName) VALUES ('${agentName}')`;
    db.query(sql, function(error, result) {
      if (error) {
        req.flash("error", "เพิ่มข้อมูลไม่สำเร็จ");
      } else {
        req.flash("success", "เพิ่มข้อมูลสำเร็จ");
      }
      res.redirect("/setting/agent");
    });
  },
  updateAgent: function(req, res, next){
    var agentId = req.body.agentId,
        agentName = req.body.agentName;
    db.query(`UPDATE agent SET agentName = '${ agentName }' WHERE agentId = ${ agentId }`, function(error, rows){
      if (error){
        req.flash("error", "ไม่สามารถแก้ไขข้อมูลตัวแทนได้");
      } else{
        req.flash("success", "แก้ไขข้อมูลตัวแทนสำเร็จ");
      }
      res.redirect("/setting/agent");
    })
  },
  deleteAgent: function(req, res, next){
    var agentId = req.params.id;
    db.query(`DELETE FROM agent WHERE agentId = ${agentId}`,function(error, rows){
      if(error){
        req.flash('error', 'ไม่สามารถลบตัวแทนได้');
      }else{
        req.flash('success', 'ลบตัวแทนสำเร็จ');
      }
      res.redirect("/setting/agent");
    })
  }
};
