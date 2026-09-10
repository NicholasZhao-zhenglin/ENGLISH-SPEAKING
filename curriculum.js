/* ==================== 结构化课程（替代旧的扁平题库）====================
 *
 * 结构层级：类目 (life/work) → topic (场景) → unit (1 句核心 + 3 个迁移题)
 *
 * 每个 unit 包含：
 *   anchor     — 1 句核心句（用户先学的金句） [en, zh, tip]
 *   transfers  — 3 个举一反三场景：
 *                { scenario_zh, hint_zh, sample: [en, zh, tip] }
 *                用户用 anchor 的句式/词汇去说 3 个新场景，必须用语音
 *   summary    — 3-4 条核心知识要点
 *   quiz       — 4 道选择题
 *
 * 设计原则：
 *   - 不一次给 5 句死记硬背；只给 1 句金句作为"母句"，剩下的靠 transfer 题驱动
 *     举一反三，把同句式套到 3 个真实生活/工作场景
 *   - transfer 必须用语音回答，让用户练的是嘴而不是键盘
 *   - 训练目标"学以致用"：anchor 是 1 个 pattern，transfers 强迫你在 3 个
 *     不同场景里复现这个 pattern
 *   - 18 unit × 3 transfer 题 ≈ 54 道口语练习，足够跑 18 天
 * ===================================================================== */

const CURRICULUM = {
  life: {
    label: "生活",
    topics: [
      {
        id: "dining",
        title: "餐厅用餐",
        icon: "🍽️",
        units: [
          {
            id: "ordering",
            title: "点餐",
            anchor: ["Could we have some water, please?", "请给我们来点水。", "Could we ... please? 比 Can we ... 礼貌；some 用于肯定/请求，不用 any。"],
            transfers: [
              { scenario_zh: "在酒店想请服务员再送一床被子到房间", hint_zh: "用 Could we ... please? 句式，把 water 换成 blanket", sample: ["Could we have an extra blanket, please?", "请给我们再加一床被子。", "extra 多加的"] },
              { scenario_zh: "在咖啡店想请店员多给几张餐巾纸", hint_zh: "用 Could we ... please? 句式，把 water 换成 napkins", sample: ["Could we have some more napkins, please?", "请再多给我们几张餐巾纸。", "napkins 餐巾纸"] },
              { scenario_zh: "在飞机上想向空乘要一杯橙汁", hint_zh: "用 Could I ... please? 句式（点对个人时）", sample: ["Could I have a glass of orange juice, please?", "请给我来一杯橙汁。", "向个人请求用 Could I"] },
            ],
            summary: [
              "请求金句：Could we / Could I have some + 物品, please?",
              "some 用于肯定和请求，any 用于否定和疑问",
              "对服务员说 we（团队）；对自己说 I（个人）",
              "tip 里 learn / get / take / try 也都能换成动词：Could I try the cake?",
            ],
            quiz: [
              { q: "Could we have some water, please? 中 some 的用法对吗？", options: ["错，应改成 any", "对，some 用于肯定/请求", "只能用 many", "用 no"], answer: 1 },
              { q: "请给我们再来一床被子怎么说？", options: ["Could we have an extra blanket, please?", "Give me blanket.", "I want blanket now.", "Blanket!"], answer: 0 },
              { q: "Could I ... please? 通常对谁说？", options: ["团体", "对个人（向店员点单）", "对老板", "对宠物"], answer: 1 },
              { q: "哪种说法最不礼貌？", options: ["Could we have some water, please?", "Could I have some water, please?", "Water, please.", "Give me water."], answer: 3 },
            ],
          },
          {
            id: "bill",
            title: "结账与告别",
            anchor: ["Could I have the bill, please?", "请把账单给我好吗？", "英式英语 bill；美式 check。Could I ... please? 是服务场景的金句模板。"],
            transfers: [
              { scenario_zh: "在咖啡店买完咖啡，想拿收据报销", hint_zh: "用 Could I have the receipt, please? 句式", sample: ["Could I have the receipt, please?", "请把收据给我好吗？", "receipt 收据"] },
              { scenario_zh: "在酒店前台想拿一张 wifi 密码卡", hint_zh: "用 Could I have the wifi password, please? 或 ... a wifi card?", sample: ["Could I have the wifi password, please?", "请把 wifi 密码给我好吗？", "password 密码"] },
              { scenario_zh: "在餐厅想换一张干净的餐盘（之前的脏了）", hint_zh: "用 Could I have a clean plate, please?", sample: ["Could I have a clean plate, please?", "请给我换一个干净的盘子。", "plate 餐盘"] },
            ],
            summary: [
              "服务场景金句：Could I have the + 单据/物品, please?",
              "bill（英）/ check（美）= 账单；receipt = 收据",
              "换物品：clean 干净的 / new 新的 / fresh 新鲜的 都可修饰",
              "想要一项服务时，礼貌前缀几乎都是 Excuse me / Could I / Sorry to bother",
            ],
            quiz: [
              { q: "美式英语说账单更常用？", options: ["bill", "check", "note", "paper"], answer: 1 },
              { q: "请把收据给我好吗？", options: ["Give me receipt.", "Could I have the receipt, please?", "Receipt!", "I want receipt now."], answer: 1 },
              { q: "Could I have a clean plate, please? 中 plate 的意思是？", options: ["盘子", "盒子", "照片", "地点"], answer: 0 },
              { q: "结账时最礼貌的起手式？", options: ["Hey, bill!", "Excuse me, could I have the bill, please?", "Bill here.", "Money time."], answer: 1 },
            ],
          },
          {
            id: "complaint",
            title: "投诉与调整",
            anchor: ["Excuse me, this isn't what I ordered.", "不好意思，这不是我点的。", "投诉开场 Excuse me 缓和语气；this isn't ... 比 This is wrong 礼貌得多。"],
            transfers: [
              { scenario_zh: "在咖啡店发现服务员送来的牛奶是脱脂的，但你想要全脂", hint_zh: "用 Excuse me, this isn't the ... I ordered / I asked for", sample: ["Excuse me, this isn't the whole milk I asked for.", "不好意思，这不是我要的全脂牛奶。", "whole milk 全脂牛奶"] },
              { scenario_zh: "在酒店发现房间是 smoking room，但你订的是 non-smoking", hint_zh: "用 Excuse me, this isn't the room I reserved. I booked a non-smoking one.", sample: ["Excuse me, this isn't the room I reserved.", "不好意思，这不是我预订的房间。", "reserve 预订（酒店/餐厅）"] },
              { scenario_zh: "在餐厅发现菜做得太辣，你点的明明是微辣", hint_zh: "用 Excuse me, this isn't ... I ordered. I asked for mild.", sample: ["Excuse me, this is too spicy. I ordered mild.", "不好意思，这个太辣了，我点的是微辣。", "mild 微辣 / medium 中辣 / hot 重辣"] },
            ],
            summary: [
              "投诉开场固定模板：Excuse me, this isn't / wasn't + 你期待的东西",
              "this isn't / wasn't 比 This is wrong 礼貌，是英国文化中常用的柔性表达",
              "我没点的/错了：I ordered / I asked for / I booked（预订场景）",
              "辣度：mild 微辣 / medium 中辣 / hot 重辣（说英语的人常用这套）",
            ],
            quiz: [
              { q: "Excuse me, this isn't what I ordered. 中 isn't 是？", options: ["is not", "are not", "was not", "does not"], answer: 0 },
              { q: "我点的是微辣用哪个词？", options: ["small", "mild", "low", "no spicy"], answer: 1 },
              { q: "预订酒店房间用？", options: ["order", "book", "buy", "take"], answer: 1 },
              { q: "投诉时最礼貌的开场？", options: ["Hey, this is wrong!", "Excuse me, this isn't what I ordered.", "What is this?", "No good!"], answer: 1 },
            ],
          },
        ],
      },
      {
        id: "transit",
        title: "出行交通",
        icon: "🚇",
        units: [
          {
            id: "directions",
            title: "问路与导航",
            anchor: ["Excuse me, could you tell me how to get to the station?", "打扰一下，能告诉我去车站怎么走吗？", "Excuse me 起手问路人很礼貌；how to get to + 地点 是万能问路模板。"],
            transfers: [
              { scenario_zh: "问路人去最近的地铁站怎么走", hint_zh: "替换 station 为 the nearest subway station", sample: ["Excuse me, could you tell me how to get to the nearest subway station?", "打扰一下，能告诉我去最近的地铁站怎么走吗？", "nearest 最近的"] },
              { scenario_zh: "问酒店前台去机场最快怎么走", hint_zh: "用 how to get to the airport the fastest way? 或 ... what's the fastest way to the airport?", sample: ["Excuse me, what's the fastest way to get to the airport?", "打扰一下，去机场最快的走法是什么？", "the fastest way 最快的方式"] },
              { scenario_zh: "问路人附近最近的洗手间在哪", hint_zh: "用 Where's the nearest restroom, please?", sample: ["Excuse me, where's the nearest restroom, please?", "打扰一下，请问最近的洗手间在哪？", "restroom / toilet 洗手间"] },
            ],
            summary: [
              "万能问路：Excuse me, could you tell me how to get to + 地点？",
              "简化版：Where's the nearest + 设施？",
              "修饰：nearest 最近的 / the fastest way 最快的 / the cheapest way 最便宜的",
              "礼貌前缀：Excuse me 是英美文化里搭讪陌生人必备",
            ],
            quiz: [
              { q: "Excuse me, could you tell me how to get to the station? 中 how to get to 是？", options: ["怎么去", "怎么到", "怎么离开", "怎么叫"], answer: 0 },
              { q: "最近的洗手间用哪个？", options: ["the nearest restroom", "the close toilet", "the near WC", "the smallest bathroom"], answer: 0 },
              { q: "问路最礼貌的起手？", options: ["Hi, where?", "Excuse me, could you tell me...", "Tell me way.", "Hey you!"], answer: 1 },
              { q: "the fastest way to ... 的意思是？", options: ["最便宜的路", "最快的路", "最远的路", "最简单的路"], answer: 1 },
            ],
          },
          {
            id: "bus",
            title: "公交地铁",
            anchor: ["Could you tell me when we get to Oxford Circus?", "到 Oxford Circus 时能告诉我吗？", "在地铁/公交上让陌生人提醒你到站的金句：Could you tell me when we get to + 站名？"],
            transfers: [
              { scenario_zh: "在公交车上让旁边人提醒你到机场航站楼", hint_zh: "把 Oxford Circus 换成 the airport terminal", sample: ["Could you tell me when we get to the airport terminal?", "到机场航站楼时能告诉我吗？", "terminal 航站楼/终点站"] },
              { scenario_zh: "在长途大巴上让旁边乘客提醒你到上海", hint_zh: "把 Oxford Circus 换成 Shanghai", sample: ["Could you tell me when we get to Shanghai?", "到上海时能告诉我吗？", "长途大巴常用城市名"] },
              { scenario_zh: "在景区班车上让司机提醒你到 East Gate", hint_zh: "把 Oxford Circus 换成 the East Gate", sample: ["Could you tell me when we get to the East Gate?", "到东门时能告诉我好吗？", "East Gate 东门（景区常用）"] },
            ],
            summary: [
              "交通工具上提醒到站：Could you tell me when we get to + 地点？",
              "get to = arrive at = reach（到达）",
              "地名/站名/航站楼都可以套进去",
              "如果不熟：抱歉打扰 Excuse me, ... 更稳",
            ],
            quiz: [
              { q: "Could you tell me when we get to Oxford Circus? 中 get to 的意思是？", options: ["上车", "到达", "下车", "路过"], answer: 1 },
              { q: "机场航站楼用哪个词？", options: ["airport building", "terminal", "station", "pier"], answer: 1 },
              { q: "在公交车上让陌生人提醒你到站的起手？", options: ["Hey, tell me when...", "Excuse me, could you tell me when...", "Wake me up at...", "I'm lost."], answer: 1 },
              { q: "Could you ... please? 的 please 作用是？", options: ["没意义", "让请求更礼貌", "强调语气", "替代 sorry"], answer: 1 },
            ],
          },
          {
            id: "taxi",
            title: "打车与租车",
            anchor: ["Could you take me to this address, please?", "能载我去这个地址吗？", "打车金句：take me to + 地址 / Could you ... please? 礼貌前缀。"],
            transfers: [
              { scenario_zh: "上车后想告诉司机走最快的路线", hint_zh: "用 Could you take the fastest route, please?", sample: ["Could you take the fastest route, please?", "请走最快的路线好吗？", "route 路线"] },
              { scenario_zh: "到目的地前提醒司机靠左边停（方便下车）", hint_zh: "用 Could you drop me off on the left side, please?", sample: ["Could you drop me off on the left side, please?", "请让我在左边下车。", "drop off 让...下车"] },
              { scenario_zh: "下车前问司机大概要多少钱", hint_zh: "用 Could you tell me how much it will be, please?", sample: ["Could you tell me how much it will be, please?", "请告诉我大概多少钱好吗？", "how much it will be 大概要多少钱"] },
            ],
            summary: [
              "打车金句：Could you take me to + 地址? / drop me off at + 地点",
              "take sb to = 载某人去；drop off = 让...下车；pick up = 接人",
              "走法修饰：fastest route / shortest route / avoid highways",
              "问价：How much will it be? / Could you tell me how much?",
            ],
            quiz: [
              { q: "Could you take me to this address, please? 中 take 的意思是？", options: ["拿走", "载送", "接受", "需要"], answer: 1 },
              { q: "drop me off 的反义短语？", options: ["drop me down", "pick me up", "take me off", "let me down"], answer: 1 },
              { q: "最快的路线用？", options: ["the fast route", "the fastest route", "the quick way", "the speed line"], answer: 1 },
              { q: "问司机大概多少钱最礼貌？", options: ["How much?", "Money?", "Could you tell me how much it will be, please?", "What price?"], answer: 2 },
            ],
          },
        ],
      },
      {
        id: "shopping",
        title: "购物消费",
        icon: "🛍️",
        units: [
          {
            id: "selection",
            title: "选购与询问",
            anchor: ["Could you help me find the milk?", "能帮我找一下牛奶吗？", "在超市/店里求助的金句：Could you help me find + 物品？"],
            transfers: [
              { scenario_zh: "在书店找不到某本英文书，请店员找", hint_zh: "用 Could you help me find + 书名？", sample: ["Could you help me find 'Sapiens'?", "能帮我找一下《人类简史》吗？", "书名/电影名用引号"] },
              { scenario_zh: "在服装店看上一件衣服，想试穿但不确定尺码", hint_zh: "用 Could you help me find a size M?", sample: ["Could you help me find a size M?", "能帮我找一件 M 码的吗？", "size + 字母/数字"] },
              { scenario_zh: "在超市找不到 organic 食品区，问店员在哪", hint_zh: "用 Could you tell me where the organic section is, please?", sample: ["Could you tell me where the organic section is, please?", "请告诉我有机食品区在哪？", "section 区/部门"] },
            ],
            summary: [
              "求助金句：Could you help me find + 物品？",
              "想找某区/位置：Could you tell me where the + 区 is, please?",
              "书名/电影名：用引号或斜体，举例 'Sapiens'",
              "尺码：size S/M/L/XL（服装）/ size 38/40/42（欧码）",
            ],
            quiz: [
              { q: "Could you help me find the milk? 中 find 是？", options: ["找到/寻找", "理解", "借", "支付"], answer: 0 },
              { q: "Could you tell me where the organic section is, please? 中 section 是？", options: ["区/部门", "季节", "第二部分", "章节"], answer: 0 },
              { q: "在书店求一本书最礼貌？", options: ["Where is Sapiens?", "Book Sapiens where?", "Could you help me find 'Sapiens'?", "Find me book!"], answer: 2 },
              { q: "size M 在英美服装中表示？", options: ["最大", "中等", "最小", "男款"], answer: 1 },
            ],
          },
          {
            id: "price",
            title: "价格与砍价",
            anchor: ["Could you do any better on the price?", "价格还能再优惠点吗？", "议价金句：Could you do any better on + 名词？比 Give me discount 礼貌得多。"],
            transfers: [
              { scenario_zh: "在电子产品店看中一台电脑，但比预算贵 200 块", hint_zh: "用 Could you do any better on the price, please?", sample: ["Could you do any better on the price, please?", "价格还能再优惠点吗？", "do better on 在...上做得更好"] },
              { scenario_zh: "在地摊买小饰品，问老板能不能 two for the price of one", hint_zh: "用 Could you do a buy-one-get-one deal?", sample: ["Could you do a buy-one-get-one deal?", "能买一送一吗？", "buy-one-get-one 买一送一"] },
              { scenario_zh: "在酒店订房嫌贵，问能不能升级到套房", hint_zh: "用 Could you upgrade me to a suite, please?", sample: ["Could you upgrade me to a suite, please?", "能把我升级到套房吗？", "upgrade 升级"] },
            ],
            summary: [
              "议价万能：Could you do any better on the price?",
              "买一送一：buy-one-get-one / BOGO",
              "升级：upgrade me to + 高级选项（suite / ocean view / business class）",
              "谈判语气不要命令式，要 Could you ...? 句型",
            ],
            quiz: [
              { q: "Could you do any better on the price? 中 better 的意思是？", options: ["更好的", "更坏的", "最贵的", "更便宜的"], answer: 0 },
              { q: "BOGO 是？", options: ["big online gift option", "buy-one-get-one（买一送一）", "best offer go on", "brand original goods outlet"], answer: 1 },
              { q: "升级到套房用？", options: ["up me", "upgrade me to a suite", "suite me up", "give suite"], answer: 1 },
              { q: "议价最不礼貌？", options: ["Could you do any better on the price?", "Cheaper, please.", "Could you lower the price a bit?", "Is there any discount?"], answer: 1 },
            ],
          },
          {
            id: "return",
            title: "退货与售后",
            anchor: ["I'd like to return this, please.", "我想退一下这个。", "退货金句：I'd like to return this / I'd like to exchange this for a different one. I'd like = I would like（委婉请求）。"],
            transfers: [
              { scenario_zh: "在商场买的鞋回家发现鞋底脱胶，想换一双新的", hint_zh: "用 I'd like to exchange this for a new pair, please.", sample: ["I'd like to exchange this for a new pair, please.", "我想换一双新的。", "exchange A for B 把 A 换成 B"] },
              { scenario_zh: "网购的衣服尺码不合适，想换 L 码", hint_zh: "用 I'd like to exchange this for a size L, please.", sample: ["I'd like to exchange this for a size L, please.", "我想换成 L 码的。", "size L L 码"] },
              { scenario_zh: "买的电子产品有质量问题，想要退款", hint_zh: "用 I'd like a refund, please. It's defective.", sample: ["I'd like a refund, please. It's defective.", "我想退款。这个有质量问题。", "refund 退款 / defective 有缺陷的"] },
            ],
            summary: [
              "退货三件套：I'd like to return this / exchange this for ... / get a refund",
              "I'd like 比 I want 委婉，是服务/客服场景首选",
              "质量问题：defective / doesn't work / not as described",
              "保留 receipt 收据 / packaging 包装 退货更顺畅",
            ],
            quiz: [
              { q: "I'd like to return this 中 I'd 是？", options: ["I had", "I would", "I did", "I should"], answer: 1 },
              { q: "exchange A for B 的意思是？", options: ["A 和 B 交换", "把 A 换成 B", "买 A 送 B", "退回 B"], answer: 1 },
              { q: "refund 是？", options: ["换货", "退款", "维修", "折扣"], answer: 1 },
              { q: "退货时最有礼貌的起手？", options: ["Hey, I want refund.", "I'd like to return this, please.", "Give me money back!", "This is bad!"], answer: 1 },
            ],
          },
        ],
      },
    ],
  },
  work: {
    label: "工作",
    topics: [
      {
        id: "interview",
        title: "求职面试",
        icon: "🎯",
        units: [
          {
            id: "intro",
            title: "自我介绍",
            anchor: ["I'm a graduate student in AI at USTB.", "我是北科大的人工智能研究生。", "介绍身份的模板：I'm a + 身份 + in + 专业 + at + 学校。"],
            transfers: [
              { scenario_zh: "自我介绍时说自己来自清华，学计算机", hint_zh: "把 USTB 换成 Tsinghua，AI 换成 computer science", sample: ["I'm a graduate student in computer science at Tsinghua.", "我是清华的计算机研究生。", "graduate student 研究生 / undergrad 本科生"] },
              { scenario_zh: "介绍自己来自腾讯，做后端开发工程师", hint_zh: "用 I work as a + 职位 + at + 公司", sample: ["I work as a backend engineer at Tencent.", "我在腾讯做后端开发工程师。", "work as ... 担任...职位"] },
              { scenario_zh: "自我介绍时说自己有 3 年算法经验", hint_zh: "用 I have over 3 years of experience in + 方向", sample: ["I have over 3 years of experience in machine learning.", "我有 3 年以上的机器学习经验。", "over + 时间 = 超过"] },
            ],
            summary: [
              "学生身份：I'm a + undergrad/graduate student in + 专业 at + 学校",
              "在职身份：I work as a + 职位 at + 公司 / I am a + 职位 at + 公司",
              "经验：I have + over/under + 时间 of experience in + 方向",
              "亮点：放在身份句之后，紧跟 have built / led / published + 成就",
            ],
            quiz: [
              { q: "I'm a graduate student in AI at USTB. 中 graduate student 是？", options: ["毕业生", "研究生", "本科生", "博士生"], answer: 1 },
              { q: "I work as a backend engineer at Tencent. 中 work as 是？", options: ["做（某职位）", "工作像", "为了", "像工作"], answer: 0 },
              { q: "3 years of experience in machine learning 中 experience 是？", options: ["可数", "不可数", "复数", "动词"], answer: 1 },
              { q: "自我介绍最有信息量的顺序？", options: ["姓名 → 家乡 → 爱好", "身份 → 在哪 → 方向 → 亮点", "爱好 → 姓名 → 学校", "先去过的国家"], answer: 1 },
            ],
          },
          {
            id: "qa",
            title: "常见问答",
            anchor: ["Could you tell me about your strengths?", "能说说你的优势吗？", "面试官提问 strengths 用 could you tell me about ...？回答用 I'm a + 形容词 + and ...。"],
            transfers: [
              { scenario_zh: "面试官问你的缺点是什么", hint_zh: "用 My main weakness is ... but I'm working on it.", sample: ["My main weakness is that I tend to overthink, but I'm learning to balance.", "我主要的缺点是容易想太多，但我正在学着平衡。", "weakness 缺点 / overthink 想太多"] },
              { scenario_zh: "面试官问 5 年后想做什么", hint_zh: "用 In five years, I see myself + -ing / as a + 角色", sample: ["In five years, I see myself leading an AI engineering team.", "5 年后我希望带领一支 AI 工程团队。", "see yourself 设想自己"] },
              { scenario_zh: "面试官问为什么离开上一家公司", hint_zh: "用 I'm looking for a new challenge / I'm seeking more growth opportunities.", sample: ["I'm looking for a new challenge and more growth opportunities.", "我在找新的挑战和更多的成长机会。", "looking for 寻找"] },
            ],
            summary: [
              "优势题答法：I'm a + 形容词（fast learner / detail-oriented / team player）",
              "弱点题答法：先承认 → 用 but 引导如何改进",
              "5 年规划：In five years, I see myself + -ing / as a + 角色",
              "离职原因：looking for new challenges / growth / impact（中性不抱怨）",
            ],
            quiz: [
              { q: "Could you tell me about your strengths? 中 strengths 是？", options: ["优势", "弱点", "爱好", "家庭"], answer: 0 },
              { q: "我主要的缺点是容易想太多 中 overthink 是？", options: ["多想", "过度思考/想太多", "不在乎", "外向"], answer: 1 },
              { q: "I'm looking for a new challenge. 中 looking for 是？", options: ["看着", "寻找", "寻找（动作）", "关心"], answer: 2 },
              { q: "面试回答弱点的最佳结构？", options: ["否认有缺点", "先承认 → 用 but 引导如何改进", "只说优点", "随便编一个"], answer: 1 },
            ],
          },
          {
            id: "salary",
            title: "谈薪与福利",
            anchor: ["Could we discuss the compensation?", "能聊聊薪酬吗？", "谈薪开场：Could we discuss the compensation? compensation = 总薪酬包，比 salary 更正式。"],
            transfers: [
              { scenario_zh: "问 HR 公司有没有远程办公政策", hint_zh: "用 Could you tell me about your remote work policy?", sample: ["Could you tell me about your remote work policy?", "能介绍下贵司的远程办公政策吗？", "remote work policy 远程办公政策"] },
              { scenario_zh: "问 HR 年假有几天", hint_zh: "用 How many paid vacation days do you offer?", sample: ["How many paid vacation days do you offer?", "贵司提供几天带薪年假？", "paid vacation days 带薪年假"] },
              { scenario_zh: "问 HR 有没有员工股票计划", hint_zh: "用 Do you offer an employee stock option plan?", sample: ["Do you offer an employee stock option plan?", "贵司有员工股票期权计划吗？", "employee stock option 员工股票期权"] },
            ],
            summary: [
              "问福利：benefits / package / paid leave / health insurance / remote work",
              "问政策：Could you tell me about your + 政策?",
              "问具体数字：How many + 福利 days do you offer?",
              "do you offer ... = 是否提供（福利/政策）",
            ],
            quiz: [
              { q: "compensation 通常指？", options: ["加班", "总薪酬包", "补偿金", "奖金"], answer: 1 },
              { q: "Do you offer a remote work policy? 中 offer 是？", options: ["提供", "报价", "拒绝", "送给"], answer: 0 },
              { q: "paid vacation days 的中文是？", options: ["无薪假", "带薪年假", "病假", "调休"], answer: 1 },
              { q: "问 HR 福利最礼貌？", options: ["What benefits?", "Tell me all benefits.", "Could you tell me about your benefits?", "Free lunch?"], answer: 2 },
            ],
          },
        ],
      },
      {
        id: "onboarding",
        title: "入职适应",
        icon: "🏢",
        units: [
          {
            id: "firstday",
            title: "第一天",
            anchor: ["Could you show me around the office?", "能带我转一下办公室吗？", "入职第一天最常问：show me around the office / Where should I set up my workstation? show around = 带...参观。"],
            transfers: [
              { scenario_zh: "第一天到岗想问 HR 茶水间在哪", hint_zh: "用 Could you tell me where the kitchen is, please?", sample: ["Could you tell me where the kitchen is, please?", "请问茶水间在哪？", "kitchen / pantry 茶水间"] },
              { scenario_zh: "第一天想认识同组的人，问 leader 怎么介绍", hint_zh: "用 Could you introduce me to the team when you have a moment?", sample: ["Could you introduce me to the team when you have a moment?", "您有空时能把我介绍给团队吗？", "introduce sb to ... 把某人介绍给..."] },
              { scenario_zh: "入职第一周发现工位没有显示器，问 IT 怎么办", hint_zh: "用 Who should I reach out to for an extra monitor?", sample: ["Who should I reach out to for an extra monitor?", "我应该找谁要一台额外的显示器？", "monitor 显示器"] },
            ],
            summary: [
              "第一天金句：Could you show me around? / Where should I set up my workstation?",
              "找设施：Could you tell me where the + 设施 is?（kitchen / restroom / meeting room）",
              "找人帮忙：Who should I reach out to for + 需求？",
              "introduce me to the team 让团队认识你",
            ],
            quiz: [
              { q: "Could you show me around the office? 中 show around 是？", options: ["展示", "带...参观/转转", "介绍", "表演"], answer: 1 },
              { q: "茶水间用哪个词？", options: ["tea room", "kitchen / pantry", "drink place", "tea area"], answer: 1 },
              { q: "Who should I reach out to for + 问题? 中 reach out to 是？", options: ["触达", "联系/找", "举手", "抗议"], answer: 1 },
              { q: "introduce me to the team 是？", options: ["带我离开团队", "把我介绍给团队", "我介绍我自己", "推荐我"], answer: 1 },
            ],
          },
          {
            id: "colleagues",
            title: "同事互动",
            anchor: ["Could you send me that file when you get a chance?", "有空时能把那个文件发我吗？", "职场不紧急请求：when you get a chance / whenever you're free / no rush, but ... 降低对方压力。"],
            transfers: [
              { scenario_zh: "约同事下周一起吃午饭", hint_zh: "用 Would you like to grab lunch next Tuesday?", sample: ["Would you like to grab lunch next Tuesday?", "下周二一起吃午饭吗？", "grab lunch 顺路吃午饭"] },
              { scenario_zh: "看到同事搬重物，主动问要不要帮忙", hint_zh: "用 Do you need a hand with that?", sample: ["Do you need a hand with that?", "需要帮忙吗？", "a hand 一只手 = 一点帮助"] },
              { scenario_zh: "同事给你推荐了一家餐厅，你想感谢", hint_zh: "用 Thanks for the recommendation — I'll check it out!", sample: ["Thanks for the recommendation — I'll check it out!", "谢谢推荐——我去看看！", "recommendation 推荐 / check it out 看看"] },
            ],
            summary: [
              "不紧急请求前缀：when you get a chance / no rush, but ... / whenever you're free",
              "约饭/约咖啡：Would you like to grab + 餐? / Let's grab lunch.",
              "主动帮忙：Do you need a hand with + 任务？",
              "感谢推荐：Thanks for the recommendation — I'll check it out!",
            ],
            quiz: [
              { q: "when you get a chance 的语气是？", options: ["很紧急", "不紧急/有空时", "拒绝", "感谢"], answer: 1 },
              { q: "Do you need a hand with that? 中 a hand 的意思是？", options: ["一只手", "一点帮助", "一只手臂", "一个人"], answer: 1 },
              { q: "I'll check it out. 适合在？", options: ["听朋友推荐后", "餐厅点菜时", "签合同时", "睡觉前"], answer: 0 },
              { q: "同事互动哪种最不礼貌？", options: ["Would you like to grab lunch?", "Could you send me that file when you get a chance?", "Send me that file now!", "Let me know if you need anything."], answer: 2 },
            ],
          },
          {
            id: "asking",
            title: "求助与提问",
            anchor: ["Sorry to bother you, but I have a quick question.", "不好意思打扰，有个简短问题。", "求助开场金句：Sorry to bother you / Do you have a moment? 降低打扰感。"],
            transfers: [
              { scenario_zh: "向同事请教 Git rebase 的用法", hint_zh: "用 Sorry to bother you, but could you explain how to use git rebase?", sample: ["Sorry to bother you, but could you explain how to use git rebase?", "不好意思打扰，能解释下 git rebase 怎么用吗？", "explain 解释 / rebase 变基"] },
              { scenario_zh: "向 leader 报告卡在一个 bug 上", hint_zh: "用 I'm a bit stuck on this bug. Could you take a look when you have time?", sample: ["I'm a bit stuck on this bug. Could you take a look when you have time?", "我卡在这个 bug 上了，您有空能看下吗？", "stuck 卡住 / take a look 看一眼"] },
              { scenario_zh: "向同事感谢解答，想进一步邀咖啡", hint_zh: "用 Thanks for your help — let me buy you a coffee sometime.", sample: ["Thanks for your help — let me buy you a coffee sometime.", "谢谢帮忙——改天我请你喝咖啡。", "buy sb a coffee 请某人喝咖啡"] },
            ],
            summary: [
              "求助开场：Sorry to bother you / Do you have a moment?",
              "请教：Could I pick your brain about + 主题？ / Could you explain how to + 动词?",
              "卡住：I'm a bit stuck on ... / I'm running into an issue with ...",
              "升级感谢：Thanks → I appreciate it → let me buy you a coffee",
            ],
            quiz: [
              { q: "Sorry to bother you 中 bother 是？", options: ["打扰", "帮助", "生气", "感谢"], answer: 0 },
              { q: "Could I pick your brain about something? 是？", options: ["挑你脑子里的东西", "向你请教", "请你回忆", "让你想一下"], answer: 1 },
              { q: "I'm a bit stuck on this bug. 中 stuck 是？", options: ["粘住", "卡住/受阻", "兴奋", "决定"], answer: 1 },
              { q: "let me buy you a coffee 的潜台词？", options: ["我想喝咖啡", "感谢你想请你", "我请你（感谢）", "我想买"], answer: 2 },
            ],
          },
        ],
      },
      {
        id: "daily",
        title: "日常办公",
        icon: "💼",
        units: [
          {
            id: "email",
            title: "邮件沟通",
            anchor: ["Could you revert by end of day?", "能在下班前回复吗？", "商务邮件金句：Could you revert by + 时间? revert 在职场 = reply（回复）。"],
            transfers: [
              { scenario_zh: "邮件里请同事在本周内给反馈", hint_zh: "用 Could you revert by end of this week, please?", sample: ["Could you revert by end of this week, please?", "请在这周末前回复好吗？", "by end of this week 本周末前"] },
              { scenario_zh: "邮件里询问附件是否收到", hint_zh: "用 Could you confirm receipt of the attachment, please?", sample: ["Could you confirm receipt of the attachment, please?", "请确认下附件是否收到好吗？", "confirm receipt 确认收悉"] },
              { scenario_zh: "邮件里 cc 老板并说 thanks in advance", hint_zh: "用 Looping in + 人 for visibility. Thanks in advance for your help.", sample: ["Looping in my manager for visibility. Thanks in advance for your help.", "抄送我老板让他知情。提前感谢您的帮助。", "loop in 抄送 / thanks in advance 提前感谢"] },
            ],
            summary: [
              "邮件催促：Could you revert by + 时间?",
              "确认收悉：confirm receipt of the + 物品",
              "抄送/通知：Looping in + 人 for visibility（让相关方知情）",
              "客气结尾：Thanks in advance / Looking forward to hearing from you",
            ],
            quiz: [
              { q: "Could you revert by end of day? 中 revert 在邮件中是？", options: ["返回", "回复", "撤销", "倒转"], answer: 1 },
              { q: "end of day 的意思是？", options: ["今日结束", "周末", "月底", "周一"], answer: 0 },
              { q: "Looping in my manager 是？", options: ["给我老板打电话", "把我老板加进邮件链", "删除我老板", "跟我老板开会"], answer: 1 },
              { q: "Thanks in advance 的中文是？", options: ["事后感谢", "提前感谢", "再次感谢", "不用感谢"], answer: 1 },
            ],
          },
          {
            id: "meeting",
            title: "会议参与",
            anchor: ["Could everyone hear me clearly?", "大家能听清我说话吗？", "线上会议开场自检金句：Could everyone hear me clearly? / Can you see my screen? 解决最常见的'我这边是不是没声音'问题。"],
            transfers: [
              { scenario_zh: "会议开始问大家能不能看到共享屏幕", hint_zh: "用 Can everyone see my screen?", sample: ["Can everyone see my screen?", "大家能看到我共享的屏幕吗？", "screen 屏幕"] },
              { scenario_zh: "开会时突然有急事要离场，问能否提前下线", hint_zh: "用 Sorry, I have to drop off early. I'll catch up on the recording.", sample: ["Sorry, I have to drop off early. I'll catch up on the recording.", "不好意思我得提前下线。我会看录像补上。", "drop off early 提前下线 / catch up on 补"] },
              { scenario_zh: "会议上同事讲得太长，想礼貌打断", hint_zh: "用 Sorry to interrupt — could we take this offline and continue after the meeting?", sample: ["Sorry to interrupt — could we take this offline and continue after the meeting?", "不好意思打断——这个我们线下再聊好吗？", "interrupt 打断 / take this offline 线下再聊"] },
            ],
            summary: [
              "线上会议自检：Could everyone hear me clearly? / Can everyone see my screen?",
              "提前下线：Sorry, I have to drop off early. I'll catch up on the recording.",
              "礼貌打断：Sorry to interrupt — could we take this offline?",
              "推进议程：Let's move on to + 主题 / Let's table this（暂搁）",
            ],
            quiz: [
              { q: "Could everyone hear me clearly? 适合在？", options: ["会议开始", "会议结束", "吃饭时", "睡觉时"], answer: 0 },
              { q: "drop off early 的意思是？", options: ["提早到", "提早离开", "提早结束会议", "提早发言"], answer: 1 },
              { q: "take this offline 的意思是？", options: ["下线", "线下再聊", "取消", "停止"], answer: 1 },
              { q: "I'll catch up on the recording. 的意思是？", options: ["我会追上", "我会看录像补上", "我会赶上", "我会重复"], answer: 1 },
            ],
          },
          {
            id: "progress",
            title: "进度汇报",
            anchor: ["We're slightly behind schedule.", "我们稍微落后于进度。", "汇报进度金句：We're slightly behind schedule / ahead of schedule / on track. slightly = 略微（柔和负面表达）。"],
            transfers: [
              { scenario_zh: "周报里说项目已经提前一周完成", hint_zh: "用 We're about a week ahead of schedule.", sample: ["We're about a week ahead of schedule.", "我们提前了大约一周。", "ahead of schedule 提前"] },
              { scenario_zh: "周报里说本周遇到一个 blocker", hint_zh: "用 We've run into a blocker on + 模块 / topic.", sample: ["We've run into a blocker on the data preprocessing step.", "数据预处理这一步遇到了阻碍。", "blocker 阻碍 / run into 遇到"] },
              { scenario_zh: "周报里说下周计划做什么", hint_zh: "用 Next week, we plan to + 动词原形 ...", sample: ["Next week, we plan to ship the MVP and start user testing.", "下周我们计划交付 MVP 并开始用户测试。", "plan to 计划 / ship 交付"] },
            ],
            summary: [
              "进度状态：on track / ahead of schedule / slightly behind schedule",
              "风险：We've run into a blocker on + 主题（具体模块）",
              "下周计划：Next week, we plan to + 动词原形",
              "汇报结构：已完成（wrap up）→ 进行中（in progress）→ 风险 → 下一步",
            ],
            quiz: [
              { q: "We're slightly behind schedule. 中 slightly 的作用是？", options: ["加强负面", "缓和负面", "强调速度", "强调精确"], answer: 1 },
              { q: "run into a blocker 的意思是？", options: ["跑进障碍", "遇到阻碍", "冲破阻碍", "绕过阻碍"], answer: 1 },
              { q: "Next week, we plan to ship the MVP. 中 ship 是？", options: ["船运", "交付", "扔", "试"], answer: 1 },
              { q: "周报哪个最完整？", options: ["做了什么+计划", "做了什么+风险+下一步", "只写做了什么", "只写心情"], answer: 1 },
            ],
          },
        ],
      },
    ],
  },
};

/* ---------- 工具函数 ---------- */

// 判断某个 unit 是否已解锁（开课日 + 自然日偏移 <= 已解锁数量）
function curriculumIsUnlocked(index, unlockedCount) {
  if (typeof unlockedCount !== "number") unlockedCount = (typeof Store !== "undefined" && Store.curriculumUnlockedCount) || 0;
  return index < unlockedCount;
}

// 给所有 unit 加 idx + locked 标记
function curriculumAllUnits() {
  const out = [];
  let i = 0;
  const unlockedCount = (typeof Store !== "undefined" && Store.curriculumUnlockedCount) || 0;
  for (const cat of Object.keys(CURRICULUM)) {
    const topics = CURRICULUM[cat].topics;
    for (const t of topics) for (const u of t.units) {
      const key = `${cat}.${t.id}.${u.id}`;
      out.push({ cat, topic: t, unit: u, key, idx: i, locked: !curriculumIsUnlocked(i, unlockedCount) });
      i++;
    }
  }
  return out;
}

// 当前应学的 unit：第一个已解锁且未完成
function curriculumNextPending() {
  const done = (typeof Store !== "undefined" && Store.curriculumDone) || {};
  const all = curriculumAllUnits();
  for (const x of all) if (!x.locked && !done[x.key]) return x;
  return null;
}

// 统计进度
function curriculumStats(doneMap) {
  const all = curriculumAllUnits();
  const total = all.length;
  let completed = 0, scoreSum = 0, scoreCount = 0;
  for (const x of all) {
    const d = doneMap && doneMap[x.key];
    if (d) {
      completed++;
      if (typeof d.quizScore === "number") { scoreSum += d.quizScore; scoreCount++; }
    }
  }
  return { total, completed, remaining: total - completed, avgScore: scoreCount ? Math.round(scoreSum / scoreCount) : null };
}