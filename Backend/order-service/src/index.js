const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const db = require('./db'); 
const typeDefs = require('./schema');

const resolvers = {
  Query: {
    getOrders: async () => {
      const [rows] = await db.execute('SELECT * FROM orders ORDER BY created_at DESC');
      return rows.map(row => ({
        ...row,
        created_at: row.created_at ? new Date(row.created_at).toISOString() : null
      }));
    }
  },
  
  Mutation: {
    createOrder: async (_, args) => {
      try {
        const [res] = await db.execute(
          `INSERT INTO orders 
          (menu_id, quantity, total_price, customer_name, address, menu_name, image, status, payment_id, created_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`, 
          [args.menu_id, args.quantity, args.total_price, args.customer_name, args.address, args.menu_name || 'Menu', args.image || null, args.status || 'PENDING', args.payment_id || null]
        );
        return { id: res.insertId, ...args, created_at: new Date().toISOString() };
      } catch (error) {
        throw new Error("Gagal menyimpan data pesanan.");
      }
    },

    // RESOLVER BARU: Melakukan Update, bukan Insert
    updateOrderStatus: async (_, { id, status, payment_id }) => {
      try {
        await db.execute(
          'UPDATE orders SET status = ?, payment_id = ? WHERE id = ?',
          [status, payment_id, id]
        );
        return { id, status, payment_id };
      } catch (error) {
        console.error("Update Error:", error);
        throw new Error("Gagal memperbarui status pesanan.");
      }
    }
  }
};

async function start() {
  const app = express(); 
  app.use(cors());
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start(); 
  server.applyMiddleware({ app });
  const PORT = process.env.PORT || 5003;
  app.listen(PORT, () => console.log(`Order Service running on port ${PORT}`));
}
start();