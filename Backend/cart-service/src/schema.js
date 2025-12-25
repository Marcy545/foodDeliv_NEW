const { gql } = require('apollo-server-express');

module.exports = gql`
  type Cart { 
    id: ID
    user_id: ID
    menu_id: ID
    quantity: Int 
  }

  type Query { 
    getCart(user_id: ID!): [Cart] 
  }

  type Mutation { 
    # Fungsi Tambah
    addToCart(user_id: ID!, menu_id: ID!, quantity: Int!): Cart 
    
    # Fungsi Update & Hapus
    updateCart(id: ID!, quantity: Int!): Cart
    removeFromCart(id: ID!): ID
  }
`;