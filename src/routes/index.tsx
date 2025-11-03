import { useSaleStats } from "@/hooks/useSaleStats";
import { useAuctionHistory } from "@/hooks/useAuctionHistory";
import { createFileRoute } from "@tanstack/react-router";
import { Order_By } from "@/gql/graphql";
import { Navigation } from "@/components/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  TrendingUp,
  DollarSign,
  XCircle,
  RotateCcw,
  Trophy,
  Activity,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";

export const Route = createFileRoute("/")({ component: App });

const Status = {
  Bidding: "Bidding",
  CancelledAndRefunded: "CancelledAndRefunded",
  PartiallyRefunded: "PartiallyRefunded",
  Refunded: "Refunded",
  Allocated: "Allocated",
} as const;

function App() {
  const { data, loading, error } = useSaleStats();
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageChanging, setIsPageChanging] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [searchAddress, setSearchAddress] = useState("");
  const itemsPerPage = 10;

  // Build orderBy object based on sort state
  const orderBy = useMemo(() => {
    if (sortOrder === "asc") {
      return { amount: Order_By.Asc };
    }
    if (sortOrder === "desc") {
      return { amount: Order_By.Desc };
    }
    return { id: Order_By.Desc };
  }, [sortOrder]);

  // Build where clause based on search
  const whereClause = useMemo(() => {
    const conditions: any = {};

    if (searchAddress.trim()) {
      conditions.addr = { _ilike: `%${searchAddress.trim()}%` };
    }

    return Object.keys(conditions).length > 0 ? conditions : undefined;
  }, [searchAddress]);

  const {
    data: auctionData,
    loading: auctionLoading,
    error: auctionError,
    previousData: previousAuctionData,
  } = useAuctionHistory(
    itemsPerPage,
    (currentPage - 1) * itemsPerPage,
    orderBy,
    whereClause
  );

  const stats = data?.SaleStats?.[0];
  // Use previous data while loading to prevent flickering
  const auctionHistory =
    auctionData?.AuctionHistory || previousAuctionData?.AuctionHistory || [];

  const formatNumber = (num: number | undefined) => {
    if (num === undefined) return "0";
    return new Intl.NumberFormat("en-US").format(num);
  };

  const formatUSDT = (num: number | undefined) => {
    if (num === undefined) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num);
  };

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: string | number) => {
    if (!timestamp) return "-";
    try {
      // Handle both string and numeric timestamps
      // If it's a number, it might be in seconds or milliseconds
      let date: Date;
      if (typeof timestamp === "number") {
        // If timestamp is less than year 2100 in seconds, it's probably in seconds
        date =
          timestamp < 10000000000
            ? new Date(timestamp * 1000)
            : new Date(timestamp);
      } else {
        // Try parsing as string - could be ISO format, numeric string, etc.
        const numericTimestamp = Number(timestamp);
        if (!isNaN(numericTimestamp)) {
          date =
            numericTimestamp < 10000000000
              ? new Date(numericTimestamp * 1000)
              : new Date(numericTimestamp);
        } else {
          date = new Date(timestamp);
        }
      }

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "-";
      }

      // Calculate relative time
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      // Determine the appropriate unit and value
      const rtf = new Intl.RelativeTimeFormat("en", {
        numeric: "auto",
        style: "long",
      });

      const minute = 60;
      const hour = minute * 60;
      const day = hour * 24;
      const week = day * 7;
      const month = day * 30;
      const year = day * 365;

      if (Math.abs(diffInSeconds) < minute) {
        return rtf.format(-Math.floor(diffInSeconds), "second");
      }
      if (Math.abs(diffInSeconds) < hour) {
        return rtf.format(-Math.floor(diffInSeconds / minute), "minute");
      }
      if (Math.abs(diffInSeconds) < day) {
        return rtf.format(-Math.floor(diffInSeconds / hour), "hour");
      }
      if (Math.abs(diffInSeconds) < week) {
        return rtf.format(-Math.floor(diffInSeconds / day), "day");
      }
      if (Math.abs(diffInSeconds) < month) {
        return rtf.format(-Math.floor(diffInSeconds / week), "week");
      }
      if (Math.abs(diffInSeconds) < year) {
        return rtf.format(-Math.floor(diffInSeconds / month), "month");
      }
      return rtf.format(-Math.floor(diffInSeconds / year), "year");
    } catch (error) {
      console.error("Error formatting timestamp:", timestamp, error);
      return "-";
    }
  };

  const getStatusLabel = (status: string) => {
    if (status === Status.CancelledAndRefunded) {
      return "Cancelled & Refunded";
    }
    // Add spaces before capital letters for better readability
    return status.replace(/([A-Z])/g, " $1").trim();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        className: string;
      }
    > = {
      [Status.Bidding]: {
        variant: "default",
        className: "bg-blue-500/20 text-blue-400 border-blue-500/50",
      },
      [Status.CancelledAndRefunded]: {
        variant: "destructive",
        className: "bg-red-500/20 text-red-400 border-red-500/50",
      },
      [Status.PartiallyRefunded]: {
        variant: "outline",
        className: "bg-orange-500/20 text-orange-400 border-orange-500/50",
      },
      [Status.Refunded]: {
        variant: "outline",
        className: "bg-purple-500/20 text-purple-400 border-purple-500/50",
      },
      [Status.Allocated]: {
        variant: "secondary",
        className: "bg-green-500/20 text-green-400 border-green-500/50",
      },
    };

    const config = statusConfig[status] || {
      variant: "outline" as const,
      className: "bg-gray-500/20 text-gray-400 border-gray-500/50",
    };

    return (
      <Badge variant={config.variant} className={config.className}>
        {getStatusLabel(status)}
      </Badge>
    );
  };

  const toggleSort = () => {
    if (sortOrder === null) {
      setSortOrder("desc");
    } else if (sortOrder === "desc") {
      setSortOrder("asc");
    } else {
      setSortOrder(null);
    }
  };

  const handlePreviousPage = () => {
    setIsPageChanging(true);
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    if (auctionHistory.length === itemsPerPage) {
      setIsPageChanging(true);
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Reset page changing state when data loads
  useEffect(() => {
    if (!auctionLoading && isPageChanging) {
      setIsPageChanging(false);
    }
  }, [auctionLoading, isPageChanging]);

  // Only show loading screen on initial load, not during polling
  if (loading && !data) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading sale statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">
          Error loading data: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <Navigation />

      {/* Header */}
      <section className="relative py-12 px-6 border-b border-slate-700/50">
        <div className="absolute inset-0 bg-linear-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <Activity className="w-8 h-8 text-cyan-400" />
              <h1 className="text-4xl md:text-5xl font-black text-white">
                <span className="bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  MegaETH
                </span>{" "}
                <span className="text-gray-300">Sale Dashboard</span>
              </h1>
            </div>
          </div>
          <p className="text-lg text-gray-400 ml-12">
            Real-time statistics and analytics for the MegaETH sale
          </p>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-8 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Bids Overview Card */}
          <Card
            className={`bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-cyan-500/50 transition-colors duration-300 ${loading ? "shadow-lg shadow-cyan-500/50 border-cyan-500" : ""}`}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl">
                    Total Bids
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Overall bidding activity
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-3xl font-bold text-cyan-400">
                    {formatNumber(stats?.totalBids)}
                  </p>
                  <p className="text-sm text-gray-500">Number of bidders</p>
                </div>
                <div className="pt-3 border-t border-slate-700">
                  <p className="text-2xl font-semibold text-white">
                    {formatUSDT(stats?.totalBidsUSDT)}
                  </p>
                  <p className="text-sm text-gray-500">Total value (USDT)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Winners Card */}
          <Card
            className={`bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-yellow-500/50 transition-colors duration-300 ${loading ? "shadow-lg shadow-yellow-500/50 border-yellow-500" : ""}`}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl">Winners</CardTitle>
                  <CardDescription className="text-gray-400">
                    Successful participants
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-3xl font-bold text-yellow-400">
                    {formatNumber(stats?.totalWinners)}
                  </p>
                  <p className="text-sm text-gray-500">Total winning bidders</p>
                </div>
                <div className="pt-3 border-t border-slate-700">
                  <p className="text-lg text-gray-400">
                    {stats?.totalBids && stats?.totalWinners
                      ? `${((stats.totalWinners / stats.totalBids) * 100).toFixed(1)}%`
                      : "0%"}
                  </p>
                  <p className="text-sm text-gray-500">Win rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Refunds Overview Card */}
          <Card
            className={`bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-purple-500/50 transition-colors duration-300 ${loading ? "shadow-lg shadow-purple-500/50 border-purple-500" : ""}`}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <RotateCcw className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl">
                    Total Refunds
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    All refunds combined
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-3xl font-bold text-purple-400">
                    {formatNumber(stats?.totalRefunds)}
                  </p>
                  <p className="text-sm text-gray-500">Number of refunds</p>
                </div>
                <div className="pt-3 border-t border-slate-700">
                  <p className="text-2xl font-semibold text-white">
                    {formatUSDT(stats?.totalRefundedUSDT)}
                  </p>
                  <p className="text-sm text-gray-500">Total value (USDT)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cancellations Card */}
          <Card
            className={`bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-red-500/50 transition-colors duration-300 ${loading ? "shadow-lg shadow-red-500/50 border-red-500" : ""}`}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl">
                    Cancellations
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Cancelled bids
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-3xl font-bold text-red-400">
                    {formatNumber(stats?.totalCancellations)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Number of cancellations
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-700">
                  <p className="text-2xl font-semibold text-white">
                    {formatUSDT(stats?.totalCancellationsUSDT)}
                  </p>
                  <p className="text-sm text-gray-500">Total value (USDT)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Partial Refunds Card */}
          <Card
            className={`bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-orange-500/50 transition-colors duration-300 ${loading ? "shadow-lg shadow-orange-500/50 border-orange-500" : ""}`}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <DollarSign className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl">
                    Partial Refunds
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Partial refund breakdown
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-3xl font-bold text-orange-400">
                    {formatNumber(stats?.totalPartialRefunds)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Number of partial refunds
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-700">
                  <p className="text-2xl font-semibold text-white">
                    {formatUSDT(stats?.totalPartialRefundedUSDT)}
                  </p>
                  <p className="text-sm text-gray-500">Total value (USDT)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Full Refunds Card */}
          <Card
            className={`bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-green-500/50 transition-colors duration-300 ${loading ? "shadow-lg shadow-green-500/50 border-green-500" : ""}`}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl">
                    Full Refunds
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Complete refund breakdown
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-3xl font-bold text-green-400">
                    {formatNumber(stats?.totalFullRefunds)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Number of full refunds
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-700">
                  <p className="text-2xl font-semibold text-white">
                    {formatUSDT(stats?.totalFullRefundedUSDT)}
                  </p>
                  <p className="text-sm text-gray-500">Total value (USDT)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Auction History Table */}
      <section className="py-8 px-6 max-w-7xl mx-auto pb-16">
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-white text-2xl">
                    Auction History
                  </CardTitle>
                  <CardDescription className="text-gray-400 mt-2">
                    Detailed transaction history for all auction participants
                  </CardDescription>
                </div>
              </div>

              {/* Filters Row */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[250px] max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by address..."
                    value={searchAddress}
                    onChange={(e) => {
                      setSearchAddress(e.target.value);
                      setCurrentPage(1); // Reset to first page when searching
                    }}
                    className="pl-10 bg-slate-800 border-slate-600 text-gray-300 placeholder:text-gray-500 focus:border-cyan-500"
                  />
                  {searchAddress && (
                    <button
                      onClick={() => {
                        setSearchAddress("");
                        setCurrentPage(1);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                      title="Clear search"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {auctionLoading && auctionHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-400 flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading auction history...
              </div>
            ) : auctionError ? (
              <div className="text-center py-8 text-red-400">
                Error loading auction history: {auctionError.message}
              </div>
            ) : auctionHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No auction history available
              </div>
            ) : (
              <>
                <div className="relative rounded-lg border border-slate-700 overflow-hidden">
                  {/* Loading overlay for pagination */}
                  {auctionLoading && (
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
                      <div className="flex items-center gap-2 text-cyan-400 bg-slate-800 px-4 py-2 rounded-lg border border-cyan-500/30 shadow-lg">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm font-medium">Loading...</span>
                      </div>
                    </div>
                  )}
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-800/80 hover:bg-slate-800/80">
                        <TableHead className="text-gray-300 font-semibold">
                          Address
                        </TableHead>
                        <TableHead className="text-gray-300 font-semibold">
                          <button
                            onClick={toggleSort}
                            className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
                          >
                            <span>Amount (USDT)</span>
                            {sortOrder === null && (
                              <ArrowUpDown className="w-4 h-4 text-gray-500" />
                            )}
                            {sortOrder === "asc" && (
                              <ArrowUp className="w-4 h-4 text-cyan-400" />
                            )}
                            {sortOrder === "desc" && (
                              <ArrowDown className="w-4 h-4 text-cyan-400" />
                            )}
                          </button>
                        </TableHead>
                        <TableHead className="text-gray-300 font-semibold">
                          Status
                        </TableHead>
                        <TableHead className="text-gray-300 font-semibold">
                          Transaction Hash
                        </TableHead>
                        <TableHead className="text-gray-300 font-semibold">
                          Time
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auctionHistory.map((auction: any) => (
                        <TableRow
                          key={auction.id}
                          className="border-slate-700 hover:bg-slate-700/30"
                        >
                          <TableCell className="text-gray-300">
                            <code className="px-2 py-1 bg-slate-900/50 rounded text-cyan-400 text-xs">
                              {formatAddress(auction.addr)}
                            </code>
                          </TableCell>
                          <TableCell className="text-gray-300 font-semibold">
                            <div className="flex items-center gap-2">
                              <img
                                src="https://tether.to/images/logoCircle.svg"
                                alt="USDT"
                                className="w-5 h-5"
                              />
                              <span>{formatNumber(auction.amount)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(auction.status)}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {auction.txHash ? (
                              <a
                                href={`https://etherscan.io/tx/${auction.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block"
                              >
                                <code className="px-2 py-1 bg-slate-900/50 rounded text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 text-xs transition-colors cursor-pointer border border-transparent hover:border-purple-500/30">
                                  {formatAddress(auction.txHash)}
                                </code>
                              </a>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {formatTimestamp(auction.timestamp)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-400">
                    Page {currentPage}
                    {auctionLoading && (
                      <span className="ml-2 text-cyan-400">(Loading...)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1 || auctionLoading}
                      className="bg-slate-800/50 border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={
                        auctionHistory.length < itemsPerPage || auctionLoading
                      }
                      className="bg-slate-800/50 border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
