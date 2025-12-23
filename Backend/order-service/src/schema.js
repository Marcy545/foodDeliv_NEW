const { gql } = require('apollo-server-express');
module.exports = gql`
  type Order { id: ID, menu_id: ID, quantity: Int, total_price: Int, customer_name: String, payment_id: ID, status: String, created_at: String }
  type Query { getOrders: [Order] }
  type Mutation { createOrder(menu_id: ID!, quantity: Int!, total_price: Int!, customer_name: String!, status: String): Order }
`;