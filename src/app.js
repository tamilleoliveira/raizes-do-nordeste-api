require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Raízes do Nordeste API v1.0 ✅'
  });
});

// API Routes
app.use('/api', routes);

// 404 Handler CORRIGIDO
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Endpoint ${req.originalUrl} não encontrado` 
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Erro interno do servidor' 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Raízes do Nordeste API`);
  console.log(`🌐 http://localhost:${PORT}/health`);
  console.log(`📱 http://localhost:${PORT}/api/unidades`);
  console.log(`➕ http://localhost:${PORT}/api/produtos`);
});