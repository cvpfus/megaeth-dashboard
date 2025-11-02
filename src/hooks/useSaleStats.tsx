import { graphql } from "@/gql";
import { useQuery } from "@apollo/client/react";

const GET_SALE_STATS = graphql(`
  query getSaleStats($id: String!) {
    SaleStats(where: { id: { _eq: $id } }) {
      id
      totalBids
      totalBidsUSDT
      totalCancellations
      totalCancellationsUSDT
      totalFullRefundedUSDT
      totalFullRefunds
      totalWinners
      totalPartialRefundedUSDT
      totalPartialRefunds
      totalRefundedUSDT
      totalRefunds
    }
  }
`);

export function useSaleStats() {
  return useQuery(GET_SALE_STATS, {
    variables: { id: "ifyoureadthisyouareawesome" },
    notifyOnNetworkStatusChange: false, // Prevent flickering on refetch
  });
}
