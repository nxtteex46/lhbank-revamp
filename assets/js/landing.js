/* Shared Landing Template — one renderer, three segment configs.
   Personal = full design. SME / Business = section & content variants
   built from the same section components (per brief §4). */
(function () {
  const { icon, img, U, url, fmt, $, $$, sparkline, series } = window.LH;
  const D = window.LHDATA;
  const main = document.getElementById("landing");
  const variant = main.dataset.variant || "personal";
  const P = (id) => D.products.find((p) => p.id === id);

  /* ---------- Section components ---------- */
  const S = {};

  /* Cinematic hero (v2) — Personal uses data cards; SME / Business pass none */
  S.hero = (c) => `
    <section class="hero2">
      <div class="hero2__frame ${c.cards ? "hero2__frame--shift" : ""}">
        ${img(U(c.img, 2000), "", 'fetchpriority="high" loading="eager"')}
        <div class="container hero2__content">
          <span class="eyebrow eyebrow--glass">${c.eyebrow}</span>
          <h1>${c.title}</h1>
          <p class="t-lead">${c.lead}</p>
          <div class="hero2__actions">
            <a class="btn btn--primary btn--lg" href="${url(c.primary[1])}">${c.primary[0]} ${icon("arrow-right")}</a>
            <a class="btn btn--glass btn--lg" href="${c.secondary[2] ? "#" : url(c.secondary[1])}" ${c.secondary[2] ? `data-modal="${c.secondary[2]}"` : ""}>${c.secondary[0]}</a>
          </div>
          ${c.trust ? `<div class="hero2__trust">${c.trust.map(([v, l]) => `<div><strong>${v}</strong><span>${l}</span></div>`).join("")}</div>` : ""}
        </div>
        ${c.cards ? `<div class="hero2__cards">
          <div class="glass-card"><div class="lbl">สินเชื่อส่วนบุคคล Happy Cash</div><div class="val">8.88%</div><div class="lbl">ดอกเบี้ยเริ่มต้นต่อปี* · นานสูงสุด 5 ปี</div></div>
          <div class="glass-card"><div class="lbl">ตัวอย่างค่างวด Home 1st Class</div><div class="val">฿12,105<span style="font-size:.45em;opacity:.7"> /เดือน</span></div><div class="bar"><span style="width:62%"></span></div><div class="row row--between lbl mt-2"><span>วงเงิน 3 ล้าน · 30 ปี · 3 ปีแรก</span><span>2.66%</span></div></div>
        </div>` : ""}
      </div>
      <div class="container">
        <nav class="quick-bar" aria-label="ทางลัด">
          ${c.quick.map(([ic, t, st, h]) => `<a href="${url(h)}"><span class="tile__icon">${icon(ic)}</span><div><strong>${t}</strong><span>${st}</span></div></a>`).join("")}
        </nav>
      </div>
    </section>`;
  S.heroSplit = (c) => S.hero({ ...c, cards: true });
  S.heroBanner = (c) => S.hero(c);

  S.discovery = (c) => `
    <section class="section" id="discover">
      <div class="container">
        <div class="section-head reveal">
          <div class="section-head__text">
            <span class="eyebrow">${c.eyebrow}</span>
            <h2>${c.title}</h2>
            <p class="t-lead">${c.lead}</p>
          </div>
          <a class="link" href="${url(c.all)}">ดูผลิตภัณฑ์ทั้งหมด ${icon("arrow-right")}</a>
        </div>
        <div class="discovery reveal" data-discovery>
          <div class="goal-list" role="tablist" aria-label="เป้าหมาย">
            ${c.goals.map((g, i) => `<button class="goal ${i === 0 ? "is-active" : ""}" role="tab" aria-selected="${i === 0}" data-goal="${i}"><span class="goal__num">0${i + 1}</span><span class="goal__label">${g.label}</span>${icon("arrow-right")}</button>`).join("")}
          </div>
          <div data-goal-panel></div>
        </div>
      </div>
    </section>`;

  const goalPanel = (g) => `
    <div class="discovery__panel">
      <a class="discovery__lead" href="${url(g.href)}">
        ${img(U(g.img, 900))}
        <span class="badge badge--glass">${g.tag}</span>
        <h3 class="mt-4" style="font-size:1.6rem">${g.headline}</h3>
        <p class="mt-2" style="opacity:.8;max-width:38ch">${g.text}</p>
        <span class="btn btn--light btn--sm mt-6" style="align-self:flex-start">${g.cta} ${icon("arrow-right")}</span>
      </a>
      ${g.items.map((id) => { const p = P(id); return p ? `
        <a class="discovery__item" href="${url("personal/product/?id=" + p.id)}">
          <div class="row row--between"><span class="t-xs t-muted">${D.categories[p.cat].label}</span>${icon("arrow-up-right")}</div>
          <strong style="font-size:1.1rem;line-height:1.4">${p.name}</strong>
          <div class="row" style="gap:6px;align-items:baseline;margin-top:auto">${p.highlight.text ? `<span class="product-card__value--text" style="font-size:1.2rem">${p.highlight.text}</span>` : `<span class="t-num" style="font-size:1.6rem;font-weight:600">${p.highlight.value}<small style="font-size:.55em">${p.highlight.unit}</small></span>`}<span class="t-xs t-muted">${p.highlight.label}</span></div>
        </a>` : ""; }).join("")}
    </div>`;

  S.featured = (c) => `
    <section class="section section--mist">
      <div class="container">
        <div class="section-head reveal">
          <div class="section-head__text"><span class="eyebrow">${c.eyebrow}</span><h2>${c.title}</h2></div>
          <div class="segmented" data-featured-filter>
            ${c.tabs.map((t, i) => `<button class="${i === 0 ? "is-active" : ""}" data-cat="${t[1]}">${t[0]}</button>`).join("")}
          </div>
        </div>
        <div class="cols-3 reveal" data-featured-grid></div>
        <div class="text-center mt-12"><a class="btn btn--secondary" href="${url(c.all)}">ดูผลิตภัณฑ์ทั้งหมด ${icon("arrow-right")}</a></div>
      </div>
    </section>`;

  const productCard = (p) => `
    <a class="product-card" href="${url("personal/product/?id=" + p.id)}">
      <div class="media product-card__media">${img(U(p.img, 700), p.name)}</div>
      ${p.badge ? `<div class="product-card__badges"><span class="badge badge--glass" style="background:rgba(13,29,42,.55)">${p.badge}</span></div>` : ""}
      <div class="product-card__body">
        <span class="product-card__cat">${D.categories[p.cat].label}</span>
        <h3 class="product-card__title">${p.name}</h3>
        <p class="product-card__desc">${p.tagline}</p>
        <div class="product-card__highlight">${p.highlight.text ? `<span class="product-card__value product-card__value--text">${p.highlight.text}</span>` : `<span class="product-card__value">${p.highlight.value}<small>${p.highlight.unit}</small></span>`}<span class="product-card__label">${p.highlight.label}</span></div>
      </div>
    </a>`;
  window.LH.productCard = productCard;

  /* Family Banking band — real LH Bank tiers (Wealth → Elite Privilege) */
  S.privilege = (c) => `
    <section class="privilege" id="family">
      <div class="privilege__inner container">
        <div class="privilege__media reveal">
          ${img(U(c.img, 1400), "")}
          <div class="tier-card" aria-label="ระดับสมาชิก Family Banking">
            <div class="tier-card__head"><img src="${url("assets/img/lhbank/logo.svg")}" alt="LH Bank" width="132" height="32"><span>FAMILY BANKING</span></div>
            <ol>${c.tiers.map((t, i) => `<li><span>0${c.tiers.length - i}</span><strong>${t}</strong></li>`).join("")}</ol>
          </div>
        </div>
        <div class="privilege__content reveal">
          <span class="eyebrow">${c.eyebrow}</span>
          <h2>${c.title}</h2>
          <p class="t-lead">${c.lead}</p>
          <ol class="privilege__list">
            ${c.points.map(([t, d], i) => `<li><span class="privilege__num">0${i + 1}</span><div><strong>${t}</strong><p>${d}</p></div></li>`).join("")}
          </ol>
          <div class="row" style="gap:10px;margin-top:8px">
            <a class="btn btn--primary btn--lg" href="#" data-modal="leadModal">${c.cta} ${icon("arrow-right")}</a>
            <a class="btn btn--glass btn--lg" href="${url("personal/investments/")}">การลงทุน</a>
          </div>
        </div>
      </div>
    </section>`;

  S.stats = (c) => `
    <section class="section--tight">
      <div class="container">
        <div class="trust-strip reveal">
          ${c.items.map(([v, l]) => `<div><div class="stat__value">${v}</div><div class="stat__label">${l}</div></div>`).join("")}
        </div>
      </div>
    </section>`;

  S.promotions = (c) => `
    <section class="section">
      <div class="container carousel" data-carousel>
        <div class="section-head reveal">
          <div class="section-head__text"><span class="eyebrow">${c.eyebrow}</span><h2>${c.title}</h2></div>
          <div class="carousel__nav"><button data-prev aria-label="ก่อนหน้า">${icon("arrow-left")}</button><button data-next aria-label="ถัดไป">${icon("arrow-right")}</button></div>
        </div>
        <div class="carousel__track reveal">
          ${c.items.map((p) => `
            <a class="promo-card" href="${url(p.href)}">
              <div class="media media--zoom">${img(U(p.img, 900), "")}</div>
              <div class="promo-card__meta"><span class="badge">${p.tag}</span><span>${p.until}</span></div>
              <h3>${p.title}</h3>
              <span class="link">ดูรายละเอียด ${icon("arrow-right")}</span>
            </a>`).join("")}
        </div>
        <div class="carousel__progress"><span></span></div>
      </div>
    </section>`;

  S.advisory = (c) => `
    <section class="section" id="advisory" style="padding-top:0">
      <div class="container">
        <div class="advisory reveal">
          <div class="advisory__content">
            <span class="eyebrow" style="color:var(--c-accent-200)">${c.eyebrow}</span>
            <h2>${c.title}</h2>
            <p class="t-lead">${c.lead}</p>
            <ul class="advisory__list">${c.points.map((t) => `<li>${icon("check")}<span>${t}</span></li>`).join("")}</ul>
            <div class="row" style="gap:12px">
              <a class="btn btn--primary btn--lg" href="#" data-modal="leadModal">${c.cta} ${icon("arrow-right")}</a>
              <a class="btn btn--outline-light btn--lg" href="tel:1327">${icon("phone")} 1327</a>
            </div>
          </div>
          <div class="advisory__media">
            ${img(U(c.img, 1000))}
            <div class="advisor-chip"><span class="avatar" style="display:grid;place-items:center;color:var(--c-accent-700);background:var(--c-accent-50)">${c.avatar ? img(U(c.avatar, 120)) : icon("headset")}</span><div><strong class="t-sm" style="display:block;line-height:1.2">${c.advisor}</strong><span class="t-xs t-muted">${c.role}</span></div><span class="live" title="ออนไลน์"></span></div>
          </div>
        </div>
      </div>
    </section>`;

  S.tools = (c) => `
    <section class="section section--sand">
      <div class="container">
        <div class="section-head reveal"><div class="section-head__text"><span class="eyebrow">${c.eyebrow}</span><h2>${c.title}</h2></div></div>
        <div class="cols-4 reveal">
          ${c.items.map(([ic, t, d, h]) => `<a class="tile" href="${url(h)}" style="background:#fff"><span class="tile__icon">${icon(ic)}</span><span class="tile__arrow">${icon("arrow-right")}</span><span class="tile__title">${t}</span><span class="t-sm t-muted">${d}</span></a>`).join("")}
        </div>
      </div>
    </section>`;

  S.markets = () => {
    const m = [["SET Index", "1,428.35", "+0.84%", 7, true], ["S&P 500", "6,142.10", "+0.32%", 13, true], ["ทองคำ (บาทละ)", "48,250", "−0.21%", 19, false], ["USD/THB", "32.75", "−0.12%", 29, false]];
    return `
    <section class="section--tight">
      <div class="container">
        <div class="row row--between mb-6"><h3 class="t-h4">ภาพรวมตลาดวันนี้</h3><a class="link" href="${url("personal/investments/")}">ศูนย์การลงทุน ${icon("arrow-right")}</a></div>
        <div class="market-strip">${m.map(([n, v, ch, s, up]) => `<div class="market-card"><div class="market-card__top"><span class="t-muted">${n}</span><span class="${up ? "chg-up" : "chg-down"} t-num t-sm">${ch}</span></div><div class="market-card__val">${v}</div>${sparkline(series(s, 30, 100, 0.03, up ? 0.002 : -0.002), { color: up ? "#1c9a6a" : "#d14b4b" })}</div>`).join("")}</div>
      </div>
    </section>`;
  };

  const A = (f) => url("assets/img/lhbank/" + f);
  const APPSTORE = "https://apps.apple.com/th/app/lhb-you/id1632875085";
  const PLAY = "https://play.google.com/store/apps/details?id=com.lh.lhbu";

  S.campaigns = (c) => `
    <section class="section--tight" style="padding-top:0">
      <div class="container reveal">
        <div class="campaign" data-campaign aria-roledescription="carousel" aria-label="แคมเปญ">
          <div class="campaign__track">
            ${c.items.map(([f, mb, alt, h]) => `<a class="campaign__slide" href="${url(h)}" aria-label="${alt}"><picture>${mb ? `<source media="(max-width: 680px)" srcset="${A(mb)}">` : ""}<img src="${A(f)}" alt="${alt}" loading="lazy"></picture></a>`).join("")}
          </div>
          <button class="campaign__arrow campaign__arrow--prev" data-cprev aria-label="ก่อนหน้า">${icon("chevron-left")}</button>
          <button class="campaign__arrow campaign__arrow--next" data-cnext aria-label="ถัดไป">${icon("chevron-right")}</button>
          <div class="campaign__dots">${c.items.map((_, i) => `<button class="${i ? "" : "is-active"}" data-cdot="${i}" aria-label="สไลด์ ${i + 1}"></button>`).join("")}</div>
        </div>
      </div>
    </section>`;

  S.app = () => `
    <section class="section" id="app">
      <div class="container">
        <div class="app-real">
          <div class="reveal">
            <div class="app-real__head">
              <img class="app-real__icon" src="${A("lhbyou-icon.jpg")}" alt="ไอคอนแอป LHB You" width="72" height="72">
              <div><span class="eyebrow">แอป LHB You</span><div class="app-real__rating mt-2"><span class="app-real__stars">★★★★☆</span><strong>3.8</strong> · 739 รีวิวบน App Store</div></div>
            </div>
            <h2 class="mt-6">โลกการเงินใหม่<br><em>สไตล์ YOU</em></h2>
            <p class="t-lead mt-4" style="max-width:480px">เพื่อนใหม่ที่รู้ใจทุกเรื่องการเงิน จาก LH Bank ใช้ชำระค่างวดสินเชื่อและจัดการการเงินได้ในแอปเดียว</p>
            <ul class="check-list mt-8">
              <li>สมาร์ทพอร์ตโฟลิโอ ผลิตภัณฑ์ทางการเงินที่ใช่ พร้อมข้อเสนอสุดพิเศษเฉพาะคุณ</li>
              <li>ฟังก์ชันเด่น ฟีเจอร์โดน ง่าย สะดวก คล่องตัว ครบครัน</li>
              <li>เป็น YOU ที่ Cool กว่าเดิม ด้วย Avatar ในแบบที่เป็นคุณ</li>
            </ul>
            <div class="store-badges mt-8">
              <a class="store-badge" href="${APPSTORE}" target="_blank" rel="noopener"><svg class="ico" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9-1.7 0-3.2 1-4.1 2.5-1.8 3-.5 7.5 1.2 10 .8 1.2 1.8 2.6 3.1 2.5 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.4-.9-2.3-4.1zM14 5.4c.7-.8 1.1-1.9 1-3-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.2-.6 2.9-1.4z"/></svg><span>Download on the<strong>App Store</strong></span></a>
              <a class="store-badge" href="${PLAY}" target="_blank" rel="noopener"><svg class="ico" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M4 2.8v18.4c0 .4.4.7.8.5l10.4-9.7L4.8 2.3c-.4-.2-.8.1-.8.5zm12.2 8.3 2.9-2.7-12-6.6 9.1 9.3zm0 1.8-9.1 9.3 12-6.6-2.9-2.7zm4.3-2.1-2.4-1.3-3.1 2.5 3.1 2.5 2.4-1.3c.7-.5.7-1.9 0-2.4z"/></svg><span>Get it on<strong>Google Play</strong></span></a>
            </div>
          </div>
          <div class="app-shots reveal">
            ${[1, 2, 3, 4].map((i) => `<a class="app-shot" href="${APPSTORE}" target="_blank" rel="noopener"><img src="${A("lhbyou-screen-" + i + ".jpg")}" alt="ภาพหน้าจอแอป LHB You ${i}" loading="lazy"></a>`).join("")}
          </div>
        </div>
        <a class="app-banner reveal" href="${APPSTORE}" target="_blank" rel="noopener"><img src="${A("banner-lhbyou-joey.jpg")}" alt="LHB You — ตอบโจทย์ทุกเรื่องการเงิน" loading="lazy"></a>
      </div>
    </section>`;

  S.articles = (c) => `
    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="section-head reveal"><div class="section-head__text"><span class="eyebrow">${c.eyebrow}</span><h2>${c.title}</h2></div><a class="link" href="#" data-toast="Article Pages ใช้ Reusable Design Patterns">บทความทั้งหมด ${icon("arrow-right")}</a></div>
        <div class="cols-3 reveal">
          ${c.items.map(([im, tag, t, m]) => `<a class="article-card" href="#" data-toast="Article template — reusable pattern"><div class="media media--zoom">${img(U(im, 700))}</div><div class="row t-xs t-muted"><span class="badge badge--line">${tag}</span><span>${m}</span></div><h3>${t}</h3></a>`).join("")}
        </div>
      </div>
    </section>`;

  S.cta = (c) => `
    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="cta-band reveal">
          <div>
            <span class="eyebrow">${c.eyebrow}</span>
            <h2 class="mt-4">${c.title}</h2>
            <p class="t-lead mt-4">${c.lead}</p>
          </div>
          <div class="cta-band__actions">
            ${c.options.map(([ic, t, d, h, modal]) => `<a class="cta-option" href="${modal ? "#" : url(h)}" ${modal ? `data-modal="${modal}"` : ""}><span class="tile__icon">${icon(ic)}</span><div><strong>${t}</strong><span>${d}</span></div>${icon("arrow-right")}</a>`).join("")}
          </div>
        </div>
      </div>
    </section>`;

  S.segmentSolutions = (c) => `
    <section class="section">
      <div class="container">
        <div class="section-head reveal"><div class="section-head__text"><span class="eyebrow">${c.eyebrow}</span><h2>${c.title}</h2><p class="t-lead">${c.lead}</p></div></div>
        <div class="cols-${c.items.length === 4 ? 4 : 3} reveal">
          ${c.items.map(([ic, t, d, h]) => `<a class="tile" href="${url(h)}"><span class="tile__icon">${icon(ic)}</span><span class="tile__arrow">${icon("arrow-right")}</span><span class="tile__title">${t}</span><span class="t-sm t-muted">${d}</span></a>`).join("")}
        </div>
      </div>
    </section>`;

  /* ---------- Segment configs ---------- */
  const CONFIG = {
    personal: [
      ["heroSplit", {
        eyebrow: "Modern Wealth Lifestyle", img: "photo-1609220136736-443140cffec6",
        title: "ทุกเป้าหมายในชีวิต<br>มี<em>ที่ปรึกษา</em>เคียงข้าง",
        lead: "ตั้งแต่เริ่มทำงาน สร้างครอบครัว จนถึงวางแผนเกษียณและเสริมความมั่งคั่ง LH Bank พร้อมช่วยคุณวางแผนและตัดสินใจได้อย่างมั่นใจ",
        primary: ["ค้นหาผลิตภัณฑ์ที่ใช่", "personal/products/"], secondary: ["คำนวณสินเชื่อบ้าน", "personal/calculator/home-loan/"],
        trust: [["2.64%", "ดอกเบี้ยบ้านเริ่มต้น* Home 1st Class"], ["100%", "วงเงินกู้สูงสุด"], ["40 ปี", "ระยะเวลากู้สูงสุด"]],
        quick: [["home", "สินเชื่อบ้าน", "เริ่มต้น 2.64%*", "personal/products/?cat=home-loan"], ["calc", "คำนวณค่างวด", "รู้ผลทันที", "personal/calculator/home-loan/"], ["piggy", "เงินฝาก", "ฝากประจำพิเศษ 6 เดือน", "personal/products/?cat=deposit"], ["pie", "การลงทุน", "กองทุนแนะนำ", "personal/investments/"]],
      }],
      ["campaigns", { items: [
        ["banner-rmf-thaiesg.jpg", "banner-rmf-thaiesg-mb.jpg", "LH Fund Pro RMF / ThaiESG 2026", "personal/investments/"],
        ["banner-tax2026.jpg", "", "ลดหย่อนภาษี 2026", "personal/investments/"],
        ["banner-vision.jpg", "", "LH Bank Vision", "personal/"],
        ["banner-ipo-lhset100rmf.jpg", "", "IPO LHSET100RMF", "personal/investments/#funds"],
      ] }],
      ["discovery", {
        eyebrow: "LH Bank Advisory", title: "วันนี้คุณอยู่ใน<em>ช่วงชีวิต</em>ไหน", lead: "เลือกช่วงชีวิตของคุณ แล้วเราจะแนะนำผลิตภัณฑ์ที่เหมาะสม", all: "personal/products/",
        goals: [
          { label: "เริ่มทำงาน", img: "photo-1548142813-c348350df52b", tag: "เริ่มต้นออม", headline: "เริ่มต้นวางรากฐานการเงินตั้งแต่วันแรก", text: "เริ่มออมกับบัญชีออมทรัพย์ และมีสินเชื่อส่วนบุคคลไว้รองรับเป้าหมาย", cta: "ดูบัญชีเงินฝาก", href: "personal/products/?cat=deposit", items: ["digital-savings", "happy-cash"] },
          { label: "สร้างครอบครัว", img: "photo-1613490493576-7fde63acd811", tag: "สินเชื่อบ้าน", headline: "บ้านหลังใหม่สำหรับครอบครัว", text: "Home 1st Class กู้ได้ 100% ระยะเวลากู้สูงสุด 40 ปี ดอกเบี้ยพิเศษเริ่มต้น 2.64% ต่อปี*", cta: "ดูสินเชื่อบ้าน", href: "personal/products/?cat=home-loan", items: ["home-1st-class", "home-2nd-hand"] },
          { label: "เพิ่มความมั่นคง", img: "photo-1559526324-4b87b5e36e44", tag: "เงินฝาก", headline: "ให้เงินออมงอกเงยอย่างมั่นคง", text: "เงินฝากประจำพิเศษ 6 เดือน ฝากสั้น รับดอกเบี้ยสูง และเงินฝากปลอดภาษี", cta: "ดูบัญชีเงินฝาก", href: "personal/products/?cat=deposit", items: ["fixed-special", "tax-free"] },
          { label: "วางแผนเกษียณ", img: "photo-1519451241324-20b4ea2c4220", tag: "ลดหย่อนภาษี", headline: "วางแผนเกษียณพร้อมลดหย่อนภาษี", text: "กองทุน RMF และ Thai ESG ปี 2026 พร้อมบริการวางแผนการเงินที่ The Advisory Branch", cta: "ไปที่การลงทุน", href: "personal/investments/", items: ["fixed", "high-yield-savings"] },
          { label: "เสริมความมั่งคั่ง", img: "photo-1530521954074-e64f6810b32d", tag: "การลงทุน", headline: "ต่อยอดความมั่งคั่งอย่างมีทิศทาง", text: "กองทุนรวม ตราสารทางการเงิน และประกันชีวิตควบการลงทุน", cta: "ไปที่การลงทุน", href: "personal/investments/", items: ["fcd", "home-4cash"] },
        ],
      }],
      ["featured", { eyebrow: "Featured Products", title: "ผลิตภัณฑ์แนะนำ", all: "personal/products/", tabs: [["ทั้งหมด", "all"], ["สินเชื่อบ้าน", "home-loan"], ["เงินฝาก", "deposit"], ["สินเชื่อบุคคล", "personal-loan"]], pick: ["home-1st-class", "happy-cash", "fixed-special", "home-refinance", "digital-savings", "happy-cash-bt", "home-2nd-hand", "tax-free", "home-4cash"] }],
      ["privilege", { eyebrow: "Family Banking", img: "photo-1520250497591-112f2f40a3f4",
        title: "ดูแลความมั่งคั่ง<br>ของทั้งครอบครัว",
        lead: "Family Banking จาก LH Bank แบ่งระดับสมาชิกตามความสัมพันธ์กับธนาคาร ตั้งแต่ Wealth จนถึง Elite Privilege",
        tiers: ["Elite Privilege", "Elite Plus", "Elite", "Wealth Plus", "Wealth"],
        points: [["5 ระดับสมาชิก", "Wealth · Wealth Plus · Elite · Elite Plus · Elite Privilege — สิทธิประโยชน์ตามระดับสมาชิกที่ธนาคารกำหนด"], ["The Advisory Branch", "บริการด้านวางแผนการเงินและการลงทุนแบบครบวงจร"], ["LH Bank Advisory & Weekly Report", "บทวิเคราะห์เศรษฐกิจและมุมมองการลงทุนจากทีมที่ปรึกษา"]],
        cta: "สอบถาม Family Banking" }],
      ["stats", { items: [["2.64%", "ดอกเบี้ยพิเศษเริ่มต้น* · Home 1st Class"], ["8.88%", "ดอกเบี้ยเริ่มต้นต่อปี* · Happy Cash"], ["3.8★", "LHB You บน App Store · 739 รีวิว"], ["1327", "LH Bank Call Center"]] }],
      ["promotions", { eyebrow: "Promotions", title: "ผลิตภัณฑ์แนะนำและโปรโมชัน", items: [
        { img: "photo-1600585154526-990dced4db0d", tag: "สินเชื่อบ้าน", until: "สมัครภายใน 31 ม.ค. 70", title: "สินเชื่อบ้านใหม่ Home 1st Class ดอกเบี้ยพิเศษเริ่มต้น 2.64% ต่อปี*", href: "personal/product/?id=home-1st-class" },
        { img: "photo-1559526324-4b87b5e36e44", tag: "เงินฝาก", until: "ตามเงื่อนไขธนาคาร", title: "ลูกค้าใหม่ เปิดบัญชีออมทรัพย์ที่ร่วมรายการ รับ E-VOUCHER มูลค่า 200 บาท", href: "personal/products/?cat=deposit" },
        { img: "photo-1600047509807-ba8f99d2cdde", tag: "สินเชื่อบ้าน", until: "ตามเงื่อนไขธนาคาร", title: "อยู่ครบ 1 ปี ก็รีได้ (Retention) ปลดล็อกสัญญากู้บ้านแบบเดิมๆ", href: "personal/product/?id=retention" },
        { img: "photo-1600210492486-724fe5c67fb0", tag: "เงินฝาก", until: "ตามเงื่อนไขธนาคาร", title: "เงินฝากประจำพิเศษ 6 เดือน ฝากสั้น รับดอกเบี้ยสูง", href: "personal/product/?id=fixed-special" },
        { img: "photo-1529333166437-7750a6dd5a70", tag: "สินเชื่อบุคคล", until: "ตามเงื่อนไขธนาคาร", title: "สินเชื่อส่วนบุคคล Happy Cash ดอกเบี้ยเริ่มเพียง 8.88% ต่อปี นานสูงสุด 5 ปี*", href: "personal/product/?id=happy-cash" },
      ] }],
      ["advisory", { eyebrow: "The Advisory Branch", title: "ที่ปรึกษาการเงิน<br>ที่เข้าใจคุณ", lead: "บริการด้านวางแผนการเงินและการลงทุนแบบครบวงจร ช่วยให้คุณเข้าใจผลิตภัณฑ์ เปรียบเทียบทางเลือก และตัดสินใจได้อย่างมั่นใจ", points: ["วางแผนการเงินตามช่วงชีวิตและเป้าหมาย", "แนะนำผลิตภัณฑ์เงินฝาก สินเชื่อ ประกัน และการลงทุน", "ติดต่อได้ทั้งที่สาขา และ LH Bank Call Center 1327"], cta: "ให้ที่ปรึกษาติดต่อกลับ", img: "photo-1573497019236-17f8177b81e8", avatar: null, advisor: "The Advisory Branch", role: "วางแผนการเงินและการลงทุน" }],
      ["tools", { eyebrow: "Tools & Services", title: "เครื่องมือช่วยตัดสินใจ", items: [["calc", "คำนวณสินเชื่อบ้าน", "อัตราผ่อนชำระ และวงเงินกู้", "personal/calculator/home-loan/"], ["swap", "อัตราแลกเปลี่ยน", "ซื้อ-ขาย และข้อมูลย้อนหลัง", "exchange-rates/"], ["pin", "ค้นหาสาขา", "สาขาและเวลาทำการ", "branch-locations/"], ["target", "ประเมินสไตล์การลงทุน", "แนวทางเบื้องต้นใน 1 นาที", "personal/investments/#advisory"]] }],
      ["app", {}],
      ["articles", { eyebrow: "Insights", title: "ความรู้และข่าวสาร", items: [["photo-1600210492486-724fe5c67fb0", "ลดหย่อนภาษี", "ช่วยให้คุณวางแผนลดหย่อนภาษีได้ง่ายขึ้น ด้วยกองทุน SSF และกองทุน RMF ที่ LH Bank", "บทความ"], ["photo-1573497019236-17f8177b81e8", "ประกัน", "LH Bank ร่วมมือเมืองไทยประกันชีวิต เปิดตัวประกันยูนิตลิงค์", "ข่าวสาร"], ["photo-1609220136736-443140cffec6", "ข่าวสารและกิจกรรม", "กลุ่มธุรกิจทางการเงินแลนด์ แอนด์ เฮ้าส์ มอบเงินสนับสนุนการจำหน่ายช่อดอกมะลิโครงการ “รวมใจรักแม่” ให้แก่สภาสังคมสงเคราะห์ฯ", "ข่าวสาร"]] }],
      ["cta", { eyebrow: "เริ่มต้นวันนี้", title: "พร้อมก้าวต่อไป<br>กับ LH Bank", lead: "เลือกช่องทางที่สะดวกสำหรับคุณ เราพร้อมดูแลทุกขั้นตอน", options: [["home", "สมัครสินเชื่อบ้าน", "Home 1st Class เริ่มต้น 2.64%*", "personal/product/?id=home-1st-class"], ["headset", "ให้เจ้าหน้าที่ติดต่อกลับ", "แจ้งข้อมูลให้ผู้เชี่ยวชาญติดต่อกลับ", "", "leadModal"], ["pin", "ค้นหาสาขา", "สาขาใกล้คุณและเวลาทำการ", "branch-locations/"]] }],
    ],
    sme: [
      ["heroBanner", { eyebrow: "SME Banking", img: "photo-1600880292203-757bb62b4baf", title: "เติบโตไปด้วยกัน<br>กับ<em>พันธมิตร</em>ทางธุรกิจ", lead: "สินเชื่อธุรกิจ บัญชีเพื่อธุรกิจ บริการชำระเงิน และ Advisory Service สำหรับลูกค้าธุรกิจขนาดกลางและขนาดย่อม", primary: ["ดูผลิตภัณฑ์ SME", "personal/products/?cat=sme"], secondary: ["ให้ผู้ดูแลติดต่อกลับ", "#", "leadModal"],
        quick: [["store", "สินเชื่อธุรกิจ", "หมุนเวียน · ลงทุน", "personal/products/?cat=sme"], ["wallet", "บัญชีเพื่อธุรกิจ", "ออมทรัพย์ธุรกิจคุ้มค่า", "personal/product/?id=sme-savings"], ["layers", "Cash Management", "Payment & Collection", "personal/product/?id=cash-management"], ["globe", "การค้าระหว่างประเทศ", "นำเข้า · ส่งออก", "personal/product/?id=trade"]] }],
      ["segmentSolutions", { eyebrow: "สินเชื่อธุรกิจ", title: "สินเชื่อสำหรับทุกช่วงของธุรกิจ", lead: "ผลิตภัณฑ์จากเมนูสินเชื่อธุรกิจของ LH Bank", items: [["bolt", "สินเชื่อเพื่อหมุนเวียนในธุรกิจ", "เสริมสภาพคล่องให้กิจการ", "personal/product/?id=sme-working-capital"], ["building", "สินเชื่อเพื่อการลงทุนในธุรกิจ", "ขยายกิจการ ลงทุนทรัพย์สิน", "personal/product/?id=sme-investment"], ["leaf", "Green Transition Advisory Loan", "เปลี่ยนผ่านสู่ความยั่งยืน", "personal/product/?id=sme-green"]] }],
      ["featured", { eyebrow: "Featured", title: "ผลิตภัณฑ์สำหรับ SME", all: "personal/products/?cat=sme", tabs: [["ทั้งหมด", "all"]], pick: ["sme-factoring", "sme-savings", "cash-management"] }],
      ["segmentSolutions", { eyebrow: "Advisory Service", title: "ที่ปรึกษาธุรกิจจาก LH Bank", lead: "โปรแกรม Advisory Service สำหรับผู้ประกอบการ", items: [["target", "LHB GAFE", "Advisory Service", "#"], ["building", "Business Expand", "Business Expand Hub", "#"], ["globe", "Import x Export Hub", "Export and Import", "personal/product/?id=trade"], ["doc", "SME Playbook", "คู่มือสำหรับผู้ประกอบการ", "#"]] }],
      ["advisory", { eyebrow: "SME Advisory", title: "ผู้ดูแลธุรกิจ<br>ที่เข้าใจคุณ", lead: "ทีม SME ของ LH Bank ช่วยคุณเลือกสินเชื่อและบริการที่เหมาะกับธุรกิจ พร้อมเครื่องคำนวณสินเชื่อ SME", points: ["สินเชื่อธุรกิจ แฟคเตอริ่ง และหนังสือค้ำประกัน", "บริการชำระเงินและรับชำระเงิน", "บริการระหว่างประเทศ นำเข้า ส่งออก และโอนเงิน"], cta: "ให้ผู้ดูแลติดต่อกลับ", img: "photo-1600880292089-90a7e086ee0c", avatar: null, advisor: "SME Banking", role: "LH Bank Call Center 1327" }],
      ["cta", { eyebrow: "พร้อมเติบโต", title: "เริ่มต้นคุยกับ<br>ทีม SME วันนี้", lead: "ให้เราช่วยแนะนำสินเชื่อและบริการที่เหมาะกับธุรกิจของคุณ", options: [["headset", "ให้ผู้ดูแลติดต่อกลับ", "แจ้งข้อมูลให้ผู้เชี่ยวชาญติดต่อกลับ", "", "leadModal"], ["pin", "ค้นหาสาขา", "สาขาใกล้คุณ", "branch-locations/?type=sme"]] }],
    ],
    business: [
      ["heroBanner", { eyebrow: "Business Banking", img: "photo-1582407947304-fd86f028f716", title: "พันธมิตรทางการเงิน<br>สำหรับธุรกิจ", lead: "ธนาคารขนาดกลางชั้นนำที่โดดเด่นในการส่งมอบความเป็นเลิศด้านบริการ ด้วยโซลูชันที่ทันสมัยและตอบโจทย์เฉพาะบุคคล", primary: ["ดูบริการธุรกิจ", "personal/products/?cat=business"], secondary: ["ติดต่อผู้ดูแล", "#", "leadModal"],
        quick: [["layers", "Cash Management", "Payment & Collection", "personal/product/?id=cash-management"], ["users", "Payroll", "จ่ายเงินเดือน", "personal/product/?id=payroll"], ["globe", "การค้าระหว่างประเทศ", "นำเข้า · ส่งออก", "personal/product/?id=trade"], ["swap", "บริหารความเสี่ยง FX", "อัตราแลกเปลี่ยน", "personal/product/?id=fx-risk"]] }],
      ["segmentSolutions", { eyebrow: "Services", title: "บริการสำหรับธุรกิจ", lead: "บริการชำระเงิน รับชำระเงิน และบริการระหว่างประเทศของ LH Bank", items: [["layers", "บริการชำระเงิน", "Payroll · LHB BULK PAYMENT · ORFT · Bahtnet", "personal/product/?id=cash-management"], ["wallet", "บริการรับชำระเงิน", "Bill Payment · LHB Direct Debit", "personal/product/?id=cash-management"], ["globe", "บริการระหว่างประเทศ", "นำเข้า · ส่งออก · โอนเงินระหว่างประเทศ", "personal/product/?id=trade"], ["mobile", "LHB Biz Connect", "และ LH Bank Speedy", "#"]] }],
      ["advisory", { eyebrow: "Business Advisory", title: "ทีมผู้เชี่ยวชาญ<br>สำหรับธุรกิจของคุณ", lead: "ให้ทีมของเราช่วยออกแบบบริการชำระเงิน รับชำระเงิน และบริการระหว่างประเทศให้เหมาะกับธุรกิจ", points: ["Cash Management ครบทั้ง Payment และ Collection", "บริการด้านการนำเข้า การส่งออก และหนังสือค้ำประกันต่างประเทศ", "บริการบริหารความเสี่ยงอัตราแลกเปลี่ยนเงินตราต่างประเทศ"], cta: "ติดต่อผู้ดูแล", img: "photo-1573164713988-8665fc963095", avatar: null, advisor: "Business Banking", role: "LH Bank Call Center 1327" }],
      ["cta", { eyebrow: "Business", title: "พูดคุยกับ<br>ทีมธุรกิจ", lead: "ให้เราแนะนำโซลูชันทางการเงินสำหรับธุรกิจของคุณ", options: [["headset", "ให้ผู้ดูแลติดต่อกลับ", "แจ้งข้อมูลให้ผู้เชี่ยวชาญติดต่อกลับ", "", "leadModal"], ["phone", "LH Bank Call Center", "โทร 1327", "tel:1327"]] }],
    ],
  };

  /* ---------- Render ---------- */
  const conf = CONFIG[variant];
  main.innerHTML = conf.map(([k, c]) => S[k](c)).join("") + (variant === "personal" ? "" : "");


  /* Discovery interaction */
  const disc = $("[data-discovery]", main);
  if (disc) {
    const goals = conf.find(([k]) => k === "discovery")[1].goals;
    const panel = $("[data-goal-panel]", disc);
    const show = (i) => {
      panel.innerHTML = goalPanel(goals[i]);
      $$(".goal", disc).forEach((g, j) => { g.classList.toggle("is-active", i === j); g.setAttribute("aria-selected", i === j); });
    };
    $$(".goal", disc).forEach((g) => g.addEventListener("click", () => show(+g.dataset.goal)));
    show(0);
  }

  /* Featured filter */
  const featConf = conf.find(([k]) => k === "featured");
  if (featConf) {
    const grid = $("[data-featured-grid]", main);
    const pick = featConf[1].pick.map(P).filter(Boolean);
    const render = (cat) => { grid.innerHTML = pick.filter((p) => cat === "all" || p.cat === cat).slice(0, 3).map(productCard).join(""); };
    $$("[data-featured-filter] button", main).forEach((b, _, all) => b.addEventListener("click", () => { all.forEach((x) => x.classList.toggle("is-active", x === b)); render(b.dataset.cat); }));
    render("all");
  }

  /* Campaign carousel (autoplay, pauses on hover) */
  $$("[data-campaign]", main).forEach((c) => {
    const track = $(".campaign__track", c), dots = $$("[data-cdot]", c), n = dots.length;
    let i = 0, t;
    const go = (k) => { i = (k + n) % n; track.style.transform = `translateX(${-i * 100}%)`; dots.forEach((d, j) => d.classList.toggle("is-active", j === i)); };
    const play = () => { clearInterval(t); t = setInterval(() => go(i + 1), 5000); };
    dots.forEach((d) => d.addEventListener("click", () => { go(+d.dataset.cdot); play(); }));
    $("[data-cprev]", c).addEventListener("click", () => { go(i - 1); play(); });
    $("[data-cnext]", c).addEventListener("click", () => { go(i + 1); play(); });
    c.addEventListener("mouseenter", () => clearInterval(t)); c.addEventListener("mouseleave", play);
    let sx = null; c.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
    c.addEventListener("touchend", (e) => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) { go(i + (dx < 0 ? 1 : -1)); play(); } sx = null; });
    play();
  });
})();
