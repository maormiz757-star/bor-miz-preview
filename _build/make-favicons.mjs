/* ════════════════════════════════════════════════════════════════════════════
   make-favicons.mjs — יצירת פביקונים מסמל הלוגו
   ---------------------------------------------------------------------------
   הרצה:  node _build/make-favicons.mjs        (מתוך תיקיית "אתר")

   חותך מתוך logo-bm.png את הסמל הריבועי בלבד (המסגרת עם BM), בלי הכיתוב
   המלבני "בורוביץ מזרחי", מרכז אותו בריבוע עם שוליים ומייצר:

     favicon-192x192.png    אייקון למסכי בית ולמנועי חיפוש
     favicon-32x32.png      לשונית הדפדפן
     favicon.ico            גיבוי לדפדפנים ישנים (מכיל 16/32/48)

   קובץ ה-ICO נבנה ידנית: מאז ויסטה דפדפנים תומכים ב-PNG בתוך מכולת ICO,
   ולכן די בכותרת ICONDIR + ICONDIRENTRY לכל גודל ואחריהן בייטים של PNG.
   ════════════════════════════════════════════════════════════════════════════ */

import sharp from 'sharp';
import { writeFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const LOGO = join(ROOT, 'logo-bm.png');

/* אזור הסמל בתוך הלוגו המקורי (431x99). נמדד ידנית מהקובץ. */
const CROP = { left: 340, top: 0, width: 91, height: 99 };

const BG  = '#ffffff';
const PAD = 0.14;              // שוליים כאחוז מצלע הריבוע

/* ── גזירת הסמל ומרכוזו בריבוע ───────────────────────────────────────────── */
/* שני שלבים בכוונה: sharp מריץ trim לפני extract באותו pipeline,
   ולכן הגזירה חייבת להסתיים ולהיכתב לבאפר לפני שמורידים את השוליים. */
const cropped = await sharp(LOGO).extract(CROP).png().toBuffer();
const symbol  = await sharp(cropped).trim({ threshold: 10 }).png().toBuffer();

const m = await sharp(symbol).metadata();
const side = Math.max(m.width, m.height);
const canvas = Math.round(side * (1 + PAD * 2));

/* מרכז את הסמל על רקע לבן ריבועי */
const square = await sharp({
  create: { width: canvas, height: canvas, channels: 4, background: BG }
})
  .composite([{ input: symbol, gravity: 'center' }])
  .png()
  .toBuffer();

console.log(`  סמל: ${m.width}x${m.height}  →  ריבוע ${canvas}x${canvas}`);

/* ── PNG בגדלים הנדרשים ─────────────────────────────────────────────────── */
async function png(size) {
  return sharp(square)
    .resize(size, size, { fit: 'contain', background: BG, kernel: 'lanczos3' })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

for (const size of [192, 32]) {
  const out = join(ROOT, `favicon-${size}x${size}.png`);
  writeFileSync(out, await png(size));
  console.log(`  favicon-${size}x${size}.png`.padEnd(28) + (statSync(out).size / 1024).toFixed(1) + 'KB');
}

/* ── ICO עם שלושה גדלים ─────────────────────────────────────────────────── */
const sizes = [16, 32, 48];
const buffers = [];
for (const s of sizes) buffers.push(await png(s));

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);            // reserved
header.writeUInt16LE(1, 2);            // type: icon
header.writeUInt16LE(sizes.length, 4); // count

let offset = 6 + 16 * sizes.length;
const entries = [];
buffers.forEach((buf, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], 0);  // width
  e.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], 1);  // height
  e.writeUInt8(0, 2);                                // palette
  e.writeUInt8(0, 3);                                // reserved
  e.writeUInt16LE(1, 4);                             // color planes
  e.writeUInt16LE(32, 6);                            // bits per pixel
  e.writeUInt32LE(buf.length, 8);                    // size of data
  e.writeUInt32LE(offset, 12);                       // offset of data
  offset += buf.length;
  entries.push(e);
});

const ico = join(ROOT, 'favicon.ico');
writeFileSync(ico, Buffer.concat([header, ...entries, ...buffers]));
console.log('  favicon.ico'.padEnd(28) + (statSync(ico).size / 1024).toFixed(1) + `KB  (${sizes.join('/')})`);
console.log('\n✔ הפביקונים נוצרו');
