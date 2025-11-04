import { createFileRoute } from "@tanstack/react-router";
import { useSaleStats } from "@/hooks/useSaleStats";
import { useRecentCancellations } from "@/hooks/useAuctionHistory";
import { Navigation } from "@/components/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { XCircle, TrendingUp, Percent, Clock } from "lucide-react";
import { useMemo } from "react";

export function CancellationsPage() {
  const {
    data: saleData,
    loading: saleLoading,
    error: saleError,
  } = useSaleStats();

  const {
    data: recentCancellationsData,
    loading: recentCancellationsLoading,
    error: recentCancellationsError,
  } = useRecentCancellations(1);

  const stats = saleData?.SaleStats?.[0];
  const recentCancellations = recentCancellationsData?.AuctionHistory || [];

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

  const formatTimestamp = (timestamp: string | number) => {
    if (!timestamp) return "-";
    try {
      let date: Date;
      if (typeof timestamp === "number") {
        date =
          timestamp < 10000000000
            ? new Date(timestamp * 1000)
            : new Date(timestamp);
      } else {
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

      if (isNaN(date.getTime())) return "-";

      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      const rtf = new Intl.RelativeTimeFormat("en", {
        numeric: "auto",
        style: "long",
      });
      const minute = 60,
        hour = minute * 60,
        day = hour * 24,
        week = day * 7;

      if (Math.abs(diffInSeconds) < minute)
        return rtf.format(-Math.floor(diffInSeconds), "second");
      if (Math.abs(diffInSeconds) < hour)
        return rtf.format(-Math.floor(diffInSeconds / minute), "minute");
      if (Math.abs(diffInSeconds) < day)
        return rtf.format(-Math.floor(diffInSeconds / hour), "hour");
      if (Math.abs(diffInSeconds) < week)
        return rtf.format(-Math.floor(diffInSeconds / day), "day");

      return date.toLocaleDateString();
    } catch (error) {
      console.error("Error formatting timestamp:", timestamp, error);
      return "-";
    }
  };

  // Calculate cancellation percentage
  const cancellationPercentage = useMemo(() => {
    if (!stats?.totalBids || !stats?.totalCancellations) return 0;
    return (Number(stats.totalCancellations) / Number(stats.totalBids)) * 100;
  }, [stats]);

  if (saleError) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900">
        <Navigation />
        <div className="text-red-400 text-xl p-6">
          Error loading data: {saleError.message}
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
        <div className="absolute inset-0 bg-linear-to-r from-red-500/5 via-orange-500/5 to-yellow-500/5"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <XCircle className="w-8 h-8 text-red-400" />
            <h1 className="text-4xl md:text-5xl font-black text-white">
              <span className="bg-linear-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Cancellations
              </span>
            </h1>
          </div>
          <p className="text-lg text-gray-400 ml-12">
            Bid cancellation insights and live statistics
          </p>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-8 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Cancellations Card */}
          <Card
            className={`bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-red-500/50 transition-colors duration-300 ${saleLoading ? "shadow-lg shadow-red-500/50 border-red-500" : ""}`}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl">
                    Total Cancellations
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    All cancelled bids
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

          {/* Cancellation Rate Card */}
          <Card
            className={`bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-orange-500/50 transition-colors duration-300 ${saleLoading ? "shadow-lg shadow-orange-500/50 border-orange-500" : ""}`}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Percent className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl">
                    Cancellation Rate
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Percentage of cancelled bids
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-3xl font-bold text-orange-400">
                    {cancellationPercentage.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-500">
                    of {formatNumber(stats?.totalBids)} total bids
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-700">
                  <p className="text-lg text-gray-400">
                    {formatNumber(stats?.totalCancellations)} out of{" "}
                    {formatNumber(stats?.totalBids)}
                  </p>
                  <p className="text-sm text-gray-500">Cancelled bids</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Bids Card */}
          <Card
            className={`bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-cyan-500/50 transition-colors duration-300 ${saleLoading ? "shadow-lg shadow-cyan-500/50 border-cyan-500" : ""}`}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl">
                    Active Bids
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Non-cancelled bids
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-3xl font-bold text-cyan-400">
                    {formatNumber(
                      Number(stats?.totalBids || 0) -
                        Number(stats?.totalCancellations || 0)
                    )}
                  </p>
                  <p className="text-sm text-gray-500">Non-cancelled bids</p>
                </div>
                <div className="pt-3 border-t border-slate-700">
                  <p className="text-2xl font-semibold text-white">
                    {(100 - cancellationPercentage).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-500">Active rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Cancellations Card */}
          <Card
            className={`bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-purple-500/50 transition-colors duration-300 ${recentCancellationsLoading ? "shadow-lg shadow-purple-500/50 border-purple-500" : ""}`}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl">
                    Recent Cancellation
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Latest cancelled bid
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentCancellationsError ? (
                  <div className="text-red-400 text-sm">
                    Error loading recent cancellations
                  </div>
                ) : recentCancellations.length === 0 ? (
                  <div className="text-gray-400 text-sm">
                    No recent cancellations
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="text-2xl font-bold text-purple-400 flex items-center gap-2">
                        <img
                          src="https://tether.to/images/logoCircle.svg"
                          alt="USDT"
                          className="w-5 h-5"
                        />
                        {formatNumber(recentCancellations[0].amount)} USDT
                      </p>
                      <p className="text-sm text-gray-500">Recent amount</p>
                    </div>
                    <div className="pt-3 border-t border-slate-700">
                      <p className="text-lg text-gray-400 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {formatTimestamp(recentCancellations[0].timestamp)}
                      </p>
                      <p className="text-sm text-gray-500">When it happened</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

export const Route = createFileRoute("/cancellations/")({
  component: CancellationsPage,
  ssr: "data-only",
});
