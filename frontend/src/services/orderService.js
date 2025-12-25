import { gql } from '@apollo/client';
import { createApolloClient } from './apollo-client';

const client = createApolloClient(5003);

export const orderService = {
  // Membuat pesanan baru
  create: async (orderInput) => {
    const CREATE_ORDER_MUTATION = gql`
      mutation CreateOrder($menu_id: ID!, $quantity: Int!, $total_price: Int!, $customer_name: String!, $address: String!, $menu_name: String, $image: String, $status: String) {
        createOrder(menu_id: $menu_id, quantity: $quantity, total_price: $total_price, customer_name: $customer_name, address: $address, menu_name: $menu_name, image: $image, status: $status) {
          id
          status
        }
      }
    `;
    try {
      const response = await client.mutate({
        mutation: CREATE_ORDER_MUTATION,
        variables: {
          ...orderInput,
          quantity: parseInt(orderInput.quantity),
          total_price: parseInt(orderInput.total_price),
          menu_id: String(orderInput.menu_id)
        },
      });
      return response.data.createOrder;
    } catch (error) {
      throw new Error("Gagal membuat pesanan: " + error.message);
    }
  },

  // Update status (PENTING untuk sinkronisasi Payment)
  updateStatus: async (id, status, payment_id = null) => {
    const UPDATE_STATUS_MUTATION = gql`
      mutation UpdateOrderStatus($id: ID!, $status: String!, $payment_id: String) {
        updateOrderStatus(id: $id, status: $status, payment_id: $payment_id) {
          id
          status
        }
      }
    `;
    try {
      const response = await client.mutate({
        mutation: UPDATE_STATUS_MUTATION,
        variables: { 
          id: String(id), 
          status: status, 
          payment_id: payment_id ? String(payment_id) : null 
        }
      });
      return response.data.updateOrderStatus;
    } catch (error) {
      throw new Error("Gagal update status pesanan");
    }
  },

  getOrders: async () => {
    const GET_ORDERS_QUERY = gql`
      query GetOrders {
        getOrders {
          id
          menu_id
          menu_name
          image
          quantity
          total_price
          customer_name
          address
          status
          created_at
        }
      }
    `;
    const response = await client.query({ query: GET_ORDERS_QUERY, fetchPolicy: 'network-only' });
    return response.data.getOrders;
  }
};