const { gql } = require('apollo-server-express');

module.exports = gql`
  type Favorite {
    id: ID
    user_id: ID
    menu_id: ID
  }

  type Query {
    getFavorites(user_id: ID!): [Favorite]
  }

  type Mutation {
    addFavorite(user_id: ID!, menu_id: ID!): Favorite
    removeFavorite(user_id: ID!, menu_id: ID!): Boolean
  }
`;