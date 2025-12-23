const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const db = require('./db'); // TAMBAHKAN INI: Agar variabel db bisa digunakan
const typeDefs = require('./schema');

const resolvers = {
  Query: {
    getCart: async (_, { user_id }) => {
      const [rows] = await db.execute('SELECT * FROM carts WHERE user_id = ?', [user_id]);
      return rows;
    }
  },
  Mutation: {
    addToCart: async (_, args) => {
      const [res] = await db.execute('INSERT INTO carts (user_id, menu_id, quantity) VALUES (?, ?, ?)', [args.user_id, args.menu_id, args.quantity]);
      return { id: res.insertId, ...args };
    }
  }
};
async function start() {
  const app = express(); app.use(cors());
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start(); server.applyMiddleware({ app });
  app.listen(process.env.PORT, () => console.log(`Cart Service on ${process.env.PORT}`));
}
start();