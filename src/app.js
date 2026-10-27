const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'public')));

// Подключаем маршруты
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');

app.use('/admin', adminRoutes);
app.use('/apply', publicRoutes);

// Редирект с главной на админку
app.get('/', (req, res) => {
  res.redirect('/admin');
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

module.exports = app;