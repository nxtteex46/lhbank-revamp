/* Branch Locator — search, province / type / service filters, open-now,
   "near me", list ↔ map sync (pan / zoom), popup + branch detail drawer.
   Map is a stylised vector basemap so the prototype works offline;
   swap for Google Maps / Longdo Map in the full build. */
(function () {
  const { icon, $, $$, fmt, toast, initDropdowns, url } = window.LH;
  const D = window.LHDATA;
  const qs = new URLSearchParams(location.search);
  const state = { q: "", prov: "all", type: qs.get("type") === "sme" ? "sme" : "all", svc: new Set(), openNow: false, me: null, active: null };

  /* ---------- Projection ---------- */
  const B = { n: 14.03, s: 13.62, w: 100.37, e: 100.73 }, W = 1400, H = 1100;
  const xy = (lat, lng) => [((lng - B.w) / (B.e - B.w)) * W, ((B.n - lat) / (B.n - B.s)) * H];
  const dist = (a, b) => { const R = 6371, dLat = ((b.lat - a.lat) * Math.PI) / 180, dLng = ((b.lng - a.lng) * Math.PI) / 180; const h = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };

  /* ---------- Hours ---------- */
  const HOURS = { wk: { days: [1, 2, 3, 4, 5], open: 8.5, close: 15.5, label: "08:30 – 15:30" }, mall: { days: [0, 1, 2, 3, 4, 5, 6], open: 10.5, close: 19, label: "10:30 – 19:00" } };
  const DAYS = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
  const now = new Date(); const today = now.getDay(); const hr = now.getHours() + now.getMinutes() / 60;
  const isOpen = (b) => { const h = HOURS[b.hours]; return h.days.includes(today) && hr >= h.open && hr < h.close; };
  const openLabel = (b) => (isOpen(b) ? `<span class="open-state is-open"><i class="dot"></i>เปิดอยู่ · ปิด ${HOURS[b.hours].label.split("– ")[1]} น.</span>` : `<span class="open-state is-closed"><i class="dot"></i>ปิดแล้ว</span>`);

  /* ---------- Basemap ---------- */
  const canvas = $("#mapCanvas");
  const river = [[14.02, 100.505], [13.95, 100.50], [13.90, 100.505], [13.85, 100.51], [13.81, 100.52], [13.78, 100.505], [13.75, 100.493], [13.73, 100.505], [13.715, 100.515], [13.70, 100.535], [13.69, 100.545], [13.70, 100.56], [13.68, 100.575], [13.66, 100.565], [13.63, 100.575]].map(([a, b]) => xy(a, b));
  const roads = [
    [[13.98, 100.62], [13.85, 100.56], [13.76, 100.56], [13.70, 100.55]],                // Vibhavadi / Rama4-ish
    [[13.745, 100.39], [13.745, 100.50], [13.745, 100.56], [13.735, 100.62], [13.72, 100.70]], // Rama1 / Sukhumvit
    [[13.88, 100.41], [13.83, 100.47], [13.80, 100.53], [13.766, 100.643]],                    // Ladprao axis
    [[13.66, 100.64], [13.69, 100.60], [13.725, 100.585], [13.76, 100.57], [13.82, 100.56]],  // Ratchada / Bangna
    [[13.90, 100.55], [13.82, 100.56], [13.75, 100.535], [13.72, 100.53]],
    [[13.64, 100.70], [13.668, 100.634], [13.69, 100.60]],
  ];
  const ring = (lat, lng, r) => { const [cx, cy] = xy(lat, lng); return `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.85}" fill="none" stroke="#fff" stroke-width="10" opacity=".8"/>`; };
  const path = (pts) => pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(0) + " " + p[1].toFixed(0)).join(" ");
  const labels = [["นนทบุรี", 13.88, 100.47], ["ปทุมธานี", 13.99, 100.60], ["จตุจักร", 13.83, 100.575], ["ปทุมวัน", 13.752, 100.525], ["สาทร", 13.715, 100.545], ["วัฒนา", 13.738, 100.595], ["บางกะปิ", 13.778, 100.655], ["บางนา", 13.66, 100.615], ["สมุทรปราการ", 13.63, 100.69], ["คลองสาน", 13.72, 100.485], ["ห้วยขวาง", 13.775, 100.585]];
  let parks = ""; [[13.73, 100.541, 26], [13.80, 100.553, 32], [13.76, 100.505, 14], [13.69, 100.59, 22]].forEach(([a, b, r]) => { const [x, y] = xy(a, b); parks += `<circle cx="${x}" cy="${y}" r="${r}" fill="#d9ecd9"/>`; });
  let grid = ""; for (let i = 0; i < W; i += 70) grid += `<path d="M${i} 0V${H}" stroke="#e3ebef" stroke-width="1"/>`; for (let j = 0; j < H; j += 70) grid += `<path d="M0 ${j}H${W}" stroke="#e3ebef" stroke-width="1"/>`;
  canvas.innerHTML = `
    <svg class="map__bg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
      <rect width="${W}" height="${H}" fill="#eef3f5"/>${grid}${parks}
      ${ring(13.76, 100.55, 230)}${ring(13.76, 100.55, 420)}
      ${roads.map((r) => `<path d="${path(r.map(([a, b]) => xy(a, b)))}" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="${path(r.map(([a, b]) => xy(a, b)))}" fill="none" stroke="#f3e2b8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>`).join("")}
      <path d="${path(river)}" fill="none" stroke="#bfdcea" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
      ${labels.map(([t, a, b]) => { const [x, y] = xy(a, b); return `<text x="${x}" y="${y}" font-size="15" fill="#8a9aa5" font-family="Anuphan, sans-serif" text-anchor="middle" font-weight="500">${t}</text>`; }).join("")}
    </svg>
    ${D.branches.map((b, i) => { const [x, y] = xy(b.lat, b.lng); return `<button class="pin pin--logo ${b.type === "sme" ? "pin--sme" : ""}" data-pin="${b.id}" style="left:${x}px;top:${y}px" aria-label="${b.name}"><span class="pin__tag"><img class="pin__logo" src="${url("assets/img/lhbank/logo.svg")}" alt=""><img class="pin__logo pin__logo--white" src="${url("assets/img/lhbank/logo-white.svg")}" alt="">${b.type === "sme" ? "<em>SME</em>" : ""}</span></button>`; }).join("")}
    <span class="map__me hide" id="meDot"></span>`;

  /* ---------- Pan / zoom ---------- */
  const map = $("#map");
  let view = { x: 0, y: 0, k: 1 };
  const apply = (anim) => { canvas.style.transition = anim ? "transform .45s cubic-bezier(.2,.7,.2,1)" : "none"; canvas.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.k})`; $$(".pin", canvas).forEach((p) => (p.style.transform = `translate(-50%, -100%) scale(${(p.classList.contains("is-active") ? 1.15 : 1) / view.k})`)); };
  function fit(list = visible(), anim = true) {
    const r = map.getBoundingClientRect(); if (!r.width) return;
    const pts = (list.length ? list : D.branches).map((b) => xy(b.lat, b.lng));
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const pad = 80, bw = Math.max(...xs) - Math.min(...xs) || 200, bh = Math.max(...ys) - Math.min(...ys) || 200;
    view.k = Math.min(2.4, Math.max(0.45, Math.min((r.width - pad * 2) / bw, (r.height - pad * 2) / bh)));
    view.x = r.width / 2 - ((Math.max(...xs) + Math.min(...xs)) / 2) * view.k;
    view.y = r.height / 2 - ((Math.max(...ys) + Math.min(...ys)) / 2) * view.k;
    apply(anim);
  }
  function centerOn(b, k = Math.max(view.k, 1.6)) {
    const r = map.getBoundingClientRect(); const [x, y] = xy(b.lat, b.lng);
    view.k = k; view.x = r.width / 2 - x * k; view.y = r.height / 2 - y * k + 40; apply(true);
  }
  const zoom = (f, cx, cy) => { const r = map.getBoundingClientRect(); cx ??= r.width / 2; cy ??= r.height / 2; const k = Math.min(4, Math.max(0.4, view.k * f)); view.x = cx - ((cx - view.x) * k) / view.k; view.y = cy - ((cy - view.y) * k) / view.k; view.k = k; apply(true); };
  $("#zIn").addEventListener("click", () => zoom(1.4)); $("#zOut").addEventListener("click", () => zoom(1 / 1.4)); $("#zFit").addEventListener("click", () => fit());
  map.addEventListener("wheel", (e) => { e.preventDefault(); const r = map.getBoundingClientRect(); view.k; const f = e.deltaY < 0 ? 1.12 : 1 / 1.12; const k = Math.min(4, Math.max(0.4, view.k * f)); const cx = e.clientX - r.left, cy = e.clientY - r.top; view.x = cx - ((cx - view.x) * k) / view.k; view.y = cy - ((cy - view.y) * k) / view.k; view.k = k; apply(false); }, { passive: false });
  let drag = null, moved = false;
  map.addEventListener("pointerdown", (e) => { if (e.target.closest(".map__controls, .map__popup")) return; drag = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y }; moved = false; });
  window.addEventListener("pointermove", (e) => { if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (Math.abs(dx) + Math.abs(dy) > 4) { moved = true; map.classList.add("is-dragging"); } view.x = drag.vx + dx; view.y = drag.vy + dy; apply(false); });
  window.addEventListener("pointerup", () => { drag = null; map.classList.remove("is-dragging"); });

  /* ---------- Filters ---------- */
  const provinces = [...new Set(D.branches.map((b) => b.province))];
  $("#provMenu").innerHTML = [["all", "ทุกจังหวัด"], ...provinces.map((p) => [p, p])].map(([v, l], i) => `<button class="dropdown__item ${i ? "" : "is-selected"}" data-value="${v}">${l}</button>`).join("");
  initDropdowns($("#locator"));
  $("#provDd").addEventListener("change", (e) => { state.prov = e.detail; render(true); });

  /* Filters: type = single choice (segmented) · services = multi-select
     (check chips) · open-now = switch · clear with active count */
  const TYPES = [["all", "ทั้งหมด"], ["branch", "สาขา"], ["sme", "ศูนย์ธุรกิจ SME"]];
  const SVCS = [["weekend", "เปิดเสาร์-อาทิตย์"], ["fx", "แลกเงิน"], ["wealth", "ที่ปรึกษาการลงทุน"], ["safe", "ตู้นิรภัย"]];
  const fWrap = $("#brFilters");
  const activeCount = () => (state.type !== "all" ? 1 : 0) + state.svc.size + (state.openNow ? 1 : 0);
  const renderChips = () => {
    const n = activeCount();
    fWrap.innerHTML = `
      <div class="br-filter__group">
        <span class="br-filter__label">ประเภท <small>เลือก 1</small></span>
        <div class="segmented br-type" role="radiogroup" aria-label="ประเภทสาขา">${TYPES.map(([v, l]) => `<button type="button" role="radio" aria-checked="${state.type === v}" class="${state.type === v ? "is-active" : ""}" data-type="${v}">${l}</button>`).join("")}</div>
      </div>
      <div class="br-filter__group">
        <span class="br-filter__label">บริการ <small>เลือกได้หลายข้อ</small></span>
        <div class="br-svc" role="group" aria-label="บริการ">${SVCS.map(([v, l]) => `<button type="button" role="checkbox" aria-checked="${state.svc.has(v)}" class="check-chip ${state.svc.has(v) ? "is-on" : ""}" data-svc="${v}"><span class="check-chip__box">${icon("check")}</span>${l}</button>`).join("")}</div>
      </div>
      <div class="br-filter__foot">
        <label class="switch"><input type="checkbox" data-open ${state.openNow ? "checked" : ""}> เปิดอยู่ตอนนี้</label>
        <button type="button" class="br-filter__clear" data-clear ${n ? "" : "disabled"}>ล้างตัวกรอง${n ? ` (${n})` : ""}</button>
      </div>`;
  };
  fWrap.addEventListener("click", (e) => {
    const t = e.target.closest("[data-type]"), sv = e.target.closest("[data-svc]"), cl = e.target.closest("[data-clear]");
    if (t) state.type = t.dataset.type;
    else if (sv) { const v = sv.dataset.svc; state.svc.has(v) ? state.svc.delete(v) : state.svc.add(v); }
    else if (cl) { state.type = "all"; state.svc.clear(); state.openNow = false; }
    else return;
    renderChips(); render(true);
  });
  fWrap.addEventListener("change", (e) => { if (e.target.matches("[data-open]")) { state.openNow = e.target.checked; renderChips(); render(true); } });

  const sWrap = $("#brSearch"), sIn = $("input", sWrap);
  sIn.addEventListener("input", () => { state.q = sIn.value; sWrap.classList.toggle("has-value", !!sIn.value); render(true); });
  $(".search__clear", sWrap).addEventListener("click", () => { sIn.value = ""; state.q = ""; sWrap.classList.remove("has-value"); render(true); });

  $("#locateMe").addEventListener("click", (e) => {
    const btn = e.currentTarget; btn.classList.add("is-loading");
    setTimeout(() => {
      btn.classList.remove("is-loading");
      state.me = { lat: 13.7445, lng: 100.5395 }; // simulated: Siam / Chidlom
      const [x, y] = xy(state.me.lat, state.me.lng); const me = $("#meDot"); me.style.left = x + "px"; me.style.top = y + "px"; me.classList.remove("hide");
      toast("ใช้ตำแหน่งปัจจุบัน (จำลอง: สยาม) — เรียงตามระยะทาง");
      render(false); const v = visible(); if (v[0]) select(v[0].id, true);
    }, 700);
  });

  $$("#viewToggle button").forEach((b, _, all) => b.addEventListener("click", () => {
    all.forEach((x) => x.classList.toggle("is-active", x === b));
    $("#locator").classList.toggle("show-map", b.dataset.view === "map");
    if (b.dataset.view === "map") requestAnimationFrame(() => (state.active ? centerOn(D.branches.find((x) => x.id === state.active)) : fit(visible(), false)));
  }));

  function visible() {
    const q = state.q.trim().toLowerCase();
    let list = D.branches.filter((b) =>
      (!q || (b.name + b.district + b.province + b.addr).toLowerCase().includes(q)) &&
      (state.prov === "all" || b.province === state.prov) &&
      (state.type === "all" || b.type === state.type) &&
      (!state.openNow || isOpen(b)) &&
      [...state.svc].every((s) => b.services.includes(s)));
    if (state.me) list = list.map((b) => ({ ...b, km: dist(state.me, b) })).sort((a, b) => a.km - b.km);
    return list;
  }

  /* ---------- List ---------- */
  function render(refit) {
    const list = visible();
    const ids = new Set(list.map((b) => b.id));
    $$(".pin", canvas).forEach((p) => p.classList.toggle("pin--hidden", !ids.has(+p.dataset.pin)));
    $("#brList").innerHTML = `<div class="locator__count">พบ ${list.length} สาขา${state.me ? " · เรียงตามระยะทาง" : ""}</div>` + (list.length ? list.map((b) => `
      <button class="branch-card ${state.active === b.id ? "is-active" : ""}" data-branch="${b.id}">
        <div class="branch-card__top"><h4>${b.name}</h4>${b.km != null ? `<span class="branch-card__dist">${b.km.toFixed(1)} กม.</span>` : ""}</div>
        <p>${b.addr}</p>
        <div class="branch-card__meta">${openLabel(b)}<span class="t-xs t-muted">· ${b.hours === "mall" ? "เปิดทุกวัน" : "จ.–ศ."}</span></div>
        <div class="branch-card__meta">${b.services.slice(0, 3).map((s) => `<span class="badge badge--line">${D.services[s][1]}</span>`).join("")}</div>
      </button>`).join("") : `<div class="listing__empty" style="margin:12px">ไม่พบสาขาที่ตรงกับเงื่อนไข<br><button class="btn btn--secondary btn--sm mt-4" id="brReset">ล้างตัวกรอง</button></div>`);
    const rs = $("#brReset"); rs && rs.addEventListener("click", () => { state.q = ""; sIn.value = ""; state.type = "all"; state.svc.clear(); state.openNow = false; state.prov = "all"; renderChips(); render(true); });
    if (refit) fit(list);
  }
  $("#brList").addEventListener("click", (e) => { const c = e.target.closest("[data-branch]"); if (c) select(+c.dataset.branch, true); });
  canvas.addEventListener("click", (e) => { const p = e.target.closest("[data-pin]"); if (p && !moved) select(+p.dataset.pin, false); });

  /* ---------- Select / popup / drawer ---------- */
  const popup = $("#mapPopup");
  function select(id, fromList) {
    state.active = id;
    const b = visible().find((x) => x.id === id) || D.branches.find((x) => x.id === id);
    $$(".pin", canvas).forEach((p) => p.classList.toggle("is-active", +p.dataset.pin === id));
    $$(".branch-card").forEach((c) => c.classList.toggle("is-active", +c.dataset.branch === id));
    const card = $(`.branch-card[data-branch="${id}"]`); if (card && !fromList) card.scrollIntoView({ block: "nearest", behavior: "smooth" });
    popup.innerHTML = `
      <div class="row row--between" style="align-items:flex-start"><div><span class="badge ${b.type === "sme" ? "badge--ink" : ""}">${b.type === "sme" ? "ศูนย์ธุรกิจ SME" : "สาขา"}</span><h4 class="mt-2" style="font-size:1.05rem">${b.name}</h4></div><button class="icon-btn" id="popClose" aria-label="ปิด" style="width:36px;height:36px">${icon("close")}</button></div>
      <div class="mt-2">${openLabel(b)}</div>
      <p class="t-xs t-muted mt-2">${b.addr}</p>
      <div class="row mt-4" style="gap:8px"><button class="btn btn--dark btn--sm" data-detail="${b.id}">รายละเอียด</button><a class="btn btn--secondary btn--sm" href="https://www.google.com/maps/dir/?api=1&destination=${b.lat},${b.lng}" target="_blank" rel="noopener">${icon("arrow-up-right")} นำทาง</a></div>`;
    popup.classList.add("is-on");
    $("#popClose").addEventListener("click", () => { popup.classList.remove("is-on"); state.active = null; $$(".pin, .branch-card").forEach((x) => x.classList.remove("is-active")); apply(false); });
    if (fromList && matchMedia("(max-width: 960px)").matches) { openDetail(b.id); return; }
    centerOn(b);
  }

  const drawer = $("#brDrawer"), ov = $("#brOverlay");
  const closeD = () => { drawer.classList.remove("is-open"); ov.classList.remove("is-on"); document.body.classList.remove("is-locked"); };
  ov.addEventListener("click", closeD);
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeD());
  document.addEventListener("click", (e) => { const d = e.target.closest("[data-detail]"); if (d) openDetail(+d.dataset.detail); });
  function openDetail(id) {
    const b = D.branches.find((x) => x.id === id), h = HOURS[b.hours];
    drawer.innerHTML = `
      <div class="branch-detail">
        <div class="row row--between"><span class="badge ${b.type === "sme" ? "badge--ink" : ""}">${b.type === "sme" ? "ศูนย์ธุรกิจ SME" : "สาขา"}</span><button class="icon-btn" data-close-d aria-label="ปิด">${icon("close")}</button></div>
        <h3 class="mt-4">${b.name}</h3>
        <div class="mt-2">${openLabel(b)}</div>
        <div class="media ratio-16x9 mt-6" style="border-radius:var(--r-md)"><img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=70" alt="" loading="lazy"></div>
        <div class="stack mt-6" style="--stack:12px">
          <div class="row" style="gap:12px;align-items:flex-start;flex-wrap:nowrap">${icon("pin")}<span class="t-sm">${b.addr} ${b.province}</span></div>
          <div class="row" style="gap:12px">${icon("phone")}<a class="t-sm link link--ink" href="tel:${b.tel.replace(/-/g, "")}">${b.tel}</a></div>
        </div>
        <div class="row mt-6" style="gap:8px">
          <a class="btn btn--primary btn--sm" style="flex:1" href="https://www.google.com/maps/dir/?api=1&destination=${b.lat},${b.lng}" target="_blank" rel="noopener">${icon("map")} นำทาง</a>
          <a class="btn btn--secondary btn--sm" style="flex:1" href="tel:${b.tel.replace(/-/g, "")}">${icon("phone")} โทร</a>
          <button class="btn btn--secondary btn--sm btn--icon" data-toast="คัดลอกลิงก์สาขาแล้ว" aria-label="แชร์">${icon("share")}</button>
        </div>
        <h4 class="mt-8 mb-4" style="font-size:1rem">เวลาทำการ</h4>
        <div class="branch-detail__hours">${[1, 2, 3, 4, 5, 6, 0].map((d) => `<div class="${d === today ? "is-today" : ""}"><span>${DAYS[d]}${d === today ? " (วันนี้)" : ""}</span><span class="t-num">${h.days.includes(d) ? h.label : "ปิดทำการ"}</span></div>`).join("")}</div>
        <h4 class="mt-8 mb-4" style="font-size:1rem">บริการ</h4>
        <div class="service-grid">${b.services.map((s) => `<div>${icon(D.services[s][0])}${D.services[s][1]}</div>`).join("")}<div>${icon("accessible")}ทางลาดผู้พิการ</div><div>${icon("car")}ที่จอดรถ</div></div>
        <div class="card card--mist mt-8" style="padding:20px"><strong class="t-sm">นัดหมายล่วงหน้า</strong><p class="t-xs t-muted mt-2">จองคิวเพื่อพบเจ้าหน้าที่ ลดเวลารอที่สาขา</p><button class="btn btn--dark btn--sm mt-4" data-modal="leadModal">จองคิว</button></div>
      </div>`;
    drawer.classList.add("is-open"); ov.classList.add("is-on"); document.body.classList.add("is-locked");
    $("[data-close-d]", drawer).addEventListener("click", closeD);
  }

  /* ---------- Boot ---------- */
  renderChips();
  render(false);
  requestAnimationFrame(() => fit(visible(), false));
  window.addEventListener("resize", () => fit(visible(), false));
})();
