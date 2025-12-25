import { gql } from '@apollo/client';
import { createApolloClient } from './apollo-client';

// Ganti dari 5001 ke 5007
const client = createApolloClient(5007);

export const favoriteService = {
  getFavorites: async (userId) => {
    if (!userId || userId === "null") return [];
    const QUERY = gql`
      query GetFavorites($user_id: ID!) {
        getFavorites(user_id: $user_id) {
          id
          user_id
          menu_id
        }
      }
    `;
    try {
      const response = await client.query({
        query: QUERY,
        variables: { user_id: String(userId) },
        fetchPolicy: 'network-only'
      });
      return response.data.getFavorites;
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  addFavorite: async (userId, menuId) => {
    const MUTATION = gql`
      mutation AddFavorite($user_id: ID!, $menu_id: ID!) {
        addFavorite(user_id: $user_id, menu_id: $menu_id) {
          id
          menu_id
        }
      }
    `;
    try {
      const response = await client.mutate({
        mutation: MUTATION,
        variables: { user_id: String(userId), menu_id: String(menuId) }
      });
      return response.data.addFavorite;
    } catch (error) {
      throw error;
    }
  }
};