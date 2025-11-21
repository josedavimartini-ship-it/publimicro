#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const TAX_PATH = path.join(__dirname, '..', 'data', 'taxonomy.json');

function loadTaxonomy() {
  if (!fs.existsSync(TAX_PATH)) {
    console.error('taxonomy.json not found at', TAX_PATH);
    process.exit(2);
  }
  const raw = fs.readFileSync(TAX_PATH, 'utf8');
  return JSON.parse(raw);
}

function validate(tax) {
  if (!tax.categories || !Array.isArray(tax.categories)) {
    throw new Error('Invalid taxonomy: missing categories array');
  }
  const ids = new Set();
  tax.categories.forEach(cat => {
    if (!cat.id) throw new Error('Category missing id');
    if (ids.has(cat.id)) throw new Error(`Duplicate category id: ${cat.id}`);
    ids.add(cat.id);
    if (!Array.isArray(cat.subcategories)) throw new Error(`Category ${cat.id} missing subcategories array`);
    const subIds = new Set();
    cat.subcategories.forEach(sub => {
      if (!sub.id) throw new Error(`Subcategory missing id in ${cat.id}`);
      if (subIds.has(sub.id)) throw new Error(`Duplicate subcategory id ${sub.id} in ${cat.id}`);
      subIds.add(sub.id);
    });
  });
  return { categoryCount: tax.categories.length };
}

function main() {
  try {
    const tax = loadTaxonomy();
    const res = validate(tax);
    console.log('taxonomy.json looks valid —', res.categoryCount, 'categories');
    // Output a flattened export for quick imports
    const flat = {};
    tax.categories.forEach(cat => {
      flat[cat.id] = (cat.subcategories || []).map(s => s.id);
    });
    const outPath = path.join(__dirname, '..', 'data', 'taxonomy-flat.json');
    fs.writeFileSync(outPath, JSON.stringify(flat, null, 2));
    console.log('Wrote flattened taxonomy to', outPath);
    process.exit(0);
  } catch (e) {
    console.error('Validation error:', e.message);
    process.exit(1);
  }
}

if (require.main === module) main();
