import { gql } from '@apollo/client';
import { createApolloClient } from './apollo-client';

const client = createApolloClient(5001);

/**
 * Query baru untuk mengambil data profil user berdasarkan token di header
 */
export const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      role
      email
    }
  }
`;

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

  // Fungsi untuk Register Customer
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

  /**
   * Penambahan Fungsi: Mendapatkan profil user terbaru langsung dari server
   */
  getCurrentUserRemote: async () => {
    try {
      const response = await client.query({
        query: GET_ME,
        fetchPolicy: 'network-only', // Memastikan data selalu segar dari server
      });
      return response.data.me;
    } catch (error) {
      // Jika token expired atau tidak valid, otomatis logout
      authService.logout();
      return null;
    }
  },

  // Fungsi Helper untuk Simpan Token & Logout
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