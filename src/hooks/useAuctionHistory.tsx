import { graphql } from "@/gql";
import { useQuery } from "@apollo/client/react";
import type {
  AuctionHistory_Order_By,
  AuctionHistory_Bool_Exp,
} from "@/gql/graphql";
import { Order_By } from "@/gql/graphql";

const GET_AUCTION_HISTORY = graphql(`
  query getAuctionHistory(
    $limit: Int
    $offset: Int
    $orderBy: [AuctionHistory_order_by!]
    $where: AuctionHistory_bool_exp
  ) {
    AuctionHistory(
      limit: $limit
      offset: $offset
      order_by: $orderBy
      where: $where
    ) {
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
  orderBy?: AuctionHistory_Order_By,
  where?: AuctionHistory_Bool_Exp
) {
  // Default order by id desc if no orderBy provided
  const defaultOrderBy: AuctionHistory_Order_By = { id: Order_By.Desc };

  return useQuery(GET_AUCTION_HISTORY, {
    variables: {
      limit,
      offset,
      orderBy: orderBy || defaultOrderBy,
      where,
    },
    notifyOnNetworkStatusChange: false, // Prevent flickering on refetch
  });
}

const GET_USER_AUCTION_HISTORY = graphql(`
  query getUserAuctionHistory($address: String!) {
    AuctionHistory(
      where: { addr: { _ilike: $address } }
      order_by: { timestamp: desc }
    ) {
      id
      addr
      amount
      entityID
      status
      lockup
      txHash
      timestamp
    }
  }
`);

export function useUserAuctionHistory(address?: string) {
  return useQuery(GET_USER_AUCTION_HISTORY, {
    variables: { address: address || "" },
    skip: !address || address.trim() === "",
    notifyOnNetworkStatusChange: false,
  });
}
