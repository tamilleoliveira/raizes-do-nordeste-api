const { v4: uuidv4 } = require('uuid');

exports.up = async function(knex) {
  // Gerar UUIDs manualmente para SQLite
  const unidadeId1 = uuidv4();
  const unidadeId2 = uuidv4();

  await knex.schema.createTable('unidades', function(table) {
    table.string('id', 36).primary();  // UUID como string
    table.string('nome').notNullable();
    table.string('endereco').notNullable();
    table.string('cidade').notNullable();
    table.string('estado', 2).notNullable();
    table.decimal('latitude', 10, 8);
    table.decimal('longitude', 11, 8);
    table.boolean('tem_cozinha_completa').defaultTo(true);
    table.json('produtos_disponiveis');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('clientes', function(table) {
    table.string('id', 36).primary();
    table.string('nome').notNullable();
    table.string('email').unique().notNullable();
    table.string('telefone');
    table.string('cpf').unique();
    table.date('data_nascimento');
    table.boolean('aceita_marketing').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('produtos', function(table) {
    table.string('id', 36).primary();
    table.string('nome').notNullable();
    table.string('descricao');
    table.decimal('preco', 10, 2).notNullable();
    table.string('categoria');
    table.boolean('sazonal').defaultTo(false);
    table.json('ingredientes');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('pedidos', function(table) {
    table.string('id', 36).primary();
    table.string('cliente_id').references('id').inTable('clientes');
    table.string('unidade_id').references('id').inTable('unidades').notNullable();
    table.string('status').defaultTo('recebido');
    table.decimal('total', 10, 2).notNullable();
    table.string('pagamento_status').defaultTo('pendente');
    table.timestamp('previsao_pronta');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // Inserir dados de teste
  await knex('unidades').insert([
    {
      id: unidadeId1,
      nome: 'Raízes Recife - Boa Viagem',
      endereco: 'Av. Boa Viagem, 1234',
      cidade: 'Recife',
      estado: 'PE',
      tem_cozinha_completa: true,
      produtos_disponiveis: JSON.stringify(['tapioca', 'cuscuz', 'cafe', 'suco'])
    },
    {
      id: unidadeId2,
      nome: 'Raízes João Pessoa',
      endereco: 'Rua do Sol, 567',
      cidade: 'João Pessoa',
      estado: 'PB',
      tem_cozinha_completa: false,
      produtos_disponiveis: JSON.stringify(['tapioca', 'cafe'])
    }
  ]);
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('pedidos');
  await knex.schema.dropTableIfExists('produtos');
  await knex.schema.dropTableIfExists('clientes');
  await knex.schema.dropTableIfExists('unidades');
};