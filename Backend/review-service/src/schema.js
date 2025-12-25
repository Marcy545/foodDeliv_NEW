const { gql } = require('apollo-server-express');

module.exports = gql`
type Review {
    id: ID
    order_id: ID
    menu_id: ID
    menu_name: String
    quantity: Int
    customer_name: String
    rating: Int
    comment: String
  }

  type Query {
    getReviewsByMenu(menu_id: ID!): [Review]
    getReviewsByOrder(order_id: ID!): [Review]
  }

  type Mutation {
    addReview(
      order_id: ID!, 
      menu_id: ID!, 
      menu_name: String!, 
      quantity: Int!,
      customer_name: String!, 
      rating: Int!, 
      comment: String
    ): Review
  }
`;