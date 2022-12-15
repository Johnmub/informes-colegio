module.exports = (app, db, func) => {
  app.get('/panel/publicaciones', func.accesoAdmin, (req, res) => {
    var modulo = func.metaModulo('publicaciones');
    db.all('SELECT * FROM publicacion WHERE estado=TRUE', (err, reg) => {
      if(err) return func.admin_error(res, err);
      modulo.registro = reg;
      res.render('admin/base', { modulo: modulo });
    });
  });

  app.get('/panel/publicaciones/papelera', func.accesoAdmin, (req, res) => {
    var modulo = func.metaModulo('publicaciones', 'papelera');
    db.all('SELECT * FROM publicacion WHERE estado=FALSE', (err, reg) => {
      if(err) return func.admin_error(res, err);
      modulo.registro = reg;
      res.render('admin/base', { modulo: modulo });
    });
  });

  app.post('/panel/publicaciones/papelera/vaciar', func.accesoAdmin, (req, res) => {
    db.all('DELETE FROM publicacion WHERE estado=FALSE', (err, reg) => {
      if(err) return func.admin_error(res, err);
      req.flash('info', 'Has vaciado la papelera de publicaciones');
      res.redirect('/panel/publicaciones');
    });
  });

  app.get('/panel/publicaciones/agregar', func.accesoAdmin, (req, res) => {
    var modulo = func.metaModulo('publicaciones', 'agregar');

    db.all('SELECT * FROM nivel WHERE estado=TRUE', (error_ni, row_ni) => {
      if(error_ni) return func.admin_error(res, error_ni);

      modulo.niveles  = null;
      if(row_ni)
        modulo.niveles = row_ni;

      db.all('SELECT nombre, apellido, nivel_id, id FROM alumno WHERE estado=TRUE', (error_alu, row_alu) => {
        if(error_alu) return func.admin_error(res, error_alu);

       modulo.alumnos  = null;
       if(row_alu)
        modulo.alumnos = row_alu;

        res.render('admin/base', { modulo: modulo });
      });
    });
  });

  app.post('/panel/publicaciones/agregar', func.accesoAdmin, (req, res) => {
    var titulo    = req.body.titulo;
    var cuerpo    = req.body.cuerpo;
    var para      = req.body.para_type;
    var imagen    = "imagen";

    const MIN_CUERPO  = 280;

    if(! func.ValidVar( [ titulo, cuerpo, para, imagen ] ) )
      return func.admin_404(res);

    if(cuerpo.length < MIN_CUERPO)
      return ( req.flash('error', 'El cuerpo del mensaje debe contener minimo: ' + MIN_CUERPO + ' caracteres'), res.redirect('/panel/publicaciones/agregar') );

    if(! func.NotNull( [ titulo, cuerpo, para, imagen ] ) )
      return ( req.flash('error', 'Campos invalidos'), res.redirect('/panel/publicaciones/agregar') );

    var ErrorDetec = false;

    switch(para)
    {
      case 'todos':
        db.run('INSERT INTO publicacion VALUES (NULL,?,?,?,?,?,?,TRUE)', [ titulo, cuerpo, imagen, ( func.Time.fecha() + ' - ' + func.Time.hora() ), para, req.user.usuario ], function(error) {
          if(error)
          {
            ErrorDetec = true;
            return func.admin_error(res, error);
          }

          const publicacion_id = this.lastID;

          if(!error)
          {
            db.each('SELECT id FROM representante WHERE estado=TRUE', (err, reg) => {
              if(err) {
                ErrorDetec = true;
                return func.admin_error(res, err);
              }
              if(!reg) {
                req.flash('error', 'No hay representantes registrados aún');
                return res.redirect('/panel/publicaciones');
              }

              db.run('INSERT INTO notificacion VALUES (NULL,?,?,NULL)', [publicacion_id, reg.id], (err) => {
                if(err)
                {
                  ErrorDetec = true;
                  return func.admin_error(res, err);
                }
              });
            });
          }

        });

        break;

      case 'nivel':
        var nivel = req.body.select_nivel;

        if(! func.ValidVar( [nivel] ) )
          return func.admin_404(res);

        if(! func.NotNull( [ nivel ] ) )
          return ( req.flash('error', 'Campos invalidos'), res.redirect('/panel/publicaciones/agregar') );

        db.all('SELECT representante_id FROM alumno WHERE nivel_id=?', nivel, (error, row_alu) =>
        {
          if(error)
          {
            ErrorDetec = true;
            return func.admin_error(res, error);
          }

          if(!row_alu) {
            ErrorDetec = true;
            req.flash('error', 'El nivel que especificaste no existe');
            return res.redirect('/panel/publicaciones/agregar');
          }

          db.run('INSERT INTO publicacion VALUES (NULL,?,?,?,?,?,?,TRUE)', [ titulo, cuerpo, imagen, ( func.Time.fecha() + ' - ' + func.Time.hora() ), para, req.user.usuario ], function(error)
          {
            if(error)
            {
              ErrorDetec = true;
              return func.admin_error(res, error);
            }

            const publicacion_id = this.lastID;

            row_alu.forEach( Alumno =>
            {
              db.run('INSERT INTO notificacion VALUES (NULL,?,?,NULL)', [publicacion_id, Alumno.representante_id], (err)  => {
                if(err) {
                  ErrorDetec = true;
                  return func.admin_error(res, err);
                }
              });
            });
          });
        });
        break;

      case 'alumno':
        var alumno = req.body.select_alumno;

        if(! func.ValidVar( [alumno] ) )
          return func.admin_404(res);

        if(! func.NotNull( [ alumno ] ) )
          return ( req.flash('error', 'Campos invalidos'), res.redirect('/panel/publicaciones/agregar') );

        db.get('SELECT representante_id FROM alumno WHERE id=?', alumno, (error, row_alu) =>
        {
          if(error)
          {
            ErrorDetec = true;
            return func.admin_error(res, error);
          }

          if(!row_alu) {
            ErrorDetec = true;
            req.flash('error', 'El alumno que especificaste no existe');
            return res.redirect('/panel/publicaciones/agregar');
          }

          db.run('INSERT INTO publicacion VALUES (NULL,?,?,?,?,?,?,TRUE)', [ titulo, cuerpo, imagen, ( func.Time.fecha() + ' - ' + func.Time.hora() ), para, req.user.usuario ], function(error) {
            if(error)
            {
              ErrorDetec = true;
              return func.admin_error(res, error);
            }

            const publicacion_id = this.lastID;

            db.run('INSERT INTO notificacion VALUES (NULL,?,?,NULL)', [publicacion_id, row_alu.representante_id], (err)  =>
            {
              if(err)
              {
                ErrorDetec = true;
                return func.admin_error(res, err);
              }
            });
          });
        });
        break;
      default:
        ErrorDetec = true;
        return func.admin_error(res, '');
    }

    if(!ErrorDetec)
    {
      req.flash('info', 'Registraste la publicación "' + titulo + '"');
      return res.redirect('/panel/publicaciones');
    }
  });

  app.get('/panel/publicaciones/:id', func.accesoAdmin, (req, res) => {
    var modulo = func.metaModulo('publicaciones', 'ver');
    db.get('SELECT * FROM publicacion WHERE id=?', req.params.id,
         (err, reg) => {
      if(err) return func.admin_error(res, err);
      if(!reg) return func.admin_404(res);
      modulo.registro = reg;
      res.render('admin/base', { modulo: modulo });
    });
  });

  app.get('/panel/publicaciones/:id/modificar', func.accesoAdmin, (req, res) => {
    var modulo = func.metaModulo('publicaciones', 'modificar');
    db.get('SELECT * FROM publicacion WHERE id=? AND estado=TRUE', req.params.id,
           (err, reg) => {
      if(err) return func.admin_error(res, err);
      if(!reg) return func.admin_404(res);
      modulo.registro = reg;
      res.render('admin/base', { modulo: modulo });
    });
  });

  app.post('/panel/publicaciones/:id/modificar', func.accesoAdmin, (req, res) => {
    var titulo  = req.body.titulo;
    var cuerpo  = req.body.cuerpo;
    var imagen  = "son una imagen";

    const MIN_CUERPO  = 280;

    if(! func.ValidVar( [ titulo, cuerpo, imagen ] ) )
      return func.admin_404(res);

    if(cuerpo.length < MIN_CUERPO)
      return ( req.flash('error', 'El cuerpo del mensaje debe contener minimo: ' + MIN_CUERPO + ' caracteres'), res.redirect('/panel/publicaciones/' +  req.params.id + '/modificar') );

    if(! func.NotNull( [ titulo, cuerpo, imagen ] ) )
      return ( req.flash('error', 'Campos invalidos'), res.redirect('/panel/publicaciones/' +req.params.id+ '/modificar') );

    db.run('UPDATE publicacion SET titulo=?, cuerpo=?, imagen=? WHERE id=?', titulo, cuerpo, imagen, req.params.id, (err) => {
      if(err)
        return func.admin_error(res, err);

      req.flash('info', 'Modificaste la publicación Id. ' + req.params.id);
      res.redirect('/panel/publicaciones/' + req.params.id);
    });
  });

  app.post('/panel/publicaciones/:id/eliminar', func.accesoAdmin, (req, res) => {
    db.run('UPDATE publicacion SET estado=FALSE WHERE id=?', req.params.id,
           (err) => {
      if(err) return func.admin_error(res, err);
      req.flash('info', 'Enviaste la publicación Id. ' + req.params.id + ' a la papelera');
      res.redirect('/panel/publicaciones');
    });
  });

  app.post('/panel/publicaciones/:id/recuperar', func.accesoAdmin, (req, res) => {
    db.run('UPDATE publicacion SET estado=TRUE WHERE id=?', req.params.id,
           (err) => {
      if(err) return func.admin_error(res, err);
      req.flash('info', 'Recuperaste la publicación Id. ' + req.params.id);
      res.redirect('/panel/publicaciones/' + req.params.id);
    });
  });

};
