/* ============================================================
   app.js — 渲染逻辑（双语 / 视图 / 对比 / echarts）
   ============================================================ */

let LANG = 'en';
const t = k => (TEXT[k] ? (TEXT[k][LANG] || TEXT[k]['en']) : k);
const P = PLATFORMS;
const catOf = p => CAT[p.cat];
const esc = s => String(s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ================= 文案字典（含分类/洞察内容） ================= */
const TEXT = {
  title: { en:"M&A Matchmaking · Business Models", zh:"并购撮合平台 · 商业模式" },
  subtitle: { en:"32 platforms · 6 archetypes · Interactive analysis", zh:"32家平台 · 6类原型 · 交互分析" },
  nav_overview: { en:"Overview", zh:"全景总览" },
  nav_canvas: { en:"Business Model Canvas", zh:"商业模式画布" },
  nav_cases: { en:"Case Studies", zh:"案例详细拆解" },
  nav_bm: { en:"Business Model Hypothesis", zh:"商业模式假设" },
  nav_flows: { en:"Business Flows", zh:"业务流程图" },
  nav_data: { en:"Data & Metrics", zh:"数据与指标" },
  nav_taxonomy: { en:"Taxonomy & Logic", zh:"分类与逻辑" },
  nav_insights: { en:"Insights", zh:"洞察总结" },
  ov_kicker: { en:"GLOBAL & CHINA · 32 PLATFORMS · V1–V4 FRAMEWORK", zh:"全球与中国 · 32家平台 · V1–V4 框架" },
  ov_title: { en:"M&A Matchmaking Platform Business Model Research", zh:"并购撮合平台商业模式研究" },
  ov_deck: { en:"A systematic study of 32 M&A matchmaking platforms across the US, Japan, Europe and China — dissected with a unified V1–V4 framework to answer one question: how do these platforms actually make money, and why do most fail?", zh:"系统调研美国、日本、欧洲、中国 32 家并购撮合相关平台与机构，以统一的 V1–V4 框架穿透式解剖六大商业原型，回答一个核心问题：并购撮合平台究竟如何赚钱，又为什么大多失败？" },
  search: { en:"Search platform…", zh:"搜索平台…" },
  compare: { en:"Compare (up to 3)", zh:"对比（最多3家）" },
  compare_pick: { en:"Select up to 3 platforms to compare", zh:"最多选3家平台进行对比" },
  ch_scatter: { en:"Scale vs Margin (listed cos)", zh:"规模 vs 利润率（上市公司）" },
  ch_cashflow: { en:"Cashflow × Delivery (all 32)", zh:"现金流 × 交付模式（32家）" },
  ch_fee: { en:"Revenue benchmark (listed cos)", zh:"营收基准（上市公司）" },
  dt_title: { en:"Full data table (32 platforms)", zh:"全量数据表（32家平台）" },
  foot: { en:"Sources: proprietary research + Gemini deep-dive (audited filings / Form 990 / official pricing pages). Model estimates are labeled.", zh:"来源：自有调研 + Gemini 深度报告（经审计财报 / Form 990 / 官方定价页）。模型测算已标注。" },
  bmc_vp:{en:"Value Proposition",zh:"价值主张"}, bmc_cs:{en:"Customer Segments",zh:"客户细分"},
  bmc_ch:{en:"Channels",zh:"渠道"}, bmc_cr:{en:"Customer Relationships",zh:"客户关系"},
  bmc_rs:{en:"Revenue Streams",zh:"收入来源"}, bmc_ka:{en:"Key Activities",zh:"关键活动"},
  bmc_kr:{en:"Key Resources",zh:"关键资源"}, bmc_kp:{en:"Key Partners",zh:"关键伙伴"},
  bmc_cost:{en:"Cost Structure",zh:"成本结构"},
  axis_feeObject:{en:"Who pays (红)",zh:"收费对象(红)"}, axis_feeUnit:{en:"Fee unit (橙)",zh:"计费单位(橙)"},
  axis_cashflow:{en:"Cashflow (绿)",zh:"现金流(绿)"}, axis_delivery:{en:"Delivery (蓝)",zh:"交付模式(蓝)"},
  axis_channel:{en:"Channel (黑)",zh:"获客渠道(黑)"},
  fee_legend:{en:"red node = fee collection point",zh:"红色节点 = 收费点"},
  empty_compare:{en:"No platforms selected.",zh:"尚未选择平台。"},
  compare_off:{en:"Exit compare",zh:"退出对比"},
  v14_v1:{en:"V1 Value prop & 3-party",zh:"V1 价值主张与三方拆解"},
  v14_v2:{en:"V2 Pricing & timing",zh:"V2 收费机制与时点"},
  v14_v3:{en:"V3 Cost & delivery",zh:"V3 成本结构（人/系统）"},
  v14_v4:{en:"V4 Unit economics",zh:"V4 单位经济与抗周期"},
  v14_timing:{en:"Timing",zh:"时点"},
  v14_fee:{en:"Fee",zh:"费率"},
  v14_delivery:{en:"Delivery",zh:"交付"},
  v14_rev:{en:"Rev",zh:"营收"},
  v14_margin:{en:"Margin",zh:"利润率"},
  v14_deals:{en:"Deals",zh:"成交"},
  v14_acv:{en:"ACV",zh:"客单"},
};

/* ================= 四项核心判断 ================= */
const JUDGMENTS = [
  { t:{en:"Pure online matchmaking fails above $1M", zh:"纯线上撮合在$100万以上天然失效"}, d:{en:"4 structural frictions (low frequency, secrecy, adverse selection, offline disintermediation); only standardized digital assets (<$1M) can be fully productized.", zh:"四重结构性摩擦（低频、保密、逆向选择、线下跳单）；只有标准化数字资产(<$100万)能产品化。"} },
  { t:{en:"Fee timing decides survival", zh:"收费时点决定生死"}, d:{en:"Success-fee advisory hits 31–38% margin in bull cycles but bleeds in freezes (Huaxing IB -42.6%); upfront dues/cert/SaaS stay cash-positive even at -50% volume.", zh:"成功费顾问牛市31–38%利润率但寒冬失血（华兴投行-42.6%）；前置会费/认证/SaaS在-50%成交量下仍正现金流。"} },
  { t:{en:"C-class moat = trust filters, not listings", zh:"C类护城河=信任滤网，不是挂牌"}, d:{en:"ACG: $2,931万 revenue, 17.8% salary ratio, 9.3-month cash cushion; never competes with members for commissions.", zh:"ACG：$2931万营收、17.8%薪酬占比、9.3个月现金垫；绝不与会员争佣金。"} },
  { t:{en:"China needs institutional adaptation", zh:"中国需制度性适配"}, d:{en:"SOE mandatory exchange (32号令/17号文); Zero2IPO data ¥6,993万 (<1/65 of PitchBook); 2025 buyout exits +84.3% to 352 deals.", zh:"国资强制进场(32号令/17号文)；清科数据¥6993万(<PitchBook 1/65)；2025并购退出+84.3%至352笔。"} },
];

/* ================= 六类分类描述 ================= */
const CAT_DESC = {
  A: { en:"Online matchmaking — list & match, monetize via listing/subscription/success fee.", zh:"线上撮合——挂牌+匹配，靠刊登/订阅/成交费变现。" },
  B: { en:"Offline heavy-delivery advisory — success fee, high human, 30%+ margin.", zh:"线下重交付顾问——成功费、重人力、30%+利润率。" },
  C: { en:"Network / certification — dues + cert + events, zero transaction cut.", zh:"网络/认证——会费+认证+活动，零成交抽成。" },
  D: { en:"Data / infrastructure — subscription, highest stickiness & ACV.", zh:"数据/基础设施——订阅，粘性与客单最高。" },
  E: { en:"China / institutional — data+FA+B2G, or rule-based exchange.", zh:"中国本土/制度——数据+FA+B2G，或规则型交易所。" },
  F: { en:"Failed / stalled — autopsy for the \"death valley\" laws.", zh:"失败/停滞——“死亡谷”铁律的尸检。" },
};

/* ================= 底层规律 ================= */
const LAWS = [
  { n:"Frictions", t:{en:"4 structural frictions — why M&A resists the internet", zh:"四重结构性摩擦——为什么并购天然反互联网"}, body:{en:"Consumer platforms need high-frequency, standardized, transparent, online-settled transactions. M&A inverts all four:", zh:"消费互联网平台需要高频、标准化、透明、在线结算。并购把这四点全部反转："}, items:[
    {en:"Extremely low frequency — a founder sells once (one-shot game), no repeat purchase.", zh:"极低频——老板一生只卖一次（一次性博弈），无复购。"},
    {en:"Strong secrecy — deals can't be openly listed without destroying value.", zh:"强保密——公开挂牌会摧毁交易价值。"},
    {en:"Adverse selection — open boards attract lemons; good assets stay off-market.", zh:"逆向选择——开放挂牌吸引次品，好资产不上网。"},
    {en:"Offline disintermediation — parties jump the platform and settle directly.", zh:"线下跳单——买卖双方绕过平台私下成交。"},
  ]},
  { n:"Iron laws", t:{en:"3 iron laws of pricing & cashflow", zh:"三条铁律——定价与现金流"}, body:{en:"Across 32 platforms, three laws recur:", zh:"32家平台反复印证三条规律："}, items:[
    {en:"Pricing anchor = depth: charge on outcome (success fee) → deep & big; charge on info/exposure (listing/subscription) → shallow & small.", zh:"定价锚点=深浅：按结果（成交费）→做得深、赚大钱；按信息/曝光（刊登/订阅）→做得浅、赚小钱。"},
    {en:"Cashflow timing: upfront (dues/cert/SaaS) = survival; backend (success fee) = scale; leaders go hybrid.", zh:"现金流时点：前置（会费/认证/SaaS）=生存；后置（成功费）=规模；头部走向混合。"},
    {en:"Incumbents charge upfront, challengers go zero-upfront (Japan: Nihon M&A Center retainer vs M&A Research Institute zero).", zh:"先发者收前置费、后发者零预付（日本：M&Aセンター收着手金 vs M&A综研零预付）。"},
  ]},
  { n:"Engines", t:{en:"4 engines of the C-class cash cow", zh:"四大引擎——C类现金牛的变现机制"}, body:{en:"ACG / IBBA / AM&AA / IMAA hide four reusable engines:", zh:"ACG/IBBA/AM&AA/IMAA 藏着四套可复用的引擎："}, items:[
    {en:"1-on-1 meeting seats: price the matchmaking as pre-paid meeting slots (DealMAX, full payment before access).", zh:"1对1约见席位：把撮合定价为预付约见席位（DealMAX，先全款后进场）。"},
    {en:"Federal volunteer governance: 47 chapters, elite volunteers, salary only 17.8% of expense.", zh:"联邦制志愿者治理：47分会、精英志愿者，薪酬仅占支出17.8%。"},
    {en:"Negative-net-cost tool bundle: $475 dues unlock $5,000+ tools — renewal becomes arithmetic.", zh:"负净成本工具包：$475会费换$5000+工具——续费变成算术题。"},
    {en:"Certification = lifetime annuity: $2,150–5,495 course + $595/yr renewal = CAC recovery + lock-in.", zh:"认证=终身年金：$2150–5495课程+$595/年续证=回本获客+锁定。"},
  ]},
  { n:"Death laws", t:{en:"5 death laws of pure matchmaking", zh:"五大死亡铁律——纯撮合为何死"}, body:{en:"MARR / DealNexus / BankerBay / DealStream died of the same structural knots:", zh:"MARR/DealNexus/BankerBay/DealStream 死于同一套结构性死结："}, items:[
    {en:"Traffic-gene mismatch: readers/tool users ≠ sellers with inventory.", zh:"流量基因错配：读者/工具用户 ≠ 有库存的卖方。"},
    {en:"Parent-channel conflict: MARR's parent (M&A Capital Partners) locked good deals offline — platform got only leftovers.", zh:"母子渠道冲突：MARR母公司(M&Aキャピタル)把好标的锁在线下——平台只捡尾货。"},
    {en:"Geographic/category dilution: 1,000 users in 1 year = liquidity frozen (vs TRANBI 135k buyers).", zh:"地域/品类稀释：1年1000用户=流动性冻僵（对比TRANBI 13.5万买方）。"},
    {en:"Monetization-cost inversion: no upfront subscription to cover fixed costs.", zh:"变现-成本倒挂：无前置订阅兜底固定成本。"},
    {en:"Worshipping software, underestimating trust delivery: matching UI ≠ trust-building.", zh:"迷信软件、低估信任交付：匹配界面 ≠ 信任构建。"},
  ]},
];

/* ================= 洞察内容 ================= */
const INSIGHTS = {
  summary: { en:"All durable M&A models converge on one truth: matchmaking is a slow-compounding TRUST business, not a traffic red ocean.", zh:"所有穿越周期的并购模式都指向同一本质：撮合是慢复利的信任生意，不是流量红海。" },
  sections: [
    { title:{en:"1. Income constitution: 85% upfront + 15% back-end, never charge members commissions", zh:"1. 收入宪法：85%前置+15%后端，绝不向会员抽成"}, body:{en:"The moment a platform eyes its members' deal commissions, advisors treat it as a rival and stop sharing real deals — it degrades into a junk-lead pool in 6 months. Correct mix: dues 25–30% + double-tier certification 25–30% + flagship 1-on-1 summit tickets & sponsorship 40–50%. Capture back-end value only via direct-seller one-off service (RMB 10k–30k) or dispatching deals to top-certified advisors — never by taking a cut of member trades.", zh:"平台一旦盯着会员的成交佣金，顾问就把你当对手、停止分享真实项目——半年内退化为垃圾线索池。正确组合：会费25–30% + 双层认证25–30% + 旗舰1对1峰会门票与赞助40–50%。后端价值只通过直连卖方一次性服务费(1–3万)或派单给顶级认证顾问捕获，绝不碰会员交易抽成。"} },
    { title:{en:"2. Double-tier certification = CAC recovery + trust firewall", zh:"2. 双层认证=获客回本+信任防火墙"}, body:{en:"Tier 1 practical credential (CM&AA/IMAA style, RMB 6,800–12,800 online / 18,800–32,800 offline) targets switching FAs, lawyers, CPAs, corp-dev; Tier 2 master credential (M&AMI style) requires 2–3 closed deals — the firewall against adverse selection. Annual renewal + CPE turns one-time students into 5–10 year annuities.", zh:"第一层实战执业级（对标CM&AA/IMAA，线上¥6800–12800/线下¥18800–32800）瞄准转型FA、律师、CPA、战投；第二层大师实绩级（对标M&AMI）需2–3笔交割案例——防逆向选择的防火墙。年续费+CPE把一次性学员变成5–10年年金。"} },
    { title:{en:"3. Engineering the negative-net-cost member bundle → 80%+ renewal", zh:"3. 工程化负净成本会员包 → 80%+续费率"}, body:{en:"Procure VDR / company-data / AI-DD tools in bulk and give them to members free (vendors treat it as marketing; members save thousands). Add a zero-cost exclusive valuation-multiples whitepaper (survey members, full data members-only) + official verifiable credential homepage. Renewal stops being a feeling and becomes arithmetic.", zh:"集采VDR/企业数据/AI尽调工具免费送给会员（厂商当营销、会员省数千）。叠加零成本独家估值倍数白皮书（会员问卷，全量数据仅会员可见）+官方可查验认证主页。续费从“感觉”变成“算术题”。"} },
    { title:{en:"4. Federal lean-HQ + volunteer chapters (salary ≤17.8%)", zh:"4. 联邦制轻总部+志愿者分会（薪酬≤17.8%）"}, body:{en:"Y1 HQ 4–6 people; even at scale keep ≤15. Recruit 5–8 local heavyweights (bank MDs, M&A law partners, Big-4 partners, PE directors) as unpaid chapter execs — they get prestige and deal flow; HQ gives brand, playbook, meeting system, and local profit-sharing.", zh:"Y1总部4–6人，成熟期也≤15人。遴选5–8名当地重量级人物（券商并购部负责人、并购律所合伙人、四大交易咨询合伙人、产业PE/上市公司战投总监）做无薪分会执委——他们得声望与案源，总部给品牌、手册、约见系统与地方净结余分成。"} },
    { title:{en:"5. Matchmaking: three don'ts, three musts", zh:"5. 撮合：三不做、三必做"}, body:{en:"Don't: (1) build a heavy public listing platform; (2) open the deal library to unverified retail/intermediaries; (3) build a high-salary in-house FA team that competes with members. Must: (1) build a Dealsuite-style institutional intranet + M&A Cloud-style buyer reveal (buyers publish their real acquisition criteria/funds); (2) run a DealMAX-style flagship 1-on-1 summit (full pre-payment, 15–25 meetings × 30 min); (3) enforce a peer credit blacklist.", zh:"不做：(1)重资产公开挂牌平台；(2)向未实名散户/二手中介开放项目库；(3)高底薪自营FA团队与会员抢生意。必做：(1)Dealsuite式机构内网+M&A Cloud式买方亮牌（买方公开真实收购画像/资金）；(2)DealMAX式旗舰1对1峰会（先全款、15–25场×30分钟）；(3)同行信用黑名单。"} },
    { title:{en:"6. Ride China's 2025–26 M&A structural dividend", zh:"6. 切入中国2025–26并购结构红利"}, body:{en:"Target mid-market industrial M&A (revenue ¥5,000万–10亿, profit ¥1,000万–1亿) + cross-border, not the crowded early-VC circle. Three golden openings: (1) SOE exchange synergy (embed 32号令/17号文 into certification, absorb exchange broker-members); (2) Japan/Europe seller-supply dividend (succession-driven sellers; Dealsuite's 2,000 advisors × 5.3x EBITDA SMEs); (3) tens of thousands of transitioning financiers needing M&A reskilling.", zh:"瞄准中端产业并购（营收¥5000万–10亿、利润¥1000万–1亿）+跨境，避开内卷的早期VC圈。三个黄金切口：(1)国资交易所协同（把32号令/17号文嵌入认证、吸纳交易所经纪会员）；(2)日欧卖方供给红利（承继驱动的卖方；Dealsuite体系2000顾问×5.3x EBITDA SME）；(3)数万转型金融从业者的并购再教育刚需。"} },
  ],
  lifeLines: { title:{en:"4 operating lifelines", zh:"四条经营生命线"}, items:[
    {en:"Cash cushion ≥ 9 months (all fees fully pre-paid, no long receivables).", zh:"现金垫≥9个月（一切费用先全款，拒绝长账期）。"},
    {en:"Member net renewal ≥ 80% (below 65% → stop expansion, fix value).", zh:"会员净续费率≥80%（低于65%→暂停扩张，回头修价值）。"},
    {en:"Ecosystem ratio — buyers : exclusive sell-side advisors : service providers ≈ 4:4:2 (service providers quota-capped).", zh:"生态配比——买方:独家卖方顾问:服务商≈4:4:2（服务商设总量配额）。"},
    {en:"HQ payroll ≤ 30–45% of total expense.", zh:"总部人力成本≤总支出的30–45%。"},
  ]},
};

/* ================= 财务沙盘 ================= */
const SANDBOX = {
  rows: [
    {label:{en:"Paid members × dues", zh:"付费会员 × 年费"}, y1:"300×¥4,800 = ¥144万", y2:"1,000×¥5,000 = ¥500万", y3:"3,000×¥5,500 = ¥1,650万"},
    {label:{en:"Double-tier cert students", zh:"双层认证学员"}, y1:"100×¥16,000 = ¥160万", y2:"300×¥18,000 = ¥540万", y3:"700×¥20,000 = ¥1,400万"},
    {label:{en:"Summit tickets + sponsorship", zh:"峰会门票+赞助"}, y1:"250×¥4,800+¥80万 = ¥200万", y2:"600×¥5,800+¥250万 = ¥598万", y3:"1,500×¥6,800+¥650万 = ¥1,670万"},
    {label:{en:"Total revenue (100% upfront)", zh:"年总营收（100%前置）"}, y1:"¥504万", y2:"¥1,638万", y3:"¥4,720万", hl:1},
    {label:{en:"HQ headcount & fixed cost", zh:"总部编制 & 固定成本"}, y1:"5人×¥36万+¥50万 = ¥230万", y2:"9人×¥42万+¥110万 = ¥488万", y3:"15人×¥50万+¥250万 = ¥1,000万"},
    {label:{en:"Variable delivery cost", zh:"变动交付成本"}, y1:"¥119万", y2:"¥370万", y3:"¥920万"},
    {label:{en:"EBITDA & margin", zh:"EBITDA & 利润率"}, y1:"+¥155万 (30.8%)", y2:"+¥780万 (47.6%)", y3:"+¥2,800万 (59.3%)", hl:1},
  ],
  cols:{y1:{en:"Cold start (Y1)", zh:"冷启动(第1年)"}, y2:{en:"Growth (Y2)", zh:"成长期(第2年)"}, y3:{en:"Mature (Y3–5)", zh:"成熟期(第3–5年)"}},
  note:{en:"Model estimate (Gemini USD benchmark mapped to RMB). Reserve 10–15% for marketing/compliance buffer.", zh:"模型测算（Gemini美元基准映射人民币）。预留10–15%营销/合规缓冲。"},
};

/* ================= 工具 ================= */
function el(id){ return document.getElementById(id); }
function catDot(c){ return `<span class="dot" style="background:${CAT[c].color}"></span>`; }

/* ================= 语言切换 ================= */
el('langToggle').addEventListener('click', ()=>{
  LANG = LANG==='en' ? 'zh' : 'en';
  el('langToggle').textContent = LANG==='en' ? '中文' : 'EN';
  renderAll();
});

/* ================= 导航 ================= */
let curView = 'overview';
document.querySelectorAll('.nav-item').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    curView = btn.dataset.view;
    document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active', b===btn));
    document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
    el('view-'+curView).classList.add('active');
    renderAll();
  });
});

function renderAll(){
  document.querySelectorAll('[data-t]').forEach(n=>{ if(TEXT[n.dataset.t]) n.textContent = t(n.dataset.t); });
  document.querySelectorAll('[data-t-ph]').forEach(n=>{ n.placeholder = t(n.dataset.tPh); });
  ({overview:renderOverview, canvas:renderCanvas, cases:renderCases, bm:renderBM})[curView]();
}

/* ================= ① OVERVIEW（全景总览：9 Parts） ================= */

// Part 1：六大原型 V1–V4 全景对比表
const ARCHETYPES = [
  { cat:'A', name:{en:'A. Platform marketplace', zh:'A类 平台型市场'},
    v1:{en:"Customer = buyers/sellers/intermediaries · Product = standardized digital / micro-asset leads · solves long-tail liquidity & search efficiency", zh:"客户=买方/卖方/中介 · 商品=标准化数字/小微资产线索 · 解决长尾标的流动性与搜索效率"},
    v2:{en:"Buyer subscription + seller listing fee + escrow close fee (mixed upfront & back-end)", zh:"买方订阅 + 卖方挂牌费 + 托管关账费（混合前置与后置）"},
    v3:{en:"SEO traffic + product R&D; curated (Empire Flippers) adds human vetting & migration", zh:"SEO流量获客 + 产品研发为主；精选型(EF)含人工审核迁移"},
    v4:{en:"Pure-directory = high margin & resilient; commission models swing with volume (-30%~-50%)", zh:"纯目录型高毛利抗跌；抽佣型受交易量波动显著（-30%至-50%）"},
  },
  { cat:'B', name:{en:'B. Japan advisory', zh:'B类 日本顾问型'},
    v1:{en:"Customer = SME sellers & buyers · Product = end-to-end closing certainty · solves aging-succession rigid demand", zh:"客户=中小企业卖方与买方 · 商品=端到端交割确定性 · 解决老龄化事业承继刚需"},
    v2:{en:"Seller zero-upfront + post-close dual-sided Lehman fee (high back-end, ¥45M–100M/deal)", zh:"卖方零预付 + 成交后双边莱曼费率（高后置，单笔4,500万–1亿日元）"},
    v3:{en:"Heavily human: 38–41% of opex is advisor comp; high channel/bank commission", zh:"极度重人：营业成本38%-41%为顾问绩效，渠道/银行分成高"},
    v4:{en:"Top OPM 37–38.4%, but highly cycle-dependent; hiring backfires on per-capita productivity", zh:"头部OPM高达37%-38.4%，但高度依赖成交周期，扩招易反噬人效"},
  },
  { cat:'C', name:{en:'C. Network / certification (focus)', zh:'C类 · 焦点 网络/协会型'},
    v1:{en:"Customer = professional intermediaries/PE/service providers · Product = trust endorsement, meeting efficiency, certification · removes counterparty trust cost", zh:"客户=职业中介/PE/服务商 · 商品=信任背书、约见效率、职业认证 · 消除交易对手方信任成本"},
    v2:{en:"ZERO transaction cut! All-upfront annual dues + summit pre-paid tickets + cert training + sponsorship", zh:"零成交抽成！全前置年费 + 峰会预付票 + 认证培训 + 赞助"},
    v3:{en:"Ultra-lean HQ (ACG payroll only 17.8%) + federal volunteer chapter collaboration", zh:"超轻总部（ACG人力仅占17.8%）+ 联邦制地方分会志愿者协同"},
    v4:{en:"Extremely healthy cashflow: revenue only ~-12% under freeze + halving; 9-month+ cash cushion", zh:"现金流极度健康，断融+市场腰斩时营收仅降~12%，9个月+现金垫"},
  },
  { cat:'D', name:{en:'D. Data & infrastructure', zh:'D类 数据与基建'},
    v1:{en:"Customer = PE/VC/IB/corp-dev · Product = structured private data & VDR workflow · reduces DD & sourcing information gap", zh:"客户=PE/VC/投行/企业战投 · 商品=结构化私募数据与VDR工作流 · 降低尽调与寻源信息差"},
    v2:{en:"High-ACV annual seat license ($15K–$68K/acct), 95%+ upfront subscription", zh:"高客单年度席位License（$15K–$68K/户），95%+前置订阅"},
    v3:{en:"Very high upfront data collection & AI R&D fixed cost; marginal delivery ≈ zero", zh:"极高前期数据采编与AI研发固定成本，边际交付成本趋近于零"},
    v4:{en:"Strongest freeze-resistance (-5%), but faces consolidation & growth plateau (PitchBook 3.9%)", zh:"抗寒冬能力最强（-5%），但面临大厂并购整合与增速见顶（PitchBook 3.9%）"},
  },
  { cat:'E', name:{en:'E. China-local variant', zh:'E类 中国本土变形'},
    v1:{en:"Customer = local gov (B2G) / SOEs / top funds · Product = investment-attraction landing, compliance entry, boutique FA", zh:"客户=地方政府(B2G)/国企/头部基金 · 商品=招商落地、合规进场、精品FA"},
    v2:{en:"Data + marketing mix (Zero2IPO); exchange statutory 0.2%–5% tiered; FA heavily back-end", zh:"数据+营销混合（清科）；产权所法定0.2%-5%分层；FA强后置"},
    v3:{en:"B2G/FA human & relationship cost very high; pure-data willingness-to-pay far below the West", zh:"B2G/FA人力与关系维护成本极高，纯数据付费天花板显著低于欧美"},
    v4:{en:"Institutional fragmentation: buyout exits +84.3% yet market FA under pressure; SOE entry builds regulatory moat", zh:"制度割裂明显：并购退出+84.3%但市场化FA承压，国资进场构筑制度壁垒"},
  },
  { cat:'F', name:{en:'F. Failed / stalled counterexamples', zh:'F类 失败/停滞反例'},
    v1:{en:"Tried to import media/tool traffic for free into pure online mid/large-deal matchmaking", zh:"试图用媒体流量或工具存量免费导入，做成中大型标的纯线上撮合"},
    v2:{en:"Free listing + fantasy of a high back-end success fee", zh:"免费挂牌 + 幻想后端抽取高额成交成功费"},
    v3:{en:"Heavy system dev & marketing spend, lacking real offline closing capability", zh:"高昂系统开发与市场投放，缺乏真正能促成交割的线下履约抓手"},
    v4:{en:"Cold-start failure, zero organic liquidity, severe disintermediation → shutdown or zombie", zh:"双边冷启动失败、零自然流动性、严重跳单，最终注销或沦为僵尸站"},
  },
];

// 六大原型 · 一句话商业逻辑（摘要）
const ARCH_SUMMARY = {
  A: { en:"Turn standardized / micro-asset deals into an online marketplace and monetize volume.", zh:"把标准化/小微资产的买卖做成线上目录+成交，靠流量走量变现。" },
  B: { en:"Heavy-human end-to-end delivery, monetizing on large-deal certainty via success fee.", zh:"重人力端到端交付，靠成功费吃大额交易的确定性。" },
  C: { en:"Sell trust & meeting efficiency via upfront dues + certification + summits — never touch deal commissions.", zh:"卖「信任与约见效率」，靠前置会费+认证+峰会，不碰成交抽成。" },
  D: { en:"Sell the 'data & tooling utilities' of dealmaking via high-ACV upfront subscription.", zh:"卖并购的「数据与工具水电煤」，靠高客单前置订阅。" },
  E: { en:"Bind to government / SOE / institutional dividends; monetize via data + FA + B2G.", zh:"绑定政府/国资/制度红利，靠数据+FA+B2G混合变现。" },
  F: { en:"Tried to funnel free traffic into pure matchmaking — no independent revenue model nor offline execution.", zh:"想用免费流量导入做纯撮合，却无独立商业模式与线下履约。" },
};

// Part 2：生态位矩阵
const NICHE = [
  {x:10,y:12,r:9,label:'Flippa',g:'A'}, {x:20,y:20,r:10,label:'Acquire.com',g:'A'},
  {x:26,y:8,r:11,label:'BizBuySell',g:'A'}, {x:30,y:52,r:10,label:'Empire Flippers',g:'A'},
  {x:52,y:56,r:10,label:'Axial',g:'A'}, {x:56,y:8,r:9,label:'Dealsuite',g:'A'},
  {x:18,y:40,r:8,label:'BATONZ',g:'A'},
  {x:76,y:84,r:14,label:'Japan Big-4',g:'B'}, {x:88,y:92,r:12,label:'Huaxing/FA',g:'B'},
  {x:74,y:60,r:14,label:'ACG',g:'C'}, {x:44,y:66,r:10,label:'IBBA/M&A Source',g:'C'},
  {x:84,y:46,r:14,label:'PitchBook',g:'D'}, {x:90,y:62,r:13,label:'Datasite',g:'D'},
  {x:56,y:34,r:9,label:'MARR MATCHING',g:'F'}, {x:42,y:24,r:9,label:'DealNexus',g:'F'},
  {x:64,y:22,r:8,label:'BankerBay',g:'F'}, {x:39,y:38,r:8,label:'DealStream',g:'F'},
];
const NICHE_COLOR = { A:'#2563eb', B:'#7c3aed', C:'#0d9488', D:'#0d9488', F:'#e51503' };

// Part 3：四重结构性摩擦
const FRICTIONS = [
  { id:'F1', title:{en:'Extreme low-frequency, one-shot game', zh:'极低频一次性博弈'},
    body:{en:"A founder sells once in a lifetime — no repeat purchase, no LTV. CAC must be recovered in a single shot, and seller psychology anchors extremely high.", zh:"企业主一生往往只卖一次公司，无复购、无LTV积累，获客成本必须单次打平，且卖家心理锚定极高。"},
    ev:{en:"Acquire.com: a mere +10% price premium sends buyer interest from 60% → 2%.", zh:"Acquire.com：卖家报价仅溢价10%，买方兴趣率即从60%暴跌至2%。"} },
  { id:'F2', title:{en:'Strong secrecy & the lemon market', zh:'强保密与柠檬市场'},
    body:{en:"A leak triggers staff defection and client churn. Good assets refuse public listing — the open market adversely selects into a pool of lemons.", zh:"挂牌一旦泄露将导致核心员工流失与客户倒戈。优质标的拒绝公开挂网，公开市场天然逆向选择为次品池。"},
    ev:{en:"Dealsuite EU survey: valuation/information gaps alone kill 38% of deals.", zh:"Dealsuite欧洲调研：买卖双方估值与信息分歧直接导致38%的交易流产。"} },
  { id:'F3', title:{en:'Non-standard, heavy execution', zh:'非标重度履约'},
    body:{en:"Information matching is only ~10% of the job; the other 90% is financial cleanup, tax planning, earn-out negotiation and founder psychology.", zh:"信息匹配仅占成交功劳的10%，剩下90%是财务洗白、税务筹划、对赌条款谈判与创始人心理按摩。"},
    ev:{en:"Beyond $1M deal size, self-serve SaaS breaks down — senior human advisors must step in.", zh:"客单价一旦突破$1M，纯自助SaaS流程即刻失效，必须引入资深人工顾问兜底。"} },
  { id:'F4', title:{en:'Offline disintermediation & attribution black hole', zh:'线下跳单与归因黑洞'},
    body:{en:"Deals run 6–18 months; parties meet on the platform then privately reconnect and settle off-platform — the platform has no enforcement or attribution audit.", zh:"并购周期长达6–18个月，双方在平台认识后极易私下建联并换壳交割，平台既无执法权也难做归因审计。"},
    ev:{en:"Break it: either lock the asset migration (Empire Flippers) or drop commission for upfront dues/tools (ACG/Dealsuite).", zh:"破局：要么控死资产迁移（Empire Flippers），要么放弃抽佣改收前置会员/工具费（ACG/Dealsuite）。"} },
];

// 企业图文介绍（32 家，双语）
const INTRO = {
  acquire:{en:"Founded 2020 in the US. A verified self-serve marketplace for buying & selling startups and online businesses (SaaS, e-commerce, content). Core business: a productized deal flow — NDA → LOI → due diligence → escrow — with buyer funds verification, no broker involved. Earns via seller closing fees (6–8%) + monthly listing fees + buyer memberships (from $390/yr).", zh:"2020年成立于美国。自助买卖初创与线上生意（SaaS、电商、内容站）的验证式市场。核心业务：产品化的交易流程（NDA→意向书→尽调→托管）加买方验资，无需经纪。靠卖方成交费(6–8%)+月刊登费+买方会员费($390/年起)赚钱。"},
  flippa:{en:"Founded 2009. A wide-open marketplace & auction for websites, apps, domains and online businesses — from a $200 domain to a $1M store. Core business: listing + auction + escrow (FlippaPay). Earns via listing fees ($15–99) + success fees (5–15%, 10% under $50k).", zh:"2009年创立。网站、App、域名与线上生意的开放目录+拍卖市场——从$200域名到$100万店铺都能卖。核心业务：挂牌+拍卖+托管(FlippaPay)。靠刊登费($15–99)+成交费(5–15%，$5万以下10%)赚钱。"},
  empire:{en:"Founded 2012 in the US (Justin Cooke & Joe Magnotti). A curated marketplace + brokerage — every listing is human-vetted before going live. Core business: vetting (2–6 weeks), matching, negotiation and migration support. Earns via seller commission only (15%→2.5%, flat $10k under $70k). $600M+ GMV, 2,688 deals.", zh:"2012年成立于美国（Justin Cooke 与 Joe Magnotti 创立）。策展式市场+经纪——每个挂牌都经人工审核。核心业务：审核(2–6周)、匹配、谈判与迁移支持。仅靠卖方佣金(15%→2.5%，$7万以下固定$1万)。累计$600M+成交额、2,688笔。"},
  bizbuysell:{en:"Founded 1996, part of CoStar Group. The largest US small-business-for-sale directory. Core business: pure advertising/directory — sellers & brokers pay to list, buyers browse 3M+ monthly visitors for free. Earns via listing fees only ($59–349/mo), zero transaction cut.", zh:"1996年创立，隶属 CoStar 集团。美国最大的小企业出售目录。核心业务：纯广告/目录——卖方与经纪人付费刊登，买方免费浏览300万+月访客。仅靠刊登费($59–349/月)赚钱，零成交抽成。"},
  dealstream:{en:"Founded 2006 (formerly MergerNetwork), global. A broad B2B deal marketplace & community across M&A, financing and commercial real estate. Core business: premium listing access + direct-contact rights. Earns via buyer subscription (Pro $40/mo, free tier $0), zero success fee.", zh:"2006年创立（原 MergerNetwork），全球覆盖。横跨并购、融资、商业地产的广覆盖B2B交易市场与社区。核心业务：优质挂牌访问权+直接联系权。靠买方订阅(Pro $40/月，免费版$0)赚钱，零成功费。"},
  axial:{en:"Founded 2010 in New York (Peter Lehrman). A lower-middle-market private deal network — sell-side advisors post confidential deals, buy-side members see them. Core business: confidential deal distribution + buyer preference matching + introductions. Earns via buyer success fee (Lehman 5/4/3/2/1%), sell-side free. $25B+ closed deals.", zh:"2010年创立于纽约（Peter Lehrman）。中低端市场私有交易网络——卖方顾问发保密项目，买方会员看项目。核心业务：保密项目分发+买方偏好匹配+建联。靠买方成交费(Lehman 5/4/3/2/1%)，卖方免费。累计$250亿成交。"},
  dealsuite:{en:"Founded 2017 in the Netherlands (Deal Value Group). A European SME deal-sourcing SaaS for M&A professionals. Core business: cross-border deal flow + matching alerts + market intelligence. Earns via pure subscription priced by buyer company size (€5k–15k/yr), zero success fee. 1,000+ members, 60+ countries.", zh:"2017年创立于荷兰（Deal Value Group）。面向欧洲M&A从业者的SME找项目SaaS。核心业务：跨境项目流+匹配提醒+市场情报。靠纯订阅、按买方公司规模定价(€5k–15k/年)，零成功费。1,000+会员、60+国。"},
  batonz:{en:"Founded 2019 in Japan, listed on Tokyo Stock Exchange (Growth). Japan's largest small-business M&A platform. Core business: free listing + AI matching + tax-accountant partner network. Earns via seller premium support (¥2M–15M, mandatory for equity transfer) + buyer 2% + buyer monthly memberships. 300k members.", zh:"2019年创立于日本，东证Growth上市。日本最大小规模M&A平台。核心业务：免费挂牌+AI匹配+税理士伙伴网络。靠卖方进阶服务(200万–1500万，股权转让强制)+买方2%+买方月额会员赚钱。30万会员。"},
  tranbi:{en:"Japanese small-M&A platforms (TRANBI 2015; M&A Cloud; fundbook). Core business: seller-free listing + matching, monetized on the buyer side. Earns via buyer success fee (TRANBI 3%, min ¥300k; M&A Cloud buyer closed-plan).", zh:"日本小规模M&A平台（TRANBI 2015年；M&Aクラウド；fundbook）。核心业务：卖方免费挂牌+匹配，向买方变现。靠买方成交费（TRANBI 3%、最低30万日元；M&Aクラウド买方closed plan）赚钱。"},
  nmac:{en:"Founded 1991 in Japan, listed on Tokyo Stock Exchange (Prime). Japan's #1 M&A advisory. Core business: full-service sell-side advisory for SME business succession, fed by an 850-branch network of accounting firms & regional banks. Earns via retainer (¥1M–6M) + Lehman success fee (5→1%, min ¥20M). ¥44B revenue, 37.9% margin, 1,000+ deals/yr.", zh:"1991年创立于日本，东证Prime上市。日本最大M&A顾问。核心业务：面向中小企业事业承继的全流程卖方顾问，获客靠850拠点（会计事务所+地银）网络。靠着手金(100–600万)+Lehman成功费(5→1%，最低2000万)。营收440亿、利润率37.9%、年成约1000+件。"},
  macp:{en:"Founded 2005 in Japan, listed (Prime). An independent M&A advisory strong in business succession. Core business: sourcing, valuation and execution for mid/small-cap deals. Earns via success fee. ¥22.5B revenue, 31.7% margin.", zh:"2005年创立于日本，Prime上市。聚焦事业承继的独立M&A顾问。核心业务：中小并购的案源、估值与执行。靠成功费赚钱。营收225亿、利润率31.7%。"},
  strike:{en:"Founded 1997 in Japan, listed (Prime). A zero-retainer M&A advisory. Core business: risk-free sell-side delivery — no upfront fee, charged on the owner's received amount. Earns via Lehman success fee on owner receipt (≤¥400M flat ¥20M, then 5→1%). ¥20.3B revenue, 31% margin.", zh:"1997年创立于日本，Prime上市。零着手金M&A顾问。核心业务：零风险卖方交付——无预付，按卖方实收额计费。靠卖方实收额Lehman成功费(4亿以下固定2000万，然后5→1%)。营收203亿、利润率31%。"},
  masouken:{en:"Founded 2018 in Japan, listed (Prime; now Quants Research Institute Holdings). A media + AI + advisor hybrid. Core business: zero-upfront sell-side advisory at scale, fed by owned media (mastory) + AI matching (Coincidence). Earns via seller Lehman (5→1%, min ¥25M) + buyer mid-fee 10%. ¥16.6B revenue, 28.8% margin, 234 deals/yr.", zh:"2018年创立于日本，Prime上市（现名クオンツ総研HD）。媒体+AI+顾问的混合体。核心业务：规模化零预付卖方顾问，获客靠自营媒体(mastory)+AI匹配(Coincidence)。靠卖方Lehman(5→1%，最低2500万)+买方中间报酬10%。营收166亿、利润率28.8%、年成约234件。"},
  huaxing:{en:"Founded 2005 in China, listed on HKEX (1911.HK). A top Chinese boutique financial advisor (FA). Core business: equity financing + M&A advisory for tech/healthcare/consumer. Earns via success fee (financing 3–5%, M&A 1–3%). 2025 IB revenue fell 42.6% — pivoting to investment management.", zh:"2005年创立于中国，港交所上市(1911.HK)。中国头部精品财务顾问(FA)。核心业务：科技/医疗/消费的股权融资+并购顾问。靠成功费(融资3–5%、并购1–3%)。2025投行收入-42.6%——正转向投资管理。"},
  yikai_taihe:{en:"Chinese boutique FAs (YiKai; Taihe Capital). Core business: elite equity financing & M&A advisory for high-growth companies, relationship-driven. Earns via success fee (financing 2–5%).", zh:"中国精品FA（易凯；泰合资本）。核心业务：面向高成长企业的精英融资+并购顾问，关系驱动。靠成功费(融资2–5%)赚钱。"},
  acg:{en:"Founded 1954, global (Chicago HQ). The most successful middle-market dealmaker membership network. Core business: high-density 1-on-1 meeting seats (DealMAX) + local chapter trust. Earns via 100% upfront non-transaction fees — dues (~$600/yr) + summit tickets ($1,900–2,100) + sponsorships. $29.3M revenue, payroll only 17.8% of expense, 9.3-month cash cushion.", zh:"1954年创立，全球（芝加哥总部）。最成功的中端市场交易者会员网络。核心业务：高密度1对1约见席位(DealMAX)+本地分会信任。靠100%前置非交易收费——会费(约$600/年)+峰会门票($1900–2100)+赞助。营收$2931万，薪酬仅占支出17.8%，现金垫9.3个月。"},
  ibba:{en:"Founded 1984 in the US. The largest main-street business broker association. Core business: CBI certification + a negative-net-cost tool bundle ($475 dues unlock $5,000+ tools) + broker directory. Earns via dues ($475/individual, $675/firm) + CBI course ($2,000–5,000). $2.8M revenue.", zh:"1984年创立于美国。最大的小生意商业经纪人协会。核心业务：CBI认证+负净成本工具包($475会费换$5000+工具)+经纪人名录。靠会费(个人$475/企业$675)+CBI课程($2000–5000)。营收$280万。"},
  masource:{en:"A mid-market M&A advisor association (sister to IBBA under IABI). Core business: the M&AMI credential — a hard deal-track gate requiring 3+ closed deals. Earns via joint dues ($783.75–1,140/yr) + M&AMI certification ($3,000–7,000).", zh:"中端市场并购顾问协会（IBBA 姊妹，同属 IABI）。核心业务：M&AMI 认证——要求3笔以上真实交割的硬门槛。靠联名会费($783.75–1140/年)+M&AMI认证($3000–7000)。"},
  amaa:{en:"Founded 1998 in the US. A cross-disciplinary M&A advisor alliance (FA, CPA, M&A lawyers, valuators). Core business: the CM&AA credential + cross-referral network. Earns via dues ($545/yr) + CM&AA course ($2,150–5,495) + $595/yr renewal annuity.", zh:"1998年创立于美国。跨学科并购顾问联盟（FA、CPA、并购律师、估值师）。核心业务：CM&AA认证+跨专业转介网络。靠会费($545/年)+CM&AA课程($2150–5495)+$595/年续证年金。"},
  imaa:{en:"Founded ~2005, global. A for-profit M&A education & certification institute. Core business: the IM&A (International M&A Expert) designation + global alumni network. Earns via course fees ($3,290 self-paced / $4,390 live / $5,490 in-person) with first-year membership bundled; distributed via ACCA B2B2C.", zh:"约2005年创立，全球。营利性M&A教育与认证机构。核心业务：IM&A（国际并购专家）头衔+全球校友网络。靠课程费($3290自定进度/$4390直播/$5490面授)并捆绑首年会籍；经ACCA B2B2C分销。"},
  pitchbook:{en:"Founded 2007, acquired by Morningstar 2016. The industry-standard private-market data terminal. Core business: structured PE/VC/M&A data + research + analytics, backed by a 1,800-person data team. Earns via high-ACV annual seat licenses ($12k–20k/seat). ~$670M revenue, ~30% margin, 103% net renewal.", zh:"2007年创立，2016被 Morningstar 收购。行业标准的私募市场数据终端。核心业务：结构化PE/VC/并购数据+研报+分析，背后1800人数据团队。靠高客单年度席位License($12k–20k/席)。营收约$6.7亿、利润率约30%、净续约103%。"},
  mergermarket:{en:"Founded 2000, part of ION Analytics. Forward-looking M&A intelligence & news terminal. Core business: exclusive early scoop on upcoming mandates + 1.4M+ company alert signals, powered by a global investigative journalist network. Earns via institutional subscription (from ~$30k/yr).", zh:"2000年创立，属 ION Analytics。前瞻性M&A情报与新闻终端。核心业务：即将挂牌交易的独家前瞻爆料+140万+企业预警信号，靠全球调查记者网。靠机构订阅(约$30k/年起)。"},
  datasite:{en:"Founded 1968 (formerly Merrill), owned by CapVest. The global M&A virtual data room (VDR) leader. Core business: bank-grade encrypted data rooms for due diligence + compliance + AI redaction/Q&A. Earns via per-project custom quotes (avg account $68k/yr). Recently acquired Grata, Sourcescrub and Blueflame AI to become a full-cycle M&A OS.", zh:"1968年创立（前身 Merrill），CapVest 控股。全球并购虚拟数据室(VDR)龙头。核心业务：银行级加密数据室用于尽调+合规+AI脱敏/问答。靠按项目定制报价(均户$68k/年)。近年收购 Grata、Sourcescrub、Blueflame AI 转型全周期并购OS。"},
  grata:{en:"AI-driven private-company deal sourcing engines (Grata 2018; Sourcescrub), merged into Datasite in 2025. Core business: a 36M-company semantic database for finding off-market targets. Earns via enterprise SaaS (from $15k/yr).", zh:"AI驱动的私营公司找标的引擎（Grata 2018年；Sourcescrub），2025并入 Datasite。核心业务：3600万公司的语义数据库，用于发现非公开标的。靠企业SaaS(约$15k/年起)。"},
  jingzhun:{en:"Founded 2016 (spun from 36Kr), operated by Haier's Haichuanghui. A Chinese primary-market data + financing-match + B2G platform. Core business: financing matching, data systems, and government smart investment-attraction. Earns via data subscription + FA service + B2G projects. 50k investors, 120M company data.", zh:"2016年创立（脱胎36氪），海尔旗下海创汇运营。中国一级市场数据+融资对接+B2G平台。核心业务：融资对接、数据系统、政府智慧招商。靠数据订阅+FA服务+B2G项目。5万投资人、1.2亿企业数据。"},
  qingke:{en:"Founded 2001, listed on HKEX (1945.HK). China's primary-market data & service platform (PEdata). Core business: private-equity data + research + rankings/events + training. Earns via data (¥69.9M, 36.3%) + marketing/events (¥71.9M, 37.3%) + training. 2024 revenue ¥192M.", zh:"2001年创立，港交所上市(1945.HK)。中国一级市场数据与服务平台（私募通）。核心业务：私募数据+研究+榜单/活动+培训。靠数据(¥6993万,36.3%)+营销活动(¥7186万,37.3%)+培训。2024营收¥1.92亿。"},
  touzhong:{en:"Chinese PE/VC data provider. Core business: the CVSource data terminal + the 'ChinaVenture Ranking' events + LP/government advisory. Earns via annual accounts + rankings/events + custom advisory.", zh:"中国PE/VC数据服务商。核心业务：CVSource数据终端+投中榜活动+LP/国资顾问。靠年度账号+榜单/活动+定制顾问赚钱。"},
  itjuzi:{en:"Founded 2013 in China. A startup & investment-event tracking database + content media. Core business: investment event data + industry reports + membership. Earns via low-ticket membership + custom data.", zh:"2013年创立于中国。创投事件追踪数据库+内容媒体。核心业务：投资事件数据+行业报告+会员。靠低客单会员+定制数据。"},
  chanquan:{en:"Chinese state-owned property-rights exchanges (CBEX/SUAEE etc.). Core business: mandatory listing + auction + settlement + legal certification for state-owned-asset transfers (per 32号令/17号文). Earns via low statutory fees (0.1–5.0‰) + auction uplift (5–10% on appreciation).", zh:"中国国有产权交易所（北交所/上海联交所等）。核心业务：国资转让的强制挂牌+竞价+结算+法定鉴证（依32号令/17号文）。靠低法定费率(0.1–5.0‰)+竞价增值(5–10%)。"},
  marr:{en:"Launched 2020 by Recof Data under M&A Capital Partners (6080), the publisher of Japan's authoritative MARR magazine & Recof database. An online M&A matching platform. Died within 4 years — only 1,000 users after year one, net loss ¥29M, absorbed and shut down in 2023.", zh:"2020年由 M&Aキャピタル(6080) 旗下 Recof Data 推出（日本权威并购杂志 MARR 与 Recof 数据库的出版方）。线上并购撮合平台。4年内夭折——上线一年仅1000用户、净亏2913万日元，2023被吸收合并关停。"},
  dealnexus:{en:"Launched ~2009 by Intralinks (VDR vendor). A free confidential deal-sourcing network meant to funnel deals into its paid VDR. Reached 12,000 dealmakers / 7,000+ firms, but had zero independent revenue. After SS&C acquired Intralinks (2018), DealNexus was abandoned.", zh:"约2009年由 Intralinks（VDR厂商）推出。免费保密找项目网络，意在为付费VDR导流。峰值12000 dealmaker/7000+机构，但零独立收入。SS&C 2018收购 Intralinks 后被放弃。"},
  bankerbay:{en:"Founded 2014 (veteran banker-backed), rebranded Aurigin in 2019. A global deal-origination platform connecting corporates with capital providers. Never reached scale — a late entrant crushed by incumbents' network effects.", zh:"2014年创立（资深银行家背书），2019更名 Aurigin。连接企业与资本方的全球交易寻源平台。从未成规模——后发者被头部网络效应碾压。"},
};

// 每类详情选择状态
const catSel = { A:'acquire', B:'nmac', C:'acg', D:'pitchbook', E:'jingzhun', F:'marr' };
const catCmp = { A:new Set(), B:new Set(), C:new Set(), D:new Set(), E:new Set(), F:new Set() };
let archDim = 'all';

// 研究方法论
const METHOD = [
  { n:'01', t:{en:'V1–V4 analytical framework', zh:'V1–V4 分析框架'},
    d:{en:'Value proposition & 3-party · Pricing & timing · Delivery cost · Unit economics & survival — one ruler for every platform.', zh:'价值主张与三方拆解 · 收费机制与时点 · 交付成本 · 单位经济与抗周期——每家平台用同一把尺子衡量。'} },
  { n:'02', t:{en:'Six archetypes A–F', zh:'六大原型 A–F'},
    d:{en:'A Platform · B Advisory · C Network/Certification · D Data/Infrastructure · E China-local/Institutional · F Failed/Stalled — clustering 32 platforms into 6 underlying logics.', zh:'A 平台型 · B 顾问型 · C 网络/认证 · D 数据/基建 · E 中国本土/制度 · F 失败/停滞——把 32 家平台归入 6 类底层逻辑。'} },
  { n:'03', t:{en:'Evidence discipline', zh:'证据纪律'},
    d:{en:'Listed companies = audited filings · US associations = IRS Form 990 · private platforms = official pricing + third-party benchmarks · model estimates are explicitly labeled.', zh:'上市公司=经审计财报 · 美国协会=IRS Form 990 · 非上市平台=官方定价+第三方基准 · 模型测算明确标注。'} },
  { n:'04', t:{en:'Bilingual', zh:'中英双语'},
    d:{en:'English-first, with Chinese side-by-side.', zh:'英文为主，中文对照。'} },
];

function ovSection(num, en, zh, inner){
  return `<section class="ov-part"><div class="ov-part-head"><span class="ov-part-num">PART ${num}</span><h2 class="ov-h2">${LANG==='en'?en:zh}</h2></div>${inner}</section>`;
}

function scopeHTML(){
  return `<div class="scope-block"><div class="scope-title">${LANG==='en'?'Platforms covered (32)':'调研对象（32 家）'}</div>
    ${Object.keys(CAT).map(c=>`<div class="scope-row"><span class="scope-cat" style="color:${CAT[c].color}">${CAT[c][LANG]}</span><span class="scope-plats">${P.filter(p=>p.cat===c).map(p=>p.name[LANG]).join(' · ')}</span></div>`).join('')}</div>`;
}

function judgmentsSectionHTML(){
  return `<section class="ov-part"><div class="ov-part-head"><span class="ov-part-num">CORE</span><h2 class="ov-h2">${LANG==='en'?'Four core judgments':'四项核心判断'}</h2></div>
  <div class="judgments">${JUDGMENTS.map((j,i)=>`<div class="judgment"><div class="t">${i+1}. ${j.t[LANG]}</div><div class="d">${j.d[LANG]}</div></div>`).join('')}</div></section>`;
}

function renderOverview(){
  const hero = `<div class="hero"><div class="kicker">${t('ov_kicker')}</div><h1>${t('ov_title')}</h1><p class="hero-deck">${t('ov_deck')}</p></div>`;
  const method = `<div class="method-grid">${METHOD.map(m=>`<div class="method-card"><div class="method-num">${m.n}</div><div class="method-t">${m.t[LANG]}</div><div class="method-d">${m.d[LANG]}</div></div>`).join('')}</div>`;
  el('overviewRoot').innerHTML = hero + method + scopeHTML()
    + ovSection(1, 'Six archetypes · V1–V4 comparison', '六大商业原型 · V1–V4 全景对比表', archTableHTML())
    + ovSection(2, 'Ecosystem niche matrix', '六大原型生态位矩阵', nicheHTML())
    + ovSection(3, 'Why the "two-sided platform" law fails in M&A', '为什么互联网“双边平台”法则在并购领域频频失灵', frictionsHTML())
    + ['A','B','C','D','E','F'].map(c=>categorySectionHTML(c)).join('')
    + ovSection(10, 'Full data table (32 platforms)', '全量数据表（32 家平台）', fullTableHTML());
  initNicheChart();
}

/* ---- Part 1 对比表 ---- */
function archTableHTML(){
  const dims = [['v1',{en:'V1 Value prop & 3-party',zh:'V1 价值主张与三方'}],['v2',{en:'V2 Pricing & timing',zh:'V2 收费机制与时点'}],['v3',{en:'V3 Cost structure',zh:'V3 成本结构'}],['v4',{en:'V4 Unit economics',zh:'V4 单位经济与抗周期'}]];
  const chips = [['all',{en:'All',zh:'全部维度'}],['v1',{en:'V1 Value',zh:'V1 价值/三方'}],['v2',{en:'V2 Pricing',zh:'V2 收费'}],['v3',{en:'V3 Cost',zh:'V3 成本'}],['v4',{en:'V4 Unit econ',zh:'V4 单位经济'}]];
  return `<div class="dim-chips">${chips.map(([k,lb])=>`<button class="dim-chip ${archDim===k?'on':''}" onclick="setArchDim('${k}')">${lb[LANG]}</button>`).join('')}</div>
  <div class="arch-table-wrap"><table class="arch-table"><thead><tr><th>${LANG==='en'?'Archetype':'原型类别'}</th><th>${LANG==='en'?'Summary':'摘要'}</th>${dims.map(([k,lb])=>`<th class="${archDim===k||archDim==='all'?'dim-hl':''}">${lb[LANG]}</th>`).join('')}</tr></thead>
  <tbody>${ARCHETYPES.map(a=>{
    const pl = P.filter(p=>p.cat===a.cat).map(p=>p.name[LANG]).join(' · ');
    return `<tr><td class="arch-name"><b style="color:${CAT[a.cat].color}">${a.name[LANG]}</b><div class="arch-plats">${pl}</div></td>
      <td class="arch-summary">${ARCH_SUMMARY[a.cat][LANG]}</td>
      ${dims.map(([k])=>`<td class="${archDim===k||archDim==='all'?'dim-hl':''}">${a[k][LANG]}</td>`).join('')}</tr>`;
  }).join('')}</tbody></table></div>`;
}
function setArchDim(d){ archDim = d; renderOverview(); }

/* ---- Part 2 生态位矩阵 ---- */
function nicheHTML(){
  const legend = [['A',{en:'A Platform',zh:'A 平台'}],['B',{en:'B/E Advisory',zh:'B/E 顾问'}],['C',{en:'C/D Certainty band',zh:'C/D 确定性带'}],['F',{en:'F Death valley',zh:'F 死亡谷'}]];
  return `<div class="niche-note">${LANG==='en'?'X: deal size & non-standardization ｜ Y: human delivery & intervention depth ｜ red dashed box = repeatedly falsified "pure-matchmaking death valley"':'X轴：交易规模与标的非标程度 ｜ Y轴：人工交付与介入深度 ｜ 红色虚线框为历史反复证伪的“纯撮合死亡谷”'}</div>
  <div class="niche-legend">${legend.map(([g,lb])=>`<span><span class="sw" style="background:${NICHE_COLOR[g]}"></span>${lb[LANG]}</span>`).join('')}</div>
  <div id="nicheChart" class="niche-chart"></div>`;
}
function initNicheChart(){
  const elc = document.getElementById('nicheChart');
  if(!elc) return;
  const chart = echarts.getInstanceByDom(elc) || echarts.init(elc);
  const data = NICHE.map(n=>({name:n.label, value:[n.x,n.y], symbolSize:Math.max(14, n.r*2.2), itemStyle:{color:NICHE_COLOR[n.g], opacity:0.9}}));
  chart.setOption({
    tooltip:{formatter:p=>`${p.data.name}`},
    xAxis:{type:'value', min:0, max:100, name:'Deal size / non-standardization', nameLocation:'middle', nameGap:28, axisLabel:{fontSize:10}},
    yAxis:{type:'value', min:0, max:100, name:'Human delivery depth', nameLocation:'middle', nameGap:32, axisLabel:{fontSize:10}},
    series:[{
      type:'scatter', data,
      label:{show:true, formatter:p=>p.data.name, position:'top', fontSize:10, color:'#333'},
      markArea:{
        silent:true,
        itemStyle:{ color:'rgba(225,29,72,0.06)', borderColor:'rgba(225,29,72,0.8)', borderWidth:1.6, borderType:'dashed' },
        label:{ show:true, position:'insideTopLeft', formatter:'⚠ '+ (LANG==='en'?'Death valley':'纯撮合死亡谷'), fontSize:11, fontWeight:700, color:'#be123c' },
        data:[[{xAxis:32, yAxis:12},{xAxis:72, yAxis:48}]]
      }
    }],
    grid:{left:60,right:30,top:30,bottom:55}
  });
}

/* ---- Part 3 摩擦 ---- */
function frictionsHTML(){
  return `<div class="friction-grid">${FRICTIONS.map(f=>`
    <div class="friction-card"><div class="friction-num">${f.id}</div><div class="friction-title">${f.title[LANG]}</div><div class="friction-body">${f.body[LANG]}</div><div class="friction-ev">${f.ev[LANG]}</div></div>`).join('')}</div>`;
}

/* ---- Part 4-9 分类详情 ---- */
function categorySectionHTML(cat){
  const list = P.filter(p=>p.cat===cat);
  const cmp = catCmp[cat].size>0;
  const partNum = {A:4,B:5,C:6,D:7,E:8,F:9}[cat];
  return `<section class="ov-part cat-section"><div class="ov-part-head">
    <span class="ov-part-num" style="background:${CAT[cat].color}">PART ${partNum}</span>
    <h2 class="ov-h2" style="color:${CAT[cat].color}">${CAT[cat][LANG]} · ${LANG==='en'?'Detailed V1–V4':'V1–V4 详细拆解'}</h2>
    <span class="cat-count">${list.length} ${LANG==='en'?'platforms':'家平台'}</span>
    <button class="cmp-toggle ${cmp?'on':''}" onclick="toggleCatCmp('${cat}')">${cmp? t('compare_off') : t('compare')}</button>
  </div>
  <div class="cat-sec-body">
    <div class="v14-list">${list.map(p=>`<div class="v14-item ${p.id===catSel[cat]||catCmp[cat].has(p.id)?'sel':''}" onclick="selectCatPlat('${cat}','${p.id}')">${catDot(p.cat)}<span>${p.name[LANG]}</span></div>`).join('')}</div>
    <div class="v14-detail" id="v14Detail-${cat}">${v14DetailHTML(cat)}</div>
  </div></section>`;
}
const AXIS_EN = {
  feeObject: { '双边':'Both','卖方':'Seller','买方':'Buyer','买方机构':'Buyer org','卖方+买方':'Seller+buyer','卖方/融资方':'Seller/raiser','个人身份/机构':'Individual/org','个人身份':'Individual','机构':'Institution','机构(交易方)':'Institution','买方/机构/政府':'Buyer/org/gov','个人/机构':'Individual/org','双方':'Both','无':'None','—':'—' },
  feeUnit: { '成交额% + 订阅':'%deal + sub','成交额% + 刊登费':'%deal + listing','成交额%(阶梯)':'%deal (tiered)','月刊登费':'Monthly listing','订阅':'Subscription','成交额%(Lehman)':'%deal (Lehman)','年订阅(按规模)':'Annual sub (size)','成交费+会员订阅':'Success fee + membership','成交额%(3%)':'%deal (3%)','成交额%(Lehman)+着手金':'%deal (Lehman) + retainer','成交额%(成功费)':'%deal (success fee)','成交额%(实收额Lehman)':'%receipt (Lehman)','成交额%(Lehman)+10%':'%deal (Lehman) + 10%','会费+门票+赞助':'Dues + tickets + sponsorship','会费+认证费':'Dues + cert','会费+认证+续证':'Dues + cert + renewal','学费+会员':'Tuition + membership','年订阅(席位)':'Annual sub (seat)','年订阅':'Annual subscription','按项目':'Per project','服务费+订阅+B2G':'Service + sub + B2G','订阅+活动+培训':'Sub + events + training','订阅+活动+顾问':'Sub + events + advisory','会员订阅':'Membership sub','成交额‰':'‰deal','免费':'Free','—':'—' },
  cashflow: { '前置':'Upfront','后置':'Back-end','混合':'Hybrid','—':'—' },
  delivery: { '平台自助':'Self-serve','自营(审核)':'In-house (vetting)','平台+顾问网络':'Platform+advisors','平台自助(工具)':'Self-serve (tool)','伙伴网络':'Partner network','自营顾问':'In-house advisory','自营(FA)':'In-house (FA)','网络(志愿)':'Network (volunteer)','网络(认证)':'Network (cert)','教育(课程)':'Education','数据工具':'Data tool','平台+服务':'Platform+service','数据+服务':'Data+service','规则鉴证':'Rule cert' },
  channel: { '线上内容/SEO':'Content/SEO','内容/品牌':'Content/brand','线上SEO':'SEO','销售/CS':'Sales/CS','AI匹配/伙伴':'AI/partners','850拠点网络':'850-branch network','地银/口碑':'Banks/word-of-mouth','线上/媒体':'Online/media','媒体+AI':'Media+AI','人脉/口碑':'Network/word-of-mouth','分会+峰会':'Chapters+summits','会员+伙伴':'Members+partners','联名会员':'Joint membership','认证营销':'Cert marketing','B2B2C协会':'B2B2C assoc.','企业销售':'Enterprise sales','海尔生态/B2G':'Haier/B2G','榜单/活动':'Rankings/events','内容/SEO':'Content/SEO','制度垄断':'Reg. monopoly','媒体/数据':'Media/data','生态导流':'Ecosystem funnel','线上':'Online' },
};
function ax(v, key){
  if(LANG==='en' && AXIS_EN[key] && AXIS_EN[key][v]) return AXIS_EN[key][v];
  return v;
}

// m 字段（metrics）中文值 → 英文
const M_EN = {
  "20亿日元(FY26,+45%)":"¥2B (FY26, +45%)", "440亿日元(FY25/3)":"¥44B (FY25/3)", "225亿日元(FY25)":"¥22.5B (FY25)",
  "203亿日元(FY25/9)":"¥20.3B (FY25/9)", "166亿日元(FY25/9)":"¥16.6B (FY25/9)", "7.77亿元(2024)":"¥777M (2024)",
  "1.92亿元(2024)":"¥192M (2024)", "—(非上市)":"— (private)", "—(私营)":"— (private)", "—(并入海创汇)":"— (in Haichuanghui)",
  "$2,931万(FY25)":"$29.3M (FY25)", "$280万":"$2.8M", "~$6.7亿/年":"~$670M/yr", "—(VDR市场$26-36亿)":"— (VDR mkt $2.6–3.6B)",
  "净亏¥2913万":"Net loss ¥29M", "$0(免费)":"$0 (free)",
  "7.8%净盈余":"7.8% net surplus", "高毛利":"High margin", "薄利":"Thin margin",
  "$250亿累计":"$25B cumulative", "成约组数-6.5%":"Deals -6.5%", "1000+件/年":"1,000+ deals/yr", "234件/年":"234 deals/yr",
  "$52.5k/笔($75万×7%)":"$52.5k/deal ($750k×7%)", "成交5–10%":"Success fee 5–10%", "$45k均佣":"$45k avg commission",
  "$59–349/月":"$59–349/mo", "$40/月":"$40/mo", "$15–20万/笔(Lehman)":"$150–200k/deal (Lehman)", "€5k–15k/年":"€5k–15k/yr",
  "卖方进阶¥200万+; 买方2%":"Seller premium ¥2M+; buyer 2%", "买方3%(最低¥30万)":"Buyer 3% (min ¥300k)", "单笔¥4570万-1亿":"¥45.7M–100M/deal",
  "$600/年会费":"$600/yr dues", "$475/年会费":"$475/yr dues", "$595/年续证":"$595/yr renewal", "$3290-5490/课程":"$3,290–5,490/course",
  "$30k/年起":"from $30k/yr", "数据¥6993万/年":"¥69.9M/yr data", "低客单":"Low ticket",
  "3M/月访客":"3M monthly visitors", "18k+挂牌":"18k+ listings", "1000+会员/60国":"1,000+ members / 60 countries",
  "30万会员":"300k members", "13.5万买方(TRANBI)":"135k buyers (TRANBI)", "10万+从业者":"100k+ practitioners",
  "5万投资人/1.2亿企业":"50k investors / 120M companies", "1000(1年)":"1,000 (year 1)",
  "6–8%成交+$25–100/月+$390会员":"6–8% close + $25–100/mo + $390 membership", "5–15%(10%/5%分界$50k)":"5–15% (10%/5% at $50k)",
  "15%→2.5%(最低$10k)":"15%→2.5% (min $10k)", "纯刊登(零抽成)":"Listing only (zero cut)", "订阅(零成功费)":"Subscription (zero success fee)",
  "买方Lehman 5%→1%":"Buyer Lehman 5%→1%", "卖方进阶+买方2%+月费":"Seller premium + buyer 2% + monthly", "买方3%":"Buyer 3%",
  "着手金+Lehman 5→1%(最低¥2000万)":"Retainer + Lehman 5→1% (min ¥20M)", "成功费(明细待核)":"Success fee (details TBC)", "实收额Lehman(最低¥2000万)":"Receipt Lehman (min ¥20M)",
  "Lehman 5→1%(最低¥2500万)+买方10%":"Lehman 5→1% (min ¥25M) + buyer 10%", "融资3-5%/并购1-3%":"Financing 3–5% / M&A 1–3%", "融资2-5%":"Financing 2–5%",
  "会费+门票(0抽成)":"Dues + tickets (0 cut)", "会费+认证(0抽成)":"Dues + cert (0 cut)", "认证费(0抽成)":"Cert fee (0 cut)",
  "课程$2150-5495+续证$595":"Course $2,150–5,495 + $595 renewal", "学费(0抽成)":"Tuition (0 cut)", "单席$12-20k/年":"$12–20k/seat/yr",
  "订阅":"Subscription", "按项目":"Per project", "数据+FA+B2G":"Data + FA + B2G", "订阅+活动":"Subscription + events",
  "会员订阅":"Membership subscription", "‰级手续费":"‰-level fee", "$65,900/户":"$65,900/acct", "$68,121/户":"$68,121/acct", "$15k+/年":"$15k+/yr", "非公开":"Not public", "10,200客户/11.3万席位":"10,200 clients / 113k seats", "700+机构(Sourcescrub)":"700+ orgs (Sourcescrub)", "无":"None",
};
function mEn(v){
  if(LANG==='en' && M_EN[v]) return M_EN[v];
  return v;
}

// stats 数据卡片 num 字段中文 → 英文
const NUM_EN = {
  '年费':'Annual fee', '多国':'Multi-country', '低':'Low', '¥200万〜':'¥2M+', '4类':'4 types',
  '4期':'4 periods', '30万':'300k', '¥6,470万':'¥64.7M', '¥4,260万':'¥42.6M', '¥20亿':'¥2B',
  '7.2月':'7.2 mo', '245万':'2.45M', '127万':'1.27M', '续费':'Renewal',
};
function numEn(v){
  if(LANG==='en' && NUM_EN[v]) return NUM_EN[v];
  return v;
}

const V14_DIMS = [
  { dim:'v1', label:'v14_v1', fields:[
    {k:'feeobj', lb:{en:'Who pays', zh:'谁付费'}, val:p=>p.axis.feeObject, tag:'feeobj'},
    {k:'cs', lb:{en:'Customer', zh:'客户细分'}, val:p=>p.canvas.cs[LANG]},
    {k:'vp', lb:{en:'Value', zh:'价值主张'}, val:p=>p.canvas.vp[LANG]},
  ]},
  { dim:'v2', label:'v14_v2', fields:[
    {k:'feeobj', lb:{en:'Fee object', zh:'收费对象'}, val:p=>p.axis.feeObject, tag:'feeobj'},
    {k:'feeunit', lb:{en:'Fee unit', zh:'计费单位'}, val:p=>p.axis.feeUnit, tag:'feeunit'},
    {k:'cf', lb:{en:'Timing', zh:'收费时点'}, val:p=>p.axis.cashflow, tag:'cf'},
    {k:'fee', lb:{en:'Price', zh:'费率'}, val:p=>p.m.fee},
  ]},
  { dim:'v3', label:'v14_v3', fields:[
    {k:'delivery', lb:{en:'Delivery', zh:'交付模式'}, val:p=>p.axis.delivery, tag:'delivery'},
    {k:'channel', lb:{en:'Channel', zh:'获客渠道'}, val:p=>p.axis.channel, tag:'channel'},
    {k:'cost', lb:{en:'Cost', zh:'成本结构'}, val:p=>p.canvas.cost[LANG]},
  ]},
  { dim:'v4', label:'v14_v4', fields:[
    {k:'rev', lb:{en:'Revenue', zh:'营收'}, val:p=>p.m.revenue, num:1},
    {k:'margin', lb:{en:'Margin', zh:'利润率'}, val:p=>p.m.margin, num:1},
    {k:'deals', lb:{en:'Deals', zh:'成交/规模'}, val:p=>p.m.deals, num:1},
    {k:'acv', lb:{en:'ACV', zh:'客单'}, val:p=>p.m.acv, num:1},
    {k:'users', lb:{en:'Reach', zh:'覆盖'}, val:p=>p.m.users},
  ]},
];

function tagHTML(text, type){
  if(!text || text==='—') return `<span class="vtag vtag-none">—</span>`;
  let bg='#767676', tc='#fff';
  if(type==='feeobj'){ bg='#e51503'; }
  else if(type==='feeunit'){ bg='#FF9B00'; tc='#000'; }
  else if(type==='cf'){ const m={'前置':'#338736','混合':'#b45309','后置':'#e51503'}; bg=m[text]||'#767676'; tc=(text==='混合')?'#000':'#fff'; }
  else if(type==='delivery'){ if(text.includes('自营')) bg='#7c3aed'; else if(text.includes('平台')) bg='#2563eb'; else if(text.includes('网络')||text.includes('教育')) bg='#b45309'; else if(text.includes('数据')) bg='#0d9488'; else if(text.includes('规则')) bg='#6b7280'; else bg='#767676'; }
  else if(type==='channel'){ bg='#1c1c1c'; }
  const key = {feeobj:'feeObject', feeunit:'feeUnit', cf:'cashflow', delivery:'delivery', channel:'channel'}[type];
  const label = ax(text, key);
  return `<span class="vtag" style="background:${bg};color:${tc}">${label}</span>`;
}

function fieldValHTML(f, p){
  const v = f.val(p);
  if(f.tag) return tagHTML(v, f.tag);
  if(f.num) return `<span class="num">${mEn(v)}</span>`;
  return `<span>${mEn(v)}</span>`;
}

function singleV14HTML(p){
  return `<div class="v14-grid">` + V14_DIMS.map(d=>`
    <div class="v14-block"><div class="v14-label">${t(d.label)}</div><div class="v14-rows">` +
    d.fields.map(f=>`<div class="v14-row"><span class="v14-k">${f.lb[LANG]}</span><div class="v14-val">${fieldValHTML(f,p)}</div></div>`).join('')
    + `</div></div>`).join('') + `</div>`;
}

function cmpV14HTML(ids){
  const ps = ids.map(id=>P.find(x=>x.id===id));
  return `<div class="v14-grid v14-grid-cmp">` + V14_DIMS.map(d=>`
    <div class="v14-block"><div class="v14-label">${t(d.label)}</div>
    <table class="v14-table"><thead><tr><th class="v14-th-blank"></th>${ps.map((p,i)=>`<th><span class="cmp-tag" style="background:${CMP_COLORS[i]}">${shortName(p)}</span></th>`).join('')}</tr></thead>
    <tbody>` + d.fields.map(f=>`<tr><td class="v14-k">${f.lb[LANG]}</td>${ps.map(p=>`<td>${fieldValHTML(f,p)}</td>`).join('')}</tr>`).join('') + `</tbody></table></div>`
  ).join('') + `</div>`;
}
function logoText(p){
  const ov = { masouken:'MARI', masource:'M&AS', bankerbay:'Aurigin', chanquan:'产交所', jingzhun:'鲸准', qingke:'清科', touzhong:'投中', itjuzi:'IT桔子', huaxing:'华兴', yikai_taihe:'易凯/泰合', marr:'MARR', dealnexus:'DealNexus', grata:'Grata/SS', tranbi:'TRANBI', nmac:'Nihon M&A', macp:'M&A CP', batonz:'BATONZ', acg:'ACG', ibba:'IBBA', amaa:'AM&AA', imaa:'IMAA', datasite:'Datasite', pitchbook:'PitchBook', mergermarket:'MM', dealsuite:'Dealsuite', axial:'Axial', dealstream:'DealStream', bizbuysell:'BBS', empire:'EF', flippa:'Flippa', acquire:'Acquire.com' };
  if(ov[p.id]) return ov[p.id];
  const n = p.name[LANG];
  if(/[\u4e00-\u9fff]/.test(n)) return n.slice(0,3);
  const abbr = n.replace(/[^A-Za-z&]/g,' ').split(/\s+/).filter(w=>/^[A-Za-z&]+$/.test(w)).map(w=>w[0]).join('').toUpperCase();
  return abbr.slice(0,4) || n.slice(0,3).toUpperCase();
}

function companyCardHTML(p){
  return `<div class="company-card">
    <div class="company-logo" style="background:${catOf(p).color}">
      <img src="assets/logos/${p.id}.png" onerror="this.style.display='none'" alt="${esc(p.name[LANG])}">
      <span class="logo-text">${logoText(p)}</span>
    </div>
    <div class="company-info">
      <div class="company-name">${p.name[LANG]}</div>
      <div class="company-meta">${catOf(p)[LANG]} · ${p.region[LANG]} · ${LANG==='en'?'Founded':'成立'} ${p.founded} · ${LANG==='en'?'Delivery':'交付'}：${ax(p.axis.delivery,'delivery')}</div>
      <div class="company-intro">${INTRO[p.id] ? INTRO[p.id][LANG] : p.pitch[LANG]}</div>
    </div>
  </div>`;
}

function v14DetailHTML(cat){
  const cmp = catCmp[cat].size>0;
  const ids = cmp ? [...catCmp[cat]] : [catSel[cat]];
  let card = '';
  if(!cmp && ids.length){ card = companyCardHTML(P.find(x=>x.id===ids[0])); }
  const body = cmp ? cmpV14HTML(ids) : singleV14HTML(P.find(x=>x.id===ids[0]));
  return card + body;
}
function selectCatPlat(cat, id){
  if(catCmp[cat].size>0){
    if(catCmp[cat].has(id)) catCmp[cat].delete(id); else if(catCmp[cat].size<3) catCmp[cat].add(id);
  } else {
    catSel[cat] = id;
  }
  renderOverview();
}
function toggleCatCmp(cat){
  if(catCmp[cat].size>0){ catCmp[cat].clear(); }
  else { catCmp[cat] = new Set([catSel[cat]]); }
  renderOverview();
}

function gotoPlatform(id){
  selectedCanvas = id;
  curView = 'canvas';
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active', b.dataset.view==='canvas'));
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  el('view-canvas').classList.add('active');
  renderAll();
}

/* ================= ② CANVAS ================= */
let selectedCanvas = P[0].id, compareMode = false, compareSet = new Set();
const CMP_COLORS = ['#e51503','#0064fa','#338736'];
const BOARD = [
  ['kp','kp','bmc_kp'], ['ka','ka','bmc_ka'], ['kr','kr','bmc_kr'],
  ['vp','vp','bmc_vp'], ['cr','cr','bmc_cr'], ['ch','ch','bmc_ch'],
  ['cs','cs','bmc_cs'], ['cost','cost','bmc_cost'], ['rev','rs','bmc_rs'],
];
const BOARD_AXIS = { rs:'#e51503', cost:'#FF9B00', cs:'#0064fa', ch:'#338736' };
function shortName(p){ const n = p.name[LANG].replace(/\(.*?\)/g,'').trim(); return n.length>13 ? n.slice(0,12)+'…' : n; }

function platformListHTML(selId, fn){
  return Object.keys(CAT).map(c=>{
    const list = P.filter(p=>p.cat===c);
    return `<div class="plist-cat">${CAT[c][LANG]} (${list.length})</div>` + list.map(p=>
      `<div class="plist-item ${p.id===selId?'sel':''}" onclick="${fn}('${p.id}')">${catDot(p.cat)} <span>${p.name[LANG]}</span></div>`).join('');
  }).join('');
}

function axisKeyHTML(){
  const items = [['rs','#e51503','axis_feeObject'],['rs','#FF9B00','axis_feeUnit'],['cost','#338736','axis_cashflow'],['ch','#0064fa','axis_delivery']];
  return `<div class="axis-key">` + items.map(([k,c,kk])=>`<span><span class="sw" style="background:${c}"></span>${t(kk)}</span>`).join('') + `<span><span class="sw" style="background:#000"></span>${t('axis_channel')}</span></div>`;
}

function boardHTML(ids, cmp){
  return `<div class="canvas-board">` + BOARD.map(([area, key, label])=>{
    const sw = BOARD_AXIS[key] ? `<span class="sw" style="background:${BOARD_AXIS[key]}"></span>` : '';
    let inner;
    if(cmp){
      inner = ids.map((id,i)=>{
        const p = P.find(x=>x.id===id);
        return `<div class="cmp-entry"><span class="cmp-tag" style="background:${CMP_COLORS[i]}">${shortName(p)}</span><div class="cmp-text">${p.canvas[key][LANG]}</div></div>`;
      }).join('');
    } else {
      const p = P.find(x=>x.id===ids[0]);
      inner = `<div class="bmc-body">${p.canvas[key][LANG]}</div>`;
    }
    return `<div class="bmc ${key==='vp'?'vp':''}" style="grid-area:${area}"><div class="bmc-title">${sw}${t(label)}</div>${inner}</div>`;
  }).join('') + `</div>`;
}

function renderCanvas(){
  el('canvasList').innerHTML = platformListHTML(selectedCanvas, 'selectCanvas');
  const sb = el('compareBtn'); sb.classList.toggle('on', compareMode);
  const bar = el('canvasCompareBar');
  let ids, head;
  if(compareMode){
    bar.hidden = false;
    bar.innerHTML = `<b>${t('compare_pick')} (${compareSet.size}/3)</b>`;
    ids = [...compareSet];
    head = ids.length
      ? `<div class="cmp-legend">` + ids.map((id,i)=>{const p=P.find(x=>x.id===id); return `<span class="cmp-tag" style="background:${CMP_COLORS[i]}">${p.name[LANG]}</span>`;}).join('') + `<span class="hint">${LANG==='en'?'· click a platform in the left list to add / remove':'· 点击左侧平台增删'}</span></div>`
      : '';
  } else {
    bar.hidden = true;
    ids = [selectedCanvas];
    const p = P.find(x=>x.id===ids[0]);
    head = `<div class="canvas-head"><div class="pname">${p.name[LANG]}</div><div class="ppitch">${p.pitch[LANG]}</div><div class="pmeta"><span style="color:${catOf(p).color};font-weight:700">${catOf(p)[LANG]}</span><span>${p.region[LANG]}</span><span>${LANG==='en'?'Founded':'成立'} ${p.founded}</span></div></div>`;
  }
  el('canvasStage').innerHTML = head + (ids.length ? boardHTML(ids, compareMode) : `<p>${t('empty_compare')}</p>`) + axisKeyHTML();
}
function selectCanvas(id){
  if(compareMode){
    if(compareSet.has(id)) compareSet.delete(id); else if(compareSet.size<3) compareSet.add(id);
  } else {
    selectedCanvas = id;
  }
  renderCanvas();
}
el('compareBtn').addEventListener('click', ()=>{
  compareMode = !compareMode;
  if(compareMode) compareSet = new Set([selectedCanvas]);
  renderCanvas();
});

/* ================= ③ DATA ================= */
const REV = { pitchbook:{rev:670,m:30.2}, nmac:{rev:290,m:37.9}, macp:{rev:150,m:31.7}, strike:{rev:135,m:31}, masouken:{rev:110,m:28.8}, huaxing:{rev:108,m:null}, acg:{rev:29.3,m:7.8}, qingke:{rev:27,m:null}, batonz:{rev:13,m:18.1}, ibba:{rev:2.8,m:null} };
let catFilterSet = new Set(Object.keys(CAT));
let scatterChart, matrixChart, feeChart;

function renderData(){
  el('catFilter').innerHTML = Object.keys(CAT).map(c=>
    `<button class="cat-chip ${catFilterSet.has(c)?'on':''}" onclick="toggleCat('${c}')">${CAT[c][LANG]}</button>`).join('');
  drawScatter(); drawMatrix(); drawFee();
}
function toggleCat(c){ catFilterSet.has(c)?catFilterSet.delete(c):catFilterSet.add(c); renderData(); }

function drawScatter(){
  const data = Object.keys(REV).map(id=>{ const p=P.find(x=>x.id===id); const r=REV[id];
    return {name:p.name[LANG], rev:r.rev, margin:r.m, cat:p.cat}; }).filter(d=>d.margin && catFilterSet.has(d.cat));
  scatterChart = scatterChart || echarts.init(el('chartScatter'));
  scatterChart.setOption({
    tooltip:{formatter:p=>`${p.data.name}<br/>Rev: $${p.data.rev}M · Margin: ${p.data.margin}%`},
    xAxis:{type:'log', name:'Rev (USD M, log)'}, yAxis:{type:'value', name:'Margin %'},
    series:[{type:'scatter', symbolSize:16, data:data.map(d=>({...d, itemStyle:{color:CAT[d.cat].color}}))}],
    grid:{left:60,right:30,top:30,bottom:50}
  });
}
function deliveryBucket(d){
  if(['平台自助','数据工具'].includes(d)) return '平台/工具';
  if(['伙伴网络','网络(志愿)','网络(认证)','教育(课程)','平台+顾问网络','平台+服务','数据+服务'].includes(d)) return '伙伴/网络';
  return '自营/规则';
}
function drawMatrix(){
  const data = P.filter(p=>catFilterSet.has(p.cat) && p.axis.cashflow!=='—').map(p=>({
    name:p.name[LANG], value:[deliveryBucket(p.axis.delivery), p.axis.cashflow], cat:p.cat
  }));
  matrixChart = matrixChart || echarts.init(el('chartMatrix'));
  matrixChart.setOption({
    tooltip:{formatter:p=>`${p.data.name}<br/>Cashflow: ${p.data.value[1]} · Delivery: ${p.data.value[0]}`},
    xAxis:{type:'category', data:['平台/工具','伙伴/网络','自营/规则'], name:'Delivery', nameLocation:'middle', nameGap:34},
    yAxis:{type:'category', data:['前置','混合','后置'], name:'Cashflow', nameLocation:'middle', nameGap:40},
    series:[{type:'scatter', symbolSize:16, data, label:{show:true, formatter:p=>p.data.name, position:'top', fontSize:10, color:'#333'}}],
    grid:{left:70,right:20,top:30,bottom:60}
  });
}
function drawFee(){
  const data = Object.keys(REV).map(id=>({name:P.find(x=>x.id===id).name[LANG], value:REV[id].rev, cat:P.find(x=>x.id===id).cat}))
    .sort((a,b)=>a.value-b.value);
  feeChart = feeChart || echarts.init(el('chartFee'));
  feeChart.setOption({
    tooltip:{formatter:p=>`${p.name}: $${p.value}M`},
    xAxis:{type:'value', name:'Rev (USD M)'},
    yAxis:{type:'category', data:data.map(d=>d.name), axisLabel:{fontSize:11}},
    series:[{type:'bar', data:data.map(d=>({value:d.value, itemStyle:{color:CAT[d.cat].color}}))}],
    grid:{left:130,right:30,top:10,bottom:40}
  });
}
function fullTableHTML(){
  const head = [
    {en:'Platform', zh:'平台'}, {en:'Category', zh:'分类'}, {en:'Region', zh:'地区'},
    {en:'Revenue', zh:'营收'}, {en:'Margin', zh:'利润率'}, {en:'Deals / Scale', zh:'成交/规模'},
    {en:'Users / Reach', zh:'覆盖'}, {en:'Fee', zh:'费率'}, {en:'Cashflow', zh:'现金流'}, {en:'Delivery', zh:'交付'},
  ];
  const rows = P.map(p=>`<tr><td><b>${p.name[LANG]}</b></td><td style="color:${catOf(p).color}">${catOf(p)[LANG]}</td><td>${p.region[LANG]}</td><td class="num">${mEn(p.m.revenue)}</td><td class="num">${mEn(p.m.margin)}</td><td class="num">${mEn(p.m.deals)}</td><td>${mEn(p.m.users)}</td><td>${mEn(p.m.fee)}</td><td>${ax(p.m.cashflow,'cashflow')}</td><td>${ax(p.m.delivery,'delivery')}</td></tr>`).join('');
  return `<div class="detail-table-wrap"><div class="chart-title">${t('dt_title')}</div><table class="detail-table"><thead><tr>${head.map(h=>`<th>${h[LANG]}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

/* ================= ⑤ TAXONOMY ================= */
function renderTaxonomy(){
  el('taxonomyStage').innerHTML = `
    <div class="kicker2">SIX ARCHETYPES · ${LANG==='en'?'A–F':'A–F 六类'}</div>
    <div class="cat-summary">${Object.keys(CAT).map(c=>{const l=P.filter(p=>p.cat===c);
      return `<div class="cat-card" style="border-top-color:${CAT[c].color}"><div class="name" style="color:${CAT[c].color}">${CAT[c][LANG]}</div><div class="cnt">${l.length}</div><div class="desc">${CAT_DESC[c][LANG]}</div><div class="desc" style="margin-top:6px;color:var(--ink2)">${l.map(p=>p.name[LANG]).join(' · ')}</div></div>`;}).join('')}</div>
    <div class="kicker2">UNDERLYING LOGIC · ${LANG==='en'?'4 layers':'四层底层逻辑'}</div>
    ${LAWS.map(l=>`<div class="law-card"><div class="law-num">${l.n}</div><div class="law-title">${l.t[LANG]}</div><div class="law-body">${l.body[LANG]}</div><ul class="law-list">${l.items.map(i=>`<li>${i[LANG]}</li>`).join('')}</ul></div>`).join('')}`;
}

/* ================= ⑥ INSIGHTS ================= */
function renderInsights(){
  el('insightsStage').innerHTML = `
    <div class="kicker2">INDUSTRY INSIGHT</div>
    <div class="law-card" style="border-left-color:var(--orange)"><div class="law-body" style="font-size:16px"><b>${INSIGHTS.summary[LANG]}</b></div></div>
    ${INSIGHTS.sections.map(s=>`<div class="insight-sec"><div class="insight-title">${s.title[LANG]}</div><div class="law-body" style="font-size:13.5px;line-height:1.6">${s.body[LANG]}</div></div>`).join('')}
    <div class="kicker2">C-CLASS FINANCIAL SANDBOX · 36 MONTHS (RMB, MODEL)</div>
    <table class="sandbox-table"><thead><tr><th>${LANG==='en'?'Item':'项目'}</th><th>${SANDBOX.cols.y1[LANG]}</th><th>${SANDBOX.cols.y2[LANG]}</th><th>${SANDBOX.cols.y3[LANG]}</th></tr></thead>
    <tbody>${SANDBOX.rows.map(r=>`<tr ${r.hl?'style="background:var(--surface);font-weight:700"':''}><td>${r.label[LANG]}</td><td class="num">${r.y1}</td><td class="num">${r.y2}</td><td class="num">${r.y3}</td></tr>`).join('')}</tbody></table>
    <div class="law-body" style="font-size:11.5px;color:var(--gray)">${SANDBOX.note[LANG]}</div>
    <div class="kicker2">${INSIGHTS.lifeLines.title[LANG]}</div>
    <div class="law-card"><ul class="law-list">${INSIGHTS.lifeLines.items.map(i=>`<li>${i[LANG]}</li>`).join('')}</ul></div>`;
}

/* ================= ③ CASE STUDIES（案例详细拆解） ================= */
let curCase = 0;
function selectCase(i){ curCase = i; renderCases(); }

function csBlockHTML(b){
  switch(b.type){
    case 'h4': return `<h4 class="cs-h4">${b.text[LANG]}</h4>`;
    case 'para': return `<p class="cs-para">${b.text[LANG]}</p>`;
    case 'note': return `<div class="cs-note">${b.text[LANG]}</div>`;
    case 'list': return `<ul class="cs-list">${b.items.map(i=>`<li>${i[LANG]}</li>`).join('')}</ul>`;
    case 'stats': return `<div class="cs-stats">${b.items.map(s=>`<div class="cs-stat"><div class="cs-stat-num">${numEn(s.num)}</div><div class="cs-stat-label">${s.label[LANG]}</div><div class="cs-stat-note">${s.note[LANG]}</div></div>`).join('')}</div>`;
    case 'table': return `<div class="cs-table-wrap"><table class="cs-table"><thead><tr>${b.head.map(h=>`<th>${h[LANG]}</th>`).join('')}</tr></thead><tbody>${b.rows.map(r=>`<tr>${r.map(c=>`<td>${c[LANG]}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    case 'position': return `<div class="cs-position"><div class="cs-pos-axis">${b.axis[LANG]}</div>${b.items.map(p=>`<div class="cs-pos-item" style="left:${p.x}%;top:${p.y}%"><span class="cs-pos-name">${p.name[LANG]}</span><span class="cs-pos-tag">${p.tag[LANG]}</span></div>`).join('')}</div>`;
  }
  return '';
}

function renderCases(){
  const c = CASES[curCase];
  el('casesStage').innerHTML = `
    <div class="cs-tabs">${CASES.map((cs,i)=>`<button class="cs-tab ${i===curCase?'on':''}" onclick="selectCase(${i})">${cs.short[LANG]}</button>`).join('')}</div>
    <div class="cs-head">
      <div class="kicker">${c.type[LANG]} · ${c.region[LANG]}</div>
      <h1 class="cs-title">${c.title[LANG]}</h1>
      <div class="cs-sub">${c.subtitle[LANG]}</div>
    </div>
    <div class="cs-findings">
      <div class="cs-findings-title">${LANG==='en'?'Key Findings':'核心发现'}</div>
      ${c.findings.map((f,i)=>`<div class="cs-finding"><span class="cs-finding-num">${String(i+1).padStart(2,'0')}</span><div><div class="cs-finding-t">${f.t[LANG]}</div><div class="cs-finding-d">${f.d[LANG]}</div></div></div>`).join('')}
    </div>
    ${c.sections.map(s=>`
      <section class="cs-section">
        <div class="cs-section-head"><span class="cs-section-num">${s.num}</span><h2 class="cs-section-title">${s.title[LANG]}</h2></div>
        ${s.intro ? `<p class="cs-intro">${s.intro[LANG]}</p>` : ''}
        ${s.blocks.map(csBlockHTML).join('')}
      </section>`).join('')}`;
}

/* ================= ④ BUSINESS MODEL HYPOTHESIS ================= */
function ratioBtn(key, text){
  return `<button class="ratio" data-r="${key}" onclick="openRatio('${key}', this)">${text[LANG]}</button>`;
}
function layerRatiosHTML(layer){
  if(!layer.ratios) return '';
  return layer.ratios.map(r=>{
    if(r.sep) return `<span class="sep">${r.sep[LANG]}</span>`;
    return ratioBtn(r.key, r.text) + (r.suffix[LANG] ? `<span>${r.suffix[LANG]}</span>` : '');
  }).join('');
}
function openRatio(key, btn){
  const d = BM.ratios[key]; if(!d) return;
  const slot = document.getElementById('bmRationale');
  const wasOpen = btn && btn.classList.contains('on');
  closeRatio();
  if(wasOpen) return;
  if(btn) btn.classList.add('on');
  slot.innerHTML = `
    <div class="rd"><h5>${LANG==='en'?'Rationale · ':'依据 · '}${d.t[LANG]}<span class="val">${d.v[LANG]}</span><button class="x" onclick="closeRatio()">×</button></h5>
    <div class="rd-table-wrap"><table class="cs-table"><thead><tr><th>${LANG==='en'?'Benchmark':'对标对象'}</th><th>${LANG==='en'?'Pricing':'定价方式'}</th><th>${LANG==='en'?'Number / basis':'数字 / 依据'}</th><th>${LANG==='en'?'Why set this way':'为什么这么定'}</th></tr></thead>
    <tbody>${d.rows.map(r=>`<tr>${r.map(c=>`<td>${c[LANG]}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
    <div class="rd-why"><b>${LANG==='en'?'Our rationale':'我们的依据'}</b><ul class="cs-list">${d.why.map(x=>`<li>${x[LANG]}</li>`).join('')}</ul></div>
    <div class="rd-when"><b>${LANG==='en'?'When to change · ':'什么时候该改 · '}</b>${d.when[LANG]}</div>
    <div class="rd-ev">${d.ev[LANG]}</div></div>`;
  slot.scrollIntoView({behavior:'smooth', block:'nearest'});
}
function closeRatio(){
  const slot = document.getElementById('bmRationale');
  if(slot) slot.innerHTML = '';
  document.querySelectorAll('.ratio.on').forEach(b=>b.classList.remove('on'));
}

function renderBM(){
  const layers = BM.layers.map(l=>`
    <div class="bm-card" data-level="${l.level}">
      <div class="bm-card-level">${l.level}</div>
      <div class="bm-card-name">${l.name[LANG]}</div>
      <div class="bm-card-desc">${l.desc[LANG]} ${layerRatiosHTML(l)}${l.tail ? `<span>${l.tail[LANG]}</span>` : ''}</div>
      <div class="bm-card-tag">${l.tag[LANG]}</div>
    </div>`).join('');
  const inCells = BM.moneyFlow.in.map(f=>{
    const faint = (f.key==='buyer' || f.key==='cert');
    return `<div class="mf-cell">
      <div class="mf-card"><div class="mf-who">${f.who[LANG]}</div><div class="mf-role">${f.role[LANG]}</div></div>
      <div class="mf-line">
        <span class="mf-amt">${f.key ? `<button class="ratio" data-r="${f.key}" onclick="openRatio('${f.key}', this)">${f.amount[LANG]}</button>` : f.amount[LANG]}</span>
        <span class="mf-arrow${faint?' mf-arrow-faint':''}"></span>
      </div>
    </div>`;
  }).join('');
  const outCells = BM.moneyFlow.out.map(f=>`
    <div class="mf-cell">
      <div class="mf-line">
        <span class="mf-amt">${f.prefix[LANG]}<button class="ratio" data-r="${f.key}" onclick="openRatio('${f.key}', this)">${f.share[LANG]}</button></span>
        <span class="mf-arrow"></span>
      </div>
      <div class="mf-card"><div class="mf-who">${f.who[LANG]}</div><div class="mf-role">${f.role[LANG]}</div></div>
    </div>`).join('');

  el('bmStage').innerHTML = `
    <div class="bm-head"><div class="kicker">${LANG==='en'?'OUR MODEL · HYPOTHESIS':'我们的模型 · 假设'}</div><h1>${LANG==='en'?'Business Model Hypothesis':'商业模式假设'}</h1><p class="bm-intro">${BM.intro[LANG]}</p></div>
    <section class="cs-section"><div class="cs-section-head"><span class="cs-section-num">01</span><h2 class="cs-section-title">${LANG==='en'?'Three revenue layers':'三笔钱：收入结构'}</h2></div>
      <div class="bm-layers">${layers}</div>
      <div class="cs-note"><b>${LANG==='en'?'Key judgment':'关键判断'}：</b>${BM.judgment[LANG]}</div>
    </section>
    <section class="cs-section"><div class="cs-section-head"><span class="cs-section-num">02</span><h2 class="cs-section-title">${LANG==='en'?'Money flow':'钱从哪来、到哪去'}</h2></div>
      <p class="bm-note">${BM.moneyFlow.note[LANG]}</p>
      <div class="mf">
        <div class="mf-in-row">
          <div class="mf-inlets">${inCells}</div>
          <div class="mf-hub mf-hub-blue"><div class="mf-hub-title">${BM.moneyFlow.hub[LANG]}</div><div class="mf-hub-sub">${BM.moneyFlow.hubSub[LANG]}</div></div>
        </div>
        <div class="mf-out-row">
          <div class="mf-hub mf-hub-green"><div class="mf-hub-title">${BM.moneyFlow.allocate[LANG]}</div></div>
          <div class="mf-outlets">${outCells}</div>
        </div>
        <div class="mf-footer"><b>${BM.moneyFlow.footerTitle[LANG]}</b>${BM.moneyFlow.footer.map(f=>`<div class="mf-foot-line">${f[LANG]}</div>`).join('')}</div>
      </div>
      <div id="bmRationale" class="bm-rationale"></div>
    </section>`;
}

/* ================= init ================= */
renderAll();
