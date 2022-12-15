( function() 
{
    window.onload   = function()
    {
        var UserMenu    = document.getElementById( "menu-deploy" );
        var EditMenu    = document.getElementById( "save-edit" );
        var EditClave   = document.getElementById( "save-pass" );
        var AllInputs   = document.getElementsByClassName( "input-form" );
        var ButtonEdit  = document.getElementById( "button-edit" );
        var ButtonClave = document.getElementById( "button-password" );
        var InputsHidden    = document.querySelectorAll( ".hidden-div" );
        
        var ShowOptions = false;
        
        // Show menu perfil
        window.onclick  = function( e )
        {
            if( ShowOptions || ( e.toElement.id.toString() ) != "cliente-photo" )
            {
                UserMenu.style.display      = "none";
                ShowOptions                 = false;
            }
            else
            {
                UserMenu.style.display      = "flex";
                ShowOptions                 = true;
            }
        }

        // option cambiar password
        if( ButtonClave != null && EditClave != null && InputsHidden.length > 0)
        {
            ButtonClave.addEventListener( "click", function( e ) 
            {
                if( EditClave.style.display != "block" )
                {
                    InputsHidden.forEach(Div => {
                        Div.classList.toggle("hidden-div");
                    });

                    EditClave.style.display = "block";
                    ButtonClave.textContent  ="Cancelar";
                    ButtonClave.classList.toggle("cancel-edit");
                }
                else
                {
                    InputsHidden.forEach(Div => {
                        Div.classList.toggle("hidden-div");
                    });
    
                    EditClave.style.display = "none";
                    ButtonClave.textContent  ="Editar";
                    ButtonClave.classList.toggle("cancel-edit");
                }
    
                e.preventDefault();
            });
        }

        if( ButtonEdit == null )
            return;
            
        ButtonEdit.addEventListener( "click", function( e ) 
        {
            if( EditMenu.style.display != "block" )
            {
                for (let index = 0; index < AllInputs.length; index++) 
                {
                    AllInputs[ index ].classList.toggle("activate-input");
                    AllInputs[ index ].removeAttribute( "disabled" );
                }

                EditMenu.style.display = "block";
                ButtonEdit.textContent  ="Cancelar";
                ButtonEdit.classList.toggle("cancel-edit");
            }
            else
            {
                for (let index = 0; index < AllInputs.length; index++)  
                {
                    AllInputs[ index ].classList.toggle("activate-input");
                    AllInputs[ index ].setAttribute( "disabled", "disabled" );
                }

                EditMenu.style.display = "none";
                ButtonEdit.textContent  ="Editar";
                ButtonEdit.classList.toggle("cancel-edit");
            }

            e.preventDefault();
        });
    }

}).call( this );
