/* ════════════════════════════════════════════════════════════════════════════
   optimize-images.mjs — כיווץ והמרה ל-WebP של תמונות דפי ההתמחויות
   ---------------------------------------------------------------------------
   הרצה:  node _build/optimize-images.mjs      (מתוך תיקיית "אתר")
   ואז:   node _build/build-hitmahut.mjs

   מאיפה נלקחות התמונות (לפי סדר עדיפות, לכל דף בנפרד):
     1. "תמונות חדשות לאתר/<slug>-hero.*"   ⟵ הדרך המומלצת
        "תמונות חדשות לאתר/<slug>-body.*"
     2. "תמונות חדשות לאתר/<שם הקובץ שמוגדר בנתונים>"
     3. תיקיית "אתר" עצמה (התמונות הקיימות - ברירת מחדל זמנית)

   כלומר: כדי להחליף תמונה בדף מסוים מספיק להניח בתיקייה "תמונות חדשות לאתר"
   קובץ בשם <slug>-hero.jpg (או .png/.webp) ולהריץ את הסקריפט מחדש.
   אין צורך לגעת בקוד.

   מה נוצר (אל תיקיית אתר/img):
     <slug>-hero.webp      1600px רוחב  - מסכי דסקטופ
     <slug>-hero-sm.webp    820px רוחב  - מובייל
     <slug>-body.webp      1000px רוחב  - תמונת גוף הדף

   איכות WebP 70-72 עם effort 6 - איכות גבוהה מאוד בעין, וכ-85% פחות משקל
   מקובצי ה-JPG המקוריים.
   ════════════════════════════════════════════════════════════════════════════ */

import sharp from 'sharp';
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, basename } from 'node:path';
import { SPECIALIZATIONS } from './specializations.data.mjs';

const ROOT    = dirname(dirname(fileURLToPath(import.meta.url)));   // אתר
const NEWDIR  = join(dirname(ROOT), 'תמונות חדשות לאתר');            // תיקיית התמונות החדשות
const OUTDIR  = join(ROOT, 'img');

const EXT = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tif', '.tiff'];

/* מחזיר נתיב מקור לפי סדר העדיפות שתואר למעלה, או null */
function resolveSource(slug, kind, fallbackName) {
  if (existsSync(NEWDIR)) {
    const files = readdirSync(NEWDIR).filter(f => statSync(join(NEWDIR, f)).isFile());
    /* 1. מוסכמת השמות <slug>-hero / <slug>-body */
    const byConvention = files.find(f =>
      basename(f, extname(f)).toLowerCase() === `${slug}-${kind}` && EXT.includes(extname(f).toLowerCase()));
    if (byConvention) return join(NEWDIR, byConvention);
    /* 2. שם הקובץ שמוגדר בנתונים, אם הונח בתיקייה החדשה */
    if (fallbackName && files.includes(fallbackName)) return join(NEWDIR, fallbackName);
  }
  /* 3. התמונות הקיימות בתיקיית אתר */
  if (fallbackName && existsSync(join(ROOT, fallbackName))) return join(ROOT, fallbackName);
  return null;
}

async function emit(src, out, width, quality = 76) {
  await sharp(src)
    .rotate()                                   // כיבוד EXIF (תמונות מהטלפון)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toFile(out);
  return statSync(out).size;
}

const kb = n => (n / 1024).toFixed(0) + 'KB';

mkdirSync(OUTDIR, { recursive: true });

let totalIn = 0, totalOut = 0, missing = [];

for (const s of SPECIALIZATIONS) {
  const line = [];

  const heroSrc = resolveSource(s.slug, 'hero', s.heroSrc);
  if (heroSrc) {
    const inSize = statSync(heroSrc).size;
    const a = await emit(heroSrc, join(OUTDIR, `${s.slug}-hero.webp`), 1600, 70);
    const b = await emit(heroSrc, join(OUTDIR, `${s.slug}-hero-sm.webp`), 820, 68);
    totalIn += inSize; totalOut += a + b;
    line.push(`hero ${kb(inSize)}→${kb(a)}/${kb(b)}`);
  } else {
    missing.push(`${s.slug} (hero)`);
  }

  const bodySrc = resolveSource(s.slug, 'body', s.bodySrc);
  if (bodySrc) {
    const inSize = statSync(bodySrc).size;
    const a = await emit(bodySrc, join(OUTDIR, `${s.slug}-body.webp`), 1000, 72);
    totalIn += inSize; totalOut += a;
    line.push(`body ${kb(inSize)}→${kb(a)}`);
  } else {
    missing.push(`${s.slug} (body)`);
  }

  console.log(`  ${s.short}`.padEnd(34) + line.join('  ·  '));
}

console.log(`\n✔ סה"כ ${kb(totalIn)} → ${kb(totalOut)}  (${(100 - totalOut / totalIn * 100).toFixed(0)}% חיסכון)`);
if (missing.length) console.log(`⚠ חסרות תמונות: ${missing.join(', ')}`);
