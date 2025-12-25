const { gql } = require('apollo-server-express');

module.exports = gql`
  type Order { 
    id: ID
    menu_id: ID
    quantity: Int
    total_price: Int
    customer_name: String
    payment_id: ID
    address: String
    menu_name: String
    image: String
    status: String
    created_at: String 
  }

  type Query { 
    getOrders: [Order] 
  }

  type Mutation { 
    createOrder(
      menu_id: ID!, 
      quantity: Int!, 
      total_price: Int!, 
      customer_name: String!, 
      address: String!,
      menu_name: String,
      image: String,
      status: String,
      payment_id: ID
    ): Order 

    # MUTASI BARU UNTUK UPDATE STATUS
    updateOrderStatus(
      id: ID!, 
      status: String!, 
      payment_id: String
    ): Order
  }
`;