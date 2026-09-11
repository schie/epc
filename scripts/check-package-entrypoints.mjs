import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packageJson = JSON.parse(await readFile(resolve(packageRoot, 'package.json'), 'utf8'));

assert.equal(typeof packageJson.main, 'string');
assert.equal(typeof packageJson.module, 'string');

const mainPath = resolve(packageRoot, packageJson.main);
const modulePath = resolve(packageRoot, packageJson.module);
await Promise.all([access(mainPath), access(modulePath)]);

const require = createRequire(import.meta.url);
// eslint-disable-next-line security/detect-non-literal-require -- Path comes from this package's manifest.
const commonJsEntry = require(mainPath);
const esModuleEntry = await import(pathToFileURL(modulePath));

const expectedFunctions = [
  'appendGs1CheckDigit',
  'computeGs1CheckDigit',
  'encodeGid96',
  'encodeSgtin96',
  'encodeSgtin96FromEan13',
  'encodeSgtin96FromEan8',
  'encodeSgtin96FromGtin12',
  'encodeSgtin96FromGtin13',
  'encodeSgtin96FromGtin8',
  'encodeSgtin96FromUpcA',
  'parseEpc',
  'sgtin96ToGtin14',
  'validateGs1CheckDigit',
];

for (const entry of [commonJsEntry, esModuleEntry]) {
  for (const name of expectedFunctions) {
    assert.equal(typeof entry[name], 'function', `expected ${name} to be a function`);
  }
  assert.equal(typeof entry.EpcScheme, 'object');
  assert.equal(entry.EpcScheme.SGTIN_96, 'sgtin-96');
  assert.equal(entry.EpcScheme.GID_96, 'gid-96');
}
