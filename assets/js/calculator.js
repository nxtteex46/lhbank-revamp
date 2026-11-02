/* Loan Calculator — reusable calculator pattern.
   A calculator = { fields[], compute(values) → result, renderResult(result) }.
   Home Loan is the reference implementation; Personal / SME / Deposit calculators
   can reuse calcField(), rate tiers, result panel, donut + schedule components. */
(function () {
  const { icon, fmt, $, $$, url, syncRange } = window.LH;
  const qs = new URLSearchParams(location.search);

  const PRODUCTS = {
    "saen-sabai": { name: "แสนสบาย", tiers: [2.75, 2.75, 2.75], float: 5.8, note: "คงที่ 3 ปี" },
    "happy-home": { name: "Happy Home", tiers: [2.49, 2.99, 3.49], float: 5.9, note: "บ้านหลังแรก" },
    refinance: { name: "รีไฟแนนซ์", tiers: [2.65, 2.85, 3.05], float: 5.85, note: "ผ่อนเดิม 3 ปี+" },
  };
  let product = PRODUCTS[qs.get("product")] ? qs.get("product") : "saen-sabai";
  let mode = qs.get("mode") === "afford" ? "afford" : "payment";

  const V = { price: 4500000, down: 10, years: 30, income: 60000, debt: 5000 };

  /* ---------- Reusable field component ---------- */
  function calcField({ id, label, min, max, step, value, unit, hint, format = (v) => fmt(v) }) {
    return `
      <div class="calc-field" data-field="${id}">
        <div class="calc-field__head">
          <label for="f-${id}">${label}</label>
          <div class="calc-field__value"><input id="f-${id}-n" inputmode="decimal" value="${format(value)}" aria-label="${label}"><span>${unit}</span></div>
        </div>
        <input type="range" class="range" id="f-${id}" min="${min}" max="${max}" step="${step}" value="${value}">
        <div class="range-scale"><span>${format(min)} ${unit}</span>${hint ? `<span data-hint="${id}">${hint}</span>` : ""}<span>${format(max)} ${unit}</span></div>
      </div>`;
  }
  function bindField(id, min, max, onChange, format = (v) => fmt(v)) {
    const r = $(`#f-${id}`), n = $(`#f-${id}-n`);
    r.addEventListener("input", () => { n.value = format(+r.value); onChange(+r.value); });
    const commit = () => {
      let v = parseFloat(n.value.replace(/,/g, "")); if (isNaN(v)) v = +r.value;
      v = Math.min(max, Math.max(min, v)); r.value = v; n.value = format(v); syncRange(r); onChange(v);
    };
    n.addEventListener("change", commit);
    n.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); commit(); n.blur(); } });
    n.addEventListener("focus", () => n.select());
    syncRange(r);
  }

  /* ---------- Finance ---------- */
  const pmt = (rate, n, pv) => { const r = rate / 1200; return r ? (pv * r) / (1 - Math.pow(1 + r, -n)) : pv / n; };
  const pv = (rate, n, pay) => { const r = rate / 1200; return r ? (pay * (1 - Math.pow(1 + r, -n))) / r : pay * n; };
  function schedule(loan, years) {
    const P = PRODUCTS[product];
    const n = years * 12;
    const avg3 = P.tiers.reduce((a, b) => a + b, 0) / 3;
    const pay1 = pmt(avg3, n, loan);
    let bal = loan, rows = [], totalInt = 0, pay2 = pay1;
    for (let y = 1; y <= years; y++) {
      const rate = y <= 3 ? P.tiers[y - 1] : P.float;
      if (y === 4) pay2 = pmt(P.float, n - 36, bal);
      const pay = y <= 3 ? pay1 : pay2;
      let pi = 0, ii = 0;
      for (let m = 0; m < 12 && bal > 0.5; m++) {
        const it = (bal * rate) / 1200; const pr = Math.min(bal, pay - it);
        ii += it; pi += pr; bal -= pr;
      }
      totalInt += ii;
      rows.push({ y, rate, principal: pi, interest: ii, balance: Math.max(0, bal) });
    }
    return { pay1, pay2, rows, totalInt, avg3 };
  }

  /* ---------- Render inputs ---------- */
  const form = $("#calcForm");
  const tiersHTML = () => `
    <div class="calc-field">
      <div class="calc-field__head"><label>เลือกผลิตภัณฑ์ / อัตราดอกเบี้ย</label><a class="link t-sm" href="${url("personal/product/?id=" + product)}">รายละเอียด ${icon("arrow-right")}</a></div>
      <div class="rate-tiers" role="radiogroup">${Object.entries(PRODUCTS).map(([k, p]) => `<button type="button" class="rate-tier ${k === product ? "is-active" : ""}" data-product="${k}" role="radio" aria-checked="${k === product}"><span>${p.name}</span><strong>${(p.tiers.reduce((a, b) => a + b, 0) / 3).toFixed(2)}%</strong><span>เฉลี่ย 3 ปี · ${p.note}</span></button>`).join("")}</div>
    </div>`;

  function renderForm() {
    if (mode === "payment") {
      form.innerHTML = `
        ${calcField({ id: "price", label: "ราคาบ้าน / หลักประกัน", min: 500000, max: 30000000, step: 50000, value: V.price, unit: "บาท" })}
        ${calcField({ id: "down", label: "เงินดาวน์", min: 0, max: 50, step: 1, value: V.down, unit: "%", hint: "", format: (v) => v })}
        ${calcField({ id: "years", label: "ระยะเวลาผ่อน", min: 5, max: 40, step: 1, value: V.years, unit: "ปี", format: (v) => v })}
        ${tiersHTML()}`;
      bindField("price", 500000, 30000000, (v) => { V.price = v; compute(); });
      bindField("down", 0, 50, (v) => { V.down = v; compute(); }, (v) => v);
      bindField("years", 5, 40, (v) => { V.years = v; compute(); }, (v) => v);
    } else {
      form.innerHTML = `
        ${calcField({ id: "income", label: "รายได้ต่อเดือน (รวมผู้กู้ร่วม)", min: 15000, max: 500000, step: 1000, value: V.income, unit: "บาท" })}
        ${calcField({ id: "debt", label: "ภาระหนี้อื่นต่อเดือน", min: 0, max: 200000, step: 500, value: V.debt, unit: "บาท", hint: "ผ่อนรถ บัตรเครดิต ฯลฯ" })}
        ${calcField({ id: "years", label: "ระยะเวลาผ่อน", min: 5, max: 40, step: 1, value: V.years, unit: "ปี", format: (v) => v })}
        ${tiersHTML()}`;
      bindField("income", 15000, 500000, (v) => { V.income = v; compute(); });
      bindField("debt", 0, 200000, (v) => { V.debt = v; compute(); });
      bindField("years", 5, 40, (v) => { V.years = v; compute(); }, (v) => v);
    }
    $$("[data-product]", form).forEach((b) => b.addEventListener("click", () => { product = b.dataset.product; renderForm(); compute(); }));
  }

  /* ---------- Compute + result ---------- */
  const res = $("#calcResult");
  function donut(a, b) {
    const C = 2 * Math.PI * 46, t = a + b || 1, da = (a / t) * C;
    return `<svg class="donut" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="46" stroke="rgba(255,255,255,.12)"/><circle cx="60" cy="60" r="46" stroke="var(--c-accent)" stroke-dasharray="${da} ${C}"/><circle cx="60" cy="60" r="46" stroke="var(--c-accent-200)" stroke-dasharray="${C - da} ${C}" stroke-dashoffset="${-da}"/></svg>`;
  }

  function compute() {
    let loan, s, extra;
    if (mode === "payment") {
      loan = Math.round(V.price * (1 - V.down / 100));
      s = schedule(loan, V.years);
      const hint = $('[data-hint="down"]'); if (hint) hint.textContent = `฿${fmt(V.price * V.down / 100)}`;
      extra = { incomeNeeded: s.pay1 / 0.4 };
    } else {
      const maxPay = Math.max(0, V.income * 0.4 - V.debt);
      const P = PRODUCTS[product]; const avg3 = P.tiers.reduce((a, b) => a + b, 0) / 3;
      loan = Math.floor(pv(avg3, V.years * 12, maxPay) / 10000) * 10000;
      s = schedule(Math.max(loan, 0), V.years);
      extra = { maxPay, maxPrice: loan / 0.9 };
    }
    const P = PRODUCTS[product];
    const totalPay = loan + s.totalInt;
    res.innerHTML = mode === "payment" ? `
      <div class="calc-result__main"><span class="t-sm" style="opacity:.7">ค่างวดต่อเดือน (ปีที่ 1–3)</span><div class="t-num mt-2">฿${fmt(s.pay1)}</div><span class="t-xs" style="opacity:.6">หลังปีที่ 3 ประมาณ ฿${fmt(s.pay2)} /เดือน (อัตราลอยตัว ${P.float.toFixed(2)}%)</span></div>
      <div class="calc-result__rows">
        <div><span>วงเงินกู้</span><strong>฿${fmt(loan)}</strong></div>
        <div><span>อัตราดอกเบี้ยเฉลี่ย 3 ปีแรก</span><strong>${s.avg3.toFixed(2)}%</strong></div>
        <div><span>ดอกเบี้ยรวมตลอดสัญญา</span><strong>฿${fmt(s.totalInt)}</strong></div>
        <div><span>รายได้ขั้นต่ำที่แนะนำ</span><strong>฿${fmt(Math.ceil(extra.incomeNeeded / 100) * 100)} /เดือน</strong></div>
      </div>
      <div class="donut-wrap">${donut(loan, s.totalInt)}<div class="legend"><div><i style="background:var(--c-accent)"></i>เงินต้น ${((loan / totalPay) * 100 || 0).toFixed(0)}%</div><div><i style="background:var(--c-accent-200)"></i>ดอกเบี้ย ${((s.totalInt / totalPay) * 100 || 0).toFixed(0)}%</div><div class="t-xs" style="opacity:.6">ยอดชำระรวม ฿${fmt(totalPay)}</div></div></div>
      <div class="stack" style="--stack:10px;margin-top:auto;position:relative">
        <a class="btn btn--primary btn--block btn--lg" href="#" data-modal="applyModal">สมัครสินเชื่อบ้าน ${icon("arrow-right")}</a>
        <div class="row" style="gap:10px"><a class="btn btn--outline-light btn--block" style="flex:1" href="#" data-modal="leadModal">ปรึกษาเจ้าหน้าที่</a><button class="btn btn--outline-light btn--icon" data-toast="บันทึกผลการคำนวณเป็น PDF แล้ว" aria-label="บันทึก">${icon("download")}</button><button class="btn btn--outline-light btn--icon" data-share aria-label="แชร์">${icon("share")}</button></div>
      </div>` : `
      <div class="calc-result__main"><span class="t-sm" style="opacity:.7">วงเงินกู้สูงสุดโดยประมาณ</span><div class="t-num mt-2">฿${fmt(Math.max(loan, 0))}</div><span class="t-xs" style="opacity:.6">คำนวณจากภาระหนี้ต่อรายได้ (DSR) ไม่เกิน 40%</span></div>
      <div class="calc-result__rows">
        <div><span>ค่างวดสูงสุดที่แนะนำ</span><strong>฿${fmt(extra.maxPay)} /เดือน</strong></div>
        <div><span>ราคาบ้านที่เหมาะสม (ดาวน์ 10%)</span><strong>฿${fmt(Math.max(extra.maxPrice, 0))}</strong></div>
        <div><span>อัตราดอกเบี้ยเฉลี่ย 3 ปีแรก</span><strong>${s.avg3.toFixed(2)}%</strong></div>
        <div><span>ดอกเบี้ยรวมตลอดสัญญา</span><strong>฿${fmt(s.totalInt)}</strong></div>
      </div>
      ${loan <= 0 ? `<div class="note" style="background:rgba(255,255,255,.08);color:#fff">${icon("info")}<span>ภาระหนี้ปัจจุบันสูงเกินเกณฑ์ ลองลดภาระหนี้ หรือเพิ่มผู้กู้ร่วม</span></div>` : `<div class="donut-wrap">${donut(loan, s.totalInt)}<div class="legend"><div><i style="background:var(--c-accent)"></i>เงินต้น</div><div><i style="background:var(--c-accent-200)"></i>ดอกเบี้ย</div></div></div>`}
      <div class="stack" style="--stack:10px;margin-top:auto;position:relative">
        <button class="btn btn--primary btn--block btn--lg" id="useLoan">ใช้วงเงินนี้คำนวณค่างวด ${icon("arrow-right")}</button>
        <a class="btn btn--outline-light btn--block" href="#" data-modal="leadModal">ปรึกษาเจ้าหน้าที่</a>
      </div>`;

    const ul = $("#useLoan");
    ul && ul.addEventListener("click", () => { V.price = Math.round(Math.max(extra.maxPrice, 500000) / 50000) * 50000; V.down = 10; setMode("payment"); });
    const sh = $("[data-share]", res);
    sh && sh.addEventListener("click", async () => {
      const u = new URL(location.href); u.searchParams.set("product", product);
      try { if (navigator.share) await navigator.share({ title: "ผลการคำนวณสินเชื่อบ้าน LH Bank", url: u.href }); else { await navigator.clipboard.writeText(u.href); window.LH.toast("คัดลอกลิงก์แล้ว"); } } catch (e) { /* cancelled */ }
    });

    $("#stickyVal").textContent = mode === "payment" ? `฿${fmt(s.pay1)}` : `฿${fmt(extra.maxPay)}`;
    $("#calcSticky .t-xs").textContent = mode === "payment" ? "ค่างวด/เดือน" : "ค่างวดสูงสุด/เดือน";
    $("#ctaSummary").textContent = mode === "payment"
      ? `วงเงินกู้ ฿${fmt(loan)} · ผ่อน ${V.years} ปี · ค่างวดประมาณ ฿${fmt(s.pay1)}/เดือน กับสินเชื่อ ${P.name}`
      : `วงเงินกู้สูงสุดประมาณ ฿${fmt(Math.max(loan, 0))} · ค่างวดไม่เกิน ฿${fmt(extra.maxPay)}/เดือน`;
    renderSchedule(s.rows);
    renderTips(loan, s);
  }

  /* ---------- Schedule ---------- */
  function renderSchedule(rows) {
    const max = Math.max(...rows.map((r) => r.principal + r.interest), 1);
    const step = rows.length > 30 ? 5 : rows.length > 15 ? 3 : 1;
    $("#barChart").innerHTML = rows.map((r) => `
      <div class="bar-chart__col" data-label="${r.y % step === 0 || r.y === 1 ? r.y : ""}">
        <span class="bar-tip">ปีที่ ${r.y} · ${r.rate.toFixed(2)}%<br>เงินต้น ฿${fmt(r.principal)}<br>ดอกเบี้ย ฿${fmt(r.interest)}</span>
        <i class="i" style="height:${(r.interest / max) * 100}%"></i><i class="p" style="height:${(r.principal / max) * 100}%"></i>
      </div>`).join("");
    $("#schedBody").innerHTML = rows.map((r) => `<tr><td>${r.y}</td><td class="num">${r.rate.toFixed(2)}%</td><td class="num">${fmt(r.principal)}</td><td class="num">${fmt(r.interest)}</td><td class="num">${fmt(r.balance)}</td></tr>`).join("");
  }
  $$("#schedView button").forEach((b, _, all) => b.addEventListener("click", () => {
    all.forEach((x) => x.classList.toggle("is-active", x === b));
    $("#schedChart").classList.toggle("hide", b.dataset.v !== "chart");
    $("#schedTable").classList.toggle("hide", b.dataset.v !== "table");
  }));

  function renderTips(loan, s) {
    const tips = [];
    if (mode === "payment" && V.down < 10) tips.push(["piggy", "เพิ่มเงินดาวน์", "ดาวน์ 10% ขึ้นไป ช่วยลดดอกเบี้ยรวมและเพิ่มโอกาสอนุมัติ"]);
    if (V.years > 30) tips.push(["calendar", "ผ่อนสั้นลง ประหยัดกว่า", `ผ่อน 30 ปีแทน ${V.years} ปี ประหยัดดอกเบี้ยได้ประมาณ ฿${fmt(s.totalInt - schedule(loan, 30).totalInt)}`]);
    tips.push(["swap", "รีไฟแนนซ์หลังปีที่ 3", "เมื่อหมดช่วงดอกเบี้ยคงที่ พิจารณารีไฟแนนซ์เพื่อลดค่างวด"]);
    tips.push(["shield", "คุ้มครองวงเงินกู้", "ทำประกัน MRTA เพื่อดูแลครอบครัวหากเกิดเหตุไม่คาดฝัน"]);
    $("#tips").innerHTML = tips.slice(0, 3).map(([ic, t, d]) => `<div class="benefit" style="padding:20px"><span class="tile__icon" style="width:44px;height:44px">${icon(ic)}</span><div><h4 style="font-size:1rem">${t}</h4><p>${d}</p></div></div>`).join("");
  }

  /* ---------- Mode switch ---------- */
  function setMode(m) {
    mode = m;
    $$("#calcMode button").forEach((b) => { b.classList.toggle("is-active", b.dataset.mode === m); b.setAttribute("aria-selected", b.dataset.mode === m); });
    renderForm(); compute();
  }
  $$("#calcMode button").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
  setMode(mode);
})();
