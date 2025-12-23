const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./db');
const typeDefs = require('./schema');

// Kunci rahasia untuk JWT (Sebaiknya simpan di environment variable)
const SECRET_KEY = process.env.JWT_SECRET || 'RAHASIA_DELIV_JS_2025';

const resolvers = {
  Query: {
    getUsers: async () => {
      const [rows] = await db.execute('SELECT id, name, email, role FROM users');
      return rows;
    },
    getUser: async (_, { id }) => {
      const [rows] = await db.execute('SELECT id, name, email, role FROM users WHERE id = ?', [id]);
      return rows[0];
    },
    // Query untuk mengecek data diri berdasarkan token
    me: async (_, __, { user }) => {
      if (!user) throw new Error("Anda tidak terautentikasi!");
      const [rows] = await db.execute('SELECT id, name, email, role FROM users WHERE id = ?', [user.id]);
      return rows[0];
    }
  },
  Mutation: {
    // Register otomatis menjadi CUSTOMER dengan password terenkripsi
    register: async (_, { name, email, password }) => {
      // Cek email duplikat
      const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
      if (existing.length > 0) throw new Error("Email sudah terdaftar!");

      const hashedPassword = await bcrypt.hash(password, 10);
      const [res] = await db.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, "CUSTOMER")', 
        [name, email, hashedPassword]
      );
      return { id: res.insertId, name, email, role: 'CUSTOMER' };
    },

    // Login mendukung Plain Text (untuk Admin/Restaurant di init.sql) dan Bcrypt
    login: async (_, { email, password }) => {
      const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
      const user = rows[0];

      if (!user) throw new Error("Email atau password salah!");

      let isValid = false;
      // Cek apakah password di DB diawali format Bcrypt ($2a$ atau $2b$)
      if (user.password.startsWith('$2')) {
        isValid = await bcrypt.compare(password, user.password);
      } else {
        // Bandingkan Plain Text untuk akun Admin yang diinput manual
        isValid = (password === user.password);
      }

      if (!isValid) throw new Error("Email atau password salah!");

      // Buat Token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        SECRET_KEY,
        { expiresIn: '1d' }
      );

      return {
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      };
    }
  }
};

async function start() {
  const app = express();
  app.use(cors());

  const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    // Menambahkan user ke context jika token valid
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      if (token.startsWith('Bearer ')) {
        try {
          const decoded = jwt.verify(token.split(' ')[1], SECRET_KEY);
          return { user: decoded };
        } catch (err) {
          console.error("JWT Verification Error:", err.message);
        }
      }
      return {};
    }
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`🚀 User Service ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

start();