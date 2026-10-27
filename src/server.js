const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`Сервер запущен!`);
  console.log(`Админка доступна: http://localhost:${PORT}/admin`);
  console.log(`=========================================`);
});