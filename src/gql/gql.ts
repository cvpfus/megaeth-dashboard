/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query getAuctionHistory(\n    $limit: Int\n    $offset: Int\n    $orderBy: [AuctionHistory_order_by!]\n    $where: AuctionHistory_bool_exp\n  ) {\n    AuctionHistory(\n      limit: $limit\n      offset: $offset\n      order_by: $orderBy\n      where: $where\n    ) {\n      id\n      addr\n      amount\n      entityID\n      status\n      txHash\n      timestamp\n    }\n  }\n": typeof types.GetAuctionHistoryDocument,
    "\n  query getUserAuctionHistory($address: String!) {\n    AuctionHistory(\n      where: { addr: { _ilike: $address } }\n      order_by: { timestamp: desc }\n    ) {\n      id\n      addr\n      amount\n      entityID\n      status\n      lockup\n      txHash\n      timestamp\n    }\n  }\n": typeof types.GetUserAuctionHistoryDocument,
    "\n  query getRecentCancellations(\n    $limit: Int\n    $offset: Int\n    $orderBy: [AuctionHistory_order_by!]\n  ) {\n    AuctionHistory(\n      limit: $limit\n      offset: $offset\n      order_by: $orderBy\n      where: { status: { _eq: \"CancelledAndRefunded\" } }\n    ) {\n      id\n      addr\n      amount\n      status\n      txHash\n      timestamp\n    }\n  }\n": typeof types.GetRecentCancellationsDocument,
    "\n  query getSaleStats($id: String!) {\n    SaleStats(where: { id: { _eq: $id } }) {\n      id\n      totalBids\n      totalBidsUSDT\n      totalCancellations\n      totalCancellationsUSDT\n      totalFullRefundedUSDT\n      totalFullRefunds\n      totalWinners\n      totalPartialRefundedUSDT\n      totalPartialRefunds\n      totalRefundedUSDT\n      totalRefunds\n    }\n  }\n": typeof types.GetSaleStatsDocument,
};
const documents: Documents = {
    "\n  query getAuctionHistory(\n    $limit: Int\n    $offset: Int\n    $orderBy: [AuctionHistory_order_by!]\n    $where: AuctionHistory_bool_exp\n  ) {\n    AuctionHistory(\n      limit: $limit\n      offset: $offset\n      order_by: $orderBy\n      where: $where\n    ) {\n      id\n      addr\n      amount\n      entityID\n      status\n      txHash\n      timestamp\n    }\n  }\n": types.GetAuctionHistoryDocument,
    "\n  query getUserAuctionHistory($address: String!) {\n    AuctionHistory(\n      where: { addr: { _ilike: $address } }\n      order_by: { timestamp: desc }\n    ) {\n      id\n      addr\n      amount\n      entityID\n      status\n      lockup\n      txHash\n      timestamp\n    }\n  }\n": types.GetUserAuctionHistoryDocument,
    "\n  query getRecentCancellations(\n    $limit: Int\n    $offset: Int\n    $orderBy: [AuctionHistory_order_by!]\n  ) {\n    AuctionHistory(\n      limit: $limit\n      offset: $offset\n      order_by: $orderBy\n      where: { status: { _eq: \"CancelledAndRefunded\" } }\n    ) {\n      id\n      addr\n      amount\n      status\n      txHash\n      timestamp\n    }\n  }\n": types.GetRecentCancellationsDocument,
    "\n  query getSaleStats($id: String!) {\n    SaleStats(where: { id: { _eq: $id } }) {\n      id\n      totalBids\n      totalBidsUSDT\n      totalCancellations\n      totalCancellationsUSDT\n      totalFullRefundedUSDT\n      totalFullRefunds\n      totalWinners\n      totalPartialRefundedUSDT\n      totalPartialRefunds\n      totalRefundedUSDT\n      totalRefunds\n    }\n  }\n": types.GetSaleStatsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getAuctionHistory(\n    $limit: Int\n    $offset: Int\n    $orderBy: [AuctionHistory_order_by!]\n    $where: AuctionHistory_bool_exp\n  ) {\n    AuctionHistory(\n      limit: $limit\n      offset: $offset\n      order_by: $orderBy\n      where: $where\n    ) {\n      id\n      addr\n      amount\n      entityID\n      status\n      txHash\n      timestamp\n    }\n  }\n"): (typeof documents)["\n  query getAuctionHistory(\n    $limit: Int\n    $offset: Int\n    $orderBy: [AuctionHistory_order_by!]\n    $where: AuctionHistory_bool_exp\n  ) {\n    AuctionHistory(\n      limit: $limit\n      offset: $offset\n      order_by: $orderBy\n      where: $where\n    ) {\n      id\n      addr\n      amount\n      entityID\n      status\n      txHash\n      timestamp\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getUserAuctionHistory($address: String!) {\n    AuctionHistory(\n      where: { addr: { _ilike: $address } }\n      order_by: { timestamp: desc }\n    ) {\n      id\n      addr\n      amount\n      entityID\n      status\n      lockup\n      txHash\n      timestamp\n    }\n  }\n"): (typeof documents)["\n  query getUserAuctionHistory($address: String!) {\n    AuctionHistory(\n      where: { addr: { _ilike: $address } }\n      order_by: { timestamp: desc }\n    ) {\n      id\n      addr\n      amount\n      entityID\n      status\n      lockup\n      txHash\n      timestamp\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getRecentCancellations(\n    $limit: Int\n    $offset: Int\n    $orderBy: [AuctionHistory_order_by!]\n  ) {\n    AuctionHistory(\n      limit: $limit\n      offset: $offset\n      order_by: $orderBy\n      where: { status: { _eq: \"CancelledAndRefunded\" } }\n    ) {\n      id\n      addr\n      amount\n      status\n      txHash\n      timestamp\n    }\n  }\n"): (typeof documents)["\n  query getRecentCancellations(\n    $limit: Int\n    $offset: Int\n    $orderBy: [AuctionHistory_order_by!]\n  ) {\n    AuctionHistory(\n      limit: $limit\n      offset: $offset\n      order_by: $orderBy\n      where: { status: { _eq: \"CancelledAndRefunded\" } }\n    ) {\n      id\n      addr\n      amount\n      status\n      txHash\n      timestamp\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getSaleStats($id: String!) {\n    SaleStats(where: { id: { _eq: $id } }) {\n      id\n      totalBids\n      totalBidsUSDT\n      totalCancellations\n      totalCancellationsUSDT\n      totalFullRefundedUSDT\n      totalFullRefunds\n      totalWinners\n      totalPartialRefundedUSDT\n      totalPartialRefunds\n      totalRefundedUSDT\n      totalRefunds\n    }\n  }\n"): (typeof documents)["\n  query getSaleStats($id: String!) {\n    SaleStats(where: { id: { _eq: $id } }) {\n      id\n      totalBids\n      totalBidsUSDT\n      totalCancellations\n      totalCancellationsUSDT\n      totalFullRefundedUSDT\n      totalFullRefunds\n      totalWinners\n      totalPartialRefundedUSDT\n      totalPartialRefunds\n      totalRefundedUSDT\n      totalRefunds\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;