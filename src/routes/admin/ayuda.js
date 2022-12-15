module.exports = (app, db, func) => {

  app.get('/panel/ayuda', func.accesoAdmin, (req, res) => {
    res.render('admin/base', {
      modulo: {
        id: 'ayuda',
        contenido: 'ayuda',
        titulo: 'Centro de ayuda'
      }
    });
  });

};



