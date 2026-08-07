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

for (const entry of [commonJsEntry, esModuleEntry]) {
  assert.equal(typeof entry.appendGs1CheckDigit, 'function');
  assert.equal(typeof entry.parseEpc, 'function');
}
