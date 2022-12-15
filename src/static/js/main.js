( function()
{
    window.onload   = function()
    {
        var LoginContainer  = document.getElementById( "section-acces" );
        var LoginMenu       = document.getElementById( "-login" );
        var PassMenu        = document.getElementById( "-password" );
        var UpButton        = document.getElementById( 'Upbutton' );

        var ActivateLogin   = document.getElementById( "option-login" );
        var ButtonClear     = document.querySelectorAll( "#button-passclear" );

        var LoginShow       = false;

        // Mostrar Login Menu
        ActivateLogin.addEventListener( "click", ( e ) =>
        {
            if( LoginContainer.style.display   != "flex" && LoginShow == false )
            {
                LoginContainer.style.display    = "flex";
                LoginShow   = true;
            }
        });

        LoginContainer.onclick  = ( e ) =>
        {
            if( ( e.toElement.id.toString() ) == "section-acces" && LoginShow )
            {
                LoginContainer.style.display    = "none";
                LoginMenu.style.display = "block";
                PassMenu.style.display  = "none";
                LoginShow   = false;
            }
        }

        // Recuperar contraseña toggle
        ButtonClear.forEach(element => {
            element.addEventListener( "click", () =>
            {
                if( !LoginShow )
                    return;

                if( LoginMenu.style.display != "none" && PassMenu.style.display != "block" )
                {
                    LoginMenu.style.display = "none";
                    PassMenu.style.display  = "block";
                }
                else
                {
                    LoginMenu.style.display = "block";
                    PassMenu.style.display  = "none";
                }
            });
        });

        var Alto = document.body.offsetHeight;

        window.onscroll = function() {
            if(document.body.scrollTop > (Alto/4) || document.documentElement.scrollTop > (Alto/4) )
                UpButton.style.visibility = 'visible';
            else
                UpButton.style.visibility = 'hidden';
        };
    }

}).call( this );
