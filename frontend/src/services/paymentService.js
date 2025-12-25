import { gql } from '@apollo/client';
import { createApolloClient } from './apollo-client';

const client = createApolloClient(5005);

export const paymentService = {
  processPayment: async (paymentInput) => {
    const MUTATION = gql`
      mutation ProcessPayment($order_id: ID!, $amount: Int!, $payment_method: String!) {
        processPayment(order_id: $order_id, amount: $amount, payment_method: $payment_method) {
          id
          status
        }
      }
    `;

    try {
      const response = await client.mutate({
        mutation: MUTATION,
        variables: {
          // Pastikan order_id adalah string, dan amount adalah pembulatan angka (Integer)
          order_id: String(paymentInput.order_id),
          amount: Math.round(Number(paymentInput.amount)),
          payment_method: String(paymentInput.payment_method)
        },
      });
      return response.data.processPayment;
    } catch (error) {
      console.error("Payload Error:", error);
      throw error;
    }
  }
};