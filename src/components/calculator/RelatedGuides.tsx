import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ChevronRight } from "lucide-react";

interface RelatedGuideProps {
  title: string;
  description: string;
  href: string;
  keywords?: string[];
}

export function RelatedGuides({ guides }: { guides: RelatedGuideProps[] }) {
  if (!guides || guides.length === 0) return null;

  return (
    <section className="mt-12 border-t pt-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="h-5 w-5 text-engineering-blue" />
          <h2 className="text-xl font-bold text-navy">Deepen Your Knowledge</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Explore related engineering guides to expand your understanding of this calculation and its applications.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {guides.slice(0, 4).map((guide) => (
          <Link key={guide.href} href={guide.href}>
            <Card className="h-full card-hover border-border/60 hover:border-engineering-blue/30 cursor-pointer group transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-engineering-blue/10 group-hover:bg-engineering-blue/20 transition-colors flex-shrink-0 mt-0.5">
                    <ChevronRight className="h-4 w-4 text-engineering-blue" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-navy group-hover:text-engineering-blue transition-colors text-sm leading-snug mb-1">
                      {guide.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {guide.description}
                    </p>
                    {guide.keywords && guide.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {guide.keywords.slice(0, 2).map((keyword) => (
                          <Badge key={keyword} variant="secondary" className="text-xs py-0">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Link href="/guides" className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-engineering-blue hover:text-engineering-blue/80 transition-colors">
        Browse all guides <ChevronRight className="h-4 w-4" />
      </Link>
    </section>
  );
}
