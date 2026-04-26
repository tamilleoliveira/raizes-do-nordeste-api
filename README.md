# 🚀 Raízes do Nordeste API

[![Status](https://img.shields.io/badge/status-production-green.svg)]()
[![Node.js](https://img.shields.io/badge/Node.js-v18-green.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()

**API completa** para estudo de caso **Raízes do Nordeste** - Rede de lanchonetes nordestinas.

## ✨ Funcionalidades
# Clonar
git clone https://github.com/tamilleoliveira/raizes-do-nordeste-api.git
cd raizes-do-nordeste-api

# Dependências
npm install

# Banco de dados
npm run migrate

# Executar
npm run dev

# Listar unidades
curl http://localhost:3000/api/unidades

# Criar pedido
curl -X POST http://localhost:3000/api/pedidos \
-H "Content-Type: application/json" \
-d '{
  "unidade_id": "3425ac77-283f-48fe-a3f5-4ddef515df5c",
  "itens": [{"id": "tapioca", "preco": 8.5, "quantidade": 2}]
}'


## ✅ **PUSH PARA GITHUB:**

```cmd
git add README.md
git commit -m "📚 README.md profissional completo"
git push


Seu repo: https://github.com/tamilleoliveira/raizes-do-nordeste-api
README renderizado com badges, tabelas, códigos!

Explorer (esquerda):
raizes-do-nordeste-api/  ← Clique aqui (raiz)
├── README.md           ← New File → README.md
├── src/
└── package.json