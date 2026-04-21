const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

// Listar unidades
router.get('/unidades', async (req, res) => {
  try {
    const unidades = await db('unidades').select('*');
    res.json({ success: true, data: unidades, count: unidades.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Menu de uma unidade
router.get('/unidades/:id/menu', async (req, res) => {
  try {
    const { id } = req.params;
    const unidade = await db('unidades').where('id', id).first();
    
    if (!unidade) {
      return res.status(404).json({ success: false, message: 'Unidade não encontrada' });
    }

    // Produtos disponíveis (parse JSON)
    const produtosDisponiveis = JSON.parse(unidade.produtos_disponiveis);
    
    res.json({
      success: true,
      unidade,
      produtos_disponiveis: produtosDisponiveis,
      menu_exemplo: [
        { id: 'tapioca', nome: 'Tapioca Doce', preco: 8.50 },
        { id: 'cuscuz', nome: 'Cuscuz com Ovo', preco: 12.00 }
      ]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// CRIAR PEDIDO ✅ NOVO!
router.post('/pedidos', async (req, res) => {
  try {
    const { unidade_id, itens, cliente_nome, cliente_email } = req.body;
    
    // Validar unidade
    const unidade = await db('unidades').where('id', unidade_id).first();
    if (!unidade) {
      return res.status(404).json({ success: false, message: 'Unidade não encontrada' });
    }

    // Calcular total
    const total = itens.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    
    // Simular pagamento externo
    const pagamento = {
      status: 'pendente',
      gateway_url: `https://pagamento.raizes.com.br/${uuidv4()}`,
      transaction_id: uuidv4()
    };

    res.status(201).json({
      success: true,
      data: {
        id: uuidv4(),
        unidade_id,
        cliente_nome,
        total: Number(total.toFixed(2)),
        itens,
        status: 'recebido',
        pagamento_status: pagamento.status,
        proxima_acao: pagamento.gateway_url
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;