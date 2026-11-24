/* ============================================================
   bm.js — 商业模式假设（三笔钱收入结构 + Money Flow + 定价依据）
   来源：全球并购交易平台业务分析报告.html「商业模式」tab
   ============================================================ */
const BM = {
  intro: {
    en:"Our own business-model hypothesis — three revenue layers (identity / deal / efficiency) and where the money flows. Dotted-underlined numbers are clickable: they show how competitors price, our rationale, and when to change.",
    zh:"我们自己的商业模式假设——三笔钱（身份层/交易层/效率层）以及钱的流向。带虚线下划线的数字可点开：看到竞品怎么定价、我们的依据、以及什么条件下该改。",
  },
  layers: [
    { level:'L1', name:{en:'Identity layer · Certification', zh:'L1 · 身份层 · 认证费'},
      desc:{en:'Individual candidates pay for "professional identity". This money is collected on the education platform, not the matchmaking platform.', zh:'个人考生为「专业身份」付费。这笔钱收在教育平台，不在撮合平台。'},
      tag:{en:'Already exists', zh:'已存在'},
      ratios:[{key:'cert', text:{en:'USD 3,000–10,000', zh:'USD 3,000–10,000'}, suffix:{en:'/ level', zh:'/ 级'}}] },
    { level:'L2', name:{en:'Deal layer · Matchmaking service fee', zh:'L2 · 交易层 · 撮合服务费'},
      desc:{en:'The seller pays for "closing":', zh:'卖方为「成交」付费，成交额'},
      ratios:[{key:'rate', text:{en:'2–3%', zh:'2–3%'}, suffix:{en:'', zh:''}}, {sep:{en:', min', zh:'，最低'}}, {key:'min', text:{en:'¥400k', zh:'40 万'}, suffix:{en:'', zh:''}}],
      tail:{en:'; only charged after closing is confirmed.', zh:'；成交认定后才收。'},
      tag:{en:'Main revenue · closing-bound', zh:'主收入 · 与成交绑定'} },
    { level:'L3', name:{en:'Efficiency layer · Institutional subscription', zh:'L3 · 效率层 · 机构订阅'},
      desc:{en:'PE / family offices / corporate strategy pay for "deal flow + data", annually.', zh:'PE / 家办 / 企业战投为「标的流 + 数据」付费，年付。'},
      tag:{en:'Phase 2 onward · predictable cashflow', zh:'二期起 · 可预测现金流'},
      ratios:[{key:'sub', text:{en:'Subscription fee', zh:'订阅费'}, suffix:{en:'', zh:''}}] },
  ],
  judgment: {
    en:"Key judgment: the matchmaking platform no longer charges dealmakers a membership fee. They already paid USD 3,000–10,000 for certification; charging an extra \"onboarding fee\" is a second identity tax on the same people with zero new value — the education platform's certification fee is, in essence, the matchmaking platform's customer-acquisition subsidy.",
    zh:"关键判断：撮合平台不再向交易师收会员费。他已经为认证付了 3,000–10,000 美元，再收一笔「入驻费」等于对同一批人收两次身份税，而第二笔没有任何新价值——教育平台的认证费，本质上就是撮合平台的获客补贴。",
  },
  ratios: {
    rate: {
      t:{en:'Seller success-fee rate', zh:'卖方成交服务费率'}, v:{en:'2–3% (base 2.5%)', zh:'2–3%（基准 2.5%）'},
      rows:[
        [{en:'M&A Research Institute (JP)',zh:'M&A 综合研究所（日）'},{en:'Lehman ladder 5%→1%',zh:'Lehman 阶梯 5%→1%'},{en:'Effective ~3.9% (¥64.7M avg / ~¥1.66B avg deal)',zh:'有效费率约 3.9%'},{en:'Deep delivery: 390 advisors, 7.2-month cycle',zh:'深度交付：390 顾问陪跑 7.2 个月'}],
        [{en:'BATONZ (JP)',zh:'BATONZ（日）'},{en:'Free listing + ¥2M+ premium service',zh:'免费挂牌 + 200 万日元起进阶服务'},{en:'Fixed fee replaces percentage',zh:'固定费替代比例费'},{en:'Shallow delivery, small ticket',zh:'交付较浅、客单小'}],
        [{en:'Acquire.com (US)',zh:'Acquire.com（美）'},{en:'Closing fee ~6–8%',zh:'closing fee 约 6–8%'},{en:'Small standardized deals',zh:'小额标准化交易'},{en:'Self-serve, no advisors',zh:'自助交付、无顾问'}],
        [{en:'China FA (reference)',zh:'中国 FA（参照）'},{en:'M&A 1–3%',zh:'并购 1–3%'},{en:'Intense competition, buyer-dominated',zh:'竞争激烈、买方强势'},{en:'Relationship-driven delivery',zh:'关系型交付'}],
      ],
      why:[
        {en:'Rate correlates positively with delivery depth and negatively with ticket size.',zh:'费率与交付深度正相关、与客单价负相关。'},
        {en:'We only do matching, connection, pushing and closing confirmation (L2–L3) — depth between platform and FA.',zh:'我们只做匹配、建联、推进与成交认定（L2–L3），深度在平台与 FA 之间。'},
        {en:'So we set "below the FA ceiling, above pure platforms": 2.5% is the middle price of "I found it, and I helped push it through".',zh:'所以定在「低于 FA 上限、高于纯平台」：2.5% 是「我找到了、也帮你推了」的中间价。'},
      ],
      when:{en:'If average deal < ¥20M → raise to 3.5%; if > ¥500M → lower to 1.5–2%.', zh:'单笔均值 < 2,000 万 → 上调至 3.5%；> 5 亿 → 降至 1.5–2%。'},
      ev:{en:'Evidence: A/B (official fee pages of M&A Research Institute & BATONZ; financials).', zh:'证据：A/B 级（M&A 综研官网费率页、BATONZ 费率页、财报）。'},
    },
    min: {
      t:{en:'Minimum fee', zh:'最低收费'}, v:{en:'¥400k', zh:'40 万'},
      rows:[
        [{en:'M&A Research Institute (JP)',zh:'M&A 综合研究所（日）'},{en:'Min ¥25M',zh:'最低 2,500 万日元'},{en:'≈ ¥1.2M CNY',zh:'约 120 万人民币'},{en:'Covers advisor hours & long cycle',zh:'覆盖顾问工时与长周期'}],
        [{en:'BATONZ (JP)',zh:'BATONZ（日）'},{en:'From ¥2M',zh:'200 万日元起'},{en:'≈ ¥100k CNY',zh:'约 10 万人民币'},{en:'Covers closing-support fixed cost',zh:'覆盖成约支援固定成本'}],
        [{en:'Acquire.com (US)',zh:'Acquire.com（美）'},{en:'No explicit minimum',zh:'无明确最低'},{en:'Pure percentage',zh:'纯比例'},{en:'Deal size itself is the floor',zh:'交易额本身即下限'}],
      ],
      why:[
        {en:'Per-deal fixed cost (review, verification, system, follow-up) estimated at ¥200–300k.',zh:'单笔固定成本（审核、验真、系统、跟单）估算 20–30 万。'},
        {en:'¥400k keeps a safety margin while not completely shutting out small deals.',zh:'设 40 万留安全边际，同时不把小单完全挡在门外。'},
        {en:'Our floor is 1/3–1/2 of Japanese peers — the "low entry barrier in exchange for supply" choice.',zh:'我们的下限只有日本同行的 1/3–1/2，是「先用低门槛换供给」的选择。'},
      ],
      when:{en:'If per-deal cost drops below ¥150k, lower to ¥250–300k to widen coverage.', zh:'单笔成本降到 15 万以下，可降至 25–30 万，扩大覆盖。'},
      ev:{en:'Evidence: A/B.', zh:'证据：A/B 级。'},
    },
    split: {
      t:{en:'Platform : dealmaker revenue split', zh:'平台与交易师分润'}, v:{en:'45 : 55 (range 40–50 / 50–60)', zh:'45 : 55（区间 40–50 / 50–60）'},
      rows:[
        [{en:'M&A Research Institute (JP)',zh:'M&A 综合研究所（日）'},{en:'Platform 100%',zh:'平台 100%'},{en:'Advisors are salaried employees',zh:'顾问是雇员，拿工资'},{en:'In-house: clients belong to platform',zh:'自营模式：客户属于平台'}],
        [{en:'Axial (US)',zh:'Axial（美）'},{en:'Charges advisors membership',zh:'向顾问收会员费'},{en:'Deal upside stays with advisor',zh:'成交收益归顾问'},{en:'Network: clients belong to advisor',zh:'网络模式：客户属于顾问'}],
        [{en:'BATONZ (JP)',zh:'BATONZ（日）'},{en:'Platform + partner rev-share',zh:'平台 + 伙伴分润'},{en:'Partner takes closing reward',zh:'伙伴拿成约报酬'},{en:'Partner brings clients, platform gives tools',zh:'伙伴带客户、平台给工具'}],
      ],
      why:[
        {en:'In a network (non-in-house) model, client relationships sit with the dealmaker.',zh:'网络型（非自营）模式下，客户关系在交易师手里。'},
        {en:'The platform sells "channel + tools + endorsement", not the service itself — so it takes a channel fee.',zh:'平台卖的是「通道 + 工具 + 背书」，不是服务本体，所以拿通道费。'},
        {en:'In-house can take 100%, at the cost of being locked by advisor capacity — the road we must avoid.',zh:'自营能拿 100%，代价是被顾问产能锁死——这是我们要避开的路。'},
      ],
      when:{en:'Platform-dispatched deals can go to 55–60% (client is platform-given); dealmaker-owned clients stay 45:55.', zh:'平台派单的案子可提到 55–60%；交易师自带客户维持 45:55。'},
      ev:{en:'Evidence: B (model inference + public rev-share structures).', zh:'证据：B 级（模式推断 + 公开分润结构）。'},
    },
    first: {
      t:{en:'First-year dealmaker share', zh:'首年交易师分润'}, v:{en:'60% (stepped回调)', zh:'60%（阶梯回调）'},
      rows:[
        [{en:'BATONZ (JP)',zh:'BATONZ（日）'},{en:'Partner program expands supply fast',zh:'伙伴计划快速扩供给'},{en:'Batches of 44–67 firms onboarded',zh:'单批 44–67 家事务所入会'},{en:'Rev-share buys a delivery network',zh:'用分润换交付网络'}],
        [{en:'Axial (US)',zh:'Axial（美）'},{en:'Membership fee filters advisor quality',zh:'用会员费筛顾问质量'},{en:'Paying is the gate',zh:'付费即门槛'},{en:'Filters by price, not by concession',zh:'用价格筛，不用分润让利'}],
        [{en:'Dealsuite (EU)',zh:'Dealsuite（欧）'},{en:'Subscription',zh:'订阅制'},{en:'No rev-share concept',zh:'无分润概念'},{en:'Institutions pay, advisors don\'t split',zh:'机构付费、顾问不分成'}],
      ],
      why:[
        {en:'Cold-start most lacks "dealers with deals", not money; the platform\'s marginal cost is near zero, so concession-for-supply is the cheapest.',zh:'冷启动最缺的是「有项目的交易师」，不是钱；平台边际成本极低，让利换供给最划算。'},
        {en:'It must be stepped (60%→55%→50%), otherwise the year-2 callback triggers churn.',zh:'必须做成阶梯（60%→55%→50%），否则第二年回调会引发流失。'},
      ],
      when:{en:'When master-tier dealmakers ≥ 20 and monthly new mandates ≥ 10, start the step-down.', zh:'主理层交易师 ≥ 20 人、月新增 Mandate ≥ 10 条时，启动阶梯回调。'},
      ev:{en:'Evidence: B.', zh:'证据：B 级。'},
    },
    buyer: {
      t:{en:'Buyer charging', zh:'买方收费'}, v:{en:'0 (permanently free)', zh:'0（永久免费）'},
      rows:[
        [{en:'Acquire.com (US)',zh:'Acquire.com（美）'},{en:'Buyer subscription ~$25/mo+',zh:'买方订阅约 $25/月起'},{en:'Buyer pays to "see"',zh:'买方为「看得见」付费'},{en:'Platform is subscription-funded',zh:'平台靠买方订阅打底'}],
        [{en:'Axial (US)',zh:'Axial（美）'},{en:'Buyer free or low-barrier',zh:'买方免费或低门槛'},{en:'Charges sell-side advisors',zh:'向卖方顾问收费'},{en:'Buyer is the "asset" shown to advisors',zh:'买方是它给顾问看的「资产」'}],
        [{en:'Dealsuite (EU)',zh:'Dealsuite（欧）'},{en:'Charges institutions annual fee',zh:'向机构收年费'},{en:'Buyer pays as member',zh:'买方作为会员付费'},{en:'Europe is highly institutionalized',zh:'欧洲机构化程度高'}],
      ],
      why:[
        {en:'Buyers are the scarce side; charging them drives away the best buyers.',zh:'买方是稀缺侧，向买方收费会赶走最优质的买家。'},
        {en:'Use "verification + monthly quota" instead of a price gate: filter low-quality buyers without hurting demand density.',zh:'用「验真 + 月度配额」替代价格门槛：既过滤低质量买方，又不伤需求密度。'},
      ],
      when:{en:'Phase 2 may sell data & tools to buyer institutions, but never charge for "seeing deals".', zh:'P2 可向买方机构卖数据与工具，但永不对「看项目」收费。'},
      ev:{en:'Evidence: C ($25/mo is third-party, to verify against official pricing).', zh:'证据：C 级（$25/月为第三方整理，待官方定价页核实）。'},
    },
    sub: {
      t:{en:'Institutional subscription', zh:'机构订阅'}, v:{en:'Annual fee · from Phase 2', zh:'年费 · P2 起'},
      rows:[
        [{en:'Dealsuite (EU)',zh:'Dealsuite（欧）'},{en:'Annual subscription, zero success fee',zh:'订阅年费，零成交抽成'},{en:'Revenue decoupled from closing',zh:'收入与成交脱钩'},{en:'Deal density + tools + data',zh:'项目密度 + 工具 + 数据'}],
        [{en:'Acquire.com (US)',zh:'Acquire.com（美）'},{en:'Buyer subscription',zh:'买方订阅'},{en:'Unlock monthly',zh:'按月解锁'},{en:'Low ticket, high frequency',zh:'低客单、高频'}],
        [{en:'Axial (US)',zh:'Axial（美）'},{en:'Membership + success fee',zh:'会员 + 成功费'},{en:'Charged to the advisor side',zh:'向顾问端收'},{en:'Free buyers in exchange for density',zh:'买方免费换密度'}],
      ],
      why:[
        {en:'Subscription works not because it is cheap, but because "missing deals if you unsubscribe".',zh:'订阅成立的前提不是便宜，是「不订会漏单」。'},
        {en:'Phase 1 density is insufficient; selling subscription too early will collapse.',zh:'P1 密度不足，过早卖订阅会崩。'},
        {en:'Anchor: the opportunity cost of one missed deal per year far exceeds the subscription fee.',zh:'锚点：一个买方一年错过一单的机会成本，远高于订阅费。'},
      ],
      when:{en:'Launch when verified mandates ≥ 50 and monthly new ≥ 10; year one may offer early-bird pricing for case studies.', zh:'验真 Mandate ≥ 50 条、月新增 ≥ 10 条时启动；首年可做早鸟价换案例。'},
      ev:{en:'Evidence: B/C.', zh:'证据：B/C 级。'},
    },
    cert: {
      t:{en:'Certification fee (education platform)', zh:'认证费（教育平台）'}, v:{en:'USD 3,000–10,000', zh:'USD 3,000–10,000'},
      rows:[
        [{en:'Industry reference',zh:'行业参照'},{en:'Professional cert anchors on "post-cert income uplift"',zh:'职业认证锚定「持证后收入增量」'},{en:'Not the course cost',zh:'不是课程成本'},{en:'Same logic as CFA / CPA',zh:'CFA / CPA 同逻辑'}],
        [{en:'This project',zh:'本项目'},{en:'Cert fee = matchmaking platform\'s acquisition subsidy',zh:'认证费 = 撮合平台的获客补贴'},{en:'Pay & get certified first, then enter matchmaking',zh:'先付费拿证，再进撮合'},{en:'The basis of the two-platform division',zh:'两平台分工的基础'}],
        [{en:'Risk',zh:'风险'},{en:'Too-high pricing lowers conversion',zh:'定价过高会降低转化'},{en:'Need a low-price trial tier',zh:'需要低价试水档'},{en:'Three-tier structure already provides entry',zh:'三级分层已提供入口'}],
      ],
      why:[
        {en:'Certification is not a course fee — it is an "identity investment": candidates buy future deal capability.',zh:'认证费不是课程费，是「身份投资」——考生买的是未来的成交能力。'},
        {en:'It also carries the matchmaking platform\'s acquisition cost, so the matchmaking platform doesn\'t need to feed itself early on.',zh:'它同时承担了撮合平台的获客成本，所以撮合平台前期不需要自己养活自己。'},
        {en:'This is why the matchmaking platform cannot charge membership again: one fee can only be collected once.',zh:'这也是为什么撮合平台不能再收会员费：一笔钱只能收一次。'},
      ],
      when:{en:'If cert conversion < 3%, lower the entry price or add installments; if > 8%, consider raising the top tier.', zh:'认证转化 < 3% 需下调入门价或增加分期；> 8% 可考虑上调高级档。'},
      ev:{en:'Evidence: proprietary pricing, no direct competitor.', zh:'证据：自有定价，无直接竞品。'},
    },
  },
  moneyFlow: {
    note:{en:'Four inlets, two outlets. Note: buyers are always free, and the platform never holds the transaction consideration.', zh:'四个入口、两个出口。注意：买方永远免费，平台永远不持有交易对价。'},
    in: [
      { who:{en:'Seller', zh:'卖方'}, role:{en:'company / shareholders · closing beneficiary', zh:'企业 / 股东 · 成交受益方'}, amount:{en:'deal value × 2–3%', zh:'成交额 × 2–3%'}, key:'rate' },
      { who:{en:'Institution (PE / family office)', zh:'机构（PE / 家办）'}, role:{en:'deal-flow & data demand side', zh:'标的流与数据需求方'}, amount:{en:'subscription fee · from Phase 2', zh:'订阅费 · P2 起'}, key:'sub' },
      { who:{en:'Buyer', zh:'买方'}, role:{en:'needs verification, never pays', zh:'需要验真，但不需要付费'}, amount:{en:'0 · always free', zh:'0 · 永远免费'}, key:'buyer' },
      { who:{en:'Individual (candidate)', zh:'个人（考生）'}, role:{en:'pay for cert first, then enter matchmaking', zh:'先付费拿证，再进入撮合'}, amount:{en:'certification fee → education platform', zh:'认证费 → 教育平台'}, key:'cert' },
    ],
    out: [
      { who:{en:'Dealmaker', zh:'交易师'}, role:{en:'rev-share · whoever brings the deal takes the larger cut', zh:'分润 · 谁带项目谁拿大头'}, prefix:{en:"Platform fee's ", zh:'平台费的 '}, share:{en:'50–60%', zh:'50–60%'}, key:'split' },
      { who:{en:'Platform ops & tech', zh:'平台运营与技术'}, role:{en:'review, verification, risk control, systems', zh:'审核、验真、风控、系统'}, prefix:{en:'Remaining ', zh:'剩余 '}, share:{en:'40–50%', zh:'40–50%'}, key:'split' },
    ],
    hub:{en:'Matchmaking platform', zh:'撮合平台'},
    hubSub:{en:'match · connect · advance · close-confirm · rev-share', zh:'匹配 · 建联 · 推进 · 成交认定 · 分润'},
    allocate:{en:'Matchmaking platform · allocation', zh:'撮合平台 · 分配'},
    footerTitle:{en:'Two lines not shown in the chart:', zh:'两条不出现图里的线：'},
    footer:[
      {en:'① The transaction consideration (buyer → seller) runs through third-party escrow — it never passes through the platform.', zh:'① 交易对价（买方 → 卖方）走第三方 escrow，不经过平台；'},
      {en:'② AI generates no revenue stream — it is a cost and an experience. Selling reports separately is the most easily-depreciated thing in this business.', zh:'② AI 不产生收入流，它是成本与体验——单独卖报告是这门生意里最容易贬值的一件事。'},
    ],
  },
};
