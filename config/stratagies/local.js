var passport = require("passport")
var LocalStrategy = require("passport-local").Strategy
var con = require("../../config/mysql")

module.exports = function() {
    passport.use("local-signin", new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, username, password, done) {
            con.query(`SELECT * FROM user WHERE username = '${username}' AND password = '${password}'`,
                function(err, rows) {
                    if (err) {
                        return done(err)
                    }
                    if (!rows.length) {
                        return done(null,false, req.flash("error", "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"))
                    }
                    return done(null, rows[0])
                }
            )}
        )
    )
    passport.use("local-signup", new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
        function(req, username, password, done){
            con.query(`SELECT * FROM user WHERE username = '${username}'`,function(err,rows){
                if(err){
                    return done(err)
                }
                if(rows.length > 0){
                    return done(null,false,req.flash('error', "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว"))
                }else{
                    var newUser = {}
                    newUser.username = username
                    newUser.password = password
                    newUser.name = req.body.name
                    con.query(`INSERT INTO user (username,password,name) VALUES ('${newUser.username}','${newUser.password}','${newUser.name}')`,function(err,rows){
                        newUser.id = rows.insertId
                        return done(null, false, req.flash("success", "เพิ่มผู้ใช้สำเร็จ"))
                    })
                }
            })
        }
    ))
    passport.use("local-update", new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, username, password, done) {
        var userId = req.body.userId,
        name = req.body.name
        con.query(`UPDATE user SET name = '${name}', password = '${password}' WHERE userId = ${userId}`,
            function(err, rows) {
                if (err) {
                    return done(err)
                }else{
                    con.query(`SELECT * FROM user WHERE username = '${username}'`,function(err,rows){
                        if(err){
                            return done(err)
                        }
                        if(rows.length > 0){
                            return done(null,false,req.flash('error', "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว"))
                        }else{
                            con.query(`UPDATE user SET username = '${username}' WHERE userId = ${userId}`,
                                function(err, rows) {
                                    if (err) {
                                        return done(err)
                                    }else{
                                        return done(null,false, req.flash("success", "แก้ไขข้อมูลผู้ใช้สำเร็จ"))
                                    }
                                }
                            )
                        }
                    })
                }
            }
        )
            // con.query(`SELECT * FROM user WHERE username = '${username}'`,function(err,rows){
            //     if(err){
            //         return done(err)
            //     }
            //     if(rows.length > 0){
            //         return done(null,false,req.flash('error', "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว"))
            //     }else{
            //         var userId = req.body.userId,
            //             name = req.body.name
            //         con.query(`UPDATE user SET username = '${username}', password = '${password}', name = '${name}' WHERE userId = ${userId}`,
            //             function(err, rows) {
            //                 if (err) {
            //                     return done(err)
            //                 }else{
            //                     return done(null,false, req.flash("success", "แก้ไขข้อมูลผู้ใช้สำเร็จ"))
            //                 }
            //             }
            //         )
            //     }
            // })
        }
    )
)

}
