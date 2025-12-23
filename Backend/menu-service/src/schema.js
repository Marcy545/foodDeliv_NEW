const { gql } = require('apollo-server-express');
module.exports = gql`
  type Menu { id: ID, name: String, price: Int, description: String, category: String, image: String }
  type Query { getAllMenus: [Menu], getMenu(id: ID!): Menu }
  type Mutation { createMenu(name: String!, price: Int!, description: String, category: String, image: String): Menu }
`;