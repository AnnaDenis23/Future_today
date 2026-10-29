const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const forms = db.getForms();
  res.render('admin/index', { forms });
});

router.get('/forms/new', (req, res) => {
  res.render('admin/new');
});

router.post('/forms', (req, res) => {
  const { title, schema_json } = req.body;
  
  // Надежная генерация уникального slug
  let slug = Math.random().toString(36).substring(2, 8);
  while (db.getFormBySlug(slug)) {
    slug = Math.random().toString(36).substring(2, 8);
  }

  db.addForm({
    title,
    slug,
    schema_json,
    published: 0
  });
    
  res.redirect('/admin');
});

router.post('/forms/:id/publish', (req, res) => {
  const form = db.getFormById(req.params.id);
  if (form) {
    db.updateForm(form.id, { published: form.published === 1 ? 0 : 1 });
  }
  res.redirect('/admin');
});

router.get('/forms/:id/responses', (req, res) => {
  const form = db.getFormById(req.params.id);
  if (!form) return res.status(404).send('Форма не найдена');

  const submissions = db.getSubmissionsByFormId(form.id).map(sub => ({
    ...sub,
    data: JSON.parse(sub.data_json)
  }));

  res.render('admin/responses', { 
    form, 
    submissions, 
    schema: JSON.parse(form.schema_json) 
  });
});

module.exports = router;