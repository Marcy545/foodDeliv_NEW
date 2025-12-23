import { gql } from '@apollo/client';
import { createApolloClient } from './apollo-client';

const client = createApolloClient(5002);

export const GET_ALL_MENUS = gql`
  query GetAllMenus { getAllMenus { id name price description category image } }
`;

export const CREATE_MENU = gql`
  mutation CreateMenu($name: String!, $price: Int!, $description: String, $category: String, $image: String) {
    createMenu(name: $name, price: $price, description: $description, category: $category, image: $image) { id }
  }
`;

export const UPDATE_MENU = gql`
  mutation UpdateMenu($id: ID!, $name: String!, $price: Int!, $description: String, $category: String, $image: String) {
    updateMenu(id: $id, name: $name, price: $price, description: $description, category: $category, image: $image) { id }
  }
`;

export const DELETE_MENU = gql`
  mutation DeleteMenu($id: ID!) { deleteMenu(id: $id) { id } }
`;

export const menuService = {
  getMenus: async () => {
    const { data } = await client.query({ query: GET_ALL_MENUS, fetchPolicy: 'network-only' });
    return data.getAllMenus;
  },
  addMenu: async (form) => {
    return await client.mutate({ mutation: CREATE_MENU, variables: { ...form, price: parseInt(form.price) } });
  },
  updateMenu: async (id, form) => {
    return await client.mutate({ mutation: UPDATE_MENU, variables: { id, ...form, price: parseInt(form.price) } });
  },
  deleteMenu: async (id) => {
    return await client.mutate({ mutation: DELETE_MENU, variables: { id } });
  }
};