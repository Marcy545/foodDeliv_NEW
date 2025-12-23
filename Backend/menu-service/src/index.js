const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const db = require('./db'); // TAMBAHKAN INI: Agar variabel db bisa digunakan
const typeDefs = require('./schema');

const resolvers = {
  Query: {
    getAllMenus: async () => {
      const [rows] = await db.execute('SELECT * FROM menus');
      return rows;
    }
  },
  Mutation: {
    createMenu: async (_, args) => {
      const [res] = await db.execute(
        'INSERT INTO menus (name, price, description, category, image) VALUES (?, ?, ?, ?, ?)', 
        [args.name, args.price, args.description, args.category, args.image]
      );
      return { id: res.insertId, ...args };
    }
  }
};
async function start() {
  const app = express(); app.use(cors());
  app.use('/images', express.static('public/images'));
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start(); server.applyMiddleware({ app });
  app.listen(process.env.PORT, () => console.log(`User Service on ${process.env.PORT}`));
}
start();