( () =>
{
    var SelecType   = document.querySelector('#para-type');
    var SelectNivel = document.querySelector('#select-nivel');
    var SelectAlumno= document.querySelector('#select-alumno');
    var BotonReset  = document.querySelector('#btn-Cancel');

    if( NotNull( [SelecType, SelectNivel, SelectAlumno]) )
    {
        SelectNivel.style.visibility = "hidden";
        SelectAlumno.style.visibility = "hidden";

        BotonReset.addEventListener('click', (e) => {
            SelectNivel.style.visibility = "hidden";
            SelectAlumno.style.visibility = "hidden";
        });

        SelecType.addEventListener( 'change', (e) => {
            if(SelecType.value == null)
                return;

            switch(SelecType.value)
            {
                case 'todos':
                    SelectNivel.style.visibility = "hidden";
                    SelectAlumno.style.visibility = "hidden";
                    break;
                case 'nivel':
                    SelectNivel.style.visibility = "";
                    SelectAlumno.style.visibility = "hidden";
                    break;
                case 'alumno':
                    SelectNivel.style.visibility = "";
                    SelectAlumno.style.visibility = "";

                    var id_nivel = SelectNivel.value;

                    SelectAlumno.innerHTML = '';

                    modulo.alumnos.forEach( (alumno) => {
                        if(alumno.nivel_id == id_nivel)
                        {
                            SelectAlumno.innerHTML += '<option value="' + alumno.id + '">' + alumno.nombre + ' ' + alumno.apellido + '</option>';
                        }
                    });
                    
                    break;
            }
        });

        SelectNivel.addEventListener( 'change', (e) => {
            if(SelectNivel.value == null)
                return;  

            var id_nivel = SelectNivel.value;

            SelectAlumno.innerHTML = '';
            modulo.alumnos.forEach( (alumno) => {
                if(alumno.nivel_id == id_nivel)
                {
                    SelectAlumno.innerHTML += '<option value="' + alumno.id + '">' + alumno.nombre + ' ' + alumno.apellido + '</option>';
                }
            });
        });
    }

    function NotNull( Variables )
    {
        var Valido = true;

        Variables.forEach( (Variable) => {
            if(Variable == null)
                Valido = false; 
        });

        return Valido ? true: false;
    }
}).call(this);