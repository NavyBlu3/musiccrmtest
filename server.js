const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// 1) HEALTH
app.get('/health', (req, res) => res.status(200).send('ok'));

// 2) API ROUTE’LARI (static’tan ÖNCE)
app.get('/api/classrooms', async (req, res) => {
  // TODO: DB’den çekin; şimdilik örnek dizi dönelim ki UI çalışsın
  return res.json([
    { id: 1, name: 'Sınıf A', type: 'instrument' },
    { id: 2, name: 'Sınıf B', type: 'instrument' },
    { id: 3, name: 'Resim Sınıfı', type: 'art' },
  ]);
});

app.get('/api/teachers', async (req, res) => {
  return res.json([
    { id: 1, name: 'Ayşe Hoca', hourly_rate: 500, can_teach_art: false },
    { id: 2, name: 'Zeynep Hoca', hourly_rate: 400, can_teach_art: true },
  ]);
});

// ... diğer /api/* endpoint’leri

// 3) STATIC SERVE
const clientBuildPath = path.join(__dirname, 'client', 'build');
app.use(express.static(clientBuildPath));

// 4) SPA FALLBACK: /api dışındakileri index.html’e yönlendir
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
