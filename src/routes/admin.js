const express = require('express');
const router = express.Router();
const db = require('../db');

// Список всех форм
router.get('/', (req, res) => {
  const forms = db.prepare('SELECT * FROM forms ORDER BY created_at DESC').all();
  res.render('admin/index', { forms });
});

// Страница создания новой формы
router.get('/forms/new', (req, res) => {
  res.render('admin/new');
});

// Сохранение новой формы
router.post('/forms', (req, res) => {
  const { title, schema_json } = req.body;
  const slug = Math.random().toString(36).substring(2, 8); // Генерируем короткую ссылку
  
  db.prepare('INSERT INTO forms (title, slug, schema_json, published) VALUES (?, ?, ?, 0)')
    .run(title, slug, schema_json);
    
  res.redirect('/admin');
});

// Публикация/снятие с публикации
router.post('/forms/:id/publish', (req, res) => {
  const { id } = req.params;
  const form = db.prepare('SELECT published FROM forms WHERE id = ?').get(id);
  const newStatus = form.published === 1 ? 0 : 1;
  
  db.prepare('UPDATE forms SET published = ? WHERE id = ?').run(newStatus, id);
  res.redirect('/admin');
});

// Просмотр откликов на форму
router.get('/forms/:id/responses', (req, res) => {
  const formId = req.params.id;
  const form = db.prepare('SELECT * FROM forms WHERE id = ?').get(formId);
  const submissions = db.prepare('SELECT * FROM submissions WHERE form_id = ? ORDER BY created_at DESC').all(formId);
  
  // Парсим JSON с ответами
  const parsedSubmissions = submissions.map(sub => ({
    ...sub,
    data: JSON.parse(sub.data_json)
  }));

  res.render('admin/responses', { form, submissions: parsedSubmissions, schema: JSON.parse(form.schema_json) });
});

module.exports = router;