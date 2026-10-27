const express = require('express');
const router = express.Router();
const db = require('../db');

// Отображение формы студенту
router.get('/:slug', (req, res) => {
  const form = db.prepare('SELECT * FROM forms WHERE slug = ? AND published = 1').get(req.params.slug);
  
  if (!form) {
    return res.status(404).send('Форма не найдена или не опубликована');
  }

  res.render('public/form', { form, schema: JSON.parse(form.schema_json) });
});

// Обработка отклика студента
router.post('/:slug', (req, res) => {
  const form = db.prepare('SELECT * FROM forms WHERE slug = ? AND published = 1').get(req.params.slug);
  
  if (!form) return res.status(404).send('Форма не найдена');

  // Сохраняем ответы (req.body) в виде JSON-строки
  const dataJson = JSON.stringify(req.body);
  
  db.prepare('INSERT INTO submissions (form_id, data_json) VALUES (?, ?)').run(form.id, dataJson);
  
  res.render('public/success');
});

module.exports = router;