const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const db = require('./db'); // TAMBAHKAN INI: Agar variabel db bisa digunakan
const typeDefs = require('./schema');

const resolvers = {
  Query: {
    getOrders: async () => {
      const [rows] = await db.execute('SELECT * FROM orders');
      return rows;
    }
  },
  Mutation: {
    createOrder: async (_, args) => {
      const [res] = await db.execute(
        'INSERT INTO orders (menu_id, quantity, total_price, customer_name, status) VALUES (?, ?, ?, ?, ?)', 
        [args.menu_id, args.quantity, args.total_price, args.customer_name, args.status || 'PENDING']
      );
      return { id: res.insertId, ...args };
    }
  }
};
async function start() {
  const app = express(); app.use(cors());
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start(); server.applyMiddleware({ app });
  app.listen(process.env.PORT, () => console.log(`Order Service on ${process.env.PORT}`));
}
start();