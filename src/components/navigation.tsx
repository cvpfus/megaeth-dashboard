import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        {/* Desktop Navigation - Left aligned links */}
        <div className="hidden sm:flex sm:items-center sm:justify-between">
          {/* Left side - Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className={`font-medium transition-colors ${
                location.pathname === "/"
                  ? "text-cyan-400"
                  : "text-gray-400 hover:text-cyan-300"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/cancellations"
              className={`font-medium transition-colors ${
                location.pathname === "/cancellations"
                  ? "text-cyan-400"
                  : "text-gray-400 hover:text-cyan-300"
              }`}
            >
              Cancellations
            </Link>
            <Link
              to="/allocation-checker"
              search={{ address: undefined }}
              className={`font-medium transition-colors ${
                location.pathname === "/allocation-checker"
                  ? "text-cyan-400"
                  : "text-gray-400 hover:text-cyan-300"
              }`}
            >
              Allocation Checker
            </Link>
          </div>

          {/* Right side - Created by */}
          <div className="text-sm text-gray-400">
            Created by{" "}
            <a
              href="https://x.com/cvpfus_id"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              @cvpfus_id
            </a>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="sm:hidden flex flex-col gap-4">
          {/* Header section with burger menu for mobile */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">MegaETH Dashboard</h1>

            {/* Burger menu button for mobile */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          {isMobileMenuOpen && (
            <div className="pb-4 border-t border-slate-700/50 pt-4">
              <div className="flex flex-col gap-3">
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className={`font-medium transition-colors px-3 py-2 rounded-md ${
                    location.pathname === "/"
                      ? "text-cyan-400 bg-slate-800"
                      : "text-gray-400 hover:text-cyan-300 hover:bg-slate-800"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/cancellations"
                  onClick={closeMobileMenu}
                  className={`font-medium transition-colors px-3 py-2 rounded-md ${
                    location.pathname === "/cancellations"
                      ? "text-cyan-400 bg-slate-800"
                      : "text-gray-400 hover:text-cyan-300 hover:bg-slate-800"
                  }`}
                >
                  Cancellations
                </Link>
                <Link
                  to="/allocation-checker"
                  search={{ address: undefined }}
                  onClick={closeMobileMenu}
                  className={`font-medium transition-colors px-3 py-2 rounded-md ${
                    location.pathname === "/allocation-checker"
                      ? "text-cyan-400 bg-slate-800"
                      : "text-gray-400 hover:text-cyan-300 hover:bg-slate-800"
                  }`}
                >
                  Allocation Checker
                </Link>

                {/* Mobile Created by section */}
                <div className="text-sm text-gray-400 px-3 py-2 border-t border-slate-700/50 mt-3 pt-3">
                  Created by{" "}
                  <a
                    href="https://x.com/cvpfus_id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    @cvpfus_id
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
