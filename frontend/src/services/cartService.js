import { gql } from '@apollo/client';
import { createApolloClient } from './apollo-client';

// Client khusus untuk Cart Service Port 5004
const client = createApolloClient(5004);

export const cartService = {
  /**
   * Mengambil semua item di keranjang user
   */
  getCart: async (userId) => {
    const QUERY = gql`
      query GetCart($user_id: ID!) { 
        getCart(user_id: $user_id) { id user_id menu_id quantity } 
      }
    `;
    const res = await client.query({ 
        query: QUERY, 
        variables: { user_id: userId }, 
        fetchPolicy: 'network-only' 
    });
    return res.data.getCart;
  },

  /**
   * Menambah menu ke keranjang (PENTING)
   */
  addToCart: async (userId, menuId, quantity) => {
    const MUTATION = gql`
      mutation AddToCart($user_id: ID!, $menu_id: ID!, $quantity: Int!) {
        addToCart(user_id: $user_id, menu_id: $menu_id, quantity: $quantity) { 
          id 
          user_id 
          menu_id 
          quantity 
        }
      }
    `;
    const res = await client.mutate({ 
      mutation: MUTATION, 
      variables: { 
        user_id: userId, 
        menu_id: menuId, 
        quantity: parseInt(quantity) 
      } 
    });
    return res.data.addToCart;
  },

  /**
   * Memperbarui jumlah pesanan di keranjang
   */
  updateCart: async (id, quantity) => {
    const MUTATION = gql`
      mutation UpdateCart($id: ID!, $quantity: Int!) {
        updateCart(id: $id, quantity: $quantity) { id quantity }
      }
    `;
    const res = await client.mutate({ 
      mutation: MUTATION, 
      variables: { 
        id: String(id), 
        quantity: parseInt(quantity) 
      } 
    });
    return res.data.updateCart;
  },

  /**
   * Menghapus item dari keranjang berdasarkan ID baris
   */
  removeFromCart: async (id) => {
    const MUTATION = gql`
      mutation RemoveFromCart($id: ID!) {
        removeFromCart(id: $id)
      }
    `;
    const res = await client.mutate({ 
      mutation: MUTATION, 
      variables: { id: String(id) } 
    });
    return res.data.removeFromCart;
  }
};