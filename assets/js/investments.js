/* Investment Landing — categories, featured funds (filter), market preview,
   fund detail drawer, risk-profile quiz → advisory CTA. */
(function () {
  const { icon, img, U, url, fmt, $, $$, sparkline, series, toast } = window.LH;
  const D = window.LHDATA;
  const root = $("#inv");

  const markets = [
    ["SET Index", "1,428.35", 0.84, 7], ["SET50", "932.18", 0.62, 9], ["S&P 500", "6,142.10", 0.32, 13], ["Nasdaq", "19,874.55", 0.71, 15],
    ["Nikkei 225", "41,210.40", -0.45, 17], ["ทองคำ (บาทละ)", "48,250", -0.21, 19], ["น้ำมันดิบ WTI", "71.42", 1.12, 23], ["USD/THB", "32.75", -0.12, 29],
  ];

  root.innerHTML = `
    <section class="container"><div class="page-header" style="padding-block:16px 16px">
      <nav aria-label="breadcrumb"><ol class="breadcrumb"><li><a href="${url("personal/")}">บุคคล</a></li><li><span aria-current="page">การลงทุน</span></li></ol></nav>
    </div></section>
    <section class="hero2" style="padding-top:0">
      <div class="hero2__frame" style="min-height:min(76vh,720px)">
        ${img(U("photo-1520250497591-112f2f40a3f4", 2000), "", 'loading="eager"')}
        <div class="container hero2__content">
          <span class="eyebrow eyebrow--glass">Wealth &amp; Investment</span>
          <h1>สร้างความมั่งคั่ง<br>อย่าง<em>มีทิศทาง</em></h1>
          <p class="t-lead">กองทุนคัดสรร หุ้นกู้ และประกัน พร้อม Wealth Advisor ที่ช่วยออกแบบพอร์ตให้สอดคล้องกับเป้าหมายและความเสี่ยงที่คุณรับได้</p>
          <div class="hero2__actions"><a class="btn btn--primary btn--lg" href="#advisory">ประเมินความเสี่ยง ${icon("arrow-right")}</a><a class="btn btn--glass btn--lg" href="#funds">ดูกองทุนแนะนำ</a></div>
        </div>
        <div class="hero2__cards">
          <div class="glass-card">
            <div class="row row--between"><span class="lbl">พอร์ตตัวอย่าง · Balanced</span><span class="lbl" style="color:#9be7c4">+8.6% YTD</span></div>
            <div class="mt-3">${sparkline(series(5, 40, 100, 0.025, 0.003), { w: 240, h: 56, color: "#a9dcf0" })}</div>
            <div class="row mt-2 lbl" style="gap:12px"><span>หุ้น 50%</span><span>ตราสารหนี้ 40%</span><span>ทอง 10%</span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="container" style="padding-block:24px 56px">
      <a class="campaign" href="#funds" style="display:block" aria-label="LH Fund Pro RMF / ThaiESG 2026">
        <span class="campaign__slide" style="display:block"><picture><source media="(max-width: 680px)" srcset="${url("assets/img/lhbank/banner-rmf-thaiesg-mb.jpg")}"><img src="${url("assets/img/lhbank/banner-rmf-thaiesg.jpg")}" alt="LH Fund Pro RMF / ThaiESG 2026" loading="lazy"></picture></span>
      </a>
    </section>

    <section class="section--tight section--mist">
      <div class="container">
        <div class="row row--between mb-6"><div><span class="eyebrow">Market Preview</span><h2 class="t-h3 mt-2">ภาพรวมตลาด</h2></div><span class="fx-updated"><span class="live"></span> อัปเดต 2 ม.ค. 2027 · 16:30 น. <span class="t-xs">(ข้อมูลตัวอย่าง)</span></span></div>
        <div class="market-strip" id="marketStrip">${markets.slice(0, 4).map(mCard).join("")}</div>
        <div class="market-strip mt-3 hide" id="marketMore">${markets.slice(4).map(mCard).join("")}</div>
        <div class="text-center mt-6"><button class="btn btn--secondary btn--sm" id="toggleMarkets">ดูตลาดเพิ่มเติม ${icon("chevron-down")}</button></div>
      </div>
    </section>

    <section class="section" id="categories">
      <div class="container">
        <div class="section-head reveal"><div class="section-head__text"><span class="eyebrow">Investment Categories</span><h2>เลือกการลงทุนที่ใช่สำหรับคุณ</h2></div></div>
        <div class="cols-4 reveal">
          ${[["pie", "กองทุนรวม", "กว่า 200 กองทุนจาก บลจ. ชั้นนำ เริ่มต้น 500 บาท", "#funds"], ["layers", "หุ้นกู้", "ผลตอบแทนคงที่ สม่ำเสมอ จากบริษัทชั้นนำ", "#funds"], ["shield", "ประกันชีวิตและสุขภาพ", "วางแผนคุ้มครองและลดหย่อนภาษี", "#advisory"], ["sparkle", "Wealth Advisory", "บริการที่ปรึกษาสำหรับพอร์ต 5 ล้านบาทขึ้นไป", "#advisory"]]
            .map(([ic, t, d, h]) => `<a class="tile" href="${h}"><span class="tile__icon">${icon(ic)}</span><span class="tile__arrow">${icon("arrow-right")}</span><span class="tile__title">${t}</span><span class="t-sm t-muted">${d}</span></a>`).join("")}
        </div>
      </div>
    </section>

    <section class="section section--sand" id="funds">
      <div class="container">
        <div class="section-head reveal">
          <div class="section-head__text"><span class="eyebrow">Featured Funds</span><h2>กองทุนแนะนำ</h2><p class="t-lead">คัดสรรโดยทีมวิเคราะห์ ตามผลการดำเนินงานและความสม่ำเสมอ</p></div>
          <div class="segmented" id="fundFilter" style="max-width:100%;overflow-x:auto">
            ${["ทั้งหมด", "หุ้นไทย", "หุ้นต่างประเทศ", "ตราสารหนี้", "ผสม"].map((t, i) => `<button class="${i ? "" : "is-active"}" data-type="${i ? t : "all"}">${t}</button>`).join("")}
          </div>
        </div>
        <div class="cols-3" id="fundGrid"></div>
        <p class="t-xs t-muted mt-6">ผลการดำเนินงานในอดีตมิได้เป็นสิ่งยืนยันถึงผลการดำเนินงานในอนาคต · ผู้ลงทุนควรทำความเข้าใจลักษณะสินค้า เงื่อนไขผลตอบแทน และความเสี่ยงก่อนตัดสินใจลงทุน · ข้อมูลตัวอย่างสำหรับต้นแบบ</p>
      </div>
    </section>

    <section class="section" id="advisory">
      <div class="container">
        <div class="advisory reveal" style="grid-template-columns:1fr 1fr">
          <div class="advisory__content">
            <span class="eyebrow" style="color:var(--c-accent-200)">Advisory</span>
            <h2>รู้จักสไตล์การลงทุน<br>ของคุณใน 1 นาที</h2>
            <p class="t-lead">ตอบ 3 คำถามสั้นๆ เพื่อรับคำแนะนำพอร์ตเบื้องต้น จากนั้นนัดหมาย Wealth Advisor เพื่อวางแผนแบบเจาะลึก</p>
            <div class="row" style="gap:12px"><a class="btn btn--light" href="#" data-modal="leadModal">นัดหมาย Wealth Advisor ${icon("arrow-right")}</a></div>
          </div>
          <div class="advisory__content" style="background:rgba(255,255,255,.04);border-left:1px solid rgba(255,255,255,.08)">
            <div class="quiz" id="quiz"></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="section-head"><div class="section-head__text"><span class="eyebrow">Insights</span><h2>มุมมองการลงทุน</h2></div><a class="link" href="#" data-toast="Article Pages ใช้ Reusable Design Patterns">ดูบทวิเคราะห์ทั้งหมด ${icon("arrow-right")}</a></div>
        <div class="cols-3">
          ${[["photo-1526628953301-3e589a6a8b74", "Market Outlook", "มุมมองการลงทุนไตรมาส 1/2027: โอกาสในหุ้นเทคโนโลยีโลก", "2 ม.ค. 2027"], ["photo-1600210492486-724fe5c67fb0", "Tax Planning", "Thai ESG vs SSF: เลือกกองทุนลดหย่อนภาษีให้เหมาะกับคุณ", "28 ธ.ค. 2026"], ["photo-1559526324-4b87b5e36e44", "Fixed Income", "หุ้นกู้ในยุคดอกเบี้ยขาลง ยังน่าสนใจหรือไม่", "20 ธ.ค. 2026"]]
            .map(([im, tag, t, d]) => `<a class="article-card" href="#" data-toast="Article template — reusable pattern"><div class="media media--zoom">${img(U(im, 700))}</div><div class="row t-xs t-muted"><span class="badge badge--line">${tag}</span><span>${d}</span></div><h3>${t}</h3></a>`).join("")}
        </div>
      </div>
    </section>`;

  function mCard([n, v, ch, s]) {
    const up = ch >= 0;
    return `<div class="market-card"><div class="market-card__top"><span class="t-muted">${n}</span><span class="${up ? "chg-up" : "chg-down"} t-num t-sm">${up ? "+" : "−"}${Math.abs(ch).toFixed(2)}%</span></div><div class="market-card__val">${v}</div>${sparkline(series(s, 30, 100, 0.03, up ? 0.002 : -0.002), { color: up ? "#1c9a6a" : "#d14b4b" })}</div>`;
  }
  $("#toggleMarkets").addEventListener("click", (e) => {
    const more = $("#marketMore"); const open = more.classList.toggle("hide");
    e.currentTarget.innerHTML = open ? `ดูตลาดเพิ่มเติม ${icon("chevron-down")}` : `ย่อ ${icon("chevron-down", "")}`;
  });

  /* Funds */
  const risk = (lvl) => `<span class="risk" data-level="${lvl}" title="ระดับความเสี่ยง ${lvl}/8">${Array.from({ length: 8 }, (_, i) => `<i class="${i < lvl ? "on" : ""}"></i>`).join("")}</span>`;
  const ret = (v) => (v ? `<strong class="${v >= 0 ? "chg-up" : "chg-down"}">${v >= 0 ? "+" : ""}${v.toFixed(1)}%</strong>` : `<strong class="t-muted">—</strong>`);
  function renderFunds(type) {
    const list = D.funds.filter((f) => type === "all" || f.type === type);
    $("#fundGrid").innerHTML = list.map((f) => `
      <article class="fund-card">
        <div class="row row--between"><span class="badge badge--line">${f.type}</span>${f.tag ? `<span class="badge badge--gold">${f.tag}</span>` : ""}</div>
        <div><div class="t-num t-xs t-muted">${f.code}</div><h3 class="t-h4 mt-2" style="font-size:1.05rem;line-height:1.45">${f.name}</h3></div>
        ${sparkline(series(f.seed, 50, 100, 0.03, f.r1 / 5000), { w: 300, h: 56 })}
        <div class="fund-card__returns t-num"><div><span>1 ปี</span>${ret(f.r1)}</div><div><span>3 ปี (ต่อปี)</span>${ret(f.r3)}</div><div><span>5 ปี (ต่อปี)</span>${ret(f.r5)}</div></div>
        <div class="row row--between"><div class="t-xs t-muted">ความเสี่ยง ${risk(f.risk)}</div><div class="t-xs t-muted">NAV <strong class="t-num" style="color:var(--c-ink)">${f.nav.toFixed(4)}</strong></div></div>
        <div class="row" style="gap:8px"><button class="btn btn--secondary btn--sm" style="flex:1" data-fund="${f.code}">รายละเอียด</button><button class="btn btn--dark btn--sm" style="flex:1" data-toast="ซื้อกองทุนผ่านแอป LHB You">ลงทุน</button></div>
      </article>`).join("") || `<div class="listing__empty">ไม่มีกองทุนในหมวดนี้</div>`;
  }
  $$("#fundFilter button").forEach((b, _, all) => b.addEventListener("click", () => { all.forEach((x) => x.classList.toggle("is-active", x === b)); renderFunds(b.dataset.type); }));
  renderFunds("all");

  /* Fund drawer */
  const drawer = $("#fundDrawer"), ov = $("#drawerOverlay");
  const closeDrawer = () => { drawer.classList.remove("is-open"); ov.classList.remove("is-on"); document.body.classList.remove("is-locked"); };
  ov.addEventListener("click", closeDrawer);
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-fund]"); if (!b) return;
    const f = D.funds.find((x) => x.code === b.dataset.fund);
    drawer.innerHTML = `
      <div class="branch-detail">
        <div class="row row--between"><span class="badge badge--line">${f.type}</span><button class="icon-btn" data-close-drawer aria-label="ปิด">${icon("close")}</button></div>
        <div class="t-num t-xs t-muted mt-6">${f.code}</div>
        <h3 class="mt-2">${f.name}</h3>
        <div class="row mt-4" style="gap:24px"><div><div class="t-xs t-muted">NAV</div><div class="t-num" style="font-size:1.6rem;font-weight:600">${f.nav.toFixed(4)}</div></div><div><div class="t-xs t-muted">1 ปี</div><div class="t-num chg-up" style="font-size:1.6rem;font-weight:600">+${f.r1.toFixed(1)}%</div></div></div>
        <div class="segmented mt-6" id="fundRange">${["1M", "6M", "1Y", "3Y"].map((r, i) => `<button class="${i === 2 ? "is-active" : ""}" data-n="${[22, 120, 250, 750][i]}">${r}</button>`).join("")}</div>
        <div class="mt-4" id="fundChart" style="height:140px">${sparkline(series(f.seed, 120, 100, 0.02, f.r1 / 25000), { w: 400, h: 140 })}</div>
        <dl class="kv mt-6">
          <dt>ระดับความเสี่ยง</dt><dd>${risk(f.risk)} ${f.risk}/8</dd>
          <dt>ลงทุนขั้นต่ำ</dt><dd>500 บาท</dd>
          <dt>ค่าธรรมเนียมการจัดการ</dt><dd>1.07% ต่อปี</dd>
          <dt>นโยบายปันผล</dt><dd>ไม่จ่าย</dd>
          <dt>บลจ.</dt><dd>บลจ. แลนด์ แอนด์ เฮ้าส์</dd>
        </dl>
        <div class="stack mt-8" style="--stack:10px">
          <button class="btn btn--primary btn--block" data-toast="ซื้อกองทุนผ่านแอป LHB You">ลงทุนในกองทุนนี้</button>
          <a class="btn btn--secondary btn--block" href="#" data-toast="ดาวน์โหลด Fund Fact Sheet (PDF)">${icon("download")} Fund Fact Sheet</a>
        </div>
      </div>`;
    drawer.classList.add("is-open"); ov.classList.add("is-on"); document.body.classList.add("is-locked");
    $("[data-close-drawer]", drawer).addEventListener("click", closeDrawer);
    $$("#fundRange button", drawer).forEach((rb, _, all) => rb.addEventListener("click", () => { all.forEach((x) => x.classList.toggle("is-active", x === rb)); $("#fundChart").innerHTML = sparkline(series(f.seed + +rb.dataset.n, Math.min(+rb.dataset.n, 160), 100, 0.02, f.r1 / 25000), { w: 400, h: 140 }); }));
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });

  /* Risk quiz */
  const Q = [
    ["เป้าหมายการลงทุนหลักของคุณคืออะไร", [["รักษาเงินต้นให้ปลอดภัย", 1], ["รายได้สม่ำเสมอ", 2], ["เติบโตระยะยาว", 3]]],
    ["คุณวางแผนลงทุนนานเท่าไร", [["น้อยกว่า 1 ปี", 1], ["1–5 ปี", 2], ["มากกว่า 5 ปี", 3]]],
    ["หากพอร์ตลดลง 15% คุณจะ…", [["ขายทันที", 1], ["รอดูสถานการณ์", 2], ["ลงทุนเพิ่ม", 3]]],
  ];
  const PROFILES = [
    [3, "Conservative", "เน้นความมั่นคง", "ตราสารหนี้ 70% · หุ้น 20% · ทอง 10%", "LHFIXED"],
    [6, "Balanced", "สมดุลระหว่างความเสี่ยงและผลตอบแทน", "หุ้น 50% · ตราสารหนี้ 40% · ทอง 10%", "LHMIX"],
    [9, "Growth", "เน้นการเติบโตระยะยาว", "หุ้น 75% · ตราสารหนี้ 15% · ทางเลือก 10%", "LHGEQ"],
  ];
  let step = 0, score = 0;
  const quiz = $("#quiz");
  function renderQuiz() {
    if (step < Q.length) {
      const [q, opts] = Q[step];
      quiz.innerHTML = `
        <div class="quiz__progress">${Q.map((_, i) => `<i class="${i <= step ? "on" : ""}"></i>`).join("")}</div>
        <span class="t-xs" style="opacity:.6">คำถามที่ ${step + 1} จาก ${Q.length}</span>
        <h3 style="font-size:1.35rem">${q}</h3>
        <div class="quiz__options">${opts.map(([t, s]) => `<button class="quiz__opt" data-s="${s}">${t}</button>`).join("")}</div>`;
      $$(".quiz__opt", quiz).forEach((o) => o.addEventListener("click", () => { score += +o.dataset.s; step++; renderQuiz(); }));
    } else {
      const p = PROFILES.find(([max]) => score <= max);
      const f = D.funds.find((x) => x.code === p[4]);
      quiz.innerHTML = `
        <div class="quiz__progress">${Q.map(() => `<i class="on"></i>`).join("")}</div>
        <span class="t-xs" style="opacity:.6">ผลการประเมินเบื้องต้น</span>
        <h3 style="font-size:2rem">${p[1]}</h3>
        <p style="opacity:.75">${p[2]}</p>
        <div class="card" style="background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.1);padding:20px;color:#fff">
          <div class="t-xs" style="opacity:.6">พอร์ตแนะนำ</div><strong>${p[3]}</strong>
          <hr style="border:0;border-top:1px solid rgba(255,255,255,.1);margin:14px 0">
          <div class="t-xs" style="opacity:.6">กองทุนเริ่มต้น</div><button class="link" style="color:var(--c-accent-200)" data-fund="${f.code}">${f.name} ${icon("arrow-right")}</button>
        </div>
        <div class="row" style="gap:10px"><a class="btn btn--primary" href="#" data-modal="leadModal">คุยกับ Wealth Advisor</a><button class="btn btn--outline-light" id="quizReset">ทำใหม่</button></div>`;
      $("#quizReset").addEventListener("click", () => { step = 0; score = 0; renderQuiz(); });
    }
  }
  renderQuiz();
})();
