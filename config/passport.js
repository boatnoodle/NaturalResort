var passport = require("passport");
var con = require("../config/mysql");

module.exports = function(app) {
  // set passport
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    con.query(`SELECT * FROM user WHERE userId = ${id}`, function(err, rows) {
      done(err, rows[0]);
    });
  });
  
  require('./stratagies/local')();
};
