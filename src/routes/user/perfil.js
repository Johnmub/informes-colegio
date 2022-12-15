module.exports = (app, db, func) =>
{
    app.get('/perfil', func.userValid, (req, res) => {
        var modulo              = func.ModuloUser('perfil');
        var id_representante    = req.user.representante_id;
        req.user.alumnos        = [];
        req.user.msg_notread    = 0;

        db.get('SELECT * FROM representante WHERE id=?', id_representante, (error, row) => 
        {
            if(error) return res.render('user/404');

            req.user.usuario                = (row.nombre + ' ' + row.apellido);
            req.user.cedula                = row.cedula;
            req.user.telefono              = row.telefono;
            req.user.direccion             = row.direccion;
            req.user.correo                = row.correo;
            req.user.numb_representados    = 0;
        });

        db.all('SELECT * FROM notificacion WHERE representante_id=?', id_representante, (error, notificaciones) => 
        {
            if(error) return res.render('user/404');

            db.all('SELECT id, titulo, fecha FROM publicacion', (error, publicaciones) => 
            {
                if(error) return res.render('user/404');
                notificaciones.forEach((n) => { if(!n.fecha_leido) req.user.msg_notread += 1; });
            });
        });

        db.all( 'SELECT * FROM alumno WHERE representante_id=? ORDER BY apellido ASC', id_representante, (error, alumnos) => 
        {
            if(error) return res.render('user/404');

            db.all('SELECT * FROM nivel', (error, niveles) => 
            {
                if(error) return res.render('user/404');

                alumnos.forEach( (alu) => 
                {
                    req.user.numb_representados    += 1;
                    const nivel = niveles.find( (level) => { return level.id == alu.nivel_id });
                    
                    if(nivel) 
                    {
                        req.user.alumnos.push({
                            nombre  : (alu.nombre + ' ' + alu.apellido),
                            nivel   : nivel.codigo,
                            sexo    : alu.sexo,
                            edad    : alu.edad,
                        });
                    }
                });
            
                res.render('user/inicio', { modulo: modulo });
            });
        });
    });

    app.post('/info-save',  func.userValid, (req, res) => {
        var id_representante    = req.user.representante_id;
        var email       = req.body.correo;
        var telefono    = req.body.telefono;
        var direccion   = req.body.direccion;
        var id_user     = req.user.id;

        if(! func.ValidVar( [ email, telefono, direccion]) )
            return res.render('user/404');

        if(! func.NotNull( [ email, telefono, direccion]) )
            return ( req.flash('error', 'Editar Perfil: Campos invalidos'), res.redirect('/perfil') );

        db.all('SELECT id FROM usuario WHERE correo=?', email, (error, result) => {
            if(error) return res.render('user/404');

            const resultado = result.find( (r) => { return (r.id == id_user ? r : true ) });

            if( !resultado || resultado.id ==  id_user)
            {
                db.run('UPDATE representante SET telefono=?, direccion=?, correo=? WHERE id=?', telefono, direccion, email, id_representante, (error_up) => {
                    if(error_up) return res.render('user/404');

                    db.run('UPDATE usuario SET correo=? WHERE id=?', email, id_user, (err) => {
                        if(err) return res.render('user/404');
    
                        req.flash('info', 'Tus datos han sido mofificados exitosamente');
                        return res.redirect('/perfil');
                    });
                });
                
            } else {
                req.flash('error', 'El correo ya se encuentra en uso');
                return res.redirect('/perfil');
            }
        });
    });

    app.post('/change-pass', func.userValid, (req, res) => {
        var OldClave    = req.body.password_old;
        var Clave       = req.body.password_new;
        var RepClave    = req.body.password_new_repeat;

        var id_representante    = req.user.representante_id;

        if(! func.ValidVar( [ OldClave, Clave, RepClave] ) )
            return res.render('user/404');

        if(! func.NotNull( [ OldClave, Clave, RepClave] ) )
            return ( req.flash('error', 'Contraseña: Campos invalidos'), res.redirect('/perfil') );
        
        if( Clave != RepClave)
            return (req.flash('error', 'Confirmar contraseña no coincide'), res.redirect('/perfil') );

        db.get('SELECT clave FROM usuario WHERE representante_id=?', id_representante, (error, result) => {
            if(error) return res.render('user/404');
            if(!result) return res.render('user/404');

            var StorePass = func.DesPassword(result.clave);

            if(StorePass == OldClave && StorePass != Clave && Clave === RepClave )
            {
                db.run('UPDATE usuario SET clave=? WHERE representante_id=?', func.hashPassword(Clave), id_representante, (error) => {
                    if(error) return res.render('user/404');

                    req.flash('info', 'Contraseña mofificada exitosamente');
                    res.redirect('/perfil');
                });
            }
            else if( StorePass == Clave ) {
                req.flash('error', 'La contraseña ingresada es tu contraseña actual');
                res.redirect('/perfil');
            }
            else {
                req.flash('error', 'Tu contrasela es invalida');
                res.redirect('/perfil');
            }
        });
    });
};