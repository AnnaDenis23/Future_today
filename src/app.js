const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, '..', 'public')));

const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');

app.use('/admin', adminRoutes);
app.use('/apply', publicRoutes);

app.get('/', (req, res) => res.redirect('/admin'));

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
  console.log(`Админка: http://localhost:${PORT}/admin`);
});

module.exports = app;