/* ════════════════════════════════════════════════════════════════════════════
   make-review-bundle.mjs — מכין חבילת בקרה חיצונית
   ---------------------------------------------------------------------------
   הרצה:  node _build/make-review-bundle.mjs      (מתוך תיקיית "אתר")

   מייצר קובץ Markdown אחד שמכיל:
     · סקירת ארכיטקטורה והסבר על מערכת דפי ההתמחויות
     · רשימת נושאים פתוחים לבקרה
     · מפת קבצים עם גדלים
     · כל קוד המקור של האתר, קובץ אחרי קובץ

   לא נכלל: ספריות צד-שלישי (nagishli.js), גיבויים (index-old.html),
   תמונות וקבצי מדיה, וכל מה שמוחרג מההעלאה.
   ════════════════════════════════════════════════════════════════════════════ */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, relative } from 'node:path';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const CODE_ONLY = process.argv.includes('--code-only');
const OUT  = join(ROOT, '_build', CODE_ONLY ? 'site-code.md' : 'site-code-review.md');

/* ── מה נכנס ומה לא ─────────────────────────────────────────────────────── */
/* --full כולל גם את ספריית הנגישות של צד שלישי ואת הגיבוי של הדף הישן,
   כדי שהחבילה תכיל פשוט כל קובץ קוד שקיים בתיקיית האתר. */
const FULL = process.argv.includes('--full');

const ALWAYS_SKIP = [
  'site-code.md',
  'site-code-review.md', // התוצרים של הסקריפט הזה - אחרת הוא בולע את עצמו
  'preview.html'         // כלי בדיקה מקומי
];
const SKIP_FILES = new Set(FULL ? ALWAYS_SKIP : [
  ...ALWAYS_SKIP,
  'nagishli.js',        // ווידג'ט נגישות של צד שלישי - 199KB, לא קוד שלנו
  'index-old.html'      // גיבוי של הגרסה הקודמת
]);
const SKIP_DIRS  = new Set(['.git', '.netlify', 'node_modules', 'img', 'svc-photos', 'nl-files', 'חומר מקצועי', 'בקרה']);
const CODE_EXT   = new Set(['.html', '.css', '.js', '.mjs', '.json', '.txt', '.xml', '.md']);
const EXTRA      = ['_headers', '.netlifyignore'];       // קבצים ללא סיומת

const LANG = { '.html': 'html', '.css': 'css', '.js': 'javascript', '.mjs': 'javascript',
               '.json': 'json', '.xml': 'xml', '.md': 'markdown', '.txt': 'text' };

/* ── סקירה שנכתבת לראש המסמך ────────────────────────────────────────────── */
const OVERVIEW = `# בורוביץ מזרחי — קוד האתר לבקרה

מסמך זה מרכז את כל קוד המקור של אתר **bor-miz.co.il** לצורך בקרה חיצונית —
שיווקית, עיצובית וטכנולוגית. הקוד מצורף במלואו בהמשך המסמך.

---

## 1. על האתר

אתר תדמית ומכירות של משרד שמאות מקרקעין. עברית, RTL.

| נושא | פרטים |
|---|---|
| דומיין חי | bor-miz.co.il |
| אחסון | Netlify (העלאה ידנית, לא CI/CD) |
| מבנה | אתר סטטי — HTML/CSS/JS, ללא framework וללא שרת |
| ספריות חיצוניות | jQuery 3.7.1, GSAP 3.12.5 + ScrollTrigger (CDN), nagishli (נגישות) |
| אנליטיקס | Google Analytics 4 — מזהה G-GYNQPGPR33 |
| טפסים | Supabase Edge Function בשם website-lead-intake |
| אבטחה | קובץ \`_headers\` מגדיר CSP, HSTS, X-Frame-Options ועוד |

**הערה על מפתחות:** בדפים מופיע מפתח \`anon\` של Supabase ומזהה GA4.
שניהם מפתחות ציבוריים מעצם הגדרתם, מיועדים לרוץ בדפדפן, ואינם סוד.
אין באתר שום מפתח פרטי.

---

## 2. דפי ההתמחויות — המערכת החדשה

החלק החדש באתר. 9 דפי התמחות הנבנים אוטומטית ממקור נתונים אחד.

### שלושת הקבצים שמרכיבים את המערכת

\`\`\`
_build/specializations.data.mjs    מקור האמת — כל התוכן של 9 הדפים
_build/build-hitmahut.mjs          המחולל — מייצר HTML מהנתונים
_build/optimize-images.mjs         צינור התמונות — המרה ל-WebP בשני גדלים
          ↓
hitmahut/*.html                    9 הדפים שנוצרו (נדרסים בכל build)
hitmahut.css                       גיליון הסגנון של הדפים האלה בלבד
img/*.webp                         התמונות המכווצות
\`\`\`

**חשוב לבקרה:** אין לערוך את הקבצים תחת \`hitmahut/\` — הם תוצר אוטומטי.
כל שינוי תוכן נעשה בקובץ הנתונים, ואחריו מריצים \`node _build/build-hitmahut.mjs\`.

### מבנה אחיד — 8 אזורים בכל דף

1. **Hero** — תמונה בחצי אחד, כותרת ותת-כותרת על פאנל כהה בשני, וואטסאפ + טלפון
2. **אזור הכאב** — כותרת מותאמת אישית לכל דף (אין כותרת שבלונית)
3. **למי השירות מיועד** — 3 בולטים
4. **תהליך העבודה** — 4 שלבים בציר אופקי
5. **מה מקבלים ביד** — התוצר + תמונה + פס קבוע "בחזית הפסיקה"
6. **שאלות נפוצות** — אקורדיון, לפחות 2 שאלות
7. **הוכחות מהשטח והעמקה** — *רכיב מותנה*
8. **הנעה לפעולה**

### רנדור מותנה

אזור 7 נבנה רק אם קיים לו תוכן בנתונים. כשאין — **הוא לא נכתב ל-HTML כלל**,
ולא מוסתר ב-CSS. אין רווח ריק ואין כותרת יתומה. שלושה סוגי תוכן אפשריים:

| שדה | מה זה | איפה קיים היום |
|---|---|---|
| \`wins\` | הכרעות שמאי מכריע שניהל המשרד, עם הורדה בלחיצה | היטל השבחה בלבד |
| \`official\` | מסמך/מאגר ממשלתי רשמי | היטל השבחה, כדאיות כלכלית |
| \`article\` | מאמר מקצועי באתר | היטל השבחה בלבד |

כל קישור חיצוני נכתב עם \`target="_blank" rel="noopener noreferrer"\`.

### עיצוב

ערכת נושא כהה-יוקרתית, נפרדת משאר האתר: רקע נייבי \`#0a111f\`, אזורים
מתחלפים \`#0e1829\`, זהב שמפניה \`#e4c987\`. כל הסלקטורים ממודרים תחת
\`.spec-page\` או בקידומת \`.sp-\`, כך ש-\`hitmahut.css\` לא משפיע על אף דף אחר.

### תמונות

\`optimize-images.mjs\` ממיר כל תמונה ל-WebP בשלוש גרסאות: באנר 1600px,
באנר מובייל 820px, ותמונת גוף 1000px. הדפים משתמשים ב-\`srcset\`/\`sizes\`
ו-\`preload\` לבאנר. המרה אחרונה: כ-5.4MB מקור → כ-1.3MB.

להחלפת תמונה מניחים קובץ בשם \`<slug>-hero.jpg\` או \`<slug>-body.jpg\`
בתיקייה "תמונות חדשות לאתר" ומריצים מחדש — אין צורך לגעת בקוד.

---

## 3. נושאים פתוחים — רלוונטי לבקרה

נושאים שהמשרד מודע להם, לא תקלות שהתגלו:

1. **דפי ההתמחויות עדיין לא פורסמו.** הם קיימים רק מקומית, וכולם מסומנים
   \`noindex,nofollow\` — כמו שאר דפי השירות באתר.
2. **כרטיסי "תחומי התמחות" בדף הבית עדיין לא מקושרים אליהם.** חמישה
   מהכרטיסים נושאים תווית "בקרוב".
3. **7 מתוך 9 דפים ללא מאמר מקצועי.** הכותרות המתוכננות שמורות בשדה
   \`plannedArticle\` ואינן מרונדרות, כדי לא לייצר קישורים שבורים.
4. **דפי Landing ישנים** (\`landing-*.html\`) נבנו לקמפיינים ממומנים
   ואינם תואמים את שפת העיצוב הנוכחית.
5. **קובץ \`sitemap.xml\` אינו כולל את דפי ההתמחויות** — בכוונה, כל עוד
   הם \`noindex\`.

### ממצא ביצועים — טופל

בתיקייה \`svc-photos/\` היו שמונה קובצי PNG ששירתו את ויזואלי ההובר באזור
"תחומי התמחות" בדף הבית, במשקל 7.5MB עד 10.3MB כל אחד — **70MB בסך הכל**.

הקבצים נטענו ב-\`loading="lazy"\`, כך שזמן הטעינה הראשוני לא נפגע, אבל כל
גולש שהגיע לאזור השירותים התחיל להוריד אותם. בגלישה סלולרית זה משמעותי.

**התיקון שבוצע:** המרה ל-WebP בגודל התצוגה בפועל. הפאנל בדף הבית הוא
כ-360x740 פיקסלים והתמונה ממולאת ב-\`object-fit: cover\`, ולכן הגובה הוא
הממד הקובע. גובה היעד נקבע ל-1480px (פי 2, לתמיכה ב-retina) והרוחב נחתך
ל-1200px לכל היותר.

**התוצאה: 70MB → 1.2MB, חיסכון של 98.3%.** הסקריפט נמצא ב-
\`_build/optimize-svc-photos.mjs\`. קובצי ה-PNG המקוריים נשמרו על הדיסק
כמאסטרים ומוחרגים מההעלאה דרך \`.netlifyignore\`.

השינוי היחיד בקוד היה סיומת הקובץ ב-\`index.html\` (\`.png\` ← \`.webp\`),
בתוספת \`decoding="async"\`.

---

## 4. מה נשמח לקבל מהבקרה

**שיווקית/עיצובית:** האם מבנה 8 האזורים מוביל להמרה? האם הכותרות והטקסטים
מדברים בשפת הלקוח? האם ה-CTA ממוקם נכון? האם התמונות משרתות את המסר?

**טכנולוגית:** נכונות ה-HTML הסמנטי, נגישות (a11y), ביצועים וזמני טעינה,
SEO טכני ו-schema.org, איכות ותחזוקתיות של מערכת ה-build.

---
`;

/* ── איסוף קבצים ────────────────────────────────────────────────────────── */
function collect(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (SKIP_DIRS.has(name)) continue;
      collect(full, acc);
    } else {
      if (SKIP_FILES.has(name)) continue;
      const ok = CODE_EXT.has(extname(name).toLowerCase()) || EXTRA.includes(name);
      if (ok) acc.push(full);
    }
  }
  return acc;
}

/* סדר הצגה: קודם המערכת החדשה, אחר כך שאר האתר */
const ORDER = [
  ['מערכת דפי ההתמחויות — קוד המקור', f => f.includes('_build') || f.endsWith('hitmahut.css')],
  ['דפי ההתמחויות שנוצרו',            f => f.includes(`hitmahut${/[\\/]/.source}`) || /hitmahut[\\/]/.test(f)],
  ['דף הבית וגיליונות הסגנון',        f => /(index\.html|styles\.css|page\.css)$/.test(f)],
  ['שאר דפי האתר',                    f => f.endsWith('.html')],
  ['תצורה, SEO ושונות',               () => true]
];

const files = collect(ROOT).sort();
const kb = n => (n / 1024).toFixed(1) + 'KB';

const groups = ORDER.map(([title, test]) => ({ title, test, items: [] }));
for (const f of files) {
  const g = groups.find(g => g.test(f));
  g.items.push(f);
}

/* ── בניית המסמך ────────────────────────────────────────────────────────── */
const CODE_ONLY_HEAD = [
  '# בורוביץ מזרחי — קוד האתר',
  '',
  'כל קוד המקור של bor-miz.co.il' + (FULL ? ', כולל כל דפי המשנה, הנספחים וספריית הנגישות.' : '.'),
  FULL ? 'לא נכללים קבצי מדיה בלבד (תמונות, לוגואים).'
       : 'לא נכללים: ספריות צד-שלישי (nagishli.js), תמונות וקבצי מדיה.',
  ''
].join('\n');

/* ── מפת ניווט: אילו דפים נגישים בפועל מתוך האתר ────────────────────────── */
function navMap() {
  const relp = p => relative(ROOT, p).replace(/\\/g, '/');
  const htmlOnDisk = collect(ROOT).filter(f => f.endsWith('.html')).map(relp);
  const seen = new Set(['index.html']);
  const queue = ['index.html'];
  while (queue.length) {
    const page = queue.shift();
    const file = join(ROOT, page);
    if (!existsSync(file)) continue;
    const base = page.includes('/') ? page.slice(0, page.lastIndexOf('/')) : '';
    for (const m of readFileSync(file, 'utf8').matchAll(/href\s*=\s*"([^"]+)"/g)) {
      const raw = m[1];
      if (/^(https?:|mailto:|tel:|#|data:|javascript:)/i.test(raw)) continue;
      const clean = raw.split('#')[0].split('?')[0];
      if (!clean.endsWith('.html')) continue;
      let t = clean.startsWith('/') ? clean.slice(1) : (base ? base + '/' + clean : clean);
      t = t.replace(/[^/]+\/\.\.\//g, '').replace(/^\.\//, '');
      if (!seen.has(t) && existsSync(join(ROOT, t))) { seen.add(t); queue.push(t); }
    }
  }
  const NOTE = {
    'index-old.html': 'גיבוי של הדף הישן · מוחרג מההעלאה',
    'intake.html':    'טופס איסוף פרטים · נשלח בקישור ישיר, לא מקושר מהאתר',
    'landing-hasgot-rmi.html': 'דף נחיתה לקמפיין ממומן',
    'landing-hitel-hashbacha.html': 'דף נחיתה לקמפיין ממומן',
    'landing-shoma-hakla it.html': 'דף נחיתה לקמפיין ממומן',
    'landing-shovi-shuk.html': 'דף נחיתה לקמפיין ממומן'
  };
  let t = `\n## ${CODE_ONLY ? '' : ''}מפת הדפים\n\n`;
  t += `נסרקו כל הקישורים הפנימיים החל מ-\`index.html\`. `;
  t += `${seen.size} מתוך ${htmlOnDisk.length} דפי ה-HTML נגישים בניווט מהאתר.\n\n`;
  t += '| דף | נגיש מהאתר | הערה |\n|---|---|---|\n';
  for (const p of htmlOnDisk.sort()) {
    t += `| \`${p}\` | ${seen.has(p) ? '✔' : '—'} | ${NOTE[p] || (seen.has(p) ? '' : 'אינו מקושר מאף דף')} |\n`;
  }
  return t + '\n';
}

let md = CODE_ONLY ? CODE_ONLY_HEAD : OVERVIEW;
let totalBytes = 0;

md += `\n## ${CODE_ONLY ? '' : '5. '}מפת הקבצים\n\n| קובץ | גודל | שורות |\n|---|---|---|\n`;
for (const g of groups) {
  if (!g.items.length) continue;
  md += `| **${g.title}** | | |\n`;
  for (const f of g.items) {
    const src = readFileSync(f, 'utf8');
    totalBytes += Buffer.byteLength(src);
    md += `| \`${relative(ROOT, f).replace(/\\/g, '/')}\` | ${kb(Buffer.byteLength(src))} | ${src.split('\n').length} |\n`;
  }
}
md += `\n**סה"כ: ${files.length} קבצים, ${kb(totalBytes)} קוד.**\n`;
md += navMap();
md += `\n---\n\n# ${CODE_ONLY ? '' : '6. '}קוד המקור\n`;

for (const g of groups) {
  if (!g.items.length) continue;
  md += `\n---\n\n## ${g.title}\n`;
  for (const f of g.items) {
    const rel = relative(ROOT, f).replace(/\\/g, '/');
    const src = readFileSync(f, 'utf8');
    const lang = LANG[extname(f).toLowerCase()] || 'text';
    md += `\n### \`${rel}\`\n\n`;
    md += '```' + lang + '\n' + src.replace(/```/g, '`‌``') + '\n```\n';
  }
}

writeFileSync(OUT, md, 'utf8');
console.log(`✔ ${relative(ROOT, OUT)}`);
console.log(`  ${files.length} קבצים · ${kb(Buffer.byteLength(md))} סה"כ`);
for (const g of groups) if (g.items.length) console.log(`  · ${g.title}: ${g.items.length}`);
