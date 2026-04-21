// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const Cliente = require('../models/Cliente');

const authCliente = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticação requerido'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const cliente = await Cliente.buscarPorId(decoded.cliente_id);
    
    if (!cliente) {
      return res.status(401).json({
        success: false,
        message: 'Cliente não encontrado'
      });
    }

    // Verificar consentimento LGPD para dados pessoais
    if (req.path.includes('fidelidade') && !cliente.aceita_marketing) {
      return res.status(403).json({
        success: false,
        message: 'Consentimento para marketing necessário'
      });
    }

    req.cliente = cliente;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

module.exports = { authCliente };