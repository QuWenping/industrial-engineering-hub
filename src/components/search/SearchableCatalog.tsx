"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Fuse from "fuse.js";
import { Search, Calculator } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface SearchItem {
  title: string;
  description: string;
  href: string;
  category: string;
  tags?: string[];
  type: "calculator" | "guide" | "material";
}

interface SearchableCatalogProps {
  items: SearchItem[];
}

export function SearchableCatalog({ items }: SearchableCatalogProps) {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("search") || "";
  const [query, setQuery] = useState(urlQuery);
  const [activeType, setActiveType] = useState<string>("all");

  // Effective query: user input overrides URL param initial value
  const effectiveQuery = query || urlQuery;

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: [
          { name: "title", weight: 2 },
          { name: "description", weight: 1.2 },
          { name: "tags", weight: 0.8 },
          { name: "category", weight: 0.5 },
        ],
        threshold: 0.35,
        distance: 200,
        minMatchCharLength: 2,
        includeScore: true,
      }),
    [items]
  );

  const results = useMemo(() => {
    let filtered = items;
    if (activeType !== "all") {
      filtered = items.filter((item) => item.type === activeType);
    }
    if (!effectiveQuery.trim()) return filtered;
    return fuse.search(effectiveQuery).map((r) => r.item);
  }, [effectiveQuery, fuse, items, activeType]);

  const typeCounts = useMemo(() => {
    const counts = { all: items.length, calculator: 0, guide: 0, material: 0 };
    for (const item of items) {
      counts[item.type]++;
    }
    return counts;
  }, [items]);

  const typeLabels: Record<string, string> = {
    all: "All",
    calculator: "Calculators",
    guide: "Guides",
    material: "Materials",
  };

  return (
    <div>
      {/* Search bar */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            defaultValue={urlQuery}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search calculators, guides, materials..."
            className="pl-10 h-12 text-base rounded-xl border-border/60"
          />
        </div>
      </div>

      {/* Type filter tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {(["all", "calculator", "guide", "material"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeType === type
                ? "bg-engineering-blue text-white"
                : "bg-white border border-border/60 text-muted-foreground hover:border-engineering-blue/30 hover:text-navy"
            }`}
          >
            {typeLabels[type]} ({typeCounts[type]})
          </button>
        ))}
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          No results found for &ldquo;{query}&rdquo;. Try a different search term.
        </div>
      ) : (
        <>
          {query && (
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Showing {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((item) => (
              <Link key={item.href} href={item.href} className="block h-full">
                <Card className="h-full card-hover border-border/60 cursor-pointer group">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-engineering-blue/5 group-hover:bg-engineering-blue/10 transition-colors">
                        <Calculator className="h-4 w-4 text-engineering-blue" />
                      </div>
                      <div className="flex gap-1.5">
                        <Badge variant="secondary" className="text-xs font-normal capitalize">
                          {item.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs font-normal">
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                    <h3 className="font-semibold text-navy group-hover:text-engineering-blue transition-colors text-sm leading-snug mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
