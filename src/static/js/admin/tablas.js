var btVer = document.querySelector('.tabla .controles .ver');
var btModificar = document.querySelector('.tabla .controles .modificar');
var btEliminar = document.querySelector('.tabla .controles button.eliminar');
var formEliminar = document.querySelector('.tabla .controles form#eliminar');
var btRecuperar = document.querySelector('.tabla .controles button.recuperar');
var formRecuperar = document.querySelector('.tabla .controles form#recuperar');
var selFiltro = document.querySelector('.busqueda select');
var txtBusqueda = document.querySelector('.busqueda input[name="busqueda"]');
var lblDescripcion = document.querySelector('p.descripcion');
var contenedor = document.querySelector('.tabla .contenedor');
var filas = document.querySelectorAll('table:not(.admin) tbody tr');
var seleccionado = null;
var ficha = null;

if(modulo.id == 'publicaciones') {
  ficha = {
    id: document.querySelector('.fila-detalles span#id'),
    autor: document.querySelector('.fila-detalles span#autor'),
    actualizar: function(fila){
      this.id.textContent = modulo.registro[fila.rowIndex-1].id;
      this.autor.textContent = modulo.registro[fila.rowIndex-1].autor;
    }
  }
} else if(modulo.id == 'representantes') {
  ficha = {
    nombre: document.querySelector('.fila-detalles span#nombre'),
    id: document.querySelector('.fila-detalles span#cedula'),
    actualizar: function(fila){
      this.nombre.textContent = fila.cells[0].textContent;
      this.id.textContent = modulo.registro[fila.rowIndex-1].cedula;
    }
  }
} else if(modulo.id == 'alumnos') {
  ficha = {
    nombre: document.querySelector('.fila-detalles span#nombre'),
    id: document.querySelector('.fila-detalles span#id'),
    representante: document.querySelector('.fila-detalles span#representante'),
    actualizar: function(fila){
      this.nombre.textContent = fila.cells[1].textContent;
      this.id.textContent = modulo.registro[fila.rowIndex-1].id;
      this.representante.textContent = modulo.registro[fila.rowIndex-1].representante ? modulo.registro[fila.rowIndex-1].representante.cedula : '?';
    }
  }
} else if(modulo.id == 'niveles') {
  ficha = {
    id: document.querySelector('.fila-detalles span#id'),
    actualizar: function(fila){
      this.id.textContent = modulo.registro[fila.rowIndex-1].id;
    }
  }
} else if(modulo.id == 'usuarios' && sesion.super) {
  var filasAdmin = document.querySelectorAll('table.admin tbody tr');
  var btEliminarAdmin = document.querySelector('.tabla .controles button.eliminar.admin');
  var formEliminarAdmin = document.querySelector('.tabla .controles form#eliminar-admin');
  var seleccionadoAdmin = null;

  filasAdmin.forEach(function(fila) {
    fila.id = modulo.registro[fila.rowIndex-1].id;
    fila.addEventListener('click', function() {
      if(seleccionadoAdmin != null) {
        seleccionadoAdmin.classList.remove('seleccionado');
        if(btEliminarAdmin) {
          btEliminarAdmin.classList.remove('habilitado');
          formEliminarAdmin.removeAttribute('action');
        }
      }

      if(seleccionadoAdmin != this) {
        seleccionadoAdmin = this;
        this.classList.add('seleccionado');
        if(btEliminarAdmin) {
          btEliminarAdmin.classList.add('habilitado');
          formEliminarAdmin.setAttribute('action', '/panel/usuarios/' + fila.id + '/eliminar');
        }
      } else
        seleccionadoAdmin = null;
    });
  });

  if(formEliminarAdmin)
    formEliminarAdmin.addEventListener('click', function(e) {
      if(!this.getAttribute('action')) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
}

if(ficha != null){
  ficha.div = document.querySelector('.fila-detalles');
  ficha.mostrar = function(fila){
    var x = fila.offsetParent.offsetLeft;
    var y = (fila.offsetTop + fila.offsetParent.offsetTop) - this.div.offsetHeight - contenedor.scrollTop;
    this.div.style.left = (x + 5) + 'px';
    this.div.style.top = (y - 5) + 'px';
    this.div.style.visibility = 'visible';
  };
  ficha.ocultar = function(){
    this.div.style.visibility = 'hidden';
  };
}


var reg = [];
if(modulo.id == 'usuarios') {
  modulo.registro.forEach((r) => {
    if(r.representante != null)
      reg.push(r);
  });
}

filas.forEach(function(fila){
  if(modulo.id == 'usuarios')
    fila.registro = reg[fila.rowIndex-1];
  else
    fila.registro = modulo.registro[fila.rowIndex-1];


  fila.addEventListener('mousedown', function(){
    if(seleccionado != null) {
      seleccionado.classList.remove('seleccionado');
      if(btVer) {
        btVer.classList.remove('habilitado');
        btVer.removeAttribute('href');
      }
      if(btModificar) {
        btModificar.classList.remove('habilitado');
        btModificar.removeAttribute('href');
      }
      if(btEliminar) {
        btEliminar.classList.remove('habilitado');
        formEliminar.removeAttribute('action');
      }
      if(btRecuperar) {
        btRecuperar.classList.remove('habilitado');
        formRecuperar.removeAttribute('action');
      }
    }
    if(ficha != null)
      ficha.ocultar();

    if(seleccionado != this) {
      seleccionado = this;
      this.classList.add('seleccionado');
      if(btVer) {
        btVer.classList.add('habilitado');
        btVer.setAttribute('href', '/panel/' + modulo.id + '/' + fila.registro.id);
      }
      if(btModificar) {
        btModificar.classList.add('habilitado');
        btModificar.setAttribute('href', '/panel/' + modulo.id + '/' + fila.registro.id + '/modificar');
      }
      if(btEliminar) {
        btEliminar.classList.add('habilitado');
        formEliminar.setAttribute('action', '/panel/' + modulo.id + '/' + fila.registro.id + '/eliminar');
      }
      if(btRecuperar) {
        btRecuperar.classList.add('habilitado');
        formRecuperar.setAttribute('action', '/panel/' + modulo.id + '/' + fila.registro.id + '/recuperar');
      }

    } else
      seleccionado = null;
  });

  fila.addEventListener('mouseup', function(){
    if(this === seleccionado && ficha != null) {
      ficha.actualizar(this);
      ficha.mostrar(this);
    }
  });

  fila.addEventListener('mouseenter', function(){
    if(this === seleccionado && ficha != null)
      ficha.mostrar(this);
  });

  fila.addEventListener('mouseleave', function(){
    if(this === seleccionado && ficha != null)
      ficha.ocultar();
  });
});

if(formEliminar)
  formEliminar.addEventListener('click', function(e){
    if(!this.getAttribute('action')) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

if(formRecuperar)
  formRecuperar.addEventListener('click', function(e){
    if(!this.getAttribute('action')) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

function realizarBusqueda() {
  var conteoCoincide = 0;
  var filtro = selFiltro.value.toLowerCase();
  var busqueda = txtBusqueda.value.toLowerCase();
  var coincide = (f, si) => {
    if(si) {
      f.style.display = 'table-row';
      conteoCoincide++;
    } else f.style.display = 'none';
  };
  if(busqueda == '') {
    filas.forEach(f => coincide(f, true));
    lblDescripcion.textContent = modulo.titulo + ' de la institución (' + modulo.registro.length + ' registros)';
  } else if(filtro == 'todo') {
    filas.forEach(f => coincide(f, Object.values(f.registro).toString().toLowerCase().includes(busqueda)));
    lblDescripcion.innerHTML = modulo.titulo + ' de la institución que contengan "<strong>' + busqueda + '</strong>" en cualquiera de sus datos (' + conteoCoincide + ' registros)';
  } else {
    filas.forEach(f => coincide(f, f.registro[filtro].toLowerCase().includes(busqueda)));
    lblDescripcion.innerHTML = modulo.titulo + ' de la institución cuyo "<strong>' + filtro + '</strong>" es semejante a "<strong>' + busqueda + '</strong>" (' + conteoCoincide + ' registros)';
  }
}

function obtenerReporte(selector) {

  var table = document.querySelector(selector);
  var tableBody = [];

  for(var r = 0; r < table.rows.length; ++r) {
    var row = [];

    for(var c = 0; c < table.rows[r].children.length; ++c)
      if(table.rows[r].children[c].tagName == 'TH')
        row.push({text: table.rows[r].children[c].textContent, bold: true})
      else
        row.push(table.rows[r].children[c].textContent);

    tableBody.push(row);
  }

  var docDefinition = {
    info: {
      title: 'Reporte_' + modulo.titulo + '_' +
             (modulo.contenido.includes('papelera') ? 'Papelera_'
              : modulo.contenido.includes('usuarios') ? ((selector.includes('admin') ? 'Administradores_' : 'Representantes_'))
              : '') + Date.now(),
      author: 'C.E.I. Araguaney Sistema Administrativo',
      creator: 'C.E.I. Araguaney Sistema Administrativo',
      producer: 'C.E.I. Araguaney Sistema Administrativo'
    },
    content: [
      {
        margin: [20, 0, 20, 20],
        columns: [
          [
            { text: 'REPORTE', bold: true, fontSize: 30 },
            { text: 'Modulo: ' + modulo.titulo.toUpperCase() +
                    (modulo.contenido.includes('papelera') ? ' - PAPELERA'
                     : modulo.contenido.includes('usuarios') ? ((selector.includes('admin') ? ' - ADMINISTRADORES' : ' - REPRESENTANTES'))
                     : ''), bold: true },
            { text: 'Fecha: ' + new Date().toLocaleString('es-VE'), bold: true }
          ],
          { alignment: 'right', fit: [70, 70], image: 'data:image/png;base64,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' }
        ],
      },
      {
        text: 'Hay ' + (tableBody.length - 1) + ' registros en este reporte.',
        italics: true,
        margin: [0, 0, 0, 10]
      },
      {
        layout: 'lightHorizontalLines',
        table: {
          headerRows: 1,
          body: tableBody
        }
      }
    ]
  };

  pdfMake.createPdf(docDefinition).download(docDefinition.info.title);
}
