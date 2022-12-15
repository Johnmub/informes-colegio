import express from 'express';
import passport, { authenticate } from 'passport';
import { Database } from 'sqlite3';

// config
var app = express();
var db = new Database('../data/db.sqlite3', (err) => {
  if (err) return console.error(err);
  console.log('Conectado con la base de datos')
});

require('./config')(app, db, express, passport);

// routes
app.get('/', (req, res) => {
  db.all('SELECT titulo FROM publicacion WHERE para="todos" ORDER BY id DESC LIMIT 3', (error, result) => {
    if(error)
      return res.render('user/404');
    res.render('home', { publicaciones: result }); 
  });
});

app.post('/login', authenticate('local', {
  successRedirect: '/panel',
  failureFlash: ('error', 'La cuenta que acabas de ingresar no se encuentra disponible'),
  failureRedirect: '/'
}));

app.get('/salir', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/panel', (req, res) => {
  if (!req.isAuthenticated())
    return res.redirect('/');

  if(req.user.representante_id != null)
    return res.redirect('/inicio');
  else
    return res.redirect('/panel/publicaciones');
});

require('./routes/admin')(app, db);
require('./routes/user')(app, db);
require('./routes/email')(app, db);

app.get('*', (req, res) => {
  res.redirect('/');
});

// run
app.listen('8000', () => {
  console.log('Servidor en marcha...');
});
