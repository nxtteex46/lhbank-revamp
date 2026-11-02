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

  S.heroSplit = (c) => `
    <section class="hero">
      <div class="container hero__grid">
        <div class="reveal">
          <span class="eyebrow">${c.eyebrow}</span>
          <h1 class="t-display hero__title">${c.title}</h1>
          <p class="t-lead hero__lead">${c.lead}</p>
          <div class="hero__actions">
            <a class="btn btn--primary btn--lg" href="${url(c.primary[1])}">${c.primary[0]} ${icon("arrow-right")}</a>
            <a class="btn btn--secondary btn--lg" href="${url(c.secondary[1])}">${c.secondary[0]}</a>
          </div>
          <div class="hero__trust">
            ${c.trust.map(([v, l]) => `<div><strong>${v}</strong><span>${l}</span></div>`).join("")}
          </div>
        </div>
        <div class="hero__visual reveal">
          <div class="media hero__media">${img(U(c.img, 1100), "", 'fetchpriority="high" loading="eager"')}</div>
          <div class="hero__float hero__float--a">
            <div class="row" style="gap:12px"><span class="tile__icon" style="width:40px;height:40px;border-radius:12px;background:var(--c-accent-50);box-shadow:none">${icon("home")}</span>
            <div><div class="t-xs t-muted">ค่างวดโดยประมาณ</div><div class="t-num" style="font-weight:600;font-size:1.3rem">฿18,420<span class="t-xs t-muted" style="font-weight:400"> /เดือน</span></div></div></div>
            <div class="mt-3" style="height:6px;border-radius:6px;background:var(--c-line);overflow:hidden"><span style="display:block;height:100%;width:68%;background:var(--c-accent);border-radius:6px"></span></div>
            <div class="row row--between t-xs t-muted mt-2"><span>เงินต้น 68%</span><span>ดอกเบี้ย 32%</span></div>
          </div>
          <div class="hero__float hero__float--b">
            <div class="t-xs t-muted">ดอกเบี้ยออมทรัพย์</div>
            <div class="t-num" style="font-weight:600;font-size:1.5rem;color:var(--c-accent-700)">1.80%</div>
          </div>
        </div>
      </div>
      <div class="container mt-12 reveal">
        <nav class="quick-bar" aria-label="ทางลัด">
          ${c.quick.map(([ic, t, s, h]) => `<a href="${url(h)}"><span class="tile__icon">${icon(ic)}</span><div><strong>${t}</strong><span>${s}</span></div></a>`).join("")}
        </nav>
      </div>
    </section>`;

  S.heroBanner = (c) => `
    <section class="section--tight" style="padding-top:24px">
      <div class="container">
        <div class="hero-banner reveal">
          ${img(U(c.img, 1800), "", 'loading="eager"')}
          <div class="hero-banner__content">
            <span class="eyebrow">${c.eyebrow}</span>
            <h1 class="t-h1 mt-4">${c.title}</h1>
            <p class="t-lead mt-4">${c.lead}</p>
            <div class="hero__actions" style="margin-top:28px">
              <a class="btn btn--primary btn--lg" href="${url(c.primary[1])}">${c.primary[0]} ${icon("arrow-right")}</a>
              <a class="btn btn--outline-light btn--lg" href="${c.secondary[1].startsWith("#") ? c.secondary[1] : url(c.secondary[1])}" ${c.secondary[2] ? `data-modal="${c.secondary[2]}"` : ""}>${c.secondary[0]}</a>
            </div>
          </div>
        </div>
        <nav class="quick-bar mt-6 reveal" aria-label="ทางลัด">
          ${c.quick.map(([ic, t, s, h]) => `<a href="${url(h)}"><span class="tile__icon">${icon(ic)}</span><div><strong>${t}</strong><span>${s}</span></div></a>`).join("")}
        </nav>
      </div>
    </section>`;

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
          <div class="row" style="gap:6px;align-items:baseline;margin-top:auto"><span class="t-num" style="font-size:1.6rem;font-weight:600">${p.highlight.value}<small style="font-size:.55em">${p.highlight.unit}</small></span><span class="t-xs t-muted">${p.highlight.label}</span></div>
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
        <div class="product-card__highlight"><span class="product-card__value">${p.highlight.value}<small>${p.highlight.unit}</small></span><span class="product-card__label">${p.highlight.label}</span></div>
      </div>
    </a>`;
  window.LH.productCard = productCard;

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
              <div class="promo-card__meta"><span class="badge">${p.tag}</span><span>ถึง ${p.until}</span></div>
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
            <div class="advisor-chip"><span class="avatar">${img(U(c.avatar, 120))}</span><div><strong class="t-sm" style="display:block;line-height:1.2">${c.advisor}</strong><span class="t-xs t-muted">${c.role}</span></div><span class="live" title="ออนไลน์"></span></div>
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

  S.app = () => `
    <section class="section" id="app">
      <div class="container app-band">
        <div class="reveal">
          <span class="eyebrow">LH Bank Mobile</span>
          <h2 class="mt-4">ทุกเรื่องการเงิน<br><em>จบในแอปเดียว</em></h2>
          <p class="t-lead mt-4" style="max-width:480px">เปิดบัญชี โอนเงิน ลงทุน และติดตามสินเชื่อ ได้ทุกที่ทุกเวลา ปลอดภัยด้วยการยืนยันตัวตนแบบ Biometrics</p>
          <ul class="check-list mt-8">
            <li>เปิดบัญชีออนไลน์ใน 5 นาที ด้วย NDID</li>
            <li>ซื้อขายกองทุนและติดตามพอร์ตแบบเรียลไทม์</li>
            <li>แจ้งเตือนทุกธุรกรรม พร้อมระบบป้องกันมิจฉาชีพ</li>
          </ul>
          <div class="row mt-8" style="gap:16px">
            <div class="store-badges">
              <a class="store-badge" href="#" data-toast="ลิงก์ไปยัง App Store">${icon("mobile")}<span>Download on the<strong>App Store</strong></span></a>
              <a class="store-badge" href="#" data-toast="ลิงก์ไปยัง Google Play">${icon("mobile")}<span>Get it on<strong>Google Play</strong></span></a>
            </div>
            <div class="qr hide-mobile" aria-hidden="true">${qrSvg()}</div>
          </div>
        </div>
        <div class="reveal">
          <div class="phone"><div class="phone__screen">
            <div class="row row--between" style="font-size:11px"><strong style="font-size:13px">สวัสดี, คุณพิมพ์ชนก</strong>${icon("user")}</div>
            <div class="phone__balance"><div style="font-size:10px;opacity:.8">ยอดเงินรวม</div><div class="t-num" style="font-size:22px;font-weight:600">฿ 1,284,560.25</div><div style="font-size:10px;opacity:.8;margin-top:6px">Smart Savings · 1.80%</div></div>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;text-align:center;font-size:9px">
              ${[["swap", "โอน"], ["qr", "สแกน"], ["pie", "ลงทุน"], ["home", "สินเชื่อ"]].map(([i, t]) => `<div style="display:grid;gap:4px;justify-items:center"><span style="width:36px;height:36px;border-radius:12px;background:#fff;box-shadow:var(--sh-1);display:grid;place-items:center;color:var(--c-accent-700)">${icon(i)}</span>${t}</div>`).join("")}
            </div>
            <div class="phone__row"><span>สินเชื่อบ้าน แสนสบาย</span><strong class="t-num">฿18,420</strong></div>
            <div class="phone__row"><span>LHGEQ · 1 ปี</span><strong class="t-num chg-up">+12.4%</strong></div>
            <div class="phone__row"><span>ฝากประจำปลอดภาษี</span><strong class="t-num">12/24</strong></div>
          </div></div>
        </div>
      </div>
    </section>`;

  function qrSvg() {
    let cells = ""; let s = 7;
    for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) {
      const finder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
      s = (s * 9301 + 49297) % 233280;
      let on = finder ? ((x % 20 === 0 || x % 20 === 6 || y % 20 === 0 || y % 20 === 6 || x === 14 || x === 20 || y === 14 || y === 20) || ((x % 14 >= 2 && x % 14 <= 4) && (y % 14 >= 2 && y % 14 <= 4))) : s / 233280 > 0.55;
      if (finder && (x > 13 ? x - 14 : x) >= 1 && (x > 13 ? x - 14 : x) <= 5 && (y > 13 ? y - 14 : y) >= 1 && (y > 13 ? y - 14 : y) <= 5) on = ((x > 13 ? x - 14 : x) >= 2 && (x > 13 ? x - 14 : x) <= 4 && (y > 13 ? y - 14 : y) >= 2 && (y > 13 ? y - 14 : y) <= 4);
      if (on) cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
    }
    return `<svg viewBox="0 0 21 21" fill="#0d1d2a" shape-rendering="crispEdges">${cells}</svg>`;
  }

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
        eyebrow: "Modern Wealth Lifestyle", img: "photo-1600596542815-ffad4c1539a9",
        title: "ทุกเป้าหมายในชีวิต<br>มี<em>ที่ปรึกษา</em>เคียงข้าง",
        lead: "ตั้งแต่เงินออมก้อนแรก บ้านหลังแรก จนถึงการสร้างความมั่งคั่งให้ครอบครัว LH Bank พร้อมช่วยคุณวางแผนและตัดสินใจได้อย่างมั่นใจ",
        primary: ["ค้นหาผลิตภัณฑ์ที่ใช่", "personal/products/"], secondary: ["คำนวณสินเชื่อบ้าน", "personal/calculator/home-loan/"],
        trust: [["30+ ปี", "ความเชี่ยวชาญด้านที่อยู่อาศัย"], ["1.80%", "ดอกเบี้ยออมทรัพย์สูงสุด"], ["2.75%", "ดอกเบี้ยสินเชื่อบ้านเริ่มต้น"]],
        quick: [["piggy", "เปิดบัญชีออนไลน์", "ใน 5 นาที ผ่านแอป", "personal/product/?id=smart-savings"], ["home", "สินเชื่อบ้าน", "ดอกเบี้ยเริ่มต้น 2.75%", "personal/products/?cat=home-loan"], ["calc", "คำนวณค่างวด", "รู้ผลทันที", "personal/calculator/home-loan/"], ["pie", "เริ่มลงทุน", "กองทุนคัดสรร", "personal/investments/"]],
      }],
      ["discovery", {
        eyebrow: "Product Discovery", title: "วันนี้คุณกำลัง<em>วางแผน</em>เรื่องอะไร", lead: "เลือกเป้าหมายของคุณ แล้วเราจะแนะนำผลิตภัณฑ์ที่เหมาะสมที่สุด", all: "personal/products/",
        goals: [
          { label: "มีบ้านเป็นของตัวเอง", img: "photo-1600585154340-be6161a56a0c", tag: "สินเชื่อบ้าน", headline: "บ้านหลังแรก เริ่มต้นได้ง่ายกว่าที่คิด", text: "ดอกเบี้ยคงที่ 3 ปีแรก ผ่อนนานสูงสุด 40 ปี พร้อมที่ปรึกษาดูแลตลอดเส้นทาง", cta: "ดูสินเชื่อบ้าน", href: "personal/products/?cat=home-loan", items: ["saen-sabai", "refinance"] },
          { label: "เก็บออมอย่างมั่นคง", img: "photo-1511895426328-dc8714191300", tag: "เงินฝาก", headline: "ให้เงินออมทำงาน อย่างมั่นคงทุกวัน", text: "ดอกเบี้ยสูง ถอนได้ทุกเมื่อ หรือเลือกฝากประจำปลอดภาษี", cta: "ดูบัญชีเงินฝาก", href: "personal/products/?cat=deposit", items: ["smart-savings", "tax-free-24"] },
          { label: "ลงทุนให้เงินเติบโต", img: "photo-1611974789855-9c2a0a7236a3", tag: "การลงทุน", headline: "สร้างพอร์ตที่ใช่ ในแบบของคุณ", text: "กองทุนคัดสรรจากบลจ.ชั้นนำ พร้อม Wealth Advisor ส่วนตัว", cta: "ไปที่ศูนย์การลงทุน", href: "personal/investments/", items: ["fcd", "fixed-12"] },
          { label: "ใช้จ่ายอย่างมีสไตล์", img: "photo-1556742049-0cfed4f6a45d", tag: "บัตร", headline: "ทุกการใช้จ่าย คือสิทธิพิเศษ", text: "บัตรเครดิตที่ออกแบบมาเพื่อไลฟ์สไตล์และการเดินทางของคุณ", cta: "ดูบัตรทั้งหมด", href: "personal/products/?cat=card", items: ["wealth-card", "travel-card"] },
          { label: "เงินก้อนสำหรับเป้าหมาย", img: "photo-1529156069898-49953e39b3ac", tag: "สินเชื่อ", headline: "เงินก้อนที่พร้อมเมื่อคุณต้องการ", text: "ทั้งสินเชื่อส่วนบุคคลและบ้านแลกเงิน ดอกเบี้ยโปร่งใส", cta: "ดูสินเชื่อ", href: "personal/products/?cat=personal-loan", items: ["personal-loan", "home-for-cash"] },
        ],
      }],
      ["featured", { eyebrow: "Featured Products", title: "ผลิตภัณฑ์แนะนำ", all: "personal/products/", tabs: [["ทั้งหมด", "all"], ["เงินฝาก", "deposit"], ["สินเชื่อบ้าน", "home-loan"], ["บัตร", "card"]], pick: ["saen-sabai", "smart-savings", "wealth-card", "tax-free-24", "refinance", "travel-card", "happy-home", "fixed-12", "debit-smart"] }],
      ["stats", { items: [["30+ ปี", "ประสบการณ์ในกลุ่มที่อยู่อาศัย"], ["120+", "สาขาและจุดบริการทั่วประเทศ"], ["2 ล้าน+", "ลูกค้าที่ไว้วางใจ"], ["AA−", "อันดับความน่าเชื่อถือ (ตัวอย่าง)"]] }],
      ["promotions", { eyebrow: "Promotions", title: "สิทธิพิเศษสำหรับคุณ", items: [
        { img: "photo-1600585154340-be6161a56a0c", tag: "สินเชื่อบ้าน", until: "31 มี.ค. 2027", title: "ยื่นกู้บ้านออนไลน์ รับส่วนลดค่าจดจำนอง 50%", href: "personal/product/?id=saen-sabai" },
        { img: "photo-1579621970563-ebec7560ff3e", tag: "เงินฝาก", until: "30 มิ.ย. 2027", title: "เปิดบัญชี Smart Savings รับดอกเบี้ยพิเศษ 2.00% 3 เดือนแรก", href: "personal/product/?id=smart-savings" },
        { img: "photo-1469854523086-cc02fe5d8800", tag: "บัตรเครดิต", until: "31 ธ.ค. 2027", title: "ช้อปต่างประเทศ รับเครดิตเงินคืนสูงสุด 5,000 บาท", href: "personal/product/?id=travel-card" },
        { img: "photo-1611974789855-9c2a0a7236a3", tag: "กองทุน", until: "28 ก.พ. 2027", title: "ลงทุนกองทุน Thai ESG ครบ 50,000 บาท รับของสมนาคุณพิเศษ", href: "personal/investments/" },
        { img: "photo-1502672260266-1c1ef2d93688", tag: "รีไฟแนนซ์", until: "30 เม.ย. 2027", title: "รีไฟแนนซ์บ้าน ฟรีค่าประเมินและค่าจดจำนอง", href: "personal/product/?id=refinance" },
      ] }],
      ["advisory", { eyebrow: "Advisory", title: "ที่ปรึกษาการเงิน<br>ที่เข้าใจคุณ", lead: "ไม่ว่าจะซื้อบ้าน วางแผนเกษียณ หรือสร้างพอร์ตการลงทุน ผู้เชี่ยวชาญของเราพร้อมให้คำแนะนำแบบตัวต่อตัว ไม่มีค่าใช้จ่าย", points: ["วิเคราะห์สถานะการเงินและเป้าหมายของคุณ", "แนะนำผลิตภัณฑ์ที่เหมาะสม เปรียบเทียบอย่างโปร่งใส", "ดูแลต่อเนื่องตลอดเส้นทาง ทั้งออนไลน์และที่สาขา"], cta: "นัดหมายที่ปรึกษา", img: "photo-1573497019940-1c28c88b4f3e", avatar: "photo-1544005313-94ddf0286df2", advisor: "คุณศิริพร ว.", role: "Wealth Advisor · ว่างวันนี้" }],
      ["tools", { eyebrow: "Tools & Services", title: "เครื่องมือช่วยตัดสินใจ", items: [["calc", "คำนวณสินเชื่อบ้าน", "ค่างวด วงเงิน และดอกเบี้ยรวม", "personal/calculator/home-loan/"], ["swap", "อัตราแลกเปลี่ยน", "ซื้อ-ขาย และข้อมูลย้อนหลัง", "exchange-rates/"], ["pin", "ค้นหาสาขา", "สาขาใกล้คุณ เปิดเสาร์-อาทิตย์", "branch-locations/"], ["target", "ประเมินความเสี่ยง", "รู้จักสไตล์การลงทุนใน 1 นาที", "personal/investments/#advisory"]] }],
      ["app", {}],
      ["articles", { eyebrow: "Insights", title: "ความรู้การเงินเพื่อชีวิต", items: [["photo-1560518883-ce09059eeffa", "บ้าน", "5 สิ่งที่ต้องเตรียมก่อนยื่นกู้บ้านหลังแรก", "อ่าน 5 นาที"], ["photo-1554224155-6726b3ff858f", "ภาษี", "วางแผนลดหย่อนภาษีปี 2027 ด้วย Thai ESG", "อ่าน 4 นาที"], ["photo-1469474968028-56623f02e42e", "เกษียณ", "เริ่มวางแผนเกษียณตั้งแต่อายุ 30 ต้องเก็บเท่าไร", "อ่าน 6 นาที"]] }],
      ["cta", { eyebrow: "เริ่มต้นวันนี้", title: "พร้อมก้าวต่อไป<br>กับ LH Bank", lead: "เลือกช่องทางที่สะดวกสำหรับคุณ เราพร้อมดูแลทุกขั้นตอน", options: [["mobile", "เปิดบัญชีออนไลน์", "ใช้เวลาเพียง 5 นาที", "personal/product/?id=smart-savings"], ["headset", "ให้เจ้าหน้าที่ติดต่อกลับ", "ภายใน 1 วันทำการ", "", "leadModal"], ["pin", "ไปที่สาขาใกล้คุณ", "เปิดทุกวัน 10:00–20:00 น.", "branch-locations/"]] }],
    ],
    sme: [
      ["heroBanner", { eyebrow: "SME Banking", img: "photo-1517248135467-4c7edcad34c4", title: "เติบโตไปด้วยกัน<br>กับ<em style=\"color:var(--c-accent-200)\">พันธมิตร</em>ทางธุรกิจ", lead: "สินเชื่อ บัญชี และที่ปรึกษาธุรกิจ ที่ออกแบบมาสำหรับเจ้าของกิจการ SME โดยเฉพาะ", primary: ["ดูสินเชื่อ SME", "personal/products/?cat=sme"], secondary: ["นัดหมาย RM", "#", "leadModal"],
        quick: [["store", "สินเชื่อ SME", "วงเงินสูงสุด 50 ล้าน", "personal/products/?cat=sme"], ["wallet", "บัญชีธุรกิจ", "บริหารสภาพคล่อง", "personal/products/?cat=sme"], ["calc", "คำนวณสินเชื่อ", "ประเมินค่างวด", "personal/calculator/home-loan/"], ["pin", "ศูนย์ธุรกิจ SME", "ใกล้คุณ", "branch-locations/?type=sme"]] }],
      ["segmentSolutions", { eyebrow: "Section Variant · Solutions", title: "โซลูชันสำหรับทุกช่วงของธุรกิจ", lead: "Reuse จาก Tile component — ปรับเนื้อหาและไอคอนตาม Segment", items: [["bolt", "เริ่มต้นธุรกิจ", "เงินทุนหมุนเวียนสำหรับกิจการ 1 ปีขึ้นไป", "personal/product/?id=sme-start"], ["building", "ขยายกิจการ", "ลงทุนสาขาใหม่ เครื่องจักร และอสังหาฯ", "personal/product/?id=sme-growth"], ["globe", "ค้าขายต่างประเทศ", "Trade Finance และ FX สำหรับ SME", "exchange-rates/"]] }],
      ["featured", { eyebrow: "Section Variant · Featured", title: "ผลิตภัณฑ์สำหรับ SME", all: "personal/products/?cat=sme", tabs: [["ทั้งหมด", "all"]], pick: ["sme-start", "sme-growth", "cash-management"] }],
      ["stats", { items: [["50 ล้าน", "วงเงินสูงสุดต่อราย"], ["7 วัน", "อนุมัติเบื้องต้น"], ["12 แห่ง", "ศูนย์ธุรกิจ SME"], ["1:1", "RM ดูแลส่วนตัว"]] }],
      ["advisory", { eyebrow: "Section Variant · Advisory", title: "Relationship Manager<br>ที่เข้าใจธุรกิจคุณ", lead: "ทีมที่ปรึกษาธุรกิจช่วยวางโครงสร้างสินเชื่อให้สอดคล้องกับกระแสเงินสด และเติบโตได้อย่างยั่งยืน", points: ["วิเคราะห์งบการเงินและความต้องการเงินทุน", "ออกแบบงวดชำระตามรอบธุรกิจ", "เชื่อมต่อบริการ Cash Management และ Trade"], cta: "นัดหมาย RM", img: "photo-1556761175-5973dc0f32e7", avatar: "photo-1507679799987-c73779587ccf", advisor: "คุณธนกร ส.", role: "SME Relationship Manager" }],
      ["cta", { eyebrow: "พร้อมเติบโต", title: "เริ่มต้นคุยกับ<br>ทีม SME วันนี้", lead: "ให้เราช่วยประเมินวงเงินและโครงสร้างสินเชื่อที่เหมาะกับธุรกิจคุณ", options: [["headset", "ให้ RM ติดต่อกลับ", "ภายใน 1 วันทำการ", "", "leadModal"], ["pin", "ศูนย์ธุรกิจ SME ใกล้คุณ", "12 แห่งทั่วกรุงเทพฯ และปริมณฑล", "branch-locations/?type=sme"]] }],
    ],
    business: [
      ["heroBanner", { eyebrow: "Business & Corporate Banking", img: "photo-1486406146926-c627a92ad1ab", title: "พันธมิตรทางการเงิน<br>สำหรับองค์กร", lead: "โซลูชันสินเชื่อ การบริหารเงินสด และการค้าระหว่างประเทศ พร้อมความเชี่ยวชาญด้านอสังหาริมทรัพย์กว่า 30 ปี", primary: ["ดูบริการองค์กร", "personal/products/?cat=business"], secondary: ["ติดต่อทีมองค์กร", "#", "leadModal"],
        quick: [["building", "Project Finance", "สินเชื่อโครงการ", "personal/product/?id=project-finance"], ["layers", "Cash Management", "บริหารเงินสด", "personal/product/?id=cash-management"], ["globe", "Trade Finance", "L/C, T/R, FX", "exchange-rates/"], ["headset", "ติดต่อ RM", "ทีมดูแลองค์กร", "business/#advisory"]] }],
      ["segmentSolutions", { eyebrow: "Section Variant · Solutions", title: "บริการสำหรับองค์กร", lead: "Section เดียวกับ SME — สลับเนื้อหาเป็นบริการองค์กร 4 คอลัมน์", items: [["building", "Project Finance", "สินเชื่อสำหรับผู้พัฒนาโครงการ", "personal/product/?id=project-finance"], ["layers", "Cash Management", "Payroll, Bulk Payment, Collection", "personal/product/?id=cash-management"], ["globe", "Trade Finance", "L/C, T/R และ FX Hedging", "exchange-rates/"], ["chart", "Treasury", "บริหารความเสี่ยงอัตราดอกเบี้ย", "personal/products/?cat=business"]] }],
      ["stats", { items: [["30+ ปี", "ความเชี่ยวชาญอสังหาริมทรัพย์"], ["24/7", "Corporate Online"], ["API", "Host-to-Host Integration"], ["1:1", "ทีมดูแลองค์กร"]] }],
      ["advisory", { eyebrow: "Section Variant · Advisory", title: "ทีมผู้เชี่ยวชาญ<br>สำหรับองค์กรของคุณ", lead: "Corporate RM และ Product Specialist ทำงานร่วมกันเพื่อออกแบบโซลูชันที่เหมาะกับโครงสร้างธุรกิจ", points: ["โครงสร้างสินเชื่อเฉพาะโครงการ", "เชื่อมต่อระบบ ERP ผ่าน API", "รายงานและการควบคุมแบบ Multi-level Approval"], cta: "ติดต่อทีมองค์กร", img: "photo-1450101499163-c8848c66ca85", avatar: "photo-1507679799987-c73779587ccf", advisor: "ทีม Corporate Banking", role: "จันทร์–ศุกร์ 08:30–17:00" }],
      ["cta", { eyebrow: "Corporate", title: "พูดคุยกับ<br>ทีมองค์กร", lead: "ให้เราออกแบบโซลูชันทางการเงินสำหรับองค์กรของคุณ", options: [["headset", "ให้ทีมองค์กรติดต่อกลับ", "ภายใน 1 วันทำการ", "", "leadModal"], ["phone", "Corporate Hotline", "1327 กด 3", "tel:1327"]] }],
    ],
  };

  /* ---------- Render ---------- */
  const conf = CONFIG[variant];
  main.innerHTML = conf.map(([k, c]) => S[k](c)).join("") + (variant === "personal" ? "" : "");
  if (variant === "personal") {
    // insert market preview right after stats
    const statsSec = $$(".trust-strip", main)[0];
    statsSec && statsSec.closest("section").insertAdjacentHTML("afterend", S.markets());
  }

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
})();
