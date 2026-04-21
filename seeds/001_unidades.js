// seeds/001_unidades.js
const { v4: uuidv4 } = require('uuid');

exports.seed = async function(knex) {
  await knex('unidades').del();
  
  await knex('unidades').insert([
    {
      id: uuidv4(),
      nome: 'Raízes Recife - Boa Viagem',
      endereco: 'Av. Boa Viagem, 1234',
      cidade: 'Recife',
      estado: 'PE',
      tem_cozinha_completa: true,
      produtos_disponiveis: ['tapioca', 'cuscuz', 'cafe']
    },
    {
      id: uuidv4(),
      nome: 'Raízes João Pessoa',
      endereco: 'Rua do Sol, 567',
      cidade: 'João Pessoa',
      estado: 'PB',
      tem_cozinha_completa: false,
      produtos_disponiveis: ['tapioca', 'cafe']
    }
  ]);
};