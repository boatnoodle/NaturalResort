var passport = require("passport");
var db = require("../config/mysql");

module.exports = {
  getUser: function(req, res, next) {
    db.query(`SELECT * FROM user WHERE 1`, function(err, rows) {
      if (err) {
        throw err;
      } else {
        res.render("setting/user", { data: rows, status: req.flash() });
      }
    });
  },
  getUserById: function(req, res, next) {
    var userId = req.params.id;
    db.query(`SELECT * FROM user WHERE userId = ${userId}`,function(err, rows){
        if(err){
            throw err;
        }else{
            res.json(rows[0])
        }
    });
  },
  deleteUser: function(req,res,next){
      var userId = req.params.id;
      db.query(`DELETE FROM user WHERE userId = ${userId}`,function(err, rows){
          if(err){
              throw err
          }else{
            req.flash('success', 'ลบผู้ใช้สำเร็จแล้ว')
            res.redirect('/setting/user')
          }
      })
  }
};
