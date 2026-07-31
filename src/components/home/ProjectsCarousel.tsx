"use client";

import Link from "next/link";

// Featured project cases for the homepage carousel. Static list mirrors
// content/projects/*.mdx; update here if the case set changes.
const PROJECTS = [
  { slug: "bac-dalian-new-factory", title: "BAC Dalian New Factory & Asia-Pacific Lab", category: "Industrial Building", clientType: "Sino-US JV", location: "Dalian", cover: "/projects/bac-dalian-new-factory.jpg" },
  { slug: "dalian-hydrogen-testing-center", title: "Dalian Hydrogen Energy Testing Center", category: "Industrial / Energy", clientType: "Inspection institute", location: "Dalian FTZ", cover: "/projects/dalian-hydrogen-testing-center.jpg" },
  { slug: "seychelles-hotel-marina-office", title: "Seychelles Hotel, Marina & Office", category: "Public Building", clientType: "Overseas project", location: "Seychelles", cover: "/projects/seychelles-hotel-marina-office.jpg" },
  { slug: "korean-stx-shipyard", title: "Korean-Owned STX Shipyard", category: "Steel Structure", clientType: "Korean-owned", location: "Changxing Island", cover: "/projects/korean-stx-shipyard.jpg" },
  { slug: "mueller-weingarten-dalian-forging", title: "Müller Weingarten Forging Plant", category: "Steel Structure", clientType: "German-owned", location: "Dalian", cover: "/projects/mueller-weingarten-dalian-forging.jpg" },
  { slug: "satake-machinery-rd-manufacturing", title: "Satake Machinery R&D & Manufacturing", category: "Industrial Building", clientType: "Japanese-owned", location: "Dalian Lüshun", cover: "/projects/satake-machinery-rd-manufacturing.jpg" },
  { slug: "cosco-shipping-dalian-logistics", title: "COSCO Shipping Dalian Logistics", category: "Industrial Building", clientType: "State-owned", location: "Dalian Bay", cover: "/projects/cosco-shipping-dalian-logistics.jpg" },
  { slug: "dalian-songmu-island-chemical-zone", title: "Songmu Island Chemical Zone", category: "Chemical", clientType: "Industrial park", location: "Dalian", cover: "/projects/dalian-songmu-island-chemical-zone.jpg" },
  { slug: "dalian-bear-cave-street", title: "Dalian Bear Cave Street", category: "Cultural Tourism", clientType: "Urban renewal", location: "Dalian", cover: "/projects/dalian-bear-cave-street.jpg" },
  { slug: "dalian-station-north-parking", title: "Dalian Station North Parking", category: "Steel Structure", clientType: "Municipal", location: "Dalian", cover: "/projects/dalian-station-north-parking.jpg" },
  { slug: "henan-university-longzihu-campus", title: "Henan University Longzihu Campus", category: "Public Building", clientType: "University", location: "Zhengzhou", cover: "/projects/henan-university-longzihu-campus.jpg" },
  { slug: "beijing-tianjiayuan-plant-factory", title: "Beijing Tianjiayuan Plant Factory", category: "Public Building", clientType: "Agri-tech", location: "Beijing", cover: "/projects/beijing-tianjiayuan-plant-factory.jpg" },
];

export function ProjectsCarousel() {
  const items = [...PROJECTS, ...PROJECTS]; // duplicate for seamless loop
  return (
    <div className="ieh-marquee-pause relative overflow-hidden">
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-light-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-light-bg to-transparent" />
      <div className="ieh-marquee-track flex w-max gap-5 py-2">
        {items.map((p, i) => (
          <Link
            key={p.slug + "-" + i}
            href={`/projects/${p.slug}`}
            className="group/card shrink-0 w-[280px] sm:w-[300px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.cover}
                alt={p.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
              />
              <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-engineering-blue">
                {p.clientType}
              </span>
            </div>
            <div className="p-3">
              <div className="text-[11px] text-slate-400 mb-1">{p.category} · {p.location}</div>
              <h3 className="text-sm font-semibold text-navy leading-snug line-clamp-2 group-hover/card:text-engineering-blue transition-colors">
                {p.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
