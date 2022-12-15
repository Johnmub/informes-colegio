module.exports = (app, db, func) => {

  app.get('/panel/representantes', func.accesoAdmin, (req, res) => {
    var modulo = func.metaModulo('representantes');
    db.all('SELECT * FROM representante WHERE estado=TRUE', (err, reg) => {
      if(err) return func.admin_error(res, err);
      modulo.registro = reg;
      res.render('admin/base', { modulo: modulo });
    });
  });

  app.get('/panel/representantes/papelera', func.accesoAdmin, (req, res) => {
    var modulo = func.metaModulo('representantes', 'papelera');
    db.all('SELECT * FROM representante WHERE estado=FALSE', (err, reg) => {
      if(err) return func.admin_error(res, err);
      modulo.registro = reg;
      res.render('admin/base', { modulo: modulo });
    });
  });

  app.post('/panel/representantes/papelera/vaciar', func.accesoAdmin, (req, res) => {
    db.all('DELETE FROM representante WHERE estado=FALSE', (err, reg) => {
      if(err) return func.admin_error(res, err);
      req.flash('info', 'Has vaciado la papelera de representantes');
      res.redirect('/panel/representantes');
    });
  });

  app.get('/panel/representantes/agregar', func.accesoAdmin, (req, res) => {
    var modulo = func.metaModulo('representantes', 'agregar');
    res.render('admin/base', { modulo: modulo });
  });

  app.post('/panel/representantes/agregar', func.accesoAdmin, (req, res) => {
    var identificacion  = (req.body.nacionalidad + req.body.cedula);
    var nombre    = req.body.nombre;
    var apellido  = req.body.apellido;
    var telefono  = req.body.telefono;
    var direccion = req.body.direccion;
    var email     = req.body.correo;

    if(! func.ValidVar( [ identificacion, nombre, apellido, telefono, direccion, email ] ) )
      return func.admin_404(res);

    if(! func.NotNull( [ identificacion, nombre, apellido, telefono, direccion, email ] ) )
      return ( req.flash('error', 'Campos invalidos'), res.redirect('/panel/representantes') );

    db.all('SELECT usuario, correo FROM usuario WHERE correo=?', email, (error, result) => {
      if(error) return func.admin_error(res, error);

      const resultado = result.find( (r) => { return r.correo == email });

      if( resultado )
      {
        req.flash('error', 'El usuario ' + resultado.usuario +' ya posee el correo ' + resultado.correo );
        return res.redirect('/panel/representantes/agregar');
      }


      db.all('SELECT id, cedula, nombre, apellido FROM representante WHERE cedula=?', identificacion, (error_id, result_id) => {
        if(error_id)return func.admin_error(res, error_id);

        const resultado = result_id.find( (r) => { return r.cedula == identificacion });

        if( resultado )
        {
          req.flash('error', 'El representante ' + resultado.nombre + ' ' + resultado.apellido +' ya posee la identificacion ' + resultado.cedula );
          return res.redirect('/panel/representantes/agregar');
        }

        db.run('INSERT INTO representante VALUES (NULL,?,?,?,?,?,?,TRUE)', [identificacion, nombre, apellido, telefono, direccion, email],function(err) {
          if(err) return func.admin_error(res, err);

          var representante_id = this.lastID;
          db.run('INSERT INTO usuario VALUES (NULL,?,?,?,FALSE,?,TRUE)', [req.body.cedula, func.hashPassword(req.body.cedula),representante_id, email], (err) => {
            if(err) return func.admin_error(res, err);

            req.flash('info', 'Registraste el representante "' + nombre+ ' ' + apellido + '"');
            res.redirect('/panel/representantes');
          });
        });
      });
    });
  });

  app.get('/panel/representantes/:id', func.accesoAdmin, (req, res) => {
    var modulo = func.metaModulo('representantes', 'ver');
    db.get('SELECT * FROM representante WHERE id=?', req.params.id,
         (err, reg) => {
      if(err) return func.admin_error(res, err);
      if(!reg) return func.admin_404(res);
      modulo.registro = reg;
      res.render('admin/base', { modulo: modulo });
    });
  });

  app.get('/panel/representantes/:id/modificar', func.accesoAdmin, (req, res) => {
    var modulo = func.metaModulo('representantes', 'modificar');
    db.get('SELECT * FROM representante WHERE id=? AND estado=TRUE', req.params.id,
           (err, reg) => {
      if(err) return func.admin_error(res, err);
      if(!reg) return func.admin_404(res);
      modulo.registro = reg;
      res.render('admin/base', { modulo: modulo });
    });
  });

  app.post('/panel/representantes/:id/modificar', func.accesoAdmin, (req, res) => {
    var nombre    = req.body.nombre;
    var apellido  = req.body.apellido;
    var telefono  = req.body.telefono;
    var direccion = req.body.direccion;
    var email     = req.body.correo;

    if(! func.ValidVar( [ nombre, apellido, telefono, direccion, email ] ) )
      return func.admin_404(res);

    if(! func.NotNull( [ nombre, apellido, telefono, direccion, email ] ) )
      return ( req.flash('error', 'Campos invalidos'), res.redirect('/panel/representantes') );

    db.all('SELECT usuario, correo FROM usuario WHERE correo=?', email, (error, result) => {
      if(error) return func.admin_error(res, error);

      const resultado = result.find( (r) => { return r.correo == email });

      if( resultado )
      {
        req.flash('error', 'El usuario ' + resultado.usuario +' ya posee el correo ' + resultado.correo );
        return res.redirect('/panel/representantes/'+ req.params.id +'/modificar');
      }

      db.run('UPDATE representante SET nombre=?,apellido=?,telefono=?,direccion=?,correo=? WHERE id=?', req.body.nombre, req.body.apellido, req.body.telefono, req.body.direccion, req.body.correo, req.params.id, (err) => {
        if(err) return func.admin_error(res, err);

        req.flash('info', 'Modificaste el representante Id. ' + req.params.id);
        res.redirect('/panel/representantes/' + req.params.id);
      });

    });
  });

  app.post('/panel/representantes/:id/eliminar', func.accesoAdmin, (req, res) => {
    db.run('UPDATE representante SET estado=FALSE WHERE id=?', req.params.id,
           (err) => {
      if(err)
        return func.admin_error(res, err);

      db.run('UPDATE usuario SET estado=FALSE WHERE representante_id=?', req.params.id, (error) =>
      {
        if(err)
          return func.admin_error(res, err);

        req.flash('info', 'Enviaste el representante Id. ' + req.params.id + ' a la papelera');
        res.redirect('/panel/representantes');
      });
    });
  });

  app.post('/panel/representantes/:id/recuperar', func.accesoAdmin, (req, res) => {
    db.get('SELECT cedula, correo FROM representante WHERE id=?', req.params.id, (error, result_r) =>
    {
      if(error)
        return func.admin_error(res, error);
      if(result_r)
      {
        db.run('UPDATE representante SET estado=TRUE WHERE id=?', req.params.id, (err) => {
          if(err)
            return func.admin_error(res, err);

            db.get('SELECT representante_id FROM usuario WHERE representante_id=?', req.params.id, (error, result) => {
              if(error)
                return func.admin_error(res, error);

              if(!result)
              {
                db.run('INSERT INTO usuario VALUES (NULL,?,?,?,FALSE,?,TRUE)', result_r.cedula.slice(1), func.hashPassword( (result_r.cedula.slice(1)) ), req.params.id, result_r.correo, (err) =>
                {
                  if(err)
                    return func.admin_error(res, err);

                  req.flash('info', 'Recuperaste el representante Id. ' + req.params.id);
                  res.redirect('/panel/representantes/' + req.params.id);
                });
              }
              else
              {
                db.run('UPDATE usuario SET estado =TRUE WHERE representante_id=?', req.params.id, (err) =>
                {
                  if(err)
                    return func.admin_error(res, err);

                  req.flash('info', 'Recuperaste el representante Id. ' + req.params.id);
                  res.redirect('/panel/representantes/' + req.params.id);
                });
              }
            });
        });
      }
    });
  });

};
