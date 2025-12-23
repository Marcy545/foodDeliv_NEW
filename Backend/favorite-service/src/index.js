const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const db = require('./db'); // TAMBAHKAN INI: Agar variabel db bisa digunakan
const typeDefs = require('./schema');

const resolvers = {
  Query: {
    getFavorites: async (_, { user_id }) => {
      const [rows] = await db.execute('SELECT * FROM favorites WHERE user_id = ?', [user_id]);
      return rows;
    }
  },
  Mutation: {
    addFavorite: async (_, args) => {
      const [res] = await db.execute('INSERT INTO favorites (user_id, menu_id) VALUES (?, ?)', [args.user_id, args.menu_id]);
      return { id: res.insertId, ...args };
    }
  }
};
async function start() {
  const app = express(); app.use(cors());
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start(); server.applyMiddleware({ app });
  app.listen(process.env.PORT, () => console.log(`User Service on ${process.env.PORT}`));
}
start();