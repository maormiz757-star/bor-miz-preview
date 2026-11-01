/* ════════════════════════════════════════════════════════════════════════════
   optimize-svc-photos.mjs — כיווץ תמונות "תחומי התמחות" בדף הבית
   ---------------------------------------------------------------------------
   הרצה:  node _build/optimize-svc-photos.mjs       (מתוך תיקיית "אתר")

   הרקע: בתיקייה svc-photos שמונה קובצי PNG במשקל 7.5-10.3MB כל אחד
   (71MB בסך הכל). הם משרתים את ויזואלי ההובר באזור "תחומי התמחות" בדף הבית.
   הסקריפט ממיר אותם ל-WebP בגודל שמתאים לתצוגה בפועל.

   חישוב הגודל:
     הפאנל בדף הבית הוא כ-360x740 פיקסלים (פורטרט, יחס 0.49).
     התמונה ממולאת ב-object-fit: cover, כלומר הגובה הוא הממד הקובע
     והצדדים נחתכים. לכן:
       גובה היעד  = 1480px (פי 2 מגובה הפאנל, לתמיכה במסכי retina)
       רוחב היעד  = עד 1200px (מעבר לזה ממילא נחתך)
     תמונות שגובהן המקורי קטן מ-1480 לא מוגדלות.

   קובצי ה-PNG המקוריים נשארים על הדיסק כמאסטרים, אך מוחרגים מההעלאה
   דרך .netlifyignore כדי שלא ייארזו לאתר.
   ════════════════════════════════════════════════════════════════════════════ */

import sharp from 'sharp';
import { readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, basename } from 'node:path';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DIR  = join(ROOT, 'svc-photos');

const MAX_H = 1480;   // פי 2 מגובה הפאנל
const MAX_W = 1200;   // מעבר לזה נחתך ממילא
const Q     = 74;

const mb = n => (n / 1048576).toFixed(1) + 'MB';
const kb = n => (n / 1024).toFixed(0) + 'KB';

const pngs = readdirSync(DIR).filter(f => extname(f).toLowerCase() === '.png').sort();
let before = 0, after = 0;

for (const f of pngs) {
  const src = join(DIR, f);
  const out = join(DIR, basename(f, extname(f)) + '.webp');
  const m = await sharp(src).metadata();

  const h = Math.min(MAX_H, m.height);
  const w = Math.min(Math.round(m.width * (h / m.height)), MAX_W);

  await sharp(src)
    .resize(w, h, { fit: 'cover', position: 'center' })
    .webp({ quality: Q, effort: 6 })
    .toFile(out);

  const inSize = statSync(src).size, outSize = statSync(out).size;
  before += inSize; after += outSize;
  console.log(`  ${f}`.padEnd(12) + `${m.width}x${m.height} ${mb(inSize)}`.padEnd(22) + `→  ${w}x${h} ${kb(outSize)}`);
}

console.log(`\n✔ ${pngs.length} תמונות: ${mb(before)} → ${mb(after)}  (${(100 - after / before * 100).toFixed(1)}% חיסכון)`);
