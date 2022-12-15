var TimeData = 
[
  Semana = {
    Mon   : 'Lunes',
    Thue  : 'Martes',
    Wed   : 'Miercoles',
    Thu   : 'Jueves',
    Fri   : 'Viernes',
    Sat   : 'Sabado',
    Sun   : 'Domingo'
  },
  Meses = {
    Jan   : 'Enero',
    Feb   : 'Febrero',
    Mar   : 'Marzo',
    Apr   : 'Abril',
    May   : 'Mayo',
    Jun   : 'Junio',
    Jul   : 'Julio',
    Aug   : 'Agosto',
    Sep   : 'Septiembre',
    Oct   : 'Octubre',
    Nov   : 'Noviembre',
    Dec   : 'Diciembre',
  }
];

module.exports = function Time()
{
  var data    = new Date().toDateString();
  var tiempo  = [];

  while( data.length > 0 )
  {
    let index = data.indexOf(' ');

    if( index == 0 )  { 
      data  = data.slice( 1 ); continue; 
    } else if( index <= -1 ) {
      tiempo.push( data.slice( 0 ) );
      data  = ''
      continue;
    }

    tiempo.push( data.slice( 0, index ) );
    data  = data.slice( index );
  }

  // 0 - Dia semana | 1 - Mes | 2 - Dia | 3 - año
  this.fecha = () => {
    const fecha = tiempo[2] + '/' + TimeData[1][ tiempo[1] ] + '/' + tiempo[3] + ' - ' + TimeData[0][ tiempo[0] ];
    return fecha;
  }
}