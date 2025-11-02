import { graphql } from "@/gql";
import { useQuery } from "@apollo/client/react";

const GET_AUCTION_HISTORY = graphql(`
  query getAuctionHistory($limit: Int, $offset: Int) {
    AuctionHistory(limit: $limit, offset: $offset, order_by: { id: desc }) {
      id
      addr
      amount
      entityID
      status
      txHash
      timestamp
    }
  }
`);

export function useAuctionHistory() {
  return useQuery(GET_AUCTION_HISTORY, {
    variables: { limit: 10, offset: 0 },
  });
}
