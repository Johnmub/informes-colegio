const func      = require('../func.js');
const Mailer    = require('../sendmail.js');
const fs        = require('fs');

module.exports = (app, db) => {

    app.post('/clave-return', (req, res) => {
        var email = req.body.email;

        if(! func.ValidVar( [ email ] ) )
            return res.render('user/404');

        if(! func.NotNull( [ email ] ) )
            return ( req.flash('error', 'Correo: Campos invalidos'), res.redirect('/') );
        
        db.get('SELECT usuario, clave, representante_id, correo FROM usuario WHERE correo=?', email, (error, result_user) => 
        {
            if(error)
                return res.render('user/404');
            
            if(!result_user) {
                req.flash('error', 'El correo ingresado no pertenece a una cuenta');
                return res.redirect('/');
            }

            if(result_user.representante_id != null && result_user.representante_id >= 0)
            {
                db.get('SELECT nombre, apellido FROM representante WHERE id=?', result_user.representante_id, (error, result_r) =>
                {
                    if(error)
                        return res.render('user/404');
                
                    if(!result_r) {
                        req.flash('error', 'El correo ingresado no pertenece a una cuenta');
                        return res.redirect('/');
                    }

                    fs.readFile('./plantilla.txt', (error, buffer) => {
                        if(error) {
                            req.flash('error', 'Lo sentimos en este momento el servicio de mensajeria no se encuentra disponible, intente mas tarde.');
                            return res.redirect('/');
                        }
    
                        var Plantilla = String(buffer);
                        
                        var usuario = result_user.usuario;
                        var clave   = func.DesPassword(result_user.clave);          
                        var para    = result_user.correo;
                        var asunto  = 'Recuperacion de cuenta';
                        var html    = func.ReplaceText( Plantilla, [ (result_r.nombre + ' ' + result_r.apellido), usuario, clave ] );
                        
                        Mailer.sendEmail( req, res, para, asunto, html );
                    })
                });
            } else {
                fs.readFile('./plantilla.txt', (error, buffer) => {
                    if(error) {
                        req.flash('error', 'Lo sentimos en este momento el servicio de mensajeria no se encuentra disponible, intente mas tarde.');
                        return res.redirect('/');
                    }

                    var Plantilla = String(buffer);
                    
                    var usuario = result_user.usuario;
                    var clave   = func.DesPassword(result_user.clave);          
                    var para    = result_user.correo;
                    var asunto  = 'Recuperacion de cuenta';
                    var html    = func.ReplaceText( Plantilla, [ usuario, usuario, clave ] );
                    
                    Mailer.sendEmail( req, res, para, asunto, html );
                })
            }
        });
    });
};