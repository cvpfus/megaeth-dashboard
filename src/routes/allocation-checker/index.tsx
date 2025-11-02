import { createFileRoute, Link } from "@tanstack/react-router";
import { useUserAuctionHistory } from "@/hooks/useAuctionHistory";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  RotateCcw,
  CheckCircle,
  Search,
  ArrowLeft,
} from "lucide-react";

export const Route = createFileRoute("/allocation-checker/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [address, setAddress] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const { data, loading, error } = useUserAuctionHistory(searchAddress);

  const auctionHistory = data?.AuctionHistory || [];

  // Calculate user stats
  const totalBids = auctionHistory.length;
  const totalBidAmount = auctionHistory.reduce(
    (sum, auction) => sum + (Number(auction.amount) || 0),
    0
  );

  // Separate by status
  const acceptedBids = auctionHistory.filter(
    (auction) => auction.status === "Allocated"
  );
  const refundedBids = auctionHistory.filter(
    (auction) =>
      auction.status === "CancelledAndRefunded" ||
      auction.status === "PartiallyRefunded" ||
      auction.status === "Refunded"
  );

  const totalAcceptedAmount = acceptedBids.reduce(
    (sum, auction) => sum + (Number(auction.amount) || 0),
    0
  );
  const totalRefundedAmount = refundedBids.reduce(
    (sum, auction) => sum + (Number(auction.amount) || 0),
    0
  );

  const handleSearch = () => {
    if (address.trim()) {
      setSearchAddress(address.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const formatNumber = (num: number) => {
    if (num === undefined || num === null) return "0";
    return new Intl.NumberFormat("en-US").format(num);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-900 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-400 hover:text-cyan-300 font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/allocation-checker"
              className="text-cyan-400 font-medium transition-colors"
            >
              Allocation Checker
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="relative py-12 px-6 border-b border-slate-700/50">
        <div className="absolute inset-0 bg-linear-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <ArrowLeft
              className="w-8 h-8 text-cyan-400 cursor-pointer"
              onClick={() => window.history.back()}
            />
            <h1 className="text-4xl md:text-5xl font-black text-white">
              <span className="text-gray-300">Allocation </span>
              <span className="bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Checker
              </span>
            </h1>
          </div>
          <p className="text-lg text-gray-400 ml-12">
            Check your allocation status and transaction history
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 px-6 max-w-7xl mx-auto">
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Enter Your Address</CardTitle>
            <CardDescription className="text-gray-400">
              Enter your wallet address to check your allocation status and
              transaction history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="0x..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-4 bg-slate-900 border-slate-600 text-gray-300 placeholder:text-gray-500 focus:border-cyan-500"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={!address.trim() || loading}
                className="bg-cyan-500 hover:bg-cyan-600 text-white border-none"
              >
                <Search className="w-4 h-4 mr-2" />
                Check
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Stats Section */}
      {searchAddress && (
        <section className="py-8 px-6 max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-8 text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
              Loading allocation data...
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-400">
              Error loading data: {error.message}
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Bids Card */}
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-cyan-500/50 transition-all duration-300">
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
                          Your bid count
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-3xl font-bold text-cyan-400">
                          {formatNumber(totalBids)}
                        </p>
                        <p className="text-sm text-gray-500">Number of bids</p>
                      </div>
                      <div className="pt-3 border-t border-slate-700">
                        <p className="text-2xl font-semibold text-white">
                          {formatNumber(totalBidAmount)} USDT
                        </p>
                        <p className="text-sm text-gray-500">
                          Total bid amount
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Accepted Amount Card */}
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-green-500/50 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-xl">
                          Accepted Amount
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          Successfully allocated
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-3xl font-bold text-green-400">
                          {formatNumber(acceptedBids.length)}
                        </p>
                        <p className="text-sm text-gray-500">Accepted bids</p>
                      </div>
                      <div className="pt-3 border-t border-slate-700">
                        <p className="text-2xl font-semibold text-white">
                          {formatNumber(totalAcceptedAmount)} USDT
                        </p>
                        <p className="text-sm text-gray-500">
                          Allocated amount
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Refunds Card */}
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-purple-500/50 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <RotateCcw className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-xl">
                          Refunds
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          Refunded amounts
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-3xl font-bold text-purple-400">
                          {formatNumber(refundedBids.length)}
                        </p>
                        <p className="text-sm text-gray-500">Refunded bids</p>
                      </div>
                      <div className="pt-3 border-t border-slate-700">
                        <p className="text-2xl font-semibold text-white">
                          {formatNumber(totalRefundedAmount)} USDT
                        </p>
                        <p className="text-sm text-gray-500">Refunded amount</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Transaction History */}
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    Transaction History
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Your complete transaction history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {auctionHistory.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      No transactions found for this address
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {auctionHistory.map((auction: any) => (
                        <div
                          key={auction.id}
                          className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700"
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-sm">
                              <div className="text-gray-400">Amount</div>
                              <div className="text-white font-semibold">
                                {formatNumber(auction.amount)} USDT
                              </div>
                            </div>
                            <div className="text-sm">
                              <div className="text-gray-400">Status</div>
                              <Badge
                                variant={
                                  auction.status === "Allocated"
                                    ? "default"
                                    : auction.status ===
                                          "CancelledAndRefunded" ||
                                        auction.status ===
                                          "PartiallyRefunded" ||
                                        auction.status === "Refunded"
                                      ? "secondary"
                                      : "outline"
                                }
                                className={
                                  auction.status === "Allocated"
                                    ? "bg-green-500/20 text-green-400 border-green-500/50"
                                    : auction.status ===
                                          "CancelledAndRefunded" ||
                                        auction.status ===
                                          "PartiallyRefunded" ||
                                        auction.status === "Refunded"
                                      ? "bg-purple-500/20 text-purple-400 border-purple-500/50"
                                      : "bg-blue-500/20 text-blue-400 border-blue-500/50"
                                }
                              >
                                {auction.status === "CancelledAndRefunded"
                                  ? "Cancelled & Refunded"
                                  : auction.status === "PartiallyRefunded"
                                    ? "Partially Refunded"
                                    : auction.status
                                        .replace(/([A-Z])/g, " $1")
                                        .trim()}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right text-sm">
                            <div className="text-gray-400">Transaction</div>
                            {auction.txHash ? (
                              <a
                                href={`https://etherscan.io/tx/${auction.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-400 hover:text-cyan-300 transition-colors"
                              >
                                {auction.txHash.slice(0, 10)}...
                                {auction.txHash.slice(-8)}
                              </a>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </section>
      )}
    </div>
  );
}
