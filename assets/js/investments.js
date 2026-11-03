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
          <p class="t-lead">กองทุนรวม ตราสารทางการเงิน และประกันชีวิตควบการลงทุน พร้อมบริการวางแผนการเงินและการลงทุนแบบครบวงจรที่ The Advisory Branch</p>
          <div class="hero2__actions"><a class="btn btn--primary btn--lg" href="#advisory">ประเมินความเสี่ยง ${icon("arrow-right")}</a><a class="btn btn--glass btn--lg" href="#funds">ดูกองทุนแนะนำ</a></div>
        </div>
        <div class="hero2__cards">
          <div class="glass-card">
            <div class="lbl">แคมเปญลดหย่อนภาษี 2026</div>
            <div class="val" style="font-size:1.7rem;font-weight:400">RMF / Thai ESG</div>
            <div class="lbl">LH Fund Pro · สอบถามได้ที่สาขาและ 1327</div>
          </div>
        </div>
      </div>
    </section>

    <section class="container" style="padding-block:24px 56px">
      <a class="campaign" href="#funds" style="display:block" aria-label="LH Fund Pro RMF / ThaiESG 2026">
        <span class="campaign__slide" style="display:block"><picture><source media="(max-width: 680px)" srcset="${url("assets/img/lhbank/banner-rmf-thaiesg-mb.jpg")}"><img src="${url("assets/img/lhbank/banner-rmf-thaiesg.jpg")}" alt="LH Fund Pro RMF / ThaiESG 2026" loading="lazy"></picture></span>
      </a>
    </section>

    <section class="section" id="categories">
      <div class="container">
        <div class="section-head reveal"><div class="section-head__text"><span class="eyebrow">Investment</span><h2>ผลิตภัณฑ์การลงทุน<br>จาก LH Bank</h2></div></div>
        <div class="cols-4 reveal">
          ${[["pie", "กองทุนรวม", "การขายและรับซื้อคืนหน่วยลงทุน พร้อมกองทุนแนะนำ", "#funds"], ["layers", "ตราสารทางการเงิน", "บริการจำหน่ายตราสารทางการเงิน", "#advisory"], ["shield", "ประกันชีวิตควบการลงทุน", "ประกันยูนิตลิงค์ ร่วมกับเมืองไทยประกันชีวิต", "#advisory"], ["chart", "Shares Saving Plan", "โครงการสะสมหุ้น", "#advisory"]]
            .map(([ic, t, d, h]) => `<a class="tile" href="${h}"><span class="tile__icon">${icon(ic)}</span><span class="tile__arrow">${icon("arrow-right")}</span><span class="tile__title">${t}</span><span class="t-sm t-muted">${d}</span></a>`).join("")}
        </div>
      </div>
    </section>

    <section class="section section--sand" id="funds">
      <div class="container">
        <div class="section-head reveal">
          <div class="section-head__text"><span class="eyebrow">Recommended Funds</span><h2>กองทุนแนะนำ</h2><p class="t-lead">กองทุนลดหย่อนภาษี RMF / Thai ESG ปี 2026 และกองทุนที่เปิดเสนอขาย (IPO)</p></div>
        </div>
        <div class="cols-3" id="fundGrid"></div>
        <p class="t-xs t-muted mt-6">NAV และผลการดำเนินงานแสดงจากข้อมูลของ บลจ. แบบรายวันในระบบจริง · ผลการดำเนินงานในอดีตมิได้เป็นสิ่งยืนยันถึงผลการดำเนินงานในอนาคต · ผู้ลงทุนควรทำความเข้าใจลักษณะสินค้า เงื่อนไขผลตอบแทน และความเสี่ยงก่อนตัดสินใจลงทุน</p>
      </div>
    </section>

    <section class="section--tight section--mist">
      <div class="container">
        <div class="row row--between mb-6"><div><span class="eyebrow">Market Preview</span><h2 class="t-h3 mt-4">ภาพรวมตลาด</h2></div><span class="fx-updated"><span class="live"></span> ตัวอย่างการแสดงผล · ระบบจริงเชื่อมต่อข้อมูลตลาดแบบเรียลไทม์</span></div>
        <div class="market-strip" id="marketStrip">${markets.slice(0, 4).map(mCard).join("")}</div>
        <div class="market-strip mt-3 hide" id="marketMore">${markets.slice(4).map(mCard).join("")}</div>
        <div class="text-center mt-6"><button class="btn btn--secondary btn--sm" id="toggleMarkets">ดูตลาดเพิ่มเติม ${icon("chevron-down")}</button></div>
      </div>
    </section>

    <section class="section" id="advisory">
      <div class="container">
        <div class="advisory reveal" style="grid-template-columns:1fr 1fr">
          <div class="advisory__content">
            <span class="eyebrow">LH Bank Advisory</span>
            <h2>รู้จักสไตล์การลงทุน<br>ของคุณใน 1 นาที</h2>
            <p class="t-lead">ตอบ 3 คำถามสั้นๆ เพื่อเริ่มต้น แล้วปรึกษาต่อที่ The Advisory Branch บริการด้านวางแผนการเงินและการลงทุนแบบครบวงจรของ LH Bank</p>
            <div class="row" style="gap:12px"><a class="btn btn--light" href="#" data-modal="leadModal">ให้ที่ปรึกษาติดต่อกลับ ${icon("arrow-right")}</a></div>
          </div>
          <div class="advisory__content" style="background:rgba(255,255,255,.04);border-left:1px solid rgba(255,255,255,.08)">
            <div class="quiz" id="quiz"></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="section-head"><div class="section-head__text"><span class="eyebrow">Insights</span><h2>บทวิเคราะห์และข่าวสาร</h2></div><a class="link" href="#" data-toast="Article Pages ใช้ Reusable Design Patterns">ดูทั้งหมด ${icon("arrow-right")}</a></div>
        <div class="cols-3">
          ${[["photo-1526628953301-3e589a6a8b74", "Weekly Report", "Weekly Report — บทวิเคราะห์เศรษฐกิจและการลงทุนประจำสัปดาห์ จาก LH Bank Advisory", "รายสัปดาห์"], ["photo-1600210492486-724fe5c67fb0", "ลดหย่อนภาษี", "ช่วยให้คุณวางแผนลดหย่อนภาษีได้ง่ายขึ้น ด้วยกองทุน SSF และกองทุน RMF ที่ LH Bank", "บทความ"], ["photo-1573497019236-17f8177b81e8", "ประกัน", "LH Bank ร่วมมือเมืองไทยประกันชีวิต เปิดตัวประกันยูนิตลิงค์", "ข่าวสาร"]]
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

  /* Funds — real codes only; live NAV comes from the AMC feed */
  $("#fundGrid").innerHTML = D.funds.map((f) => `
      <article class="fund-card">
        <div class="row row--between"><span class="badge badge--line">${f.type}</span><span class="badge">IPO</span></div>
        <div><div class="t-xs t-muted">บลจ. แลนด์ แอนด์ เฮ้าส์</div><h3 class="t-h4 mt-2 t-num" style="font-size:1.5rem;letter-spacing:-0.02em">${f.code}</h3><p class="t-xs t-muted mt-2">${f.note}</p></div>
        <div class="fund-card__returns"><div><span>NAV</span><strong class="t-muted">Live</strong></div><div><span>ผลตอบแทน</span><strong class="t-muted">Live</strong></div><div><span>ความเสี่ยง</span><strong class="t-muted">Fact Sheet</strong></div></div>
        <div class="row" style="gap:8px"><a class="btn btn--secondary btn--sm" style="flex:1" href="https://www.lhfund.co.th/" target="_blank" rel="noopener">ข้อมูลกองทุน ${icon("arrow-up-right")}</a><button class="btn btn--dark btn--sm" style="flex:1" data-modal="leadModal">ปรึกษาที่ปรึกษา</button></div>
      </article>`).join("") + `
      <a class="fund-card" href="#" data-modal="leadModal" style="background:var(--c-navy);color:#fff;border:0">
        <span class="eyebrow">ลดหย่อนภาษี 2026</span>
        <h3 class="t-h4" style="color:#fff;font-size:1.4rem;font-weight:400">LH Fund Pro<br>RMF / Thai ESG</h3>
        <p class="t-sm" style="color:rgba(255,255,255,.7)">แคมเปญกองทุนลดหย่อนภาษีปี 2026 จาก LH Bank ดูเงื่อนไขและระยะเวลาแคมเปญได้ที่สาขาหรือ 1327</p>
        <span class="link" style="color:var(--c-accent-200);margin-top:auto">สอบถามรายละเอียด ${icon("arrow-right")}</span>
      </a>`;

  /* Risk quiz */
  const Q = [
    ["เป้าหมายการลงทุนหลักของคุณคืออะไร", [["รักษาเงินต้นให้ปลอดภัย", 1], ["รายได้สม่ำเสมอ", 2], ["เติบโตระยะยาว", 3]]],
    ["คุณวางแผนลงทุนนานเท่าไร", [["น้อยกว่า 1 ปี", 1], ["1–5 ปี", 2], ["มากกว่า 5 ปี", 3]]],
    ["หากพอร์ตลดลง 15% คุณจะ…", [["ขายทันที", 1], ["รอดูสถานการณ์", 2], ["ลงทุนเพิ่ม", 3]]],
  ];
  const PROFILES = [
    [3, "Conservative", "เน้นความมั่นคง รักษาเงินต้น", "สนใจเงินฝากและตราสารหนี้เป็นหลัก"],
    [6, "Balanced", "สมดุลระหว่างความเสี่ยงและผลตอบแทน", "กระจายลงทุนในกองทุนหลายประเภท"],
    [9, "Growth", "เน้นการเติบโตระยะยาว", "รับความผันผวนได้ เพื่อผลตอบแทนระยะยาว"],
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
      quiz.innerHTML = `
        <div class="quiz__progress">${Q.map(() => `<i class="on"></i>`).join("")}</div>
        <span class="t-xs" style="opacity:.6">ผลการประเมินเบื้องต้น</span>
        <h3 style="font-size:2rem">${p[1]}</h3>
        <p style="opacity:.75">${p[2]}</p>
        <div class="card" style="background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.1);padding:20px;color:#fff">
          <div class="t-xs" style="opacity:.6">แนวทางเบื้องต้น</div><strong style="font-weight:400">${p[3]}</strong>
          <p class="t-xs mt-3" style="opacity:.6">ผลนี้เป็นแนวทางเบื้องต้นเท่านั้น ไม่ใช่การประเมินความเสี่ยงตามเกณฑ์ ก.ล.ต. ปรึกษาที่ปรึกษาเพื่อทำแบบประเมินฉบับเต็ม</p>
        </div>
        <div class="row" style="gap:10px"><a class="btn btn--primary" href="#" data-modal="leadModal">คุยกับที่ปรึกษา</a><button class="btn btn--outline-light" id="quizReset">ทำใหม่</button></div>`;
      $("#quizReset").addEventListener("click", () => { step = 0; score = 0; renderQuiz(); });
    }
  }
  renderQuiz();
})();
