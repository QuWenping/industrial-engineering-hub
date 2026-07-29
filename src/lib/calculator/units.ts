// Unit conversion engine
// All conversions are to SI base units for formula evaluation, then converted back for display

export type UnitCategory = "length" | "pressure" | "flow" | "power" | "weight" | "area" | "volume" | "temperature" | "viscosity" | "thermalConductance";

// Conversion factors: value in [unit] = factor * value in [base SI unit]
// e.g. 1 mm = 0.001 m, so toBase = 0.001
const unitDefinitions: Record<UnitCategory, Record<string, { toBase: number; fromBase: number; label: string }>> = {
  length: {
    mm: { toBase: 0.001, fromBase: 1000, label: "mm" },
    cm: { toBase: 0.01, fromBase: 100, label: "cm" },
    m: { toBase: 1, fromBase: 1, label: "m" },
    inch: { toBase: 0.0254, fromBase: 39.3701, label: "inch" },
    ft: { toBase: 0.3048, fromBase: 3.28084, label: "ft" },
  },
  pressure: {
    Pa: { toBase: 1, fromBase: 1, label: "Pa" },
    kPa: { toBase: 1000, fromBase: 0.001, label: "kPa" },
    MPa: { toBase: 1_000_000, fromBase: 0.000001, label: "MPa" },
    bar: { toBase: 100_000, fromBase: 0.00001, label: "bar" },
    psi: { toBase: 6894.76, fromBase: 0.000145038, label: "psi" },
  },
  flow: {
    "m3/h": { toBase: 1 / 3600, fromBase: 3600, label: "m³/h" },
    "m3/s": { toBase: 1, fromBase: 1, label: "m³/s" },
    "L/min": { toBase: 0.001 / 60, fromBase: 60_000, label: "L/min" },
    "L/s": { toBase: 0.001, fromBase: 1000, label: "L/s" },
    GPM: { toBase: 0.00378541 / 60, fromBase: 15850.3, label: "GPM" },
  },
  power: {
    W: { toBase: 1, fromBase: 1, label: "W" },
    kW: { toBase: 1000, fromBase: 0.001, label: "kW" },
    MW: { toBase: 1_000_000, fromBase: 0.000001, label: "MW" },
    HP: { toBase: 745.7, fromBase: 0.00134102, label: "HP" },
  },
  weight: {
    kg: { toBase: 1, fromBase: 1, label: "kg" },
    g: { toBase: 0.001, fromBase: 1000, label: "g" },
    ton: { toBase: 1000, fromBase: 0.001, label: "ton" },
    lb: { toBase: 0.453592, fromBase: 2.20462, label: "lb" },
  },
  area: {
    "mm2": { toBase: 0.000001, fromBase: 1_000_000, label: "mm²" },
    "cm2": { toBase: 0.0001, fromBase: 10_000, label: "cm²" },
    "m2": { toBase: 1, fromBase: 1, label: "m²" },
    "in2": { toBase: 0.00064516, fromBase: 1550.0, label: "in²" },
    "ft2": { toBase: 0.092903, fromBase: 10.7639, label: "ft²" },
  },
  volume: {
    "mm3": { toBase: 1e-9, fromBase: 1e9, label: "mm³" },
    "cm3": { toBase: 1e-6, fromBase: 1e6, label: "cm³" },
    "m3": { toBase: 1, fromBase: 1, label: "m³" },
    L: { toBase: 0.001, fromBase: 1000, label: "L" },
    "ft3": { toBase: 0.0283168, fromBase: 35.3147, label: "ft³" },
    gal: { toBase: 0.00378541, fromBase: 264.172, label: "gal" },
  },
  temperature: {
    C: { toBase: 1, fromBase: 1, label: "°C" },
    F: { toBase: 1, fromBase: 1, label: "°F" }, // special handling
    K: { toBase: 1, fromBase: 1, label: "K" },
  },
  viscosity: {
    "Pa·s": { toBase: 1, fromBase: 1, label: "Pa·s" },
    "cP": { toBase: 0.001, fromBase: 1000, label: "cP" },
  },
  thermalConductance: {
    "W/(m²·K)": { toBase: 1, fromBase: 1, label: "W/(m²·K)" },
  },
};

// Map unit strings to category
const unitToCategory: Record<string, UnitCategory> = {};
for (const [cat, units] of Object.entries(unitDefinitions)) {
  for (const unit of Object.keys(units)) {
    unitToCategory[unit] = cat as UnitCategory;
  }
}

export function getUnitCategory(unit: string): UnitCategory | null {
  return unitToCategory[unit] || null;
}

export function convertToBase(value: number, fromUnit: string): number {
  const def = findUnit(fromUnit);
  if (!def) return value;
  const cat = getUnitCategory(fromUnit);
  if (cat === "temperature") return convertTemperature(value, fromUnit, "C");
  return value * def.toBase;
}

export function convertFromBase(value: number, toUnit: string): number {
  const def = findUnit(toUnit);
  if (!def) return value;
  const cat = getUnitCategory(toUnit);
  if (cat === "temperature") return convertTemperature(value, "C", toUnit);
  return value * def.fromBase;
}

export function convert(value: number, fromUnit: string, toUnit: string): number {
  if (fromUnit === toUnit) return value;
  const base = convertToBase(value, fromUnit);
  return convertFromBase(base, toUnit);
}

function findUnit(unit: string) {
  for (const units of Object.values(unitDefinitions)) {
    if (units[unit]) return units[unit];
  }
  return null;
}

function convertTemperature(value: number, from: string, to: string): number {
  // Convert to Celsius first
  let celsius: number;
  switch (from) {
    case "C": celsius = value; break;
    case "F": celsius = (value - 32) * 5 / 9; break;
    case "K": celsius = value - 273.15; break;
    default: celsius = value;
  }
  switch (to) {
    case "C": return celsius;
    case "F": return celsius * 9 / 5 + 32;
    case "K": return celsius + 273.15;
    default: return celsius;
  }
}

export function getUnitsForCategory(category: UnitCategory): string[] {
  return Object.keys(unitDefinitions[category]);
}

export function getUnitLabel(unit: string): string {
  const def = findUnit(unit);
  return def?.label || unit;
}

// The formula base unit for each category (what formulas expect)
export const baseUnits: Record<UnitCategory, string> = {
  length: "m",
  pressure: "Pa",
  flow: "m3/s",
  power: "W",
  weight: "kg",
  area: "m2",
  volume: "m3",
  temperature: "C",
  viscosity: "Pa·s",
  thermalConductance: "W/(m²·K)",
};
