const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const db = require('./db'); 
const typeDefs = require('./schema');

const resolvers = {
  Query: {
    getReviewsByMenu: async (_, { menu_id }) => {
      if (menu_id === "all") {
        const [rows] = await db.execute('SELECT * FROM reviews ORDER BY id DESC');
        return rows;
      }
      const [rows] = await db.execute('SELECT * FROM reviews WHERE menu_id = ?', [menu_id]);
      return rows;
    },
    getReviewsByOrder: async (_, { order_id }) => {
      const [rows] = await db.execute('SELECT * FROM reviews WHERE order_id = ?', [order_id]);
      return rows;
    }
  },
  // PERBAIKAN DI SINI: Mutation harus berupa OBJECT
  Mutation: {
    addReview: async (_, args) => {
      try {
        const [res] = await db.execute(
          `INSERT INTO reviews 
          (order_id, menu_id, menu_name, quantity, customer_name, rating, comment) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            args.order_id, 
            args.menu_id, 
            args.menu_name, 
            args.quantity, 
            args.customer_name, 
            args.rating, 
            args.comment || ""
          ]
        );
        return { id: res.insertId, ...args };
      } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Gagal menyimpan ulasan");
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
  
  // Menggunakan port dari env atau default 5006
  const PORT = process.env.PORT || 5006;
  app.listen(PORT, () => console.log(`🚀 Review Service ready on port ${PORT}`));
}

start();