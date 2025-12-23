const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const db = require('./db'); // TAMBAHKAN INI: Agar variabel db bisa digunakan
const typeDefs = require('./schema');

const resolvers = {
  Query: {
    getPaymentByOrder: async (_, { order_id }) => {
      const [rows] = await db.execute('SELECT * FROM payments WHERE order_id = ?', [order_id]);
      return rows[0];
    }
  },
  Mutation: {
    processPayment: async (_, args) => {
      const status = "SUCCESS"; // Logika dummy pembayaran
      const [res] = await db.execute(
        'INSERT INTO payments (order_id, amount, payment_method, status) VALUES (?, ?, ?, ?)',
        [args.order_id, args.amount, args.payment_method, status]
      );
      return { id: res.insertId, status, ...args };
    }
  }
};
async function start() {
  const app = express(); app.use(cors());
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start(); server.applyMiddleware({ app });
  app.listen(process.env.PORT, () => console.log(`Payment Service on ${process.env.PORT}`));
}
start();