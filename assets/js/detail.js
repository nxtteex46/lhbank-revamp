/* Product Detail template — one layout for every product type.
   Sections: Overview · Benefits · Eligibility · Interest/Fees · Documents · FAQ · Related · CTA
   CTA + labels adapt by category (Deposit → เปิดบัญชี, Loan → สมัคร/คำนวณ, SME → ปรึกษา RM). */
(function () {
  const { icon, img, U, url, $, $$, toast } = window.LH;
  const D = window.LHDATA;
  const ALIAS = { "saen-sabai": "home-1st-class", "happy-home": "home-1st-class", refinance: "home-refinance", "home-for-cash": "home-4cash" };
  const qid = new URLSearchParams(location.search).get("id") || "home-1st-class";
  const id = ALIAS[qid] || qid;
  const p = D.products.find((x) => x.id === id) || D.products[0];
  const c = D.categories[p.cat];
  const cta = p.cta || c.cta;
  const isLoan = ["home-loan", "personal-loan", "sme"].includes(p.cat);
  const isBiz = ["sme", "business"].includes(p.cat);
  const segHome = p.cat === "sme" ? ["SME", "sme/"] : p.cat === "business" ? ["ธุรกิจ", "business/"] : ["บุคคล", "personal/"];
  if (isBiz) document.body.dataset.segment = p.cat; // header context (rendered already; affects nothing else)
  document.title = `${p.name} | LH Bank`;
  const navMap = { deposit: "deposit", "home-loan": "loans", "personal-loan": "loans", card: "services" };
  $$(".nav__link").forEach((l) => l.classList.toggle("is-current", l.closest(".nav__item").dataset.menu === navMap[p.cat]));

  const primaryBtn = (cls = "btn--primary btn--lg") => isBiz
    ? `<a class="btn ${cls}" href="#" data-modal="leadModal">${cta} ${icon("arrow-right")}</a>`
    : `<a class="btn ${cls}" href="#" data-modal="applyModal">${cta} ${icon("arrow-right")}</a>`;
  const secondaryBtn = (cls = "btn--secondary btn--lg") => p.calc
    ? `<a class="btn ${cls}" href="${url("personal/calculator/home-loan/?product=" + p.id)}">${icon("calc")} คำนวณค่างวด</a>`
    : `<a class="btn ${cls}" href="#" data-modal="leadModal">${icon("headset")} ปรึกษาเจ้าหน้าที่</a>`;

  const sections = [
    ["overview", "ภาพรวม"], ["benefits", "สิทธิประโยชน์"], ["eligibility", "คุณสมบัติ"],
    ["rates", p.cat === "deposit" ? "อัตราดอกเบี้ย" : isLoan ? "ดอกเบี้ยและค่าธรรมเนียม" : "อัตราและค่าธรรมเนียม"],
    ["documents", "เอกสาร"], ["faq", "คำถามที่พบบ่อย"],
  ];

  const related = (p.related || []).map((r) => D.products.find((x) => x.id === r)).filter(Boolean);

  $("#pd").innerHTML = `
    <section class="container">
      <div class="pd-hero">
        <div>
          <nav aria-label="breadcrumb"><ol class="breadcrumb">
            <li><a href="${url(segHome[1])}">${segHome[0]}</a></li>
            <li><a href="${url("personal/products/?cat=" + p.cat)}">${c.label}</a></li>
            <li><span aria-current="page">${p.name}</span></li>
          </ol></nav>
          <div class="row mt-8" style="gap:8px">${p.badge ? `<span class="badge badge--ink">${p.badge}</span>` : ""}<span class="badge">${c.label}</span>${p.promo ? `<span class="badge badge--line">${p.promo}</span>` : ""}</div>
          <h1 class="mt-4" style="max-width:16ch">${p.name}</h1>
          <p class="t-lead mt-4" style="max-width:52ch">${p.desc}</p>
          <div class="pd-keyfacts">${p.keyfacts.map(([v, l]) => `<div><strong>${v}</strong><span>${l}</span></div>`).join("")}</div>
          <div class="hero__actions" style="margin-top:28px">${primaryBtn()}${secondaryBtn()}</div>
        </div>
        <div class="media pd-hero__media">${img(U(p.img, 1100), p.name, 'loading="eager"')}</div>
      </div>
    </section>

    <div class="pd-subnav" id="pdSubnav">
      <div class="container">
        <nav class="tabs" aria-label="ส่วนของหน้า">${sections.map(([k, l], i) => `<a class="tab ${i === 0 ? "is-active" : ""}" href="#${k}" data-spy="${k}">${l}</a>`).join("")}</nav>
        <div class="pd-subnav__cta">${secondaryBtn("btn--secondary btn--sm")}${primaryBtn("btn--primary btn--sm")}</div>
      </div>
    </div>

    <div class="container">
      <div class="pd-layout">
        <div>
          <section class="pd-section" id="overview">
            <h2>ภาพรวมผลิตภัณฑ์</h2>
            <div class="cols-2">
              <div class="prose t-lead" style="font-size:1.05rem"><p>${p.desc}</p><p class="t-muted t-sm mt-4">${p.tagline}</p></div>
              <ul class="check-list">${p.facts.map((f) => `<li>${f}</li>`).join("")}</ul>
            </div>
            <p class="t-xs t-muted mt-6">${p.verified ? "ข้อมูลจากหน้าผลิตภัณฑ์บน lhbank.co.th (ประกาศ ณ 1 พ.ย. 2569)" : "ชื่อและจุดเด่นจากเว็บไซต์ lhbank.co.th · รายละเอียดฉบับเต็มแสดงจาก CMS ในระบบจริง"}</p>
          </section>

          <section class="pd-section" id="benefits">
            <h2>สิทธิประโยชน์</h2>
            <div class="cols-2">${p.benefits.map(([ic, t, d]) => `<div class="benefit"><span class="tile__icon">${icon(ic)}</span><div><h4>${t}</h4>${d ? `<p>${d}</p>` : ""}</div></div>`).join("")}</div>
          </section>

          <section class="pd-section" id="eligibility">
            <h2>คุณสมบัติผู้สมัคร</h2>
            <ul class="check-list">${p.eligibility.map((e) => `<li>${e}</li>`).join("")}</ul>
            ${isLoan && !isBiz ? `<div class="card card--mist mt-8" style="padding:24px"><div class="row row--between"><div><strong>เช็กวงเงินที่กู้ได้ใน 1 นาที</strong><p class="t-sm t-muted">กรอกรายได้และภาระหนี้ เพื่อประเมินวงเงินเบื้องต้น</p></div><a class="btn btn--dark btn--sm" href="${url("personal/calculator/home-loan/?mode=afford&product=" + p.id)}">ประเมินวงเงิน ${icon("arrow-right")}</a></div></div>` : ""}
          </section>

          <section class="pd-section" id="rates">
            <h2>${sections[3][1]}</h2>
            ${p.rates ? `
            <div data-tabs>
              <div class="tabs mb-6" role="tablist"><button class="tab is-active" data-tab="r" role="tab">อัตราดอกเบี้ย</button>${p.fees ? `<button class="tab" data-tab="f" role="tab">ค่าธรรมเนียม</button>` : ""}${p.example ? `<button class="tab" data-tab="e" role="tab">ตัวอย่างการผ่อนชำระ</button>` : ""}</div>
              <div class="tab-panel is-active" data-panel="r">
                <div class="table-wrap"><table class="table table--simple"><thead><tr>${p.rates.head.map((h, i) => `<th class="${i ? "num" : ""}">${h}</th>`).join("")}</tr></thead><tbody>${p.rates.rows.map((r) => `<tr>${r.map((v, i) => `<td class="${i ? "num" : ""}" style="${i ? "" : "white-space:normal;min-width:200px"}">${v}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
              </div>
              ${p.fees ? `<div class="tab-panel" data-panel="f">
                <div class="table-wrap"><table class="table table--simple"><thead><tr><th>ประเภทค่าธรรมเนียม</th><th class="num">จำนวนเงินที่เรียกเก็บ</th></tr></thead><tbody>${p.fees.map(([k, v]) => `<tr><td style="white-space:normal">${k}</td><td class="num">${v}</td></tr>`).join("")}</tbody></table></div>
              </div>` : ""}
              ${p.example ? `<div class="tab-panel" data-panel="e">
                <p class="t-sm t-muted mb-4">${p.example.title}</p>
                <div class="table-wrap"><table class="table table--simple"><thead><tr>${p.example.head.map((h, i) => `<th class="${i ? "num" : ""}">${h}</th>`).join("")}</tr></thead><tbody>${p.example.rows.map((r) => `<tr>${r.map((v, i) => `<td class="${i ? "num" : ""}">${v}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
              </div>` : ""}
            </div>
            ${p.rateNote ? `<div class="note mt-6">${icon("info")}<span>${p.rateNote}</span></div>` : ""}` : `
            <div class="note">${icon("info")}<span>อัตราดอกเบี้ยและค่าธรรมเนียมของผลิตภัณฑ์นี้เป็นไปตามประกาศของธนาคาร ในระบบจริงหน้านี้แสดงข้อมูลล่าสุดจาก CMS ของธนาคาร · สอบถามได้ที่ LH Bank Call Center 1327</span></div>`}
            ${p.payment ? `<h3 class="t-h4 mt-12 mb-4">ช่องทางการชำระเงิน</h3><ul class="check-list">${p.payment.map((x) => `<li>${x}</li>`).join("")}</ul>` : ""}
          </section>

          <section class="pd-section" id="documents">
            <h2>เอกสารประกอบการสมัคร</h2>
            <div class="stack" style="--stack:10px">
              ${p.docs.map(([t, s]) => `<div class="doc-item"><span class="tile__icon">${icon("doc")}</span><div><strong>${t}</strong><br><small>${s}</small></div></div>`).join("")}
              <a class="doc-item" href="#" data-toast="ดาวน์โหลด Product Sheet (PDF)"><span class="tile__icon">${icon("download")}</span><div><strong>รายละเอียดผลิตภัณฑ์ (Sales Sheet)</strong><br><small>PDF · 420 KB</small></div>${icon("arrow-right")}</a>
            </div>
          </section>

          <section class="pd-section" id="faq">
            <h2>คำถามที่พบบ่อย</h2>
            <div class="accordion" data-accordion>
              ${p.faq.map(([q, a], i) => `<div class="acc-item ${i === 0 ? "is-open" : ""}"><button class="acc-trigger" aria-expanded="${i === 0}">${q}<span class="acc-icon"></span></button><div class="acc-panel"><div><div class="acc-content">${a}</div></div></div></div>`).join("")}
            </div>
          </section>
        </div>

        <aside class="pd-aside">
          <div class="aside-card">
            <span class="t-xs t-muted">${p.highlight.label}</span>
            ${p.highlight.text ? `<div class="product-card__value--text mt-2" style="font-size:1.8rem!important">${p.highlight.text}</div>` : `<div class="t-num mt-2">${p.highlight.value}<span style="font-size:.45em;font-weight:500;margin-left:4px">${p.highlight.unit}</span></div>`}
            <hr class="divider" style="margin:20px 0">
            <ul class="check-list" style="gap:10px;font-size:.9rem">${p.facts.map((f) => `<li>${f}</li>`).join("")}</ul>
            <div class="stack mt-6" style="--stack:10px">${primaryBtn("btn--primary btn--block")}${secondaryBtn("btn--secondary btn--block")}</div>
          </div>
          <div class="help-card mt-4">
            <div class="row" style="gap:14px;flex-wrap:nowrap"><span class="help-card__icon">${icon("headset")}</span><div><strong class="t-sm">มีคำถาม? คุยกับผู้เชี่ยวชาญ</strong><div class="t-xs help-card__sub">LH Bank Call Center โทร 1327</div></div></div>
            <div class="help-card__actions"><button class="btn btn--light btn--sm" data-modal="leadModal">ให้ติดต่อกลับ</button><a class="btn btn--outline-light btn--sm" href="tel:1327">${icon("phone")} 1327</a></div>
          </div>
        </aside>
      </div>
    </div>

    ${related.length ? `
    <section class="section section--mist">
      <div class="container">
        <div class="section-head"><div class="section-head__text"><span class="eyebrow">Related</span><h2>ผลิตภัณฑ์ที่เกี่ยวข้อง</h2></div><a class="link" href="${url("personal/products/?cat=" + p.cat)}">ดูทั้งหมด ${icon("arrow-right")}</a></div>
        <div class="cols-3">${related.map((r) => `
          <a class="product-card" href="${url("personal/product/?id=" + r.id)}">
            <div class="media product-card__media">${img(U(r.img, 700), r.name)}</div>
            <div class="product-card__body"><span class="product-card__cat">${D.categories[r.cat].label}</span><h3 class="product-card__title">${r.name}</h3><p class="product-card__desc">${r.tagline}</p>
            <div class="product-card__highlight">${r.highlight.text ? `<span class="product-card__value product-card__value--text">${r.highlight.text}</span>` : `<span class="product-card__value">${r.highlight.value}<small>${r.highlight.unit}</small></span>`}<span class="product-card__label">${r.highlight.label}</span></div></div>
          </a>`).join("")}</div>
      </div>
    </section>` : ""}

    <section class="section">
      <div class="container">
        <div class="cta-band">
          <div><span class="eyebrow">Next step</span><h2 class="mt-4">พร้อมเริ่มต้นกับ<br>${p.name}</h2><p class="t-lead mt-4">เลือกช่องทางที่สะดวก เราพร้อมดูแลทุกขั้นตอน</p></div>
          <div class="cta-band__actions">
            ${isBiz ? "" : `<a class="cta-option" href="https://campaign.lhbank.co.th/" target="_blank" rel="noopener"><span class="tile__icon">${icon("mobile")}</span><div><strong>${cta}ออนไลน์</strong><span>ไปยังระบบสมัครของธนาคาร</span></div>${icon("arrow-up-right")}</a>`}
            ${p.calc ? `<a class="cta-option" href="${url("personal/calculator/home-loan/?product=" + p.id)}"><span class="tile__icon">${icon("calc")}</span><div><strong>คำนวณค่างวด</strong><span>ประเมินค่างวดก่อนตัดสินใจ</span></div>${icon("arrow-right")}</a>` : ""}
            <a class="cta-option" href="#" data-modal="leadModal"><span class="tile__icon">${icon("headset")}</span><div><strong>ให้เจ้าหน้าที่ติดต่อกลับ</strong><span>แจ้งข้อมูลให้ผู้เชี่ยวชาญติดต่อกลับ</span></div>${icon("arrow-right")}</a>
            <a class="cta-option" href="${url("branch-locations/" + (isBiz ? "?type=sme" : ""))}"><span class="tile__icon">${icon("pin")}</span><div><strong>ติดต่อที่สาขา</strong><span>ค้นหาสาขาใกล้คุณ</span></div>${icon("arrow-right")}</a>
          </div>
        </div>
      </div>
    </section>`;

  /* Sticky mobile CTA */
  const sc = $("#stickyCta");
  sc.innerHTML = `${p.calc ? `<a class="btn btn--secondary" href="${url("personal/calculator/home-loan/?product=" + p.id)}">${icon("calc")} คำนวณ</a>` : `<a class="btn btn--secondary" href="#" data-modal="leadModal">ปรึกษา</a>`}${primaryBtn("btn--primary")}`;

  /* Sticky subnav state + scrollspy */
  const sub = $("#pdSubnav");
  const tabs = $$("[data-spy]", sub);
  const secs = sections.map(([k]) => document.getElementById(k));
  const onScroll = () => {
    const top = sub.getBoundingClientRect().top;
    const hh = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 76;
    sub.classList.toggle("is-stuck", top <= hh + 1);
    sc.classList.toggle("is-on", window.scrollY > 500);
    let cur = secs[0].id;
    secs.forEach((s) => { if (s.getBoundingClientRect().top < hh + 140) cur = s.id; });
    tabs.forEach((t) => {
      const on = t.dataset.spy === cur;
      if (on && !t.classList.contains("is-active")) { const nav = t.parentElement; nav.scrollTo({ left: t.offsetLeft - nav.clientWidth / 2 + t.offsetWidth / 2, behavior: "smooth" }); }
      t.classList.toggle("is-active", on);
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Calculator drawer — opens from "คำนวณค่างวด" so the reader keeps the
     product context; real Home 1st Class rate options; link to full page. */
  if (p.calc) {
    const OPTS = [
      ["mrta", "ทำประกัน MRTA/MLTA", "ไม่ฟรีค่าจดจำนอง", [2.64, 2.67, 2.67]],
      ["mrta-free", "ทำประกัน MRTA/MLTA", "ฟรีค่าจดจำนอง", [2.79, 2.82, 2.82]],
      ["no-mrta", "ไม่ทำประกัน", "ไม่ฟรีค่าจดจำนอง", [3.12, 3.15, 3.15]],
    ];
    const FLOAT = 5.17;
    const st = { opt: "mrta", price: 4500000, down: 10, years: 30 };
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <div class="calc-drawer" id="calcDrawer" role="dialog" aria-modal="true" aria-labelledby="cdTitle" hidden>
        <div class="calc-drawer__backdrop" data-cd-close></div>
        <div class="calc-drawer__panel">
          <div class="calc-drawer__head">
            <div><span class="eyebrow">${p.name}</span><h3 id="cdTitle" class="mt-3">คำนวณค่างวด</h3></div>
            <button class="icon-btn" data-cd-close aria-label="ปิด">${icon("close")}</button>
          </div>
          <div class="calc-drawer__body">
            <div class="cd-opts" role="radiogroup" aria-label="แบบอัตราดอกเบี้ย">${OPTS.map(([k, a, b2, t]) => `<button type="button" class="cd-opt" data-opt="${k}" role="radio"><strong class="t-num">${(t.reduce((x, y) => x + y, 0) / 3).toFixed(2)}%</strong><span>${a}</span><span>${b2}</span></button>`).join("")}</div>
            <div class="cd-field"><div class="cd-field__row"><label for="cd-price">ราคาบ้าน</label><strong class="t-num" data-out="price"></strong></div><input class="range" type="range" id="cd-price" data-k="price" min="2000000" max="30000000" step="50000"></div>
            <div class="cd-field"><div class="cd-field__row"><label for="cd-down">เงินดาวน์</label><strong class="t-num" data-out="down"></strong></div><input class="range" type="range" id="cd-down" data-k="down" min="0" max="50" step="1"></div>
            <div class="cd-field"><div class="cd-field__row"><label for="cd-years">ระยะเวลาผ่อน</label><strong class="t-num" data-out="years"></strong></div><input class="range" type="range" id="cd-years" data-k="years" min="5" max="40" step="1"></div>
            <div class="cd-result" aria-live="polite">
              <span>ค่างวดต่อเดือน (ปีที่ 1–3)</span>
              <strong class="t-num" data-out="pay1"></strong>
              <div class="cd-result__rows"><div><span>หลังปีที่ 3 (MRR − 3.01% = 5.17%)</span><b class="t-num" data-out="pay2"></b></div><div><span>วงเงินกู้</span><b class="t-num" data-out="loan"></b></div></div>
            </div>
            <p class="t-xs t-muted">ผลการคำนวณเป็นการประมาณการเบื้องต้น ภายใต้หลักเกณฑ์และเงื่อนไขของธนาคาร · อัตรา Home 1st Class ประกาศ ณ 1 พ.ย. 2569</p>
          </div>
          <div class="calc-drawer__foot">
            <a class="btn btn--secondary" data-cd-full href="#">เครื่องคำนวณแบบเต็ม ${icon("arrow-up-right")}</a>
            <button class="btn btn--primary" data-modal="applyModal">${cta} ${icon("arrow-right")}</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(wrap.firstElementChild);
    const dr = $("#calcDrawer");
    const pmt = (r, n, pv) => { const i = r / 1200; return (pv * i) / (1 - Math.pow(1 + i, -n)); };
    const fmtB = (v) => "฿" + Math.round(v).toLocaleString("en-US");
    const calc = () => {
      const o = OPTS.find((x) => x[0] === st.opt), avg = o[3].reduce((x, y) => x + y, 0) / 3;
      const loan = st.price * (1 - st.down / 100), n = st.years * 12, pay1 = pmt(avg, n, loan);
      let bal = loan; for (let m = 0; m < 36 && m < n; m++) { const r = (o[3][Math.floor(m / 12)] || avg) / 1200; bal -= pay1 - bal * r; }
      const pay2 = n > 36 ? pmt(FLOAT, n - 36, Math.max(bal, 0)) : 0;
      $("[data-out=price]", dr).textContent = fmtB(st.price);
      $("[data-out=down]", dr).textContent = `${st.down}% · ${fmtB(st.price * st.down / 100)}`;
      $("[data-out=years]", dr).textContent = st.years + " ปี";
      $("[data-out=pay1]", dr).textContent = fmtB(pay1);
      $("[data-out=pay2]", dr).textContent = n > 36 ? fmtB(pay2) + " /เดือน" : "–";
      $("[data-out=loan]", dr).textContent = fmtB(loan);
      $$(".cd-opt", dr).forEach((b2) => { const on = b2.dataset.opt === st.opt; b2.classList.toggle("is-active", on); b2.setAttribute("aria-checked", on); });
      $$("input[data-k]", dr).forEach((r) => window.LH.syncRange(r));
      $("[data-cd-full]", dr).href = url(`personal/calculator/home-loan/?product=${st.opt}&price=${st.price}&down=${st.down}&years=${st.years}`);
    };
    $$("input[data-k]", dr).forEach((r) => { r.value = st[r.dataset.k]; r.addEventListener("input", () => { st[r.dataset.k] = +r.value; calc(); }); });
    dr.addEventListener("click", (e) => { const o = e.target.closest("[data-opt]"); if (o) { st.opt = o.dataset.opt; calc(); } if (e.target.closest("[data-cd-close]")) closeCD(); });
    let lastFocus = null;
    const openCD = () => { lastFocus = document.activeElement; dr.hidden = false; requestAnimationFrame(() => dr.classList.add("is-open")); document.body.classList.add("is-locked"); calc(); setTimeout(() => $(".cd-opt.is-active", dr)?.focus({ preventScroll: true }), 350); };
    function closeCD() { dr.classList.remove("is-open"); document.body.classList.remove("is-locked"); setTimeout(() => { dr.hidden = true; lastFocus && lastFocus.focus({ preventScroll: true }); }, 380); }
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !dr.hidden) closeCD(); });
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href*="calculator/home-loan"]');
      if (!a || a.closest("#calcDrawer") || /mode=afford/.test(a.getAttribute("href"))) return;
      e.preventDefault(); openCD();
    });
  }
})();
