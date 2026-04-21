// src/models/Unidade.js
const knex = require('../config/database');

class Unidade {
  static async listar() {
    return await knex('unidades').select('*');
  }

  static async buscarPorId(id) {
    return await knex('unidades').where('id', id).first();
  }

  static async produtosDisponiveis(unidadeId) {
    const unidade = await this.buscarPorId(unidadeId);
    if (!unidade) return [];

    return knex('produtos')
      .whereRaw('id = ANY(unidade.produtos_disponiveis)')
      .where('sazonal', false);
  }
}

module.exports = Unidade;