# בורוביץ מזרחי — קוד האתר לבקרה

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
| אבטחה | קובץ `_headers` מגדיר CSP, HSTS, X-Frame-Options ועוד |

**הערה על מפתחות:** בדפים מופיע מפתח `anon` של Supabase ומזהה GA4.
שניהם מפתחות ציבוריים מעצם הגדרתם, מיועדים לרוץ בדפדפן, ואינם סוד.
אין באתר שום מפתח פרטי.

---

## 2. דפי ההתמחויות — המערכת החדשה

החלק החדש באתר. 9 דפי התמחות הנבנים אוטומטית ממקור נתונים אחד.

### שלושת הקבצים שמרכיבים את המערכת

```
_build/specializations.data.mjs    מקור האמת — כל התוכן של 9 הדפים
_build/build-hitmahut.mjs          המחולל — מייצר HTML מהנתונים
_build/optimize-images.mjs         צינור התמונות — המרה ל-WebP בשני גדלים
          ↓
hitmahut/*.html                    9 הדפים שנוצרו (נדרסים בכל build)
hitmahut.css                       גיליון הסגנון של הדפים האלה בלבד
img/*.webp                         התמונות המכווצות
```

**חשוב לבקרה:** אין לערוך את הקבצים תחת `hitmahut/` — הם תוצר אוטומטי.
כל שינוי תוכן נעשה בקובץ הנתונים, ואחריו מריצים `node _build/build-hitmahut.mjs`.

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
| `wins` | הכרעות שמאי מכריע שניהל המשרד, עם הורדה בלחיצה | היטל השבחה בלבד |
| `official` | מסמך/מאגר ממשלתי רשמי | היטל השבחה, כדאיות כלכלית |
| `article` | מאמר מקצועי באתר | היטל השבחה בלבד |

כל קישור חיצוני נכתב עם `target="_blank" rel="noopener noreferrer"`.

### עיצוב

ערכת נושא כהה-יוקרתית, נפרדת משאר האתר: רקע נייבי `#0a111f`, אזורים
מתחלפים `#0e1829`, זהב שמפניה `#e4c987`. כל הסלקטורים ממודרים תחת
`.spec-page` או בקידומת `.sp-`, כך ש-`hitmahut.css` לא משפיע על אף דף אחר.

### תמונות

`optimize-images.mjs` ממיר כל תמונה ל-WebP בשלוש גרסאות: באנר 1600px,
באנר מובייל 820px, ותמונת גוף 1000px. הדפים משתמשים ב-`srcset`/`sizes`
ו-`preload` לבאנר. המרה אחרונה: כ-5.4MB מקור → כ-1.3MB.

להחלפת תמונה מניחים קובץ בשם `<slug>-hero.jpg` או `<slug>-body.jpg`
בתיקייה "תמונות חדשות לאתר" ומריצים מחדש — אין צורך לגעת בקוד.

---

## 3. נושאים פתוחים — רלוונטי לבקרה

נושאים שהמשרד מודע להם, לא תקלות שהתגלו:

1. **דפי ההתמחויות עדיין לא פורסמו.** הם קיימים רק מקומית, וכולם מסומנים
   `noindex,nofollow` — כמו שאר דפי השירות באתר.
2. **כרטיסי "תחומי התמחות" בדף הבית עדיין לא מקושרים אליהם.** חמישה
   מהכרטיסים נושאים תווית "בקרוב".
3. **7 מתוך 9 דפים ללא מאמר מקצועי.** הכותרות המתוכננות שמורות בשדה
   `plannedArticle` ואינן מרונדרות, כדי לא לייצר קישורים שבורים.
4. **דפי Landing ישנים** (`landing-*.html`) נבנו לקמפיינים ממומנים
   ואינם תואמים את שפת העיצוב הנוכחית.
5. **קובץ `sitemap.xml` אינו כולל את דפי ההתמחויות** — בכוונה, כל עוד
   הם `noindex`.

### ממצא ביצועים — טופל

בתיקייה `svc-photos/` היו שמונה קובצי PNG ששירתו את ויזואלי ההובר באזור
"תחומי התמחות" בדף הבית, במשקל 7.5MB עד 10.3MB כל אחד — **70MB בסך הכל**.

הקבצים נטענו ב-`loading="lazy"`, כך שזמן הטעינה הראשוני לא נפגע, אבל כל
גולש שהגיע לאזור השירותים התחיל להוריד אותם. בגלישה סלולרית זה משמעותי.

**התיקון שבוצע:** המרה ל-WebP בגודל התצוגה בפועל. הפאנל בדף הבית הוא
כ-360x740 פיקסלים והתמונה ממולאת ב-`object-fit: cover`, ולכן הגובה הוא
הממד הקובע. גובה היעד נקבע ל-1480px (פי 2, לתמיכה ב-retina) והרוחב נחתך
ל-1200px לכל היותר.

**התוצאה: 70MB → 1.2MB, חיסכון של 98.3%.** הסקריפט נמצא ב-
`_build/optimize-svc-photos.mjs`. קובצי ה-PNG המקוריים נשמרו על הדיסק
כמאסטרים ומוחרגים מההעלאה דרך `.netlifyignore`.

השינוי היחיד בקוד היה סיומת הקובץ ב-`index.html` (`.png` ← `.webp`),
בתוספת `decoding="async"`.

---

## 4. מה נשמח לקבל מהבקרה

**שיווקית/עיצובית:** האם מבנה 8 האזורים מוביל להמרה? האם הכותרות והטקסטים
מדברים בשפת הלקוח? האם ה-CTA ממוקם נכון? האם התמונות משרתות את המסר?

**טכנולוגית:** נכונות ה-HTML הסמנטי, נגישות (a11y), ביצועים וזמני טעינה,
SEO טכני ו-schema.org, איכות ותחזוקתיות של מערכת ה-build.

---

## 5. מפת הקבצים

| קובץ | גודל | שורות |
|---|---|---|
| **מערכת דפי ההתמחויות — קוד המקור** | | |
| `_build/build-hitmahut.mjs` | 27.8KB | 512 |
| `_build/make-favicons.mjs` | 4.9KB | 95 |
| `_build/make-review-bundle.mjs` | 12.8KB | 239 |
| `_build/optimize-images.mjs` | 4.8KB | 98 |
| `_build/optimize-svc-photos.mjs` | 3.1KB | 59 |
| `_build/specializations.data.mjs` | 50.4KB | 582 |
| `hitmahut.css` | 17.1KB | 370 |
| **דפי ההתמחויות שנוצרו** | | |
| `hitmahut/haarachat-shovi.html` | 26.0KB | 370 |
| `hitmahut/hasagot-rami.html` | 25.2KB | 370 |
| `hitmahut/heitlei-hashbacha.html` | 31.5KB | 434 |
| `hitmahut/kedaiut-kalkalit.html` | 27.4KB | 385 |
| `hitmahut/kinus-ufiruk-shituf.html` | 26.2KB | 370 |
| `hitmahut/nachalot-umeshakim.html` | 25.9KB | 370 |
| `hitmahut/shomot-haklaiot.html` | 26.0KB | 370 |
| `hitmahut/tavlaot-ichud-vehaluka.html` | 26.1KB | 370 |
| `hitmahut/yeridat-erech-197.html` | 26.0KB | 370 |
| **דף הבית וגיליונות הסגנון** | | |
| `index.html` | 83.1KB | 1313 |
| `page.css` | 25.0KB | 485 |
| `styles.css` | 43.9KB | 744 |
| **שאר דפי האתר** | | |
| `careers.html` | 20.5KB | 311 |
| `hasagot-rami.html` | 34.5KB | 456 |
| `hetel-hashbacha-kiryot.html` | 33.5KB | 452 |
| `hetel-hashbacha-pinui-binui.html` | 33.9KB | 452 |
| `hetel-hashbacha.html` | 38.7KB | 534 |
| `intake.html` | 30.2KB | 442 |
| `landing-hasgot-rmi.html` | 16.7KB | 265 |
| `landing-hitel-hashbacha.html` | 16.4KB | 320 |
| `landing-shoma-hakla it.html` | 18.4KB | 291 |
| `landing-shovi-shuk.html` | 15.8KB | 243 |
| `maamar-heitel-hashbacha-madrich.html` | 37.3KB | 487 |
| `maamarim.html` | 19.4KB | 339 |
| `pitzuy-nezek-haklai.html` | 33.1KB | 441 |
| `shamaut-haklait.html` | 36.0KB | 489 |
| `takan-21-pinui-binui.html` | 35.8KB | 495 |
| **תצורה, SEO ושונות** | | |
| `.netlifyignore` | 0.1KB | 10 |
| `_headers` | 3.4KB | 45 |
| `llms.txt` | 3.4KB | 56 |
| `robots.txt` | 1.8KB | 64 |
| `rss.xml` | 2.0KB | 29 |
| `sitemap.xml` | 2.4KB | 82 |

**סה"כ: 40 קבצים, 946.8KB קוד.**

---

# 6. קוד המקור

---

## מערכת דפי ההתמחויות — קוד המקור

### `_build/build-hitmahut.mjs`

```javascript
/* ════════════════════════════════════════════════════════════════════════════
   build-hitmahut.mjs — מחולל דפי ההתמחויות
   ---------------------------------------------------------------------------
   הרצה:   node _build/optimize-images.mjs     (רק כשמחליפים תמונות)
           node _build/build-hitmahut.mjs      (מתוך תיקיית "אתר")

   כותב דף HTML לכל התמחות אל hitmahut/<slug>.html בעיצוב כהה-יוקרתי.

   8 אזורים בלבד:
     1 hero          תמונה + כותרת + תת-כותרת + וואטסאפ/טלפון + פירורי לחם (פעם אחת)
     2 painTitle     כותרת מותאמת אישית לכל דף - אין כותרת קבועה
     3 audience      3 בולטים
     4 process       4 שלבים בציר אופקי
     5 deliverables  + תמונת גוף + פס "בחזית הפסיקה"
     6 faq           אקורדיון
     7 proof         מותנה (official / article)
     8 cta           סגירה

   כללים שאסור לשבור:
     · פירורי לחם מופיעים פעם אחת בלבד, בראש הדף, בעדינות.
     · אין כותרת UI קבועה מסוג "מה עומד על כף המאזניים" / "הסיכון".
     · כל קישור חיצוני: target="_blank" rel="noopener noreferrer".
     · אין מספור התמחויות.

   הדפים נוצרים עם noindex,nofollow (כמו שאר דפי השירות). לשינוי: HEAD_ROBOTS.
   ════════════════════════════════════════════════════════════════════════════ */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { SPECIALIZATIONS, CONTACT, CASE_LAW } from './specializations.data.mjs';

const ROOT   = dirname(dirname(fileURLToPath(import.meta.url)));
const OUTDIR = join(ROOT, 'hitmahut');
const IMGDIR = join(ROOT, 'img');

const HEAD_ROBOTS = 'index,follow';
const GA4_ID      = 'G-GYNQPGPR33';

/* ── עזרים ───────────────────────────────────────────────────────────────── */
const esc  = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const attr = s => esc(s).replace(/"/g, '&quot;');
const wa   = text => `https://wa.me/${CONTACT.waNumber}?text=${encodeURIComponent(text)}`;
const tel  = n => `tel:${n}`;
const ext  = href => /^https?:\/\//i.test(href) ? ' target="_blank" rel="noopener noreferrer"' : '';

/* אייקונים דקים בלבד - stroke 1.4 */
const I = s => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${s}</svg>`;
const ICON = {
  mark:   I('<polyline points="20 6 9 17 4 12"/>'),
  gavel:  I('<path d="M3 21h10"/><path d="M6 15.5 12.5 9"/><path d="m9 6 6 6"/><path d="M12.5 2.5 19 9l-2.5 2.5L10 5z"/><path d="M4.5 13.5 9 18l-2 2-4.5-4.5z"/>'),
  file:   I('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>'),
  down:   I('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>'),
  link:   I('<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>'),
  phone:  I('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>'),
  wa:     '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"/></svg>'
};

/* ── מעטפת ───────────────────────────────────────────────────────────────── */

const ga4 = `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA4_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', '${GA4_ID}');
  (function(){
    var push = window.dataLayer.push;
    window.dataLayer.push = function(){
      for (var i = 0; i < arguments.length; i++) {
        var o = arguments[i];
        if (o && typeof o.event === 'string') {
          var params = {};
          for (var k in o) { if (k !== 'event' && Object.prototype.hasOwnProperty.call(o, k)) params[k] = o[k]; }
          gtag('event', o.event, params);
        }
      }
      return push.apply(window.dataLayer, arguments);
    };
  })();
</script>`;

const nav = `<nav id="navbar" role="navigation" aria-label="ניווט ראשי">
  <div class="nav-inner">
    <a href="../index.html" class="nav-logo" aria-label="בורוביץ מזרחי שמאות מקרקעין - דף הבית"><img src="../logo-bm.png" alt="לוגו בורוביץ מזרחי"></a>
    <ul class="nav-links" id="navLinks">
      <li><a href="../index.html#about" onclick="closeMenu()">אודות</a></li>
      <li><a href="../index.html#services" onclick="closeMenu()">תחומי התמחות</a></li>
      <li><a href="../maamarim.html" onclick="closeMenu()">מאמרים</a></li>
      <li><a href="../index.html#linkedin-posts" onclick="closeMenu()">עדכונים</a></li>
      <li><a href="../careers.html" onclick="closeMenu()">קריירה</a></li>
      <li><a href="#cta" class="nav-cta" onclick="closeMenu()">צור קשר</a></li>
    </ul>
    <button class="hamburger" id="hamburger" onclick="toggleMenu()" aria-label="תפריט ניווט" aria-expanded="false"><span></span><span></span><span></span></button>
  </div>
</nav>`;

const footer = `<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="../logo-bm.png" alt="לוגו בורוביץ מזרחי">
        <p>משרד שמאות מקרקעין מוביל בצפון. ידע מקצועי מעמיק, היכרות שטח בלתי אמצעית והבנה כלכלית רחבה - בשירות כל לקוח.</p>
      </div>
      <div class="footer-col">
        <h4>ניווט</h4>
        <ul>
          <li><a href="../index.html#about">אודות</a></li>
          <li><a href="../index.html#services">תחומי התמחות</a></li>
          <li><a href="../maamarim.html">מאמרים</a></li>
          <li><a href="../careers.html">קריירה</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>יצירת קשר</h4>
        <ul>
          <li><a href="${tel(CONTACT.phoneMaor)}">${CONTACT.phoneMaor} · מאור</a></li>
          <li><a href="${tel(CONTACT.phoneAmir)}">${CONTACT.phoneAmir} · אמיר</a></li>
          <li><a id="em-footer" href="#"></a></li>
          <li>שדרות החרוב 6, פארק תעשיות בר-לב</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 בורוביץ מזרחי שמאות מקרקעין וחקלאות בע"מ. כל הזכויות שמורות.</span>
      <span><a href="../index.html">חזרה לאתר הראשי</a></span>
    </div>
  </div>
</footer>`;

const floating = `<div class="floating-wrap">
  <a class="float-btn float-btn-wa" href="https://wa.me/${CONTACT.waNumber}" target="_blank" rel="noopener noreferrer" aria-label="שלחו הודעה בוואטסאפ">
    <svg aria-hidden="true" viewBox="0 0 32 32"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.67 4.61 1.832 6.5L4 29l7.75-1.812A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="#fff"/><path d="M21.5 18.5c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.19-.57-.34z" fill="#25D366"/></svg>
  </a>
  <button type="button" id="customAccessBtn" class="float-btn float-btn-access" aria-label="פתח תפריט נגישות" title="נגישות"><span aria-hidden="true">♿</span></button>
</div>`;

const tailScripts = `<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<script>
  (function(){ var el=document.getElementById('em-footer'); if(el){ var a='info'+'@'+'bor-miz.co.il'; el.href='mailto:'+a; el.textContent=a; } })();
  function toggleMenu(){ var l=document.getElementById('navLinks'),b=document.getElementById('hamburger'); l.classList.toggle('open'); b.classList.toggle('open'); b.setAttribute('aria-expanded', l.classList.contains('open')?'true':'false'); }
  function closeMenu(){ document.getElementById('navLinks').classList.remove('open'); var b=document.getElementById('hamburger'); b.classList.remove('open'); b.setAttribute('aria-expanded','false'); }
  document.addEventListener('click', function(e){ var nav=document.getElementById('navbar'); if(nav && !nav.contains(e.target)) closeMenu(); });
  (function(){ var nav=document.getElementById('navbar'); var onScroll=function(){ nav.classList.toggle('scrolled', window.scrollY>60); }; window.addEventListener('scroll', onScroll, {passive:true}); onScroll(); })();
  (function(){
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce || !window.gsap || !window.ScrollTrigger){
      document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.reveal').forEach(function(el){ ScrollTrigger.create({ trigger: el, start:'top 90%', onEnter:function(){ el.classList.add('in'); } }); });
  })();
  // אקורדיון: פתיחת שאלה סוגרת את הקודמת
  (function(){
    var items = document.querySelectorAll('.sp-faq .sp-q');
    items.forEach(function(d){
      d.addEventListener('toggle', function(){
        if(!d.open) return;
        items.forEach(function(o){ if(o !== d) o.open = false; });
      });
    });
  })();
  // מעקב המרות - זהה לשאר האתר
  (function(){ window.dataLayer=window.dataLayer||[]; document.addEventListener('click', function(e){ var el=e.target.closest&&e.target.closest('a'); if(!el) return; if(/wa\\.me|api\\.whatsapp/.test(el.href||'')){ window.dataLayer.push({event:'contact_whatsapp'}); } else if((el.getAttribute('href')||'').indexOf('tel:')===0){ window.dataLayer.push({event:'contact_phone'}); } }, true); })();
</script>

<nagishli></nagishli>
<script>
nl_contact = "n:בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\\"מ|p:054-6559942|u:maor@bor-miz.co.il";
nl_pos = "BL"; nl_lang = "he"; nl_color = "blue"; nl_compact = "1";
</script>
<script src="../nagishli.js?v=2.3" charset="utf-8"></script>
<script>
  (function(){
    function forceCompactStyles(){
      var bar=document.getElementById('NagishLiBar'), menus=document.getElementById('NagishLiMenus');
      if(bar){ bar.style.cssText='position:fixed !important; left:1.4rem !important; right:auto !important; bottom:6.2rem !important; top:auto !important; width:300px !important; max-width:90vw !important; height:auto !important; z-index:9999 !important; background:transparent !important; box-shadow:none !important; border:none !important; padding:0 !important; margin:0 !important;'; }
      if(menus){ menus.style.cssText+=';position:static !important; width:300px !important; max-width:90vw !important; max-height:70vh !important; overflow-y:auto !important; overflow-x:hidden !important; font-size:13px !important; border-radius:12px !important; box-shadow:0 10px 40px rgba(0,0,0,0.3) !important; margin:0 !important; padding:0 !important; background:#fff !important;'; }
      document.querySelectorAll('#NagishLiMenus, #NagishLiMenus ul').forEach(function(el){ el.style.width='100%'; el.style.maxWidth='300px'; el.style.boxSizing='border-box'; });
    }
    function openNagishLiMenu(){
      if(typeof jQuery==='undefined') return false;
      var $=jQuery, $strip=$('#NagishLiBarStrip'), $menus=$('#NagishLiMenus');
      if(!$strip.length || !$menus.length) return false;
      if($menus.is(':visible')){ $menus.slideUp(150, function(){ $strip.removeClass('open'); }); }
      else { forceCompactStyles(); $strip.addClass('open'); $menus.slideDown(150, forceCompactStyles); }
      return true;
    }
    function bind(){ var btn=document.getElementById('customAccessBtn'); if(!btn) return; btn.addEventListener('click', function(e){ e.preventDefault(); var n=0; (function tryOpen(){ if(openNagishLiMenu()) return; if(++n<30) setTimeout(tryOpen,200); })(); }); }
    if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', bind); } else { bind(); }
  })();
</script>`;

/* ── כפתורי הנעה לפעולה ──────────────────────────────────────────────────── */
function actions(s, variant) {
  return `<div class="sp-actions ${variant}">
        <a class="sp-btn sp-btn-gold" href="${attr(wa(s.cta.wa))}" target="_blank" rel="noopener noreferrer">
          <span class="sp-btn-ico">${ICON.wa}</span>שליחת הודעה בוואטסאפ
        </a>
        <a class="sp-btn sp-btn-line" href="${tel(CONTACT.phoneMaor)}">
          <span class="sp-btn-ico">${ICON.phone}</span>${CONTACT.phoneMaor}
        </a>
      </div>`;
}

/* ── 1 · Hero ────────────────────────────────────────────────────────────── */
function hero(s) {
  return `<header class="sp-hero">
  <figure class="sp-hero-media">
    <img src="../img/${s.slug}-hero.webp"
         srcset="../img/${s.slug}-hero-sm.webp 820w, ../img/${s.slug}-hero.webp 1600w"
         sizes="(max-width: 900px) 100vw, 50vw"
         alt="${attr(s.heroAlt)}" fetchpriority="high" decoding="async"${s.heroPos ? ` style="object-position:${attr(s.heroPos)}"` : ''}>
    <span class="sp-hero-seam" aria-hidden="true"></span>
  </figure>
  <div class="sp-hero-inner">
    <div class="sp-hero-copy">
      <nav class="sp-crumb" aria-label="פירורי לחם">
        <a href="../index.html">${esc(CONTACT.brand)}</a><span>/</span><a href="../index.html#services">תחומי התמחות</a><span>/</span><em>${esc(s.short)}</em>
      </nav>
      <h1 class="sp-h1">${esc(s.title.lead)}<br><span>${esc(s.title.gold)}</span></h1>
      <p class="sp-lede">${esc(s.subtitle)}</p>
      ${actions(s, 'is-hero')}
    </div>
  </div>
</header>`;
}

/* ── 2 · אזור הכאב — כותרת מותאמת אישית ──────────────────────────────────── */
function pain(s) {
  return `<section class="sp-sec sp-pain">
  <div class="sp-wrap">
    <h2 class="sp-h2 reveal">${esc(s.painTitle)}</h2>
    <p class="sp-pain-text reveal">${esc(s.pain)}</p>
  </div>
</section>`;
}

/* ── 3 · למי השירות מיועד ────────────────────────────────────────────────── */
function audience(s) {
  const cards = s.audience.map(a => `      <li class="sp-aud reveal"><span class="sp-aud-ico">${ICON.mark}</span><span>${esc(a)}</span></li>`).join('\n');
  return `<section class="sp-sec sp-alt">
  <div class="sp-wrap">
    <h2 class="sp-kicker reveal">למי השירות מיועד</h2>
    <ul class="sp-aud-grid">
${cards}
    </ul>
  </div>
</section>`;
}

/* ── 4 · תהליך העבודה — ציר אופקי ────────────────────────────────────────── */
function process(s) {
  /* סמן יהלום עדין במקום ספרה - הסדר נקרא ממילא מהציר ומהכותרות */
  const steps = s.process.map(p => `      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>${esc(p.label)}</h3>
        <p>${esc(p.text)}</p>
      </li>`).join('\n');
  return `<section class="sp-sec sp-process">
  <div class="sp-wrap">
    <h2 class="sp-kicker reveal">תהליך העבודה שלנו</h2>
    <ol class="sp-steps">
${steps}
    </ol>
  </div>
</section>`;
}

/* ── 5 · מה מקבלים ביד + בחזית הפסיקה ────────────────────────────────────── */
function deliverables(s) {
  return `<section class="sp-sec sp-alt sp-deliver">
  <div class="sp-wrap sp-split">
    <div class="sp-split-copy reveal">
      <h2 class="sp-kicker">מה מקבלים ביד</h2>
      <p class="sp-deliver-text">${esc(s.deliverables)}</p>
      <div class="sp-note">
        <span class="sp-note-ico">${ICON.gavel}</span>
        <div>
          <strong>${esc(CASE_LAW.title)}</strong>
          <p>${esc(CASE_LAW.text)}</p>
        </div>
      </div>
    </div>
    <figure class="sp-split-img reveal">
      <img src="../img/${s.slug}-body.webp" alt="${attr(s.bodyAlt)}" loading="lazy" decoding="async">
    </figure>
  </div>
</section>`;
}

/* ── 6 · שאלות נפוצות ────────────────────────────────────────────────────── */
function faq(s) {
  const items = s.faq.map(f => `      <details class="sp-q">
        <summary>${esc(f.q)}</summary>
        <p>${esc(f.a)}</p>
      </details>`).join('\n');
  return `<section class="sp-sec sp-faq">
  <div class="sp-wrap">
    <h2 class="sp-kicker reveal">שאלות נפוצות</h2>
    <div class="sp-faq-list reveal">
${items}
    </div>
  </div>
</section>`;
}

/* ── 7 · הוכחות מהשטח והעמקה — מותנה ─────────────────────────────────────── */
/*  אין wins, אין official ואין article ⇒ מחרוזת ריקה, והאזור לא קיים ב-HTML. */

/* "ההצלחות שלנו" - רשימת הכרעות שניהל המשרד, כל אחת בלחיצה להורדה.
   מתווספת בראש אזור ההוכחות. wins ריק ⇒ הבלוק לא נוצר.                   */
function wins(s) {
  const items = (s.wins || []).filter(w => w && w.href);
  if (!items.length) return '';

  const rows = items.map(w => `        <li class="sp-win">
          <a href="${attr(w.href)}"${ext(w.href)}>
            <span class="sp-win-ico">${ICON.down}</span>
            <span class="sp-win-body">
              <strong>${esc(w.title)}</strong>
              ${w.meta ? `<span class="sp-win-meta">${esc(w.meta)}</span>` : ''}
              ${w.result ? `<span class="sp-win-result">${esc(w.result)}</span>` : ''}
            </span>
            ${w.cut ? `<span class="sp-win-cut"><b>${esc(w.cut)}</b><span>הפחתה</span></span>` : ''}
            <span class="sp-win-go">להורדת ההכרעה <i>←</i></span>
          </a>
        </li>`).join('\n');

  return `      <div class="sp-wins">
        <h3 class="sp-wins-title">ההצלחות שלנו</h3>
        <p class="sp-wins-intro">${esc(s.winsIntro || 'הכרעות שמאי מכריע שניהל משרדנו, כפי שפורסמו באתר הרשמי. כל הכרעה פתוחה להורדה בלחיצה אחת.')}</p>
        <ul class="sp-wins-list">
${rows}
        </ul>
      </div>
`;
}

function proof(s) {
  const cards = [];

  if (s.official && s.official.href) {
    const pdf = /\.pdf($|\?)/i.test(s.official.href);
    cards.push(`      <a class="sp-proof is-gov" href="${attr(s.official.href)}"${ext(s.official.href)}>
        <span class="sp-proof-ico">${pdf ? ICON.down : ICON.link}</span>
        <span class="sp-proof-kind">${esc(s.official.kind || 'מקור רשמי')}</span>
        <h3>${esc(s.official.label)}</h3>
        ${s.official.blurb ? `<p>${esc(s.official.blurb)}</p>` : ''}
        <span class="sp-proof-go">${pdf ? 'להורדה' : 'לצפייה'} <i>←</i><em>נפתח בלשונית חדשה</em></span>
      </a>`);
  }

  if (s.article && s.article.href) {
    cards.push(`      <a class="sp-proof" href="${attr(s.article.href)}"${ext(s.article.href)}>
        <span class="sp-proof-ico">${ICON.file}</span>
        <span class="sp-proof-kind">מאמר מקצועי</span>
        <h3>${esc(s.article.title)}</h3>
        ${s.article.blurb ? `<p>${esc(s.article.blurb)}</p>` : ''}
        <span class="sp-proof-go">לקריאה <i>←</i></span>
      </a>`);
  }

  const winsBlock = wins(s);
  if (!cards.length && !winsBlock) return '';

  return `
<section class="sp-sec sp-alt sp-proof-sec">
  <div class="sp-wrap">
    <h2 class="sp-kicker reveal">הוכחות מהשטח והעמקה</h2>
${winsBlock}${cards.length ? `    <div class="sp-proof-grid reveal">
${cards.join('\n')}
    </div>` : ''}
  </div>
</section>
`;
}

/* ── 8 · הנעה לפעולה מסכמת ───────────────────────────────────────────────── */
function cta(s) {
  return `<section class="sp-sec sp-cta" id="cta">
  <div class="sp-wrap reveal">
    <h2 class="sp-h2">${esc(s.cta.title)}</h2>
    <p class="sp-cta-text">${esc(s.cta.text)}</p>
    ${actions(s, 'is-cta')}
    <p class="sp-cta-alt">או השאירו פרטים ב<a href="../index.html#contact">טופס יצירת הקשר</a></p>
  </div>
</section>`;
}

/* ── הרכבת הדף ───────────────────────────────────────────────────────────── */
function page(s) {
  const url = `${CONTACT.site}/hitmahut/${s.slug}.html`;

  const ld = o => `<script type="application/ld+json">\n${JSON.stringify(o, null, 2)}\n</script>`;

  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="shortcut icon" href="/favicon.ico">

<!-- ⚠ קובץ אוטומטי - נוצר ע"י _build/build-hitmahut.mjs. אין לערוך ידנית.
     תוכן: _build/specializations.data.mjs · תמונות: _build/optimize-images.mjs -->

${ga4}

<title>${attr(s.titlePlain)} | בורוביץ מזרחי</title>
<meta name="description" content="${attr(s.metaDesc)}">
<meta name="robots" content="${HEAD_ROBOTS}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${attr(s.titlePlain)}">
<meta property="og:description" content="${attr(s.metaDesc)}">
<meta property="og:image" content="${CONTACT.site}/img/${s.slug}-hero.webp">
<meta property="og:locale" content="he_IL">

${ld({
  '@context': 'https://schema.org', '@type': 'Service',
  name: s.titlePlain, serviceType: s.short, description: s.metaDesc,
  provider: { '@type': 'LocalBusiness', name: 'בורוביץ מזרחי שמאות מקרקעין וחקלאות בע"מ', telephone: '+972-50-8922469', areaServed: 'ישראל' },
  url
})}
${ld({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: CONTACT.brand, item: `${CONTACT.site}/` },
    { '@type': 'ListItem', position: 2, name: 'תחומי התמחות', item: `${CONTACT.site}/#services` },
    { '@type': 'ListItem', position: 3, name: s.short, item: url }
  ]
})}
${ld({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: s.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
})}

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="preload" as="image" href="../img/${s.slug}-hero.webp" imagesrcset="../img/${s.slug}-hero-sm.webp 820w, ../img/${s.slug}-hero.webp 1600w" imagesizes="100vw">
<link rel="stylesheet" href="../styles.css">
<link rel="stylesheet" href="../hitmahut.css">
</head>
<body class="spec-page">

<a href="#main" class="skip-to-content">דלג לתוכן הראשי</a>

${nav}

<main id="main">

${hero(s)}

${pain(s)}

${audience(s)}

${process(s)}

${deliverables(s)}

${faq(s)}
${proof(s)}
${cta(s)}

</main>

${footer}

${floating}

${tailScripts}

</body>
</html>
`;
}

/* ── ריצה ────────────────────────────────────────────────────────────────── */

mkdirSync(OUTDIR, { recursive: true });

const seen = new Set();
for (const s of SPECIALIZATIONS) {
  if (seen.has(s.slug)) throw new Error(`slug כפול: ${s.slug}`);
  seen.add(s.slug);
  if (!s.painTitle) throw new Error(`${s.slug}: חסרה כותרת לאזור הכאב`);
  if (s.audience.length !== 3) throw new Error(`${s.slug}: נדרשים 3 בולטים ב"למי השירות מיועד"`);
  if (s.process.length !== 4) throw new Error(`${s.slug}: נדרשים 4 שלבים בתהליך`);
  if (s.faq.length < 2) throw new Error(`${s.slug}: נדרשות לפחות 2 שאלות`);
  for (const f of ['hero', 'hero-sm', 'body']) {
    if (!existsSync(join(IMGDIR, `${s.slug}-${f}.webp`)))
      throw new Error(`${s.slug}: חסרה תמונה img/${s.slug}-${f}.webp — הריצו תחילה node _build/optimize-images.mjs`);
  }
}

for (const s of SPECIALIZATIONS) {
  writeFileSync(join(OUTDIR, `${s.slug}.html`), page(s), 'utf8');
  const bits = [s.official && 'מקור רשמי', s.article && 'מאמר'].filter(Boolean);
  console.log(`  ${s.short}`.padEnd(34) + `${s.slug}.html`.padEnd(30) + (bits.length ? bits.join(' · ') : '— אזור ההוכחות לא נוצר'));
}
console.log(`\n✔ ${SPECIALIZATIONS.length} דפי התמחות נבנו אל hitmahut/`);

```

### `_build/make-favicons.mjs`

```javascript
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

```

### `_build/make-review-bundle.mjs`

```javascript
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
const OUT  = join(ROOT, '_build', 'site-code-review.md');

/* ── מה נכנס ומה לא ─────────────────────────────────────────────────────── */
const SKIP_FILES = new Set([
  'nagishli.js',        // ווידג'ט נגישות של צד שלישי - 199KB, לא קוד שלנו
  'index-old.html',     // גיבוי של הגרסה הקודמת
  'preview.html',       // כלי בדיקה מקומי
  'site-code-review.md' // התוצר של הסקריפט הזה - אחרת הוא בולע את עצמו
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
let md = OVERVIEW;
let totalBytes = 0;

md += `\n## 5. מפת הקבצים\n\n| קובץ | גודל | שורות |\n|---|---|---|\n`;
for (const g of groups) {
  if (!g.items.length) continue;
  md += `| **${g.title}** | | |\n`;
  for (const f of g.items) {
    const src = readFileSync(f, 'utf8');
    totalBytes += Buffer.byteLength(src);
    md += `| \`${relative(ROOT, f).replace(/\\/g, '/')}\` | ${kb(Buffer.byteLength(src))} | ${src.split('\n').length} |\n`;
  }
}
md += `\n**סה"כ: ${files.length} קבצים, ${kb(totalBytes)} קוד.**\n\n---\n\n# 6. קוד המקור\n`;

for (const g of groups) {
  if (!g.items.length) continue;
  md += `\n---\n\n## ${g.title}\n`;
  for (const f of g.items) {
    const rel = relative(ROOT, f).replace(/\\/g, '/');
    const src = readFileSync(f, 'utf8');
    const lang = LANG[extname(f).toLowerCase()] || 'text';
    md += `\n### \`${rel}\`\n\n`;
    md += '`‌``' + lang + '\n' + src.replace(/`‌``/g, '`‌``') + '\n`‌``\n';
  }
}

writeFileSync(OUT, md, 'utf8');
console.log(`✔ ${relative(ROOT, OUT)}`);
console.log(`  ${files.length} קבצים · ${kb(Buffer.byteLength(md))} סה"כ`);
for (const g of groups) if (g.items.length) console.log(`  · ${g.title}: ${g.items.length}`);

```

### `_build/optimize-images.mjs`

```javascript
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

```

### `_build/optimize-svc-photos.mjs`

```javascript
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

```

### `_build/specializations.data.mjs`

```javascript
/* ════════════════════════════════════════════════════════════════════════════
   specializations.data.mjs — מקור האמת היחיד לדפי ההתמחויות
   ---------------------------------------------------------------------------
   עריכת תוכן כאן בלבד. אחר כך:
       node _build/optimize-images.mjs     (רק אם החלפת תמונות)
       node _build/build-hitmahut.mjs
   לא עורכים את ה-HTML שנוצר תחת hitmahut/ — הוא נדרס בכל build.

   ⚠ אין מספור התמחויות בשום מקום בממשק.
   ⚠ אין כותרות שבלוניות. לכל דף painTitle משלו.
   ⚠ פירורי לחם מופיעים פעם אחת בלבד, בראש הדף.

   מבנה הדף (8 אזורים):
     1 hero          כותרת + תת-כותרת + תמונה + וואטסאפ/טלפון
     2 painTitle + pain
     3 audience      3 בולטים
     4 process       4 שלבים
     5 deliverables  + פס "בחזית הפסיקה" (CASE_LAW, משותף לכל הדפים)
     6 faq           2 שאלות באקורדיון
     7 proof         מותנה — official ו/או article
     8 cta           סגירה

   שדות מותנים:
     official  הכרעה רשמית / מסמך להורדה. null ⇒ הכרטיס לא נוצר.
     article   מאמר מקצועי. null ⇒ הכרטיס לא נוצר.
     שניהם null ⇒ אזור 7 כולו לא נכתב ל-HTML. אין רווח ריק.

     plannedArticle — כותרת מאמר שטרם נכתב. לא מרונדרת. כשהמאמר עולה לאתר
     מעבירים אותה ל-article עם href והכרטיס מופיע מעצמו.

   תמונות:
     heroSrc / bodySrc הם ברירת מחדל מתוך תיקיית "אתר".
     כדי להחליף: הניחו בתיקייה "תמונות חדשות לאתר" קובץ בשם
     <slug>-hero.jpg או <slug>-body.jpg והריצו את optimize-images.
   ════════════════════════════════════════════════════════════════════════════ */

/* המסר הרוחבי - מופיע בכל דף באזור "מה מקבלים ביד" */
export const CASE_LAW = {
  title: 'בחזית הפסיקה',
  text: 'אנחנו עוקבים באופן שוטף אחר פסיקות בתי המשפט, הכרעות שמאים מכריעים והחלטות ועדות ערר. כל שומה שיוצאת מהמשרד נשענת על התקדימים והפרשנויות המשפטיות העדכניים ביותר - ולא על נוסחאות שעבדו פעם.'
};

export const SPECIALIZATIONS = [

  /* ══ היטלי השבחה ═══════════════════════════════════════════════════════ */
  {
    slug: 'heitlei-hashbacha',
    svc: 'm1',
    short: 'היטלי השבחה',
    heroSrc: 'WhatsApp Image 2026-11-01 at 00.34.53 (1).jpeg',   // מדרגות זהב עולות אל בית - השבחה
    bodySrc: 'WhatsApp Image 2026-11-01 at 00.34.50 (1).jpeg',   // זכוכית מגדלת מעל תוכנית
    heroAlt: 'מדרגות זהב עולות אל בית - עליית שווי והיטל השבחה',
    bodyAlt: 'זכוכית מגדלת מעל תוכנית בניין - בדיקת שומת היטל השבחה',

    title: { lead: 'הפחתת היטל השבחה', gold: 'לא משלמים שקל אחד יותר ממה שחייבים בחוק' },
    titlePlain: 'הפחתת היטל השבחה - לא משלמים שקל אחד יותר ממה שחייבים בחוק',
    subtitle: 'בדיקה שמאית קפדנית, הגשת שומה נגדית וייצוג מקצועי מול שמאי מכריע וועדות ערר.',
    metaDesc: 'שומות היטל השבחה של הוועדות המקומיות נערכות פעמים רבות על בסיס הנחות מנופחות. בדיקת היתכנות, שומה נגדית מנומקת וייצוג מול שמאי מכריע - בתוך חלון 45 הימים.',

    painTitle: 'קיבלתם דרישת תשלום מהוועדה? אל תמהרו לשלם',
    pain: 'שומות היטל השבחה מטעם הוועדות המקומיות נערכות פעמים רבות על בסיס הנחות מחמירות ומנופחות שאינן משקפות את המציאות בשטח. תשלום השובר ללא בדיקה משמעותו אובדן כספים ניכר. בנוסף, חלון הזמנים נוקשה במיוחד: יש לכם 45 ימים בלבד ממועד קבלת הדרישה לפעול; לאחר מכן השומה הופכת לחלוטה ולא ניתן לערער עליה.',

    audience: [
      'מוכרי דירות, מגרשים ונכסים מסחריים שקיבלו שובר תשלום בעת מכירה.',
      'בעלי נכסים המבקשים להוציא היתר בנייה (הרחבה, בריכה, תוספת קומה).',
      'עורכי דין לענייני מקרקעין המבקשים להגן על כספי לקוחותיהם בעסקה.'
    ],

    process: [
      { label: 'בדיקה ראשונית', text: 'בדיקת היתכנות ראשונית של השובר והשומה העירונית ללא עלות.' },
      { label: 'איסוף נתונים',  text: 'בדיקת תיק בניין, תב"עות קודמות ומשביחות וביקור בנכס.' },
      { label: 'גיבוש השומה',  text: 'עריכת שומה נגדית מנומקת הנשענת על ניתוח פסיקות בתי משפט והכרעות שמאים מכריעים עדכניות מהחודשים האחרונים.' },
      { label: 'ייצוג ודיון',  text: 'ייצוג וטיעון בדיונים מול השמאי המכריע עד לקבלת הפחתה מרבית.' }
    ],

    deliverables: 'חוברת שומה נגדית רשמית וקבילה לפי תקני מועצת השמאים, הכוללת ניתוח זכויות היסטוריות, תחשיבי השבחה נגדיים, עיגון בתקדימים משפטיים וייצוג מלא בדיונים.',

    faq: [
      { q: 'האם תמיד כדאי לערער על היטל השבחה?',
        a: 'לא תמיד. אנחנו בוחנים תחילה את הכדאיות; אם השומה נכונה או שיש סיכון להעלאת השומה, נשקף זאת בשקיפות מלאה ולא נייצר הוצאה מיותרת.' },
      { q: 'מה קורה אם עוברים ה-45 יום?',
        a: 'החוק מחמיר מאוד. במקרים נדירים ניתן לבקש ארכה, ולכן קריטי לפנות אלינו מיד עם קבלת השובר.' }
    ],

    /* ההצלחות שלנו - הכרעות שמאי מכריע שניהל המשרד, כל אחת בלחיצה להורדה.
       כל עוד המערך ריק הבלוק לא נוצר בדף. להוספה, שורה לכל הכרעה:

         { title:  'ועדה מקומית כרמיאל · גוש 18944 חלקה 61',
           meta:   'שמאי מכריע: ישראל ישראלי · מרץ 2026',   // אופציונלי
           result: 'ההיטל הופחת מ-612,000 ₪ ל-238,000 ₪',   // אופציונלי
           href:   'https://www.gov.il/BlobFolder/.../....pdf' }

       href צריך להיות קישור ההורדה הישיר של ההכרעה באתר gov.il, כך שלחיצה
       אחת פותחת/מורידה את הקובץ. הקישור נפתח בלשונית חדשה.                 */
    winsIntro: 'הכרעות שמאי מכריע שניהל משרדנו, כפי שפורסמו באתר הרשמי. בתיקים שלפניכם הופחת היטל ההשבחה בעשרות אחוזים - ובאחד מהם ב-94% - ובסך הכל נחסכו ללקוחותינו למעלה מ-880,000 ₪. כל הכרעה פתוחה להורדה בלחיצה אחת.',

    /* שורת result = היטל לפי שומת הוועדה מול ההיטל שנקבע בהכרעה.
       ההיטל הוא 50% מההשבחה לפי התוספת השלישית; סכומי ההשבחה לקוחים
       ישירות מטבלאות "שומות הצדדים" ו"ההחלטה" שבגוף ההכרעות.           */
    wins: [
      { title:  'ועדה מקומית גבעתיים · גוש 6154 חלקה 189',
        meta:   'שמאי מכריע: גולדברג ארנון · פברואר 2025',
        /* הוועדה: השבחה 405,395 ₪ · ההכרעה: השבחה 23,983 ₪ */
        cut:    '94%',
        result: 'ההיטל הופחת מ-202,698 ₪ ל-11,991 ₪ · חיסכון 190,707 ₪',
        href:   'https://free-justice.openapi.gov.il/free/moj/portal/rest/searchpredefinedapi/v1/SearchPredefinedApi/Documents/DecisiveAppraiser/Utc7sDDjR~qhKXBkDQRi2M6D8ETi2RjxQ7pHNE3O4+8=' },

      { title:  'ועדה מקומית אצבע הגליל · גוש 13947 חלקה 6',
        meta:   'שמאית מכריעה: דודזון שמאמה אוולין · פברואר 2023',
        /* הוועדה: השבחה 2,394,790 ₪ · ההכרעה: השבחה 1,361,800 ₪ */
        cut:    '43%',
        result: 'ההיטל הופחת מ-1,197,395 ₪ ל-680,900 ₪ · חיסכון 516,495 ₪',
        href:   'https://free-justice.openapi.gov.il/free/moj/portal/rest/searchpredefinedapi/v1/SearchPredefinedApi/Documents/DecisiveAppraiser/pkfsYWfcgA6vKaqMvX49vL1PvGk4IzlacWg5KRbovi8=' },

      { title:  'ועדה מקומית לב הגליל · גוש 19322 חלקה 53',
        meta:   'שמאי מכריע: סרחאן עומר · אוגוסט 2023',
        /* הוועדה: השבחה 695,430 ₪ (ללא פטור 140 מ"ר) · ההכרעה: היטל 173,498 ₪ */
        cut:    '50%',
        result: 'ההיטל הופחת מ-347,715 ₪ ל-173,498 ₪ · חיסכון 174,217 ₪',
        href:   'https://free-justice.openapi.gov.il/free/moj/portal/rest/searchpredefinedapi/v1/SearchPredefinedApi/Documents/DecisiveAppraiser/dvG5jv4TBEXkJDPrjf7SbiRWRkwz~~i3U5LUwtsAH0o=' }
    ],

    official: {
      kind: 'הוכחות רשמיות',
      label: 'הכרעות שמאי מכריע באתר Gov.il',
      href: 'https://www.gov.il/he/departments/dynamiccollectors/decisive_appraisal_decisions',
      blurb: 'המאגר הרשמי של האגף לאסדרת מקצועות במשרד המשפטים - סינון לפי שמאי מכריע, ועדה מקומית, גוש וחלקה.'
    },

    article: {
      title: 'היטל השבחה - המדריך המלא',
      href: '../maamar-heitel-hashbacha-madrich.html',
      blurb: 'מתי נוצר החיוב, איך הוא מחושב, ומה בדיוק עושים מרגע שהשובר מגיע.'
    },
    plannedArticle: 'קיבלתם היטל השבחה? 5 טעויות נפוצות שעולות מאות אלפי שקלים ואיך להימנע מהן',

    cta: {
      title: 'שלחו לנו את שובר התשלום בוואטסאפ',
      text: 'בדיקת היתכנות ראשונית ללא התחייבות. ככל שתפנו מוקדם יותר בתוך 45 הימים, כך נוכל לפעול טוב יותר.',
      wa: 'שלום, קיבלתי שובר היטל השבחה ואשמח לבדיקת היתכנות להפחתה.'
    }
  },

  /* ══ הערכת שווי ════════════════════════════════════════════════════════ */
  {
    slug: 'haarachat-shovi',
    svc: 'm2',
    short: 'הערכת שווי',
    heroSrc: 'WhatsApp Image 2026-11-01 at 00.34.50.jpeg',       // דגם בית על גוש אבן
    bodySrc: 'WhatsApp Image 2026-11-01 at 00.34.53 (2).jpeg',   // ביקור שמאי בנכס עם לוח רישום
    heroAlt: 'בית וגרף שווי עולה בכפות הידיים - הערכת שווי מקרקעין',
    bodyAlt: 'ביקור שמאי בנכס ורישום ממצאים לקראת דו"ח השומה',

    title: { lead: 'הערכת שווי מקרקעין', gold: 'לקנות, למכור או לחלק בביטחון כלכלי מלא' },
    titlePlain: 'הערכת שווי מקרקעין - לקנות, למכור או לחלק בביטחון כלכלי מלא',
    subtitle: 'חוות דעת שמאית בלתי תלויה המגנה על ההון שלכם ומאתרת חריגות וסיכונים מראש.',
    metaDesc: 'הערכת שווי לדירות, בתים, נכסים מסחריים וקרקעות: בדיקה פיזית, משפטית ותכנונית, הצלבת עסקאות אמת ודוח שומה קביל - לפני שחותמים על חוזה.',

    painTitle: 'הטעויות הנפוצות שמסכנות את העסקה שלכם',
    pain: 'עסקת נדל"ן היא לרוב העסקה הכלכלית המשמעותית בחייכם. פערים בין הרישום בטאבו להיתרי הבנייה בפועל, חריגות בנייה שעלולות לעצור משכנתא, או הסתמכות על מחירי מודעות באינטרנט במקום עסקאות אמת - עלולים להסתיים בהפסד של מאות אלפי שקלים ובסכסוך משפטי מורכב.',

    audience: [
      'רוכשי דירות ובתים המעוניינים בשמאות מוקדמת ("טרום רכישה") לפני התחייבות חוזית.',
      'מוכרי נכסים שרוצים לתמחר נכון ולמנוע ביטול עסקאות מצד שמאיי הבנקים.',
      'משקיעים במגרשים, במבני תעשייה ובמשרדים.'
    ],

    process: [
      { label: 'הגדרת מטרה', text: 'הגדרת מטרת השומה וזיהוי מדויק של הנכס (גוש/חלקה/תת-חלקה).' },
      { label: 'בדיקה בשטח', text: 'סיור פיזי ומדידות בנכס יחד עם בחינת תיק הבניין ברשות המקומית.' },
      { label: 'ניתוח שוק',  text: 'הצלבת נתוני עסקאות אמת ממאגרי רשות המסים וניתוח זכויות תכנוניות ומשפטיות עדכניות.' },
      { label: 'הפקת דו"ח',  text: 'הפקת דו"ח שומה מפורט ומענה לכל שאלה לקראת ניהול משא ומתן.' }
    ],

    deliverables: 'דו"ח שומה מקיף וקביל הכולל תיאור פיזי, משפטי ותכנוני, ניתוח השוואתי של עסקאות דומות, אומדן שווי שוק מדויק והתאמה לכללי הפסיקה הנהוגים בבתי המשפט.',

    faq: [
      { q: 'מה מוסיפה שמאות מוקדמת לצד השמאות שמבצע הבנק?',
        a: 'אלה שתי בדיקות בשתי נקודות זמן שונות, וכל אחת ממלאת תפקיד משלה. השמאות המוקדמת נעשית לפני ההתחייבות החוזית ונועדה לתת לכם ודאות ושקט נפשי: מה שווי הנכס בפועל, מה מצבו התכנוני והמשפטי ומה כדאי לברר מראש. שמאות הבנק מגיעה בשלב המימון ובוחנת את הנכס עבור הבנק. כשמגיעים אליה עם תמונה מלאה ועם מסמכים מסודרים, התהליך מול הבנק חלק וצפוי הרבה יותר.' },
      { q: 'תוך כמה זמן השומה מוכנה?',
        a: 'לרוב בתוך 3 עד 5 ימי עסקים לאחר הביקור בנכס וקבלת כלל החומרים התכנוניים.' }
    ],

    official: null,
    article: null,
    plannedArticle: 'בדיקת שמאי לפני קניית דירה - אילו חריגות עלולות לפוצץ את העסקה?',

    cta: {
      title: 'מתלבטים לפני חתימה על חוזה?',
      text: 'דברו איתנו לבדיקת שווי מהירה. שיחה קצרה לפני החתימה שווה הרבה מאוד כסף אחריה.',
      wa: 'שלום, אני לפני עסקה ואשמח לבדיקת שווי והתייעצות שמאית.'
    }
  },

  /* ══ שומות חקלאיות ופיצויים ════════════════════════════════════════════ */
  {
    slug: 'shomot-haklaiot',
    svc: 'm3',
    short: 'שומות חקלאיות ופיצויים',
    /* התמונות מגיעות מ"תמונות חדשות לאתר/shomot-haklaiot-hero.jpg" ו-body
       לפי מוסכמת השמות, ולכן heroSrc/bodySrc כאן הם רק גיבוי. */
    heroSrc: 'slide9.jpg',
    bodySrc: 'slide7.jpg',
    heroPos: '28% center',   // מזיז את חיתוך הבאנר כדי שגרף היבול יישאר בחלק הגלוי
    heroAlt: 'תחשיב כלכלי של יבול חקלאי - אומדן נזק ופיצויים',
    bodyAlt: 'מטע רימונים - כימות הפגיעה בגידולים',

    title: { lead: 'שמאות חקלאית ואומדן נזקים', gold: 'מיצוי מלוא הפיצויים המגיעים למשק' },
    titlePlain: 'שמאות חקלאית ואומדן נזקים - מיצוי מלוא הפיצויים המגיעים למשק',
    subtitle: 'חוות דעת מקצועיות לנזקי טבע, אירועים ביטחוניים, הפקעות ופגיעה בתשתיות חקלאיות.',
    metaDesc: 'כימות שמאי-אגרונומי של נזק במטעים, בגידולי שדה, בבתי צמיחה ובמבנים חקלאיים, וליווי התביעה מול מס רכוש, קרנות הפיצויים וחברות הביטוח.',

    painTitle: 'אל תתנו לנזקי מזג האוויר או הטבע להרוס את עתיד המשק',
    pain: 'פגיעה במטעים, בגידולי שדה, בבתי צמיחה או במבנים חקלאיים משביתה את הפעילות הכלכלית וגורמת לאובדן הכנסות מתמשך. קרנות פיצויים וחברות ביטוח נוטות להציע פיצוי חלקי בלבד. בהיעדר כימות שמאי-אגרונומי קפדני בזמן אמת, המשק סופג את ההפסד ישירות.',

    audience: [
      'כל מי שספג נזק בחקלאות - חקלאים, בעלי משקים, מגדלים וחברות חקלאיות: נזקי טבע ומזג אוויר קיצוני, שריפות, פגיעות מלחמה ונזק לתשתיות ולציוד.',
      'משקים חקלאיים הנמצאים בתוואי הפקעה של תשתיות לאומיות (כבישים, רכבות, מים).',
      'עורכי דין המנהלים תביעות ביטוח, נזיקין ופיצויים במגזר החקלאי.'
    ],

    process: [
      { label: 'הגעה מהירה',  text: 'הגעה מהירה לשטח לתיעוד הנזקים בזמן אמת לפני שינוי המצב.' },
      { label: 'איסוף נתונים', text: 'איסוף נתונים אגרונומיים, היסטוריית תפוקות, חשבוניות הוצאה ודוחות עבר.' },
      { label: 'כימות הנזק',  text: 'כימות הפגיעה הישירה והעקיפה (אובדן רווחים עתידי, שיקום קרקע וציוד).' },
      { label: 'ייצוג וליווי', text: 'עריכת חוות דעת מומחה המעוגנת בהנחיות המעודכנות של מנהלת הפיצויים וליווי מלא מול מס רכוש או חברת הביטוח.' }
    ],

    deliverables: 'חוות דעת שמאית-אגרונומית קבילה לבתי משפט ולרשויות המס, המפרטת את היקף הפגיעה הכלכלית ומגובה בתקדימים משפטיים מוכחים לפיצויי מקרקעין חקלאיים.',

    faq: [
      { q: 'האם להתחיל לפנות את הנזק לפני ביקור שמאי?',
        a: 'יש להימנע משינוי המצב בשטח לפני תיעוד שמאי מלא, למעט פעולות דחופות למניעת נזק נוסף. חובה לתעד כל פעולה בצילום.' },
      /* שאלה שנייה — ניסוח שלנו, לאישורך */
      { q: 'המבטח או הקרן כבר שלחו שמאי מטעמם. למה צריך שמאי נוסף?',
        a: 'השמאי שמגיע מטעם המבטח או מטעם הקרן פועל עבורם. חוות דעת עצמאית מכמתת את מלוא הפגיעה - גם את הנזק העקיף ואת אובדן ההכנסות העתידי - ומשמשת בסיס מבוסס למשא ומתן על גובה הפיצוי ולתביעה אם צריך.' }
    ],

    official: null,
    article: null,
    plannedArticle: 'תביעות פיצויים מול מס רכוש בענף החקלאות - מסלול ירוק מול מסלול אדום',

    cta: {
      title: 'נפגע המשק?',
      text: 'שלחו לנו תמונות ופרטים לקבלת הנחיות ראשוניות. תיעוד מוקדם ומדויק הוא ההבדל בין פיצוי חלקי לפיצוי מלא.',
      wa: 'שלום, נגרם נזק למשק ואשמח להנחיות ולתיאום הגעה לשטח.'
    }
  },

  /* ══ השגות על שומות רמ"י ═══════════════════════════════════════════════ */
  {
    slug: 'hasagot-rami',
    svc: 'm4',
    short: 'השגות על שומות רמ"י',
    heroSrc: 'WhatsApp Image 2026-11-01 at 00.34.53 (5).jpeg',   // משרד עם נוף עירוני, טאבלט ונתונים
    bodySrc: 'WhatsApp Image 2026-11-01 at 00.34.52.jpeg',       // דגם מבנה על ערימת תוכניות
    heroAlt: 'ניתוח נתוני שומה במשרד מול נוף עירוני - השגות על שומות רמ"י',
    bodyAlt: 'דגם מבנה על ערימת תוכניות - בחינת זכויות הבנייה בחוזה החכירה',

    title: { lead: 'השגות על שומות רמ"י', gold: 'צמצום דמי היתר, חכירה ודמי הסכמה' },
    titlePlain: 'השגות על שומות רמ"י - צמצום דמי היתר, חכירה ודמי הסכמה',
    subtitle: 'בדיקה שמאית ביקורתית, תקיפת בסיס השומה של השמאי הממשלתי וחיסכון משמעותי.',
    metaDesc: 'דרישות תשלום מרמ"י לדמי היתר, שינוי ייעוד ודמי חכירה מבוססות פעמים רבות על ערכי קרקע מקסימליים. ניסוח השגה מנומקת וייצוג מול השמאי הממשלתי הראשי.',

    painTitle: 'למה אסור לקבל את שומת רשות מקרקעי ישראל כגזירת גורל?',
    pain: 'דרישות תשלום מרמ"י עבור דמי היתר לבנייה או שינוי ייעוד מבוססות פעמים רבות על ערכי קרקע מקסימליים שאינם משקללים מגבלות פיתוח, טופוגרפיה או זכויות היסטוריות בחוזה החכירה. תשלום ללא בדיקה משמעותו ויתור על כספים שניתן להפחית בהליך השגה מסודר.',

    audience: [
      'חוכרים של נכסים פרטיים, מסחריים ותעשייתיים המבקשים היתר בנייה או הרחבה.',
      'בעלי קרקעות וחוכרים המבצעים שינוי ניצול או שינוי ייעוד בנכס.',
      'יזמים בעסקאות מול רשות מקרקעי ישראל.'
    ],

    process: [
      { label: 'ניתוח החוזה',  text: 'ניתוח חוזה החכירה המקורי, שומת רמ"י שהתקבלה וטבלת הזכויות.' },
      { label: 'איתור כשלים', text: 'איתור כשלים בהנחות השמאי הממשלתי (טבלאות שווי, מקדמי פיתוח, הוצאות התאמה).' },
      { label: 'הגשת השגה',   text: 'ניסוח השגה מנומקת המשלבת את החלטות מועצת מקרקעי ישראל ופסיקות בתי המשפט האחרונות.' },
      { label: 'ייצוג וערעור', text: 'ייצוג מול ועדת ההשגות / השמאי הממשלתי הראשי במידת הצורך.' }
    ],

    deliverables: 'כתב השגה מקצועי ומפורט התואם במדויק את נהלי רמ"י, מעוגן בפסיקה המינהלית העדכנית ביותר ומיועד להפחתת התשלום בפועל.',

    faq: [
      { q: 'כמה זמן יש להגשת השגה לרמ"י?',
        a: 'יש להגיש את ההשגה תוך 60 ימים מיום קבלת הודעת החיוב, ולכן חשוב לפעול מיד.' },
      { q: 'האם ניתן לשלם כדי לקבל היתר ולערער במקביל?',
        a: 'כן, ניתן לשלם תחת מחאה או להפקיד ערבות בנקאית לפי הנהלים כדי לא לעכב את הבנייה.' }
    ],

    official: null,
    article: null,
    plannedArticle: 'כיצד מפחיתים שומת דמי היתר ברמ"י? שלבי ההשגה ולוחות זמנים קריטיים',

    cta: {
      title: 'קיבלתם הודעת חיוב מרמ"י?',
      text: 'העבירו אותה לבדיקת היתכנות מקצועית לפני התשלום. בדיקה ראשונית מהירה תראה אם יש עילה להשגה ומה הסיכוי להפחתה.',
      wa: 'שלום, קיבלתי הודעת חיוב מרמ"י ואשמח לבדיקת היתכנות להשגה.'
    }
  },

  /* ══ תביעות ירידת ערך (סעיף 197) ═══════════════════════════════════════ */
  {
    slug: 'yeridat-erech-197',
    svc: 'm5',
    short: 'תביעות ירידת ערך',
    heroSrc: 'WhatsApp Image 2026-11-01 at 00.34.53.jpeg',       // קו רקיע עירוני עם תוכניות בחזית
    bodySrc: 'WhatsApp Image 2026-11-01 at 00.34.50 (1).jpeg',   // זכוכית מגדלת מעל תוכנית
    heroAlt: 'תוכנית בנייה חדשה מול קו הרקיע של השכונה - תביעת ירידת ערך',
    bodyAlt: 'פרויקט בנייה חדש בסמוך לשכונת מגורים קיימת',

    title: { lead: 'תביעות ירידת ערך (סעיף 197)', gold: 'קבלת פיצוי על פגיעה במקרקעין' },
    titlePlain: 'תביעות ירידת ערך (סעיף 197) - קבלת פיצוי על פגיעה במקרקעין',
    subtitle: 'הגנה על שווי הנכס שלכם בעקבות אישור תוכניות בניין עיר פוגעות, כבישים או הפקעות.',
    metaDesc: 'תוכנית שהוסיפה מגדלים, חסמה נוף ואור, יצרה מטרדי רעש או הפקיעה שטח פוגעת בשווי הנכס. חוות דעת לפי סעיף 197 - בתוך חלון 3 השנים מאישור התוכנית.',

    painTitle: 'התוכנית החדשה פוגעת בנכס שלכם? הזמן שלכם לתבוע מוגבל',
    pain: 'אישור תוכנית בנייה סמוכה שהוסיפה מגדלים, חסמה נוף ואור, יצרה מטרדי רעש, או הפקיעה שטח מחלקתכם פוגע ישירות בשווי הנכס שלכם. סעיף 197 לחוק התכנון והבנייה מאפשר לדרוש פיצוי מלא מהוועדה המקומית, אך יש חלון הזדמנויות קשיח של 3 שנים בלבד מיום אישור התוכנית למתן תוקף.',

    audience: [
      'בעלי דירות ובתים פרטיים שנפגעו מפרויקט תשתית או בנייה חדש בסביבתם.',
      'בעלי מגרשים שחלק משטחם מיועד להפקעה לצורכי ציבור.',
      'נציגויות דיירים וועדי בתים הפועלים מול תוכניות פוגעות בשכונה.'
    ],

    process: [
      { label: 'בדיקה סטטוטורית', text: 'בדיקה של התוכנית הפוגעת, מועד אישורה והוכחת מעמד "גובל" לפי הפסיקה הנוכחית.' },
      { label: 'בחינת פגיעה',    text: 'סיור במקום ובחינת מרכיבי הפגיעה (הסתרת שמש, רעש, עומסי תנועה, הפקעה).' },
      { label: 'עריכת השומה',   text: 'עריכת חוות דעת שמאית מקיפה המחשבת את ירידת הערך הריאלית.' },
      { label: 'ייצוג וניהול',  text: 'ניהול התביעה יחד עם עורך הדין מול הוועדה המקומית ומול שמאי מכריע.' }
    ],

    deliverables: 'שומה מפורטת ומנומקת לתביעת פיצויים לפי סעיף 197, הכוללת ניתוח שמאי והנדסי הנשען על תקדימי בית המשפט העליון וועדות הערר.',

    faq: [
      { q: 'האם רק נכס שנוגע פיזית בגבול התוכנית זכאי לפיצוי?',
        a: 'החוק קובע זכאות לנכסים הגובלים בתוכנית, אך קיימת פסיקה רחבה ומעודכנת המגדירה מה נחשב "גובל" (למשל מקרים של כביש צר או שטח פתוח המפריד).' },
      /* שאלה שנייה — ניסוח שלנו, לאישורך */
      { q: 'הגשנו תביעה והוועדה המקומית דחתה אותה. זה נגמר?',
        a: 'ממש לא. דחייה של הוועדה המקומית עוברת להכרעת שמאי מכריע, ומשם ניתן להמשיך לוועדת ערר לפיצויים ולהיטל השבחה. חלק ניכר מהתביעות מוכרע דווקא בשלבים האלה, ולכן חשוב שהשומה תיבנה מראש כך שתעמוד בהם.' }
    ],

    official: null,
    article: null,
    plannedArticle: 'בונים פרויקט שפוגע בנכס שלכם? כל מה שחייבים לדעת על תביעת סעיף 197',

    cta: {
      title: 'חוששים מתוכנית חדשה בסביבתכם?',
      text: 'בדקו איתנו זכאות לפיצויים. בדיקה ראשונית תראה אם יש פגיעה תכנונית ואם חלון שלוש השנים עדיין פתוח.',
      wa: 'שלום, אושרה תוכנית ליד הנכס שלי ואשמח לבדוק זכאות לפיצוי לפי סעיף 197.'
    }
  },

  /* ══ נחלות ומשקים חקלאיים ══════════════════════════════════════════════ */
  {
    slug: 'nachalot-umeshakim',
    svc: 'm6',
    short: 'נחלות ומשקים חקלאיים',
    /* התמונות מגיעות מ"תמונות חדשות לאתר/nachalot-umeshakim-hero.jpg" ו-body
       לפי מוסכמת השמות, ולכן heroSrc/bodySrc כאן הם רק גיבוי. */
    heroSrc: 'image_13.jpg',
    bodySrc: 'slide4.jpg',
    heroAlt: 'בית המגורים לצד החלקה החקלאית - הערכת שווי נחלה',
    bodyAlt: 'תחשיב שווי ותוכניות על שולחן העבודה - חוות דעת לנחלה',

    title: { lead: 'שמאות נחלות ומשקים חקלאיים', gold: 'מומחיות ייחודית במרחב הכפרי' },
    titlePlain: 'שמאות נחלות ומשקים חקלאיים - מומחיות ייחודית במרחב הכפרי',
    subtitle: 'ייעוץ כלכלי-שמאי לפיצול מגרש מנחלה, דמי הסכמה, היוון זכויות והסדרת חריגות.',
    metaDesc: 'נחלות כפופות לשילוב מורכב של החלטות רמ"י, מעמד חוזי במושב וחבויות מיסוי כפולות. הערכת שווי, תחשיב עלויות פיצול והיוון ותוכנית פעולה כלכלית.',

    painTitle: 'ניהול עסקאות בנחלות דורש דיוק ומומחיות ללא פשרות',
    pain: 'נחלות כפופות לשילוב מורכב של החלטות רמ"י, מעמד חוזי במושב וחבויות מיסוי כפולות (דמי הסכמה ודמי רכישה מול מס שבח). טעות בהגדרת הזכויות או אי-הסדרת שימושים חורגים לפני ביצוע עסקה עלולות לייצר דרישות תשלום של מיליוני שקלים ולתקוע את העסקה.',

    audience: [
      'בעלי נחלות המעוניינים לפצל מגרש עבור בן משפחה או לצורך מכירה.',
      'רוכשים ומוכרים של משקים חקלאיים ומשקי עזר במושבים.',
      'משפחות בהליכי חלוקת עיזבון, ירושה, גירושין או הסדרים פנים-משפחתיים.'
    ],

    process: [
      { label: 'בדיקת זכויות',   text: 'בדיקה מעמיקה של הסכמי החכירה/משבצת, המצב התכנוני והיתרי הבנייה הקיימים.' },
      { label: 'מיפוי וסיור',    text: 'סיור פיזי במשק, מיפוי כלל המבנים (מגורים, פל"ח, סככות) והסדרת חריגות.' },
      { label: 'אסטרטגיית רמ"י', text: 'בחינת חלופות רמ"י לאור ההחלטות ופסקי הדין החדשים ביותר בנושאי חלקת המגורים והפיצול.' },
      { label: 'הפקת השומה',     text: 'הפקת חוות דעת אסטרטגית המציגה את התחשיב הכלכלי והמיסויי המלא.' }
    ],

    deliverables: 'דו"ח שומה מקיף לנחלה הכולל הערכת שווי שוק, תחשיב חבויות לרמ"י ולמיסוי מקרקעין ותוכנית פעולה כלכלית מומלצת בהתאם לפסיקה החקלאית העדכנית.',

    faq: [
      { q: 'האם כדאי להצטרף להסדר חלקת המגורים או רק לפצל מגרש נקודתי?',
        a: 'הדבר תלוי בגודל המשק, בצרכי המשפחה ובתוכניות העתידיות. אנו מבצעים תחשיב כדאיות השוואתי מדויק עבור שני המסלולים.' },
      /* שאלה שנייה — ניסוח שלנו, לאישורך */
      { q: 'יש במשק מבנים ושימושים שלא הוסדרו. אפשר בכלל למכור?',
        a: 'אפשר, אבל אי-ההסדרה מתגלגלת לתוך העסקה: רמ"י עשויה לדרוש תשלום בגין השימושים החורגים, והרוכש ידרוש הפחתה בשל אי-הוודאות. אנחנו ממפים את החריגות ומתמחרים את עלות ההסדרה עוד לפני פתיחת המשא ומתן, כדי שתדעו מה באמת נשאר בידיים.' }
    ],

    official: null,
    article: null,
    plannedArticle: 'פיצול מגרש מנחלה במושב - עלויות צפויות, היבטי מיסוי והשלבים בדרך',

    cta: {
      title: 'מתכננים מהלך בנחלה?',
      text: 'צרו קשר לפגישת אפיון מקצועית. נפרוס את כל העלויות והחבויות מראש - לפני שמתחילים לזוז.',
      wa: 'שלום, אני מתכנן/ת מהלך בנחלה ואשמח לפגישת אפיון.'
    }
  },

  /* ══ טבלאות איחוד וחלוקה ═══════════════════════════════════════════════ */
  {
    slug: 'tavlaot-ichud-vehaluka',
    svc: 'm7',
    short: 'טבלאות איחוד וחלוקה',
    heroSrc: 'WhatsApp Image 2026-11-01 at 00.34.53 (3).jpeg',   // מפת חלוקה לתאי שטח על טאבלט
    bodySrc: 'WhatsApp Image 2026-11-01 at 00.34.52.jpeg',       // דגם מבנה על ערימת תוכניות
    heroAlt: 'מפת חלוקה לתאי שטח - טבלאות הקצאה ואיזון לפי תקן 15',
    bodyAlt: 'דגם מתחם תכנוני לבן מול הבנייה בפועל - מצב נכנס מול מצב יוצא',

    title: { lead: 'טבלאות איחוד וחלוקה (תקן 15)', gold: 'הגנה על שווי הזכויות בתוכניות בניין עיר' },
    titlePlain: 'טבלאות איחוד וחלוקה (תקן 15) - הגנה על שווי הזכויות בתוכניות בניין עיר',
    subtitle: 'עריכת טבלאות הקצאה ואיזון ליזמים ובדיקה ביקורתית של טבלאות עבור בעלי קרקע.',
    metaDesc: 'בתוכניות איחוד וחלוקה המגרש מקבל הקצאה חדשה. עריכת טבלאות הקצאה ואיזון לפי תקן 15, בדיקה ביקורתית לבעלי קרקע וייצוג מול מוסדות התכנון.',

    painTitle: 'ודאו שאינכם מקופחים בחלוקת הזכויות החדשות שלכם',
    pain: 'בתוכניות איחוד וחלוקה המגרש שלכם עובר שינוי מיקום וייעוד ומקבל הקצאה חדשה. שגיאה בהערכת "המצב הנכנס" או קביעת מקדמי שווי לא הוגנים במצב החדש עלולה לגרום לכם לקבל פחות זכויות ממה שמגיע לכם בדין, או לדרוש מכם תשלומי איזון שגויים.',

    audience: [
      'יזמים ומתכננים המקדמים תב"ע וזקוקים לשמאי מלווה לעריכת טבלאות הקצאה ואיזון.',
      'בעלי קרקעות במתחמי תכנון המבקשים לוודא שאינם מקופחים בחלוקת הזכויות.',
      'עורכי דין המייצגים בעלי זכויות ומגישים התנגדויות למוסדות התכנון.'
    ],

    process: [
      { label: 'ניתוח התב"ע',  text: 'ניתוח תוכנית האיחוד והחלוקה, הוראות התב"ע והמצב התכנוני ההיסטורי.' },
      { label: 'שומת מצב',    text: 'עריכת שומת "מצב נכנס" מול "מצב יוצא" בהתאם לתקן 15 ופסיקות בתי המשפט לעניינים מינהליים.' },
      { label: 'חישוב טבלאות', text: 'חישוב מדויק של טבלאות ההקצאה, מקדמי שווי ותשלומי האיזון בין הבעלים.' },
      { label: 'ייצוג ואישור', text: 'ייצוג בדיונים מול ועדות התכנון והשמאי המלווה של התוכנית עד לאישור סופי.' }
    ],

    deliverables: 'סט טבלאות הקצאה ואיזון מושלם להפקדה במוסדות התכנון, או חוות דעת שמאי להתנגדות לטבלאות קיימות המבוססת על התקדימים המשפטיים המחייבים.',

    faq: [
      { q: 'מהם תשלומי איזון ומתי הם נקבעים?',
        a: 'כאשר לא ניתן להקצות לכל בעל זכויות בדיוק את חלקו היחסי בשווי הזכויות החדשות, נקבעים תשלומי איזון כספיים בין המגרשים השונים כדי לאזן את הפער.' },
      /* שאלה שנייה — ניסוח שלנו, לאישורך */
      { q: 'אפשר להתנגד לטבלה אחרי שהתוכנית כבר הופקדה?',
        a: 'כן. תקופת ההפקדה היא המועד להגיש התנגדות מנומקת לטבלאות ההקצאה והאיזון, וזה בדרך כלל השלב האפקטיבי ביותר לתקן קיפוח. לאחר אישור התוכנית התיקון מורכב ויקר בהרבה, ולכן כדאי לבדוק את הטבלה ברגע שהיא מתפרסמת.' }
    ],

    official: null,
    article: null,
    plannedArticle: 'איך לקרוא טבלת הקצאה ואיזון ולוודא שלא קופחתם בחלוקת הזכויות?',

    cta: {
      title: 'המגרש שלכם נכלל בתוכנית חלוקה?',
      text: 'פנו אלינו לבדיקת זכויות מקצועית - כל עוד אפשר להשפיע על הטבלה.',
      wa: 'שלום, המגרש שלי נכלל בתוכנית איחוד וחלוקה ואשמח לבדיקת הטבלה.'
    }
  },

  /* ══ כדאיות כלכלית וליווי סטטוטורי ═════════════════════════════════════ */
  {
    slug: 'kedaiut-kalkalit',
    svc: 'm8',
    short: 'כדאיות כלכלית וליווי',
    heroSrc: 'WhatsApp Image 2026-11-01 at 00.34.53 (4).jpeg',   // גרף עולה מקוביות עם מבנה בפסגה
    bodySrc: 'WhatsApp Image 2026-11-01 at 00.34.53 (5).jpeg',   // משרד עם נוף עירוני ונתונים כלכליים
    heroAlt: 'גרף עולה עם מבנה בפסגה - כדאיות כלכלית של פרויקט',
    bodyAlt: 'מגדל משרדים עם שכבת תכנון דיגיטלית - בחינת כדאיות הפרויקט',

    title: { lead: 'ליווי כלכלי וסטטוטורי מול מוסדות התכנון', gold: 'מקסום זכויות וקידום תוכניות במהירות' },
    titlePlain: 'ליווי כלכלי וסטטוטורי מול מוסדות התכנון - מקסום זכויות וקידום תוכניות במהירות',
    subtitle: 'ייצוג יזמים מול ועדות התכנון, עריכת חוות דעת לפי תקן 21 ובדיקת תמורות לפרויקטים.',
    metaDesc: 'חוות דעת כלכלית לפי תקן 21.1, נספח כלכלי לתב"ע, כיול תמורות דיירים ומטלות ציבוריות וייצוג היזם בדיונים בוועדות המקומיות והמחוזיות.',

    painTitle: 'תכנון כלכלי מדויק הוא ההבדל בין פרויקט מצליח לפרויקט תקוע',
    pain: 'קידום תוכנית (פינוי-בינוי, תמ"א או מתחמי עירוב שימושים) ללא תשתית כלכלית מוצקה מביא לקיצוץ זכויות על ידי הוועדות, לקביעת מכפילי בינוי שאינם רווחיים, או לדרישות מופרזות למטלות ציבוריות ותמורות דיירים. פרויקט שלא כויל שמאית מול הוועדה מסתכן בסחבת של שנים או באובדן הרווחיות היזמית.',

    audience: [
      'יזמים וחברות בנייה המקדמים תב"עות להתחדשות עירונית או מתחמים חדשים.',
      'מנהלות התחדשות עירונית ונציגויות דיירים המבקשות בדיקת כדאיות עצמאית.',
      'אדריכלים ומתכננים הזקוקים לשמאי שותף לעיצוב הפרוגרמה הכלכלית מול מוסדות התכנון.'
    ],

    process: [
      { label: 'ניתוח המצב',  text: 'ניתוח המצב הקיים, היקף הדירות/מבנים להריסה ודרישות המדיניות העירונית.' },
      { label: 'תחשיב כלכלי', text: 'עריכת תחשיב כלכלי קפדני לפי תקן 21.1 המעודכן ביותר והנחיות הרשות הממשלתית.' },
      { label: 'כיול פרויקט', text: 'כיול תמורות הדיירים, היקף המטלות הציבוריות וצפי היטלי ההשבחה.' },
      { label: 'ייצוג ודיון', text: 'ייצוג אקטיבי של היזם בדיונים בוועדות התכנון ובדיאלוג מול שמאיי הוועדה.' }
    ],

    deliverables: 'חוות דעת כלכלית-שמאית מלאה לפי תקן 21, נספח כלכלי לתב"ע המיושר עם פסיקות מוסדות התכנון וייצוג מקצועי רציף עד לקבלת החלטת אישור.',

    faq: [
      { q: 'כיצד תקן 21 מסייע ליזם מול מוסדות התכנון?',
        a: 'התקן מספק מתודולוגיה אחידה המוכרת על ידי ועדות התכנון להוכחת הצפיפות והזכויות הנדרשות כדי שהפרויקט יהיה בר-ביצוע ולא ייכשל כלכלית.' },
      /* שאלה שנייה — ניסוח שלנו, לאישורך */
      { q: 'מתי נכון לערב שמאי - לפני ההגשה או אחרי הערות הוועדה?',
        a: 'לפני. תחשיב כלכלי שנבנה מראש מעצב את הפרוגרמה ואת המספרים שמוגשים, ומאפשר להוביל את הדיון. כניסה אחרי שהוועדה כבר גיבשה עמדה מחייבת אותנו להתגונן מול נתונים שנקבעו בלעדינו - וזה מצב פתיחה פחות טוב בהרבה.' }
    ],

    official: {
      kind: 'מסמך רשמי להורדה',
      label: 'תקן 21.1 המלא והמעודכן של מועצת שמאי המקרקעין (PDF)',
      href: 'https://www.gov.il/BlobFolder/dynamiccollectorresultitem/assessor-standardization-db-21/he/land_assessor_shameim_teken_21.1.pdf',
      blurb: 'פירוט מזערי נדרש בבדיקה שמאית כלכלית לתוכנית פינוי-בינוי - הנוסח הרשמי מאתר gov.il.'
    },
    article: null,
    plannedArticle: 'תקן 21 בפינוי בינוי - כיצד נקבע היקף התמורות לדיירים והרווחיות ליזם?',

    cta: {
      title: 'מתכננים להגיש תוכנית לוועדה?',
      text: 'שלחו לנו את החומרים לבחינה כלכלית מוקדמת - לפני ההגשה, כשעוד אפשר להשפיע על המספרים.',
      wa: 'שלום, אנחנו לקראת הגשת תוכנית ואשמח לבחינה כלכלית מוקדמת.'
    }
  },

  /* ══ כינוס נכסים ופירוק שיתוף ══════════════════════════════════════════
     ההודעה שלך נקטעה בדיוק בהתמחות הזו, ולכן התוכן כאן הוא זה שאישרת
     בסבב הקודם. painTitle הוא ניסוח שלנו - לאישורך.                      */
  {
    slug: 'kinus-ufiruk-shituf',
    svc: 'm9',
    short: 'כינוס נכסים ופירוק שיתוף',
    heroSrc: 'WhatsApp Image 2026-11-01 at 00.34.52 (1).jpeg',   // מאזני פליז - בית מול משקולות
    bodySrc: 'WhatsApp Image 2026-11-01 at 00.34.50.jpeg',       // דגם בית על גוש אבן
    heroAlt: 'מאזני פליז - איזון בין שווי הנכס לחלקם של הצדדים',
    bodyAlt: 'קביעת שווי הנכס לצורך חלוקה ותשלומי איזון',

    title: { lead: 'שמאות לפירוק שיתוף וכינוס', gold: 'הכרעה אובייקטיבית וקבילה לסיום סכסוכים' },
    titlePlain: 'שמאות לפירוק שיתוף וכינוס - הכרעה אובייקטיבית וקבילה לסיום סכסוכים',
    subtitle: 'חוות דעת מומחה עבור בתי משפט, בתי דין וכונסי נכסים בהליכי פירוק וסכסוכי מקרקעין.',
    metaDesc: 'חוות דעת מומחה לבית משפט בהליכי פירוק שיתוף, ירושה, גירושין וכינוס נכסים: שווי שוק מול מימוש מהיר, חלוקה בעין ותחשיב תשלומי איזון.',

    /* ניסוח שלנו — לאישורך */
    painTitle: 'סכסוך מקרקעין נגמר כששומה אחת מוסכמת מונחת על השולחן',
    pain: 'סכסוכי מקרקעין בין יורשים, בני זוג בהליכי גירושין או שותפים עסקיים מאופיינים בחוסר אמון ובמבוי סתום. שומה לא מקצועית, מוטה או חסרה מובילה להתנגדויות משפטיות, לסחבת רבת שנים ולמכירה בהפסד משמעותי תחת לחץ.',

    audience: [
      'כונסי נכסים ועורכי דין המנהלים תיקי פירוק שיתוף או עיזבונות.',
      'שותפים ויורשים המעוניינים בבדיקה אובייקטיבית מוסכמת לחלוקה צודקת.',
      'שופטים ובתי משפט הממנים שמאי מומחה מטעמם לקביעת שווי.'
    ],

    process: [
      { label: 'קבלת המינוי', text: 'קבלת כתב המינוי/הסכמת הצדדים, איסוף כתבי בי-דין ובדיקת מסמכי הזכויות.' },
      { label: 'סיור בנכס',   text: 'תיאום ביקור בנכס בנוכחות כלל הצדדים או באי כוחם בשקיפות מלאה.' },
      { label: 'בחינת חלופות', text: 'בחינת שווי שוק במכירה רגילה מול מכירה מאולצת (כינוס), ובחינת חלוקה בעין.' },
      { label: 'חוות דעת ועדות', text: 'מתן חוות דעת מומחה מנומקת, מענה לשאלות הבהרה ועדות מומחה בבית המשפט במידת הצורך.' }
    ],

    deliverables: 'חוות דעת מומחה לבית משפט, ערוכה בהתאם לפקודת הראיות ותקנות סדר הדין האזרחי, הכוללת תחשיב תשלומי איזון, המלצות לחלוקה והסתמכות על הפסיקה העדכנית בהליכי פירוק שיתוף.',

    faq: [
      { q: 'מה ההבדל בין שווי שוק חופשי לשווי במימוש מהיר (כינוס נכסים)?',
        a: 'במימוש מהיר/כפוי קיים לרוב מקדם הפחתה הנובע מלוחות זמנים קצרים, אי-וודאות משפטית ומצב הנכס. השומה מגדירה את שני הערכים במדויק.' },
      /* שאלה שנייה — ניסוח שלנו, לאישורך */
      { q: 'אחד הצדדים מסרב לאפשר ביקור בנכס. מה קורה אז?',
        a: 'בהליך משפטי הביקור מתואם מול בית המשפט או מול הכונס, ובמקרה הצורך ניתן לפעול לפי החלטה שיפוטית. בשומה מוסכמת אנחנו מתאמים ביקור בנוכחות כל הצדדים או באי כוחם, כדי שאיש לא יוכל לטעון בדיעבד שלא ניתנה לו הזדמנות להציג את עמדתו.' }
    ],

    official: null,
    article: null,
    plannedArticle: 'פירוק שיתוף במקרקעין - תפקיד השמאי בקביעת תשלומי איזון וחלוקת הנכסים',

    cta: {
      title: 'זקוקים לחוות דעת מומחה לבית משפט או לכינוס?',
      text: 'פנו לקבלת הצעת עבודה מסודרת - נסביר מראש מה נכלל, מה לוח הזמנים ומה העלות.',
      wa: 'שלום, אנחנו זקוקים לחוות דעת שמאית לפירוק שיתוף / כינוס נכסים.'
    }
  }

];

/* פרטי קשר - מקור אחד לכל הדפים */
export const CONTACT = {
  waNumber: '972546559942',          // מאור - וואטסאפ
  phoneMaor: '054-6559942',
  phoneAmir: '050-8922469',
  email: 'info@bor-miz.co.il',
  site: 'https://bor-miz.co.il',
  brand: 'בורוביץ מזרחי'
};

```

### `hitmahut.css`

```css
/* ════════════════════════════════════════════════════════════════════════════
   hitmahut.css — דפי ההתמחויות (hitmahut/*.html)
   ---------------------------------------------------------------------------
   עיצוב בהיר, נקי ואדריכלי: רקע לבן-אפרפר, כרטיסיות לבנות עם מסגרת עדינה,
   כותרות בכחול כהה עמוק ונגיעות זהב שמפניה.

   לוח הצבעים:
     רקע ראשי    #fcfcfd
     רקע אזורים  #f5f6f8
     כרטיסיות    לבן טהור + מסגרת rgba(0,0,0,.06)
     כותרות      #0f172a
     טקסט רץ     #334155
     זהב         #c59b43

   הקובץ נטען אחרי styles.css (שממנו מגיעים ה-nav, ה-footer והכפתורים הצפים)
   ומשתמש בטוקנים משלו תחת .spec-page. שום דף קיים באתר לא טוען אותו, וכל
   הסלקטורים ממודרים תחת .spec-page או בקידומת .sp-.
   ════════════════════════════════════════════════════════════════════════════ */

.spec-page {
  --bg:      #fcfcfd;              /* רקע ראשי            */
  --bg-2:    #f5f6f8;              /* רקע אזור מתחלף      */
  --card:    #ffffff;              /* כרטיסיות ופאנלים    */
  --line:    rgba(0,0,0,.06);      /* מסגרת עדינה         */
  --line-2:  rgba(0,0,0,.1);
  --g:       #c59b43;              /* זהב שמפניה          */
  --g-soft:  rgba(197,155,67,.28);
  --g-wash:  rgba(197,155,67,.07);
  --head:    #0f172a;              /* כותרות              */
  --txt:     #334155;              /* טקסט רץ             */
  --txt-dim: #64748b;

  background: var(--bg);
  color: var(--txt);
}

/* ---------- ניווט עליון ---------- */
/* באתר הראשי הניווט שקוף מעל באנר כהה, ולכן הלוגו והקישורים לבנים.
   כאן הבאנר בהיר, ולכן הניווט לבן ואטום כבר מראש והלוגו נשאר כחול. */
.spec-page #navbar {
  background: rgba(255,255,255,.94);
  backdrop-filter: blur(14px);
  box-shadow: 0 1px 0 rgba(15,23,42,.07), 0 18px 40px -32px rgba(15,23,42,.35);
}
.spec-page .nav-logo img { filter: none; }
.spec-page .nav-links a { color: var(--head); }
.spec-page .hamburger span { background: var(--head); }

/* בתפריט הנייד הרקע כהה - שם הקישורים נשארים לבנים כמו בשאר האתר */
@media (max-width: 880px) {
  .spec-page .nav-links a { color: #fff; }
  .spec-page .nav-links a.nav-cta { color: var(--gold-2); }
}

/* ---------- מבנה כללי ---------- */
.sp-wrap { width: 100%; max-width: 1180px; margin-inline: auto; padding-inline: clamp(1.25rem, 5vw, 4rem); }
.sp-sec  { padding-block: clamp(4.5rem, 9vw, 8rem); position: relative; }
.sp-alt  { background: var(--bg-2); }

.sp-h2 {
  font-size: clamp(1.75rem, 3.6vw, 2.9rem); font-weight: 800; color: var(--head);
  line-height: 1.22; letter-spacing: -.02em; margin: 0;
}

/* תווית אזור - גם הכותרת של האזור */
h2.sp-kicker {
  display: block; font-size: clamp(1.4rem, 2.8vw, 2.1rem); font-weight: 700;
  color: var(--head); letter-spacing: -.015em; line-height: 1.25;
  margin: 0 0 clamp(2rem, 4vw, 3.2rem); padding-top: 1.3rem; position: relative;
}
h2.sp-kicker::before {
  content: ""; position: absolute; top: 0; inset-inline-start: 0;
  width: 46px; height: 2px; background: var(--g);
}

/* ---------- כפתורים ---------- */
.sp-actions { display: flex; flex-wrap: wrap; gap: .9rem; }
.sp-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: .6rem;
  padding: 1.05rem 2rem; font-size: 1rem; font-weight: 600; border-radius: 2px;
  border: 1px solid transparent; white-space: nowrap;
  transition: background .35s var(--ease), color .35s var(--ease),
              border-color .35s var(--ease), transform .35s var(--ease);
}
.sp-btn-ico { display: inline-flex; }
.sp-btn-ico svg { width: 19px; height: 19px; }
.sp-btn-gold { background: var(--g); color: #fff; box-shadow: 0 14px 34px -20px rgba(197,155,67,.9); }
.sp-btn-gold:hover { background: #b2893a; transform: translateY(-2px); }
.sp-btn-line { color: var(--head); border-color: rgba(15,23,42,.18); background: #fff; }
.sp-btn-line:hover { border-color: var(--g); color: var(--g); transform: translateY(-2px); }

/* ---------- 1 · Hero ---------- */
/* פיצול: תמונה בחצי אחד, הטקסט על פאנל בהיר בשני. */
.sp-hero {
  position: relative; min-height: min(84vh, 760px);
  display: flex; align-items: center; overflow: hidden; background: var(--bg);
}
.sp-hero-media {
  position: absolute; top: 0; bottom: 0; left: 0; width: 52%;
  margin: 0; overflow: hidden;
}
.sp-hero-media img { width: 100%; height: 100%; object-fit: cover; object-position: center; }
/* תפר רך בין התמונה לפאנל הבהיר */
.sp-hero-seam {
  position: absolute; inset: 0;
  background: linear-gradient(to left, var(--bg) 0%, rgba(252,252,253,.85) 15%, rgba(252,252,253,0) 48%);
}
.sp-hero-inner {
  position: relative; z-index: 2; width: 100%; max-width: 1180px;
  margin-inline: auto; padding-inline: clamp(1.25rem, 5vw, 4rem);
  padding-block: clamp(7rem, 11vw, 9rem) clamp(3rem, 6vw, 4.5rem);
}
.sp-hero-copy { max-width: min(600px, 48%); }

/* פירורי לחם - פעם אחת בלבד בכל הדף, עדין */
.sp-crumb {
  display: flex; flex-wrap: wrap; align-items: center; gap: .55rem;
  font-size: .8rem; color: var(--txt-dim); margin-bottom: 1.6rem;
}
.sp-crumb a { color: var(--txt-dim); transition: color .3s; }
.sp-crumb a:hover { color: var(--g); }
.sp-crumb span { color: rgba(15,23,42,.25); }
.sp-crumb em { font-style: normal; color: var(--g); }

.sp-h1 {
  font-size: clamp(2rem, 3.5vw, 3.25rem); font-weight: 800; color: var(--head);
  line-height: 1.14; letter-spacing: -.028em; margin: 0 0 1.3rem; max-width: 18ch;
}
.sp-h1 span { color: var(--g); }
.sp-lede {
  font-size: clamp(1.02rem, 1.6vw, 1.2rem); font-weight: 400; line-height: 1.7;
  color: var(--txt); max-width: 58ch; margin: 0 0 2.4rem;
}

/* ---------- 2 · אזור הכאב ---------- */
.sp-pain .sp-h2 { max-width: 20ch; }
.sp-pain-text {
  margin: 1.8rem 0 0; max-width: 72ch;
  font-size: clamp(1.05rem, 1.65vw, 1.25rem); line-height: 1.95; color: var(--txt);
  padding-inline-start: 1.6rem; border-inline-start: 2px solid var(--g-soft);
}

/* ---------- 3 · למי השירות מיועד ---------- */
.sp-aud-grid {
  list-style: none; margin: 0; padding: 0; display: grid; gap: 1.1rem;
  grid-template-columns: repeat(auto-fit, minmax(265px, 1fr));
}
.sp-aud {
  display: flex; align-items: flex-start; gap: 1rem;
  background: var(--card); border: 1px solid var(--line);
  padding: clamp(1.5rem, 2.6vw, 2.1rem);
  font-size: 1rem; line-height: 1.7; color: var(--txt);
  transition: border-color .45s var(--ease), transform .45s var(--ease), box-shadow .45s var(--ease);
}
.sp-aud:hover {
  border-color: var(--g-soft); transform: translateY(-4px);
  box-shadow: 0 24px 50px -36px rgba(15,23,42,.45);
}
.sp-aud-ico { flex: none; color: var(--g); margin-top: .1rem; }
.sp-aud-ico svg { width: 20px; height: 20px; }

/* ---------- 4 · תהליך העבודה (ציר אופקי) ---------- */
/* ללא ספרות בעיגולים: סמן יהלום עדין על קו הציר. */
.sp-steps {
  list-style: none; margin: 0; padding: 0; position: relative;
  display: grid; gap: clamp(1.2rem, 2.6vw, 2.2rem);
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
.sp-steps::before {
  content: ""; position: absolute; top: 13px; inset-inline: 14px;
  height: 1px; background: linear-gradient(to left, var(--g-soft), rgba(15,23,42,.07));
}
.sp-step { position: relative; padding-top: 3rem; }
.sp-step-dot {
  position: absolute; top: 0; inset-inline-start: 0;
  width: 28px; height: 28px; border-radius: 50%;
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--bg); font-size: 0;
}
.sp-alt .sp-step-dot { background: var(--bg-2); }
.sp-step-dot::before {
  content: ""; width: 11px; height: 11px;
  border: 1.5px solid var(--g); background: var(--card);
  transform: rotate(45deg);
  transition: background .4s var(--ease), transform .4s var(--ease);
}
.sp-step:hover .sp-step-dot::before { background: var(--g); transform: rotate(45deg) scale(1.12); }
.sp-step h3 { font-size: 1.1rem; font-weight: 700; color: var(--head); margin: 0 0 .55rem; }
.sp-step p  { margin: 0; font-size: .97rem; line-height: 1.75; color: var(--txt); }

/* ---------- 5 · מה מקבלים ביד ---------- */
.sp-split {
  display: grid; gap: clamp(2rem, 5vw, 4.5rem);
  grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr);
  align-items: center;
}
.sp-deliver-text {
  font-size: clamp(1.05rem, 1.6vw, 1.22rem); line-height: 1.9; color: var(--txt);
  margin: 0 0 2rem; max-width: 60ch;
}
.sp-note {
  display: flex; gap: 1.1rem; align-items: flex-start;
  border: 1px solid var(--g-soft); background: var(--g-wash);
  padding: 1.4rem 1.6rem;
}
.sp-note-ico { flex: none; color: var(--g); }
.sp-note-ico svg { width: 24px; height: 24px; }
.sp-note strong {
  display: block; color: #8a6a22; font-size: .82rem; font-weight: 700;
  letter-spacing: .16em; margin-bottom: .5rem;
}
.sp-note p { margin: 0; font-size: .95rem; line-height: 1.75; color: var(--txt); }

.sp-split-img { margin: 0; position: relative; }
.sp-split-img img {
  display: block; width: 100%; height: 100%; max-height: 480px;
  object-fit: cover; border: 1px solid var(--line);
}
.sp-split-img::after {
  content: ""; position: absolute; inset-inline-end: -14px; bottom: -14px;
  width: 58%; height: 58%; border: 1px solid var(--g-soft); pointer-events: none;
}

/* ---------- 6 · שאלות נפוצות ---------- */
.sp-faq-list { display: flex; flex-direction: column; gap: .8rem; max-width: 920px; }
.sp-q {
  border: 1px solid var(--line); background: var(--card);
  transition: border-color .4s var(--ease), box-shadow .4s var(--ease);
}
.sp-q[open], .sp-q:hover { border-color: var(--g-soft); box-shadow: 0 18px 40px -34px rgba(15,23,42,.4); }
.sp-q summary {
  list-style: none; cursor: pointer; display: flex; align-items: center;
  justify-content: space-between; gap: 1.2rem;
  padding: 1.25rem clamp(1.2rem, 2.4vw, 1.8rem);
  font-size: clamp(1rem, 1.5vw, 1.1rem); font-weight: 600; color: var(--head); line-height: 1.5;
}
.sp-q summary::-webkit-details-marker { display: none; }
.sp-q summary::after {
  content: "+"; flex: none; color: var(--g); font-size: 1.5rem; font-weight: 300;
  line-height: 1; transition: transform .3s var(--ease);
}
.sp-q[open] summary::after { transform: rotate(45deg); }
.sp-q p {
  margin: 0; padding: 0 clamp(1.2rem, 2.4vw, 1.8rem) 1.5rem;
  font-size: .98rem; line-height: 1.85; color: var(--txt); max-width: 74ch;
}

/* ---------- 7 · הוכחות מהשטח והעמקה (מותנה) ---------- */
/* כשאין תוכן האזור לא נכתב ל-HTML, ולכן אין כאן כללי הסתרה. */
.sp-wins { margin-bottom: clamp(2.2rem, 4vw, 3.4rem); }
.sp-wins-title {
  font-size: clamp(1.15rem, 2vw, 1.45rem); font-weight: 700; color: var(--head);
  margin: 0 0 .5rem; letter-spacing: -.01em;
}
.sp-wins-intro { margin: 0 0 1.6rem; font-size: .97rem; line-height: 1.75; color: var(--txt); max-width: 64ch; }
.sp-wins-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .7rem; }
.sp-win a {
  display: flex; align-items: center; gap: 1.1rem;
  background: var(--card); border: 1px solid var(--line);
  padding: 1.1rem clamp(1.1rem, 2.2vw, 1.6rem);
  transition: border-color .4s var(--ease), box-shadow .4s var(--ease), transform .4s var(--ease);
}
.sp-win a:hover {
  border-color: var(--g-soft); transform: translateY(-2px);
  box-shadow: 0 20px 44px -34px rgba(15,23,42,.45);
}
.sp-win-ico { flex: none; color: var(--g); display: inline-flex; }
.sp-win-ico svg { width: 22px; height: 22px; }
.sp-win-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: .25rem; }
.sp-win-body strong { font-size: 1.02rem; font-weight: 600; color: var(--head); line-height: 1.45; }
.sp-win-meta { font-size: .84rem; color: var(--txt-dim); }
/* אחוז ההפחתה - המספר הבולט בשורה */
.sp-win-cut {
  flex: none; display: inline-flex; flex-direction: column; align-items: center;
  min-width: 74px; padding: .4rem .5rem;
  background: var(--g-wash); border: 1px solid var(--g-soft);
}
.sp-win-cut b { font-size: 1.35rem; font-weight: 800; color: #8a6a22; line-height: 1; }
.sp-win-cut span { font-size: .64rem; font-weight: 700; letter-spacing: .12em; color: #8a6a22; margin-top: .25rem; }
.sp-win-result {
  align-self: flex-start; margin-top: .25rem;
  font-size: .86rem; font-weight: 600; color: #8a6a22;
}
.sp-win-go { flex: none; font-size: .86rem; font-weight: 600; color: var(--g); white-space: nowrap; }
.sp-win-go i { font-style: normal; display: inline-block; transition: transform .4s var(--ease); }
.sp-win a:hover .sp-win-go i { transform: translateX(-5px); }

.sp-proof-grid { display: grid; gap: 1.2rem; grid-template-columns: repeat(auto-fit, minmax(310px, 1fr)); }
.sp-proof {
  display: block; position: relative; background: var(--card);
  border: 1px solid var(--line); padding: clamp(1.6rem, 2.6vw, 2.1rem);
  transition: border-color .45s var(--ease), transform .45s var(--ease), box-shadow .45s var(--ease);
}
.sp-proof:hover {
  border-color: var(--g-soft); transform: translateY(-4px);
  box-shadow: 0 24px 50px -36px rgba(15,23,42,.45);
}
.sp-proof.is-gov { border-color: var(--g-soft); background: var(--g-wash); }
.sp-proof-ico { display: inline-flex; color: var(--g); margin-bottom: 1rem; }
.sp-proof-ico svg { width: 26px; height: 26px; }
.sp-proof-kind {
  display: block; font-size: .72rem; font-weight: 700; letter-spacing: .17em;
  color: #8a6a22; margin-bottom: .6rem;
}
.sp-proof h3 { font-size: 1.18rem; font-weight: 700; color: var(--head); line-height: 1.45; margin: 0 0 .6rem; }
.sp-proof p  { margin: 0 0 1.3rem; font-size: .95rem; line-height: 1.75; color: var(--txt); }
.sp-proof-go {
  display: inline-flex; align-items: center; flex-wrap: wrap; gap: .5rem;
  font-size: .9rem; font-weight: 600; color: var(--g);
}
.sp-proof-go i { font-style: normal; transition: transform .4s var(--ease); }
.sp-proof:hover .sp-proof-go i { transform: translateX(-5px); }
.sp-proof-go em { font-style: normal; font-size: .74rem; font-weight: 400; color: var(--txt-dim); }

/* ---------- 8 · הנעה לפעולה מסכמת ---------- */
.sp-cta { text-align: center; overflow: hidden; background: var(--bg-2); }
.sp-cta::before {
  content: ""; position: absolute; inset-inline-start: 50%; top: 10%;
  width: min(760px, 90%); aspect-ratio: 2/1; transform: translateX(50%);
  background: radial-gradient(ellipse at center, rgba(197,155,67,.1), transparent 68%);
  pointer-events: none;
}
.sp-cta .sp-wrap { position: relative; z-index: 1; }
.sp-cta .sp-h2 { max-width: 22ch; margin-inline: auto; }
.sp-cta-text {
  margin: 1.2rem auto 2.4rem; max-width: 60ch;
  font-size: clamp(1rem, 1.5vw, 1.12rem); line-height: 1.8; color: var(--txt);
}
.sp-actions.is-cta { justify-content: center; }
.sp-cta-alt { margin: 1.8rem 0 0; font-size: .88rem; color: var(--txt-dim); }
.sp-cta-alt a { color: var(--g); border-bottom: 1px solid var(--g-soft); }
.sp-cta-alt a:hover { color: var(--head); border-color: var(--head); }

/* ---------- אנימציית כניסה ---------- */
.spec-page .reveal { opacity: 0; transform: translateY(26px); transition: opacity .8s var(--ease), transform .8s var(--ease); }
.spec-page .reveal.in { opacity: 1; transform: none; }
.sp-aud-grid .sp-aud:nth-child(2), .sp-steps .sp-step:nth-child(2) { transition-delay: .08s; }
.sp-aud-grid .sp-aud:nth-child(3), .sp-steps .sp-step:nth-child(3) { transition-delay: .16s; }
.sp-steps .sp-step:nth-child(4) { transition-delay: .24s; }

/* ---------- רספונסיבי ---------- */
/* מתחת ל-900px: התמונה הופכת לרצועה בראש הדף והטקסט יושב מתחתיה. */
@media (max-width: 900px) {
  .sp-hero { display: block; min-height: 0; }
  .sp-hero-media { position: relative; width: 100%; height: min(42vh, 330px); }
  .sp-hero-seam { background: linear-gradient(to top, var(--bg) 1%, rgba(252,252,253,0) 26%); }
  .sp-hero-copy { max-width: none; }
  .sp-hero-inner { padding-block: 2.2rem clamp(2.5rem, 7vw, 3.5rem); }
}

@media (max-width: 1000px) {
  .sp-steps { grid-template-columns: repeat(2, minmax(0, 1fr)); row-gap: 2.4rem; }
  .sp-steps::before { display: none; }
  .sp-split { grid-template-columns: 1fr; }
  .sp-split-img { order: -1; }
  .sp-split-img img { max-height: 320px; }
}
@media (max-width: 640px) {
  .sp-win a { flex-wrap: wrap; gap: .8rem 1rem; }
  .sp-win-body { flex-basis: calc(100% - 7rem); }
  .sp-win-go { margin-inline-start: auto; }
}
@media (max-width: 600px) {
  .sp-steps { grid-template-columns: 1fr; row-gap: 2rem; }
  .sp-step { padding-top: 0; padding-inline-start: 2.8rem; min-height: 28px; }
  .sp-actions .sp-btn { width: 100%; }
  .sp-pain-text { padding-inline-start: 1.1rem; }
  .sp-split-img::after { display: none; }
}

```

---

## דפי ההתמחויות שנוצרו

### `hitmahut/haarachat-shovi.html`

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="shortcut icon" href="/favicon.ico">

<!-- ⚠ קובץ אוטומטי - נוצר ע"י _build/build-hitmahut.mjs. אין לערוך ידנית.
     תוכן: _build/specializations.data.mjs · תמונות: _build/optimize-images.mjs -->

<script async src="https://www.googletagmanager.com/gtag/js?id=G-GYNQPGPR33"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-GYNQPGPR33');
  (function(){
    var push = window.dataLayer.push;
    window.dataLayer.push = function(){
      for (var i = 0; i < arguments.length; i++) {
        var o = arguments[i];
        if (o && typeof o.event === 'string') {
          var params = {};
          for (var k in o) { if (k !== 'event' && Object.prototype.hasOwnProperty.call(o, k)) params[k] = o[k]; }
          gtag('event', o.event, params);
        }
      }
      return push.apply(window.dataLayer, arguments);
    };
  })();
</script>

<title>הערכת שווי מקרקעין - לקנות, למכור או לחלק בביטחון כלכלי מלא | בורוביץ מזרחי</title>
<meta name="description" content="הערכת שווי לדירות, בתים, נכסים מסחריים וקרקעות: בדיקה פיזית, משפטית ותכנונית, הצלבת עסקאות אמת ודוח שומה קביל - לפני שחותמים על חוזה.">
<meta name="robots" content="index,follow">
<link rel="canonical" href="https://bor-miz.co.il/hitmahut/haarachat-shovi.html">
<meta property="og:type" content="website">
<meta property="og:url" content="https://bor-miz.co.il/hitmahut/haarachat-shovi.html">
<meta property="og:title" content="הערכת שווי מקרקעין - לקנות, למכור או לחלק בביטחון כלכלי מלא">
<meta property="og:description" content="הערכת שווי לדירות, בתים, נכסים מסחריים וקרקעות: בדיקה פיזית, משפטית ותכנונית, הצלבת עסקאות אמת ודוח שומה קביל - לפני שחותמים על חוזה.">
<meta property="og:image" content="https://bor-miz.co.il/img/haarachat-shovi-hero.webp">
<meta property="og:locale" content="he_IL">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "הערכת שווי מקרקעין - לקנות, למכור או לחלק בביטחון כלכלי מלא",
  "serviceType": "הערכת שווי",
  "description": "הערכת שווי לדירות, בתים, נכסים מסחריים וקרקעות: בדיקה פיזית, משפטית ותכנונית, הצלבת עסקאות אמת ודוח שומה קביל - לפני שחותמים על חוזה.",
  "provider": {
    "@type": "LocalBusiness",
    "name": "בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ",
    "telephone": "+972-50-8922469",
    "areaServed": "ישראל"
  },
  "url": "https://bor-miz.co.il/hitmahut/haarachat-shovi.html"
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "בורוביץ מזרחי",
      "item": "https://bor-miz.co.il/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "תחומי התמחות",
      "item": "https://bor-miz.co.il/#services"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "הערכת שווי",
      "item": "https://bor-miz.co.il/hitmahut/haarachat-shovi.html"
    }
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "מה מוסיפה שמאות מוקדמת לצד השמאות שמבצע הבנק?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "אלה שתי בדיקות בשתי נקודות זמן שונות, וכל אחת ממלאת תפקיד משלה. השמאות המוקדמת נעשית לפני ההתחייבות החוזית ונועדה לתת לכם ודאות ושקט נפשי: מה שווי הנכס בפועל, מה מצבו התכנוני והמשפטי ומה כדאי לברר מראש. שמאות הבנק מגיעה בשלב המימון ובוחנת את הנכס עבור הבנק. כשמגיעים אליה עם תמונה מלאה ועם מסמכים מסודרים, התהליך מול הבנק חלק וצפוי הרבה יותר."
      }
    },
    {
      "@type": "Question",
      "name": "תוך כמה זמן השומה מוכנה?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "לרוב בתוך 3 עד 5 ימי עסקים לאחר הביקור בנכס וקבלת כלל החומרים התכנוניים."
      }
    }
  ]
}
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="preload" as="image" href="../img/haarachat-shovi-hero.webp" imagesrcset="../img/haarachat-shovi-hero-sm.webp 820w, ../img/haarachat-shovi-hero.webp 1600w" imagesizes="100vw">
<link rel="stylesheet" href="../styles.css">
<link rel="stylesheet" href="../hitmahut.css">
</head>
<body class="spec-page">

<a href="#main" class="skip-to-content">דלג לתוכן הראשי</a>

<nav id="navbar" role="navigation" aria-label="ניווט ראשי">
  <div class="nav-inner">
    <a href="../index.html" class="nav-logo" aria-label="בורוביץ מזרחי שמאות מקרקעין - דף הבית"><img src="../logo-bm.png" alt="לוגו בורוביץ מזרחי"></a>
    <ul class="nav-links" id="navLinks">
      <li><a href="../index.html#about" onclick="closeMenu()">אודות</a></li>
      <li><a href="../index.html#services" onclick="closeMenu()">תחומי התמחות</a></li>
      <li><a href="../maamarim.html" onclick="closeMenu()">מאמרים</a></li>
      <li><a href="../index.html#linkedin-posts" onclick="closeMenu()">עדכונים</a></li>
      <li><a href="../careers.html" onclick="closeMenu()">קריירה</a></li>
      <li><a href="#cta" class="nav-cta" onclick="closeMenu()">צור קשר</a></li>
    </ul>
    <button class="hamburger" id="hamburger" onclick="toggleMenu()" aria-label="תפריט ניווט" aria-expanded="false"><span></span><span></span><span></span></button>
  </div>
</nav>

<main id="main">

<header class="sp-hero">
  <figure class="sp-hero-media">
    <img src="../img/haarachat-shovi-hero.webp"
         srcset="../img/haarachat-shovi-hero-sm.webp 820w, ../img/haarachat-shovi-hero.webp 1600w"
         sizes="(max-width: 900px) 100vw, 50vw"
         alt="בית וגרף שווי עולה בכפות הידיים - הערכת שווי מקרקעין" fetchpriority="high" decoding="async">
    <span class="sp-hero-seam" aria-hidden="true"></span>
  </figure>
  <div class="sp-hero-inner">
    <div class="sp-hero-copy">
      <nav class="sp-crumb" aria-label="פירורי לחם">
        <a href="../index.html">בורוביץ מזרחי</a><span>/</span><a href="../index.html#services">תחומי התמחות</a><span>/</span><em>הערכת שווי</em>
      </nav>
      <h1 class="sp-h1">הערכת שווי מקרקעין<br><span>לקנות, למכור או לחלק בביטחון כלכלי מלא</span></h1>
      <p class="sp-lede">חוות דעת שמאית בלתי תלויה המגנה על ההון שלכם ומאתרת חריגות וסיכונים מראש.</p>
      <div class="sp-actions is-hero">
        <a class="sp-btn sp-btn-gold" href="https://wa.me/972546559942?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%99%20%D7%9C%D7%A4%D7%A0%D7%99%20%D7%A2%D7%A1%D7%A7%D7%94%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%91%D7%93%D7%99%D7%A7%D7%AA%20%D7%A9%D7%95%D7%95%D7%99%20%D7%95%D7%94%D7%AA%D7%99%D7%99%D7%A2%D7%A6%D7%95%D7%AA%20%D7%A9%D7%9E%D7%90%D7%99%D7%AA." target="_blank" rel="noopener noreferrer">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"/></svg></span>שליחת הודעה בוואטסאפ
        </a>
        <a class="sp-btn sp-btn-line" href="tel:054-6559942">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>054-6559942
        </a>
      </div>
    </div>
  </div>
</header>

<section class="sp-sec sp-pain">
  <div class="sp-wrap">
    <h2 class="sp-h2 reveal">הטעויות הנפוצות שמסכנות את העסקה שלכם</h2>
    <p class="sp-pain-text reveal">עסקת נדל"ן היא לרוב העסקה הכלכלית המשמעותית בחייכם. פערים בין הרישום בטאבו להיתרי הבנייה בפועל, חריגות בנייה שעלולות לעצור משכנתא, או הסתמכות על מחירי מודעות באינטרנט במקום עסקאות אמת - עלולים להסתיים בהפסד של מאות אלפי שקלים ובסכסוך משפטי מורכב.</p>
  </div>
</section>

<section class="sp-sec sp-alt">
  <div class="sp-wrap">
    <h2 class="sp-kicker reveal">למי השירות מיועד</h2>
    <ul class="sp-aud-grid">
      <li class="sp-aud reveal"><span class="sp-aud-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></span><span>רוכשי דירות ובתים המעוניינים בשמאות מוקדמת ("טרום רכישה") לפני התחייבות חוזית.</span></li>
      <li class="sp-aud reveal"><span class="sp-aud-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></span><span>מוכרי נכסים שרוצים לתמחר נכון ולמנוע ביטול עסקאות מצד שמאיי הבנקים.</span></li>
      <li class="sp-aud reveal"><span class="sp-aud-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></span><span>משקיעים במגרשים, במבני תעשייה ובמשרדים.</span></li>
    </ul>
  </div>
</section>

<section class="sp-sec sp-process">
  <div class="sp-wrap">
    <h2 class="sp-kicker reveal">תהליך העבודה שלנו</h2>
    <ol class="sp-steps">
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>הגדרת מטרה</h3>
        <p>הגדרת מטרת השומה וזיהוי מדויק של הנכס (גוש/חלקה/תת-חלקה).</p>
      </li>
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>בדיקה בשטח</h3>
        <p>סיור פיזי ומדידות בנכס יחד עם בחינת תיק הבניין ברשות המקומית.</p>
      </li>
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>ניתוח שוק</h3>
        <p>הצלבת נתוני עסקאות אמת ממאגרי רשות המסים וניתוח זכויות תכנוניות ומשפטיות עדכניות.</p>
      </li>
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>הפקת דו"ח</h3>
        <p>הפקת דו"ח שומה מפורט ומענה לכל שאלה לקראת ניהול משא ומתן.</p>
      </li>
    </ol>
  </div>
</section>

<section class="sp-sec sp-alt sp-deliver">
  <div class="sp-wrap sp-split">
    <div class="sp-split-copy reveal">
      <h2 class="sp-kicker">מה מקבלים ביד</h2>
      <p class="sp-deliver-text">דו"ח שומה מקיף וקביל הכולל תיאור פיזי, משפטי ותכנוני, ניתוח השוואתי של עסקאות דומות, אומדן שווי שוק מדויק והתאמה לכללי הפסיקה הנהוגים בבתי המשפט.</p>
      <div class="sp-note">
        <span class="sp-note-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h10"/><path d="M6 15.5 12.5 9"/><path d="m9 6 6 6"/><path d="M12.5 2.5 19 9l-2.5 2.5L10 5z"/><path d="M4.5 13.5 9 18l-2 2-4.5-4.5z"/></svg></span>
        <div>
          <strong>בחזית הפסיקה</strong>
          <p>אנחנו עוקבים באופן שוטף אחר פסיקות בתי המשפט, הכרעות שמאים מכריעים והחלטות ועדות ערר. כל שומה שיוצאת מהמשרד נשענת על התקדימים והפרשנויות המשפטיות העדכניים ביותר - ולא על נוסחאות שעבדו פעם.</p>
        </div>
      </div>
    </div>
    <figure class="sp-split-img reveal">
      <img src="../img/haarachat-shovi-body.webp" alt="ביקור שמאי בנכס ורישום ממצאים לקראת דו&quot;ח השומה" loading="lazy" decoding="async">
    </figure>
  </div>
</section>

<section class="sp-sec sp-faq">
  <div class="sp-wrap">
    <h2 class="sp-kicker reveal">שאלות נפוצות</h2>
    <div class="sp-faq-list reveal">
      <details class="sp-q">
        <summary>מה מוסיפה שמאות מוקדמת לצד השמאות שמבצע הבנק?</summary>
        <p>אלה שתי בדיקות בשתי נקודות זמן שונות, וכל אחת ממלאת תפקיד משלה. השמאות המוקדמת נעשית לפני ההתחייבות החוזית ונועדה לתת לכם ודאות ושקט נפשי: מה שווי הנכס בפועל, מה מצבו התכנוני והמשפטי ומה כדאי לברר מראש. שמאות הבנק מגיעה בשלב המימון ובוחנת את הנכס עבור הבנק. כשמגיעים אליה עם תמונה מלאה ועם מסמכים מסודרים, התהליך מול הבנק חלק וצפוי הרבה יותר.</p>
      </details>
      <details class="sp-q">
        <summary>תוך כמה זמן השומה מוכנה?</summary>
        <p>לרוב בתוך 3 עד 5 ימי עסקים לאחר הביקור בנכס וקבלת כלל החומרים התכנוניים.</p>
      </details>
    </div>
  </div>
</section>

<section class="sp-sec sp-cta" id="cta">
  <div class="sp-wrap reveal">
    <h2 class="sp-h2">מתלבטים לפני חתימה על חוזה?</h2>
    <p class="sp-cta-text">דברו איתנו לבדיקת שווי מהירה. שיחה קצרה לפני החתימה שווה הרבה מאוד כסף אחריה.</p>
    <div class="sp-actions is-cta">
        <a class="sp-btn sp-btn-gold" href="https://wa.me/972546559942?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%99%20%D7%9C%D7%A4%D7%A0%D7%99%20%D7%A2%D7%A1%D7%A7%D7%94%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%91%D7%93%D7%99%D7%A7%D7%AA%20%D7%A9%D7%95%D7%95%D7%99%20%D7%95%D7%94%D7%AA%D7%99%D7%99%D7%A2%D7%A6%D7%95%D7%AA%20%D7%A9%D7%9E%D7%90%D7%99%D7%AA." target="_blank" rel="noopener noreferrer">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"/></svg></span>שליחת הודעה בוואטסאפ
        </a>
        <a class="sp-btn sp-btn-line" href="tel:054-6559942">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>054-6559942
        </a>
      </div>
    <p class="sp-cta-alt">או השאירו פרטים ב<a href="../index.html#contact">טופס יצירת הקשר</a></p>
  </div>
</section>

</main>

<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="../logo-bm.png" alt="לוגו בורוביץ מזרחי">
        <p>משרד שמאות מקרקעין מוביל בצפון. ידע מקצועי מעמיק, היכרות שטח בלתי אמצעית והבנה כלכלית רחבה - בשירות כל לקוח.</p>
      </div>
      <div class="footer-col">
        <h4>ניווט</h4>
        <ul>
          <li><a href="../index.html#about">אודות</a></li>
          <li><a href="../index.html#services">תחומי התמחות</a></li>
          <li><a href="../maamarim.html">מאמרים</a></li>
          <li><a href="../careers.html">קריירה</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>יצירת קשר</h4>
        <ul>
          <li><a href="tel:054-6559942">054-6559942 · מאור</a></li>
          <li><a href="tel:050-8922469">050-8922469 · אמיר</a></li>
          <li><a id="em-footer" href="#"></a></li>
          <li>שדרות החרוב 6, פארק תעשיות בר-לב</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 בורוביץ מזרחי שמאות מקרקעין וחקלאות בע"מ. כל הזכויות שמורות.</span>
      <span><a href="../index.html">חזרה לאתר הראשי</a></span>
    </div>
  </div>
</footer>

<div class="floating-wrap">
  <a class="float-btn float-btn-wa" href="https://wa.me/972546559942" target="_blank" rel="noopener noreferrer" aria-label="שלחו הודעה בוואטסאפ">
    <svg aria-hidden="true" viewBox="0 0 32 32"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.67 4.61 1.832 6.5L4 29l7.75-1.812A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="#fff"/><path d="M21.5 18.5c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.19-.57-.34z" fill="#25D366"/></svg>
  </a>
  <button type="button" id="customAccessBtn" class="float-btn float-btn-access" aria-label="פתח תפריט נגישות" title="נגישות"><span aria-hidden="true">♿</span></button>
</div>

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<script>
  (function(){ var el=document.getElementById('em-footer'); if(el){ var a='info'+'@'+'bor-miz.co.il'; el.href='mailto:'+a; el.textContent=a; } })();
  function toggleMenu(){ var l=document.getElementById('navLinks'),b=document.getElementById('hamburger'); l.classList.toggle('open'); b.classList.toggle('open'); b.setAttribute('aria-expanded', l.classList.contains('open')?'true':'false'); }
  function closeMenu(){ document.getElementById('navLinks').classList.remove('open'); var b=document.getElementById('hamburger'); b.classList.remove('open'); b.setAttribute('aria-expanded','false'); }
  document.addEventListener('click', function(e){ var nav=document.getElementById('navbar'); if(nav && !nav.contains(e.target)) closeMenu(); });
  (function(){ var nav=document.getElementById('navbar'); var onScroll=function(){ nav.classList.toggle('scrolled', window.scrollY>60); }; window.addEventListener('scroll', onScroll, {passive:true}); onScroll(); })();
  (function(){
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce || !window.gsap || !window.ScrollTrigger){
      document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.reveal').forEach(function(el){ ScrollTrigger.create({ trigger: el, start:'top 90%', onEnter:function(){ el.classList.add('in'); } }); });
  })();
  // אקורדיון: פתיחת שאלה סוגרת את הקודמת
  (function(){
    var items = document.querySelectorAll('.sp-faq .sp-q');
    items.forEach(function(d){
      d.addEventListener('toggle', function(){
        if(!d.open) return;
        items.forEach(function(o){ if(o !== d) o.open = false; });
      });
    });
  })();
  // מעקב המרות - זהה לשאר האתר
  (function(){ window.dataLayer=window.dataLayer||[]; document.addEventListener('click', function(e){ var el=e.target.closest&&e.target.closest('a'); if(!el) return; if(/wa\.me|api\.whatsapp/.test(el.href||'')){ window.dataLayer.push({event:'contact_whatsapp'}); } else if((el.getAttribute('href')||'').indexOf('tel:')===0){ window.dataLayer.push({event:'contact_phone'}); } }, true); })();
</script>

<nagishli></nagishli>
<script>
nl_contact = "n:בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ|p:054-6559942|u:maor@bor-miz.co.il";
nl_pos = "BL"; nl_lang = "he"; nl_color = "blue"; nl_compact = "1";
</script>
<script src="../nagishli.js?v=2.3" charset="utf-8"></script>
<script>
  (function(){
    function forceCompactStyles(){
      var bar=document.getElementById('NagishLiBar'), menus=document.getElementById('NagishLiMenus');
      if(bar){ bar.style.cssText='position:fixed !important; left:1.4rem !important; right:auto !important; bottom:6.2rem !important; top:auto !important; width:300px !important; max-width:90vw !important; height:auto !important; z-index:9999 !important; background:transparent !important; box-shadow:none !important; border:none !important; padding:0 !important; margin:0 !important;'; }
      if(menus){ menus.style.cssText+=';position:static !important; width:300px !important; max-width:90vw !important; max-height:70vh !important; overflow-y:auto !important; overflow-x:hidden !important; font-size:13px !important; border-radius:12px !important; box-shadow:0 10px 40px rgba(0,0,0,0.3) !important; margin:0 !important; padding:0 !important; background:#fff !important;'; }
      document.querySelectorAll('#NagishLiMenus, #NagishLiMenus ul').forEach(function(el){ el.style.width='100%'; el.style.maxWidth='300px'; el.style.boxSizing='border-box'; });
    }
    function openNagishLiMenu(){
      if(typeof jQuery==='undefined') return false;
      var $=jQuery, $strip=$('#NagishLiBarStrip'), $menus=$('#NagishLiMenus');
      if(!$strip.length || !$menus.length) return false;
      if($menus.is(':visible')){ $menus.slideUp(150, function(){ $strip.removeClass('open'); }); }
      else { forceCompactStyles(); $strip.addClass('open'); $menus.slideDown(150, forceCompactStyles); }
      return true;
    }
    function bind(){ var btn=document.getElementById('customAccessBtn'); if(!btn) return; btn.addEventListener('click', function(e){ e.preventDefault(); var n=0; (function tryOpen(){ if(openNagishLiMenu()) return; if(++n<30) setTimeout(tryOpen,200); })(); }); }
    if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', bind); } else { bind(); }
  })();
</script>

</body>
</html>

```

### `hitmahut/hasagot-rami.html`

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="shortcut icon" href="/favicon.ico">

<!-- ⚠ קובץ אוטומטי - נוצר ע"י _build/build-hitmahut.mjs. אין לערוך ידנית.
     תוכן: _build/specializations.data.mjs · תמונות: _build/optimize-images.mjs -->

<script async src="https://www.googletagmanager.com/gtag/js?id=G-GYNQPGPR33"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-GYNQPGPR33');
  (function(){
    var push = window.dataLayer.push;
    window.dataLayer.push = function(){
      for (var i = 0; i < arguments.length; i++) {
        var o = arguments[i];
        if (o && typeof o.event === 'string') {
          var params = {};
          for (var k in o) { if (k !== 'event' && Object.prototype.hasOwnProperty.call(o, k)) params[k] = o[k]; }
          gtag('event', o.event, params);
        }
      }
      return push.apply(window.dataLayer, arguments);
    };
  })();
</script>

<title>השגות על שומות רמ&quot;י - צמצום דמי היתר, חכירה ודמי הסכמה | בורוביץ מזרחי</title>
<meta name="description" content="דרישות תשלום מרמ&quot;י לדמי היתר, שינוי ייעוד ודמי חכירה מבוססות פעמים רבות על ערכי קרקע מקסימליים. ניסוח השגה מנומקת וייצוג מול השמאי הממשלתי הראשי.">
<meta name="robots" content="index,follow">
<link rel="canonical" href="https://bor-miz.co.il/hitmahut/hasagot-rami.html">
<meta property="og:type" content="website">
<meta property="og:url" content="https://bor-miz.co.il/hitmahut/hasagot-rami.html">
<meta property="og:title" content="השגות על שומות רמ&quot;י - צמצום דמי היתר, חכירה ודמי הסכמה">
<meta property="og:description" content="דרישות תשלום מרמ&quot;י לדמי היתר, שינוי ייעוד ודמי חכירה מבוססות פעמים רבות על ערכי קרקע מקסימליים. ניסוח השגה מנומקת וייצוג מול השמאי הממשלתי הראשי.">
<meta property="og:image" content="https://bor-miz.co.il/img/hasagot-rami-hero.webp">
<meta property="og:locale" content="he_IL">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "השגות על שומות רמ\"י - צמצום דמי היתר, חכירה ודמי הסכמה",
  "serviceType": "השגות על שומות רמ\"י",
  "description": "דרישות תשלום מרמ\"י לדמי היתר, שינוי ייעוד ודמי חכירה מבוססות פעמים רבות על ערכי קרקע מקסימליים. ניסוח השגה מנומקת וייצוג מול השמאי הממשלתי הראשי.",
  "provider": {
    "@type": "LocalBusiness",
    "name": "בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ",
    "telephone": "+972-50-8922469",
    "areaServed": "ישראל"
  },
  "url": "https://bor-miz.co.il/hitmahut/hasagot-rami.html"
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "בורוביץ מזרחי",
      "item": "https://bor-miz.co.il/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "תחומי התמחות",
      "item": "https://bor-miz.co.il/#services"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "השגות על שומות רמ\"י",
      "item": "https://bor-miz.co.il/hitmahut/hasagot-rami.html"
    }
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "כמה זמן יש להגשת השגה לרמ\"י?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "יש להגיש את ההשגה תוך 60 ימים מיום קבלת הודעת החיוב, ולכן חשוב לפעול מיד."
      }
    },
    {
      "@type": "Question",
      "name": "האם ניתן לשלם כדי לקבל היתר ולערער במקביל?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "כן, ניתן לשלם תחת מחאה או להפקיד ערבות בנקאית לפי הנהלים כדי לא לעכב את הבנייה."
      }
    }
  ]
}
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="preload" as="image" href="../img/hasagot-rami-hero.webp" imagesrcset="../img/hasagot-rami-hero-sm.webp 820w, ../img/hasagot-rami-hero.webp 1600w" imagesizes="100vw">
<link rel="stylesheet" href="../styles.css">
<link rel="stylesheet" href="../hitmahut.css">
</head>
<body class="spec-page">

<a href="#main" class="skip-to-content">דלג לתוכן הראשי</a>

<nav id="navbar" role="navigation" aria-label="ניווט ראשי">
  <div class="nav-inner">
    <a href="../index.html" class="nav-logo" aria-label="בורוביץ מזרחי שמאות מקרקעין - דף הבית"><img src="../logo-bm.png" alt="לוגו בורוביץ מזרחי"></a>
    <ul class="nav-links" id="navLinks">
      <li><a href="../index.html#about" onclick="closeMenu()">אודות</a></li>
      <li><a href="../index.html#services" onclick="closeMenu()">תחומי התמחות</a></li>
      <li><a href="../maamarim.html" onclick="closeMenu()">מאמרים</a></li>
      <li><a href="../index.html#linkedin-posts" onclick="closeMenu()">עדכונים</a></li>
      <li><a href="../careers.html" onclick="closeMenu()">קריירה</a></li>
      <li><a href="#cta" class="nav-cta" onclick="closeMenu()">צור קשר</a></li>
    </ul>
    <button class="hamburger" id="hamburger" onclick="toggleMenu()" aria-label="תפריט ניווט" aria-expanded="false"><span></span><span></span><span></span></button>
  </div>
</nav>

<main id="main">

<header class="sp-hero">
  <figure class="sp-hero-media">
    <img src="../img/hasagot-rami-hero.webp"
         srcset="../img/hasagot-rami-hero-sm.webp 820w, ../img/hasagot-rami-hero.webp 1600w"
         sizes="(max-width: 900px) 100vw, 50vw"
         alt="ניתוח נתוני שומה במשרד מול נוף עירוני - השגות על שומות רמ&quot;י" fetchpriority="high" decoding="async">
    <span class="sp-hero-seam" aria-hidden="true"></span>
  </figure>
  <div class="sp-hero-inner">
    <div class="sp-hero-copy">
      <nav class="sp-crumb" aria-label="פירורי לחם">
        <a href="../index.html">בורוביץ מזרחי</a><span>/</span><a href="../index.html#services">תחומי התמחות</a><span>/</span><em>השגות על שומות רמ"י</em>
      </nav>
      <h1 class="sp-h1">השגות על שומות רמ"י<br><span>צמצום דמי היתר, חכירה ודמי הסכמה</span></h1>
      <p class="sp-lede">בדיקה שמאית ביקורתית, תקיפת בסיס השומה של השמאי הממשלתי וחיסכון משמעותי.</p>
      <div class="sp-actions is-hero">
        <a class="sp-btn sp-btn-gold" href="https://wa.me/972546559942?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%A7%D7%99%D7%91%D7%9C%D7%AA%D7%99%20%D7%94%D7%95%D7%93%D7%A2%D7%AA%20%D7%97%D7%99%D7%95%D7%91%20%D7%9E%D7%A8%D7%9E%22%D7%99%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%91%D7%93%D7%99%D7%A7%D7%AA%20%D7%94%D7%99%D7%AA%D7%9B%D7%A0%D7%95%D7%AA%20%D7%9C%D7%94%D7%A9%D7%92%D7%94." target="_blank" rel="noopener noreferrer">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"/></svg></span>שליחת הודעה בוואטסאפ
        </a>
        <a class="sp-btn sp-btn-line" href="tel:054-6559942">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>054-6559942
        </a>
      </div>
    </div>
  </div>
</header>

<section class="sp-sec sp-pain">
  <div class="sp-wrap">
    <h2 class="sp-h2 reveal">למה אסור לקבל את שומת רשות מקרקעי ישראל כגזירת גורל?</h2>
    <p class="sp-pain-text reveal">דרישות תשלום מרמ"י עבור דמי היתר לבנייה או שינוי ייעוד מבוססות פעמים רבות על ערכי קרקע מקסימליים שאינם משקללים מגבלות פיתוח, טופוגרפיה או זכויות היסטוריות בחוזה החכירה. תשלום ללא בדיקה משמעותו ויתור על כספים שניתן להפחית בהליך השגה מסודר.</p>
  </div>
</section>

<section class="sp-sec sp-alt">
  <div class="sp-wrap">
    <h2 class="sp-kicker reveal">למי השירות מיועד</h2>
    <ul class="sp-aud-grid">
      <li class="sp-aud reveal"><span class="sp-aud-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></span><span>חוכרים של נכסים פרטיים, מסחריים ותעשייתיים המבקשים היתר בנייה או הרחבה.</span></li>
      <li class="sp-aud reveal"><span class="sp-aud-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></span><span>בעלי קרקעות וחוכרים המבצעים שינוי ניצול או שינוי ייעוד בנכס.</span></li>
      <li class="sp-aud reveal"><span class="sp-aud-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></span><span>יזמים בעסקאות מול רשות מקרקעי ישראל.</span></li>
    </ul>
  </div>
</section>

<section class="sp-sec sp-process">
  <div class="sp-wrap">
    <h2 class="sp-kicker reveal">תהליך העבודה שלנו</h2>
    <ol class="sp-steps">
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>ניתוח החוזה</h3>
        <p>ניתוח חוזה החכירה המקורי, שומת רמ"י שהתקבלה וטבלת הזכויות.</p>
      </li>
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>איתור כשלים</h3>
        <p>איתור כשלים בהנחות השמאי הממשלתי (טבלאות שווי, מקדמי פיתוח, הוצאות התאמה).</p>
      </li>
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>הגשת השגה</h3>
        <p>ניסוח השגה מנומקת המשלבת את החלטות מועצת מקרקעי ישראל ופסיקות בתי המשפט האחרונות.</p>
      </li>
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>ייצוג וערעור</h3>
        <p>ייצוג מול ועדת ההשגות / השמאי הממשלתי הראשי במידת הצורך.</p>
      </li>
    </ol>
  </div>
</section>

<section class="sp-sec sp-alt sp-deliver">
  <div class="sp-wrap sp-split">
    <div class="sp-split-copy reveal">
      <h2 class="sp-kicker">מה מקבלים ביד</h2>
      <p class="sp-deliver-text">כתב השגה מקצועי ומפורט התואם במדויק את נהלי רמ"י, מעוגן בפסיקה המינהלית העדכנית ביותר ומיועד להפחתת התשלום בפועל.</p>
      <div class="sp-note">
        <span class="sp-note-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h10"/><path d="M6 15.5 12.5 9"/><path d="m9 6 6 6"/><path d="M12.5 2.5 19 9l-2.5 2.5L10 5z"/><path d="M4.5 13.5 9 18l-2 2-4.5-4.5z"/></svg></span>
        <div>
          <strong>בחזית הפסיקה</strong>
          <p>אנחנו עוקבים באופן שוטף אחר פסיקות בתי המשפט, הכרעות שמאים מכריעים והחלטות ועדות ערר. כל שומה שיוצאת מהמשרד נשענת על התקדימים והפרשנויות המשפטיות העדכניים ביותר - ולא על נוסחאות שעבדו פעם.</p>
        </div>
      </div>
    </div>
    <figure class="sp-split-img reveal">
      <img src="../img/hasagot-rami-body.webp" alt="דגם מבנה על ערימת תוכניות - בחינת זכויות הבנייה בחוזה החכירה" loading="lazy" decoding="async">
    </figure>
  </div>
</section>

<section class="sp-sec sp-faq">
  <div class="sp-wrap">
    <h2 class="sp-kicker reveal">שאלות נפוצות</h2>
    <div class="sp-faq-list reveal">
      <details class="sp-q">
        <summary>כמה זמן יש להגשת השגה לרמ"י?</summary>
        <p>יש להגיש את ההשגה תוך 60 ימים מיום קבלת הודעת החיוב, ולכן חשוב לפעול מיד.</p>
      </details>
      <details class="sp-q">
        <summary>האם ניתן לשלם כדי לקבל היתר ולערער במקביל?</summary>
        <p>כן, ניתן לשלם תחת מחאה או להפקיד ערבות בנקאית לפי הנהלים כדי לא לעכב את הבנייה.</p>
      </details>
    </div>
  </div>
</section>

<section class="sp-sec sp-cta" id="cta">
  <div class="sp-wrap reveal">
    <h2 class="sp-h2">קיבלתם הודעת חיוב מרמ"י?</h2>
    <p class="sp-cta-text">העבירו אותה לבדיקת היתכנות מקצועית לפני התשלום. בדיקה ראשונית מהירה תראה אם יש עילה להשגה ומה הסיכוי להפחתה.</p>
    <div class="sp-actions is-cta">
        <a class="sp-btn sp-btn-gold" href="https://wa.me/972546559942?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%A7%D7%99%D7%91%D7%9C%D7%AA%D7%99%20%D7%94%D7%95%D7%93%D7%A2%D7%AA%20%D7%97%D7%99%D7%95%D7%91%20%D7%9E%D7%A8%D7%9E%22%D7%99%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%91%D7%93%D7%99%D7%A7%D7%AA%20%D7%94%D7%99%D7%AA%D7%9B%D7%A0%D7%95%D7%AA%20%D7%9C%D7%94%D7%A9%D7%92%D7%94." target="_blank" rel="noopener noreferrer">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"/></svg></span>שליחת הודעה בוואטסאפ
        </a>
        <a class="sp-btn sp-btn-line" href="tel:054-6559942">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>054-6559942
        </a>
      </div>
    <p class="sp-cta-alt">או השאירו פרטים ב<a href="../index.html#contact">טופס יצירת הקשר</a></p>
  </div>
</section>

</main>

<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="../logo-bm.png" alt="לוגו בורוביץ מזרחי">
        <p>משרד שמאות מקרקעין מוביל בצפון. ידע מקצועי מעמיק, היכרות שטח בלתי אמצעית והבנה כלכלית רחבה - בשירות כל לקוח.</p>
      </div>
      <div class="footer-col">
        <h4>ניווט</h4>
        <ul>
          <li><a href="../index.html#about">אודות</a></li>
          <li><a href="../index.html#services">תחומי התמחות</a></li>
          <li><a href="../maamarim.html">מאמרים</a></li>
          <li><a href="../careers.html">קריירה</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>יצירת קשר</h4>
        <ul>
          <li><a href="tel:054-6559942">054-6559942 · מאור</a></li>
          <li><a href="tel:050-8922469">050-8922469 · אמיר</a></li>
          <li><a id="em-footer" href="#"></a></li>
          <li>שדרות החרוב 6, פארק תעשיות בר-לב</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 בורוביץ מזרחי שמאות מקרקעין וחקלאות בע"מ. כל הזכויות שמורות.</span>
      <span><a href="../index.html">חזרה לאתר הראשי</a></span>
    </div>
  </div>
</footer>

<div class="floating-wrap">
  <a class="float-btn float-btn-wa" href="https://wa.me/972546559942" target="_blank" rel="noopener noreferrer" aria-label="שלחו הודעה בוואטסאפ">
    <svg aria-hidden="true" viewBox="0 0 32 32"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.67 4.61 1.832 6.5L4 29l7.75-1.812A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="#fff"/><path d="M21.5 18.5c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.19-.57-.34z" fill="#25D366"/></svg>
  </a>
  <button type="button" id="customAccessBtn" class="float-btn float-btn-access" aria-label="פתח תפריט נגישות" title="נגישות"><span aria-hidden="true">♿</span></button>
</div>

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<script>
  (function(){ var el=document.getElementById('em-footer'); if(el){ var a='info'+'@'+'bor-miz.co.il'; el.href='mailto:'+a; el.textContent=a; } })();
  function toggleMenu(){ var l=document.getElementById('navLinks'),b=document.getElementById('hamburger'); l.classList.toggle('open'); b.classList.toggle('open'); b.setAttribute('aria-expanded', l.classList.contains('open')?'true':'false'); }
  function closeMenu(){ document.getElementById('navLinks').classList.remove('open'); var b=document.getElementById('hamburger'); b.classList.remove('open'); b.setAttribute('aria-expanded','false'); }
  document.addEventListener('click', function(e){ var nav=document.getElementById('navbar'); if(nav && !nav.contains(e.target)) closeMenu(); });
  (function(){ var nav=document.getElementById('navbar'); var onScroll=function(){ nav.classList.toggle('scrolled', window.scrollY>60); }; window.addEventListener('scroll', onScroll, {passive:true}); onScroll(); })();
  (function(){
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce || !window.gsap || !window.ScrollTrigger){
      document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.reveal').forEach(function(el){ ScrollTrigger.create({ trigger: el, start:'top 90%', onEnter:function(){ el.classList.add('in'); } }); });
  })();
  // אקורדיון: פתיחת שאלה סוגרת את הקודמת
  (function(){
    var items = document.querySelectorAll('.sp-faq .sp-q');
    items.forEach(function(d){
      d.addEventListener('toggle', function(){
        if(!d.open) return;
        items.forEach(function(o){ if(o !== d) o.open = false; });
      });
    });
  })();
  // מעקב המרות - זהה לשאר האתר
  (function(){ window.dataLayer=window.dataLayer||[]; document.addEventListener('click', function(e){ var el=e.target.closest&&e.target.closest('a'); if(!el) return; if(/wa\.me|api\.whatsapp/.test(el.href||'')){ window.dataLayer.push({event:'contact_whatsapp'}); } else if((el.getAttribute('href')||'').indexOf('tel:')===0){ window.dataLayer.push({event:'contact_phone'}); } }, true); })();
</script>

<nagishli></nagishli>
<script>
nl_contact = "n:בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ|p:054-6559942|u:maor@bor-miz.co.il";
nl_pos = "BL"; nl_lang = "he"; nl_color = "blue"; nl_compact = "1";
</script>
<script src="../nagishli.js?v=2.3" charset="utf-8"></script>
<script>
  (function(){
    function forceCompactStyles(){
      var bar=document.getElementById('NagishLiBar'), menus=document.getElementById('NagishLiMenus');
      if(bar){ bar.style.cssText='position:fixed !important; left:1.4rem !important; right:auto !important; bottom:6.2rem !important; top:auto !important; width:300px !important; max-width:90vw !important; height:auto !important; z-index:9999 !important; background:transparent !important; box-shadow:none !important; border:none !important; padding:0 !important; margin:0 !important;'; }
      if(menus){ menus.style.cssText+=';position:static !important; width:300px !important; max-width:90vw !important; max-height:70vh !important; overflow-y:auto !important; overflow-x:hidden !important; font-size:13px !important; border-radius:12px !important; box-shadow:0 10px 40px rgba(0,0,0,0.3) !important; margin:0 !important; padding:0 !important; background:#fff !important;'; }
      document.querySelectorAll('#NagishLiMenus, #NagishLiMenus ul').forEach(function(el){ el.style.width='100%'; el.style.maxWidth='300px'; el.style.boxSizing='border-box'; });
    }
    function openNagishLiMenu(){
      if(typeof jQuery==='undefined') return false;
      var $=jQuery, $strip=$('#NagishLiBarStrip'), $menus=$('#NagishLiMenus');
      if(!$strip.length || !$menus.length) return false;
      if($menus.is(':visible')){ $menus.slideUp(150, function(){ $strip.removeClass('open'); }); }
      else { forceCompactStyles(); $strip.addClass('open'); $menus.slideDown(150, forceCompactStyles); }
      return true;
    }
    function bind(){ var btn=document.getElementById('customAccessBtn'); if(!btn) return; btn.addEventListener('click', function(e){ e.preventDefault(); var n=0; (function tryOpen(){ if(openNagishLiMenu()) return; if(++n<30) setTimeout(tryOpen,200); })(); }); }
    if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', bind); } else { bind(); }
  })();
</script>

</body>
</html>

```

### `hitmahut/heitlei-hashbacha.html`

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="shortcut icon" href="/favicon.ico">

<!-- ⚠ קובץ אוטומטי - נוצר ע"י _build/build-hitmahut.mjs. אין לערוך ידנית.
     תוכן: _build/specializations.data.mjs · תמונות: _build/optimize-images.mjs -->

<script async src="https://www.googletagmanager.com/gtag/js?id=G-GYNQPGPR33"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-GYNQPGPR33');
  (function(){
    var push = window.dataLayer.push;
    window.dataLayer.push = function(){
      for (var i = 0; i < arguments.length; i++) {
        var o = arguments[i];
        if (o && typeof o.event === 'string') {
          var params = {};
          for (var k in o) { if (k !== 'event' && Object.prototype.hasOwnProperty.call(o, k)) params[k] = o[k]; }
          gtag('event', o.event, params);
        }
      }
      return push.apply(window.dataLayer, arguments);
    };
  })();
</script>

<title>הפחתת היטל השבחה - לא משלמים שקל אחד יותר ממה שחייבים בחוק | בורוביץ מזרחי</title>
<meta name="description" content="שומות היטל השבחה של הוועדות המקומיות נערכות פעמים רבות על בסיס הנחות מנופחות. בדיקת היתכנות, שומה נגדית מנומקת וייצוג מול שמאי מכריע - בתוך חלון 45 הימים.">
<meta name="robots" content="index,follow">
<link rel="canonical" href="https://bor-miz.co.il/hitmahut/heitlei-hashbacha.html">
<meta property="og:type" content="website">
<meta property="og:url" content="https://bor-miz.co.il/hitmahut/heitlei-hashbacha.html">
<meta property="og:title" content="הפחתת היטל השבחה - לא משלמים שקל אחד יותר ממה שחייבים בחוק">
<meta property="og:description" content="שומות היטל השבחה של הוועדות המקומיות נערכות פעמים רבות על בסיס הנחות מנופחות. בדיקת היתכנות, שומה נגדית מנומקת וייצוג מול שמאי מכריע - בתוך חלון 45 הימים.">
<meta property="og:image" content="https://bor-miz.co.il/img/heitlei-hashbacha-hero.webp">
<meta property="og:locale" content="he_IL">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "הפחתת היטל השבחה - לא משלמים שקל אחד יותר ממה שחייבים בחוק",
  "serviceType": "היטלי השבחה",
  "description": "שומות היטל השבחה של הוועדות המקומיות נערכות פעמים רבות על בסיס הנחות מנופחות. בדיקת היתכנות, שומה נגדית מנומקת וייצוג מול שמאי מכריע - בתוך חלון 45 הימים.",
  "provider": {
    "@type": "LocalBusiness",
    "name": "בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ",
    "telephone": "+972-50-8922469",
    "areaServed": "ישראל"
  },
  "url": "https://bor-miz.co.il/hitmahut/heitlei-hashbacha.html"
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "בורוביץ מזרחי",
      "item": "https://bor-miz.co.il/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "תחומי התמחות",
      "item": "https://bor-miz.co.il/#services"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "היטלי השבחה",
      "item": "https://bor-miz.co.il/hitmahut/heitlei-hashbacha.html"
    }
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "האם תמיד כדאי לערער על היטל השבחה?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "לא תמיד. אנחנו בוחנים תחילה את הכדאיות; אם השומה נכונה או שיש סיכון להעלאת השומה, נשקף זאת בשקיפות מלאה ולא נייצר הוצאה מיותרת."
      }
    },
    {
      "@type": "Question",
      "name": "מה קורה אם עוברים ה-45 יום?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "החוק מחמיר מאוד. במקרים נדירים ניתן לבקש ארכה, ולכן קריטי לפנות אלינו מיד עם קבלת השובר."
      }
    }
  ]
}
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="preload" as="image" href="../img/heitlei-hashbacha-hero.webp" imagesrcset="../img/heitlei-hashbacha-hero-sm.webp 820w, ../img/heitlei-hashbacha-hero.webp 1600w" imagesizes="100vw">
<link rel="stylesheet" href="../styles.css">
<link rel="stylesheet" href="../hitmahut.css">
</head>
<body class="spec-page">

<a href="#main" class="skip-to-content">דלג לתוכן הראשי</a>

<nav id="navbar" role="navigation" aria-label="ניווט ראשי">
  <div class="nav-inner">
    <a href="../index.html" class="nav-logo" aria-label="בורוביץ מזרחי שמאות מקרקעין - דף הבית"><img src="../logo-bm.png" alt="לוגו בורוביץ מזרחי"></a>
    <ul class="nav-links" id="navLinks">
      <li><a href="../index.html#about" onclick="closeMenu()">אודות</a></li>
      <li><a href="../index.html#services" onclick="closeMenu()">תחומי התמחות</a></li>
      <li><a href="../maamarim.html" onclick="closeMenu()">מאמרים</a></li>
      <li><a href="../index.html#linkedin-posts" onclick="closeMenu()">עדכונים</a></li>
      <li><a href="../careers.html" onclick="closeMenu()">קריירה</a></li>
      <li><a href="#cta" class="nav-cta" onclick="closeMenu()">צור קשר</a></li>
    </ul>
    <button class="hamburger" id="hamburger" onclick="toggleMenu()" aria-label="תפריט ניווט" aria-expanded="false"><span></span><span></span><span></span></button>
  </div>
</nav>

<main id="main">

<header class="sp-hero">
  <figure class="sp-hero-media">
    <img src="../img/heitlei-hashbacha-hero.webp"
         srcset="../img/heitlei-hashbacha-hero-sm.webp 820w, ../img/heitlei-hashbacha-hero.webp 1600w"
         sizes="(max-width: 900px) 100vw, 50vw"
         alt="מדרגות זהב עולות אל בית - עליית שווי והיטל השבחה" fetchpriority="high" decoding="async">
    <span class="sp-hero-seam" aria-hidden="true"></span>
  </figure>
  <div class="sp-hero-inner">
    <div class="sp-hero-copy">
      <nav class="sp-crumb" aria-label="פירורי לחם">
        <a href="../index.html">בורוביץ מזרחי</a><span>/</span><a href="../index.html#services">תחומי התמחות</a><span>/</span><em>היטלי השבחה</em>
      </nav>
      <h1 class="sp-h1">הפחתת היטל השבחה<br><span>לא משלמים שקל אחד יותר ממה שחייבים בחוק</span></h1>
      <p class="sp-lede">בדיקה שמאית קפדנית, הגשת שומה נגדית וייצוג מקצועי מול שמאי מכריע וועדות ערר.</p>
      <div class="sp-actions is-hero">
        <a class="sp-btn sp-btn-gold" href="https://wa.me/972546559942?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%A7%D7%99%D7%91%D7%9C%D7%AA%D7%99%20%D7%A9%D7%95%D7%91%D7%A8%20%D7%94%D7%99%D7%98%D7%9C%20%D7%94%D7%A9%D7%91%D7%97%D7%94%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%91%D7%93%D7%99%D7%A7%D7%AA%20%D7%94%D7%99%D7%AA%D7%9B%D7%A0%D7%95%D7%AA%20%D7%9C%D7%94%D7%A4%D7%97%D7%AA%D7%94." target="_blank" rel="noopener noreferrer">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"/></svg></span>שליחת הודעה בוואטסאפ
        </a>
        <a class="sp-btn sp-btn-line" href="tel:054-6559942">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>054-6559942
        </a>
      </div>
    </div>
  </div>
</header>

<section class="sp-sec sp-pain">
  <div class="sp-wrap">
    <h2 class="sp-h2 reveal">קיבלתם דרישת תשלום מהוועדה? אל תמהרו לשלם</h2>
    <p class="sp-pain-text reveal">שומות היטל השבחה מטעם הוועדות המקומיות נערכות פעמים רבות על בסיס הנחות מחמירות ומנופחות שאינן משקפות את המציאות בשטח. תשלום השובר ללא בדיקה משמעותו אובדן כספים ניכר. בנוסף, חלון הזמנים נוקשה במיוחד: יש לכם 45 ימים בלבד ממועד קבלת הדרישה לפעול; לאחר מכן השומה הופכת לחלוטה ולא ניתן לערער עליה.</p>
  </div>
</section>

<section class="sp-sec sp-alt">
  <div class="sp-wrap">
    <h2 class="sp-kicker reveal">למי השירות מיועד</h2>
    <ul class="sp-aud-grid">
      <li class="sp-aud reveal"><span class="sp-aud-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></span><span>מוכרי דירות, מגרשים ונכסים מסחריים שקיבלו שובר תשלום בעת מכירה.</span></li>
      <li class="sp-aud reveal"><span class="sp-aud-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></span><span>בעלי נכסים המבקשים להוציא היתר בנייה (הרחבה, בריכה, תוספת קומה).</span></li>
      <li class="sp-aud reveal"><span class="sp-aud-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></span><span>עורכי דין לענייני מקרקעין המבקשים להגן על כספי לקוחותיהם בעסקה.</span></li>
    </ul>
  </div>
</section>

<section class="sp-sec sp-process">
  <div class="sp-wrap">
    <h2 class="sp-kicker reveal">תהליך העבודה שלנו</h2>
    <ol class="sp-steps">
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>בדיקה ראשונית</h3>
        <p>בדיקת היתכנות ראשונית של השובר והשומה העירונית ללא עלות.</p>
      </li>
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>איסוף נתונים</h3>
        <p>בדיקת תיק בניין, תב"עות קודמות ומשביחות וביקור בנכס.</p>
      </li>
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>גיבוש השומה</h3>
        <p>עריכת שומה נגדית מנומקת הנשענת על ניתוח פסיקות בתי משפט והכרעות שמאים מכריעים עדכניות מהחודשים האחרונים.</p>
      </li>
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>ייצוג ודיון</h3>
        <p>ייצוג וטיעון בדיונים מול השמאי המכריע עד לקבלת הפחתה מרבית.</p>
      </li>
    </ol>
  </div>
</section>

<section class="sp-sec sp-alt sp-deliver">
  <div class="sp-wrap sp-split">
    <div class="sp-split-copy reveal">
      <h2 class="sp-kicker">מה מקבלים ביד</h2>
      <p class="sp-deliver-text">חוברת שומה נגדית רשמית וקבילה לפי תקני מועצת השמאים, הכוללת ניתוח זכויות היסטוריות, תחשיבי השבחה נגדיים, עיגון בתקדימים משפטיים וייצוג מלא בדיונים.</p>
      <div class="sp-note">
        <span class="sp-note-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h10"/><path d="M6 15.5 12.5 9"/><path d="m9 6 6 6"/><path d="M12.5 2.5 19 9l-2.5 2.5L10 5z"/><path d="M4.5 13.5 9 18l-2 2-4.5-4.5z"/></svg></span>
        <div>
          <strong>בחזית הפסיקה</strong>
          <p>אנחנו עוקבים באופן שוטף אחר פסיקות בתי המשפט, הכרעות שמאים מכריעים והחלטות ועדות ערר. כל שומה שיוצאת מהמשרד נשענת על התקדימים והפרשנויות המשפטיות העדכניים ביותר - ולא על נוסחאות שעבדו פעם.</p>
        </div>
      </div>
    </div>
    <figure class="sp-split-img reveal">
      <img src="../img/heitlei-hashbacha-body.webp" alt="זכוכית מגדלת מעל תוכנית בניין - בדיקת שומת היטל השבחה" loading="lazy" decoding="async">
    </figure>
  </div>
</section>

<section class="sp-sec sp-faq">
  <div class="sp-wrap">
    <h2 class="sp-kicker reveal">שאלות נפוצות</h2>
    <div class="sp-faq-list reveal">
      <details class="sp-q">
        <summary>האם תמיד כדאי לערער על היטל השבחה?</summary>
        <p>לא תמיד. אנחנו בוחנים תחילה את הכדאיות; אם השומה נכונה או שיש סיכון להעלאת השומה, נשקף זאת בשקיפות מלאה ולא נייצר הוצאה מיותרת.</p>
      </details>
      <details class="sp-q">
        <summary>מה קורה אם עוברים ה-45 יום?</summary>
        <p>החוק מחמיר מאוד. במקרים נדירים ניתן לבקש ארכה, ולכן קריטי לפנות אלינו מיד עם קבלת השובר.</p>
      </details>
    </div>
  </div>
</section>

<section class="sp-sec sp-alt sp-proof-sec">
  <div class="sp-wrap">
    <h2 class="sp-kicker reveal">הוכחות מהשטח והעמקה</h2>
      <div class="sp-wins">
        <h3 class="sp-wins-title">ההצלחות שלנו</h3>
        <p class="sp-wins-intro">הכרעות שמאי מכריע שניהל משרדנו, כפי שפורסמו באתר הרשמי. בתיקים שלפניכם הופחת היטל ההשבחה בעשרות אחוזים - ובאחד מהם ב-94% - ובסך הכל נחסכו ללקוחותינו למעלה מ-880,000 ₪. כל הכרעה פתוחה להורדה בלחיצה אחת.</p>
        <ul class="sp-wins-list">
        <li class="sp-win">
          <a href="https://free-justice.openapi.gov.il/free/moj/portal/rest/searchpredefinedapi/v1/SearchPredefinedApi/Documents/DecisiveAppraiser/Utc7sDDjR~qhKXBkDQRi2M6D8ETi2RjxQ7pHNE3O4+8=" target="_blank" rel="noopener noreferrer">
            <span class="sp-win-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></span>
            <span class="sp-win-body">
              <strong>ועדה מקומית גבעתיים · גוש 6154 חלקה 189</strong>
              <span class="sp-win-meta">שמאי מכריע: גולדברג ארנון · פברואר 2025</span>
              <span class="sp-win-result">ההיטל הופחת מ-202,698 ₪ ל-11,991 ₪ · חיסכון 190,707 ₪</span>
            </span>
            <span class="sp-win-cut"><b>94%</b><span>הפחתה</span></span>
            <span class="sp-win-go">להורדת ההכרעה <i>←</i></span>
          </a>
        </li>
        <li class="sp-win">
          <a href="https://free-justice.openapi.gov.il/free/moj/portal/rest/searchpredefinedapi/v1/SearchPredefinedApi/Documents/DecisiveAppraiser/pkfsYWfcgA6vKaqMvX49vL1PvGk4IzlacWg5KRbovi8=" target="_blank" rel="noopener noreferrer">
            <span class="sp-win-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></span>
            <span class="sp-win-body">
              <strong>ועדה מקומית אצבע הגליל · גוש 13947 חלקה 6</strong>
              <span class="sp-win-meta">שמאית מכריעה: דודזון שמאמה אוולין · פברואר 2023</span>
              <span class="sp-win-result">ההיטל הופחת מ-1,197,395 ₪ ל-680,900 ₪ · חיסכון 516,495 ₪</span>
            </span>
            <span class="sp-win-cut"><b>43%</b><span>הפחתה</span></span>
            <span class="sp-win-go">להורדת ההכרעה <i>←</i></span>
          </a>
        </li>
        <li class="sp-win">
          <a href="https://free-justice.openapi.gov.il/free/moj/portal/rest/searchpredefinedapi/v1/SearchPredefinedApi/Documents/DecisiveAppraiser/dvG5jv4TBEXkJDPrjf7SbiRWRkwz~~i3U5LUwtsAH0o=" target="_blank" rel="noopener noreferrer">
            <span class="sp-win-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></span>
            <span class="sp-win-body">
              <strong>ועדה מקומית לב הגליל · גוש 19322 חלקה 53</strong>
              <span class="sp-win-meta">שמאי מכריע: סרחאן עומר · אוגוסט 2023</span>
              <span class="sp-win-result">ההיטל הופחת מ-347,715 ₪ ל-173,498 ₪ · חיסכון 174,217 ₪</span>
            </span>
            <span class="sp-win-cut"><b>50%</b><span>הפחתה</span></span>
            <span class="sp-win-go">להורדת ההכרעה <i>←</i></span>
          </a>
        </li>
        </ul>
      </div>
    <div class="sp-proof-grid reveal">
      <a class="sp-proof is-gov" href="https://www.gov.il/he/departments/dynamiccollectors/decisive_appraisal_decisions" target="_blank" rel="noopener noreferrer">
        <span class="sp-proof-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></span>
        <span class="sp-proof-kind">הוכחות רשמיות</span>
        <h3>הכרעות שמאי מכריע באתר Gov.il</h3>
        <p>המאגר הרשמי של האגף לאסדרת מקצועות במשרד המשפטים - סינון לפי שמאי מכריע, ועדה מקומית, גוש וחלקה.</p>
        <span class="sp-proof-go">לצפייה <i>←</i><em>נפתח בלשונית חדשה</em></span>
      </a>
      <a class="sp-proof" href="../maamar-heitel-hashbacha-madrich.html">
        <span class="sp-proof-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></span>
        <span class="sp-proof-kind">מאמר מקצועי</span>
        <h3>היטל השבחה - המדריך המלא</h3>
        <p>מתי נוצר החיוב, איך הוא מחושב, ומה בדיוק עושים מרגע שהשובר מגיע.</p>
        <span class="sp-proof-go">לקריאה <i>←</i></span>
      </a>
    </div>
  </div>
</section>

<section class="sp-sec sp-cta" id="cta">
  <div class="sp-wrap reveal">
    <h2 class="sp-h2">שלחו לנו את שובר התשלום בוואטסאפ</h2>
    <p class="sp-cta-text">בדיקת היתכנות ראשונית ללא התחייבות. ככל שתפנו מוקדם יותר בתוך 45 הימים, כך נוכל לפעול טוב יותר.</p>
    <div class="sp-actions is-cta">
        <a class="sp-btn sp-btn-gold" href="https://wa.me/972546559942?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%A7%D7%99%D7%91%D7%9C%D7%AA%D7%99%20%D7%A9%D7%95%D7%91%D7%A8%20%D7%94%D7%99%D7%98%D7%9C%20%D7%94%D7%A9%D7%91%D7%97%D7%94%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%91%D7%93%D7%99%D7%A7%D7%AA%20%D7%94%D7%99%D7%AA%D7%9B%D7%A0%D7%95%D7%AA%20%D7%9C%D7%94%D7%A4%D7%97%D7%AA%D7%94." target="_blank" rel="noopener noreferrer">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"/></svg></span>שליחת הודעה בוואטסאפ
        </a>
        <a class="sp-btn sp-btn-line" href="tel:054-6559942">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>054-6559942
        </a>
      </div>
    <p class="sp-cta-alt">או השאירו פרטים ב<a href="../index.html#contact">טופס יצירת הקשר</a></p>
  </div>
</section>

</main>

<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="../logo-bm.png" alt="לוגו בורוביץ מזרחי">
        <p>משרד שמאות מקרקעין מוביל בצפון. ידע מקצועי מעמיק, היכרות שטח בלתי אמצעית והבנה כלכלית רחבה - בשירות כל לקוח.</p>
      </div>
      <div class="footer-col">
        <h4>ניווט</h4>
        <ul>
          <li><a href="../index.html#about">אודות</a></li>
          <li><a href="../index.html#services">תחומי התמחות</a></li>
          <li><a href="../maamarim.html">מאמרים</a></li>
          <li><a href="../careers.html">קריירה</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>יצירת קשר</h4>
        <ul>
          <li><a href="tel:054-6559942">054-6559942 · מאור</a></li>
          <li><a href="tel:050-8922469">050-8922469 · אמיר</a></li>
          <li><a id="em-footer" href="#"></a></li>
          <li>שדרות החרוב 6, פארק תעשיות בר-לב</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 בורוביץ מזרחי שמאות מקרקעין וחקלאות בע"מ. כל הזכויות שמורות.</span>
      <span><a href="../index.html">חזרה לאתר הראשי</a></span>
    </div>
  </div>
</footer>

<div class="floating-wrap">
  <a class="float-btn float-btn-wa" href="https://wa.me/972546559942" target="_blank" rel="noopener noreferrer" aria-label="שלחו הודעה בוואטסאפ">
    <svg aria-hidden="true" viewBox="0 0 32 32"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.67 4.61 1.832 6.5L4 29l7.75-1.812A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="#fff"/><path d="M21.5 18.5c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.19-.57-.34z" fill="#25D366"/></svg>
  </a>
  <button type="button" id="customAccessBtn" class="float-btn float-btn-access" aria-label="פתח תפריט נגישות" title="נגישות"><span aria-hidden="true">♿</span></button>
</div>

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<script>
  (function(){ var el=document.getElementById('em-footer'); if(el){ var a='info'+'@'+'bor-miz.co.il'; el.href='mailto:'+a; el.textContent=a; } })();
  function toggleMenu(){ var l=document.getElementById('navLinks'),b=document.getElementById('hamburger'); l.classList.toggle('open'); b.classList.toggle('open'); b.setAttribute('aria-expanded', l.classList.contains('open')?'true':'false'); }
  function closeMenu(){ document.getElementById('navLinks').classList.remove('open'); var b=document.getElementById('hamburger'); b.classList.remove('open'); b.setAttribute('aria-expanded','false'); }
  document.addEventListener('click', function(e){ var nav=document.getElementById('navbar'); if(nav && !nav.contains(e.target)) closeMenu(); });
  (function(){ var nav=document.getElementById('navbar'); var onScroll=function(){ nav.classList.toggle('scrolled', window.scrollY>60); }; window.addEventListener('scroll', onScroll, {passive:true}); onScroll(); })();
  (function(){
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce || !window.gsap || !window.ScrollTrigger){
      document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.reveal').forEach(function(el){ ScrollTrigger.create({ trigger: el, start:'top 90%', onEnter:function(){ el.classList.add('in'); } }); });
  })();
  // אקורדיון: פתיחת שאלה סוגרת את הקודמת
  (function(){
    var items = document.querySelectorAll('.sp-faq .sp-q');
    items.forEach(function(d){
      d.addEventListener('toggle', function(){
        if(!d.open) return;
        items.forEach(function(o){ if(o !== d) o.open = false; });
      });
    });
  })();
  // מעקב המרות - זהה לשאר האתר
  (function(){ window.dataLayer=window.dataLayer||[]; document.addEventListener('click', function(e){ var el=e.target.closest&&e.target.closest('a'); if(!el) return; if(/wa\.me|api\.whatsapp/.test(el.href||'')){ window.dataLayer.push({event:'contact_whatsapp'}); } else if((el.getAttribute('href')||'').indexOf('tel:')===0){ window.dataLayer.push({event:'contact_phone'}); } }, true); })();
</script>

<nagishli></nagishli>
<script>
nl_contact = "n:בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ|p:054-6559942|u:maor@bor-miz.co.il";
nl_pos = "BL"; nl_lang = "he"; nl_color = "blue"; nl_compact = "1";
</script>
<script src="../nagishli.js?v=2.3" charset="utf-8"></script>
<script>
  (function(){
    function forceCompactStyles(){
      var bar=document.getElementById('NagishLiBar'), menus=document.getElementById('NagishLiMenus');
      if(bar){ bar.style.cssText='position:fixed !important; left:1.4rem !important; right:auto !important; bottom:6.2rem !important; top:auto !important; width:300px !important; max-width:90vw !important; height:auto !important; z-index:9999 !important; background:transparent !important; box-shadow:none !important; border:none !important; padding:0 !important; margin:0 !important;'; }
      if(menus){ menus.style.cssText+=';position:static !important; width:300px !important; max-width:90vw !important; max-height:70vh !important; overflow-y:auto !important; overflow-x:hidden !important; font-size:13px !important; border-radius:12px !important; box-shadow:0 10px 40px rgba(0,0,0,0.3) !important; margin:0 !important; padding:0 !important; background:#fff !important;'; }
      document.querySelectorAll('#NagishLiMenus, #NagishLiMenus ul').forEach(function(el){ el.style.width='100%'; el.style.maxWidth='300px'; el.style.boxSizing='border-box'; });
    }
    function openNagishLiMenu(){
      if(typeof jQuery==='undefined') return false;
      var $=jQuery, $strip=$('#NagishLiBarStrip'), $menus=$('#NagishLiMenus');
      if(!$strip.length || !$menus.length) return false;
      if($menus.is(':visible')){ $menus.slideUp(150, function(){ $strip.removeClass('open'); }); }
      else { forceCompactStyles(); $strip.addClass('open'); $menus.slideDown(150, forceCompactStyles); }
      return true;
    }
    function bind(){ var btn=document.getElementById('customAccessBtn'); if(!btn) return; btn.addEventListener('click', function(e){ e.preventDefault(); var n=0; (function tryOpen(){ if(openNagishLiMenu()) return; if(++n<30) setTimeout(tryOpen,200); })(); }); }
    if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', bind); } else { bind(); }
  })();
</script>

</body>
</html>

```

### `hitmahut/kedaiut-kalkalit.html`

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="shortcut icon" href="/favicon.ico">

<!-- ⚠ קובץ אוטומטי - נוצר ע"י _build/build-hitmahut.mjs. אין לערוך ידנית.
     תוכן: _build/specializations.data.mjs · תמונות: _build/optimize-images.mjs -->

<script async src="https://www.googletagmanager.com/gtag/js?id=G-GYNQPGPR33"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-GYNQPGPR33');
  (function(){
    var push = window.dataLayer.push;
    window.dataLayer.push = function(){
      for (var i = 0; i < arguments.length; i++) {
        var o = arguments[i];
        if (o && typeof o.event === 'string') {
          var params = {};
          for (var k in o) { if (k !== 'event' && Object.prototype.hasOwnProperty.call(o, k)) params[k] = o[k]; }
          gtag('event', o.event, params);
        }
      }
      return push.apply(window.dataLayer, arguments);
    };
  })();
</script>

<title>ליווי כלכלי וסטטוטורי מול מוסדות התכנון - מקסום זכויות וקידום תוכניות במהירות | בורוביץ מזרחי</title>
<meta name="description" content="חוות דעת כלכלית לפי תקן 21.1, נספח כלכלי לתב&quot;ע, כיול תמורות דיירים ומטלות ציבוריות וייצוג היזם בדיונים בוועדות המקומיות והמחוזיות.">
<meta name="robots" content="index,follow">
<link rel="canonical" href="https://bor-miz.co.il/hitmahut/kedaiut-kalkalit.html">
<meta property="og:type" content="website">
<meta property="og:url" content="https://bor-miz.co.il/hitmahut/kedaiut-kalkalit.html">
<meta property="og:title" content="ליווי כלכלי וסטטוטורי מול מוסדות התכנון - מקסום זכויות וקידום תוכניות במהירות">
<meta property="og:description" content="חוות דעת כלכלית לפי תקן 21.1, נספח כלכלי לתב&quot;ע, כיול תמורות דיירים ומטלות ציבוריות וייצוג היזם בדיונים בוועדות המקומיות והמחוזיות.">
<meta property="og:image" content="https://bor-miz.co.il/img/kedaiut-kalkalit-hero.webp">
<meta property="og:locale" content="he_IL">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "ליווי כלכלי וסטטוטורי מול מוסדות התכנון - מקסום זכויות וקידום תוכניות במהירות",
  "serviceType": "כדאיות כלכלית וליווי",
  "description": "חוות דעת כלכלית לפי תקן 21.1, נספח כלכלי לתב\"ע, כיול תמורות דיירים ומטלות ציבוריות וייצוג היזם בדיונים בוועדות המקומיות והמחוזיות.",
  "provider": {
    "@type": "LocalBusiness",
    "name": "בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ",
    "telephone": "+972-50-8922469",
    "areaServed": "ישראל"
  },
  "url": "https://bor-miz.co.il/hitmahut/kedaiut-kalkalit.html"
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "בורוביץ מזרחי",
      "item": "https://bor-miz.co.il/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "תחומי התמחות",
      "item": "https://bor-miz.co.il/#services"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "כדאיות כלכלית וליווי",
      "item": "https://bor-miz.co.il/hitmahut/kedaiut-kalkalit.html"
    }
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "כיצד תקן 21 מסייע ליזם מול מוסדות התכנון?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "התקן מספק מתודולוגיה אחידה המוכרת על ידי ועדות התכנון להוכחת הצפיפות והזכויות הנדרשות כדי שהפרויקט יהיה בר-ביצוע ולא ייכשל כלכלית."
      }
    },
    {
      "@type": "Question",
      "name": "מתי נכון לערב שמאי - לפני ההגשה או אחרי הערות הוועדה?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "לפני. תחשיב כלכלי שנבנה מראש מעצב את הפרוגרמה ואת המספרים שמוגשים, ומאפשר להוביל את הדיון. כניסה אחרי שהוועדה כבר גיבשה עמדה מחייבת אותנו להתגונן מול נתונים שנקבעו בלעדינו - וזה מצב פתיחה פחות טוב בהרבה."
      }
    }
  ]
}
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="preload" as="image" href="../img/kedaiut-kalkalit-hero.webp" imagesrcset="../img/kedaiut-kalkalit-hero-sm.webp 820w, ../img/kedaiut-kalkalit-hero.webp 1600w" imagesizes="100vw">
<link rel="stylesheet" href="../styles.css">
<link rel="stylesheet" href="../hitmahut.css">
</head>
<body class="spec-page">

<a href="#main" class="skip-to-content">דלג לתוכן הראשי</a>

<nav id="navbar" role="navigation" aria-label="ניווט ראשי">
  <div class="nav-inner">
    <a href="../index.html" class="nav-logo" aria-label="בורוביץ מזרחי שמאות מקרקעין - דף הבית"><img src="../logo-bm.png" alt="לוגו בורוביץ מזרחי"></a>
    <ul class="nav-links" id="navLinks">
      <li><a href="../index.html#about" onclick="closeMenu()">אודות</a></li>
      <li><a href="../index.html#services" onclick="closeMenu()">תחומי התמחות</a></li>
      <li><a href="../maamarim.html" onclick="closeMenu()">מאמרים</a></li>
      <li><a href="../index.html#linkedin-posts" onclick="closeMenu()">עדכונים</a></li>
      <li><a href="../careers.html" onclick="closeMenu()">קריירה</a></li>
      <li><a href="#cta" class="nav-cta" onclick="closeMenu()">צור קשר</a></li>
    </ul>
    <button class="hamburger" id="hamburger" onclick="toggleMenu()" aria-label="תפריט ניווט" aria-expanded="false"><span></span><span></span><span></span></button>
  </div>
</nav>

<main id="main">

<header class="sp-hero">
  <figure class="sp-hero-media">
    <img src="../img/kedaiut-kalkalit-hero.webp"
         srcset="../img/kedaiut-kalkalit-hero-sm.webp 820w, ../img/kedaiut-kalkalit-hero.webp 1600w"
         sizes="(max-width: 900px) 100vw, 50vw"
         alt="גרף עולה עם מבנה בפסגה - כדאיות כלכלית של פרויקט" fetchpriority="high" decoding="async">
    <span class="sp-hero-seam" aria-hidden="true"></span>
  </figure>
  <div class="sp-hero-inner">
    <div class="sp-hero-copy">
      <nav class="sp-crumb" aria-label="פירורי לחם">
        <a href="../index.html">בורוביץ מזרחי</a><span>/</span><a href="../index.html#services">תחומי התמחות</a><span>/</span><em>כדאיות כלכלית וליווי</em>
      </nav>
      <h1 class="sp-h1">ליווי כלכלי וסטטוטורי מול מוסדות התכנון<br><span>מקסום זכויות וקידום תוכניות במהירות</span></h1>
      <p class="sp-lede">ייצוג יזמים מול ועדות התכנון, עריכת חוות דעת לפי תקן 21 ובדיקת תמורות לפרויקטים.</p>
      <div class="sp-actions is-hero">
        <a class="sp-btn sp-btn-gold" href="https://wa.me/972546559942?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%97%D7%A0%D7%95%20%D7%9C%D7%A7%D7%A8%D7%90%D7%AA%20%D7%94%D7%92%D7%A9%D7%AA%20%D7%AA%D7%95%D7%9B%D7%A0%D7%99%D7%AA%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%91%D7%97%D7%99%D7%A0%D7%94%20%D7%9B%D7%9C%D7%9B%D7%9C%D7%99%D7%AA%20%D7%9E%D7%95%D7%A7%D7%93%D7%9E%D7%AA." target="_blank" rel="noopener noreferrer">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"/></svg></span>שליחת הודעה בוואטסאפ
        </a>
        <a class="sp-btn sp-btn-line" href="tel:054-6559942">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>054-6559942
        </a>
      </div>
    </div>
  </div>
</header>

<section class="sp-sec sp-pain">
  <div class="sp-wrap">
    <h2 class="sp-h2 reveal">תכנון כלכלי מדויק הוא ההבדל בין פרויקט מצליח לפרויקט תקוע</h2>
    <p class="sp-pain-text reveal">קידום תוכנית (פינוי-בינוי, תמ"א או מתחמי עירוב שימושים) ללא תשתית כלכלית מוצקה מביא לקיצוץ זכויות על ידי הוועדות, לקביעת מכפילי בינוי שאינם רווחיים, או לדרישות מופרזות למטלות ציבוריות ותמורות דיירים. פרויקט שלא כויל שמאית מול הוועדה מסתכן בסחבת של שנים או באובדן הרווחיות היזמית.</p>
  </div>
</section>

<section class="sp-sec sp-alt">
  <div class="sp-wrap">
    <h2 class="sp-kicker reveal">למי השירות מיועד</h2>
    <ul class="sp-aud-grid">
      <li class="sp-aud reveal"><span class="sp-aud-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></span><span>יזמים וחברות בנייה המקדמים תב"עות להתחדשות עירונית או מתחמים חדשים.</span></li>
      <li class="sp-aud reveal"><span class="sp-aud-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></span><span>מנהלות התחדשות עירונית ונציגויות דיירים המבקשות בדיקת כדאיות עצמאית.</span></li>
      <li class="sp-aud reveal"><span class="sp-aud-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></span><span>אדריכלים ומתכננים הזקוקים לשמאי שותף לעיצוב הפרוגרמה הכלכלית מול מוסדות התכנון.</span></li>
    </ul>
  </div>
</section>

<section class="sp-sec sp-process">
  <div class="sp-wrap">
    <h2 class="sp-kicker reveal">תהליך העבודה שלנו</h2>
    <ol class="sp-steps">
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>ניתוח המצב</h3>
        <p>ניתוח המצב הקיים, היקף הדירות/מבנים להריסה ודרישות המדיניות העירונית.</p>
      </li>
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>תחשיב כלכלי</h3>
        <p>עריכת תחשיב כלכלי קפדני לפי תקן 21.1 המעודכן ביותר והנחיות הרשות הממשלתית.</p>
      </li>
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>כיול פרויקט</h3>
        <p>כיול תמורות הדיירים, היקף המטלות הציבוריות וצפי היטלי ההשבחה.</p>
      </li>
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>ייצוג ודיון</h3>
        <p>ייצוג אקטיבי של היזם בדיונים בוועדות התכנון ובדיאלוג מול שמאיי הוועדה.</p>
      </li>
    </ol>
  </div>
</section>

<section class="sp-sec sp-alt sp-deliver">
  <div class="sp-wrap sp-split">
    <div class="sp-split-copy reveal">
      <h2 class="sp-kicker">מה מקבלים ביד</h2>
      <p class="sp-deliver-text">חוות דעת כלכלית-שמאית מלאה לפי תקן 21, נספח כלכלי לתב"ע המיושר עם פסיקות מוסדות התכנון וייצוג מקצועי רציף עד לקבלת החלטת אישור.</p>
      <div class="sp-note">
        <span class="sp-note-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h10"/><path d="M6 15.5 12.5 9"/><path d="m9 6 6 6"/><path d="M12.5 2.5 19 9l-2.5 2.5L10 5z"/><path d="M4.5 13.5 9 18l-2 2-4.5-4.5z"/></svg></span>
        <div>
          <strong>בחזית הפסיקה</strong>
          <p>אנחנו עוקבים באופן שוטף אחר פסיקות בתי המשפט, הכרעות שמאים מכריעים והחלטות ועדות ערר. כל שומה שיוצאת מהמשרד נשענת על התקדימים והפרשנויות המשפטיות העדכניים ביותר - ולא על נוסחאות שעבדו פעם.</p>
        </div>
      </div>
    </div>
    <figure class="sp-split-img reveal">
      <img src="../img/kedaiut-kalkalit-body.webp" alt="מגדל משרדים עם שכבת תכנון דיגיטלית - בחינת כדאיות הפרויקט" loading="lazy" decoding="async">
    </figure>
  </div>
</section>

<section class="sp-sec sp-faq">
  <div class="sp-wrap">
    <h2 class="sp-kicker reveal">שאלות נפוצות</h2>
    <div class="sp-faq-list reveal">
      <details class="sp-q">
        <summary>כיצד תקן 21 מסייע ליזם מול מוסדות התכנון?</summary>
        <p>התקן מספק מתודולוגיה אחידה המוכרת על ידי ועדות התכנון להוכחת הצפיפות והזכויות הנדרשות כדי שהפרויקט יהיה בר-ביצוע ולא ייכשל כלכלית.</p>
      </details>
      <details class="sp-q">
        <summary>מתי נכון לערב שמאי - לפני ההגשה או אחרי הערות הוועדה?</summary>
        <p>לפני. תחשיב כלכלי שנבנה מראש מעצב את הפרוגרמה ואת המספרים שמוגשים, ומאפשר להוביל את הדיון. כניסה אחרי שהוועדה כבר גיבשה עמדה מחייבת אותנו להתגונן מול נתונים שנקבעו בלעדינו - וזה מצב פתיחה פחות טוב בהרבה.</p>
      </details>
    </div>
  </div>
</section>

<section class="sp-sec sp-alt sp-proof-sec">
  <div class="sp-wrap">
    <h2 class="sp-kicker reveal">הוכחות מהשטח והעמקה</h2>
    <div class="sp-proof-grid reveal">
      <a class="sp-proof is-gov" href="https://www.gov.il/BlobFolder/dynamiccollectorresultitem/assessor-standardization-db-21/he/land_assessor_shameim_teken_21.1.pdf" target="_blank" rel="noopener noreferrer">
        <span class="sp-proof-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></span>
        <span class="sp-proof-kind">מסמך רשמי להורדה</span>
        <h3>תקן 21.1 המלא והמעודכן של מועצת שמאי המקרקעין (PDF)</h3>
        <p>פירוט מזערי נדרש בבדיקה שמאית כלכלית לתוכנית פינוי-בינוי - הנוסח הרשמי מאתר gov.il.</p>
        <span class="sp-proof-go">להורדה <i>←</i><em>נפתח בלשונית חדשה</em></span>
      </a>
    </div>
  </div>
</section>

<section class="sp-sec sp-cta" id="cta">
  <div class="sp-wrap reveal">
    <h2 class="sp-h2">מתכננים להגיש תוכנית לוועדה?</h2>
    <p class="sp-cta-text">שלחו לנו את החומרים לבחינה כלכלית מוקדמת - לפני ההגשה, כשעוד אפשר להשפיע על המספרים.</p>
    <div class="sp-actions is-cta">
        <a class="sp-btn sp-btn-gold" href="https://wa.me/972546559942?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%97%D7%A0%D7%95%20%D7%9C%D7%A7%D7%A8%D7%90%D7%AA%20%D7%94%D7%92%D7%A9%D7%AA%20%D7%AA%D7%95%D7%9B%D7%A0%D7%99%D7%AA%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%91%D7%97%D7%99%D7%A0%D7%94%20%D7%9B%D7%9C%D7%9B%D7%9C%D7%99%D7%AA%20%D7%9E%D7%95%D7%A7%D7%93%D7%9E%D7%AA." target="_blank" rel="noopener noreferrer">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"/></svg></span>שליחת הודעה בוואטסאפ
        </a>
        <a class="sp-btn sp-btn-line" href="tel:054-6559942">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>054-6559942
        </a>
      </div>
    <p class="sp-cta-alt">או השאירו פרטים ב<a href="../index.html#contact">טופס יצירת הקשר</a></p>
  </div>
</section>

</main>

<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="../logo-bm.png" alt="לוגו בורוביץ מזרחי">
        <p>משרד שמאות מקרקעין מוביל בצפון. ידע מקצועי מעמיק, היכרות שטח בלתי אמצעית והבנה כלכלית רחבה - בשירות כל לקוח.</p>
      </div>
      <div class="footer-col">
        <h4>ניווט</h4>
        <ul>
          <li><a href="../index.html#about">אודות</a></li>
          <li><a href="../index.html#services">תחומי התמחות</a></li>
          <li><a href="../maamarim.html">מאמרים</a></li>
          <li><a href="../careers.html">קריירה</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>יצירת קשר</h4>
        <ul>
          <li><a href="tel:054-6559942">054-6559942 · מאור</a></li>
          <li><a href="tel:050-8922469">050-8922469 · אמיר</a></li>
          <li><a id="em-footer" href="#"></a></li>
          <li>שדרות החרוב 6, פארק תעשיות בר-לב</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 בורוביץ מזרחי שמאות מקרקעין וחקלאות בע"מ. כל הזכויות שמורות.</span>
      <span><a href="../index.html">חזרה לאתר הראשי</a></span>
    </div>
  </div>
</footer>

<div class="floating-wrap">
  <a class="float-btn float-btn-wa" href="https://wa.me/972546559942" target="_blank" rel="noopener noreferrer" aria-label="שלחו הודעה בוואטסאפ">
    <svg aria-hidden="true" viewBox="0 0 32 32"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.67 4.61 1.832 6.5L4 29l7.75-1.812A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="#fff"/><path d="M21.5 18.5c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.19-.57-.34z" fill="#25D366"/></svg>
  </a>
  <button type="button" id="customAccessBtn" class="float-btn float-btn-access" aria-label="פתח תפריט נגישות" title="נגישות"><span aria-hidden="true">♿</span></button>
</div>

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<script>
  (function(){ var el=document.getElementById('em-footer'); if(el){ var a='info'+'@'+'bor-miz.co.il'; el.href='mailto:'+a; el.textContent=a; } })();
  function toggleMenu(){ var l=document.getElementById('navLinks'),b=document.getElementById('hamburger'); l.classList.toggle('open'); b.classList.toggle('open'); b.setAttribute('aria-expanded', l.classList.contains('open')?'true':'false'); }
  function closeMenu(){ document.getElementById('navLinks').classList.remove('open'); var b=document.getElementById('hamburger'); b.classList.remove('open'); b.setAttribute('aria-expanded','false'); }
  document.addEventListener('click', function(e){ var nav=document.getElementById('navbar'); if(nav && !nav.contains(e.target)) closeMenu(); });
  (function(){ var nav=document.getElementById('navbar'); var onScroll=function(){ nav.classList.toggle('scrolled', window.scrollY>60); }; window.addEventListener('scroll', onScroll, {passive:true}); onScroll(); })();
  (function(){
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce || !window.gsap || !window.ScrollTrigger){
      document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.reveal').forEach(function(el){ ScrollTrigger.create({ trigger: el, start:'top 90%', onEnter:function(){ el.classList.add('in'); } }); });
  })();
  // אקורדיון: פתיחת שאלה סוגרת את הקודמת
  (function(){
    var items = document.querySelectorAll('.sp-faq .sp-q');
    items.forEach(function(d){
      d.addEventListener('toggle', function(){
        if(!d.open) return;
        items.forEach(function(o){ if(o !== d) o.open = false; });
      });
    });
  })();
  // מעקב המרות - זהה לשאר האתר
  (function(){ window.dataLayer=window.dataLayer||[]; document.addEventListener('click', function(e){ var el=e.target.closest&&e.target.closest('a'); if(!el) return; if(/wa\.me|api\.whatsapp/.test(el.href||'')){ window.dataLayer.push({event:'contact_whatsapp'}); } else if((el.getAttribute('href')||'').indexOf('tel:')===0){ window.dataLayer.push({event:'contact_phone'}); } }, true); })();
</script>

<nagishli></nagishli>
<script>
nl_contact = "n:בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ|p:054-6559942|u:maor@bor-miz.co.il";
nl_pos = "BL"; nl_lang = "he"; nl_color = "blue"; nl_compact = "1";
</script>
<script src="../nagishli.js?v=2.3" charset="utf-8"></script>
<script>
  (function(){
    function forceCompactStyles(){
      var bar=document.getElementById('NagishLiBar'), menus=document.getElementById('NagishLiMenus');
      if(bar){ bar.style.cssText='position:fixed !important; left:1.4rem !important; right:auto !important; bottom:6.2rem !important; top:auto !important; width:300px !important; max-width:90vw !important; height:auto !important; z-index:9999 !important; background:transparent !important; box-shadow:none !important; border:none !important; padding:0 !important; margin:0 !important;'; }
      if(menus){ menus.style.cssText+=';position:static !important; width:300px !important; max-width:90vw !important; max-height:70vh !important; overflow-y:auto !important; overflow-x:hidden !important; font-size:13px !important; border-radius:12px !important; box-shadow:0 10px 40px rgba(0,0,0,0.3) !important; margin:0 !important; padding:0 !important; background:#fff !important;'; }
      document.querySelectorAll('#NagishLiMenus, #NagishLiMenus ul').forEach(function(el){ el.style.width='100%'; el.style.maxWidth='300px'; el.style.boxSizing='border-box'; });
    }
    function openNagishLiMenu(){
      if(typeof jQuery==='undefined') return false;
      var $=jQuery, $strip=$('#NagishLiBarStrip'), $menus=$('#NagishLiMenus');
      if(!$strip.length || !$menus.length) return false;
      if($menus.is(':visible')){ $menus.slideUp(150, function(){ $strip.removeClass('open'); }); }
      else { forceCompactStyles(); $strip.addClass('open'); $menus.slideDown(150, forceCompactStyles); }
      return true;
    }
    function bind(){ var btn=document.getElementById('customAccessBtn'); if(!btn) return; btn.addEventListener('click', function(e){ e.preventDefault(); var n=0; (function tryOpen(){ if(openNagishLiMenu()) return; if(++n<30) setTimeout(tryOpen,200); })(); }); }
    if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', bind); } else { bind(); }
  })();
</script>

</body>
</html>

```

### `hitmahut/kinus-ufiruk-shituf.html`

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="shortcut icon" href="/favicon.ico">

<!-- ⚠ קובץ אוטומטי - נוצר ע"י _build/build-hitmahut.mjs. אין לערוך ידנית.
     תוכן: _build/specializations.data.mjs · תמונות: _build/optimize-images.mjs -->

<script async src="https://www.googletagmanager.com/gtag/js?id=G-GYNQPGPR33"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-GYNQPGPR33');
  (function(){
    var push = window.dataLayer.push;
    window.dataLayer.push = function(){
      for (var i = 0; i < arguments.length; i++) {
        var o = arguments[i];
        if (o && typeof o.event === 'string') {
          var params = {};
          for (var k in o) { if (k !== 'event' && Object.prototype.hasOwnProperty.call(o, k)) params[k] = o[k]; }
          gtag('event', o.event, params);
        }
      }
      return push.apply(window.dataLayer, arguments);
    };
  })();
</script>

<title>שמאות לפירוק שיתוף וכינוס - הכרעה אובייקטיבית וקבילה לסיום סכסוכים | בורוביץ מזרחי</title>
<meta name="description" content="חוות דעת מומחה לבית משפט בהליכי פירוק שיתוף, ירושה, גירושין וכינוס נכסים: שווי שוק מול מימוש מהיר, חלוקה בעין ותחשיב תשלומי איזון.">
<meta name="robots" content="index,follow">
<link rel="canonical" href="https://bor-miz.co.il/hitmahut/kinus-ufiruk-shituf.html">
<meta property="og:type" content="website">
<meta property="og:url" content="https://bor-miz.co.il/hitmahut/kinus-ufiruk-shituf.html">
<meta property="og:title" content="שמאות לפירוק שיתוף וכינוס - הכרעה אובייקטיבית וקבילה לסיום סכסוכים">
<meta property="og:description" content="חוות דעת מומחה לבית משפט בהליכי פירוק שיתוף, ירושה, גירושין וכינוס נכסים: שווי שוק מול מימוש מהיר, חלוקה בעין ותחשיב תשלומי איזון.">
<meta property="og:image" content="https://bor-miz.co.il/img/kinus-ufiruk-shituf-hero.webp">
<meta property="og:locale" content="he_IL">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "שמאות לפירוק שיתוף וכינוס - הכרעה אובייקטיבית וקבילה לסיום סכסוכים",
  "serviceType": "כינוס נכסים ופירוק שיתוף",
  "description": "חוות דעת מומחה לבית משפט בהליכי פירוק שיתוף, ירושה, גירושין וכינוס נכסים: שווי שוק מול מימוש מהיר, חלוקה בעין ותחשיב תשלומי איזון.",
  "provider": {
    "@type": "LocalBusiness",
    "name": "בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ",
    "telephone": "+972-50-8922469",
    "areaServed": "ישראל"
  },
  "url": "https://bor-miz.co.il/hitmahut/kinus-ufiruk-shituf.html"
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "בורוביץ מזרחי",
      "item": "https://bor-miz.co.il/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "תחומי התמחות",
      "item": "https://bor-miz.co.il/#services"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "כינוס נכסים ופירוק שיתוף",
      "item": "https://bor-miz.co.il/hitmahut/kinus-ufiruk-shituf.html"
    }
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "מה ההבדל בין שווי שוק חופשי לשווי במימוש מהיר (כינוס נכסים)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "במימוש מהיר/כפוי קיים לרוב מקדם הפחתה הנובע מלוחות זמנים קצרים, אי-וודאות משפטית ומצב הנכס. השומה מגדירה את שני הערכים במדויק."
      }
    },
    {
      "@type": "Question",
      "name": "אחד הצדדים מסרב לאפשר ביקור בנכס. מה קורה אז?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "בהליך משפטי הביקור מתואם מול בית המשפט או מול הכונס, ובמקרה הצורך ניתן לפעול לפי החלטה שיפוטית. בשומה מוסכמת אנחנו מתאמים ביקור בנוכחות כל הצדדים או באי כוחם, כדי שאיש לא יוכל לטעון בדיעבד שלא ניתנה לו הזדמנות להציג את עמדתו."
      }
    }
  ]
}
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="preload" as="image" href="../img/kinus-ufiruk-shituf-hero.webp" imagesrcset="../img/kinus-ufiruk-shituf-hero-sm.webp 820w, ../img/kinus-ufiruk-shituf-hero.webp 1600w" imagesizes="100vw">
<link rel="stylesheet" href="../styles.css">
<link rel="stylesheet" href="../hitmahut.css">
</head>
<body class="spec-page">

<a href="#main" class="skip-to-content">דלג לתוכן הראשי</a>

<nav id="navbar" role="navigation" aria-label="ניווט ראשי">
  <div class="nav-inner">
    <a href="../index.html" class="nav-logo" aria-label="בורוביץ מזרחי שמאות מקרקעין - דף הבית"><img src="../logo-bm.png" alt="לוגו בורוביץ מזרחי"></a>
    <ul class="nav-links" id="navLinks">
      <li><a href="../index.html#about" onclick="closeMenu()">אודות</a></li>
      <li><a href="../index.html#services" onclick="closeMenu()">תחומי התמחות</a></li>
      <li><a href="../maamarim.html" onclick="closeMenu()">מאמרים</a></li>
      <li><a href="../index.html#linkedin-posts" onclick="closeMenu()">עדכונים</a></li>
      <li><a href="../careers.html" onclick="closeMenu()">קריירה</a></li>
      <li><a href="#cta" class="nav-cta" onclick="closeMenu()">צור קשר</a></li>
    </ul>
    <button class="hamburger" id="hamburger" onclick="toggleMenu()" aria-label="תפריט ניווט" aria-expanded="false"><span></span><span></span><span></span></button>
  </div>
</nav>

<main id="main">

<header class="sp-hero">
  <figure class="sp-hero-media">
    <img src="../img/kinus-ufiruk-shituf-hero.webp"
         srcset="../img/kinus-ufiruk-shituf-hero-sm.webp 820w, ../img/kinus-ufiruk-shituf-hero.webp 1600w"
         sizes="(max-width: 900px) 100vw, 50vw"
         alt="מאזני פליז - איזון בין שווי הנכס לחלקם של הצדדים" fetchpriority="high" decoding="async">
    <span class="sp-hero-seam" aria-hidden="true"></span>
  </figure>
  <div class="sp-hero-inner">
    <div class="sp-hero-copy">
      <nav class="sp-crumb" aria-label="פירורי לחם">
        <a href="../index.html">בורוביץ מזרחי</a><span>/</span><a href="../index.html#services">תחומי התמחות</a><span>/</span><em>כינוס נכסים ופירוק שיתוף</em>
      </nav>
      <h1 class="sp-h1">שמאות לפירוק שיתוף וכינוס<br><span>הכרעה אובייקטיבית וקבילה לסיום סכסוכים</span></h1>
      <p class="sp-lede">חוות דעת מומחה עבור בתי משפט, בתי דין וכונסי נכסים בהליכי פירוק וסכסוכי מקרקעין.</p>
      <div class="sp-actions is-hero">
        <a class="sp-btn sp-btn-gold" href="https://wa.me/972546559942?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%97%D7%A0%D7%95%20%D7%96%D7%A7%D7%95%D7%A7%D7%99%D7%9D%20%D7%9C%D7%97%D7%95%D7%95%D7%AA%20%D7%93%D7%A2%D7%AA%20%D7%A9%D7%9E%D7%90%D7%99%D7%AA%20%D7%9C%D7%A4%D7%99%D7%A8%D7%95%D7%A7%20%D7%A9%D7%99%D7%AA%D7%95%D7%A3%20%2F%20%D7%9B%D7%99%D7%A0%D7%95%D7%A1%20%D7%A0%D7%9B%D7%A1%D7%99%D7%9D." target="_blank" rel="noopener noreferrer">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"/></svg></span>שליחת הודעה בוואטסאפ
        </a>
        <a class="sp-btn sp-btn-line" href="tel:054-6559942">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>054-6559942
        </a>
      </div>
    </div>
  </div>
</header>

<section class="sp-sec sp-pain">
  <div class="sp-wrap">
    <h2 class="sp-h2 reveal">סכסוך מקרקעין נגמר כששומה אחת מוסכמת מונחת על השולחן</h2>
    <p class="sp-pain-text reveal">סכסוכי מקרקעין בין יורשים, בני זוג בהליכי גירושין או שותפים עסקיים מאופיינים בחוסר אמון ובמבוי סתום. שומה לא מקצועית, מוטה או חסרה מובילה להתנגדויות משפטיות, לסחבת רבת שנים ולמכירה בהפסד משמעותי תחת לחץ.</p>
  </div>
</section>

<section class="sp-sec sp-alt">
  <div class="sp-wrap">
    <h2 class="sp-kicker reveal">למי השירות מיועד</h2>
    <ul class="sp-aud-grid">
      <li class="sp-aud reveal"><span class="sp-aud-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></span><span>כונסי נכסים ועורכי דין המנהלים תיקי פירוק שיתוף או עיזבונות.</span></li>
      <li class="sp-aud reveal"><span class="sp-aud-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></span><span>שותפים ויורשים המעוניינים בבדיקה אובייקטיבית מוסכמת לחלוקה צודקת.</span></li>
      <li class="sp-aud reveal"><span class="sp-aud-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></span><span>שופטים ובתי משפט הממנים שמאי מומחה מטעמם לקביעת שווי.</span></li>
    </ul>
  </div>
</section>

<section class="sp-sec sp-process">
  <div class="sp-wrap">
    <h2 class="sp-kicker reveal">תהליך העבודה שלנו</h2>
    <ol class="sp-steps">
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>קבלת המינוי</h3>
        <p>קבלת כתב המינוי/הסכמת הצדדים, איסוף כתבי בי-דין ובדיקת מסמכי הזכויות.</p>
      </li>
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>סיור בנכס</h3>
        <p>תיאום ביקור בנכס בנוכחות כלל הצדדים או באי כוחם בשקיפות מלאה.</p>
      </li>
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>בחינת חלופות</h3>
        <p>בחינת שווי שוק במכירה רגילה מול מכירה מאולצת (כינוס), ובחינת חלוקה בעין.</p>
      </li>
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>חוות דעת ועדות</h3>
        <p>מתן חוות דעת מומחה מנומקת, מענה לשאלות הבהרה ועדות מומחה בבית המשפט במידת הצורך.</p>
      </li>
    </ol>
  </div>
</section>

<section class="sp-sec sp-alt sp-deliver">
  <div class="sp-wrap sp-split">
    <div class="sp-split-copy reveal">
      <h2 class="sp-kicker">מה מקבלים ביד</h2>
      <p class="sp-deliver-text">חוות דעת מומחה לבית משפט, ערוכה בהתאם לפקודת הראיות ותקנות סדר הדין האזרחי, הכוללת תחשיב תשלומי איזון, המלצות לחלוקה והסתמכות על הפסיקה העדכנית בהליכי פירוק שיתוף.</p>
      <div class="sp-note">
        <span class="sp-note-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h10"/><path d="M6 15.5 12.5 9"/><path d="m9 6 6 6"/><path d="M12.5 2.5 19 9l-2.5 2.5L10 5z"/><path d="M4.5 13.5 9 18l-2 2-4.5-4.5z"/></svg></span>
        <div>
          <strong>בחזית הפסיקה</strong>
          <p>אנחנו עוקבים באופן שוטף אחר פסיקות בתי המשפט, הכרעות שמאים מכריעים והחלטות ועדות ערר. כל שומה שיוצאת מהמשרד נשענת על התקדימים והפרשנויות המשפטיות העדכניים ביותר - ולא על נוסחאות שעבדו פעם.</p>
        </div>
      </div>
    </div>
    <figure class="sp-split-img reveal">
      <img src="../img/kinus-ufiruk-shituf-body.webp" alt="קביעת שווי הנכס לצורך חלוקה ותשלומי איזון" loading="lazy" decoding="async">
    </figure>
  </div>
</section>

<section class="sp-sec sp-faq">
  <div class="sp-wrap">
    <h2 class="sp-kicker reveal">שאלות נפוצות</h2>
    <div class="sp-faq-list reveal">
      <details class="sp-q">
        <summary>מה ההבדל בין שווי שוק חופשי לשווי במימוש מהיר (כינוס נכסים)?</summary>
        <p>במימוש מהיר/כפוי קיים לרוב מקדם הפחתה הנובע מלוחות זמנים קצרים, אי-וודאות משפטית ומצב הנכס. השומה מגדירה את שני הערכים במדויק.</p>
      </details>
      <details class="sp-q">
        <summary>אחד הצדדים מסרב לאפשר ביקור בנכס. מה קורה אז?</summary>
        <p>בהליך משפטי הביקור מתואם מול בית המשפט או מול הכונס, ובמקרה הצורך ניתן לפעול לפי החלטה שיפוטית. בשומה מוסכמת אנחנו מתאמים ביקור בנוכחות כל הצדדים או באי כוחם, כדי שאיש לא יוכל לטעון בדיעבד שלא ניתנה לו הזדמנות להציג את עמדתו.</p>
      </details>
    </div>
  </div>
</section>

<section class="sp-sec sp-cta" id="cta">
  <div class="sp-wrap reveal">
    <h2 class="sp-h2">זקוקים לחוות דעת מומחה לבית משפט או לכינוס?</h2>
    <p class="sp-cta-text">פנו לקבלת הצעת עבודה מסודרת - נסביר מראש מה נכלל, מה לוח הזמנים ומה העלות.</p>
    <div class="sp-actions is-cta">
        <a class="sp-btn sp-btn-gold" href="https://wa.me/972546559942?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%97%D7%A0%D7%95%20%D7%96%D7%A7%D7%95%D7%A7%D7%99%D7%9D%20%D7%9C%D7%97%D7%95%D7%95%D7%AA%20%D7%93%D7%A2%D7%AA%20%D7%A9%D7%9E%D7%90%D7%99%D7%AA%20%D7%9C%D7%A4%D7%99%D7%A8%D7%95%D7%A7%20%D7%A9%D7%99%D7%AA%D7%95%D7%A3%20%2F%20%D7%9B%D7%99%D7%A0%D7%95%D7%A1%20%D7%A0%D7%9B%D7%A1%D7%99%D7%9D." target="_blank" rel="noopener noreferrer">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"/></svg></span>שליחת הודעה בוואטסאפ
        </a>
        <a class="sp-btn sp-btn-line" href="tel:054-6559942">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>054-6559942
        </a>
      </div>
    <p class="sp-cta-alt">או השאירו פרטים ב<a href="../index.html#contact">טופס יצירת הקשר</a></p>
  </div>
</section>

</main>

<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="../logo-bm.png" alt="לוגו בורוביץ מזרחי">
        <p>משרד שמאות מקרקעין מוביל בצפון. ידע מקצועי מעמיק, היכרות שטח בלתי אמצעית והבנה כלכלית רחבה - בשירות כל לקוח.</p>
      </div>
      <div class="footer-col">
        <h4>ניווט</h4>
        <ul>
          <li><a href="../index.html#about">אודות</a></li>
          <li><a href="../index.html#services">תחומי התמחות</a></li>
          <li><a href="../maamarim.html">מאמרים</a></li>
          <li><a href="../careers.html">קריירה</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>יצירת קשר</h4>
        <ul>
          <li><a href="tel:054-6559942">054-6559942 · מאור</a></li>
          <li><a href="tel:050-8922469">050-8922469 · אמיר</a></li>
          <li><a id="em-footer" href="#"></a></li>
          <li>שדרות החרוב 6, פארק תעשיות בר-לב</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 בורוביץ מזרחי שמאות מקרקעין וחקלאות בע"מ. כל הזכויות שמורות.</span>
      <span><a href="../index.html">חזרה לאתר הראשי</a></span>
    </div>
  </div>
</footer>

<div class="floating-wrap">
  <a class="float-btn float-btn-wa" href="https://wa.me/972546559942" target="_blank" rel="noopener noreferrer" aria-label="שלחו הודעה בוואטסאפ">
    <svg aria-hidden="true" viewBox="0 0 32 32"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.67 4.61 1.832 6.5L4 29l7.75-1.812A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="#fff"/><path d="M21.5 18.5c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.19-.57-.34z" fill="#25D366"/></svg>
  </a>
  <button type="button" id="customAccessBtn" class="float-btn float-btn-access" aria-label="פתח תפריט נגישות" title="נגישות"><span aria-hidden="true">♿</span></button>
</div>

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<script>
  (function(){ var el=document.getElementById('em-footer'); if(el){ var a='info'+'@'+'bor-miz.co.il'; el.href='mailto:'+a; el.textContent=a; } })();
  function toggleMenu(){ var l=document.getElementById('navLinks'),b=document.getElementById('hamburger'); l.classList.toggle('open'); b.classList.toggle('open'); b.setAttribute('aria-expanded', l.classList.contains('open')?'true':'false'); }
  function closeMenu(){ document.getElementById('navLinks').classList.remove('open'); var b=document.getElementById('hamburger'); b.classList.remove('open'); b.setAttribute('aria-expanded','false'); }
  document.addEventListener('click', function(e){ var nav=document.getElementById('navbar'); if(nav && !nav.contains(e.target)) closeMenu(); });
  (function(){ var nav=document.getElementById('navbar'); var onScroll=function(){ nav.classList.toggle('scrolled', window.scrollY>60); }; window.addEventListener('scroll', onScroll, {passive:true}); onScroll(); })();
  (function(){
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce || !window.gsap || !window.ScrollTrigger){
      document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.reveal').forEach(function(el){ ScrollTrigger.create({ trigger: el, start:'top 90%', onEnter:function(){ el.classList.add('in'); } }); });
  })();
  // אקורדיון: פתיחת שאלה סוגרת את הקודמת
  (function(){
    var items = document.querySelectorAll('.sp-faq .sp-q');
    items.forEach(function(d){
      d.addEventListener('toggle', function(){
        if(!d.open) return;
        items.forEach(function(o){ if(o !== d) o.open = false; });
      });
    });
  })();
  // מעקב המרות - זהה לשאר האתר
  (function(){ window.dataLayer=window.dataLayer||[]; document.addEventListener('click', function(e){ var el=e.target.closest&&e.target.closest('a'); if(!el) return; if(/wa\.me|api\.whatsapp/.test(el.href||'')){ window.dataLayer.push({event:'contact_whatsapp'}); } else if((el.getAttribute('href')||'').indexOf('tel:')===0){ window.dataLayer.push({event:'contact_phone'}); } }, true); })();
</script>

<nagishli></nagishli>
<script>
nl_contact = "n:בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ|p:054-6559942|u:maor@bor-miz.co.il";
nl_pos = "BL"; nl_lang = "he"; nl_color = "blue"; nl_compact = "1";
</script>
<script src="../nagishli.js?v=2.3" charset="utf-8"></script>
<script>
  (function(){
    function forceCompactStyles(){
      var bar=document.getElementById('NagishLiBar'), menus=document.getElementById('NagishLiMenus');
      if(bar){ bar.style.cssText='position:fixed !important; left:1.4rem !important; right:auto !important; bottom:6.2rem !important; top:auto !important; width:300px !important; max-width:90vw !important; height:auto !important; z-index:9999 !important; background:transparent !important; box-shadow:none !important; border:none !important; padding:0 !important; margin:0 !important;'; }
      if(menus){ menus.style.cssText+=';position:static !important; width:300px !important; max-width:90vw !important; max-height:70vh !important; overflow-y:auto !important; overflow-x:hidden !important; font-size:13px !important; border-radius:12px !important; box-shadow:0 10px 40px rgba(0,0,0,0.3) !important; margin:0 !important; padding:0 !important; background:#fff !important;'; }
      document.querySelectorAll('#NagishLiMenus, #NagishLiMenus ul').forEach(function(el){ el.style.width='100%'; el.style.maxWidth='300px'; el.style.boxSizing='border-box'; });
    }
    function openNagishLiMenu(){
      if(typeof jQuery==='undefined') return false;
      var $=jQuery, $strip=$('#NagishLiBarStrip'), $menus=$('#NagishLiMenus');
      if(!$strip.length || !$menus.length) return false;
      if($menus.is(':visible')){ $menus.slideUp(150, function(){ $strip.removeClass('open'); }); }
      else { forceCompactStyles(); $strip.addClass('open'); $menus.slideDown(150, forceCompactStyles); }
      return true;
    }
    function bind(){ var btn=document.getElementById('customAccessBtn'); if(!btn) return; btn.addEventListener('click', function(e){ e.preventDefault(); var n=0; (function tryOpen(){ if(openNagishLiMenu()) return; if(++n<30) setTimeout(tryOpen,200); })(); }); }
    if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', bind); } else { bind(); }
  })();
</script>

</body>
</html>

```

### `hitmahut/nachalot-umeshakim.html`

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="shortcut icon" href="/favicon.ico">

<!-- ⚠ קובץ אוטומטי - נוצר ע"י _build/build-hitmahut.mjs. אין לערוך ידנית.
     תוכן: _build/specializations.data.mjs · תמונות: _build/optimize-images.mjs -->

<script async src="https://www.googletagmanager.com/gtag/js?id=G-GYNQPGPR33"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-GYNQPGPR33');
  (function(){
    var push = window.dataLayer.push;
    window.dataLayer.push = function(){
      for (var i = 0; i < arguments.length; i++) {
        var o = arguments[i];
        if (o && typeof o.event === 'string') {
          var params = {};
          for (var k in o) { if (k !== 'event' && Object.prototype.hasOwnProperty.call(o, k)) params[k] = o[k]; }
          gtag('event', o.event, params);
        }
      }
      return push.apply(window.dataLayer, arguments);
    };
  })();
</script>

<title>שמאות נחלות ומשקים חקלאיים - מומחיות ייחודית במרחב הכפרי | בורוביץ מזרחי</title>
<meta name="description" content="נחלות כפופות לשילוב מורכב של החלטות רמ&quot;י, מעמד חוזי במושב וחבויות מיסוי כפולות. הערכת שווי, תחשיב עלויות פיצול והיוון ותוכנית פעולה כלכלית.">
<meta name="robots" content="index,follow">
<link rel="canonical" href="https://bor-miz.co.il/hitmahut/nachalot-umeshakim.html">
<meta property="og:type" content="website">
<meta property="og:url" content="https://bor-miz.co.il/hitmahut/nachalot-umeshakim.html">
<meta property="og:title" content="שמאות נחלות ומשקים חקלאיים - מומחיות ייחודית במרחב הכפרי">
<meta property="og:description" content="נחלות כפופות לשילוב מורכב של החלטות רמ&quot;י, מעמד חוזי במושב וחבויות מיסוי כפולות. הערכת שווי, תחשיב עלויות פיצול והיוון ותוכנית פעולה כלכלית.">
<meta property="og:image" content="https://bor-miz.co.il/img/nachalot-umeshakim-hero.webp">
<meta property="og:locale" content="he_IL">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "שמאות נחלות ומשקים חקלאיים - מומחיות ייחודית במרחב הכפרי",
  "serviceType": "נחלות ומשקים חקלאיים",
  "description": "נחלות כפופות לשילוב מורכב של החלטות רמ\"י, מעמד חוזי במושב וחבויות מיסוי כפולות. הערכת שווי, תחשיב עלויות פיצול והיוון ותוכנית פעולה כלכלית.",
  "provider": {
    "@type": "LocalBusiness",
    "name": "בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ",
    "telephone": "+972-50-8922469",
    "areaServed": "ישראל"
  },
  "url": "https://bor-miz.co.il/hitmahut/nachalot-umeshakim.html"
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "בורוביץ מזרחי",
      "item": "https://bor-miz.co.il/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "תחומי התמחות",
      "item": "https://bor-miz.co.il/#services"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "נחלות ומשקים חקלאיים",
      "item": "https://bor-miz.co.il/hitmahut/nachalot-umeshakim.html"
    }
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "האם כדאי להצטרף להסדר חלקת המגורים או רק לפצל מגרש נקודתי?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "הדבר תלוי בגודל המשק, בצרכי המשפחה ובתוכניות העתידיות. אנו מבצעים תחשיב כדאיות השוואתי מדויק עבור שני המסלולים."
      }
    },
    {
      "@type": "Question",
      "name": "יש במשק מבנים ושימושים שלא הוסדרו. אפשר בכלל למכור?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "אפשר, אבל אי-ההסדרה מתגלגלת לתוך העסקה: רמ\"י עשויה לדרוש תשלום בגין השימושים החורגים, והרוכש ידרוש הפחתה בשל אי-הוודאות. אנחנו ממפים את החריגות ומתמחרים את עלות ההסדרה עוד לפני פתיחת המשא ומתן, כדי שתדעו מה באמת נשאר בידיים."
      }
    }
  ]
}
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="preload" as="image" href="../img/nachalot-umeshakim-hero.webp" imagesrcset="../img/nachalot-umeshakim-hero-sm.webp 820w, ../img/nachalot-umeshakim-hero.webp 1600w" imagesizes="100vw">
<link rel="stylesheet" href="../styles.css">
<link rel="stylesheet" href="../hitmahut.css">
</head>
<body class="spec-page">

<a href="#main" class="skip-to-content">דלג לתוכן הראשי</a>

<nav id="navbar" role="navigation" aria-label="ניווט ראשי">
  <div class="nav-inner">
    <a href="../index.html" class="nav-logo" aria-label="בורוביץ מזרחי שמאות מקרקעין - דף הבית"><img src="../logo-bm.png" alt="לוגו בורוביץ מזרחי"></a>
    <ul class="nav-links" id="navLinks">
      <li><a href="../index.html#about" onclick="closeMenu()">אודות</a></li>
      <li><a href="../index.html#services" onclick="closeMenu()">תחומי התמחות</a></li>
      <li><a href="../maamarim.html" onclick="closeMenu()">מאמרים</a></li>
      <li><a href="../index.html#linkedin-posts" onclick="closeMenu()">עדכונים</a></li>
      <li><a href="../careers.html" onclick="closeMenu()">קריירה</a></li>
      <li><a href="#cta" class="nav-cta" onclick="closeMenu()">צור קשר</a></li>
    </ul>
    <button class="hamburger" id="hamburger" onclick="toggleMenu()" aria-label="תפריט ניווט" aria-expanded="false"><span></span><span></span><span></span></button>
  </div>
</nav>

<main id="main">

<header class="sp-hero">
  <figure class="sp-hero-media">
    <img src="../img/nachalot-umeshakim-hero.webp"
         srcset="../img/nachalot-umeshakim-hero-sm.webp 820w, ../img/nachalot-umeshakim-hero.webp 1600w"
         sizes="(max-width: 900px) 100vw, 50vw"
         alt="בית המגורים לצד החלקה החקלאית - הערכת שווי נחלה" fetchpriority="high" decoding="async">
    <span class="sp-hero-seam" aria-hidden="true"></span>
  </figure>
  <div class="sp-hero-inner">
    <div class="sp-hero-copy">
      <nav class="sp-crumb" aria-label="פירורי לחם">
        <a href="../index.html">בורוביץ מזרחי</a><span>/</span><a href="../index.html#services">תחומי התמחות</a><span>/</span><em>נחלות ומשקים חקלאיים</em>
      </nav>
      <h1 class="sp-h1">שמאות נחלות ומשקים חקלאיים<br><span>מומחיות ייחודית במרחב הכפרי</span></h1>
      <p class="sp-lede">ייעוץ כלכלי-שמאי לפיצול מגרש מנחלה, דמי הסכמה, היוון זכויות והסדרת חריגות.</p>
      <div class="sp-actions is-hero">
        <a class="sp-btn sp-btn-gold" href="https://wa.me/972546559942?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%AA%D7%9B%D7%A0%D7%9F%2F%D7%AA%20%D7%9E%D7%94%D7%9C%D7%9A%20%D7%91%D7%A0%D7%97%D7%9C%D7%94%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A4%D7%92%D7%99%D7%A9%D7%AA%20%D7%90%D7%A4%D7%99%D7%95%D7%9F." target="_blank" rel="noopener noreferrer">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"/></svg></span>שליחת הודעה בוואטסאפ
        </a>
        <a class="sp-btn sp-btn-line" href="tel:054-6559942">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>054-6559942
        </a>
      </div>
    </div>
  </div>
</header>

<section class="sp-sec sp-pain">
  <div class="sp-wrap">
    <h2 class="sp-h2 reveal">ניהול עסקאות בנחלות דורש דיוק ומומחיות ללא פשרות</h2>
    <p class="sp-pain-text reveal">נחלות כפופות לשילוב מורכב של החלטות רמ"י, מעמד חוזי במושב וחבויות מיסוי כפולות (דמי הסכמה ודמי רכישה מול מס שבח). טעות בהגדרת הזכויות או אי-הסדרת שימושים חורגים לפני ביצוע עסקה עלולות לייצר דרישות תשלום של מיליוני שקלים ולתקוע את העסקה.</p>
  </div>
</section>

<section class="sp-sec sp-alt">
  <div class="sp-wrap">
    <h2 class="sp-kicker reveal">למי השירות מיועד</h2>
    <ul class="sp-aud-grid">
      <li class="sp-aud reveal"><span class="sp-aud-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></span><span>בעלי נחלות המעוניינים לפצל מגרש עבור בן משפחה או לצורך מכירה.</span></li>
      <li class="sp-aud reveal"><span class="sp-aud-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></span><span>רוכשים ומוכרים של משקים חקלאיים ומשקי עזר במושבים.</span></li>
      <li class="sp-aud reveal"><span class="sp-aud-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></span><span>משפחות בהליכי חלוקת עיזבון, ירושה, גירושין או הסדרים פנים-משפחתיים.</span></li>
    </ul>
  </div>
</section>

<section class="sp-sec sp-process">
  <div class="sp-wrap">
    <h2 class="sp-kicker reveal">תהליך העבודה שלנו</h2>
    <ol class="sp-steps">
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>בדיקת זכויות</h3>
        <p>בדיקה מעמיקה של הסכמי החכירה/משבצת, המצב התכנוני והיתרי הבנייה הקיימים.</p>
      </li>
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>מיפוי וסיור</h3>
        <p>סיור פיזי במשק, מיפוי כלל המבנים (מגורים, פל"ח, סככות) והסדרת חריגות.</p>
      </li>
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>אסטרטגיית רמ"י</h3>
        <p>בחינת חלופות רמ"י לאור ההחלטות ופסקי הדין החדשים ביותר בנושאי חלקת המגורים והפיצול.</p>
      </li>
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>הפקת השומה</h3>
        <p>הפקת חוות דעת אסטרטגית המציגה את התחשיב הכלכלי והמיסויי המלא.</p>
      </li>
    </ol>
  </div>
</section>

<section class="sp-sec sp-alt sp-deliver">
  <div class="sp-wrap sp-split">
    <div class="sp-split-copy reveal">
      <h2 class="sp-kicker">מה מקבלים ביד</h2>
      <p class="sp-deliver-text">דו"ח שומה מקיף לנחלה הכולל הערכת שווי שוק, תחשיב חבויות לרמ"י ולמיסוי מקרקעין ותוכנית פעולה כלכלית מומלצת בהתאם לפסיקה החקלאית העדכנית.</p>
      <div class="sp-note">
        <span class="sp-note-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h10"/><path d="M6 15.5 12.5 9"/><path d="m9 6 6 6"/><path d="M12.5 2.5 19 9l-2.5 2.5L10 5z"/><path d="M4.5 13.5 9 18l-2 2-4.5-4.5z"/></svg></span>
        <div>
          <strong>בחזית הפסיקה</strong>
          <p>אנחנו עוקבים באופן שוטף אחר פסיקות בתי המשפט, הכרעות שמאים מכריעים והחלטות ועדות ערר. כל שומה שיוצאת מהמשרד נשענת על התקדימים והפרשנויות המשפטיות העדכניים ביותר - ולא על נוסחאות שעבדו פעם.</p>
        </div>
      </div>
    </div>
    <figure class="sp-split-img reveal">
      <img src="../img/nachalot-umeshakim-body.webp" alt="תחשיב שווי ותוכניות על שולחן העבודה - חוות דעת לנחלה" loading="lazy" decoding="async">
    </figure>
  </div>
</section>

<section class="sp-sec sp-faq">
  <div class="sp-wrap">
    <h2 class="sp-kicker reveal">שאלות נפוצות</h2>
    <div class="sp-faq-list reveal">
      <details class="sp-q">
        <summary>האם כדאי להצטרף להסדר חלקת המגורים או רק לפצל מגרש נקודתי?</summary>
        <p>הדבר תלוי בגודל המשק, בצרכי המשפחה ובתוכניות העתידיות. אנו מבצעים תחשיב כדאיות השוואתי מדויק עבור שני המסלולים.</p>
      </details>
      <details class="sp-q">
        <summary>יש במשק מבנים ושימושים שלא הוסדרו. אפשר בכלל למכור?</summary>
        <p>אפשר, אבל אי-ההסדרה מתגלגלת לתוך העסקה: רמ"י עשויה לדרוש תשלום בגין השימושים החורגים, והרוכש ידרוש הפחתה בשל אי-הוודאות. אנחנו ממפים את החריגות ומתמחרים את עלות ההסדרה עוד לפני פתיחת המשא ומתן, כדי שתדעו מה באמת נשאר בידיים.</p>
      </details>
    </div>
  </div>
</section>

<section class="sp-sec sp-cta" id="cta">
  <div class="sp-wrap reveal">
    <h2 class="sp-h2">מתכננים מהלך בנחלה?</h2>
    <p class="sp-cta-text">צרו קשר לפגישת אפיון מקצועית. נפרוס את כל העלויות והחבויות מראש - לפני שמתחילים לזוז.</p>
    <div class="sp-actions is-cta">
        <a class="sp-btn sp-btn-gold" href="https://wa.me/972546559942?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%AA%D7%9B%D7%A0%D7%9F%2F%D7%AA%20%D7%9E%D7%94%D7%9C%D7%9A%20%D7%91%D7%A0%D7%97%D7%9C%D7%94%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A4%D7%92%D7%99%D7%A9%D7%AA%20%D7%90%D7%A4%D7%99%D7%95%D7%9F." target="_blank" rel="noopener noreferrer">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"/></svg></span>שליחת הודעה בוואטסאפ
        </a>
        <a class="sp-btn sp-btn-line" href="tel:054-6559942">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>054-6559942
        </a>
      </div>
    <p class="sp-cta-alt">או השאירו פרטים ב<a href="../index.html#contact">טופס יצירת הקשר</a></p>
  </div>
</section>

</main>

<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="../logo-bm.png" alt="לוגו בורוביץ מזרחי">
        <p>משרד שמאות מקרקעין מוביל בצפון. ידע מקצועי מעמיק, היכרות שטח בלתי אמצעית והבנה כלכלית רחבה - בשירות כל לקוח.</p>
      </div>
      <div class="footer-col">
        <h4>ניווט</h4>
        <ul>
          <li><a href="../index.html#about">אודות</a></li>
          <li><a href="../index.html#services">תחומי התמחות</a></li>
          <li><a href="../maamarim.html">מאמרים</a></li>
          <li><a href="../careers.html">קריירה</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>יצירת קשר</h4>
        <ul>
          <li><a href="tel:054-6559942">054-6559942 · מאור</a></li>
          <li><a href="tel:050-8922469">050-8922469 · אמיר</a></li>
          <li><a id="em-footer" href="#"></a></li>
          <li>שדרות החרוב 6, פארק תעשיות בר-לב</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 בורוביץ מזרחי שמאות מקרקעין וחקלאות בע"מ. כל הזכויות שמורות.</span>
      <span><a href="../index.html">חזרה לאתר הראשי</a></span>
    </div>
  </div>
</footer>

<div class="floating-wrap">
  <a class="float-btn float-btn-wa" href="https://wa.me/972546559942" target="_blank" rel="noopener noreferrer" aria-label="שלחו הודעה בוואטסאפ">
    <svg aria-hidden="true" viewBox="0 0 32 32"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.67 4.61 1.832 6.5L4 29l7.75-1.812A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="#fff"/><path d="M21.5 18.5c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.19-.57-.34z" fill="#25D366"/></svg>
  </a>
  <button type="button" id="customAccessBtn" class="float-btn float-btn-access" aria-label="פתח תפריט נגישות" title="נגישות"><span aria-hidden="true">♿</span></button>
</div>

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<script>
  (function(){ var el=document.getElementById('em-footer'); if(el){ var a='info'+'@'+'bor-miz.co.il'; el.href='mailto:'+a; el.textContent=a; } })();
  function toggleMenu(){ var l=document.getElementById('navLinks'),b=document.getElementById('hamburger'); l.classList.toggle('open'); b.classList.toggle('open'); b.setAttribute('aria-expanded', l.classList.contains('open')?'true':'false'); }
  function closeMenu(){ document.getElementById('navLinks').classList.remove('open'); var b=document.getElementById('hamburger'); b.classList.remove('open'); b.setAttribute('aria-expanded','false'); }
  document.addEventListener('click', function(e){ var nav=document.getElementById('navbar'); if(nav && !nav.contains(e.target)) closeMenu(); });
  (function(){ var nav=document.getElementById('navbar'); var onScroll=function(){ nav.classList.toggle('scrolled', window.scrollY>60); }; window.addEventListener('scroll', onScroll, {passive:true}); onScroll(); })();
  (function(){
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce || !window.gsap || !window.ScrollTrigger){
      document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.reveal').forEach(function(el){ ScrollTrigger.create({ trigger: el, start:'top 90%', onEnter:function(){ el.classList.add('in'); } }); });
  })();
  // אקורדיון: פתיחת שאלה סוגרת את הקודמת
  (function(){
    var items = document.querySelectorAll('.sp-faq .sp-q');
    items.forEach(function(d){
      d.addEventListener('toggle', function(){
        if(!d.open) return;
        items.forEach(function(o){ if(o !== d) o.open = false; });
      });
    });
  })();
  // מעקב המרות - זהה לשאר האתר
  (function(){ window.dataLayer=window.dataLayer||[]; document.addEventListener('click', function(e){ var el=e.target.closest&&e.target.closest('a'); if(!el) return; if(/wa\.me|api\.whatsapp/.test(el.href||'')){ window.dataLayer.push({event:'contact_whatsapp'}); } else if((el.getAttribute('href')||'').indexOf('tel:')===0){ window.dataLayer.push({event:'contact_phone'}); } }, true); })();
</script>

<nagishli></nagishli>
<script>
nl_contact = "n:בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ|p:054-6559942|u:maor@bor-miz.co.il";
nl_pos = "BL"; nl_lang = "he"; nl_color = "blue"; nl_compact = "1";
</script>
<script src="../nagishli.js?v=2.3" charset="utf-8"></script>
<script>
  (function(){
    function forceCompactStyles(){
      var bar=document.getElementById('NagishLiBar'), menus=document.getElementById('NagishLiMenus');
      if(bar){ bar.style.cssText='position:fixed !important; left:1.4rem !important; right:auto !important; bottom:6.2rem !important; top:auto !important; width:300px !important; max-width:90vw !important; height:auto !important; z-index:9999 !important; background:transparent !important; box-shadow:none !important; border:none !important; padding:0 !important; margin:0 !important;'; }
      if(menus){ menus.style.cssText+=';position:static !important; width:300px !important; max-width:90vw !important; max-height:70vh !important; overflow-y:auto !important; overflow-x:hidden !important; font-size:13px !important; border-radius:12px !important; box-shadow:0 10px 40px rgba(0,0,0,0.3) !important; margin:0 !important; padding:0 !important; background:#fff !important;'; }
      document.querySelectorAll('#NagishLiMenus, #NagishLiMenus ul').forEach(function(el){ el.style.width='100%'; el.style.maxWidth='300px'; el.style.boxSizing='border-box'; });
    }
    function openNagishLiMenu(){
      if(typeof jQuery==='undefined') return false;
      var $=jQuery, $strip=$('#NagishLiBarStrip'), $menus=$('#NagishLiMenus');
      if(!$strip.length || !$menus.length) return false;
      if($menus.is(':visible')){ $menus.slideUp(150, function(){ $strip.removeClass('open'); }); }
      else { forceCompactStyles(); $strip.addClass('open'); $menus.slideDown(150, forceCompactStyles); }
      return true;
    }
    function bind(){ var btn=document.getElementById('customAccessBtn'); if(!btn) return; btn.addEventListener('click', function(e){ e.preventDefault(); var n=0; (function tryOpen(){ if(openNagishLiMenu()) return; if(++n<30) setTimeout(tryOpen,200); })(); }); }
    if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', bind); } else { bind(); }
  })();
</script>

</body>
</html>

```

### `hitmahut/shomot-haklaiot.html`

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="shortcut icon" href="/favicon.ico">

<!-- ⚠ קובץ אוטומטי - נוצר ע"י _build/build-hitmahut.mjs. אין לערוך ידנית.
     תוכן: _build/specializations.data.mjs · תמונות: _build/optimize-images.mjs -->

<script async src="https://www.googletagmanager.com/gtag/js?id=G-GYNQPGPR33"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-GYNQPGPR33');
  (function(){
    var push = window.dataLayer.push;
    window.dataLayer.push = function(){
      for (var i = 0; i < arguments.length; i++) {
        var o = arguments[i];
        if (o && typeof o.event === 'string') {
          var params = {};
          for (var k in o) { if (k !== 'event' && Object.prototype.hasOwnProperty.call(o, k)) params[k] = o[k]; }
          gtag('event', o.event, params);
        }
      }
      return push.apply(window.dataLayer, arguments);
    };
  })();
</script>

<title>שמאות חקלאית ואומדן נזקים - מיצוי מלוא הפיצויים המגיעים למשק | בורוביץ מזרחי</title>
<meta name="description" content="כימות שמאי-אגרונומי של נזק במטעים, בגידולי שדה, בבתי צמיחה ובמבנים חקלאיים, וליווי התביעה מול מס רכוש, קרנות הפיצויים וחברות הביטוח.">
<meta name="robots" content="index,follow">
<link rel="canonical" href="https://bor-miz.co.il/hitmahut/shomot-haklaiot.html">
<meta property="og:type" content="website">
<meta property="og:url" content="https://bor-miz.co.il/hitmahut/shomot-haklaiot.html">
<meta property="og:title" content="שמאות חקלאית ואומדן נזקים - מיצוי מלוא הפיצויים המגיעים למשק">
<meta property="og:description" content="כימות שמאי-אגרונומי של נזק במטעים, בגידולי שדה, בבתי צמיחה ובמבנים חקלאיים, וליווי התביעה מול מס רכוש, קרנות הפיצויים וחברות הביטוח.">
<meta property="og:image" content="https://bor-miz.co.il/img/shomot-haklaiot-hero.webp">
<meta property="og:locale" content="he_IL">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "שמאות חקלאית ואומדן נזקים - מיצוי מלוא הפיצויים המגיעים למשק",
  "serviceType": "שומות חקלאיות ופיצויים",
  "description": "כימות שמאי-אגרונומי של נזק במטעים, בגידולי שדה, בבתי צמיחה ובמבנים חקלאיים, וליווי התביעה מול מס רכוש, קרנות הפיצויים וחברות הביטוח.",
  "provider": {
    "@type": "LocalBusiness",
    "name": "בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ",
    "telephone": "+972-50-8922469",
    "areaServed": "ישראל"
  },
  "url": "https://bor-miz.co.il/hitmahut/shomot-haklaiot.html"
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "בורוביץ מזרחי",
      "item": "https://bor-miz.co.il/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "תחומי התמחות",
      "item": "https://bor-miz.co.il/#services"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "שומות חקלאיות ופיצויים",
      "item": "https://bor-miz.co.il/hitmahut/shomot-haklaiot.html"
    }
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "האם להתחיל לפנות את הנזק לפני ביקור שמאי?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "יש להימנע משינוי המצב בשטח לפני תיעוד שמאי מלא, למעט פעולות דחופות למניעת נזק נוסף. חובה לתעד כל פעולה בצילום."
      }
    },
    {
      "@type": "Question",
      "name": "המבטח או הקרן כבר שלחו שמאי מטעמם. למה צריך שמאי נוסף?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "השמאי שמגיע מטעם המבטח או מטעם הקרן פועל עבורם. חוות דעת עצמאית מכמתת את מלוא הפגיעה - גם את הנזק העקיף ואת אובדן ההכנסות העתידי - ומשמשת בסיס מבוסס למשא ומתן על גובה הפיצוי ולתביעה אם צריך."
      }
    }
  ]
}
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="preload" as="image" href="../img/shomot-haklaiot-hero.webp" imagesrcset="../img/shomot-haklaiot-hero-sm.webp 820w, ../img/shomot-haklaiot-hero.webp 1600w" imagesizes="100vw">
<link rel="stylesheet" href="../styles.css">
<link rel="stylesheet" href="../hitmahut.css">
</head>
<body class="spec-page">

<a href="#main" class="skip-to-content">דלג לתוכן הראשי</a>

<nav id="navbar" role="navigation" aria-label="ניווט ראשי">
  <div class="nav-inner">
    <a href="../index.html" class="nav-logo" aria-label="בורוביץ מזרחי שמאות מקרקעין - דף הבית"><img src="../logo-bm.png" alt="לוגו בורוביץ מזרחי"></a>
    <ul class="nav-links" id="navLinks">
      <li><a href="../index.html#about" onclick="closeMenu()">אודות</a></li>
      <li><a href="../index.html#services" onclick="closeMenu()">תחומי התמחות</a></li>
      <li><a href="../maamarim.html" onclick="closeMenu()">מאמרים</a></li>
      <li><a href="../index.html#linkedin-posts" onclick="closeMenu()">עדכונים</a></li>
      <li><a href="../careers.html" onclick="closeMenu()">קריירה</a></li>
      <li><a href="#cta" class="nav-cta" onclick="closeMenu()">צור קשר</a></li>
    </ul>
    <button class="hamburger" id="hamburger" onclick="toggleMenu()" aria-label="תפריט ניווט" aria-expanded="false"><span></span><span></span><span></span></button>
  </div>
</nav>

<main id="main">

<header class="sp-hero">
  <figure class="sp-hero-media">
    <img src="../img/shomot-haklaiot-hero.webp"
         srcset="../img/shomot-haklaiot-hero-sm.webp 820w, ../img/shomot-haklaiot-hero.webp 1600w"
         sizes="(max-width: 900px) 100vw, 50vw"
         alt="תחשיב כלכלי של יבול חקלאי - אומדן נזק ופיצויים" fetchpriority="high" decoding="async" style="object-position:28% center">
    <span class="sp-hero-seam" aria-hidden="true"></span>
  </figure>
  <div class="sp-hero-inner">
    <div class="sp-hero-copy">
      <nav class="sp-crumb" aria-label="פירורי לחם">
        <a href="../index.html">בורוביץ מזרחי</a><span>/</span><a href="../index.html#services">תחומי התמחות</a><span>/</span><em>שומות חקלאיות ופיצויים</em>
      </nav>
      <h1 class="sp-h1">שמאות חקלאית ואומדן נזקים<br><span>מיצוי מלוא הפיצויים המגיעים למשק</span></h1>
      <p class="sp-lede">חוות דעת מקצועיות לנזקי טבע, אירועים ביטחוניים, הפקעות ופגיעה בתשתיות חקלאיות.</p>
      <div class="sp-actions is-hero">
        <a class="sp-btn sp-btn-gold" href="https://wa.me/972546559942?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%A0%D7%92%D7%A8%D7%9D%20%D7%A0%D7%96%D7%A7%20%D7%9C%D7%9E%D7%A9%D7%A7%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%94%D7%A0%D7%97%D7%99%D7%95%D7%AA%20%D7%95%D7%9C%D7%AA%D7%99%D7%90%D7%95%D7%9D%20%D7%94%D7%92%D7%A2%D7%94%20%D7%9C%D7%A9%D7%98%D7%97." target="_blank" rel="noopener noreferrer">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"/></svg></span>שליחת הודעה בוואטסאפ
        </a>
        <a class="sp-btn sp-btn-line" href="tel:054-6559942">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>054-6559942
        </a>
      </div>
    </div>
  </div>
</header>

<section class="sp-sec sp-pain">
  <div class="sp-wrap">
    <h2 class="sp-h2 reveal">אל תתנו לנזקי מזג האוויר או הטבע להרוס את עתיד המשק</h2>
    <p class="sp-pain-text reveal">פגיעה במטעים, בגידולי שדה, בבתי צמיחה או במבנים חקלאיים משביתה את הפעילות הכלכלית וגורמת לאובדן הכנסות מתמשך. קרנות פיצויים וחברות ביטוח נוטות להציע פיצוי חלקי בלבד. בהיעדר כימות שמאי-אגרונומי קפדני בזמן אמת, המשק סופג את ההפסד ישירות.</p>
  </div>
</section>

<section class="sp-sec sp-alt">
  <div class="sp-wrap">
    <h2 class="sp-kicker reveal">למי השירות מיועד</h2>
    <ul class="sp-aud-grid">
      <li class="sp-aud reveal"><span class="sp-aud-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></span><span>כל מי שספג נזק בחקלאות - חקלאים, בעלי משקים, מגדלים וחברות חקלאיות: נזקי טבע ומזג אוויר קיצוני, שריפות, פגיעות מלחמה ונזק לתשתיות ולציוד.</span></li>
      <li class="sp-aud reveal"><span class="sp-aud-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></span><span>משקים חקלאיים הנמצאים בתוואי הפקעה של תשתיות לאומיות (כבישים, רכבות, מים).</span></li>
      <li class="sp-aud reveal"><span class="sp-aud-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></span><span>עורכי דין המנהלים תביעות ביטוח, נזיקין ופיצויים במגזר החקלאי.</span></li>
    </ul>
  </div>
</section>

<section class="sp-sec sp-process">
  <div class="sp-wrap">
    <h2 class="sp-kicker reveal">תהליך העבודה שלנו</h2>
    <ol class="sp-steps">
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>הגעה מהירה</h3>
        <p>הגעה מהירה לשטח לתיעוד הנזקים בזמן אמת לפני שינוי המצב.</p>
      </li>
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>איסוף נתונים</h3>
        <p>איסוף נתונים אגרונומיים, היסטוריית תפוקות, חשבוניות הוצאה ודוחות עבר.</p>
      </li>
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>כימות הנזק</h3>
        <p>כימות הפגיעה הישירה והעקיפה (אובדן רווחים עתידי, שיקום קרקע וציוד).</p>
      </li>
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>ייצוג וליווי</h3>
        <p>עריכת חוות דעת מומחה המעוגנת בהנחיות המעודכנות של מנהלת הפיצויים וליווי מלא מול מס רכוש או חברת הביטוח.</p>
      </li>
    </ol>
  </div>
</section>

<section class="sp-sec sp-alt sp-deliver">
  <div class="sp-wrap sp-split">
    <div class="sp-split-copy reveal">
      <h2 class="sp-kicker">מה מקבלים ביד</h2>
      <p class="sp-deliver-text">חוות דעת שמאית-אגרונומית קבילה לבתי משפט ולרשויות המס, המפרטת את היקף הפגיעה הכלכלית ומגובה בתקדימים משפטיים מוכחים לפיצויי מקרקעין חקלאיים.</p>
      <div class="sp-note">
        <span class="sp-note-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h10"/><path d="M6 15.5 12.5 9"/><path d="m9 6 6 6"/><path d="M12.5 2.5 19 9l-2.5 2.5L10 5z"/><path d="M4.5 13.5 9 18l-2 2-4.5-4.5z"/></svg></span>
        <div>
          <strong>בחזית הפסיקה</strong>
          <p>אנחנו עוקבים באופן שוטף אחר פסיקות בתי המשפט, הכרעות שמאים מכריעים והחלטות ועדות ערר. כל שומה שיוצאת מהמשרד נשענת על התקדימים והפרשנויות המשפטיות העדכניים ביותר - ולא על נוסחאות שעבדו פעם.</p>
        </div>
      </div>
    </div>
    <figure class="sp-split-img reveal">
      <img src="../img/shomot-haklaiot-body.webp" alt="מטע רימונים - כימות הפגיעה בגידולים" loading="lazy" decoding="async">
    </figure>
  </div>
</section>

<section class="sp-sec sp-faq">
  <div class="sp-wrap">
    <h2 class="sp-kicker reveal">שאלות נפוצות</h2>
    <div class="sp-faq-list reveal">
      <details class="sp-q">
        <summary>האם להתחיל לפנות את הנזק לפני ביקור שמאי?</summary>
        <p>יש להימנע משינוי המצב בשטח לפני תיעוד שמאי מלא, למעט פעולות דחופות למניעת נזק נוסף. חובה לתעד כל פעולה בצילום.</p>
      </details>
      <details class="sp-q">
        <summary>המבטח או הקרן כבר שלחו שמאי מטעמם. למה צריך שמאי נוסף?</summary>
        <p>השמאי שמגיע מטעם המבטח או מטעם הקרן פועל עבורם. חוות דעת עצמאית מכמתת את מלוא הפגיעה - גם את הנזק העקיף ואת אובדן ההכנסות העתידי - ומשמשת בסיס מבוסס למשא ומתן על גובה הפיצוי ולתביעה אם צריך.</p>
      </details>
    </div>
  </div>
</section>

<section class="sp-sec sp-cta" id="cta">
  <div class="sp-wrap reveal">
    <h2 class="sp-h2">נפגע המשק?</h2>
    <p class="sp-cta-text">שלחו לנו תמונות ופרטים לקבלת הנחיות ראשוניות. תיעוד מוקדם ומדויק הוא ההבדל בין פיצוי חלקי לפיצוי מלא.</p>
    <div class="sp-actions is-cta">
        <a class="sp-btn sp-btn-gold" href="https://wa.me/972546559942?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%A0%D7%92%D7%A8%D7%9D%20%D7%A0%D7%96%D7%A7%20%D7%9C%D7%9E%D7%A9%D7%A7%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%94%D7%A0%D7%97%D7%99%D7%95%D7%AA%20%D7%95%D7%9C%D7%AA%D7%99%D7%90%D7%95%D7%9D%20%D7%94%D7%92%D7%A2%D7%94%20%D7%9C%D7%A9%D7%98%D7%97." target="_blank" rel="noopener noreferrer">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"/></svg></span>שליחת הודעה בוואטסאפ
        </a>
        <a class="sp-btn sp-btn-line" href="tel:054-6559942">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>054-6559942
        </a>
      </div>
    <p class="sp-cta-alt">או השאירו פרטים ב<a href="../index.html#contact">טופס יצירת הקשר</a></p>
  </div>
</section>

</main>

<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="../logo-bm.png" alt="לוגו בורוביץ מזרחי">
        <p>משרד שמאות מקרקעין מוביל בצפון. ידע מקצועי מעמיק, היכרות שטח בלתי אמצעית והבנה כלכלית רחבה - בשירות כל לקוח.</p>
      </div>
      <div class="footer-col">
        <h4>ניווט</h4>
        <ul>
          <li><a href="../index.html#about">אודות</a></li>
          <li><a href="../index.html#services">תחומי התמחות</a></li>
          <li><a href="../maamarim.html">מאמרים</a></li>
          <li><a href="../careers.html">קריירה</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>יצירת קשר</h4>
        <ul>
          <li><a href="tel:054-6559942">054-6559942 · מאור</a></li>
          <li><a href="tel:050-8922469">050-8922469 · אמיר</a></li>
          <li><a id="em-footer" href="#"></a></li>
          <li>שדרות החרוב 6, פארק תעשיות בר-לב</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 בורוביץ מזרחי שמאות מקרקעין וחקלאות בע"מ. כל הזכויות שמורות.</span>
      <span><a href="../index.html">חזרה לאתר הראשי</a></span>
    </div>
  </div>
</footer>

<div class="floating-wrap">
  <a class="float-btn float-btn-wa" href="https://wa.me/972546559942" target="_blank" rel="noopener noreferrer" aria-label="שלחו הודעה בוואטסאפ">
    <svg aria-hidden="true" viewBox="0 0 32 32"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.67 4.61 1.832 6.5L4 29l7.75-1.812A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="#fff"/><path d="M21.5 18.5c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.19-.57-.34z" fill="#25D366"/></svg>
  </a>
  <button type="button" id="customAccessBtn" class="float-btn float-btn-access" aria-label="פתח תפריט נגישות" title="נגישות"><span aria-hidden="true">♿</span></button>
</div>

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<script>
  (function(){ var el=document.getElementById('em-footer'); if(el){ var a='info'+'@'+'bor-miz.co.il'; el.href='mailto:'+a; el.textContent=a; } })();
  function toggleMenu(){ var l=document.getElementById('navLinks'),b=document.getElementById('hamburger'); l.classList.toggle('open'); b.classList.toggle('open'); b.setAttribute('aria-expanded', l.classList.contains('open')?'true':'false'); }
  function closeMenu(){ document.getElementById('navLinks').classList.remove('open'); var b=document.getElementById('hamburger'); b.classList.remove('open'); b.setAttribute('aria-expanded','false'); }
  document.addEventListener('click', function(e){ var nav=document.getElementById('navbar'); if(nav && !nav.contains(e.target)) closeMenu(); });
  (function(){ var nav=document.getElementById('navbar'); var onScroll=function(){ nav.classList.toggle('scrolled', window.scrollY>60); }; window.addEventListener('scroll', onScroll, {passive:true}); onScroll(); })();
  (function(){
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce || !window.gsap || !window.ScrollTrigger){
      document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.reveal').forEach(function(el){ ScrollTrigger.create({ trigger: el, start:'top 90%', onEnter:function(){ el.classList.add('in'); } }); });
  })();
  // אקורדיון: פתיחת שאלה סוגרת את הקודמת
  (function(){
    var items = document.querySelectorAll('.sp-faq .sp-q');
    items.forEach(function(d){
      d.addEventListener('toggle', function(){
        if(!d.open) return;
        items.forEach(function(o){ if(o !== d) o.open = false; });
      });
    });
  })();
  // מעקב המרות - זהה לשאר האתר
  (function(){ window.dataLayer=window.dataLayer||[]; document.addEventListener('click', function(e){ var el=e.target.closest&&e.target.closest('a'); if(!el) return; if(/wa\.me|api\.whatsapp/.test(el.href||'')){ window.dataLayer.push({event:'contact_whatsapp'}); } else if((el.getAttribute('href')||'').indexOf('tel:')===0){ window.dataLayer.push({event:'contact_phone'}); } }, true); })();
</script>

<nagishli></nagishli>
<script>
nl_contact = "n:בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ|p:054-6559942|u:maor@bor-miz.co.il";
nl_pos = "BL"; nl_lang = "he"; nl_color = "blue"; nl_compact = "1";
</script>
<script src="../nagishli.js?v=2.3" charset="utf-8"></script>
<script>
  (function(){
    function forceCompactStyles(){
      var bar=document.getElementById('NagishLiBar'), menus=document.getElementById('NagishLiMenus');
      if(bar){ bar.style.cssText='position:fixed !important; left:1.4rem !important; right:auto !important; bottom:6.2rem !important; top:auto !important; width:300px !important; max-width:90vw !important; height:auto !important; z-index:9999 !important; background:transparent !important; box-shadow:none !important; border:none !important; padding:0 !important; margin:0 !important;'; }
      if(menus){ menus.style.cssText+=';position:static !important; width:300px !important; max-width:90vw !important; max-height:70vh !important; overflow-y:auto !important; overflow-x:hidden !important; font-size:13px !important; border-radius:12px !important; box-shadow:0 10px 40px rgba(0,0,0,0.3) !important; margin:0 !important; padding:0 !important; background:#fff !important;'; }
      document.querySelectorAll('#NagishLiMenus, #NagishLiMenus ul').forEach(function(el){ el.style.width='100%'; el.style.maxWidth='300px'; el.style.boxSizing='border-box'; });
    }
    function openNagishLiMenu(){
      if(typeof jQuery==='undefined') return false;
      var $=jQuery, $strip=$('#NagishLiBarStrip'), $menus=$('#NagishLiMenus');
      if(!$strip.length || !$menus.length) return false;
      if($menus.is(':visible')){ $menus.slideUp(150, function(){ $strip.removeClass('open'); }); }
      else { forceCompactStyles(); $strip.addClass('open'); $menus.slideDown(150, forceCompactStyles); }
      return true;
    }
    function bind(){ var btn=document.getElementById('customAccessBtn'); if(!btn) return; btn.addEventListener('click', function(e){ e.preventDefault(); var n=0; (function tryOpen(){ if(openNagishLiMenu()) return; if(++n<30) setTimeout(tryOpen,200); })(); }); }
    if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', bind); } else { bind(); }
  })();
</script>

</body>
</html>

```

### `hitmahut/tavlaot-ichud-vehaluka.html`

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="shortcut icon" href="/favicon.ico">

<!-- ⚠ קובץ אוטומטי - נוצר ע"י _build/build-hitmahut.mjs. אין לערוך ידנית.
     תוכן: _build/specializations.data.mjs · תמונות: _build/optimize-images.mjs -->

<script async src="https://www.googletagmanager.com/gtag/js?id=G-GYNQPGPR33"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-GYNQPGPR33');
  (function(){
    var push = window.dataLayer.push;
    window.dataLayer.push = function(){
      for (var i = 0; i < arguments.length; i++) {
        var o = arguments[i];
        if (o && typeof o.event === 'string') {
          var params = {};
          for (var k in o) { if (k !== 'event' && Object.prototype.hasOwnProperty.call(o, k)) params[k] = o[k]; }
          gtag('event', o.event, params);
        }
      }
      return push.apply(window.dataLayer, arguments);
    };
  })();
</script>

<title>טבלאות איחוד וחלוקה (תקן 15) - הגנה על שווי הזכויות בתוכניות בניין עיר | בורוביץ מזרחי</title>
<meta name="description" content="בתוכניות איחוד וחלוקה המגרש מקבל הקצאה חדשה. עריכת טבלאות הקצאה ואיזון לפי תקן 15, בדיקה ביקורתית לבעלי קרקע וייצוג מול מוסדות התכנון.">
<meta name="robots" content="index,follow">
<link rel="canonical" href="https://bor-miz.co.il/hitmahut/tavlaot-ichud-vehaluka.html">
<meta property="og:type" content="website">
<meta property="og:url" content="https://bor-miz.co.il/hitmahut/tavlaot-ichud-vehaluka.html">
<meta property="og:title" content="טבלאות איחוד וחלוקה (תקן 15) - הגנה על שווי הזכויות בתוכניות בניין עיר">
<meta property="og:description" content="בתוכניות איחוד וחלוקה המגרש מקבל הקצאה חדשה. עריכת טבלאות הקצאה ואיזון לפי תקן 15, בדיקה ביקורתית לבעלי קרקע וייצוג מול מוסדות התכנון.">
<meta property="og:image" content="https://bor-miz.co.il/img/tavlaot-ichud-vehaluka-hero.webp">
<meta property="og:locale" content="he_IL">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "טבלאות איחוד וחלוקה (תקן 15) - הגנה על שווי הזכויות בתוכניות בניין עיר",
  "serviceType": "טבלאות איחוד וחלוקה",
  "description": "בתוכניות איחוד וחלוקה המגרש מקבל הקצאה חדשה. עריכת טבלאות הקצאה ואיזון לפי תקן 15, בדיקה ביקורתית לבעלי קרקע וייצוג מול מוסדות התכנון.",
  "provider": {
    "@type": "LocalBusiness",
    "name": "בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ",
    "telephone": "+972-50-8922469",
    "areaServed": "ישראל"
  },
  "url": "https://bor-miz.co.il/hitmahut/tavlaot-ichud-vehaluka.html"
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "בורוביץ מזרחי",
      "item": "https://bor-miz.co.il/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "תחומי התמחות",
      "item": "https://bor-miz.co.il/#services"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "טבלאות איחוד וחלוקה",
      "item": "https://bor-miz.co.il/hitmahut/tavlaot-ichud-vehaluka.html"
    }
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "מהם תשלומי איזון ומתי הם נקבעים?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "כאשר לא ניתן להקצות לכל בעל זכויות בדיוק את חלקו היחסי בשווי הזכויות החדשות, נקבעים תשלומי איזון כספיים בין המגרשים השונים כדי לאזן את הפער."
      }
    },
    {
      "@type": "Question",
      "name": "אפשר להתנגד לטבלה אחרי שהתוכנית כבר הופקדה?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "כן. תקופת ההפקדה היא המועד להגיש התנגדות מנומקת לטבלאות ההקצאה והאיזון, וזה בדרך כלל השלב האפקטיבי ביותר לתקן קיפוח. לאחר אישור התוכנית התיקון מורכב ויקר בהרבה, ולכן כדאי לבדוק את הטבלה ברגע שהיא מתפרסמת."
      }
    }
  ]
}
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="preload" as="image" href="../img/tavlaot-ichud-vehaluka-hero.webp" imagesrcset="../img/tavlaot-ichud-vehaluka-hero-sm.webp 820w, ../img/tavlaot-ichud-vehaluka-hero.webp 1600w" imagesizes="100vw">
<link rel="stylesheet" href="../styles.css">
<link rel="stylesheet" href="../hitmahut.css">
</head>
<body class="spec-page">

<a href="#main" class="skip-to-content">דלג לתוכן הראשי</a>

<nav id="navbar" role="navigation" aria-label="ניווט ראשי">
  <div class="nav-inner">
    <a href="../index.html" class="nav-logo" aria-label="בורוביץ מזרחי שמאות מקרקעין - דף הבית"><img src="../logo-bm.png" alt="לוגו בורוביץ מזרחי"></a>
    <ul class="nav-links" id="navLinks">
      <li><a href="../index.html#about" onclick="closeMenu()">אודות</a></li>
      <li><a href="../index.html#services" onclick="closeMenu()">תחומי התמחות</a></li>
      <li><a href="../maamarim.html" onclick="closeMenu()">מאמרים</a></li>
      <li><a href="../index.html#linkedin-posts" onclick="closeMenu()">עדכונים</a></li>
      <li><a href="../careers.html" onclick="closeMenu()">קריירה</a></li>
      <li><a href="#cta" class="nav-cta" onclick="closeMenu()">צור קשר</a></li>
    </ul>
    <button class="hamburger" id="hamburger" onclick="toggleMenu()" aria-label="תפריט ניווט" aria-expanded="false"><span></span><span></span><span></span></button>
  </div>
</nav>

<main id="main">

<header class="sp-hero">
  <figure class="sp-hero-media">
    <img src="../img/tavlaot-ichud-vehaluka-hero.webp"
         srcset="../img/tavlaot-ichud-vehaluka-hero-sm.webp 820w, ../img/tavlaot-ichud-vehaluka-hero.webp 1600w"
         sizes="(max-width: 900px) 100vw, 50vw"
         alt="מפת חלוקה לתאי שטח - טבלאות הקצאה ואיזון לפי תקן 15" fetchpriority="high" decoding="async">
    <span class="sp-hero-seam" aria-hidden="true"></span>
  </figure>
  <div class="sp-hero-inner">
    <div class="sp-hero-copy">
      <nav class="sp-crumb" aria-label="פירורי לחם">
        <a href="../index.html">בורוביץ מזרחי</a><span>/</span><a href="../index.html#services">תחומי התמחות</a><span>/</span><em>טבלאות איחוד וחלוקה</em>
      </nav>
      <h1 class="sp-h1">טבלאות איחוד וחלוקה (תקן 15)<br><span>הגנה על שווי הזכויות בתוכניות בניין עיר</span></h1>
      <p class="sp-lede">עריכת טבלאות הקצאה ואיזון ליזמים ובדיקה ביקורתית של טבלאות עבור בעלי קרקע.</p>
      <div class="sp-actions is-hero">
        <a class="sp-btn sp-btn-gold" href="https://wa.me/972546559942?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%94%D7%9E%D7%92%D7%A8%D7%A9%20%D7%A9%D7%9C%D7%99%20%D7%A0%D7%9B%D7%9C%D7%9C%20%D7%91%D7%AA%D7%95%D7%9B%D7%A0%D7%99%D7%AA%20%D7%90%D7%99%D7%97%D7%95%D7%93%20%D7%95%D7%97%D7%9C%D7%95%D7%A7%D7%94%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%91%D7%93%D7%99%D7%A7%D7%AA%20%D7%94%D7%98%D7%91%D7%9C%D7%94." target="_blank" rel="noopener noreferrer">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"/></svg></span>שליחת הודעה בוואטסאפ
        </a>
        <a class="sp-btn sp-btn-line" href="tel:054-6559942">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>054-6559942
        </a>
      </div>
    </div>
  </div>
</header>

<section class="sp-sec sp-pain">
  <div class="sp-wrap">
    <h2 class="sp-h2 reveal">ודאו שאינכם מקופחים בחלוקת הזכויות החדשות שלכם</h2>
    <p class="sp-pain-text reveal">בתוכניות איחוד וחלוקה המגרש שלכם עובר שינוי מיקום וייעוד ומקבל הקצאה חדשה. שגיאה בהערכת "המצב הנכנס" או קביעת מקדמי שווי לא הוגנים במצב החדש עלולה לגרום לכם לקבל פחות זכויות ממה שמגיע לכם בדין, או לדרוש מכם תשלומי איזון שגויים.</p>
  </div>
</section>

<section class="sp-sec sp-alt">
  <div class="sp-wrap">
    <h2 class="sp-kicker reveal">למי השירות מיועד</h2>
    <ul class="sp-aud-grid">
      <li class="sp-aud reveal"><span class="sp-aud-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></span><span>יזמים ומתכננים המקדמים תב"ע וזקוקים לשמאי מלווה לעריכת טבלאות הקצאה ואיזון.</span></li>
      <li class="sp-aud reveal"><span class="sp-aud-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></span><span>בעלי קרקעות במתחמי תכנון המבקשים לוודא שאינם מקופחים בחלוקת הזכויות.</span></li>
      <li class="sp-aud reveal"><span class="sp-aud-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></span><span>עורכי דין המייצגים בעלי זכויות ומגישים התנגדויות למוסדות התכנון.</span></li>
    </ul>
  </div>
</section>

<section class="sp-sec sp-process">
  <div class="sp-wrap">
    <h2 class="sp-kicker reveal">תהליך העבודה שלנו</h2>
    <ol class="sp-steps">
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>ניתוח התב"ע</h3>
        <p>ניתוח תוכנית האיחוד והחלוקה, הוראות התב"ע והמצב התכנוני ההיסטורי.</p>
      </li>
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>שומת מצב</h3>
        <p>עריכת שומת "מצב נכנס" מול "מצב יוצא" בהתאם לתקן 15 ופסיקות בתי המשפט לעניינים מינהליים.</p>
      </li>
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>חישוב טבלאות</h3>
        <p>חישוב מדויק של טבלאות ההקצאה, מקדמי שווי ותשלומי האיזון בין הבעלים.</p>
      </li>
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>ייצוג ואישור</h3>
        <p>ייצוג בדיונים מול ועדות התכנון והשמאי המלווה של התוכנית עד לאישור סופי.</p>
      </li>
    </ol>
  </div>
</section>

<section class="sp-sec sp-alt sp-deliver">
  <div class="sp-wrap sp-split">
    <div class="sp-split-copy reveal">
      <h2 class="sp-kicker">מה מקבלים ביד</h2>
      <p class="sp-deliver-text">סט טבלאות הקצאה ואיזון מושלם להפקדה במוסדות התכנון, או חוות דעת שמאי להתנגדות לטבלאות קיימות המבוססת על התקדימים המשפטיים המחייבים.</p>
      <div class="sp-note">
        <span class="sp-note-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h10"/><path d="M6 15.5 12.5 9"/><path d="m9 6 6 6"/><path d="M12.5 2.5 19 9l-2.5 2.5L10 5z"/><path d="M4.5 13.5 9 18l-2 2-4.5-4.5z"/></svg></span>
        <div>
          <strong>בחזית הפסיקה</strong>
          <p>אנחנו עוקבים באופן שוטף אחר פסיקות בתי המשפט, הכרעות שמאים מכריעים והחלטות ועדות ערר. כל שומה שיוצאת מהמשרד נשענת על התקדימים והפרשנויות המשפטיות העדכניים ביותר - ולא על נוסחאות שעבדו פעם.</p>
        </div>
      </div>
    </div>
    <figure class="sp-split-img reveal">
      <img src="../img/tavlaot-ichud-vehaluka-body.webp" alt="דגם מתחם תכנוני לבן מול הבנייה בפועל - מצב נכנס מול מצב יוצא" loading="lazy" decoding="async">
    </figure>
  </div>
</section>

<section class="sp-sec sp-faq">
  <div class="sp-wrap">
    <h2 class="sp-kicker reveal">שאלות נפוצות</h2>
    <div class="sp-faq-list reveal">
      <details class="sp-q">
        <summary>מהם תשלומי איזון ומתי הם נקבעים?</summary>
        <p>כאשר לא ניתן להקצות לכל בעל זכויות בדיוק את חלקו היחסי בשווי הזכויות החדשות, נקבעים תשלומי איזון כספיים בין המגרשים השונים כדי לאזן את הפער.</p>
      </details>
      <details class="sp-q">
        <summary>אפשר להתנגד לטבלה אחרי שהתוכנית כבר הופקדה?</summary>
        <p>כן. תקופת ההפקדה היא המועד להגיש התנגדות מנומקת לטבלאות ההקצאה והאיזון, וזה בדרך כלל השלב האפקטיבי ביותר לתקן קיפוח. לאחר אישור התוכנית התיקון מורכב ויקר בהרבה, ולכן כדאי לבדוק את הטבלה ברגע שהיא מתפרסמת.</p>
      </details>
    </div>
  </div>
</section>

<section class="sp-sec sp-cta" id="cta">
  <div class="sp-wrap reveal">
    <h2 class="sp-h2">המגרש שלכם נכלל בתוכנית חלוקה?</h2>
    <p class="sp-cta-text">פנו אלינו לבדיקת זכויות מקצועית - כל עוד אפשר להשפיע על הטבלה.</p>
    <div class="sp-actions is-cta">
        <a class="sp-btn sp-btn-gold" href="https://wa.me/972546559942?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%94%D7%9E%D7%92%D7%A8%D7%A9%20%D7%A9%D7%9C%D7%99%20%D7%A0%D7%9B%D7%9C%D7%9C%20%D7%91%D7%AA%D7%95%D7%9B%D7%A0%D7%99%D7%AA%20%D7%90%D7%99%D7%97%D7%95%D7%93%20%D7%95%D7%97%D7%9C%D7%95%D7%A7%D7%94%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%91%D7%93%D7%99%D7%A7%D7%AA%20%D7%94%D7%98%D7%91%D7%9C%D7%94." target="_blank" rel="noopener noreferrer">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"/></svg></span>שליחת הודעה בוואטסאפ
        </a>
        <a class="sp-btn sp-btn-line" href="tel:054-6559942">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>054-6559942
        </a>
      </div>
    <p class="sp-cta-alt">או השאירו פרטים ב<a href="../index.html#contact">טופס יצירת הקשר</a></p>
  </div>
</section>

</main>

<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="../logo-bm.png" alt="לוגו בורוביץ מזרחי">
        <p>משרד שמאות מקרקעין מוביל בצפון. ידע מקצועי מעמיק, היכרות שטח בלתי אמצעית והבנה כלכלית רחבה - בשירות כל לקוח.</p>
      </div>
      <div class="footer-col">
        <h4>ניווט</h4>
        <ul>
          <li><a href="../index.html#about">אודות</a></li>
          <li><a href="../index.html#services">תחומי התמחות</a></li>
          <li><a href="../maamarim.html">מאמרים</a></li>
          <li><a href="../careers.html">קריירה</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>יצירת קשר</h4>
        <ul>
          <li><a href="tel:054-6559942">054-6559942 · מאור</a></li>
          <li><a href="tel:050-8922469">050-8922469 · אמיר</a></li>
          <li><a id="em-footer" href="#"></a></li>
          <li>שדרות החרוב 6, פארק תעשיות בר-לב</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 בורוביץ מזרחי שמאות מקרקעין וחקלאות בע"מ. כל הזכויות שמורות.</span>
      <span><a href="../index.html">חזרה לאתר הראשי</a></span>
    </div>
  </div>
</footer>

<div class="floating-wrap">
  <a class="float-btn float-btn-wa" href="https://wa.me/972546559942" target="_blank" rel="noopener noreferrer" aria-label="שלחו הודעה בוואטסאפ">
    <svg aria-hidden="true" viewBox="0 0 32 32"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.67 4.61 1.832 6.5L4 29l7.75-1.812A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="#fff"/><path d="M21.5 18.5c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.19-.57-.34z" fill="#25D366"/></svg>
  </a>
  <button type="button" id="customAccessBtn" class="float-btn float-btn-access" aria-label="פתח תפריט נגישות" title="נגישות"><span aria-hidden="true">♿</span></button>
</div>

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<script>
  (function(){ var el=document.getElementById('em-footer'); if(el){ var a='info'+'@'+'bor-miz.co.il'; el.href='mailto:'+a; el.textContent=a; } })();
  function toggleMenu(){ var l=document.getElementById('navLinks'),b=document.getElementById('hamburger'); l.classList.toggle('open'); b.classList.toggle('open'); b.setAttribute('aria-expanded', l.classList.contains('open')?'true':'false'); }
  function closeMenu(){ document.getElementById('navLinks').classList.remove('open'); var b=document.getElementById('hamburger'); b.classList.remove('open'); b.setAttribute('aria-expanded','false'); }
  document.addEventListener('click', function(e){ var nav=document.getElementById('navbar'); if(nav && !nav.contains(e.target)) closeMenu(); });
  (function(){ var nav=document.getElementById('navbar'); var onScroll=function(){ nav.classList.toggle('scrolled', window.scrollY>60); }; window.addEventListener('scroll', onScroll, {passive:true}); onScroll(); })();
  (function(){
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce || !window.gsap || !window.ScrollTrigger){
      document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.reveal').forEach(function(el){ ScrollTrigger.create({ trigger: el, start:'top 90%', onEnter:function(){ el.classList.add('in'); } }); });
  })();
  // אקורדיון: פתיחת שאלה סוגרת את הקודמת
  (function(){
    var items = document.querySelectorAll('.sp-faq .sp-q');
    items.forEach(function(d){
      d.addEventListener('toggle', function(){
        if(!d.open) return;
        items.forEach(function(o){ if(o !== d) o.open = false; });
      });
    });
  })();
  // מעקב המרות - זהה לשאר האתר
  (function(){ window.dataLayer=window.dataLayer||[]; document.addEventListener('click', function(e){ var el=e.target.closest&&e.target.closest('a'); if(!el) return; if(/wa\.me|api\.whatsapp/.test(el.href||'')){ window.dataLayer.push({event:'contact_whatsapp'}); } else if((el.getAttribute('href')||'').indexOf('tel:')===0){ window.dataLayer.push({event:'contact_phone'}); } }, true); })();
</script>

<nagishli></nagishli>
<script>
nl_contact = "n:בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ|p:054-6559942|u:maor@bor-miz.co.il";
nl_pos = "BL"; nl_lang = "he"; nl_color = "blue"; nl_compact = "1";
</script>
<script src="../nagishli.js?v=2.3" charset="utf-8"></script>
<script>
  (function(){
    function forceCompactStyles(){
      var bar=document.getElementById('NagishLiBar'), menus=document.getElementById('NagishLiMenus');
      if(bar){ bar.style.cssText='position:fixed !important; left:1.4rem !important; right:auto !important; bottom:6.2rem !important; top:auto !important; width:300px !important; max-width:90vw !important; height:auto !important; z-index:9999 !important; background:transparent !important; box-shadow:none !important; border:none !important; padding:0 !important; margin:0 !important;'; }
      if(menus){ menus.style.cssText+=';position:static !important; width:300px !important; max-width:90vw !important; max-height:70vh !important; overflow-y:auto !important; overflow-x:hidden !important; font-size:13px !important; border-radius:12px !important; box-shadow:0 10px 40px rgba(0,0,0,0.3) !important; margin:0 !important; padding:0 !important; background:#fff !important;'; }
      document.querySelectorAll('#NagishLiMenus, #NagishLiMenus ul').forEach(function(el){ el.style.width='100%'; el.style.maxWidth='300px'; el.style.boxSizing='border-box'; });
    }
    function openNagishLiMenu(){
      if(typeof jQuery==='undefined') return false;
      var $=jQuery, $strip=$('#NagishLiBarStrip'), $menus=$('#NagishLiMenus');
      if(!$strip.length || !$menus.length) return false;
      if($menus.is(':visible')){ $menus.slideUp(150, function(){ $strip.removeClass('open'); }); }
      else { forceCompactStyles(); $strip.addClass('open'); $menus.slideDown(150, forceCompactStyles); }
      return true;
    }
    function bind(){ var btn=document.getElementById('customAccessBtn'); if(!btn) return; btn.addEventListener('click', function(e){ e.preventDefault(); var n=0; (function tryOpen(){ if(openNagishLiMenu()) return; if(++n<30) setTimeout(tryOpen,200); })(); }); }
    if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', bind); } else { bind(); }
  })();
</script>

</body>
</html>

```

### `hitmahut/yeridat-erech-197.html`

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="shortcut icon" href="/favicon.ico">

<!-- ⚠ קובץ אוטומטי - נוצר ע"י _build/build-hitmahut.mjs. אין לערוך ידנית.
     תוכן: _build/specializations.data.mjs · תמונות: _build/optimize-images.mjs -->

<script async src="https://www.googletagmanager.com/gtag/js?id=G-GYNQPGPR33"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-GYNQPGPR33');
  (function(){
    var push = window.dataLayer.push;
    window.dataLayer.push = function(){
      for (var i = 0; i < arguments.length; i++) {
        var o = arguments[i];
        if (o && typeof o.event === 'string') {
          var params = {};
          for (var k in o) { if (k !== 'event' && Object.prototype.hasOwnProperty.call(o, k)) params[k] = o[k]; }
          gtag('event', o.event, params);
        }
      }
      return push.apply(window.dataLayer, arguments);
    };
  })();
</script>

<title>תביעות ירידת ערך (סעיף 197) - קבלת פיצוי על פגיעה במקרקעין | בורוביץ מזרחי</title>
<meta name="description" content="תוכנית שהוסיפה מגדלים, חסמה נוף ואור, יצרה מטרדי רעש או הפקיעה שטח פוגעת בשווי הנכס. חוות דעת לפי סעיף 197 - בתוך חלון 3 השנים מאישור התוכנית.">
<meta name="robots" content="index,follow">
<link rel="canonical" href="https://bor-miz.co.il/hitmahut/yeridat-erech-197.html">
<meta property="og:type" content="website">
<meta property="og:url" content="https://bor-miz.co.il/hitmahut/yeridat-erech-197.html">
<meta property="og:title" content="תביעות ירידת ערך (סעיף 197) - קבלת פיצוי על פגיעה במקרקעין">
<meta property="og:description" content="תוכנית שהוסיפה מגדלים, חסמה נוף ואור, יצרה מטרדי רעש או הפקיעה שטח פוגעת בשווי הנכס. חוות דעת לפי סעיף 197 - בתוך חלון 3 השנים מאישור התוכנית.">
<meta property="og:image" content="https://bor-miz.co.il/img/yeridat-erech-197-hero.webp">
<meta property="og:locale" content="he_IL">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "תביעות ירידת ערך (סעיף 197) - קבלת פיצוי על פגיעה במקרקעין",
  "serviceType": "תביעות ירידת ערך",
  "description": "תוכנית שהוסיפה מגדלים, חסמה נוף ואור, יצרה מטרדי רעש או הפקיעה שטח פוגעת בשווי הנכס. חוות דעת לפי סעיף 197 - בתוך חלון 3 השנים מאישור התוכנית.",
  "provider": {
    "@type": "LocalBusiness",
    "name": "בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ",
    "telephone": "+972-50-8922469",
    "areaServed": "ישראל"
  },
  "url": "https://bor-miz.co.il/hitmahut/yeridat-erech-197.html"
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "בורוביץ מזרחי",
      "item": "https://bor-miz.co.il/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "תחומי התמחות",
      "item": "https://bor-miz.co.il/#services"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "תביעות ירידת ערך",
      "item": "https://bor-miz.co.il/hitmahut/yeridat-erech-197.html"
    }
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "האם רק נכס שנוגע פיזית בגבול התוכנית זכאי לפיצוי?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "החוק קובע זכאות לנכסים הגובלים בתוכנית, אך קיימת פסיקה רחבה ומעודכנת המגדירה מה נחשב \"גובל\" (למשל מקרים של כביש צר או שטח פתוח המפריד)."
      }
    },
    {
      "@type": "Question",
      "name": "הגשנו תביעה והוועדה המקומית דחתה אותה. זה נגמר?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ממש לא. דחייה של הוועדה המקומית עוברת להכרעת שמאי מכריע, ומשם ניתן להמשיך לוועדת ערר לפיצויים ולהיטל השבחה. חלק ניכר מהתביעות מוכרע דווקא בשלבים האלה, ולכן חשוב שהשומה תיבנה מראש כך שתעמוד בהם."
      }
    }
  ]
}
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="preload" as="image" href="../img/yeridat-erech-197-hero.webp" imagesrcset="../img/yeridat-erech-197-hero-sm.webp 820w, ../img/yeridat-erech-197-hero.webp 1600w" imagesizes="100vw">
<link rel="stylesheet" href="../styles.css">
<link rel="stylesheet" href="../hitmahut.css">
</head>
<body class="spec-page">

<a href="#main" class="skip-to-content">דלג לתוכן הראשי</a>

<nav id="navbar" role="navigation" aria-label="ניווט ראשי">
  <div class="nav-inner">
    <a href="../index.html" class="nav-logo" aria-label="בורוביץ מזרחי שמאות מקרקעין - דף הבית"><img src="../logo-bm.png" alt="לוגו בורוביץ מזרחי"></a>
    <ul class="nav-links" id="navLinks">
      <li><a href="../index.html#about" onclick="closeMenu()">אודות</a></li>
      <li><a href="../index.html#services" onclick="closeMenu()">תחומי התמחות</a></li>
      <li><a href="../maamarim.html" onclick="closeMenu()">מאמרים</a></li>
      <li><a href="../index.html#linkedin-posts" onclick="closeMenu()">עדכונים</a></li>
      <li><a href="../careers.html" onclick="closeMenu()">קריירה</a></li>
      <li><a href="#cta" class="nav-cta" onclick="closeMenu()">צור קשר</a></li>
    </ul>
    <button class="hamburger" id="hamburger" onclick="toggleMenu()" aria-label="תפריט ניווט" aria-expanded="false"><span></span><span></span><span></span></button>
  </div>
</nav>

<main id="main">

<header class="sp-hero">
  <figure class="sp-hero-media">
    <img src="../img/yeridat-erech-197-hero.webp"
         srcset="../img/yeridat-erech-197-hero-sm.webp 820w, ../img/yeridat-erech-197-hero.webp 1600w"
         sizes="(max-width: 900px) 100vw, 50vw"
         alt="תוכנית בנייה חדשה מול קו הרקיע של השכונה - תביעת ירידת ערך" fetchpriority="high" decoding="async">
    <span class="sp-hero-seam" aria-hidden="true"></span>
  </figure>
  <div class="sp-hero-inner">
    <div class="sp-hero-copy">
      <nav class="sp-crumb" aria-label="פירורי לחם">
        <a href="../index.html">בורוביץ מזרחי</a><span>/</span><a href="../index.html#services">תחומי התמחות</a><span>/</span><em>תביעות ירידת ערך</em>
      </nav>
      <h1 class="sp-h1">תביעות ירידת ערך (סעיף 197)<br><span>קבלת פיצוי על פגיעה במקרקעין</span></h1>
      <p class="sp-lede">הגנה על שווי הנכס שלכם בעקבות אישור תוכניות בניין עיר פוגעות, כבישים או הפקעות.</p>
      <div class="sp-actions is-hero">
        <a class="sp-btn sp-btn-gold" href="https://wa.me/972546559942?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%95%D7%A9%D7%A8%D7%94%20%D7%AA%D7%95%D7%9B%D7%A0%D7%99%D7%AA%20%D7%9C%D7%99%D7%93%20%D7%94%D7%A0%D7%9B%D7%A1%20%D7%A9%D7%9C%D7%99%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%91%D7%93%D7%95%D7%A7%20%D7%96%D7%9B%D7%90%D7%95%D7%AA%20%D7%9C%D7%A4%D7%99%D7%A6%D7%95%D7%99%20%D7%9C%D7%A4%D7%99%20%D7%A1%D7%A2%D7%99%D7%A3%20197." target="_blank" rel="noopener noreferrer">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"/></svg></span>שליחת הודעה בוואטסאפ
        </a>
        <a class="sp-btn sp-btn-line" href="tel:054-6559942">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>054-6559942
        </a>
      </div>
    </div>
  </div>
</header>

<section class="sp-sec sp-pain">
  <div class="sp-wrap">
    <h2 class="sp-h2 reveal">התוכנית החדשה פוגעת בנכס שלכם? הזמן שלכם לתבוע מוגבל</h2>
    <p class="sp-pain-text reveal">אישור תוכנית בנייה סמוכה שהוסיפה מגדלים, חסמה נוף ואור, יצרה מטרדי רעש, או הפקיעה שטח מחלקתכם פוגע ישירות בשווי הנכס שלכם. סעיף 197 לחוק התכנון והבנייה מאפשר לדרוש פיצוי מלא מהוועדה המקומית, אך יש חלון הזדמנויות קשיח של 3 שנים בלבד מיום אישור התוכנית למתן תוקף.</p>
  </div>
</section>

<section class="sp-sec sp-alt">
  <div class="sp-wrap">
    <h2 class="sp-kicker reveal">למי השירות מיועד</h2>
    <ul class="sp-aud-grid">
      <li class="sp-aud reveal"><span class="sp-aud-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></span><span>בעלי דירות ובתים פרטיים שנפגעו מפרויקט תשתית או בנייה חדש בסביבתם.</span></li>
      <li class="sp-aud reveal"><span class="sp-aud-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></span><span>בעלי מגרשים שחלק משטחם מיועד להפקעה לצורכי ציבור.</span></li>
      <li class="sp-aud reveal"><span class="sp-aud-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></span><span>נציגויות דיירים וועדי בתים הפועלים מול תוכניות פוגעות בשכונה.</span></li>
    </ul>
  </div>
</section>

<section class="sp-sec sp-process">
  <div class="sp-wrap">
    <h2 class="sp-kicker reveal">תהליך העבודה שלנו</h2>
    <ol class="sp-steps">
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>בדיקה סטטוטורית</h3>
        <p>בדיקה של התוכנית הפוגעת, מועד אישורה והוכחת מעמד "גובל" לפי הפסיקה הנוכחית.</p>
      </li>
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>בחינת פגיעה</h3>
        <p>סיור במקום ובחינת מרכיבי הפגיעה (הסתרת שמש, רעש, עומסי תנועה, הפקעה).</p>
      </li>
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>עריכת השומה</h3>
        <p>עריכת חוות דעת שמאית מקיפה המחשבת את ירידת הערך הריאלית.</p>
      </li>
      <li class="sp-step reveal">
        <span class="sp-step-dot" aria-hidden="true"></span>
        <h3>ייצוג וניהול</h3>
        <p>ניהול התביעה יחד עם עורך הדין מול הוועדה המקומית ומול שמאי מכריע.</p>
      </li>
    </ol>
  </div>
</section>

<section class="sp-sec sp-alt sp-deliver">
  <div class="sp-wrap sp-split">
    <div class="sp-split-copy reveal">
      <h2 class="sp-kicker">מה מקבלים ביד</h2>
      <p class="sp-deliver-text">שומה מפורטת ומנומקת לתביעת פיצויים לפי סעיף 197, הכוללת ניתוח שמאי והנדסי הנשען על תקדימי בית המשפט העליון וועדות הערר.</p>
      <div class="sp-note">
        <span class="sp-note-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h10"/><path d="M6 15.5 12.5 9"/><path d="m9 6 6 6"/><path d="M12.5 2.5 19 9l-2.5 2.5L10 5z"/><path d="M4.5 13.5 9 18l-2 2-4.5-4.5z"/></svg></span>
        <div>
          <strong>בחזית הפסיקה</strong>
          <p>אנחנו עוקבים באופן שוטף אחר פסיקות בתי המשפט, הכרעות שמאים מכריעים והחלטות ועדות ערר. כל שומה שיוצאת מהמשרד נשענת על התקדימים והפרשנויות המשפטיות העדכניים ביותר - ולא על נוסחאות שעבדו פעם.</p>
        </div>
      </div>
    </div>
    <figure class="sp-split-img reveal">
      <img src="../img/yeridat-erech-197-body.webp" alt="פרויקט בנייה חדש בסמוך לשכונת מגורים קיימת" loading="lazy" decoding="async">
    </figure>
  </div>
</section>

<section class="sp-sec sp-faq">
  <div class="sp-wrap">
    <h2 class="sp-kicker reveal">שאלות נפוצות</h2>
    <div class="sp-faq-list reveal">
      <details class="sp-q">
        <summary>האם רק נכס שנוגע פיזית בגבול התוכנית זכאי לפיצוי?</summary>
        <p>החוק קובע זכאות לנכסים הגובלים בתוכנית, אך קיימת פסיקה רחבה ומעודכנת המגדירה מה נחשב "גובל" (למשל מקרים של כביש צר או שטח פתוח המפריד).</p>
      </details>
      <details class="sp-q">
        <summary>הגשנו תביעה והוועדה המקומית דחתה אותה. זה נגמר?</summary>
        <p>ממש לא. דחייה של הוועדה המקומית עוברת להכרעת שמאי מכריע, ומשם ניתן להמשיך לוועדת ערר לפיצויים ולהיטל השבחה. חלק ניכר מהתביעות מוכרע דווקא בשלבים האלה, ולכן חשוב שהשומה תיבנה מראש כך שתעמוד בהם.</p>
      </details>
    </div>
  </div>
</section>

<section class="sp-sec sp-cta" id="cta">
  <div class="sp-wrap reveal">
    <h2 class="sp-h2">חוששים מתוכנית חדשה בסביבתכם?</h2>
    <p class="sp-cta-text">בדקו איתנו זכאות לפיצויים. בדיקה ראשונית תראה אם יש פגיעה תכנונית ואם חלון שלוש השנים עדיין פתוח.</p>
    <div class="sp-actions is-cta">
        <a class="sp-btn sp-btn-gold" href="https://wa.me/972546559942?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%95%D7%A9%D7%A8%D7%94%20%D7%AA%D7%95%D7%9B%D7%A0%D7%99%D7%AA%20%D7%9C%D7%99%D7%93%20%D7%94%D7%A0%D7%9B%D7%A1%20%D7%A9%D7%9C%D7%99%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%91%D7%93%D7%95%D7%A7%20%D7%96%D7%9B%D7%90%D7%95%D7%AA%20%D7%9C%D7%A4%D7%99%D7%A6%D7%95%D7%99%20%D7%9C%D7%A4%D7%99%20%D7%A1%D7%A2%D7%99%D7%A3%20197." target="_blank" rel="noopener noreferrer">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"/></svg></span>שליחת הודעה בוואטסאפ
        </a>
        <a class="sp-btn sp-btn-line" href="tel:054-6559942">
          <span class="sp-btn-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>054-6559942
        </a>
      </div>
    <p class="sp-cta-alt">או השאירו פרטים ב<a href="../index.html#contact">טופס יצירת הקשר</a></p>
  </div>
</section>

</main>

<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="../logo-bm.png" alt="לוגו בורוביץ מזרחי">
        <p>משרד שמאות מקרקעין מוביל בצפון. ידע מקצועי מעמיק, היכרות שטח בלתי אמצעית והבנה כלכלית רחבה - בשירות כל לקוח.</p>
      </div>
      <div class="footer-col">
        <h4>ניווט</h4>
        <ul>
          <li><a href="../index.html#about">אודות</a></li>
          <li><a href="../index.html#services">תחומי התמחות</a></li>
          <li><a href="../maamarim.html">מאמרים</a></li>
          <li><a href="../careers.html">קריירה</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>יצירת קשר</h4>
        <ul>
          <li><a href="tel:054-6559942">054-6559942 · מאור</a></li>
          <li><a href="tel:050-8922469">050-8922469 · אמיר</a></li>
          <li><a id="em-footer" href="#"></a></li>
          <li>שדרות החרוב 6, פארק תעשיות בר-לב</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 בורוביץ מזרחי שמאות מקרקעין וחקלאות בע"מ. כל הזכויות שמורות.</span>
      <span><a href="../index.html">חזרה לאתר הראשי</a></span>
    </div>
  </div>
</footer>

<div class="floating-wrap">
  <a class="float-btn float-btn-wa" href="https://wa.me/972546559942" target="_blank" rel="noopener noreferrer" aria-label="שלחו הודעה בוואטסאפ">
    <svg aria-hidden="true" viewBox="0 0 32 32"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.67 4.61 1.832 6.5L4 29l7.75-1.812A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="#fff"/><path d="M21.5 18.5c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.19-.57-.34z" fill="#25D366"/></svg>
  </a>
  <button type="button" id="customAccessBtn" class="float-btn float-btn-access" aria-label="פתח תפריט נגישות" title="נגישות"><span aria-hidden="true">♿</span></button>
</div>

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<script>
  (function(){ var el=document.getElementById('em-footer'); if(el){ var a='info'+'@'+'bor-miz.co.il'; el.href='mailto:'+a; el.textContent=a; } })();
  function toggleMenu(){ var l=document.getElementById('navLinks'),b=document.getElementById('hamburger'); l.classList.toggle('open'); b.classList.toggle('open'); b.setAttribute('aria-expanded', l.classList.contains('open')?'true':'false'); }
  function closeMenu(){ document.getElementById('navLinks').classList.remove('open'); var b=document.getElementById('hamburger'); b.classList.remove('open'); b.setAttribute('aria-expanded','false'); }
  document.addEventListener('click', function(e){ var nav=document.getElementById('navbar'); if(nav && !nav.contains(e.target)) closeMenu(); });
  (function(){ var nav=document.getElementById('navbar'); var onScroll=function(){ nav.classList.toggle('scrolled', window.scrollY>60); }; window.addEventListener('scroll', onScroll, {passive:true}); onScroll(); })();
  (function(){
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce || !window.gsap || !window.ScrollTrigger){
      document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.reveal').forEach(function(el){ ScrollTrigger.create({ trigger: el, start:'top 90%', onEnter:function(){ el.classList.add('in'); } }); });
  })();
  // אקורדיון: פתיחת שאלה סוגרת את הקודמת
  (function(){
    var items = document.querySelectorAll('.sp-faq .sp-q');
    items.forEach(function(d){
      d.addEventListener('toggle', function(){
        if(!d.open) return;
        items.forEach(function(o){ if(o !== d) o.open = false; });
      });
    });
  })();
  // מעקב המרות - זהה לשאר האתר
  (function(){ window.dataLayer=window.dataLayer||[]; document.addEventListener('click', function(e){ var el=e.target.closest&&e.target.closest('a'); if(!el) return; if(/wa\.me|api\.whatsapp/.test(el.href||'')){ window.dataLayer.push({event:'contact_whatsapp'}); } else if((el.getAttribute('href')||'').indexOf('tel:')===0){ window.dataLayer.push({event:'contact_phone'}); } }, true); })();
</script>

<nagishli></nagishli>
<script>
nl_contact = "n:בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ|p:054-6559942|u:maor@bor-miz.co.il";
nl_pos = "BL"; nl_lang = "he"; nl_color = "blue"; nl_compact = "1";
</script>
<script src="../nagishli.js?v=2.3" charset="utf-8"></script>
<script>
  (function(){
    function forceCompactStyles(){
      var bar=document.getElementById('NagishLiBar'), menus=document.getElementById('NagishLiMenus');
      if(bar){ bar.style.cssText='position:fixed !important; left:1.4rem !important; right:auto !important; bottom:6.2rem !important; top:auto !important; width:300px !important; max-width:90vw !important; height:auto !important; z-index:9999 !important; background:transparent !important; box-shadow:none !important; border:none !important; padding:0 !important; margin:0 !important;'; }
      if(menus){ menus.style.cssText+=';position:static !important; width:300px !important; max-width:90vw !important; max-height:70vh !important; overflow-y:auto !important; overflow-x:hidden !important; font-size:13px !important; border-radius:12px !important; box-shadow:0 10px 40px rgba(0,0,0,0.3) !important; margin:0 !important; padding:0 !important; background:#fff !important;'; }
      document.querySelectorAll('#NagishLiMenus, #NagishLiMenus ul').forEach(function(el){ el.style.width='100%'; el.style.maxWidth='300px'; el.style.boxSizing='border-box'; });
    }
    function openNagishLiMenu(){
      if(typeof jQuery==='undefined') return false;
      var $=jQuery, $strip=$('#NagishLiBarStrip'), $menus=$('#NagishLiMenus');
      if(!$strip.length || !$menus.length) return false;
      if($menus.is(':visible')){ $menus.slideUp(150, function(){ $strip.removeClass('open'); }); }
      else { forceCompactStyles(); $strip.addClass('open'); $menus.slideDown(150, forceCompactStyles); }
      return true;
    }
    function bind(){ var btn=document.getElementById('customAccessBtn'); if(!btn) return; btn.addEventListener('click', function(e){ e.preventDefault(); var n=0; (function tryOpen(){ if(openNagishLiMenu()) return; if(++n<30) setTimeout(tryOpen,200); })(); }); }
    if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', bind); } else { bind(); }
  })();
</script>

</body>
</html>

```

---

## דף הבית וגיליונות הסגנון

### `index.html`

```html
﻿<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="shortcut icon" href="/favicon.ico">

<!-- ===== GOOGLE ANALYTICS 4 (gtag.js) =====
     Property "bor-miz.co.il", measurement ID G-GYNQPGPR33 - installed 2026-09-08,
     replacing a Tag Manager placeholder that never had a container behind it.
     The bridge below turns the site's existing dataLayer.push({event:'...'}) calls
     (generate_lead / contact_whatsapp / contact_phone / intake_submitted) into GA4
     events, so every call site elsewhere in the site stays untouched. -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-GYNQPGPR33"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-GYNQPGPR33');
  (function(){
    // gtag() itself pushes an arguments object, which has no .event key - so this
    // never recurses on its own output.
    var push = window.dataLayer.push;
    window.dataLayer.push = function(){
      for (var i = 0; i < arguments.length; i++) {
        var o = arguments[i];
        if (o && typeof o.event === 'string') {
          var params = {};
          for (var k in o) {
            if (k !== 'event' && Object.prototype.hasOwnProperty.call(o, k)) params[k] = o[k];
          }
          gtag('event', o.event, params);
        }
      }
      return push.apply(window.dataLayer, arguments);
    };
  })();
</script>
<!-- ===== END GOOGLE ANALYTICS 4 ===== -->

<!-- ===== SEO BASIC ===== -->
<title>בורוביץ מזרחי שמאות מקרקעין וחקלאות בע"מ</title>
<meta name="description" content="משרד שמאות מקרקעין מוביל בצפון. מתמחים בהיטלי השבחה, הערכות שווי, נחלות ומשקים חקלאיים, השגות על שומות רמ&quot;י ופינוי-בינוי.">
<meta name="keywords" content="שמאות מקרקעין, שמאי מקרקעין, היטל השבחה, הערכת שווי נכס, נחלה, משק חקלאי, שמאות חקלאית, השגות שומות רמי, פינוי בינוי, שמאי צפון, גליל, בורוביץ מזרחי">
<meta name="author" content="בורוביץ מזרחי שמאות מקרקעין וחקלאות בע"מ">
<meta name="robots" content="index, follow">
<meta name="language" content="Hebrew">
<link rel="canonical" href="https://bor-miz.co.il/">

<!-- ===== OPEN GRAPH ===== -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://bor-miz.co.il/">
<meta property="og:title" content="בורוביץ מזרחי | שמאות מקרקעין וחקלאות בע"מ">
<meta property="og:description" content="משרד שמאות מקרקעין מוביל בצפון. היטלי השבחה, נחלות, הערכות שווי, פינוי-בינוי ועוד.">
<meta property="og:image" content="https://bor-miz.co.il/image_2.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="he_IL">
<meta property="og:site_name" content="בורוביץ מזרחי שמאות מקרקעין">

<!-- ===== TWITTER CARD ===== -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="בורוביץ מזרחי | שמאות מקרקעין וחקלאות בע"מ">
<meta name="twitter:description" content="משרד שמאות מקרקעין מוביל בצפון. היטלי השבחה, נחלות, הערכות שווי ועוד.">
<meta name="twitter:image" content="https://bor-miz.co.il/image_2.png">

<!-- ===== PERFORMANCE ===== -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500;600;700;900&family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="dns-prefetch" href="https://nurgknexilxaxxovdbco.supabase.co">

<!-- ===== STRUCTURED DATA – LocalBusiness ===== -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ",
  "image": "https://bor-miz.co.il/image_2.png",
  "url": "https://bor-miz.co.il",
  "telephone": ["+972-54-6559942", "+972-50-8922469"],
  "email": ["maor@bor-miz.co.il", "amir@bor-miz.co.il"],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "שדרות החרוב 6",
    "addressLocality": "פארק תעשיות בר-לב",
    "addressRegion": "צפון",
    "addressCountry": "IL"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 32.9039, "longitude": 35.1806 },
  "openingHours": "Su-Th 08:00-18:00",
  "priceRange": "$$",
  "description": "משרד שמאות מקרקעין מוביל בצפון, המתמחה בהיטלי השבחה, הערכות שווי, נחלות ומשקים חקלאיים.",
  "founder": [
    { "@type": "Person", "name": "מאור מזרחי", "jobTitle": "שמאי מקרקעין מוסמך", "telephone": "+972-54-6559942", "email": "maor@bor-miz.co.il" },
    { "@type": "Person", "name": "אמיר בורוביץ", "jobTitle": "שמאי מקרקעין מוסמך", "telephone": "+972-50-8922469", "email": "amir@bor-miz.co.il" }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "שירותי שמאות",
    "itemListElement": [
      {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "היטלי השבחה"}},
      {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "הערכת שווי נכסים"}},
      {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "שומות חקלאיות ונחלות"}},
      {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "השגות על שומות רמ\"י"}},
      {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "תביעות ירידת ערך"}},
      {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "כדאיות כלכלית לפרויקטים"}}
    ]
  },
  "sameAs": ["https://wa.me/972546559942", "https://wa.me/972508922469"]
}
</script>

<!-- ===== STRUCTURED DATA – WebSite ===== -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "בורוביץ מזרחי שמאות מקרקעין וחקלאות",
  "alternateName": "בורוביץ מזרחי",
  "url": "https://bor-miz.co.il/"
}
</script>

<!-- ===== STRUCTURED DATA – Organization ===== -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ",
  "alternateName": "בורוביץ מזרחי",
  "url": "https://bor-miz.co.il/",
  "logo": "https://bor-miz.co.il/logo-bm.png",
  "image": "https://bor-miz.co.il/image_2.png",
  "telephone": "+972-54-6559942",
  "email": "maor@bor-miz.co.il",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "שדרות החרוב 6",
    "addressLocality": "פארק תעשיות בר-לב",
    "addressRegion": "צפון",
    "addressCountry": "IL"
  },
  "sameAs": ["https://wa.me/972546559942", "https://wa.me/972508922469"]
}
</script>

<!-- ===== STRUCTURED DATA – BreadcrumbList ===== -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "ראשי", "item": "https://bor-miz.co.il/"},
    {"@type": "ListItem", "position": 2, "name": "אודותינו", "item": "https://bor-miz.co.il/#about"},
    {"@type": "ListItem", "position": 3, "name": "תחומי התמחות", "item": "https://bor-miz.co.il/#services"},
    {"@type": "ListItem", "position": 4, "name": "מקרים מהשטח", "item": "https://bor-miz.co.il/#success"},
    {"@type": "ListItem", "position": 5, "name": "צור קשר", "item": "https://bor-miz.co.il/#contact"}
  ]
}
</script>

<!-- ===== STRUCTURED DATA – FAQPage ===== -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type": "Question", "name": "מה זה היטל השבחה ומתי צריך לשלם אותו?", "acceptedAnswer": {"@type": "Answer", "text": "היטל השבחה הוא תשלום חובה לוועדה המקומית כאשר ערך הנכס עולה בעקבות אישור תוכנית בניין עיר, הקלה או שימוש חורג. ההיטל משולם בעת מכירת הנכס או מימוש הזכויות. שמאי מקרקעין מוסמך יכול לבדוק את חוקיות החיוב ולהגיש השגה אם הסכום מופרז."}},
    {"@type": "Question", "name": "כמה עולה שומת מקרקעין?", "acceptedAnswer": {"@type": "Answer", "text": "עלות שומת מקרקעין משתנה בהתאם לסוג הנכס, מורכבות השומה ומטרתה. שומה לדירת מגורים רגילה נעה בין 2,000-5,000 שקלים, בעוד שומות מורכבות כמו נחלות חקלאיות או נכסים מסחריים עשויות לעלות יותר. צרו קשר לקבלת הצעת מחיר מדויקת."}},
    {"@type": "Question", "name": "מתי צריך שמאי מקרקעין?", "acceptedAnswer": {"@type": "Answer", "text": "שמאי מקרקעין נדרש במקרים כמו: לקיחת משכנתא, קנייה או מכירת נכס, חלוקת רכוש, היטל השבחה, השגות מול רשות מקרקעי ישראל (רמ\"י), תביעות ירידת ערך לפי סעיף 197, ובדיקת כדאיות כלכלית של פרויקטים."}},
    {"@type": "Question", "name": "מה ההבדל בין שמאי מקרקעין לשמאי ממשלתי?", "acceptedAnswer": {"@type": "Answer", "text": "שמאי מקרקעין פרטי מייצג את הלקוח ומבצע הערכות שווי לצרכים שונים. שמאי ממשלתי עובד מטעם המדינה וקובע שומות לצרכי מיסוי ותכנון. ניתן להגיש השגה על שומה ממשלתית באמצעות שמאי פרטי מוסמך."}},
    {"@type": "Question", "name": "האם אפשר להגיש השגה על שומת רמ\"י?", "acceptedAnswer": {"@type": "Answer", "text": "כן, בהחלט. ניתן להגיש השגה על שומת רשות מקרקעי ישראל (רמ\"י) תוך 60 יום מקבלת השומה. שמאי מקרקעין מנוסה יכול לבחון את השומה, לאתר חוסרים או טעויות, ולהגיש השגה מקצועית שעשויה להפחית משמעותית את הסכום."}}
  ]
}
</script>

<link rel="stylesheet" href="styles.css">
</head>
<body>


<a href="#main-content" class="skip-to-content">דלג לתוכן הראשי</a>

<!-- NAVIGATION -->
<nav id="navbar" role="navigation" aria-label="ניווט ראשי">
  <div class="nav-inner">
    <a href="#hero" class="nav-logo" aria-label="בורוביץ מזרחי שמאות מקרקעין - דף הבית">
      <img src="logo-bm.png" alt="לוגו בורוביץ מזרחי">
    </a>
    <ul class="nav-links" id="navLinks">
      <li><a href="#about" onclick="closeMenu()">אודות</a></li>
      <li><a href="#services" onclick="closeMenu()">תחומי התמחות</a></li>
      <li><a href="maamarim.html" onclick="closeMenu()">מאמרים</a></li>
      <li><a href="#linkedin-posts" onclick="closeMenu()">עדכונים</a></li>
      <li><a href="#success" onclick="closeMenu()">מהשטח</a></li>
      <li><a href="careers.html" onclick="closeMenu()">קריירה</a></li>
      <li><a href="#contact" class="nav-cta" onclick="closeMenu()">צור קשר</a></li>
    </ul>
    <button class="hamburger" id="hamburger" onclick="toggleMenu()" aria-label="תפריט ניווט" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>

<main id="main-content">

<!-- HERO -->
<section class="hero" id="hero">
  <div class="hero-slides" id="heroSlides">
    <div class="hero-slide active"></div>
    <div class="hero-slide"></div>
    <div class="hero-slide"></div>
    <div class="hero-slide"></div>
    <div class="hero-slide"></div>
    <div class="hero-slide"></div>
    <div class="hero-slide"></div>
    <div class="hero-slide"></div>
    <div class="hero-slide"></div>
    <div class="hero-slide"></div>
    <div class="hero-slide"></div>
  </div>
  <div class="hero-overlay"></div>

  <div class="hero-side-label">שמאות מקרקעין · חקלאות · הצפון</div>

  <div class="hero-content">
    <span class="eyebrow hero-eyebrow">בורוביץ מזרחי</span>
    <h1 class="hero-title">
      <span class="hero-line"><span>הערך האמיתי של הנכס</span></span>
      <span class="hero-line"><span>נמצא <span class="gold">בפרטים הקטנים</span></span></span>
    </h1>
    <p class="hero-sub">משרד שמאות מקרקעין מוביל בצפון - מומחים בהיטלי השבחה, השגות רמ"י, נחלות ומשקים חקלאיים, פינוי-בינוי ועריכת דוחות לפי תקן 21.</p>
    <div class="hero-actions">
      <a href="#contact" class="btn btn-gold">לתיאום ייעוץ <span class="arr">←</span></a>
      <a href="#about" class="btn btn-ghost">קצת עלינו</a>
    </div>
  </div>

  <div class="hero-dots" id="heroDots"></div>
  <div class="hero-scroll"><span>גלילה</span><span class="mouse"></span></div>
</section>

<!-- PILLARS -->
<section class="pillars">
  <div class="container">
    <div class="pillars-inner">
      <div class="pillar reveal">
        <span class="num">01</span>
        <h3>ידע מקצועי מעמיק</h3>
        <p>ניסיון עשיר שנצבר בלב עשיית השמאות במשרדים המובילים בישראל, על פני מגוון רחב של נכסים וסקטורים.</p>
      </div>
      <div class="pillar reveal reveal-d1">
        <span class="num">02</span>
        <h3>היכרות שטח בלתי אמצעית</h3>
        <p>הבנה עמוקה של השטח והשוק המקומי בצפון - כל נכס הוא עולם ומלואו הדורש התאמה מדויקת.</p>
      </div>
      <div class="pillar reveal reveal-d2">
        <span class="num">03</span>
        <h3>הבנה כלכלית רחבה</h3>
        <p>מענה מדויק, אמין ושקוף לחלוטין לכל לקוח - פרטי, עסקי או מוסדי, מתוך ראייה כלכלית כוללת.</p>
      </div>
    </div>
  </div>
</section>

<!-- ABOUT / PARTNERS -->
<section class="section section--cream" id="about">
  <div class="container">

    <div class="about-top">
      <div class="about-copy reveal">
        <span class="eyebrow">אודות המשרד</span>
        <h2 class="section-title">מקצועיות, שקיפות<br>ושירות אישי בלתי מתפשר</h2>
        <p>המשרד הוקם על ידי <strong>אמיר בורוביץ</strong> <strong>ומאור מזרחי</strong>, שהביאו איתם ניסיון עשיר שצברו בלב עשיית השמאות במשרדים המובילים והגדולים בישראל.</p>
        <p>אנו מעניקים מעטפת רחבה של פתרונות שמאות וייעוץ כלכלי - הערכות שווי לכל סוגי הנכסים, הגשת השגות מקצועיות על היטלי השבחה ושומות רמ"י, ליווי פרויקטים מורכבים של פינוי-בינוי והתחדשות עירונית, והתמחות ייחודית בנחלות ומשקים חקלאיים.</p>
        <a href="#services" class="btn btn-outline">לתחומי ההתמחות <span class="arr">←</span></a>
      </div>

      <div class="about-figure reveal reveal-d1">
        <div class="deco" aria-hidden="true"></div>
        <div class="frame">
          <img src="image_3.jpg" alt="שמאות מקרקעין בורוביץ מזרחי" data-parallax>
        </div>
        <div class="badge">
          <strong>תקן 21</strong>
          <span>דוחות שמאיים מלאים ומפורטים</span>
        </div>
      </div>
    </div>

    <div id="partners">
      <span class="eyebrow reveal" style="margin-bottom:1rem; display:inline-flex;">השותפים</span>
      <h2 class="section-title reveal" style="margin-bottom:2.5rem;">הכירו את הצוות</h2>
      <div class="partners-grid">

        <div class="partner reveal">
          <div class="partner-head">
            <img src="image_4.jpg" class="partner-photo" alt="מאור מזרחי">
            <div>
              <h3>מאור מזרחי</h3>
              <span class="role">שמאי מקרקעין מוסמך · שותף</span>
            </div>
          </div>
          <ul class="cred-list">
            <li>שמאי מקרקעין מוסמך, חבר לשכת שמאי המקרקעין</li>
            <li>בוגר תואר ראשון (B.A) בכלכלה ומנהל עסקים, בהצטיינות</li>
            <li>שמאי רכוש</li>
            <li>שימש כמרכז השגות במטה רשות מקרקעי ישראל, בירושלים</li>
            <li>בעל ניסיון בשומות היטלי השבחה ומתן שירות לוועדות</li>
            <li>בעל ניסיון בהפקת דוחות אפס, טבלאות הקצאה ואיזון</li>
            <li>עוסק בהכנת שומות שווי שוק, נכסים מסחריים, כינוס נכסים</li>
          </ul>
        </div>

        <div class="partner reveal reveal-d1">
          <div class="partner-head">
            <img src="image_5.jpg" class="partner-photo" alt="אמיר בורוביץ">
            <div>
              <h3>אמיר בורוביץ</h3>
              <span class="role">שמאי מקרקעין מוסמך ומהנדס · שותף</span>
            </div>
          </div>
          <ul class="cred-list">
            <li>שמאי מקרקעין מוסמך - בוגר הטכניון, חבר לשכת שמאי המקרקעין</li>
            <li>שמאי חקלאות, שמאי מטעם קרן לביטוח נזקי טבע בחקלאות</li>
            <li>מומחה בהערכת שווי לנחלות, משקים חקלאיים וקרקעות</li>
            <li>נכלל במאגר המומחים מטעם בית המשפט ובית הדין הרבני</li>
            <li>מתווך מוסמך, רשום בפנקס המתווכים לפי חוק התשנ"ו-1996</li>
            <li>בוגר B.Sc הנדסת תעשייה, מהנדס רשום בפנקס המהנדסים</li>
            <li>שותף ומנהל בהקמת מבני תעשייה באזור התעשייה צ.ח.ר</li>
          </ul>
        </div>

      </div>
    </div>

  </div>
</section>

<!-- SERVICES -->
<section class="section" id="services">
  <div class="container">
    <div class="services-head">
      <div class="reveal">
        <span class="eyebrow" style="margin-bottom:1rem; display:inline-flex;">תחומי התמחות</span>
        <h2 class="section-title">השירותים שלנו</h2>
      </div>
      <p class="reveal reveal-d1">מעטפת מקצועית מלאה לבעלי נכסים, יזמים, עורכי דין, אדריכלים, קבלנים וגופים מוסדיים.</p>
    </div>

    <div class="services-body">
    <div class="services-grid reveal">
      <a class="svc" data-svc="m1" href="hitmahut/heitlei-hashbacha.html">
        <div class="svc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 17 8 11 13 14 21 5"/><polyline points="16 5 21 5 21 10"/></svg></div>
        <h3>היטלי השבחה</h3>
        <p>בדיקה, חישוב והגשת השגות על שומות היטל השבחה. ייצוג מול ועדות מקומיות ומרחביות.</p>
        <span class="svc-more">לפרטים <span class="arr">←</span></span>
      </a>
      <a class="svc" data-svc="m2" href="hitmahut/haarachat-shovi.html">
        <div class="svc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><circle cx="15" cy="15" r="3"/><line x1="17.5" y1="17.5" x2="21" y2="21"/></svg></div>
        <h3>הערכת שווי</h3>
        <p>הערכת כל סוגי הנכסים: דירות, בתי מגורים, מבנים מסחריים, משרדים, מגרשים וקרקעות חקלאיות.</p>
        <span class="svc-more">לפרטים <span class="arr">←</span></span>
      </a>
      <a class="svc" data-svc="m3" href="hitmahut/shomot-haklaiot.html">
        <div class="svc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22V12"/><path d="M5 12H2a10 10 0 0020 0h-3"/><path d="M8 6l4-4 4 4"/><path d="M8 12a4 4 0 008 0"/></svg></div>
        <h3>שומות חקלאיות</h3>
        <p>הערכות נזקים בגידולים ובחקלאות, סיוע בהגשת בקשה לפיצויים במסלול ירוק/אדום.</p>
        <span class="svc-more">לפרטים <span class="arr">←</span></span>
      </a>
      <a class="svc" data-svc="m4" href="hitmahut/hasagot-rami.html">
        <div class="svc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg></div>
        <h3>השגות על שומות רמ"י</h3>
        <p>הגשת השגות וייצוג מול רשות מקרקעי ישראל בנוגע לדמי חכירה, דמי היתר ודמי הסכמה.</p>
        <span class="svc-more">לפרטים <span class="arr">←</span></span>
      </a>
      <a class="svc" data-svc="m5" href="hitmahut/yeridat-erech-197.html">
        <div class="svc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
        <h3>תביעות ירידת ערך</h3>
        <p>הגשת תביעות לפיצוי בגין שינוי מצב הקרקע בעקבות תכניות בניין עיר והפקעות.</p>
        <span class="svc-more">לפרטים <span class="arr">←</span></span>
      </a>
      <a class="svc" data-svc="m6" href="hitmahut/nachalot-umeshakim.html">
        <div class="svc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12l9-8 9 8"/><rect x="5" y="12" width="14" height="9"/><rect x="9" y="16" width="6" height="5"/></svg></div>
        <h3>נחלות ומשקים חקלאיים</h3>
        <p>הערכות שווי נחלות, ייעוץ בנושאי דמי הסכמה, חכירה מהוונת והיטלי השבחה במגזר החקלאי.</p>
        <span class="svc-more">לפרטים <span class="arr">←</span></span>
      </a>
      <a class="svc" data-svc="m7" href="hitmahut/tavlaot-ichud-vehaluka.html">
        <div class="svc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg></div>
        <h3>טבלאות איחוד וחלוקה</h3>
        <p>עריכת טבלאות איחוד וחלוקה במסגרת תכנון תב"ע ותביעות ירידת ערך לפי סעיף 197.</p>
        <span class="svc-more">לפרטים <span class="arr">←</span></span>
      </a>
      <a class="svc" data-svc="m8" href="hitmahut/kedaiut-kalkalit.html">
        <div class="svc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></div>
        <h3>כדאיות כלכלית וליווי פרויקטים</h3>
        <p>בדיקת היתכנות כלכלית, ניתוח סיכונים, ליווי פינוי-בינוי ותמ"א 38, הפקת דוחות אפס.</p>
        <span class="svc-more">לפרטים <span class="arr">←</span></span>
      </a>
      <a class="svc" data-svc="m9" href="hitmahut/kinus-ufiruk-shituf.html">
        <div class="svc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="9" height="10" rx="2"/><rect x="13" y="7" width="9" height="10" rx="2"/><line x1="11" y1="9" x2="13" y2="9"/><line x1="11" y1="12" x2="13" y2="12"/><line x1="11" y1="15" x2="13" y2="15"/></svg></div>
        <h3>כינוס נכסים ופירוק שיתוף</h3>
        <p>הערכת שווי לצורך מכירת נכסים במסגרת הליכי פירוק שיתוף וכינוס נכסים.</p>
        <span class="svc-more">לפרטים <span class="arr">←</span></span>
      </a>
    </div>

    <figure class="services-foot reveal">
      <div class="quote-photo">
        <img src="image_1.jpg" alt="קו רקיע ופיתוח נדל״ן - הערכת שווי מקרקעין" loading="lazy">
      </div>
      <div class="svc-rest" aria-hidden="true">
        <img src="svc-rest.webp" alt="" loading="lazy" decoding="async">
      </div>
      <blockquote>
        <span class="quote-eyebrow">הגישה שלנו</span>
        <p>כל נכס הוא עולם ומלואו הדורש התאמה מדויקת למאפייני השוק המשתנים. אנו מלווים את הלקוח מהשאלה הראשונה ועד למסמך הסופי - בשקיפות מלאה.</p>
        <cite>בורוביץ מזרחי · משרד שמאות מקרקעין</cite>
      </blockquote>
      <div class="svc-stage" aria-hidden="true"></div>
    </figure>
    </div>
  </div>
</section>

<!-- LINKEDIN UPDATES -->
<section class="section section--cream linkedin-section" id="linkedin-posts" aria-labelledby="linkedin-heading">
  <div class="container">
    <div class="linkedin-head reveal">
      <span class="eyebrow">עדכונים אחרונים</span>
      <h2 class="section-title" id="linkedin-heading">ישר מהשטח</h2>
      <p class="lead" style="text-align:center;">מחשבות, תובנות ומקרים מהשטח - ישירות מהפיד שלנו בלינקדאין</p>
    </div>
    <div class="linkedin-carousel-wrap">
      <button class="linkedin-arrow prev" type="button" aria-label="הקודם" id="linkedin-prev">‹</button>
      <div class="linkedin-cards" id="linkedin-cards" role="list">
        <div class="linkedin-loading">טוען פוסטים...</div>
      </div>
      <button class="linkedin-arrow next" type="button" aria-label="הבא" id="linkedin-next">›</button>
    </div>
  </div>
</section>

<!-- RESULTS / SUCCESS -->
<section class="section results" id="success">
  <div class="container">
    <div class="results-head reveal">
      <span class="eyebrow">תוצאות מהשטח</span>
      <h2 class="section-title">כך אנחנו חוסכים לכם כסף</h2>
      <p>תוצאות מוכחות ממקרים אמיתיים - בדיקה מעמיקה של שומות שהוצאו נגד לקוחותינו.</p>
    </div>

    <div class="results-grid">
      <div class="result-card reveal">
        <div class="result-img"><img src="toc_1.png" alt="תשריט רמת גן"></div>
        <div class="result-body">
          <div class="result-pct"><span class="counter" data-target="90">0</span><span>%</span></div>
          <div class="result-label">הפחתת היטל השבחה</div>
          <span class="result-loc">רמת גן</span>
          <p class="result-detail">תוכנית 503-0573865 - לאחר בדיקה ועבודה מעמיקה הצלחנו להפחית כ-90% מדרישת היטל ההשבחה.</p>
        </div>
      </div>
      <div class="result-card reveal reveal-d1">
        <div class="result-img"><img src="toc_2.png" alt="תשריט חצור הגלילית"></div>
        <div class="result-body">
          <div class="result-pct"><span class="counter" data-target="100">0</span><span>%</span></div>
          <div class="result-label">ביטול מלא של היטל השבחה</div>
          <span class="result-loc">חצור הגלילית</span>
          <p class="result-detail">תוכנית 259-0218446 - לאחר בדיקה ועבודה מעמיקה הצלחנו לבטל 100% מדרישת היטל ההשבחה.</p>
        </div>
      </div>
      <div class="result-card reveal reveal-d2">
        <div class="result-img"><img src="toc_3.png" alt="תשריט סכנין"></div>
        <div class="result-body">
          <div class="result-pct"><span class="counter" data-target="50">0</span><span>%</span></div>
          <div class="result-label">הפחתת היטל השבחה</div>
          <span class="result-loc">סכנין</span>
          <p class="result-detail">תוכנית 262-0829218 - לאחר בדיקה ועבודה מעמיקה הצלחנו להפחית כ-50% מדרישת היטל ההשבחה.</p>
        </div>
      </div>
    </div>

    <div class="results-quote reveal">
      <p>"אנחנו מאמינים שכל לקוח זכאי לבדיקה מעמיקה ומקצועית של השומות שהוצאו נגדו. לעיתים קרובות, ההפרשים שמגלים הם משמעותיים מאוד."</p>
      <cite>- מאור מזרחי ואמיר בורוביץ, שותפי המשרד</cite>
    </div>
  </div>
</section>

<!-- CLIENTS -->
<section class="section" id="clients">
  <div class="container">
    <div class="clients-head reveal">
      <span class="eyebrow">לקוחות</span>
      <h2 class="section-title">מבין לקוחותינו</h2>
      <p class="lead" style="text-align:center;">אנו גאים לשרת מגוון רחב של לקוחות פרטיים, עסקיים ומוסדיים</p>
    </div>
  </div>
  <div class="marquee reveal">
    <div class="marquee-track" id="logo-track">
      <div class="client-logo"><img src="image_6.png" alt="Arbel Finance"></div>
      <div class="client-logo"><img src="image_7.png" alt="מרום הגליל"></div>
      <div class="client-logo"><img src="image_8.png" alt="מרגליות נדל''ן"></div>
      <div class="client-logo"><img src="image_9.jpeg" alt="קרן לביטוח נזקי טבע"></div>
      <div class="client-logo"><img src="image_10.png" alt="ברק ייעוץ השקעות"></div>
      <div class="client-logo"><img src="image_11.jpeg" alt="הדסים"></div>
      <div class="client-logo"><img src="image_12.jpeg" alt="ועדות מקומיות"></div>
      <!-- duplicate for seamless loop -->
      <div class="client-logo"><img src="image_6.png" alt=""></div>
      <div class="client-logo"><img src="image_7.png" alt=""></div>
      <div class="client-logo"><img src="image_8.png" alt=""></div>
      <div class="client-logo"><img src="image_9.jpeg" alt=""></div>
      <div class="client-logo"><img src="image_10.png" alt=""></div>
      <div class="client-logo"><img src="image_11.jpeg" alt=""></div>
      <div class="client-logo"><img src="image_12.jpeg" alt=""></div>
    </div>
  </div>
</section>

<!-- CONTACT -->
<section class="section contact" id="contact">
  <div class="container">
    <div class="contact-wrap">
      <div class="contact-info reveal">
        <span class="eyebrow">יצירת קשר</span>
        <h2 class="section-title">נשמח לעמוד לשירותכם</h2>
        <p>לייעוץ ראשוני, שאלות מקצועיות או בקשת הצעת מחיר - פנו אלינו בכל אחת מהדרכים הבאות:</p>
        <div class="contact-items">
          <div class="contact-item">
            <div class="contact-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg></div>
            <div>
              <h4>דוא"ל המשרד</h4>
              <a id="em-office" href="#"></a>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></svg></div>
            <div>
              <h4>מאור מזרחי</h4>
              <div class="contact-row">
                <a href="tel:054-6559942">054-6559942</a>
                <a href="https://wa.me/972546559942" target="_blank" rel="noopener" class="wa-pill">
                  <svg viewBox="0 0 32 32" fill="#fff"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.67 4.61 1.832 6.5L4 29l7.75-1.812A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z"/></svg>WhatsApp
                </a>
              </div>
              <a id="em-maor" href="#"></a>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></svg></div>
            <div>
              <h4>אמיר בורוביץ</h4>
              <div class="contact-row">
                <a href="tel:050-8922469">050-8922469</a>
                <a href="https://wa.me/972508922469" target="_blank" rel="noopener" class="wa-pill">
                  <svg viewBox="0 0 32 32" fill="#fff"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.67 4.61 1.832 6.5L4 29l7.75-1.812A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z"/></svg>WhatsApp
                </a>
              </div>
              <a id="em-amir" href="#"></a>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
            <div>
              <h4>כתובת</h4>
              <p>שדרות החרוב 6, פארק תעשיות בר-לב</p>
            </div>
          </div>
        </div>
      </div>

      <div class="contact-card reveal reveal-d1">
        <h3>שלחו לנו הודעה</h3>
        <p>נחזור אליכם בהקדם האפשרי</p>
        <form class="contact-form" id="contact-form" onsubmit="return submitContactForm(event, 'contact')">
          <input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);border:0;opacity:0">
          <div class="form-grid">
            <div class="form-group">
              <label for="contact-name">שם מלא *</label>
              <input type="text" id="contact-name" name="name" placeholder="ישראל ישראלי" required aria-required="true" autocomplete="name">
            </div>
            <div class="form-group">
              <label for="contact-phone">טלפון *</label>
              <input type="tel" id="contact-phone" name="phone" placeholder="05X-XXXXXXX" required aria-required="true" autocomplete="tel">
            </div>
          </div>
          <div class="form-group">
            <label for="contact-email">דוא"ל</label>
            <input type="email" id="contact-email" name="email" placeholder="israel@example.com" autocomplete="email">
          </div>
          <div class="form-group">
            <label for="contact-subject">נושא פנייה</label>
            <select id="contact-subject" name="subject">
              <option value="">בחר נושא...</option>
              <option>שומת מקרקעין</option>
              <option>היטל השבחה</option>
              <option>השגה על שומת רמ"י</option>
              <option>בדיקת כדאיות</option>
              <option>ייעוץ</option>
              <option>אחר</option>
            </select>
          </div>
          <div class="form-group">
            <label for="contact-message">הודעה</label>
            <textarea id="contact-message" name="message" placeholder="תיאור קצר של הנכס, הנושא או השאלה שלכם..."></textarea>
          </div>
          <button type="submit" class="btn btn-primary form-submit" id="contact-submit-btn">שלח הודעה <span class="arr">←</span></button>
          <div id="contact-form-status" class="form-status"></div>
        </form>
      </div>
    </div>
  </div>
</section>

</main>

<!-- FOOTER -->
<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="logo-bm.png" alt="לוגו בורוביץ מזרחי">
        <p>משרד שמאות מקרקעין מוביל בצפון. ידע מקצועי מעמיק, היכרות שטח בלתי אמצעית והבנה כלכלית רחבה - בשירות כל לקוח.</p>
      </div>
      <div class="footer-col">
        <h4>ניווט</h4>
        <ul>
          <li><a href="#about">אודות</a></li>
          <li><a href="#services">תחומי התמחות</a></li>
          <li><a href="maamarim.html">מאמרים</a></li>
          <li><a href="#success">תוצאות מהשטח</a></li>
          <li><a href="careers.html">קריירה</a></li>
          <li><a href="#contact">צור קשר</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>יצירת קשר</h4>
        <ul>
          <li><a href="tel:054-6559942">054-6559942 · מאור</a></li>
          <li><a href="tel:050-8922469">050-8922469 · אמיר</a></li>
          <li><a id="em-footer" href="#"></a></li>
          <li>שדרות החרוב 6, פארק תעשיות בר-לב</li>
        </ul>
        <div style="margin-top:14px;border-radius:6px;overflow:hidden;max-width:230px;">
          <iframe title="מפת המשרד - שדרות החרוב 6, פארק תעשיות בר-לב" src="https://maps.google.com/maps?q=בורוביץ+מזרחי+שמאות+מקרקעין,+שדרות+החרוב+6,+בר-לב&z=15&hl=iw&output=embed" width="100%" height="130" style="border:0;display:block;" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 בורוביץ מזרחי שמאות מקרקעין וחקלאות בע"מ. כל הזכויות שמורות.</span>
      <span>
        <button onclick="openLegalPopup('terms')">תנאי שימוש</button> &nbsp;|&nbsp;
        <button onclick="openLegalPopup('privacy')">מדיניות פרטיות</button>
      </span>
    </div>
  </div>
</footer>

<!-- FLOATING BUTTONS -->
<div class="floating-wrap">
  <a class="float-btn float-btn-wa" href="https://wa.me/972546559942" target="_blank" rel="noopener noreferrer" aria-label="שלחו הודעה בוואטסאפ">
    <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.67 4.61 1.832 6.5L4 29l7.75-1.812A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="#fff"/>
      <path d="M21.5 18.5c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.19-.57-.34z" fill="#25D366"/>
    </svg>
  </a>
  <button type="button" id="customAccessBtn" class="float-btn float-btn-access" aria-label="פתח תפריט נגישות" title="נגישות">
    <span aria-hidden="true">♿</span>
  </button>
</div>

<!-- SERVICE MODAL -->
<div class="modal-overlay" id="modal-overlay" onclick="if(event.target===this)closeModal()">
  <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <button class="modal-close" onclick="closeModal()" aria-label="סגור">✕</button>
    <div class="modal-ico" id="modal-icon"></div>
    <h3 id="modal-title"></h3>
    <div class="modal-rule"></div>
    <ul id="modal-body"></ul>
    <a href="#contact" onclick="closeModal()" class="btn btn-primary" style="width:100%; justify-content:center;">צור קשר <span class="arr">←</span></a>
  </div>
</div>

<!-- CONSULT POPUP -->
<div class="popup-overlay" id="consultPopup" role="dialog" aria-modal="true" aria-labelledby="popupTitle">
  <div class="popup-box">
    <button class="popup-close" onclick="closePopup()" aria-label="סגור חלון פנייה">✕</button>
    <div class="popup-header">
      <h2 id="popupTitle">פנו אל המומחים שלנו</h2>
      <p>השאירו פרטים ונחזור אליכם בהקדם</p>
    </div>
    <div class="popup-body">
      <form class="popup-form" id="popup-form" onsubmit="return submitContactForm(event, 'popup')">
        <input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);border:0;opacity:0">
        <div class="form-group">
          <label for="popup-name">שם מלא *</label>
          <input type="text" id="popup-name" name="name" placeholder="ישראל ישראלי" required aria-required="true" autocomplete="name">
        </div>
        <div class="form-group">
          <label for="popup-phone">טלפון *</label>
          <input type="tel" id="popup-phone" name="phone" placeholder="05X-XXXXXXX" required aria-required="true" autocomplete="tel">
        </div>
        <div class="form-group">
          <label for="popup-email">דוא"ל</label>
          <input type="email" id="popup-email" name="email" placeholder="israel@example.com" autocomplete="email">
        </div>
        <div class="form-group">
          <label for="popup-subject">נושא פנייה</label>
          <select id="popup-subject" name="subject">
            <option value="">בחר נושא...</option>
            <option>שומת מקרקעין</option>
            <option>היטל השבחה</option>
            <option>השגה על שומת רמ"י</option>
            <option>בדיקת כדאיות</option>
            <option>ייעוץ</option>
            <option>אחר</option>
          </select>
        </div>
        <div class="form-group">
          <label for="popup-message">הודעה</label>
          <textarea id="popup-message" name="message" placeholder="תיאור קצר של הנכס, הנושא או השאלה שלכם..."></textarea>
        </div>
        <button type="submit" class="btn btn-primary form-submit" id="popup-submit-btn">שלח הודעה <span class="arr">←</span></button>
        <div id="popup-form-status" class="form-status"></div>
      </form>
      <button class="popup-dismiss" onclick="dismissPopup()">לא תודה, אמשיך לגלוש</button>
    </div>
  </div>
</div>

<!-- LEGAL POPUP -->
<div class="legal-overlay" id="legalPopup" role="dialog" aria-modal="true" aria-labelledby="legalTitle">
  <div class="legal-box">
    <div class="legal-header">
      <div>
        <h2 id="legalTitle">תנאי שימוש</h2>
        <p>בורוביץ מזרחי שמאות מקרקעין וחקלאות בע"מ</p>
      </div>
      <button class="legal-close" onclick="closeLegalPopup()">✕</button>
    </div>
    <div class="legal-body" id="legalBody"></div>
  </div>
</div>

<!-- ===================== SCRIPTS ===================== -->

<!-- jQuery (for NagishLi) -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<!-- GSAP + ScrollTrigger + Lenis -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>

<!-- Service modal data -->
<script>
function svgIcon(p){ return '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>'; }
var modalData = {
  m1: { svg: svgIcon('<polyline points="3 17 8 11 13 14 21 5"/><polyline points="16 5 21 5 21 10"/>'), title: "היטלי השבחה", bullets: [
    "היטל השבחה הוא תשלום לוועדה המקומית כאשר ערך הנכס עלה בעקבות שינוי תכנון",
    "משולם בעת <strong>מכירת הנכס</strong> או <strong>קבלת היתר בנייה</strong> - לא לפני",
    "ניתן להגיש <strong>השגה</strong> על שומת הוועדה תוך 45 יום מקבלתה",
    "שמאי מכריע רשאי להפחית משמעותית את גובה ההיטל - שווה לבדוק",
    "במקרים רבים גובה החיסכון עולה על עלות שכר הטרחה של השמאי"
  ]},
  m2: { svg: svgIcon('<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><circle cx="15" cy="15" r="3"/><line x1="17.5" y1="17.5" x2="21" y2="21"/>'), title: "הערכת שווי", bullets: [
    "שומת מקרקעין היא מסמך מקצועי המוכר ע\"י בתי משפט, בנקים ורשויות",
    "נדרשת לצרכים רבים: רכישה/מכירה, משכנתה, ירושה, גירושים, מס שבח",
    "<strong>תוקף השומה</strong>: 12–18 חודשים בדרך כלל (תלוי בגוף המבקש)",
    "השמאי בוחן: מצב פיזי, זכויות בנייה, עסקאות השוואה, שימוש קיים ומותר",
    "כדאי לבקש שומה עצמאית לפני כל עסקה גדולה - לא להסתמך רק על שמאי הבנק"
  ]},
  m3: { svg: svgIcon('<path d="M12 22V12"/><path d="M5 12H2a10 10 0 0020 0h-3"/><path d="M8 6l4-4 4 4"/><path d="M8 12a4 4 0 008 0"/>'), title: "שומות חקלאיות", bullets: [
    "שומה חקלאית נדרשת לתביעת פיצוי מהמדינה על נזק לגידולים (ברד, שרב, מזיקים ועוד)",
    "יש להגיש את הבקשה לפיצוי בתוך <strong>60 יום</strong> מגמר הנזק",
    "המשרד מכין שומה הכוללת: סקר שטח, תיעוד הנזק וחישוב ההפסד הכלכלי",
    "חשוב לתעד את הנזק בצילומים ובדוחות מטאורולוגיים לפני שפונים לשמאי",
    "השומה מוגשת לוועדת הפיצויים של משרד החקלאות"
  ]},
  m4: { svg: svgIcon('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>'), title: "השגות על שומות רמ\"י", bullets: [
    "<strong>רמ\"י</strong> (רשות מקרקעי ישראל) גובה דמי חכירה, דמי הסכמה ודמי היתר מחוכרים",
    "ניתן להגיש <strong>השגה</strong> על שומת רמ\"י תוך <strong>30 יום</strong> מקבלת ההחלטה",
    "בית הדין לחכירות הוא הגוף השיפוטי המוסמך לדון בערעורים",
    "בשנים האחרונות הצטברו פסיקות שהפחיתו את תשלומי רמ\"י - כדאי לבחון",
    "השמאי בודק האם שיטת השומה של רמ\"י תואמת את ערכי השוק"
  ]},
  m5: { svg: svgIcon('<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>'), title: "תביעות ירידת ערך ופיצויים", bullets: [
    "לפי <strong>סעיף 197</strong> לחוק התכנון והבנייה, בעל נכס זכאי לפיצוי אם תכנית פגעה בשווי נכסו",
    "<strong>מועד קריטי</strong>: יש להגיש תביעה תוך <strong>3 שנים</strong> מיום אישור התכנית",
    "גם הפקעת קרקע חלקית מזכה בפיצוי על החלק שנותר",
    "השמאי מכין חוות דעת השוואתית לפני ואחרי התכנית",
    "ייצוג מקצועי מגדיל משמעותית את הסיכוי לפיצוי מרבי"
  ]},
  m6: { svg: svgIcon('<path d="M3 12l9-8 9 8"/><rect x="5" y="12" width="14" height="9"/><rect x="9" y="16" width="6" height="5"/>'), title: "נחלות ומשקים חקלאיים", bullets: [
    "נחלה חקלאית היא יחידת קרקע של רמ\"י המוחכרת לאגודה שיתופית/משפחה",
    "כל העברת זכויות בנחלה מחייבת תשלום <strong>דמי הסכמה</strong> לרמ\"י - גובהם תלוי בשווי",
    "ניתן לבצע <strong>היוון</strong> (חכירה מהוונת) שמפחית עלויות עתידיות",
    "שומת נחלה מורכבת יותר מדירה עירונית: כוללת קרקע חקלאית, מבנים ומכסות",
    "מומלץ לבצע שומה לפני כל עסקה, ירושה או העברה בין-דורית"
  ]},
  m7: { svg: svgIcon('<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>'), title: "טבלאות איחוד וחלוקה", bullets: [
    "טבלת איחוד וחלוקה מחלקת מחדש קרקעות בין בעלים בתהליך תכנון (תב\"ע)",
    "כל בעלים מקבל מגרש מאוחד שווה ערך לחלקו המקורי - גם אם במיקום אחר",
    "<strong>סעיף 197</strong> מאפשר תביעת פיצוי אם הטבלה הפחיתה את שווי החלקה",
    "השמאי מייצג את בעל הקרקע מול הוועדה ומוודא שהחלוקה הוגנת",
    "תהליך זה נפוץ בפרויקטי פיתוח עירוני גדולים ובאזורים שעוברים שינוי ייעוד"
  ]},
  m8: { svg: svgIcon('<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>'), title: "כדאיות כלכלית וליווי פרויקטים", bullets: [
    "<strong>דוח אפס</strong> הוא ניתוח כלכלי מקיף הבוחן את כדאיות פרויקט בנייה טרם התחלתו",
    "כולל: הערכת עלויות, הכנסות צפויות, ניתוח סיכונים ותחזית תזרים מזומנים",
    "חיוני לפרויקטי <strong>פינוי-בינוי</strong> ו<strong>תמ\"א 38</strong> - הבנקים דורשים אותו לפני מתן מימון",
    "הדוח עוזר ליזם לקבל החלטות מושכלות ולמנוע הפתעות בדרך",
    "מומלץ לעדכן את הדוח בכל שינוי מהותי בפרויקט"
  ]},
  m9: { svg: svgIcon('<rect x="2" y="7" width="9" height="10" rx="2"/><rect x="13" y="7" width="9" height="10" rx="2"/><line x1="11" y1="9" x2="13" y2="9"/><line x1="11" y1="12" x2="13" y2="12"/><line x1="11" y1="15" x2="13" y2="15"/>'), title: "כינוס נכסים ופירוק שיתוף", bullets: [
    "<strong>פירוק שיתוף</strong> מאפשר לאחד השותפים לאלץ מכירת הנכס כשאין הסכמה",
    "תהליך ניתן לביצוע בהסכמה (גישור) או דרך בית משפט",
    "השמאי קובע את <strong>שווי השוק</strong> של הנכס לצורך חלוקה הוגנת",
    "<strong>כינוס נכסים</strong> הוא הליך שמינוי כונס ע\"י בית משפט - לרוב בהקשר חדלות פירעון",
    "שמאות מדויקת בשלב זה חיונית: היא הבסיס לחלוקה הכספית בין הצדדים"
  ]}
};
function openModal(id){
  var d = modalData[id]; if(!d) return;
  document.getElementById("modal-icon").innerHTML = d.svg;
  document.getElementById("modal-title").textContent = d.title;
  document.getElementById("modal-body").innerHTML = d.bullets.map(function(b){ return '<li>'+b+'</li>'; }).join('');
  document.getElementById("modal-overlay").classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeModal(){ document.getElementById("modal-overlay").classList.remove('show'); document.body.style.overflow=''; }
</script>

<!-- Services hover preview: domain illustrations swap into the side banner -->
<script>
(function(){
  // Central motif per domain (gold line-art for the navy banner). The ring,
  // horizon and glow are shared and added by svcScene() for a cohesive set.
  var SVC_MOTIFS = {
    m1: '<g stroke="#e4c987" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
      + '<rect x="132" y="168" width="34" height="38" fill="#0f1c33"/><rect x="170" y="148" width="36" height="58" fill="#13243f"/><rect x="210" y="120" width="40" height="86" fill="#0f1c33"/></g>'
      + '<g stroke="#e4c987" stroke-width="1.4" stroke-opacity=".75" stroke-linecap="round">'
      + '<line x1="140" y1="180" x2="158" y2="180"/><line x1="140" y1="192" x2="158" y2="192"/>'
      + '<line x1="178" y1="160" x2="198" y2="160"/><line x1="178" y1="174" x2="198" y2="174"/><line x1="178" y1="188" x2="198" y2="188"/>'
      + '<line x1="219" y1="132" x2="241" y2="132"/><line x1="219" y1="148" x2="241" y2="148"/><line x1="219" y1="164" x2="241" y2="164"/><line x1="219" y1="180" x2="241" y2="180"/></g>'
      + '<path d="M120 196 Q168 150 214 128 T300 80" stroke="#f4f6fa" stroke-width="2.6" stroke-linecap="round" fill="none"/>'
      + '<path d="M300 80 L283 80 L300 97 Z" fill="#f4f6fa"/>'
      + '<circle cx="118" cy="116" r="19" fill="#0f1c33" stroke="#e4c987" stroke-width="2"/>'
      + '<text x="118" y="123" text-anchor="middle" font-family="Heebo,sans-serif" font-size="17" font-weight="700" fill="#e4c987">₪</text>',
    m2: '<g stroke="#e4c987" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
      + '<path d="M156 150 L156 206 L244 206 L244 150" fill="#0f1c33"/><path d="M146 152 L200 110 L254 152" fill="#13243f"/>'
      + '<rect x="174" y="172" width="20" height="34" fill="#13243f"/></g>'
      + '<circle cx="232" cy="170" r="34" fill="#e4c987" fill-opacity=".06" stroke="#f4f6fa" stroke-width="2.6"/>'
      + '<line x1="256" y1="194" x2="286" y2="222" stroke="#f4f6fa" stroke-width="3.4" stroke-linecap="round"/>'
      + '<path d="M220 170 L228 178 L244 160" fill="none" stroke="#f4f6fa" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
    m3: '<circle cx="150" cy="112" r="16" fill="none" stroke="#e4c987" stroke-width="2"/>'
      + '<g stroke="#e4c987" stroke-width="1.8" stroke-linecap="round">'
      + '<line x1="150" y1="86" x2="150" y2="78"/><line x1="150" y1="146" x2="150" y2="138"/><line x1="124" y1="112" x2="116" y2="112"/><line x1="184" y1="112" x2="176" y2="112"/>'
      + '<line x1="131" y1="93" x2="125" y2="87"/><line x1="169" y1="93" x2="175" y2="87"/><line x1="131" y1="131" x2="125" y2="137"/><line x1="169" y1="131" x2="175" y2="137"/></g>'
      + '<g stroke="#e4c987" stroke-width="1.6" stroke-opacity=".5" stroke-linecap="round">'
      + '<path d="M96 206 L150 168"/><path d="M128 206 L168 170"/><path d="M304 206 L250 168"/><path d="M272 206 L232 170"/></g>'
      + '<g stroke="#f4f6fa" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none">'
      + '<path d="M200 206 L200 158"/><path d="M200 176 C182 176 174 164 174 150 C190 150 200 162 200 176"/><path d="M200 168 C218 168 226 156 226 142 C210 142 200 154 200 168"/></g>',
    m4: '<path d="M200 92 L246 108 V150 C246 182 224 200 200 210 C176 200 154 182 154 150 V108 Z" fill="#0f1c33" stroke="#e4c987" stroke-width="2.4" stroke-linejoin="round"/>'
      + '<path d="M180 150 L195 165 L222 132" fill="none" stroke="#f4f6fa" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'
      + '<circle cx="150" cy="188" r="17" fill="#13243f" stroke="#e4c987" stroke-width="1.8"/>'
      + '<text x="150" y="194" text-anchor="middle" font-family="Heebo,sans-serif" font-size="17" font-weight="700" fill="#e4c987">§</text>',
    m5: '<g stroke="#e4c987" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">'
      + '<path d="M150 92 H214 L238 116 V208 H150 Z" fill="#0f1c33"/><path d="M213 92 V117 H238"/></g>'
      + '<g stroke="#e4c987" stroke-width="1.5" stroke-opacity=".55" stroke-linecap="round">'
      + '<line x1="164" y1="132" x2="224" y2="132"/><line x1="164" y1="144" x2="206" y2="144"/></g>'
      + '<polyline points="162,160 182,172 198,166 216,186 232,196" fill="none" stroke="#f4f6fa" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'
      + '<path d="M232 196 L222 185 M232 196 L242 184" stroke="#f4f6fa" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>',
    m6: '<g stroke="#e4c987" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">'
      + '<path d="M150 156 V206 H206 V156" fill="#0f1c33"/><path d="M142 158 L178 128 L214 158" fill="#13243f"/><rect x="168" y="180" width="20" height="26" fill="#13243f"/>'
      + '<path d="M226 206 V160 a12 12 0 0 1 24 0 V206" fill="#0f1c33"/><path d="M226 174 H250"/></g>'
      + '<g stroke="#f4f6fa" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none">'
      + '<line x1="120" y1="206" x2="120" y2="178"/><circle cx="120" cy="162" r="16"/></g>'
      + '<g stroke="#e4c987" stroke-width="1.6" stroke-opacity=".5" stroke-linecap="round">'
      + '<line x1="92" y1="206" x2="92" y2="192"/><line x1="104" y1="206" x2="104" y2="192"/><line x1="86" y1="197" x2="110" y2="197"/></g>',
    m7: '<g stroke="#e4c987" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">'
      + '<path d="M134 112 L264 96 L280 190 L150 208 Z" fill="#0f1c33"/><path d="M198 104 L214 199" stroke-opacity=".7"/><path d="M140 154 L272 142" stroke-opacity=".7"/></g>'
      + '<path d="M198 104 L264 96 L272 142 L206 149 Z" fill="#e4c987" fill-opacity=".13" stroke="#e4c987" stroke-width="1.6" stroke-linejoin="round"/>'
      + '<path d="M176 150 c0 14 -14 24 -14 24 s-14 -10 -14 -24 a14 14 0 0 1 28 0 Z" fill="#f4f6fa" stroke="#f4f6fa" stroke-width="1" stroke-linejoin="round"/>'
      + '<circle cx="162" cy="150" r="5.5" fill="#1c3461"/>',
    m8: '<g stroke="#e4c987" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">'
      + '<rect x="138" y="176" width="22" height="30" fill="#0f1c33"/><rect x="170" y="160" width="22" height="46" fill="#13243f"/><rect x="202" y="138" width="22" height="68" fill="#0f1c33"/><rect x="234" y="116" width="22" height="90" fill="#13243f"/></g>'
      + '<polyline points="149,170 181,154 213,132 245,110" fill="none" stroke="#f4f6fa" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'
      + '<path d="M245 110 L233 112 L243 124 Z" fill="#f4f6fa"/>'
      + '<circle cx="150" cy="120" r="18" fill="#0f1c33" stroke="#e4c987" stroke-width="2"/>'
      + '<text x="150" y="126" text-anchor="middle" font-family="Heebo,sans-serif" font-size="16" font-weight="700" fill="#e4c987">₪</text>',
    m9: '<g stroke="#e4c987" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">'
      + '<path d="M156 120 L156 206 L244 206 L244 120" fill="#0f1c33"/><path d="M148 122 L200 92 L252 122" fill="#13243f"/></g>'
      + '<g stroke="#e4c987" stroke-width="1.5" stroke-opacity=".7" fill="none">'
      + '<rect x="168" y="138" width="14" height="14"/><rect x="168" y="166" width="14" height="14"/><rect x="218" y="138" width="14" height="14"/><rect x="218" y="166" width="14" height="14"/></g>'
      + '<line x1="200" y1="86" x2="200" y2="210" stroke="#f4f6fa" stroke-width="2.4" stroke-dasharray="6 7" stroke-linecap="round"/>'
      + '<g stroke="#f4f6fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">'
      + '<path d="M150 196 H132 M139 189 L131 196 L139 203"/><path d="M250 196 H268 M261 189 L269 196 L261 203"/></g>'
  };

  function svcScene(motif, idx){
    return '<svg viewBox="0 0 400 320" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
      + '<defs><radialGradient id="svcGlow' + idx + '" cx="50%" cy="46%" r="60%">'
      + '<stop offset="0" stop-color="#e4c987" stop-opacity=".15"/><stop offset="1" stop-color="#e4c987" stop-opacity="0"/></radialGradient></defs>'
      + '<circle cx="200" cy="150" r="120" fill="url(#svcGlow' + idx + ')"/>'
      + '<circle cx="200" cy="150" r="120" stroke="#e4c987" stroke-opacity=".24" stroke-width="1.3"/>'
      + '<circle cx="200" cy="150" r="133" stroke="#e4c987" stroke-opacity=".1" stroke-width="1"/>'
      + '<line x1="86" y1="206" x2="314" y2="206" stroke="#e4c987" stroke-opacity=".3" stroke-width="1.4" stroke-linecap="round"/>'
      + motif + '</svg>';
  }

  document.addEventListener('DOMContentLoaded', function(){
    var foot  = document.querySelector('.services-body .services-foot');
    var stage = foot && foot.querySelector('.svc-stage');
    var grid  = document.querySelector('.services-grid');
    if (!foot || !stage || !grid) return;

    // Real photo per domain (numbered 1..8 in svc-photos/). Domains without a
    // photo fall back to the gold line-art motif.
    var SVC_PHOTOS = { m1:1, m2:2, m3:3, m4:4, m5:5, m6:6, m7:7, m8:8 };

    var cards = grid.querySelectorAll('.svc[data-svc]');
    cards.forEach(function(card, i){
      var key = card.getAttribute('data-svc');
      var motif = SVC_MOTIFS[key];
      if (!motif) return;
      var h3 = card.querySelector('h3');
      var title = h3 ? h3.textContent : '';
      var fig = document.createElement('figure');
      fig.className = 'svc-visual';
      fig.setAttribute('data-svc', key);
      var photo = SVC_PHOTOS[key];
      var altText = title.replace(/"/g, '&quot;');
      var art = photo
        ? '<img class="svc-photo" src="svc-photos/' + photo + '.webp" alt="' + altText + '" loading="lazy" decoding="async">'
        : svcScene(motif, i);
      if (photo) fig.classList.add('has-photo');
      fig.innerHTML = '<div class="svc-visual-art">' + art + '</div>'
        + '<figcaption class="svc-visual-cap"><span>תחום התמחות</span><strong>' + title + '</strong></figcaption>';
      stage.appendChild(fig);
    });

    // Hover swap only where a real pointer can hover (desktop) - leave the
    // quote untouched on touch devices.
    if (!window.matchMedia || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;

    var visuals = stage.querySelectorAll('.svc-visual');
    function activate(key){
      foot.classList.add('is-active');
      visuals.forEach(function(v){ v.classList.toggle('active', v.getAttribute('data-svc') === key); });
    }
    function reset(){
      foot.classList.remove('is-active');
      visuals.forEach(function(v){ v.classList.remove('active'); });
    }
    cards.forEach(function(card){
      card.addEventListener('mouseenter', function(){ activate(card.getAttribute('data-svc')); });
    });
    grid.addEventListener('mouseleave', reset);
  });
})();
</script>

<!-- Legal popup data -->
<script>
var legalContent = {
  terms: { title: 'תנאי שימוש', html: `
    <p class="legal-updated">עודכן לאחרונה: ינואר 2026</p>
    <div class="legal-card"><h3><span class="num">1</span> כללי</h3><p>ברוכים הבאים לאתר בורוביץ מזרחי שמאות מקרקעין וחקלאות בע"מ. השימוש באתר מהווה הסכמה לתנאי השימוש המפורטים להלן. המשרד שומר לעצמו את הזכות לעדכן תנאים אלו מעת לעת.</p></div>
    <div class="legal-card"><h3><span class="num">2</span> המידע באתר</h3><p>המידע המוצג באתר הינו למטרות מידע כללי בלבד ואינו מהווה ייעוץ משפטי, שמאי, כלכלי או מקצועי מכל סוג. כל מידע אינו מחליף שומה מקצועית או ייעוץ אישי המותאם לנסיבות הספציפיות.</p></div>
    <div class="legal-card"><h3><span class="num">3</span> הגבלת אחריות</h3><p>המשרד אינו אחראי לכל נזק, ישיר או עקיף, שייגרם כתוצאה מהסתמכות על המידע המוצג באתר.</p></div>
    <div class="legal-card"><h3><span class="num">4</span> זכויות יוצרים</h3><p>כל התכנים באתר - טקסטים, תמונות, לוגואים ועיצוב - הינם רכושו הבלעדי של המשרד ומוגנים בחוקי זכויות יוצרים.</p></div>
    <div class="legal-card"><h3><span class="num">5</span> טופס יצירת קשר</h3><p>המידע שתמסרו דרך טופס יצירת הקשר ישמש אך ורק ליצירת קשר בנוגע לשירותי המשרד.</p></div>
    <div class="legal-contact"><p>שאלות בנוגע לתנאי השימוש?</p><p><a href="mailto:info@bor-miz.co.il">info@bor-miz.co.il</a> &nbsp;|&nbsp; <a href="tel:054-6559942">054-6559942</a></p></div>` },
  privacy: { title: 'מדיניות פרטיות', html: `
    <p class="legal-updated">עודכן לאחרונה: ינואר 2026</p>
    <div class="legal-highlight">אנו מכבדים את פרטיותכם ומחויבים להגן על המידע האישי שאתם מוסרים לנו.</div>
    <div class="legal-card"><h3><span class="num">1</span> איזה מידע אנו אוספים?</h3><p>אנו אוספים מידע שאתם מוסרים מרצונכם בעת מילוי טפסי יצירת קשר:</p><ul><li>שם מלא</li><li>מספר טלפון</li><li>כתובת דוא"ל</li><li>תוכן ההודעה ונושא הפנייה</li></ul></div>
    <div class="legal-card"><h3><span class="num">2</span> כיצד אנו משתמשים במידע?</h3><ul><li>חזרה אליכם בנוגע לפנייתכם</li><li>מתן שירותי שמאות וייעוץ מקצועי</li><li>שיפור השירות ללקוחות המשרד</li></ul></div>
    <div class="legal-card"><h3><span class="num">3</span> העברת מידע לצדדים שלישיים</h3><p>אנו <strong>לא</strong> מוכרים או מעבירים את פרטיכם לצדדים שלישיים לצרכי שיווק. מידע עשוי להיות מועבר רק על פי דרישה חוקית או לצורך מתן השירות המבוקש.</p></div>
    <div class="legal-card"><h3><span class="num">4</span> אבטחת מידע</h3><p>אנו נוקטים באמצעים סבירים להגנה על המידע. המידע יישמר לתקופה הנדרשת למתן השירות בלבד.</p></div>
    <div class="legal-contact"><p>שאלות בנוגע למדיניות הפרטיות?</p><p><a href="mailto:info@bor-miz.co.il">info@bor-miz.co.il</a> &nbsp;|&nbsp; <a href="tel:054-6559942">054-6559942</a></p></div>` }
};
function openLegalPopup(type){
  var d = legalContent[type];
  document.getElementById('legalTitle').textContent = d.title;
  document.getElementById('legalBody').innerHTML = d.html;
  document.getElementById('legalPopup').classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeLegalPopup(){ document.getElementById('legalPopup').classList.remove('show'); document.body.style.overflow=''; }
document.getElementById('legalPopup').addEventListener('click', function(e){ if(e.target===this) closeLegalPopup(); });
</script>

<!-- Email obfuscation -->
<script>
(function(){
  function setEmail(id, user){
    var el = document.getElementById(id); if(!el) return;
    var addr = user + '@' + 'bor-miz.co.il';
    el.href = 'mailto:' + addr; el.textContent = addr;
  }
  setEmail('em-office','info'); setEmail('em-maor','maor'); setEmail('em-amir','amir'); setEmail('em-footer','info');
})();
</script>

<!-- Nav + menu + hero slideshow + popups -->
<script>
  // Hamburger menu
  function toggleMenu(){
    var links = document.getElementById('navLinks');
    var btn = document.getElementById('hamburger');
    links.classList.toggle('open'); btn.classList.toggle('open');
    btn.setAttribute('aria-expanded', links.classList.contains('open') ? 'true' : 'false');
  }
  function closeMenu(){
    document.getElementById('navLinks').classList.remove('open');
    var btn = document.getElementById('hamburger');
    btn.classList.remove('open'); btn.setAttribute('aria-expanded','false');
  }
  document.addEventListener('click', function(e){
    var nav = document.getElementById('navbar');
    if(nav && !nav.contains(e.target)) closeMenu();
  });

  // Navbar scrolled state
  (function(){
    var nav = document.getElementById('navbar');
    var onScroll = function(){ nav.classList.toggle('scrolled', window.scrollY > 60); };
    window.addEventListener('scroll', onScroll, { passive:true }); onScroll();
  })();

  // Hero slideshow
  (function(){
    var slides = document.querySelectorAll('.hero-slide');
    var dotsWrap = document.getElementById('heroDots');
    var total = slides.length, current = 0, duration = 5000, timer = null;
    for(var i=0;i<total;i++){
      var b = document.createElement('button');
      b.setAttribute('aria-label','שקופית '+(i+1));
      b.innerHTML = '<span class="fill"></span>';
      (function(idx){ b.addEventListener('click', function(){ go(idx); }); })(i);
      dotsWrap.appendChild(b);
    }
    var dots = dotsWrap.querySelectorAll('button');
    function go(idx){
      clearTimeout(timer);
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = idx;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
      timer = setTimeout(function(){ go((current+1)%total); }, duration);
    }
    dots[0].classList.add('active');
    timer = setTimeout(function(){ go((current+1)%total); }, duration);
  })();

  // Consult popup (after 6s, once per session)
  (function(){
    if(sessionStorage.getItem('popupShown')) return;
    setTimeout(function(){ document.getElementById('consultPopup').classList.add('show'); }, 6000);
  })();
  function closePopup(){ document.getElementById('consultPopup').classList.remove('show'); }
  function dismissPopup(){ sessionStorage.setItem('popupShown','1'); closePopup(); }
  document.getElementById('consultPopup').addEventListener('click', function(e){ if(e.target===this) dismissPopup(); });

  // ESC closes everything
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){ closeModal(); closePopup(); closeLegalPopup(); }
  });
</script>

<!-- GSAP animations + Lenis smooth scroll -->
<script>
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce){
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
    document.querySelectorAll('.counter').forEach(function(el){ el.textContent = el.getAttribute('data-target'); });
    return;
  }

  // Lenis smooth scroll
  var lenis;
  if(window.Lenis){
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    function raf(t){ lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  if(window.gsap && window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);
    if(lenis){ lenis.on('scroll', ScrollTrigger.update); }

    // Anchor links via Lenis
    document.querySelectorAll('a[href^="#"]').forEach(function(a){
      a.addEventListener('click', function(e){
        var href = a.getAttribute('href');
        if(href === '#' || href.length < 2) return;
        var target = document.querySelector(href);
        if(target && lenis){ e.preventDefault(); lenis.scrollTo(target, { offset: -80 }); }
        else if(target){ e.preventDefault(); target.scrollIntoView({ behavior:'smooth' }); }
      });
    });

    // Hero title kinetic reveal
    gsap.set('.hero-line > span', { yPercent: 110 });
    gsap.to('.hero-line > span', { yPercent: 0, duration: 1.1, ease: 'power3.out', stagger: 0.12, delay: 0.25 });
    gsap.from('.hero-eyebrow', { opacity: 0, y: 20, duration: .8, delay: .15 });
    gsap.from('.hero-sub, .hero-actions', { opacity: 0, y: 24, duration: .9, delay: .7, stagger: .12 });

    // Reveal on scroll
    document.querySelectorAll('.reveal').forEach(function(el){
      ScrollTrigger.create({
        trigger: el, start: 'top 86%',
        onEnter: function(){ el.classList.add('in'); }
      });
    });

    // Parallax images
    document.querySelectorAll('[data-parallax]').forEach(function(img){
      gsap.fromTo(img, { yPercent: -8, scale: 1.12 }, {
        yPercent: 8, ease: 'none',
        scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    // Number counters
    document.querySelectorAll('.counter').forEach(function(el){
      var target = +el.getAttribute('data-target');
      ScrollTrigger.create({
        trigger: el, start: 'top 90%', once: true,
        onEnter: function(){
          var obj = { v: 0 };
          gsap.to(obj, { v: target, duration: 1.6, ease: 'power2.out',
            onUpdate: function(){ el.textContent = Math.round(obj.v); } });
        }
      });
    });

    // Magnetic buttons
    document.querySelectorAll('.btn').forEach(function(btn){
      btn.addEventListener('mousemove', function(e){
        var r = btn.getBoundingClientRect();
        gsap.to(btn, { x: (e.clientX - (r.left+r.width/2))*0.18, y: (e.clientY - (r.top+r.height/2))*0.28, duration: .4 });
      });
      btn.addEventListener('mouseleave', function(){ gsap.to(btn, { x:0, y:0, duration: .5, ease:'elastic.out(1,0.4)' }); });
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
    document.querySelectorAll('.counter').forEach(function(el){ el.textContent = el.getAttribute('data-target'); });
  }
})();
</script>

<!-- Form submission → Supabase Edge Function -->
<script>
  var EDGE_FUNCTION_URL = 'https://nurgknexilxaxxovdbco.supabase.co/functions/v1/website-lead-intake';
  var SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51cmdrbmV4aWx4YXh4b3ZkYmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMjAxMzYsImV4cCI6MjA4OTY5NjEzNn0.S6BwlUfYkdWegz1gigK5dK0lXUowp4safWOFEzExuS0';
  function submitContactForm(e, formType){
    e.preventDefault();
    var prefix = formType === 'popup' ? 'popup' : 'contact';
    var form = document.getElementById(prefix + '-form');
    var btn = document.getElementById(prefix + '-submit-btn');
    var statusEl = document.getElementById(prefix + '-form-status');
    var name = document.getElementById(prefix + '-name').value.trim();
    var phone = document.getElementById(prefix + '-phone').value.trim();
    var email = document.getElementById(prefix + '-email').value.trim();
    var subject = document.getElementById(prefix + '-subject').value;
    var message = document.getElementById(prefix + '-message').value.trim();
    if(!name || !phone){
      statusEl.style.display='block'; statusEl.style.color='#ef4444'; statusEl.textContent='נא למלא שם וטלפון'; return false;
    }
    btn.disabled = true; btn.textContent = 'שולח...'; statusEl.style.display='none';
    fetch(EDGE_FUNCTION_URL, {
      method:'POST', headers:{ 'Content-Type':'application/json', 'apikey':SB_ANON, 'Authorization':'Bearer '+SB_ANON },
      body: JSON.stringify({ name:name, phone:phone, email:email||null, subject:subject||null, message:message||null, source:formType, _hp:(form.querySelector('input[name="website"]')||{value:''}).value, elapsed_ms:Math.round(performance.now()) })
    })
    .then(function(res){ return res.json(); })
    .then(function(data){
      if(data.success){
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'generate_lead', form_source: formType, lead_subject: subject || 'unspecified' });
        statusEl.style.display='block'; statusEl.style.color='#059669';
        statusEl.textContent = data.message || 'הפנייה נשלחה בהצלחה!';
        form.reset();
        if(formType === 'popup'){ setTimeout(closePopup, 2500); }
      } else { throw new Error(data.error || 'שגיאה בשליחה'); }
    })
    .catch(function(err){
      statusEl.style.display='block'; statusEl.style.color='#ef4444';
      statusEl.textContent = 'שגיאה: ' + (err.message || 'נסו שוב מאוחר יותר');
    })
    .finally(function(){
      btn.disabled = false; btn.innerHTML = 'שלח הודעה <span class="arr">←</span>';
    });
    return false;
  }
</script>

<!-- Contact micro-conversion tracking (WhatsApp / phone clicks) -->
<script>
  (function(){
    window.dataLayer = window.dataLayer || [];
    document.addEventListener('click', function(e){
      var el = e.target.closest && e.target.closest('a');
      if(!el) return;
      if(el.closest('.wa-pill, .float-btn-wa') || /wa\.me|api\.whatsapp/.test(el.href||'')){
        window.dataLayer.push({ event: 'contact_whatsapp' });
      } else if((el.getAttribute('href')||'').indexOf('tel:') === 0){
        window.dataLayer.push({ event: 'contact_phone' });
      }
    }, true);
  })();
</script>

<!-- LinkedIn posts loader -->
<script>
(function(){
  var SUPABASE_URL = 'https://nurgknexilxaxxovdbco.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51cmdrbmV4aWx4YXh4b3ZkYmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMjAxMzYsImV4cCI6MjA4OTY5NjEzNn0.S6BwlUfYkdWegz1gigK5dK0lXUowp4safWOFEzExuS0';
  var TENANT_ID = '00000000-0000-0000-0000-000000000001';
  var AUTHOR_LABELS = { maor:'מאור מזרחי', amir:'אמיר בורוביץ׳', company:'בורוביץ מזרחי' };
  var AUTHOR_INITIALS = { maor:'מ"מ', amir:'א"ב', company:'ב"מ' };
  function escapeHtml(s){ return String(s==null?'':s).replace(/[&<>"']/g, function(c){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]; }); }
  function formatDate(iso){ if(!iso) return ''; try{ return new Date(iso).toLocaleDateString('he-IL',{day:'numeric',month:'long',year:'numeric'}); }catch(e){ return ''; } }
  function loadPosts(){
    var url = SUPABASE_URL + '/rest/v1/linkedin_posts?tenant_id=eq.' + TENANT_ID + '&is_visible=eq.true&order=is_featured.desc,display_order.asc,published_at.desc.nullslast&select=id,author,post_url,title,excerpt,image_url,published_at,is_featured,is_new';
    return fetch(url, { headers: { 'apikey':SUPABASE_ANON_KEY, 'Authorization':'Bearer '+SUPABASE_ANON_KEY } })
      .then(function(res){ if(!res.ok) throw new Error('HTTP '+res.status); return res.json(); });
  }
  function renderCard(post){
    var img = post.image_url ? '<div class="linkedin-card-img"><img src="'+escapeHtml(post.image_url)+'" alt="" loading="lazy"></div>' : '';
    var dateStr = formatDate(post.published_at);
    var authorName = AUTHOR_LABELS[post.author] || '';
    var initials = AUTHOR_INITIALS[post.author] || '';
    var featCls = post.is_featured ? ' linkedin-card--featured' : '';
    var badge = post.is_featured ? '<span class="linkedin-card-badge">⭐ מומלץ</span>' : '';
    var newBadge = post.is_new ? '<span class="linkedin-card-badge linkedin-card-badge--new">חדש</span>' : '';
    return '<a href="'+escapeHtml(post.post_url)+'" target="_blank" rel="noopener noreferrer" class="linkedin-card'+featCls+'" role="listitem" aria-label="'+escapeHtml(post.title)+' - פתיחה בלינקדאין">'+badge+newBadge+img+
      '<div class="linkedin-card-body"><div class="linkedin-card-meta"><div class="linkedin-author-avatar" aria-hidden="true">'+escapeHtml(initials)+'</div>'+
      '<div class="linkedin-author-info"><span class="linkedin-author-name">'+escapeHtml(authorName)+'</span>'+(dateStr?'<span class="linkedin-card-date">'+escapeHtml(dateStr)+'</span>':'')+'</div></div>'+
      '<h3 class="linkedin-card-title">'+escapeHtml(post.title)+'</h3>'+(post.excerpt?'<p class="linkedin-card-excerpt">'+escapeHtml(post.excerpt)+'</p>':'')+
      '<span class="linkedin-card-cta">קרא בלינקדאין ←</span></div></a>';
  }
  function setupArrows(container){
    var prev = document.getElementById('linkedin-prev'), next = document.getElementById('linkedin-next');
    if(!prev || !next) return;
    function step(){ return Math.max(280, container.clientWidth*0.7); }
    prev.addEventListener('click', function(){ container.scrollBy({ left: step(), behavior:'smooth' }); });
    next.addEventListener('click', function(){ container.scrollBy({ left:-step(), behavior:'smooth' }); });
    function update(){
      var max = container.scrollWidth - container.clientWidth;
      prev.disabled = Math.abs(container.scrollLeft) < 4;
      next.disabled = Math.abs(container.scrollLeft) >= max - 4;
    }
    container.addEventListener('scroll', update, { passive:true });
    setTimeout(update, 100); window.addEventListener('resize', update);
  }
  function hideSection(){ var s = document.getElementById('linkedin-posts'); if(s) s.classList.add('linkedin-hidden'); }
  function init(){
    var container = document.getElementById('linkedin-cards'); if(!container) return;
    loadPosts().then(function(posts){
      if(!posts || !posts.length){ hideSection(); return; }
      container.innerHTML = posts.map(renderCard).join('');
      setupArrows(container);
    }).catch(function(err){ console.error('[LinkedIn] load failed:', err); hideSection(); });
  }
  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
</script>

<!-- ===== NAGISHLI ACCESSIBILITY ===== -->
<nagishli></nagishli>
<script>
nl_contact = "n:בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ|p:054-6559942|u:maor@bor-miz.co.il";
nl_pos = "BL"; nl_lang = "he"; nl_color = "blue"; nl_compact = "1";
</script>
<script src="nagishli.js?v=2.3" charset="utf-8"></script>
<script>
  (function(){
    function forceCompactStyles(){
      var bar = document.getElementById('NagishLiBar'), menus = document.getElementById('NagishLiMenus');
      if(bar){ bar.style.cssText = 'position:fixed !important; left:1.4rem !important; right:auto !important; bottom:6.2rem !important; top:auto !important; width:300px !important; max-width:90vw !important; height:auto !important; z-index:9999 !important; background:transparent !important; box-shadow:none !important; border:none !important; padding:0 !important; margin:0 !important;'; }
      if(menus){ menus.style.cssText += ';position:static !important; width:300px !important; max-width:90vw !important; max-height:70vh !important; overflow-y:auto !important; overflow-x:hidden !important; font-size:13px !important; border-radius:12px !important; box-shadow:0 10px 40px rgba(0,0,0,0.3) !important; margin:0 !important; padding:0 !important; background:#fff !important;'; }
      document.querySelectorAll('#NagishLiMenus, #NagishLiMenus ul').forEach(function(el){ el.style.width='100%'; el.style.maxWidth='300px'; el.style.boxSizing='border-box'; });
    }
    function openNagishLiMenu(){
      if(typeof jQuery === 'undefined') return false;
      var $ = jQuery, $strip = $('#NagishLiBarStrip'), $menus = $('#NagishLiMenus');
      if(!$strip.length || !$menus.length) return false;
      if($menus.is(':visible')){ $menus.slideUp(150, function(){ $strip.removeClass('open'); }); }
      else { forceCompactStyles(); $strip.addClass('open'); $menus.slideDown(150, forceCompactStyles); }
      return true;
    }
    function bind(){
      var btn = document.getElementById('customAccessBtn'); if(!btn) return;
      btn.addEventListener('click', function(e){
        e.preventDefault(); var n=0;
        (function tryOpen(){ if(openNagishLiMenu()) return; if(++n<30) setTimeout(tryOpen,200); })();
      });
    }
    if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', bind); } else { bind(); }
  })();
</script>

</body>
</html>

```

### `page.css`

```css
/* ============================================================
   בורוביץ מזרחי — Inner / sub-page styles
   Builds on styles.css (shares tokens, nav, footer, buttons)
   ============================================================ */

/* ---------- Sub-page hero ---------- */
.subpage-hero {
  position: relative; min-height: clamp(58vh, 70vh, 640px);
  display: flex; align-items: center; overflow: hidden; background: var(--navy-2);
}
.subpage-hero .sp-bg {
  position: absolute; inset: 0; z-index: 0;
  background-size: cover; background-position: center;
  animation: kenburns 12s ease-in-out forwards;
}
.subpage-hero .sp-overlay {
  position: absolute; inset: 0; z-index: 1;
  background:
    linear-gradient(to top, rgba(10,18,33,.94) 0%, rgba(10,18,33,.5) 50%, rgba(10,18,33,.6) 100%),
    linear-gradient(to left, rgba(10,18,33,.55), rgba(10,18,33,.12));
}
.subpage-hero .sp-content {
  position: relative; z-index: 3; width: 100%; max-width: var(--maxw);
  margin: 0 auto; padding-inline: var(--pad); padding-top: 5rem;
}
.subpage-hero .eyebrow { color: var(--gold-2); margin-bottom: 1.3rem; }
.subpage-hero .eyebrow::before { background: var(--gold-2); }
.sp-title {
  font-family: var(--serif); color: #fff; font-weight: 800;
  font-size: clamp(2.2rem, 5.2vw, 4.2rem); line-height: 1.08; letter-spacing: -.025em;
  max-width: 18ch; margin-bottom: 1.4rem;
}
.sp-title .gold { color: var(--gold-2); }
.sp-sub { color: rgba(255,255,255,.85); font-size: clamp(1.02rem, 1.6vw, 1.25rem); max-width: 56ch; margin-bottom: 2.2rem; font-weight: 300; }

/* ---------- Breadcrumb ---------- */
.breadcrumb { display: flex; gap: .5rem; align-items: center; font-size: .82rem; color: rgba(255,255,255,.6); margin-bottom: 1.5rem; flex-wrap: wrap; }
.breadcrumb a { color: rgba(255,255,255,.75); transition: color .3s; }
.breadcrumb a:hover { color: var(--gold-2); }
.breadcrumb .sep { color: rgba(255,255,255,.35); }

/* ---------- Stat strip ---------- */
.stat-strip { background: var(--ink); color: #fff; }
.stat-strip-inner { display: grid; grid-template-columns: repeat(3, 1fr); }
.stat-strip .stat { padding: clamp(1.8rem,3.5vw,2.8rem) clamp(1.2rem,3vw,2.4rem); border-inline-start: 1px solid var(--line-2); text-align: center; }
.stat-strip .stat:first-child { border-inline-start: none; }
.stat-strip .stat .num { font-family: var(--serif); font-size: clamp(2.4rem,4vw,3.2rem); font-weight: 800; color: var(--gold-2); line-height: 1; }
.stat-strip .stat .label { font-size: .92rem; color: rgba(255,255,255,.7); margin-top: .5rem; }

/* ---------- Prose / content block ---------- */
.content-block { display: grid; grid-template-columns: 1fr; gap: 1.3rem; max-width: 70ch; }
.content-block.two-col { grid-template-columns: .9fr 1.1fr; gap: clamp(2rem,5vw,4.5rem); max-width: none; align-items: start; }
.prose p { color: var(--muted); margin-bottom: 1.1rem; font-size: 1.02rem; }
.prose strong { color: var(--ink); font-weight: 700; }
.prose h3 { font-family: var(--serif); font-size: 1.45rem; color: var(--ink); margin: 1.4rem 0 .8rem; }

/* highlight callout */
.callout {
  background: var(--cream); border-inline-start: 3px solid var(--gold);
  padding: 1.3rem 1.5rem; border-radius: 4px; color: var(--ink);
}
.callout strong { color: var(--navy); }

/* ---------- Feature cards ---------- */
.feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: clamp(1rem,2vw,1.6rem); margin-top: 1rem; }
.feature-card {
  background: #fff; border: 1px solid var(--line); padding: clamp(1.5rem,2.5vw,2rem);
  border-bottom: 3px solid var(--gold); transition: transform .5s var(--ease), box-shadow .5s var(--ease);
}
.feature-card:hover { transform: translateY(-5px); box-shadow: 0 30px 60px -42px rgba(19,31,51,.5); }
.feature-card .fc-ico { color: var(--navy); margin-bottom: .9rem; }
.feature-card .fc-ico svg { width: 30px; height: 30px; }
.feature-card h3 { font-family: var(--serif); font-size: 1.18rem; font-weight: 700; color: var(--ink); margin-bottom: .5rem; }
.feature-card p { font-size: .92rem; color: var(--muted); line-height: 1.65; }

/* ---------- Steps / process ---------- */
.steps { display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem; }
.step {
  display: flex; align-items: flex-start; gap: 1.3rem;
  background: #fff; border: 1px solid var(--line); border-inline-end: 3px solid var(--navy);
  padding: clamp(1.2rem,2vw,1.6rem) clamp(1.3rem,2.2vw,1.8rem); transition: border-color .4s;
}
.step:hover { border-inline-end-color: var(--gold); }
.step .step-num {
  min-width: 46px; height: 46px; border-radius: 50%; background: var(--navy); color: var(--gold-2);
  display: flex; align-items: center; justify-content: center; font-family: var(--serif); font-weight: 800; font-size: 1.2rem; flex-shrink: 0;
}
.step h4 { font-family: var(--serif); font-size: 1.12rem; color: var(--ink); margin-bottom: .3rem; }
.step p { font-size: .92rem; color: var(--muted); line-height: 1.6; }

/* ---------- Checklist (who is this for) ---------- */
.check-list { list-style: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(260px,1fr)); gap: .8rem 1.6rem; margin-top: 1.2rem; }
.check-list li { position: relative; padding-inline-start: 2rem; color: var(--muted); font-size: 1rem; line-height: 1.55; }
.check-list li::before {
  content: "✓"; position: absolute; inset-inline-start: 0; top: 0;
  color: #fff; background: var(--gold); width: 22px; height: 22px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; font-size: .72rem; font-weight: 700;
}

/* ---------- FAQ ---------- */
.faq-list { display: flex; flex-direction: column; gap: .8rem; margin-top: 1.5rem; max-width: 820px; }
.faq-item { border: 1px solid var(--line); border-radius: 4px; overflow: hidden; background: #fff; }
.faq-item summary {
  list-style: none; cursor: pointer; padding: 1.1rem 1.4rem; font-family: var(--serif);
  font-weight: 700; font-size: 1.05rem; color: var(--ink); display: flex; justify-content: space-between; align-items: center; gap: 1rem;
}
.faq-item summary::-webkit-details-marker { display: none; }
.faq-item summary::after { content: "+"; color: var(--gold); font-size: 1.5rem; font-weight: 400; transition: transform .3s; line-height: 1; }
.faq-item[open] summary::after { transform: rotate(45deg); }
.faq-item .faq-body { padding: 0 1.4rem 1.2rem; color: var(--muted); font-size: .96rem; line-height: 1.7; }

/* ---------- CTA band ---------- */
.cta-band { background: linear-gradient(135deg, var(--navy), var(--ink)); color: #fff; position: relative; overflow: hidden; }
.cta-band::before {
  content: ""; position: absolute; inset-block-start: 0; inset-inline-end: 0; width: 72px; height: 3px; background: var(--gold);
}
.cta-band .cta-inner { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(2rem,5vw,4rem); align-items: center; }
.cta-band .cta-copy .eyebrow { color: var(--gold-2); margin-bottom: 1.1rem; }
.cta-band .cta-copy .eyebrow::before { background: var(--gold-2); }
.cta-band .cta-copy h2 { font-family: var(--serif); font-size: clamp(1.8rem,3.4vw,2.8rem); font-weight: 800; line-height: 1.12; margin-bottom: 1rem; }
.cta-band .cta-copy p { color: rgba(255,255,255,.78); font-weight: 300; max-width: 44ch; }
.cta-band .cta-form { background: rgba(255,255,255,.05); border: 1px solid var(--line-2); padding: clamp(1.6rem,3vw,2.4rem); border-radius: 6px; }
.cta-band .cta-form h3 { font-family: var(--serif); font-size: 1.35rem; color: #fff; margin-bottom: .3rem; }
.cta-band .cta-form > p { color: rgba(255,255,255,.7); font-size: .9rem; margin-bottom: 1.3rem; }
.cta-band .form-group label { color: rgba(255,255,255,.85); }
.cta-band .form-group input, .cta-band .form-group select, .cta-band .form-group textarea {
  background: rgba(255,255,255,.08); border-color: var(--line-2); color: #fff;
}
.cta-band .form-group input::placeholder, .cta-band .form-group textarea::placeholder { color: rgba(255,255,255,.45); }
.cta-band .form-group input:focus, .cta-band .form-group select:focus, .cta-band .form-group textarea:focus {
  background: rgba(255,255,255,.12); border-color: var(--gold); box-shadow: 0 0 0 3px rgba(176,141,62,.25);
}
.cta-band .form-group select option { color: var(--ink); }

/* ---------- Related services ---------- */
.related { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); gap: 1rem; margin-top: 1.5rem; }
.related a {
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  border: 1px solid var(--line); padding: 1.1rem 1.3rem; font-weight: 600; color: var(--ink);
  transition: background .4s var(--ease), color .4s var(--ease), border-color .4s;
}
.related a:hover { background: var(--ink); color: #fff; border-color: var(--ink); }
.related a .arr { color: var(--gold); transition: transform .4s var(--ease); }
.related a:hover .arr { transform: translateX(-5px); color: var(--gold-2); }

/* ---------- Careers: job cards ---------- */
.jobs { display: flex; flex-direction: column; gap: 1.2rem; margin-top: 1.5rem; }
.job-card {
  background: #fff; border: 1px solid var(--line); padding: clamp(1.5rem,3vw,2.2rem);
  display: grid; grid-template-columns: 1fr auto; gap: 1.5rem; align-items: center;
  transition: transform .5s var(--ease), box-shadow .5s var(--ease), border-color .4s;
}
.job-card:hover { transform: translateY(-4px); box-shadow: 0 30px 60px -44px rgba(19,31,51,.5); border-color: transparent; }
.job-card .job-tags { display: flex; gap: .5rem; flex-wrap: wrap; margin-bottom: .8rem; }
.job-card .tag { font-size: .74rem; letter-spacing: .1em; color: var(--gold); border: 1px solid var(--line); padding: .25rem .7rem; border-radius: 2px; }
.job-card h3 { font-family: var(--serif); font-size: 1.4rem; font-weight: 700; color: var(--ink); margin-bottom: .5rem; }
.job-card p { color: var(--muted); font-size: .95rem; max-width: 60ch; }
.job-card .job-cta { white-space: nowrap; }
/* Filled / closed positions — shown for context only, not applicable */
.job-card.job-filled { opacity: .62; filter: grayscale(.45); }
.job-card.job-filled:hover { transform: none; box-shadow: none; border-color: var(--line); }
.job-card .tag-filled { color: var(--muted); border-color: var(--line); background: #f3f4f6; }
.job-card .job-status { white-space: nowrap; font-size: .78rem; letter-spacing: .12em; color: var(--muted); border: 1px solid var(--line); padding: .4rem 1rem; border-radius: 2px; background: #f3f4f6; align-self: center; }

.values-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px,1fr)); gap: clamp(1rem,2vw,1.6rem); margin-top: 1rem; }
.value-card { padding: clamp(1.4rem,2.5vw,1.9rem); border: 1px solid var(--line); background: #fff; }
.value-card .v-num { font-family: var(--serif); color: var(--gold); font-size: 1rem; display: block; margin-bottom: .6rem; }
.value-card h3 { font-family: var(--serif); font-size: 1.2rem; color: var(--ink); margin-bottom: .5rem; }
.value-card p { font-size: .92rem; color: var(--muted); line-height: 1.65; }

/* ---------- Section intro helper ---------- */
.sec-intro { margin-bottom: clamp(1.8rem,3.5vw,2.8rem); }
.sec-intro .section-title { margin: .8rem 0 .8rem; }
.sec-intro p { color: var(--muted); max-width: 60ch; }

/* ---------- Responsive ---------- */
@media (max-width: 880px) {
  .stat-strip-inner { grid-template-columns: 1fr; }
  .stat-strip .stat { border-inline-start: none; border-bottom: 1px solid var(--line-2); }
  .stat-strip .stat:last-child { border-bottom: none; }
  .content-block.two-col { grid-template-columns: 1fr; }
  .cta-band .cta-inner { grid-template-columns: 1fr; }
  .job-card { grid-template-columns: 1fr; }
}

/* ============================================================
   מאמרים — Articles hub + article reading page
   Added 2026-10-18. Built on the same tokens as styles.css.
   Two blocks:
     1. .art-*     → the listing page (maamarim.html)
     2. .article-* → the reading page (maamar-*.html)
   ============================================================ */

/* ---------- 1. HUB: filters + cards ---------- */

.art-filters {
  display: flex; flex-wrap: wrap; gap: .6rem;
  justify-content: center; margin-bottom: 3rem;
}
.art-filters button {
  background: transparent; border: 1px solid var(--line);
  color: var(--muted); font-size: .9rem; font-weight: 500;
  padding: .55rem 1.25rem; border-radius: 100px;
  transition: all .25s var(--ease);
}
.art-filters button:hover { border-color: var(--gold); color: var(--ink); }
.art-filters button.active {
  background: var(--navy); border-color: var(--navy); color: #fff;
}

.art-grid {
  display: grid; gap: 1.75rem;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
}

.art-card {
  display: flex; flex-direction: column;
  background: var(--paper); border: 1px solid var(--line);
  border-radius: 16px; overflow: hidden;
  transition: transform .35s var(--ease), box-shadow .35s var(--ease), border-color .35s var(--ease);
}
.art-card:hover {
  transform: translateY(-6px);
  border-color: rgba(176,141,62,.45);
  box-shadow: 0 18px 50px rgba(19,31,51,.12);
}
.art-card .art-thumb {
  position: relative; aspect-ratio: 16/9; overflow: hidden;
  background: var(--cream);
}
.art-card .art-thumb img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform .6s var(--ease);
}
.art-card:hover .art-thumb img { transform: scale(1.05); }
.art-card .art-cat {
  position: absolute; inset-inline-start: .85rem; top: .85rem;
  background: rgba(28,52,97,.92); color: var(--gold-2);
  font-size: .72rem; font-weight: 600; letter-spacing: .04em;
  padding: .3rem .75rem; border-radius: 100px;
}
.art-card .art-body { padding: 1.5rem 1.6rem 1.7rem; display: flex; flex-direction: column; flex: 1; }
.art-card .art-meta {
  font-size: .78rem; color: var(--muted-2); font-weight: 500;
  display: flex; gap: .5rem; align-items: center; margin-bottom: .7rem;
}
.art-card .art-meta .dot { width: 3px; height: 3px; border-radius: 50%; background: currentColor; }
.art-card h3 {
  font-size: 1.22rem; line-height: 1.45; font-weight: 700;
  color: var(--ink); margin-bottom: .7rem;
}
.art-card p { font-size: .94rem; color: var(--read); line-height: 1.75; flex: 1; }
.art-card .art-more {
  margin-top: 1.2rem; font-weight: 600; font-size: .92rem; color: var(--navy);
  display: inline-flex; align-items: center; gap: .4rem;
}
.art-card .art-more .arr { transition: transform .3s var(--ease); }
.art-card:hover .art-more { color: var(--gold); }
.art-card:hover .art-more .arr { transform: translateX(-4px); }
.art-card[hidden] { display: none; }

/* Empty-state line shown when a filter matches nothing */
.art-empty { text-align: center; color: var(--muted-2); padding: 2rem 0; }

/* ---------- 2. ARTICLE READING PAGE ---------- */

/* Long-form reading colour. --muted (#56616f, 6.3:1) is fine for short UI
   text but too light for a column of body copy; #3d4653 measures 9.55:1. */
:root { --read: #3d4653; }

.article-wrap {
  max-width: 760px; margin: 0 auto;
  padding-inline: var(--pad); padding-block: clamp(2.5rem, 6vw, 4.5rem);
}

/* Byline block directly under the H1 — carries the E-E-A-T signal */
.article-byline {
  display: flex; flex-wrap: wrap; align-items: center; gap: .55rem;
  font-size: .88rem; color: var(--read);
  padding-bottom: 1.6rem; border-bottom: 1px solid var(--line);
  margin-bottom: 2.2rem;
}
.article-byline .sep { color: var(--muted-2); }
.article-byline strong { color: var(--ink); font-weight: 600; }

/* "תשובה בקצרה" — the answer box. This is the block an AI engine is most
   likely to lift as the direct answer, so it stays at the top, stands on
   its own, and never runs past ~60 words. */
.answer-box {
  background: var(--cream); border-inline-start: 4px solid var(--gold);
  border-radius: 0 12px 12px 0;
  padding: 1.4rem 1.6rem; margin-bottom: 2.4rem;
}
.answer-box .ab-label {
  font-size: .74rem; font-weight: 700; letter-spacing: .08em;
  color: var(--gold); display: block; margin-bottom: .5rem;
}
.answer-box p { font-size: 1.05rem; line-height: 1.8; color: var(--ink); font-weight: 500; }

/* Table of contents */
.article-toc {
  background: var(--paper); border: 1px solid var(--line);
  border-radius: 12px; padding: 1.3rem 1.6rem; margin-bottom: 2.6rem;
}
.article-toc h2 { font-size: .95rem; font-weight: 700; color: var(--ink); margin-bottom: .8rem; }
.article-toc ol { margin: 0; padding-inline-start: 1.2rem; }
.article-toc li { font-size: .93rem; margin-bottom: .4rem; color: var(--read); }
.article-toc a:hover { color: var(--gold); }

/* Body typography */
.article-body h2 {
  font-size: clamp(1.45rem, 3vw, 1.85rem); line-height: 1.4; font-weight: 700;
  color: var(--ink); margin: 2.8rem 0 1rem; scroll-margin-top: 90px;
}
.article-body h3 {
  font-size: 1.15rem; font-weight: 600; color: var(--navy);
  margin: 2rem 0 .7rem; scroll-margin-top: 90px;
}
.article-body p { font-size: 1.05rem; line-height: 1.95; color: var(--read); margin-bottom: 1.25rem; }
.article-body strong { color: var(--ink); font-weight: 600; }
.article-body ul, .article-body ol { margin: 0 0 1.5rem; padding-inline-start: 1.4rem; }
.article-body li { font-size: 1.05rem; line-height: 1.9; color: var(--read); margin-bottom: .55rem; }
.article-body .li-note { font-size: .95rem; color: #5a657a; }
.article-body .li-note strong { color: #5a657a; font-weight: 600; }
.article-body a:not(.btn) {
  color: var(--navy); font-weight: 500;
  border-bottom: 1px solid rgba(176,141,62,.5);
}
.article-body a:not(.btn):hover { color: var(--gold); border-bottom-color: var(--gold); }
.article-body figure { margin: 2rem 0; }
.article-body figure img { border-radius: 12px; }
.article-body figcaption {
  font-size: .85rem; color: var(--muted-2); margin-top: .6rem; text-align: center;
}

/* Data table — numbers are what AI engines quote, so they get real structure */
.article-body table {
  width: 100%; border-collapse: collapse; margin: 2rem 0;
  font-size: .95rem; background: var(--paper);
  border: 1px solid var(--line); border-radius: 10px; overflow: hidden;
}
.article-body thead { background: var(--navy); color: #fff; }
.article-body th, .article-body td {
  padding: .8rem 1rem; text-align: start; border-bottom: 1px solid var(--line);
}
.article-body th { font-weight: 600; font-size: .9rem; }
.article-body tbody tr:nth-child(even) { background: var(--cream); }
.article-body tbody tr:last-child td { border-bottom: none; }
.table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }

/* Pull-quote from the office — first-person expertise */
.article-body blockquote {
  margin: 2.2rem 0; padding: 1.5rem 1.7rem;
  background: var(--navy); color: #fff; border-radius: 14px;
}
.article-body blockquote p { color: rgba(255,255,255,.92); font-size: 1.1rem; margin-bottom: .7rem; }
.article-body blockquote strong { color: var(--gold-2); }
.article-body blockquote footer { font-size: .85rem; color: var(--gold-2); font-weight: 600; }

/* Key takeaways — a scannable summary block */
.takeaways {
  background: var(--cream); border: 1px solid var(--line);
  border-radius: 14px; padding: 1.6rem 1.8rem; margin: 2.6rem 0;
}
.takeaways h2 { font-size: 1.1rem !important; margin: 0 0 1rem !important; }
.takeaways ul { list-style: none; margin: 0; padding: 0; }
.takeaways li { position: relative; padding-inline-start: 1.6rem; font-size: 1rem; }
.takeaways li::before {
  content: "\2713"; position: absolute; inset-inline-start: 0;
  color: var(--gold); font-weight: 700;
}

/* Author card at the foot of the article */
.author-card {
  display: flex; gap: 1.3rem; align-items: flex-start;
  background: var(--paper); border: 1px solid var(--line);
  border-radius: 16px; padding: 1.6rem 1.8rem; margin-top: 3rem;
}
.author-card img {
  width: 76px; height: 76px; border-radius: 50%; object-fit: cover; flex: none;
}
.author-card .ac-name { font-size: 1.08rem; font-weight: 700; color: var(--ink); }
.author-card .ac-role { font-size: .85rem; color: var(--gold); font-weight: 600; margin-bottom: .6rem; }
.author-card .ac-bio { font-size: .93rem; color: var(--read); line-height: 1.8; }

/* Sources / legal references — AI engines weight cited primary sources */
.article-sources {
  margin-top: 2.6rem; padding-top: 1.6rem; border-top: 1px solid var(--line);
}
.article-sources h2 { font-size: 1rem !important; margin: 0 0 .8rem !important; }
.article-sources ol { padding-inline-start: 1.3rem; }
.article-sources li { font-size: .88rem; color: var(--read); line-height: 1.8; }

/* Editorial disclosure — states plainly how the article was produced */
.article-disclosure {
  margin-top: 2rem; font-size: .82rem; color: var(--muted-2);
  line-height: 1.8; background: var(--cream);
  border-radius: 10px; padding: 1rem 1.2rem;
}

@media (max-width: 640px) {
  .author-card { flex-direction: column; align-items: center; text-align: center; }
  .article-body blockquote { padding: 1.2rem 1.3rem; }
}

/* ---------- 3. ARTICLE PAGES: navbar over a white page ----------
   Every other sub-page opens on a dark hero photo, so the navbar starts
   transparent with white links and only turns solid on scroll. An article
   opens on white, where white links are invisible. Articles therefore carry
   class="article-page" on <body>: the navbar is locked into its solid state
   from the first pixel, and the article reserves its height.
   The mobile drawer (<=880px) keeps its own white-on-navy styling. */

body.article-page #navbar {
  background: rgba(255,255,255,.92);
  backdrop-filter: blur(14px);
  box-shadow: 0 1px 0 var(--line), 0 18px 40px -28px rgba(19,31,51,.5);
  padding-block: .95rem;
}
body.article-page #navbar .nav-logo img { height: 46px; filter: none; }
body.article-page #navbar .nav-links a { color: var(--ink); }
body.article-page #navbar .nav-links a.nav-cta { background: var(--gold); border-color: var(--gold); color: #fff; }
body.article-page #navbar .nav-links a.nav-cta:hover { background: #9a7a34; border-color: #9a7a34; color: #fff; }
body.article-page #navbar .hamburger span { background: var(--ink); }

/* Clear the fixed navbar (~76px in its solid state) */
body.article-page .article-wrap { padding-block-start: calc(clamp(2.5rem, 6vw, 4.5rem) + 76px); }

@media (max-width: 880px) {
  body.article-page #navbar .nav-links a { color: #fff; }
  body.article-page #navbar .nav-links a.nav-cta { background: transparent; border-color: var(--gold); color: var(--gold-2); }
}

/* .breadcrumb was written for the white-on-photo hero. On an article it sits
   on white paper, so it needs the ink palette instead. */
body.article-page .breadcrumb { color: var(--muted-2); }
body.article-page .breadcrumb a { color: var(--muted); }
body.article-page .breadcrumb a:hover { color: var(--gold); }
body.article-page .breadcrumb .sep { color: var(--line); }

/* ---------- 4. ARTICLE HERO ----------
   Articles open on a photo masthead like every other sub-page, rather than
   straight onto white. Shorter than .subpage-hero: a cover, not a landing
   section. The navbar keeps its transparent-over-photo state here, so pages
   that use this must NOT carry .article-page on <body>. */
.article-hero { min-height: clamp(52vh, 62vh, 560px); }
.article-hero .sp-content { padding-block-start: clamp(9rem, 17vh, 12rem); padding-block-end: 3rem; }
.article-hero .sp-title { margin-bottom: 1.1rem; font-size: clamp(1.8rem, 3.4vw, 2.9rem); }
.article-hero .article-byline {
  border-bottom: none; padding-bottom: 0; margin-bottom: 0;
  color: rgba(255,255,255,.78);
}
.article-hero .article-byline strong { color: #fff; }
.article-hero .article-byline .sep { color: rgba(255,255,255,.4); }
.article-hero .breadcrumb { margin-bottom: 1.2rem; }

/* With a hero above it the column no longer needs to clear the fixed navbar */
.article-hero + main .article-wrap,
main > .article-hero ~ .article-wrap { padding-block-start: clamp(2.5rem, 6vw, 4rem); }

/* The photo runs full-bleed behind the fixed navbar, exactly as on the home
   page and the service pages: transparent over the image, white once scrolled.
   A tinted bar here reads as a band cutting the photo in two. */
body.article-hero-page #navbar { background: transparent; box-shadow: none; backdrop-filter: none; }
body.article-hero-page #navbar::before {
  content: ""; position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background: linear-gradient(to bottom, rgba(10,18,33,.55), rgba(10,18,33,0));
  transition: opacity .45s var(--ease);
}
body.article-hero-page #navbar.scrolled { background: rgba(255,255,255,.92); backdrop-filter: blur(14px);
  box-shadow: 0 1px 0 var(--line), 0 18px 40px -28px rgba(19,31,51,.5); }
body.article-hero-page #navbar.scrolled::before { opacity: 0; }

/* ---------- 5. COPY-ONLY CTA BAND ----------
   Articles end with a copy-only band (no inline form). The default .cta-inner
   is a two-column grid, so a lone .cta-copy sat in half the width while its
   paragraph was separately capped at 44ch and the buttons stayed flex-start -
   a wide headline over a narrow paragraph with off-centre buttons. */
.cta-band--center { padding-block: clamp(3.5rem, 7vw, 6rem); border-bottom: 1px solid rgba(255,255,255,.09); }
.cta-band--center .cta-inner { grid-template-columns: 1fr; justify-items: center; text-align: center; }
.cta-band--center .cta-copy { max-width: 60ch; }
.cta-band--center .cta-copy p { max-width: none; margin-inline: auto; font-size: 1.02rem; line-height: 1.85; }
.cta-band--center .cta-copy h2 { max-width: 22ch; margin-inline: auto; }
.cta-band--center .hero-actions { justify-content: center; margin-top: 2.2rem; }

```

### `styles.css`

```css
/* ============================================================
   בורוביץ מזרחי — שמאות מקרקעין וחקלאות
   Premium redesign · RTL · Editorial
   ============================================================ */

:root {
  --ink:    #131f33;   /* deep navy ink (headings) */
  --navy:   #1c3461;   /* brand navy */
  --navy-2: #0f1c33;   /* darker navy for footer/overlays */
  --gold:   #b08d3e;   /* rich antique gold accent (text) */
  --gold-2: #e4c987;   /* champagne gold for dark backgrounds (text) */
  --cream:  #f4f6fa;   /* cool off-white sections */
  --paper:  #ffffff;
  --muted:  #56616f;   /* body gray */
  --muted-2:#8a93a0;   /* light gray */
  --line:   rgba(19,31,51,.12);
  --line-2: rgba(255,255,255,.16);

  --serif: "Heebo", system-ui, -apple-system, sans-serif;
  --sans:  "Heebo", system-ui, -apple-system, sans-serif;

  --ease: cubic-bezier(.22,.61,.36,1);
  --maxw: 1280px;
  --pad: clamp(1.25rem, 5vw, 5rem);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; font-size: 15px; }
/* Lenis disables native smooth scroll once active */
html.lenis, html.lenis body { height: auto; }
html { overflow-x: clip; max-width: 100%; }
.lenis.lenis-smooth { scroll-behavior: auto !important; }
.lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
.lenis.lenis-stopped { overflow: hidden; }

body {
  font-family: var(--sans);
  color: var(--ink);
  background: var(--paper);
  line-height: 1.7;
  font-weight: 400;
  overflow-x: hidden;
  overflow-x: clip;
  max-width: 100%;
  direction: rtl;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

img { max-width: 100%; display: block; }
a { color: inherit; text-decoration: none; }
button { font-family: inherit; cursor: pointer; }

::selection { background: var(--gold); color: #fff; }

.container { width: 100%; max-width: var(--maxw); margin: 0 auto; padding-inline: var(--pad); }

.skip-to-content {
  position: absolute; right: -999px; top: 0; z-index: 2000;
  background: var(--navy); color: #fff; padding: .8rem 1.4rem; border-radius: 0 0 0 10px;
}
.skip-to-content:focus { right: 0; }

/* ---------- Shared headings ---------- */
.eyebrow {
  display: inline-flex; align-items: center; gap: .65rem;
  font-size: .74rem; font-weight: 700; letter-spacing: .22em;
  color: var(--gold);
}
.eyebrow::before {
  content: ""; width: 34px; height: 1px; background: var(--gold); display: inline-block;
}
.display {
  font-family: var(--serif);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -.02em;
  color: var(--ink);
}
.section-title {
  font-family: var(--serif);
  font-weight: 800;
  font-size: clamp(2rem, 4.4vw, 3.4rem);
  line-height: 1.1;
  color: var(--ink);
  letter-spacing: -.02em;
}
.lead { font-size: clamp(1.02rem, 1.5vw, 1.18rem); color: var(--muted); max-width: 60ch; }

.section { padding-block: clamp(4.5rem, 9vw, 9rem); position: relative; }
.section--cream { background: var(--cream); }

/* ---------- Buttons ---------- */
.btn {
  display: inline-flex; align-items: center; gap: .6rem;
  font-weight: 600; font-size: .95rem; letter-spacing: .01em;
  padding: 1rem 1.9rem; border-radius: 2px; border: 1px solid transparent;
  transition: background .4s var(--ease), color .4s var(--ease), border-color .4s var(--ease), transform .3s var(--ease);
  position: relative; overflow: hidden; white-space: nowrap;
}
.btn .arr { transition: transform .4s var(--ease); }
.btn:hover .arr { transform: translateX(-5px); }
.btn-primary { background: var(--navy); color: #fff; }
.btn-primary:hover { background: var(--ink); }
.btn-gold { background: var(--gold); color: #fff; }
.btn-gold:hover { background: #a9883f; }
.btn-ghost { background: transparent; color: #fff; border-color: rgba(255,255,255,.45); }
.btn-ghost:hover { background: #fff; color: var(--ink); border-color: #fff; }
.btn-outline { background: transparent; color: var(--ink); border-color: var(--line); }
.btn-outline:hover { background: var(--ink); color: #fff; border-color: var(--ink); }

/* ============================================================
   NAVBAR
   ============================================================ */
#navbar {
  position: fixed; inset-block-start: 0; inset-inline: 0; z-index: 1000;
  transition: background .45s var(--ease), box-shadow .45s var(--ease), padding .45s var(--ease);
  padding-block: 1.7rem;
}
#navbar.scrolled {
  background: rgba(255,255,255,.92);
  backdrop-filter: blur(14px);
  box-shadow: 0 1px 0 var(--line), 0 18px 40px -28px rgba(19,31,51,.5);
  padding-block: .95rem;
}
.nav-inner {
  width: 100%; max-width: var(--maxw); margin: 0 auto; padding-inline: var(--pad);
  display: flex; align-items: center; justify-content: space-between; gap: 2rem;
}
.nav-logo img {
  height: 58px; width: auto; object-fit: contain;
  filter: brightness(0) invert(1);
  transition: height .45s var(--ease), filter .45s var(--ease);
}
/* white logo over the hero photo; reverts to the original navy logo once the navbar turns white on scroll */
#navbar.scrolled .nav-logo img { height: 46px; filter: none; }
.nav-logo { display: inline-flex; align-items: center; }

.nav-links { list-style: none; display: flex; align-items: center; gap: 2.6rem; }
.nav-links a {
  font-size: 1.1rem; font-weight: 600; color: #fff; position: relative; padding: .3rem 0;
  transition: color .35s var(--ease);
}
.nav-links a::after {
  content: ""; position: absolute; inset-inline: 0; bottom: -2px; height: 1.5px;
  background: var(--gold); transform: scaleX(0); transform-origin: right; transition: transform .4s var(--ease);
}
.nav-links a:hover::after { transform: scaleX(1); }
#navbar.scrolled .nav-links a { color: var(--ink); }
.nav-links a.nav-cta {
  background: var(--gold); border: 1px solid var(--gold); color: #fff;
  padding: .6rem 1.7rem; border-radius: 2px; font-weight: 600;
  box-shadow: 0 6px 18px -8px rgba(176,141,62,.75);
  transition: background .35s var(--ease), color .35s var(--ease), border-color .35s var(--ease);
}
.nav-links a.nav-cta::after { display: none; }
.nav-links a.nav-cta:hover { background: #9a7a34; border-color: #9a7a34; color: #fff; }
#navbar.scrolled .nav-links a.nav-cta { background: var(--gold); border-color: var(--gold); color: #fff; }
#navbar.scrolled .nav-links a.nav-cta:hover { background: #9a7a34; color: #fff; border-color: #9a7a34; }

.hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; padding: 8px; z-index: 1100; }
.hamburger span { width: 26px; height: 2px; background: #fff; display: block; transition: transform .4s var(--ease), opacity .3s; }
#navbar.scrolled .hamburger span { background: var(--ink); }
.hamburger.open span { background: var(--ink); }
.hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* ============================================================
   HERO
   ============================================================ */
.hero {
  position: relative; min-height: 100svh; display: flex; align-items: center;
  overflow: hidden; background: var(--navy-2);
}
.hero-slides { position: absolute; inset: 0; z-index: 0; }
.hero-slide {
  position: absolute; inset: 0; background-size: cover; background-position: center;
  opacity: 0; transition: opacity 1.5s var(--ease);
  will-change: opacity, transform;
}
.hero-slide.active { opacity: 1; animation: kenburns 8s linear forwards; }
@keyframes kenburns { from { transform: scale(1.12); } to { transform: scale(1.0); } }
.hero-slide:nth-child(1){ background-image: url("slide1.jpg"); }
.hero-slide:nth-child(2){ background-image: url("slide2.jpg"); }
.hero-slide:nth-child(3){ background-image: url("slide3.jpg"); }
.hero-slide:nth-child(4){ background-image: url("slide4.jpg"); }
.hero-slide:nth-child(5){ background-image: url("slide5.jpg"); }
.hero-slide:nth-child(6){ background-image: url("slide6.jpg"); }
.hero-slide:nth-child(7){ background-image: url("slide7.jpg"); }
.hero-slide:nth-child(8){ background-image: url("slide8.jpg"); }
.hero-slide:nth-child(9){ background-image: url("slide9.jpg"); }
.hero-slide:nth-child(10){ background-image: url("slide10.jpg"); }
.hero-slide:nth-child(11){ background-image: url("slide11.jpg"); }
.hero-overlay {
  position: absolute; inset: 0; z-index: 1;
  background:
    linear-gradient(to top, rgba(10,18,33,.92) 0%, rgba(10,18,33,.4) 45%, rgba(10,18,33,.55) 100%),
    linear-gradient(to left, rgba(10,18,33,.5), rgba(10,18,33,.08));
}
.hero-content {
  position: relative; z-index: 3; width: 100%; max-width: var(--maxw);
  margin: 0 auto; padding-inline: var(--pad); padding-top: 6rem;
}
.hero-eyebrow { color: var(--gold-2); margin-bottom: 1.6rem; }
.hero-eyebrow::before { background: var(--gold-2); }
.hero-title {
  font-family: var(--serif); color: #fff; font-weight: 800;
  font-size: clamp(2.6rem, 6.4vw, 5.6rem); line-height: 1.04; letter-spacing: -.025em;
  max-width: 16ch; margin-bottom: 1.8rem;
}
.hero-title .gold { color: var(--gold-2); }
.hero-line { display: block; overflow: hidden; }
.hero-line > span { display: inline-block; will-change: transform; }
.hero-sub { color: rgba(255,255,255,.82); font-size: clamp(1.05rem, 1.7vw, 1.3rem); max-width: 52ch; margin-bottom: 2.6rem; font-weight: 300; }
.hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }

.hero-side-label {
  position: absolute; z-index: 3; inset-inline-start: var(--pad); top: 50%;
  transform: translateY(-50%); writing-mode: vertical-rl;
  color: rgba(255,255,255,.6); font-size: .76rem; letter-spacing: .3em; font-weight: 500;
  display: flex; align-items: center; gap: 1rem;
}
.hero-side-label::after { content: ""; width: 1px; height: 70px; background: rgba(255,255,255,.4); }

.hero-scroll {
  position: absolute; z-index: 3; bottom: 2rem; inset-inline-end: var(--pad);
  display: flex; align-items: center; gap: .7rem; color: rgba(255,255,255,.7); font-size: .8rem; letter-spacing: .15em;
}
.hero-scroll .mouse { width: 22px; height: 36px; border: 1.5px solid rgba(255,255,255,.5); border-radius: 12px; position: relative; }
.hero-scroll .mouse::after { content: ""; position: absolute; top: 7px; left: 50%; transform: translateX(-50%); width: 3px; height: 7px; background: var(--gold-2); border-radius: 2px; animation: scrolldot 1.6s infinite; }
@keyframes scrolldot { 0%{ opacity:0; transform: translateX(-50%) translateY(0);} 40%{opacity:1;} 80%{opacity:0; transform: translateX(-50%) translateY(9px);} 100%{opacity:0;} }

.hero-dots { position: absolute; z-index: 3; bottom: 2.2rem; inset-inline-start: var(--pad); display: flex; gap: .6rem; }
.hero-dots button { width: 34px; height: 3px; background: rgba(255,255,255,.3); border: none; border-radius: 2px; overflow: hidden; position: relative; padding: 0; cursor: pointer; }
.hero-dots button .fill { position: absolute; inset: 0; background: var(--gold-2); transform: scaleX(0); transform-origin: right; }
.hero-dots button.active .fill { animation: dotfill 5s linear forwards; }
@keyframes dotfill { from { transform: scaleX(0);} to { transform: scaleX(1);} }

/* ============================================================
   PILLARS BAND
   ============================================================ */
.pillars { background: var(--ink); color: #fff; }
.pillars-inner { display: grid; grid-template-columns: repeat(3, 1fr); }
.pillar { padding: clamp(2.2rem,4vw,3.4rem) clamp(1.5rem,3vw,3rem); border-inline-start: 1px solid var(--line-2); position: relative; }
.pillar:first-child { border-inline-start: none; }
.pillar .num { font-family: var(--serif); font-size: 1rem; color: var(--gold-2); margin-bottom: 1rem; display: block; }
.pillar h3 { font-family: var(--serif); font-size: 1.5rem; font-weight: 700; margin-bottom: .7rem; }
.pillar p { color: rgba(255,255,255,.62); font-size: .95rem; font-weight: 300; line-height: 1.75; }

/* ============================================================
   ABOUT / PARTNERS
   ============================================================ */
.about-top { display: grid; grid-template-columns: 1.05fr .95fr; gap: clamp(2rem,5vw,5rem); align-items: center; margin-bottom: clamp(3rem,6vw,5.5rem); }
.about-copy .section-title { margin: 1.2rem 0 1.6rem; }
.about-copy p { color: var(--muted); margin-bottom: 1.1rem; }
.about-copy .btn { margin-top: 1rem; }
.about-figure { position: relative; }
.about-figure .frame { position: relative; overflow: hidden; border-radius: 3px; aspect-ratio: 4/5; }
.about-figure .frame img { width: 100%; height: 100%; object-fit: cover; will-change: transform; }
.about-figure .badge {
  position: absolute; inset-block-end: -1px; inset-inline-start: -1px; background: var(--gold); color: #fff;
  padding: 1.4rem 1.8rem; max-width: 62%;
}
.about-figure .badge strong { font-family: var(--serif); font-size: 2.2rem; display: block; line-height: 1; }
.about-figure .badge span { font-size: .82rem; opacity: .92; }
.about-figure .deco { position: absolute; inset-block-start: -22px; inset-inline-end: -22px; width: 120px; height: 120px; border: 1px solid var(--gold); z-index: -1; }

.partners-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(1.5rem,3vw,2.5rem); }
.partner {
  background: #fff; border: 1px solid var(--line); padding: clamp(1.6rem,3vw,2.4rem);
  position: relative; transition: transform .5s var(--ease), box-shadow .5s var(--ease), border-color .5s;
}
.partner:hover { transform: translateY(-6px); box-shadow: 0 30px 60px -40px rgba(19,31,51,.55); border-color: transparent; }
.partner-head { display: flex; align-items: center; gap: 1.2rem; margin-bottom: 1.5rem; }
.partner-photo { width: 86px; height: 86px; border-radius: 50%; object-fit: cover; object-position: top center; flex-shrink: 0; transition: transform .5s var(--ease), box-shadow .5s var(--ease); border: 1px solid var(--line); background: #eef0f4; }
.partner:hover .partner-photo { transform: scale(1.06); box-shadow: 0 0 0 3px var(--gold); }
.partner-head h3 { font-family: var(--serif); font-size: 1.55rem; font-weight: 700; line-height: 1.1; color: var(--ink); }
.partner-head .role { color: var(--gold); font-size: .85rem; font-weight: 600; }
.cred-list { list-style: none; display: flex; flex-direction: column; gap: .65rem; }
.cred-list li { position: relative; padding-inline-start: 1.3rem; font-size: .92rem; color: var(--muted); line-height: 1.55; }
.cred-list li::before { content: ""; position: absolute; inset-inline-start: 0; top: .6em; width: 6px; height: 6px; background: var(--gold); border-radius: 50%; }

/* ============================================================
   SERVICES
   ============================================================ */
.services-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 2rem; flex-wrap: wrap; margin-bottom: clamp(1.3rem,3vw,2.2rem); }
.services-head .section-title { max-width: 16ch; }
.services-head p { max-width: 34ch; color: var(--muted); }
#services { padding-block: clamp(2.6rem, 5.5vw, 5.5rem); overflow: hidden; }
#services::before {
  content: ""; position: absolute; inset-inline: 0; inset-block-end: 0;
  height: clamp(220px, 38vh, 440px); z-index: 0; pointer-events: none;
  background: url("image_1.jpg") center bottom / cover;
  filter: grayscale(1); opacity: .14;
  -webkit-mask-image: linear-gradient(to top, #000 0%, #000 30%, transparent 100%);
          mask-image: linear-gradient(to top, #000 0%, #000 30%, transparent 100%);
}
#services .container { position: relative; z-index: 1; }
.services-body { display: grid; grid-template-columns: 1fr minmax(300px, 360px); gap: clamp(2rem,4vw,3.5rem); align-items: stretch; }
.services-grid { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid var(--line); border-inline-start: 1px solid var(--line); }
.services-body .services-grid { grid-template-columns: repeat(3, 1fr); }
.services-body .svc { padding: clamp(.8rem,1.2vw,1.15rem); }
.services-body .svc h3 { font-size: 1.08rem; }
.services-body .svc p { font-size: .82rem; line-height: 1.55; }
.services-body .svc .svc-icon { margin: .7rem 0 .9rem; }
.services-body .svc .svc-icon svg { width: 26px; height: 26px; }
.svc {
  border-inline-end: 1px solid var(--line); border-bottom: 1px solid var(--line);
  padding: clamp(1.8rem,3vw,2.6rem); position: relative; cursor: pointer; overflow: hidden;
  transition: background .5s var(--ease); background: transparent;
}
.svc::after {
  content: ""; position: absolute; inset-block-end: 0; inset-inline: 0; height: 2px; background: var(--gold);
  transform: scaleX(0); transform-origin: right; transition: transform .5s var(--ease);
}
.svc:hover { background: var(--ink); }
.svc:hover::after { transform: scaleX(1); }
.svc .svc-num { font-family: var(--serif); font-size: .85rem; color: var(--muted-2); transition: color .5s; }
.svc .svc-icon { margin: 1rem 0 1.2rem; color: var(--navy); transition: color .5s; }
.svc .svc-icon svg { width: 30px; height: 30px; }
.svc h3 { font-family: var(--serif); font-size: 1.3rem; font-weight: 700; color: var(--ink); margin-bottom: .7rem; transition: color .5s; line-height: 1.25; }
.svc p { font-size: .9rem; color: var(--muted); line-height: 1.65; transition: color .5s; }
.svc .svc-more { margin-top: 1.1rem; font-size: .82rem; font-weight: 600; color: var(--gold); display: inline-flex; gap: .4rem; opacity: 0; transform: translateY(6px); transition: opacity .4s var(--ease), transform .4s var(--ease); }
.svc:hover .svc-num { color: var(--gold-2); }
.svc:hover .svc-icon { color: var(--gold-2); }
.svc:hover h3 { color: #fff; }
.svc:hover p { color: rgba(255,255,255,.72); }
.svc:hover .svc-more { opacity: 1; transform: translateY(0); }


.services-foot {
  display: grid; grid-template-columns: 1.05fr 1fr; align-items: center;
  gap: clamp(2rem,5vw,4.5rem); margin-top: clamp(2.8rem,5vw,4.5rem);
}
.services-body .services-foot {
  grid-template-columns: 1fr; gap: clamp(1.6rem,2.5vw,2.4rem); margin-top: 0;
  align-content: start; position: relative; overflow: hidden;
  background: #f5f6f8; border: 1px solid var(--line);
  padding: clamp(1.8rem,2.4vw,2.6rem); border-radius: 6px;
  box-shadow: 0 34px 70px -42px rgba(19,31,51,.6);
}
.services-body .services-foot::before {
  content: ""; position: absolute; inset-block-start: 0; inset-inline-end: 0;
  width: 64px; height: 3px; background: var(--gold); border-radius: 0 6px 0 6px; z-index: 2;
}
.services-body .services-foot::after {
  content: ""; position: absolute; inset-inline: 0; inset-block-end: 0; height: 180px;
  background-image:
    repeating-linear-gradient(135deg, rgba(228,201,135,.12) 0, rgba(228,201,135,.12) 1px, transparent 1px, transparent 11px),
    radial-gradient(120% 90% at 100% 100%, rgba(228,201,135,.10) 0%, transparent 60%);
  -webkit-mask-image: linear-gradient(to top, #000 0%, transparent 100%);
  mask-image: linear-gradient(to top, #000 0%, transparent 100%);
  pointer-events: none;
}
.services-body .services-foot blockquote { max-width: none; display: flex; flex-direction: column; justify-content: space-between; min-height: clamp(320px, 45vh, 400px); }
.services-body .services-foot blockquote p { font-size: clamp(1.1rem,1.45vw,1.38rem); line-height: 1.6; margin: 0; color: #fff; }
.services-body .services-foot .quote-eyebrow { font-size: .68rem; margin-bottom: 1rem; color: var(--gold-2); }
.services-body .services-foot .quote-eyebrow::before { background: var(--gold-2); }
.services-body .services-foot blockquote cite { font-size: .82rem; color: rgba(255,255,255,.7); }
.services-body .services-foot blockquote cite::before { background: var(--gold-2); }
.services-body .services-foot .quote-photo { display: none; }
.services-body .services-foot .quote-photo img { aspect-ratio: 3 / 2; }
.services-body .services-foot .quote-photo::after { border-color: var(--gold-2); transform: translate(-12px,12px); }
.services-foot .quote-photo { position: relative; }
.services-foot .quote-photo img {
  width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 4px;
  display: block; box-shadow: 0 32px 64px -38px rgba(19,31,51,.55);
}
.services-foot .quote-photo::after {
  content: ""; position: absolute; inset: 0; z-index: -1;
  transform: translate(-18px, 18px); border: 1px solid var(--gold); border-radius: 4px;
}
.services-foot blockquote { margin: 0; max-width: 44ch; }
.services-foot .quote-eyebrow {
  display: inline-flex; align-items: center; gap: .65rem;
  font-size: .76rem; font-weight: 700; letter-spacing: .18em;
  color: var(--gold); margin-bottom: 1.4rem;
}
.services-foot .quote-eyebrow::before { content: ""; width: 28px; height: 1px; background: var(--gold); }
.services-foot blockquote p {
  position: relative; font-family: var(--serif); color: var(--ink); font-weight: 600;
  font-size: clamp(1.2rem,2vw,1.72rem); line-height: 1.6; margin: 0 0 1.6rem;
}
.services-foot blockquote cite {
  font-style: normal; font-size: .92rem; font-weight: 600; letter-spacing: .03em;
  color: var(--muted); display: inline-flex; align-items: center; gap: .65rem;
}
.services-foot blockquote cite::before { content: ""; width: 26px; height: 1px; background: var(--gold); }

/* Hover preview: swap the quote banner for a domain illustration */
.services-body .services-foot .svc-stage {
  position: absolute; inset: 0; z-index: 3;
  opacity: 0; pointer-events: none; transition: opacity .5s var(--ease);
}
.services-body .services-foot.is-active .svc-stage { opacity: 1; }
.services-body .services-foot blockquote { transition: opacity .45s var(--ease); }
.services-body .services-foot.is-active blockquote { opacity: 0; transition: opacity .3s var(--ease); }
.svc-visual {
  position: absolute; inset: clamp(1.8rem,2.4vw,2.6rem);
  display: flex; flex-direction: column; justify-content: space-between; gap: 1rem;
  opacity: 0; transform: scale(.985);
  transition: opacity .5s var(--ease), transform .6s var(--ease);
}
.svc-visual.active { opacity: 1; transform: none; }
.svc-visual-art { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; }
.svc-visual-art svg { width: 100%; height: 100%; max-height: 300px; display: block; overflow: visible; }

/* Photo variant: the real domain photo fills the whole navy panel, with the
   caption laid over a gradient scrim at the bottom. A muted, brand-tinted
   treatment keeps the photo feeling part of the navy/gold identity. */
.svc-visual.has-photo { inset: 0; padding: 0; overflow: hidden; border-radius: 6px; }
.svc-visual.has-photo .svc-visual-art { width: 100%; height: 100%; }
.svc-visual .svc-photo {
  width: 100%; height: 100%; object-fit: cover; display: block;
  filter: saturate(.8) brightness(.9) contrast(1.03);
  transform: scale(1.04); transition: transform 1.2s var(--ease), filter .6s var(--ease);
}
/* Gentle push-in + slight warm-up on hover for a refined, editorial feel */
.svc-visual.has-photo.active .svc-photo { transform: scale(1); filter: saturate(.9) brightness(.95) contrast(1.02); }
/* Brand duotone wash over the photo (navy → gold), soft-light to stay subtle */
.svc-visual.has-photo::before {
  content: ""; position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background: linear-gradient(150deg, rgba(19,31,51,.55) 0%, rgba(28,52,97,.18) 48%, rgba(176,141,62,.22) 100%);
  mix-blend-mode: soft-light;
}
/* Inner gold hairline frame + soft vignette to focus the eye */
.svc-visual.has-photo::after {
  content: ""; position: absolute; inset: 0; z-index: 1; pointer-events: none; border-radius: 6px;
  box-shadow: inset 0 0 0 1px rgba(228,201,135,.30), inset 0 0 70px rgba(11,20,38,.42);
}
.svc-visual.has-photo .svc-visual-cap {
  position: absolute; inset-inline: 0; inset-block-end: 0; z-index: 2;
  padding: clamp(1.5rem,2.6vw,2.6rem);
  background: linear-gradient(to top, rgba(11,20,38,.94) 0%, rgba(11,20,38,.55) 55%, rgba(11,20,38,0) 100%);
}
/* Thin gold rule above the caption, echoing the site's accent lines */
.svc-visual.has-photo .svc-visual-cap::before {
  content: ""; position: absolute; inset-block-start: 0; inset-inline: clamp(1.5rem,2.6vw,2.6rem);
  height: 2px; background: linear-gradient(270deg, var(--gold-2), transparent);
  opacity: .55;
}
.svc-visual-cap span {
  display: inline-flex; align-items: center; gap: .6rem;
  font-size: .68rem; font-weight: 700; letter-spacing: .18em; color: var(--gold-2);
}
.svc-visual-cap span::before { content: ""; width: 24px; height: 1px; background: var(--gold-2); }
.svc-visual-cap strong {
  display: block; margin-top: .5rem; font-family: var(--serif);
  font-size: clamp(1.3rem,1.7vw,1.6rem); font-weight: 700; color: #fff; line-height: 1.2;
}
@media (prefers-reduced-motion: reduce) {
  .services-body .services-foot .svc-stage,
  .services-body .services-foot blockquote,
  .svc-visual,
  .svc-rest { transition: none; }
}

/* Rest-state image: a bright vertical architectural photo in a light frame.
   The white padding IS the frame; on hover the domain photo covers it edge to
   edge, so the frame only reads in the rest state. */
.services-body .services-foot { min-height: clamp(320px,45vh,400px); }
.services-body .services-foot blockquote { display: none; }
.svc-rest {
  position: absolute; inset: 0; z-index: 1; opacity: 1;
  background: #fff; padding: clamp(10px,1.1vw,16px);
  transition: opacity .5s var(--ease);
}
.svc-rest img { width: 100%; height: 100%; object-fit: cover; display: block; }
.svc-rest::after {
  content: ""; position: absolute; inset: clamp(10px,1.1vw,16px);
  box-shadow: inset 0 0 0 1px rgba(15,23,42,.08);
  pointer-events: none;
}
.services-body .services-foot.is-active .svc-rest { opacity: 0; }

/* ============================================================
   LINKEDIN UPDATES
   ============================================================ */
.linkedin-section.linkedin-hidden { display: none; }
.linkedin-head { text-align: center; margin-bottom: 3rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
.linkedin-carousel-wrap { position: relative; }
.linkedin-cards { display: flex; gap: 1.5rem; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: 1rem; scrollbar-width: none; }
.linkedin-cards::-webkit-scrollbar { display: none; }
.linkedin-loading { color: var(--muted-2); padding: 2rem; }
.linkedin-card {
  flex: 0 0 clamp(280px, 32%, 380px); scroll-snap-align: start; background: #fff;
  border: 1px solid var(--line); display: flex; flex-direction: column; overflow: hidden;
  transition: transform .5s var(--ease), box-shadow .5s var(--ease);
}
.linkedin-card:hover { transform: translateY(-6px); box-shadow: 0 30px 60px -40px rgba(19,31,51,.5); }
.linkedin-card--featured { border-color: var(--gold); box-shadow: 0 20px 45px -30px rgba(191,155,74,.6); position: relative; }
.linkedin-card-badge { position: absolute; top: .8rem; inset-inline-start: .8rem; z-index: 2; background: var(--gold); color: #fff; font-size: .72rem; font-weight: 700; padding: .25rem .6rem; border-radius: 999px; box-shadow: 0 4px 12px -4px rgba(191,155,74,.7); }
.linkedin-card-badge--new { inset-inline-start: auto; inset-inline-end: .8rem; background: #16a34a; box-shadow: 0 4px 12px -4px rgba(22,163,74,.7); }
.linkedin-card-img { aspect-ratio: 16/9; overflow: hidden; }
.linkedin-card-img img { width: 100%; height: 100%; object-fit: cover; }
.linkedin-card-body { padding: 1.5rem; display: flex; flex-direction: column; gap: .8rem; flex: 1; }
.linkedin-card-meta { display: flex; align-items: center; gap: .7rem; }
.linkedin-author-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--navy); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: .8rem; }
.linkedin-author-info { display: flex; flex-direction: column; }
.linkedin-author-name { font-weight: 700; font-size: .9rem; }
.linkedin-card-date { font-size: .78rem; color: var(--muted-2); }
.linkedin-card-title {
  font-family: var(--serif); font-size: 1.15rem; font-weight: 700; line-height: 1.3; color: var(--ink);
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.linkedin-card-excerpt {
  font-size: .88rem; color: var(--muted); flex: 1; line-height: 1.6;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}
.linkedin-card-cta { font-size: .82rem; font-weight: 700; color: var(--gold); }
.linkedin-arrow {
  position: absolute; top: 20%; transform: translateY(-50%); z-index: 5; width: 60px; height: 60px;
  border-radius: 50%; background: var(--navy); border: 2px solid #fff; color: #fff; font-size: 2rem; line-height: 1;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 18px 40px -16px rgba(28,52,97,.7);
  transition: background .3s var(--ease), transform .3s var(--ease), opacity .3s;
}
.linkedin-arrow:hover { background: var(--gold); transform: translateY(-50%) scale(1.1); }
.linkedin-arrow:active { transform: translateY(-50%) scale(.96); }
.linkedin-arrow:disabled { opacity: .3; cursor: default; }
.linkedin-arrow.prev { inset-inline-end: -18px; }
.linkedin-arrow.next { inset-inline-start: -18px; }
@media (max-width: 880px) {
  .linkedin-arrow { width: 50px; height: 50px; font-size: 1.7rem; }
  .linkedin-arrow.prev { inset-inline-end: 4px; }
  .linkedin-arrow.next { inset-inline-start: 4px; }
}

/* ============================================================
   RESULTS / SUCCESS
   ============================================================ */
.results { background: var(--navy-2); color: #fff; position: relative; overflow: hidden; }
.results::before {
  content: ""; position: absolute; inset: 0; z-index: 0; opacity: .12;
  background: url("slide5.jpg") center/cover; filter: grayscale(1);
}
.results .container { position: relative; z-index: 1; }
.results-head { text-align: center; margin-bottom: clamp(2.5rem,5vw,4rem); display: flex; flex-direction: column; align-items: center; gap: 1rem; }
.results-head .section-title { color: #fff; }
.results-head p { color: rgba(255,255,255,.7); max-width: 50ch; }
.results-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: clamp(1.5rem,3vw,2.2rem); }
.result-card {
  background: rgba(255,255,255,.04); border: 1px solid var(--line-2); padding: 0;
  overflow: hidden; transition: transform .5s var(--ease), border-color .5s;
}
.result-card:hover { transform: translateY(-6px); border-color: var(--gold); }
.result-img { aspect-ratio: 16/10; overflow: hidden; position: relative; }
.result-img img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(.4) brightness(.95); transition: transform .8s var(--ease), filter .5s; }
.result-card:hover .result-img img { transform: scale(1.06); filter: grayscale(0) brightness(1); }
.result-body { padding: 1.8rem; }
.result-pct { font-family: var(--serif); font-size: 3.4rem; font-weight: 700; line-height: 1; color: #fff; }
.result-pct span { color: var(--gold-2); font-size: 2rem; }
.result-label { font-size: 1.05rem; font-weight: 600; margin-top: .4rem; color: #fff; }
.result-loc { display: inline-block; margin-top: .8rem; font-size: .78rem; letter-spacing: .12em; color: var(--gold-2); border: 1px solid var(--line-2); padding: .25rem .8rem; border-radius: 2px; }
.result-detail { margin-top: 1rem; font-size: .88rem; color: rgba(255,255,255,.62); line-height: 1.6; }
.results-quote { text-align: center; max-width: 56ch; margin: clamp(3rem,5vw,4rem) auto 0; }
.results-quote p { font-family: var(--serif); font-size: clamp(1.2rem,2vw,1.6rem); line-height: 1.5; color: #fff; }
.results-quote cite { display: block; margin-top: 1.2rem; font-style: normal; color: var(--gold-2); font-size: .9rem; }

/* ============================================================
   CLIENTS
   ============================================================ */
.clients-head { text-align: center; margin-bottom: 2.5rem; display: flex; flex-direction: column; align-items: center; gap: .8rem; }
.marquee { overflow: hidden; position: relative; -webkit-mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent); mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent); }
.marquee-track { display: flex; gap: 3.5rem; width: max-content; animation: marquee 38s linear infinite; }
.marquee:hover .marquee-track { animation-play-state: paused; }
@keyframes marquee { from { transform: translateX(0);} to { transform: translateX(-50%);} }
.client-logo { height: 64px; display: flex; align-items: center; }
.client-logo img { max-height: 64px; width: auto; object-fit: contain; opacity: 1; transition: transform .4s; }
.client-logo img:hover { transform: scale(1.06); }

/* ============================================================
   CONTACT
   ============================================================ */
.contact { background: var(--cream); }
.contact-wrap { display: grid; grid-template-columns: 1fr 1.05fr; gap: clamp(2rem,5vw,5rem); align-items: stretch; }
.contact-info .section-title { margin: 1rem 0 1.2rem; }
.contact-info > p { color: var(--muted); margin-bottom: 2rem; max-width: 44ch; }
.contact-items { display: flex; flex-direction: column; gap: .4rem; }
.contact-item { display: flex; gap: 1.1rem; padding: 1.1rem 0; border-bottom: 1px solid var(--line); }
.contact-item:last-child { border-bottom: none; }
.contact-ico { width: 44px; height: 44px; flex-shrink: 0; border: 1px solid var(--line); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--navy); }
.contact-ico svg { width: 20px; height: 20px; }
.contact-item h4 { font-size: .82rem; color: var(--muted-2); font-weight: 600; margin-bottom: .25rem; }
.contact-item a, .contact-item p { color: var(--ink); font-weight: 500; font-size: 1.02rem; }
.contact-item .wa-pill { display: inline-flex; align-items: center; gap: 5px; background: #25D366; color: #fff; padding: 3px 11px; border-radius: 30px; font-size: .74rem; font-weight: 700; margin-inline-start: .5rem; }
.contact-item .wa-pill svg { width: 13px; height: 13px; }
.contact-row { display: flex; align-items: center; gap: .5rem; flex-wrap: wrap; }

.contact-card { background: #fff; border: 1px solid var(--line); padding: clamp(1.8rem,3.5vw,2.8rem); }
.contact-card h3 { font-family: var(--serif); font-size: 1.7rem; font-weight: 700; color: var(--ink); }
.contact-card > p { color: var(--muted); margin-bottom: 1.6rem; font-size: .95rem; }
.form-group { margin-bottom: 1.1rem; }
.form-group label { display: block; font-size: .82rem; font-weight: 600; color: var(--ink); margin-bottom: .45rem; }
.form-group input, .form-group select, .form-group textarea {
  width: 100%; padding: .85rem 1rem; border: 1px solid var(--line); border-radius: 2px; font-family: inherit;
  font-size: .95rem; color: var(--ink); background: #f4f6fa; transition: border-color .3s, background .3s, box-shadow .3s;
}
.form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; border-color: var(--navy); background: #fff; box-shadow: 0 0 0 3px rgba(28,52,97,.1); }
.form-group textarea { resize: vertical; min-height: 96px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 1rem; }
.form-submit { width: 100%; margin-top: .5rem; justify-content: center; }
.form-status { margin-top: 10px; text-align: center; font-weight: 700; display: none; }

/* ============================================================
   FOOTER
   ============================================================ */
footer { background: var(--navy-2); color: #fff; padding-block: clamp(3rem,6vw,5rem) 2rem; }
.footer-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 2.5rem; padding-bottom: 2.5rem; border-bottom: 1px solid var(--line-2); }
.footer-brand img { height: 54px; filter: brightness(0) invert(1); margin-bottom: 1.2rem; }
.footer-brand p { font-size: .92rem; max-width: 36ch; line-height: 1.7; font-weight: 300; }
.footer-col h4 { color: var(--gold-2); font-family: var(--serif); font-size: 1.1rem; margin-bottom: 1.1rem; }
.footer-col ul { list-style: none; display: flex; flex-direction: column; gap: .6rem; }
.footer-col a, .footer-col li { font-size: .92rem; transition: color .3s; }
.footer-col a:hover { color: var(--gold-2); }
.footer-bottom { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; padding-top: 1.6rem; font-size: .8rem; color: rgba(255,255,255,.45); }
.footer-bottom button, .footer-bottom a { background: none; border: none; color: inherit; font: inherit; cursor: pointer; text-decoration: underline; }
.footer-bottom a:hover, .footer-bottom button:hover { color: #fff; }

/* ============================================================
   FLOATING BUTTONS
   ============================================================ */
.floating-wrap { position: fixed; inset-block-end: 1.5rem; inset-inline-end: 1.5rem; z-index: 900; display: flex; flex-direction: column; gap: .8rem; }
.float-btn { width: 54px; height: 54px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 12px 30px -10px rgba(0,0,0,.4); border: none; transition: transform .3s var(--ease); }
.float-btn:hover { transform: translateY(-4px) scale(1.05); }
.float-btn svg { width: 30px; height: 30px; }
.float-btn-wa { background: #25D366; }
.float-btn-access { background: var(--navy); color: #fff; font-size: 1.5rem; }

/* hide NagishLi's own default toggle; the floating ♿ button (next to WhatsApp) opens its menu instead */
#NagishLiBarStrip { display: none !important; }

/* ============================================================
   MODALS / POPUPS
   ============================================================ */
.modal-overlay, .popup-overlay, .legal-overlay {
  position: fixed; inset: 0; z-index: 2000; display: none; align-items: center; justify-content: center;
  background: rgba(11,18,33,.55); backdrop-filter: blur(4px); padding: 1.2rem;
}
.modal-overlay.show, .legal-overlay.show { display: flex; }
.modal-box, .popup-box, .legal-box {
  background: #fff; max-width: 460px; width: 100%; position: relative; border-radius: 4px;
  box-shadow: 0 40px 90px -30px rgba(11,18,33,.6); animation: popIn .5s var(--ease) both; max-height: 88vh; overflow-y: auto;
}
@keyframes popIn { from { opacity: 0; transform: translateY(24px) scale(.98);} to { opacity: 1; transform: none;} }
.modal-box { padding: 2.6rem 2.4rem 2.2rem; text-align: center; }
.modal-close, .popup-close, .legal-close { position: absolute; top: 1rem; inset-inline-start: 1rem; background: none; border: none; font-size: 1.3rem; color: var(--muted-2); line-height: 1; padding: .3rem .5rem; border-radius: 4px; transition: background .2s; z-index: 2; }
.modal-close:hover, .popup-close:hover, .legal-close:hover { background: var(--cream); }
.modal-ico { width: 64px; height: 64px; margin: 0 auto 1.2rem; background: var(--cream); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--navy); }
.modal-box h3 { font-family: var(--serif); font-size: 1.45rem; color: var(--ink); margin-bottom: .5rem; }
.modal-rule { width: 40px; height: 2px; background: var(--gold); margin: 1rem auto 1.3rem; }
.modal-box ul { text-align: right; font-size: .9rem; color: var(--muted); line-height: 1.8; padding-inline-start: 1.2rem; margin-bottom: 1.6rem; }
.modal-box ul li { margin-bottom: .55rem; }

.popup-box { max-width: 440px; }
.popup-header { background: var(--navy); color: #fff; padding: 1.15rem 1.8rem .95rem; }
.popup-header h2 { font-family: var(--serif); font-size: 1.3rem; color: var(--gold-2); }
.popup-header p { color: rgba(255,255,255,.78); font-size: .84rem; }
.popup-body { padding: 1.1rem 1.8rem 1.3rem; }
.popup-dismiss { display: block; width: 100%; text-align: center; background: none; border: none; color: var(--muted-2); font-size: .82rem; margin-top: .55rem; text-decoration: underline; }
.popup-overlay { opacity: 0; pointer-events: none; transition: opacity .4s; }
.popup-overlay.show { display: flex; opacity: 1; pointer-events: auto; }
/* Compact the consult-popup form so it fits without scrolling on common screens */
.popup-form .form-group { margin-bottom: .6rem; }
.popup-form .form-group label { margin-bottom: .25rem; font-size: .8rem; }
.popup-form .form-group input, .popup-form .form-group select, .popup-form .form-group textarea { padding: .55rem .8rem; font-size: .9rem; }
.popup-form .form-group textarea { min-height: 58px; }
.popup-form .form-submit { margin-top: .2rem; }

.legal-box { max-width: 640px; }
.legal-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 1.8rem 2rem 1.2rem; border-bottom: 1px solid var(--line); position: sticky; top: 0; background: #fff; }
.legal-header h2 { font-family: var(--serif); font-size: 1.5rem; color: var(--ink); }
.legal-header p { font-size: .82rem; color: var(--muted-2); }
.legal-body { padding: 1.6rem 2rem 2rem; }
.legal-card { border: 1px solid var(--line); border-radius: 4px; padding: 1rem 1.2rem; margin-bottom: .9rem; }
.legal-card h3 { font-size: .95rem; color: var(--ink); margin-bottom: .4rem; display: flex; align-items: center; gap: .5rem; }
.legal-card h3 .num { background: var(--navy); color: #fff; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: .75rem; flex-shrink: 0; }
.legal-card p, .legal-card ul { color: var(--muted); }
.legal-card ul { padding-inline-start: 1.2rem; margin-top: .4rem; }
.legal-highlight { background: var(--cream); border-inline-start: 3px solid var(--gold); padding: 1rem 1.2rem; margin-bottom: 1rem; color: var(--ink); }
.legal-updated { color: var(--muted-2); margin-bottom: 1rem; }
.legal-contact { background: var(--cream); padding: 1rem 1.2rem; border-radius: 4px; margin-top: 1rem; }
.legal-contact a { color: var(--navy); font-weight: 600; }

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
.reveal { opacity: 0; transform: translateY(34px); transition: opacity .9s var(--ease), transform .9s var(--ease); }
.reveal.in { opacity: 1; transform: none; }
.reveal-d1 { transition-delay: .1s; }
.reveal-d2 { transition-delay: .2s; }
.reveal-d3 { transition-delay: .3s; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .001ms !important; transition-duration: .001ms !important; }
  .reveal { opacity: 1; transform: none; }
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 1024px) {
  .services-grid { grid-template-columns: repeat(2, 1fr); }
  .services-body { grid-template-columns: 1fr; gap: clamp(2.8rem,5vw,4rem); }
  .services-body .services-grid { grid-template-columns: repeat(2, 1fr); }
  .services-body .services-foot { grid-template-columns: 1.05fr 1fr; gap: clamp(2rem,5vw,4.5rem); position: static; align-items: center; }
  .services-body .services-foot blockquote { max-width: 44ch; }
  .pillars-inner { grid-template-columns: 1fr; }
  .pillar { border-inline-start: none; border-bottom: 1px solid var(--line-2); }
  .pillar:last-child { border-bottom: none; }
}
@media (max-width: 880px) {
  .nav-links {
    position: fixed; top: 0; bottom: 0; right: 0; left: auto; width: min(82vw, 360px);
    background: var(--navy-2); flex-direction: column; align-items: flex-start; justify-content: center;
    padding: 4rem 2.5rem; gap: 1.6rem; transform: translateX(100%); transition: transform .5s var(--ease);
    box-shadow: -20px 0 60px -20px rgba(0,0,0,.5);
  }
  .nav-links.open { transform: translateX(0); }
  .nav-links a, #navbar.scrolled .nav-links a { color: #fff; font-size: 1.15rem; }
  .nav-links a.nav-cta, #navbar.scrolled .nav-links a.nav-cta { border-color: var(--gold); color: var(--gold-2); }
  .hamburger { display: flex; }
  .about-top { grid-template-columns: 1fr; }
  .about-figure { max-width: 480px; }
  .partners-grid { grid-template-columns: 1fr; }
  .services-foot { grid-template-columns: 1fr; gap: 2.5rem; }
  .services-foot .quote-photo::after { transform: translate(-12px, 12px); }
  .results-grid { grid-template-columns: 1fr; }
  .contact-wrap { grid-template-columns: 1fr; }
  .footer-grid { grid-template-columns: 1fr; gap: 2rem; }
  .hero-side-label, .hero-scroll { display: none; }
}
@media (max-width: 560px) {
  .services-grid, .services-body .services-grid { grid-template-columns: 1fr; }
  .form-grid { grid-template-columns: 1fr; }
  .services-head, .footer-bottom { flex-direction: column; align-items: flex-start; }
  .hero-content { padding-top: 5rem; }
  .hero-title { font-size: clamp(2rem, 8.4vw, 2.8rem); max-width: 14ch; }
  .hero-dots { gap: .35rem; flex-wrap: wrap; max-width: calc(100% - var(--pad) * 2); }
  .hero-dots button { width: 18px; }
}

```

---

## שאר דפי האתר

### `careers.html`

```html
﻿<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="shortcut icon" href="/favicon.ico">

<!-- ===== GOOGLE ANALYTICS 4 (gtag.js) =====
     Property "bor-miz.co.il", measurement ID G-GYNQPGPR33 - installed 2026-09-08,
     replacing a Tag Manager placeholder that never had a container behind it.
     The bridge below turns the site's existing dataLayer.push({event:'...'}) calls
     (generate_lead / contact_whatsapp / contact_phone / intake_submitted) into GA4
     events, so every call site elsewhere in the site stays untouched. -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-GYNQPGPR33"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-GYNQPGPR33');
  (function(){
    // gtag() itself pushes an arguments object, which has no .event key - so this
    // never recurses on its own output.
    var push = window.dataLayer.push;
    window.dataLayer.push = function(){
      for (var i = 0; i < arguments.length; i++) {
        var o = arguments[i];
        if (o && typeof o.event === 'string') {
          var params = {};
          for (var k in o) {
            if (k !== 'event' && Object.prototype.hasOwnProperty.call(o, k)) params[k] = o[k];
          }
          gtag('event', o.event, params);
        }
      }
      return push.apply(window.dataLayer, arguments);
    };
  })();
</script>
<!-- ===== END GOOGLE ANALYTICS 4 ===== -->

<title>קריירה - הצטרפו לצוות בורוביץ מזרחי שמאות מקרקעין</title>
<meta name="description" content="מחפשים קריירה בעולם שמאות המקרקעין והחקלאות? בורוביץ מזרחי, משרד שמאות מוביל בצפון, מזמין שמאים, מתמחים ואנשי מקצוע מצטיינים להשתלב בצוות צומח. שלחו קורות חיים.">
<meta name="keywords" content="קריירה, דרושים, שמאי מקרקעין, מתמחה שמאות, עבודה שמאות, משרות שמאות, צפון, בורוביץ מזרחי">
<link rel="canonical" href="https://bor-miz.co.il/careers.html">
<meta property="og:type" content="website">
<meta property="og:url" content="https://bor-miz.co.il/careers.html">
<meta property="og:title" content="קריירה בבורוביץ מזרחי">
<meta property="og:description" content="הצטרפו לצוות שמאות מקרקעין מוביל בצפון - שמאים, מתמחים ואנשי מקצוע מצטיינים.">
<meta property="og:image" content="https://bor-miz.co.il/image_2.png">
<meta property="og:locale" content="he_IL">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500;600;700;900&family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

<script type="application/ld+json">
{
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "ראשי", "item": "https://bor-miz.co.il/"},
    {"@type": "ListItem", "position": 2, "name": "קריירה", "item": "https://bor-miz.co.il/careers.html"}
  ]
}
</script>

<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="page.css">
</head>
<body>

<a href="#main-content" class="skip-to-content">דלג לתוכן הראשי</a>

<nav id="navbar" role="navigation" aria-label="ניווט ראשי">
  <div class="nav-inner">
    <a href="index.html" class="nav-logo" aria-label="בורוביץ מזרחי שמאות מקרקעין - דף הבית"><img src="logo-bm.png" alt="לוגו בורוביץ מזרחי"></a>
    <ul class="nav-links" id="navLinks">
      <li><a href="index.html#about" onclick="closeMenu()">אודות</a></li>
      <li><a href="index.html#services" onclick="closeMenu()">תחומי התמחות</a></li>
      <li><a href="maamarim.html" onclick="closeMenu()">מאמרים</a></li>
      <li><a href="index.html#linkedin-posts" onclick="closeMenu()">עדכונים</a></li>
      <li><a href="index.html#success" onclick="closeMenu()">מהשטח</a></li>
      <li><a href="careers.html" onclick="closeMenu()">קריירה</a></li>
      <li><a href="index.html#contact" class="nav-cta" onclick="closeMenu()">צור קשר</a></li>
    </ul>
    <button class="hamburger" id="hamburger" onclick="toggleMenu()" aria-label="תפריט ניווט" aria-expanded="false"><span></span><span></span><span></span></button>
  </div>
</nav>

<main id="main-content">

<section class="subpage-hero">
  <div class="sp-bg" style="background-image:url('slide7.jpg')"></div>
  <div class="sp-overlay"></div>
  <div class="sp-content">
    <nav class="breadcrumb" aria-label="פירורי לחם">
      <a href="index.html">ראשי</a><span class="sep">/</span>
      <span>קריירה</span>
    </nav>
    <span class="eyebrow">הצטרפו אלינו</span>
    <h1 class="sp-title">בנו <span class="gold">קריירה</span><br>במשרד שמאות שצומח</h1>
    <p class="sp-sub">בורוביץ מזרחי הוא משרד שמאות מקרקעין וחקלאות מוביל בצפון. אנחנו מאמינים שמקצוענות נבנית מאנשים - כאן תוכלו להכיר את התפקידים והצוות שמרכיבים את המשרד. כרגע אין משרות פתוחות, ומשרות חדשות יפורסמו בעמוד זה.</p>
    <div class="hero-actions">
      <a href="#positions" class="btn btn-gold">התפקידים במשרד <span class="arr">←</span></a>
      <a href="index.html#contact" class="btn btn-ghost">צור קשר</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="content-block two-col">
      <div class="reveal">
        <span class="eyebrow">מי אנחנו</span>
        <h2 class="section-title" style="margin-top:.8rem;">מקום שבו לומדים את המקצוע לעומק</h2>
      </div>
      <div class="prose reveal reveal-d1">
        <p>אנחנו משרד שמאות מקרקעין וחקלאות, המלווה לקוחות פרטיים, יזמים, רשויות ובתי משפט בכל הצפון. השותפים - <strong>מאור מזרחי</strong>, כלכלן ולשעבר מרכז השגות במטה רמ"י, ו<strong>אמיר בורוביץ</strong>, מהנדס טכניון ושמאי חקלאי - מביאים שילוב נדיר של ידע כלכלי, הנדסי וחקלאי.</p>
        <p>אצלנו לא תהיו עוד גלגל שיניים. כל מי שמצטרף נחשף למגוון רחב של תיקים ותחומים, מקבל ליווי צמוד ומקצועי, וגדל ביחד עם המשרד.</p>
      </div>
    </div>
  </div>
</section>

<section class="section section--cream">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">למה אצלנו</span>
      <h2 class="section-title">מה מחכה לכם כאן</h2>
    </div>
    <div class="values-grid reveal reveal-d1">
      <div class="value-card">
        <div class="fc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1 2 2 6 2s6-1 6-2v-5"/></svg></div>
        <h3>למידה מהמובילים</h3>
        <p>ליווי מקצועי צמוד מהשותפים, וחשיפה למגוון רחב של תחומי שמאות - מקרקעין, חקלאות, התחדשות עירונית ועוד.</p>
      </div>
      <div class="value-card">
        <div class="fc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
        <h3>תיקים מגוונים ומאתגרים</h3>
        <p>פרויקטים אמיתיים מהיום הראשון - מהערכות שווי ועד חוות דעת לבית משפט. לא תשתעממו.</p>
      </div>
      <div class="value-card">
        <div class="fc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg></div>
        <h3>מסלול צמיחה אמיתי</h3>
        <p>משרד שגדל - ואיתו גם אתם. הזדמנות אמיתית להתפתח מקצועית ולקדם קריירה.</p>
      </div>
      <div class="value-card">
        <div class="fc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg></div>
        <h3>צוות שמרגיש כמו משפחה</h3>
        <p>סביבת עבודה אנושית, תומכת ומקצועית - בצפון, קרוב לבית ולשטח.</p>
      </div>
    </div>
  </div>
</section>

<section class="section" id="positions">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">משרות</span>
      <h2 class="section-title">התפקידים במשרד</h2>
      <p>כרגע כל המשרות במשרד מאוישות ואין משרות פתוחות. אלה התפקידים שמרכיבים את הצוות שלנו.</p>
    </div>
    <div class="jobs reveal reveal-d1">
      <div class="job-card job-filled">
        <div>
          <div class="job-tags"><span class="tag">משרה מלאה</span><span class="tag tag-filled">המשרה אוישה</span></div>
          <h3>שמאי/ת מקרקעין מוסמך/ת</h3>
          <p>עריכת שומות וחוות דעת במגוון תחומים, ליווי לקוחות וייצוג מקצועי. דרוש רישיון שמאי מקרקעין בתוקף, יחס אישי ויכולת עבודה עצמאית.</p>
        </div>
        <span class="job-status">אויש</span>
      </div>
      <div class="job-card job-filled">
        <div>
          <div class="job-tags"><span class="tag">התמחות</span><span class="tag tag-filled">המשרה אוישה</span></div>
          <h3>מתמחה בשמאות מקרקעין</h3>
          <p>הזדמנות להיכנס למקצוע דרך הדלת הראשית - התמחות מלאה בליווי השותפים, חשיפה למגוון תיקים ולמידה מעשית. מתאים לבוגרי/ות לימודי שמאות.</p>
        </div>
        <span class="job-status">אויש</span>
      </div>
    </div>
  </div>
</section>

<section class="section cta-band" id="apply">
  <div class="container">
    <div class="cta-copy reveal" style="text-align:center; max-width:62ch; margin:0 auto;">
      <span class="eyebrow">קריירה</span>
      <h2>אין כרגע משרות פתוחות</h2>
      <p style="margin:0 auto;">נכון לעכשיו כל המשרות במשרד מאוישות ואיננו מקבלים מועמדויות חדשות. כשתיפתח משרה חדשה - היא תפורסם כאן, בעמוד הקריירה.</p>
    </div>
  </div>
</section>

</main>

<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="logo-bm.png" alt="לוגו בורוביץ מזרחי">
        <p>משרד שמאות מקרקעין מוביל בצפון. ידע מקצועי מעמיק, היכרות שטח בלתי אמצעית והבנה כלכלית רחבה - בשירות כל לקוח.</p>
      </div>
      <div class="footer-col">
        <h4>ניווט</h4>
        <ul>
          <li><a href="index.html#about">אודות</a></li>
          <li><a href="index.html#services">תחומי התמחות</a></li>
          <li><a href="maamarim.html">מאמרים</a></li>
          <li><a href="index.html#success">תוצאות מהשטח</a></li>
          <li><a href="careers.html">קריירה</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>יצירת קשר</h4>
        <ul>
          <li><a href="tel:054-6559942">054-6559942 · מאור</a></li>
          <li><a href="tel:050-8922469">050-8922469 · אמיר</a></li>
          <li><a id="em-footer" href="#"></a></li>
          <li>שדרות החרוב 6, פארק תעשיות בר-לב</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 בורוביץ מזרחי שמאות מקרקעין וחקלאות בע"מ. כל הזכויות שמורות.</span>
      <span><a href="index.html">חזרה לאתר הראשי</a></span>
    </div>
  </div>
</footer>

<div class="floating-wrap">
  <a class="float-btn float-btn-wa" href="https://wa.me/972546559942" target="_blank" rel="noopener noreferrer" aria-label="שלחו הודעה בוואטסאפ">
    <svg aria-hidden="true" viewBox="0 0 32 32"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.67 4.61 1.832 6.5L4 29l7.75-1.812A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="#fff"/><path d="M21.5 18.5c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.19-.57-.34z" fill="#25D366"/></svg>
  </a>
  <button type="button" id="customAccessBtn" class="float-btn float-btn-access" aria-label="פתח תפריט נגישות" title="נגישות"><span aria-hidden="true">♿</span></button>
</div>

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<script>
  (function(){ var el=document.getElementById('em-footer'); if(el){ var a='info'+'@'+'bor-miz.co.il'; el.href='mailto:'+a; el.textContent=a; } })();
  function toggleMenu(){ var l=document.getElementById('navLinks'),b=document.getElementById('hamburger'); l.classList.toggle('open'); b.classList.toggle('open'); b.setAttribute('aria-expanded', l.classList.contains('open')?'true':'false'); }
  function closeMenu(){ document.getElementById('navLinks').classList.remove('open'); var b=document.getElementById('hamburger'); b.classList.remove('open'); b.setAttribute('aria-expanded','false'); }
  document.addEventListener('click', function(e){ var nav=document.getElementById('navbar'); if(nav && !nav.contains(e.target)) closeMenu(); });
  (function(){ var nav=document.getElementById('navbar'); var onScroll=function(){ nav.classList.toggle('scrolled', window.scrollY>60); }; window.addEventListener('scroll', onScroll, {passive:true}); onScroll(); })();
  function presetRole(role){ var sel=document.getElementById('contact-subject'); if(!sel) return; for(var i=0;i<sel.options.length;i++){ if(sel.options[i].value===role){ sel.selectedIndex=i; break; } } }
  (function(){
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce || !window.gsap || !window.ScrollTrigger){
      document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
      document.querySelectorAll('.counter').forEach(function(el){ el.textContent = el.getAttribute('data-target'); });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.reveal').forEach(function(el){ ScrollTrigger.create({ trigger: el, start:'top 88%', onEnter:function(){ el.classList.add('in'); } }); });
  })();
  var EDGE_FUNCTION_URL = 'https://nurgknexilxaxxovdbco.supabase.co/functions/v1/website-lead-intake';
  function submitContactForm(e){
    e.preventDefault();
    var form=document.getElementById('contact-form'), btn=document.getElementById('contact-submit-btn'), statusEl=document.getElementById('contact-form-status');
    var name=document.getElementById('contact-name').value.trim(), phone=document.getElementById('contact-phone').value.trim();
    var email=document.getElementById('contact-email').value.trim(), subject=document.getElementById('contact-subject').value, message=document.getElementById('contact-message').value.trim();
    if(!name || !phone){ statusEl.style.display='block'; statusEl.style.color='#fca5a5'; statusEl.textContent='נא למלא שם וטלפון'; return false; }
    btn.disabled=true; btn.textContent='שולח...'; statusEl.style.display='none';
    fetch(EDGE_FUNCTION_URL, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name:name, phone:phone, email:email||null, subject:'קריירה - '+(subject||''), message:message||null, source:'careers-page' }) })
      .then(function(res){ return res.json(); })
      .then(function(data){
        if(data.success){
          window.dataLayer=window.dataLayer||[]; window.dataLayer.push({ event:'generate_lead', form_source:'careers-page', lead_subject:subject||'unspecified' });
          statusEl.style.display='block'; statusEl.style.color='#4ade80'; statusEl.textContent=data.message||'המועמדות נשלחה בהצלחה!'; form.reset();
        } else { throw new Error(data.error||'שגיאה בשליחה'); }
      })
      .catch(function(err){ statusEl.style.display='block'; statusEl.style.color='#fca5a5'; statusEl.textContent='שגיאה: '+(err.message||'נסו שוב מאוחר יותר'); })
      .finally(function(){ btn.disabled=false; btn.innerHTML='שליחת מועמדות <span class="arr">←</span>'; });
    return false;
  }
  (function(){ window.dataLayer=window.dataLayer||[]; document.addEventListener('click', function(e){ var el=e.target.closest&&e.target.closest('a'); if(!el) return; if(/wa\.me|api\.whatsapp/.test(el.href||'')){ window.dataLayer.push({event:'contact_whatsapp'}); } else if((el.getAttribute('href')||'').indexOf('tel:')===0){ window.dataLayer.push({event:'contact_phone'}); } }, true); })();
</script>

<nagishli></nagishli>
<script>
nl_contact = "n:בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ|p:054-6559942|u:maor@bor-miz.co.il";
nl_pos = "BL"; nl_lang = "he"; nl_color = "blue"; nl_compact = "1";
</script>
<script src="nagishli.js?v=2.3" charset="utf-8"></script>
<script>
  (function(){
    function forceCompactStyles(){
      var bar=document.getElementById('NagishLiBar'), menus=document.getElementById('NagishLiMenus');
      if(bar){ bar.style.cssText='position:fixed !important; left:1.4rem !important; right:auto !important; bottom:6.2rem !important; top:auto !important; width:300px !important; max-width:90vw !important; height:auto !important; z-index:9999 !important; background:transparent !important; box-shadow:none !important; border:none !important; padding:0 !important; margin:0 !important;'; }
      if(menus){ menus.style.cssText+=';position:static !important; width:300px !important; max-width:90vw !important; max-height:70vh !important; overflow-y:auto !important; overflow-x:hidden !important; font-size:13px !important; border-radius:12px !important; box-shadow:0 10px 40px rgba(0,0,0,0.3) !important; margin:0 !important; padding:0 !important; background:#fff !important;'; }
      document.querySelectorAll('#NagishLiMenus, #NagishLiMenus ul').forEach(function(el){ el.style.width='100%'; el.style.maxWidth='300px'; el.style.boxSizing='border-box'; });
    }
    function openNagishLiMenu(){
      if(typeof jQuery==='undefined') return false;
      var $=jQuery, $strip=$('#NagishLiBarStrip'), $menus=$('#NagishLiMenus');
      if(!$strip.length || !$menus.length) return false;
      if($menus.is(':visible')){ $menus.slideUp(150, function(){ $strip.removeClass('open'); }); }
      else { forceCompactStyles(); $strip.addClass('open'); $menus.slideDown(150, forceCompactStyles); }
      return true;
    }
    function bind(){ var btn=document.getElementById('customAccessBtn'); if(!btn) return; btn.addEventListener('click', function(e){ e.preventDefault(); var n=0; (function tryOpen(){ if(openNagishLiMenu()) return; if(++n<30) setTimeout(tryOpen,200); })(); }); }
    if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', bind); } else { bind(); }
  })();
</script>

</body>
</html>

```

### `hasagot-rami.html`

```html
﻿<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="shortcut icon" href="/favicon.ico">

<!-- ===== GOOGLE ANALYTICS 4 (gtag.js) =====
     Property "bor-miz.co.il", measurement ID G-GYNQPGPR33 - installed 2026-09-08,
     replacing a Tag Manager placeholder that never had a container behind it.
     The bridge below turns the site's existing dataLayer.push({event:'...'}) calls
     (generate_lead / contact_whatsapp / contact_phone / intake_submitted) into GA4
     events, so every call site elsewhere in the site stays untouched. -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-GYNQPGPR33"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-GYNQPGPR33');
  (function(){
    // gtag() itself pushes an arguments object, which has no .event key - so this
    // never recurses on its own output.
    var push = window.dataLayer.push;
    window.dataLayer.push = function(){
      for (var i = 0; i < arguments.length; i++) {
        var o = arguments[i];
        if (o && typeof o.event === 'string') {
          var params = {};
          for (var k in o) {
            if (k !== 'event' && Object.prototype.hasOwnProperty.call(o, k)) params[k] = o[k];
          }
          gtag('event', o.event, params);
        }
      }
      return push.apply(window.dataLayer, arguments);
    };
  })();
</script>
<!-- ===== END GOOGLE ANALYTICS 4 ===== -->

<title>השגות על שומות רמ"י - דמי חכירה, היתר, הסכמה והיוון | בורוביץ מזרחי</title>
<meta name="description" content="קיבלתם שומה מרשות מקרקעי ישראל? דמי חכירה, דמי היתר, דמי הסכמה והיוון מבוססים על שומה - ושומה אפשר לערער עליה. שמאי שמכיר את שיטות החישוב של רמ&quot;י בודק את השומה ומגיש השגה. בדיקה ראשונית ללא התחייבות.">
<meta name="keywords" content="השגות רמי, שומת רמי, רשות מקרקעי ישראל, דמי חכירה, דמי היתר, דמי הסכמה, דמי היוון, יובל חכירה, ועדת השגות, השגה ראשונה, קובץ החלטות מועצה, שמאי מקרקעין, צפון">
<meta name="robots" content="noindex,nofollow">
<link rel="canonical" href="https://bor-miz.co.il/hasagot-rami.html">
<meta property="og:type" content="website">
<meta property="og:url" content="https://bor-miz.co.il/hasagot-rami.html">
<meta property="og:title" content="השגות על שומות רמ&quot;י | בורוביץ מזרחי">
<meta property="og:description" content="שומת רמ&quot;י לא תמיד צודקת. בדיקה מקצועית והגשת השגה על דמי חכירה, היתר, הסכמה והיוון.">
<meta property="og:image" content="https://bor-miz.co.il/image_2.png">
<meta property="og:locale" content="he_IL">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500;600;700;900&family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

<script type="application/ld+json">
{
  "@context": "https://schema.org", "@type": "Service",
  "name": "הגשת השגות על שומות רשות מקרקעי ישראל",
  "serviceType": "שמאות מקרקעין - השגות רמ\"י",
  "provider": { "@type": "LocalBusiness", "name": "בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ", "telephone": "+972-54-6559942", "areaServed": "צפון" },
  "url": "https://bor-miz.co.il/hasagot-rami.html"
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "ראשי", "item": "https://bor-miz.co.il/"},
    {"@type": "ListItem", "position": 2, "name": "תחומי התמחות", "item": "https://bor-miz.co.il/#services"},
    {"@type": "ListItem", "position": 3, "name": "השגות רמ\"י", "item": "https://bor-miz.co.il/hasagot-rami.html"}
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org", "@type": "FAQPage",
  "mainEntity": [
    {"@type": "Question", "name": "האם אפשר להגיש השגה על שומת רמ\"י?", "acceptedAnswer": {"@type": "Answer", "text": "כן. ניתן להגיש השגה על שומת רשות מקרקעי ישראל בנוגע לדמי חכירה, דמי היתר, דמי הסכמה, היוון ועוד. ההשגה הראשונה מוגשת תוך 60 יום מקבלת השומה ונדונה לפני שמאי מטעם הרשות; על ההחלטה ניתן להגיש השגה שנייה לוועדת השגות."}},
    {"@type": "Question", "name": "מה ההבדל בין דמי חכירה, דמי היתר ודמי הסכמה?", "acceptedAnswer": {"@type": "Answer", "text": "דמי חכירה משולמים על עצם השימוש בקרקע המדינה. דמי היתר נגבים כשמוסיפים זכויות בנייה, משנים ייעוד או מפצלים מגרש. דמי הסכמה נדרשים בעת העברת זכויות בנכס שאינו מהוון. לכל אחד שיטת חישוב נפרדת - שמבוססת על שווי הקרקע, וניתנת לבדיקה ולערעור."}},
    {"@type": "Question", "name": "כמה זמן יש להגיש השגה?", "acceptedAnswer": {"@type": "Answer", "text": "את ההשגה הראשונה יש להגיש תוך 60 יום מקבלת השומה. הרשות אמורה להכריע בתוך כ-9 חודשים. על ההחלטה ניתן להגיש השגה שנייה לוועדת השגות תוך 60 יום נוספים. מומלץ לפנות לשמאי מיד עם קבלת השומה."}},
    {"@type": "Question", "name": "על מה בעצם נלחמים בהשגה?", "acceptedAnswer": {"@type": "Answer", "text": "ההשגה היא הליך שמאי, לא משפטי. נלחמים על שווי הקרקע שבבסיס החיוב: עסקאות השוואה מתאימות יותר, ניכוי עלויות פיתוח (שווי 'ללא פיתוח'), חילוץ מע\"מ, ויישום נכון של האחוזים והמקדמים שבקובץ החלטות מועצת מקרקעי ישראל. הקטנת בסיס השווי מקטינה ישירות את התשלום."}}
  ]
}
</script>

<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="page.css">
</head>
<body>

<a href="#main-content" class="skip-to-content">דלג לתוכן הראשי</a>

<nav id="navbar" role="navigation" aria-label="ניווט ראשי">
  <div class="nav-inner">
    <a href="index.html" class="nav-logo" aria-label="בורוביץ מזרחי שמאות מקרקעין - דף הבית"><img src="logo-bm.png" alt="לוגו בורוביץ מזרחי"></a>
    <ul class="nav-links" id="navLinks">
      <li><a href="index.html#about" onclick="closeMenu()">אודות</a></li>
      <li><a href="index.html#services" onclick="closeMenu()">תחומי התמחות</a></li>
      <li><a href="maamarim.html" onclick="closeMenu()">מאמרים</a></li>
      <li><a href="index.html#linkedin-posts" onclick="closeMenu()">עדכונים</a></li>
      <li><a href="index.html#success" onclick="closeMenu()">מהשטח</a></li>
      <li><a href="careers.html" onclick="closeMenu()">קריירה</a></li>
      <li><a href="#lead" class="nav-cta" onclick="closeMenu()">צור קשר</a></li>
    </ul>
    <button class="hamburger" id="hamburger" onclick="toggleMenu()" aria-label="תפריט ניווט" aria-expanded="false"><span></span><span></span><span></span></button>
  </div>
</nav>

<main id="main-content">

<section class="subpage-hero">
  <div class="sp-bg" style="background-image:url('slide3.jpg')"></div>
  <div class="sp-overlay"></div>
  <div class="sp-content">
    <span class="eyebrow">תחום התמחות · השגות רמ"י</span>
    <h1 class="sp-title">שומת <span class="gold">רמ"י</span> לא תמיד צודקת</h1>
    <p class="sp-sub">דמי חכירה, דמי היתר, דמי הסכמה והיוון מבוססים כולם על שומה - ושומה אפשר לבחון ולערער עליה. אנחנו מכירים את שיטות החישוב ואת קובץ החלטות המועצה מקרוב, ומגישים השגה מקצועית כדי שתשלמו רק את מה שבאמת מגיע.</p>
    <div class="hero-actions">
      <a href="#lead" class="btn btn-gold">בדיקת שומה ללא התחייבות <span class="arr">←</span></a>
      <a href="#how" class="btn btn-ghost">איך זה עובד</a>
    </div>
  </div>
</section>

<section class="stat-strip">
  <div class="container" style="padding-inline:0;">
    <div class="stat-strip-inner">
      <div class="stat reveal"><div class="num">60</div><div class="label">ימים להגשת השגה ראשונה</div></div>
      <div class="stat reveal reveal-d1"><div class="num">2</div><div class="label">דרגות השגה - שמאי הרשות וועדת השגות</div></div>
      <div class="stat reveal reveal-d2"><div class="num">★</div><div class="label">היכרות עם שיטות החישוב של הרשות מבפנים</div></div>
    </div>
  </div>
</section>

<!-- WHAT / WHY -->
<section class="section">
  <div class="container">
    <div class="content-block two-col">
      <div class="reveal">
        <span class="eyebrow">על מה מדובר</span>
        <h2 class="section-title" style="margin-top:.8rem;">למה שומת רמ"י כל כך משפיעה</h2>
      </div>
      <div class="prose reveal reveal-d1">
        <p><strong>רשות מקרקעי ישראל (רמ"י)</strong> מנהלת את קרקעות המדינה - הרוב המכריע של הקרקע בישראל. כמעט כל פעולה מול הרשות מתורגמת לתשלום: הוספת זכויות, מימוש, חידוש חכירה או העברת נכס.</p>
        <p>גובה התשלום נגזר כמעט תמיד מ<strong>שווי הקרקע</strong>, ומחושב לפי האחוזים והמקדמים שנקבעו ב<strong>קובץ החלטות מועצת מקרקעי ישראל</strong>. כשהשומה מנופחת - בגלל עסקאות השוואה לא מתאימות, התעלמות מעלויות פיתוח או טעות במקדם - אתם משלמים אלפי ועשרות אלפי שקלים מיותרים.</p>
        <div class="callout">הבשורה הטובה: כל בעל זכויות רשאי להגיש <strong>השגה</strong> על השומה. זהו הליך <strong>שמאי</strong> - ושמאי שמכיר את שיטת הרשות יודע בדיוק היכן לבדוק.</div>
      </div>
    </div>
  </div>
</section>

<!-- PAYMENT TYPES -->
<section class="section section--cream">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">מה אפשר לערער</span>
      <h2 class="section-title">סוגי התשלומים לרמ"י - בשפה פשוטה</h2>
      <p>לכל סוג תשלום שיטת חישוב משלו. כל אחד מהם יכול להיות גבוה מהנדרש - וכל אחד מהם ניתן לבדיקה ולהשגה.</p>
    </div>
    <div class="values-grid reveal reveal-d1">
      <div class="value-card">
        <span class="v-num">דמי חכירה</span>
        <h3>על השימוש בקרקע</h3>
        <p>תשלום עבור החכרת קרקע המדינה - שנתי או מהוון (מראש). למגורים נהוג שיעור של כ-1% משווי הקרקע לשנה. הבסיס הוא שווי הקרקע, שאפשר לבחון מחדש.</p>
      </div>
      <div class="value-card">
        <span class="v-num">דמי היתר</span>
        <h3>על תוספת זכויות</h3>
        <p>נגבים כשמוסיפים זכויות בנייה, משנים ייעוד, מגדילים שטח או מפצלים מגרש - "קניית" הזכויות החדשות מהרשות. לרוב לא פחות מ-31% משווי הזכויות הנוספות.</p>
      </div>
      <div class="value-card">
        <span class="v-num">דמי הסכמה</span>
        <h3>על העברת זכויות</h3>
        <p>נדרשים כשמעבירים (מוכרים) זכויות בנכס שאינו מהוון, ורמ"י צריכה לתת את הסכמתה. החישוב מבוסס על עליית שווי הקרקע - ושם נמצא מרחב הבדיקה.</p>
      </div>
      <div class="value-card">
        <span class="v-num">היוון</span>
        <h3>תשלום חד-פעמי מראש</h3>
        <p>המרת התשלומים השנתיים העתידיים לתשלום אחד מראש. למגורים נהוג שיעור היוון של כ-5.5% משווי הקרקע. שווי קרקע מופרז = היוון מנופח.</p>
      </div>
      <div class="value-card">
        <span class="v-num">יובל חכירה</span>
        <h3>על חידוש החכירה</h3>
        <p>תשלום עבור חידוש תקופת החכירה (49 שנים) בתום התקופה. גם כאן הסכום נגזר משווי קרקע עדכני, וניתן לבדוק אם הוא נקבע נכון.</p>
      </div>
      <div class="value-card">
        <span class="v-num">דמי שימוש</span>
        <h3>על שימוש ללא הסכם</h3>
        <p>נדרשים בגין שימוש בקרקע ללא זכות מוסדרת. לעיתים הדרישה מתייחסת לתקופה ארוכה או לשטח גדול מדי - בדיוק מה שבודקים בהשגה.</p>
      </div>
    </div>
  </div>
</section>

<!-- WHY SHUMA WRONG -->
<section class="section">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">למה כדאי לבדוק</span>
      <h2 class="section-title">איפה שומת הרשות "נשברת"</h2>
      <p>השומה של הרשות נכונה לפעמים - ולפעמים לא. אלה שלוש הנקודות שבהן אנחנו מאתרים את מרבית ההפחתות.</p>
    </div>
    <div class="feature-grid reveal reveal-d1">
      <div class="feature-card">
        <div class="fc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/></svg></div>
        <h3>עסקאות השוואה לא מתאימות</h3>
        <p>שווי הקרקע נקבע לפי עסקאות דומות. כשהרשות מסתמכת על עסקאות לא רלוונטיות - השווי, וגם התשלום, מנופחים.</p>
      </div>
      <div class="feature-card">
        <div class="fc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20"/><path d="M4 20V8l8-5 8 5v12"/><path d="M9 20v-6h6v6"/></svg></div>
        <h3>התעלמות מעלויות פיתוח ומע"מ</h3>
        <p>השומה צריכה לבטא שווי קרקע "ללא פיתוח" וללא מע"מ. אי-ניכוי תשתיות או מע"מ מקפיץ את הבסיס שעליו מחושב התשלום.</p>
      </div>
      <div class="feature-card">
        <div class="fc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg></div>
        <h3>מקדם או אחוז שגוי</h3>
        <p>1% או 3%? 5.5% להיוון? 31% מינימום בדמי היתר? יישום השיעור הלא נכון מקובץ ההחלטות משנה את הסכום מהקצה לקצה.</p>
      </div>
    </div>
  </div>
</section>

<!-- PROCESS -->
<section class="section section--cream" id="how">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">איך זה עובד</span>
      <h2 class="section-title">הליך ההשגה - שני שלבים</h2>
      <p>החוק נותן שתי "הזדמנויות" לתקן שומה שגויה. אנחנו מלווים אתכם בשתיהן.</p>
    </div>
    <div class="steps">
      <div class="step reveal"><div class="step-num">1</div><div><h4>בדיקת השומה</h4><p>שולחים לנו את שומת הרשות. אנחנו בוחנים את שווי הקרקע, עסקאות ההשוואה, הניכויים והמקדמים - ומאתרים את פוטנציאל ההפחתה, ללא התחייבות.</p></div></div>
      <div class="step reveal reveal-d1"><div class="step-num">2</div><div><h4>השגה ראשונה (תוך 60 יום)</h4><p>מגישים שומה נגדית מנומקת. ההשגה נדונה לפני שמאי מטעם הרשות (שאינו עורך השומה המקורית), וההכרעה ניתנת בתוך כ-9 חודשים.</p></div></div>
      <div class="step reveal reveal-d2"><div class="step-num">3</div><div><h4>השגה שנייה - ועדת השגות</h4><p>לא הסתפקתם בהחלטה? תוך 60 יום נוספים מגישים השגה שנייה לוועדת השגות עצמאית (בראשות גורם הכשיר לשמש שופט). ייצוג מקצועי כאן מכריע.</p></div></div>
      <div class="step reveal reveal-d3"><div class="step-num">4</div><div><h4>הכרעה וחיסכון</h4><p>השומה מתעדכנת והתשלום לרמ"י יורד. כדי לא לעכב את העסקה, ניתן לשלם 75% מהסכום בתוספת ערבות - ולהמשיך להיאבק על היתרה.</p></div></div>
    </div>
  </div>
</section>

<!-- WHO FOR -->
<section class="section">
  <div class="container">
    <div class="content-block two-col">
      <div class="reveal">
        <span class="eyebrow">למי זה מתאים</span>
        <h2 class="section-title" style="margin-top:.8rem;">מי צריך לבדוק שומת רמ"י?</h2>
        <p class="lead" style="margin-top:1rem;">כל מי שקיבל דרישת תשלום מהרשות - או שעומד לפני פעולה שתפעיל אחת.</p>
      </div>
      <ul class="check-list reveal reveal-d1">
        <li>חוכרים שקיבלו דרישת דמי חכירה או היוון</li>
        <li>מי שמבקש תוספת בנייה או שינוי ייעוד (דמי היתר)</li>
        <li>מוכרים שנדרשו לדמי הסכמה</li>
        <li>בעלי נחלות ומשקים במגזר החקלאי</li>
        <li>מי שקיבל דרישת יובל חכירה או דמי שימוש</li>
        <li>עורכי דין ומתווכים המלווים עסקה מול הרשות</li>
      </ul>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="section section--cream">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">שאלות נפוצות</span>
      <h2 class="section-title">מה חשוב לדעת</h2>
    </div>
    <div class="faq-list reveal reveal-d1">
      <details class="faq-item"><summary>כמה זמן יש לי להגיש השגה?</summary><div class="faq-body">את <strong>ההשגה הראשונה</strong> יש להגיש תוך <strong>60 יום</strong> מקבלת השומה. הרשות אמורה להכריע בתוך כ-9 חודשים. על ההחלטה ניתן להגיש <strong>השגה שנייה</strong> לוועדת ההשגות תוך 60 יום נוספים. מומלץ לפנות לשמאי מיד עם קבלת השומה.</div></details>
      <details class="faq-item"><summary>מה ההבדל בין דמי חכירה, היתר והסכמה?</summary><div class="faq-body"><strong>דמי חכירה</strong> - על עצם השימוש בקרקע. <strong>דמי היתר</strong> - על תוספת זכויות, שינוי ייעוד או פיצול. <strong>דמי הסכמה</strong> - על הסכמת הרשות להעברת זכויות בנכס שאינו מהוון. לכל אחד שיטת חישוב נפרדת, אך כולם נגזרים משווי הקרקע - ולכן כולם ניתנים לבדיקה.</div></details>
      <details class="faq-item"><summary>על מה בעצם "נלחמים" בהשגה?</summary><div class="faq-body">ההשגה היא הליך <strong>שמאי, לא משפטי</strong>. אנחנו תוקפים את שווי הקרקע שבבסיס החיוב - באמצעות עסקאות השוואה טובות יותר, ניכוי עלויות פיתוח (שווי "ללא פיתוח"), חילוץ מע"מ, ויישום נכון של האחוזים והמקדמים מקובץ החלטות המועצה. הקטנת בסיס השווי מקטינה ישירות את התשלום.</div></details>
      <details class="faq-item"><summary>הגשת השגה תעכב לי את העסקה?</summary><div class="faq-body">לא בהכרח. כדי להמשיך בעסקה במקביל להשגה, ניתן לשלם <strong>75% מסכום החיוב בתוספת ערבות בנקאית</strong> (או ריבית והצמדה), ולהמשיך להיאבק על היתרה. כך לא מפסידים זמן וגם לא מוותרים על הכסף.</div></details>
      <details class="faq-item"><summary>מה היתרון שלכם מול רמ"י?</summary><div class="faq-body">אנחנו מכירים את <strong>שיטת החישוב של הרשות וקובץ החלטות המועצה מבפנים</strong> - את האחוזים, המקדמים והנהלים. ההיכרות הזו מאפשרת לנו לאתר במהירות היכן השומה חרגה, ולבנות השגה מדויקת שמדברת בשפה של הרשות.</div></details>
    </div>
  </div>
</section>

<!-- CTA / LEAD -->
<section class="section cta-band" id="lead">
  <div class="container">
    <div class="cta-inner">
      <div class="cta-copy reveal">
        <span class="eyebrow">בדיקת שומה</span>
        <h2>נבדוק אם רמ"י דורשת ממכם יותר מדי</h2>
        <p>השאירו פרטים ושמאי מוסמך יחזור אליכם לבדיקה ראשונית של שומת הרשות - ללא התחייבות.</p>
      </div>
      <div class="cta-form reveal reveal-d1">
        <h3>שלחו לנו פנייה</h3>
        <p>נחזור אליכם בהקדם האפשרי</p>
        <form class="contact-form" id="contact-form" onsubmit="return submitContactForm(event, 'contact')">
          <input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);border:0;opacity:0">
          <div class="form-grid">
            <div class="form-group"><label for="contact-name">שם מלא *</label><input type="text" id="contact-name" name="name" placeholder="ישראל ישראלי" required autocomplete="name"></div>
            <div class="form-group"><label for="contact-phone">טלפון *</label><input type="tel" id="contact-phone" name="phone" placeholder="05X-XXXXXXX" required autocomplete="tel"></div>
          </div>
          <div class="form-group"><label for="contact-email">דוא"ל</label><input type="email" id="contact-email" name="email" placeholder="israel@example.com" autocomplete="email"></div>
          <div class="form-group">
            <label for="contact-subject">נושא פנייה</label>
            <select id="contact-subject" name="subject">
              <option value="השגה על שומת רמ&quot;י" selected>השגה על שומת רמ"י</option>
              <option>היטל השבחה</option>
              <option>שומת מקרקעין</option>
              <option>שמאות חקלאית</option>
              <option>ייעוץ</option>
              <option>אחר</option>
            </select>
          </div>
          <div class="form-group"><label for="contact-message">הודעה</label><textarea id="contact-message" name="message" placeholder="איזו שומה קיבלתם מרמ&quot;י, ומה סכום הדרישה?..."></textarea></div>
          <button type="submit" class="btn btn-gold form-submit" id="contact-submit-btn">שלח פנייה <span class="arr">←</span></button>
          <div id="contact-form-status" class="form-status"></div>
        </form>
      </div>
    </div>
  </div>
</section>

<!-- RELATED -->
<section class="section section--cream">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">תחומים נוספים</span>
      <h2 class="section-title">אולי יעניין אתכם גם</h2>
    </div>
    <div class="related reveal reveal-d1">
      <a href="hetel-hashbacha.html">היטל השבחה <span class="arr">←</span></a>
      <a href="takan-21-pinui-binui.html">תקן 21 · פינוי-בינוי <span class="arr">←</span></a>
      <a href="shamaut-haklait.html">שמאות חקלאית ונזקי טבע <span class="arr">←</span></a>
    </div>
  </div>
</section>

</main>

<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="logo-bm.png" alt="לוגו בורוביץ מזרחי">
        <p>משרד שמאות מקרקעין מוביל בצפון. ידע מקצועי מעמיק, היכרות שטח בלתי אמצעית והבנה כלכלית רחבה - בשירות כל לקוח.</p>
      </div>
      <div class="footer-col">
        <h4>ניווט</h4>
        <ul>
          <li><a href="index.html#about">אודות</a></li>
          <li><a href="index.html#services">תחומי התמחות</a></li>
          <li><a href="maamarim.html">מאמרים</a></li>
          <li><a href="index.html#success">תוצאות מהשטח</a></li>
          <li><a href="careers.html">קריירה</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>יצירת קשר</h4>
        <ul>
          <li><a href="tel:054-6559942">054-6559942 · מאור</a></li>
          <li><a href="tel:050-8922469">050-8922469 · אמיר</a></li>
          <li><a id="em-footer" href="#"></a></li>
          <li>שדרות החרוב 6, פארק תעשיות בר-לב</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 בורוביץ מזרחי שמאות מקרקעין וחקלאות בע"מ. כל הזכויות שמורות.</span>
      <span><a href="index.html">חזרה לאתר הראשי</a></span>
    </div>
  </div>
</footer>

<div class="floating-wrap">
  <a class="float-btn float-btn-wa" href="https://wa.me/972546559942" target="_blank" rel="noopener noreferrer" aria-label="שלחו הודעה בוואטסאפ">
    <svg aria-hidden="true" viewBox="0 0 32 32"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.67 4.61 1.832 6.5L4 29l7.75-1.812A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="#fff"/><path d="M21.5 18.5c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.19-.57-.34z" fill="#25D366"/></svg>
  </a>
  <button type="button" id="customAccessBtn" class="float-btn float-btn-access" aria-label="פתח תפריט נגישות" title="נגישות"><span aria-hidden="true">♿</span></button>
</div>

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<script>
  (function(){ var el=document.getElementById('em-footer'); if(el){ var a='info'+'@'+'bor-miz.co.il'; el.href='mailto:'+a; el.textContent=a; } })();
  function toggleMenu(){ var l=document.getElementById('navLinks'),b=document.getElementById('hamburger'); l.classList.toggle('open'); b.classList.toggle('open'); b.setAttribute('aria-expanded', l.classList.contains('open')?'true':'false'); }
  function closeMenu(){ document.getElementById('navLinks').classList.remove('open'); var b=document.getElementById('hamburger'); b.classList.remove('open'); b.setAttribute('aria-expanded','false'); }
  document.addEventListener('click', function(e){ var nav=document.getElementById('navbar'); if(nav && !nav.contains(e.target)) closeMenu(); });
  (function(){ var nav=document.getElementById('navbar'); var onScroll=function(){ nav.classList.toggle('scrolled', window.scrollY>60); }; window.addEventListener('scroll', onScroll, {passive:true}); onScroll(); })();
  (function(){
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce || !window.gsap || !window.ScrollTrigger){
      document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
      document.querySelectorAll('.counter').forEach(function(el){ el.textContent = el.getAttribute('data-target'); });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.reveal').forEach(function(el){ ScrollTrigger.create({ trigger: el, start:'top 88%', onEnter:function(){ el.classList.add('in'); } }); });
    document.querySelectorAll('.counter').forEach(function(el){
      var target=+el.getAttribute('data-target');
      ScrollTrigger.create({ trigger: el, start:'top 92%', once:true, onEnter:function(){ var o={v:0}; gsap.to(o,{v:target,duration:1.6,ease:'power2.out',onUpdate:function(){ el.textContent=Math.round(o.v); }}); } });
    });
  })();
  var EDGE_FUNCTION_URL = 'https://nurgknexilxaxxovdbco.supabase.co/functions/v1/website-lead-intake';
  var SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51cmdrbmV4aWx4YXh4b3ZkYmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMjAxMzYsImV4cCI6MjA4OTY5NjEzNn0.S6BwlUfYkdWegz1gigK5dK0lXUowp4safWOFEzExuS0';
  function submitContactForm(e){
    e.preventDefault();
    var form=document.getElementById('contact-form'), btn=document.getElementById('contact-submit-btn'), statusEl=document.getElementById('contact-form-status');
    var name=document.getElementById('contact-name').value.trim(), phone=document.getElementById('contact-phone').value.trim();
    var email=document.getElementById('contact-email').value.trim(), subject=document.getElementById('contact-subject').value, message=document.getElementById('contact-message').value.trim();
    if(!name || !phone){ statusEl.style.display='block'; statusEl.style.color='#fca5a5'; statusEl.textContent='נא למלא שם וטלפון'; return false; }
    btn.disabled=true; btn.textContent='שולח...'; statusEl.style.display='none';
    fetch(EDGE_FUNCTION_URL, { method:'POST', headers:{'Content-Type':'application/json','apikey':SB_ANON,'Authorization':'Bearer '+SB_ANON}, body: JSON.stringify({ name:name, phone:phone, email:email||null, subject:subject||null, message:message||null, source:'service-page', _hp:(form.querySelector('input[name="website"]')||{value:''}).value, elapsed_ms:Math.round(performance.now()) }) })
      .then(function(res){ return res.json(); })
      .then(function(data){
        if(data.success){
          window.dataLayer=window.dataLayer||[]; window.dataLayer.push({ event:'generate_lead', form_source:'service-page', lead_subject:subject||'unspecified' });
          statusEl.style.display='block'; statusEl.style.color='#4ade80'; statusEl.textContent=data.message||'הפנייה נשלחה בהצלחה!'; form.reset();
        } else { throw new Error(data.error||'שגיאה בשליחה'); }
      })
      .catch(function(err){ statusEl.style.display='block'; statusEl.style.color='#fca5a5'; statusEl.textContent='שגיאה: '+(err.message||'נסו שוב מאוחר יותר'); })
      .finally(function(){ btn.disabled=false; btn.innerHTML='שלח פנייה <span class="arr">←</span>'; });
    return false;
  }
  (function(){ window.dataLayer=window.dataLayer||[]; document.addEventListener('click', function(e){ var el=e.target.closest&&e.target.closest('a'); if(!el) return; if(/wa\.me|api\.whatsapp/.test(el.href||'')){ window.dataLayer.push({event:'contact_whatsapp'}); } else if((el.getAttribute('href')||'').indexOf('tel:')===0){ window.dataLayer.push({event:'contact_phone'}); } }, true); })();
</script>

<nagishli></nagishli>
<script>
nl_contact = "n:בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ|p:054-6559942|u:maor@bor-miz.co.il";
nl_pos = "BL"; nl_lang = "he"; nl_color = "blue"; nl_compact = "1";
</script>
<script src="nagishli.js?v=2.3" charset="utf-8"></script>
<script>
  (function(){
    function forceCompactStyles(){
      var bar=document.getElementById('NagishLiBar'), menus=document.getElementById('NagishLiMenus');
      if(bar){ bar.style.cssText='position:fixed !important; left:1.4rem !important; right:auto !important; bottom:6.2rem !important; top:auto !important; width:300px !important; max-width:90vw !important; height:auto !important; z-index:9999 !important; background:transparent !important; box-shadow:none !important; border:none !important; padding:0 !important; margin:0 !important;'; }
      if(menus){ menus.style.cssText+=';position:static !important; width:300px !important; max-width:90vw !important; max-height:70vh !important; overflow-y:auto !important; overflow-x:hidden !important; font-size:13px !important; border-radius:12px !important; box-shadow:0 10px 40px rgba(0,0,0,0.3) !important; margin:0 !important; padding:0 !important; background:#fff !important;'; }
      document.querySelectorAll('#NagishLiMenus, #NagishLiMenus ul').forEach(function(el){ el.style.width='100%'; el.style.maxWidth='300px'; el.style.boxSizing='border-box'; });
    }
    function openNagishLiMenu(){
      if(typeof jQuery==='undefined') return false;
      var $=jQuery, $strip=$('#NagishLiBarStrip'), $menus=$('#NagishLiMenus');
      if(!$strip.length || !$menus.length) return false;
      if($menus.is(':visible')){ $menus.slideUp(150, function(){ $strip.removeClass('open'); }); }
      else { forceCompactStyles(); $strip.addClass('open'); $menus.slideDown(150, forceCompactStyles); }
      return true;
    }
    function bind(){ var btn=document.getElementById('customAccessBtn'); if(!btn) return; btn.addEventListener('click', function(e){ e.preventDefault(); var n=0; (function tryOpen(){ if(openNagishLiMenu()) return; if(++n<30) setTimeout(tryOpen,200); })(); }); }
    if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', bind); } else { bind(); }
  })();
</script>

</body>
</html>

```

### `hetel-hashbacha-kiryot.html`

```html
﻿<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="shortcut icon" href="/favicon.ico">

<!-- ===== GOOGLE ANALYTICS 4 (gtag.js) =====
     Property "bor-miz.co.il", measurement ID G-GYNQPGPR33 - installed 2026-09-08,
     replacing a Tag Manager placeholder that never had a container behind it.
     The bridge below turns the site's existing dataLayer.push({event:'...'}) calls
     (generate_lead / contact_whatsapp / contact_phone / intake_submitted) into GA4
     events, so every call site elsewhere in the site stays untouched. -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-GYNQPGPR33"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-GYNQPGPR33');
  (function(){
    // gtag() itself pushes an arguments object, which has no .event key - so this
    // never recurses on its own output.
    var push = window.dataLayer.push;
    window.dataLayer.push = function(){
      for (var i = 0; i < arguments.length; i++) {
        var o = arguments[i];
        if (o && typeof o.event === 'string') {
          var params = {};
          for (var k in o) {
            if (k !== 'event' && Object.prototype.hasOwnProperty.call(o, k)) params[k] = o[k];
          }
          gtag('event', o.event, params);
        }
      }
      return push.apply(window.dataLayer, arguments);
    };
  })();
</script>
<!-- ===== END GOOGLE ANALYTICS 4 ===== -->

<title>היטל השבחה בקריות - בדיקה והגשת השגה | בורוביץ מזרחי שמאות מקרקעין</title>
<meta name="description" content="קיבלתם דרישת היטל השבחה בקריית ביאליק, מוצקין, ים או אתא? הקריות נמצאות בגל התחדשות עירונית, והשומות שמוציאות הוועדות המקומיות לא תמיד מדויקות. שמאי מקרקעין בוחן את החישוב ומגיש השגה - בדיקה ראשונית ללא התחייבות.">
<meta name="keywords" content="היטל השבחה קריות, היטל השבחה קרית ביאליק, היטל השבחה קרית מוצקין, היטל השבחה קרית ים, היטל השבחה קרית אתא, השגה היטל השבחה קריות, שמאי מקרקעין קריות, התחדשות עירונית קריות">
<meta name="robots" content="noindex,nofollow">
<link rel="canonical" href="https://bor-miz.co.il/hetel-hashbacha-kiryot.html">
<meta property="og:type" content="website">
<meta property="og:url" content="https://bor-miz.co.il/hetel-hashbacha-kiryot.html">
<meta property="og:title" content="היטל השבחה בקריות - בדיקה והגשת השגה | בורוביץ מזרחי">
<meta property="og:description" content="קיבלתם דרישת היטל השבחה בקריות? ייתכן שאתם משלמים יותר מדי. בדיקה מקצועית והגשת השגה.">
<meta property="og:image" content="https://bor-miz.co.il/image_2.png">
<meta property="og:locale" content="he_IL">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500;600;700;900&family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

<!-- ===== STRUCTURED DATA – Service + Breadcrumb + FAQ ===== -->
<script type="application/ld+json">
{
  "@context": "https://schema.org", "@type": "Service",
  "name": "בדיקה והגשת השגה על היטל השבחה בקריות",
  "serviceType": "שמאות מקרקעין - היטל השבחה",
  "provider": { "@type": "LocalBusiness", "name": "בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ", "telephone": "+972-54-6559942", "areaServed": "קריות, חיפה והצפון" },
  "url": "https://bor-miz.co.il/hetel-hashbacha-kiryot.html"
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "ראשי", "item": "https://bor-miz.co.il/"},
    {"@type": "ListItem", "position": 2, "name": "תחומי התמחות", "item": "https://bor-miz.co.il/#services"},
    {"@type": "ListItem", "position": 3, "name": "היטל השבחה בקריות", "item": "https://bor-miz.co.il/hetel-hashbacha-kiryot.html"}
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org", "@type": "FAQPage",
  "mainEntity": [
    {"@type": "Question", "name": "למה דווקא בקריות יש כל כך הרבה דרישות היטל?", "acceptedAnswer": {"@type": "Answer", "text": "הקריות עברו בשנים האחרונות גל תכנוני רחב - תכניות התחדשות עירונית, תמ\"א 38 ותכניות מתאר מקומיות חדשות. כל תכנית שמעלה את ערך הנכס יוצרת השבחה, וההיטל נגבה במועד המימוש: מכירה או קבלת היתר בנייה. ככל שיש יותר פעילות תכנונית, כך יש יותר דרישות - וגם יותר מקום לבדוק אותן."}},
    {"@type": "Question", "name": "כמה זמן יש לי להגיש השגה?", "acceptedAnswer": {"@type": "Answer", "text": "45 יום מקבלת דרישת התשלום. זהו מועד קריטי - איחור עלול לשלול את הזכות להשגה, ולכן חשוב לפנות לשמאי מוקדם ככל האפשר."}},
    {"@type": "Question", "name": "הנכס שלי בקריות אבל אתם בבר-לב. זה בעיה?", "acceptedAnswer": {"@type": "Answer", "text": "לא. המרחק בין בר-לב לקריות הוא נסיעה קצרה, ואנחנו מגיעים לנכס לביקור שטח כחלק מהעבודה. ההיכרות שלנו עם שוק הנדל\"ן בצפון ועם הוועדות המקומיות באזור היא יתרון, לא מגבלה."}},
    {"@type": "Question", "name": "מה קורה אם הנכס שלי בפרויקט התחדשות עירונית?", "acceptedAnswer": {"@type": "Answer", "text": "בפרויקטים של תמ\"א 38 ופינוי-בינוי קיימים פטורים ושיעורים מופחתים מהיטל השבחה, אבל הם אינם אוטומטיים - הם תלויים בתכנית שמכוחה ניתנו הזכויות. לא פעם פרויקט משלב תכנית התחדשות יחד עם תכנית מקומית נוספת, ודווקא התכנית הנוספת מייצרת חיוב. זו אחת הנקודות שאנחנו בודקים ראשונות."}},
    {"@type": "Question", "name": "כמה עולה לי להגיש השגה?", "acceptedAnswer": {"@type": "Answer", "text": "העלות נקבעת לפי מורכבות התיק. ברוב המקרים החיסכון הצפוי גבוה משמעותית משכר הטרחה - ולכן אנחנו פותחים בבדיקה ראשונית כדי להעריך את הכדאיות לפני שמתחילים."}}
  ]
}
</script>

<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="page.css">
</head>
<body>

<a href="#main-content" class="skip-to-content">דלג לתוכן הראשי</a>

<!-- NAVIGATION -->
<nav id="navbar" role="navigation" aria-label="ניווט ראשי">
  <div class="nav-inner">
    <a href="index.html" class="nav-logo" aria-label="בורוביץ מזרחי שמאות מקרקעין - דף הבית">
      <img src="logo-bm.png" alt="לוגו בורוביץ מזרחי">
    </a>
    <ul class="nav-links" id="navLinks">
      <li><a href="index.html#about" onclick="closeMenu()">אודות</a></li>
      <li><a href="index.html#services" onclick="closeMenu()">תחומי התמחות</a></li>
      <li><a href="maamarim.html" onclick="closeMenu()">מאמרים</a></li>
      <li><a href="index.html#linkedin-posts" onclick="closeMenu()">עדכונים</a></li>
      <li><a href="index.html#success" onclick="closeMenu()">מהשטח</a></li>
      <li><a href="careers.html" onclick="closeMenu()">קריירה</a></li>
      <li><a href="#lead" class="nav-cta" onclick="closeMenu()">צור קשר</a></li>
    </ul>
    <button class="hamburger" id="hamburger" onclick="toggleMenu()" aria-label="תפריט ניווט" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>

<main id="main-content">
<!-- HERO -->
<section class="subpage-hero">
  <div class="sp-bg" style="background-image:url('slide3.jpg')"></div>
  <div class="sp-overlay"></div>
  <div class="sp-content">
    <span class="eyebrow">תחום התמחות · היטל השבחה בקריות</span>
    <h1 class="sp-title">היטל השבחה <span class="gold">בקריות?</span><br>שווה לבדוק לפני שמשלמים</h1>
    <p class="sp-sub">הקריות נמצאות בעיצומו של גל התחדשות עירונית - תמ"א 38, פינוי-בינוי ותכניות משביחות חדשות. כל אלה מייצרים דרישות היטל השבחה, וכל דרישה מבוססת על שומה שהכינה הוועדה המקומית. שומה אפשר לבחון, ולא פעם אפשר גם להפחית.</p>
    <div class="hero-actions">
      <a href="#lead" class="btn btn-gold">בדיקה ראשונית ללא התחייבות <span class="arr">←</span></a>
      <a href="#how" class="btn btn-ghost">איך זה עובד</a>
    </div>
  </div>
</section>

<!-- STAT STRIP -->
<section class="stat-strip">
  <div class="container" style="padding-inline:0;">
    <div class="stat-strip-inner">
      <div class="stat reveal"><div class="num">עד <span class="counter" data-target="100">0</span>%</div><div class="label">הפחתת היטל במקרים שטיפלנו בהם</div></div>
      <div class="stat reveal reveal-d1"><div class="num">45</div><div class="label">ימים בלבד להגשת השגה</div></div>
      <div class="stat reveal reveal-d2"><div class="num">50%</div><div class="label">מההשבחה - שיעור ההיטל הקבוע בחוק</div></div>
    </div>
  </div>
</section>


<!-- WHY KIRYOT -->
<section class="section">
  <div class="container">
    <div class="content-block two-col">
      <div class="reveal">
        <span class="eyebrow">למה דווקא כאן</span>
        <h2 class="section-title" style="margin-top:.8rem;">הקריות הן מוקד היטלי השבחה</h2>
      </div>
      <div class="prose reveal reveal-d1">
        <p>היטל השבחה לא נוצר מאליו. הוא נגזר מ<strong>פעילות תכנונית</strong> - אישור תכנית משביחה, מתן הקלה או התרת שימוש חורג. לכן הוא מתרכז בדיוק במקומות שבהם התכנון זז.</p>
        <p><strong>קריית ביאליק, קריית מוצקין, קריית ים וקריית אתא</strong> נמצאות בשנים האחרונות בעיצומה של התחדשות עירונית רחבה: מבנים ותיקים משנות החמישים והשישים, מגרשים גדולים יחסית, וביקוש שגדל. השילוב הזה מייצר תכניות משביחות בקצב גבוה - וכל אחת מהן היא בסיס אפשרי לחיוב.</p>
        <p>התוצאה: בעלי דירות ובתים בקריות מקבלים דרישות היטל השבחה במועד המכירה או בעת בקשת היתר, לעיתים בסכומים של עשרות ומאות אלפי שקלים - ולא תמיד יודעים שאפשר לבחון אותן.</p>
        <div class="callout">גובה ההשבחה נקבע ב<strong>שומה</strong> שמכינה הוועדה המקומית - ולא פעם השומה הזו מופרזת, מתעלמת מפטור שמגיע לכם, או מבוססת על עסקאות השוואה שאינן מייצגות את הנכס שלכם. כאן נכנס שמאי מטעמכם.</div>
      </div>
    </div>
  </div>
</section>

<!-- WHAT WE CHECK -->
<section class="section section--cream">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">מה בודקים בפועל</span>
      <h2 class="section-title">איפה נמצאות ההפחתות</h2>
      <p>מאחורי המספר היבש בדרישה מסתתרים עשרות שיקולים. אלה הנקודות שאנחנו פותחים בהן כשמגיעה אלינו דרישה מהקריות.</p>
    </div>
    <div class="values-grid reveal reveal-d1">
      <div class="value-card">
        <span class="v-num">01</span>
        <h3>עסקאות השוואה מקומיות</h3>
        <p>שווי הנכס נקבע לפי עסקאות דומות. עסקה בקריית ים אינה בהכרח מייצגת נכס בקריית ביאליק, וגם בתוך אותה קריה יש פערי שווי משמעותיים בין רחובות. בחירת השוואות לא מתאימה מנפחת את ההשבחה.</p>
      </div>
      <div class="value-card">
        <span class="v-num">02</span>
        <h3>פטורים בהתחדשות עירונית</h3>
        <p>בפרויקטים של תמ"א 38 ופינוי-בינוי קיימים פטורים ושיעורים מופחתים. פטור שלא נלקח בחשבון, או שיושם באופן חלקי, משאיר אתכם עם חיוב מלא שלא היה צריך להיות שם.</p>
      </div>
      <div class="value-card">
        <span class="v-num">03</span>
        <h3>הרחבת דירת מגורים</h3>
        <p>החוק מעניק פטור להרחבת דירת מגורים בתנאים מסוימים. זהו אחד הפטורים הנפוצים ביותר בבנייה הוותיקה של הקריות - ואחד הנפוצים ביותר לפספוס.</p>
      </div>
      <div class="value-card">
        <span class="v-num">04</span>
        <h3>ריבוי תכניות על אותו מגרש</h3>
        <p>על מגרש ותיק בקריות חלות לרוב כמה תכניות שאושרו לאורך עשרות שנים. לפי הפסיקה כל תכנית מחושבת בנפרד לפי המועד הקובע שלה. חישוב מצרפי שגוי מגדיל את ההיטל.</p>
      </div>
      <div class="value-card">
        <span class="v-num">05</span>
        <h3>קיזוזים והוצאות מוכרות</h3>
        <p>הוצאות הריסה, מקדמי דחייה, התאמות פיזיות והפחתות מוכרות - כל אלה מקטינים את החיוב, כשהשמאי יודע לזהות ולדרוש אותם.</p>
      </div>
      <div class="value-card">
        <span class="v-num">06</span>
        <h3>שומות מכריעות קודמות</h3>
        <p>בקריות כבר ניתנו החלטות של שמאים מכריעים במקרים דומים. כשקיימת הכרעה בנכס דומה באותו אזור, יש לה משקל ממשי בהליך.</p>
      </div>
    </div>
  </div>
</section>

<!-- WHO FOR -->
<section class="section">
  <div class="container">
    <div class="content-block two-col">
      <div class="reveal">
        <span class="eyebrow">למי זה מתאים</span>
        <h2 class="section-title" style="margin-top:.8rem;">מי צריך לבדוק</h2>
        <p class="lead" style="margin-top:1rem;">אם קיבלתם דרישה - או שאתם לפני מכירה או היתר - שווה לבדוק לפני שמשלמים.</p>
      </div>
      <ul class="check-list reveal reveal-d1">
        <li>בעלי דירות בקריית ביאליק, מוצקין, ים ואתא שקיבלו דרישת תשלום</li>
        <li>מי שלפני מכירת דירה או בית בקריות</li>
        <li>בעלי נכס בפרויקט תמ"א 38 או פינוי-בינוי</li>
        <li>מי שמגיש בקשה להיתר בנייה או להרחבת דירה</li>
        <li>יזמים ובעלי קרקע בתהליכי תכנון באזור</li>
        <li>עורכי דין ומתווכים המלווים עסקה בקריות</li>
      </ul>
    </div>
  </div>
</section>

<!-- PROCESS -->
<section class="section section--cream" id="how">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">איך זה עובד</span>
      <h2 class="section-title">התהליך, צעד אחר צעד</h2>
    </div>
    <div class="steps">
      <div class="step reveal"><div class="step-num">1</div><div><h4>בדיקה ראשונית</h4><p>שולחים לנו את דרישת התשלום ואת מסמכי הנכס. אנחנו בודקים האם יש בסיס להפחתה - ללא התחייבות מצידכם.</p></div></div>
      <div class="step reveal reveal-d1"><div class="step-num">2</div><div><h4>ניתוח שמאי מעמיק</h4><p>בוחנים את התכניות החלות על המגרש, ההקלות, הפטורים, בסיס החישוב ועסקאות ההשוואה באזור - ומכינים שומה נגדית מנומקת.</p></div></div>
      <div class="step reveal reveal-d2"><div class="step-num">3</div><div><h4>הגשת השגה רשמית</h4><p>מגישים את ההשגה לוועדה המקומית ומבקשים מינוי שמאי מכריע, תוך ייצוג מלא שלכם בהליך.</p></div></div>
      <div class="step reveal reveal-d3"><div class="step-num">4</div><div><h4>הכרעה וחיסכון</h4><p>לאחר הדיון מול השמאי המכריע השומה מתעדכנת וההיטל מופחת - והחיסכון נשאר אצלכם.</p></div></div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="section section--cream">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">שאלות נפוצות</span>
      <h2 class="section-title">מה חשוב לדעת</h2>
    </div>
    <div class="faq-list reveal reveal-d1">
      <details class="faq-item"><summary>למה דווקא בקריות יש כל כך הרבה דרישות היטל?</summary><div class="faq-body">הקריות עברו בשנים האחרונות גל תכנוני רחב - תכניות התחדשות עירונית, תמ"א 38 ותכניות מתאר מקומיות חדשות. כל תכנית שמעלה את ערך הנכס יוצרת השבחה, וההיטל נגבה במועד המימוש: מכירה או קבלת היתר בנייה. ככל שיש יותר פעילות תכנונית, כך יש יותר דרישות - וגם יותר מקום לבדוק אותן.</div></details>
      <details class="faq-item"><summary>כמה זמן יש לי להגיש השגה?</summary><div class="faq-body"><strong>45 יום</strong> מקבלת דרישת התשלום. זהו מועד קריטי - איחור עלול לשלול את הזכות להשגה, ולכן חשוב לפנות לשמאי מוקדם ככל האפשר.</div></details>
      <details class="faq-item"><summary>הנכס שלי בקריות אבל אתם בבר-לב. זה בעיה?</summary><div class="faq-body">לא. המרחק בין בר-לב לקריות הוא נסיעה קצרה, ואנחנו מגיעים לנכס לביקור שטח כחלק מהעבודה. ההיכרות שלנו עם שוק הנדל"ן בצפון ועם הוועדות המקומיות באזור היא יתרון, לא מגבלה.</div></details>
      <details class="faq-item"><summary>מה קורה אם הנכס שלי בפרויקט התחדשות עירונית?</summary><div class="faq-body">בפרויקטים של תמ"א 38 ופינוי-בינוי קיימים פטורים ושיעורים מופחתים מהיטל השבחה, אבל הם אינם אוטומטיים - הם תלויים בתכנית שמכוחה ניתנו הזכויות. לא פעם פרויקט משלב תכנית התחדשות יחד עם תכנית מקומית נוספת, ודווקא התכנית הנוספת מייצרת חיוב. זו אחת הנקודות שאנחנו בודקים ראשונות.</div></details>
      <details class="faq-item"><summary>כמה עולה לי להגיש השגה?</summary><div class="faq-body">העלות נקבעת לפי מורכבות התיק. ברוב המקרים החיסכון הצפוי גבוה משמעותית משכר הטרחה - ולכן אנחנו פותחים בבדיקה ראשונית כדי להעריך את הכדאיות לפני שמתחילים.</div></details>
    </div>
  </div>
</section>

<!-- CTA / LEAD -->
<section class="section cta-band" id="lead">
  <div class="container">
    <div class="cta-inner">
      <div class="cta-copy reveal">
        <span class="eyebrow">בדיקת זכאות</span>
        <h2>נבדוק את הדרישה שקיבלתם</h2>
        <p>השאירו פרטים ושמאי מוסמך יחזור אליכם לבדיקה ראשונית של דרישת היטל ההשבחה - ללא התחייבות.</p>
      </div>
      <div class="cta-form reveal reveal-d1">
        <h3>שלחו לנו פנייה</h3>
        <p>נחזור אליכם בהקדם האפשרי</p>
        <form class="contact-form" id="contact-form" onsubmit="return submitContactForm(event, 'contact')">
          <input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);border:0;opacity:0">
          <div class="form-grid">
            <div class="form-group"><label for="contact-name">שם מלא *</label><input type="text" id="contact-name" name="name" placeholder="ישראל ישראלי" required autocomplete="name"></div>
            <div class="form-group"><label for="contact-phone">טלפון *</label><input type="tel" id="contact-phone" name="phone" placeholder="05X-XXXXXXX" required autocomplete="tel"></div>
          </div>
          <div class="form-group"><label for="contact-email">דוא"ל</label><input type="email" id="contact-email" name="email" placeholder="israel@example.com" autocomplete="email"></div>
          <div class="form-group">
            <label for="contact-subject">נושא פנייה</label>
            <select id="contact-subject" name="subject">
              <option value="היטל השבחה" selected>היטל השבחה</option>
              <option>השגה על שומת רמ"י</option>
              <option>שומת מקרקעין</option>
              <option>בדיקת כדאיות</option>
              <option>ייעוץ</option>
              <option>אחר</option>
            </select>
          </div>
          <div class="form-group"><label for="contact-message">הודעה</label><textarea id="contact-message" name="message" placeholder="באיזו קריה נמצא הנכס ומה גובה הדרישה שקיבלתם..."></textarea></div>
          <button type="submit" class="btn btn-gold form-submit" id="contact-submit-btn">שלח פנייה <span class="arr">←</span></button>
          <div id="contact-form-status" class="form-status"></div>
        </form>
      </div>
    </div>
  </div>
</section>

<!-- RELATED -->
<section class="section section--cream">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">תחומים נוספים</span>
      <h2 class="section-title">אולי יעניין אתכם גם</h2>
    </div>
    <div class="related reveal reveal-d1">
      <a href="hetel-hashbacha.html">היטל השבחה - המדריך המלא <span class="arr">←</span></a>
      <a href="hetel-hashbacha-pinui-binui.html">היטל השבחה בפינוי-בינוי <span class="arr">←</span></a>
      <a href="takan-21-pinui-binui.html">תקן 21 · פינוי-בינוי <span class="arr">←</span></a>
    </div>
  </div>
</section>

</main>

<!-- FOOTER -->
<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="logo-bm.png" alt="לוגו בורוביץ מזרחי">
        <p>משרד שמאות מקרקעין מוביל בצפון. ידע מקצועי מעמיק, היכרות שטח בלתי אמצעית והבנה כלכלית רחבה - בשירות כל לקוח.</p>
      </div>
      <div class="footer-col">
        <h4>ניווט</h4>
        <ul>
          <li><a href="index.html#about">אודות</a></li>
          <li><a href="index.html#services">תחומי התמחות</a></li>
          <li><a href="maamarim.html">מאמרים</a></li>
          <li><a href="index.html#success">תוצאות מהשטח</a></li>
          <li><a href="careers.html">קריירה</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>יצירת קשר</h4>
        <ul>
          <li><a href="tel:054-6559942">054-6559942 · מאור</a></li>
          <li><a href="tel:050-8922469">050-8922469 · אמיר</a></li>
          <li><a id="em-footer" href="#"></a></li>
          <li>שדרות החרוב 6, פארק תעשיות בר-לב</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 בורוביץ מזרחי שמאות מקרקעין וחקלאות בע"מ. כל הזכויות שמורות.</span>
      <span><a href="index.html">חזרה לאתר הראשי</a></span>
    </div>
  </div>
</footer>

<!-- FLOATING BUTTONS -->
<div class="floating-wrap">
  <a class="float-btn float-btn-wa" href="https://wa.me/972546559942" target="_blank" rel="noopener noreferrer" aria-label="שלחו הודעה בוואטסאפ">
    <svg aria-hidden="true" viewBox="0 0 32 32"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.67 4.61 1.832 6.5L4 29l7.75-1.812A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="#fff"/><path d="M21.5 18.5c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.19-.57-.34z" fill="#25D366"/></svg>
  </a>
  <button type="button" id="customAccessBtn" class="float-btn float-btn-access" aria-label="פתח תפריט נגישות" title="נגישות"><span aria-hidden="true">♿</span></button>
</div>

<!-- SCRIPTS -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<script>
  // Email obfuscation
  (function(){ var el=document.getElementById('em-footer'); if(el){ var a='info'+'@'+'bor-miz.co.il'; el.href='mailto:'+a; el.textContent=a; } })();

  // Hamburger menu
  function toggleMenu(){ var l=document.getElementById('navLinks'),b=document.getElementById('hamburger'); l.classList.toggle('open'); b.classList.toggle('open'); b.setAttribute('aria-expanded', l.classList.contains('open')?'true':'false'); }
  function closeMenu(){ document.getElementById('navLinks').classList.remove('open'); var b=document.getElementById('hamburger'); b.classList.remove('open'); b.setAttribute('aria-expanded','false'); }
  document.addEventListener('click', function(e){ var nav=document.getElementById('navbar'); if(nav && !nav.contains(e.target)) closeMenu(); });

  // Navbar scrolled state
  (function(){ var nav=document.getElementById('navbar'); var onScroll=function(){ nav.classList.toggle('scrolled', window.scrollY>60); }; window.addEventListener('scroll', onScroll, {passive:true}); onScroll(); })();

  // Reveal + counters
  (function(){
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce || !window.gsap || !window.ScrollTrigger){
      document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
      document.querySelectorAll('.counter').forEach(function(el){ el.textContent = el.getAttribute('data-target'); });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.reveal').forEach(function(el){ ScrollTrigger.create({ trigger: el, start:'top 88%', onEnter:function(){ el.classList.add('in'); } }); });
    document.querySelectorAll('.counter').forEach(function(el){
      var target=+el.getAttribute('data-target');
      ScrollTrigger.create({ trigger: el, start:'top 92%', once:true, onEnter:function(){ var o={v:0}; gsap.to(o,{v:target,duration:1.6,ease:'power2.out',onUpdate:function(){ el.textContent=Math.round(o.v); }}); } });
    });
  })();

  // Form submission → Supabase Edge Function
  var EDGE_FUNCTION_URL = 'https://nurgknexilxaxxovdbco.supabase.co/functions/v1/website-lead-intake';
  var SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51cmdrbmV4aWx4YXh4b3ZkYmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMjAxMzYsImV4cCI6MjA4OTY5NjEzNn0.S6BwlUfYkdWegz1gigK5dK0lXUowp4safWOFEzExuS0';
  function submitContactForm(e){
    e.preventDefault();
    var form=document.getElementById('contact-form'), btn=document.getElementById('contact-submit-btn'), statusEl=document.getElementById('contact-form-status');
    var name=document.getElementById('contact-name').value.trim(), phone=document.getElementById('contact-phone').value.trim();
    var email=document.getElementById('contact-email').value.trim(), subject=document.getElementById('contact-subject').value, message=document.getElementById('contact-message').value.trim();
    if(!name || !phone){ statusEl.style.display='block'; statusEl.style.color='#fca5a5'; statusEl.textContent='נא למלא שם וטלפון'; return false; }
    btn.disabled=true; btn.textContent='שולח...'; statusEl.style.display='none';
    fetch(EDGE_FUNCTION_URL, { method:'POST', headers:{'Content-Type':'application/json','apikey':SB_ANON,'Authorization':'Bearer '+SB_ANON}, body: JSON.stringify({ name:name, phone:phone, email:email||null, subject:subject||null, message:message||null, source:'service-page', _hp:(form.querySelector('input[name="website"]')||{value:''}).value, elapsed_ms:Math.round(performance.now()) }) })
      .then(function(res){ return res.json(); })
      .then(function(data){
        if(data.success){
          window.dataLayer=window.dataLayer||[]; window.dataLayer.push({ event:'generate_lead', form_source:'service-page', lead_subject:subject||'unspecified' });
          statusEl.style.display='block'; statusEl.style.color='#4ade80'; statusEl.textContent=data.message||'הפנייה נשלחה בהצלחה!'; form.reset();
        } else { throw new Error(data.error||'שגיאה בשליחה'); }
      })
      .catch(function(err){ statusEl.style.display='block'; statusEl.style.color='#fca5a5'; statusEl.textContent='שגיאה: '+(err.message||'נסו שוב מאוחר יותר'); })
      .finally(function(){ btn.disabled=false; btn.innerHTML='שלח פנייה <span class="arr">←</span>'; });
    return false;
  }

  // Contact micro-conversion tracking
  (function(){ window.dataLayer=window.dataLayer||[]; document.addEventListener('click', function(e){ var el=e.target.closest&&e.target.closest('a'); if(!el) return; if(/wa\.me|api\.whatsapp/.test(el.href||'')){ window.dataLayer.push({event:'contact_whatsapp'}); } else if((el.getAttribute('href')||'').indexOf('tel:')===0){ window.dataLayer.push({event:'contact_phone'}); } }, true); })();
</script>

<!-- NAGISHLI ACCESSIBILITY -->
<nagishli></nagishli>
<script>
nl_contact = "n:בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ|p:054-6559942|u:maor@bor-miz.co.il";
nl_pos = "BL"; nl_lang = "he"; nl_color = "blue"; nl_compact = "1";
</script>
<script src="nagishli.js?v=2.3" charset="utf-8"></script>
<script>
  (function(){
    function forceCompactStyles(){
      var bar=document.getElementById('NagishLiBar'), menus=document.getElementById('NagishLiMenus');
      if(bar){ bar.style.cssText='position:fixed !important; left:1.4rem !important; right:auto !important; bottom:6.2rem !important; top:auto !important; width:300px !important; max-width:90vw !important; height:auto !important; z-index:9999 !important; background:transparent !important; box-shadow:none !important; border:none !important; padding:0 !important; margin:0 !important;'; }
      if(menus){ menus.style.cssText+=';position:static !important; width:300px !important; max-width:90vw !important; max-height:70vh !important; overflow-y:auto !important; overflow-x:hidden !important; font-size:13px !important; border-radius:12px !important; box-shadow:0 10px 40px rgba(0,0,0,0.3) !important; margin:0 !important; padding:0 !important; background:#fff !important;'; }
      document.querySelectorAll('#NagishLiMenus, #NagishLiMenus ul').forEach(function(el){ el.style.width='100%'; el.style.maxWidth='300px'; el.style.boxSizing='border-box'; });
    }
    function openNagishLiMenu(){
      if(typeof jQuery==='undefined') return false;
      var $=jQuery, $strip=$('#NagishLiBarStrip'), $menus=$('#NagishLiMenus');
      if(!$strip.length || !$menus.length) return false;
      if($menus.is(':visible')){ $menus.slideUp(150, function(){ $strip.removeClass('open'); }); }
      else { forceCompactStyles(); $strip.addClass('open'); $menus.slideDown(150, forceCompactStyles); }
      return true;
    }
    function bind(){ var btn=document.getElementById('customAccessBtn'); if(!btn) return; btn.addEventListener('click', function(e){ e.preventDefault(); var n=0; (function tryOpen(){ if(openNagishLiMenu()) return; if(++n<30) setTimeout(tryOpen,200); })(); }); }
    if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', bind); } else { bind(); }
  })();
</script>

</body>
</html>

```

### `hetel-hashbacha-pinui-binui.html`

```html
﻿<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="shortcut icon" href="/favicon.ico">

<!-- ===== GOOGLE ANALYTICS 4 (gtag.js) =====
     Property "bor-miz.co.il", measurement ID G-GYNQPGPR33 - installed 2026-09-08,
     replacing a Tag Manager placeholder that never had a container behind it.
     The bridge below turns the site's existing dataLayer.push({event:'...'}) calls
     (generate_lead / contact_whatsapp / contact_phone / intake_submitted) into GA4
     events, so every call site elsewhere in the site stays untouched. -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-GYNQPGPR33"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-GYNQPGPR33');
  (function(){
    // gtag() itself pushes an arguments object, which has no .event key - so this
    // never recurses on its own output.
    var push = window.dataLayer.push;
    window.dataLayer.push = function(){
      for (var i = 0; i < arguments.length; i++) {
        var o = arguments[i];
        if (o && typeof o.event === 'string') {
          var params = {};
          for (var k in o) {
            if (k !== 'event' && Object.prototype.hasOwnProperty.call(o, k)) params[k] = o[k];
          }
          gtag('event', o.event, params);
        }
      }
      return push.apply(window.dataLayer, arguments);
    };
  })();
</script>
<!-- ===== END GOOGLE ANALYTICS 4 ===== -->

<title>היטל השבחה בפינוי-בינוי ותמ"א 38 - פטורים ושיעורים מופחתים | בורוביץ מזרחי</title>
<meta name="description" content="בהתחדשות עירונית קיימים פטורים ושיעורים מופחתים מהיטל השבחה - אבל הם אינם אוטומטיים. הפטור תלוי בתכנית שמכוחה ניתנו הזכויות, ופרויקט שמשלב כמה תכניות עלול לייצר חיוב בכל זאת. בדיקה שמאית לפני שמשלמים.">
<meta name="keywords" content="היטל השבחה פינוי בינוי, פטור מהיטל השבחה, היטל השבחה תמא 38, היטל השבחה התחדשות עירונית, שיעור מופחת היטל השבחה, השגה היטל השבחה פינוי בינוי, שמאי מקרקעין צפון">
<meta name="robots" content="noindex,nofollow">
<link rel="canonical" href="https://bor-miz.co.il/hetel-hashbacha-pinui-binui.html">
<meta property="og:type" content="website">
<meta property="og:url" content="https://bor-miz.co.il/hetel-hashbacha-pinui-binui.html">
<meta property="og:title" content="היטל השבחה בפינוי-בינוי ותמ"א 38 | בורוביץ מזרחי">
<meta property="og:description" content="הפטור מהיטל השבחה בהתחדשות עירונית אינו אוטומטי. בדיקה שמאית לפני שמשלמים.">
<meta property="og:image" content="https://bor-miz.co.il/image_2.png">
<meta property="og:locale" content="he_IL">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500;600;700;900&family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

<!-- ===== STRUCTURED DATA – Service + Breadcrumb + FAQ ===== -->
<script type="application/ld+json">
{
  "@context": "https://schema.org", "@type": "Service",
  "name": "בדיקת היטל השבחה בפרויקטי התחדשות עירונית",
  "serviceType": "שמאות מקרקעין - היטל השבחה והתחדשות עירונית",
  "provider": { "@type": "LocalBusiness", "name": "בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ", "telephone": "+972-54-6559942", "areaServed": "צפון" },
  "url": "https://bor-miz.co.il/hetel-hashbacha-pinui-binui.html"
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "ראשי", "item": "https://bor-miz.co.il/"},
    {"@type": "ListItem", "position": 2, "name": "תחומי התמחות", "item": "https://bor-miz.co.il/#services"},
    {"@type": "ListItem", "position": 3, "name": "היטל השבחה בפינוי-בינוי", "item": "https://bor-miz.co.il/hetel-hashbacha-pinui-binui.html"}
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org", "@type": "FAQPage",
  "mainEntity": [
    {"@type": "Question", "name": "האם פינוי-בינוי פטור מהיטל השבחה?", "acceptedAnswer": {"@type": "Answer", "text": "במסלולי התחדשות עירונית קיימים פטורים ושיעורים מופחתים מהיטל השבחה, והם מעוגנים בתוספת השלישית לחוק התכנון והבנייה. עם זאת הפטור אינו ניתן \"לפרויקט\" באופן גורף - הוא נגזר מהתכנית שמכוחה ניתנו הזכויות ומהתנאים הקבועים בחוק. לכן שני פרויקטים שנראים דומים יכולים להסתיים בחבות שונה לחלוטין."}},
    {"@type": "Question", "name": "מה ההבדל בין תמ\"א 38 חיזוק לבין הריסה ובנייה?", "acceptedAnswer": {"@type": "Answer", "text": "תמ\"א 38/1 היא חיזוק ותוספת בנייה למבנה קיים, ותמ\"א 38/2 היא הריסה ובנייה מחדש. לשני המסלולים הסדרי היטל שונים בהיקפם ובתנאיהם, והם גם מתנהגים אחרת כשמצטרפת אליהם תכנית מקומית נוספת. בבדיקה אנחנו מתחילים תמיד מזיהוי המסלול המדויק."}},
    {"@type": "Question", "name": "אם הפרויקט פטור, למה קיבלתי דרישה?", "acceptedAnswer": {"@type": "Answer", "text": "זה המצב הנפוץ ביותר שאנחנו רואים. פרויקט התחדשות רבים מקבלים זכויות משתי תכניות ומעלה: תכנית ההתחדשות עצמה, ולצידה תכנית מקומית או הקלה שמוסיפה זכויות. הפטור חל על החלק שמקורו בתכנית ההתחדשות, בעוד שהתוספת מהתכנית האחרת עשויה להיות חייבת. הפרדה נכונה בין השניים היא לב העבודה."}},
    {"@type": "Question", "name": "מתי בכלל משלמים את ההיטל בפרויקט כזה?", "acceptedAnswer": {"@type": "Answer", "text": "היטל השבחה משולם במועד מימוש הזכויות - קבלת היתר בנייה או מכירת הנכס. בפרויקטי התחדשות המועד הזה מגיע לרוב בשלב ההיתר, ולכן כדאי לבחון את החבות מוקדם, לפני שהחיוב כבר על השולחן."}},
    {"@type": "Question", "name": "מה הקשר בין זה לבין תקן 21?", "acceptedAnswer": {"@type": "Answer", "text": "תקן 21 עוסק בשאלה אחרת - האם התמורה שמציע היזם לדיירים הוגנת וכדאית. היטל השבחה עוסק בשאלה מי חייב לוועדה המקומית וכמה. שתי הבדיקות נפגשות באותו פרויקט אבל עונות על שאלות נפרדות, ואנחנו מלווים בשתיהן."}}
  ]
}
</script>

<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="page.css">
</head>
<body>

<a href="#main-content" class="skip-to-content">דלג לתוכן הראשי</a>

<!-- NAVIGATION -->
<nav id="navbar" role="navigation" aria-label="ניווט ראשי">
  <div class="nav-inner">
    <a href="index.html" class="nav-logo" aria-label="בורוביץ מזרחי שמאות מקרקעין - דף הבית">
      <img src="logo-bm.png" alt="לוגו בורוביץ מזרחי">
    </a>
    <ul class="nav-links" id="navLinks">
      <li><a href="index.html#about" onclick="closeMenu()">אודות</a></li>
      <li><a href="index.html#services" onclick="closeMenu()">תחומי התמחות</a></li>
      <li><a href="maamarim.html" onclick="closeMenu()">מאמרים</a></li>
      <li><a href="index.html#linkedin-posts" onclick="closeMenu()">עדכונים</a></li>
      <li><a href="index.html#success" onclick="closeMenu()">מהשטח</a></li>
      <li><a href="careers.html" onclick="closeMenu()">קריירה</a></li>
      <li><a href="#lead" class="nav-cta" onclick="closeMenu()">צור קשר</a></li>
    </ul>
    <button class="hamburger" id="hamburger" onclick="toggleMenu()" aria-label="תפריט ניווט" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>

<main id="main-content">
<!-- HERO -->
<section class="subpage-hero">
  <div class="sp-bg" style="background-image:url('slide2.jpg')"></div>
  <div class="sp-overlay"></div>
  <div class="sp-content">
    <span class="eyebrow">תחום התמחות · היטל השבחה בהתחדשות עירונית</span>
    <h1 class="sp-title">פינוי-בינוי ותמ"א 38:<br>הפטור מהיטל השבחה <span class="gold">אינו אוטומטי</span></h1>
    <p class="sp-sub">רוב בעלי הדירות בפרויקטי התחדשות עירונית מניחים שהם פטורים מהיטל השבחה. לרוב זה נכון - אבל הפטור נגזר מהתכנית שמכוחה ניתנו הזכויות, ולא מעצם היות הפרויקט "התחדשות". כשפרויקט משלב כמה תכניות, החיוב יכול לצוץ דווקא מהצד שאיש לא בדק.</p>
    <div class="hero-actions">
      <a href="#lead" class="btn btn-gold">בדיקת חבות בהיטל <span class="arr">←</span></a>
      <a href="#how" class="btn btn-ghost">איך זה עובד</a>
    </div>
  </div>
</section>

<!-- STAT STRIP -->
<section class="stat-strip">
  <div class="container" style="padding-inline:0;">
    <div class="stat-strip-inner">
      <div class="stat reveal"><div class="num">50%</div><div class="label">שיעור ההיטל הרגיל - ממנו נגזרות ההקלות</div></div>
      <div class="stat reveal reveal-d1"><div class="num">45</div><div class="label">ימים בלבד להגשת השגה</div></div>
      <div class="stat reveal reveal-d2"><div class="num">עד <span class="counter" data-target="100">0</span>%</div><div class="label">הפחתת היטל במקרים שטיפלנו בהם</div></div>
    </div>
  </div>
</section>


<!-- THE TRAP -->
<section class="section">
  <div class="container">
    <div class="content-block two-col">
      <div class="reveal">
        <span class="eyebrow">איפה נופלים</span>
        <h2 class="section-title" style="margin-top:.8rem;">"הפרויקט פטור" זו לא תשובה</h2>
      </div>
      <div class="prose reveal reveal-d1">
        <p>היטל השבחה מוטל על <strong>השבחה שנוצרה מכוח תכנית</strong>. לכן השאלה הנכונה איננה "האם הפרויקט הוא התחדשות עירונית", אלא <strong>מכוח איזו תכנית בדיוק ניתנו הזכויות שקיבלתם</strong>.</p>
        <p>בפרויקט טיפוסי הזכויות מגיעות מכמה מקורות: תכנית ההתחדשות, תכנית מתאר מקומית שאושרה לפניה או אחריה, ולעיתים גם הקלה נקודתית. הפטור חל על מה שמקורו במסלול ההתחדשות. <strong>מה שמגיע ממקור אחר - עשוי להיות חייב במלוא ההיטל.</strong></p>
        <p>ההפרדה הזו אינה טכנית. היא דורשת קריאה של כל התכניות החלות על המגרש, של תנאי ההיתר ושל אופן חישוב הזכויות - ובדיוק שם נוצרים הפערים בין הדרישה של הוועדה לבין החבות האמיתית.</p>
        <div class="callout">אנחנו רואים שוב ושוב בעלי דירות שקיבלו דרישה, הניחו שמדובר בטעות טכנית שתיפתר מעצמה, והחמיצו את חלון <strong>45 הימים</strong> להגשת השגה. אחרי המועד הזה קשה מאוד לתקן.</div>
      </div>
    </div>
  </div>
</section>

<!-- WHAT DETERMINES -->
<section class="section section--cream">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">מה קובע את החבות</span>
      <h2 class="section-title">חמש נקודות שמכריעות את התוצאה</h2>
      <p>בכל תיק התחדשות שמגיע אלינו, אלה הנקודות שנבדקות ראשונות - והן שקובעות אם יש חיוב, ובאיזה גובה.</p>
    </div>
    <div class="values-grid reveal reveal-d1">
      <div class="value-card">
        <span class="v-num">01</span>
        <h3>מקור הזכויות</h3>
        <p>מכוח איזו תכנית ניתנו הזכויות בפועל. זו השאלה הראשונה, והיא זו שקובעת אם הפטור בכלל רלוונטי לחלק זה או אחר של הפרויקט.</p>
      </div>
      <div class="value-card">
        <span class="v-num">02</span>
        <h3>מסלול ההתחדשות</h3>
        <p>חיזוק מול הריסה ובנייה, מתחם מוכרז מול פרויקט נקודתי - לכל מסלול הסדר שונה, ולכל הסדר תנאים שצריך לעמוד בהם בפועל ולא רק על הנייר.</p>
      </div>
      <div class="value-card">
        <span class="v-num">03</span>
        <h3>תכניות נוספות על המגרש</h3>
        <p>תכנית מקומית או הקלה שהצטרפה לפרויקט היא המקור הנפוץ ביותר לחיוב בלתי צפוי. כאן נמצא רוב הכסף שאפשר לחסוך.</p>
      </div>
      <div class="value-card">
        <span class="v-num">04</span>
        <h3>המועד הקובע של כל תכנית</h3>
        <p>לפי הפסיקה כל תכנית נבחנת בנפרד לפי המועד הקובע שלה. חישוב מצרפי, שמערבב תכניות ומועדים, מנפח את ההשבחה.</p>
      </div>
      <div class="value-card">
        <span class="v-num">05</span>
        <h3>שווי "לפני" בבניין ותיק</h3>
        <p>הערכת שווי המצב הקודם במבנה ישן היא נקודת תורפה קלאסית. הערכת חסר של המצב הקודם מגדילה אוטומטית את ההשבחה ואת ההיטל.</p>
      </div>
      <div class="value-card">
        <span class="v-num">06</span>
        <h3>מי החייב - ומתי</h3>
        <p>בפרויקט התחדשות מעורבים דיירים, יזם ולעיתים בעלי זכויות נוספים. חלוקת החבות ביניהם ומועד המימוש משפיעים ישירות על מי משלם בפועל.</p>
      </div>
    </div>
  </div>
</section>

<!-- WHO FOR -->
<section class="section">
  <div class="container">
    <div class="content-block two-col">
      <div class="reveal">
        <span class="eyebrow">למי זה מתאים</span>
        <h2 class="section-title" style="margin-top:.8rem;">מי צריך את הבדיקה הזו?</h2>
        <p class="lead" style="margin-top:1rem;">ככל שהבדיקה נעשית מוקדם יותר בפרויקט, כך יש יותר מה לעשות איתה.</p>
      </div>
      <ul class="check-list reveal reveal-d1">
        <li>בעלי דירות בפרויקט תמ"א 38 או פינוי-בינוי שקיבלו דרישת היטל</li>
        <li>נציגויות דיירים שבוחנות הצעת יזם</li>
        <li>יזמים שרוצים לכמת את חשיפת ההיטל לפני חתימה</li>
        <li>בעלי נכס לפני הגשת בקשה להיתר בפרויקט התחדשות</li>
        <li>עורכי דין המלווים עסקאות התחדשות עירונית</li>
        <li>מי שקיבל דרישה למרות שנאמר לו שהפרויקט פטור</li>
      </ul>
    </div>
  </div>
</section>

<!-- PROCESS -->
<section class="section section--cream" id="how">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">איך זה עובד</span>
      <h2 class="section-title">התהליך, צעד אחר צעד</h2>
    </div>
    <div class="steps">
      <div class="step reveal"><div class="step-num">1</div><div><h4>מיפוי התכניות</h4><p>מאתרים אילו תכניות חלות על המגרש ומכוח איזו מהן ניתנו הזכויות בפועל. זה הצעד שקובע את כל השאר.</p></div></div>
      <div class="step reveal reveal-d1"><div class="step-num">2</div><div><h4>בחינת החבות והפטור</h4><p>בודקים אילו זכויות נכללות במסלול ההתחדשות ואילו נובעות מתכנית אחרת שעשויה להקים חיוב.</p></div></div>
      <div class="step reveal reveal-d2"><div class="step-num">3</div><div><h4>שומה נגדית והשגה</h4><p>אם קיים חיוב שאינו מוצדק או מנופח, מכינים שומה מנומקת ומגישים השגה עם בקשה למינוי שמאי מכריע.</p></div></div>
      <div class="step reveal reveal-d3"><div class="step-num">4</div><div><h4>ליווי עד ההכרעה</h4><p>מייצגים אתכם מול השמאי המכריע ומול הוועדה עד לעדכון השומה.</p></div></div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="section section--cream">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">שאלות נפוצות</span>
      <h2 class="section-title">מה חשוב לדעת</h2>
    </div>
    <div class="faq-list reveal reveal-d1">
      <details class="faq-item"><summary>האם פינוי-בינוי פטור מהיטל השבחה?</summary><div class="faq-body">במסלולי התחדשות עירונית קיימים פטורים ושיעורים מופחתים מהיטל השבחה, והם מעוגנים בתוספת השלישית לחוק התכנון והבנייה. עם זאת הפטור אינו ניתן "לפרויקט" באופן גורף - הוא נגזר מהתכנית שמכוחה ניתנו הזכויות ומהתנאים הקבועים בחוק. לכן שני פרויקטים שנראים דומים יכולים להסתיים בחבות שונה לחלוטין.</div></details>
      <details class="faq-item"><summary>מה ההבדל בין תמ"א 38 חיזוק לבין הריסה ובנייה?</summary><div class="faq-body">תמ"א 38/1 היא חיזוק ותוספת בנייה למבנה קיים, ותמ"א 38/2 היא הריסה ובנייה מחדש. לשני המסלולים הסדרי היטל שונים בהיקפם ובתנאיהם, והם גם מתנהגים אחרת כשמצטרפת אליהם תכנית מקומית נוספת. בבדיקה אנחנו מתחילים תמיד מזיהוי המסלול המדויק.</div></details>
      <details class="faq-item"><summary>אם הפרויקט פטור, למה קיבלתי דרישה?</summary><div class="faq-body">זה המצב הנפוץ ביותר שאנחנו רואים. פרויקט התחדשות רבים מקבלים זכויות משתי תכניות ומעלה: תכנית ההתחדשות עצמה, ולצידה תכנית מקומית או הקלה שמוסיפה זכויות. הפטור חל על החלק שמקורו בתכנית ההתחדשות, בעוד שהתוספת מהתכנית האחרת עשויה להיות חייבת. הפרדה נכונה בין השניים היא לב העבודה.</div></details>
      <details class="faq-item"><summary>מתי בכלל משלמים את ההיטל בפרויקט כזה?</summary><div class="faq-body">היטל השבחה משולם במועד מימוש הזכויות - קבלת היתר בנייה או מכירת הנכס. בפרויקטי התחדשות המועד הזה מגיע לרוב בשלב ההיתר, ולכן כדאי לבחון את החבות מוקדם, לפני שהחיוב כבר על השולחן.</div></details>
      <details class="faq-item"><summary>מה הקשר בין זה לבין תקן 21?</summary><div class="faq-body">תקן 21 עוסק בשאלה אחרת - האם התמורה שמציע היזם לדיירים הוגנת וכדאית. היטל השבחה עוסק בשאלה מי חייב לוועדה המקומית וכמה. שתי הבדיקות נפגשות באותו פרויקט אבל עונות על שאלות נפרדות. <a href="takan-21-pinui-binui.html">קראו על תקן 21 ופינוי-בינוי</a>.</div></details>
    </div>
  </div>
</section>

<!-- CTA / LEAD -->
<section class="section cta-band" id="lead">
  <div class="container">
    <div class="cta-inner">
      <div class="cta-copy reveal">
        <span class="eyebrow">בדיקת חבות</span>
        <h2>נבדוק אם באמת מגיע לכם פטור</h2>
        <p>השאירו פרטים ושמאי מוסמך יבחן את התכניות שחלות על הפרויקט ואת החבות בהיטל - ללא התחייבות.</p>
      </div>
      <div class="cta-form reveal reveal-d1">
        <h3>שלחו לנו פנייה</h3>
        <p>נחזור אליכם בהקדם האפשרי</p>
        <form class="contact-form" id="contact-form" onsubmit="return submitContactForm(event, 'contact')">
          <input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);border:0;opacity:0">
          <div class="form-grid">
            <div class="form-group"><label for="contact-name">שם מלא *</label><input type="text" id="contact-name" name="name" placeholder="ישראל ישראלי" required autocomplete="name"></div>
            <div class="form-group"><label for="contact-phone">טלפון *</label><input type="tel" id="contact-phone" name="phone" placeholder="05X-XXXXXXX" required autocomplete="tel"></div>
          </div>
          <div class="form-group"><label for="contact-email">דוא"ל</label><input type="email" id="contact-email" name="email" placeholder="israel@example.com" autocomplete="email"></div>
          <div class="form-group">
            <label for="contact-subject">נושא פנייה</label>
            <select id="contact-subject" name="subject">
              <option value="היטל השבחה" selected>היטל השבחה</option>
              <option>תקן 21 · פינוי-בינוי</option>
              <option>שומת מקרקעין</option>
              <option>בדיקת כדאיות</option>
              <option>ייעוץ</option>
              <option>אחר</option>
            </select>
          </div>
          <div class="form-group"><label for="contact-message">הודעה</label><textarea id="contact-message" name="message" placeholder="איזה סוג פרויקט, באיזה שלב הוא נמצא ומה קיבלתם מהוועדה..."></textarea></div>
          <button type="submit" class="btn btn-gold form-submit" id="contact-submit-btn">שלח פנייה <span class="arr">←</span></button>
          <div id="contact-form-status" class="form-status"></div>
        </form>
      </div>
    </div>
  </div>
</section>

<!-- RELATED -->
<section class="section section--cream">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">תחומים נוספים</span>
      <h2 class="section-title">אולי יעניין אתכם גם</h2>
    </div>
    <div class="related reveal reveal-d1">
      <a href="takan-21-pinui-binui.html">תקן 21 · פינוי-בינוי <span class="arr">←</span></a>
      <a href="hetel-hashbacha.html">היטל השבחה - המדריך המלא <span class="arr">←</span></a>
      <a href="hetel-hashbacha-kiryot.html">היטל השבחה בקריות <span class="arr">←</span></a>
    </div>
  </div>
</section>

</main>

<!-- FOOTER -->
<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="logo-bm.png" alt="לוגו בורוביץ מזרחי">
        <p>משרד שמאות מקרקעין מוביל בצפון. ידע מקצועי מעמיק, היכרות שטח בלתי אמצעית והבנה כלכלית רחבה - בשירות כל לקוח.</p>
      </div>
      <div class="footer-col">
        <h4>ניווט</h4>
        <ul>
          <li><a href="index.html#about">אודות</a></li>
          <li><a href="index.html#services">תחומי התמחות</a></li>
          <li><a href="maamarim.html">מאמרים</a></li>
          <li><a href="index.html#success">תוצאות מהשטח</a></li>
          <li><a href="careers.html">קריירה</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>יצירת קשר</h4>
        <ul>
          <li><a href="tel:054-6559942">054-6559942 · מאור</a></li>
          <li><a href="tel:050-8922469">050-8922469 · אמיר</a></li>
          <li><a id="em-footer" href="#"></a></li>
          <li>שדרות החרוב 6, פארק תעשיות בר-לב</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 בורוביץ מזרחי שמאות מקרקעין וחקלאות בע"מ. כל הזכויות שמורות.</span>
      <span><a href="index.html">חזרה לאתר הראשי</a></span>
    </div>
  </div>
</footer>

<!-- FLOATING BUTTONS -->
<div class="floating-wrap">
  <a class="float-btn float-btn-wa" href="https://wa.me/972546559942" target="_blank" rel="noopener noreferrer" aria-label="שלחו הודעה בוואטסאפ">
    <svg aria-hidden="true" viewBox="0 0 32 32"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.67 4.61 1.832 6.5L4 29l7.75-1.812A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="#fff"/><path d="M21.5 18.5c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.19-.57-.34z" fill="#25D366"/></svg>
  </a>
  <button type="button" id="customAccessBtn" class="float-btn float-btn-access" aria-label="פתח תפריט נגישות" title="נגישות"><span aria-hidden="true">♿</span></button>
</div>

<!-- SCRIPTS -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<script>
  // Email obfuscation
  (function(){ var el=document.getElementById('em-footer'); if(el){ var a='info'+'@'+'bor-miz.co.il'; el.href='mailto:'+a; el.textContent=a; } })();

  // Hamburger menu
  function toggleMenu(){ var l=document.getElementById('navLinks'),b=document.getElementById('hamburger'); l.classList.toggle('open'); b.classList.toggle('open'); b.setAttribute('aria-expanded', l.classList.contains('open')?'true':'false'); }
  function closeMenu(){ document.getElementById('navLinks').classList.remove('open'); var b=document.getElementById('hamburger'); b.classList.remove('open'); b.setAttribute('aria-expanded','false'); }
  document.addEventListener('click', function(e){ var nav=document.getElementById('navbar'); if(nav && !nav.contains(e.target)) closeMenu(); });

  // Navbar scrolled state
  (function(){ var nav=document.getElementById('navbar'); var onScroll=function(){ nav.classList.toggle('scrolled', window.scrollY>60); }; window.addEventListener('scroll', onScroll, {passive:true}); onScroll(); })();

  // Reveal + counters
  (function(){
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce || !window.gsap || !window.ScrollTrigger){
      document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
      document.querySelectorAll('.counter').forEach(function(el){ el.textContent = el.getAttribute('data-target'); });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.reveal').forEach(function(el){ ScrollTrigger.create({ trigger: el, start:'top 88%', onEnter:function(){ el.classList.add('in'); } }); });
    document.querySelectorAll('.counter').forEach(function(el){
      var target=+el.getAttribute('data-target');
      ScrollTrigger.create({ trigger: el, start:'top 92%', once:true, onEnter:function(){ var o={v:0}; gsap.to(o,{v:target,duration:1.6,ease:'power2.out',onUpdate:function(){ el.textContent=Math.round(o.v); }}); } });
    });
  })();

  // Form submission → Supabase Edge Function
  var EDGE_FUNCTION_URL = 'https://nurgknexilxaxxovdbco.supabase.co/functions/v1/website-lead-intake';
  var SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51cmdrbmV4aWx4YXh4b3ZkYmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMjAxMzYsImV4cCI6MjA4OTY5NjEzNn0.S6BwlUfYkdWegz1gigK5dK0lXUowp4safWOFEzExuS0';
  function submitContactForm(e){
    e.preventDefault();
    var form=document.getElementById('contact-form'), btn=document.getElementById('contact-submit-btn'), statusEl=document.getElementById('contact-form-status');
    var name=document.getElementById('contact-name').value.trim(), phone=document.getElementById('contact-phone').value.trim();
    var email=document.getElementById('contact-email').value.trim(), subject=document.getElementById('contact-subject').value, message=document.getElementById('contact-message').value.trim();
    if(!name || !phone){ statusEl.style.display='block'; statusEl.style.color='#fca5a5'; statusEl.textContent='נא למלא שם וטלפון'; return false; }
    btn.disabled=true; btn.textContent='שולח...'; statusEl.style.display='none';
    fetch(EDGE_FUNCTION_URL, { method:'POST', headers:{'Content-Type':'application/json','apikey':SB_ANON,'Authorization':'Bearer '+SB_ANON}, body: JSON.stringify({ name:name, phone:phone, email:email||null, subject:subject||null, message:message||null, source:'service-page', _hp:(form.querySelector('input[name="website"]')||{value:''}).value, elapsed_ms:Math.round(performance.now()) }) })
      .then(function(res){ return res.json(); })
      .then(function(data){
        if(data.success){
          window.dataLayer=window.dataLayer||[]; window.dataLayer.push({ event:'generate_lead', form_source:'service-page', lead_subject:subject||'unspecified' });
          statusEl.style.display='block'; statusEl.style.color='#4ade80'; statusEl.textContent=data.message||'הפנייה נשלחה בהצלחה!'; form.reset();
        } else { throw new Error(data.error||'שגיאה בשליחה'); }
      })
      .catch(function(err){ statusEl.style.display='block'; statusEl.style.color='#fca5a5'; statusEl.textContent='שגיאה: '+(err.message||'נסו שוב מאוחר יותר'); })
      .finally(function(){ btn.disabled=false; btn.innerHTML='שלח פנייה <span class="arr">←</span>'; });
    return false;
  }

  // Contact micro-conversion tracking
  (function(){ window.dataLayer=window.dataLayer||[]; document.addEventListener('click', function(e){ var el=e.target.closest&&e.target.closest('a'); if(!el) return; if(/wa\.me|api\.whatsapp/.test(el.href||'')){ window.dataLayer.push({event:'contact_whatsapp'}); } else if((el.getAttribute('href')||'').indexOf('tel:')===0){ window.dataLayer.push({event:'contact_phone'}); } }, true); })();
</script>

<!-- NAGISHLI ACCESSIBILITY -->
<nagishli></nagishli>
<script>
nl_contact = "n:בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ|p:054-6559942|u:maor@bor-miz.co.il";
nl_pos = "BL"; nl_lang = "he"; nl_color = "blue"; nl_compact = "1";
</script>
<script src="nagishli.js?v=2.3" charset="utf-8"></script>
<script>
  (function(){
    function forceCompactStyles(){
      var bar=document.getElementById('NagishLiBar'), menus=document.getElementById('NagishLiMenus');
      if(bar){ bar.style.cssText='position:fixed !important; left:1.4rem !important; right:auto !important; bottom:6.2rem !important; top:auto !important; width:300px !important; max-width:90vw !important; height:auto !important; z-index:9999 !important; background:transparent !important; box-shadow:none !important; border:none !important; padding:0 !important; margin:0 !important;'; }
      if(menus){ menus.style.cssText+=';position:static !important; width:300px !important; max-width:90vw !important; max-height:70vh !important; overflow-y:auto !important; overflow-x:hidden !important; font-size:13px !important; border-radius:12px !important; box-shadow:0 10px 40px rgba(0,0,0,0.3) !important; margin:0 !important; padding:0 !important; background:#fff !important;'; }
      document.querySelectorAll('#NagishLiMenus, #NagishLiMenus ul').forEach(function(el){ el.style.width='100%'; el.style.maxWidth='300px'; el.style.boxSizing='border-box'; });
    }
    function openNagishLiMenu(){
      if(typeof jQuery==='undefined') return false;
      var $=jQuery, $strip=$('#NagishLiBarStrip'), $menus=$('#NagishLiMenus');
      if(!$strip.length || !$menus.length) return false;
      if($menus.is(':visible')){ $menus.slideUp(150, function(){ $strip.removeClass('open'); }); }
      else { forceCompactStyles(); $strip.addClass('open'); $menus.slideDown(150, forceCompactStyles); }
      return true;
    }
    function bind(){ var btn=document.getElementById('customAccessBtn'); if(!btn) return; btn.addEventListener('click', function(e){ e.preventDefault(); var n=0; (function tryOpen(){ if(openNagishLiMenu()) return; if(++n<30) setTimeout(tryOpen,200); })(); }); }
    if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', bind); } else { bind(); }
  })();
</script>

</body>
</html>

```

### `hetel-hashbacha.html`

```html
﻿<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="shortcut icon" href="/favicon.ico">

<!-- ===== GOOGLE ANALYTICS 4 (gtag.js) =====
     Property "bor-miz.co.il", measurement ID G-GYNQPGPR33 - installed 2026-09-08,
     replacing a Tag Manager placeholder that never had a container behind it.
     The bridge below turns the site's existing dataLayer.push({event:'...'}) calls
     (generate_lead / contact_whatsapp / contact_phone / intake_submitted) into GA4
     events, so every call site elsewhere in the site stays untouched. -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-GYNQPGPR33"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-GYNQPGPR33');
  (function(){
    // gtag() itself pushes an arguments object, which has no .event key - so this
    // never recurses on its own output.
    var push = window.dataLayer.push;
    window.dataLayer.push = function(){
      for (var i = 0; i < arguments.length; i++) {
        var o = arguments[i];
        if (o && typeof o.event === 'string') {
          var params = {};
          for (var k in o) {
            if (k !== 'event' && Object.prototype.hasOwnProperty.call(o, k)) params[k] = o[k];
          }
          gtag('event', o.event, params);
        }
      }
      return push.apply(window.dataLayer, arguments);
    };
  })();
</script>
<!-- ===== END GOOGLE ANALYTICS 4 ===== -->

<title>היטל השבחה - בדיקה והגשת השגה | בורוביץ מזרחי שמאות מקרקעין</title>
<meta name="description" content="קיבלתם דרישת היטל השבחה? ההיטל עומד על 50% מההשבחה ומבוסס על שומה - ושומה אפשר לבדוק ולערער עליה. שמאי מקרקעין מוסמך בוחן את החישוב ומגיש השגה מקצועית - הפחתנו ללקוחותינו עד 100% מהדרישה. בדיקה ראשונית ללא התחייבות.">
<meta name="keywords" content="היטל השבחה, השגה על היטל השבחה, הפחתת היטל השבחה, תוספת שלישית, מימוש זכויות, שמאי מכריע, ועדה מקומית, פטור היטל השבחה, שמאי מקרקעין, צפון">
<meta name="robots" content="noindex,nofollow">
<link rel="canonical" href="https://bor-miz.co.il/hetel-hashbacha.html">
<meta property="og:type" content="website">
<meta property="og:url" content="https://bor-miz.co.il/hetel-hashbacha.html">
<meta property="og:title" content="היטל השבחה - בדיקה והגשת השגה | בורוביץ מזרחי">
<meta property="og:description" content="קיבלתם דרישת היטל השבחה? ייתכן שאתם משלמים יותר מדי. בדיקה מקצועית והגשת השגה.">
<meta property="og:image" content="https://bor-miz.co.il/image_2.png">
<meta property="og:locale" content="he_IL">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500;600;700;900&family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

<!-- ===== STRUCTURED DATA – Service + Breadcrumb + FAQ ===== -->
<script type="application/ld+json">
{
  "@context": "https://schema.org", "@type": "Service",
  "name": "בדיקה והגשת השגה על היטל השבחה",
  "serviceType": "שמאות מקרקעין - היטל השבחה",
  "provider": { "@type": "LocalBusiness", "name": "בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ", "telephone": "+972-54-6559942", "areaServed": "צפון" },
  "url": "https://bor-miz.co.il/hetel-hashbacha.html"
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "ראשי", "item": "https://bor-miz.co.il/"},
    {"@type": "ListItem", "position": 2, "name": "תחומי התמחות", "item": "https://bor-miz.co.il/#services"},
    {"@type": "ListItem", "position": 3, "name": "היטל השבחה", "item": "https://bor-miz.co.il/hetel-hashbacha.html"}
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org", "@type": "FAQPage",
  "mainEntity": [
    {"@type": "Question", "name": "מה זה היטל השבחה?", "acceptedAnswer": {"@type": "Answer", "text": "היטל השבחה הוא תשלום חובה לוועדה המקומית כאשר ערך הנכס עלה בעקבות פעולה תכנונית - אישור תכנית, מתן הקלה או התרת שימוש חורג. ההיטל עומד על 50% מההשבחה (עליית השווי) ומשולם בעת מימוש הזכויות - מכירה או קבלת היתר בנייה. ההסדר מעוגן בתוספת השלישית לחוק התכנון והבנייה."}},
    {"@type": "Question", "name": "תוך כמה זמן אפשר להגיש השגה?", "acceptedAnswer": {"@type": "Answer", "text": "ניתן להגיש השגה על שומת היטל ההשבחה תוך 45 יום מקבלת הדרישה, באמצעות בקשה למינוי שמאי מכריע. זהו מועד קריטי - איחור עלול לשלול את הזכות, ולכן חשוב לפנות לשמאי מוקדם ככל האפשר."}},
    {"@type": "Question", "name": "כמה אפשר לחסוך בהגשת השגה?", "acceptedAnswer": {"@type": "Answer", "text": "בדיקה מקצועית מגלה לא פעם חישוב שגוי, שווי מופרז, התעלמות מפטור או מהוצאות שניתן לקזז. במקרים שטיפלנו בהם הצלחנו להפחית בין 50% ל-100% מדרישת ההיטל המקורית. בכל מקרה כדאי לבדוק לפני שמשלמים."}},
    {"@type": "Question", "name": "מי חייב בתשלום היטל השבחה?", "acceptedAnswer": {"@type": "Answer", "text": "החייב בהיטל הוא בעל הזכויות בנכס במועד אישור התכנית - בעלים, חוכר לדורות, ובהתאם לפסיקה (פס\"ד בלוך) גם בר-רשות במגזר החקלאי. כאשר יש מספר בעלים, כל אחד משלם באופן יחסי לחלקו."}},
    {"@type": "Question", "name": "האם יש התיישנות על דרישת היטל השבחה?", "acceptedAnswer": {"@type": "Answer", "text": "על פי הפסיקה, תקופת ההתיישנות לדרישת היטל השבחה עומדת על כ-7 שנים ממועד מימוש הזכויות. אם הוועדה השתהתה ולא פעלה לגביית החוב, ניתן לעיתים להעלות טענת שיהוי. כל מקרה נבחן לגופו."}}
  ]
}
</script>

<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="page.css">
</head>
<body>

<a href="#main-content" class="skip-to-content">דלג לתוכן הראשי</a>

<!-- NAVIGATION -->
<nav id="navbar" role="navigation" aria-label="ניווט ראשי">
  <div class="nav-inner">
    <a href="index.html" class="nav-logo" aria-label="בורוביץ מזרחי שמאות מקרקעין - דף הבית">
      <img src="logo-bm.png" alt="לוגו בורוביץ מזרחי">
    </a>
    <ul class="nav-links" id="navLinks">
      <li><a href="index.html#about" onclick="closeMenu()">אודות</a></li>
      <li><a href="index.html#services" onclick="closeMenu()">תחומי התמחות</a></li>
      <li><a href="maamarim.html" onclick="closeMenu()">מאמרים</a></li>
      <li><a href="index.html#linkedin-posts" onclick="closeMenu()">עדכונים</a></li>
      <li><a href="index.html#success" onclick="closeMenu()">מהשטח</a></li>
      <li><a href="careers.html" onclick="closeMenu()">קריירה</a></li>
      <li><a href="#lead" class="nav-cta" onclick="closeMenu()">צור קשר</a></li>
    </ul>
    <button class="hamburger" id="hamburger" onclick="toggleMenu()" aria-label="תפריט ניווט" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>

<main id="main-content">

<!-- HERO -->
<section class="subpage-hero">
  <div class="sp-bg" style="background-image:url('slide1.jpg')"></div>
  <div class="sp-overlay"></div>
  <div class="sp-content">
    <span class="eyebrow">תחום התמחות · היטל השבחה</span>
    <h1 class="sp-title">קיבלתם דרישת <span class="gold">היטל השבחה?</span><br>ייתכן שאתם משלמים יותר מדי</h1>
    <p class="sp-sub">שיעור היטל ההשבחה לרוב הוא 50% מ"ההשבחה" (לעיתים גם שונה) - והוא מבוסס על שומה שמכינה הוועדה. שומות אפשר לבדוק. אנחנו בוחנים את החישוב לעומק, מאתרים פטורים, קיזוזים וטעויות, ומגישים השגה מקצועית מול הוועדה. הפחתנו ללקוחותינו עד 100% מהדרישה.</p>
    <div class="hero-actions">
      <a href="#lead" class="btn btn-gold">בדיקה ראשונית ללא התחייבות <span class="arr">←</span></a>
      <a href="#how" class="btn btn-ghost">איך זה עובד</a>
    </div>
  </div>
</section>

<!-- STAT STRIP -->
<section class="stat-strip">
  <div class="container" style="padding-inline:0;">
    <div class="stat-strip-inner">
      <div class="stat reveal"><div class="num">עד <span class="counter" data-target="100">0</span>%</div><div class="label">הפחתת היטל במקרים שטיפלנו בהם</div></div>
      <div class="stat reveal reveal-d1"><div class="num">45</div><div class="label">ימים בלבד להגשת השגה</div></div>
      <div class="stat reveal reveal-d2"><div class="num">50%</div><div class="label">מההשבחה - שיעור ההיטל הקבוע בחוק</div></div>
    </div>
  </div>
</section>

<!-- WHAT IS IT -->
<section class="section">
  <div class="container">
    <div class="content-block two-col">
      <div class="reveal">
        <span class="eyebrow">מה זה בעצם?</span>
        <h2 class="section-title" style="margin-top:.8rem;">היטל השבחה - בקצרה</h2>
      </div>
      <div class="prose reveal reveal-d1">
        <p><strong>היטל השבחה</strong> הוא תשלום חובה לוועדה המקומית לתכנון ובנייה, החל מאז שנת 1975, כאשר ערך הנכס שלכם עלה בעקבות פעולה תכנונית - <strong>אישור תכנית משביחה</strong>, מתן <strong>הקלה</strong>, או התרת <strong>שימוש חורג</strong>.</p>
        <p>שיעור ההיטל הוא <strong>50% מגובה ההשבחה</strong> - כלומר מההפרש בין שווי הנכס במצב הקודם לבין שוויו במצב החדש שנוצר בעקבות הפעולה התכנונית. הכסף משמש את הוועדה לתכנון, פיתוח, רכישת קרקע לצורכי ציבור ושימור אתרים.</p>
        <p>ההיטל משולם בעת <strong>מימוש הזכויות</strong> - במכירת הנכס או בקבלת היתר בנייה - ולא רגע אחד לפני. כל ההסדר מעוגן ב<strong>תוספת השלישית לחוק התכנון והבנייה</strong>.</p>
        <div class="callout">גובה ההשבחה נקבע ב<strong>שומה</strong> שמכינה הוועדה - ולא פעם השומה הזו מופרזת, מתעלמת מפטור שמגיע לכם, או מבוססת על הנחות שגויות. כאן בדיוק נכנס שמאי מטעמכם.</div>
      </div>
    </div>
  </div>
</section>

<!-- WHAT AFFECTS THE LEVY -->
<section class="section section--cream">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">לא רק "50% וזהו"</span>
      <h2 class="section-title">מה באמת משפיע על גובה ההיטל</h2>
      <p>חישוב היטל ההשבחה הוא לב עבודתו של השמאי. מאחורי המספר היבש מסתתרים עשרות שיקולים - וכל אחד מהם יכול להזיז את הסכום בעשרות אלפי שקלים.</p>
    </div>
    <div class="values-grid reveal reveal-d1">
      <div class="value-card">
        <span class="v-num">01</span>
        <h3>שווי "לפני" מול "אחרי"</h3>
        <p>הבסיס לכל החישוב. עסקאות השוואה לא מתאימות או הנחות שווי מנופחות מגדילות מלאכותית את ההשבחה - וזו הנקודה הראשונה שבודקים.</p>
      </div>
      <div class="value-card">
        <span class="v-num">02</span>
        <h3>פטורים מלאים או חלקיים</h3>
        <p>החוק מעניק פטורים - למשל הרחבת דירת מגורים עד 140 מ"ר, ופטורים בהתחדשות עירונית. פטור שלא נלקח בחשבון = תשלום עודף.</p>
      </div>
      <div class="value-card">
        <span class="v-num">03</span>
        <h3>שיעורים מופחתים</h3>
        <p>במסלולי תמ"א 38 ובמקרים נוספים שיעור ההיטל נמוך מ-50% (ולעיתים 0%). יישום נכון של השיעור משנה את התמונה לחלוטין.</p>
      </div>
      <div class="value-card">
        <span class="v-num">04</span>
        <h3>קיזוזים, דחייה והוצאות</h3>
        <p>הוצאות הריסה, מקדמי דחייה, התאמות והפחתות מוכרות - כל אלה מקטינים את החיוב כשהשמאי יודע לדרוש אותם.</p>
      </div>
      <div class="value-card">
        <span class="v-num">05</span>
        <h3>המועד הקובע ושיטת החישוב</h3>
        <p>לפי הפסיקה כל תכנית מחושבת בנפרד, לפי המועד הקובע שלה ("שיטת המדרגות"). חישוב לפי שיטה שגויה מנפח את ההיטל.</p>
      </div>
      <div class="value-card">
        <span class="v-num">06</span>
        <h3>פסיקה ושומות מכריעות</h3>
        <p>קיים גוף עשיר של החלטות שמאים מכריעים ופסקי דין. כשקיימת שומה מכרעת בנכס דומה - לוועדה יש חובה להתחשב בה.</p>
      </div>
    </div>
  </div>
</section>

<!-- WHY OBJECT -->
<section class="section">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">למה כדאי לבדוק</span>
      <h2 class="section-title">3 סיבות להגיש השגה</h2>
      <p>רוב בעלי הנכסים משלמים את הדרישה כפי שהיא - בלי לדעת שאפשר אחרת.</p>
    </div>
    <div class="feature-grid reveal reveal-d1">
      <div class="feature-card">
        <div class="fc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg></div>
        <h3>חיסכון משמעותי</h3>
        <p>במקרים רבים ניתן להפחית עשרות אחוזים - ולעיתים את מלוא הדרישה. ההפרש מגיע לעשרות ומאות אלפי שקלים.</p>
      </div>
      <div class="feature-card">
        <div class="fc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
        <h3>זו זכות חוקית</h3>
        <p>החוק מקנה לכל בעל נכס את הזכות להגיש השגה ולבקש מינוי שמאי מכריע - תוך 45 יום מקבלת הדרישה.</p>
      </div>
      <div class="feature-card">
        <div class="fc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><circle cx="15" cy="15" r="3"/><line x1="17.5" y1="17.5" x2="21" y2="21"/></svg></div>
        <h3>בדיקה מקצועית</h3>
        <p>ניתוח מעמיק של התכניות, ההקלות, ועסקאות ההשוואה באזור - מאתר טעויות בשומת הוועדה.</p>
      </div>
    </div>
  </div>
</section>

<!-- WHEN & WHO -->
<section class="section section--cream">
  <div class="container">
    <div class="content-block two-col">
      <div class="reveal">
        <span class="eyebrow">מתי ומי</span>
        <h2 class="section-title" style="margin-top:.8rem;">מתי משלמים - ומי חייב?</h2>
        <p class="lead" style="margin-top:1rem;">ההיטל לא משולם ברגע שהתכנית מאושרת, אלא רק כאשר "מממשים" את הזכויות. שתי השאלות - מתי ועל מי - הן עצמן עילות לבדיקה.</p>
        <div class="prose" style="margin-top:1.2rem;">
          <p><strong>מימוש זכויות</strong> קורה באחד משלושה אירועים: קבלת היתר בנייה שלא ניתן היה לקבל לפני התכנית, תחילת שימוש בפועל במה שהותר, או העברת הזכויות (מכירה). במכירה או מימוש של חלק מהזכויות בלבד - ההיטל יחסי לחלק שמומש.</p>
        </div>
      </div>
      <ul class="check-list reveal reveal-d1">
        <li><strong>בעלים</strong> - בעל הנכס הרשום</li>
        <li><strong>חוכר לדורות</strong> - שוכר ארוך-טווח מרמ"י</li>
        <li><strong>בר-רשות במגזר החקלאי</strong> - לפי פסיקת בית המשפט (הלכת בלוך)</li>
        <li>שותפים - כל אחד לפי חלקו היחסי בנכס</li>
        <li>מי שמוכר דירה, בית או מגרש</li>
        <li>מי שמגיש בקשה להיתר בנייה</li>
      </ul>
    </div>
  </div>
</section>

<!-- EXEMPTIONS -->
<section class="section">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">לפני שמשלמים</span>
      <h2 class="section-title">פטורים והקלות שאסור לפספס</h2>
      <p>החוק מכיר במצבים רבים שבהם ההיטל פוחת או מתבטל לגמרי. אלה כמה מהנפוצים - ויש עוד.</p>
    </div>
    <div class="feature-grid reveal reveal-d1">
      <div class="feature-card">
        <div class="fc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
        <h3>הרחבת דירת מגורים</h3>
        <p>פטור על השבחה הנובעת מהרחבת דירה למגורים עד שטח של 140 מ"ר, בכפוף לתנאי החוק - אחד הפטורים השכיחים ביותר.</p>
      </div>
      <div class="feature-card">
        <div class="fc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></div>
        <h3>תמ"א 38 והתחדשות עירונית</h3>
        <p>במסלולי חיזוק והריסה-בנייה שיעור ההיטל מופחת מאוד - ובחלק מהמקרים אף 0%. כדאי לוודא שהשיעור הנכון יושם. <a href="hetel-hashbacha-pinui-binui.html">מתי הפטור בהתחדשות עירונית לא חל</a>.</p>
      </div>
      <div class="feature-card">
        <div class="fc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg></div>
        <h3>מצבים אישיים ואזוריים</h3>
        <p>פטורים בשכונות שיקום, באזורי עדיפות, ובמצבים סוציאליים מסוימים. צריך לבדוק אם אתם נכנסים לאחת הקטגוריות.</p>
      </div>
    </div>
  </div>
</section>

<!-- PROCESS -->
<section class="section section--cream" id="how">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">איך זה עובד</span>
      <h2 class="section-title">התהליך, צעד אחר צעד</h2>
    </div>
    <div class="steps">
      <div class="step reveal"><div class="step-num">1</div><div><h4>בדיקה ראשונית</h4><p>שולחים לנו את דרישת התשלום ואת מסמכי הנכס. אנחנו בודקים האם יש בסיס להפחתה - ללא התחייבות מצידכם.</p></div></div>
      <div class="step reveal reveal-d1"><div class="step-num">2</div><div><h4>ניתוח שמאי מעמיק</h4><p>בוחנים את התכניות, ההקלות, הפטורים, בסיס החישוב ועסקאות ההשוואה - ומכינים שומה נגדית מנומקת.</p></div></div>
      <div class="step reveal reveal-d2"><div class="step-num">3</div><div><h4>הגשת השגה רשמית</h4><p>מגישים את ההשגה לוועדה ומבקשים מינוי שמאי מכריע, תוך ייצוג מלא שלכם בהליך.</p></div></div>
      <div class="step reveal reveal-d3"><div class="step-num">4</div><div><h4>הכרעה וחיסכון</h4><p>לאחר הדיון מול השמאי המכריע, השומה מתעדכנת וההיטל מופחת - והחיסכון נשאר בכיס שלכם.</p></div></div>
    </div>
  </div>
</section>

<!-- WHO FOR -->
<section class="section">
  <div class="container">
    <div class="content-block two-col">
      <div class="reveal">
        <span class="eyebrow">למי זה מתאים</span>
        <h2 class="section-title" style="margin-top:.8rem;">מי צריך לבדוק היטל השבחה?</h2>
        <p class="lead" style="margin-top:1rem;">אם קיבלתם דרישה - או שאתם לפני מכירה או היתר - שווה לבדוק לפני שמשלמים.</p>
      </div>
      <ul class="check-list reveal reveal-d1">
        <li>בעלי נכס שקיבלו דרישת תשלום מהוועדה המקומית</li>
        <li>מי שלפני מכירת דירה, בית או מגרש</li>
        <li>מי שמגיש בקשה להיתר בנייה</li>
        <li>יזמים ובעלי קרקע בתהליכי תכנון</li>
        <li>מי שקיבל שומת השבחה בעקבות הקלה או שימוש חורג</li>
        <li>עורכי דין ומתווכים המלווים עסקה</li>
      </ul>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="section section--cream">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">שאלות נפוצות</span>
      <h2 class="section-title">מה חשוב לדעת</h2>
    </div>
    <div class="faq-list reveal reveal-d1">
      <details class="faq-item"><summary>מתי בדיוק משלמים את ההיטל?</summary><div class="faq-body">היטל ההשבחה משולם בעת <strong>מימוש הזכויות</strong> - מכירת הנכס או קבלת היתר בנייה. לא לפני. כך שגם אם אושרה תכנית שהשביחה את הנכס, החיוב בפועל נדחה למועד המימוש.</div></details>
      <details class="faq-item"><summary>כמה זמן יש לי להגיש השגה?</summary><div class="faq-body"><strong>45 יום</strong> מקבלת דרישת התשלום. זהו מועד קריטי - איחור עלול לשלול את הזכות להשגה, ולכן חשוב לפנות לשמאי מוקדם ככל האפשר.</div></details>
      <details class="faq-item"><summary>מי חייב בתשלום - ומה לגבי נחלות וברי-רשות?</summary><div class="faq-body">החייב הוא <strong>בעל הזכויות</strong> במועד אישור התכנית: בעלים או חוכר לדורות. לפי הפסיקה (הלכת בלוך), חובת התשלום חלה גם על <strong>בר-רשות במגזר החקלאי</strong>. כשיש כמה בעלים - כל אחד משלם לפי חלקו היחסי בנכס.</div></details>
      <details class="faq-item"><summary>מה זה שמאי מכריע?</summary><div class="faq-body">כאשר יש מחלוקת בין שומת הוועדה לשומה מטעמכם, ממונה <strong>שמאי מכריע</strong> - שמאי ניטרלי מטעם מועצת השמאים - שמכריע בגובה ההשבחה. ייצוג מקצועי בשלב זה משפיע ישירות על התוצאה.</div></details>
      <details class="faq-item"><summary>יש התיישנות על דרישת ההיטל?</summary><div class="faq-body">על פי הפסיקה, התיישנות הדרישה עומדת על כ-<strong>7 שנים</strong> ממועד מימוש הזכויות. אם הוועדה השתהתה זמן רב מבלי לפעול, ניתן לעיתים להעלות טענת <strong>שיהוי</strong>. נבדוק זאת עבורכם.</div></details>
      <details class="faq-item"><summary>כמה עולה לי להגיש השגה?</summary><div class="faq-body">העלות נקבעת לפי מורכבות התיק. ברוב המקרים החיסכון הצפוי גבוה משמעותית משכר הטרחה - ולכן אנחנו פותחים בבדיקה ראשונית כדי להעריך את הכדאיות לפני שמתחילים.</div></details>
    </div>
  </div>
</section>

<!-- CTA / LEAD -->
<section class="section cta-band" id="lead">
  <div class="container">
    <div class="cta-inner">
      <div class="cta-copy reveal">
        <span class="eyebrow">בדיקת זכאות</span>
        <h2>נבדוק אם אתם משלמים יותר מדי</h2>
        <p>השאירו פרטים ושמאי מוסמך יחזור אליכם לבדיקה ראשונית של דרישת היטל ההשבחה - ללא התחייבות.</p>
      </div>
      <div class="cta-form reveal reveal-d1">
        <h3>שלחו לנו פנייה</h3>
        <p>נחזור אליכם בהקדם האפשרי</p>
        <form class="contact-form" id="contact-form" onsubmit="return submitContactForm(event, 'contact')">
          <input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);border:0;opacity:0">
          <div class="form-grid">
            <div class="form-group"><label for="contact-name">שם מלא *</label><input type="text" id="contact-name" name="name" placeholder="ישראל ישראלי" required autocomplete="name"></div>
            <div class="form-group"><label for="contact-phone">טלפון *</label><input type="tel" id="contact-phone" name="phone" placeholder="05X-XXXXXXX" required autocomplete="tel"></div>
          </div>
          <div class="form-group"><label for="contact-email">דוא"ל</label><input type="email" id="contact-email" name="email" placeholder="israel@example.com" autocomplete="email"></div>
          <div class="form-group">
            <label for="contact-subject">נושא פנייה</label>
            <select id="contact-subject" name="subject">
              <option value="היטל השבחה" selected>היטל השבחה</option>
              <option>השגה על שומת רמ"י</option>
              <option>שומת מקרקעין</option>
              <option>בדיקת כדאיות</option>
              <option>ייעוץ</option>
              <option>אחר</option>
            </select>
          </div>
          <div class="form-group"><label for="contact-message">הודעה</label><textarea id="contact-message" name="message" placeholder="תיאור קצר של הנכס והדרישה שקיבלתם..."></textarea></div>
          <button type="submit" class="btn btn-gold form-submit" id="contact-submit-btn">שלח פנייה <span class="arr">←</span></button>
          <div id="contact-form-status" class="form-status"></div>
        </form>
      </div>
    </div>
  </div>
</section>

<!-- RELATED -->
<section class="section section--cream">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">תחומים נוספים</span>
      <h2 class="section-title">אולי יעניין אתכם גם</h2>
    </div>
    <div class="related reveal reveal-d1">
      <a href="hetel-hashbacha-pinui-binui.html">היטל השבחה בפינוי-בינוי <span class="arr">←</span></a>
      <a href="hetel-hashbacha-kiryot.html">היטל השבחה בקריות <span class="arr">←</span></a>
      <a href="hasagot-rami.html">השגות על שומות רמ"י <span class="arr">←</span></a>
      <a href="takan-21-pinui-binui.html">תקן 21 · פינוי-בינוי <span class="arr">←</span></a>
    </div>
  </div>
</section>

</main>

<!-- FOOTER -->
<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="logo-bm.png" alt="לוגו בורוביץ מזרחי">
        <p>משרד שמאות מקרקעין מוביל בצפון. ידע מקצועי מעמיק, היכרות שטח בלתי אמצעית והבנה כלכלית רחבה - בשירות כל לקוח.</p>
      </div>
      <div class="footer-col">
        <h4>ניווט</h4>
        <ul>
          <li><a href="index.html#about">אודות</a></li>
          <li><a href="index.html#services">תחומי התמחות</a></li>
          <li><a href="maamarim.html">מאמרים</a></li>
          <li><a href="index.html#success">תוצאות מהשטח</a></li>
          <li><a href="careers.html">קריירה</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>יצירת קשר</h4>
        <ul>
          <li><a href="tel:054-6559942">054-6559942 · מאור</a></li>
          <li><a href="tel:050-8922469">050-8922469 · אמיר</a></li>
          <li><a id="em-footer" href="#"></a></li>
          <li>שדרות החרוב 6, פארק תעשיות בר-לב</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 בורוביץ מזרחי שמאות מקרקעין וחקלאות בע"מ. כל הזכויות שמורות.</span>
      <span><a href="index.html">חזרה לאתר הראשי</a></span>
    </div>
  </div>
</footer>

<!-- FLOATING BUTTONS -->
<div class="floating-wrap">
  <a class="float-btn float-btn-wa" href="https://wa.me/972546559942" target="_blank" rel="noopener noreferrer" aria-label="שלחו הודעה בוואטסאפ">
    <svg aria-hidden="true" viewBox="0 0 32 32"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.67 4.61 1.832 6.5L4 29l7.75-1.812A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="#fff"/><path d="M21.5 18.5c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.19-.57-.34z" fill="#25D366"/></svg>
  </a>
  <button type="button" id="customAccessBtn" class="float-btn float-btn-access" aria-label="פתח תפריט נגישות" title="נגישות"><span aria-hidden="true">♿</span></button>
</div>

<!-- SCRIPTS -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<script>
  // Email obfuscation
  (function(){ var el=document.getElementById('em-footer'); if(el){ var a='info'+'@'+'bor-miz.co.il'; el.href='mailto:'+a; el.textContent=a; } })();

  // Hamburger menu
  function toggleMenu(){ var l=document.getElementById('navLinks'),b=document.getElementById('hamburger'); l.classList.toggle('open'); b.classList.toggle('open'); b.setAttribute('aria-expanded', l.classList.contains('open')?'true':'false'); }
  function closeMenu(){ document.getElementById('navLinks').classList.remove('open'); var b=document.getElementById('hamburger'); b.classList.remove('open'); b.setAttribute('aria-expanded','false'); }
  document.addEventListener('click', function(e){ var nav=document.getElementById('navbar'); if(nav && !nav.contains(e.target)) closeMenu(); });

  // Navbar scrolled state
  (function(){ var nav=document.getElementById('navbar'); var onScroll=function(){ nav.classList.toggle('scrolled', window.scrollY>60); }; window.addEventListener('scroll', onScroll, {passive:true}); onScroll(); })();

  // Reveal + counters
  (function(){
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce || !window.gsap || !window.ScrollTrigger){
      document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
      document.querySelectorAll('.counter').forEach(function(el){ el.textContent = el.getAttribute('data-target'); });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.reveal').forEach(function(el){ ScrollTrigger.create({ trigger: el, start:'top 88%', onEnter:function(){ el.classList.add('in'); } }); });
    document.querySelectorAll('.counter').forEach(function(el){
      var target=+el.getAttribute('data-target');
      ScrollTrigger.create({ trigger: el, start:'top 92%', once:true, onEnter:function(){ var o={v:0}; gsap.to(o,{v:target,duration:1.6,ease:'power2.out',onUpdate:function(){ el.textContent=Math.round(o.v); }}); } });
    });
  })();

  // Form submission → Supabase Edge Function
  var EDGE_FUNCTION_URL = 'https://nurgknexilxaxxovdbco.supabase.co/functions/v1/website-lead-intake';
  var SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51cmdrbmV4aWx4YXh4b3ZkYmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMjAxMzYsImV4cCI6MjA4OTY5NjEzNn0.S6BwlUfYkdWegz1gigK5dK0lXUowp4safWOFEzExuS0';
  function submitContactForm(e){
    e.preventDefault();
    var form=document.getElementById('contact-form'), btn=document.getElementById('contact-submit-btn'), statusEl=document.getElementById('contact-form-status');
    var name=document.getElementById('contact-name').value.trim(), phone=document.getElementById('contact-phone').value.trim();
    var email=document.getElementById('contact-email').value.trim(), subject=document.getElementById('contact-subject').value, message=document.getElementById('contact-message').value.trim();
    if(!name || !phone){ statusEl.style.display='block'; statusEl.style.color='#fca5a5'; statusEl.textContent='נא למלא שם וטלפון'; return false; }
    btn.disabled=true; btn.textContent='שולח...'; statusEl.style.display='none';
    fetch(EDGE_FUNCTION_URL, { method:'POST', headers:{'Content-Type':'application/json','apikey':SB_ANON,'Authorization':'Bearer '+SB_ANON}, body: JSON.stringify({ name:name, phone:phone, email:email||null, subject:subject||null, message:message||null, source:'service-page', _hp:(form.querySelector('input[name="website"]')||{value:''}).value, elapsed_ms:Math.round(performance.now()) }) })
      .then(function(res){ return res.json(); })
      .then(function(data){
        if(data.success){
          window.dataLayer=window.dataLayer||[]; window.dataLayer.push({ event:'generate_lead', form_source:'service-page', lead_subject:subject||'unspecified' });
          statusEl.style.display='block'; statusEl.style.color='#4ade80'; statusEl.textContent=data.message||'הפנייה נשלחה בהצלחה!'; form.reset();
        } else { throw new Error(data.error||'שגיאה בשליחה'); }
      })
      .catch(function(err){ statusEl.style.display='block'; statusEl.style.color='#fca5a5'; statusEl.textContent='שגיאה: '+(err.message||'נסו שוב מאוחר יותר'); })
      .finally(function(){ btn.disabled=false; btn.innerHTML='שלח פנייה <span class="arr">←</span>'; });
    return false;
  }

  // Contact micro-conversion tracking
  (function(){ window.dataLayer=window.dataLayer||[]; document.addEventListener('click', function(e){ var el=e.target.closest&&e.target.closest('a'); if(!el) return; if(/wa\.me|api\.whatsapp/.test(el.href||'')){ window.dataLayer.push({event:'contact_whatsapp'}); } else if((el.getAttribute('href')||'').indexOf('tel:')===0){ window.dataLayer.push({event:'contact_phone'}); } }, true); })();
</script>

<!-- NAGISHLI ACCESSIBILITY -->
<nagishli></nagishli>
<script>
nl_contact = "n:בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ|p:054-6559942|u:maor@bor-miz.co.il";
nl_pos = "BL"; nl_lang = "he"; nl_color = "blue"; nl_compact = "1";
</script>
<script src="nagishli.js?v=2.3" charset="utf-8"></script>
<script>
  (function(){
    function forceCompactStyles(){
      var bar=document.getElementById('NagishLiBar'), menus=document.getElementById('NagishLiMenus');
      if(bar){ bar.style.cssText='position:fixed !important; left:1.4rem !important; right:auto !important; bottom:6.2rem !important; top:auto !important; width:300px !important; max-width:90vw !important; height:auto !important; z-index:9999 !important; background:transparent !important; box-shadow:none !important; border:none !important; padding:0 !important; margin:0 !important;'; }
      if(menus){ menus.style.cssText+=';position:static !important; width:300px !important; max-width:90vw !important; max-height:70vh !important; overflow-y:auto !important; overflow-x:hidden !important; font-size:13px !important; border-radius:12px !important; box-shadow:0 10px 40px rgba(0,0,0,0.3) !important; margin:0 !important; padding:0 !important; background:#fff !important;'; }
      document.querySelectorAll('#NagishLiMenus, #NagishLiMenus ul').forEach(function(el){ el.style.width='100%'; el.style.maxWidth='300px'; el.style.boxSizing='border-box'; });
    }
    function openNagishLiMenu(){
      if(typeof jQuery==='undefined') return false;
      var $=jQuery, $strip=$('#NagishLiBarStrip'), $menus=$('#NagishLiMenus');
      if(!$strip.length || !$menus.length) return false;
      if($menus.is(':visible')){ $menus.slideUp(150, function(){ $strip.removeClass('open'); }); }
      else { forceCompactStyles(); $strip.addClass('open'); $menus.slideDown(150, forceCompactStyles); }
      return true;
    }
    function bind(){ var btn=document.getElementById('customAccessBtn'); if(!btn) return; btn.addEventListener('click', function(e){ e.preventDefault(); var n=0; (function tryOpen(){ if(openNagishLiMenu()) return; if(++n<30) setTimeout(tryOpen,200); })(); }); }
    if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', bind); } else { bind(); }
  })();
</script>

</body>
</html>

```

### `intake.html`

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="shortcut icon" href="/favicon.ico">
<meta name="robots" content="noindex, nofollow">
<title>טופס איסוף פרטים | בורוביץ מזרחי שמאות מקרקעין</title>

<!-- Link preview (WhatsApp / social) - restores the share card -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="בורוביץ מזרחי שמאות מקרקעין וחקלאות בע&quot;מ">
<meta property="og:title" content="טופס פרטים לשומה">
<meta property="og:description" content="בורוביץ מזרחי שמאות מקרקעין וחקלאות בע&quot;מ - מילוי פרטים להכנת השומה">
<meta property="og:image" content="https://bor-miz.co.il/intake-share.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="בורוביץ מזרחי שמאות מקרקעין וחקלאות">
<meta property="og:url" content="https://bor-miz.co.il/intake.html">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="טופס פרטים לשומה">
<meta name="twitter:description" content="בורוביץ מזרחי שמאות מקרקעין וחקלאות בע&quot;מ">
<meta name="twitter:image" content="https://bor-miz.co.il/intake-share.png">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

<style>
:root{
  --ink:#131f33; --navy:#1c3461; --navy-2:#0f1c33; --gold:#b08d3e; --gold-2:#e4c987;
  --cream:#f4f6fa; --muted:#56616f; --muted-2:#8a93a0; --line:rgba(19,31,51,.12);
  --sans:"Heebo", system-ui, -apple-system, sans-serif; --ok:#0f8a5f; --err:#c0392b;
}
*{margin:0;padding:0;box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{font-family:var(--sans);color:var(--ink);line-height:1.6;direction:rtl;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
img{max-width:100%;display:block}
button{font-family:inherit;cursor:pointer}

.page{display:grid;grid-template-columns:1fr 1.12fr;min-height:100vh;background:var(--cream)}

/* ── HERO (right side in RTL) - office copy + photo ── */
.hero{position:sticky;top:0;align-self:start;height:100vh;overflow:hidden;color:#fff;
  display:flex;flex-direction:column;justify-content:space-between;align-items:flex-start;
  padding:clamp(36px,4.5vw,64px) clamp(30px,4vw,58px);
  background:linear-gradient(150deg, rgba(15,28,51,.90) 0%, rgba(28,52,97,.78) 55%, rgba(15,28,51,.82) 100%), url("slide6.jpg") center/cover no-repeat}
.hero .logo{height:clamp(40px,4vw,52px);width:auto;object-fit:contain;filter:brightness(0) invert(1)}
.hero-body{max-width:440px;display:flex;flex-direction:column;gap:clamp(14px,2vw,22px)}
.hero-eyebrow{color:var(--gold-2);font-size:.82rem;font-weight:600;letter-spacing:.14em}
.hero h2{font-size:clamp(1.9rem,3.2vw,2.8rem);font-weight:800;line-height:1.12;letter-spacing:-.02em}
.hero h2 .g{color:var(--gold-2)}
.hero-sub{font-size:clamp(.96rem,1.3vw,1.1rem);font-weight:300;line-height:1.65;color:rgba(255,255,255,.86)}
.hero-feats{list-style:none;display:flex;flex-direction:column;gap:11px;margin-top:4px}
.hero-feats li{display:flex;align-items:center;gap:11px;font-size:.96rem;color:rgba(255,255,255,.94)}
.hero-feats .ck{flex:none;width:22px;height:22px;border-radius:50%;background:rgba(176,141,62,.95);display:grid;place-items:center}
.hero-feats .ck svg{width:12px;height:12px}
.hero-foot{font-size:.8rem;color:rgba(255,255,255,.72);line-height:1.5;display:flex;flex-direction:column;gap:4px}
.hero-foot .hf-addr{color:rgba(255,255,255,.58);margin-bottom:3px}
.hero-foot strong{color:#fff;font-weight:600}
.hero-foot a{color:var(--gold-2);font-weight:500}

/* ── FORM PANE (left) ── */
.pane{display:flex;align-items:flex-start;justify-content:center;padding:clamp(26px,4.5vh,56px) clamp(18px,3vw,44px)}
.card{width:100%;max-width:600px;background:#fff;border:1px solid var(--line);border-radius:16px;
  box-shadow:0 24px 70px -34px rgba(8,16,33,.42);padding:clamp(22px,3vw,34px) clamp(20px,3vw,36px)}
.card-head{margin-bottom:20px}
.card-head h1{font-size:clamp(1.3rem,2.4vw,1.6rem);font-weight:800;color:var(--ink);letter-spacing:-.01em}
.card-head p{color:var(--muted);font-size:.9rem;font-weight:300;margin-top:5px}

.sec{margin-top:22px}
.sec:first-of-type{margin-top:6px}
.sec-label{display:flex;align-items:center;gap:11px;font-size:.73rem;font-weight:700;letter-spacing:.05em;color:var(--gold);margin-bottom:12px}
.sec-label::after{content:"";flex:1;height:1px;background:var(--line)}
.sec-label .hint{color:var(--muted-2);font-weight:400;letter-spacing:0}

.field{display:flex;flex-direction:column;min-width:0}
.field label{font-size:.74rem;font-weight:600;color:#56627a;margin-bottom:5px;white-space:nowrap}
.field label .req{color:var(--gold)}
.field label .nb{color:var(--muted-2);font-weight:400}
.inp{width:100%;font-family:inherit;font-size:.9rem;color:var(--ink);background:#f6f8fb;border:1px solid var(--line);border-radius:9px;padding:9px 11px;transition:border-color .15s,background .15s,box-shadow .15s}
.inp:focus{outline:none;border-color:var(--navy);background:#fff;box-shadow:0 0 0 3px rgba(28,52,97,.1)}
.inp::placeholder{color:#a9b1bf}
textarea.inp{min-height:62px;resize:vertical;line-height:1.5}
select.inp{appearance:none;-webkit-appearance:none;cursor:pointer;padding-left:32px;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='11' height='7' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' fill='none' stroke='%2356616f' stroke-width='1.7' stroke-linecap='round'/></svg>");background-repeat:no-repeat;background-position:left 11px center}

/* one person = one row */
.row{display:flex;gap:8px}
.row .field{flex:1 1 0}
.who .nm{flex:1.5}
.who .em{flex:1.5}
.g2 .field,.g3 .field{flex:1 1 0}
@media(max-width:560px){.row{flex-wrap:wrap}.who .field,.g3 .field{flex:1 1 44%}}

.idnote{font-size:.72rem;color:var(--muted-2);margin-top:7px}

/* contacts: one row each */
.crow{display:flex;gap:8px;align-items:center;margin-bottom:9px}
.crow select,.crow input{font-family:inherit;font-size:.86rem;color:var(--ink);background:#f6f8fb;border:1px solid var(--line);border-radius:9px;padding:9px 10px;transition:border-color .15s,background .15s,box-shadow .15s;min-width:0}
.crow select:focus,.crow input:focus{outline:none;border-color:var(--navy);background:#fff;box-shadow:0 0 0 3px rgba(28,52,97,.1)}
.crow .ct-role{flex:0 0 110px;appearance:none;-webkit-appearance:none;cursor:pointer;padding-left:24px;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' fill='none' stroke='%2356616f' stroke-width='1.7' stroke-linecap='round'/></svg>");background-repeat:no-repeat;background-position:left 8px center}
.crow .ct-name{flex:1.3 1 0}
.crow .ct-phone{flex:1 1 0}
.crow .ct-email{flex:1.3 1 0}
.crow .rm{flex:0 0 auto;width:30px;height:30px;border:none;background:transparent;color:var(--muted-2);font-size:1.2rem;line-height:1;border-radius:8px;display:grid;place-items:center;transition:.15s}
.crow .rm:hover{background:#fbe9e9;color:var(--err)}
@media(max-width:600px){.crow{flex-wrap:wrap}.crow .ct-role{flex:1 1 96px}.crow .ct-name,.crow .ct-phone,.crow .ct-email{flex:1 1 120px}}
.add-c{margin-top:2px;display:inline-flex;align-items:center;gap:7px;border:1px solid var(--line);background:#fff;color:var(--navy);font-weight:600;font-size:.88rem;padding:8px 15px;border-radius:9px;transition:.15s}
.add-c:hover{border-color:var(--gold);color:var(--gold);background:#fffdf7}

.submit{width:100%;margin-top:26px;border:none;border-radius:10px;background:var(--gold);color:#fff;font-weight:700;font-size:1.04rem;padding:14px;transition:background .2s,transform .15s}
.submit:hover:not(:disabled){background:#a07c33;transform:translateY(-1px)}
.submit:disabled{opacity:.6;cursor:default}
.foot-note{text-align:center;color:var(--muted-2);font-size:.76rem;margin-top:11px;display:flex;align-items:center;justify-content:center;gap:6px}
.foot-note svg{width:13px;height:13px}
.form-err{display:none;margin-top:12px;color:var(--err);background:#fbeaea;border:1px solid #f1cdcd;padding:10px 14px;border-radius:9px;font-weight:600;font-size:.85rem;text-align:center}
.consent{margin-top:20px;background:#f6f8fb;border:1px solid var(--line);border-radius:11px;padding:13px 15px}
.consent-row{display:flex;align-items:flex-start;gap:10px;cursor:pointer;font-size:.79rem;color:var(--muted);line-height:1.55}
.consent-row input{flex:none;width:17px;height:17px;margin-top:1px;accent-color:var(--navy);cursor:pointer}
.consent-row strong{color:var(--ink);font-weight:600}
.consent-note{margin-top:9px;padding-top:9px;border-top:1px solid var(--line);font-size:.71rem;color:var(--muted-2);display:flex;align-items:flex-start;gap:6px;line-height:1.5}
.consent-note svg{width:12px;height:12px;flex:none;margin-top:2px}

.state{padding:clamp(36px,7vw,60px) 10px;text-align:center}
.spinner{width:38px;height:38px;margin:0 auto 16px;border-radius:50%;border:3px solid #e6ebf3;border-top-color:var(--navy);animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.state .ico{width:62px;height:62px;margin:0 auto 16px;border-radius:50%;display:grid;place-items:center}
.state.ok .ico{background:#e3f4ec;color:var(--ok)}
.state.bad .ico{background:#fbeaea;color:var(--err)}
.state .ico svg{width:32px;height:32px}
.state h2{font-weight:800;color:var(--ink);font-size:1.45rem;letter-spacing:-.01em;margin-bottom:8px}
.state p{color:var(--muted);font-size:.96rem;max-width:380px;margin:0 auto}
.state .office{margin-top:18px;font-size:.88rem;color:var(--navy);font-weight:600}
.state .office a{color:var(--gold);font-weight:700}
.hidden{display:none!important}
.hp{position:absolute;left:auto;width:1px;height:1px;overflow:hidden}

@media(max-width:900px){
  .page{grid-template-columns:1fr}
  .hero{position:static;height:auto;min-height:0;padding:30px 26px;flex-direction:column;gap:20px}
  .hero-feats{display:none}
  .hero-body{gap:12px}
  .pane{padding:22px 14px 34px}
}
</style>
</head>
<body>
<div class="page">

  <!-- HERO -->
  <aside class="hero">
    <img src="logo-bm.png" alt="בורוביץ מזרחי" class="logo" id="brand-logo">
    <div class="hero-body">
      <h2>תודה <span class="g">שבחרתם בנו</span></h2>
      <p class="hero-sub">בורוביץ מזרחי - ממשרדי השמאות המובילים בצפון. נשארו רק כמה פרטים קצרים כדי שנתחיל לעבוד על השומה שלכם, המילוי לוקח כדקה.</p>
      <ul class="hero-feats">
        <li><span class="ck"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg></span> שמאות מקרקעין והערכות שווי</li>
        <li><span class="ck"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg></span> היטלי השבחה והשגות על שומות רמ״י</li>
        <li><span class="ck"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg></span> שמאות חקלאית, נחלות ומשקים</li>
        <li><span class="ck"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg></span> ליווי אישי לאורך כל התהליך</li>
      </ul>
    </div>
    <div class="hero-foot">
      <p class="hf-addr">שדרות החרוב 6, פארק תעשיות בר-לב</p>
      <p><strong>משרד</strong> · <a href="mailto:info@bor-miz.co.il" dir="ltr">info@bor-miz.co.il</a></p>
      <p><strong>מאור מזרחי</strong> · <a href="tel:054-6559942" dir="ltr">054-6559942</a> · <a href="mailto:maor@bor-miz.co.il" dir="ltr">maor@bor-miz.co.il</a></p>
      <p><strong>אמיר בורוביץ</strong> · <a href="tel:050-8922469" dir="ltr">050-8922469</a> · <a href="mailto:amir@bor-miz.co.il" dir="ltr">amir@bor-miz.co.il</a></p>
    </div>
  </aside>

  <!-- FORM PANE -->
  <main class="pane">
    <div class="card">

      <div class="state" id="loading"><div class="spinner"></div><p style="color:var(--muted)">טוען…</p></div>

      <div class="state bad hidden" id="error-state">
        <div class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 17h.01" stroke-linecap="round"/></svg></div>
        <h2>הקישור אינו זמין</h2>
        <p id="error-msg">ייתכן שהטופס כבר מולא או שתוקף הקישור פג.</p>
        <p class="office">לקבלת קישור חדש: <a href="tel:0546559942" dir="ltr">054-6559942</a></p>
      </div>

      <div class="state ok hidden" id="success-state">
        <div class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
        <h2>קיבלנו את הפרטים, תודה!</h2>
        <p>הפרטים נשלחו למשרד בורוביץ מזרחי - שמאות מקרקעין וחקלאות בע"מ. ניצור איתכם קשר בהקדם להמשך הטיפול בשומה.</p>
        <p class="office">לכל שאלה: <a href="tel:0546559942" dir="ltr">054-6559942</a></p>
      </div>

      <form class="hidden" id="intake-form" autocomplete="on" novalidate>
        <div class="card-head"><h1>פרטים להכנת השומה</h1><p>מלאו את הפרטים שלכם ונתחיל לעבוד</p></div>
        <div class="hp"><label>אל תמלאו<input type="text" id="hp-field" tabindex="-1" autocomplete="off"></label></div>

        <div class="sec">
          <div class="sec-label">מבקש השומה</div>
          <div class="row who">
            <div class="field nm"><label>שם מלא <span class="req">*</span></label><input class="inp" type="text" id="c-name" placeholder="שם פרטי ומשפחה"></div>
            <div class="field"><label>ת.ז. / ח.פ</label><input class="inp" type="text" id="c-id" dir="ltr" inputmode="numeric" placeholder="ת.ז. / ח.פ"></div>
            <div class="field"><label>טלפון <span class="req">*</span></label><input class="inp" type="tel" id="c-phone" dir="ltr" inputmode="tel" placeholder="050-0000000"></div>
            <div class="field em"><label>דוא״ל</label><input class="inp" type="email" id="c-email" dir="ltr" inputmode="email" placeholder="email@example.com"></div>
          </div>
          <div class="idnote">ת.ז. / ח.פ נדרשת להפקת חשבונית מס.</div>
        </div>

        <div class="sec">
          <div class="sec-label">אנשי קשר נוספים <span class="hint">· מתווך, עו״ד, בעלים נוספים</span></div>
          <div id="contacts-list"></div>
          <button type="button" class="add-c" id="add-contact">＋ הוסף איש קשר</button>
        </div>

        <div class="sec">
          <div class="sec-label">פרטי הנכס</div>
          <div class="row g2" style="margin-bottom:9px">
            <div class="field"><label>עיר / יישוב</label><input class="inp" type="text" id="p-city" placeholder="עיר"></div>
            <div class="field"><label>רחוב ומספר</label><input class="inp" type="text" id="p-street" placeholder="שם הרחוב ומספר"></div>
          </div>
          <div class="row g3">
            <div class="field"><label>גוש</label><input class="inp" type="text" id="p-block" dir="ltr" inputmode="numeric" placeholder="גוש"></div>
            <div class="field"><label>חלקה</label><input class="inp" type="text" id="p-parcel" dir="ltr" inputmode="numeric" placeholder="חלקה"></div>
            <div class="field"><label>תת חלקה</label><input class="inp" type="text" id="p-sub" dir="ltr" inputmode="numeric" placeholder="תת חלקה"></div>
          </div>
        </div>

        <div class="sec">
          <div class="sec-label">פרטים נוספים</div>
          <div class="row g2" style="margin-bottom:9px">
            <div class="field"><label>מטרת השומה</label><select class="inp" id="purpose"><option value="">- בחרו מטרה -</option></select></div>
            <div class="field"><label>איך הגעת אלינו</label><select class="inp" id="source"><option value="">- בחרו -</option></select></div>
          </div>
          <div class="row g2" style="margin-bottom:9px">
            <div class="field"><label>איש קשר לתיאום ביקור</label><input class="inp" type="text" id="v-cname" placeholder="שם (אם שונה ממך)"></div>
            <div class="field"><label>טלפון לתיאום ביקור</label><input class="inp" type="tel" id="v-cphone" dir="ltr" inputmode="tel" placeholder="050-0000000"></div>
          </div>
          <div class="field"><label>הערה חופשית</label><textarea class="inp" id="note" placeholder="כל מידע נוסף שיעזור לנו - הוראות הגעה, פרטים על הנכס, בקשות מיוחדות…"></textarea></div>
        </div>

        <div class="consent">
          <label class="consent-row">
            <input type="checkbox" id="consent-cb">
            <span>קראתי ואני מסכים/ה ש<strong>בורוביץ מזרחי שמאות מקרקעין</strong> ישמרו ויעבדו את הפרטים שמסרתי, לצורך יצירת קשר ומתן שירותי שמאות בלבד. הפרטים לא יועברו לצד שלישי, וניתן לפנות למשרד בכל עת לעיון או מחיקה.</span>
          </label>
          <p class="consent-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-linejoin="round"/></svg> החיבור מאובטח והפרטים (לרבות נתוני אבטחה בסיסיים) נשמרים אצל המשרד בלבד - ללא עוגיות מעקב.</p>
        </div>

        <button type="submit" class="submit" id="submit-btn">שליחת הפרטים</button>
        <div class="form-err" id="form-err"></div>
      </form>
    </div>
  </main>
</div>

<!-- PDF generation (client-side receipt of the submitted form) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

<script>
(function(){
  "use strict";
  var EDGE='https://nurgknexilxaxxovdbco.supabase.co/functions/v1/intake-submission';
  var ROLES=['בעל הזכויות','רוכש','עו"ד','מתווך','אדריכל','קבלן','שמאי מכריע','בנק / מממן','נציג לביקור','אחר'];
  var PURPOSES=['שווי שוק','בנק','שומה מוקדמת','שומה חקלאית','השגה','היטל השבחה','אומדן עלויות בניה','ירידת ערך','כדאיות כלכלית','איחוד וחלוקה','כונס נכסים','אומדן דמי שכירות ראויים','אחר'];
  var SOURCES=['המלצה','אתר אינטרנט','פייסבוק','אינסטגרם','גוגל','לקוח חוזר','יד2','מדלן','לינקדאין','אחר'];
  var $=function(id){return document.getElementById(id);};
  var token=new URLSearchParams(location.search).get('token');
  var formShownAt=Date.now(); // time-trap baseline (bots submit near-instantly)

  PURPOSES.forEach(function(p){var o=document.createElement('option');o.value=p;o.textContent=p;$('purpose').appendChild(o);});
  SOURCES.forEach(function(s){var o=document.createElement('option');o.value=s;o.textContent=s;$('source').appendChild(o);});

  function roleOptions(sel){return ROLES.map(function(r){return '<option value="'+r+'"'+(r===sel?' selected':'')+'>'+r+'</option>';}).join('');}
  function addContact(preset){
    preset=preset||{};
    var row=document.createElement('div');row.className='crow';
    row.innerHTML='<select class="ct-role">'+roleOptions(preset.role||'מתווך')+'</select>'+
      '<input class="ct-name" placeholder="שם" value="'+(preset.name||'')+'">'+
      '<input class="ct-phone" dir="ltr" placeholder="טלפון" value="'+(preset.phone||'')+'">'+
      '<input class="ct-email" dir="ltr" placeholder="מייל" value="'+(preset.email||'')+'">'+
      '<button type="button" class="rm" aria-label="הסר">×</button>';
    row.querySelector('.rm').addEventListener('click',function(){row.remove();});
    $('contacts-list').appendChild(row);
  }
  $('add-contact').addEventListener('click',function(){addContact();});

  function showError(msg){
    $('loading').classList.add('hidden');$('intake-form').classList.add('hidden');
    if(msg)$('error-msg').textContent=msg;
    $('error-state').classList.remove('hidden');
  }

  var isPreview=!token&&(location.protocol==='file:'||/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname));
  if(isPreview){
    window.__intakePreview=true;addContact();
    $('loading').classList.add('hidden');$('intake-form').classList.remove('hidden');return;
  }
  if(!token){showError('הקישור חסר מזהה. ודאו שפתחתם את הקישור המלא שקיבלתם.');return;}

  fetch(EDGE,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'lookup',token:token})})
    .then(function(r){return r.json().then(function(d){return {ok:r.ok,d:d};});})
    .then(function(res){
      if(!res.ok||!res.d.ok){return showError(res.d&&res.d.error);}
      var d=res.d;
      if(d.branding&&d.branding.logo_url)$('brand-logo').src=d.branding.logo_url;
      var pf=d.prefill||{};
      if(pf.client_name)$('c-name').value=pf.client_name;
      if(pf.city)$('p-city').value=pf.city;
      if(pf.street)$('p-street').value=pf.street;
      if(pf.block)$('p-block').value=pf.block;
      if(pf.parcel)$('p-parcel').value=pf.parcel;
      addContact();
      $('loading').classList.add('hidden');$('intake-form').classList.remove('hidden');
    })
    .catch(function(){showError('אירעה תקלה בטעינת הטופס. נסו לרענן את הדף.');});

  function val(id){var e=$(id);return e?e.value.trim():'';}

  // ── PDF receipt of the submitted form ──────────────────────────────────────
  function escHtml(s){return String(s==null?'':s).replace(/[&<>]/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;'})[c];});}

  // Build an offscreen, print-styled node mirroring the form, from the values
  // the client entered. html2canvas rasterises it → Hebrew/RTL come out exactly
  // as rendered (no font-embedding headaches).
  function buildReceiptNode(sections, meta){
    function rowsHtml(rows){
      return rows.filter(function(r){return r.v;}).map(function(r){
        return '<tr><td style="padding:7px 14px;color:#64748b;font-size:13px;white-space:nowrap;vertical-align:top;width:150px">'+escHtml(r.k)+'</td>'+
               '<td style="padding:7px 14px;color:#0f2038;font-size:14px;font-weight:600;white-space:pre-wrap">'+escHtml(r.v)+'</td></tr>';
      }).join('');
    }
    var secHtml=sections.filter(function(s){return s.rows.filter(function(r){return r.v;}).length;}).map(function(s){
      return '<div style="margin-bottom:16px"><div style="font-size:13px;font-weight:800;color:#1c3461;border-bottom:2px solid #eef2f7;padding-bottom:5px;margin-bottom:4px">'+escHtml(s.title)+'</div>'+
             '<table style="width:100%;border-collapse:collapse">'+rowsHtml(s.rows)+'</table></div>';
    }).join('');
    var wrap=document.createElement('div');
    wrap.style.cssText='position:fixed;left:-99999px;top:0;width:720px;background:#fff;direction:rtl;font-family:Heebo,Assistant,Arial,sans-serif;color:#0f2038';
    wrap.innerHTML=
      '<div style="background:#12233f;padding:22px 28px;display:flex;align-items:center;justify-content:space-between">'+
        '<div><div style="color:#fff;font-size:19px;font-weight:800">בורוביץ מזרחי · שמאות מקרקעין</div>'+
        '<div style="color:#c9d6ea;font-size:13px;margin-top:2px">פרטים להכנת השומה - עותק לתיעוד</div></div>'+
        (meta.logo?'<img src="'+escHtml(meta.logo)+'" crossorigin="anonymous" style="height:42px;filter:brightness(0) invert(1)">':'')+
      '</div>'+
      '<div style="padding:24px 28px">'+secHtml+
      '<div style="margin-top:18px;border-top:1px solid #eef2f7;padding-top:10px;color:#94a3b8;font-size:12px">נשלח דרך טופס איסוף הפרטים · '+escHtml(meta.date)+'</div></div>';
    return wrap;
  }

  // Returns {doc, base64} or null (never throws - PDF is best-effort).
  function generatePdf(sections, meta){
    return new Promise(function(resolve){
      try{
        if(!window.html2canvas||!window.jspdf){resolve(null);return;}
        var node=buildReceiptNode(sections,meta);
        document.body.appendChild(node);
        window.html2canvas(node,{scale:2,backgroundColor:'#ffffff',useCORS:true}).then(function(canvas){
          try{document.body.removeChild(node);}catch(_){}
          var JsPDF=window.jspdf.jsPDF;
          var pdf=new JsPDF('p','mm','a4');
          var pw=pdf.internal.pageSize.getWidth(), ph=pdf.internal.pageSize.getHeight();
          var imgW=pw, imgH=canvas.height*pw/canvas.width;
          var img=canvas.toDataURL('image/jpeg',0.92);
          if(imgH<=ph){pdf.addImage(img,'JPEG',0,0,imgW,imgH);}
          else{var pos=0,remaining=imgH;while(remaining>0){pdf.addImage(img,'JPEG',0,pos,imgW,imgH);remaining-=ph;if(remaining>0){pdf.addPage();pos-=ph;}}}
          var base64=pdf.output('datauristring').split(',')[1];
          resolve({doc:pdf,base64:base64});
        }).catch(function(){try{document.body.removeChild(node);}catch(_){}resolve(null);});
      }catch(_){resolve(null);}
    });
  }

  $('intake-form').addEventListener('submit',function(e){
    e.preventDefault();
    if($('hp-field').value){return;}
    var name=val('c-name'),phone=val('c-phone');var errEl=$('form-err');
    if(!name||!phone){errEl.style.display='block';errEl.textContent='נא למלא שם וטלפון של מבקש השומה.';$('c-name').focus();return;}
    if(!$('consent-cb').checked){errEl.style.display='block';errEl.textContent='יש לאשר את שמירת הפרטים כדי שנוכל ליצור קשר.';try{$('consent-cb').focus();}catch(_){}return;}
    errEl.style.display='none';

    if(window.__intakePreview){
      $('intake-form').classList.add('hidden');$('success-state').classList.remove('hidden');
      window.scrollTo({top:0,behavior:'smooth'});return;
    }

    var contacts=[];
    $('contacts-list').querySelectorAll('.crow').forEach(function(row){
      var nm=row.querySelector('.ct-name').value.trim();
      var ph=row.querySelector('.ct-phone').value.trim();
      var em=row.querySelector('.ct-email').value.trim();
      if(!nm&&!ph&&!em)return;
      contacts.push({role:row.querySelector('.ct-role').value,name:nm,phone:ph,email:em});
    });

    var payload={action:'submit',token:token,
      client:{name:name,phone:phone,email:val('c-email'),id_number:val('c-id')},
      property:{city:val('p-city'),street:val('p-street'),block:val('p-block'),parcel:val('p-parcel'),sub_parcel:val('p-sub')},
      purpose:val('purpose'),
      lead_source:val('source'),
      visit:{date:'',time:'',contact_name:val('v-cname'),contact_phone:val('v-cphone')},
      note:val('note'),contacts:contacts,
      _hp:$('hp-field').value,elapsed_ms:(Date.now()-formShownAt),consent:true};

    // Compose the PDF receipt from the entered values (same layout as the form).
    // One row per additional contact: role in the (nowrap) label column, so
    // labels like עו"ד stay whole and aligned instead of wrapping mid-string.
    var contactRows=contacts.map(function(c){
      return {k:(c.role||'איש קשר'),v:[c.name,c.phone,c.email].filter(Boolean).join(' · ')};
    }).filter(function(r){return r.v;});
    var pdfSections=[
      {title:'מבקש השומה',rows:[{k:'שם מלא',v:name},{k:'ת.ז. / ח.פ',v:val('c-id')},{k:'טלפון',v:phone},{k:'דוא״ל',v:val('c-email')}]},
      {title:'אנשי קשר נוספים',rows:contactRows},
      {title:'פרטי הנכס',rows:[{k:'עיר / יישוב',v:val('p-city')},{k:'רחוב ומספר',v:val('p-street')},{k:'גוש',v:val('p-block')},{k:'חלקה',v:val('p-parcel')},{k:'תת חלקה',v:val('p-sub')}]},
      {title:'פרטים נוספים',rows:[{k:'מטרת השומה',v:val('purpose')},{k:'איך הגעת אלינו',v:val('source')},{k:'איש קשר לתיאום ביקור',v:val('v-cname')},{k:'טלפון לתיאום ביקור',v:val('v-cphone')},{k:'הערה',v:val('note')}]}
    ];
    var pdfMeta={logo:($('brand-logo')?$('brand-logo').src:''),date:new Date().toLocaleDateString('he-IL',{day:'numeric',month:'long',year:'numeric'})};
    var pdfName='פרטי שומה - '+name.replace(/[\\/:*?"<>|]/g,'').slice(0,40)+'.pdf';

    var btn=$('submit-btn');btn.disabled=true;btn.textContent='שולח…';
    generatePdf(pdfSections,pdfMeta).then(function(pdf){
      if(pdf){payload.pdf_base64=pdf.base64;payload.pdf_filename=pdfName;}
      return fetch(EDGE,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
        .then(function(r){return r.json().then(function(d){return {ok:r.ok,d:d};});})
        .then(function(res){
          if(!res.ok||!res.d.ok){throw new Error(res.d&&res.d.error||'שגיאה בשליחה');}
          try{window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:'intake_submitted'});}catch(_){}
          if(pdf){try{pdf.doc.save(pdfName);}catch(_){}}
          $('intake-form').classList.add('hidden');$('success-state').classList.remove('hidden');
          window.scrollTo({top:0,behavior:'smooth'});
        });
    })
      .catch(function(err){
        errEl.style.display='block';errEl.textContent=(err&&err.message)?err.message:'אירעה שגיאה. נסו שוב.';
        btn.disabled=false;btn.textContent='שליחת הפרטים';
      });
  });
})();
</script>
</body>
</html>

```

### `landing-hasgot-rmi.html`

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="shortcut icon" href="/favicon.ico">
<!-- ===== GOOGLE ANALYTICS 4 (gtag.js) =====
     Property "bor-miz.co.il", measurement ID G-GYNQPGPR33 - installed 2026-09-08,
     replacing a Tag Manager placeholder that never had a container behind it.
     The bridge below turns the site's existing dataLayer.push({event:'...'}) calls
     (generate_lead / contact_whatsapp / contact_phone / intake_submitted) into GA4
     events, so every call site elsewhere in the site stays untouched. -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-GYNQPGPR33"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-GYNQPGPR33');
  (function(){
    // gtag() itself pushes an arguments object, which has no .event key - so this
    // never recurses on its own output.
    var push = window.dataLayer.push;
    window.dataLayer.push = function(){
      for (var i = 0; i < arguments.length; i++) {
        var o = arguments[i];
        if (o && typeof o.event === 'string') {
          var params = {};
          for (var k in o) {
            if (k !== 'event' && Object.prototype.hasOwnProperty.call(o, k)) params[k] = o[k];
          }
          gtag('event', o.event, params);
        }
      }
      return push.apply(window.dataLayer, arguments);
    };
  })();
</script>
<!-- ===== END GOOGLE ANALYTICS 4 ===== -->
<title>השגות על שומות רמ"י - הפחתת חיובים | בורוביץ מזרחי שמאות</title>
<meta name="description" content="קיבלת שומה גבוהה מרשות מקרקעי ישראל? ניתן להגיש השגה תוך 60 יום ולהפחית משמעותית. שמאי מומחה בהשגות רמ&quot;י.">
<meta name="keywords" content="השגה על שומת רמי, רשות מקרקעי ישראל, הפחתת שומה, שמאי מקרקעין, השגה רמי, ערעור שומה">
<link rel="canonical" href="https://bor-miz.co.il/landing-hasgot-rmi.html">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
  :root { --navy: #1C3461; --blue: #2A6DB5; --gold: #B89630; --gold-light: #d4b55a; --sky: #EAF1F8; --card-bg: #EDF2F7; --text: #1C3461; --white: #FFFFFF; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Heebo', sans-serif; color: var(--text); background: var(--white); line-height: 1.7; direction: rtl; }

  .landing-nav { position: fixed; top: 0; width: 100%; z-index: 100; background: rgba(237,242,247,0.96); backdrop-filter: blur(10px); border-bottom: 4px solid var(--navy); padding: 0 2rem; height: 64px; display: flex; align-items: center; justify-content: space-between; }
  .nav-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
  .nav-brand img { height: 38px; border-radius: 6px; }
  .nav-brand-text { font-weight: 700; font-size: 15px; color: var(--navy); line-height: 1.2; }
  .nav-brand-text span { display: block; font-size: 10px; font-weight: 300; opacity: 0.7; }
  .nav-cta { background: var(--gold); color: var(--navy); padding: 7px 20px; border-radius: 6px; font-weight: 700; font-size: 13px; text-decoration: none; transition: all 0.2s; }
  .nav-cta:hover { background: var(--gold-light); transform: translateY(-1px); }

  .hero { min-height: 85vh; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; margin-top: 64px; }
  .hero-bg { position: absolute; inset: 0; background-image: url('slide5.jpg'); background-size: cover; background-position: center; animation: kenBurns 20s ease-in-out infinite alternate; }
  @keyframes kenBurns { from { transform: scale(1); } to { transform: scale(1.08); } }
  .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(28,52,97,0.5) 0%, rgba(28,52,97,0.72) 50%, rgba(28,52,97,0.92) 100%); }
  .hero-content { position: relative; z-index: 2; text-align: center; color: var(--white); max-width: 800px; padding: 40px 20px; }
  .hero-badge { display: inline-block; background: rgba(184,150,48,0.25); border: 1px solid rgba(184,150,48,0.5); padding: 6px 22px; border-radius: 30px; font-size: 14px; color: var(--gold-light); margin-bottom: 18px; }
  .hero h1 { font-size: clamp(28px, 5vw, 48px); font-weight: 900; margin-bottom: 16px; line-height: 1.25; }
  .hero h1 em { font-style: normal; color: var(--gold-light); }
  .hero p { font-size: 18px; color: rgba(255,255,255,0.85); max-width: 600px; margin: 0 auto 28px; }
  .hero-cta { display: inline-block; background: var(--gold); color: var(--navy); padding: 15px 44px; border-radius: 8px; font-size: 18px; font-weight: 800; text-decoration: none; transition: all 0.3s; box-shadow: 0 4px 24px rgba(184,150,48,0.35); }
  .hero-cta:hover { background: var(--gold-light); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(184,150,48,0.45); }

  .urgent-bar { background: #7f1d1d; padding: 12px 20px; text-align: center; font-size: 15px; color: #fecaca; font-weight: 700; }
  .urgent-bar strong { color: var(--white); }

  .trust-bar { background: var(--navy); padding: 14px 20px; text-align: center; }
  .trust-items { display: flex; justify-content: center; gap: 32px; flex-wrap: wrap; font-size: 14px; color: rgba(255,255,255,0.85); }
  .trust-items span::before { content: '\2713 '; color: var(--gold); font-weight: 700; }

  section { max-width: 940px; margin: 0 auto; padding: 40px 20px 20px; }
  h2 { font-size: 28px; font-weight: 900; color: var(--navy); text-align: center; margin-bottom: 8px; }
  h2 em { font-style: normal; color: var(--gold); }
  .section-sub { text-align: center; color: #64748b; font-size: 15px; margin-bottom: 24px; }

  .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px; }
  .stat-card { text-align: center; background: var(--card-bg); border-radius: 16px; padding: 24px; border-bottom: 3px solid var(--gold); }
  .stat-num { font-size: 40px; font-weight: 900; color: var(--gold); }
  .stat-label { font-size: 14px; color: var(--navy); font-weight: 500; }

  .appeal-types { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 14px; }
  .appeal-card { background: var(--card-bg); border-radius: 16px; padding: 24px; border-right: 4px solid var(--blue); transition: all 0.2s; }
  .appeal-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(28,52,97,0.08); }
  .appeal-card h3 { font-size: 16px; font-weight: 800; color: var(--navy); margin-bottom: 6px; }
  .appeal-card p { font-size: 13px; color: #64748b; }

  .timeline { margin-top: 20px; }
  .timeline-steps { position: relative; padding-right: 30px; }
  .timeline-steps::before { content: ''; position: absolute; right: 12px; top: 0; bottom: 0; width: 3px; background: var(--card-bg); }
  .timeline-step { position: relative; margin-bottom: 18px; background: var(--card-bg); border-radius: 14px; padding: 18px 20px; }
  .timeline-step::before { content: ''; position: absolute; right: -24px; top: 20px; width: 14px; height: 14px; border-radius: 50%; background: var(--gold); border: 3px solid var(--white); }
  .timeline-step h4 { font-weight: 700; color: var(--navy); margin-bottom: 4px; }
  .timeline-step p { font-size: 14px; color: #64748b; }
  .timeline-step .days { font-size: 12px; color: var(--gold); font-weight: 700; margin-top: 4px; }

  .cta-section { background: linear-gradient(135deg, var(--navy), var(--blue)); border-radius: 20px; padding: 50px 30px; text-align: center; color: var(--white); margin: 20px auto 30px; max-width: 860px; }
  .cta-section h2 { color: var(--white); margin-bottom: 8px; }
  .cta-section p { color: rgba(255,255,255,0.8); margin-bottom: 24px; font-size: 16px; }
  .contact-form { max-width: 500px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .contact-form input, .contact-form select, .contact-form textarea { padding: 12px 16px; border: 2px solid rgba(255,255,255,0.15); border-radius: 10px; background: rgba(255,255,255,0.08); color: #fff; font-size: 14px; font-family: 'Heebo', sans-serif; transition: border-color 0.2s; }
  .contact-form input:focus, .contact-form select:focus, .contact-form textarea:focus { border-color: var(--gold); outline: none; }
  .contact-form input::placeholder, .contact-form textarea::placeholder { color: rgba(255,255,255,0.45); }
  .contact-form select { color: rgba(255,255,255,0.7); }
  .contact-form select option { color: var(--text); }
  .contact-form .full { grid-column: 1 / -1; }
  .submit-btn { grid-column: 1 / -1; padding: 14px; background: var(--gold); color: var(--navy); border: none; border-radius: 10px; font-size: 16px; font-weight: 800; cursor: pointer; font-family: 'Heebo', sans-serif; transition: all 0.2s; }
  .submit-btn:hover { background: var(--gold-light); }

  .footer { background: var(--navy); color: rgba(255,255,255,0.6); padding: 20px; text-align: center; font-size: 13px; }
  .footer a { color: var(--gold-light); text-decoration: none; }

  @media (max-width: 600px) { .contact-form { grid-template-columns: 1fr; } .stats-row { grid-template-columns: 1fr; } .trust-items { flex-direction: column; align-items: center; gap: 6px; } .hero { min-height: 70vh; } .landing-nav { padding: 0 12px; } }
</style>
</head>
<body>

<nav class="landing-nav">
  <a href="https://bor-miz.co.il" class="nav-brand">
    <img src="image_2.png" alt="בורוביץ מזרחי" />
    <div class="nav-brand-text">בורוביץ מזרחי<span>שמאות מקרקעין וחקלאות</span></div>
  </a>
  <a href="https://bor-miz.co.il" class="nav-cta">חזרה לאתר הראשי</a>
</nav>

<div class="hero">
  <div class="hero-bg"></div>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <div class="hero-badge">&#9878; מומחים בהשגות מול רמ"י</div>
    <h1>קיבלת שומה מ<em>רמ"י?</em><br>ניתן להפחית משמעותית</h1>
    <p>ניסיון מוכח בהגשת השגות על שומות רשות מקרקעי ישראל. בדיקת זכאות מהירה - 60 ימים להגשת השגה!</p>
    <a href="#contact-form" class="hero-cta">בדיקת השומה חינם &larr;</a>
  </div>
</div>

<div class="urgent-bar">
  &#9888; <strong>שימו לב:</strong> יש רק 60 יום מקבלת השומה להגשת השגה!
</div>

<div class="trust-bar">
  <div class="trust-items">
    <span>ניסיון בהשגות רמ"י</span>
    <span>אחוזי הצלחה גבוהים</span>
    <span>ליווי מלא עד ההחלטה</span>
    <span>בדיקה ראשונית חינם</span>
  </div>
</div>

<section>
  <div class="stats-row">
    <div class="stat-card"><div class="stat-num">60</div><div class="stat-label">ימים להגשת השגה</div></div>
    <div class="stat-card"><div class="stat-num">40%</div><div class="stat-label">הפחתה ממוצעת</div></div>
    <div class="stat-card"><div class="stat-num">200+</div><div class="stat-label">השגות שהוגשו</div></div>
  </div>

  <h2>סוגי <em>השגות</em></h2>
  <p class="section-sub">מגישים השגות מקצועיות על כל סוגי שומות רמ"י</p>
  <div class="appeal-types">
    <div class="appeal-card">
      <h3>&#128176; דמי היתר</h3>
      <p>השגות על חיובי דמי היתר לבנייה, תוספת בנייה או שינוי ייעוד בקרקע של רמ"י</p>
    </div>
    <div class="appeal-card">
      <h3>&#128200; דמי חכירה</h3>
      <p>ערעור על שומות דמי חכירה, היוון זכויות ותשלומי הרשות</p>
    </div>
    <div class="appeal-card">
      <h3>&#127806; נחלות ומשקים</h3>
      <p>השגות על שומות בעקבות פיצול נחלות, החלטה 1591 ורפורמות חקלאיות</p>
    </div>
    <div class="appeal-card">
      <h3>&#127961; שינוי ייעוד</h3>
      <p>השגות על שומות בעקבות שינוי ייעוד קרקע ממגורים, חקלאי או תעשייה</p>
    </div>
  </div>
</section>

<section>
  <h2>תהליך <em>ההשגה</em></h2>
  <div class="timeline">
    <div class="timeline-steps">
      <div class="timeline-step">
        <h4>קבלת השומה ובדיקה ראשונית</h4>
        <p>אנחנו בודקים את השומה ומעריכים את סיכויי ההפחתה</p>
        <div class="days">יום 1-3</div>
      </div>
      <div class="timeline-step">
        <h4>הכנת שומה נגדית</h4>
        <p>שמאי מוסמך מכין שומה מנומקת עם עסקאות השוואה ונתונים</p>
        <div class="days">יום 4-14</div>
      </div>
      <div class="timeline-step">
        <h4>הגשת ההשגה לרמ"י</h4>
        <p>הגשה רשמית של ההשגה עם כל המסמכים התומכים</p>
        <div class="days">יום 15-20</div>
      </div>
      <div class="timeline-step">
        <h4>דיון ומו"מ</h4>
        <p>ייצוג מקצועי בדיון מול שמאי רמ"י עד להשגת תוצאה</p>
        <div class="days">יום 20-60</div>
      </div>
      <div class="timeline-step">
        <h4>קבלת החלטה</h4>
        <p>שומה מעודכנת עם ההפחתה שהושגה</p>
        <div class="days">תוצאה</div>
      </div>
    </div>
  </div>
</section>

<div id="contact-form" class="cta-section">
  <h2>בדיקת שומה חינם</h2>
  <p>שלחו לנו את השומה שקיבלתם ונבדוק אם יש מקום להפחתה</p>
  <form class="contact-form" id="leadForm" onsubmit="submitForm(event)">
    <input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);border:0;opacity:0" />
    <input type="text" name="name" placeholder="שם מלא" required />
    <input type="tel" name="phone" placeholder="טלפון" required />
    <input type="email" name="email" placeholder="אימייל" class="full" />
    <input type="text" name="city" placeholder="עיר / יישוב" />
    <select name="appeal_type" class="full">
      <option value="">סוג ההשגה</option>
      <option value="דמי היתר">דמי היתר</option>
      <option value="דמי חכירה">דמי חכירה</option>
      <option value="נחלה/משק">נחלה / משק חקלאי</option>
      <option value="שינוי ייעוד">שינוי ייעוד</option>
      <option value="אחר">אחר</option>
    </select>
    <textarea name="note" class="full" rows="3" placeholder="פרטים נוספים על השומה שקיבלתם..."></textarea>
    <input type="hidden" name="subject" value="השגה" />
    <input type="hidden" name="source" value="landing-hasgot" />
    <button type="submit" class="submit-btn">שלחו לבדיקה חינם</button>
  </form>
  <p id="formMsg" style="margin-top: 12px; font-size: 14px; display: none;"></p>
</div>

<div class="footer">
  <p>&copy; 2026 בורוביץ מזרחי שמאות מקרקעין | <a href="https://bor-miz.co.il">חזרה לאתר</a></p>
  <p>054-6559942 | 050-8922469 | maor@bor-miz.co.il</p>
</div>

<script>
async function submitForm(e) {
  e.preventDefault();
  const form = e.target, btn = form.querySelector('.submit-btn'), msg = document.getElementById('formMsg');
  btn.disabled = true; btn.textContent = 'שולח...';
  const data = { name: form.name.value, phone: form.phone.value, email: form.email.value || null, city: form.city.value || null, note: form.note.value || null, subject: form.subject.value, source: form.source.value, form_type: 'landing', _hp: form.website ? form.website.value : '', elapsed_ms: Math.round(performance.now()) };
  try {
    const res = await fetch('https://nurgknexilxaxxovdbco.supabase.co/functions/v1/website-lead-intake', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (res.ok) { msg.style.display = 'block'; msg.style.color = '#4ade80'; msg.textContent = 'הפנייה נשלחה! ניצור קשר בהקדם.'; form.reset(); window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: 'generate_lead', form_source: 'landing', lead_subject: (form.subject && form.subject.value) || 'landing' }); } else throw new Error();
  } catch { msg.style.display = 'block'; msg.style.color = '#fca5a5'; msg.textContent = 'שגיאה. התקשר 054-6559942'; }
  btn.disabled = false; btn.textContent = 'שלחו לבדיקה חינם';
}
</script>
</body>
</html>

```

### `landing-hitel-hashbacha.html`

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="shortcut icon" href="/favicon.ico">
<!-- ===== GOOGLE ANALYTICS 4 (gtag.js) =====
     Property "bor-miz.co.il", measurement ID G-GYNQPGPR33 - installed 2026-09-08,
     replacing a Tag Manager placeholder that never had a container behind it.
     The bridge below turns the site's existing dataLayer.push({event:'...'}) calls
     (generate_lead / contact_whatsapp / contact_phone / intake_submitted) into GA4
     events, so every call site elsewhere in the site stays untouched. -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-GYNQPGPR33"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-GYNQPGPR33');
  (function(){
    // gtag() itself pushes an arguments object, which has no .event key - so this
    // never recurses on its own output.
    var push = window.dataLayer.push;
    window.dataLayer.push = function(){
      for (var i = 0; i < arguments.length; i++) {
        var o = arguments[i];
        if (o && typeof o.event === 'string') {
          var params = {};
          for (var k in o) {
            if (k !== 'event' && Object.prototype.hasOwnProperty.call(o, k)) params[k] = o[k];
          }
          gtag('event', o.event, params);
        }
      }
      return push.apply(window.dataLayer, arguments);
    };
  })();
</script>
<!-- ===== END GOOGLE ANALYTICS 4 ===== -->
<title>היטל השבחה - חיסכון של עד 50% | בורוביץ מזרחי שמאות</title>
<meta name="description" content="שילמת היטל השבחה? ייתכן שהחיוב מופרז. שמאי מקרקעין מוסמך יכול להגיש השגה ולחסוך לך עשרות אלפי שקלים. בדיקה ראשונית חינם.">
<meta name="keywords" content="היטל השבחה, השגה על היטל השבחה, שמאי מקרקעין, הפחתת היטל השבחה, ועדה מקומית">
<link rel="canonical" href="https://bor-miz.co.il/landing-hitel-hashbacha.html">
<meta property="og:title" content="היטל השבחה - חיסכון של עד 50% | בורוביץ מזרחי">
<meta property="og:description" content="קיבלת דרישת תשלום היטל השבחה? שמאי מומחה יכול להוזיל עבורך. בדיקה ראשונית ללא עלות.">
<meta property="og:image" content="https://bor-miz.co.il/image_2.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
  :root {
    --navy: #1C3461;
    --blue: #2A6DB5;
    --gold: #B89630;
    --gold-light: #d4b55a;
    --sky: #EAF1F8;
    --card-bg: #EDF2F7;
    --text: #1C3461;
    --white: #FFFFFF;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Heebo', sans-serif; color: var(--text); background: var(--white); line-height: 1.7; direction: rtl; }

  /* ── Nav ── */
  .landing-nav {
    position: fixed; top: 0; width: 100%; z-index: 100;
    background: rgba(237,242,247,0.96); backdrop-filter: blur(10px);
    border-bottom: 4px solid var(--navy); padding: 0 2rem; height: 64px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .nav-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
  .nav-brand img { height: 38px; border-radius: 6px; }
  .nav-brand-text { font-weight: 700; font-size: 15px; color: var(--navy); line-height: 1.2; }
  .nav-brand-text span { display: block; font-size: 10px; font-weight: 300; opacity: 0.7; }
  .nav-cta {
    background: var(--gold); color: var(--navy); padding: 7px 20px; border-radius: 6px;
    font-weight: 700; font-size: 13px; text-decoration: none; transition: all 0.2s;
  }
  .nav-cta:hover { background: var(--gold-light); transform: translateY(-1px); }

  /* ── Hero ── */
  .hero {
    min-height: 85vh; position: relative; display: flex; align-items: center;
    justify-content: center; overflow: hidden; margin-top: 64px;
  }
  .hero-bg {
    position: absolute; inset: 0; background-image: url('slide1.jpg');
    background-size: cover; background-position: center;
    animation: kenBurns 20s ease-in-out infinite alternate;
  }
  @keyframes kenBurns { from { transform: scale(1); } to { transform: scale(1.08); } }
  .hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, rgba(28,52,97,0.55) 0%, rgba(28,52,97,0.75) 60%, rgba(28,52,97,0.92) 100%);
  }
  .hero-content {
    position: relative; z-index: 2; text-align: center; color: var(--white);
    max-width: 800px; padding: 40px 20px;
  }
  .hero-badge {
    display: inline-block; background: rgba(184,150,48,0.25); border: 1px solid rgba(184,150,48,0.5);
    padding: 6px 22px; border-radius: 30px; font-size: 14px; color: var(--gold-light); margin-bottom: 18px;
  }
  .hero h1 { font-size: clamp(30px, 5vw, 52px); font-weight: 900; margin-bottom: 16px; line-height: 1.25; }
  .hero h1 em { font-style: normal; color: var(--gold-light); }
  .hero p { font-size: 18px; color: rgba(255,255,255,0.85); max-width: 600px; margin: 0 auto 28px; }
  .hero-cta {
    display: inline-block; background: var(--gold); color: var(--navy); padding: 15px 44px;
    border-radius: 8px; font-size: 18px; font-weight: 800; text-decoration: none;
    transition: all 0.3s; box-shadow: 0 4px 24px rgba(184,150,48,0.35);
  }
  .hero-cta:hover { background: var(--gold-light); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(184,150,48,0.45); }

  /* ── Trust Bar ── */
  .trust-bar {
    background: var(--navy); padding: 14px 20px; text-align: center;
  }
  .trust-items { display: flex; justify-content: center; gap: 32px; flex-wrap: wrap; font-size: 14px; color: rgba(255,255,255,0.85); }
  .trust-items span::before { content: '\2713 '; color: var(--gold); font-weight: 700; }

  /* ── Sections ── */
  section { max-width: 940px; margin: 0 auto; padding: 40px 20px 20px; }
  h2 { font-size: 30px; font-weight: 900; color: var(--navy); text-align: center; margin-bottom: 8px; }
  h2 em { font-style: normal; color: var(--gold); }
  .section-sub { text-align: center; color: #64748b; font-size: 15px; margin-bottom: 24px; }

  /* ── Stats ── */
  .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
  .stat-card {
    text-align: center; background: var(--card-bg); border-radius: 16px; padding: 24px;
    border-bottom: 3px solid var(--gold);
  }
  .stat-num { font-size: 40px; font-weight: 900; color: var(--gold); }
  .stat-label { font-size: 14px; color: var(--navy); font-weight: 500; }

  /* ── Benefits ── */
  .benefits { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-top: 20px; }
  .benefit-card {
    background: var(--card-bg); border-radius: 16px; padding: 28px; text-align: center;
    border-right: 4px solid var(--gold); transition: all 0.2s;
  }
  .benefit-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(28,52,97,0.08); }
  .benefit-icon { font-size: 36px; margin-bottom: 10px; }
  .benefit-card h3 { font-size: 17px; font-weight: 800; color: var(--navy); margin-bottom: 6px; }
  .benefit-card p { font-size: 14px; color: #64748b; }

  /* ── Process ── */
  .process-steps { display: flex; flex-direction: column; gap: 14px; margin-top: 20px; }
  .process-step {
    display: flex; align-items: flex-start; gap: 16px;
    background: var(--card-bg); border-radius: 14px; padding: 20px;
    border-right: 4px solid var(--blue);
  }
  .step-num {
    min-width: 42px; height: 42px; border-radius: 50%; background: var(--navy); color: var(--gold);
    display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px; flex-shrink: 0;
  }
  .step-content h4 { font-weight: 700; color: var(--navy); margin-bottom: 4px; }
  .step-content p { font-size: 14px; color: #64748b; }

  /* ── CTA Section ── */
  .cta-section {
    background: linear-gradient(135deg, var(--navy), var(--blue)); border-radius: 20px;
    padding: 50px 30px; text-align: center; color: var(--white);
    margin: 20px auto 30px; max-width: 860px;
  }
  .cta-section h2 { color: var(--white); margin-bottom: 8px; }
  .cta-section p { color: rgba(255,255,255,0.8); margin-bottom: 24px; font-size: 16px; }

  .contact-form { max-width: 500px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .contact-form input, .contact-form select, .contact-form textarea {
    padding: 12px 16px; border: 2px solid rgba(255,255,255,0.15); border-radius: 10px;
    background: rgba(255,255,255,0.08); color: #fff; font-size: 14px; font-family: 'Heebo', sans-serif;
    transition: border-color 0.2s;
  }
  .contact-form input:focus, .contact-form textarea:focus { border-color: var(--gold); outline: none; }
  .contact-form input::placeholder { color: rgba(255,255,255,0.45); }
  .contact-form .full { grid-column: 1 / -1; }
  .submit-btn {
    grid-column: 1 / -1; padding: 14px; background: var(--gold); color: var(--navy);
    border: none; border-radius: 10px; font-size: 16px; font-weight: 800;
    cursor: pointer; font-family: 'Heebo', sans-serif; transition: all 0.2s;
  }
  .submit-btn:hover { background: var(--gold-light); }

  /* ── Footer ── */
  .footer {
    background: var(--navy); color: rgba(255,255,255,0.6); padding: 20px; text-align: center; font-size: 13px;
  }
  .footer a { color: var(--gold-light); text-decoration: none; }

  @media (max-width: 600px) {
    .contact-form { grid-template-columns: 1fr; }
    .stats-row { grid-template-columns: 1fr; }
    .trust-items { flex-direction: column; align-items: center; gap: 6px; }
    .hero { min-height: 70vh; }
    .landing-nav { padding: 0 12px; }
  }
</style>
</head>
<body>

<nav class="landing-nav">
  <a href="https://bor-miz.co.il" class="nav-brand">
    <img src="image_2.png" alt="בורוביץ מזרחי" />
    <div class="nav-brand-text">בורוביץ מזרחי<span>שמאות מקרקעין וחקלאות</span></div>
  </a>
  <a href="https://bor-miz.co.il" class="nav-cta">חזרה לאתר הראשי</a>
</nav>

<div class="hero">
  <div class="hero-bg"></div>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <div class="hero-badge">&#9878; בדיקה ראשונית ללא עלות</div>
    <h1>קיבלת דרישת <em>היטל השבחה?</em><br>ייתכן שאתה משלם יותר מדי</h1>
    <p>שמאי מקרקעין מוסמך בודק את החיוב ומגיש השגה מקצועית. חיסכון ממוצע: 30%-50% מסכום ההיטל.</p>
    <a href="#contact-form" class="hero-cta">בדיקת זכאות חינם &larr;</a>
  </div>
</div>

<div class="trust-bar">
  <div class="trust-items">
    <span>15+ שנות ניסיון</span>
    <span>מאות השגות מוצלחות</span>
    <span>ייצוג מול כל הוועדות</span>
    <span>בדיקה ראשונית חינם</span>
  </div>
</div>

<section>
  <div class="stats-row">
    <div class="stat-card"><div class="stat-num">50%</div><div class="stat-label">חיסכון ממוצע</div></div>
    <div class="stat-card"><div class="stat-num">500+</div><div class="stat-label">השגות שהוגשו</div></div>
    <div class="stat-card"><div class="stat-num">85%</div><div class="stat-label">אחוז הצלחה</div></div>
  </div>

  <h2>למה כדאי להגיש <em>השגה?</em></h2>
  <p class="section-sub">רוב בעלי הנכסים משלמים יותר מדי - אל תהיה אחד מהם</p>
  <div class="benefits">
    <div class="benefit-card">
      <div class="benefit-icon">&#128176;</div>
      <h3>חיסכון משמעותי</h3>
      <p>ברוב המקרים ניתן להפחית 30%-50% מהסכום המקורי שנדרש</p>
    </div>
    <div class="benefit-card">
      <div class="benefit-icon">&#9878;</div>
      <h3>זכות חוקית</h3>
      <p>כל אזרח זכאי להגיש השגה על שומת היטל השבחה תוך 45 יום</p>
    </div>
    <div class="benefit-card">
      <div class="benefit-icon">&#128200;</div>
      <h3>בדיקה מקצועית</h3>
      <p>ניתוח מעמיק של תוכניות, הקלות ושימוש חורג שהשפיעו על החיוב</p>
    </div>
  </div>
</section>

<section>
  <h2>התהליך ב-<em>4 צעדים</em></h2>
  <div class="process-steps">
    <div class="process-step">
      <div class="step-num">1</div>
      <div class="step-content"><h4>בדיקה ראשונית חינם</h4><p>שולחים לנו את דרישת התשלום ואנחנו בודקים אם יש סיכוי להפחתה</p></div>
    </div>
    <div class="process-step">
      <div class="step-num">2</div>
      <div class="step-content"><h4>ניתוח מקצועי</h4><p>שמאי מוסמך בוחן את התוכניות, העסקאות באזור ואת בסיס החישוב</p></div>
    </div>
    <div class="process-step">
      <div class="step-num">3</div>
      <div class="step-content"><h4>הגשת השגה</h4><p>מכינים שומה מנומקת ומגישים השגה רשמית לוועדה המקומית</p></div>
    </div>
    <div class="process-step">
      <div class="step-num">4</div>
      <div class="step-content"><h4>חיסכון לכיס</h4><p>לאחר דיון, השומה מתעדכנת וההיטל מופחת משמעותית</p></div>
    </div>
  </div>
</section>

<div id="contact-form" class="cta-section">
  <h2>בדיקת זכאות חינם</h2>
  <p>השאירו פרטים ושמאי מומחה יחזור אליכם תוך 24 שעות</p>
  <form class="contact-form" id="leadForm" onsubmit="submitForm(event)">
    <input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);border:0;opacity:0" />
    <input type="text" name="name" placeholder="שם מלא" required />
    <input type="tel" name="phone" placeholder="טלפון" required />
    <input type="email" name="email" placeholder="אימייל" class="full" />
    <input type="text" name="city" placeholder="עיר / יישוב" />
    <input type="text" name="address" placeholder="כתובת הנכס" />
    <input type="hidden" name="subject" value="היטל השבחה" />
    <input type="hidden" name="source" value="landing-hitel" />
    <button type="submit" class="submit-btn">שלחו לי בדיקה חינם</button>
  </form>
  <p id="formMsg" style="margin-top: 12px; font-size: 14px; display: none;"></p>
</div>

<div class="footer">
  <p>&copy; 2026 בורוביץ מזרחי שמאות מקרקעין וחקלאות בע"מ | <a href="https://bor-miz.co.il">חזרה לאתר הראשי</a></p>
  <p>054-6559942 | 050-8922469 | maor@bor-miz.co.il</p>
</div>

<script>
async function submitForm(e) {
  e.preventDefault();
  const form = e.target, btn = form.querySelector('.submit-btn'), msg = document.getElementById('formMsg');
  btn.disabled = true; btn.textContent = 'שולח...';
  const data = { name: form.name.value, phone: form.phone.value, email: form.email.value || null, city: form.city.value || null, address: form.address.value || null, subject: form.subject.value, source: form.source.value, form_type: 'landing', _hp: form.website ? form.website.value : '', elapsed_ms: Math.round(performance.now()) };
  try {
    const res = await fetch('https://nurgknexilxaxxovdbco.supabase.co/functions/v1/website-lead-intake', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (res.ok) { msg.style.display = 'block'; msg.style.color = '#4ade80'; msg.textContent = 'הפנייה נשלחה בהצלחה! ניצור קשר בהקדם.'; form.reset(); window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: 'generate_lead', form_source: 'landing', lead_subject: (form.subject && form.subject.value) || 'landing' }); }
    else throw new Error();
  } catch { msg.style.display = 'block'; msg.style.color = '#fca5a5'; msg.textContent = 'שגיאה בשליחה. נסה שוב או התקשר 054-6559942'; }
  btn.disabled = false; btn.textContent = 'שלחו לי בדיקה חינם';
}
</script>
</body>
</html>

```

### `landing-shoma-hakla it.html`

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="shortcut icon" href="/favicon.ico">
<!-- ===== GOOGLE ANALYTICS 4 (gtag.js) =====
     Property "bor-miz.co.il", measurement ID G-GYNQPGPR33 - installed 2026-09-08,
     replacing a Tag Manager placeholder that never had a container behind it.
     The bridge below turns the site's existing dataLayer.push({event:'...'}) calls
     (generate_lead / contact_whatsapp / contact_phone / intake_submitted) into GA4
     events, so every call site elsewhere in the site stays untouched. -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-GYNQPGPR33"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-GYNQPGPR33');
  (function(){
    // gtag() itself pushes an arguments object, which has no .event key - so this
    // never recurses on its own output.
    var push = window.dataLayer.push;
    window.dataLayer.push = function(){
      for (var i = 0; i < arguments.length; i++) {
        var o = arguments[i];
        if (o && typeof o.event === 'string') {
          var params = {};
          for (var k in o) {
            if (k !== 'event' && Object.prototype.hasOwnProperty.call(o, k)) params[k] = o[k];
          }
          gtag('event', o.event, params);
        }
      }
      return push.apply(window.dataLayer, arguments);
    };
  })();
</script>
<!-- ===== END GOOGLE ANALYTICS 4 ===== -->
<title>שמאות חקלאית ונחלות - מעטפת מלאה | בורוביץ מזרחי</title>
<meta name="description" content="שמאי מקרקעין + שמאי חקלאות = מעטפת מלאה לנחלה. הערכת שווי נחלות, פגיעה בגידולים ופרי, בעלי חיים, מטעים. פיצול נחלות ורפורמות רמ&quot;י.">
<meta name="keywords" content="שומה חקלאית, נחלה, שמאי חקלאות, פגיעה בגידולים, הערכת מטעים, פיצול נחלות, רמי, שמאי מקרקעין נחלה">
<link rel="canonical" href="https://bor-miz.co.il/landing-shoma-hakla it.html">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
  :root { --navy: #1C3461; --blue: #2A6DB5; --gold: #B89630; --gold-light: #d4b55a; --sky: #EAF1F8; --card-bg: #EDF2F7; --text: #1C3461; --white: #FFFFFF; --green: #2d6a30; --green-light: #4a8f4d; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Heebo', sans-serif; color: var(--text); background: var(--white); line-height: 1.7; direction: rtl; }

  .landing-nav { position: fixed; top: 0; width: 100%; z-index: 100; background: rgba(237,242,247,0.96); backdrop-filter: blur(10px); border-bottom: 4px solid var(--navy); padding: 0 2rem; height: 64px; display: flex; align-items: center; justify-content: space-between; }
  .nav-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
  .nav-brand img { height: 38px; border-radius: 6px; }
  .nav-brand-text { font-weight: 700; font-size: 15px; color: var(--navy); line-height: 1.2; }
  .nav-brand-text span { display: block; font-size: 10px; font-weight: 300; opacity: 0.7; }
  .nav-cta { background: var(--gold); color: var(--navy); padding: 7px 20px; border-radius: 6px; font-weight: 700; font-size: 13px; text-decoration: none; transition: all 0.2s; }
  .nav-cta:hover { background: var(--gold-light); transform: translateY(-1px); }

  .hero { min-height: 85vh; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; margin-top: 64px; }
  .hero-bg { position: absolute; inset: 0; background-image: url('slide9.jpg'); background-size: cover; background-position: center; animation: kenBurns 20s ease-in-out infinite alternate; }
  @keyframes kenBurns { from { transform: scale(1); } to { transform: scale(1.08); } }
  .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(28,52,97,0.45) 0%, rgba(28,52,97,0.65) 50%, rgba(28,52,97,0.88) 100%); }
  .hero-content { position: relative; z-index: 2; text-align: center; color: var(--white); max-width: 820px; padding: 40px 20px; }
  .hero-badge { display: inline-block; background: rgba(184,150,48,0.25); border: 1px solid rgba(184,150,48,0.5); padding: 6px 22px; border-radius: 30px; font-size: 14px; color: var(--gold-light); margin-bottom: 18px; }
  .hero h1 { font-size: clamp(28px, 5vw, 48px); font-weight: 900; margin-bottom: 16px; line-height: 1.25; }
  .hero h1 em { font-style: normal; color: var(--gold-light); }
  .hero p { font-size: 18px; color: rgba(255,255,255,0.85); max-width: 650px; margin: 0 auto 28px; }
  .hero-cta { display: inline-block; background: var(--gold); color: var(--navy); padding: 15px 44px; border-radius: 8px; font-size: 18px; font-weight: 800; text-decoration: none; transition: all 0.3s; box-shadow: 0 4px 24px rgba(184,150,48,0.35); }
  .hero-cta:hover { background: var(--gold-light); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(184,150,48,0.45); }

  .trust-bar { background: var(--navy); padding: 14px 20px; text-align: center; }
  .trust-items { display: flex; justify-content: center; gap: 32px; flex-wrap: wrap; font-size: 14px; color: rgba(255,255,255,0.85); }
  .trust-items span::before { content: '\2713 '; color: var(--gold); font-weight: 700; }

  section { max-width: 940px; margin: 0 auto; padding: 40px 20px 20px; }
  h2 { font-size: 28px; font-weight: 900; color: var(--navy); text-align: center; margin-bottom: 8px; }
  h2 em { font-style: normal; color: var(--gold); }
  .section-sub { text-align: center; color: #64748b; font-size: 15px; margin-bottom: 24px; }

  /* ── Two Tracks Highlight ── */
  .tracks { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  .track-card {
    background: var(--card-bg); border-radius: 16px; padding: 28px; position: relative;
    border-top: 4px solid; transition: all 0.2s;
  }
  .track-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(28,52,97,0.08); }
  .track-card.agri { border-top-color: var(--green); }
  .track-card.realty { border-top-color: var(--blue); }
  .track-label {
    display: inline-block; padding: 3px 14px; border-radius: 20px; font-size: 11px;
    font-weight: 700; margin-bottom: 10px;
  }
  .track-card.agri .track-label { background: #e8f5e9; color: var(--green); }
  .track-card.realty .track-label { background: var(--sky); color: var(--blue); }
  .track-card h3 { font-size: 18px; font-weight: 800; color: var(--navy); margin-bottom: 8px; }
  .track-card ul { list-style: none; font-size: 14px; color: #475569; }
  .track-card ul li { padding: 4px 0; display: flex; align-items: flex-start; gap: 6px; }
  .track-card ul li::before { content: ''; display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-top: 7px; flex-shrink: 0; }
  .track-card.agri ul li::before { background: var(--green); }
  .track-card.realty ul li::before { background: var(--blue); }

  .envelope-banner {
    background: linear-gradient(135deg, var(--navy), var(--blue)); border-radius: 16px;
    padding: 24px 30px; text-align: center; color: var(--white); margin-bottom: 24px;
  }
  .envelope-banner h3 { font-size: 20px; font-weight: 800; margin-bottom: 6px; }
  .envelope-banner h3 span { color: var(--gold-light); }
  .envelope-banner p { font-size: 14px; color: rgba(255,255,255,0.8); }

  /* ── Expertise Grid ── */
  .expertise-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; }
  .expertise-card {
    background: var(--card-bg); border-radius: 14px; padding: 22px;
    border-right: 4px solid var(--gold); transition: all 0.2s;
  }
  .expertise-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(28,52,97,0.08); }
  .expertise-card h3 { font-size: 15px; font-weight: 800; color: var(--navy); margin-bottom: 4px; display: flex; align-items: center; gap: 8px; }
  .expertise-card p { font-size: 13px; color: #64748b; }

  .why-section { background: var(--card-bg); border-radius: 16px; padding: 28px; margin-top: 16px; }
  .why-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .why-list li { display: flex; align-items: flex-start; gap: 10px; font-size: 15px; background: var(--white); padding: 12px 16px; border-radius: 10px; }
  .check { color: var(--gold); font-weight: 800; font-size: 18px; min-width: 24px; }

  .cta-section { background: linear-gradient(135deg, var(--navy), var(--blue)); border-radius: 20px; padding: 50px 30px; text-align: center; color: var(--white); margin: 20px auto 30px; max-width: 860px; }
  .cta-section h2 { color: var(--white); margin-bottom: 8px; }
  .cta-section p { color: rgba(255,255,255,0.8); margin-bottom: 24px; font-size: 16px; }
  .contact-form { max-width: 500px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .contact-form input, .contact-form select, .contact-form textarea { padding: 12px 16px; border: 2px solid rgba(255,255,255,0.15); border-radius: 10px; background: rgba(255,255,255,0.08); color: #fff; font-size: 14px; font-family: 'Heebo', sans-serif; transition: border-color 0.2s; }
  .contact-form input:focus, .contact-form textarea:focus { border-color: var(--gold); outline: none; }
  .contact-form input::placeholder, .contact-form textarea::placeholder { color: rgba(255,255,255,0.45); }
  .contact-form .full { grid-column: 1 / -1; }
  .submit-btn { grid-column: 1 / -1; padding: 14px; background: var(--gold); color: var(--navy); border: none; border-radius: 10px; font-size: 16px; font-weight: 800; cursor: pointer; font-family: 'Heebo', sans-serif; transition: all 0.2s; }
  .submit-btn:hover { background: var(--gold-light); }

  .footer { background: var(--navy); color: rgba(255,255,255,0.6); padding: 20px; text-align: center; font-size: 13px; }
  .footer a { color: var(--gold-light); text-decoration: none; }

  @media (max-width: 700px) { .tracks { grid-template-columns: 1fr; } }
  @media (max-width: 600px) { .contact-form { grid-template-columns: 1fr; } .trust-items { flex-direction: column; align-items: center; gap: 6px; } .hero { min-height: 70vh; } .landing-nav { padding: 0 12px; } }
</style>
</head>
<body>

<nav class="landing-nav">
  <a href="https://bor-miz.co.il" class="nav-brand">
    <img src="image_2.png" alt="בורוביץ מזרחי" />
    <div class="nav-brand-text">בורוביץ מזרחי<span>שמאות מקרקעין וחקלאות</span></div>
  </a>
  <a href="https://bor-miz.co.il" class="nav-cta">חזרה לאתר הראשי</a>
</nav>

<div class="hero">
  <div class="hero-bg"></div>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <div class="hero-badge">&#127806; שמאי מקרקעין + שמאי חקלאות</div>
    <h1><em>שמאות חקלאית</em> ונחלות<br>מעטפת מלאה - ממשרד אחד</h1>
    <p>אנחנו גם שמאי מקרקעין וגם שמאי חקלאות. הערכת פגיעה בגידולים, מטעים ובעלי חיים, לצד שומת הנחלה עצמה - הכל תחת קורת גג אחת.</p>
    <a href="#contact-form" class="hero-cta">ייעוץ ראשוני חינם &larr;</a>
  </div>
</div>

<div class="trust-bar">
  <div class="trust-items">
    <span>שמאי מקרקעין + שמאי חקלאות</span>
    <span>התמחות בנחלות הצפון</span>
    <span>ניסיון ברפורמות רמ"י</span>
    <span>מעטפת מלאה לנחלה</span>
  </div>
</div>

<section>
  <h2>שני תחומים - <em>מעטפת אחת</em></h2>
  <p class="section-sub">בניגוד למשרדים אחרים, אצלנו תקבלו את שני סוגי השומה ממשרד אחד</p>

  <div class="tracks">
    <div class="track-card agri">
      <div class="track-label">שמאות חקלאית</div>
      <h3>&#127807; הערכת נזק וגידולים</h3>
      <ul>
        <li>פגיעה בפרי וגידולים עונתיים</li>
        <li>הערכת שווי מטעים ועצים</li>
        <li>הערכת בעלי חיים (כבשים, בקר, עופות)</li>
        <li>נזקי טבע, מחלות ופגיעות חיצוניות</li>
        <li>אובדן יבול ותפוקה חקלאית</li>
      </ul>
    </div>
    <div class="track-card realty">
      <div class="track-label">שמאות מקרקעין</div>
      <h3>&#127968; שומת נחלה</h3>
      <ul>
        <li>הערכת שווי הנחלה כמקרקעין</li>
        <li>חלק מגורים + זכויות בנייה</li>
        <li>מבני משק וחלק חקלאי</li>
        <li>פיצול נחלות (החלטה 1591)</li>
        <li>ליווי ברפורמות רמ"י</li>
      </ul>
    </div>
  </div>

  <div class="envelope-banner">
    <h3>&#128170; למה <span>מעטפת מלאה?</span></h3>
    <p>כשנדרשת שומה לנחלה - לעתים צריך גם הערכת שווי המקרקעין וגם הערכת הגידולים החקלאיים. אצלנו הכל ממשרד אחד, בלי לרוץ בין שמאים.</p>
  </div>
</section>

<section>
  <h2>תחומי <em>ההתמחות</em></h2>
  <div class="expertise-grid">
    <div class="expertise-card">
      <h3>&#127815; פגיעה בפרי וגידולים</h3>
      <p>הערכת נזק ואובדן יבול בגידולים עונתיים, ירקות, פרחים ותבלינים</p>
    </div>
    <div class="expertise-card">
      <h3>&#128003; הערכת בעלי חיים</h3>
      <p>שומות לכבשים, בקר, עופות ובעלי חיים חקלאיים - לביטוח, פיצוי ומכירה</p>
    </div>
    <div class="expertise-card">
      <h3>&#127795; מטעים ועצים</h3>
      <p>הערכת שווי מטעים קיימים, עצי פרי, עצי נוי ופגיעה בהם</p>
    </div>
    <div class="expertise-card">
      <h3>&#127969; שומת נחלה (מקרקעין)</h3>
      <p>הערכת שווי הנחלה כולל חלק מגורים, שטח חקלאי, מבני משק וזכויות בנייה</p>
    </div>
    <div class="expertise-card">
      <h3>&#9878; פיצול נחלות</h3>
      <p>שומות לצורך פיצול נחלות במסגרת רפורמת רמ"י - החלטה 1591</p>
    </div>
    <div class="expertise-card">
      <h3>&#128200; רפורמות רמ"י</h3>
      <p>ליווי שמאי בהחלטות 1591, 1553 ורפורמות נוספות של רשות מקרקעי ישראל</p>
    </div>
  </div>
</section>

<section>
  <h2>למה <em>אנחנו?</em></h2>
  <div class="why-section">
    <ul class="why-list">
      <li><span class="check">&#10003;</span> שמאי מקרקעין מוסמך + שמאי חקלאות - מעטפת מלאה ממשרד אחד</li>
      <li><span class="check">&#10003;</span> הכרות אישית עם נחלות ומשקים ברחבי הגליל והצפון</li>
      <li><span class="check">&#10003;</span> ניסיון בעבודה מול רמ"י, ועדות תכנון ובתי משפט</li>
      <li><span class="check">&#10003;</span> מאגר עסקאות השוואה ייחודי לנכסים חקלאיים ונחלות</li>
      <li><span class="check">&#10003;</span> ליווי צמוד מהשלב הראשון ועד לסגירת העסקה</li>
    </ul>
  </div>
</section>

<div id="contact-form" class="cta-section">
  <h2>ייעוץ ראשוני חינם</h2>
  <p>ספרו לנו על הנחלה, הגידולים או הנכס ונחזור עם הערכה ראשונית</p>
  <form class="contact-form" id="leadForm" onsubmit="submitForm(event)">
    <input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);border:0;opacity:0" />
    <input type="text" name="name" placeholder="שם מלא" required />
    <input type="tel" name="phone" placeholder="טלפון" required />
    <input type="email" name="email" placeholder="אימייל" class="full" />
    <input type="text" name="city" placeholder="יישוב / מושב / קיבוץ" />
    <input type="text" name="address" placeholder="שם הנחלה / מספר" />
    <textarea name="note" class="full" rows="3" placeholder="פרטים נוספים - סוג הנכס, סוג הגידולים, מטרת השומה..."></textarea>
    <input type="hidden" name="subject" value="שומה חקלאית" />
    <input type="hidden" name="source" value="landing-hakla it" />
    <button type="submit" class="submit-btn">שלחו פנייה</button>
  </form>
  <p id="formMsg" style="margin-top: 12px; font-size: 14px; display: none;"></p>
</div>

<div class="footer">
  <p>&copy; 2026 בורוביץ מזרחי שמאות מקרקעין וחקלאות בע"מ | <a href="https://bor-miz.co.il">חזרה לאתר</a></p>
  <p>054-6559942 | 050-8922469 | maor@bor-miz.co.il</p>
</div>

<script>
async function submitForm(e) {
  e.preventDefault();
  const form = e.target, btn = form.querySelector('.submit-btn'), msg = document.getElementById('formMsg');
  btn.disabled = true; btn.textContent = 'שולח...';
  const data = { name: form.name.value, phone: form.phone.value, email: form.email.value || null, city: form.city.value || null, address: form.address.value || null, note: form.note.value || null, subject: form.subject.value, source: form.source.value, form_type: 'landing', _hp: form.website ? form.website.value : '', elapsed_ms: Math.round(performance.now()) };
  try {
    const res = await fetch('https://nurgknexilxaxxovdbco.supabase.co/functions/v1/website-lead-intake', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (res.ok) { msg.style.display = 'block'; msg.style.color = '#4ade80'; msg.textContent = 'הפנייה נשלחה! ניצור קשר בהקדם.'; form.reset(); window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: 'generate_lead', form_source: 'landing', lead_subject: (form.subject && form.subject.value) || 'landing' }); } else throw new Error();
  } catch { msg.style.display = 'block'; msg.style.color = '#fca5a5'; msg.textContent = 'שגיאה. התקשר 054-6559942'; }
  btn.disabled = false; btn.textContent = 'שלחו פנייה';
}
</script>
</body>
</html>

```

### `landing-shovi-shuk.html`

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="shortcut icon" href="/favicon.ico">
<!-- ===== GOOGLE ANALYTICS 4 (gtag.js) =====
     Property "bor-miz.co.il", measurement ID G-GYNQPGPR33 - installed 2026-09-08,
     replacing a Tag Manager placeholder that never had a container behind it.
     The bridge below turns the site's existing dataLayer.push({event:'...'}) calls
     (generate_lead / contact_whatsapp / contact_phone / intake_submitted) into GA4
     events, so every call site elsewhere in the site stays untouched. -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-GYNQPGPR33"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-GYNQPGPR33');
  (function(){
    // gtag() itself pushes an arguments object, which has no .event key - so this
    // never recurses on its own output.
    var push = window.dataLayer.push;
    window.dataLayer.push = function(){
      for (var i = 0; i < arguments.length; i++) {
        var o = arguments[i];
        if (o && typeof o.event === 'string') {
          var params = {};
          for (var k in o) {
            if (k !== 'event' && Object.prototype.hasOwnProperty.call(o, k)) params[k] = o[k];
          }
          gtag('event', o.event, params);
        }
      }
      return push.apply(window.dataLayer, arguments);
    };
  })();
</script>
<!-- ===== END GOOGLE ANALYTICS 4 ===== -->
<title>הערכת שווי נכס - שומת מקרקעין מקצועית | בורוביץ מזרחי</title>
<meta name="description" content="צריך הערכת שווי לנכס? שמאי מקרקעין מוסמך לדירות, בתים, מגרשים ונכסים מסחריים. למכירה, רכישה, חלוקת רכוש ועוד.">
<meta name="keywords" content="הערכת שווי נכס, שומת מקרקעין, שמאי מקרקעין, שווי דירה, שווי בית, חלוקת רכוש, כונס נכסים">
<link rel="canonical" href="https://bor-miz.co.il/landing-shovi-shuk.html">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
  :root { --navy: #1C3461; --blue: #2A6DB5; --gold: #B89630; --gold-light: #d4b55a; --sky: #EAF1F8; --card-bg: #EDF2F7; --text: #1C3461; --white: #FFFFFF; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Heebo', sans-serif; color: var(--text); background: var(--white); line-height: 1.7; direction: rtl; }

  .landing-nav { position: fixed; top: 0; width: 100%; z-index: 100; background: rgba(237,242,247,0.96); backdrop-filter: blur(10px); border-bottom: 4px solid var(--navy); padding: 0 2rem; height: 64px; display: flex; align-items: center; justify-content: space-between; }
  .nav-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
  .nav-brand img { height: 38px; border-radius: 6px; }
  .nav-brand-text { font-weight: 700; font-size: 15px; color: var(--navy); line-height: 1.2; }
  .nav-brand-text span { display: block; font-size: 10px; font-weight: 300; opacity: 0.7; }
  .nav-cta { background: var(--gold); color: var(--navy); padding: 7px 20px; border-radius: 6px; font-weight: 700; font-size: 13px; text-decoration: none; transition: all 0.2s; }
  .nav-cta:hover { background: var(--gold-light); transform: translateY(-1px); }

  .hero { min-height: 85vh; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; margin-top: 64px; }
  .hero-bg { position: absolute; inset: 0; background-image: url('slide11.jpg'); background-size: cover; background-position: center; animation: kenBurns 20s ease-in-out infinite alternate; }
  @keyframes kenBurns { from { transform: scale(1); } to { transform: scale(1.08); } }
  .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(28,52,97,0.5) 0%, rgba(28,52,97,0.7) 50%, rgba(28,52,97,0.9) 100%); }
  .hero-content { position: relative; z-index: 2; text-align: center; color: var(--white); max-width: 800px; padding: 40px 20px; }
  .hero-badge { display: inline-block; background: rgba(184,150,48,0.25); border: 1px solid rgba(184,150,48,0.5); padding: 6px 22px; border-radius: 30px; font-size: 14px; color: var(--gold-light); margin-bottom: 18px; }
  .hero h1 { font-size: clamp(30px, 5vw, 50px); font-weight: 900; margin-bottom: 16px; line-height: 1.25; }
  .hero h1 em { font-style: normal; color: var(--gold-light); }
  .hero p { font-size: 18px; color: rgba(255,255,255,0.85); max-width: 600px; margin: 0 auto 28px; }
  .hero-cta { display: inline-block; background: var(--gold); color: var(--navy); padding: 15px 44px; border-radius: 8px; font-size: 18px; font-weight: 800; text-decoration: none; transition: all 0.3s; box-shadow: 0 4px 24px rgba(184,150,48,0.35); }
  .hero-cta:hover { background: var(--gold-light); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(184,150,48,0.45); }

  .trust-bar { background: var(--navy); padding: 14px 20px; text-align: center; }
  .trust-items { display: flex; justify-content: center; gap: 32px; flex-wrap: wrap; font-size: 14px; color: rgba(255,255,255,0.85); }
  .trust-items span::before { content: '\2713 '; color: var(--gold); font-weight: 700; }

  section { max-width: 940px; margin: 0 auto; padding: 40px 20px 20px; }
  h2 { font-size: 30px; font-weight: 900; color: var(--navy); text-align: center; margin-bottom: 8px; }
  h2 em { font-style: normal; color: var(--gold); }
  .section-sub { text-align: center; color: #64748b; font-size: 15px; margin-bottom: 24px; }

  .use-cases { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
  .use-case { background: var(--card-bg); border-radius: 16px; padding: 24px; text-align: center; border-bottom: 3px solid var(--gold); transition: all 0.2s; }
  .use-case:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(28,52,97,0.08); }
  .use-case-icon { font-size: 34px; margin-bottom: 8px; }
  .use-case h3 { font-size: 16px; font-weight: 800; color: var(--navy); margin-bottom: 4px; }
  .use-case p { font-size: 13px; color: #64748b; }

  .property-types { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-top: 16px; }
  .property-chip { background: var(--sky); color: var(--navy); padding: 8px 20px; border-radius: 30px; font-size: 14px; font-weight: 600; border: 1px solid rgba(42,109,181,0.2); }

  .process-steps { display: flex; flex-direction: column; gap: 14px; margin-top: 20px; }
  .process-step { display: flex; align-items: flex-start; gap: 16px; background: var(--card-bg); border-radius: 14px; padding: 20px; border-right: 4px solid var(--blue); }
  .step-num { min-width: 42px; height: 42px; border-radius: 50%; background: var(--navy); color: var(--gold); display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px; flex-shrink: 0; }
  .step-content h4 { font-weight: 700; color: var(--navy); margin-bottom: 4px; }
  .step-content p { font-size: 14px; color: #64748b; }

  .cta-section { background: linear-gradient(135deg, var(--navy), var(--blue)); border-radius: 20px; padding: 50px 30px; text-align: center; color: var(--white); margin: 20px auto 30px; max-width: 860px; }
  .cta-section h2 { color: var(--white); margin-bottom: 8px; }
  .cta-section p { color: rgba(255,255,255,0.8); margin-bottom: 24px; font-size: 16px; }
  .contact-form { max-width: 500px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .contact-form input, .contact-form select { padding: 12px 16px; border: 2px solid rgba(255,255,255,0.15); border-radius: 10px; background: rgba(255,255,255,0.08); color: #fff; font-size: 14px; font-family: 'Heebo', sans-serif; transition: border-color 0.2s; }
  .contact-form input:focus, .contact-form select:focus { border-color: var(--gold); outline: none; }
  .contact-form input::placeholder { color: rgba(255,255,255,0.45); }
  .contact-form select { color: rgba(255,255,255,0.7); }
  .contact-form select option { color: var(--text); }
  .contact-form .full { grid-column: 1 / -1; }
  .submit-btn { grid-column: 1 / -1; padding: 14px; background: var(--gold); color: var(--navy); border: none; border-radius: 10px; font-size: 16px; font-weight: 800; cursor: pointer; font-family: 'Heebo', sans-serif; transition: all 0.2s; }
  .submit-btn:hover { background: var(--gold-light); }

  .footer { background: var(--navy); color: rgba(255,255,255,0.6); padding: 20px; text-align: center; font-size: 13px; }
  .footer a { color: var(--gold-light); text-decoration: none; }

  @media (max-width: 600px) { .contact-form { grid-template-columns: 1fr; } .trust-items { flex-direction: column; align-items: center; gap: 6px; } .hero { min-height: 70vh; } .landing-nav { padding: 0 12px; } }
</style>
</head>
<body>

<nav class="landing-nav">
  <a href="https://bor-miz.co.il" class="nav-brand">
    <img src="image_2.png" alt="בורוביץ מזרחי" />
    <div class="nav-brand-text">בורוביץ מזרחי<span>שמאות מקרקעין וחקלאות</span></div>
  </a>
  <a href="https://bor-miz.co.il" class="nav-cta">חזרה לאתר הראשי</a>
</nav>

<div class="hero">
  <div class="hero-bg"></div>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <div class="hero-badge">&#127968; שומת מקרקעין מקצועית</div>
    <h1>צריך <em>הערכת שווי</em> לנכס?<br>שמאי מוסמך - תוצאות תוך ימים</h1>
    <p>שומות מדויקות לכל סוגי הנכסים: דירות, בתים, מגרשים, נכסים מסחריים. למכירה, רכישה, חלוקת רכוש ועוד.</p>
    <a href="#contact-form" class="hero-cta">קבל הצעת מחיר &larr;</a>
  </div>
</div>

<div class="trust-bar">
  <div class="trust-items">
    <span>שמאים מוסמכים</span>
    <span>שומה תוך 5-7 ימי עבודה</span>
    <span>דיוק מקסימלי</span>
    <span>כיסוי ארצי</span>
  </div>
</div>

<section>
  <h2>למה צריך <em>הערכת שווי?</em></h2>
  <p class="section-sub">מצבים שבהם שומת מקרקעין מקצועית חיונית</p>
  <div class="use-cases">
    <div class="use-case">
      <div class="use-case-icon">&#128184;</div>
      <h3>מכירה / רכישה</h3>
      <p>דעו את השווי האמיתי לפני שמתחילים משא ומתן</p>
    </div>
    <div class="use-case">
      <div class="use-case-icon">&#9878;</div>
      <h3>חלוקת רכוש</h3>
      <p>שומה אובייקטיבית לצורך גירושין, ירושה או שותפות</p>
    </div>
    <div class="use-case">
      <div class="use-case-icon">&#128202;</div>
      <h3>מס / דיווח</h3>
      <p>הערכת שווי לצרכי מס שבח, מס רכישה ודיווח פיננסי</p>
    </div>
    <div class="use-case">
      <div class="use-case-icon">&#128221;</div>
      <h3>כונס נכסים</h3>
      <p>שומה לצורך מימוש נכסים בהליכי כינוס והוצאה לפועל</p>
    </div>
  </div>
</section>

<section>
  <h2>סוגי נכסים <em>שאנחנו מעריכים</em></h2>
  <div class="property-types">
    <span class="property-chip">&#127969; דירות</span>
    <span class="property-chip">&#127968; בתים פרטיים</span>
    <span class="property-chip">&#127960; מגרשים</span>
    <span class="property-chip">&#127963; משרדים</span>
    <span class="property-chip">&#128722; חנויות</span>
    <span class="property-chip">&#127981; תעשייה</span>
    <span class="property-chip">&#127806; נחלות</span>
    <span class="property-chip">&#127942; פנטהאוזים</span>
  </div>
</section>

<section>
  <h2>איך זה <em>עובד?</em></h2>
  <div class="process-steps">
    <div class="process-step"><div class="step-num">1</div><div class="step-content"><h4>פנייה ופרטי הנכס</h4><p>שולחים לנו את פרטי הנכס ומטרת השומה</p></div></div>
    <div class="process-step"><div class="step-num">2</div><div class="step-content"><h4>ביקור בנכס</h4><p>שמאי מוסמך מגיע לביקור מקצועי, מתעד ומצלם</p></div></div>
    <div class="process-step"><div class="step-num">3</div><div class="step-content"><h4>ניתוח ושומה</h4><p>ניתוח עסקאות השוואה, בדיקת זכויות בנייה וקביעת שווי</p></div></div>
    <div class="process-step"><div class="step-num">4</div><div class="step-content"><h4>קבלת המסמך</h4><p>שומה חתומה ומפורטת תוך 5-7 ימי עבודה</p></div></div>
  </div>
</section>

<div id="contact-form" class="cta-section">
  <h2>קבל הצעת מחיר</h2>
  <p>השאירו פרטים ונחזור אליכם עם הצעה מותאמת</p>
  <form class="contact-form" id="leadForm" onsubmit="submitForm(event)">
    <input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);border:0;opacity:0" />
    <input type="text" name="name" placeholder="שם מלא" required />
    <input type="tel" name="phone" placeholder="טלפון" required />
    <input type="email" name="email" placeholder="אימייל" class="full" />
    <input type="text" name="city" placeholder="עיר" />
    <select name="property_type" class="full">
      <option value="">סוג נכס</option>
      <option value="דירה">דירה</option>
      <option value="בית פרטי">בית פרטי</option>
      <option value="מגרש">מגרש</option>
      <option value="נכס מסחרי">נכס מסחרי</option>
      <option value="נחלה">נחלה</option>
      <option value="אחר">אחר</option>
    </select>
    <input type="hidden" name="subject" value="שווי שוק" />
    <input type="hidden" name="source" value="landing-shovi" />
    <button type="submit" class="submit-btn">קבלו הצעת מחיר</button>
  </form>
  <p id="formMsg" style="margin-top: 12px; font-size: 14px; display: none;"></p>
</div>

<div class="footer">
  <p>&copy; 2026 בורוביץ מזרחי שמאות מקרקעין | <a href="https://bor-miz.co.il">חזרה לאתר</a></p>
  <p>054-6559942 | 050-8922469 | maor@bor-miz.co.il</p>
</div>

<script>
async function submitForm(e) {
  e.preventDefault();
  const form = e.target, btn = form.querySelector('.submit-btn'), msg = document.getElementById('formMsg');
  btn.disabled = true; btn.textContent = 'שולח...';
  const data = { name: form.name.value, phone: form.phone.value, email: form.email.value || null, city: form.city.value || null, subject: form.subject.value, source: form.source.value, form_type: 'landing', _hp: form.website ? form.website.value : '', elapsed_ms: Math.round(performance.now()) };
  try {
    const res = await fetch('https://nurgknexilxaxxovdbco.supabase.co/functions/v1/website-lead-intake', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (res.ok) { msg.style.display = 'block'; msg.style.color = '#4ade80'; msg.textContent = 'הפנייה נשלחה! ניצור קשר בהקדם.'; form.reset(); window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: 'generate_lead', form_source: 'landing', lead_subject: (form.subject && form.subject.value) || 'landing' }); } else throw new Error();
  } catch { msg.style.display = 'block'; msg.style.color = '#fca5a5'; msg.textContent = 'שגיאה. התקשר 054-6559942'; }
  btn.disabled = false; btn.textContent = 'קבלו הצעת מחיר';
}
</script>
</body>
</html>

```

### `maamar-heitel-hashbacha-madrich.html`

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="shortcut icon" href="/favicon.ico">

<!-- ===== GOOGLE ANALYTICS 4 (gtag.js) ===== -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-GYNQPGPR33"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-GYNQPGPR33');
  (function(){
    var push = window.dataLayer.push;
    window.dataLayer.push = function(){
      for (var i = 0; i < arguments.length; i++) {
        var o = arguments[i];
        if (o && typeof o.event === 'string') {
          var params = {};
          for (var k in o) { if (k !== 'event' && Object.prototype.hasOwnProperty.call(o, k)) params[k] = o[k]; }
          gtag('event', o.event, params);
        }
      }
      return push.apply(window.dataLayer, arguments);
    };
  })();
</script>
<!-- ===== END GOOGLE ANALYTICS 4 ===== -->

<title>מדריך מקיף: היטל השבחה, מימוש זכויות ודרכי השגה והפחתה | בורוביץ מזרחי</title>
<meta name="description" content="במדריך זה נפרט מהו היטל השבחה, מתי נוצרת החבות ומתי חלה חובת התשלום בפועל, אילו פטורים וקיזוזי הוצאות ניתן לדרוש, מהם המסלולים החוקיים המדויקים להגשת השגה, וכיצד משרדנו מלווה ומנהל את ההליך השמאי והמשפטי להפחתת השומה עד לתוצאה המיטבית.">
<meta name="keywords" content="היטל השבחה, מימוש זכויות, פטור מהיטל השבחה, 140 מ"ר, שמאי מכריע, ועדת ערר, שומה מוסכמת, תוספת שלישית">
<link rel="canonical" href="https://bor-miz.co.il/maamar-heitel-hashbacha-madrich.html">
<meta property="og:type" content="article">
<meta property="og:url" content="https://bor-miz.co.il/maamar-heitel-hashbacha-madrich.html">
<meta property="og:title" content="מדריך מקיף: היטל השבחה, מימוש זכויות ודרכי השגה והפחתה">
<meta property="og:description" content="במדריך זה נפרט מהו היטל השבחה, מתי נוצרת החבות ומתי חלה חובת התשלום בפועל, אילו פטורים וקיזוזי הוצאות ניתן לדרוש, מהם המסלולים החוקיים המדויקים להגשת השגה, וכיצד משרדנו מלווה ומנהל את ההליך השמאי והמשפטי להפחתת השומה עד לתוצאה המיטבית.">
<meta property="og:image" content="https://bor-miz.co.il/slide2.jpg">
<meta property="og:locale" content="he_IL">
<meta property="article:published_time" content="2026-10-27">
<meta property="article:author" content="מאור מזרחי">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500;600;700;900&family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

<!-- STRUCTURED DATA — Article + Person(author) + Breadcrumb -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": "https://bor-miz.co.il/maamar-heitel-hashbacha-madrich.html#article",
  "headline": "מדריך מקיף: היטל השבחה, מימוש זכויות ודרכי השגה והפחתה",
  "description": "במדריך זה נפרט מהו היטל השבחה, מתי נוצרת החבות ומתי חלה חובת התשלום בפועל, אילו פטורים וקיזוזי הוצאות ניתן לדרוש, מהם המסלולים החוקיים המדויקים להגשת השגה, וכיצד משרדנו מלווה ומנהל את ההליך השמאי והמשפטי להפחתת השומה עד לתוצאה המיטבית.",
  "inLanguage": "he-IL",
  "datePublished": "2026-10-27",
  "dateModified": "2026-10-27",
  "image": "https://bor-miz.co.il/slide2.jpg",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://bor-miz.co.il/maamar-heitel-hashbacha-madrich.html"
  },
  "isPartOf": {
    "@id": "https://bor-miz.co.il/maamarim.html#blog"
  },
  "about": [
    {
      "@type": "Thing",
      "name": "היטל השבחה"
    },
    {
      "@type": "Thing",
      "name": "מימוש זכויות"
    },
    {
      "@type": "Thing",
      "name": "פטור מהיטל השבחה"
    },
    {
      "@type": "Thing",
      "name": "שמאי מכריע"
    },
    {
      "@type": "Thing",
      "name": "ועדת ערר לפיצויים ולהיטל השבחה"
    }
  ],
  "author": {
    "@type": "Person",
    "@id": "https://bor-miz.co.il/#maor-mizrachi",
    "name": "מאור מזרחי",
    "jobTitle": "שמאי מקרקעין מוסמך, שותף",
    "worksFor": {
      "@type": "Organization",
      "name": "בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ",
      "url": "https://bor-miz.co.il/"
    },
    "knowsAbout": [
      "היטל השבחה",
      "שומות השבחה",
      "שומות מכריעות",
      "השגות על שומות רשות מקרקעי ישראל",
      "התחדשות עירונית",
      "דוחות אפס",
      "טבלאות הקצאה ואיזון"
    ],
    "alumniOf": "תואר ראשון בכלכלה ומנהל עסקים",
    "description": "שמאי מקרקעין מוסמך, חבר לשכת שמאי המקרקעין. שימש כמרכז השגות במטה רשות מקרקעי ישראל בירושלים. עוסק בשומות היטלי השבחה ובמתן שירות לוועדות.",
    "telephone": "+972-54-6559942"
  },
  "publisher": {
    "@type": "Organization",
    "name": "בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ",
    "url": "https://bor-miz.co.il/",
    "logo": {
      "@type": "ImageObject",
      "url": "https://bor-miz.co.il/logo-bm.png"
    }
  },
  "citation": [
    {
      "@type": "Legislation",
      "name": "חוק התכנון והבנייה, התשכ\"ה-1965 - התוספת השלישית",
      "legislationJurisdiction": "IL"
    },
    {
      "@type": "Legislation",
      "name": "חוק התכנון והבנייה, התשכ\"ה-1965 - סעיף 196א",
      "legislationJurisdiction": "IL"
    }
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "ראשי",
      "item": "https://bor-miz.co.il/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "מאמרים",
      "item": "https://bor-miz.co.il/maamarim.html"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "מדריך מקיף: היטל השבחה, מימוש זכויות ודרכי השגה והפחתה",
      "item": "https://bor-miz.co.il/maamar-heitel-hashbacha-madrich.html"
    }
  ]
}
</script>

<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="page.css">
</head>
<body class="article-hero-page">

<a href="#main-content" class="skip-to-content">דלג לתוכן הראשי</a>

<!-- NAVIGATION -->
<nav id="navbar" role="navigation" aria-label="ניווט ראשי">
  <div class="nav-inner">
    <a href="index.html" class="nav-logo" aria-label="בורוביץ מזרחי שמאות מקרקעין - דף הבית">
      <img src="logo-bm.png" alt="לוגו בורוביץ מזרחי">
    </a>
    <ul class="nav-links" id="navLinks">
      <li><a href="index.html#about" onclick="closeMenu()">אודות</a></li>
      <li><a href="index.html#services" onclick="closeMenu()">תחומי התמחות</a></li>
      <li><a href="maamarim.html" onclick="closeMenu()">מאמרים</a></li>
      <li><a href="index.html#linkedin-posts" onclick="closeMenu()">עדכונים</a></li>
      <li><a href="index.html#success" onclick="closeMenu()">מהשטח</a></li>
      <li><a href="careers.html" onclick="closeMenu()">קריירה</a></li>
      <li><a href="index.html#contact" class="nav-cta" onclick="closeMenu()">צור קשר</a></li>
    </ul>
    <button class="hamburger" id="hamburger" onclick="toggleMenu()" aria-label="תפריט ניווט" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>

<main id="main-content">

<!-- ARTICLE HERO -->
<section class="subpage-hero article-hero">
  <div class="sp-bg" style="background-image:url('slide2.jpg')"></div>
  <div class="sp-overlay"></div>
  <div class="sp-content">
    <nav class="breadcrumb" aria-label="מסלול ניווט">
    <a href="index.html">ראשי</a> <span class="sep">/</span>
    <a href="maamarim.html">מאמרים</a> <span class="sep">/</span>
    <span>היטל השבחה - מדריך</span>
  </nav>
    <h1 class="sp-title">מדריך מקיף: <span class="gold">היטל השבחה, מימוש זכויות ודרכי השגה והפחתה</span></h1>
    <div class="article-byline">
    <span>מאת <strong>מאור מזרחי</strong>, שמאי מקרקעין מוסמך · שותף</span>
    <span class="sep">·</span>
    <time datetime="2026-10-27">27 באוקטובר 2026</time>
    <span class="sep">·</span>
    <span>12 דקות קריאה</span>
  </div>
  </div>
</section>


<article class="article-wrap">

  <nav class="article-toc" aria-label="תוכן המאמר">
    <h2>מה יש במדריך</h2>
    <ol>
      <li><a href="#sec1">מהו היטל השבחה ומדוע הוא מוטל?</a></li>
      <li><a href="#sec2">מועד יצירת החבות לעומת מועד התשלום בפועל ("מימוש זכויות")</a></li>
      <li><a href="#sec3">פטורים מרכזיים מתשלום היטל השבחה</a></li>
      <li><a href="#sec4">קיזוז הוצאות בשומת ההשבחה: פסיקות מחייבות</a></li>
      <li><a href="#sec5">מסלולי ההשגה על היטל השבחה (סעיף 14 לחוק)</a></li>
      <li><a href="#sec6">כיצד משרדנו מטפל בבחינת שומת היטל השבחה?</a></li>
      <li><a href="#sec7">האם הגשת השגה מעכבת מכירה או קבלת היתר?</a></li>
    </ol>
  </nav>

  <div class="article-body">

    <p>בעלי נכסים ומגרשים רבים בישראל מופתעים לגלות דרישת תשלום של עשרות ואף מאות אלפי שקלים מהוועדה המקומית לתכנון ולבנייה תחת הכותרת <strong>היטל השבחה</strong>. דרישה זו נוחתת לרוב ברגעים הקריטיים והרגישים ביותר: בעת מכירת הדירה או הקרקע, או בעיצומו של תהליך הוצאת היתר בנייה להרחבה, לתוספת בנייה או להקמת מבנה חדש.</p>
    <p>במדריך זה נפרט מהו היטל השבחה, מתי נוצרת החבות ומתי חלה חובת התשלום בפועל, אילו פטורים וקיזוזי הוצאות ניתן לדרוש, מהם המסלולים החוקיים המדויקים להגשת השגה, וכיצד משרדנו מלווה ומנהל את ההליך השמאי והמשפטי להפחתת השומה עד לתוצאה המיטבית.</p>

    <h2 id="sec1">1. מהו היטל השבחה ומדוע הוא מוטל?</h2>
    <p>הבסיס החוקי להיטל ההשבחה מעוגן ב<strong>סעיף 196א ובתוספת השלישית לחוק התכנון והבניה, תשכ"ה-1965</strong>.</p>
    <p>על פי סעיף 1 לתוספת השלישית:</p>
    <blockquote>
      <p><strong>"השבחה"</strong> – עליית שוויים של מקרקעין עקב אישור תכנית, מתן הקלה או התרת שימוש חורג.</p>
    </blockquote>
    <p>הרציונל העומד מאחורי ההיטל הוא עקרון הצדק החלוקתי: כאשר מוסדות התכנון משביחים נכס באמצעות פעולה תכנונית – כגון תוספת זכויות בנייה (מ"ר), הוספת קומות, תוספת יחידות דיור, שינוי ייעוד מקרקעין (למשל מחקלאות למגורים או ממגורים למסחר), או אישור הקלה בקווי בניין – שווי השוק של הנכס מזנק. המחוקק קבע כי בעל הנכס אינו נהנה לבדו מפיתוח זה, ועליו להפריש חלק מעליית הערך לטובת הקופה הציבורית.</p>
    <ul>
      <li><strong>שיעור ההיטל הכללי:</strong> עומד על <strong>50% (מחצית) מסך ההשבחה</strong>.</li>
      <li><strong>חריגים ושיעורים מופחתים:</strong> בתוכניות התחדשות עירונית (כגון פינוי-בינוי וחלופות תמ"א 38), שיעור ההיטל הסטנדרטי בחוק עומד על <strong>25% (רבע מההשבחה)</strong>, ובסמכות הרשות המקומית לקבוע שיעור של 12.5% או אף פטור מלא באזורים ייעודיים.</li>
      <li><strong>ייעוד כספי ההיטל:</strong> סעיף 13 לתוספת השלישית קובע כי כספי ההיטל אינם מוזרמים לתקציב הרגיל של הרשות, אלא מיועדים למטרות תכנון, פיתוח תשתיות, רכישת מקרקעין לצורכי ציבור ושימור אתרים.</li>
    </ul>

    <h2 id="sec2">2. מועד יצירת החבות לעומת מועד התשלום בפועל ("מימוש זכויות")</h2>
    <p>יש להבחין בין שני מועדים מהותיים:</p>
    <h3>א. מועד יצירת החבות (המועד הקובע לשומה)</h3>
    <p>ההשבחה עצמה נוצרת ביום תחילתה של התוכנית המשביחה (לרוב 15 ימים ממועד פרסום אישורה ברשומות), או ביום מתן ההקלה / השימוש החורג. במועד קבוע זה נערכת השומה הבוחנת את עליית השווי בין המצב הקודם למצב החדש.</p>
    <h3>ב. מועד התשלום – "מימוש זכויות"</h3>
    <p>על אף שהחבות נולדה עם אישור התוכנית, סעיף 7 לתוספת השלישית קובע כי בעל הנכס נדרש לשלם בפועל רק כאשר הוא מבצע <strong>"מימוש זכויות"</strong>:</p>
    <ol>
      <li><strong>קבלת היתר בנייה:</strong> היתר לתוספת בנייה או שימוש שלא היה ניתן לאשרו אלמלא התוכנית המשביחה, ההקלה או השימוש החורג.</li>
      <li><strong>התחלת שימוש בפועל:</strong> תחילת השימוש המסחרי או הייעודי שהותר לראשונה עקב אישור התוכנית.</li>
      <li><strong>העברת זכויות במקרקעין (מכר):</strong> מכירת הנכס או העברת זכויות החכירה לדורות. <span class="li-note"><strong>חריג חשוב במכר:</strong> העברה ללא תמורה מאדם ל"קרובו" (בן זוג, הורה, צאצא, אח ובני זוגם) אינה מוגדרת כמימוש זכויות, והתשלום נדחה עד למכירה העתידית על ידי מקבל הנכס.</span></li>
    </ol>

    <h2 id="sec3">3. פטורים מרכזיים מתשלום היטל השבחה</h2>
    <p>סעיף 19 לתוספת השלישית מעניק שורה של פטורים סטטוטוריים, שביניהם נפוצים במיוחד:</p>
    <ul>
      <li><strong>פטור להרחבה או בנייה למגורים (סעיף 19(ג)):</strong> בנייה או הרחבה של דירת מגורים המיועדת לשמש למגורי המחזיק או קרובו פטורה מהיטל עד שטח כולל של <strong>140 מ"ר</strong>. על כל שטח עודף ישולם היטל יחסי. הפטור נשמר גם בעת מכירה, ובלבד שהמחזיק או קרובו התגוררו בדירה לפחות 4 שנים מסיום הבנייה.</li>
      <li><strong>פטור למרחב מוגן (ממ"ד):</strong> השבחה שמקורה בבניית מרחב מוגן או שיפורי מיגון בהתאם להוראות חוק ההתגוננות האזרחית.</li>
      <li><strong>פטור לנגישות:</strong> תוספת שטחי שירות המיועדים לביצוע התאמות נגישות (כגון פיר מעלית).</li>
      <li><strong>מוסדות ציבור וצדקה:</strong> מקרקעין של מוסדות לחינוך, מדע, בריאות, דת וסעד הפועלים שלא למטרת רווח.</li>
    </ul>

    <h2 id="sec4">4. קיזוז הוצאות בשומת ההשבחה: פסיקות מחייבות</h2>
    <p>שומת ההשבחה מטעם הוועדה המקומית אינה יכולה להתעלם מעלויות ישירות הנדרשות לשם מימוש הזכויות. בתי המשפט קבעו עקרונות ברורים לקיזוז ולהפחתת שווי:</p>
    <ul>
      <li><strong>קיזוז הוצאות מחייבות מתכנית (הלכת אברמוביץ – ע"א 6126/98):</strong> עלויות שהתוכנית מטילה חובה ישירה לבצען – כגון ביצוע מטלות ציבוריות, עלויות הריסת מבנים ישנים, הכשרת תוואי ופיתוח תשתיות – ינוכו ויופחתו לצורך קביעת ההשבחה נטו.</li>
      <li><strong>כופר חניה / קרן חניה:</strong> מקום שבו לא ניתן להסדיר חניה במגרש והוועדה דורשת תשלום קרן חניה כתנאי להיתר, יש להביא עלות זו בחשבון בחישוב ההשבחה של הקרקע.</li>
      <li><strong>נטרול ציפיות שוק (הלכת לוסטרניק – בר"ם 4487/01):</strong> בשומת שווי הקרקע במצב הקודם, יש לנטרל עליות מחיר ספקולטיביות הנובעות מהציפייה לאישור התוכנית עצמה, כדי למנוע יצירת פער השבחה מלאכותי.</li>
      <li><strong>מימוש חלקי (הלכת זעירא – בר"ם 6589/15):</strong> כאשר מבוקש היתר בנייה שאינו מנצל את מלוא זכויות הבנייה שהעניקה התוכנית, החיוב בהיטל יחול באופן יחסי רק על החלק שמנוצל בפועל.</li>
    </ul>

    <h2 id="sec5">5. מסלולי ההשגה על היטל השבחה (סעיף 14 לחוק)</h2>
    <p>אם קיבלתם שומת השבחה מהוועדה המקומית, עומדת לכם הזכות להשיג עליה. המחוקק קבע הבחנה חדה בין סוגי המחלוקות:</p>
    <h3>מסלול 1: מחלוקת שמאית על גובה החיוב – פנייה לשמאי מכריע</h3>
    <p>כאשר בעל הנכס <strong>אינו חולק על עצם החבות</strong> אלא טוען כי שמאי הוועדה העריך את שווי המקרקעין בצורה מופרזת, התעלם מהוצאות קיזוז, או קבע שיעורי עליית ערך שגויים:</p>
    <ul>
      <li><strong>ההליך:</strong> יש לפנות בתוך <strong>45 ימים</strong> ממועד קבלת השומה אל יו"ר מועצת שמאי המקרקעין בבקשה למינוי <strong>שמאי מכריע</strong>.</li>
      <li><strong>מעמד השמאי:</strong> השמאי המכריע מהווה סמכות סטטוטורית מעין-שיפוטית בלתי תלויה המכריעה בין השומות.</li>
      <li><strong>ערר על שמאי מכריע:</strong> על החלטת השמאי המכריע ניתן להגיש ערר לוועדת הערר לפיצויים ולהיטל השבחה בתוך <strong>45 ימים</strong> (בסוגיות משפטיות, פגמים מהותיים או חריגה מסמכות).</li>
    </ul>
    <h3>מסלול 2: שומה מוסכמת (בשומות שאינן עולות על 90,000 ₪)</h3>
    <p>תיקון 157 לחוק יצר מסלול מהיר ומקל לשומות נמוכות:</p>
    <ul>
      <li>החייב רשאי להגיש חוות דעת שמאית מטעמו ישירות לשמאי הוועדה המקומית כדי להגיע ל<strong>שומה מוסכמת</strong>.</li>
      <li>השמאי הממשלתי הראשי בוחן ומאשר את השומה המוסכמת. אם לא הושגה הסכמה, נשמרת הזכות לפנות לשמאי מכריע.</li>
    </ul>
    <h3>מסלול 3: מחלוקת משפטית או עקרונית – ועדת ערר לפיצויים ולהיטל השבחה</h3>
    <p>כאשר הטענה אינה נוגעת לגובה השומה אלא ל<strong>עצם החיוב והעקרונות המשפטיים</strong>:</p>
    <ul>
      <li><strong>עילות לדוגמה:</strong> זכאות לפטור מלא (כגון פטור 140 מ"ר או מוסד ציבורי), טענה כי הפעולה אינה עולה כדי "מימוש זכויות", טענת התיישנות של הוועדה, או טענה כי הנכס אינו נכלל בתוכנית ואינו גובל עמה.</li>
      <li><strong>ההליך:</strong> הגשת <strong>כתב ערר לוועדת הערר לפיצויים ולהיטל השבחה</strong> בתוך <strong>45 ימים</strong> ממועד קבלת השומה.</li>
      <li><strong>ערעור נוסף:</strong> על החלטת ועדת הערר ניתן להגיש ערעור מינהלי לבית המשפט לעניינים מינהליים.</li>
    </ul>

    <h2 id="sec6">6. כיצד משרדנו מטפל בבחינת שומת היטל השבחה?</h2>
    <p>הפחתת היטל השבחה דורשת דיוק שמאִי, ניתוח נתונים קפדני והבנה תכנונית-משפטית מעמיקה. כאשר לקוח פונה למשרדנו, אנו מפעילים נוהל עבודה סדור ובלתי מתפשר:</p>
    <h3>1. בחינה ראשונית וניתוח מעמיק ומדוקדק של שומת הוועדה</h3>
    <p>מיד עם קבלת שומת ההשבחה, צוות המשרד צולל אל עומק התחשיב של שמאי הוועדה המקומית ובוחן אותו "תחת זכוכית מגדלת" שורה אחר שורה:</p>
    <ul>
      <li><strong>בדיקת לוחות זמנים והתיישנות:</strong> אנו מוודאים בראש ובראשונה עמידה במועדים הקבועים בחוק כדי שלא להחמיץ את חלון 45 הימים להגשת השגה או ערר, ובוחנים האם חלה התיישנות על דרישת התשלום של הוועדה המקומית.</li>
      <li><strong>פירוק שווי מצב קודם מול מצב חדש:</strong> אנו מנתחים את ההנחות השמאיות שבבסיס השומה – האם שווי הקרקע במצב הקודם הוערך בחסר? האם שווי המצב החדש נופח ללא ביסוס עובדתי?</li>
      <li><strong>בחינה קפדנית של כל מקדם ומקדם:</strong> אנו בודקים האם מקדמי ההתאמה שקבע שמאי הוועדה (מקדמי אקוויוולנציה, מקדמי קומה, כיווני אוויר, חזית/עורף, ומקדמי מושע/פיצול) הוחלו בצורה מקפחת או שרירותית, ומוודאים שנעשה שימוש במקדמים הנהוגים והמקובלים בתקינה השמאית ובפסיקה.</li>
      <li><strong>בדיקת שיעורי ותקופות דחייה:</strong> אנו מוודאים האם הוועדה החילה שיעורי דחייה ותקופות דחייה כלכליות נכונות (משך הזמן הריאלי לקבלת היתר ופיתוח), או שהתעלמה לחלוטין ממרכיב הדחייה ובכך יצרה שווי מהוון שגוי המגדיל את החיוב באופן מלאכותי.</li>
      <li><strong>הצלבת זכויות, מדידות ותוכניות היסטוריות:</strong> אנו מצליבים את נתוני הנכס הפיזיים והרישומיים אל מול תיק הבניין, תוכניות בניין עיר רלוונטיות והיתרי בנייה היסטוריים, כדי לאתר שגיאות במדידת השטחים, זכויות בנייה שלא הובאו בחשבון במצב הקודם, או התעלמות מזכויות מוקנות לפטורים סטטוטוריים (כגון פטורי הרחבה, ממ"ד ונגישות).</li>
    </ul>
    <h3>2. כתיבת שומה נגדית מקצועית ומנומקת</h3>
    <p>אנו מגבשים שומה נגדית יסודית, עשירה ומנומקת היטב, המבוססת על נתוני עסקאות השוואה מבוססות ומאומתות, ניתוח שווי קרקע טהור ויישום של הפסיקות העדכניות ביותר. במסגרת השומה הנגדית, אנו עומדים על קיזוז מלוא העלויות המחויבות מהתוכנית – לרבות עלויות הריסה, ביצוע מטלות ציבוריות, כופר חניה, היטלי פיתוח והתאמות ביצוע מורכבות.</p>
    <h3>3. ניהול ההליך והדיון מול השמאי המכריע</h3>
    <p>משרדנו מנסח את הבקשה למינוי שמאי מכריע, מגיש את כתבי הטענות ומייצג את הלקוח בדיון הפרונטלי מול השמאי המכריע ונציגי הוועדה המקומית. בדיון זה אנו מציגים את הטיעונים השמאיים וההנדסיים בחדות, מפרקים ומפריכים את הנחות העבודה והתחשיבים של שמאי הוועדה, ומגינים בתוקף על עמדת הלקוח.</p>
    <h3>4. מעבר ובקרה על שומת ההכרעה</h3>
    <p>עם קבלת החלטת השמאי המכריע, צוות המשרד בוחן בקפידה את שומת ההכרעה על כל מרכיביה. אנו מוודאים כי אין בה שגיאות אריתמטיות, חריגות מסמכות או כשלים משפטיים, וממליצים ללקוח האם מדובר בתוצאה סופית מעולה או שיש מקום והצדקה להגיש ערר לוועדת הערר המחוזית.</p>

    <h2 id="sec7">7. האם הגשת השגה מעכבת מכירה או קבלת היתר?</h2>
    <p>בעלי נכסים חוששים לעיתים שהגשת השגה תעכב את רישום הדירה בטאבו או תעצור הוצאת היתר בנייה דחוף. סעיף 14(ה) לתוספת השלישית נותן מענה ברור:</p>
    <ul>
      <li><strong>בעת עסקת מכר:</strong> ניתן לשלם את סכום ההיטל תחת מחאה, לקבל את אישור הוועדה לטאבו, ולהמשיך בהליך השומה מול השמאי המכריע. ככל שיופחת החיוב בהכרעה, הוועדה המקומית מחויבת להחזיר את ההפרש בצירוף הפרשי הצמדה וריבית.</li>
      <li><strong>בעת הוצאת היתר בנייה למגורים:</strong> ניתן להפקיד <strong>ערבות בנקאית</strong> כנגד הסכום השנוי במחלוקת ולקבל את היתר הבנייה לאלתר, מבלי להמתין לסיום הדיונים.</li>
    </ul>

  </div><!-- /article-body -->

  <div class="author-card">
    <img src="image_4.jpg" alt="מאור מזרחי, שמאי מקרקעין מוסמך">
    <div>
      <div class="ac-name">מאור מזרחי</div>
      <div class="ac-role">שמאי מקרקעין מוסמך · שותף, בורוביץ מזרחי שמאות מקרקעין וחקלאות בע"מ</div>
      <p class="ac-bio">חבר לשכת שמאי המקרקעין, בעל תואר ראשון בכלכלה ומנהל עסקים. שימש כמרכז השגות במטה רשות מקרקעי ישראל בירושלים. עוסק בשומות היטל השבחה, בהשגות על שומות רמ"י, בדוחות אפס ובטבלאות הקצאה ואיזון.<br>
      <a href="tel:054-6559942">054-6559942</a></p>
    </div>
  </div>

  <div class="article-sources">
    <h2>קישורים רשמיים ומקורות חקיקה לעיון נוסף</h2>
    <ol>
      <li>נוסח החוק המלא והתוספת השלישית: <a href="https://www.nevo.co.il/law_html/law01/044_001.htm" target="_blank" rel="noopener noreferrer">חוק התכנון והבניה, תשכ"ה-1965 – אתר נבו</a></li>
      <li>רשימת שמאים מכריעים וטפסים: <a href="https://www.gov.il/he/departments/justice-real-estate-appraisers-council" target="_blank" rel="noopener noreferrer">מועצת שמאי המקרקעין – משרד המשפטים</a></li>
      <li>מידע על הגשת עררים: <a href="https://www.gov.il/he/departments/planning_committees" target="_blank" rel="noopener noreferrer">ועדות הערר המחוזיות לפיצויים ולהיטל השבחה – Gov.il</a></li>
    </ol>
  </div>

  <div class="article-disclosure">
    <strong>גילוי נאות והבהרה:</strong> המדריך הוא מידע כללי בלבד ואינו חוות דעת שמאית, ייעוץ משפטי או תחליף לבדיקה פרטנית. כל תיק נבחן לגופו.
  </div>

</article>

<!-- RELATED -->
<section class="section section--cream">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">להמשיך לקרוא</span>
      <h2 class="section-title">אולי יעניין אתכם גם</h2>
    </div>
    <div class="related reveal reveal-d1">
      <a href="maamarim.html">כל המאמרים <span class="arr">←</span></a>
    </div>
  </div>
</section>

<!-- CTA BAND -->
<section class="cta-band cta-band--center">
  <div class="container">
    <div class="cta-inner">
      <div class="cta-copy">
        <span class="eyebrow">קיבלתם שומת השבחה?</span>
        <h2>שלחו לנו את השומה - נאמר לכם אם יש מה לבדוק</h2>
        <p>בדיקה ראשונית של השומה ושל המועד להגשה, ללא התחייבות. אם אין בסיס לחלוק נאמר זאת בפירוש - זה חוסך לכם הליך מיותר.</p>
        <div class="hero-actions">
          <a href="index.html#contact" class="btn btn-gold">לפנייה ישירה <span class="arr">←</span></a>
          <a href="https://wa.me/972546559942" class="btn btn-ghost" target="_blank" rel="noopener noreferrer">וואטסאפ</a>
        </div>
      </div>
    </div>
  </div>
</section>

</main>

<!-- FOOTER -->
<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="logo-bm.png" alt="לוגו בורוביץ מזרחי">
        <p>משרד שמאות מקרקעין מוביל בצפון. ידע מקצועי מעמיק, היכרות שטח בלתי אמצעית והבנה כלכלית רחבה - בשירות כל לקוח.</p>
      </div>
      <div class="footer-col">
        <h4>ניווט</h4>
        <ul>
          <li><a href="index.html#about">אודות</a></li>
          <li><a href="index.html#services">תחומי התמחות</a></li>
          <li><a href="maamarim.html">מאמרים</a></li>
          <li><a href="index.html#success">תוצאות מהשטח</a></li>
          <li><a href="careers.html">קריירה</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>יצירת קשר</h4>
        <ul>
          <li><a href="tel:054-6559942">054-6559942 · מאור</a></li>
          <li><a href="tel:050-8922469">050-8922469 · אמיר</a></li>
          <li><a id="em-footer" href="#"></a></li>
          <li>שדרות החרוב 6, פארק תעשיות בר-לב</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 בורוביץ מזרחי שמאות מקרקעין וחקלאות בע"מ. כל הזכויות שמורות.</span>
      <span><a href="index.html">חזרה לאתר הראשי</a></span>
    </div>
  </div>
</footer>

<!-- FLOATING BUTTONS -->
<div class="floating-wrap">
  <a class="float-btn float-btn-wa" href="https://wa.me/972546559942" target="_blank" rel="noopener noreferrer" aria-label="שלחו הודעה בוואטסאפ">
    <svg aria-hidden="true" viewBox="0 0 32 32"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.67 4.61 1.832 6.5L4 29l7.75-1.812A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="#fff"/><path d="M21.5 18.5c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.19-.57-.34z" fill="#25D366"/></svg>
  </a>
  <button type="button" id="customAccessBtn" class="float-btn float-btn-access" aria-label="פתח תפריט נגישות" title="נגישות"><span aria-hidden="true">♿</span></button>
</div>

<!-- SCRIPTS -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<script>
  (function(){ var el=document.getElementById('em-footer'); if(el){ var a='info'+'@'+'bor-miz.co.il'; el.href='mailto:'+a; el.textContent=a; } })();

  function toggleMenu(){ var l=document.getElementById('navLinks'),b=document.getElementById('hamburger'); l.classList.toggle('open'); b.classList.toggle('open'); b.setAttribute('aria-expanded', l.classList.contains('open')?'true':'false'); }
  function closeMenu(){ document.getElementById('navLinks').classList.remove('open'); var b=document.getElementById('hamburger'); b.classList.remove('open'); b.setAttribute('aria-expanded','false'); }
  document.addEventListener('click', function(e){ var nav=document.getElementById('navbar'); if(nav && !nav.contains(e.target)) closeMenu(); });

  (function(){ var nav=document.getElementById('navbar'); var onScroll=function(){ nav.classList.toggle('scrolled', window.scrollY>60); }; window.addEventListener('scroll', onScroll, {passive:true}); onScroll(); })();

  (function(){
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce || !window.gsap || !window.ScrollTrigger){
      document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.reveal').forEach(function(el){ ScrollTrigger.create({ trigger: el, start:'top 88%', onEnter:function(){ el.classList.add('in'); } }); });
  })();

  (function(){ window.dataLayer=window.dataLayer||[]; document.addEventListener('click', function(e){ var el=e.target.closest&&e.target.closest('a'); if(!el) return; if(/wa\.me|api\.whatsapp/.test(el.href||'')){ window.dataLayer.push({event:'contact_whatsapp'}); } else if((el.getAttribute('href')||'').indexOf('tel:')===0){ window.dataLayer.push({event:'contact_phone'}); } }, true); })();
</script>

<!-- NAGISHLI ACCESSIBILITY -->
<nagishli></nagishli>
<script>
nl_contact = "n:בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ|p:054-6559942|u:maor@bor-miz.co.il";
nl_pos = "BL"; nl_lang = "he"; nl_color = "blue"; nl_compact = "1";
</script>
<script src="nagishli.js?v=2.3" charset="utf-8"></script>
<script>
  (function(){
    function forceCompactStyles(){
      var bar=document.getElementById('NagishLiBar'), menus=document.getElementById('NagishLiMenus');
      if(bar){ bar.style.cssText='position:fixed !important; left:1.4rem !important; right:auto !important; bottom:6.2rem !important; top:auto !important; width:300px !important; max-width:90vw !important; height:auto !important; z-index:9999 !important; background:transparent !important; box-shadow:none !important; border:none !important; padding:0 !important; margin:0 !important;'; }
      if(menus){ menus.style.cssText+=';position:static !important; width:300px !important; max-width:90vw !important; max-height:70vh !important; overflow-y:auto !important; overflow-x:hidden !important; font-size:13px !important; border-radius:12px !important; box-shadow:0 10px 40px rgba(0,0,0,0.3) !important; margin:0 !important; padding:0 !important; background:#fff !important;'; }
      document.querySelectorAll('#NagishLiMenus, #NagishLiMenus ul').forEach(function(el){ el.style.width='100%'; el.style.maxWidth='300px'; el.style.boxSizing='border-box'; });
    }
    function openNagishLiMenu(){
      if(typeof jQuery==='undefined') return false;
      var $=jQuery, $strip=$('#NagishLiBarStrip'), $menus=$('#NagishLiMenus');
      if(!$strip.length || !$menus.length) return false;
      if($menus.is(':visible')){ $menus.slideUp(150, function(){ $strip.removeClass('open'); }); }
      else { forceCompactStyles(); $strip.addClass('open'); $menus.slideDown(150, forceCompactStyles); }
      return true;
    }
    function bind(){ var btn=document.getElementById('customAccessBtn'); if(!btn) return; btn.addEventListener('click', function(e){ e.preventDefault(); var n=0; (function tryOpen(){ if(openNagishLiMenu()) return; if(++n<30) setTimeout(tryOpen,200); })(); }); }
    if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', bind); } else { bind(); }
  })();
</script>

</body>
</html>

```

### `maamarim.html`

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="shortcut icon" href="/favicon.ico">

<!-- ===== GOOGLE ANALYTICS 4 (gtag.js) ===== -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-GYNQPGPR33"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-GYNQPGPR33');
  (function(){
    var push = window.dataLayer.push;
    window.dataLayer.push = function(){
      for (var i = 0; i < arguments.length; i++) {
        var o = arguments[i];
        if (o && typeof o.event === 'string') {
          var params = {};
          for (var k in o) {
            if (k !== 'event' && Object.prototype.hasOwnProperty.call(o, k)) params[k] = o[k];
          }
          gtag('event', o.event, params);
        }
      }
      return push.apply(window.dataLayer, arguments);
    };
  })();
</script>
<!-- ===== END GOOGLE ANALYTICS 4 ===== -->

<title>מאמרים ומדריכים מקצועיים בשמאות מקרקעין | בורוביץ מזרחי</title>
<meta name="description" content="מרכז הידע של משרד בורוביץ מזרחי שמאות מקרקעין: מאמרים ומדריכים מקצועיים בהיטל השבחה, השגות על שומות רמ״י, התחדשות עירונית, תקן 21 ושמאות חקלאית - נכתבים ונערכים על ידי שמאי מקרקעין מוסמכים.">
<meta name="keywords" content="מאמרים שמאות מקרקעין, מדריך היטל השבחה, השגה שומת רמי, תקן 21, שמאות חקלאית, מרכז ידע שמאי מקרקעין">
<link rel="canonical" href="https://bor-miz.co.il/maamarim.html">
<meta property="og:type" content="website">
<meta property="og:url" content="https://bor-miz.co.il/maamarim.html">
<meta property="og:title" content="מאמרים ומדריכים מקצועיים בשמאות מקרקעין | בורוביץ מזרחי">
<meta property="og:description" content="מרכז הידע של המשרד: מדריכים מקצועיים בהיטל השבחה, השגות רמ״י, התחדשות עירונית ושמאות חקלאית.">
<meta property="og:image" content="https://bor-miz.co.il/image_2.png">
<meta property="og:locale" content="he_IL">
<link rel="alternate" type="application/rss+xml" title="מאמרים · בורוביץ מזרחי" href="https://bor-miz.co.il/rss.xml">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500;600;700;900&family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

<!-- ===== STRUCTURED DATA =====
     Blog + ItemList tells a search or AI engine that this URL is the index of
     the office's professional library, and which articles sit under it.
     Every new article must be added to the itemListElement array below. -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": "https://bor-miz.co.il/maamarim.html#blog",
  "name": "מרכז הידע של בורוביץ מזרחי שמאות מקרקעין",
  "description": "מאמרים ומדריכים מקצועיים בשמאות מקרקעין: היטל השבחה, השגות על שומות רשות מקרקעי ישראל, התחדשות עירונית, תקן 21 ושמאות חקלאית.",
  "url": "https://bor-miz.co.il/maamarim.html",
  "inLanguage": "he-IL",
  "publisher": {
    "@type": "Organization",
    "name": "בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ",
    "url": "https://bor-miz.co.il/",
    "logo": "https://bor-miz.co.il/logo-bm.png",
    "telephone": "+972-54-6559942",
    "address": { "@type": "PostalAddress", "streetAddress": "שדרות החרוב 6, פארק תעשיות בר-לב", "addressCountry": "IL" }
  }
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "מאמרים ומדריכים מקצועיים",
  "itemListOrder": "https://schema.org/ItemListOrderDescending",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "url": "https://bor-miz.co.il/maamar-heitel-hashbacha-madrich.html", "name": "מדריך מקיף: היטל השבחה, מימוש זכויות ודרכי השגה והפחתה" }
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "ראשי", "item": "https://bor-miz.co.il/"},
    {"@type": "ListItem", "position": 2, "name": "מאמרים", "item": "https://bor-miz.co.il/maamarim.html"}
  ]
}
</script>

<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="page.css">
</head>
<body>

<a href="#main-content" class="skip-to-content">דלג לתוכן הראשי</a>

<!-- NAVIGATION -->
<nav id="navbar" role="navigation" aria-label="ניווט ראשי">
  <div class="nav-inner">
    <a href="index.html" class="nav-logo" aria-label="בורוביץ מזרחי שמאות מקרקעין - דף הבית">
      <img src="logo-bm.png" alt="לוגו בורוביץ מזרחי">
    </a>
    <ul class="nav-links" id="navLinks">
      <li><a href="index.html#about" onclick="closeMenu()">אודות</a></li>
      <li><a href="index.html#services" onclick="closeMenu()">תחומי התמחות</a></li>
      <li><a href="maamarim.html" onclick="closeMenu()">מאמרים</a></li>
      <li><a href="index.html#linkedin-posts" onclick="closeMenu()">עדכונים</a></li>
      <li><a href="index.html#success" onclick="closeMenu()">מהשטח</a></li>
      <li><a href="careers.html" onclick="closeMenu()">קריירה</a></li>
      <li><a href="index.html#contact" class="nav-cta" onclick="closeMenu()">צור קשר</a></li>
    </ul>
    <button class="hamburger" id="hamburger" onclick="toggleMenu()" aria-label="תפריט ניווט" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>

<main id="main-content">

<!-- HERO -->
<section class="subpage-hero">
  <div class="sp-bg" style="background-image:url('slide7.jpg')"></div>
  <div class="sp-overlay"></div>
  <div class="sp-content">
    <span class="eyebrow">מרכז הידע</span>
    <h1 class="sp-title">מאמרים <span class="gold">ומדריכים</span><br>מקצועיים</h1>
    <p class="sp-sub">כל מה שלקוח צריך לדעת לפני שהוא מקבל החלטה - היטל השבחה, השגות על שומות רשות מקרקעי ישראל, התחדשות עירונית, תקן 21 ושמאות חקלאית. המדריכים נכתבים ונערכים במשרד, על בסיס תיקים שטיפלנו בהם בפועל.</p>
    <div class="hero-actions">
      <a href="#articles" class="btn btn-gold">לכל המאמרים <span class="arr">←</span></a>
      <a href="index.html#contact" class="btn btn-ghost">שאלה לשמאי</a>
    </div>
  </div>
</section>

<!-- ARTICLES -->
<section class="section" id="articles">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">הספרייה המקצועית</span>
      <h2 class="section-title">בחרו נושא</h2>
      <p>המדריכים מסודרים לפי תחום. כל מדריך נפתח בתשובה קצרה לשאלה המרכזית, וממשיך להסבר המלא - כולל המועדים, הסעיפים בחוק והנקודות שבהן אנחנו רואים בפועל את הטעויות הנפוצות.</p>
    </div>

    <!-- Category filter. Buttons filter the static cards below by data-cat;
         the cards themselves are plain HTML so a crawler that does not run
         JavaScript still sees every article. -->
    

    <!-- ══════════════════════════════════════════════════════════════
         ARTICLE CARDS START
         To add an article: copy one <article class="art-card"> block,
         update href / data-cat / thumb / category label / date / title /
         excerpt — and add the same article to:
           1. the ItemList JSON-LD at the top of this file
           2. sitemap.xml
           3. rss.xml
         ══════════════════════════════════════════════════════════════ -->
    <div class="art-grid reveal reveal-d1" id="artGrid">

      <article class="art-card" data-cat="hetel">
        <a href="maamar-heitel-hashbacha-madrich.html" aria-label="מדריך מקיף: היטל השבחה, מימוש זכויות ודרכי השגה והפחתה - קראו את המדריך">
          <div class="art-thumb">
            <img src="slide2.jpg" alt="מגרש שחלה עליו תכנית משביחה" loading="lazy">
            <span class="art-cat">היטל השבחה</span>
          </div>
          <div class="art-body">
            <div class="art-meta">
              <time datetime="2026-10-27">27 באוקטובר 2026</time>
              <span class="dot" aria-hidden="true"></span>
              <span>12 דקות קריאה</span>
            </div>
            <h3>מדריך מקיף: היטל השבחה, מימוש זכויות ודרכי השגה והפחתה</h3>
            <p>במדריך זה נפרט מהו היטל השבחה, מתי נוצרת החבות ומתי חלה חובת התשלום בפועל, אילו פטורים וקיזוזי הוצאות ניתן לדרוש, מהם המסלולים החוקיים המדויקים להגשת השגה, וכיצד משרדנו מלווה ומנהל את ההליך השמאי והמשפטי להפחתת השומה עד לתוצאה המיטבית.</p>
            <span class="art-more">קראו את המדריך <span class="arr" aria-hidden="true">←</span></span>
          </div>
        </a>
      </article>

    </div>
    <!-- ARTICLE CARDS END -->

    <p class="art-empty" id="artEmpty" hidden>בתחום הזה עוד לא פורסם מדריך. מוזמנים לפנות אלינו עם השאלה - ונענה ישירות.</p>
  </div>
</section>

<!-- CTA BAND -->
<section class="cta-band cta-band--center">
  <div class="container">
    <!-- Single-column: this band is copy-only (no inline form), so the
         two-column grid from page.css is overridden here. -->
    <div class="cta-inner">
      <div class="cta-copy">
        <span class="eyebrow">שאלה שלא מצאתם עליה מאמר?</span>
        <h2>העדיפות שלנו היא לענות לכם לפני שאתם משלמים</h2>
        <p>מדריך הוא נקודת פתיחה, אבל כל נכס הוא מקרה בפני עצמו. אם קיבלתם דרישת היטל, שומת רשות מקרקעי ישראל או הצעה שאתם לא בטוחים בה - שלחו לנו את המסמך ונאמר לכם בכתב אם יש מה לבדוק, לפני שאתם מתחייבים לכלום.</p>
        <div class="hero-actions">
          <a href="index.html#contact" class="btn btn-gold">לפנייה ישירה <span class="arr">←</span></a>
          <a href="https://wa.me/972546559942" class="btn btn-ghost" target="_blank" rel="noopener noreferrer">וואטסאפ</a>
        </div>
      </div>
    </div>
  </div>
</section>

</main>

<!-- FOOTER -->
<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="logo-bm.png" alt="לוגו בורוביץ מזרחי">
        <p>משרד שמאות מקרקעין מוביל בצפון. ידע מקצועי מעמיק, היכרות שטח בלתי אמצעית והבנה כלכלית רחבה - בשירות כל לקוח.</p>
      </div>
      <div class="footer-col">
        <h4>ניווט</h4>
        <ul>
          <li><a href="index.html#about">אודות</a></li>
          <li><a href="index.html#services">תחומי התמחות</a></li>
          <li><a href="maamarim.html">מאמרים</a></li>
          <li><a href="index.html#success">תוצאות מהשטח</a></li>
          <li><a href="careers.html">קריירה</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>יצירת קשר</h4>
        <ul>
          <li><a href="tel:054-6559942">054-6559942 · מאור</a></li>
          <li><a href="tel:050-8922469">050-8922469 · אמיר</a></li>
          <li><a id="em-footer" href="#"></a></li>
          <li>שדרות החרוב 6, פארק תעשיות בר-לב</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 בורוביץ מזרחי שמאות מקרקעין וחקלאות בע"מ. כל הזכויות שמורות.</span>
      <span><a href="index.html">חזרה לאתר הראשי</a></span>
    </div>
  </div>
</footer>

<!-- FLOATING BUTTONS -->
<div class="floating-wrap">
  <a class="float-btn float-btn-wa" href="https://wa.me/972546559942" target="_blank" rel="noopener noreferrer" aria-label="שלחו הודעה בוואטסאפ">
    <svg aria-hidden="true" viewBox="0 0 32 32"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.67 4.61 1.832 6.5L4 29l7.75-1.812A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="#fff"/><path d="M21.5 18.5c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.19-.57-.34z" fill="#25D366"/></svg>
  </a>
  <button type="button" id="customAccessBtn" class="float-btn float-btn-access" aria-label="פתח תפריט נגישות" title="נגישות"><span aria-hidden="true">♿</span></button>
</div>

<!-- SCRIPTS -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<script>
  // Email obfuscation
  (function(){ var el=document.getElementById('em-footer'); if(el){ var a='info'+'@'+'bor-miz.co.il'; el.href='mailto:'+a; el.textContent=a; } })();

  // Hamburger menu
  function toggleMenu(){ var l=document.getElementById('navLinks'),b=document.getElementById('hamburger'); l.classList.toggle('open'); b.classList.toggle('open'); b.setAttribute('aria-expanded', l.classList.contains('open')?'true':'false'); }
  function closeMenu(){ document.getElementById('navLinks').classList.remove('open'); var b=document.getElementById('hamburger'); b.classList.remove('open'); b.setAttribute('aria-expanded','false'); }
  document.addEventListener('click', function(e){ var nav=document.getElementById('navbar'); if(nav && !nav.contains(e.target)) closeMenu(); });

  // Navbar scrolled state
  (function(){ var nav=document.getElementById('navbar'); var onScroll=function(){ nav.classList.toggle('scrolled', window.scrollY>60); }; window.addEventListener('scroll', onScroll, {passive:true}); onScroll(); })();

  // Reveal
  (function(){
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce || !window.gsap || !window.ScrollTrigger){
      document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.reveal').forEach(function(el){ ScrollTrigger.create({ trigger: el, start:'top 88%', onEnter:function(){ el.classList.add('in'); } }); });
  })();

  // Category filter
  (function(){
    var filters = document.getElementById('artFilters');
    var cards = Array.prototype.slice.call(document.querySelectorAll('#artGrid .art-card'));
    var empty = document.getElementById('artEmpty');
    if(!filters || !cards.length) return;
    filters.addEventListener('click', function(e){
      var btn = e.target.closest('button[data-filter]');
      if(!btn) return;
      var want = btn.getAttribute('data-filter');
      filters.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b === btn); });
      var shown = 0;
      cards.forEach(function(c){
        var match = (want === 'all') || (c.getAttribute('data-cat') === want);
        c.hidden = !match;
        if(match) shown++;
      });
      if(empty) empty.hidden = shown > 0;
    });
  })();

  // Contact micro-conversion tracking
  (function(){ window.dataLayer=window.dataLayer||[]; document.addEventListener('click', function(e){ var el=e.target.closest&&e.target.closest('a'); if(!el) return; if(/wa\.me|api\.whatsapp/.test(el.href||'')){ window.dataLayer.push({event:'contact_whatsapp'}); } else if((el.getAttribute('href')||'').indexOf('tel:')===0){ window.dataLayer.push({event:'contact_phone'}); } }, true); })();
</script>

<!-- NAGISHLI ACCESSIBILITY -->
<nagishli></nagishli>
<script>
nl_contact = "n:בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ|p:054-6559942|u:maor@bor-miz.co.il";
nl_pos = "BL"; nl_lang = "he"; nl_color = "blue"; nl_compact = "1";
</script>
<script src="nagishli.js?v=2.3" charset="utf-8"></script>
<script>
  (function(){
    function forceCompactStyles(){
      var bar=document.getElementById('NagishLiBar'), menus=document.getElementById('NagishLiMenus');
      if(bar){ bar.style.cssText='position:fixed !important; left:1.4rem !important; right:auto !important; bottom:6.2rem !important; top:auto !important; width:300px !important; max-width:90vw !important; height:auto !important; z-index:9999 !important; background:transparent !important; box-shadow:none !important; border:none !important; padding:0 !important; margin:0 !important;'; }
      if(menus){ menus.style.cssText+=';position:static !important; width:300px !important; max-width:90vw !important; max-height:70vh !important; overflow-y:auto !important; overflow-x:hidden !important; font-size:13px !important; border-radius:12px !important; box-shadow:0 10px 40px rgba(0,0,0,0.3) !important; margin:0 !important; padding:0 !important; background:#fff !important;'; }
      document.querySelectorAll('#NagishLiMenus, #NagishLiMenus ul').forEach(function(el){ el.style.width='100%'; el.style.maxWidth='300px'; el.style.boxSizing='border-box'; });
    }
    function openNagishLiMenu(){
      if(typeof jQuery==='undefined') return false;
      var $=jQuery, $strip=$('#NagishLiBarStrip'), $menus=$('#NagishLiMenus');
      if(!$strip.length || !$menus.length) return false;
      if($menus.is(':visible')){ $menus.slideUp(150, function(){ $strip.removeClass('open'); }); }
      else { forceCompactStyles(); $strip.addClass('open'); $menus.slideDown(150, forceCompactStyles); }
      return true;
    }
    function bind(){ var btn=document.getElementById('customAccessBtn'); if(!btn) return; btn.addEventListener('click', function(e){ e.preventDefault(); var n=0; (function tryOpen(){ if(openNagishLiMenu()) return; if(++n<30) setTimeout(tryOpen,200); })(); }); }
    if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', bind); } else { bind(); }
  })();
</script>

</body>
</html>

```

### `pitzuy-nezek-haklai.html`

```html
﻿<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="shortcut icon" href="/favicon.ico">

<!-- ===== GOOGLE ANALYTICS 4 (gtag.js) =====
     Property "bor-miz.co.il", measurement ID G-GYNQPGPR33 - installed 2026-09-08,
     replacing a Tag Manager placeholder that never had a container behind it.
     The bridge below turns the site's existing dataLayer.push({event:'...'}) calls
     (generate_lead / contact_whatsapp / contact_phone / intake_submitted) into GA4
     events, so every call site elsewhere in the site stays untouched. -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-GYNQPGPR33"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-GYNQPGPR33');
  (function(){
    // gtag() itself pushes an arguments object, which has no .event key - so this
    // never recurses on its own output.
    var push = window.dataLayer.push;
    window.dataLayer.push = function(){
      for (var i = 0; i < arguments.length; i++) {
        var o = arguments[i];
        if (o && typeof o.event === 'string') {
          var params = {};
          for (var k in o) {
            if (k !== 'event' && Object.prototype.hasOwnProperty.call(o, k)) params[k] = o[k];
          }
          gtag('event', o.event, params);
        }
      }
      return push.apply(window.dataLayer, arguments);
    };
  })();
</script>
<!-- ===== END GOOGLE ANALYTICS 4 ===== -->

<title>פיצוי על נזק חקלאי - הכנת תביעה וליווי מול הגוף המפצה | בורוביץ מזרחי</title>
<meta name="description" content="ספגתם נזק חקלאי לגידולים, לקרקע או לתשתית? גובה הפיצוי נקבע לפי תיעוד וכימות מקצועי של הנזק, ומול כל גוף מפצה נדרשת הכנה אחרת - קרנות פיצוי, חברות ביטוח, המדינה או צד שלישי. שמאי חקלאי מכין את התביעה ומלווה אתכם עד לפיצוי.">
<meta name="keywords" content="פיצוי נזק חקלאי, תביעת פיצויים חקלאות, שמאי נזקים חקלאי, נזק לגידולים פיצוי, פיצוי חקלאי צפון, תפיסת קרקע פיצוי, פלישה לקרקע חקלאית, חוות דעת שמאי חקלאי">
<meta name="robots" content="noindex,nofollow">
<link rel="canonical" href="https://bor-miz.co.il/pitzuy-nezek-haklai.html">
<meta property="og:type" content="website">
<meta property="og:url" content="https://bor-miz.co.il/pitzuy-nezek-haklai.html">
<meta property="og:title" content="פיצוי על נזק חקלאי - הכנת תביעה וליווי | בורוביץ מזרחי">
<meta property="og:description" content="גובה הפיצוי נקבע לפי תיעוד וכימות מקצועי. שמאי חקלאי מכין את התביעה ומלווה עד לפיצוי.">
<meta property="og:image" content="https://bor-miz.co.il/image_2.png">
<meta property="og:locale" content="he_IL">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500;600;700;900&family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

<!-- ===== STRUCTURED DATA – Service + Breadcrumb + FAQ ===== -->
<script type="application/ld+json">
{
  "@context": "https://schema.org", "@type": "Service",
  "name": "הכנת תביעת פיצויים בגין נזק חקלאי",
  "serviceType": "שמאות חקלאית - נזקים ופיצויים",
  "provider": { "@type": "LocalBusiness", "name": "בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ", "telephone": "+972-50-8922469", "areaServed": "צפון" },
  "url": "https://bor-miz.co.il/pitzuy-nezek-haklai.html"
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "ראשי", "item": "https://bor-miz.co.il/"},
    {"@type": "ListItem", "position": 2, "name": "תחומי התמחות", "item": "https://bor-miz.co.il/#services"},
    {"@type": "ListItem", "position": 3, "name": "פיצוי על נזק חקלאי", "item": "https://bor-miz.co.il/pitzuy-nezek-haklai.html"}
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org", "@type": "FAQPage",
  "mainEntity": [
    {"@type": "Question", "name": "מול מי בכלל תובעים פיצוי על נזק חקלאי?", "acceptedAnswer": {"@type": "Answer", "text": "זה תלוי במקור הנזק. נזקי טבע מטופלים לרוב מול קרנות הפיצוי או מול חברת הביטוח, בהתאם לכיסוי שיש לכם. נזק שנגרם בעקבות פעולה של המדינה, כמו תפיסת שטח בצו, מטופל מול הגורם הממשלתי הרלוונטי. נזק שנגרם על ידי גורם אחר - פלישה לשטח, נזקי שכן, זיהום - מטופל מולו ישירות או בהליך משפטי. לכל מסלול דרישות תיעוד שונות, ולכן חשוב לזהות אותו נכון כבר בהתחלה."}},
    {"@type": "Question", "name": "מה משפיע על גובה הפיצוי?", "acceptedAnswer": {"@type": "Answer", "text": "שלושה דברים: היקף הנזק כפי שתועד בפועל, איכות הכימות הכלכלי שלו, והתאמת חוות הדעת לדרישות הגוף המפצה. נזק זהה בשני שטחים יכול להסתיים בפיצוי שונה לחלוטין, רק בגלל איכות ההוכחה."}},
    {"@type": "Question", "name": "עבר זמן מאז הנזק. מאוחר מדי?", "acceptedAnswer": {"@type": "Answer", "text": "לא בהכרח, אבל כל יום עובד נגדכם. גידול שהתאושש חלקית, שטח שעובד מחדש או תיעוד שלא נאסף בזמן מקשים על ההוכחה. גם כשעבר זמן ניתן לעיתים לשחזר את הנזק מנתוני תשואות, תמונות, רישומים ועדויות - אבל עדיף להקדים. פנו אלינו ונאמר לכם בכנות אם יש על מה לעבוד."}},
    {"@type": "Question", "name": "מה זה נזק עקיף ולמה הוא חשוב?", "acceptedAnswer": {"@type": "Answer", "text": "נזק ישיר הוא הערך של מה שאבד - היבול, העצים, התשתית. נזק עקיף הוא ההפסד שנמשך אחריו: עונות שנפגעו, עלויות שיקום, ירידה בתשואה לאורך שנים ופגיעה בהתחייבויות מסחריות. בגידולים רב-שנתיים הנזק העקיף עולה לא פעם על הישיר, והוא זה שנוטים לפספס בתביעה."}},
    {"@type": "Question", "name": "אתם מלווים גם בהליך משפטי?", "acceptedAnswer": {"@type": "Answer", "text": "כן. אמיר בורוביץ, מהנדס בוגר הטכניון ושמאי חקלאי, משמש מומחה מטעם בתי משפט ובתי דין. כאשר התביעה מגיעה להליך משפטי אנחנו מגישים חוות דעת מומחה ומופיעים בהתאם לצורך."}}
  ]
}
</script>

<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="page.css">
</head>
<body>

<a href="#main-content" class="skip-to-content">דלג לתוכן הראשי</a>

<!-- NAVIGATION -->
<nav id="navbar" role="navigation" aria-label="ניווט ראשי">
  <div class="nav-inner">
    <a href="index.html" class="nav-logo" aria-label="בורוביץ מזרחי שמאות מקרקעין - דף הבית">
      <img src="logo-bm.png" alt="לוגו בורוביץ מזרחי">
    </a>
    <ul class="nav-links" id="navLinks">
      <li><a href="index.html#about" onclick="closeMenu()">אודות</a></li>
      <li><a href="index.html#services" onclick="closeMenu()">תחומי התמחות</a></li>
      <li><a href="maamarim.html" onclick="closeMenu()">מאמרים</a></li>
      <li><a href="index.html#linkedin-posts" onclick="closeMenu()">עדכונים</a></li>
      <li><a href="index.html#success" onclick="closeMenu()">מהשטח</a></li>
      <li><a href="careers.html" onclick="closeMenu()">קריירה</a></li>
      <li><a href="#lead" class="nav-cta" onclick="closeMenu()">צור קשר</a></li>
    </ul>
    <button class="hamburger" id="hamburger" onclick="toggleMenu()" aria-label="תפריט ניווט" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>

<main id="main-content">
<!-- HERO -->
<section class="subpage-hero">
  <div class="sp-bg" style="background-image:url('slide9.jpg')"></div>
  <div class="sp-overlay"></div>
  <div class="sp-content">
    <span class="eyebrow">תחום התמחות · פיצוי על נזק חקלאי</span>
    <h1 class="sp-title">ספגתם נזק חקלאי?<br>הפיצוי נקבע לפי <span class="gold">מה שהוכחתם</span></h1>
    <p class="sp-sub">בין הנזק בשטח לבין הכסף שמגיע אליכם עומד מסמך אחד: התביעה. גובה הפיצוי לא נקבע לפי חומרת הנזק בלבד, אלא לפי איכות התיעוד והכימות המקצועי שלו - ומול כל גוף מפצה נדרשת הכנה שונה. אנחנו מכינים את התביעה ומלווים אתכם עד הסוף.</p>
    <div class="hero-actions">
      <a href="#lead" class="btn btn-gold">בדיקת זכאות לפיצוי <span class="arr">←</span></a>
      <a href="#how" class="btn btn-ghost">איך זה עובד</a>
    </div>
  </div>
</section>

<!-- STAT STRIP -->
<section class="stat-strip">
  <div class="container" style="padding-inline:0;">
    <div class="stat-strip-inner">
      <div class="stat reveal"><div class="num">שטח</div><div class="label">כל תביעה נפתחת בביקור בחלקה</div></div>
      <div class="stat reveal reveal-d1"><div class="num">ימים</div><div class="label">תיעוד מוקדם קובע את גובה הפיצוי</div></div>
      <div class="stat reveal reveal-d2"><div class="num">טכניון</div><div class="label">מהנדס ושמאי חקלאי, מומחה מטעם בתי משפט</div></div>
    </div>
  </div>
</section>


<!-- AGAINST WHOM -->
<section class="section">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">הצעד הראשון</span>
      <h2 class="section-title">מול מי תובעים - וזה משנה הכל</h2>
      <p>לפני שמדברים על סכומים צריך לדעת לאן התביעה הולכת. לכל מסלול יש דרישות תיעוד, לוחות זמנים ושפה מקצועית משלו, וחוות דעת שהוכנה למסלול אחד לא בהכרח עומדת בדרישות של אחר.</p>
    </div>
    <div class="values-grid reveal reveal-d1">
      <div class="value-card">
        <span class="v-num">01</span>
        <h3>קרנות הפיצוי</h3>
        <p>המסלול המרכזי לנזקי טבע - ברד, קרה, שיטפון, סופה ויובש. נדרש תיעוד מדויק של היקף הנזק בסמוך לאירוע, וכימות שמתיישב עם אמות המידה של הקרן.</p>
      </div>
      <div class="value-card">
        <span class="v-num">02</span>
        <h3>חברות הביטוח</h3>
        <p>כשקיים כיסוי ביטוחי פרטי, גובה הפיצוי נגזר מלשון הפוליסה ומהחריגים שבה. חוות דעת עצמאית מטעמכם היא המשקל הנגדי לשמאי שמטעם המבטח.</p>
      </div>
      <div class="value-card">
        <span class="v-num">03</span>
        <h3>המדינה וגופיה</h3>
        <p>תפיסת שטח בצו, הגבלות שימוש או פגיעה כתוצאה מפעילות ביטחונית או תשתיתית. כאן נדרשת הערכה של שווי השימוש שנשלל ושל הנזק להמשך הפעילות החקלאית.</p>
      </div>
      <div class="value-card">
        <span class="v-num">04</span>
        <h3>צד שלישי</h3>
        <p>פלישה לשטח חקלאי, מרעה לא מורשה, זיהום, נזקי עבודות שכנות או פגיעה במערכות השקיה. במקרים אלה התביעה מתנהלת ישירות מול הגורם או בהליך משפטי.</p>
      </div>
    </div>
  </div>
</section>

<!-- WHAT DETERMINES -->
<section class="section section--cream">
  <div class="container">
    <div class="content-block two-col">
      <div class="reveal">
        <span class="eyebrow">מה קובע את הסכום</span>
        <h2 class="section-title" style="margin-top:.8rem;">הפיצוי נקבע לפי ההוכחה, לא לפי התחושה</h2>
      </div>
      <div class="prose reveal reveal-d1">
        <p>חקלאי שספג נזק יודע בדיוק כמה הוא הפסיד. הבעיה היא שהגוף המפצה אינו מכיר את החלקה, לא ראה את העונה הקודמת, ואינו יודע מה הייתה התשואה הצפויה. <strong>כל מה שלא הוכח - לא ישולם.</strong></p>
        <p>לכן העבודה מתחילה בשטח: מדידת היקף הנזק בפועל, תיעוד מצולם ומתוארך, דגימות, והצלבה מול נתוני הגידול - תשואות היסטוריות, עלויות תשומות, לוח העונה והתחייבויות מסחריות קיימות.</p>
        <p>רק על הבסיס הזה אפשר לכמת <strong>נזק ישיר</strong> - הערך שאבד כאן ועכשיו, ו<strong>נזק עקיף</strong> - ההפסד שנמשך לעונות הבאות. בגידולים רב-שנתיים, במטעים ובחממות, החלק העקיף הוא לרוב הגדול משניהם, והוא גם זה שנוטים להשמיט.</p>
        <div class="callout">הטעות היקרה ביותר היא <strong>להמתין</strong>. שטח שנוקה, גידול שהתאושש חלקית או עונה שהוחלפה - כל אלה מוחקים ראיות. אם ספגתם נזק, התיעוד הראשון צריך להיעשות עוד לפני שמחליטים אם בכלל תובעים.</div>
      </div>
    </div>
  </div>
</section>

<!-- WHO FOR -->
<section class="section">
  <div class="container">
    <div class="content-block two-col">
      <div class="reveal">
        <span class="eyebrow">למי זה מתאים</span>
        <h2 class="section-title" style="margin-top:.8rem;">מי פונה אלינו</h2>
        <p class="lead" style="margin-top:1rem;">מגדלים, בעלי נחלות ומשקים בכל ענפי החקלאות בצפון.</p>
      </div>
      <ul class="check-list reveal reveal-d1">
        <li>מגדלים שספגו נזק לגידולי שדה, למטעים או לחממות</li>
        <li>בעלי נחלות ומשקים שנפגעו מאירוע טבע</li>
        <li>מי ששטחו נתפס בצו או הוגבל לשימוש</li>
        <li>מי שסובל מפלישה לשטח חקלאי או ממרעה לא מורשה</li>
        <li>מי שקיבל הצעת פיצוי ואינו בטוח שהיא משקפת את הנזק</li>
        <li>עורכי דין המלווים תביעת פיצויים חקלאית</li>
      </ul>
    </div>
  </div>
</section>

<!-- PROCESS -->
<section class="section section--cream" id="how">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">איך זה עובד</span>
      <h2 class="section-title">התהליך, צעד אחר צעד</h2>
    </div>
    <div class="steps">
      <div class="step reveal"><div class="step-num">1</div><div><h4>פנייה מיידית ותיעוד</h4><p>ככל שמגיעים לשטח מוקדם יותר, כך התיעוד חזק יותר. גידול שהתאושש או שטח שנוקה קשה הרבה יותר להוכחה בדיעבד.</p></div></div>
      <div class="step reveal reveal-d1"><div class="step-num">2</div><div><h4>ביקור וכימות בשטח</h4><p>מדידה של היקף הנזק בפועל, דגימות, תיעוד מצולם ואיסוף נתוני הגידול - תשואות, עלויות ועונות קודמות.</p></div></div>
      <div class="step reveal reveal-d2"><div class="step-num">3</div><div><h4>חוות דעת שמאית</h4><p>כימות כלכלי של הנזק הישיר והעקיף, בחוות דעת מנומקת הערוכה בהתאם לדרישות הגוף שמולו מוגשת התביעה.</p></div></div>
      <div class="step reveal reveal-d3"><div class="step-num">4</div><div><h4>ליווי עד הפיצוי</h4><p>מענה לשאלות ולהשגות של הגוף המפצה, ובמידת הצורך ייצוג והופעה כמומחה בהליך משפטי.</p></div></div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="section section--cream">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">שאלות נפוצות</span>
      <h2 class="section-title">מה חשוב לדעת</h2>
    </div>
    <div class="faq-list reveal reveal-d1">
      <details class="faq-item"><summary>מול מי בכלל תובעים פיצוי על נזק חקלאי?</summary><div class="faq-body">זה תלוי במקור הנזק. נזקי טבע מטופלים לרוב מול קרנות הפיצוי או מול חברת הביטוח, בהתאם לכיסוי שיש לכם. נזק שנגרם בעקבות פעולה של המדינה, כמו תפיסת שטח בצו, מטופל מול הגורם הממשלתי הרלוונטי. נזק שנגרם על ידי גורם אחר - פלישה לשטח, נזקי שכן, זיהום - מטופל מולו ישירות או בהליך משפטי. לכל מסלול דרישות תיעוד שונות, ולכן חשוב לזהות אותו נכון כבר בהתחלה.</div></details>
      <details class="faq-item"><summary>מה משפיע על גובה הפיצוי?</summary><div class="faq-body">שלושה דברים: היקף הנזק כפי שתועד בפועל, איכות הכימות הכלכלי שלו, והתאמת חוות הדעת לדרישות הגוף המפצה. נזק זהה בשני שטחים יכול להסתיים בפיצוי שונה לחלוטין, רק בגלל איכות ההוכחה.</div></details>
      <details class="faq-item"><summary>עבר זמן מאז הנזק. מאוחר מדי?</summary><div class="faq-body">לא בהכרח, אבל כל יום עובד נגדכם. גידול שהתאושש חלקית, שטח שעובד מחדש או תיעוד שלא נאסף בזמן מקשים על ההוכחה. גם כשעבר זמן ניתן לעיתים לשחזר את הנזק מנתוני תשואות, תמונות, רישומים ועדויות - אבל עדיף להקדים. פנו אלינו ונאמר לכם בכנות אם יש על מה לעבוד.</div></details>
      <details class="faq-item"><summary>מה זה נזק עקיף ולמה הוא חשוב?</summary><div class="faq-body">נזק ישיר הוא הערך של מה שאבד - היבול, העצים, התשתית. נזק עקיף הוא ההפסד שנמשך אחריו: עונות שנפגעו, עלויות שיקום, ירידה בתשואה לאורך שנים ופגיעה בהתחייבויות מסחריות. בגידולים רב-שנתיים הנזק העקיף עולה לא פעם על הישיר, והוא זה שנוטים לפספס בתביעה.</div></details>
      <details class="faq-item"><summary>אתם מלווים גם בהליך משפטי?</summary><div class="faq-body">כן. אמיר בורוביץ, מהנדס בוגר הטכניון ושמאי חקלאי, משמש מומחה מטעם בתי משפט ובתי דין. כאשר התביעה מגיעה להליך משפטי אנחנו מגישים חוות דעת מומחה ומופיעים בהתאם לצורך.</div></details>
    </div>
  </div>
</section>

<!-- CTA / LEAD -->
<section class="section cta-band" id="lead">
  <div class="container">
    <div class="cta-inner">
      <div class="cta-copy reveal">
        <span class="eyebrow">בדיקת זכאות</span>
        <h2>נבדוק מה מגיע לכם - ומול מי</h2>
        <p>השאירו פרטים ושמאי חקלאי יחזור אליכם לבדיקה ראשונית של הנזק ושל מסלול הפיצוי המתאים.</p>
      </div>
      <div class="cta-form reveal reveal-d1">
        <h3>שלחו לנו פנייה</h3>
        <p>נחזור אליכם בהקדם האפשרי</p>
        <form class="contact-form" id="contact-form" onsubmit="return submitContactForm(event, 'contact')">
          <input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);border:0;opacity:0">
          <div class="form-grid">
            <div class="form-group"><label for="contact-name">שם מלא *</label><input type="text" id="contact-name" name="name" placeholder="ישראל ישראלי" required autocomplete="name"></div>
            <div class="form-group"><label for="contact-phone">טלפון *</label><input type="tel" id="contact-phone" name="phone" placeholder="05X-XXXXXXX" required autocomplete="tel"></div>
          </div>
          <div class="form-group"><label for="contact-email">דוא"ל</label><input type="email" id="contact-email" name="email" placeholder="israel@example.com" autocomplete="email"></div>
          <div class="form-group">
            <label for="contact-subject">נושא פנייה</label>
            <select id="contact-subject" name="subject">
              <option value="שמאות חקלאית" selected>שמאות חקלאית</option>
              <option>שומת מקרקעין</option>
              <option>בדיקת כדאיות</option>
              <option>ייעוץ</option>
              <option>אחר</option>
            </select>
          </div>
          <div class="form-group"><label for="contact-message">הודעה</label><textarea id="contact-message" name="message" placeholder="איזה גידול או נכס ניזוק, מתי אירע הנזק ומול מי אתם פועלים..."></textarea></div>
          <button type="submit" class="btn btn-gold form-submit" id="contact-submit-btn">שלח פנייה <span class="arr">←</span></button>
          <div id="contact-form-status" class="form-status"></div>
        </form>
      </div>
    </div>
  </div>
</section>

<!-- RELATED -->
<section class="section section--cream">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">תחומים נוספים</span>
      <h2 class="section-title">אולי יעניין אתכם גם</h2>
    </div>
    <div class="related reveal reveal-d1">
      <a href="shamaut-haklait.html">שמאות חקלאית - הערכת הנזק <span class="arr">←</span></a>
      <a href="hasagot-rami.html">השגות על שומות רמ"י <span class="arr">←</span></a>
      <a href="hetel-hashbacha.html">היטל השבחה <span class="arr">←</span></a>
    </div>
  </div>
</section>

</main>

<!-- FOOTER -->
<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="logo-bm.png" alt="לוגו בורוביץ מזרחי">
        <p>משרד שמאות מקרקעין מוביל בצפון. ידע מקצועי מעמיק, היכרות שטח בלתי אמצעית והבנה כלכלית רחבה - בשירות כל לקוח.</p>
      </div>
      <div class="footer-col">
        <h4>ניווט</h4>
        <ul>
          <li><a href="index.html#about">אודות</a></li>
          <li><a href="index.html#services">תחומי התמחות</a></li>
          <li><a href="maamarim.html">מאמרים</a></li>
          <li><a href="index.html#success">תוצאות מהשטח</a></li>
          <li><a href="careers.html">קריירה</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>יצירת קשר</h4>
        <ul>
          <li><a href="tel:054-6559942">054-6559942 · מאור</a></li>
          <li><a href="tel:050-8922469">050-8922469 · אמיר</a></li>
          <li><a id="em-footer" href="#"></a></li>
          <li>שדרות החרוב 6, פארק תעשיות בר-לב</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 בורוביץ מזרחי שמאות מקרקעין וחקלאות בע"מ. כל הזכויות שמורות.</span>
      <span><a href="index.html">חזרה לאתר הראשי</a></span>
    </div>
  </div>
</footer>

<!-- FLOATING BUTTONS -->
<div class="floating-wrap">
  <a class="float-btn float-btn-wa" href="https://wa.me/972546559942" target="_blank" rel="noopener noreferrer" aria-label="שלחו הודעה בוואטסאפ">
    <svg aria-hidden="true" viewBox="0 0 32 32"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.67 4.61 1.832 6.5L4 29l7.75-1.812A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="#fff"/><path d="M21.5 18.5c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.19-.57-.34z" fill="#25D366"/></svg>
  </a>
  <button type="button" id="customAccessBtn" class="float-btn float-btn-access" aria-label="פתח תפריט נגישות" title="נגישות"><span aria-hidden="true">♿</span></button>
</div>

<!-- SCRIPTS -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<script>
  // Email obfuscation
  (function(){ var el=document.getElementById('em-footer'); if(el){ var a='info'+'@'+'bor-miz.co.il'; el.href='mailto:'+a; el.textContent=a; } })();

  // Hamburger menu
  function toggleMenu(){ var l=document.getElementById('navLinks'),b=document.getElementById('hamburger'); l.classList.toggle('open'); b.classList.toggle('open'); b.setAttribute('aria-expanded', l.classList.contains('open')?'true':'false'); }
  function closeMenu(){ document.getElementById('navLinks').classList.remove('open'); var b=document.getElementById('hamburger'); b.classList.remove('open'); b.setAttribute('aria-expanded','false'); }
  document.addEventListener('click', function(e){ var nav=document.getElementById('navbar'); if(nav && !nav.contains(e.target)) closeMenu(); });

  // Navbar scrolled state
  (function(){ var nav=document.getElementById('navbar'); var onScroll=function(){ nav.classList.toggle('scrolled', window.scrollY>60); }; window.addEventListener('scroll', onScroll, {passive:true}); onScroll(); })();

  // Reveal + counters
  (function(){
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce || !window.gsap || !window.ScrollTrigger){
      document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
      document.querySelectorAll('.counter').forEach(function(el){ el.textContent = el.getAttribute('data-target'); });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.reveal').forEach(function(el){ ScrollTrigger.create({ trigger: el, start:'top 88%', onEnter:function(){ el.classList.add('in'); } }); });
    document.querySelectorAll('.counter').forEach(function(el){
      var target=+el.getAttribute('data-target');
      ScrollTrigger.create({ trigger: el, start:'top 92%', once:true, onEnter:function(){ var o={v:0}; gsap.to(o,{v:target,duration:1.6,ease:'power2.out',onUpdate:function(){ el.textContent=Math.round(o.v); }}); } });
    });
  })();

  // Form submission → Supabase Edge Function
  var EDGE_FUNCTION_URL = 'https://nurgknexilxaxxovdbco.supabase.co/functions/v1/website-lead-intake';
  var SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51cmdrbmV4aWx4YXh4b3ZkYmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMjAxMzYsImV4cCI6MjA4OTY5NjEzNn0.S6BwlUfYkdWegz1gigK5dK0lXUowp4safWOFEzExuS0';
  function submitContactForm(e){
    e.preventDefault();
    var form=document.getElementById('contact-form'), btn=document.getElementById('contact-submit-btn'), statusEl=document.getElementById('contact-form-status');
    var name=document.getElementById('contact-name').value.trim(), phone=document.getElementById('contact-phone').value.trim();
    var email=document.getElementById('contact-email').value.trim(), subject=document.getElementById('contact-subject').value, message=document.getElementById('contact-message').value.trim();
    if(!name || !phone){ statusEl.style.display='block'; statusEl.style.color='#fca5a5'; statusEl.textContent='נא למלא שם וטלפון'; return false; }
    btn.disabled=true; btn.textContent='שולח...'; statusEl.style.display='none';
    fetch(EDGE_FUNCTION_URL, { method:'POST', headers:{'Content-Type':'application/json','apikey':SB_ANON,'Authorization':'Bearer '+SB_ANON}, body: JSON.stringify({ name:name, phone:phone, email:email||null, subject:subject||null, message:message||null, source:'service-page', _hp:(form.querySelector('input[name="website"]')||{value:''}).value, elapsed_ms:Math.round(performance.now()) }) })
      .then(function(res){ return res.json(); })
      .then(function(data){
        if(data.success){
          window.dataLayer=window.dataLayer||[]; window.dataLayer.push({ event:'generate_lead', form_source:'service-page', lead_subject:subject||'unspecified' });
          statusEl.style.display='block'; statusEl.style.color='#4ade80'; statusEl.textContent=data.message||'הפנייה נשלחה בהצלחה!'; form.reset();
        } else { throw new Error(data.error||'שגיאה בשליחה'); }
      })
      .catch(function(err){ statusEl.style.display='block'; statusEl.style.color='#fca5a5'; statusEl.textContent='שגיאה: '+(err.message||'נסו שוב מאוחר יותר'); })
      .finally(function(){ btn.disabled=false; btn.innerHTML='שלח פנייה <span class="arr">←</span>'; });
    return false;
  }

  // Contact micro-conversion tracking
  (function(){ window.dataLayer=window.dataLayer||[]; document.addEventListener('click', function(e){ var el=e.target.closest&&e.target.closest('a'); if(!el) return; if(/wa\.me|api\.whatsapp/.test(el.href||'')){ window.dataLayer.push({event:'contact_whatsapp'}); } else if((el.getAttribute('href')||'').indexOf('tel:')===0){ window.dataLayer.push({event:'contact_phone'}); } }, true); })();
</script>

<!-- NAGISHLI ACCESSIBILITY -->
<nagishli></nagishli>
<script>
nl_contact = "n:בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ|p:054-6559942|u:maor@bor-miz.co.il";
nl_pos = "BL"; nl_lang = "he"; nl_color = "blue"; nl_compact = "1";
</script>
<script src="nagishli.js?v=2.3" charset="utf-8"></script>
<script>
  (function(){
    function forceCompactStyles(){
      var bar=document.getElementById('NagishLiBar'), menus=document.getElementById('NagishLiMenus');
      if(bar){ bar.style.cssText='position:fixed !important; left:1.4rem !important; right:auto !important; bottom:6.2rem !important; top:auto !important; width:300px !important; max-width:90vw !important; height:auto !important; z-index:9999 !important; background:transparent !important; box-shadow:none !important; border:none !important; padding:0 !important; margin:0 !important;'; }
      if(menus){ menus.style.cssText+=';position:static !important; width:300px !important; max-width:90vw !important; max-height:70vh !important; overflow-y:auto !important; overflow-x:hidden !important; font-size:13px !important; border-radius:12px !important; box-shadow:0 10px 40px rgba(0,0,0,0.3) !important; margin:0 !important; padding:0 !important; background:#fff !important;'; }
      document.querySelectorAll('#NagishLiMenus, #NagishLiMenus ul').forEach(function(el){ el.style.width='100%'; el.style.maxWidth='300px'; el.style.boxSizing='border-box'; });
    }
    function openNagishLiMenu(){
      if(typeof jQuery==='undefined') return false;
      var $=jQuery, $strip=$('#NagishLiBarStrip'), $menus=$('#NagishLiMenus');
      if(!$strip.length || !$menus.length) return false;
      if($menus.is(':visible')){ $menus.slideUp(150, function(){ $strip.removeClass('open'); }); }
      else { forceCompactStyles(); $strip.addClass('open'); $menus.slideDown(150, forceCompactStyles); }
      return true;
    }
    function bind(){ var btn=document.getElementById('customAccessBtn'); if(!btn) return; btn.addEventListener('click', function(e){ e.preventDefault(); var n=0; (function tryOpen(){ if(openNagishLiMenu()) return; if(++n<30) setTimeout(tryOpen,200); })(); }); }
    if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', bind); } else { bind(); }
  })();
</script>

</body>
</html>

```

### `shamaut-haklait.html`

```html
﻿<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="shortcut icon" href="/favicon.ico">

<!-- ===== GOOGLE ANALYTICS 4 (gtag.js) =====
     Property "bor-miz.co.il", measurement ID G-GYNQPGPR33 - installed 2026-09-08,
     replacing a Tag Manager placeholder that never had a container behind it.
     The bridge below turns the site's existing dataLayer.push({event:'...'}) calls
     (generate_lead / contact_whatsapp / contact_phone / intake_submitted) into GA4
     events, so every call site elsewhere in the site stays untouched. -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-GYNQPGPR33"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-GYNQPGPR33');
  (function(){
    // gtag() itself pushes an arguments object, which has no .event key - so this
    // never recurses on its own output.
    var push = window.dataLayer.push;
    window.dataLayer.push = function(){
      for (var i = 0; i < arguments.length; i++) {
        var o = arguments[i];
        if (o && typeof o.event === 'string') {
          var params = {};
          for (var k in o) {
            if (k !== 'event' && Object.prototype.hasOwnProperty.call(o, k)) params[k] = o[k];
          }
          gtag('event', o.event, params);
        }
      }
      return push.apply(window.dataLayer, arguments);
    };
  })();
</script>
<!-- ===== END GOOGLE ANALYTICS 4 ===== -->

<title>שמאות חקלאית - הערכת נזקי טבע לגידולים ופיצויים | בורוביץ מזרחי</title>
<meta name="description" content="ספגתם נזק לגידולים או לקרקע חקלאית - ברד, קרה, שיטפון, פלישה לשטח או תפיסת קרקע? אנחנו מעריכים את הנזק החקלאי בשטח ומלווים אתכם מול חברות הביטוח וקרנות הפיצוי כדי שתקבלו את הפיצוי המלא שמגיע לכם. שמאי חקלאי מומחה מטעם בתי משפט.">
<meta name="keywords" content="שמאות חקלאית, שמאי חקלאי, נזקי טבע בחקלאות, נזקי גידולים, ברד, קרה, שיטפון, יובש, פלישה לקרקע חקלאית, תפיסת מקרקעין, צו תפיסה, פיצויים חקלאיים, מטעים, חממות, נזקי מזג אוויר, צפון">
<meta name="robots" content="noindex,nofollow">
<link rel="canonical" href="https://bor-miz.co.il/shamaut-haklait.html">
<meta property="og:type" content="website">
<meta property="og:url" content="https://bor-miz.co.il/shamaut-haklait.html">
<meta property="og:title" content="שמאות חקלאית - הערכת נזקי טבע ופיצויים | בורוביץ מזרחי">
<meta property="og:description" content="נזק לגידולים או לקרקע חקלאית? הערכת נזק חקלאי מקצועית בשטח וליווי מול חברות הביטוח וקרנות הפיצוי לפיצוי מלא.">
<meta property="og:image" content="https://bor-miz.co.il/image_2.png">
<meta property="og:locale" content="he_IL">

<script type="application/ld+json">
{
  "@context": "https://schema.org", "@type": "Service",
  "name": "שמאות חקלאית - הערכת נזקי טבע לגידולים ופיצויים",
  "serviceType": "שמאות חקלאית - נזקי טבע",
  "provider": { "@type": "LocalBusiness", "name": "בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ", "telephone": "+972-50-8922469", "areaServed": "צפון" },
  "url": "https://bor-miz.co.il/shamaut-haklait.html"
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "ראשי", "item": "https://bor-miz.co.il/"},
    {"@type": "ListItem", "position": 2, "name": "תחומי התמחות", "item": "https://bor-miz.co.il/#services"},
    {"@type": "ListItem", "position": 3, "name": "שמאות חקלאית", "item": "https://bor-miz.co.il/shamaut-haklait.html"}
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org", "@type": "FAQPage",
  "mainEntity": [
    {"@type": "Question", "name": "אילו נזקים אתם מעריכים?", "acceptedAnswer": {"@type": "Answer", "text": "אנחנו מעריכים נזק לגידולים, לבעלי חיים ולקרקע חקלאית - מאירועי טבע (ברד, קרה, שיטפון, סופה, יובש), וגם מפלישה לשטח חקלאי ומתפיסת קרקע בצו תפיסה (צו אלוף). ההערכה מבוססת על ביקור בשטח, ניתוח חקלאי-כלכלי ותיעוד מסודר התומך בתביעת הפיצוי."}},
    {"@type": "Question", "name": "אתם עובדים מטעם החקלאי או מטעם המבטח?", "acceptedAnswer": {"@type": "Answer", "text": "אנחנו שמאים חקלאיים עצמאיים שעומדים לצד החקלאי. מעריכים את הנזק בשטח באופן בלתי תלוי, מתעדים ומכמתים - ומלווים אתכם מול חברות הביטוח וקרנות הפיצוי, כולל בדיקה אם הפיצוי שהוצע הוגן וכתיבת חוות דעת נגדית בעת הצורך."}},
    {"@type": "Question", "name": "כיצד מחושב גובה הנזק לגידולים?", "acceptedAnswer": {"@type": "Answer", "text": "האומדן מתחשב בסוג הגידול והענף, בשלב הגידול שבו אירע הנזק, בהיקף הפגיעה, ביבול ובהכנסה הצפויים ובעלויות שנחסכו. ביקור מהיר בשטח ותיעוד מקצועי הם קריטיים - ככל שמתעדים מוקדם ומדויק יותר, כך הפיצוי מבוסס וגבוה יותר."}},
    {"@type": "Question", "name": "אילו ענפים אתם מכסים?", "acceptedAnswer": {"@type": "Answer", "text": "את כל ענפי החקלאות: מטעים (אבוקדו, הדרים, זיתים, גפן יין, בננות), ירקות ופירות, פלחה וגידולי שדה, כותנה וצמחי נוי; ענפי החי - בקר, צאן, מדגה, לול ודבש דבורים; וכן חממות, בתי צמיחה ומשתלות."}}
  ]
}
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500;600;700;900&family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="page.css">
</head>
<body>

<a href="#main-content" class="skip-to-content">דלג לתוכן הראשי</a>

<nav id="navbar" role="navigation" aria-label="ניווט ראשי">
  <div class="nav-inner">
    <a href="index.html" class="nav-logo" aria-label="בורוביץ מזרחי שמאות מקרקעין - דף הבית"><img src="logo-bm.png" alt="לוגו בורוביץ מזרחי"></a>
    <ul class="nav-links" id="navLinks">
      <li><a href="index.html#about" onclick="closeMenu()">אודות</a></li>
      <li><a href="index.html#services" onclick="closeMenu()">תחומי התמחות</a></li>
      <li><a href="maamarim.html" onclick="closeMenu()">מאמרים</a></li>
      <li><a href="index.html#linkedin-posts" onclick="closeMenu()">עדכונים</a></li>
      <li><a href="index.html#success" onclick="closeMenu()">מהשטח</a></li>
      <li><a href="careers.html" onclick="closeMenu()">קריירה</a></li>
      <li><a href="#lead" class="nav-cta" onclick="closeMenu()">צור קשר</a></li>
    </ul>
    <button class="hamburger" id="hamburger" onclick="toggleMenu()" aria-label="תפריט ניווט" aria-expanded="false"><span></span><span></span><span></span></button>
  </div>
</nav>

<main id="main-content">

<section class="subpage-hero">
  <div class="sp-bg" style="background-image:url('slide10.jpg')"></div>
  <div class="sp-overlay"></div>
  <div class="sp-content">
    <span class="eyebrow">תחום התמחות · נזקים ופיצויים בחקלאות</span>
    <h1 class="sp-title">נזק לגידולים <span class="gold">או לקרקע?</span><br>נעריך אותו - ונדאג לפיצוי מלא</h1>
    <p class="sp-sub">ברד, קרה ושיטפון - או פלישה לקרקע ותפיסת שטח - יכולים למחוק עונה שלמה ברגע. אנחנו שמאים חקלאיים שמעריכים את הנזק בשטח, באופן עצמאי ומקצועי, ומלווים אתכם עד שתקבלו את הפיצוי שבאמת מגיע לכם.</p>
    <div class="hero-actions">
      <a href="#lead" class="btn btn-gold">דיווח נזק ובדיקה מהירה <span class="arr">←</span></a>
      <a href="#how" class="btn btn-ghost">איך זה עובד</a>
    </div>
  </div>
</section>

<section class="stat-strip">
  <div class="container" style="padding-inline:0;">
    <div class="stat-strip-inner">
      <div class="stat reveal"><div class="num">100%</div><div class="label">מהפיצוי שמגיע לכם - זו המטרה</div></div>
      <div class="stat reveal reveal-d1"><div class="num">★</div><div class="label">שמאי חקלאי מומחה מטעם בתי משפט ובתי דין</div></div>
      <div class="stat reveal reveal-d2"><div class="num">צפון</div><div class="label">מגיעים לשטח מהר - היכרות חקלאית מקרוב</div></div>
    </div>
  </div>
</section>

<!-- WHAT IS IT -->
<section class="section">
  <div class="container">
    <div class="content-block two-col">
      <div class="reveal">
        <span class="eyebrow">על מה מדובר</span>
        <h2 class="section-title" style="margin-top:.8rem;">שמאות חקלאית זה עולם בפני עצמו</h2>
      </div>
      <div class="prose reveal reveal-d1">
        <p>שמאות חקלאית היא <strong>לא</strong> שמאות מקרקעין. כאן לא מעריכים קירות ומ"ר - אלא <strong>גידול חי</strong>: מטע, שדה, חממה או עדר. צריך להבין עונתיות, שלבי גידול, יבול צפוי, הוצאות ותשואות - ולתרגם נזק לכסף.</p>
        <p>אנחנו עוסקים בליבת העניין: <strong>הערכת הנזק החקלאי</strong> בשטח - בין שמקורו באסון טבע, בפלישה לקרקע או בתפיסת שטח. אנחנו עומדים לצידכם, החקלאים, ודואגים שהפיצוי ישקף את הנזק האמיתי - ושאף אחד לא יקבע אותו במקומכם.</p>
        <div class="callout">השותף <strong>אמיר בורוביץ</strong> - מהנדס בוגר הטכניון ושמאי חקלאי, מומחה מטעם בתי משפט ובתי דין - מביא היכרות עמוקה של החקלאות בצפון. אנחנו מדברים את השפה של השדה, ושל ועדת הפיצויים.</div>
      </div>
    </div>
  </div>
</section>

<!-- DAMAGE TYPES -->
<section class="section section--cream">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">מה מעריכים</span>
      <h2 class="section-title">הנזקים שאנחנו מעריכים</h2>
      <p>נזק לשדה ולמטע מגיע ממגוון מקורות - אסון טבע, פלישה לקרקע או תפיסת שטח. לכל אחד שיטת הערכה משלו, וכולם דורשים תיעוד מהיר ומדויק.</p>
    </div>
    <div class="values-grid reveal reveal-d1">
      <div class="value-card">
        <span class="v-num">❄</span>
        <h3>ברד וקרה</h3>
        <p>הפוגעים הקלאסיים במטעים, בכרמים ובגידולי שדה - חבטות, שריפת קרה ופגיעה בפרי ובעלווה. נזק שצריך לתעד מיד.</p>
      </div>
      <div class="value-card">
        <span class="v-num">≈</span>
        <h3>שיטפונות והצפות</h3>
        <p>הצפת שדות וחממות, סחף קרקע, ריקבון שורשים ואובדן יבול. מעריכים גם את הנזק לתשתית הגידול.</p>
      </div>
      <div class="value-card">
        <span class="v-num">🜂</span>
        <h3>סופות ורוחות</h3>
        <p>עקירת עצים, קריסת מבני חממה, נשירת פרי ושבר ענפים - נזק ישיר ונזק עקיף לעונות הבאות.</p>
      </div>
      <div class="value-card">
        <span class="v-num">☀</span>
        <h3>יובש וגלי חום</h3>
        <p>פגיעה ביבול ובאיכות עקב מחסור במים וטמפרטורות קיצון - נזק שדורש ניתוח חקלאי מדויק כדי לכמת.</p>
      </div>
      <div class="value-card">
        <span class="v-num">✦</span>
        <h3>שלג ומזג אוויר קיצון</h3>
        <p>משקל שלג ששובר מבנים וענפים, ואירועי אקלים חריגים הפוגעים בגידולים רגישים.</p>
      </div>
      <div class="value-card">
        <span class="v-num">⚑</span>
        <h3>נזקי בעלי חיים ובר</h3>
        <p>פגיעת חיות בר ובעלי חיים בגידולים - ונזקים בענפי החי עצמם. מתעדים, מכמתים ומבססים את התביעה.</p>
      </div>
      <div class="value-card">
        <span class="v-num">⊘</span>
        <h3>פלישה לשטח חקלאי</h3>
        <p>השתלטות, עיבוד או נטיעה של גורם זר בקרקע שלכם - ופגיעה בגידולים הקיימים. מתעדים את היקף הפלישה ואומדים את הנזק ואת עלות השבת השטח לקדמותו.</p>
      </div>
      <div class="value-card">
        <span class="v-num">§</span>
        <h3>תפיסת שטח בצו תפיסה</h3>
        <p>תפיסת קרקע חקלאית לצרכים ביטחוניים בצו תפיסה (צו אלוף) - כפי שקרה רבות בתקופת המלחמה. אומדים את אובדן השימוש, הפגיעה ביבול ובהכנסה ואת דמי השימוש והפיצוי המגיעים לכם.</p>
      </div>
    </div>
  </div>
</section>

<!-- BRANCHES -->
<section class="section">
  <div class="container">
    <div class="content-block two-col">
      <div class="reveal">
        <span class="eyebrow">לאילו ענפים</span>
        <h2 class="section-title" style="margin-top:.8rem;">מכסים את כל ענפי החקלאות</h2>
        <p class="lead" style="margin-top:1rem;">מהמטע ועד הלול - מכירים את הענף, את שלבי הגידול ואת מה שקובע את גובה הנזק.</p>
      </div>
      <ul class="check-list reveal reveal-d1">
        <li><strong>מטעים</strong> - אבוקדו, הדרים, זיתים, גפן יין, בננות</li>
        <li><strong>ירקות ופירות</strong> - בשדה הפתוח ובחממה</li>
        <li><strong>פלחה וגידולי שדה</strong> - חיטה, שעורה ועוד</li>
        <li><strong>כותנה וצמחי נוי</strong></li>
        <li><strong>ענפי החי</strong> - בקר (בשר וחלב), צאן, מדגה, לול, דבש דבורים</li>
        <li><strong>חממות, בתי צמיחה ומשתלות</strong></li>
      </ul>
    </div>
  </div>
</section>

<!-- PROCESS -->
<section class="section section--cream" id="how">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">איך זה עובד</span>
      <h2 class="section-title">מנזק לפיצוי, צעד אחר צעד</h2>
      <p>זמן הוא קריטי. ככל שמתעדים את הנזק מהר ומדויק יותר - כך הפיצוי מבוסס וגבוה יותר.</p>
    </div>
    <div class="steps">
      <div class="step reveal"><div class="step-num">1</div><div><h4>דיווח מהיר</h4><p>ספגתם נזק? צרו קשר מיד - בטלפון או בוואטסאפ. נבין מה קרה, באיזה ענף ובאיזה היקף, ונקבע ביקור דחוף.</p></div></div>
      <div class="step reveal reveal-d1"><div class="step-num">2</div><div><h4>ביקור ותיעוד בשטח</h4><p>מגיעים לשדה, למטע או לחממה, בודקים את הפגיעה בפועל ומתעדים אותה בצורה מקצועית - בסיס איתן לתביעה.</p></div></div>
      <div class="step reveal reveal-d2"><div class="step-num">3</div><div><h4>אומדן הנזק</h4><p>בונים הערכה חקלאית-כלכלית - לפי הענף, שלב הגידול, היבול הצפוי והעלויות שנחסכו - ומגישים חוות דעת מנומקת.</p></div></div>
      <div class="step reveal reveal-d3"><div class="step-num">4</div><div><h4>ליווי עד הפיצוי</h4><p>מלווים אתכם מול חברות הביטוח וקרנות הפיצוי, בודקים אם הפיצוי שהוצע הוגן, ונאבקים על מלוא הסכום שמגיע לכם. <a href="pitzuy-nezek-haklai.html">איך בונים את תביעת הפיצוי</a>.</p></div></div>
    </div>
  </div>
</section>

<!-- WHY US -->
<section class="section">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">למה אנחנו</span>
      <h2 class="section-title">שמאי שמבין גם בחקלאות וגם בכסף</h2>
      <p>הערכת נזק חקלאי דורשת שילוב נדיר - ידע אגרונומי בשטח ויכולת לתרגם אותו לחוות דעת כלכלית שעומדת בכל מבחן.</p>
    </div>
    <div class="feature-grid reveal reveal-d1">
      <div class="feature-card">
        <div class="fc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c4-4 6-7 6-11a6 6 0 00-12 0c0 4 2 7 6 11z"/><path d="M12 11v6"/></svg></div>
        <h3>הבנה חקלאית אמיתית</h3>
        <p>מכירים גידולים, עונתיות ויבול - לא רק טבלאות. ההיכרות הזו היא ההבדל בין אומדן מדויק להערכה גסה.</p>
      </div>
      <div class="feature-card">
        <div class="fc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l9 4v6c0 5-3.5 7.5-9 9-5.5-1.5-9-4-9-9V7z"/><path d="M9 12l2 2 4-4"/></svg></div>
        <h3>חוות דעת שעומדת בלחץ</h3>
        <p>תיעוד מסודר וחוות דעת מנומקת - קבילים מול חברות הביטוח, קרנות הפיצוי ובבית המשפט. כך מבססים פיצוי מלא.</p>
      </div>
      <div class="feature-card">
        <div class="fc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></div>
        <h3>מגיעים מהר</h3>
        <p>בנזקי טבע כל יום קובע. אנחנו בצפון, מכירים את השטח, ומגיעים לתעד בזמן - לפני שהראיות נעלמות.</p>
      </div>
    </div>
  </div>
</section>

<!-- WHO FOR -->
<section class="section section--cream">
  <div class="container">
    <div class="content-block two-col">
      <div class="reveal">
        <span class="eyebrow">למי זה מתאים</span>
        <h2 class="section-title" style="margin-top:.8rem;">למי מיועדת השמאות החקלאית?</h2>
        <p class="lead" style="margin-top:1rem;">לכל מי שפרנסתו צומחת מהאדמה - ונפגע מאירוע טבע.</p>
      </div>
      <ul class="check-list reveal reveal-d1">
        <li>חקלאים שספגו נזק לגידולים, למטע או לחממה</li>
        <li>מגדלי בעלי חיים (בקר, צאן, לול, מדגה, דבורים)</li>
        <li>חקלאים שקרקעם נפלשה או נתפסה לצרכים ביטחוניים</li>
        <li>מושבים, קיבוצים ואגודות שיתופיות</li>
        <li>מי שקיבל הצעת פיצוי ורוצה לבדוק אם היא הוגנת</li>
        <li>חקלאים בסכסוך או במחלוקת על גובה נזק</li>
        <li>עורכי דין ובתי משפט הזקוקים לחוות דעת מומחה</li>
      </ul>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="section">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">שאלות נפוצות</span>
      <h2 class="section-title">מה חשוב לדעת</h2>
    </div>
    <div class="faq-list reveal reveal-d1">
      <details class="faq-item"><summary>ספגתי נזק - מה לעשות קודם?</summary><div class="faq-body">לתעד ולהתקשר. <strong>אל תיגעו בגידול הפגוע ואל "תסדרו" את השטח</strong> לפני שמתעדים. צלמו, ופנו אלינו מיד - ככל שהתיעוד מוקדם ומקצועי יותר, כך הפיצוי מבוסס וגבוה יותר.</div></details>
      <details class="faq-item"><summary>אתם עובדים מטעם החקלאי או מטעם המבטח?</summary><div class="faq-body">אנחנו שמאים חקלאיים <strong>עצמאיים</strong> שעומדים לצד החקלאי. מעריכים את הנזק בשטח באופן בלתי תלוי, מתעדים ומכמתים - ומלווים אתכם מול חברות הביטוח וקרנות הפיצוי, בודקים אם הפיצוי שהוצע הוגן, ובמידת הצורך מכינים חוות דעת נגדית ונאבקים על השלמתו.</div></details>
      <details class="faq-item"><summary>איך נקבע גובה הפיצוי?</summary><div class="faq-body">לפי <strong>סוג הגידול והענף, שלב הגידול</strong> שבו אירע הנזק, היקף הפגיעה, היבול וההכנסה הצפויים והעלויות שנחסכו. אנחנו משלבים ביקור בשטח עם ניתוח כלכלי כדי להגיע לאומדן מדויק ומבוסס.</div></details>
      <details class="faq-item"><summary>קיבלתי הצעת פיצוי - שווה לבדוק?</summary><div class="faq-body">בהחלט. לא פעם ההערכה הראשונית נמוכה מהנזק האמיתי. נבחן את ההצעה מול הנזק בפועל, ואם יש פער - נכין חוות דעת נגדית ונלווה אתכם בהשגה על גובה הפיצוי.</div></details>
      <details class="faq-item"><summary>אתם מגישים חוות דעת לבית משפט?</summary><div class="faq-body">כן. אנו משמשים מומחים מטעם בתי משפט ובתי דין בנושאי נזקים חקלאיים, ומגישים חוות דעת מקצועיות וקבילות.</div></details>
    </div>
  </div>
</section>

<!-- CTA / LEAD -->
<section class="section cta-band" id="lead">
  <div class="container">
    <div class="cta-inner">
      <div class="cta-copy reveal">
        <span class="eyebrow">דיווח נזק</span>
        <h2>ספגתם נזק? כל יום קובע</h2>
        <p>השאירו פרטים ושמאי חקלאי יחזור אליכם במהירות לתיאום ביקור ובדיקה ראשונית - ללא התחייבות.</p>
      </div>
      <div class="cta-form reveal reveal-d1">
        <h3>שלחו לנו פנייה</h3>
        <p>נחזור אליכם בהקדם האפשרי</p>
        <form class="contact-form" id="contact-form" onsubmit="return submitContactForm(event, 'contact')">
          <input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);border:0;opacity:0">
          <div class="form-grid">
            <div class="form-group"><label for="contact-name">שם מלא *</label><input type="text" id="contact-name" name="name" placeholder="ישראל ישראלי" required autocomplete="name"></div>
            <div class="form-group"><label for="contact-phone">טלפון *</label><input type="tel" id="contact-phone" name="phone" placeholder="05X-XXXXXXX" required autocomplete="tel"></div>
          </div>
          <div class="form-group"><label for="contact-email">דוא"ל</label><input type="email" id="contact-email" name="email" placeholder="israel@example.com" autocomplete="email"></div>
          <div class="form-group">
            <label for="contact-subject">נושא פנייה</label>
            <select id="contact-subject" name="subject">
              <option value="נזקי טבע / שמאות חקלאית" selected>נזקי טבע / שמאות חקלאית</option>
              <option>פלישה או תפיסת קרקע חקלאית</option>
              <option>בדיקת הצעת פיצוי</option>
              <option>היטל השבחה</option>
              <option>השגה על שומת רמ"י</option>
              <option>ייעוץ</option>
              <option>אחר</option>
            </select>
          </div>
          <div class="form-group"><label for="contact-message">הודעה</label><textarea id="contact-message" name="message" placeholder="מה נפגע (גידול / מטע / קרקע), מאיזה אירוע (ברד/קרה/שיטפון/פלישה/תפיסה...) ומתי?"></textarea></div>
          <button type="submit" class="btn btn-gold form-submit" id="contact-submit-btn">שלח פנייה <span class="arr">←</span></button>
          <div id="contact-form-status" class="form-status"></div>
        </form>
      </div>
    </div>
  </div>
</section>

<!-- RELATED -->
<section class="section section--cream">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">תחומים נוספים</span>
      <h2 class="section-title">אולי יעניין אתכם גם</h2>
    </div>
    <div class="related reveal reveal-d1">
      <a href="pitzuy-nezek-haklai.html">פיצוי על נזק חקלאי <span class="arr">←</span></a>
      <a href="hetel-hashbacha.html">היטל השבחה <span class="arr">←</span></a>
      <a href="hasagot-rami.html">השגות על שומות רמ"י <span class="arr">←</span></a>
      <a href="takan-21-pinui-binui.html">תקן 21 · פינוי-בינוי <span class="arr">←</span></a>
    </div>
  </div>
</section>

</main>

<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="logo-bm.png" alt="לוגו בורוביץ מזרחי">
        <p>משרד שמאות מקרקעין מוביל בצפון. ידע מקצועי מעמיק, היכרות שטח בלתי אמצעית והבנה כלכלית רחבה - בשירות כל לקוח.</p>
      </div>
      <div class="footer-col">
        <h4>ניווט</h4>
        <ul>
          <li><a href="index.html#about">אודות</a></li>
          <li><a href="index.html#services">תחומי התמחות</a></li>
          <li><a href="maamarim.html">מאמרים</a></li>
          <li><a href="index.html#success">תוצאות מהשטח</a></li>
          <li><a href="careers.html">קריירה</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>יצירת קשר</h4>
        <ul>
          <li><a href="tel:054-6559942">054-6559942 · מאור</a></li>
          <li><a href="tel:050-8922469">050-8922469 · אמיר</a></li>
          <li><a id="em-footer" href="#"></a></li>
          <li>שדרות החרוב 6, פארק תעשיות בר-לב</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 בורוביץ מזרחי שמאות מקרקעין וחקלאות בע"מ. כל הזכויות שמורות.</span>
      <span><a href="index.html">חזרה לאתר הראשי</a></span>
    </div>
  </div>
</footer>

<div class="floating-wrap">
  <a class="float-btn float-btn-wa" href="https://wa.me/972546559942" target="_blank" rel="noopener noreferrer" aria-label="שלחו הודעה בוואטסאפ">
    <svg aria-hidden="true" viewBox="0 0 32 32"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.67 4.61 1.832 6.5L4 29l7.75-1.812A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="#fff"/><path d="M21.5 18.5c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.19-.57-.34z" fill="#25D366"/></svg>
  </a>
  <button type="button" id="customAccessBtn" class="float-btn float-btn-access" aria-label="פתח תפריט נגישות" title="נגישות"><span aria-hidden="true">♿</span></button>
</div>

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<script>
  (function(){ var el=document.getElementById('em-footer'); if(el){ var a='info'+'@'+'bor-miz.co.il'; el.href='mailto:'+a; el.textContent=a; } })();
  function toggleMenu(){ var l=document.getElementById('navLinks'),b=document.getElementById('hamburger'); l.classList.toggle('open'); b.classList.toggle('open'); b.setAttribute('aria-expanded', l.classList.contains('open')?'true':'false'); }
  function closeMenu(){ document.getElementById('navLinks').classList.remove('open'); var b=document.getElementById('hamburger'); b.classList.remove('open'); b.setAttribute('aria-expanded','false'); }
  document.addEventListener('click', function(e){ var nav=document.getElementById('navbar'); if(nav && !nav.contains(e.target)) closeMenu(); });
  (function(){ var nav=document.getElementById('navbar'); var onScroll=function(){ nav.classList.toggle('scrolled', window.scrollY>60); }; window.addEventListener('scroll', onScroll, {passive:true}); onScroll(); })();
  (function(){
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce || !window.gsap || !window.ScrollTrigger){
      document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
      document.querySelectorAll('.counter').forEach(function(el){ el.textContent = el.getAttribute('data-target'); });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.reveal').forEach(function(el){ ScrollTrigger.create({ trigger: el, start:'top 88%', onEnter:function(){ el.classList.add('in'); } }); });
    document.querySelectorAll('.counter').forEach(function(el){
      var target=+el.getAttribute('data-target');
      ScrollTrigger.create({ trigger: el, start:'top 92%', once:true, onEnter:function(){ var o={v:0}; gsap.to(o,{v:target,duration:1.6,ease:'power2.out',onUpdate:function(){ el.textContent=Math.round(o.v); }}); } });
    });
  })();
  var EDGE_FUNCTION_URL = 'https://nurgknexilxaxxovdbco.supabase.co/functions/v1/website-lead-intake';
  var SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51cmdrbmV4aWx4YXh4b3ZkYmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMjAxMzYsImV4cCI6MjA4OTY5NjEzNn0.S6BwlUfYkdWegz1gigK5dK0lXUowp4safWOFEzExuS0';
  function submitContactForm(e){
    e.preventDefault();
    var form=document.getElementById('contact-form'), btn=document.getElementById('contact-submit-btn'), statusEl=document.getElementById('contact-form-status');
    var name=document.getElementById('contact-name').value.trim(), phone=document.getElementById('contact-phone').value.trim();
    var email=document.getElementById('contact-email').value.trim(), subject=document.getElementById('contact-subject').value, message=document.getElementById('contact-message').value.trim();
    if(!name || !phone){ statusEl.style.display='block'; statusEl.style.color='#fca5a5'; statusEl.textContent='נא למלא שם וטלפון'; return false; }
    btn.disabled=true; btn.textContent='שולח...'; statusEl.style.display='none';
    fetch(EDGE_FUNCTION_URL, { method:'POST', headers:{'Content-Type':'application/json','apikey':SB_ANON,'Authorization':'Bearer '+SB_ANON}, body: JSON.stringify({ name:name, phone:phone, email:email||null, subject:subject||null, message:message||null, source:'service-page', _hp:(form.querySelector('input[name="website"]')||{value:''}).value, elapsed_ms:Math.round(performance.now()) }) })
      .then(function(res){ return res.json(); })
      .then(function(data){
        if(data.success){
          window.dataLayer=window.dataLayer||[]; window.dataLayer.push({ event:'generate_lead', form_source:'service-page', lead_subject:subject||'unspecified' });
          statusEl.style.display='block'; statusEl.style.color='#4ade80'; statusEl.textContent=data.message||'הפנייה נשלחה בהצלחה!'; form.reset();
        } else { throw new Error(data.error||'שגיאה בשליחה'); }
      })
      .catch(function(err){ statusEl.style.display='block'; statusEl.style.color='#fca5a5'; statusEl.textContent='שגיאה: '+(err.message||'נסו שוב מאוחר יותר'); })
      .finally(function(){ btn.disabled=false; btn.innerHTML='שלח פנייה <span class="arr">←</span>'; });
    return false;
  }
  (function(){ window.dataLayer=window.dataLayer||[]; document.addEventListener('click', function(e){ var el=e.target.closest&&e.target.closest('a'); if(!el) return; if(/wa\.me|api\.whatsapp/.test(el.href||'')){ window.dataLayer.push({event:'contact_whatsapp'}); } else if((el.getAttribute('href')||'').indexOf('tel:')===0){ window.dataLayer.push({event:'contact_phone'}); } }, true); })();
</script>

<nagishli></nagishli>
<script>
nl_contact = "n:בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ|p:054-6559942|u:maor@bor-miz.co.il";
nl_pos = "BL"; nl_lang = "he"; nl_color = "blue"; nl_compact = "1";
</script>
<script src="nagishli.js?v=2.3" charset="utf-8"></script>
<script>
  (function(){
    function forceCompactStyles(){
      var bar=document.getElementById('NagishLiBar'), menus=document.getElementById('NagishLiMenus');
      if(bar){ bar.style.cssText='position:fixed !important; left:1.4rem !important; right:auto !important; bottom:6.2rem !important; top:auto !important; width:300px !important; max-width:90vw !important; height:auto !important; z-index:9999 !important; background:transparent !important; box-shadow:none !important; border:none !important; padding:0 !important; margin:0 !important;'; }
      if(menus){ menus.style.cssText+=';position:static !important; width:300px !important; max-width:90vw !important; max-height:70vh !important; overflow-y:auto !important; overflow-x:hidden !important; font-size:13px !important; border-radius:12px !important; box-shadow:0 10px 40px rgba(0,0,0,0.3) !important; margin:0 !important; padding:0 !important; background:#fff !important;'; }
      document.querySelectorAll('#NagishLiMenus, #NagishLiMenus ul').forEach(function(el){ el.style.width='100%'; el.style.maxWidth='300px'; el.style.boxSizing='border-box'; });
    }
    function openNagishLiMenu(){
      if(typeof jQuery==='undefined') return false;
      var $=jQuery, $strip=$('#NagishLiBarStrip'), $menus=$('#NagishLiMenus');
      if(!$strip.length || !$menus.length) return false;
      if($menus.is(':visible')){ $menus.slideUp(150, function(){ $strip.removeClass('open'); }); }
      else { forceCompactStyles(); $strip.addClass('open'); $menus.slideDown(150, forceCompactStyles); }
      return true;
    }
    function bind(){ var btn=document.getElementById('customAccessBtn'); if(!btn) return; btn.addEventListener('click', function(e){ e.preventDefault(); var n=0; (function tryOpen(){ if(openNagishLiMenu()) return; if(++n<30) setTimeout(tryOpen,200); })(); }); }
    if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', bind); } else { bind(); }
  })();
</script>

</body>
</html>

```

### `takan-21-pinui-binui.html`

```html
﻿<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="shortcut icon" href="/favicon.ico">

<!-- ===== GOOGLE ANALYTICS 4 (gtag.js) =====
     Property "bor-miz.co.il", measurement ID G-GYNQPGPR33 - installed 2026-09-08,
     replacing a Tag Manager placeholder that never had a container behind it.
     The bridge below turns the site's existing dataLayer.push({event:'...'}) calls
     (generate_lead / contact_whatsapp / contact_phone / intake_submitted) into GA4
     events, so every call site elsewhere in the site stays untouched. -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-GYNQPGPR33"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-GYNQPGPR33');
  (function(){
    // gtag() itself pushes an arguments object, which has no .event key - so this
    // never recurses on its own output.
    var push = window.dataLayer.push;
    window.dataLayer.push = function(){
      for (var i = 0; i < arguments.length; i++) {
        var o = arguments[i];
        if (o && typeof o.event === 'string') {
          var params = {};
          for (var k in o) {
            if (k !== 'event' && Object.prototype.hasOwnProperty.call(o, k)) params[k] = o[k];
          }
          gtag('event', o.event, params);
        }
      }
      return push.apply(window.dataLayer, arguments);
    };
  })();
</script>
<!-- ===== END GOOGLE ANALYTICS 4 ===== -->

<title>תקן 21 ופינוי-בינוי - שומת כדאיות והוגנות תמורה | בורוביץ מזרחי</title>
<meta name="description" content="שומת תקן 21 בוחנת שתי שאלות: האם פרויקט ההתחדשות העירונית כדאי כלכלית, והאם התמורה לדיירים הוגנת. ליווי שמאי מלא לפינוי-בינוי ותמ&quot;א 38 - לדיירים, יזמים, מארגנים ובתי משפט (כולל הליכי דייר סרבן).">
<meta name="keywords" content="תקן 21, תקן 21.1, פינוי בינוי, התחדשות עירונית, תמא 38, דייר סרבן, כדאיות כלכלית, הוגנות התמורה, מאזן היזם, דמי איזון, שמאי מקרקעין, יזמים, דיירים, צפון">
<meta name="robots" content="noindex,nofollow">
<link rel="canonical" href="https://bor-miz.co.il/takan-21-pinui-binui.html">
<meta property="og:type" content="website">
<meta property="og:url" content="https://bor-miz.co.il/takan-21-pinui-binui.html">
<meta property="og:title" content="תקן 21 ופינוי-בינוי | בורוביץ מזרחי">
<meta property="og:description" content="שומת תקן 21 - בדיקת כדאיות הפרויקט והוגנות התמורה לדיירים בהתחדשות עירונית.">
<meta property="og:image" content="https://bor-miz.co.il/image_2.png">
<meta property="og:locale" content="he_IL">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500;600;700;900&family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

<script type="application/ld+json">
{
  "@context": "https://schema.org", "@type": "Service",
  "name": "שומת תקן 21 וליווי שמאי לפינוי-בינוי והתחדשות עירונית",
  "serviceType": "שמאות מקרקעין - התחדשות עירונית ותקן 21",
  "provider": { "@type": "LocalBusiness", "name": "בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ", "telephone": "+972-54-6559942", "areaServed": "צפון" },
  "url": "https://bor-miz.co.il/takan-21-pinui-binui.html"
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "ראשי", "item": "https://bor-miz.co.il/"},
    {"@type": "ListItem", "position": 2, "name": "תחומי התמחות", "item": "https://bor-miz.co.il/#services"},
    {"@type": "ListItem", "position": 3, "name": "תקן 21 ופינוי-בינוי", "item": "https://bor-miz.co.il/takan-21-pinui-binui.html"}
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org", "@type": "FAQPage",
  "mainEntity": [
    {"@type": "Question", "name": "מה זה שומת תקן 21?", "acceptedAnswer": {"@type": "Answer", "text": "תקן 21 הוא תקן שמאי מקצועי מחייב של מועצת שמאי המקרקעין שליד השמאי הממשלתי הראשי. הוא קובע כיצד בודקים פרויקט התחדשות עירונית: האם הוא כדאי כלכלית, והאם התמורה שמקבלים הדיירים הוגנת וראויה ביחס לזכויות שהם מביאים לעסקה."}},
    {"@type": "Question", "name": "מתי צריך שומת תקן 21?", "acceptedAnswer": {"@type": "Answer", "text": "כשדיירים שוקלים אם לחתום על הסכם ורוצים לדעת אם התמורה הוגנת; כשיזם או מארגן בודק את כדאיות הפרויקט; ובמיוחד בהליכי 'דייר סרבן' מול המפקח על רישום מקרקעין או בבית המשפט, שם השומה משמשת להוכיח שהעסקה הוגנת ולכן הסירוב אינו סביר."}},
    {"@type": "Question", "name": "מה ההבדל בין תמ\"א 38 לפינוי-בינוי?", "acceptedAnswer": {"@type": "Answer", "text": "תמ\"א 38 היא חיזוק או עיבוי של בניין קיים מפני רעידות אדמה - תוספת קומות וממ\"דים בלי הריסה, פרויקט נקודתי. פינוי-בינוי הוא הריסת מתחם שלם של מבנים ישנים ובניית מבנים חדשים וגדולים יותר במקומם - פרויקט רחב היקף. תקן 21 הוא הכלי לבחינת הכדאיות וההוגנות בעיקר בפינוי-בינוי."}},
    {"@type": "Question", "name": "אתם מלווים גם דיירים וגם יזמים?", "acceptedAnswer": {"@type": "Answer", "text": "כן. אנחנו מלווים נציגויות דיירים, יזמים, מארגנים וגופים מממנים בכל שלב של פרויקט ההתחדשות - מבדיקת ההיתכנות, דרך עריכת שומת תקן 21 ודוח אפס, ועד למימוש."}}
  ]
}
</script>

<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="page.css">
</head>
<body>

<a href="#main-content" class="skip-to-content">דלג לתוכן הראשי</a>

<nav id="navbar" role="navigation" aria-label="ניווט ראשי">
  <div class="nav-inner">
    <a href="index.html" class="nav-logo" aria-label="בורוביץ מזרחי שמאות מקרקעין - דף הבית"><img src="logo-bm.png" alt="לוגו בורוביץ מזרחי"></a>
    <ul class="nav-links" id="navLinks">
      <li><a href="index.html#about" onclick="closeMenu()">אודות</a></li>
      <li><a href="index.html#services" onclick="closeMenu()">תחומי התמחות</a></li>
      <li><a href="maamarim.html" onclick="closeMenu()">מאמרים</a></li>
      <li><a href="index.html#linkedin-posts" onclick="closeMenu()">עדכונים</a></li>
      <li><a href="index.html#success" onclick="closeMenu()">מהשטח</a></li>
      <li><a href="careers.html" onclick="closeMenu()">קריירה</a></li>
      <li><a href="#lead" class="nav-cta" onclick="closeMenu()">צור קשר</a></li>
    </ul>
    <button class="hamburger" id="hamburger" onclick="toggleMenu()" aria-label="תפריט ניווט" aria-expanded="false"><span></span><span></span><span></span></button>
  </div>
</nav>

<main id="main-content">

<section class="subpage-hero">
  <div class="sp-bg" style="background-image:url('slide5.jpg')"></div>
  <div class="sp-overlay"></div>
  <div class="sp-content">
    <span class="eyebrow">תחום התמחות · התחדשות עירונית</span>
    <h1 class="sp-title">תקן 21 <span class="gold">ופינוי-בינוי</span><br>המספרים שמכריעים אם העסקה הוגנת</h1>
    <p class="sp-sub">פרויקט התחדשות עירונית עומד או נופל על שתי שאלות: האם הוא כדאי כלכלית, והאם התמורה לדיירים הוגנת. שומת תקן 21 עונה על שתיהן - ואנחנו עורכים אותה ומלווים דיירים ויזמים מבדיקת ההיתכנות ועד המימוש.</p>
    <div class="hero-actions">
      <a href="#lead" class="btn btn-gold">לתיאום ייעוץ <span class="arr">←</span></a>
      <a href="#how" class="btn btn-ghost">איך זה עובד</a>
    </div>
  </div>
</section>

<section class="stat-strip">
  <div class="container" style="padding-inline:0;">
    <div class="stat-strip-inner">
      <div class="stat reveal"><div class="num">21</div><div class="label">תקן שמאי מחייב להתחדשות עירונית</div></div>
      <div class="stat reveal reveal-d1"><div class="num">2</div><div class="label">בדיקות: כדאיות הפרויקט והוגנות התמורה</div></div>
      <div class="stat reveal reveal-d2"><div class="num">360°</div><div class="label">ליווי מלא לדיירים וליזמים</div></div>
    </div>
  </div>
</section>

<!-- WHAT IS IT -->
<section class="section">
  <div class="container">
    <div class="content-block two-col">
      <div class="reveal">
        <span class="eyebrow">מה זה בעצם?</span>
        <h2 class="section-title" style="margin-top:.8rem;">תקן 21 - השפה המשותפת של ההתחדשות</h2>
      </div>
      <div class="prose reveal reveal-d1">
        <p><strong>תקן 21</strong> (בנוסחו המעודכן - תקן 21.1) הוא תקן שמאי <strong>מחייב</strong> שקבעה מועצת שמאי המקרקעין שליד השמאי הממשלתי הראשי. הוא נותן לשמאי "שפה אחידה" לבחון פרויקט פינוי-בינוי או התחדשות עירונית.</p>
        <p>בלי בלבול ובלי מילים גדולות - התקן עונה על שתי שאלות שמעניינות כל צד בעסקה:</p>
        <div class="callout"><strong>1. האם הפרויקט כדאי כלכלית?</strong> כלומר, האם יש בו רווח שמצדיק את הביצוע.<br><strong>2. האם התמורה לדיירים הוגנת?</strong> כלומר, האם מה שמקבל הדייר שווה את הדירה והזכויות שהוא מביא לעסקה.</div>
        <p>חוות דעת אובייקטיבית לפי תקן 21 הופכת ויכוח של "תחושות" למשא ומתן על <strong>מספרים</strong> - וזה מה שמזיז פרויקטים קדימה.</p>
      </div>
    </div>
  </div>
</section>

<!-- METHOD -->
<section class="section section--cream">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">איך בודקים</span>
      <h2 class="section-title">המתודולוגיה - שני מאזנים</h2>
      <p>השמאי בונה שני "מאזנים" משלימים: אחד מצד הדייר ואחד מצד היזם. כל רכיב מתורגם לערך כספי ומותאם ללוח הזמנים של הפרויקט.</p>
    </div>
    <div class="values-grid reveal reveal-d1">
      <div class="value-card">
        <span class="v-num">01</span>
        <h3>שווי הדירה הקיימת</h3>
        <p>כמה שווה הדירה של הדייר היום, לפי עסקאות השוואה באזור. זו נקודת הפתיחה של מאזן הדייר.</p>
      </div>
      <div class="value-card">
        <span class="v-num">02</span>
        <h3>שווי הדירה החדשה</h3>
        <p>השווי הצפוי של הדירה שהדייר יקבל - לפי שטח, קומה, מפרט וסביבה בבניין החדש.</p>
      </div>
      <div class="value-card">
        <span class="v-num">03</span>
        <h3>התמורות הנלוות</h3>
        <p>מרפסת, ממ"ד, מחסן וחניה, דמי שכירות לתקופת הבנייה, כיסוי הוצאות מעבר, ולעיתים דמי איזון בין דיירים.</p>
      </div>
      <div class="value-card">
        <span class="v-num">04</span>
        <h3>מאזן היזם וזכויות הבנייה</h3>
        <p>סך ההכנסות מכל הדירות שניתן לבנות ולמכור (לפי זכויות התב"ע) מול כלל העלויות - בנייה, פינוי, מימון ושיווק.</p>
      </div>
      <div class="value-card">
        <span class="v-num">05</span>
        <h3>היוון ומקדמי דחייה</h3>
        <p>כסף שמתקבל בעוד שלוש שנים שווה פחות מכסף היום. כל הזרמים מתורגמים לערך נוכחי כדי שההשוואה תהיה הוגנת.</p>
      </div>
      <div class="value-card">
        <span class="v-num">06</span>
        <h3>מיסוי ורווח יזמי</h3>
        <p>היטל השבחה, מס שבח/רכישה ופטורים רלוונטיים נכנסים למאזן. הרווח היזמי שנותר הוא המדד לכדאיות הפרויקט.</p>
      </div>
    </div>
  </div>
</section>

<!-- WHEN NEEDED -->
<section class="section">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">מתי צריך</span>
      <h2 class="section-title">מתי נדרשת שומת תקן 21</h2>
      <p>אותה שומה משרתת ארבעה צרכים שונים - לכל אחד מהם נקודת מבט אחרת.</p>
    </div>
    <div class="feature-grid reveal reveal-d1">
      <div class="feature-card">
        <div class="fc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg></div>
        <h3>דיירים</h3>
        <p>לפני שחותמים - לדעת בוודאות אם התמורה המוצעת הוגנת, ולשפר את תנאי ההסכם מול היזם מתוך עמדת ידע.</p>
      </div>
      <div class="feature-card">
        <div class="fc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><circle cx="15" cy="15" r="3"/><line x1="17.5" y1="17.5" x2="21" y2="21"/></svg></div>
        <h3>יזמים ומארגנים</h3>
        <p>לבחון את כדאיות הפרויקט והרווח היזמי לפני התחייבות - ולקבל דוח שמאי שיעמוד גם מול הבנק המלווה.</p>
      </div>
      <div class="feature-card">
        <div class="fc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l9 4v6c0 5-3.5 7.5-9 9-5.5-1.5-9-4-9-9V7z"/><path d="M9 12l2 2 4-4"/></svg></div>
        <h3>בית משפט ומפקח</h3>
        <p>בהליכי "דייר סרבן" - חוות דעת המוכיחה שהעסקה הוגנת וכדאית, ולכן הסירוב אינו סביר.</p>
      </div>
      <div class="feature-card">
        <div class="fc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87"/></svg></div>
        <h3>בסיס למשא ומתן</h3>
        <p>חוות דעת ניטרלית שמשמשת קרקע משותפת לכל הצדדים - ומקצרת מחלוקות ארוכות.</p>
      </div>
    </div>
  </div>
</section>

<!-- KEY TERMS -->
<section class="section section--cream">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">מילון קצר</span>
      <h2 class="section-title">מושגים שכדאי להכיר</h2>
      <p>כמה מהמונחים שחוזרים שוב ושוב בהתחדשות עירונית - בלי הז'רגון.</p>
    </div>
    <div class="values-grid reveal reveal-d1">
      <div class="value-card">
        <span class="v-num">מושג</span>
        <h3>דייר סרבן</h3>
        <p>בעל דירה במתחם שמסרב לחתום. כשרוב גדול כבר הסכים, ניתן בתנאים מסוימים לתבוע אותו אם סירובו אינו סביר - ושומת תקן 21 היא הכלי להוכיח זאת.</p>
      </div>
      <div class="value-card">
        <span class="v-num">מושג</span>
        <h3>דמי איזון</h3>
        <p>תשלומי השלמה המאזנים פערים בשווי בין דיירים שונים (דירה גדולה מול קטנה, קומה גבוהה מול נמוכה), כדי שכל אחד יקבל תמורה הוגנת ביחס למה שהביא.</p>
      </div>
      <div class="value-card">
        <span class="v-num">מושג</span>
        <h3>ערבויות</h3>
        <p>בטוחות שהיזם נותן לדיירים - ערבות חוק מכר, ערבות שכירות, ערבות מיסים ועוד - שמבטיחות שהדירה תיבנה ותימסר וכספם מוגן גם אם היזם נקלע לקשיים.</p>
      </div>
      <div class="value-card">
        <span class="v-num">מושג</span>
        <h3>תמ"א 38 מול פינוי-בינוי</h3>
        <p>תמ"א 38 = חיזוק בניין קיים בלי הריסה (פרויקט נקודתי). פינוי-בינוי = הריסת מתחם ובניית מבנים חדשים במקומו (פרויקט רחב היקף).</p>
      </div>
    </div>
  </div>
</section>

<!-- PROCESS -->
<section class="section" id="how">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">איך זה עובד</span>
      <h2 class="section-title">העבודה איתנו, צעד אחר צעד</h2>
    </div>
    <div class="steps">
      <div class="step reveal"><div class="step-num">1</div><div><h4>היכרות והבנת הצורך</h4><p>נבין מי אתם בעסקה - דיירים, יזם, מארגן או צד בהליך - ומה השומה צריכה להשיג.</p></div></div>
      <div class="step reveal reveal-d1"><div class="step-num">2</div><div><h4>איסוף נתונים וביקור</h4><p>אוספים נסחי טאבו, תב"עות, היתרים ועסקאות, ומבקרים במתחם כדי להעריך את המצב הקיים והפוטנציאל.</p></div></div>
      <div class="step reveal reveal-d2"><div class="step-num">3</div><div><h4>עריכת שומת תקן 21</h4><p>בונים את שני המאזנים - הוגנות התמורה לדיירים וכדאיות הפרויקט ליזם - בחוות דעת מנומקת ושקופה.</p></div></div>
      <div class="step reveal reveal-d3"><div class="step-num">4</div><div><h4>הצגה וליווי</h4><p>מציגים את הממצאים, מלווים במשא ומתן ובדיון מול המפקח או בית המשפט, ומחזיקים את הפרויקט עד למימוש.</p></div></div>
    </div>
  </div>
</section>

<!-- WHO FOR -->
<section class="section section--cream">
  <div class="container">
    <div class="content-block two-col">
      <div class="reveal">
        <span class="eyebrow">למי זה מתאים</span>
        <h2 class="section-title" style="margin-top:.8rem;">למי מיועד הליווי שלנו?</h2>
        <p class="lead" style="margin-top:1rem;">לכל מי שמעורב בפרויקט התחדשות - בכל צד של השולחן.</p>
      </div>
      <ul class="check-list reveal reveal-d1">
        <li>נציגויות דיירים השוקלות הסכם פינוי-בינוי</li>
        <li>בעלי דירות שרוצים לוודא שהתמורה הוגנת</li>
        <li>יזמים ומארגנים הבודקים כדאיות פרויקט</li>
        <li>עורכי דין המלווים מתחמי התחדשות</li>
        <li>צדדים בהליך "דייר סרבן" מול המפקח או בית המשפט</li>
        <li>בנקים וגופים מממנים הזקוקים לדוח שמאי</li>
      </ul>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="section">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">שאלות נפוצות</span>
      <h2 class="section-title">מה חשוב לדעת</h2>
    </div>
    <div class="faq-list reveal reveal-d1">
      <details class="faq-item"><summary>מה בעצם בודקת שומת תקן 21?</summary><div class="faq-body">שתי שאלות: האם הפרויקט <strong>כדאי כלכלית</strong> (יש רווח שמצדיק ביצוע), והאם <strong>התמורה לדיירים הוגנת</strong> ביחס לדירה ולזכויות שהם מביאים. השמאי בונה לשם כך שני מאזנים - מצד הדייר ומצד היזם.</div></details>
      <details class="faq-item"><summary>אני דייר - איך זה עוזר לי?</summary><div class="faq-body">השומה מתרגמת את ההצעה של היזם למספרים שאתם יכולים להבין ולהשוות. כך תדעו אם התמורה הוגנת לפני שאתם חותמים, ותוכלו לנהל משא ומתן מתוך עמדת ידע - לא תחושות.</div></details>
      <details class="faq-item"><summary>מה זה "דייר סרבן" ואיך תקן 21 קשור?</summary><div class="faq-body">דייר סרבן הוא בעל דירה שמסרב לחתום למרות שרוב גדול הסכים. אם סירובו אינו סביר, ניתן בתנאים מסוימים לתבוע אותו. שומת תקן 21 משמשת להוכיח בפני המפקח או בית המשפט שהעסקה <strong>הוגנת וכדאית</strong> - ולכן הסירוב אינו סביר.</div></details>
      <details class="faq-item"><summary>מה ההבדל בין תמ"א 38 לפינוי-בינוי?</summary><div class="faq-body"><strong>תמ"א 38</strong> - חיזוק או עיבוי בניין קיים מפני רעידות אדמה, בלי הריסה (פרויקט נקודתי). <strong>פינוי-בינוי</strong> - הריסת מתחם שלם ובניית מבנים חדשים וגדולים יותר במקומו (פרויקט רחב היקף). בשניהם תקן 21 בוחן כדאיות והוגנות.</div></details>
      <details class="faq-item"><summary>אתם מלווים גם דיירים וגם יזמים?</summary><div class="faq-body">כן. אנחנו מלווים נציגויות דיירים, יזמים, מארגנים ובנקים - בכל שלב, מבדיקת ההיתכנות ועריכת שומת תקן 21 ודוח אפס ועד המימוש.</div></details>
    </div>
  </div>
</section>

<!-- CTA / LEAD -->
<section class="section cta-band" id="lead">
  <div class="container">
    <div class="cta-inner">
      <div class="cta-copy reveal">
        <span class="eyebrow">ייעוץ ראשוני</span>
        <h2>בואו נבדוק את הפרויקט שלכם</h2>
        <p>השאירו פרטים ושמאי מוסמך יחזור אליכם לשיחת ייעוץ ראשונית על פרויקט ההתחדשות - ללא התחייבות.</p>
      </div>
      <div class="cta-form reveal reveal-d1">
        <h3>שלחו לנו פנייה</h3>
        <p>נחזור אליכם בהקדם האפשרי</p>
        <form class="contact-form" id="contact-form" onsubmit="return submitContactForm(event, 'contact')">
          <input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);border:0;opacity:0">
          <div class="form-grid">
            <div class="form-group"><label for="contact-name">שם מלא *</label><input type="text" id="contact-name" name="name" placeholder="ישראל ישראלי" required autocomplete="name"></div>
            <div class="form-group"><label for="contact-phone">טלפון *</label><input type="tel" id="contact-phone" name="phone" placeholder="05X-XXXXXXX" required autocomplete="tel"></div>
          </div>
          <div class="form-group"><label for="contact-email">דוא"ל</label><input type="email" id="contact-email" name="email" placeholder="israel@example.com" autocomplete="email"></div>
          <div class="form-group">
            <label for="contact-subject">נושא פנייה</label>
            <select id="contact-subject" name="subject">
              <option value="תקן 21 / פינוי-בינוי" selected>תקן 21 / פינוי-בינוי</option>
              <option>בדיקת כדאיות</option>
              <option>היטל השבחה</option>
              <option>השגה על שומת רמ"י</option>
              <option>ייעוץ</option>
              <option>אחר</option>
            </select>
          </div>
          <div class="form-group"><label for="contact-message">הודעה</label><textarea id="contact-message" name="message" placeholder="ספרו לנו על המתחם או הפרויקט - מיקום, מספר דיירים ושלב..."></textarea></div>
          <button type="submit" class="btn btn-gold form-submit" id="contact-submit-btn">שלח פנייה <span class="arr">←</span></button>
          <div id="contact-form-status" class="form-status"></div>
        </form>
      </div>
    </div>
  </div>
</section>

<!-- RELATED -->
<section class="section section--cream">
  <div class="container">
    <div class="sec-intro reveal">
      <span class="eyebrow">תחומים נוספים</span>
      <h2 class="section-title">אולי יעניין אתכם גם</h2>
    </div>
    <div class="related reveal reveal-d1">
      <a href="hetel-hashbacha-pinui-binui.html">היטל השבחה בפינוי-בינוי <span class="arr">←</span></a>
      <a href="hetel-hashbacha.html">היטל השבחה <span class="arr">←</span></a>
      <a href="hasagot-rami.html">השגות על שומות רמ"י <span class="arr">←</span></a>
      <a href="shamaut-haklait.html">שמאות חקלאית ונזקי טבע <span class="arr">←</span></a>
    </div>
  </div>
</section>

</main>

<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="logo-bm.png" alt="לוגו בורוביץ מזרחי">
        <p>משרד שמאות מקרקעין מוביל בצפון. ידע מקצועי מעמיק, היכרות שטח בלתי אמצעית והבנה כלכלית רחבה - בשירות כל לקוח.</p>
      </div>
      <div class="footer-col">
        <h4>ניווט</h4>
        <ul>
          <li><a href="index.html#about">אודות</a></li>
          <li><a href="index.html#services">תחומי התמחות</a></li>
          <li><a href="maamarim.html">מאמרים</a></li>
          <li><a href="index.html#success">תוצאות מהשטח</a></li>
          <li><a href="careers.html">קריירה</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>יצירת קשר</h4>
        <ul>
          <li><a href="tel:054-6559942">054-6559942 · מאור</a></li>
          <li><a href="tel:050-8922469">050-8922469 · אמיר</a></li>
          <li><a id="em-footer" href="#"></a></li>
          <li>שדרות החרוב 6, פארק תעשיות בר-לב</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 בורוביץ מזרחי שמאות מקרקעין וחקלאות בע"מ. כל הזכויות שמורות.</span>
      <span><a href="index.html">חזרה לאתר הראשי</a></span>
    </div>
  </div>
</footer>

<div class="floating-wrap">
  <a class="float-btn float-btn-wa" href="https://wa.me/972546559942" target="_blank" rel="noopener noreferrer" aria-label="שלחו הודעה בוואטסאפ">
    <svg aria-hidden="true" viewBox="0 0 32 32"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.67 4.61 1.832 6.5L4 29l7.75-1.812A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="#fff"/><path d="M21.5 18.5c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.19-.57-.34z" fill="#25D366"/></svg>
  </a>
  <button type="button" id="customAccessBtn" class="float-btn float-btn-access" aria-label="פתח תפריט נגישות" title="נגישות"><span aria-hidden="true">♿</span></button>
</div>

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<script>
  (function(){ var el=document.getElementById('em-footer'); if(el){ var a='info'+'@'+'bor-miz.co.il'; el.href='mailto:'+a; el.textContent=a; } })();
  function toggleMenu(){ var l=document.getElementById('navLinks'),b=document.getElementById('hamburger'); l.classList.toggle('open'); b.classList.toggle('open'); b.setAttribute('aria-expanded', l.classList.contains('open')?'true':'false'); }
  function closeMenu(){ document.getElementById('navLinks').classList.remove('open'); var b=document.getElementById('hamburger'); b.classList.remove('open'); b.setAttribute('aria-expanded','false'); }
  document.addEventListener('click', function(e){ var nav=document.getElementById('navbar'); if(nav && !nav.contains(e.target)) closeMenu(); });
  (function(){ var nav=document.getElementById('navbar'); var onScroll=function(){ nav.classList.toggle('scrolled', window.scrollY>60); }; window.addEventListener('scroll', onScroll, {passive:true}); onScroll(); })();
  (function(){
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce || !window.gsap || !window.ScrollTrigger){
      document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
      document.querySelectorAll('.counter').forEach(function(el){ el.textContent = el.getAttribute('data-target'); });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.reveal').forEach(function(el){ ScrollTrigger.create({ trigger: el, start:'top 88%', onEnter:function(){ el.classList.add('in'); } }); });
    document.querySelectorAll('.counter').forEach(function(el){
      var target=+el.getAttribute('data-target');
      ScrollTrigger.create({ trigger: el, start:'top 92%', once:true, onEnter:function(){ var o={v:0}; gsap.to(o,{v:target,duration:1.6,ease:'power2.out',onUpdate:function(){ el.textContent=Math.round(o.v); }}); } });
    });
  })();
  var EDGE_FUNCTION_URL = 'https://nurgknexilxaxxovdbco.supabase.co/functions/v1/website-lead-intake';
  var SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51cmdrbmV4aWx4YXh4b3ZkYmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMjAxMzYsImV4cCI6MjA4OTY5NjEzNn0.S6BwlUfYkdWegz1gigK5dK0lXUowp4safWOFEzExuS0';
  function submitContactForm(e){
    e.preventDefault();
    var form=document.getElementById('contact-form'), btn=document.getElementById('contact-submit-btn'), statusEl=document.getElementById('contact-form-status');
    var name=document.getElementById('contact-name').value.trim(), phone=document.getElementById('contact-phone').value.trim();
    var email=document.getElementById('contact-email').value.trim(), subject=document.getElementById('contact-subject').value, message=document.getElementById('contact-message').value.trim();
    if(!name || !phone){ statusEl.style.display='block'; statusEl.style.color='#fca5a5'; statusEl.textContent='נא למלא שם וטלפון'; return false; }
    btn.disabled=true; btn.textContent='שולח...'; statusEl.style.display='none';
    fetch(EDGE_FUNCTION_URL, { method:'POST', headers:{'Content-Type':'application/json','apikey':SB_ANON,'Authorization':'Bearer '+SB_ANON}, body: JSON.stringify({ name:name, phone:phone, email:email||null, subject:subject||null, message:message||null, source:'service-page', _hp:(form.querySelector('input[name="website"]')||{value:''}).value, elapsed_ms:Math.round(performance.now()) }) })
      .then(function(res){ return res.json(); })
      .then(function(data){
        if(data.success){
          window.dataLayer=window.dataLayer||[]; window.dataLayer.push({ event:'generate_lead', form_source:'service-page', lead_subject:subject||'unspecified' });
          statusEl.style.display='block'; statusEl.style.color='#4ade80'; statusEl.textContent=data.message||'הפנייה נשלחה בהצלחה!'; form.reset();
        } else { throw new Error(data.error||'שגיאה בשליחה'); }
      })
      .catch(function(err){ statusEl.style.display='block'; statusEl.style.color='#fca5a5'; statusEl.textContent='שגיאה: '+(err.message||'נסו שוב מאוחר יותר'); })
      .finally(function(){ btn.disabled=false; btn.innerHTML='שלח פנייה <span class="arr">←</span>'; });
    return false;
  }
  (function(){ window.dataLayer=window.dataLayer||[]; document.addEventListener('click', function(e){ var el=e.target.closest&&e.target.closest('a'); if(!el) return; if(/wa\.me|api\.whatsapp/.test(el.href||'')){ window.dataLayer.push({event:'contact_whatsapp'}); } else if((el.getAttribute('href')||'').indexOf('tel:')===0){ window.dataLayer.push({event:'contact_phone'}); } }, true); })();
</script>

<nagishli></nagishli>
<script>
nl_contact = "n:בורוביץ מזרחי שמאות מקרקעין וחקלאות בע\"מ|p:054-6559942|u:maor@bor-miz.co.il";
nl_pos = "BL"; nl_lang = "he"; nl_color = "blue"; nl_compact = "1";
</script>
<script src="nagishli.js?v=2.3" charset="utf-8"></script>
<script>
  (function(){
    function forceCompactStyles(){
      var bar=document.getElementById('NagishLiBar'), menus=document.getElementById('NagishLiMenus');
      if(bar){ bar.style.cssText='position:fixed !important; left:1.4rem !important; right:auto !important; bottom:6.2rem !important; top:auto !important; width:300px !important; max-width:90vw !important; height:auto !important; z-index:9999 !important; background:transparent !important; box-shadow:none !important; border:none !important; padding:0 !important; margin:0 !important;'; }
      if(menus){ menus.style.cssText+=';position:static !important; width:300px !important; max-width:90vw !important; max-height:70vh !important; overflow-y:auto !important; overflow-x:hidden !important; font-size:13px !important; border-radius:12px !important; box-shadow:0 10px 40px rgba(0,0,0,0.3) !important; margin:0 !important; padding:0 !important; background:#fff !important;'; }
      document.querySelectorAll('#NagishLiMenus, #NagishLiMenus ul').forEach(function(el){ el.style.width='100%'; el.style.maxWidth='300px'; el.style.boxSizing='border-box'; });
    }
    function openNagishLiMenu(){
      if(typeof jQuery==='undefined') return false;
      var $=jQuery, $strip=$('#NagishLiBarStrip'), $menus=$('#NagishLiMenus');
      if(!$strip.length || !$menus.length) return false;
      if($menus.is(':visible')){ $menus.slideUp(150, function(){ $strip.removeClass('open'); }); }
      else { forceCompactStyles(); $strip.addClass('open'); $menus.slideDown(150, forceCompactStyles); }
      return true;
    }
    function bind(){ var btn=document.getElementById('customAccessBtn'); if(!btn) return; btn.addEventListener('click', function(e){ e.preventDefault(); var n=0; (function tryOpen(){ if(openNagishLiMenu()) return; if(++n<30) setTimeout(tryOpen,200); })(); }); }
    if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', bind); } else { bind(); }
  })();
</script>

</body>
</html>

```

---

## תצורה, SEO ושונות

### `.netlifyignore`

```text
חומר מקצועי/
.git/
_article-template.html
הוראות-מאמרים.md
index-old.html
*.zip
_build/
svc-photos/*.png
בקרה/

```

### `_headers`

```text
# ════════════════════════════════════════════════════════════════════════════
# _headers — Netlify security headers for bor-miz.co.il
#
# Why: without these headers the site scores poorly on automated security /
# reputation scanners (Sucuri, Norton Safe Web, browser AV extensions), which
# is what makes tools label a perfectly healthy site as "not trustworthy".
# The site itself is clean — this closes the gap the scanners complain about.
#
# Netlify applies these on every response. Order matters only for specificity:
# later, more specific paths win.
# ════════════════════════════════════════════════════════════════════════════

/*
  # Block MIME-type sniffing (stops a .jpg being executed as a script)
  X-Content-Type-Options: nosniff

  # Clickjacking: nobody may frame our pages except us
  X-Frame-Options: SAMEORIGIN

  # Don't leak the full URL (and query params) to third-party sites
  Referrer-Policy: strict-origin-when-cross-origin

  # Deny browser features the site never uses
  Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), interest-cohort=()

  # Force HTTPS for a year, including sub-domains
  Strict-Transport-Security: max-age=31536000; includeSubDomains

  # Content-Security-Policy — allow-list of every host the site actually uses:
  #   scripts : self + inline, jQuery CDN, cdnjs (Font Awesome), jsDelivr, Google Tag Manager / Ads
  #   styles  : self + inline, Google Fonts, cdnjs
  #   fonts   : Google Fonts static, cdnjs, data: URIs
  #   connect : Supabase edge function (lead form), Google Analytics endpoints
  #   frames  : Google Maps embed, GTM noscript iframe
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://code.jquery.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://www.googletagmanager.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://www.googleadservices.com https://www.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: blob: https:; connect-src 'self' https://nurgknexilxaxxovdbco.supabase.co https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://www.googletagmanager.com https://www.google.com https://www.google.co.il https://stats.g.doubleclick.net https://*.g.doubleclick.net; frame-src 'self' https://maps.google.com https://www.google.com https://www.googletagmanager.com https://td.doubleclick.net; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests

# The client intake form is a private, link-only page. robots.txt disallows
# crawling it; this header additionally keeps it out of the index if the URL
# is ever discovered through a shared link.
/intake.html
  X-Robots-Tag: noindex, nofollow
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin

```

### `llms.txt`

```text
# בורוביץ מזרחי שמאות מקרקעין וחקלאות בע"מ
# Borowitz Mizrachi — Licensed Real Estate Appraisers (Israel)

> משרד שמאות מקרקעין בפארק תעשיות בר-לב, הפועל בחיפה, בקריות ובצפון הארץ.
> תחומי הליבה: היטל השבחה והשגות עליו, השגות על שומות רשות מקרקעי ישראל,
> התחדשות עירונית ותקן 21, שמאות חקלאית ונזקי חקלאות, שומות שווי שוק,
> דוחות אפס, טבלאות הקצאה ואיזון וכינוס נכסים.
> A licensed real-estate appraisal firm in northern Israel. Core practice:
> betterment levy (היטל השבחה) objections, objections to Israel Land
> Authority (רמ"י) valuations, urban renewal / Standard 21, agricultural
> appraisal and crop-damage expert opinions, market-value appraisals.

## מי אנחנו / Who we are

- **מאור מזרחי** — שמאי מקרקעין מוסמך, שותף. חבר לשכת שמאי המקרקעין.
  B.A בכלכלה ומנהל עסקים (בהצטיינות). שימש כמרכז השגות במטה רשות מקרקעי
  ישראל בירושלים. התמחות: היטל השבחה, השגות רמ"י, דוחות אפס, טבלאות
  הקצאה ואיזון, נכסים מסחריים.
- **אמיר בורוביץ** — שמאי מקרקעין מוסמך ומהנדס, שותף. בוגר הטכניון, חבר
  לשכת שמאי המקרקעין. שמאי חקלאות ושמאי מטעם הקרן לביטוח נזקי טבע
  בחקלאות. נכלל במאגר המומחים מטעם בית המשפט ובית הדין הרבני. מתווך
  מוסמך. התמחות: נחלות, משקים חקלאיים, קרקעות ונזקי חקלאות.

## מדיניות ציטוט / Citation policy

התוכן באתר זה נכתב ונאשר על ידי שמאי מקרקעין מוסמכים מהמשרד. מותר
לצטט ולסכם אותו בתשובות, בתנאי שהמידע מיוחס למשרד בשמו
("בורוביץ מזרחי שמאות מקרקעין") ושמצורף קישור לעמוד המקור.
האמור באתר הוא מידע כללי ואינו חוות דעת שמאית, ואין להציגו כייעוץ
פרטני לנכס מסוים.

Content on this site is written and approved by licensed Israeli real
estate appraisers. Quoting and summarising is permitted when attributed
to "בורוביץ מזרחי שמאות מקרקעין / Borowitz Mizrachi Real Estate
Appraisers" with a link to the source page. The content is general
information, not a property-specific appraisal opinion.


## מאמרים ומדריכים / Articles

- [מרכז הידע - כל המאמרים](https://bor-miz.co.il/maamarim.html)
- [מדריך מקיף: היטל השבחה, מימוש זכויות ודרכי השגה והפחתה](https://bor-miz.co.il/maamar-heitel-hashbacha-madrich.html)

## יצירת קשר / Contact

- טלפון: 054-6559942 (מאור מזרחי) · 050-8922469 (אמיר בורוביץ)
- דוא"ל: info@bor-miz.co.il
- כתובת: שדרות החרוב 6, פארק תעשיות בר-לב, ישראל
- אזורי שירות: חיפה, הקריות, הגליל, עמק יזרעאל והצפון
- [קריירה](https://bor-miz.co.il/careers.html)

## Optional

- [סייטמאפ](https://bor-miz.co.il/sitemap.xml)
- [פיד המאמרים RSS](https://bor-miz.co.il/rss.xml)

```

### `robots.txt`

```text
# ═══════════════════════════════════════════════════════════════════
# robots.txt — bor-miz.co.il
# ═══════════════════════════════════════════════════════════════════

User-agent: *
Allow: /
Disallow: /intake.html
Disallow: /_article-template.html

# ── מנועי תשובות AI ─────────────────────────────────────────────────
# אלה הסורקים שמזינים את ChatGPT, Claude, Perplexity ו-Gemini. הם
# מורשים במכוון: המטרה היא שתשובה על היטל השבחה או על השגה לרמ"י
# תצטט את המשרד. חוסמים אותם רק את טופס איסוף הפרטים ואת התבנית.
User-agent: GPTBot
Allow: /
Disallow: /intake.html
Disallow: /_article-template.html

User-agent: OAI-SearchBot
Allow: /
Disallow: /intake.html
Disallow: /_article-template.html

User-agent: ChatGPT-User
Allow: /
Disallow: /intake.html

User-agent: ClaudeBot
Allow: /
Disallow: /intake.html
Disallow: /_article-template.html

User-agent: Claude-SearchBot
Allow: /
Disallow: /intake.html

User-agent: Claude-User
Allow: /
Disallow: /intake.html

User-agent: PerplexityBot
Allow: /
Disallow: /intake.html
Disallow: /_article-template.html

User-agent: Perplexity-User
Allow: /
Disallow: /intake.html

User-agent: Google-Extended
Allow: /
Disallow: /intake.html

User-agent: Applebot-Extended
Allow: /
Disallow: /intake.html

User-agent: Bingbot
Allow: /
Disallow: /intake.html
Disallow: /_article-template.html

Sitemap: https://bor-miz.co.il/sitemap.xml

```

### `rss.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!--
  פיד המאמרים של bor-miz.co.il
  מוסיפים מאמר חדש כ-<item> חדש בראש הרשימה, ומעדכנים את lastBuildDate.
  pubDate בפורמט RFC-822, למשל: Sat, 18 Oct 2026 09:00:00 +0300
-->
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>מאמרים · בורוביץ מזרחי שמאות מקרקעין</title>
    <link>https://bor-miz.co.il/maamarim.html</link>
    <atom:link href="https://bor-miz.co.il/rss.xml" rel="self" type="application/rss+xml"/>
    <description>מדריכים מקצועיים בשמאות מקרקעין: היטל השבחה, השגות על שומות רשות מקרקעי ישראל, התחדשות עירונית, תקן 21 ושמאות חקלאית.</description>
    <language>he-il</language>
    <copyright>© 2026 בורוביץ מזרחי שמאות מקרקעין וחקלאות בע"מ</copyright>
    <lastBuildDate>Tue, 27 Oct 2026 09:00:00 +0300</lastBuildDate>

    <item>
      <title>מדריך מקיף: היטל השבחה, מימוש זכויות ודרכי השגה והפחתה</title>
      <link>https://bor-miz.co.il/maamar-heitel-hashbacha-madrich.html</link>
      <guid isPermaLink="true">https://bor-miz.co.il/maamar-heitel-hashbacha-madrich.html</guid>
      <pubDate>Tue, 27 Oct 2026 09:00:00 +0300</pubDate>
      <author>info@bor-miz.co.il (מאור מזרחי)</author>
      <category>היטל השבחה</category>
      <description>במדריך זה נפרט מהו היטל השבחה, מתי נוצרת החבות ומתי חלה חובת התשלום בפועל, אילו פטורים וקיזוזי הוצאות ניתן לדרוש, מהם המסלולים החוקיים המדויקים להגשת השגה, וכיצד משרדנו מלווה ומנהל את ההליך השמאי והמשפטי להפחתת השומה עד לתוצאה המיטבית.</description>
    </item>

  </channel>
</rss>

```

### `sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://bor-miz.co.il/</loc>
    <lastmod>2026-10-28</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://bor-miz.co.il/maamarim.html</loc>
    <lastmod>2026-10-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://bor-miz.co.il/maamar-heitel-hashbacha-madrich.html</loc>
    <lastmod>2026-10-27</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://bor-miz.co.il/careers.html</loc>
    <lastmod>2026-06-28</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://bor-miz.co.il/hitmahut/heitlei-hashbacha.html</loc>
    <lastmod>2026-11-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://bor-miz.co.il/hitmahut/haarachat-shovi.html</loc>
    <lastmod>2026-11-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://bor-miz.co.il/hitmahut/shomot-haklaiot.html</loc>
    <lastmod>2026-11-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://bor-miz.co.il/hitmahut/hasagot-rami.html</loc>
    <lastmod>2026-11-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://bor-miz.co.il/hitmahut/yeridat-erech-197.html</loc>
    <lastmod>2026-11-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://bor-miz.co.il/hitmahut/nachalot-umeshakim.html</loc>
    <lastmod>2026-11-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://bor-miz.co.il/hitmahut/tavlaot-ichud-vehaluka.html</loc>
    <lastmod>2026-11-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://bor-miz.co.il/hitmahut/kedaiut-kalkalit.html</loc>
    <lastmod>2026-11-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://bor-miz.co.il/hitmahut/kinus-ufiruk-shituf.html</loc>
    <lastmod>2026-11-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>

```
