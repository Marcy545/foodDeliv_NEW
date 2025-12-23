const { gql } = require('apollo-server-express');
module.exports = gql`
  # Enum untuk membedakan hak akses
  enum Role { 
    CUSTOMER 
    RESTAURANT 
  }

  type User { 
    id: ID
    name: String 
    email: String 
    role: Role 
  }

  # Tipe khusus untuk respon login yang mengembalikan token
  type AuthResponse {
    token: String
    user: User
  }

  type Query { 
    getUsers: [User]
    getUser(id: ID!): User
    # Query untuk mendapatkan data profil user yang sedang login via token
    me: User 
  }

  type Mutation { 
    # Register tidak lagi butuh input role (otomatis CUSTOMER di resolver)
    register(name: String!, email: String!, password: String!): User 
    
    # Mutation untuk proses masuk/login
    login(email: String!, password: String!): AuthResponse
  }
`;