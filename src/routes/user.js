 const func = require('../func.js');

module.exports = (app, db) => {

    require('./user/notificacion')(app, db, func);
    require('./user/perfil')(app, db, func);
    require('./user/publicacion')(app, db, func);

    app.get('/inicio/*', (req, res) => {
        res.redirect('/inicio');
    });

    app.get('/perfil/*', (req, res) => {
        res.redirect('/inicio');
    });

    app.get('/:id_public/*', (req, res) => {
        res.redirect('/inicio');
    });

};
