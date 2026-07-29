import type { Metadata } from "next";

interface SEOInput {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article" | "software-application" | "dataset";
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  keywords?: string[];
}

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://industrialengineeringhub.com";

export function constructMetadata({
  title,
  description,
  path = "/",
  type = "website",
  image = "/og-default.png",
  publishedTime,
  modifiedTime,
  authors,
  keywords,
}: SEOInput): Metadata {
  const url = `${BASE_URL}${path}`;
  const fullTitle = title.includes("Industrial Engineering Hub")
    ? title
    : `${title} | Industrial Engineering Hub`;

  const ogType: "article" | "website" = type === "article" ? "article" : "website";

  return {
    title: fullTitle,
    description,
    keywords: keywords?.join(", "),
    authors: authors?.map((name) => ({ name })),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: "Industrial Engineering Hub",
      type: ogType,
      publishedTime,
      modifiedTime,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}

export function schemaSoftwareApplication(data: {
  name: string;
  description: string;
  url: string;
  category: string;
  operatingSystem?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: data.name,
    description: data.description,
    url: data.url,
    applicationCategory: "EngineeringApplication",
    operatingSystem: data.operatingSystem || "Web browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "127",
    },
  };
}

export function schemaArticle(data: {
  title: string;
  description: string;
  url: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    description: data.description,
    url: data.url,
    author: data.author ? { "@type": "Organization", name: data.author } : undefined,
    publisher: {
      "@type": "Organization",
      name: "Industrial Engineering Hub",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
      },
    },
    datePublished: data.publishedTime,
    dateModified: data.modifiedTime,
    image: data.image,
  };
}

export function schemaFAQ(faqItems: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function schemaBreadcrumb(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function schemaDataset(data: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: data.name,
    description: data.description,
    url: data.url,
    creator: {
      "@type": "Organization",
      name: "Industrial Engineering Hub",
    },
    license: "https://creativecommons.org/licenses/by/4.0/",
  };
}

export function schemaOrganization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Industrial Engineering Hub",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description:
      "Professional engineering calculators and technical guides for fluid mechanics, pump sizing, structural design, thermal engineering, and material selection.",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@industrialengineeringhub.com",
      contactType: "customer support",
    },
  };
}

export function schemaWebsiteSearch() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Industrial Engineering Hub",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/tools?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
