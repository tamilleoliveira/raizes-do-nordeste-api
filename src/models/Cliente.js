// src/models/Cliente.js
const knex = require('../config/database');

class Cliente {
  static async buscarPorId(id) {
    return await knex('clientes').where('id', id).first();
  }

  static async buscarPorEmail(email) {
    return await knex('clientes').where('email', email).first();
  }

  static async criar(dados) {
    return await knex('clientes').insert(dados).returning('*');
  }
}

module.exports = Cliente;