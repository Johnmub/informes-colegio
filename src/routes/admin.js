const func = require('../func.js');

module.exports = (app, db) => {

  require('./admin/publicaciones')(app, db, func);
  require('./admin/representantes')(app, db, func);
  require('./admin/alumnos')(app, db, func);
  require('./admin/niveles')(app, db, func);
  require('./admin/usuarios')(app, db, func);
  require('./admin/respaldo')(app, db, func);
  require('./admin/ayuda')(app, db, func);
  require('./admin/profile')(app, db, func);

  app.get('/panel/*', func.accesoAdmin, (req, res) => {
    return func.admin_404(res);
  });

};
