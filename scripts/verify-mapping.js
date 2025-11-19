#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
// simple argv parsing (avoid external dependency)

let createStripe;
try {
  createStripe = require('@publimicro/stripe').createStripe;
} catch (_e) {
  createStripe = require(path.join(__dirname, '..', 'packages', 'stripe', 'dist', 'src', 'index.js')).createStripe;
}

async function loadMapping(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function short(id) {
  if (!id) return '---';
  return id.substring(0, 10) + '...';
}

async function verify(stripeKey, mappingFile) {
  if (!stripeKey) {
    console.error('ERROR: Provide STRIPE_SECRET_KEY environment variable (live or test).');
    process.exit(1);
  }

  const map = await loadMapping(mappingFile);
  const stripe = createStripe(stripeKey);

  console.log(`\nVerifying mapping file: ${mappingFile}`);
  console.log(`Using Stripe key: ${short(stripeKey)} (read-only checks)\n`);

  const results = [];

  for (const m of (map.mappings || [])) {
    const entry = { logical: m.logical, old: m.old, new: m.new, note: m.note };
    try {
      if (m.old) {
        const pold = await stripe.prices.retrieve(m.old).catch(e => ({ _error: e }));
        entry.old_obj = pold._error ? { error: pold._error.message } : {
          id: pold.id,
          amount: pold.unit_amount,
          currency: pold.currency,
          recurring: !!pold.recurring,
          product: pold.product
        };
      } else {
        entry.old_obj = null;
      }

      if (m.new) {
        const pnew = await stripe.prices.retrieve(m.new).catch(e => ({ _error: e }));
        entry.new_obj = pnew._error ? { error: pnew._error.message } : {
          id: pnew.id,
          amount: pnew.unit_amount,
          currency: pnew.currency,
          recurring: !!pnew.recurring,
          product: pnew.product
        };
      } else {
        entry.new_obj = null;
      }
    } catch (e) {
      entry.error = e.message;
    }
    results.push(entry);
  }

  // Print concise report
  console.log('\n=== Verification Report ===\n');
  for (const r of results) {
    console.log(`Logical: ${r.logical}`);
    console.log(` Note: ${r.note || '—'}`);
    console.log(` Old ID: ${r.old || '—'} -> ${r.old_obj && r.old_obj.error ? 'ERROR: ' + r.old_obj.error : r.old_obj ? `R$ ${(r.old_obj.amount/100).toFixed(2)} ${r.old_obj.currency} ${r.old_obj.recurring ? '(recurring)' : '(one-time)'} product=${r.old_obj.product}` : 'not found'}`);
    console.log(` New ID: ${r.new || '—'} -> ${r.new_obj && r.new_obj.error ? 'ERROR: ' + r.new_obj.error : r.new_obj ? `R$ ${(r.new_obj.amount/100).toFixed(2)} ${r.new_obj.currency} ${r.new_obj.recurring ? '(recurring)' : '(one-time)'} product=${r.new_obj.product}` : 'not found'}`);
    console.log('---');
  }

  return results;
}

async function main() {
  const rawArgs = process.argv.slice(2);
  let mappingFile = path.join(__dirname, '..', 'docs', 'stripe-price-mapping.json');
  for (let i = 0; i < rawArgs.length; i++) {
    const a = rawArgs[i];
    if (a === '--file' || a === '-f') {
      mappingFile = rawArgs[i + 1];
      i++;
    }
  }
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  try {
    await verify(stripeKey, mappingFile);
    console.log('\nVerification complete. No changes performed.');
  } catch (e) {
    console.error('Verification failed:', e.message);
    process.exit(1);
  }
}

main();
