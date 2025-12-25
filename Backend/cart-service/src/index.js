const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
const db = require("./db");
const typeDefs = require("./schema");

const resolvers = {
  Query: {
    getCart: async (_, { user_id }) => {
      const [rows] = await db.execute(
        "SELECT * FROM carts WHERE user_id = ?",
        [user_id]
      );
      return rows;
    },
  },

  Mutation: {
    /**
     * ADD TO CART (FIXED)
     * - jika menu_id sudah ada → tambah quantity
     * - jika belum → insert baru
     */
    addToCart: async (_, { user_id, menu_id, quantity }) => {
      // cek existing cart item
      const [rows] = await db.execute(
        "SELECT id, quantity FROM carts WHERE user_id = ? AND menu_id = ?",
        [user_id, menu_id]
      );

      // jika sudah ada → update quantity
      if (rows.length > 0) {
        const existing = rows[0];
        const newQuantity = existing.quantity + quantity;

        await db.execute(
          "UPDATE carts SET quantity = ? WHERE id = ?",
          [newQuantity, existing.id]
        );

        return {
          id: existing.id,
          user_id,
          menu_id,
          quantity: newQuantity,
        };
      }

      // jika belum ada → insert baru
      const [res] = await db.execute(
        "INSERT INTO carts (user_id, menu_id, quantity) VALUES (?, ?, ?)",
        [user_id, menu_id, quantity]
      );

      return {
        id: res.insertId,
        user_id,
        menu_id,
        quantity,
      };
    },

    /**
     * UPDATE CART
     */
    updateCart: async (_, { id, quantity }) => {
      const qty = parseInt(quantity);

      await db.execute(
        "UPDATE carts SET quantity = ? WHERE id = ?",
        [qty, id]
      );

      return { id, quantity: qty };
    },

    /**
     * REMOVE FROM CART
     */
    removeFromCart: async (_, { id }) => {
      await db.execute("DELETE FROM carts WHERE id = ?", [id]);
      return id;
    },
  },
};

async function start() {
  const app = express();
  app.use(cors());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 5004;
  app.listen(PORT, () =>
    console.log(`🛒 Cart Service running on port ${PORT}`)
  );
}

start();
