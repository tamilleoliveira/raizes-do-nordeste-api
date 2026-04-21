// src/controllers/UnidadesController.js
const knex = require('../config/database');

class UnidadesController {
  static async index(req, res) {
    try {
      const unidades = await knex('unidades').select('*');
      res.json({ success: true, data: unidades });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async menu(req, res) {
    try {
      const { id } = req.params;
      // Lógica do menu por unidade
      const unidade = await knex('unidades').where('id', id).first();
      res.json({ 
        success: true, 
        unidade,
        produtos_disponiveis: unidade?.produtos_disponiveis || []
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = UnidadesController;