import type { Metadata } from "next";

interface SEOInput {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article" | "software-application" | "dataset" | "service";
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  keywords?: string[];
}

export const SITE_NAME = "Industrial Engineering Studio";
export const SITE_NAME_SHORT = "IE Studio";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://industrialengineeringstudio.com";

export { BASE_URL };

export function constructMetadata({
  title,
  description,
  path = "/",
  type = "website",
  image,
  publishedTime,
  modifiedTime,
  authors,
  keywords,
}: SEOInput): Metadata {
  const url = `${BASE_URL}${path}`;
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME}`;

  const ogType: "article" | "website" | "website" = type === "article" ? "article" : "website";

  const ogImages = image
    ? [{ url: image, width: 1200, height: 630, alt: title }]
    : undefined;

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
      siteName: SITE_NAME,
      type: ogType,
      publishedTime,
      modifiedTime,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: image ? [image] : undefined,
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
    // No aggregateRating: the calculators have no real user reviews, so a
    // fabricated rating would be schema spam (Google policy violation).
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
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.svg`,
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
      name: SITE_NAME,
    },
    license: "https://creativecommons.org/licenses/by/4.0/",
  };
}

export function schemaOrganization() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "EngineeringService"],
    name: SITE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/logo.svg`,
    description:
      "Industrial engineering services for factories, energy facilities, chemical plants and infrastructure projects — structural, MEP, process and digital engineering.",
    areaServed: "Global",
    serviceType: [
      "Industrial Building Design",
      "Structural Engineering",
      "HVAC & MEP Engineering",
      "Chemical Plant Engineering",
      "Energy Facility Engineering",
      "Digital Engineering & AI",
    ],
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@industrialengineeringstudio.com",
      contactType: "sales",
      availableLanguage: ["English"],
    },
  };
}

export function schemaEngineeringService(data: {
  name: string;
  description: string;
  url: string;
  serviceType?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: data.name,
    description: data.description,
    url: data.url,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: BASE_URL,
    },
    serviceType: data.serviceType,
    areaServed: "Global",
  };
}

export function schemaWebsiteSearch() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/tools?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
