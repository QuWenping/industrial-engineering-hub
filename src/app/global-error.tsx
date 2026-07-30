"use client";

import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="bg-light-bg min-h-[80vh] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-warning/10">
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
            <h1 className="text-2xl font-bold text-navy mb-3">Something went wrong</h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              An unexpected error occurred while loading this page. Please try refreshing or return to the homepage.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={reset}
                className="btn-primary-gradient text-white text-sm font-medium px-5 py-2.5 rounded-lg inline-flex items-center justify-center"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </button>
              <Link
                href="/"
                className="border border-border bg-background hover:bg-muted text-sm font-medium px-5 py-2.5 rounded-lg inline-flex items-center justify-center"
              >
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
