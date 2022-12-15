module.exports = (app, db, func) =>
{
    app.get('/publicacion/:id_public/:id_notific', func.userValid, (req, res) => {
        var modulo              = func.ModuloUser('publicacion');
        var id_representante    = req.user.representante_id;
        var id_publicacion      = req.params.id_public;
        var id_notificacion     = req.params.id_notific;
        req.user.msg_notread    = 0;
            
        db.get('SELECT nombre, apellido FROM representante WHERE id=?', id_representante, (error, row) => {
            if(error) return res.render('user/404');
            req.user.usuario = (row.nombre + ' ' + row.apellido);
        });
        
        db.run( 'UPDATE notificacion SET fecha_leido=? WHERE id=?',  func.Time.fecha(), id_notificacion, (error) => {
            if(error) console.log("ERROR AL ACTUALIZAR ESTADO DE NOTIFICACION..");
        });

        db.all('SELECT * FROM notificacion WHERE representante_id=?', id_representante, (error, notificaciones) => 
        {
            if(error) return res.render('user/404');

            db.all('SELECT id, titulo, fecha FROM publicacion', (error, publicaciones) => 
            {
                if(error) return res.render('user/404');
                notificaciones.forEach((n) => { if(!n.fecha_leido) req.user.msg_notread += 1; });

                db.get( 'SELECT titulo, cuerpo, fecha, autor FROM publicacion WHERE id=?', id_publicacion, (error, row) => {
                    if(error)
                        return res.render('user/404');
                    
                    req.user.publicacion = {
                        titulo  : row.titulo,
                        cuerpo  : row.cuerpo,
                        fecha   : row.fecha,
                        autor   : row.autor
                    };
                    
                    res.render('user/inicio', { modulo: modulo });
                });
            });
        });
    });
};