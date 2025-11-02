import { graphql } from "@/gql";
import { useQuery } from "@apollo/client/react";
import type { AuctionHistory_Order_By } from "@/gql/graphql";
import { Order_By } from "@/gql/graphql";

const GET_AUCTION_HISTORY = graphql(`
  query getAuctionHistory(
    $limit: Int
    $offset: Int
    $orderBy: [AuctionHistory_order_by!]
  ) {
    AuctionHistory(limit: $limit, offset: $offset, order_by: $orderBy) {
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

export function useAuctionHistory(
  limit = 10,
  offset = 0,
  orderBy?: AuctionHistory_Order_By
) {
  // Default order by id desc if no orderBy provided
  const defaultOrderBy: AuctionHistory_Order_By = { id: Order_By.Desc };

  return useQuery(GET_AUCTION_HISTORY, {
    variables: {
      limit,
      offset,
      orderBy: orderBy || defaultOrderBy,
    },
  });
}
