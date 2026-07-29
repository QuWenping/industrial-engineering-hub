import fs from "fs";
import path from "path";

export interface Material {
  id: string;
  name: string;
  density: number;
  category: string;
  description?: string;
  yieldStrength?: number;
  tensileStrength?: number;
  thermalConductivity?: number;
  viscosity?: number;
  compressiveStrength?: number;
  units?: Record<string, string>;
}

const MATERIALS_PATH = path.join(process.cwd(), "data", "materials.json");

let materialsCache: Material[] | null = null;

export function getAllMaterials(): Material[] {
  if (materialsCache) return materialsCache;
  if (!fs.existsSync(MATERIALS_PATH)) return [];
  const raw = fs.readFileSync(MATERIALS_PATH, "utf-8");
  materialsCache = JSON.parse(raw) as Material[];
  return materialsCache;
}

export function getMaterialById(id: string): Material | undefined {
  return getAllMaterials().find((m) => m.id === id);
}

export function getMaterialDensity(id: string): number | undefined {
  return getMaterialById(id)?.density;
}

// For the material selector in calculators, we only need id, name, density
export function getMaterialOptions(): { id: string; name: string; density: number }[] {
  return getAllMaterials().map((m) => ({
    id: m.id,
    name: m.name,
    density: m.density,
  }));
}
