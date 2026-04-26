require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Raízes do Nordeste',
      version: '1.0.0',
      description: 'Documentação da API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // onde estão suas rotas
};

const swaggerSpec = swaggerJsdoc(options);

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

// Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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