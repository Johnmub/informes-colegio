var nodemailer = require('nodemailer');

const Correo    = 'araguaneycolegio@gmail.com';
const Clave     = 'araguaneyadmin';

var transporte  = nodemailer.createTransport({
    service : 'gmail',
    port    : 2525,
    secure  : false,
    auth    : {
        user: Correo,
        pass: Clave
    }
});

exports.sendEmail = (req, res, para, asunto, html) =>
{
    var mailOptions = {
        from    : "Araguaney Soporte",
        to      : para,
        subject : asunto,
        html    : html
    };
    
    transporte.sendMail(mailOptions, (error, info) =>
    {
        if (error){
            req.flash('error', 'Lo sentimos en este momento el servicio de mensajeria no se encuentra disponible, intente mas tarde.' + '\n', '\n', 'Haz click en este mensaje para que desparezca.');
            return res.redirect('/');
        } else {
            req.flash('info', 'Te hemos enviado la contraseña al correo ' + req.body.email + '\n','\n','Haz click en este mensaje para que desparezca.');
            return res.redirect('/');
        }
    });
};