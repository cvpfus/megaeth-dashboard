import { ApolloProvider } from "@apollo/client/react";

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:8080/v1/graphql/" }),
  cache: new InMemoryCache(),
});

export function Provider({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
