/**
 * SEO relationships between calculators and guides
 * Used for internal linking and related content recommendations
 * 
 * All links are:
 * - Natural and contextually relevant
 * - Not excessive (max 4 guides per calculator)
 * - AdSense-compliant (no clickbait or artificial inflation)
 */

export interface GuideLinkConfig {
  title: string;
  description: string;
  href: string;
  keywords: string[];
}

export const CALCULATOR_GUIDE_RELATIONSHIPS: Record<string, GuideLinkConfig[]> = {
  'pump-power-calculator': [
    {
      title: 'Pump Selection Guide for Industrial Systems',
      description: 'Step-by-step pump selection covering centrifugal vs positive displacement, BEP, NPSH margin, and sizing procedures.',
      href: '/guides/pump-selection-guide',
      keywords: ['pump selection', 'centrifugal pump'],
    },
    {
      title: 'Centrifugal Pump Fundamentals',
      description: 'Learn the theory and operation of centrifugal pumps, including performance curves and efficiency characteristics.',
      href: '/guides/centrifugal-pump-fundamentals',
      keywords: ['pump basics', 'performance curves'],
    },
    {
      title: 'Motor Efficiency Guide',
      description: 'Motor selection and efficiency optimization to minimize energy consumption in pump systems.',
      href: '/guides/motor-efficiency-guide',
      keywords: ['motor sizing', 'efficiency'],
    },
  ],
  'pump-head-calculator': [
    {
      title: 'Pump Selection Guide for Industrial Systems',
      description: 'Understand total dynamic head and how to size pumps based on system requirements.',
      href: '/guides/pump-selection-guide',
      keywords: ['pump head', 'system curve'],
    },
    {
      title: 'Centrifugal Pump Fundamentals',
      description: 'Learn how centrifugal pumps work and how head relates to pump performance.',
      href: '/guides/centrifugal-pump-fundamentals',
      keywords: ['pump operation', 'head curves'],
    },
  ],
  'pipe-flow-calculator': [
    {
      title: 'Pipe Sizing Fundamentals',
      description: 'Select proper pipe sizes based on flow rate, fluid velocity, and pressure drop constraints.',
      href: '/guides/pipe-sizing-fundamentals',
      keywords: ['pipe sizing', 'velocity'],
    },
    {
      title: 'Reynolds Number Guide',
      description: 'Understand laminar and turbulent flow regimes in pipe flow using the Reynolds number.',
      href: '/guides/reynolds-number-guide',
      keywords: ['reynolds number', 'flow regime'],
    },
    {
      title: 'Pressure Drop in Pipes',
      description: 'Calculate pressure losses in piping systems and estimate pump power requirements.',
      href: '/guides/pressure-drop-pipes',
      keywords: ['friction loss', 'pressure drop'],
    },
  ],
  'pressure-drop-calculator': [
    {
      title: 'Pressure Drop in Pipes',
      description: 'Comprehensive guide to Darcy-Weisbach equation and friction factor estimation.',
      href: '/guides/pressure-drop-pipes',
      keywords: ['pressure drop', 'friction factor'],
    },
    {
      title: 'Pipe Sizing Fundamentals',
      description: 'Design piping systems considering both flow rate and acceptable pressure drop.',
      href: '/guides/pipe-sizing-fundamentals',
      keywords: ['pipe sizing', 'design'],
    },
  ],
  'steel-weight-calculator': [
    {
      title: 'Steel Material Properties',
      description: 'Understanding steel grades, densities, and selection criteria for structural applications.',
      href: '/guides/steel-material-properties',
      keywords: ['steel properties', 'material selection'],
    },
    {
      title: 'Material Strength Basics',
      description: 'Learn yield strength, tensile strength, and other key material properties.',
      href: '/guides/material-strength-basics',
      keywords: ['material strength', 'engineering properties'],
    },
  ],
  'heat-exchanger-calculator': [
    {
      title: 'Heat Exchanger Selection',
      description: 'Select the right heat exchanger type and size for your thermal application.',
      href: '/guides/heat-exchanger-selection',
      keywords: ['heat exchanger', 'thermal design'],
    },
    {
      title: 'Chiller Selection Guide',
      description: 'Size and select chillers based on cooling duty and operating conditions.',
      href: '/guides/chiller-selection-guide',
      keywords: ['chiller', 'cooling'],
    },
  ],
  'tank-volume-calculator': [
    {
      title: 'Tank Design Basics',
      description: 'Design and size storage tanks for various industrial applications.',
      href: '/guides/tank-design-basics',
      keywords: ['tank design', 'storage'],
    },
    {
      title: 'Pressure Vessel Design',
      description: 'Understand pressure vessel design codes and requirements for safe operation.',
      href: '/guides/pressure-vessel-design',
      keywords: ['pressure vessels', 'design codes'],
    },
  ],
  'reynolds-number-calculator': [
    {
      title: 'Reynolds Number Guide',
      description: 'Master the Reynolds number and determine flow regime in pipelines.',
      href: '/guides/reynolds-number-guide',
      keywords: ['reynolds number', 'flow regimes'],
    },
    {
      title: 'Pipe Sizing Fundamentals',
      description: 'Flow regime affects pipe sizing and pressure drop calculations.',
      href: '/guides/pipe-sizing-fundamentals',
      keywords: ['pipe sizing', 'laminar vs turbulent'],
    },
  ],
  'beam-deflection-calculator': [
    {
      title: 'Material Strength Basics',
      description: 'Understand modulus of elasticity and its role in deflection calculations.',
      href: '/guides/material-strength-basics',
      keywords: ['elasticity', 'material properties'],
    },
    {
      title: 'Steel Material Properties',
      description: 'Typical properties of structural steel used in beam calculations.',
      href: '/guides/steel-material-properties',
      keywords: ['structural steel', 'properties'],
    },
  ],
  'tank-weight-calculator': [
    {
      title: 'Tank Design Basics',
      description: 'Size storage tanks and understand shell, head, and foundation weight considerations.',
      href: '/guides/tank-design-basics',
      keywords: ['tank design', 'storage tanks'],
    },
    {
      title: 'Pressure Vessel Design',
      description: 'Pressure vessel codes, wall thickness, and weight considerations for ASME VIII vessels.',
      href: '/guides/pressure-vessel-design',
      keywords: ['pressure vessel', 'ASME VIII'],
    },
  ],
  'pressure-vessel-volume-calculator': [
    {
      title: 'Pressure Vessel Design',
      description: 'Design pressure vessels with correct head types, volumes, and ASME code requirements.',
      href: '/guides/pressure-vessel-design',
      keywords: ['pressure vessel', 'ASME VIII'],
    },
    {
      title: 'Tank Design Basics',
      description: 'Tank sizing, head styles, and volume relationships for storage vessels.',
      href: '/guides/tank-design-basics',
      keywords: ['tank design', 'head volume'],
    },
  ],
  'motor-power-calculator': [
    {
      title: 'Motor Efficiency Guide',
      description: 'Select efficient motors for your application and understand efficiency standards.',
      href: '/guides/motor-efficiency-guide',
      keywords: ['motor efficiency', 'motor selection'],
    },
    {
      title: 'Gear Motor Selection',
      description: 'Choose the right gear motor for speed and torque requirements.',
      href: '/guides/gear-motor-selection',
      keywords: ['gear motor', 'power transmission'],
    },
  ],
  'npsh-calculator': [
    {
      title: 'NPSH Calculation Explained',
      description: 'Prevent pump cavitation by understanding NPSH margin and suction conditions.',
      href: '/guides/npsh-calculation-explained',
      keywords: ['NPSH', 'cavitation'],
    },
    {
      title: 'Pump Selection Guide for Industrial Systems',
      description: 'NPSH is a critical pump selection criterion.',
      href: '/guides/pump-selection-guide',
      keywords: ['pump selection', 'cavitation prevention'],
    },
  ],
  'pressure-unit-converter': [
    {
      title: 'Engineering Unit Conversion',
      description: 'Master unit conversion for pressure, flow, temperature, and other engineering quantities.',
      href: '/guides/engineering-unit-conversion',
      keywords: ['unit conversion', 'engineering units'],
    },
  ],
  'thermal-resistance-calculator': [
    {
      title: 'Heat Exchanger Selection',
      description: 'Use thermal resistance concepts in heat exchanger design.',
      href: '/guides/heat-exchanger-selection',
      keywords: ['thermal resistance', 'heat transfer'],
    },
  ],
  'lmtd-calculator': [
    {
      title: 'Heat Exchanger Selection',
      description: 'LMTD is essential for heat exchanger thermal calculations.',
      href: '/guides/heat-exchanger-selection',
      keywords: ['LMTD', 'heat exchanger'],
    },
  ],
};

export function getRelatedGuidesForCalculator(calculatorId: string): GuideLinkConfig[] {
  return CALCULATOR_GUIDE_RELATIONSHIPS[calculatorId] || [];
}
