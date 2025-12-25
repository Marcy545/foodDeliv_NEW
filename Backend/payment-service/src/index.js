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
    processPayment: async (_, { order_id, amount, payment_method }) => {
      try {
        // Gunakan Math.round untuk memastikan amount adalah Integer murni
        const finalAmount = Math.round(amount);
        const [res] = await db.execute(
          'INSERT INTO payments (order_id, amount, payment_method, status) VALUES (?, ?, ?, ?)',
          [order_id, finalAmount, payment_method, 'Success']
        );
        return { id: res.insertId, order_id, amount: finalAmount, payment_method, status: 'Success' };
      } catch (error) {
        console.error("DB Error:", error);
        throw new Error("Gagal menyimpan data pembayaran");
      }
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