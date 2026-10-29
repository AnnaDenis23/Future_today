const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'app.json');

// Инициализация базы данных
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ forms: [], submissions: [] }, null, 2));
}

const db = {
  read: () => JSON.parse(fs.readFileSync(dbPath, 'utf-8')),
  write: (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2)),
  
  getForms: () => {
    const data = db.read();
    return data.forms.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },
  
  getFormById: (id) => db.read().forms.find(f => f.id === Number(id)),
  getFormBySlug: (slug) => db.read().forms.find(f => f.slug === slug && f.published === 1),
  
  addForm: (form) => {
    const data = db.read();
    form.id = Date.now();
    form.created_at = new Date().toISOString();
    data.forms.push(form);
    db.write(data);
    return form;
  },
  
  updateForm: (id, updates) => {
    const data = db.read();
    const index = data.forms.findIndex(f => f.id === Number(id));
    if (index !== -1) {
      data.forms[index] = { ...data.forms[index], ...updates };
      db.write(data);
    }
  },

  addSubmission: (formId, dataJson) => {
    const data = db.read();
    const submission = {
      id: Date.now(),
      form_id: formId,
      data_json: dataJson,
      created_at: new Date().toISOString()
    };
    data.submissions.push(submission);
    db.write(data);
    return submission;
  },

  getSubmissionsByFormId: (formId) => {
    const data = db.read();
    return data.submissions
      .filter(s => s.form_id === Number(formId))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
};

module.exports = db;