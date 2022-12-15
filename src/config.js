const flash         = require('connect-flash'),
      bodyParser    = require('body-parser'),
      LocalStrategy = require('passport-local');

module.exports = (app, db, express, passport) => {
  
  app.set('view engine', 'ejs');
  app.use(express.static('static'));

  app.use(bodyParser.urlencoded({extended: true}));

  app.use(flash());

  app.use(require('express-session')({
    secret: 'key',
    resave: false,
    saveUninitialized: false
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(function(req, res, next) {
    res.locals.sesion = req.user;
    res.locals.mensaje = {
      error   : req.flash('error'),
      info    : req.flash('info')
    };
    next();
  });

  passport.use(new LocalStrategy(function(username, clave, done) {
    const func = require('./func.js');
    db.get('SELECT id, usuario, representante_id, super FROM usuario WHERE usuario=? AND clave=? AND estado=TRUE',
           username, func.hashPassword(clave), function(err, row) {
      if (!row) return done(null, false);
      return done(null, row);
    });
  }));

  passport.serializeUser(function(user, done) {
    return done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    db.get('SELECT id, usuario, representante_id, super FROM usuario WHERE id=?', id, function(err, row) {
      if (!row) return done(null, false);
      return done(null, row);
    });
  });

}
