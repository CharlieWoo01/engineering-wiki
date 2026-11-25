/**
 * Validates internal links and asset references in the built site (`dist/`).
 *
 * Usage: node scripts/check-links.ts [outputDir]
 *
 * Runs after `astro build` (see `pnpm check:links`). Uses the same SITE_URL /
 * BASE_PATH resolution as astro.config.ts so it checks the base path the site
 * was actually built with. External links are intentionally not checked here;
 * see the README for the scheduled external link check.
 */
import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { resolveDeployment } from '../src/lib/deployment.ts';
import { extractLinks, pageUrlPathFor, resolveLink } from './lib/dist-links.ts';

interface Problem {
  page: string;
  link: string;
  reason: string;
}

const outputDir = path.resolve(process.argv[2] ?? 'dist');
const { base } = resolveDeployment(process.env);

if (!existsSync(outputDir)) {
  console.error(`Output directory not found: ${outputDir}. Run "pnpm build" first.`);
  process.exit(1);
}

const htmlFiles = await listHtmlFiles(outputDir);
const existence = new Map<string, boolean>();
const problems: Problem[] = [];
let checked = 0;

for (const file of htmlFiles) {
  const relativeFile = path.relative(outputDir, file).split(path.sep).join('/');
  const pageUrlPath = pageUrlPathFor(relativeFile, base);
  const html = await readFile(file, 'utf8');

  for (const link of new Set(extractLinks(html))) {
    const resolved = resolveLink(link, pageUrlPath, base);
    if (resolved.kind === 'skip' || resolved.kind === 'external') continue;
    checked++;

    if (resolved.kind === 'outside-base') {
      problems.push({ page: relativeFile, link, reason: `not under base path "${base}"` });
      continue;
    }

    const found = resolved.candidates.some((candidate) => fileExists(candidate));
    if (!found) {
      problems.push({ page: relativeFile, link, reason: 'target not found in build output' });
    }
  }
}

if (problems.length > 0) {
  console.error(`Found ${problems.length} broken internal link(s) or asset reference(s):\n`);
  for (const problem of problems) {
    console.error(`  ${problem.page}\n    → ${problem.link} (${problem.reason})`);
  }
  process.exit(1);
}

console.log(
  `✔ Checked ${checked} internal links and assets across ${htmlFiles.length} pages (base "${base}").`,
);

function fileExists(relativePath: string): boolean {
  let exists = existence.get(relativePath);
  if (exists === undefined) {
    exists = existsSync(path.join(outputDir, ...relativePath.split('/')));
    existence.set(relativePath, exists);
  }
  return exists;
}

async function listHtmlFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true, recursive: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
    .map((entry) => path.join(entry.parentPath, entry.name))
    .sort();
}
