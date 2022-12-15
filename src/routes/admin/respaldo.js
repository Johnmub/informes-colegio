const fs = require('fs');
const sqlite3  = require('sqlite3');

module.exports = (app, db, func) => {

  app.get('/panel/respaldo', func.accesoAdmin, (req, res) => {
    var modulo = func.metaModulo('respaldo');

    fs.readdir('../backup/', "utf-8", (error, archivos) =>
    {
      if(error)
        return func.admin_error(res, error);

      modulo.copias = archivos;

      res.render('admin/base', { modulo: modulo });
    });
  });
  
  app.post('/copia', (req, res) => 
  {
    var clave = req.body.password_copia;
    
    if(! func.ValidVar( [ clave ] ) )
      return func.admin_404(res);

    if(! func.NotNull( [ clave ] ) )
      return ( req.flash('error', 'Campos invalidos'), res.redirect('/panel/respaldo') );

    db.get('SELECT * FROM usuario WHERE usuario=? AND clave=?', req.user.usuario, func.hashPassword(clave), (error, result) => 
    {
      if (error)
        return func.admin_error(res, error);

      if(!result)
        return ( req.flash('error', 'La contraseña ingresada es invalida'), res.redirect('/panel/respaldo') );

      fs.copyFile('../data/db.sqlite3', '../backup/' + func.Time.fecha( ) + '-' + func.Time.hora( ) + '.sqlite3', (error) => 
      {
          if (error)
            return func.admin_error(res, error);

          console.log( '**********************************************');
          console.log( 'La base de datos ha sido respalda el [' + func.Time.fecha( ) + '-' + func.Time.hora( ) + '] por: ' + req.user.usuario );
          console.log( '**********************************************');

          req.flash("info", 'La base de datos ha sido respalda el [' + func.Time.fecha( ) + '-' + func.Time.hora( ) + ']');
          return res.redirect('/panel/respaldo');
      });
    });
  });

  app.post('/restaurar', (req, res) =>
  {
    var clave = req.body.password_restaurar;
    var option_respaldo = req.body.respaldo;

    
    if(! func.ValidVar( [ clave, option_respaldo ] ) )
      return func.admin_404(res);

    if(! func.NotNull( [ clave, option_respaldo ] ) )
      return ( req.flash('error', 'Campos invalidos'), res.redirect('/panel/respaldo') );

    db.get('SELECT * FROM usuario WHERE usuario=? AND clave=?', req.user.usuario, func.hashPassword(clave), (error, result) => 
    {
      if (error)
        return func.admin_error(res, error);

      if(!result)
        return ( req.flash('error', 'La contraseña ingresada es invalida'), res.redirect('/panel/respaldo') );
      
      fs.readdir('../backup/', "utf-8", (error, archivos) =>
      {
        if(error)
          return func.admin_error(res, error);

        const CantArchivos  = (archivos.length-1);

        if(CantArchivos <= -1)
          return ( req.flash('error', 'No hay copias de seguridad disponibles'), res.redirect('/panel/respaldo') );

        if(option_respaldo < 0 || option_respaldo > CantArchivos )
          return ( req.flash('error', 'Has seleccionado una opción invalida'), res.redirect('/panel/respaldo') );
        
        // db.close( (error) =>
        // {
        //   if(error) {
        //     console.log('ERROR AL INTENTAR CERRAR LA CONEXIÓN A LA BASE DE DATOS EN LA SECCIÓN RESPALDO');
        //     return func.admin_error(res, error);
        //   }

          fs.copyFile('../backup/' + archivos[ option_respaldo ], '../data/db.sqlite3', (error) => 
          {
            if (error)
              return func.admin_error(res, error);
            
            // BASE DE DATOS 
            db = new sqlite3.Database('../data/db.sqlite3', (err) => {
              if (err) 
                return console.error(err);

              console.log( '**********************************************');
              console.log( 'La base de datos ha sido restaurada el [' + func.Time.fecha( ) + '-' + func.Time.hora( ) + '] por: ' + req.user.usuario );
              console.log( '**********************************************');
  
              req.flash("info", 'La base de datos ha sido restaurada el [' + func.Time.fecha( ) + '-' + func.Time.hora( ) + ']');
              return res.redirect('/panel/respaldo');
            });
          });
        // });
      });
    });
  });
};
