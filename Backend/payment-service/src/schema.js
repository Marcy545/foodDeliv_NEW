const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Payment {
    id: ID
    order_id: ID
    amount: Int
    payment_method: String
    status: String
  }

  type Mutation {
    processPayment(order_id: ID!, amount: Int!, payment_method: String!): Payment
  }

  type Query {
    getPaymentByOrder(order_id: ID!): Payment
  }
`;

module.exports = typeDefs;