import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

export const createApolloClient = (port) => {
  const httpLink = createHttpLink({
    uri: `http://localhost:${port}/graphql`,
  });

  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
      // Kebijakan Tipe Data untuk menangani peringatan penggantian field getCart
      typePolicies: {
        Query: {
          fields: {
            getCart: {
              // Fungsi merge ini memastikan data incoming menggantikan data existing sepenuhnya
              merge(existing, incoming) {
                return incoming;
              },
            },
          },
        },
      },
    }),
  });
};