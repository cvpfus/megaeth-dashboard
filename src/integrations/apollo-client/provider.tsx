import { ApolloProvider } from "@apollo/client/react";

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

import { GRAPHQL_API_URL, GRAPHQL_API_URL_LOCAL } from "@/constants";

const isLocal = process.env.NODE_ENV === "development";

const client = new ApolloClient({
  link: new HttpLink({
    uri: isLocal ? GRAPHQL_API_URL_LOCAL : GRAPHQL_API_URL,
  }),
  cache: new InMemoryCache(),
});

export function Provider({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
