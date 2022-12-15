module.exports = (app, db, func) => {

  app.get('/panel/niveles', func.accesoAdmin, (req, res) => {
    var modulo = func.metaModulo('niveles');
    db.all('SELECT * FROM nivel WHERE estado=TRUE', (err, reg) => {
      if(err) return func.admin_error(res, err);
      modulo.registro = reg;
      res.render('admin/base', { modulo: modulo });
    });
  });

  app.get('/panel/niveles/papelera', func.accesoAdmin, (req, res) => {
    var modulo = func.metaModulo('niveles', 'papelera');
    db.all('SELECT * FROM nivel WHERE estado=FALSE', (err, reg) => {
      if(err) return func.admin_error(res, err);
      modulo.registro = reg;
      res.render('admin/base', { modulo: modulo });
    });
  });

  app.post('/panel/niveles/papelera/vaciar', func.accesoAdmin, (req, res) => {
    db.all('DELETE FROM nivel WHERE estado=FALSE', (err, reg) => {
      if(err) return func.admin_error(res, err);
      req.flash('info', 'Has vaciado la papelera de niveles');
      res.redirect('/panel/niveles');
    });
  });

  app.get('/panel/niveles/agregar', func.accesoAdmin, (req, res) => {
    var modulo = func.metaModulo('niveles', 'agregar');
    res.render('admin/base', { modulo: modulo });
  });

  app.get('/panel/niveles/agregar', func.accesoAdmin, (req, res) => {
    var modulo = func.metaModulo('niveles', 'agregar');
    res.render('admin/base', { modulo: modulo });
  });

  app.post('/panel/niveles/agregar', func.accesoAdmin, (req, res) => {
    var codigo   = req.body.codigo;
    var min_edad = req.body.min_edad;
    var max_edad = req.body.max_edad;

    if(! func.ValidVar( [ codigo, min_edad, max_edad ] ) ) {
      console.log('error');
      return func.admin_404(res);
    }
      

    if(! func.NotNull( [ codigo, min_edad, max_edad ] ) )
      return ( req.flash('error', 'Campos invalidos'), res.redirect('/panel/niveles') );

    const descripcion = 'Sala para niños de ' + min_edad + ' a ' + max_edad + ' años de edad';

    db.get('SELECT id FROM nivel WHERE codigo=?', codigo, (error, result) => 
    {
      if(error) 
          return func.admin_error(res, error);

      if(result)
      {
        req.flash('error', 'Ya existe un nivel con el codigo "' + codigo + '"');
        return res.redirect('/panel/niveles/agregar');
      }
      
      db.run('INSERT INTO nivel VALUES (NULL,?,?,?,?,TRUE)', codigo, descripcion, min_edad, max_edad, (err) => 
      {
        if(err) 
          return func.admin_error(res, err);

        req.flash('info', 'Registraste el nivel "' + descripcion + '"');
        res.redirect('/panel/niveles');
      });
    })
  });

  app.get('/panel/niveles/:id', func.accesoAdmin, (req, res) => {
    var modulo = func.metaModulo('niveles', 'ver');
    db.get('SELECT * FROM nivel WHERE id=?', req.params.id,
         (err, reg) => {
      if(err) return func.admin_error(res, err);
      if(!reg) return func.admin_404(res);
      modulo.registro = reg;
      res.render('admin/base', { modulo: modulo });
    });
  });

  app.get('/panel/niveles/:id/modificar', func.accesoAdmin, (req, res) => {
    var modulo = func.metaModulo('niveles', 'modificar');
    db.get('SELECT id, codigo FROM nivel WHERE id=? AND estado=TRUE', req.params.id,
           (err, reg) => {
      if(err) return func.admin_error(res, err);
      if(!reg) return func.admin_404(res);
      modulo.registro = reg;
      res.render('admin/base', { modulo: modulo });
    });
  });

  app.post('/panel/niveles/:id/modificar', func.accesoAdmin, (req, res) => {
    var codigo        = req.body.codigo;

    if(! func.ValidVar( [ codigo ] ) )
      return func.admin_404(res);

    if(! func.NotNull( [ codigo ] ) )
      return ( req.flash('error', 'Campos invalidos'), res.redirect('/panel/niveles/') );

    db.get('SELECT id FROM nivel WHERE codigo=?', codigo, (error, result) => 
    {
      if(error) 
          return func.admin_error(res, error);

      if(result)
      {
        req.flash('error', 'Ya existe un nivel con el codigo "' + codigo + '"');

        return res.redirect('/panel/niveles/' + req.params.id + '/modificar');
      }
      
      db.run('UPDATE nivel SET codigo=? WHERE id=?', codigo, req.params.id, (err) => {
        if(err) 
          return func.admin_error(res, err);

        req.flash('info', 'Modificaste el nivel Id. ' + req.params.id);
        res.redirect('/panel/niveles/' + req.params.id);
      });
    })
  });

  app.post('/panel/niveles/:id/eliminar', func.accesoAdmin, (req, res) => {
    db.run('UPDATE nivel SET estado=FALSE WHERE id=?', req.params.id,
           (err) => {
      if(err) return func.admin_error(res, err);
      req.flash('info', 'Enviaste el nivel Id. ' + req.params.id + ' a la papelera');
      res.redirect('/panel/niveles');
    });
  });

  app.post('/panel/niveles/:id/recuperar', func.accesoAdmin, (req, res) => {
    db.run('UPDATE nivel SET estado=TRUE WHERE id=?', req.params.id,
           (err) => {
      if(err) return func.admin_error(res, err);
      req.flash('info', 'Recuperaste el nivel Id. ' + req.params.id);
      res.redirect('/panel/niveles/' + req.params.id);
    });
  });

};
