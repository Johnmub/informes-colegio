( () => 
{
	var FormNumb    = document.querySelectorAll('form');

	if( FormNumb.length <= 0)
		return;

	// Constantes
	const MIN_USER      = 5;
	const MIN_PASSWORD  = 5;
	const MIN_CORREO    = 6;
	const MIN_NOMBRE    = 2;
	const MIN_CEDULA    = 7;
	const MIN_EDAD      = 1.6;
	const MIN_TELEFONO  = 11;
	const MIN_DIRECTION = 20;
	const MIN_CODIGO    = 2;
	const MIN_DESCIPTION= 16;
	const MIN_TITULO    = 30;

	const MAX_CORREO    = 30;
	const MAX_USER      = MAX_CORREO;
	const MAX_PASSWORD  = 100;
	const MAX_NOMBRE    = 32;
	const MAX_CEDULA    = 16;
	const MAX_EDAD      = 6;
	const MAX_TELEFONO  = 20;
	const MAX_DIRECTION = 200;
	const MAX_CODIGO    = 10;
	const MAX_DESCIPTION= 40;
	const MAX_TITULO    = 60;
	const LIMITE_CI     = 3000000;

	const VALID_NUMBER      = "1234567890";
	const VALID_HOST        = ['gmail', 'outlook', 'hotmail'];
	const VALID_EXT         = ['com', 'es'];
	const LIST_CODE         = [ 8, 9, 32, 48, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 107, 187 ];
	const LIST_CODE_EDAD    = [ 8, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 190 ];
	const LIST_CODE_CEDULA  = [ 8, 45, 46, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 190 ];

	// Variables
	var Message     = document.querySelectorAll('#message-error');
	var MessageFlow = document.querySelector('#message-flow');
	var ListenTelefono  = document.querySelectorAll('#listen-telefono');
	var ListenEdad      = document.querySelectorAll('#listen-edad');
	var ListenCedula    = document.querySelectorAll('#listen-cedula');
	var Formularios = [];

	// Configuracion
	document.addEventListener('click', (e) =>  {
		Message.forEach( (Message) => {
			Message.textContent     = '';
			Message.style.display   = 'none';
		});

		if(MessageFlow)
			MessageFlow.style.visibility   = 'hidden';
	});

	FormNumb.forEach( (form) => {
		Formularios.push(
			Items = {
				Formulario  : form,
				Inputs      : form.querySelectorAll('input'),
				Selects     : form.querySelectorAll('select'),
				Textareas   : form.querySelectorAll('textarea')
			}
		);
	});

	Formularios.forEach( (form, index) => {
		form.Inputs.forEach( (Input) => {
			if(Input.type == 'submit') {
				Input.addEventListener( 'click', (e) => {
					Init_Validate( form, index , e );
				});
			}
		});

	})

	ListenCedula.forEach( ( Cedula ) => {
		Cedula.addEventListener( 'keypress', (e) => {
			if( Cedula.className == "off-cedula") {
				Cedula.setAttribute( "disabled", "disabled" );
				return e.preventDefault();
			}

			if( e.keyCode != 46 && e.keyCode != 45)
			{
				var CharKey = String.fromCharCode(e.keyCode);
				
				var Valido  = false;

				if( VALID_NUMBER.includes(CharKey) || LIST_CODE_EDAD.includes(e.keyCode))
					Valido = true;

				if(!Valido)
					return e.preventDefault();
			}
		})

		Cedula.addEventListener( 'keydown', (e) => {
			if( Cedula.className == "off-cedula") {
				Cedula.setAttribute( "disabled", "disabled" );
				return e.preventDefault();
			}

			var CharKey = String.fromCharCode(e.keyCode);
			var Valido  = false;

			if( VALID_NUMBER.includes(CharKey) || LIST_CODE_EDAD.includes(e.keyCode))
				Valido = true;

			if(!Valido)
				return e.preventDefault();
		})
	}); 

	ListenEdad.forEach( ( edad ) => {
		edad.addEventListener( 'keypress', (e) => {
			if( e.keyCode != 46)
			{
				var CharKey = String.fromCharCode(e.keyCode);
				var Valido  = false;

				if( ( VALID_NUMBER.includes(CharKey) || LIST_CODE_EDAD.includes(e.keyCode) ) && !( CharKey == 0   && edad.value.length == 0  ) )
					Valido = true;

				if(!Valido)
					return e.preventDefault();
			}
		})

		edad.addEventListener( 'keydown', (e) => {
			var CharKey = String.fromCharCode(e.keyCode);
			var Valido  = false;
			
			if( VALID_NUMBER.includes(CharKey) || LIST_CODE_EDAD.includes(e.keyCode) && !( e.keyCode == 190  && edad.value.length == 0  ) )
				Valido = true;

			if(!Valido)
				return e.preventDefault();
		})
	}); 

	ListenTelefono.forEach( ( telefono ) => {
		telefono.addEventListener( 'keypress', (e) => {

			if( e.keyCode != 43)
			{
				var CharKey = String.fromCharCode(e.keyCode);
				var Valido  = false;

				if( ( VALID_NUMBER.includes(CharKey) || LIST_CODE.includes(e.keyCode) ) && !(CharKey == 0 && telefono.value.length == 0 ) )
					Valido = true;

				if(!Valido)
					return e.preventDefault();
			}
		})

		telefono.addEventListener( 'keydown', (e) => {
			var CharKey = String.fromCharCode(e.keyCode);
			var Valido  = false;

			if( VALID_NUMBER.includes(CharKey) || LIST_CODE.includes(e.keyCode) )
				Valido = true;


			if(!Valido)
				return e.preventDefault();
		})
	}); 

	// Funciones //
	function Message_Error( Mensaje, Element = null, Index_Message )
	{
		if( Message.length == 0 && MessageFlow == null )
			return alert( Mensaje );

		if( Message[ Index_Message ] != null )
		{
			Message[ Index_Message ].textContent    = Mensaje;
			Message[ Index_Message ].style.display  = 'block';
		}
		else if( MessageFlow != null )
		{
			var x = Element.offsetLeft+ Element.offsetWidth;
			var y = Element.offsetTop;
			MessageFlow.innerHTML = '<i class="fa fa-warning"></i>' + Mensaje;
			MessageFlow.style.left = (x + 5) + 'px';
			MessageFlow.style.top = y + 'px';
			MessageFlow.style.visibility = 'visible';
		}
	}

	function Init_Validate( Formulario, Index_Message, Event )
	{
		var DetecteError = false;

		Formulario.Inputs.forEach( (Input) => 
		{
			if(DetecteError)
				return ( Event.preventDefault(), Event.stopPropagation() );

			switch( Input.type )
			{
				case 'email':
					var InputValue  = Input.value;
					InputValue      = InputValue.replace('/ /g', '');

					if( InputValue == '') {
						DetecteError = true;
						Message_Error( 'Correo inválido [El Campo no puede estar vacío]', Input, Index_Message );
						break;
					}

					var InitHost   = InputValue.indexOf('@', 0 );

					if( InitHost < MIN_CORREO || InitHost > MAX_CORREO ) {
						DetecteError = true;
						
						if(InitHost == -1 )
							Message_Error( 'El correo no posee @', Input, Index_Message )
						else
							Message_Error( 'Correo inválido [Solo se permite un mínimo de ' + MIN_CORREO + ', máximo ' + MAX_CORREO + ' caracteres]', Input, Index_Message );
						break;
					}
					
					try {
						var Host        = InputValue.slice( (InitHost+1) ); //ESTO TOMA EN CUENTA DEL @ EN ADELANTE
						var InitExtend  = Host.indexOf('.', 0 ); //ESTO TOMA EN CUENTA DEL . EN ADELANTE
						var Extension   = Host.slice( (InitExtend+1)); //ESTO TOMA EN CUENTA EL 'COM', 'ES', 'ORG'
						Host    = Host.slice(0, InitExtend);

						if( Host.indexOf('@', 0) != -1 || Extension.indexOf('.', 0) != -1 || InitExtend.length <= 0 || Host.length <= 0 )
						{
							DetecteError = true;
							Message_Error( 'Correo inválido', Input, Index_Message );
						} 
						else if( !VALID_HOST.includes(Host))
						{
							DetecteError = true;

							var message = 'Dominio inválido [El Dominio debe ser: (';

							VALID_HOST.forEach( (dominio) => {
								message+= (dominio+ ' ');
							});

							message+= ') ]';

							Message_Error(message, Input, Index_Message);
						} 
						else if( !VALID_EXT.includes(Extension))
						{
							DetecteError = true;

							var message = 'Extensión inválida [La Extensión debe ser: (';

							VALID_EXT.forEach( (ext) => {
								message+= ('.'+ext+ ' ');
							});

							message+= ') ]';

							Message_Error(message, Input, Index_Message);
						}
					} catch (error) {
						DetecteError = true;
						Message_Error( 'Inválido', Input, Index_Message );
					}

					break;
				case 'password':
					var InputValue  = Input.value;
					InputValue      = InputValue.replace('/ /g', '');

					if( InputValue == '' || InputValue.length < MIN_PASSWORD || InputValue.length > MAX_PASSWORD ) {
						DetecteError = true;
						Message_Error( 'Contraseña inválida [Solo se permite un mínimo de ' + MIN_PASSWORD + ', máximo ' + MAX_PASSWORD + ' caracteres]', Input, Index_Message );
					}

					break;
				default:
					switch(Input.name)
					{
						case 'username':
							var InputValue  = Input.value;
							InputValue      = InputValue.replace('/ /g', '');
		
							if( InputValue == '' || InputValue.length < MIN_USER || InputValue.length > MAX_USER ) {
								DetecteError = true;
								Message_Error( 'Usuario inválido [Solo se permite un mínimo de ' + MIN_USER + ', máximo ' + MAX_USER + ' caracteres]', Input, Index_Message );
							}

							break;
						case 'cedula':
								var InputValue  = Input.value;
								InputValue      = InputValue.replace('/ /g', '');
	
								if( InputValue == '' || InputValue.length < MIN_CEDULA || InputValue.length > MAX_CEDULA ) {
									DetecteError = true;
									Message_Error( 'Cedula inválida [Solo se permite un mínimo de ' + MIN_CEDULA + ', máximo ' + MAX_CEDULA + ' caracteres]', Input, Index_Message );
								}

								if(InputValue < LIMITE_CI)
								{
									DetecteError = true;
									Message_Error( 'Error [La cedula no puede ser menor de 3000000]', Input, Index_Message);
								}
							break;
						case 'nombre':
								var InputValue  = Input.value;
								InputValue      = InputValue.replace('/ /g', '');
	
								if( InputValue == '' || InputValue.length < MIN_NOMBRE || InputValue.length > MAX_NOMBRE ) {
									DetecteError = true;
									Message_Error( 'Nombre inválido [Solo se permite un mínimo de ' + MIN_NOMBRE + ', máximo ' + MAX_NOMBRE + ' caracteres]', Input, Index_Message );
								}
									
								break;
						case 'apellido':
								var InputValue  = Input.value;
								InputValue      = InputValue.replace('/ /g', '');
	
								if( InputValue == '' || InputValue.length < MIN_NOMBRE || InputValue.length > MAX_NOMBRE ) {
									DetecteError = true;
									Message_Error( 'Apellido inválido [Solo se permite un mínimo de ' + MIN_NOMBRE + ', máximo ' + MAX_NOMBRE + ' carácteres]', Input, Index_Message );
								}
									
								break;
						case 'edad':
								var InputValue  = Input.value;
								var nivel_select = document.querySelector('#nivel').children[ document.querySelector('#nivel').selectedIndex ].getAttribute("data_position");
								
								InputValue      = InputValue.replace('/ /g', '');
								if(InputValue == '') 
								{
									DetecteError = true;
									Message_Error( 'El campo edad esta vacio', Input, Index_Message );
									break;
								}
								InputValue      = parseFloat(InputValue);

								if(InputValue < modulo.nivel[nivel_select].min_edad  || InputValue > modulo.nivel[nivel_select].max_edad )
								{
									DetecteError = true;
									Message_Error( 'Edad inválida [Solo se puede registrar a niños de '+ modulo.nivel[nivel_select].min_edad +' a ' + modulo.nivel[nivel_select].max_edad + ' años de edad]', Input, Index_Message );
								}
									
								break;
						case 'telefono':
							var InputValue  = Input.value;
							InputValue      = InputValue.replace('/ /g', '');

							if( InputValue == '' || InputValue.length < MIN_TELEFONO || InputValue.length > MAX_TELEFONO ) {
								DetecteError = true;
								Message_Error( 'Teléfono inválido [Solo se permite un mínimo de ' + MIN_TELEFONO + ', máximo ' + MAX_TELEFONO + ' dígitos]', Input, Index_Message );
							}

							if(InputValue <= 0)
							{
								DetecteError = true;
								Message_Error('Error [No existen números de teléfono que contenga solo 0]', Input, Index_Message);
							}
								
							break;
						case 'codigo':
							var InputValue  = Input.value;
							InputValue      = InputValue.replace('/ /g', '');

							if( InputValue == '' || InputValue.length < MIN_CODIGO || InputValue.length > MAX_CODIGO ) {
								DetecteError = true;
								Message_Error( 'Código inválido [Solo se permite un mínimo de ' + MIN_CODIGO + ', máximo ' + MAX_CODIGO + ' carácteres]', Input, Index_Message );
							}
								
							break;
						case 'min_edad':
							var InputValue  = Input.value;
							InputValue      = InputValue.replace('/ /g', '');

							if( InputValue == '' || InputValue < MIN_EDAD ||  InputValue > MAX_EDAD ) {
								DetecteError = true;
								Message_Error( 'Edad minima inválida [La edad debe estar en el rango de ' + MIN_EDAD + ', a ' + MAX_EDAD + ' años de edad]', Input, Index_Message );
							}

							break;
						case 'max_edad':
							var InputValue  = Input.value;
							InputValue      = InputValue.replace('/ /g', '');

							var min_edad = document.querySelector(".min_edad").value;

							if( InputValue == '' || InputValue < min_edad ||  InputValue > MAX_EDAD ) {
								DetecteError = true;
								Message_Error( 'Edad maxima inválida [La edad debe estar en el rango de ' + ( min_edad > 0 ? min_edad: MIN_EDAD ) + ', a ' + MAX_EDAD + ' años de edad]', Input, Index_Message );
							}

							break;
						case 'descripcion':
							var InputValue  = Input.value;
							InputValue      = InputValue.replace('/ /g', '');

							if( InputValue == '' || InputValue.length < MIN_DESCIPTION || InputValue.length > MAX_DESCIPTION ) {
								DetecteError = true;
								Message_Error( 'Descripción inválida [Solo se permite un mínimo de ' + MIN_DESCIPTION + ', máximo ' + MAX_DESCIPTION + ' caracteres]', Input, Index_Message );
							}
								
							break;
						case 'titulo':
							var InputValue  = Input.value;
							InputValue      = InputValue.replace('/ /g', '');

							if( InputValue == '' || InputValue.length < MIN_TITULO || InputValue.length > MAX_TITULO ) {
								DetecteError = true;
								Message_Error( 'Título inválido [Solo se permite un mínimo de ' + MIN_TITULO + ', máximo ' + MAX_TITULO + ' caracteres]', Input, Index_Message );
							}
							break;
					}
			}
		});
		
		// Textareas
		if(DetecteError)
			return ( Event.preventDefault(), Event.stopPropagation() );
		
		Formulario.Textareas.forEach( (Textarea) =>
		{
			if(DetecteError)
				return ( Event.preventDefault(), Event.stopPropagation() );
			
			switch(Textarea.name)
			{
				case 'direccion':
					var TextValue  = Textarea.value;
					TextValue      = TextValue.replace('/ /g', '');

					if( TextValue == '' || TextValue.length < MIN_DIRECTION || TextValue.length > MAX_DIRECTION ) {
						DetecteError = true;
						Message_Error( 'Dirección inválida [mínimo ' + MIN_DIRECTION + ', máximo ' + MAX_DIRECTION + ' caracteres]', Textarea, Index_Message );
					}

					break;
			}
		});

		// Selects
		if(DetecteError)
			return ( Event.preventDefault(), Event.stopPropagation() );
		
		Formulario.Selects.forEach( (Select) =>
		{
			if(DetecteError)
				return ( Event.preventDefault(), Event.stopPropagation() );
			
			switch(Select.name)
			{
				case 'sexo':
				case 'representante':
				case 'nivel':
					var SelectValue  = Select.value;
					
					if( SelectValue == '' || SelectValue == null || SelectValue == NaN ) {

						DetecteError = true;
						Message_Error( Select.name[0].toUpperCase() + Select.name.slice(1) + ' no seleccionado', Select, Index_Message );
					}

					break;
			}
		});

		return DetecteError ? ( Event.preventDefault(), Event.stopPropagation() ) : false ;
	}

}).call(this);