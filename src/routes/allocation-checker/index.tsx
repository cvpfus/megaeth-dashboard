import { createFileRoute } from "@tanstack/react-router";
import { useUserAuctionHistory } from "@/hooks/useAuctionHistory";
import { useAllocation } from "@/hooks/useAllocation";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Navigation } from "@/components/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TrendingUp, CheckCircle, Search, ArrowLeft } from "lucide-react";

// EVM address validation pattern (0x followed by 40 hexadecimal characters)
const EVM_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

// EVM address validation function
const isValidEvmAddress = (address: string): boolean => {
  return EVM_ADDRESS_REGEX.test(address);
};

export const Route = createFileRoute("/allocation-checker/")({
  component: RouteComponent,
  ssr: "data-only",
  validateSearch: (search) => {
    // Handle empty search object or invalid address
    if (
      !search ||
      typeof search.address !== "string" ||
      search.address.trim() === ""
    ) {
      return { address: undefined };
    }

    // Validate EVM address format
    const trimmedAddress = search.address.trim();
    if (!isValidEvmAddress(trimmedAddress)) {
      return { address: undefined };
    }

    // Only return address if it's a valid EVM address
    return {
      address: trimmedAddress,
    };
  },
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const searchParams = Route.useSearch();

  const [address, setAddress] = useState(searchParams.address || "");
  const [addressError, setAddressError] = useState("");
  const [copied, setCopied] = useState(false);
  const searchAddress = searchParams.address || "";
  const { data, loading, error } = useUserAuctionHistory(searchAddress);

  const auctionHistory = data?.AuctionHistory || [];

  // Get entityID from the most recent bid that has an entityID, then take first 34 chars
  const rawEntityId = auctionHistory.find(
    (auction) => auction.entityID
  )?.entityID;
  const entityId = rawEntityId ? rawEntityId.slice(0, 34) : undefined;

  const {
    data: allocationData,
    isLoading: allocationLoading,
    error: allocationError,
  } = useAllocation(entityId);

  const validateAddressInput = (inputAddress: string): string => {
    if (!inputAddress.trim()) {
      return "";
    }

    if (!inputAddress.startsWith("0x")) {
      return "Address must start with '0x'";
    }

    if (inputAddress.length !== 42) {
      return "Address must be 42 characters long (0x + 40 hex chars)";
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(inputAddress)) {
      return "Address must contain only valid hexadecimal characters";
    }

    return "";
  };

  const handleSearch = () => {
    const trimmedAddress = address.trim();

    // Validate address format
    const validationError = validateAddressInput(trimmedAddress);
    if (validationError) {
      setAddressError(validationError);
      return;
    }

    // Clear any previous errors
    setAddressError("");

    // Update URL with the address parameter using navigate
    navigate({
      to: "/allocation-checker",
      search: { address: trimmedAddress },
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setAddress(newAddress);

    // Clear error when user starts typing
    if (addressError) {
      setAddressError("");
    }
  };

  const formatNumber = (num: number) => {
    if (num === undefined || num === null) return "0";
    return new Intl.NumberFormat("en-US").format(num);
  };

  const copyToClipboard = async () => {
    const tipAddress = "0xd421ba69d5Cc6f89D95c528217Def05ed440657E";
    try {
      await navigator.clipboard.writeText(tipAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = tipAddress;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <Navigation />

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
                  placeholder="0x1234... (EVM address)"
                  value={address}
                  onChange={handleAddressChange}
                  onKeyDown={handleKeyPress}
                  className={`pl-4 bg-slate-900 border-slate-600 text-gray-300 placeholder:text-gray-500 focus:border-cyan-500 ${
                    addressError ? "border-red-500 focus:border-red-400" : ""
                  }`}
                />
                {addressError && (
                  <p className="text-red-400 text-xs mt-1">{addressError}</p>
                )}
              </div>
              <Button
                onClick={handleSearch}
                disabled={!isValidEvmAddress(address.trim()) || loading}
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
          {loading || allocationLoading ? (
            <div className="text-center py-8 text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
              Loading allocation data...
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-400">
              Error loading auction history: {error.message}
            </div>
          ) : (
            <>
              {/* Allocation Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Token Allocation Card */}
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-cyan-500/50 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-cyan-500/10 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-xl">
                          Token Allocation
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          Your allocated tokens
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {allocationError ? (
                        <div>
                          <p className="text-lg font-medium text-red-400">
                            Error loading allocation
                          </p>
                          <p className="text-sm text-gray-500">
                            You might not get an allocation
                          </p>
                        </div>
                      ) : allocationData ? (
                        <div>
                          <p className="text-3xl font-bold text-cyan-400">
                            {formatNumber(
                              Number(allocationData.token_allocation)
                            )}{" "}
                            MEGA
                          </p>
                          <p className="text-sm text-gray-500">
                            Token allocation
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-3xl font-bold text-gray-500">
                            No allocation
                          </p>
                          <p className="text-sm text-gray-500">
                            No allocation data found
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* USDT Allocation Card */}
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-green-500/50 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-xl">
                          USDT Allocation
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          Your USDT allocation
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {allocationError ? (
                        <div>
                          <p className="text-lg font-medium text-red-400">
                            Error loading allocation
                          </p>
                          <p className="text-sm text-gray-500">
                            You might not get an allocation
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-3xl font-bold text-green-400">
                            {allocationData
                              ? formatNumber(
                                  Number(allocationData.usdt_allocation)
                                )
                              : "0"}{" "}
                            USDT
                          </p>
                          <p className="text-sm text-gray-500">
                            USDT allocation amount
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tip Alert */}
              <Alert className="mt-8 bg-cyan-500/10 border-cyan-500/20">
                <AlertTitle className="text-cyan-400">Hey!</AlertTitle>
                <AlertDescription className="text-gray-300">
                  Got an allocation? Spare a tip for the unlucky ones, I got
                  none haha
                  <br />
                  <button
                    onClick={copyToClipboard}
                    className="bg-slate-800 px-2 py-1 rounded text-sm text-cyan-400 mt-2 flex items-center gap-2 hover:bg-slate-700 transition-colors cursor-pointer group"
                  >
                    <span>0xd421ba69d5Cc6f89D95c528217Def05ed440657E</span>
                    {copied ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                  {copied && (
                    <p className="text-xs text-green-400 mt-1">
                      Copied to clipboard!
                    </p>
                  )}
                </AlertDescription>
              </Alert>
            </>
          )}
        </section>
      )}
    </div>
  );
}
