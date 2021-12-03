import { readFileSync, writeFileSync } from 'fs';

console.log(`Allow @tubular packages to be loaded as ESMs`);
for (const packageJsonPath of [
  'node_modules/@tubular/math/package.json',
  'node_modules/@tubular/time/package.json',
  'node_modules/@tubular/util/package.json'
]) {
  console.log(` - ${packageJsonPath}`);
  writeFileSync(
    packageJsonPath,
    JSON.stringify(
      { ...JSON.parse(readFileSync(packageJsonPath, 'utf8')), type: 'module' },
      null,
      2
    ),
    'utf8'
  );
}
