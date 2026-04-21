// src/controllers/PedidosController.js
const Pedido = require('../models/Pedido');
const Unidade = require('../models/Unidade');
const Cliente = require('../models/Cliente');

class PedidosController {
  static async index(req, res) {
    try {
      const { unidade_id, cliente_id } = req.query;
      const pedidos = await Pedido.listarPorCliente(cliente_id, unidade_id);
      res.json({
        success: true,
        data: pedidos,
        count: pedidos.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async store(req, res) {
    try {
      const { unidade_id, itens, cliente_id } = req.body;
      
      const pedido = await Pedido.criar({
        unidade_id,
        itens,
        cliente_id
      });

      // Simular integração pagamento externo
      const pagamento = await this.processarPagamento(pedido.id, pedido.total);

      res.status(201).json({
        success: true,
        data: {
          pedido_id: pedido.id,
          total: pedido.total,
          pagamento_status: pagamento.status,
          proxima_url: pagamento.next_url || null
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async show(req, res) {
    try {
      const { id } = req.params;
      const pedido = await knex('pedidos').where('id', id).first();
      
      if (!pedido) {
        return res.status(404).json({
          success: false,
          message: 'Pedido não encontrado'
        });
      }

      res.json({
        success: true,
        data: pedido
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, previsao_pronta } = req.body;

      const pedidos = await Pedido.atualizarStatus(id, status, previsao_pronta);
      
      res.json({
        success: true,
        data: pedidos[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async processarPagamento(pedidoId, total) {
    // Simulação de gateway de pagamento externo
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 'pendente',
          transaction_id: `TX${Date.now()}`,
          next_url: `https://gateway.pagamentos.com.br/pagar/${pedidoId}`
        });
      }, 100);
    });
  }
}

module.exports = PedidosController;