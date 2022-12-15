module.exports = (app, db, func) => 
{
    app.get('/inicio', func.userValid, (req, res) => 
    {
        var modulo              = func.ModuloUser('notificacion');
        var id_representante    = req.user.representante_id;
        req.user.notificaciones = [];

        db.get('SELECT nombre, apellido FROM representante WHERE id=?', id_representante, (error, row) => 
        {
            if(error) return res.render('user/404');
            req.user.usuario         = (row.nombre + ' ' + row.apellido);
            req.user.msg_notread    = 0;
        });
        
        db.all('SELECT * FROM notificacion WHERE representante_id=? ORDER BY id DESC', id_representante, (error, notificaciones) => 
        {
            if(error) return res.render('user/404');

            db.all('SELECT id, titulo, fecha, imagen FROM publicacion', (error, publicaciones) => 
            {
                if(error) return res.render('user/404');

                notificaciones.forEach((n) => 
                {
                    if(!n.fecha_leido) req.user.msg_notread += 1;

                    const publicacion = publicaciones.find((p) => { return p.id == n.publicacion_id });
                    if(publicacion) 
                    {

                        req.user.notificaciones.push({
                            id      : n.id,
                            publicacion_id: n.publicacion_id,
                            titulo  : publicacion.titulo,
                            imagen  : publicacion.imagen,
                            fecha   : publicacion.fecha,
                            leido   : n.fecha_leido ? true : false
                        });
                    }
                });

                res.render('user/inicio', { modulo: modulo });
            });
        });
    });
};