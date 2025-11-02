import { Link, useLocation } from "@tanstack/react-router";

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="bg-slate-900 border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
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
              to="/allocation-checker"
              className={`font-medium transition-colors ${
                location.pathname === "/allocation-checker"
                  ? "text-cyan-400"
                  : "text-gray-400 hover:text-cyan-300"
              }`}
            >
              Allocation Checker
            </Link>
          </div>
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
      </div>
    </nav>
  );
}
