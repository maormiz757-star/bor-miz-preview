/* ════════════════════════════════════════════════════════════════════════════
   crawl-site.mjs — סריקת קישורים פנימית
   ---------------------------------------------------------------------------
   הרצה:  node _build/crawl-site.mjs        (מתוך תיקיית "אתר")

   מתחיל ב-index.html, עוקב אחרי כל קישור פנימי ומדווח:
     · אילו דפים נגישים בפועל מתוך האתר
     · אילו קבצים מופיעים על הדיסק אך אף דף לא מקשר אליהם (יתומים)
     · אילו קישורים מצביעים על קובץ שלא קיים (שבורים)
     · אילו קבצי קוד נטענים בכל דף (css/js מקומיים)

   משמש לוודא שחבילת הקוד לבקרה לא מפספסת שום דף.
   ════════════════════════════════════════════════════════════════════════════ */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, relative, posix } from 'node:path';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const rel  = p => relative(ROOT, p).replace(/\\/g, '/');

/* כל קובצי ה-HTML שקיימים בפועל */
function allHtml(dir = ROOT, acc = []) {
  for (const name of readdirSync(dir)) {
    if (['.git', '.netlify', 'node_modules', '_build', 'בקרה', 'חומר מקצועי', 'nl-files'].includes(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) allHtml(full, acc);
    else if (name.endsWith('.html')) acc.push(rel(full));
  }
  return acc;
}

const onDisk = new Set(allHtml());

/* ── סריקה ───────────────────────────────────────────────────────────────── */
const START = 'index.html';
const seen = new Set([START]);
const queue = [START];
const broken = [];           // {from, href}
const assets = new Map();    // קובץ קוד מקומי → אילו דפים טוענים אותו
const linkedFrom = new Map();

function record(map, key, from) {
  if (!map.has(key)) map.set(key, new Set());
  map.get(key).add(from);
}

while (queue.length) {
  const page = queue.shift();
  const file = join(ROOT, page);
  if (!existsSync(file)) continue;
  const html = readFileSync(file, 'utf8');
  const base = posix.dirname(page);

  /* href של דפים, ו-src/href של נכסי קוד */
  const refs = [...html.matchAll(/(?:href|src)\s*=\s*"([^"]+)"/g)].map(m => m[1]);

  for (const raw of refs) {
    if (/^(https?:|mailto:|tel:|#|data:|javascript:)/i.test(raw)) continue;
    const clean = raw.split('#')[0].split('?')[0];
    if (!clean) continue;

    /* נתיב מהשורש מול נתיב יחסי */
    const target = clean.startsWith('/')
      ? posix.normalize(clean.slice(1))
      : posix.normalize(posix.join(base === '.' ? '' : base, clean));

    const abs = join(ROOT, target);

    if (target.endsWith('.html')) {
      record(linkedFrom, target, page);
      if (!existsSync(abs)) { broken.push({ from: page, href: raw }); continue; }
      if (!seen.has(target)) { seen.add(target); queue.push(target); }
    } else if (/\.(css|js|mjs|json|xml|txt)$/i.test(target)) {
      record(assets, target, page);
      if (!existsSync(abs)) broken.push({ from: page, href: raw });
    }
  }
}

/* ── דיווח ───────────────────────────────────────────────────────────────── */
const reachable = [...seen].sort();
const orphans = [...onDisk].filter(f => !seen.has(f)).sort();

console.log(`\n■ דפים נגישים מתוך האתר: ${reachable.length}`);
for (const p of reachable) {
  const from = linkedFrom.get(p);
  console.log('   ' + p.padEnd(42) + (p === START ? '(נקודת הפתיחה)' : `← ${[...from].length} דפים`));
}

console.log(`\n■ קבצי קוד מקומיים שנטענים: ${assets.size}`);
for (const [a, pages] of [...assets].sort()) {
  console.log('   ' + a.padEnd(42) + `נטען ב-${pages.size} דפים`);
}

console.log(`\n■ דפי HTML על הדיסק שאף דף לא מקשר אליהם: ${orphans.length}`);
for (const o of orphans) console.log('   ' + o);

console.log(`\n■ קישורים שבורים: ${broken.length}`);
for (const b of broken) console.log(`   ${b.from} → ${b.href}`);
console.log('');
