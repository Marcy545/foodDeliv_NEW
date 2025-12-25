import { gql } from '@apollo/client';
import { createApolloClient } from './apollo-client';

// Client khusus untuk Review Service (Port 5006)
const client = createApolloClient(5006);

export const reviewService = {
  // 1. Ambil ulasan (Admin kirim "all" untuk melihat semua item spesifik)
  getReviewsByMenu: async (menu_id) => {
    const QUERY = gql`
      query GetReviewsByMenu($menu_id: ID!) {
        getReviewsByMenu(menu_id: $menu_id) {
          id
          order_id
          menu_id
          menu_name    # Field ini harus ada agar tidak muncul "Menu Tidak Diketahui"
          quantity     # Field ini harus ada agar tidak muncul "0 Item"
          customer_name
          rating
          comment
        }
      }
    `;
    try {
      const response = await client.query({ 
        query: QUERY, 
        variables: { menu_id: String(menu_id) },
        fetchPolicy: 'network-only' 
      });
      return response.data.getReviewsByMenu || [];
    } catch (error) {
      console.error("Gagal fetch reviews:", error);
      return [];
    }
  },

  // 2. Cek apakah baris item tertentu sudah di-review
  getReviewsByOrder: async (order_id) => {
    const QUERY = gql`
      query GetReviewsByOrder($order_id: ID!) {
        getReviewsByOrder(order_id: $order_id) {
          id
          menu_id
        }
      }
    `;
    try {
      const response = await client.query({ 
        query: QUERY, 
        variables: { order_id: String(order_id) },
        fetchPolicy: 'network-only' 
      });
      return response.data.getReviewsByOrder || [];
    } catch (error) {
      console.error("Gagal fetch reviews by order:", error);
      return [];
    }
  },

  // 3. Mutasi untuk menambah ulasan baru per item menu
  addReview: async (reviewInput) => {
    // Validasi ketat sebelum mengirim ke server untuk mencegah error MySQL "undefined"
    if (!reviewInput.menu_id || reviewInput.menu_id === 'undefined') {
      throw new Error("ID Menu tidak valid");
    }

    const MUTATION = gql`
      mutation AddReview(
        $order_id: ID!, 
        $menu_id: ID!, 
        $menu_name: String!, 
        $quantity: Int!, 
        $customer_name: String!, 
        $rating: Int!, 
        $comment: String
      ) {
        addReview(
          order_id: $order_id, 
          menu_id: $menu_id, 
          menu_name: $menu_name, 
          quantity: $quantity, 
          customer_name: $customer_name, 
          rating: $rating, 
          comment: $comment
        ) {
          id
        }
      }
    `;
    try {
      const response = await client.mutate({
        mutation: MUTATION,
        variables: {
          // Pastikan konversi tipe data eksplisit sesuai skema database
          order_id: String(reviewInput.order_id),
          menu_id: String(reviewInput.menu_id),
          menu_name: String(reviewInput.menu_name || "Menu"),
          quantity: parseInt(reviewInput.quantity || 1),
          customer_name: String(reviewInput.customer_name),
          rating: parseInt(reviewInput.rating),
          comment: String(reviewInput.comment || "")
        }
      });
      return response.data.addReview;
    } catch (error) {
      console.error("Mutation Error:", error);
      // Lempar pesan error asli dari backend jika tersedia
      const errorMessage = error.graphQLErrors?.[0]?.message || "Gagal mengirim ulasan";
      throw new Error(errorMessage);
    }
  }
};