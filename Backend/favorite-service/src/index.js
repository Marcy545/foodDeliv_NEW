const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const db = require('./db'); 
const typeDefs = require('./schema');

const resolvers = {
  Query: {
    getFavorites: async (_, { user_id }) => {
      if (!user_id || user_id === 'null') return [];
      try {
        const [rows] = await db.execute('SELECT * FROM favorites WHERE user_id = ?', [user_id]);
        return rows;
      } catch (err) {
        console.error("Query Error:", err);
        return [];
      }
    }
  },
  Mutation: {
    addFavorite: async (_, { user_id, menu_id }) => {
      try {
        const cleanUserId = Number(user_id);
        const cleanMenuId = Number(menu_id);

        if (isNaN(cleanUserId) || isNaN(cleanMenuId)) {
          throw new Error("ID tidak valid");
        }

        const [res] = await db.execute(
          'INSERT INTO favorites (user_id, menu_id) VALUES (?, ?)', 
          [cleanUserId, cleanMenuId] 
        );
        return { id: res.insertId, user_id: cleanUserId, menu_id: cleanMenuId };
      } catch (err) {
        console.error("Database Error:", err);
        throw new Error("Gagal menyimpan favorit");
      }
    },
    removeFavorite: async (_, { user_id, menu_id }) => {
      try {
        await db.execute('DELETE FROM favorites WHERE user_id = ? AND menu_id = ?', [user_id, menu_id]);
        return true;
      } catch (err) {
        return false;
      }
    }
  }
};

async function start() {
  const app = express(); app.use(cors());
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start(); server.applyMiddleware({ app });
  app.listen(5007, () => console.log(`Favorite Service running on Port 5007`));
}
start();