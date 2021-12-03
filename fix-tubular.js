import { readFileSync, writeFileSync } from 'fs';

const mod = process.argv[2] === 'build' ? { type: 'module' } : { type: undefined };

// Not sure why this is needed at all, but 🤷 just a quick project. Breaks dev mode.
console.log(`Allow @tubular packages to be loaded properly in either build or dev mode`);
for (const packageJsonPath of [
  'node_modules/@tubular/math/package.json',
  'node_modules/@tubular/time/package.json',
  'node_modules/@tubular/util/package.json'
]) {
  console.log(` - ${packageJsonPath}`);
  writeFileSync(
    packageJsonPath,
    JSON.stringify({ ...JSON.parse(readFileSync(packageJsonPath, 'utf8')), ...mod }, null, 2),
    'utf8'
  );
}
