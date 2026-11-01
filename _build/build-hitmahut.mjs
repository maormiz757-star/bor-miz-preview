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
      <h2 class="sp-kicker">מה כוללת חוות הדעת</h2>
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
