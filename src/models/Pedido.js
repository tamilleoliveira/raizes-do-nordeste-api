// src/models/Pedido.js
const knex = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Pedido {
  static async criar(dados) {
    const id = uuidv4();
    
    // Verificar produtos disponíveis na unidade
    const unidade = await knex('unidades').where('id', dados.unidade_id).first();
    if (!unidade) throw new Error('Unidade não encontrada');

    const itensValidos = await Promise.all(
      dados.itens.map(async (item) => {
        const produto = await knex('produtos')
          .where('id', item.produto_id)
          .andWhereRaw('id = ANY(?)', [unidade.produtos_disponiveis])
          .first();
        
        if (!produto) {
          throw new Error(`Produto ${item.produto_id} não disponível nesta unidade`);
        }
        
        return { ...item, preco_unitario: produto.preco };
      })
    );

    const total = itensValidos.reduce((sum, item) => 
      sum + (item.quantidade * item.preco_unitario), 0
    );

    const [pedidoId] = await knex('pedidos')
      .insert({
        id,
        cliente_id: dados.cliente_id,
        unidade_id: dados.unidade_id,
        total,
        itens: JSON.stringify(itensValidos)
      })
      .returning('id');

    // Atualizar pontos fidelidade
    if (dados.cliente_id) {
      await this.atualizarPontosFidelidade(dados.cliente_id, total);
    }

    return { id: pedidoId, total };
  }

  static async listarPorCliente(clienteId, unidadeId = null) {
    let query = knex('pedidos')
      .where('cliente_id', clienteId)
      .orderBy('created_at', 'desc');

    if (unidadeId) {
      query = query.andWhere('unidade_id', unidadeId);
    }

    return await query;
  }

  static async atualizarStatus(pedidoId, status, previsaoPronta = null) {
    const updateData = { status };
    
    if (previsaoPronta) {
      updateData.previsao_pronta = previsaoPronta;
    }

    return await knex('pedidos')
      .where('id', pedidoId)
      .update(updateData)
      .returning('*');
  }

  static async atualizarPontosFidelidade(clienteId, total) {
    const pontos = Math.floor(total * 10); // 10 pontos por real
    
    await knex('pontos_fidelidade')
      .insert({
        cliente_id: clienteId,
        pontos
      })
      .onConflict('cliente_id')
      .merge({
        pontos: knex.raw('pontos_fidelidade.pontos + ?', [pontos])
      });
  }
}

module.exports = Pedido;