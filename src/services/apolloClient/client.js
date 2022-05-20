const { ApolloClient, InMemoryCache } = require('@apollo/client');

const graphqlUrl = 'http://localhost:4000/';

const client = new ApolloClient({
  uri: graphqlUrl,
  cache: new InMemoryCache(),
});

export default client;
