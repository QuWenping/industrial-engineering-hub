import { getAllCalculators } from "../src/lib/calculator/loader";
import { calculate } from "../src/lib/calculator/engine";

const calculators = getAllCalculators();
let passed = 0;
let failed = 0;
let errors = 0;

for (const calc of calculators) {
  if (!calc.tests || calc.tests.length === 0) {
    console.log(`⚠️  ${calc.id}: No tests`);
    continue;
  }
  for (const test of calc.tests) {
    let r: any, errs: any[] = [];
    try {
      const out = calculate({ calculator: calc, values: test.inputs });
      r = out.result;
      errs = out.errors;
    } catch (e) {
      errs = [{ message: (e as Error).message }];
    }
    if (errs.length > 0 || !r) {
      console.log(`❌ ${calc.id}: ERROR - ${errs.map((e: any) => e.message).join(", ")}`);
      errors++;
      continue;
    }
    const diff = Math.abs(r.value - test.expected);
    const tol = test.tolerance || 0.01;
    const pct = test.expected !== 0 ? (diff / Math.abs(test.expected)) * 100 : diff;
    if (diff <= tol || pct < 0.5) {
      console.log(`✅ ${calc.id}: ${r.value.toFixed(2)} (expected ${test.expected})`);
      passed++;
    } else {
      console.log(`❌ ${calc.id}: got ${r.value.toFixed(4)}, expected ${test.expected}, diff=${diff.toFixed(4)}`);
      failed++;
    }
  }
}

console.log(`\n${passed} passed, ${failed} failed, ${errors} errors, total ${passed + failed + errors}`);
process.exit(failed + errors > 0 ? 1 : 0);
