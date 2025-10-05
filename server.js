const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;

// Sağlık kontrolü
app.get('/health', (req, res) => res.status(200).send('ok'));

// React build çıktılarını servis et
const clientBuildPath = path.join(__dirname, 'client', 'build');
app.use(express.static(clientBuildPath));

// Tüm diğer istekleri React’a yönlendir (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
