import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-light-bg min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-gradient mb-4">404</div>
        <h1 className="text-2xl font-bold text-navy mb-3">Page Not Found</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
          Try returning home or browsing our engineering calculators.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="btn-primary-gradient text-white text-sm font-medium px-5 py-2.5 rounded-lg inline-flex items-center justify-center"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <Link
            href="/tools"
            className="border border-border bg-background hover:bg-muted text-sm font-medium px-5 py-2.5 rounded-lg inline-flex items-center justify-center"
          >
            <Search className="mr-2 h-4 w-4" />
            Browse Calculators
          </Link>
        </div>
      </div>
    </div>
  );
}
