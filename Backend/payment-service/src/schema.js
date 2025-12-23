const { gql } = require('apollo-server-express');

module.exports = gql`
  type Payment {
    id: ID
    order_id: ID
    amount: Int
    payment_method: String
    status: String
    timestamp: String
  }

  type Query {
    getPaymentByOrder(order_id: ID!): Payment
  }

  type Mutation {
    processPayment(
      order_id: ID!, 
      amount: Int!, 
      payment_method: String!
    ): Payment
  }
`;