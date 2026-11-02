/* Exchange Rates — table (sort / search / region / favourites / date & round),
   mobile card list, converter, historical chart with hover tooltip. */
(function () {
  const { icon, $, $$, fmt, sparkline, series, toast } = window.LH;
  const D = window.LHDATA;
  const state = { q: "", region: "all", sort: null, dir: 1, sel: "USD", days: 30, date: null, round: 3, fav: new Set(loadFav()) };
  function loadFav() { try { return JSON.parse(localStorage.getItem("lh-fx-fav") || '["USD","JPY"]'); } catch (e) { return ["USD", "JPY"]; } }
  function saveFav() { try { localStorage.setItem("lh-fx-fav", JSON.stringify([...state.fav])); } catch (e) { /* ignore */ } }

  const todayStr = new Date().toISOString().slice(0, 10);
  const dateIn = $("#fxDate"); dateIn.value = todayStr; dateIn.max = todayStr;
  const ROUNDS = ["08:30", "10:30", "13:30", "16:00"];
  $("#fxRound").innerHTML = ROUNDS.map((r, i) => `<button class="${i === state.round ? "is-active" : ""}" data-r="${i}">รอบ ${r}</button>`).join("");

  /* Rate generator: deterministic per (code, date, round) so historical views are stable */
  const hash = (s) => { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return (h >>> 0) % 100000; };
  function ratesFor(c) {
    const dayOffset = Math.round((new Date(todayStr) - new Date(dateIn.value)) / 864e5);
    const f = 1 + (((hash(c.code + dateIn.value + state.round) % 1000) / 1000) - 0.5) * 0.012 - dayOffset * 0.00005;
    const prev = 1 + (((hash(c.code + dateIn.value + "p") % 1000) / 1000) - 0.5) * 0.012;
    return { buyNote: c.buyNote * f, buyTT: c.buyTT * f, sell: c.sell * f, chg: ((f - prev) / prev) * 100 };
  }
  const dp = (c) => (c.sell < 2 ? 4 : 4);

  function list() {
    const q = state.q.trim().toLowerCase();
    let L = D.currencies.map((c) => ({ ...c, ...ratesFor(c) })).filter((c) =>
      (!q || (c.code + c.name + c.th).toLowerCase().includes(q)) &&
      (state.region === "all" || (state.region === "fav" ? state.fav.has(c.code) : c.region === state.region)));
    if (state.sort) L.sort((a, b) => (state.sort === "code" ? a.code.localeCompare(b.code) : a[state.sort] - b[state.sort]) * state.dir);
    else L.sort((a, b) => (state.fav.has(b.code) - state.fav.has(a.code)));
    return L;
  }
  const chg = (v) => `<span class="${v >= 0 ? "chg-up" : "chg-down"}">${v >= 0 ? "▲" : "▼"} ${Math.abs(v).toFixed(2)}%</span>`;
  const star = (c) => `<button class="fx-star ${state.fav.has(c.code) ? "is-on" : ""}" data-fav="${c.code}" aria-label="รายการโปรด ${c.code}" aria-pressed="${state.fav.has(c.code)}">${icon("star")}</button>`;
  const unit = (c) => (c.unit > 1 ? ` <span class="t-xs t-muted">/${fmt(c.unit)}</span>` : "");

  function render() {
    const L = list();
    $("#fxBody").innerHTML = L.length ? L.map((c) => `
      <tr class="fx-row ${c.code === state.sel ? "is-selected" : ""}" data-code="${c.code}" tabindex="0">
        <td>${star(c)}</td>
        <td><div class="fx-cur"><span class="fx-flag">${c.flag}</span><div><strong>${c.code}${unit(c)}</strong><small>${c.th}</small></div></div></td>
        <td class="num">${c.buyNote.toFixed(dp(c))}</td>
        <td class="num">${c.buyTT.toFixed(dp(c))}</td>
        <td class="num" style="font-weight:600">${c.sell.toFixed(dp(c))}</td>
        <td class="num">${chg(c.chg)}</td>
        <td>${sparkline(series(hash(c.code), 7, 100, 0.01), { w: 100, h: 28, fill: false, color: c.chg >= 0 ? "#1c9a6a" : "#d14b4b" })}</td>
      </tr>`).join("") : `<tr><td colspan="7"><div class="listing__empty" style="border:0">ไม่พบสกุลเงินที่ค้นหา</div></td></tr>`;
    $("#fxMobile").innerHTML = L.map((c) => `
      <div class="fx-mcard ${c.code === state.sel ? "is-selected" : ""}" data-code="${c.code}">
        <div class="row row--between"><div class="fx-cur"><span class="fx-flag">${c.flag}</span><div><strong>${c.code}${unit(c)}</strong><small>${c.th}</small></div></div><div class="row" style="gap:4px">${chg(c.chg)}${star(c)}</div></div>
        <div class="fx-mcard__rates"><div><span>ซื้อ ธนบัตร</span><strong>${c.buyNote.toFixed(dp(c))}</strong></div><div><span>ซื้อ T.T.</span><strong>${c.buyTT.toFixed(dp(c))}</strong></div><div><span>ขาย</span><strong>${c.sell.toFixed(dp(c))}</strong></div></div>
      </div>`).join("") || `<div class="listing__empty">ไม่พบสกุลเงินที่ค้นหา</div>`;
    $$("#fxTable th.sortable").forEach((th) => { th.classList.toggle("sort-asc", th.dataset.sort === state.sort && state.dir === 1); th.classList.toggle("sort-desc", th.dataset.sort === state.sort && state.dir === -1); });
    const d = new Date(dateIn.value);
    $("#fxUpdated").textContent = `อัปเดตล่าสุด ${d.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })} · รอบ ${ROUNDS[state.round]} น.`;
    convert(); renderHist();
  }

  /* Interactions */
  document.addEventListener("click", (e) => {
    const f = e.target.closest("[data-fav]");
    if (f) { e.stopPropagation(); const c = f.dataset.fav; state.fav.has(c) ? state.fav.delete(c) : state.fav.add(c); saveFav(); toast(state.fav.has(c) ? `เพิ่ม ${c} ในรายการโปรด` : `นำ ${c} ออกจากรายการโปรด`); render(); return; }
    const r = e.target.closest("[data-code]");
    if (r) { state.sel = r.dataset.code; $("#convFromCur").value = state.sel; render(); if (matchMedia("(max-width: 1100px)").matches) $("#histHead").closest(".card").scrollIntoView({ behavior: "smooth", block: "center" }); }
  });
  $("#fxBody").addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.dataset.code) e.target.click(); });
  $$("#fxTable th.sortable").forEach((th) => th.addEventListener("click", () => { if (state.sort === th.dataset.sort) state.dir *= -1; else { state.sort = th.dataset.sort; state.dir = 1; } render(); }));
  const sW = $("#fxSearch"), sI = $("input", sW);
  sI.addEventListener("input", () => { state.q = sI.value; sW.classList.toggle("has-value", !!sI.value); render(); });
  $(".search__clear", sW).addEventListener("click", () => { sI.value = ""; state.q = ""; sW.classList.remove("has-value"); render(); });
  $("#regionDd").addEventListener("change", (e) => { state.region = e.detail; render(); });
  dateIn.addEventListener("change", () => { if (!dateIn.value) dateIn.value = todayStr; render(); toast(dateIn.value === todayStr ? "แสดงอัตราวันนี้" : "แสดงอัตราย้อนหลัง"); });
  $$("#fxRound button").forEach((b, _, all) => b.addEventListener("click", () => { all.forEach((x) => x.classList.toggle("is-active", x === b)); state.round = +b.dataset.r; render(); }));

  /* Converter */
  const opts = `<option value="THB">THB</option>` + D.currencies.map((c) => `<option value="${c.code}">${c.code}</option>`).join("");
  $("#convFromCur").innerHTML = opts; $("#convToCur").innerHTML = opts;
  $("#convFromCur").value = "USD"; $("#convToCur").value = "THB";
  function convert() {
    const amt = parseFloat($("#convFrom").value.replace(/,/g, "")) || 0;
    const from = $("#convFromCur").value, to = $("#convToCur").value;
    const get = (code) => { const c = D.currencies.find((x) => x.code === code); if (!c) return null; const r = ratesFor(c); return { buyTT: r.buyTT / c.unit, sell: r.sell / c.unit }; };
    let thb, label;
    if (from === "THB") { thb = amt; label = "ซื้อ"; } else { const r = get(from); thb = amt * r.buyTT; label = "รับซื้อ (T.T.)"; }
    let out;
    if (to === "THB") out = thb; else { const r = get(to); out = thb / r.sell; label = from === "THB" ? "ขาย" : label + " → ขาย"; }
    $("#convTo").value = fmt(out, 2);
    $("#convMode").textContent = label;
    const one = from === to ? 1 : (to === "THB" ? (from === "THB" ? 1 : get(from).buyTT) : (from === "THB" ? 1 / get(to).sell : get(from).buyTT / get(to).sell));
    $("#convRate").textContent = `1 ${from} = ${one.toFixed(4)} ${to} · อัตรา ณ รอบ ${ROUNDS[state.round]} น.`;
  }
  ["input", "change"].forEach((ev) => { $("#convFrom").addEventListener(ev, convert); $("#convFromCur").addEventListener(ev, convert); $("#convToCur").addEventListener(ev, convert); });
  $("#convFrom").addEventListener("blur", (e) => { const v = parseFloat(e.target.value.replace(/,/g, "")); if (!isNaN(v)) e.target.value = fmt(v, v % 1 ? 2 : 0); });
  $("#convSwap").addEventListener("click", () => { const a = $("#convFromCur").value; $("#convFromCur").value = $("#convToCur").value; $("#convToCur").value = a; convert(); });

  /* Historical chart */
  let histData = [];
  function renderHist() {
    const c = D.currencies.find((x) => x.code === state.sel);
    const r = ratesFor(c);
    $("#histHead").innerHTML = `<span class="fx-flag">${c.flag}</span><div><strong>${c.code} / THB</strong><small>ย้อนหลัง · อัตราขาย</small></div>`;
    const n = state.days;
    const raw = series(hash(c.code) + n, n, 100, 0.008);
    const last = raw[raw.length - 1];
    histData = raw.map((v, i) => ({ v: (v / last) * r.sell, d: new Date(Date.now() - (n - 1 - i) * 864e5) }));
    const vals = histData.map((x) => x.v), min = Math.min(...vals), max = Math.max(...vals), pad = (max - min) * 0.15 || 0.1;
    const W = 320, H = 200, lo = min - pad, hi = max + pad;
    const X = (i) => (i / (n - 1)) * W, Y = (v) => H - ((v - lo) / (hi - lo)) * H;
    const d = histData.map((p, i) => (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(p.v).toFixed(1)).join(" ");
    const grid = [0.25, 0.5, 0.75].map((t) => `<line class="grid-line" x1="0" x2="${W}" y1="${H * t}" y2="${H * t}"/><text x="${W - 2}" y="${H * t - 4}" text-anchor="end">${(hi - (hi - lo) * t).toFixed(2)}</text>`).join("");
    $("#histChart").innerHTML = `<defs><linearGradient id="fxGrad" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#39a3ce" stop-opacity=".25"/><stop offset="1" stop-color="#39a3ce" stop-opacity="0"/></linearGradient></defs>${grid}<path class="area" d="${d} L${W} ${H} L0 ${H}Z"/><path class="line" d="${d}" vector-effect="non-scaling-stroke"/><line id="hLine" x1="0" x2="0" y1="0" y2="${H}" stroke="#0d1d2a" stroke-opacity=".25" stroke-dasharray="3 3" style="display:none" vector-effect="non-scaling-stroke"/><circle id="hDot" r="4" fill="#fff" stroke="#39a3ce" stroke-width="2" style="display:none" vector-effect="non-scaling-stroke"/>`;
    const first = vals[0], lastV = vals[vals.length - 1], ch = ((lastV - first) / first) * 100;
    $("#histStats").innerHTML = `<span>ต่ำสุด <strong class="t-num" style="color:var(--c-ink)">${min.toFixed(4)}</strong></span><span>สูงสุด <strong class="t-num" style="color:var(--c-ink)">${max.toFixed(4)}</strong></span><span>${chg(ch)}</span>`;
    histData.X = X; histData.Y = Y;
  }
  const wrap = $("#histWrap"), tip = $("#histTip");
  wrap.addEventListener("pointermove", (e) => {
    const svg = $("#histChart"), r = svg.getBoundingClientRect();
    const rel = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const i = Math.round(rel * (histData.length - 1)), p = histData[i]; if (!p) return;
    const x = histData.X(i), y = histData.Y(p.v);
    const hl = $("#hLine"), hd = $("#hDot");
    hl.setAttribute("x1", x); hl.setAttribute("x2", x); hl.style.display = ""; hd.setAttribute("cx", x); hd.setAttribute("cy", y); hd.style.display = "";
    tip.style.opacity = 1; tip.style.left = (x / 320) * r.width + "px"; tip.style.top = (y / 220) * r.height + "px";
    tip.textContent = `${p.d.toLocaleDateString("th-TH", { day: "numeric", month: "short" })} · ${p.v.toFixed(4)}`;
  });
  wrap.addEventListener("pointerleave", () => { tip.style.opacity = 0; const hl = $("#hLine"), hd = $("#hDot"); hl && (hl.style.display = "none"); hd && (hd.style.display = "none"); });
  $$("#histRange button").forEach((b, _, all) => b.addEventListener("click", () => { all.forEach((x) => x.classList.toggle("is-active", x === b)); state.days = +b.dataset.d; renderHist(); }));

  render();
})();
