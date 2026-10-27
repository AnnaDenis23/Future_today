const express = require('express');
const path = require('path');
const db = require('./db'); // Подключаем базу данных, чтобы она создалась

const app = express();

// Настройка шаблонизатора (пока не используем, но пригодится)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Чтобы сервер понимал данные из форм
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'public')));

// Наша первая страница админки!
app.get('/admin', (req, res) => {
  res.send('<h1>Admin works!</h1><p>Ура, сервер запущен и база данных работает.</p>');
});

// Экспортируем приложение для server.js
module.exports = app;