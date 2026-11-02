/* LH Bank Revamp 2027 — shared layout + UI behaviors
   Renders header (utility bar, nav, mega menu), mobile nav, search overlay,
   footer, prototype navigator; wires tabs, accordions, dropdowns, modals,
   reveal-on-scroll and toasts. Every page includes this file. */
(function () {
  "use strict";

  const body = document.body;
  const ROOT = body.dataset.root || "";
  const SEGMENT = body.dataset.segment || "personal";
  const NAV = body.dataset.nav || "";
  const PAGE = body.dataset.page || "";
  const url = (p) => ROOT + p;

  /* ---------- Icons (24px stroke set) ---------- */
  const P = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    "arrow-right": '<path d="M5 12h14M13 6l6 6-6 6"/>',
    "arrow-left": '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    "arrow-up-right": '<path d="M7 17 17 7M8 7h9v9"/>',
    "chevron-down": '<path d="m6 9 6 6 6-6"/>',
    "chevron-right": '<path d="m9 6 6 6-6 6"/>',
    "chevron-left": '<path d="m15 6-6 6 6 6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    home: '<path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z"/>',
    wallet: '<path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3"/><path d="M4 7.5V18a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1H6.5A2.5 2.5 0 0 1 4 7.5Z"/><circle cx="16" cy="14.5" r="1.2"/>',
    card: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3 10h18M7 15h3"/>',
    chart: '<path d="M4 19h16"/><path d="m5 15 4.5-4.5 3.5 3L19 7"/><path d="M15 7h4v4"/>',
    pie: '<path d="M12 3v9l7.8 4.5A9 9 0 1 1 12 3Z"/><path d="M15 3.5a9 9 0 0 1 5.6 9.5H15z"/>',
    shield: '<path d="M12 3 5 6v5.5c0 4.4 3 8 7 9.5 4-1.5 7-5.1 7-9.5V6z"/><path d="m9 12 2 2 4-4"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    phone: '<path d="M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5L16 14l4 1.5V19a1.5 1.5 0 0 1-1.5 1.5C10.5 20.5 3.5 13.5 3.5 5.5A1.5 1.5 0 0 1 5 4Z"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5Z"/>',
    calc: '<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M8.5 7h7M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01M8.5 15h.01M12 15h.01M15.5 15v2.5M8.5 18h.01M12 18h.01"/>',
    user: '<circle cx="12" cy="8" r="3.8"/><path d="M4.5 20c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5"/>',
    users: '<circle cx="9" cy="8.5" r="3.3"/><path d="M3 19.5c.9-3.1 3.2-4.8 6-4.8s5.1 1.7 6 4.8"/><path d="M15.5 5.5a3.3 3.3 0 0 1 0 6.3M17.5 14.9c1.7.6 2.9 2.1 3.5 4.6"/>',
    building: '<path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16"/><path d="M15 9h4a1 1 0 0 1 1 1v11M3 21h18M8 8h3M8 12h3M8 16h3"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18"/>',
    store: '<path d="M4 9.5 5.5 4h13L20 9.5"/><path d="M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0"/><path d="M5 11.5V20h14v-8.5M10 20v-5h4v5"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    sliders: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
    map: '<path d="m9 5-5 2v13l5-2 6 2 5-2V5l-5 2z"/><path d="M9 5v13M15 7v13"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
    star: '<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
    download: '<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>',
    swap: '<path d="M7 4 4 7l3 3M4 7h13M17 20l3-3-3-3M20 17H7"/>',
    sparkle: '<path d="M12 3c.7 4.3 2.7 6.3 7 7-4.3.7-6.3 2.7-7 7-.7-4.3-2.7-6.3-7-7 4.3-.7 6.3-2.7 7-7Z"/><path d="M19 15.5c.3 1.6 1 2.3 2.5 2.5-1.5.3-2.2 1-2.5 2.5-.3-1.5-1-2.2-2.5-2.5 1.5-.2 2.2-.9 2.5-2.5Z"/>',
    piggy: '<path d="M19 10.5c.7.4 1.5.4 2 0M5 11a7 6 0 0 1 12.2-3.5L20 7v4l-1 .6a6.5 6.5 0 0 1-2 3.4V19h-3v-2h-3v2H8v-3.2A6 6 0 0 1 5 11Z"/><path d="M8 7.5c1.2-.6 2.6-.6 3.8 0"/><circle cx="15" cy="10" r=".6"/>',
    doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>',
    percent: '<path d="M19 5 5 19"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 8-8M16 7l2 2M14 9l1.5 1.5"/>',
    gift: '<rect x="4" y="9" width="16" height="11" rx="1.5"/><path d="M3 9h18v3H3zM12 9v11M12 9S10.5 4 8 4.5 7.5 9 12 9ZM12 9s1.5-5 4-4.5S16.5 9 12 9Z"/>',
    plane: '<path d="M10.5 13.5 4 11l1.5-1.5 7 1L16 7a2 2 0 0 1 3 3l-3.5 3.5 1 7L15 22l-2.5-6.5L9 19v2l-1.5 1-1-3.5L3 17.5l1-1.5h2z"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    leaf: '<path d="M5 19c0-8 5-13 15-14-1 10-6 15-14 15"/><path d="M5 19c3-4 6-6.5 10-8.5"/>',
    mobile: '<rect x="6.5" y="3" width="11" height="18" rx="2.5"/><path d="M11 18h2"/>',
    headset: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3.5" y="13.5" width="4" height="6" rx="1.5"/><rect x="16.5" y="13.5" width="4" height="6" rx="1.5"/><path d="M18.5 19.5c0 1-1.5 1.5-4 1.5"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".8"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    locate: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22"/>',
    share: '<circle cx="6" cy="12" r="2.5"/><circle cx="17" cy="6" r="2.5"/><circle cx="17" cy="18" r="2.5"/><path d="m8.2 10.8 6.6-3.6M8.2 13.2l6.6 3.6"/>',
    car: '<path d="M5 16.5V12l2-5h10l2 5v4.5"/><path d="M4 12h16v4.5H4z"/><circle cx="7.5" cy="16.5" r="1.5"/><circle cx="16.5" cy="16.5" r="1.5"/>',
    coins: '<ellipse cx="9" cy="7" rx="5" ry="2.5"/><path d="M4 7v4c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V7"/><path d="M10 15.5c.6 1.2 2.8 2 5 2 2.8 0 5-1.1 5-2.5v-4c0-1.4-2.2-2.5-5-2.5"/>',
    bolt: '<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
    accessible: '<circle cx="12" cy="5" r="1.8"/><path d="M6 9h12M12 9v5l-3 6M12 14l3 6"/>',
    qr: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2"/>',
  };
  const icon = (name, cls = "") =>
    `<svg class="ico i-${name} ${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[name] || P.info}</svg>`;

  /* ---------- Helpers ---------- */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const fmt = (n, d = 0) =>
    Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  const img = (src, alt = "", extra = "") =>
    `<img src="${src}" alt="${alt}" loading="lazy" ${extra}>`;
  const U = (id, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;

  /* ---------- Navigation model ---------- */
  const SEGMENTS = [
    { id: "personal", th: "บุคคล", href: "personal/" },
    { id: "sme", th: "SME", href: "sme/" },
    { id: "business", th: "ธุรกิจ", href: "business/" },
  ];

  const MENUS = {
    personal: [
      {
        id: "deposit", label: "บัญชีเงินฝาก",
        cols: [
          { h: "ประเภทบัญชี", items: [
            ["piggy", "ออมทรัพย์", "ดอกเบี้ยสูง ถอนได้ทุกเมื่อ", "personal/products/?cat=deposit"],
            ["calendar", "ฝากประจำ", "ล็อกผลตอบแทนตามระยะเวลา", "personal/products/?cat=deposit"],
            ["shield", "ฝากประจำปลอดภาษี", "ออมสม่ำเสมอ 24 เดือน", "personal/product/?id=tax-free-24"],
          ]},
          { h: "เงินตราต่างประเทศ", items: [
            ["globe", "บัญชี FCD", "ฝาก-ถอน 9 สกุลเงินหลัก", "personal/product/?id=fcd"],
            ["swap", "อัตราแลกเปลี่ยน", "อัปเดตแบบเรียลไทม์", "exchange-rates/"],
          ]},
        ],
        feature: { img: "photo-1579621970563-ebec7560ff3e", tag: "ดอกเบี้ยพิเศษ", title: "ออมทรัพย์ดิจิทัล รับดอกเบี้ยสูงสุด 1.80% ต่อปี", href: "personal/product/?id=smart-savings" },
      },
      {
        id: "loans", label: "สินเชื่อ",
        cols: [
          { h: "สินเชื่อบ้าน", items: [
            ["home", "สินเชื่อบ้าน แสนสบาย", "ผ่อนสบาย ดอกเบี้ยคงที่ 3 ปีแรก", "personal/product/?id=saen-sabai"],
            ["key", "Happy Home", "สำหรับบ้านหลังแรก", "personal/product/?id=happy-home"],
            ["swap", "รีไฟแนนซ์บ้าน", "ลดภาระค่างวดต่อเดือน", "personal/product/?id=refinance"],
          ]},
          { h: "สินเชื่ออื่นๆ", items: [
            ["coins", "บ้านแลกเงิน", "ใช้บ้านค้ำ วงเงินสูง", "personal/product/?id=home-for-cash"],
            ["wallet", "สินเชื่อส่วนบุคคล", "อนุมัติไว ไม่ต้องมีหลักประกัน", "personal/product/?id=personal-loan"],
            ["calc", "คำนวณสินเชื่อบ้าน", "ประเมินค่างวดและวงเงิน", "personal/calculator/home-loan/"],
          ]},
        ],
        feature: { img: "photo-1600585154340-be6161a56a0c", tag: "ดอกเบี้ยเริ่มต้น 2.75%", title: "บ้านที่ใช่ กับสินเชื่อที่ออกแบบมาเพื่อคุณ", href: "personal/products/?cat=home-loan" },
      },
      {
        id: "cards", label: "บัตร",
        cols: [
          { h: "บัตรเครดิต", items: [
            ["card", "LH Bank Wealth Card", "สิทธิพิเศษไลฟ์สไตล์ระดับพรีเมียม", "personal/product/?id=wealth-card"],
            ["plane", "LH Bank Travel Card", "สะสมไมล์ทุกการใช้จ่าย", "personal/product/?id=travel-card"],
          ]},
          { h: "บัตรเดบิต", items: [
            ["lock", "บัตรเดบิต Smart", "ประกันอุบัติเหตุในตัว", "personal/product/?id=debit-smart"],
          ]},
        ],
        feature: { img: "photo-1556742049-0cfed4f6a45d", tag: "สมาชิกใหม่", title: "รับเครดิตเงินคืน 10% สำหรับการใช้จ่ายครั้งแรก", href: "personal/products/?cat=card" },
      },
      {
        id: "invest", label: "การลงทุน",
        cols: [
          { h: "ผลิตภัณฑ์", items: [
            ["pie", "กองทุนรวม", "คัดสรรกว่า 200 กองทุน", "personal/investments/#funds"],
            ["layers", "หุ้นกู้", "ผลตอบแทนคงที่ สม่ำเสมอ", "personal/investments/#categories"],
            ["shield", "ประกันชีวิตและสุขภาพ", "วางแผนคุ้มครองครอบครัว", "personal/investments/#categories"],
          ]},
          { h: "ที่ปรึกษา", items: [
            ["target", "ประเมินความเสี่ยง", "รู้จักสไตล์การลงทุนของคุณ", "personal/investments/#advisory"],
            ["headset", "นัดหมายผู้เชี่ยวชาญ", "Wealth Advisor ส่วนตัว", "personal/investments/#advisory"],
          ]},
        ],
        feature: { img: "photo-1611974789855-9c2a0a7236a3", tag: "Market Insight", title: "มุมมองการลงทุนไตรมาสที่ 1 / 2027", href: "personal/investments/" },
      },
      {
        id: "services", label: "บริการ",
        cols: [
          { h: "ดิจิทัล", items: [
            ["mobile", "LH Bank Mobile", "ทำธุรกรรมได้ทุกที่", "personal/#app"],
            ["globe", "โอนเงินต่างประเทศ", "รวดเร็ว ค่าธรรมเนียมโปร่งใส", "exchange-rates/"],
          ]},
          { h: "ข้อมูลและช่องทาง", items: [
            ["swap", "อัตราแลกเปลี่ยน", "ซื้อ-ขาย และย้อนหลัง", "exchange-rates/"],
            ["pin", "ค้นหาสาขา", "สาขาและศูนย์ธุรกิจ", "branch-locations/"],
            ["percent", "อัตราดอกเบี้ยและค่าธรรมเนียม", "ข้อมูลล่าสุด", "personal/products/"],
          ]},
        ],
        feature: { img: "photo-1563986768609-322da13575f3", tag: "แอปใหม่", title: "จัดการทุกบัญชีในแอปเดียว ปลอดภัยด้วย Biometrics", href: "personal/#app" },
      },
    ],
  };
  MENUS.sme = [
    { id: "sme-loans", label: "สินเชื่อธุรกิจ", cols: [
      { h: "สินเชื่อ SME", items: [
        ["store", "สินเชื่อ SME เริ่มต้นธุรกิจ", "สำหรับกิจการ 1 ปีขึ้นไป", "personal/product/?id=sme-start"],
        ["building", "สินเชื่อ SME ขยายกิจการ", "วงเงินสูงสุด 50 ล้านบาท", "personal/product/?id=sme-growth"],
      ]},
      { h: "เครื่องมือ", items: [
        ["calc", "คำนวณสินเชื่อ", "ประเมินค่างวด", "personal/calculator/home-loan/"],
        ["grid", "ผลิตภัณฑ์ทั้งหมด", "SME Banking", "personal/products/?cat=sme"],
      ]},
    ], feature: { img: "photo-1517248135467-4c7edcad34c4", tag: "SME", title: "ทุนหมุนเวียนสำหรับธุรกิจที่กำลังเติบโต", href: "personal/products/?cat=sme" } },
    { id: "sme-dep", label: "บัญชีธุรกิจ", cols: [
      { h: "บัญชี", items: [["wallet", "บัญชีกระแสรายวัน", "บริหารสภาพคล่อง", "personal/products/?cat=sme"], ["piggy", "ออมทรัพย์ธุรกิจ", "ดอกเบี้ยพิเศษ", "personal/products/?cat=sme"]] },
      { h: "บริการ", items: [["globe", "การค้าระหว่างประเทศ", "L/C, T/R", "business/"], ["swap", "อัตราแลกเปลี่ยน", "อัปเดตเรียลไทม์", "exchange-rates/"]] },
    ], feature: { img: "photo-1556761175-5973dc0f32e7", tag: "Business Account", title: "บัญชีเดียว จัดการธุรกิจได้ครบ", href: "personal/products/?cat=sme" } },
    { id: "sme-help", label: "ที่ปรึกษาธุรกิจ", cols: [
      { h: "บริการ", items: [["headset", "นัดหมาย RM", "ผู้ดูแลธุรกิจส่วนตัว", "sme/#advisory"], ["pin", "ศูนย์ธุรกิจ SME", "ใกล้คุณ", "branch-locations/?type=sme"]] },
    ], feature: null },
  ];
  MENUS.business = [
    { id: "biz-fin", label: "สินเชื่อองค์กร", cols: [
      { h: "สินเชื่อ", items: [["building", "สินเชื่อโครงการ", "Project Finance", "personal/product/?id=project-finance"], ["briefcase", "สินเชื่อระยะยาว", "Term Loan", "personal/products/?cat=business"]] },
    ], feature: { img: "photo-1486406146926-c627a92ad1ab", tag: "Corporate", title: "พันธมิตรทางการเงินสำหรับองค์กรชั้นนำ", href: "personal/products/?cat=business" } },
    { id: "biz-cash", label: "Cash Management", cols: [
      { h: "บริการ", items: [["layers", "Cash Management", "บริหารเงินสดองค์กร", "personal/product/?id=cash-management"], ["globe", "Trade Finance", "การค้าระหว่างประเทศ", "personal/products/?cat=business"]] },
    ], feature: null },
  ];

  /* ---------- Header ---------- */
  function renderHeader() {
    const el = $("#site-header");
    if (!el) return;
    const menus = MENUS[SEGMENT] || MENUS.personal;
    const navItems = menus.map((m) => `
      <li class="nav__item" data-menu="${m.id}">
        <button class="nav__link ${NAV === m.id ? "is-current" : ""}" aria-expanded="false" aria-controls="mega-${m.id}">${m.label}${icon("chevron-down")}</button>
        <div class="mega" id="mega-${m.id}" role="region" aria-label="${m.label}">
          <div class="container mega__inner" style="${m.feature ? "" : "grid-template-columns: repeat(3, 1fr)"}">
            ${m.cols.map((c) => `
              <div class="mega__col"><h6>${c.h}</h6><ul>
                ${c.items.map(([ic, t, d, h]) => `<li><a class="mega__link" href="${url(h)}">${icon(ic)}<div><strong>${t}</strong><span>${d}</span></div></a></li>`).join("")}
              </ul></div>`).join("")}
            ${m.feature ? `<a class="mega__feature" style="${m.cols.length < 3 ? "grid-column: span " + (4 - m.cols.length) : ""}" href="${url(m.feature.href)}">${img(U(m.feature.img, 700))}<span class="badge badge--glass">${m.feature.tag}</span><h5>${m.feature.title}</h5><span class="link" style="color:#fff">ดูรายละเอียด ${icon("arrow-right")}</span></a>` : ""}
          </div>
        </div>
      </li>`).join("");

    el.outerHTML = `
      <a class="skip-link" href="#main">ข้ามไปยังเนื้อหา</a>
      <div class="utility">
        <div class="container">
          <nav class="utility__segments" aria-label="กลุ่มลูกค้า">
            ${SEGMENTS.map((s) => `<a href="${url(s.href)}" class="${s.id === SEGMENT ? "is-active" : ""}">${s.th}</a>`).join("")}
          </nav>
          <div class="utility__links">
            <a href="${url("exchange-rates/")}" class="hide-tablet">${icon("swap")}อัตราแลกเปลี่ยน</a>
            <a href="${url("branch-locations/")}" class="hide-tablet">${icon("pin")}ค้นหาสาขา</a>
            <a href="tel:1327">${icon("phone")}1327</a>
            <div class="lang" role="group" aria-label="ภาษา"><button class="is-active">TH</button><button data-toast="English version — available in full build">EN</button></div>
          </div>
        </div>
      </div>
      <header class="site-header" id="siteHeader">
        <div class="container site-header__bar">
          <a class="logo" href="${url(SEGMENT === "personal" ? "personal/" : SEGMENT + "/")}" aria-label="LH Bank หน้าแรก">
            <span class="logo__mark">LH</span>
            <span class="logo__text">LH Bank<small>${SEGMENT === "personal" ? "Personal" : SEGMENT === "sme" ? "SME Banking" : "Business"}</small></span>
          </a>
          <nav aria-label="เมนูหลัก" style="height:100%;flex:1;display:flex"><ul class="nav" role="list" style="margin:0;padding:0">${navItems}</ul></nav>
          <div class="header-actions">
            <button class="icon-btn" data-open-search aria-label="ค้นหา">${icon("search")}</button>
            <a class="btn btn--secondary btn--sm hide-tablet" href="#" data-toast="เข้าสู่ระบบ LH Bank Online — ใช้ระบบเดิม">${icon("user")}เข้าสู่ระบบ</a>
            <a class="btn btn--primary btn--sm" href="${url("personal/product/?id=smart-savings")}">เปิดบัญชี</a>
            <button class="icon-btn menu-toggle" data-open-menu aria-label="เปิดเมนู" aria-expanded="false">${icon("menu")}</button>
          </div>
        </div>
      </header>
      <div class="mega-overlay" id="megaOverlay"></div>
      ${renderMobileNav(menus)}
      ${renderSearch()}`;
  }

  function renderMobileNav(menus) {
    return `
      <div class="mobile-nav" id="mobileNav" role="dialog" aria-modal="true" aria-label="เมนู">
        <div class="mobile-nav__head">
          <a class="logo" href="${url("personal/")}"><span class="logo__mark">LH</span><span class="logo__text">LH Bank</span></a>
          <div class="row" style="gap:4px">
            <button class="icon-btn" data-open-search aria-label="ค้นหา">${icon("search")}</button>
            <button class="icon-btn" data-close-menu aria-label="ปิดเมนู">${icon("close")}</button>
          </div>
        </div>
        <div class="mobile-nav__body">
          <div class="segmented mobile-nav__segments">
            ${SEGMENTS.map((s) => `<a href="${url(s.href)}" style="display:inline-flex;align-items:center;height:40px;border-radius:999px;font-size:.875rem;font-weight:500;${s.id === SEGMENT ? "background:#fff;box-shadow:var(--sh-1)" : "color:var(--c-muted)"}">${s.th}</a>`).join("")}
          </div>
          <div class="accordion" data-accordion data-single>
            ${menus.map((m) => `
              <div class="acc-item">
                <button class="acc-trigger" aria-expanded="false">${m.label}<span class="acc-icon"></span></button>
                <div class="acc-panel"><div><div class="mobile-nav__links">
                  ${m.cols.flatMap((c) => c.items).map(([ic, t, , h]) => `<a href="${url(h)}">${icon(ic)}${t}</a>`).join("")}
                </div></div></div>
              </div>`).join("")}
          </div>
          <div class="mobile-nav__quick">
            <a href="${url("personal/calculator/home-loan/")}">${icon("calc")}คำนวณสินเชื่อ</a>
            <a href="${url("exchange-rates/")}">${icon("swap")}อัตราแลกเปลี่ยน</a>
            <a href="${url("branch-locations/")}">${icon("pin")}ค้นหาสาขา</a>
            <a href="tel:1327">${icon("headset")}ติดต่อ 1327</a>
          </div>
        </div>
        <div class="mobile-nav__foot">
          <a class="btn btn--secondary" href="#" data-toast="เข้าสู่ระบบ LH Bank Online — ใช้ระบบเดิม">เข้าสู่ระบบ</a>
          <a class="btn btn--primary" href="${url("personal/product/?id=smart-savings")}">เปิดบัญชี</a>
        </div>
      </div>`;
  }

  function renderSearch() {
    return `
      <div class="search-overlay" id="searchOverlay" role="dialog" aria-modal="true" aria-label="ค้นหา">
        <div class="container container--narrow search-overlay__inner">
          <div class="row row--between mb-6">
            <span class="eyebrow">ค้นหาผลิตภัณฑ์และบริการ</span>
            <button class="icon-btn" data-close-search aria-label="ปิด">${icon("close")}</button>
          </div>
          <div class="search" id="globalSearch">
            ${icon("search")}
            <input class="input" type="search" placeholder="เช่น สินเชื่อบ้าน, ฝากประจำ, อัตราแลกเปลี่ยน" aria-label="ค้นหา" autocomplete="off">
            <button class="search__clear" aria-label="ล้าง">${icon("close")}</button>
          </div>
          <div class="chips mt-6" id="searchSuggest">
            ${["สินเชื่อบ้าน", "ฝากประจำ", "คำนวณค่างวด", "อัตราแลกเปลี่ยน", "สาขาใกล้ฉัน", "กองทุนรวม"].map((s) => `<button class="chip" data-q="${s}">${s}</button>`).join("")}
          </div>
          <div class="search-results" id="searchResults"></div>
        </div>
      </div>`;
  }

  /* ---------- Footer ---------- */
  function renderFooter() {
    const el = $("#site-footer");
    if (!el) return;
    const cols = [
      ["ผลิตภัณฑ์", [["บัญชีเงินฝาก", "personal/products/?cat=deposit"], ["สินเชื่อบ้าน", "personal/products/?cat=home-loan"], ["สินเชื่อส่วนบุคคล", "personal/products/?cat=personal-loan"], ["บัตรเครดิต", "personal/products/?cat=card"], ["การลงทุน", "personal/investments/"]]],
      ["ธุรกิจ", [["SME Banking", "sme/"], ["Business Banking", "business/"], ["สินเชื่อ SME", "personal/products/?cat=sme"], ["Cash Management", "personal/product/?id=cash-management"]]],
      ["เครื่องมือ", [["คำนวณสินเชื่อบ้าน", "personal/calculator/home-loan/"], ["อัตราแลกเปลี่ยน", "exchange-rates/"], ["ค้นหาสาขา", "branch-locations/"], ["Design System", "design-system/"]]],
      ["เกี่ยวกับเรา", [["ข้อมูลธนาคาร", "#"], ["นักลงทุนสัมพันธ์", "#"], ["ร่วมงานกับเรา", "#"], ["ข่าวสารและกิจกรรม", "#"]]],
    ];
    el.outerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-top">
            <div class="footer-brand">
              <a class="logo logo--light" href="${url("personal/")}"><span class="logo__mark">LH</span><span class="logo__text">LH Bank<small>Land and Houses Bank</small></span></a>
              <p>ที่ปรึกษาทางการเงินที่อยู่เคียงข้างทุกเป้าหมายในชีวิต ด้วยความมั่นคงและความใส่ใจในทุกรายละเอียด</p>
              <a class="footer-contact" href="tel:1327">${icon("headset")}<div><span class="t-xs" style="opacity:.6">LH Bank Contact Center</span><div class="t-num">1327</div></div></a>
            </div>
            ${cols.map(([h, ls]) => `<div><h6>${h}</h6><ul>${ls.map(([t, hr]) => `<li><a href="${hr === "#" ? "#" : url(hr)}">${t}</a></li>`).join("")}</ul></div>`).join("")}
          </div>
          <div class="footer-bottom">
            <span>© 2027 Land and Houses Bank Public Company Limited. Prototype for bid presentation.</span>
            <nav><a href="#">นโยบายความเป็นส่วนตัว</a><a href="#">ข้อกำหนดการใช้งาน</a><a href="#">นโยบายคุกกี้</a><a href="#">แจ้งเบาะแส</a></nav>
            <div class="social"><a href="#" aria-label="Facebook">f</a><a href="#" aria-label="LINE">L</a><a href="#" aria-label="YouTube">▶</a><a href="#" aria-label="Instagram">◎</a></div>
          </div>
        </div>
      </footer>
      ${renderProtoNav()}`;
  }

  function renderProtoNav() {
    const pages = [
      ["P0", "1. Personal Landing", "personal/", "personal"],
      ["P0", "2. Product Listing", "personal/products/?cat=home-loan", "listing"],
      ["P0", "3. Product Detail", "personal/product/?id=saen-sabai", "detail"],
      ["P0", "4. Loan Calculator", "personal/calculator/home-loan/", "calculator"],
      ["P1", "5. Investment Landing", "personal/investments/", "investments"],
      ["P1", "6. Branch Locator", "branch-locations/", "branches"],
      ["P1", "7. Exchange Rates", "exchange-rates/", "rates"],
    ];
    const extras = [
      ["Variant", "SME Landing", "sme/", "sme"],
      ["Variant", "Business Landing", "business/", "business"],
      ["DS", "Design System", "design-system/", "design-system"],
    ];
    const link = ([tag, t, h, id]) => `<a href="${url(h)}" class="${PAGE === id ? "is-current" : ""}">${t}<span>${tag}</span></a>`;
    return `
      <div class="proto-nav" id="protoNav">
        <div class="proto-nav__panel">
          <h6>Bid Prototype — 7 Pages</h6>${pages.map(link).join("")}
          <h6>Templates &amp; System</h6>${extras.map(link).join("")}
        </div>
        <button class="proto-nav__btn" aria-expanded="false">${icon("grid")}<span>Prototype Map</span></button>
      </div>`;
  }

  /* ---------- Behaviors ---------- */
  function lockScroll(on) { body.classList.toggle("is-locked", on); }

  function initHeader() {
    const header = $("#siteHeader");
    if (header) {
      const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    // Mega menu (hover on desktop with intent delay, click/keyboard everywhere)
    const items = $$(".nav__item");
    const overlay = $("#megaOverlay");
    let closeT;
    const closeAll = () => {
      items.forEach((i) => { i.classList.remove("is-open"); $(".nav__link", i).setAttribute("aria-expanded", "false"); });
      overlay && overlay.classList.remove("is-on");
    };
    const open = (item) => {
      clearTimeout(closeT);
      items.forEach((i) => i !== item && i.classList.remove("is-open"));
      item.classList.add("is-open");
      $(".nav__link", item).setAttribute("aria-expanded", "true");
      overlay && overlay.classList.add("is-on");
    };
    items.forEach((item) => {
      const btn = $(".nav__link", item);
      item.addEventListener("mouseenter", () => { if (matchMedia("(hover:hover)").matches) open(item); });
      item.addEventListener("mouseleave", () => { closeT = setTimeout(closeAll, 140); });
      btn.addEventListener("click", () => (item.classList.contains("is-open") ? closeAll() : open(item)));
    });
    overlay && overlay.addEventListener("click", closeAll);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeAll(); closeMenu(); closeSearch(); closeModals(); } });

    // Mobile nav
    const mnav = $("#mobileNav");
    const openMenu = () => { mnav.classList.add("is-open"); lockScroll(true); $$("[data-open-menu]").forEach((b) => b.setAttribute("aria-expanded", "true")); };
    function closeMenu() { if (!mnav) return; mnav.classList.remove("is-open"); if (!$(".search-overlay.is-open")) lockScroll(false); $$("[data-open-menu]").forEach((b) => b.setAttribute("aria-expanded", "false")); }
    $$("[data-open-menu]").forEach((b) => b.addEventListener("click", openMenu));
    $$("[data-close-menu]").forEach((b) => b.addEventListener("click", closeMenu));

    // Search overlay
    const so = $("#searchOverlay");
    const input = so && $("input", so);
    const openSearch = () => { so.classList.add("is-open"); lockScroll(true); setTimeout(() => input.focus(), 60); runSearch(""); };
    function closeSearch() { if (!so) return; so.classList.remove("is-open"); if (!$(".mobile-nav.is-open")) lockScroll(false); }
    $$("[data-open-search]").forEach((b) => b.addEventListener("click", openSearch));
    $$("[data-close-search]").forEach((b) => b.addEventListener("click", closeSearch));
    if (so) {
      input.addEventListener("input", () => runSearch(input.value));
      $(".search__clear", so).addEventListener("click", () => { input.value = ""; runSearch(""); input.focus(); });
      $$("[data-q]", so).forEach((c) => c.addEventListener("click", () => { input.value = c.dataset.q; runSearch(c.dataset.q); }));
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { const first = $(".search-result", so); if (first) location.href = first.href; }
      });
    }
    window.LH && (window.LH.closeMenu = closeMenu);
  }

  function searchIndex() {
    const D = window.LHDATA;
    const idx = [
      { t: "คำนวณสินเชื่อบ้าน", s: "เครื่องมือ · ค่างวด วงเงินกู้", h: "personal/calculator/home-loan/", ic: "calc", k: "คำนวณค่างวด calculator ผ่อน" },
      { t: "อัตราแลกเปลี่ยน", s: "บริการ · USD EUR JPY", h: "exchange-rates/", ic: "swap", k: "exchange rate fx ค่าเงิน" },
      { t: "ค้นหาสาขา", s: "บริการ · สาขาและศูนย์ธุรกิจ", h: "branch-locations/", ic: "pin", k: "branch สาขาใกล้ฉัน atm" },
      { t: "การลงทุน", s: "กองทุนรวม หุ้นกู้ ประกัน", h: "personal/investments/", ic: "pie", k: "กองทุนรวม fund invest" },
      { t: "SME Banking", s: "ธุรกิจ · สินเชื่อ SME", h: "sme/", ic: "store", k: "sme ธุรกิจ" },
      { t: "Business Banking", s: "องค์กร · Corporate", h: "business/", ic: "building", k: "corporate business" },
    ];
    if (D) D.products.forEach((p) => idx.push({ t: p.name, s: `${D.categories[p.cat].label} · ${p.tagline}`, h: `personal/product/?id=${p.id}`, ic: D.categories[p.cat].icon, k: p.keywords || "" }));
    return idx;
  }
  function runSearch(q) {
    const out = $("#searchResults");
    if (!out) return;
    const s = $("#globalSearch");
    s.classList.toggle("has-value", !!q);
    const idx = searchIndex();
    const term = q.trim().toLowerCase();
    const res = term ? idx.filter((i) => (i.t + i.s + i.k).toLowerCase().includes(term)) : idx.slice(0, 6);
    const hl = (t) => (term ? t.replace(new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"), "<mark>$1</mark>") : t);
    out.innerHTML = (term ? `<p class="t-sm t-muted mb-4">พบ ${res.length} รายการสำหรับ “${q}”</p>` : `<p class="t-sm t-muted mb-4">ยอดนิยม</p>`) +
      (res.length ? res.slice(0, 10).map((r) => `<a class="search-result" href="${url(r.h)}"><span class="search-result__icon">${icon(r.ic)}</span><div style="flex:1"><strong>${hl(r.t)}</strong><small>${r.s}</small></div>${icon("arrow-right")}</a>`).join("")
        : `<div class="listing__empty">ไม่พบผลลัพธ์ ลองค้นหาด้วยคำอื่น หรือโทร 1327</div>`);
  }

  function initAccordions(scope = document) {
    $$("[data-accordion]", scope).forEach((acc) => {
      if (acc.dataset.bound) return;
      acc.dataset.bound = 1;
      acc.addEventListener("click", (e) => {
        const trg = e.target.closest(".acc-trigger");
        if (!trg || !acc.contains(trg)) return;
        const item = trg.closest(".acc-item");
        const willOpen = !item.classList.contains("is-open");
        if (acc.hasAttribute("data-single")) $$(".acc-item", acc).forEach((i) => { if (i.parentElement === item.parentElement) { i.classList.remove("is-open"); $(".acc-trigger", i).setAttribute("aria-expanded", "false"); } });
        item.classList.toggle("is-open", willOpen);
        trg.setAttribute("aria-expanded", String(willOpen));
      });
    });
  }

  function initTabs(scope = document) {
    $$("[data-tabs]", scope).forEach((wrap) => {
      if (wrap.dataset.bound) return;
      wrap.dataset.bound = 1;
      const tabs = $$("[data-tab]", wrap);
      tabs.forEach((t) => t.addEventListener("click", () => {
        tabs.forEach((x) => { x.classList.toggle("is-active", x === t); x.setAttribute("aria-selected", x === t); });
        const target = t.dataset.tab;
        $$("[data-panel]", wrap).forEach((p) => p.classList.toggle("is-active", p.dataset.panel === target));
        wrap.dispatchEvent(new CustomEvent("tabchange", { detail: target }));
      }));
    });
  }

  function initDropdowns(scope = document) {
    $$(".dropdown", scope).forEach((dd) => {
      if (dd.dataset.bound) return;
      dd.dataset.bound = 1;
      const trg = $(".dropdown__trigger", dd);
      trg.addEventListener("click", (e) => { e.stopPropagation(); const o = dd.classList.contains("is-open"); $$(".dropdown.is-open").forEach((d) => d.classList.remove("is-open")); dd.classList.toggle("is-open", !o); });
      $$(".dropdown__item", dd).forEach((it) => it.addEventListener("click", () => {
        $$(".dropdown__item", dd).forEach((x) => x.classList.toggle("is-selected", x === it));
        const lbl = $("[data-dd-label]", dd); if (lbl) lbl.textContent = it.dataset.label || it.textContent.trim();
        dd.classList.remove("is-open");
        dd.dispatchEvent(new CustomEvent("change", { detail: it.dataset.value }));
      }));
    });
  }
  document.addEventListener("click", () => $$(".dropdown.is-open").forEach((d) => d.classList.remove("is-open")));

  /* Modals */
  function openModal(id) { const m = document.getElementById(id); if (!m) return; m.classList.add("is-open"); lockScroll(true); const f = $("input, button:not(.modal__close)", m); f && setTimeout(() => f.focus({ preventScroll: true }), 80); }
  function closeModals() { $$(".modal.is-open, .drawer.is-open").forEach((m) => m.classList.remove("is-open")); if (!$(".mobile-nav.is-open, .search-overlay.is-open")) lockScroll(false); }
  document.addEventListener("click", (e) => {
    const o = e.target.closest("[data-modal]");
    if (o) { e.preventDefault(); openModal(o.dataset.modal); }
    if (e.target.closest("[data-close-modal]") || e.target.classList.contains("modal__backdrop")) closeModals();
    const t = e.target.closest("[data-toast]");
    if (t) { e.preventDefault(); toast(t.dataset.toast); }
  });

  /* Contact / Lead modal (shared CTA pattern) */
  function renderLeadModal() {
    if (document.getElementById("leadModal")) return;
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <div class="modal" id="leadModal" role="dialog" aria-modal="true" aria-labelledby="leadTitle">
        <div class="modal__backdrop"></div>
        <div class="modal__dialog">
          <button class="icon-btn modal__close" data-close-modal aria-label="ปิด">${icon("close")}</button>
          <form id="leadForm" novalidate>
            <span class="eyebrow">ให้เราช่วยแนะนำ</span>
            <h3 id="leadTitle" class="mt-3">ให้เจ้าหน้าที่ติดต่อกลับ</h3>
            <p class="t-muted t-sm mt-2">ผู้เชี่ยวชาญของเราจะติดต่อกลับภายใน 1 วันทำการ เพื่อแนะนำผลิตภัณฑ์ที่เหมาะกับคุณ</p>
            <div class="stack mt-6" style="--stack:16px">
              <div class="field"><label class="field__label" for="lf-name">ชื่อ-นามสกุล</label><input class="input" id="lf-name" required placeholder="ชื่อ นามสกุล"><span class="field__error">กรุณากรอกชื่อ-นามสกุล</span></div>
              <div class="field"><label class="field__label" for="lf-tel">เบอร์โทรศัพท์</label><input class="input" id="lf-tel" inputmode="tel" required placeholder="08X-XXX-XXXX" pattern="[0-9\\-\\s]{9,12}"><span class="field__error">กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง</span></div>
              <div class="field"><label class="field__label" for="lf-prod">ผลิตภัณฑ์ที่สนใจ</label><select class="select" id="lf-prod"><option>สินเชื่อบ้าน</option><option>บัญชีเงินฝาก</option><option>การลงทุน</option><option>สินเชื่อ SME</option><option>อื่นๆ</option></select></div>
              <div class="field"><label class="field__label">ช่วงเวลาที่สะดวก</label><div class="segmented" style="width:100%"><button type="button" class="is-active" style="flex:1">เช้า</button><button type="button" style="flex:1">บ่าย</button><button type="button" style="flex:1">เย็น</button></div></div>
              <label class="check"><input type="checkbox" required id="lf-consent"> ยินยอมให้ธนาคารติดต่อกลับตามนโยบายความเป็นส่วนตัว</label>
              <button class="btn btn--primary btn--block btn--lg" type="submit">ส่งข้อมูล</button>
            </div>
          </form>
          <div id="leadDone" class="hide text-center" style="padding:24px 0">
            <div class="tile__icon" style="margin:0 auto;background:var(--c-success-bg);color:var(--c-success)">${icon("check")}</div>
            <h3 class="mt-6">ได้รับข้อมูลแล้ว</h3>
            <p class="t-muted mt-2">เจ้าหน้าที่จะติดต่อกลับภายใน 1 วันทำการ<br>หมายเลขอ้างอิง <strong class="t-num">LH-27-04821</strong></p>
            <button class="btn btn--secondary mt-8" data-close-modal>ปิด</button>
          </div>
        </div>
      </div>`;
    body.appendChild(wrap.firstElementChild);
    const form = $("#leadForm");
    $$(".segmented button", form).forEach((b, _, all) => b.addEventListener("click", () => all.forEach((x) => x.classList.toggle("is-active", x === b))));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      $$(".field", form).forEach((f) => { const i = $("input", f); if (!i) return; const bad = !i.checkValidity(); f.classList.toggle("is-invalid", bad); if (bad) ok = false; });
      if (!$("#lf-consent").checked) { ok = false; toast("กรุณายืนยันความยินยอม"); }
      if (!ok) return;
      const btn = $("button[type=submit]", form);
      btn.classList.add("is-loading");
      setTimeout(() => { btn.classList.remove("is-loading"); form.classList.add("hide"); $("#leadDone").classList.remove("hide"); }, 900);
    });
  }

  /* Apply CTA → existing application system (out of scope: forms use legacy system) */
  function renderApplyModal() {
    if (document.getElementById("applyModal")) return;
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <div class="modal" id="applyModal" role="dialog" aria-modal="true">
        <div class="modal__backdrop"></div>
        <div class="modal__dialog">
          <button class="icon-btn modal__close" data-close-modal aria-label="ปิด">${icon("close")}</button>
          <span class="eyebrow">เลือกช่องทางสมัคร</span>
          <h3 class="mt-3">สมัครได้ง่าย ในแบบที่คุณสะดวก</h3>
          <div class="stack mt-6" style="--stack:10px">
            <a class="cta-option" href="https://campaign.lhbank.co.th/" target="_blank" rel="noopener"><span class="tile__icon">${icon("mobile")}</span><div><strong>สมัครออนไลน์</strong><span>ไปยังระบบสมัครของธนาคาร · ใช้เวลาประมาณ 10 นาที</span></div>${icon("arrow-up-right")}</a>
            <a class="cta-option" href="#" data-modal="leadModal"><span class="tile__icon">${icon("headset")}</span><div><strong>ให้เจ้าหน้าที่ติดต่อกลับ</strong><span>ปรึกษาก่อนตัดสินใจ ภายใน 1 วันทำการ</span></div>${icon("arrow-right")}</a>
            <a class="cta-option" href="${url("branch-locations/")}"><span class="tile__icon">${icon("pin")}</span><div><strong>สมัครที่สาขา</strong><span>ค้นหาสาขาใกล้คุณ เปิดทุกวัน</span></div>${icon("arrow-right")}</a>
          </div>
          <p class="t-xs t-muted mt-6">* ระบบสมัครสินเชื่อและแบบฟอร์มใช้ระบบเดิมของธนาคาร (นอกขอบเขตงานออกแบบ)</p>
        </div>
      </div>`;
    body.appendChild(wrap.firstElementChild);
  }

  /* Toast */
  let toastT;
  function toast(msg) {
    let t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); body.appendChild(t); }
    t.innerHTML = `${icon("info")}<span>${msg}</span>`;
    requestAnimationFrame(() => t.classList.add("is-on"));
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove("is-on"), 2600);
  }

  /* Reveal on scroll */
  function initReveal(scope = document) {
    const els = $$(".reveal:not(.is-in)", scope);
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("is-in")); return; }
    const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px" });
    els.forEach((e) => io.observe(e));
  }

  /* Range fill */
  function syncRange(r) { const p = ((r.value - r.min) / (r.max - r.min)) * 100; r.style.setProperty("--p", p + "%"); }
  document.addEventListener("input", (e) => { if (e.target.classList && e.target.classList.contains("range")) syncRange(e.target); });

  /* Carousel */
  function initCarousels(scope = document) {
    $$("[data-carousel]", scope).forEach((c) => {
      const track = $(".carousel__track", c);
      const prev = $("[data-prev]", c), next = $("[data-next]", c), bar = $(".carousel__progress span", c);
      const step = () => (track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width + 24 : 300);
      const update = () => {
        const max = track.scrollWidth - track.clientWidth;
        if (prev) prev.disabled = track.scrollLeft <= 4;
        if (next) next.disabled = track.scrollLeft >= max - 4;
        if (bar) { const w = Math.max(15, (track.clientWidth / track.scrollWidth) * 100); bar.style.width = w + "%"; bar.style.transform = `translateX(${max ? (track.scrollLeft / max) * ((100 - w) / w) * 100 : 0}%)`; }
      };
      prev && prev.addEventListener("click", () => track.scrollBy({ left: -step() }));
      next && next.addEventListener("click", () => track.scrollBy({ left: step() }));
      track.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      update();
    });
  }

  /* Footer accordion (mobile) */
  function initFooter() {
    $$(".footer-top > div:not(.footer-brand) h6").forEach((h) => h.addEventListener("click", () => h.parentElement.classList.toggle("is-open")));
    const pn = $("#protoNav");
    if (pn) {
      const b = $(".proto-nav__btn", pn);
      b.addEventListener("click", (e) => { e.stopPropagation(); const o = pn.classList.toggle("is-open"); b.setAttribute("aria-expanded", o); });
      document.addEventListener("click", (e) => { if (!pn.contains(e.target)) pn.classList.remove("is-open"); });
    }
  }

  /* Broken image graceful fallback (keeps gradient placeholder) */
  document.addEventListener("error", (e) => {
    const t = e.target;
    if (t.tagName === "IMG") { t.classList.add("is-broken"); const m = t.closest(".media"); m && m.classList.add("is-broken"); }
  }, true);

  /* Sparkline util (shared) */
  function sparkline(values, { w = 120, h = 40, color = "var(--c-accent)", fill = true } = {}) {
    const min = Math.min(...values), max = Math.max(...values), r = max - min || 1;
    const pts = values.map((v, i) => [(i / (values.length - 1)) * w, h - 2 - ((v - min) / r) * (h - 4)]);
    const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
    const gid = "g" + Math.random().toString(36).slice(2, 8);
    return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">
      ${fill ? `<defs><linearGradient id="${gid}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".22"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs><path d="${d} L${w} ${h} L0 ${h}Z" fill="url(#${gid})"/>` : ""}
      <path d="${d}" fill="none" stroke="${color}" stroke-width="1.6" vector-effect="non-scaling-stroke"/></svg>`;
  }
  /* Deterministic pseudo random series */
  function series(seed, n, start, vol, drift = 0) {
    let s = seed, v = start; const out = [];
    for (let i = 0; i < n; i++) { s = (s * 9301 + 49297) % 233280; v = v * (1 + ((s / 233280) - 0.5) * vol + drift); out.push(v); }
    return out;
  }

  /* Public API */
  window.LH = { icon, $, $$, fmt, img, U, url, toast, openModal, closeModals, initAccordions, initTabs, initDropdowns, initReveal, initCarousels, sparkline, series, syncRange, ROOT, SEGMENT };

  /* Static-page icon placeholders: <i data-icon="name"></i> */
  $$("i[data-icon]").forEach((i) => { i.outerHTML = icon(i.dataset.icon, i.className); });

  /* Boot */
  renderHeader();
  renderFooter();
  renderLeadModal();
  renderApplyModal();
  document.addEventListener("DOMContentLoaded", boot);
  if (document.readyState !== "loading") boot();
  let booted = false;
  function boot() {
    if (booted) return; booted = true;
    initHeader(); initFooter();
    // Page scripts may render content — let them run first, then wire generic behaviors
    requestAnimationFrame(() => {
      initAccordions(); initTabs(); initDropdowns(); initCarousels(); initReveal();
      $$(".range").forEach(syncRange);
    });
  }
})();
