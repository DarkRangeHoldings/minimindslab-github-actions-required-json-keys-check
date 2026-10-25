import { appendFileSync } from 'node:fs';

try {
  const payloadRaw = process.env.INPUT_PAYLOAD;
  const outputPath = process.env.GITHUB_OUTPUT;

  if (typeof payloadRaw !== 'string') throw new Error('Invalid input');
  if (typeof outputPath !== 'string' || outputPath.length === 0) throw new Error('Invalid output');

  let payload;
  try {
    payload = JSON.parse(payloadRaw);
  } catch {
    throw new Error('Invalid input');
  }

  if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) throw new Error('Invalid input');

  const hasOwn = Object.prototype.hasOwnProperty;
  if (!hasOwn.call(payload, 'value') || !hasOwn.call(payload, 'required')) throw new Error('Invalid input');

  const { value, required } = payload;

  if (value === null || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid input');
  if (required === null || typeof required !== 'object' || !Array.isArray(required)) throw new Error('Invalid input');

  const seen = new Set();
  for (const k of required) {
    if (typeof k !== 'string' || k.length === 0) throw new Error('Invalid input');
    if (seen.has(k)) throw new Error('Invalid input');
    seen.add(k);
  }

  const present = [];
  const missing = [];
  for (const k of required) {
    if (hasOwn.call(value, k)) present.push(k);
    else missing.push(k);
  }

  present.sort();
  missing.sort();

  const result = {
    missing,
    ok: missing.length === 0,
    present
  };

  appendFileSync(outputPath, `result=${JSON.stringify(result)}\n`);
} catch (err) {
  throw err;
}