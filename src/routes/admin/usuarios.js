module.exports = (app, db, func) => {

  app.get('/panel/usuarios', func.accesoAdmin, (req, res) => {
    var modulo = func.metaModulo('usuarios');
    db.all('SELECT * FROM usuario', (err, reg) => {
      if(err) return func.admin_error(res, err);
      modulo.registro = reg;
      db.all('SELECT * FROM representante', (err, reg) => {
        if(err) return func.admin_error(res, err);
        modulo.registro.forEach((usuario) => {
          usuario.representante = reg.find((r) => { return r.id == usuario.representante_id });
        });
        res.render('admin/base', { modulo: modulo });
      });
    });
  });

  app.get('/panel/usuarios/agregar', func.accesoAdmin, (req, res) => {
    if(!req.user.super) {
      req.flash('error', 'No puedes realizar esta operación');
      return res.redirect('/panel/usuarios');
    }
    var modulo = func.metaModulo('usuarios', 'agregar');
    db.all('SELECT * FROM representante WHERE estado=TRUE', (err, reg) => {
      if(err) return func.admin_error(res, err);
      modulo.representante = reg;
      res.render('admin/base', { modulo: modulo });
    });
  });

  app.post('/panel/usuarios/agregar', func.accesoAdmin, (req, res) => {
    var username  = req.body.username;
    var password  = req.body.password;
    var correo    = req.body.correo;

    if(! func.ValidVar( [ username, password, correo ] ) )
      return func.admin_404(res);

    if(! func.NotNull( [ username, password, correo ] ) )
      return ( req.flash('error', 'Campos invalidos'), res.redirect('/panel/usuarios') );

    db.get('SELECT usuario FROM usuario WHERE usuario=?', username, (error, result) =>
    {
      if(error) 
        return func.admin_error(res, error);

      if(!result)
      {
        db.get('SELECT usuario FROM usuario WHERE correo=?', correo, (error, row) => {
          if(error) 
            return func.admin_error(res, error);
          if(!row)
          {
            db.run('INSERT INTO usuario VALUES (NULL,?,?,NULL,FALSE,?,TRUE)', username, func.hashPassword(password), correo, (err) => 
            {
              if(err) 
                return func.admin_error(res, err);

              req.flash('info', 'Registraste con exito el administrador "' + username + '"');
              res.redirect('/panel/usuarios');
            });
          }
          else
          {
            req.flash('error', 'Ya existe una cuenta registrada con el correo "' + correo + '"');
            res.redirect('/panel/usuarios/agregar');
          }
        });
      }
      else
      {
        req.flash('error', 'Ya existe una cuenta registrada con el usuario "' + username + '"');
        res.redirect('/panel/usuarios/agregar');
      }
    });
  });

  app.post('/panel/usuarios/:id/eliminar', func.accesoAdmin, (req, res) => {
    db.get('SELECT usuario, representante_id, super FROM usuario WHERE id=?', req.params.id,
           (err, reg) => {
      if(err) return func.admin_error(res, err);
      if(!reg) return func.admin_404(res);
      if(reg.super  || (reg.representante_id == null && !req.user.super)) {
        req.flash('error', 'No puedes realizar esta operación');
        return res.redirect('/panel/usuarios');
      }
      db.run('DELETE FROM usuario WHERE id=?', req.params.id, (err) => {
        if(err) return func.admin_error(res, err);
        req.flash('info', 'Eliminaste el usuario "' + reg.usuario + '"');
        res.redirect('/panel/usuarios');
      });
    });
  });

};
