const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const db = require('./db'); // TAMBAHKAN INI: Agar variabel db bisa digunakan
const typeDefs = require('./schema');

const resolvers = {
  Query: {
    getReviewsByMenu: async (_, { menu_id }) => {
      const [rows] = await db.execute('SELECT * FROM reviews WHERE menu_id = ?', [menu_id]);
      return rows;
    },
    getReviewsByOrder: async (_, { order_id }) => {
      const [rows] = await db.execute('SELECT * FROM reviews WHERE order_id = ?', [order_id]);
      return rows;
    }
  },
  Mutation: {
    addReview: async (_, args) => {
      const [res] = await db.execute(
        'INSERT INTO reviews (order_id, menu_id, customer_name, rating, comment) VALUES (?, ?, ?, ?, ?)',
        [args.order_id, args.menu_id, args.customer_name, args.rating, args.comment]
      );
      return { id: res.insertId, ...args };
    }
  }
};
async function start() {
  const app = express(); app.use(cors());
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start(); server.applyMiddleware({ app });
  app.listen(process.env.PORT, () => console.log(`Review Service on ${process.env.PORT}`));
}
start();