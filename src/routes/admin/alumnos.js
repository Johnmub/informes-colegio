module.exports = (app, db, func) => {

  app.get('/panel/alumnos', func.accesoAdmin, (req, res) => {
    var modulo = func.metaModulo('alumnos');
    db.all('SELECT * FROM alumno WHERE estado=TRUE', (err, reg) => {
      if(err) return func.admin_error(res, err);
      modulo.registro = reg;
      db.all('SELECT * FROM nivel', (err, reg) => {
        if(err) return func.admin_error(res, err);
        modulo.registro.forEach((alumno) => {
          alumno.nivel = reg.find((r) => { return r.id == alumno.nivel_id });
        });
        modulo.nivel = reg;
        db.all('SELECT * FROM representante', (err, reg) => {
          if(err) return func.admin_error(res, err);
          modulo.registro.forEach((alumno) => {
            alumno.representante = reg.find((r) => { return r.id == alumno.representante_id });
          });

          res.render('admin/base', { modulo: modulo });
        });
      });
    });
  });

  app.get('/panel/alumnos/papelera', func.accesoAdmin, (req, res) => {
    var modulo = func.metaModulo('alumnos', 'papelera');
    db.all('SELECT * FROM alumno WHERE estado=FALSE', (err, reg) => {
      if(err) return func.admin_error(res, err);
      modulo.registro = reg;
      db.all('SELECT * FROM nivel', (err, reg) => {
        if(err) return func.admin_error(res, err);
        modulo.registro.forEach((alumno) => {
          alumno.nivel = reg.find((r) => { return r.id == alumno.nivel_id });
        });
        modulo.nivel = reg;
        db.all('SELECT * FROM representante', (err, reg) => {
          if(err) return func.admin_error(res, err);
          modulo.registro.forEach((alumno) => {
            alumno.representante = reg.find((r) => { return r.id == alumno.representante_id });
          });
          res.render('admin/base', { modulo: modulo });
        });
      });
    });
  });

  app.post('/panel/alumnos/papelera/vaciar', func.accesoAdmin, (req, res) => {
    db.all('DELETE FROM alumno WHERE estado=FALSE', (err, reg) => {
      if(err) return func.admin_error(res, err);
      req.flash('info', 'Has vaciado la papelera de alumnos');
      res.redirect('/panel/alumnos');
    });
  });

  app.get('/panel/alumnos/agregar', func.accesoAdmin, (req, res) => {
    var modulo = func.metaModulo('alumnos', 'agregar');
    db.all('SELECT * FROM nivel WHERE estado=TRUE', (err, reg) => {
      if(err) return func.admin_error(res, err);
      modulo.nivel = reg;
      console.log(modulo.nivel);
      db.all('SELECT * FROM representante WHERE estado=TRUE', (err, reg) => {
        if(err) return func.admin_error(res, err);
        modulo.representante = reg;
        res.render('admin/base', { modulo: modulo });
      });
    });
  });

  app.post('/panel/alumnos/agregar', func.accesoAdmin, (req, res) => {
    var nombre        = req.body.nombre;
    var apellido      = req.body.apellido;
    var edad          = req.body.edad;
    var sexo          = req.body.sexo;
    var nivel         = req.body.nivel;
    var representante = req.body.representante;

    if(! func.ValidVar( [ nombre, apellido, edad, sexo, nivel, representante ] ) )
      return func.admin_404(res);

    if(! func.NotNull( [ nombre, apellido, edad, sexo, nivel, representante] ) )
      return ( req.flash('error', 'Campos invalidos'), res.redirect('/panel/alumnos') );

    db.run('INSERT INTO alumno VALUES (NULL,?,?,?,?,?,?,TRUE)',
           nombre, apellido, edad, sexo,
           nivel, representante,
           (err) => {
      if(err) return func.admin_error(res, err);
      req.flash('info', 'Registraste el alumno "' + nombre + ' ' + apellido + '"');
      res.redirect('/panel/alumnos');
    });
  });

  app.get('/panel/alumnos/:id', func.accesoAdmin, (req, res) => {
    var modulo = func.metaModulo('alumnos', 'ver');
    db.get('SELECT * FROM alumno WHERE id=?', req.params.id, (err, reg) => {
      if(err) return func.admin_error(res, err);
      if(!reg) return func.admin_404(res);
      modulo.registro = reg;
      db.get('SELECT * FROM nivel WHERE id=?', modulo.registro.nivel_id, (err, reg) => {
        if(err) return func.admin_error(res, err);
        modulo.registro.nivel = reg;
        db.get('SELECT * FROM representante WHERE id=?', modulo.registro.representante_id, (err, reg) => {
          if(err) return func.admin_error(res, err);
          modulo.registro.representante = reg;
          res.render('admin/base', { modulo: modulo });
        });
      });
    });
  });

  app.get('/panel/alumnos/:id/modificar', func.accesoAdmin, (req, res) => {
    var modulo = func.metaModulo('alumnos', 'modificar');
    db.get('SELECT * FROM alumno WHERE id=? AND estado=TRUE', req.params.id, (err, reg) => {
      if(err) return func.admin_error(res, err);
      if(!reg) return func.admin_404(res);
      modulo.registro = reg;
      db.all('SELECT * FROM nivel WHERE estado=TRUE', (err, reg) => {
        if(err) return func.admin_error(res, err);
        modulo.nivel = reg;
        db.all('SELECT * FROM representante WHERE estado=TRUE', (err, reg) => {
          if(err) return func.admin_error(res, err);
          modulo.representante = reg;
          res.render('admin/base', { modulo: modulo });
        });
      });
    });
  });

  app.post('/panel/alumnos/:id/modificar', func.accesoAdmin, (req, res) => {
    var nombre        = req.body.nombre;
    var apellido      = req.body.apellido;
    var edad          = req.body.edad;
    var sexo          = req.body.sexo;
    var nivel         = req.body.nivel;
    var representante = req.body.representante;

    if(! func.ValidVar( [ nombre, apellido, edad, sexo, nivel, representante ] ) )
      return func.admin_404(res);

    if(! func.NotNull( [ nombre, apellido, edad, sexo, nivel, representante] ) )
      return ( req.flash('error', 'Campos invalidos'), res.redirect('/panel/alumnos/') );

    db.run('UPDATE alumno SET nombre=?,apellido=?,edad=?,sexo=?,nivel_id=?,representante_id=? WHERE id=?',
           nombre, apellido, edad, sexo,
           nivel, representante, req.params.id,
           (err) => {
      if(err) return func.admin_error(res, err);
      req.flash('info', 'Modificaste el alumno Id. ' + req.params.id);
      res.redirect('/panel/alumnos/' + req.params.id);
    });
  });

  app.post('/panel/alumnos/:id/eliminar', func.accesoAdmin, (req, res) => {
    db.run('UPDATE alumno SET estado=FALSE WHERE id=?', req.params.id,
           (err) => {
      if(err) return func.admin_error(res, err);
      req.flash('info', 'Enviaste el alumno Id. ' + req.params.id + ' a la papelera');
      res.redirect('/panel/alumnos');
    });
  });

  app.post('/panel/alumnos/:id/recuperar', func.accesoAdmin, (req, res) => {
    db.run('UPDATE alumno SET estado=TRUE WHERE id=?', req.params.id,
           (err) => {
      if(err) return func.admin_error(res, err);
      req.flash('info', 'Recuperaste el alumno Id. ' + req.params.id);
      res.redirect('/panel/alumnos/' + req.params.id);
    });
  });

};
