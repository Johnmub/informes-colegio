const crypto = require('crypto');

var Semana = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miercoles',
  'Jueves',
  'Viernes',
  'Sabado'
];

var Meses = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

function CallTime( )
{
  this.fecha = ( ) => {
    var date    = new Date()
    const fecha = Semana[ date.getDay() ] + ' - ' +  String(date.getDate()).padStart(2, '0') + '.' + Meses[ date.getMonth() ] + '.' + date.getFullYear();
    return fecha;
  }

  this.hora = ( ) => {
    var date    = new Date()
    const hora = ( date.getHours() > 12 ? (date.getHours() - 12 ) : date.getHours() ) + '.' + ( date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes() )  +
    ( date.getHours() > 12 ? '.pm': '.am');
    return hora;
  }
};

var obj = {};

obj.userValid   = (req, res, next) => {
  if(req.isAuthenticated() && req.user.representante_id != null)
    return next();
  return res.redirect('/');
}
obj.accesoAdmin = (req, res, next) => {
  if(req.isAuthenticated() && req.user.representante_id == null)
    return next();
  return res.redirect('/');
}

obj.metaModulo = (modulo, tarea) => {
  return {
    id: modulo,
    contenido: modulo + '/' + (tarea ? tarea : 'index'),
    titulo: modulo[0].toUpperCase() + modulo.substring(1),
    registro: []
  }
}

obj.ModuloUser = ( modulo ) =>
{
  return {
    id: modulo,
    contenido: ('base/' + modulo),
    titulo: modulo[0].toUpperCase() + modulo.substring(1)
  }
}

obj.admin_error = (res, err) => {
  res.render('admin/base', {
    modulo: {
      id: 'error',
      contenido: 'error',
      titulo: 'Error',
      registro: err
    }
  });
}

obj.admin_404 = (res) => {
  res.render('admin/base', {
    modulo: {
      id: '404',
      contenido: '404',
      titulo: 'Pagina no encontrada'
    }
  });
}

obj.ValidVar  = ( Variables ) => {

  var Validate = true;

  Variables.forEach( (Variable) => {
    if( Variable == undefined )
    Validate = false;
  });

  return ( Validate ? true : false );
}

obj.NotNull  = ( Variables ) => {

  var Validate = true;

  Variables.forEach( (Variable) => {
    if( Variable == null || Variable.length <= 0 )
      Validate = false;
  });

  return ( Validate ? true : false );
}

obj.hashPassword = (password) => {
  var key     = crypto.createHash('sha256').digest();
  var cipher  = crypto.createCipher("aes-256-cbc", key);

  cipher.update(password);
  var encrypted = cipher.final();

  return encrypted;
}

obj.DesPassword = (password) => {
  var key       = crypto.createHash('sha256').digest();
  var decipher  = crypto.createDecipher("aes-256-cbc", key);

  decipher.update(password);
  var Decrypted = decipher.final();

  return (Decrypted.toString());
}

obj.ReplaceText = ( plantilla, optional) => {
  var Index = 0;

  while(plantilla.indexOf('%s') != -1)
  {
    plantilla = plantilla.replace('%s', optional[Index]);
    Index+= 1;
  }

  return plantilla;
}

obj.Time = new CallTime( );

module.exports = obj;
