/* Product content for the bid prototype — sourced from lhbank.co.th (Nov 2026).
   verified:true  → details copied from the bank's product page (see `source`).
   Other products use the bank's real product names / headlines only; their
   full terms, rates and fees come from the bank's CMS in the real build.
   Live feeds (exchange rates, market data, branch list) are sample data. */
window.LHDATA = (function () {
  const categories = {
    "home-loan":    { label: "สินเชื่อบ้าน",            icon: "home",     segment: "personal", cta: "สมัครสินเชื่อ" },
    "personal-loan":{ label: "สินเชื่อส่วนบุคคล",       icon: "wallet",   segment: "personal", cta: "สมัครสินเชื่อ" },
    deposit:        { label: "เงินฝาก",                 icon: "piggy",    segment: "personal", cta: "เปิดบัญชี" },
    card:           { label: "บัตรเดบิตและบริการ",       icon: "card",     segment: "personal", cta: "สอบถามบริการ" },
    sme:            { label: "SME Banking",            icon: "store",    segment: "sme",      cta: "ปรึกษาผู้ดูแลธุรกิจ" },
    business:       { label: "บริการธุรกิจ",             icon: "building", segment: "business", cta: "ติดต่อผู้ดูแล" },
  };

  const IMG = {
    house: "photo-1613490493576-7fde63acd811",
    house2: "photo-1600566753190-17f0baa2a6c3",
    interior: "photo-1600607687939-ce8a6c25118c",
    kitchen: "photo-1617806118233-18e1de247200",
    keys: "photo-1600047509807-ba8f99d2cdde",
    family: "photo-1609220136736-443140cffec6",
    savings: "photo-1548142813-c348350df52b",
    docs: "photo-1600210492486-724fe5c67fb0",
    woman: "photo-1573497019236-17f8177b81e8",
    man: "photo-1556157382-97eda2d62296",
    travel: "photo-1530521954074-e64f6810b32d",
    card: "photo-1563013544-824ae1b704d3",
    cafe: "photo-1551836022-4c4c79ecde51",
    meeting: "photo-1600880292089-90a7e086ee0c",
    tower: "photo-1582407947304-fd86f028f716",
    sign: "photo-1573164713988-8665fc963095",
    nature: "photo-1519451241324-20b4ea2c4220",
    market: "photo-1526628953301-3e589a6a8b74",
    friends: "photo-1529333166437-7750a6dd5a70",
    apartment: "photo-1571867424488-4565932edb41",
    dusk: "photo-1600585154526-990dced4db0d",
    suit: "photo-1519085360753-af0119f7cbe7",
    infinity: "photo-1584132967334-10e028bd69f7",
    resort: "photo-1520250497591-112f2f40a3f4",
    dining: "photo-1414235077428-338989a2e8c0",
  };

  const SRC_H1 = "https://www.lhbank.co.th/th/personal/loans/saen-sabai-home-loan/";
  const SRC_LOANS = "https://www.lhbank.co.th/th/personal/loans/";
  const homeDocs = [
    ["สำเนาบัตรประจำตัวประชาชน / บัตรข้าราชการ และสำเนาทะเบียนบ้าน", "ผู้กู้และคู่สมรส"],
    ["สลิปเงินเดือนฉบับล่าสุด หรือหนังสือรับรองเงินเดือน (ตัวจริง)", "กรณีผู้มีรายได้ประจำ"],
    ["สำเนาบัญชีธนาคาร (Statement) ย้อนหลัง 6 เดือน", "เอกสารแสดงรายได้"],
    ["หนังสือรับรองนิติบุคคล งบการเงินย้อนหลัง 3 ปี และ Statement 6 เดือน", "กรณีธุรกิจส่วนตัว / เจ้าของกิจการ"],
    ["สำเนาโฉนดที่ดิน / หนังสือกรรมสิทธิ์ห้องชุด และสัญญาจะซื้อจะขาย", "เอกสารทางด้านหลักประกัน"],
  ];
  const contactFaq = ["สอบถามรายละเอียดเพิ่มเติมได้ที่ไหน", "LH Bank Call Center โทร 1327 หรืออีเมล callcenter@lhbank.co.th"];

  const products = [
    /* ---------------- Home loans (lhbank.co.th/th/personal/loans/) ---------------- */
    {
      id: "home-1st-class", cat: "home-loan", name: "สินเชื่อบ้านใหม่ Home 1st Class", badge: "แนะนำ", img: IMG.dusk, verified: true, source: SRC_H1,
      tagline: "กู้ซื้อบ้าน ด้วยดอกเบี้ยบ้านต่ำ",
      desc: "สินเชื่อบ้านสำหรับผู้ที่ต้องการซื้อบ้าน ทาวน์โฮม บ้านแฝด หรือคอนโดมิเนียม เพื่อเป็นเจ้าของที่อยู่อาศัยในแบบที่ต้องการและตอบโจทย์การวางแผนทางการเงินของคุณ",
      highlight: { value: "2.64", unit: "%", label: "ดอกเบี้ยพิเศษเริ่มต้นปีที่ 1*" },
      facts: ["กู้ได้ 100% ระยะเวลากู้สูงสุด 40 ปี (รวมอายุผู้กู้ไม่เกิน 70 ปี)", "ฟรี! ค่าประเมินหลักประกัน (ตามที่จ่ายจริง สูงสุด 5,000 บาท)", "ฟรี! ค่าเบี้ยประกันอัคคีภัย 3 ปี (สูงสุด 100,000 บาท)"],
      keyfacts: [["2.64%", "ดอกเบี้ยพิเศษเริ่มต้นปีที่ 1*"], ["100%", "ของราคาซื้อขายหรือราคาประเมิน"], ["40 ปี", "ระยะเวลากู้สูงสุด"]],
      compare: { rate: 2.64, term: "40 ปี", ltv: "100% ของราคาซื้อขาย/ราคาประเมิน", fee: "ฟรีค่าประเมิน (สูงสุด 5,000 บาท)" },
      promo: "สมัครสินเชื่อและจดจำนองภายใน 1 พ.ย. 69 – 31 ม.ค. 70",
      benefits: [
        ["percent", "ทางเลือกอัตราดอกเบี้ยหลากหลาย", "อัตราดอกเบี้ยที่แท้จริงตลอดอายุสัญญา อยู่ระหว่าง 4.39%–4.55% ต่อปี"],
        ["home", "วงเงินสูงสุด 100%", "ของราคาซื้อขายหรือราคาประเมิน และ Top up เพิ่มได้สูงสุด 10% เพื่อซื้อเฟอร์นิเจอร์ ตกแต่งบ้าน (หลักประกันต่ำกว่า 10 ล้านบาท)"],
        ["calendar", "ชำระเกินค่างวดได้", "สามารถชำระเกินค่างวดที่กำหนดได้ โดยไม่มีค่าธรรมเนียมเพิ่มเติม"],
        ["gift", "ฟรีค่าประเมินและประกันอัคคีภัย 3 ปี", "ตามที่จ่ายจริง ค่าประเมินสูงสุด 5,000 บาท · ประกันอัคคีภัยสูงสุด 100,000 บาท"],
      ],
      eligibility: [
        "ผู้กู้อายุตั้งแต่ 21 ปีขึ้นไป ระยะเวลากู้สูงสุด 40 ปี รวมอายุผู้กู้ไม่เกิน 70 ปี",
        "กู้ร่วมได้ไม่เกิน 4 คน และต้องเป็นบุคคลในครอบครัวเดียวกัน",
        "หลักประกัน: บ้านเดี่ยว บ้านแฝด ทาวน์โฮม คอนโด ในโครงการจัดสรรตามที่ธนาคารกำหนด เขตกรุงเทพฯ และปริมณฑล (ต่างจังหวัดพิจารณาเฉพาะโครงการที่ธนาคารกำหนด ในจังหวัดที่มีสาขา)",
        "ราคาซื้อขายแนวราบไม่น้อยกว่า 2.00 ล้านบาท และคอนโดไม่น้อยกว่า 2.50 ล้านบาท",
      ],
      rates: { head: ["แบบ", "ปีที่ 1", "ปีที่ 2–3", "หลังจากนั้น", "เฉลี่ย 3 ปี", "EIR ตลอดสัญญา"], rows: [
        ["ทำประกัน MRTA/MLTA · ฟรีค่าจดจำนอง", "คงที่ 2.79%", "MRR − 5.36% (2.82%)", "MRR − 3.01% (5.17%)", "2.81%", "4.44%"],
        ["ทำประกัน MRTA/MLTA · ไม่ฟรีค่าจดจำนอง", "คงที่ 2.64%*", "MRR − 5.51% (2.67%)", "MRR − 3.01% (5.17%)", "2.66%", "4.39%"],
        ["ไม่ทำประกัน MRTA/MLTA · ไม่ฟรีค่าจดจำนอง", "คงที่ 3.12%", "MRR − 5.03% (3.15%)", "MRR − 3.01% (5.17%)", "3.14%", "4.55%"],
      ] },
      rateNote: "*อัตราดอกเบี้ยพิเศษปีที่ 1 = 2.64% ปีที่ 2–3 = MRR − 5.51% (2.67%) ต่อปี ลูกค้าต้องทำประกัน MRTA/MLTA และไม่ฟรีค่าจดจำนอง · EIR คำนวณจากวงเงิน 1 ล้านบาท อายุสัญญา 30 ปี · MRR = 8.18% ต่อปี ณ 06 มี.ค. 2569 อัตราลอยตัวเปลี่ยนแปลงได้ · สมัครและจดจำนองภายใน 1 พ.ย. 69 – 31 ม.ค. 70",
      fees: [["ค่าสำรวจและประเมินหลักประกัน", "ตามที่จ่ายจริง สูงสุด 5,000 บาท"], ["ค่าอากรแสตมป์", "0.05% ของวงเงินสินเชื่อ"], ["เบี้ยประกันอัคคีภัย", "ตามที่จ่ายจริง สูงสุด 100,000 บาท"], ["ปิดบัญชีก่อนกำหนดภายใน 3 ปีแรก (กรณีรีไฟแนนซ์)", "3% ของยอดหนี้คงค้าง"], ["ค่าจดจำนอง (ชำระที่กรมที่ดิน)", "1% ของวงเงินกู้"]],
      example: { title: "ตัวอย่างการผ่อนชำระ วงเงินกู้ 1,000,000 บาท อัตราดอกเบี้ย 6% ต่อปี", head: ["ระยะเวลาผ่อน", "ค่างวด/เดือน (บาท)", "ดอกเบี้ยจ่ายทั้งหมด (บาท)", "ประหยัดได้ เทียบกับผ่อน 40 ปี (บาท)"], rows: [["20 ปี", "7,800", "602,224", "391,261"], ["25 ปี", "7,100", "734,108", "259,377"], ["30 ปี", "6,700", "842,373", "151,112"], ["40 ปี", "6,300", "993,485", "–"]] },
      docs: homeDocs,
      faq: [
        ["วงเงินสินเชื่อบ้าน LH Bank คือสินเชื่อประเภทใด", "วงเงินเพื่อซื้อที่อยู่อาศัย ราคาบ้านแนวราบ ตั้งแต่ 2.0 ล้านบาทขึ้นไป หรือคอนโด ตั้งแต่ 2.5 ล้านบาทขึ้นไป"],
        ["ประเภทหลักประกันที่ธนาคารรับพิจารณา", "บ้านเดี่ยว บ้านแฝด ทาวน์โฮม คอนโด ที่อยู่ในโครงการจัดสรร ตั้งอยู่ในเขตกรุงเทพฯ และปริมณฑล"],
        ["อายุผู้กู้ขั้นต่ำ และระยะเวลาการกู้สูงสุดเท่าใด", "ผู้กู้ต้องมีอายุตั้งแต่ 21 ปีขึ้นไป สินเชื่อเพื่อซื้อที่อยู่อาศัยผ่อนชำระสูงสุด 40 ปี รวมอายุผู้กู้ไม่เกิน 70 ปี ส่วนสินเชื่อรีไฟแนนซ์ผ่อนชำระสูงสุด 35 ปี รวมอายุผู้กู้ไม่เกิน 65 ปี"],
        ["กู้ร่วมได้กี่คน และจำกัดความสัมพันธ์หรือไม่", "กู้ร่วมกันได้ไม่เกิน 4 คน และต้องเป็นบุคคลในครอบครัวเดียวกัน"],
        ["ต้องเสียค่าธรรมเนียมและค่าใช้จ่ายเบื้องต้นอะไรบ้าง", "ค่าสำรวจและประเมินหลักประกัน · ค่าเบี้ยประกันอัคคีภัย (มีโปรโมชันยกเว้นในบางแคมเปญ) · ค่าอากรแสตมป์ 0.05% ของวงเงินกู้ · ค่าจดจำนอง 1% ของวงเงินกู้ (จ่ายที่กรมที่ดิน)"],
      ],
      payment: ["ธนาคารแลนด์ แอนด์ เฮ้าส์ ทุกสาขา", "Counter Payment ธ.ไทยพาณิชย์ ธ.กรุงไทย และ ธ.กสิกรไทย", "ตัดบัญชีเงินฝากอัตโนมัติ", "แอป LHB You"],
      related: ["home-2nd-hand", "home-refinance", "home-4cash"], calc: true, keywords: "home loan บ้านใหม่ คอนโด แสนสบาย",
    },
    {
      id: "home-2nd-hand", cat: "home-loan", name: "สินเชื่อบ้านมือสอง Home 2nd Hand", img: IMG.house2, source: SRC_LOANS,
      tagline: "วงเงินกู้สูงสุด 100% ฟรีค่าประเมินหลักประกัน**",
      desc: "สินเชื่อสำหรับซื้อที่อยู่อาศัยมือสอง วงเงินกู้สูงสุด 100% พร้อมฟรีค่าประเมินหลักประกัน**",
      highlight: { value: "100", unit: "%", label: "วงเงินกู้สูงสุด" },
      facts: ["วงเงินกู้สูงสุด 100%", "ฟรีค่าประเมินหลักประกัน**"],
      keyfacts: [["100%", "วงเงินกู้สูงสุด"], ["ฟรี", "ค่าประเมินหลักประกัน**"], ["1327", "สอบถามเงื่อนไข"]],
      compare: { rate: null, term: "ตามเงื่อนไขธนาคาร", ltv: "สูงสุด 100%", fee: "ฟรีค่าประเมิน**" },
      docs: homeDocs, related: ["home-1st-class", "home-refinance"], calc: true, keywords: "บ้านมือสอง second hand",
    },
    {
      id: "home-refinance", cat: "home-loan", name: "สินเชื่อบ้าน Home Refinance", img: IMG.interior, source: SRC_LOANS,
      tagline: "อนุมัติวงเงินสูงสุด 100% ของภาระหนี้คงเหลือจากสถาบันการเงินเดิม",
      desc: "อนุมัติวงเงินสูงสุด 100% ของภาระหนี้คงเหลือจากสถาบันการเงินเดิม แต่ไม่เกินราคาประเมินหลักประกัน",
      highlight: { value: "100", unit: "%", label: "ของภาระหนี้คงเหลือ (ไม่เกินราคาประเมิน)" },
      facts: ["วงเงินสูงสุด 100% ของภาระหนี้คงเหลือ แต่ไม่เกินราคาประเมินหลักประกัน", "ผ่อนชำระสูงสุด 35 ปี รวมอายุผู้กู้ไม่เกิน 65 ปี"],
      keyfacts: [["100%", "ของภาระหนี้คงเหลือ"], ["35 ปี", "ผ่อนชำระสูงสุด"], ["65 ปี", "อายุผู้กู้รวมระยะผ่อน"]],
      compare: { rate: null, term: "35 ปี", ltv: "100% ของภาระหนี้คงเหลือ", fee: "ตามประกาศธนาคาร" },
      eligibility: ["ผ่อนชำระสูงสุด 35 ปี คิดจากอายุผู้กู้รวมกับระยะเวลาการผ่อนชำระ ไม่เกิน 65 ปี", "คุณสมบัติและเงื่อนไขอื่นเป็นไปตามหลักเกณฑ์ที่ธนาคารกำหนด"],
      docs: homeDocs, related: ["retention", "home-1st-class"], calc: true, keywords: "refinance รีไฟแนนซ์",
    },
    {
      id: "home-4cash", cat: "home-loan", name: "สินเชื่อบ้านแลกเงิน Home 4Cash", img: IMG.kitchen, source: SRC_LOANS,
      tagline: "เพิ่มอิสระมากกว่า...กับการอนุมัติสินเชื่อแบบง่ายๆ ได้เงินไว",
      desc: "เพิ่มอิสระมากกว่า...กับการอนุมัติสินเชื่อแบบง่ายๆ ได้เงินไว ด้วยการใช้บ้านเป็นหลักประกัน",
      highlight: { text: "ได้เงินไว", label: "อนุมัติสินเชื่อแบบง่ายๆ" },
      facts: ["ใช้บ้านเป็นหลักประกัน", "อนุมัติสินเชื่อแบบง่ายๆ ได้เงินไว"],
      keyfacts: [["ง่าย", "ขั้นตอนอนุมัติ"], ["ไว", "ได้รับเงิน"], ["1327", "สอบถามเงื่อนไข"]],
      compare: { rate: null, term: "ตามเงื่อนไขธนาคาร", ltv: "ตามราคาประเมิน", fee: "ตามประกาศธนาคาร" },
      docs: homeDocs, related: ["home-refinance", "happy-cash"], calc: true, keywords: "home for cash บ้านแลกเงิน",
    },
    {
      id: "retention", cat: "home-loan", name: "อยู่ครบ 1 ปี ก็รีได้ (Retention)", badge: "โปรโมชัน", img: IMG.keys, source: "https://www.lhbank.co.th/th/personal/",
      tagline: "ปลดล็อกสัญญากู้บ้านแบบเดิมๆ",
      desc: "อยู่ครบ 1 ปี ก็รีได้ ปลดล็อกสัญญากู้บ้านแบบเดิมๆ",
      highlight: { value: "1", unit: " ปี", label: "อยู่ครบ ก็รีได้" },
      facts: ["อยู่ครบ 1 ปี ก็รีได้", "ปลดล็อกสัญญากู้บ้านแบบเดิมๆ"],
      keyfacts: [["1 ปี", "อยู่ครบ ก็รีได้"], ["Retention", "สำหรับลูกค้าเดิม"], ["1327", "สอบถามเงื่อนไข"]],
      compare: { rate: null, term: "ตามเงื่อนไขธนาคาร", ltv: "–", fee: "ตามประกาศธนาคาร" },
      docs: homeDocs, related: ["home-refinance", "home-1st-class"], keywords: "retention รีเทนชั่น",
    },
    /* ---------------- Personal loans ---------------- */
    {
      id: "happy-cash", cat: "personal-loan", name: "สินเชื่อส่วนบุคคล Happy Cash", badge: "แนะนำ", img: IMG.friends, source: SRC_LOANS,
      tagline: "ชีวิตไปต่อได้ ไม่สะดุด...ด้วยอิสระที่เหนือกว่า",
      desc: "ชีวิตไปต่อได้ ไม่สะดุด...ด้วยอิสระที่เหนือกว่า ดอกเบี้ยเริ่มเพียง 8.88% ต่อปี นานสูงสุด 5 ปี*",
      highlight: { value: "8.88", unit: "%", label: "ดอกเบี้ยเริ่มต้นต่อปี*" },
      facts: ["ดอกเบี้ยเริ่มเพียง 8.88% ต่อปี*", "ผ่อนนานสูงสุด 5 ปี*"],
      keyfacts: [["8.88%", "ดอกเบี้ยเริ่มต้นต่อปี*"], ["5 ปี", "ผ่อนนานสูงสุด*"], ["1327", "สอบถามเงื่อนไข"]],
      compare: { rate: 8.88, term: "5 ปี", ltv: "ตามเงื่อนไขธนาคาร", fee: "ตามประกาศธนาคาร" },
      related: ["happy-cash-bt", "home-4cash"], keywords: "personal loan สินเชื่อบุคคล",
    },
    {
      id: "happy-cash-bt", cat: "personal-loan", name: "สินเชื่อส่วนบุคคลรวมหนี้ Happy Cash Balance Transfer", img: IMG.man, source: SRC_LOANS,
      tagline: "ภาระหนัก เบาใจได้",
      desc: "สินเชื่อส่วนบุคคลสำหรับรวมหนี้ไว้ในที่เดียว ภาระหนัก เบาใจได้",
      highlight: { text: "รวมหนี้", label: "ภาระหนัก เบาใจได้" },
      facts: ["รวมภาระหนี้ไว้ในที่เดียว", "ภาระหนัก เบาใจได้"],
      keyfacts: [["รวมหนี้", "ไว้ในที่เดียว"], ["เบาใจ", "จัดการง่ายขึ้น"], ["1327", "สอบถามเงื่อนไข"]],
      compare: { rate: null, term: "ตามเงื่อนไขธนาคาร", ltv: "–", fee: "ตามประกาศธนาคาร" },
      related: ["happy-cash"], keywords: "balance transfer รวมหนี้",
    },
    /* ---------------- Deposits (menu: เงินฝาก) ---------------- */
    {
      id: "fixed-special", cat: "deposit", name: "เงินฝากประจำพิเศษ 6 เดือน", badge: "โปรโมชัน", img: IMG.docs, source: "https://www.lhbank.co.th/th/personal/",
      tagline: "ฝากสั้น รับดอกเบี้ยสูง",
      desc: "เงินฝากประจำพิเศษระยะ 6 เดือน ฝากสั้น รับดอกเบี้ยสูง",
      highlight: { value: "6", unit: " เดือน", label: "ฝากสั้น รับดอกเบี้ยสูง" },
      facts: ["ระยะเวลาฝาก 6 เดือน", "ฝากสั้น รับดอกเบี้ยสูง"],
      keyfacts: [["6 เดือน", "ระยะเวลาฝาก"], ["สูง", "ดอกเบี้ย"], ["1327", "สอบถามอัตราล่าสุด"]],
      compare: { rate: null, term: "6 เดือน", ltv: "–", fee: "–" },
      related: ["fixed", "digital-savings"], keywords: "ฝากประจำ fixed",
    },
    {
      id: "digital-savings", cat: "deposit", name: "เงินฝากออมทรัพย์ดิจิทัล", img: IMG.savings, source: "https://www.lhbank.co.th/th/personal/",
      tagline: "บัญชีออมทรัพย์รูปแบบดิจิทัล",
      desc: "บัญชีเงินฝากออมทรัพย์รูปแบบดิจิทัล จาก LH Bank",
      highlight: { text: "ดิจิทัล", label: "เงินฝากออมทรัพย์" },
      facts: ["บัญชีออมทรัพย์รูปแบบดิจิทัล", "ธนาคารมีบริการยืนยันตัวตนผ่านระบบ NDID"],
      keyfacts: [["ดิจิทัล", "บัญชีออมทรัพย์"], ["NDID", "บริการยืนยันตัวตนของธนาคาร"], ["1327", "สอบถามอัตราล่าสุด"]],
      compare: { rate: null, term: "ไม่กำหนด", ltv: "–", fee: "ตามประกาศธนาคาร" },
      related: ["high-yield-savings", "tax-free"], keywords: "ออมทรัพย์ digital savings",
    },
    {
      id: "high-yield-savings", cat: "deposit", name: "ออมทรัพย์ดอกเบี้ยสูง", img: IMG.family, source: "https://www.lhbank.co.th/th/personal/",
      tagline: "บัญชีออมทรัพย์ดอกเบี้ยสูง",
      desc: "บัญชีเงินฝากออมทรัพย์ดอกเบี้ยสูง จาก LH Bank",
      highlight: { text: "ดอกเบี้ยสูง", label: "เงินฝากออมทรัพย์" },
      facts: ["บัญชีเงินฝากออมทรัพย์", "ดอกเบี้ยสูง"],
      keyfacts: [["ออมทรัพย์", "ประเภทบัญชี"], ["สูง", "ดอกเบี้ย"], ["1327", "สอบถามอัตราล่าสุด"]],
      compare: { rate: null, term: "ไม่กำหนด", ltv: "–", fee: "ตามประกาศธนาคาร" },
      related: ["digital-savings", "fixed-special"], keywords: "ออมทรัพย์ดอกเบี้ยสูง",
    },
    {
      id: "tax-free", cat: "deposit", name: "เงินฝากปลอดภาษี", img: IMG.woman, source: "https://www.lhbank.co.th/th/personal/",
      tagline: "ดอกเบี้ยได้รับยกเว้นภาษีตามเงื่อนไข",
      desc: "บัญชีเงินฝากปลอดภาษี ดอกเบี้ยได้รับยกเว้นภาษีตามเงื่อนไขที่กฎหมายกำหนด",
      highlight: { text: "ปลอดภาษี", label: "ดอกเบี้ยยกเว้นภาษีตามเงื่อนไข" },
      facts: ["ดอกเบี้ยได้รับยกเว้นภาษีตามเงื่อนไข", "สอบถามอัตราดอกเบี้ยล่าสุดได้ที่ 1327"],
      keyfacts: [["ปลอดภาษี", "ดอกเบี้ยตามเงื่อนไข"], ["เงินฝาก", "ประเภทบัญชี"], ["1327", "สอบถามอัตราล่าสุด"]],
      compare: { rate: null, term: "ตามเงื่อนไขบัญชี", ltv: "–", fee: "–" },
      related: ["fixed", "fixed-special"], keywords: "ปลอดภาษี tax free",
    },
    {
      id: "fixed", cat: "deposit", name: "เงินฝากประจำ", img: IMG.interior, source: "https://www.lhbank.co.th/th/personal/",
      tagline: "บัญชีเงินฝากประจำ พร้อมเครื่องมือคำนวณเงินฝากประจำ",
      desc: "บัญชีเงินฝากประจำ จาก LH Bank มีใบรับเงินฝากประจำ และเครื่องมือคำนวณเงินฝากประจำ",
      highlight: { text: "ฝากประจำ", label: "บัญชีเงินฝากประจำ" },
      facts: ["มีใบรับเงินฝากประจำ", "มีเครื่องมือคำนวณเงินฝากประจำ"],
      keyfacts: [["ประจำ", "ประเภทบัญชี"], ["ใบรับ", "เงินฝากประจำ"], ["1327", "สอบถามอัตราล่าสุด"]],
      compare: { rate: null, term: "ตามประกาศธนาคาร", ltv: "–", fee: "–" },
      related: ["fixed-special", "tax-free"], keywords: "ฝากประจำ",
    },
    {
      id: "fcd", cat: "deposit", name: "บัญชีเงินตราต่างประเทศ (FCD)", img: IMG.travel, source: "https://www.lhbank.co.th/th/personal/",
      tagline: "บัญชีเงินฝากเงินตราต่างประเทศ",
      desc: "บัญชีเงินฝากเงินตราต่างประเทศ (FCD) จาก LH Bank",
      highlight: { text: "FCD", label: "บัญชีเงินตราต่างประเทศ" },
      facts: ["ฝากเงินสกุลต่างประเทศ", "ดูอัตราแลกเปลี่ยนล่าสุดได้บนเว็บไซต์"],
      keyfacts: [["FCD", "บัญชีเงินตราต่างประเทศ"], ["FX", "อัตราแลกเปลี่ยน"], ["1327", "สอบถามเงื่อนไข"]],
      compare: { rate: null, term: "ตามประเภทบัญชี", ltv: "–", fee: "ตามประกาศธนาคาร" },
      related: ["digital-savings"], keywords: "fcd foreign currency usd",
    },
    /* ---------------- Debit card & services (no LH Bank credit card on the current site) ---------------- */
    {
      id: "debit", cat: "card", name: "บริการบัตรเดบิต LH Bank", img: IMG.card, source: "https://www.lhbank.co.th/th/personal/Service/Service-Debit",
      tagline: "บัตรเดบิตสำหรับใช้จ่ายและกดเงินจากบัญชีของคุณ",
      desc: "บริการบัตรเดบิต LH Bank สำหรับใช้จ่ายและกดเงินสดจากบัญชีเงินฝากของคุณ",
      highlight: { text: "บัตรเดบิต", label: "ใช้จ่ายและกดเงินจากบัญชี" },
      facts: ["ใช้จ่ายและกดเงินจากบัญชีเงินฝาก", "ผูกกับบัญชีเงินฝาก LH Bank"],
      keyfacts: [["เดบิต", "ประเภทบัตร"], ["บัญชี", "ตัดเงินจากบัญชีเงินฝาก"], ["1327", "สอบถามเงื่อนไข"]],
      compare: { rate: null, term: "–", ltv: "–", fee: "ตามประกาศธนาคาร" },
      related: ["cardless", "digital-savings"], keywords: "debit card บัตรเดบิต",
    },
    {
      id: "cardless", cat: "card", name: "บริการกดเงินไม่ใช้บัตร LH Bank Cardless", img: IMG.apartment, source: "https://www.lhbank.co.th/th/personal/",
      tagline: "กดเงินสดได้ โดยไม่ต้องใช้บัตร",
      desc: "บริการกดเงินไม่ใช้บัตร LH Bank Cardless กดเงินสดได้โดยไม่ต้องพกบัตร",
      highlight: { text: "Cardless", label: "กดเงินไม่ใช้บัตร" },
      facts: ["กดเงินสดโดยไม่ต้องใช้บัตร", "สอบถามขั้นตอนการใช้งานได้ที่ 1327"],
      keyfacts: [["Cardless", "กดเงินไม่ใช้บัตร"], ["ATM", "กดเงินสด"], ["1327", "สอบถามเงื่อนไข"]],
      compare: { rate: null, term: "–", ltv: "–", fee: "ตามประกาศธนาคาร" },
      related: ["debit"], keywords: "cardless กดเงินไม่ใช้บัตร",
    },
    /* ---------------- SME (menu: สินเชื่อธุรกิจ / บัญชีเพื่อธุรกิจ) ---------------- */
    {
      id: "sme-working-capital", cat: "sme", name: "สินเชื่อเพื่อหมุนเวียนในธุรกิจ", badge: "SME", img: IMG.cafe, source: "https://www.lhbank.co.th/th/sme/",
      tagline: "เงินทุนหมุนเวียนเพื่อเสริมสภาพคล่องของธุรกิจ",
      desc: "สินเชื่อเพื่อเป็นเงินทุนหมุนเวียนในการดำเนินธุรกิจ เสริมสภาพคล่องให้กิจการเดินหน้าได้อย่างต่อเนื่อง",
      highlight: { text: "ทุนหมุนเวียน", label: "เสริมสภาพคล่องธุรกิจ" },
      facts: ["เงินทุนหมุนเวียนในธุรกิจ", "มีเครื่องคำนวณสินเชื่อ SME"],
      keyfacts: [["หมุนเวียน", "วัตถุประสงค์"], ["SME", "กลุ่มลูกค้า"], ["1327", "ติดต่อผู้ดูแล"]],
      compare: { rate: null, term: "ตามเงื่อนไขธนาคาร", ltv: "ตามหลักประกัน", fee: "ตามประกาศธนาคาร" },
      related: ["sme-investment", "sme-factoring"], keywords: "sme ทุนหมุนเวียน",
    },
    {
      id: "sme-investment", cat: "sme", name: "สินเชื่อเพื่อการลงทุนในธุรกิจ", img: IMG.meeting, source: "https://www.lhbank.co.th/th/sme/",
      tagline: "สินเชื่อเพื่อการลงทุนในธุรกิจ",
      desc: "สินเชื่อเพื่อการลงทุนในธุรกิจ จากเมนูสินเชื่อธุรกิจของ LH Bank",
      highlight: { text: "ลงทุนธุรกิจ", label: "สินเชื่อธุรกิจ" },
      facts: ["สินเชื่อเพื่อการลงทุนในธุรกิจ", "มีเครื่องคำนวณสินเชื่อ SME"],
      keyfacts: [["ลงทุน", "วัตถุประสงค์"], ["SME", "กลุ่มลูกค้า"], ["1327", "ติดต่อผู้ดูแล"]],
      compare: { rate: null, term: "ตามเงื่อนไขธนาคาร", ltv: "ตามหลักประกัน", fee: "ตามประกาศธนาคาร" },
      related: ["sme-working-capital", "sme-green"], keywords: "sme ลงทุน",
    },
    {
      id: "sme-green", cat: "sme", name: "Green Transition Advisory Loan", img: IMG.nature, source: "https://www.lhbank.co.th/th/sme/",
      tagline: "สินเชื่อเพื่อการเปลี่ยนผ่านไปสู่ความยั่งยืนด้านสิ่งแวดล้อม",
      desc: "สินเชื่อเพื่อการเปลี่ยนผ่านไปสู่ความยั่งยืนด้านสิ่งแวดล้อม พร้อมคำแนะนำสำหรับธุรกิจ",
      highlight: { text: "Green", label: "สู่ความยั่งยืนด้านสิ่งแวดล้อม" },
      facts: ["เพื่อการเปลี่ยนผ่านสู่ความยั่งยืน", "มีบริการให้คำแนะนำ (Advisory)"],
      keyfacts: [["Green", "เป้าหมาย"], ["Advisory", "ให้คำแนะนำ"], ["1327", "ติดต่อผู้ดูแล"]],
      compare: { rate: null, term: "ตามเงื่อนไขธนาคาร", ltv: "ตามหลักประกัน", fee: "ตามประกาศธนาคาร" },
      related: ["sme-investment"], keywords: "green esg ยั่งยืน",
    },
    {
      id: "sme-factoring", cat: "sme", name: "สินเชื่อแฟคเตอริ่ง", img: IMG.sign, source: "https://www.lhbank.co.th/th/sme/",
      tagline: "เปลี่ยนลูกหนี้การค้าเป็นเงินทุน",
      desc: "สินเชื่อแฟคเตอริ่ง ช่วยเปลี่ยนลูกหนี้การค้าให้เป็นเงินทุนหมุนเวียนสำหรับธุรกิจ",
      highlight: { text: "Factoring", label: "ลูกหนี้การค้า → เงินทุน" },
      facts: ["ใช้ลูกหนี้การค้าเป็นฐานวงเงิน", "เสริมสภาพคล่องให้ธุรกิจ"],
      keyfacts: [["Factoring", "ประเภทสินเชื่อ"], ["สภาพคล่อง", "ประโยชน์"], ["1327", "ติดต่อผู้ดูแล"]],
      compare: { rate: null, term: "ตามเงื่อนไขธนาคาร", ltv: "ตามลูกหนี้การค้า", fee: "ตามประกาศธนาคาร" },
      related: ["sme-working-capital"], keywords: "factoring แฟคเตอริ่ง",
    },
    {
      id: "sme-savings", cat: "sme", name: "เงินฝากออมทรัพย์ธุรกิจคุ้มค่า", img: IMG.docs, source: "https://www.lhbank.co.th/th/sme/",
      tagline: "บัญชีออมทรัพย์สำหรับธุรกิจ",
      desc: "บัญชีเงินฝากออมทรัพย์สำหรับลูกค้าธุรกิจ",
      highlight: { text: "คุ้มค่า", label: "ออมทรัพย์สำหรับธุรกิจ" },
      facts: ["บัญชีออมทรัพย์สำหรับธุรกิจ", "บริการที่เกี่ยวข้อง: LH Bank Speedy, Cash Management"],
      keyfacts: [["ธุรกิจ", "ประเภทบัญชี"], ["ออมทรัพย์", "ประเภทเงินฝาก"], ["1327", "ติดต่อผู้ดูแล"]],
      compare: { rate: null, term: "ไม่กำหนด", ltv: "–", fee: "ตามประกาศธนาคาร" },
      related: ["cash-management"], keywords: "business savings",
    },
    /* ---------------- Business services ---------------- */
    {
      id: "cash-management", cat: "business", name: "บริการ Cash Management", img: IMG.tower, source: "https://www.lhbank.co.th/th/sme/",
      tagline: "บริหารการรับ-จ่ายเงินของธุรกิจ",
      desc: "บริการ Cash Management ครอบคลุมการจ่ายเงิน (Payroll, LHB BULK PAYMENT, ORFT, Bahtnet) และการรับชำระเงิน (Bill Payment, LHB Direct Debit)",
      highlight: { text: "Cash Mgmt", label: "Payment & Collection" },
      facts: ["Payroll · LHB BULK PAYMENT · ORFT · Bahtnet", "Bill Payment · LHB Direct Debit"],
      keyfacts: [["Payment", "บริการจ่ายเงิน"], ["Collection", "บริการรับชำระ"], ["Speedy", "Internet Banking"]],
      compare: { rate: null, term: "–", ltv: "–", fee: "ตามแพ็กเกจ" },
      related: ["trade", "payroll"], keywords: "cash management payroll bulk payment",
    },
    {
      id: "payroll", cat: "business", name: "บริการจ่ายเงินเดือน Payroll", img: IMG.meeting, source: "https://www.lhbank.co.th/th/sme/",
      tagline: "จ่ายเงินเดือนพนักงานได้สะดวก",
      desc: "บริการจ่ายเงินเดือน Payroll สำหรับโอนเงินเดือนเข้าบัญชีพนักงาน",
      highlight: { text: "Payroll", label: "จ่ายเงินเดือนพนักงาน" },
      facts: ["โอนเงินเดือนเข้าบัญชีพนักงาน", "ส่วนหนึ่งของบริการ Cash Management"],
      keyfacts: [["Payroll", "บริการ"], ["Cash Mgmt", "กลุ่มบริการ"], ["1327", "ติดต่อผู้ดูแล"]],
      compare: { rate: null, term: "–", ltv: "–", fee: "ตามแพ็กเกจ" },
      related: ["cash-management"], keywords: "payroll เงินเดือน",
    },
    {
      id: "trade", cat: "business", name: "สินเชื่อและบริการการค้าระหว่างประเทศ", img: IMG.travel, source: "https://www.lhbank.co.th/th/sme/",
      tagline: "บริการด้านการนำเข้า ส่งออก และโอนเงินระหว่างประเทศ",
      desc: "สินเชื่อการค้าระหว่างประเทศ บริการด้านการนำเข้า การส่งออก หนังสือค้ำประกันต่างประเทศ และการโอนเงินระหว่างประเทศ",
      highlight: { text: "Trade", label: "นำเข้า · ส่งออก" },
      facts: ["บริการด้านการนำเข้าและการส่งออก", "หนังสือค้ำประกันต่างประเทศ · โอนเงินระหว่างประเทศ"],
      keyfacts: [["Import", "การนำเข้า"], ["Export", "การส่งออก"], ["FX", "บริหารความเสี่ยงค่าเงิน"]],
      compare: { rate: null, term: "ตามเงื่อนไขธนาคาร", ltv: "–", fee: "ตามประกาศธนาคาร" },
      related: ["fx-risk", "cash-management"], keywords: "trade import export",
    },
    {
      id: "fx-risk", cat: "business", name: "บริการบริหารความเสี่ยงอัตราแลกเปลี่ยน", img: IMG.market, source: "https://www.lhbank.co.th/th/sme/",
      tagline: "บริหารความเสี่ยงอัตราแลกเปลี่ยนเงินตราต่างประเทศ",
      desc: "บริการบริหารความเสี่ยงอัตราแลกเปลี่ยนเงินตราต่างประเทศ สำหรับธุรกิจที่มีธุรกรรมระหว่างประเทศ",
      highlight: { text: "FX Hedging", label: "บริหารความเสี่ยงค่าเงิน" },
      facts: ["สำหรับธุรกิจที่มีธุรกรรมต่างประเทศ", "ดูอัตราแลกเปลี่ยนล่าสุดได้บนเว็บไซต์"],
      keyfacts: [["FX", "อัตราแลกเปลี่ยน"], ["Hedging", "บริหารความเสี่ยง"], ["1327", "ติดต่อผู้ดูแล"]],
      compare: { rate: null, term: "–", ltv: "–", fee: "ตามประกาศธนาคาร" },
      related: ["trade"], keywords: "fx hedging forward",
    },
  ];

  /* Products without a scraped detail page show their real headline facts;
     full terms come from the bank's CMS / announcements in the real build. */
  products.forEach((p) => {
    if (!p.benefits) p.benefits = p.facts.map((f, i) => [["check", "sparkle", "shield", "headset"][i % 4], f, ""]);
    if (!p.eligibility) p.eligibility = ["คุณสมบัติและเงื่อนไขเป็นไปตามหลักเกณฑ์ที่ธนาคารกำหนด", "สอบถามรายละเอียดได้ที่ LH Bank Call Center โทร 1327"];
    if (!p.fees) p.fees = null;
    if (!p.docs) p.docs = null;
    if (!p.faq) p.faq = [contactFaq];
  });


  /* ---------------- Branches ---------------- */
  const branches = [
    { id: 1, name: "สำนักงานใหญ่ (สาทร)", type: "branch", district: "สาทร", province: "กรุงเทพฯ", addr: "1 อาคารคิวเฮ้าส์ ลุมพินี ถ.สาทรใต้ แขวงทุ่งมหาเมฆ เขตสาทร", lat: 13.7236, lng: 100.5448, tel: "02-359-0000", hours: "wk", services: ["fx", "sme", "wealth", "safe"] },
    { id: 2, name: "สาขาสีลม", type: "branch", district: "บางรัก", province: "กรุงเทพฯ", addr: "อาคารสีลมคอมเพล็กซ์ ถ.สีลม เขตบางรัก", lat: 13.7286, lng: 100.5340, tel: "02-231-3001", hours: "wk", services: ["fx", "wealth"] },
    { id: 3, name: "สาขาเซ็นทรัลเวิลด์", type: "branch", district: "ปทุมวัน", province: "กรุงเทพฯ", addr: "ชั้น 4 ศูนย์การค้าเซ็นทรัลเวิลด์ ถ.ราชดำริ", lat: 13.7466, lng: 100.5393, tel: "02-646-1010", hours: "mall", services: ["fx", "weekend"] },
    { id: 4, name: "สาขาสยามพารากอน", type: "branch", district: "ปทุมวัน", province: "กรุงเทพฯ", addr: "ชั้น G ศูนย์การค้าสยามพารากอน ถ.พระราม 1", lat: 13.7462, lng: 100.5347, tel: "02-610-7777", hours: "mall", services: ["fx", "weekend", "wealth"] },
    { id: 5, name: "สาขาเอ็มควอเทียร์", type: "branch", district: "วัฒนา", province: "กรุงเทพฯ", addr: "ชั้น 3 ศูนย์การค้าเอ็มควอเทียร์ ถ.สุขุมวิท", lat: 13.7317, lng: 100.5697, tel: "02-003-6060", hours: "mall", services: ["fx", "weekend", "wealth"] },
    { id: 6, name: "สาขาทองหล่อ", type: "branch", district: "วัฒนา", province: "กรุงเทพฯ", addr: "ถ.สุขุมวิท 55 (ทองหล่อ) แขวงคลองตันเหนือ", lat: 13.7340, lng: 100.5832, tel: "02-381-2299", hours: "wk", services: ["wealth", "safe"] },
    { id: 7, name: "ศูนย์ธุรกิจ SME รัชดาภิเษก", type: "sme", district: "ห้วยขวาง", province: "กรุงเทพฯ", addr: "ถ.รัชดาภิเษก แขวงห้วยขวาง", lat: 13.7700, lng: 100.5735, tel: "02-275-8800", hours: "wk", services: ["sme", "fx"] },
    { id: 8, name: "สาขาเซ็นทรัลลาดพร้าว", type: "branch", district: "จตุจักร", province: "กรุงเทพฯ", addr: "ชั้น 3 เซ็นทรัลพลาซา ลาดพร้าว", lat: 13.8163, lng: 100.5606, tel: "02-541-1515", hours: "mall", services: ["weekend", "fx"] },
    { id: 9, name: "สาขาเดอะมอลล์บางกะปิ", type: "branch", district: "บางกะปิ", province: "กรุงเทพฯ", addr: "ชั้น 2 เดอะมอลล์ บางกะปิ ถ.ลาดพร้าว", lat: 13.7660, lng: 100.6430, tel: "02-363-3456", hours: "mall", services: ["weekend"] },
    { id: 10, name: "สาขาเซ็นทรัลพระราม 9", type: "branch", district: "ห้วยขวาง", province: "กรุงเทพฯ", addr: "ชั้น 4 เซ็นทรัลพลาซา พระราม 9", lat: 13.7588, lng: 100.5655, tel: "02-160-0990", hours: "mall", services: ["weekend", "fx", "wealth"] },
    { id: 11, name: "สาขาไอคอนสยาม", type: "branch", district: "คลองสาน", province: "กรุงเทพฯ", addr: "ชั้น 2 ไอคอนสยาม ถ.เจริญนคร", lat: 13.7266, lng: 100.5104, tel: "02-288-0880", hours: "mall", services: ["fx", "weekend", "wealth"] },
    { id: 12, name: "ศูนย์ธุรกิจ SME บางนา", type: "sme", district: "บางนา", province: "กรุงเทพฯ", addr: "ถ.บางนา-ตราด กม.3", lat: 13.6680, lng: 100.6340, tel: "02-398-1234", hours: "wk", services: ["sme"] },
    { id: 13, name: "สาขาเซ็นทรัลเวสต์เกต", type: "branch", district: "บางใหญ่", province: "นนทบุรี", addr: "ชั้น 2 เซ็นทรัลเวสต์เกต อ.บางใหญ่", lat: 13.8765, lng: 100.4120, tel: "02-194-2525", hours: "mall", services: ["weekend"] },
    { id: 14, name: "สาขาเมืองทองธานี", type: "branch", district: "ปากเกร็ด", province: "นนทบุรี", addr: "ถ.แจ้งวัฒนะ อ.ปากเกร็ด", lat: 13.9120, lng: 100.5480, tel: "02-503-4545", hours: "wk", services: ["sme", "fx"] },
    { id: 15, name: "สาขาเมกาบางนา", type: "branch", district: "บางพลี", province: "สมุทรปราการ", addr: "ชั้น 1 เมกาบางนา อ.บางพลี", lat: 13.6466, lng: 100.6800, tel: "02-105-1919", hours: "mall", services: ["weekend", "fx"] },
    { id: 16, name: "สาขาฟิวเจอร์พาร์ค รังสิต", type: "branch", district: "ธัญบุรี", province: "ปทุมธานี", addr: "ชั้น 2 ฟิวเจอร์พาร์ค รังสิต", lat: 13.9890, lng: 100.6170, tel: "02-958-0303", hours: "mall", services: ["weekend"] },
  ];
  const services = { fx: ["globe", "แลกเปลี่ยนเงินตรา"], sme: ["store", "บริการลูกค้าธุรกิจ"], wealth: ["sparkle", "ที่ปรึกษาการลงทุน"], safe: ["lock", "ตู้นิรภัย"], weekend: ["calendar", "เปิดเสาร์-อาทิตย์"] };

  /* ---------------- Exchange rates (THB per 1 unit) ---------------- */
  const currencies = [
    { code: "USD", name: "US Dollar", th: "ดอลลาร์สหรัฐ", flag: "🇺🇸", region: "americas", buyTT: 32.55, buyNote: 32.42, sell: 32.95, unit: 1 },
    { code: "EUR", name: "Euro", th: "ยูโร", flag: "🇪🇺", region: "europe", buyTT: 37.62, buyNote: 37.40, sell: 38.21, unit: 1 },
    { code: "GBP", name: "Pound Sterling", th: "ปอนด์สเตอร์ลิง", flag: "🇬🇧", region: "europe", buyTT: 43.80, buyNote: 43.52, sell: 44.55, unit: 1 },
    { code: "JPY", name: "Japanese Yen", th: "เยน (ต่อ 100)", flag: "🇯🇵", region: "asia", buyTT: 21.48, buyNote: 21.30, sell: 22.05, unit: 100 },
    { code: "CNY", name: "Chinese Yuan", th: "หยวน", flag: "🇨🇳", region: "asia", buyTT: 4.48, buyNote: 4.40, sell: 4.62, unit: 1 },
    { code: "SGD", name: "Singapore Dollar", th: "ดอลลาร์สิงคโปร์", flag: "🇸🇬", region: "asia", buyTT: 24.92, buyNote: 24.75, sell: 25.40, unit: 1 },
    { code: "HKD", name: "Hong Kong Dollar", th: "ดอลลาร์ฮ่องกง", flag: "🇭🇰", region: "asia", buyTT: 4.15, buyNote: 4.10, sell: 4.26, unit: 1 },
    { code: "TWD", name: "Taiwan Dollar", th: "ดอลลาร์ไต้หวัน", flag: "🇹🇼", region: "asia", buyTT: 1.00, buyNote: 0.97, sell: 1.06, unit: 1 },
    { code: "KRW", name: "Korean Won", th: "วอน (ต่อ 1,000)", flag: "🇰🇷", region: "asia", buyTT: 23.10, buyNote: 22.80, sell: 24.20, unit: 1000 },
    { code: "AUD", name: "Australian Dollar", th: "ดอลลาร์ออสเตรเลีย", flag: "🇦🇺", region: "oceania", buyTT: 21.25, buyNote: 21.05, sell: 21.80, unit: 1 },
    { code: "NZD", name: "New Zealand Dollar", th: "ดอลลาร์นิวซีแลนด์", flag: "🇳🇿", region: "oceania", buyTT: 19.40, buyNote: 19.20, sell: 19.98, unit: 1 },
    { code: "CHF", name: "Swiss Franc", th: "ฟรังก์สวิส", flag: "🇨🇭", region: "europe", buyTT: 37.05, buyNote: 36.80, sell: 37.80, unit: 1 },
    { code: "CAD", name: "Canadian Dollar", th: "ดอลลาร์แคนาดา", flag: "🇨🇦", region: "americas", buyTT: 23.70, buyNote: 23.50, sell: 24.25, unit: 1 },
    { code: "MYR", name: "Malaysian Ringgit", th: "ริงกิต", flag: "🇲🇾", region: "asia", buyTT: 7.30, buyNote: 7.18, sell: 7.62, unit: 1 },
  ];

  /* ---------------- Funds ----------------
     Only fund codes that appear in LH Bank's own campaign banners.
     NAV / performance come from the AMC feed in the real build — not invented here. */
  const funds = [
    { code: "LHSET100RMF", type: "RMF", note: "จากแบนเนอร์ IPO บนเว็บไซต์ LH Bank", banner: "banner-ipo-lhset100rmf.jpg" },
    { code: "LHAIRMF", type: "RMF", note: "จากแบนเนอร์ IPO บนเว็บไซต์ LH Bank" },
  ];

  return { categories, products, branches, services, currencies, funds, IMG };
})();
