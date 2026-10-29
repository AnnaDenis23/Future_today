const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/:slug', (req, res) => {
  const form = db.getFormBySlug(req.params.slug);
  if (!form) return res.status(404).send('Форма не найдена или не опубликована');

  res.render('public/form', { form, schema: JSON.parse(form.schema_json) });
});

router.post('/:slug', (req, res) => {
  const form = db.getFormBySlug(req.params.slug);
  if (!form) return res.status(404).send('Форма не найдена');

  const schema = JSON.parse(form.schema_json);
  const validatedData = {};

  // ВАЛИДАЦИЯ: сохраняем только те поля, которые есть в схеме
  schema.forEach(field => {
    let value = req.body[field.name];
    
    // Простая проверка обязательных полей
    if (field.required && (!value || value.trim() === '')) {
      return res.status(400).send(`Поле "${field.label}" является обязательным`);
    }
    
    validatedData[field.name] = value ? value.trim() : '';
  });
  
  db.addSubmission(form.id, JSON.stringify(validatedData));
  res.render('public/success');
});

module.exports = router;