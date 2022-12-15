module.exports = (app, db, func) => {
    app.get('/panel/profile', func.accesoAdmin, (req, res) => {
        var modulo  = func.metaModulo('profile');

        db.get('SELECT correo FROM usuario WHERE id=?', req.user.id, (error, result) => {
            if(error) return func.admin_error(res, error);

            req.user.correo = result.correo;

            res.render('admin/base', { modulo: modulo });
        });

        app.post('/panel-info',  func.accesoAdmin, (req, res) => {
            var email       = req.body.correo;
            var id_user     = req.user.id;
    
            if(! func.ValidVar( [ email ] ) )
                return func.admin_404(res);
    
            if(! func.NotNull( [ email ] ) )
                return ( req.flash('error', 'Correo: Campo invalidos'), res.redirect('/panel/profile') );
    
            db.all('SELECT id FROM usuario WHERE correo=?', email, (error, result) => {
                if(error) return func.admin_error(res, error);
    
                const resultado = result.find( (r) => { return (r.id == id_user ? r : true ) });

                if( !resultado || resultado.id ==  id_user)
                {
                    db.run('UPDATE usuario SET correo=? WHERE id=?', email, id_user, (error_up) => {
                        if(error_up) return func.admin_error(res, error_up);
    
                        req.flash('info', 'Tus datos han sido mofificados exitosamente');
                        return res.redirect('/panel/profile');
                    });
                } else {
                    req.flash('error', 'El correo ya se encuentra en uso');
                    return res.redirect('/panel/profile');
                }
            });
        });

        app.post('/panel-pass', func.accesoAdmin, (req, res) => {
            var OldClave    = req.body.password_old;
            var Clave       = req.body.password_new;
            var RepClave    = req.body.password_new_repeat;


            if(! func.ValidVar( [ OldClave, Clave, RepClave] ) )
                return func.admin_404(res);
    
            if(! func.NotNull( [ OldClave, Clave, RepClave] ) )
                return ( req.flash('error', 'Contraseña: Campos invalidos'), res.redirect('/panel/profile') );
            
            if( Clave != RepClave)
                return (req.flash('error', 'Confirmar contraseña no coincide'), res.redirect('/panel/profile') );

            db.get('SELECT clave FROM usuario WHERE id=?', req.user.id, (error, result) => {
                if(error) return func.admin_error(res, error);
                if(!result) return func.admin_404(res);
    
                var StorePass = func.DesPassword(result.clave);
    
                if(StorePass == OldClave && StorePass != Clave && Clave === RepClave )
                {
                    db.run('UPDATE usuario SET clave=? WHERE id=?', func.hashPassword(Clave), req.user.id, (error) => {
                        if(error) return func.admin_error(res, error);
    
                        req.flash('info', 'Contraseña mofificada exitosamente');
                        return res.redirect('/panel/profile');
                    });
                }
                else if( StorePass == Clave ) {
                    req.flash('error', 'La contraseña ingresada es tu contraseña actual');
                    res.redirect('/panel/profile');
                }
                else {
                    req.flash('error', 'Tu contrasela es invalida');
                    return res.redirect('/panel/profile');
                }
            });
        });
    });
}