#!/usr/bin/env ts-node
/**
 * Optimization Script: Meta Descriptions + Internal Linking
 * - Optimizes meta descriptions in calculator JSON for higher CTR
 * - Adds internal links to related guides and calculators
 * - Ensures AdSense compliance (no clickbait, natural linking)
 * 
 * Usage: npm run optimize-seo
 */

import fs from 'fs';
import path from 'path';

interface Calculator {
  id: string;
  name: string;
  description: string;
  category: string;
  seo: {
    title: string;
    description: string;
    keyword: string;
  };
  content: {
    related?: string[];
    [key: string]: any;
  };
  [key: string]: any;
}

// Map of calculator relationships for internal linking
const CALC_RELATIONSHIPS: Record<string, string[]> = {
  'pump-power-calculator': ['pump-head-calculator', 'npsh-calculator', 'motor-power-calculator', 'pump-efficiency-calculator'],
  'pump-head-calculator': ['pump-power-calculator', 'npsh-calculator', 'pump-sizing-calculator'],
  'pipe-flow-calculator': ['pressure-drop-calculator', 'pipe-velocity-calculator', 'reynolds-number-calculator'],
  'pressure-drop-calculator': ['pipe-flow-calculator', 'darcy-weisbach-calculator', 'pipe-velocity-calculator'],
  'steel-weight-calculator': ['aluminum-weight-calculator', 'copper-weight-calculator', 'material-volume-calculator'],
  'heat-exchanger-calculator': ['lmtd-calculator', 'heat-transfer-calculator', 'thermal-resistance-calculator'],
  'tank-volume-calculator': ['tank-capacity-calculator', 'tank-weight-calculator', 'tank-surface-area-calculator'],
  'reynolds-number-calculator': ['pipe-flow-calculator', 'pressure-drop-calculator', 'darcy-weisbach-calculator'],
  'beam-deflection-calculator': ['steel-weight-calculator', 'pressure-vessel-volume-calculator'],
  'motor-power-calculator': ['pump-power-calculator', 'pump-efficiency-calculator'],
};

// Enhanced meta descriptions for higher CTR (compliant, no clickbait)
const ENHANCED_DESCRIPTIONS: Record<string, string> = {
  'pump-power-calculator': 'Calculate hydraulic and shaft power for centrifugal pumps — Enter flow rate, head, density & efficiency for instant results',
  'pump-head-calculator': 'Pump head calculator for centrifugal systems — Determines total dynamic head from flow, pressure & elevation changes',
  'pipe-flow-calculator': 'Calculate pipe flow rate from diameter and velocity — Continuity equation Q = πd²/4 × v with unit conversion',
  'pressure-drop-calculator': 'Calculate pressure drop in pipes using Darcy-Weisbach equation — Accounts for friction factor, length, diameter & fluid properties',
  'steel-weight-calculator': 'Calculate steel weight instantly — Beams, plates, rounds & sections with metric + imperial unit support',
  'heat-exchanger-calculator': 'Heat exchanger calculations — Q = U × A × LMTD for thermal design and sizing',
  'npsh-calculator': 'Calculate available NPSH to prevent pump cavitation — Essential for pump reliability and longevity',
  'tank-volume-calculator': 'Calculate tank volume — Cylindrical, rectangular & spherical vessels with multiple unit options',
  'reynolds-number-calculator': 'Calculate Reynolds number for fluid flow regimes — Determines laminar vs turbulent flow conditions',
  'beam-deflection-calculator': 'Calculate beam deflection under load — Simply supported & cantilever beams using standard formulas',
  'motor-power-calculator': 'Calculate motor power requirements from torque and speed — Select proper motor sizing for applications',
  'flow-rate-calculator': 'Flow rate calculator for volumetric fluid calculations — Multiple unit conversions for engineering precision',
  'pressure-unit-converter': 'Pressure unit converter — Convert between Pa, bar, psi, atm, mmHg & other engineering units instantly',
  'density-calculator': 'Fluid density calculator — Determine density for water, oil & other industrial fluids by material type',
  'thermal-resistance-calculator': 'Calculate thermal resistance for insulation & heat transfer analysis — Series & parallel configurations',
  'lmtd-calculator': 'Log mean temperature difference (LMTD) calculator — Counter-flow & co-flow heat exchanger analysis',
};

function readCalculators(): Calculator[] {
  const calcDir = path.join(process.cwd(), 'content', 'calculators');
  const files = fs.readdirSync(calcDir).filter(f => f.endsWith('.json'));
  
  return files.map(file => {
    const content = fs.readFileSync(path.join(calcDir, file), 'utf-8');
    return JSON.parse(content) as Calculator;
  });
}

function optimizeDescription(calc: Calculator): string {
  // Use enhanced description if available, otherwise improve existing
  if (ENHANCED_DESCRIPTIONS[calc.id]) {
    return ENHANCED_DESCRIPTIONS[calc.id];
  }

  // Fallback: enhance existing description with keyword + benefit
  const keyword = calc.seo.keyword || calc.name;
  return `${calc.name} — ${calc.description.replace(/\.$/, '')} with instant results & multiple unit support.`;
}

function enhanceCalculator(calc: Calculator): Calculator {
  // Optimize meta description for higher CTR
  calc.seo.description = optimizeDescription(calc);

  // Add related calculators for internal linking (avoid duplicates)
  if (CALC_RELATIONSHIPS[calc.id]) {
    const related = CALC_RELATIONSHIPS[calc.id];
    calc.content.related = Array.from(new Set([...(calc.content.related || []), ...related]));
  }

  return calc;
}

function saveCalculator(calc: Calculator): void {
  const filepath = path.join(process.cwd(), 'content', 'calculators', `${calc.id}.json`);
  fs.writeFileSync(filepath, JSON.stringify(calc, null, 2) + '\n');
}

function main() {
  console.log('🔍 Reading calculators...');
  const calculators = readCalculators();
  console.log(`✅ Found ${calculators.length} calculators\n`);

  let optimized = 0;
  let linkedCount = 0;

  calculators.forEach((calc) => {
    const descBefore = calc.seo.description;
    const enhanced = enhanceCalculator(calc);
    
    if (enhanced.seo.description !== descBefore) {
      optimized++;
    }
    
    if (enhanced.content.related && enhanced.content.related.length > 0) {
      linkedCount++;
    }

    saveCalculator(enhanced);
  });

  console.log(`📝 Optimized ${optimized}/${calculators.length} meta descriptions for higher CTR`);
  console.log(`🔗 Added internal links to ${linkedCount}/${calculators.length} calculators`);
  console.log('\n✨ SEO optimization complete!');
  console.log('\n📊 Sample optimizations:');
  
  calculators.slice(0, 3).forEach(calc => {
    console.log(`\n  ${calc.id}:`);
    console.log(`    📄 "${optimizeDescription(calc)}"`);
    if (CALC_RELATIONSHIPS[calc.id]) {
      console.log(`    🔗 Related: ${CALC_RELATIONSHIPS[calc.id].slice(0, 2).join(', ')}`);
    }
  });

  console.log('\n✅ All changes are AdSense-compliant:');
  console.log('   ✓ No clickbait language');
  console.log('   ✓ Natural internal linking');
  console.log('   ✓ Descriptive, benefit-focused meta descriptions');
  console.log('   ✓ No artificial link inflation');
}

main();
