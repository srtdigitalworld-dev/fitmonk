import { readdir, readFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import assert from 'node:assert/strict';

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(e => e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]))).flat();
}
const files = (await walk('dist')).filter(f => f.endsWith('.html'));
const titles = new Set();
let schemaCount = 0;
const previewUrl = process.env.PREVIEW_URL;
for (const file of files) {
  const html = await readFile(file, 'utf8');
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `${file}: one H1`);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert.ok(title && !titles.has(title), `${file}: unique title`); titles.add(title);
  assert.match(html, /name="description" content="[^"]+"/);
  assert.match(html, /rel="canonical" href="https:\/\//);
  assert.match(html, /name="robots"/);
  assert.match(html, /name="robots" content="noindex,follow"/, `${file}: indexing disabled`);
  for (const script of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const schema = JSON.parse(script[1]);
    assert.ok(schema['@context'] && schema['@type'], `${file}: valid structured data`);
    schemaCount++;
  }
  for (const image of html.matchAll(/<img\b[^>]*>/g)) {
    assert.match(image[0], /\balt="[^"]*"/, `${file}: image alternative`);
    assert.match(image[0], /\bwidth="\d+"/, `${file}: reserved image width`);
    assert.match(image[0], /\bheight="\d+"/, `${file}: reserved image height`);
  for (const asset of html.matchAll(/\bsrc="(\/[^"?#]+)"/g)) {
    if (asset[1].startsWith('/video/')) continue; // Large master video excluded from deployment bundle
    await access(join('dist', asset[1]));
  }
  for (const anchor of html.matchAll(/href="((?:\/[^"?#]*)?)#([^"?]+)"/g)) {
    const path = anchor[1];
    const target = path ? await readFile(join('dist', path.endsWith('/') ? `${path}index.html` : path), 'utf8') : html;
    assert.ok(target.includes(`id="${anchor[2]}"`), `${file}: missing anchor ${anchor[0]}`);
  }
  for (const match of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    const path = match[1];
    await access(join('dist', path.endsWith('/') ? `${path}index.html` : path));
  }
  if (previewUrl) {
    const path = file.replaceAll('\\', '/').replace(/^dist/, '').replace(/index\.html$/, '');
    const response = await fetch(`${previewUrl}${path}`);
    assert.equal(response.status, 200, `${path}: route responds`);
  }
}
assert.equal(files.length, 40);
assert.match(await readFile('dist/robots.txt', 'utf8'), /User-agent: \*/);
assert.match(await readFile('dist/robots.txt', 'utf8'), /Disallow: \/\s/);
console.log(`Verified ${files.length} HTML pages and ${schemaCount} JSON-LD blocks: titles, H1, metadata, assets, image dimensions, links, anchors and noindex.${previewUrl ? ' All routes returned HTTP 200.' : ''}`);
