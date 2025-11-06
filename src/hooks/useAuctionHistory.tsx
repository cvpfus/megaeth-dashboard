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
    notifyOnNetworkStatusChange: true, // Allow loading state updates during polling
    pollInterval: 500, // Poll every 0.5 seconds
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
    notifyOnNetworkStatusChange: true,
  });
}

// Hook for recent cancellations
const GET_RECENT_CANCELLATIONS = graphql(`
  query getRecentCancellations(
    $limit: Int
    $offset: Int
    $orderBy: [AuctionHistory_order_by!]
  ) {
    AuctionHistory(
      limit: $limit
      offset: $offset
      order_by: $orderBy
      where: { status: { _eq: "CancelledAndRefunded" } }
    ) {
      id
      addr
      amount
      status
      txHash
      timestamp
    }
  }
`);

export function useRecentCancellations(
  limit = 5,
  offset = 0,
  orderBy?: AuctionHistory_Order_By
) {
  // Default order by timestamp desc for recent cancellations
  const defaultOrderBy: AuctionHistory_Order_By = { timestamp: Order_By.Desc };

  return useQuery(GET_RECENT_CANCELLATIONS, {
    variables: {
      limit,
      offset,
      orderBy: orderBy || defaultOrderBy,
    },
    notifyOnNetworkStatusChange: true,
    pollInterval: 500, // Poll every 0.5 seconds
  });
}
