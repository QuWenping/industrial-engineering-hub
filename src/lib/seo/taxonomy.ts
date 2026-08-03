// Engineering Taxonomy — defines topic clusters for the site.
// Each cluster has a pillar page (core calculator) + supporting pages.

export interface TopicCluster {
  id: string;
  name: string;
  pillarPage: string; // URL of the core page
  pillarCalculator: string; // calculator slug
  calculators: string[]; // related calculator slugs
  guides: string[]; // related guide slugs
  materials: string[]; // related material slugs
  keywords: string[]; // target SEO keywords
}

export const TAXONOMY: TopicCluster[] = [
  {
    id: "steel-engineering",
    name: "Steel Engineering",
    pillarPage: "/tools/steel-weight-calculator",
    pillarCalculator: "steel-weight-calculator",
    calculators: ["steel-weight-calculator", "steel-plate-weight-calculator", "stainless-steel-weight-calculator", "beam-deflection-calculator"],
    guides: ["steel-material-properties", "material-strength-basics", "bearing-selection-basics", "bolt-torque-calculation"],
    materials: ["carbon-steel", "stainless-steel-304", "stainless-steel-316"],
    keywords: ["steel weight calculator", "steel density", "steel beam", "steel plate weight", "stainless steel properties"],
  },
  {
    id: "pump-engineering",
    name: "Pump Engineering",
    pillarPage: "/tools/pump-power-calculator",
    pillarCalculator: "pump-power-calculator",
    calculators: ["pump-power-calculator", "pump-head-calculator", "pump-efficiency-calculator", "pump-flow-calculator", "pump-sizing-calculator", "pump-selection-calculator", "pump-affinity-law-calculator", "pump-energy-calculator"],
    guides: ["centrifugal-pump-fundamentals", "positive-displacement-pumps", "pump-installation-commissioning", "npsh-calculation-explained", "seal-selection-guide"],
    materials: [],
    keywords: ["pump power calculator", "pump head calculator", "pump efficiency", "NPSH calculation", "pump selection", "centrifugal pump"],
  },
  {
    id: "pipe-flow",
    name: "Pipe Flow Engineering",
    pillarPage: "/tools/pipe-flow-calculator",
    pillarCalculator: "pipe-flow-calculator",
    calculators: ["pipe-flow-calculator", "pipe-diameter-calculator", "pipe-velocity-calculator", "pipe-volume-calculator", "pipe-weight-calculator"],
    guides: ["pipe-sizing-fundamentals", "pressure-drop-pipes", "reynolds-number-guide", "flow-measurement-methods", "pipe-stress-analysis-basics", "pipe-support-spacing", "pipe-material-selection", "piping-inspection-testing"],
    materials: [],
    keywords: ["pipe flow calculator", "pipe diameter", "pressure drop", "reynolds number", "pipe sizing", "pipe velocity"],
  },
  {
    id: "hvac",
    name: "HVAC Engineering",
    pillarPage: "/tools/duct-sizing-calculator",
    pillarCalculator: "duct-sizing-calculator",
    calculators: ["duct-sizing-calculator"],
    guides: ["hvac-pump-sizing", "chiller-selection-guide", "cooling-tower-basics", "fan-curve-selection", "duct-sizing-basics", "condensate-recovery-systems", "steam-system-fundamentals", "steam-trap-selection", "insulation-selection-guide"],
    materials: [],
    keywords: ["hvac calculator", "duct sizing", "cooling tower", "chiller selection", "fan curve", "steam system"],
  },
  {
    id: "structural",
    name: "Structural Engineering",
    pillarPage: "/tools/beam-deflection-calculator",
    pillarCalculator: "beam-deflection-calculator",
    calculators: ["beam-deflection-calculator", "steel-weight-calculator", "steel-plate-weight-calculator"],
    guides: ["material-strength-basics", "steel-material-properties", "flange-installation-best-practices", "gasket-selection-guide", "flange-rating-standards", "welding-symbols-basics", "corrosion-prevention", "painting-coating-selection", "cathodic-protection-basics"],
    materials: ["carbon-steel", "stainless-steel-304", "stainless-steel-316", "aluminum", "copper", "cast-iron"],
    keywords: ["beam deflection", "structural engineering", "steel properties", "flange rating", "welding symbols", "corrosion prevention"],
  },
  {
    id: "chemical-process",
    name: "Chemical & Process Engineering",
    pillarPage: "/tools/pipe-flow-calculator",
    pillarCalculator: "pipe-flow-calculator",
    calculators: ["pipe-flow-calculator", "pipe-diameter-calculator", "pipe-velocity-calculator"],
    guides: ["control-valve-sizing-guide", "valve-types-applications", "safety-relief-valve-selection", "pressure-vessel-design", "process-plant-layout", "understanding-pid-diagrams", "compressed-air-system-design"],
    materials: [],
    keywords: ["chemical engineering", "valve sizing", "safety relief valve", "pressure vessel", "process plant layout", "P&ID diagrams"],
  },
  {
    id: "thermal-energy",
    name: "Thermal & Energy Engineering",
    pillarPage: "/tools/pipe-flow-calculator",
    pillarCalculator: "pipe-flow-calculator",
    calculators: ["pipe-flow-calculator"],
    guides: ["heat-exchanger-selection", "refractory-lining-basics", "engineering-unit-conversion", "compressible-flow-basics"],
    materials: ["water", "air"],
    keywords: ["heat exchanger", "thermal engineering", "refractory", "unit conversion", "compressible flow"],
  },
  {
    id: "mechanical",
    name: "Mechanical Engineering",
    pillarPage: "/tools/steel-weight-calculator",
    pillarCalculator: "steel-weight-calculator",
    calculators: ["steel-weight-calculator", "beam-deflection-calculator", "gear-motor-selection"],
    guides: ["gear-motor-selection", "bearing-selection-basics", "bolt-torque-calculation", "hydraulic-system-basics", "motor-efficiency-guide"],
    materials: [],
    keywords: ["mechanical engineering", "gear motor", "bearing selection", "bolt torque", "hydraulic system", "motor efficiency"],
  },
];

// Map a page URL to its cluster
export function getClusterForPage(url: string): TopicCluster | undefined {
  if (url.startsWith("/tools/")) {
    const slug = url.replace("/tools/", "");
    return TAXONOMY.find((c) => c.calculators.includes(slug) || c.pillarCalculator === slug);
  }
  if (url.startsWith("/guides/")) {
    const slug = url.replace("/guides/", "");
    return TAXONOMY.find((c) => c.guides.includes(slug));
  }
  if (url.startsWith("/materials/")) {
    const slug = url.replace("/materials/", "");
    return TAXONOMY.find((c) => c.materials.includes(slug));
  }
  return undefined;
}

// Get all pages in a cluster
export function getClusterPages(cluster: TopicCluster): { url: string; type: string; slug: string }[] {
  const pages: { url: string; type: string; slug: string }[] = [];
  for (const c of cluster.calculators) pages.push({ url: "/tools/" + c, type: "calculator", slug: c });
  for (const g of cluster.guides) pages.push({ url: "/guides/" + g, type: "guide", slug: g });
  for (const m of cluster.materials) pages.push({ url: "/materials/" + m, type: "material", slug: m });
  return pages;
}

// Get cluster by ID
export function getClusterById(id: string): TopicCluster | undefined {
  return TAXONOMY.find((c) => c.id === id);
}
