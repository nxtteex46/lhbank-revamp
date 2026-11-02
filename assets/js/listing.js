/* Product Listing template — reused for Deposit / Home Loan / Personal Loan /
   Card / SME / Business via ?cat=. Search + filters + sort + compare (max 3). */
(function () {
  const { icon, img, U, url, $, $$, toast, openModal, initDropdowns } = window.LH;
  const D = window.LHDATA;
  const params = new URLSearchParams(location.search);
  const state = { cat: D.categories[params.get("cat")] ? params.get("cat") : "all", q: params.get("q") || "", tags: new Set(), maxRate: null, featured: false, sort: "rec", compare: [] };

  const TAGS = {
    "saen-sabai": ["ซื้อบ้านใหม่", "บ้านมือสอง"], "happy-home": ["ซื้อบ้านใหม่", "บ้านหลังแรก"], refinance: ["รีไฟแนนซ์"], "home-for-cash": ["บ้านแลกเงิน"],
    "personal-loan": ["ไม่ใช้หลักประกัน"], "car-for-cash": ["ใช้หลักประกัน"],
    "smart-savings": ["ออมทรัพย์", "เปิดผ่านแอป"], "fixed-12": ["ฝากประจำ"], "tax-free-24": ["ฝากประจำ", "ปลอดภาษี"], fcd: ["เงินตราต่างประเทศ"],
    "wealth-card": ["บัตรเครดิต", "Premium"], "travel-card": ["บัตรเครดิต", "ท่องเที่ยว"], "debit-smart": ["บัตรเดบิต"],
    "sme-start": ["เงินทุนหมุนเวียน"], "sme-growth": ["ขยายกิจการ"], "project-finance": ["สินเชื่อ"], "cash-management": ["บริการ"],
  };
  const LEADS = {
    all: ["ผลิตภัณฑ์ทั้งหมด", "เลือกดู เปรียบเทียบ และค้นหาผลิตภัณฑ์ที่เหมาะกับเป้าหมายของคุณ"],
    deposit: ["บัญชีเงินฝาก", "ให้เงินออมเติบโตอย่างมั่นคง ด้วยดอกเบี้ยที่แข่งขันได้ และความยืดหยุ่นที่คุณเลือกได้"],
    "home-loan": ["สินเชื่อบ้าน", "ทุกเส้นทางสู่บ้านที่ใช่ ทั้งซื้อบ้านใหม่ รีไฟแนนซ์ หรือบ้านแลกเงิน"],
    "personal-loan": ["สินเชื่อส่วนบุคคล", "เงินก้อนสำหรับทุกเป้าหมาย อนุมัติไว ดอกเบี้ยโปร่งใส"],
    card: ["บัตรเครดิตและเดบิต", "สิทธิพิเศษที่ออกแบบมาเพื่อไลฟ์สไตล์ของคุณ"],
    sme: ["สินเชื่อและบริการ SME", "เงินทุนและที่ปรึกษาสำหรับธุรกิจที่กำลังเติบโต"],
    business: ["Business Banking", "โซลูชันทางการเงินสำหรับองค์กร"],
  };
  const rateCats = ["home-loan", "personal-loan", "deposit", "sme"];

  /* Category nav */
  const catNav = $("#catNav");
  const cats = [["all", { label: "ทั้งหมด", icon: "grid" }], ...Object.entries(D.categories)];
  catNav.innerHTML = cats.map(([k, c]) => `<button class="cat-btn" data-cat="${k}"><span class="tile__icon">${icon(c.icon)}</span><strong>${c.label}</strong><small>${k === "all" ? D.products.length : D.products.filter((p) => p.cat === k).length} รายการ</small></button>`).join("");
  catNav.addEventListener("click", (e) => { const b = e.target.closest(".cat-btn"); if (!b) return; state.cat = b.dataset.cat; state.tags.clear(); state.maxRate = null; renderAll(); });

  /* Search */
  const sWrap = $("#plSearch"), sInput = $("input", sWrap);
  sInput.value = state.q;
  sInput.addEventListener("input", () => { state.q = sInput.value; renderGrid(); });
  $(".search__clear", sWrap).addEventListener("click", () => { sInput.value = ""; state.q = ""; renderGrid(); sInput.focus(); });

  /* Sort */
  $("#sortDd").addEventListener("change", (e) => { state.sort = e.detail; renderGrid(); });

  /* Filters (mobile sheet) */
  const filters = $("#filters"), fOverlay = $("#filterOverlay");
  const openF = () => { filters.classList.add("is-open"); fOverlay.classList.add("is-on"); document.body.classList.add("is-locked"); };
  const closeF = () => { filters.classList.remove("is-open"); fOverlay.classList.remove("is-on"); document.body.classList.remove("is-locked"); };
  $$("[data-open-filters]").forEach((b) => b.addEventListener("click", openF));
  $$("[data-close-filters]").forEach((b) => b.addEventListener("click", closeF));
  fOverlay.addEventListener("click", closeF);
  $("#resetFilters").addEventListener("click", () => { state.tags.clear(); state.maxRate = null; state.featured = false; renderFilters(); renderGrid(); });

  function pool() { return D.products.filter((p) => state.cat === "all" || p.cat === state.cat); }

  function renderFilters() {
    const tags = [...new Set(pool().flatMap((p) => TAGS[p.id] || []))];
    const showRate = rateCats.includes(state.cat);
    const rates = pool().map((p) => p.compare.rate).filter((r) => typeof r === "number" && r > 0);
    const isDeposit = state.cat === "deposit";
    const maxR = rates.length ? Math.ceil(Math.max(...rates) * 4) / 4 : 10, minR = rates.length ? Math.floor(Math.min(...rates) * 4) / 4 : 0;
    $("#filterBody").innerHTML = `
      <div class="stack" style="--stack:28px">
        ${tags.length ? `<div class="filter-group"><h6>ประเภท</h6><div class="stack">${tags.map((t) => `<label class="check"><input type="checkbox" value="${t}" ${state.tags.has(t) ? "checked" : ""} data-tag> ${t}</label>`).join("")}</div></div>` : ""}
        ${showRate && rates.length > 1 ? `<div class="filter-group"><h6>${isDeposit ? "ดอกเบี้ยขั้นต่ำ" : "ดอกเบี้ยไม่เกิน"} <span class="t-accent t-num" id="rateOut" style="float:right">${(state.maxRate ?? (isDeposit ? minR : maxR)).toFixed(2)}%</span></h6>
          <input type="range" class="range" id="rateRange" min="${minR}" max="${maxR}" step="0.05" value="${state.maxRate ?? (isDeposit ? minR : maxR)}" aria-label="อัตราดอกเบี้ย">
          <div class="range-scale mt-2"><span>${minR.toFixed(2)}%</span><span>${maxR.toFixed(2)}%</span></div></div>` : ""}
        <div class="filter-group"><h6>อื่นๆ</h6><label class="switch"><input type="checkbox" id="featOnly" ${state.featured ? "checked" : ""}> เฉพาะผลิตภัณฑ์แนะนำ / โปรโมชั่น</label></div>
      </div>`;
    $$("[data-tag]").forEach((c) => c.addEventListener("change", () => { c.checked ? state.tags.add(c.value) : state.tags.delete(c.value); renderGrid(); }));
    const rr = $("#rateRange");
    if (rr) { window.LH.syncRange(rr); rr.addEventListener("input", () => { state.maxRate = +rr.value; $("#rateOut").textContent = (+rr.value).toFixed(2) + "%"; renderGrid(); }); }
    $("#featOnly").addEventListener("change", (e) => { state.featured = e.target.checked; renderGrid(); });
  }

  function card(p) {
    const inCmp = state.compare.includes(p.id);
    const c = D.categories[p.cat];
    return `
    <article class="product-card ${inCmp ? "is-compared" : ""}" data-id="${p.id}">
      <a href="${url("personal/product/?id=" + p.id)}" class="media product-card__media" tabindex="-1" aria-hidden="true">${img(U(p.img, 700), "")}</a>
      ${p.badge ? `<div class="product-card__badges"><span class="badge badge--glass" style="background:rgba(13,29,42,.55)">${p.badge}</span></div>` : ""}
      <div class="product-card__body">
        <span class="product-card__cat">${c.label}</span>
        <h3 class="product-card__title"><a href="${url("personal/product/?id=" + p.id)}">${hl(p.name)}</a></h3>
        <p class="product-card__desc">${p.tagline}</p>
        <ul class="product-card__facts" role="list">${p.facts.map((f) => `<li>${icon("check")}<span>${f}</span></li>`).join("")}</ul>
        <div class="product-card__highlight"><span class="product-card__value">${p.highlight.value}<small>${p.highlight.unit}</small></span><span class="product-card__label">${p.highlight.label}</span></div>
      </div>
      <div class="product-card__foot">
        <label class="check"><input type="checkbox" data-compare="${p.id}" ${inCmp ? "checked" : ""}> เปรียบเทียบ</label>
        <a class="btn btn--dark btn--sm" href="${url("personal/product/?id=" + p.id)}">ดูรายละเอียด</a>
      </div>
    </article>`;
  }
  function hl(t) { const q = state.q.trim(); if (!q) return t; return t.replace(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"), "<mark>$1</mark>"); }

  function renderGrid() {
    const q = state.q.trim().toLowerCase();
    sWrap.classList.toggle("has-value", !!q);
    let list = pool().filter((p) => {
      if (q && !(p.name + p.tagline + p.desc + (p.keywords || "") + (TAGS[p.id] || []).join(" ")).toLowerCase().includes(q)) return false;
      if (state.tags.size && !(TAGS[p.id] || []).some((t) => state.tags.has(t))) return false;
      if (state.featured && !p.badge) return false;
      if (state.maxRate != null && typeof p.compare.rate === "number") {
        if (state.cat === "deposit" ? p.compare.rate < state.maxRate : p.compare.rate > state.maxRate) return false;
      }
      return true;
    });
    const num = (p) => (typeof p.compare.rate === "number" ? p.compare.rate : 999);
    if (state.sort === "rate-asc") list.sort((a, b) => num(a) - num(b));
    if (state.sort === "rate-desc") list.sort((a, b) => num(b) % 999 - num(a) % 999);
    if (state.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name, "th"));
    const grid = $("#plGrid");
    grid.innerHTML = list.length ? list.map(card).join("") : `<div class="listing__empty"><div class="tile__icon" style="margin:0 auto 16px">${icon("search")}</div><strong style="color:var(--c-ink)">ไม่พบผลิตภัณฑ์ที่ตรงกับเงื่อนไข</strong><p class="t-sm mt-2">ลองปรับตัวกรองหรือคำค้นหา</p><button class="btn btn--secondary btn--sm mt-6" id="emptyReset">ล้างตัวกรองทั้งหมด</button></div>`;
    const er = $("#emptyReset"); er && er.addEventListener("click", () => { state.tags.clear(); state.maxRate = null; state.featured = false; state.q = ""; sInput.value = ""; renderFilters(); renderGrid(); });
    $("#resultCount").textContent = `แสดง ${list.length} จาก ${pool().length} ผลิตภัณฑ์`;
    const fc = state.tags.size + (state.maxRate != null ? 1 : 0) + (state.featured ? 1 : 0);
    const fcb = $("#filterCount"); fcb.textContent = fc; fcb.classList.toggle("hide", !fc);
  }

  /* Compare */
  document.addEventListener("change", (e) => {
    const id = e.target.dataset && e.target.dataset.compare;
    if (!id) return;
    if (e.target.checked) {
      if (state.compare.length >= 3) { e.target.checked = false; toast("เปรียบเทียบได้สูงสุด 3 รายการ"); return; }
      state.compare.push(id);
    } else state.compare = state.compare.filter((x) => x !== id);
    const cardEl = e.target.closest(".product-card"); cardEl && cardEl.classList.toggle("is-compared", e.target.checked);
    renderTray();
  });
  function renderTray() {
    const tray = $("#compareTray");
    tray.classList.toggle("is-on", state.compare.length > 0);
    const slots = state.compare.map((id) => { const p = D.products.find((x) => x.id === id); return `<span class="compare-slot">${p.name}<button data-remove="${id}" aria-label="นำออก">${icon("close")}</button></span>`; });
    for (let i = state.compare.length; i < 3; i++) slots.push(`<span class="compare-slot compare-slot--empty">+ เลือกเพิ่ม</span>`);
    $("#compareSlots").innerHTML = slots.join("");
    $("#compareGo").disabled = state.compare.length < 2;
    $("#compareGo").textContent = `เปรียบเทียบ (${state.compare.length})`;
  }
  $("#compareSlots").addEventListener("click", (e) => {
    const b = e.target.closest("[data-remove]"); if (!b) return;
    state.compare = state.compare.filter((x) => x !== b.dataset.remove);
    const cb = $(`[data-compare="${b.dataset.remove}"]`); if (cb) { cb.checked = false; cb.closest(".product-card").classList.remove("is-compared"); }
    renderTray();
  });
  $("#compareGo").addEventListener("click", () => {
    const ps = state.compare.map((id) => D.products.find((x) => x.id === id));
    const row = (label, fn) => `<tr><td>${label}</td>${ps.map((p) => `<td>${fn(p)}</td>`).join("")}</tr>`;
    $("#compareTable").innerHTML = `
      <thead><tr><th></th>${ps.map((p) => `<th style="text-transform:none;letter-spacing:0;font-size:.95rem;color:var(--c-ink);font-weight:600">${p.name}</th>`).join("")}</tr></thead>
      <tbody>
        ${row("ประเภท", (p) => D.categories[p.cat].label)}
        ${row("ไฮไลต์", (p) => `<strong class="t-num" style="font-size:1.4rem">${p.highlight.value}${p.highlight.unit}</strong><br><span class="t-xs t-muted">${p.highlight.label}</span>`)}
        ${row("อัตราดอกเบี้ย", (p) => (typeof p.compare.rate === "number" ? (p.compare.rate ? p.compare.rate.toFixed(2) + "%" : "—") : p.compare.rate))}
        ${row("ระยะเวลา", (p) => (typeof p.compare.term === "number" ? p.compare.term + " ปี" : p.compare.term))}
        ${row("วงเงิน / เงื่อนไข", (p) => p.compare.ltv)}
        ${row("ค่าธรรมเนียม", (p) => p.compare.fee)}
        ${row("จุดเด่น", (p) => `<ul class="check-list" style="gap:8px;font-size:.85rem">${p.facts.map((f) => `<li>${f}</li>`).join("")}</ul>`)}
        ${row("", (p) => `<a class="btn btn--primary btn--sm" href="${url("personal/product/?id=" + p.id)}">ดูรายละเอียด</a>`)}
      </tbody>`;
    openModal("compareModal");
  });

  function renderHeader() {
    const [t, l] = LEADS[state.cat];
    $("#plTitle").textContent = t;
    $("#plLead").textContent = l;
    document.title = `LH Bank | ${t}`;
    $("#crumbs").innerHTML = `<li><a href="${url("personal/")}">บุคคล</a></li><li><a href="${url("personal/products/")}">ผลิตภัณฑ์</a></li>${state.cat !== "all" ? `<li><span aria-current="page">${t}</span></li>` : ""}`;
    $$(".cat-btn", catNav).forEach((b) => b.classList.toggle("is-active", b.dataset.cat === state.cat));
    const u = new URL(location.href); state.cat === "all" ? u.searchParams.delete("cat") : u.searchParams.set("cat", state.cat); history.replaceState(null, "", u);
  }
  function renderAll() { renderHeader(); renderFilters(); renderGrid(); }
  renderAll();
  renderTray();
})();
