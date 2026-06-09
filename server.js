const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/set-cookie', (req, res) => {
  const name = req.body.name || 'usuario';
  const value = req.body.value || 'valor-do-cookie';
  const days = Number(req.body.days) || 1;

  res.cookie(name, value, {
    maxAge: days * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
  });

  res.redirect('/');
});

app.get('/read-cookie', (req, res) => {
  res.json(req.cookies || {});
});

app.get('/clear-cookie', (req, res) => {
  Object.keys(req.cookies).forEach((name) => res.clearCookie(name));
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});
