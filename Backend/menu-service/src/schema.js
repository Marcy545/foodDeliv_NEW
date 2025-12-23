const { gql } = require('apollo-server-express');

module.exports = gql`
  type Menu { id: ID, name: String, price: Int, description: String, category: String, image: String }
  type Query { getAllMenus: [Menu], getMenu(id: ID!): Menu }
  
  type Mutation { 
    # Tambah
    createMenu(name: String!, price: Int!, description: String, category: String, image: String): Menu 
    # Perbaikan: Tambah Update & Delete
    updateMenu(id: ID!, name: String!, price: Int!, description: String, category: String, image: String): Menu
    deleteMenu(id: ID!): DeleteResponse
  }

  type DeleteResponse { success: Boolean, id: ID }
`;