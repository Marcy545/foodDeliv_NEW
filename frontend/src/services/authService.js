import { gql } from '@apollo/client';
import { createApolloClient } from './apollo-client';

const client = createApolloClient(5001);

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        role
        email
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      id
      name
      email
    }
  }
`;

export const authService = {
  login: async (email, password) => {
    try {
      const response = await client.mutate({
        mutation: LOGIN_MUTATION,
        variables: { email, password },
      });
      return response.data.login;
    } catch (error) {
      throw new Error(error.graphQLErrors?.[0]?.message || "Login gagal, periksa koneksi backend");
    }
  },

  register: async (name, email, password) => {
    try {
      const response = await client.mutate({
        mutation: REGISTER_MUTATION,
        variables: { name, email, password },
      });
      return response.data.register;
    } catch (error) {
      throw new Error(error.graphQLErrors?.[0]?.message || "Registrasi gagal");
    }
  },

  setSession: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  }
};