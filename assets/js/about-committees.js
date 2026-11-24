/* LH Bank — About us / committees page renderer */
(function () {
  "use strict";
  const D = window.LH_ABOUT, L = window.LH;
  if (!D || !L) return;
  const { BOARD, COMMITTEES, SECRETARY, MANAGEMENT } = D;
  const by = Object.fromEntries(BOARD.map((b) => [b.slug, b]));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const TABS = [...COMMITTEES.map((c) => ({ id: c.id, label: c.short })), { id: "secretary", label: "เลขานุการธนาคาร" }, { id: "management", label: "ผู้บริหารระดับสูง" }];
  const tabsEl = document.getElementById("cmTabs"), panel = document.getElementById("cmPanel");

  const initials = (n) => n.replace(/^(นางสาว|นาย|นาง|ศาสตราจารย์พิเศษ)\s*/, "").charAt(0);

  function card(slug, role) {
    const b = by[slug];
    const lead = role && /ประธาน/.test(role) ? " person-card--lead" : (b.lead ? " person-card--lead" : "");
    return `<li><button type="button" class="person-card${lead}" data-bio="${b.slug}" aria-haspopup="dialog">
      <span class="person-card__photo"><img src="${b.photo}" alt="" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('b'),{textContent:'${initials(b.name)}'}))"></span>
      <span class="person-card__body"><strong>${esc(b.name)}</strong><span>${esc(role || b.rank)}</span><em class="person-card__more">ดูประวัติ ${L.icon("arrow-right")}</em></span></button></li>`;
  }

  function committeePanel(c) {
    const cnt = c.id === "board" ? `<p class="t-sm t-muted">${c.members.length} ท่าน · กรรมการอิสระ 4 ท่าน</p>` : `<p class="t-sm t-muted">${c.members.length} ท่าน</p>`;
    return `<div class="cm-head"><h2 class="about-h2" style="margin:0">${esc(c.name)}</h2>${cnt}</div>
      <ul class="person-grid" role="list">${c.members.map(([s, r]) => card(s, c.id === "board" ? null : r)).join("")}</ul>
      <div class="duty-box"><h2 class="about-h2">ขอบเขตอำนาจหน้าที่</h2><p class="t-muted">${esc(c.intro)}</p>
      <ol class="duty-list">${c.duties.map((d) => `<li>${esc(d)}</li>`).join("")}</ol>
      <p class="t-xs t-muted mt-6">${c.id === "board" ? "สรุปจากข้อมูลบนเว็บไซต์ lhbank.co.th" : "ข้อมูลสมาชิกอ้างอิง lhbank.co.th · ขอบเขตหน้าที่เป็นการสรุปโดยย่อ ฉบับเต็มดูในกฎบัตรของคณะกรรมการ"}</p></div>`;
  }

  function secretaryPanel() {
    const s = SECRETARY;
    return `<div class="cm-head"><h2 class="about-h2" style="margin:0">เลขานุการธนาคาร</h2></div>
      <div class="duty-box"><h2 class="about-h2">${esc(s.title)}</h2><p class="t-muted">${esc(s.intro)}</p>
      <ol class="sec-list">${s.duties.map(([t, pts]) => `<li><strong>${esc(t)}</strong><ul>${pts.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></li>`).join("")}</ol></div>`;
  }

  function managementPanel() {
    return `<div class="cm-head"><h2 class="about-h2" style="margin:0">ผู้บริหารระดับสูง</h2><p class="t-sm t-muted">${MANAGEMENT.length} ท่าน</p></div>
      <div class="mg-table" role="table" aria-label="ผู้บริหารระดับสูง"><div class="mg-row mg-row--head" role="row"><span role="columnheader">ชื่อ-สกุล</span><span role="columnheader">ตำแหน่ง</span></div>
      ${MANAGEMENT.map(([n, r, slug], i) => `<div class="mg-row" role="row"><span role="cell" class="mg-name"><i class="t-num">${i + 1}</i>${slug ? `<button type="button" class="link-btn" data-bio="${slug}">${esc(n)}</button>` : esc(n)}</span><span role="cell">${esc(r)}</span></div>`).join("")}</div>`;
  }

  function show(id, push) {
    const t = TABS.find((x) => x.id === id) || TABS[0];
    tabsEl.innerHTML = TABS.map((x) => `<button type="button" role="tab" class="cm-tab${x.id === t.id ? " is-active" : ""}" data-tab="${x.id}" aria-selected="${x.id === t.id}">${esc(x.label)}</button>`).join("");
    const c = COMMITTEES.find((x) => x.id === t.id);
    panel.innerHTML = c ? committeePanel(c) : t.id === "secretary" ? secretaryPanel() : managementPanel();
    L.icon && panel.querySelectorAll("[data-icon]").forEach((e) => (e.outerHTML = L.icon(e.dataset.icon)));
    if (push) history.replaceState(null, "", "#" + t.id);
    const a = tabsEl.querySelector(".is-active");
    if (a) tabsEl.scrollLeft = a.offsetLeft - (tabsEl.clientWidth - a.offsetWidth) / 2;
  }

  /* Bio modal */
  const modal = document.createElement("div");
  modal.className = "modal modal--wide"; modal.id = "bioModal"; modal.setAttribute("role", "dialog"); modal.setAttribute("aria-modal", "true"); modal.setAttribute("aria-labelledby", "bioName");
  modal.innerHTML = `<div class="modal__backdrop"></div><div class="modal__dialog bio"><button class="icon-btn modal__close" data-close-modal aria-label="ปิด">${L.icon("close")}</button><div id="bioBody"></div></div>`;
  document.body.appendChild(modal);

  function bio(slug) {
    const b = by[slug]; if (!b) return;
    const sec = (title, inner, open) => `<details class="bio-sec"${open ? " open" : ""}><summary>${title}</summary><div class="bio-sec__body">${inner}</div></details>`;
    const edu = `<ul class="bio-list">${b.edu.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>`;
    const exp = b.exp.map(([label, rows]) => `<p class="bio-sub">${esc(label)}</p><div class="bio-table">${rows.map((r) => `<div class="bio-tr"><span class="bio-date">${esc(r[0])}</span><span>${esc(r[1])}</span><span class="t-muted">${esc(r[2])}</span></div>`).join("")}</div>`).join("");
    const sh = `<ul class="bio-list">${b.share.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>`;
    document.getElementById("bioBody").innerHTML = `<div class="bio-head"><span class="bio-photo"><img src="${b.photo}" alt="${esc(b.name)}"></span><div><p class="t-xs t-muted">คณะกรรมการธนาคาร</p><h3 id="bioName">${esc(b.name)}</h3><p class="bio-rank">${esc(b.rank)}</p><p class="t-sm t-muted">อายุ ${b.age} ปี</p></div></div>
      ${sec("คุณวุฒิทางการศึกษา", edu, true)}${sec("ประสบการณ์ทำงาน", exp, true)}${sec("การถือหุ้น", sh, false)}`;
    L.openModal("bioModal");
    modal.querySelector(".modal__dialog").scrollTop = 0;
  }

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-tab]"); if (t) { show(t.dataset.tab, true); return; }
    const b = e.target.closest("[data-bio]"); if (b) bio(b.dataset.bio);
  });
  window.addEventListener("hashchange", () => show(location.hash.slice(1)));
  show(location.hash.slice(1));
})();
