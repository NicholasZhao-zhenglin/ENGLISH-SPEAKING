/* ==================== 结构化课程（替代旧的扁平题库）====================
 *
 * 结构层级：类目 (life/work) → topic (场景) → unit (5句一组学习版块)
 *
 * 每个 unit 包含：
 *   sentences — 5 句，每条 [英文, 中文, 语法/用法小贴士]
 *   summary   — 3-4 条核心知识要点
 *   quiz      — 4 道选择题（{q, options, answer}，answer 是 options 索引）
 *
 * 设计原则：
 *   - 每 unit 是 1 个完整的口语微场景，5 句话即可上手
 *   - 要点把 unit 内反复出现的语法/词汇抽出来
 *   - 测试题紧扣本 unit 句子，确保学完能答对
 *   - 首批 6 topics × 3 units = 18 units，足够跑一段时间
 *
 * 进度在 store.curriculumProgress 里跟踪，unitKey 形如 "dining.ordering"
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
            sentences: [
              ["Could I see the menu, please?", "请把菜单给我看一下好吗？", "Could I ... 比 Can I ... 礼貌"],
              ["What do you recommend?", "你有什么推荐？", "recommend + sth 推荐某物"],
              ["I'll have the grilled salmon.", "我要一份烤三文鱼。", "I'll have = 我要点（吃/喝）"],
              ["Is this dish spicy?", "这道菜辣吗？", "询问特征：Is this/Is it + adj?"],
              ["Could we have some water, please?", "请给我们来点水。", "some 用于肯定/请求，any 用于否定/疑问"],
            ],
            summary: [
              "点餐三件套：要菜单、看推荐、说 I'll have...",
              "礼貌度：Could I... > May I... > Can I...",
              "I'll have + 名词 = 我要（吃/喝）...",
              "some 用在肯定和请求中，any 用在否定和疑问中",
            ],
            quiz: [
              { q: "请把菜单给我看一下好吗？", options: ["Can I see the menu?", "Could I see the menu, please?", "Show me menu.", "I want menu."], answer: 1 },
              { q: "I'll have the grilled salmon. 中 have 的意思是？", options: ["拥有", "吃/喝", "使……做", "经历"], answer: 1 },
              { q: "询问'这道菜辣吗'用哪句？", options: ["Does it have spicy?", "Is it spicy?", "It is spicy?", "Spicy?"], answer: 1 },
              { q: "What do you recommend? 的意思是？", options: ["你想要什么？", "你有什么推荐？", "你推荐谁？", "你能推荐吗？"], answer: 1 },
            ],
          },
          {
            id: "bill",
            title: "结账与告别",
            sentences: [
              ["Could I have the bill, please?", "请把账单给我好吗？", "英式 bill / 美式 check"],
              ["We'd like to pay separately.", "我们想分开付。", "pay separately 各自结账"],
              ["Is the tip included?", "小费包含了吗？", "tip 在美式餐厅默认 15-20%"],
              ["I'll pay by card.", "我用信用卡付。", "by card / by cash / by Alipay"],
              ["Thanks for the meal, it was lovely!", "谢谢这顿饭，吃得很开心！", "英式常把 lovely 用得很随意"],
            ],
            summary: [
              "英式账单说 bill，美式说 check；tip 小费在美式餐厅常见",
              "分开结账：pay separately / split the bill / go Dutch（各自付）",
              "支付方式：pay by card / by cash / by mobile pay",
              "英式口语中 lovely / brilliant 经常被用得很宽泛，不限于字面意思",
            ],
            quiz: [
              { q: "美式英语中'账单'更常说？", options: ["bill", "check", "note", "receipt"], answer: 1 },
              { q: "我们想分开付怎么说？", options: ["Pay us.", "We'd like to pay separately.", "Pay for us.", "Split pay us."], answer: 1 },
              { q: "I'll pay by card. 中 by 的用法是？", options: ["在...旁边", "通过（方式）", "被...，由...", "到...为止"], answer: 1 },
              { q: "英式口语里 lovely 常用来表达？", options: ["只表示漂亮", "开心、满意", "贵重", "伤心"], answer: 1 },
            ],
          },
          {
            id: "complaint",
            title: "投诉与调整",
            sentences: [
              ["Excuse me, this isn't what I ordered.", "不好意思，这不是我点的。", "投诉时先 Excuse me 起手更礼貌"],
              ["Could you take this back, please?", "能麻烦您把这个退回吗？", "take sth back 退回"],
              ["I asked for it without ice.", "我要的是不加冰的。", "without 表示'没有/不'"],
              ["Is the manager available?", "经理在吗？", "the + 职位名词，作单数理解"],
              ["I'll just have a coffee instead.", "那就给我一杯咖啡吧。", "instead 替代之前点的东西"],
            ],
            summary: [
              "开场用 Excuse me, ... 缓和语气，比直接说 This is wrong 礼貌得多",
              "退回/换菜：take ... back / change ... to ... / ... instead",
              "without + 名词 = 不含...（without ice 不加冰）",
              "要找负责人：Is the manager available? / Could I speak to the manager?",
            ],
            quiz: [
              { q: "Excuse me, this isn't what I ordered. 中 isn't 的完整形式？", options: ["is not", "are not", "does not", "has not"], answer: 0 },
              { q: "请把菜退回怎么说？", options: ["Return this.", "Could you take this back?", "Take this go.", "Back this."], answer: 1 },
              { q: "I asked for it without ice. 中 without 的意思是？", options: ["和...一起", "没有/不", "在...之外", "在...之内"], answer: 1 },
              { q: "找餐厅经理最礼貌的说法？", options: ["Manager!", "I want manager.", "Is the manager available?", "Get manager."], answer: 2 },
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
            sentences: [
              ["Excuse me, could you tell me how to get to the station?", "打扰一下，能告诉我去车站怎么走吗？", "how to get to ... 去某地的走法"],
              ["Is it within walking distance?", "走着能到吗？", "within walking distance 步行可达"],
              ["Turn left at the second traffic light.", "在第二个红绿灯左转。", "turn left / right 左/右转"],
              ["Go straight for about two blocks.", "直走大约两个街区。", "block 街区（约 100-200 米）"],
              ["You can't miss it.", "你不会错过的。", "can't miss 字面'不会错过'= '很显眼'"],
            ],
            summary: [
              "问路核心：Excuse me, could you tell me how to get to + 地点？",
              "左转/右转/直走：turn left / turn right / go straight",
              "block 是城市街区单位，about two blocks 约两个街区",
              "对方怕你找错：You can't miss it.（很显眼）/ It's right next to...",
            ],
            quiz: [
              { q: "打扰一下，能告诉我去车站怎么走吗？", options: ["Where is station?", "Excuse me, could you tell me how to get to the station?", "Tell me station.", "How station?"], answer: 1 },
              { q: "Is it within walking distance? 的意思是？", options: ["走路安全吗？", "走着能到吗？", "走路远吗？", "可以走过去吗？"], answer: 1 },
              { q: "在第二个红绿灯左转怎么说？", options: ["Turn left at the second traffic light.", "Left at second light.", "Second light turn left.", "Light turn left."], answer: 0 },
              { q: "You can't miss it. 的意思是？", options: ["你不能错过", "你不会错过/很显眼", "你不能搞错", "你错过了"], answer: 1 },
            ],
          },
          {
            id: "bus",
            title: "公交地铁",
            sentences: [
              ["Which bus goes to the city centre?", "哪趟公交到市中心？", "which bus / which line 几路"],
              ["Does this bus stop at the museum?", "这趟公交到博物馆吗？", "stop at 在...停靠"],
              ["How much is the fare?", "车费多少？", "fare 车费/票价"],
              ["Could you tell me when we get to Oxford Circus?", "到 Oxford Circus 时能告诉我吗？", "get to = arrive at"],
              ["I'd like a Day Travelcard, please.", "请给我一张一日通票。", "I'd like = I would like（礼貌请求）"],
            ],
            summary: [
              "找线路：Which bus/line goes to + 地点？Does this bus stop at + 地点？",
              "到站提醒：Could you tell me when we get to + 站名？",
              "买票：How much is the fare? / I'd like a Day Travelcard",
              "I'd like... 比 I want... 礼貌，更适合服务场景",
            ],
            quiz: [
              { q: "哪趟公交到市中心？", options: ["Which bus goes to city?", "Which bus goes to the city centre?", "Where bus city?", "Bus city?"], answer: 1 },
              { q: "Does this bus stop at the museum? 中 stop at 的意思是？", options: ["停在（某地）", "下车", "开始于", "错过"], answer: 0 },
              { q: "I'd like a Day Travelcard. 中 I'd 的完整形式？", options: ["I would", "I had", "I should", "I did"], answer: 0 },
              { q: "Could you tell me when we get to Oxford Circus? 中 get to 的意思是？", options: ["上车", "到达", "下车", "路过"], answer: 1 },
            ],
          },
          {
            id: "taxi",
            title: "打车与租车",
            sentences: [
              ["Could you take me to this address, please?", "能载我去这个地址吗？", "take sb to ... 载某人去某地"],
              ["How long will it take?", "大概要多久？", "询问时长：How long + will + ...?"],
              ["Please drop me off at the corner.", "请让我在街角下车。", "drop off 让...下车（vs pick up 接人）"],
              ["Could you turn the meter on?", "请打表好吗？", "meter 计价器"],
              ["Keep the change, thanks.", "不用找了，谢谢。", "找零给小费：Keep the change"],
            ],
            summary: [
              "打车：take me to + 地址 / How long will it take? / drop me off at...",
              "drop off 让下车 / pick up 让人上车，要分清",
              "meter 计价器：Turn the meter on 打表，避免议价",
              "小费文化：Keep the change = 不用找了；restaurants 15-20%",
            ],
            quiz: [
              { q: "Could you take me to this address, please? 中 take 的用法是？", options: ["拿走", "载送", "接受", "需要"], answer: 1 },
              { q: "How long will it take? 询问的是？", options: ["距离", "时长", "价格", "路线"], answer: 1 },
              { q: "让司机在街角停怎么说？", options: ["Stop here.", "Please drop me off at the corner.", "Get off corner.", "Corner stop."], answer: 1 },
              { q: "Keep the change. 适合在哪种场景？", options: ["买菜", "打车/餐厅付小费", "超市", "银行"], answer: 1 },
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
            sentences: [
              ["I'm just looking, thanks.", "我就随便看看，谢谢。", "逛店时不想被打扰的金句"],
              ["Could you help me find the milk?", "能帮我找一下牛奶吗？", "help sb find sth 帮某人找..."],
              ["Do you have this in a smaller size?", "这个有小一号的吗？", "in + 尺寸/颜色：in a smaller size"],
              ["Can I try this on?", "我能试一下吗？", "try on 试穿（衣物/鞋）"],
              ["Where are the fitting rooms?", "试衣间在哪？", "fitting room / changing room"],
            ],
            summary: [
              "不被打扰：I'm just looking, thanks.",
              "找货：Could you help me find + 物品？ / Do you have + 物品？",
              "试穿：Can I try this on? / fitting room 试衣间",
              "描述规格：in a smaller/larger size 小/大一号；in red 红色的",
            ],
            quiz: [
              { q: "I'm just looking, thanks. 的意思是？", options: ["我正在找", "我就随便看看", "我要买东西", "我看着"], answer: 1 },
              { q: "这个有小一号的吗？", options: ["Smaller one?", "Do you have this in a smaller size?", "This small?", "Have small one?"], answer: 1 },
              { q: "Can I try this on? 中 try on 的意思是？", options: ["试穿", "试试", "穿上", "试一下（不穿）"], answer: 0 },
              { q: "fitting room 的意思是？", options: ["健身房", "试衣间", "会议室", "卧室"], answer: 1 },
            ],
          },
          {
            id: "price",
            title: "价格与砍价",
            sentences: [
              ["How much is this?", "这个多少钱？", "How much ...? 问价格"],
              ["That's a bit pricey.", "有点贵。", "pricey = expensive，口语化"],
              ["Is there a discount?", "能打折吗？", "discount 折扣；on sale 打折中"],
              ["Could you do any better on the price?", "价格还能再优惠点吗？", "do better on ... 在某方面做得更好"],
              ["I'll take it.", "我要了。", "拍板成交：I'll take it."],
            ],
            summary: [
              "问价：How much is/are ...? / What's the price of ...?",
              "嫌贵：That's a bit pricey/expensive.",
              "讲价：Is there a discount? / Could you do any better on the price?",
              "拍板：I'll take it.（我要了）/ I'll think about it.（我再想想）",
            ],
            quiz: [
              { q: "这个多少钱？", options: ["How many this?", "How much is this?", "How price?", "What price this?"], answer: 1 },
              { q: "pricey 的意思是？", options: ["便宜", "贵", "合理", "离谱"], answer: 1 },
              { q: "Is there a discount? 的同义句是？", options: ["Can I have it cheap?", "Is there a discount?", "You make cheap?", "Discount you?"], answer: 1 },
              { q: "I'll take it. 在购物场景的意思是？", options: ["我要拿走", "我要了（成交）", "我考虑一下", "我不要"], answer: 1 },
            ],
          },
          {
            id: "return",
            title: "退货与售后",
            sentences: [
              ["I'd like to return this, please.", "我想退一下这个。", "return 退货；refund 退款"],
              ["I bought it yesterday.", "我昨天买的。", "buy 的过去式 bought / 不规则"],
              ["Do you have the receipt?", "您有收据吗？", "receipt 收据（美）/ receipt（英）"],
              ["Could I get a refund?", "能退款吗？", "get a refund 拿到退款"],
              ["I'd like to exchange it for a different colour.", "我想换个颜色。", "exchange A for B 把 A 换成 B"],
            ],
            summary: [
              "退货：I'd like to return this. / Could I get a refund?",
              "凭证：receipt 收据；退货时常被问 Do you have the receipt?",
              "换货：exchange A for B 把 A 换成 B / swap it for ... 换...",
              "过去式：buy-bought / take-took；买东西/拿走的不规则变化要记熟",
            ],
            quiz: [
              { q: "I'd like to return this, please. 中 return 的意思是？", options: ["归还/退还", "再来", "再次", "归还给某人"], answer: 0 },
              { q: "Do you have the receipt? 中 receipt 的意思是？", options: ["收据", "菜单", "优惠券", "会员卡"], answer: 0 },
              { q: "我想换个颜色怎么说？", options: ["Change colour.", "I'd like to exchange it for a different colour.", "Other colour.", "Colour change me."], answer: 1 },
              { q: "bought 是哪个动词的过去式？", options: ["bring", "buy", "borrow", "beat"], answer: 1 },
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
            sentences: [
              ["Good morning, thank you for having me.", "早上好，谢谢给我这次机会。", "have sb = 给某人（面试）机会"],
              ["I'm a graduate student in AI at USTB.", "我是北科大的人工智能研究生。", "graduate student 研究生"],
              ["My research focuses on large language models.", "我的研究聚焦在大语言模型上。", "focus on 聚焦于..."],
              ["I have built a RAG system with 5000+ documents.", "我搭建过一个 5000+ 文档的 RAG 系统。", "have built 现在完成时强调经验"],
              ["I'm excited about this opportunity.", "我对这个机会很期待。", "excited about 对...很兴奋"],
            ],
            summary: [
              "开场致谢：Good morning, thank you for having me.",
              "身份：I'm a graduate student in + 方向 at + 学校",
              "研究：My research focuses on + 方向",
              "成就：I have built/published/led + 项目，强调完成时（已有经验）",
            ],
            quiz: [
              { q: "I'm a graduate student in AI at USTB. 中 graduate student 的意思是？", options: ["毕业生", "研究生", "本科生", "博士生"], answer: 1 },
              { q: "My research focuses on large language models. 中 focus on 的意思是？", options: ["专注于", "放弃", "喜爱", "面对"], answer: 0 },
              { q: "I have built a RAG system 中 have built 的时态？", options: ["一般过去", "现在完成", "过去完成", "将来"], answer: 1 },
              { q: "面试开场最礼貌的一句？", options: ["Hi, I'm here.", "Good morning, thank you for having me.", "Let's start.", "I'm ready."], answer: 1 },
            ],
          },
          {
            id: "qa",
            title: "常见问答",
            sentences: [
              ["Could you tell me about your strengths?", "能说说你的优势吗？", "strength 优势（vs weakness 弱点）"],
              ["I'm a fast learner and a team player.", "我学得快，也善于团队协作。", "team player 团队协作者"],
              ["What are your weaknesses?", "你的弱点是什么？", "弱点问题经典且必问"],
              ["I tend to be a perfectionist.", "我有时会过于追求完美。", "tend to 倾向于（坦诚但把弱点说成中性）"],
              ["Where do you see yourself in five years?", "你五年后想做什么？", "see yourself 设想自己"],
            ],
            summary: [
              "优势题：I'm a fast learner / I'm detail-oriented / I'm a team player",
              "弱点题：先承认 → I tend to / I sometimes ... → 但正在改进",
              "五年规划：Where do you see yourself in five years? 答具体方向+对公司的贡献",
              "叙述结构：STAR（Situation → Task → Action → Result）讲一个例子",
            ],
            quiz: [
              { q: "team player 的意思是？", options: ["队长", "团队协作者", "替补", "新员工"], answer: 1 },
              { q: "I tend to be a perfectionist. 中 tend to 的意思是？", options: ["打算", "倾向于", "尝试", "成功做某事"], answer: 1 },
              { q: "Where do you see yourself in five years? 是在问？", options: ["视力", "未来规划", "现在的工作", "同事关系"], answer: 1 },
              { q: "strength 的反义词是？", options: ["weakness", "weak", "sick", "fail"], answer: 0 },
            ],
          },
          {
            id: "salary",
            title: "谈薪与福利",
            sentences: [
              ["Could we discuss the compensation?", "能聊聊薪酬吗？", "compensation 总薪酬（口语更直接说 salary）"],
              ["Based on my experience, I'd expect around Y.", "基于我的经验，我期望大约 Y。", "expect 期望；around + 数 大约"],
              ["Is the package negotiable?", "整体待遇可以谈吗？", "package 待遇包；negotiable 可议"],
              ["Could you walk me through the benefits?", "能介绍下福利吗？", "walk through 一步步过一遍"],
              ["I'd like a few days to think it over.", "我想要几天时间考虑一下。", "think it over 仔细考虑"],
            ],
            summary: [
              "不要第一个谈钱：等对方先开价或安排 dedicated 谈薪轮",
              "谈薪：I'd expect around + 数字 + based on ... 用事实支撑",
              "询问福利：benefits / package / paid leave / health insurance",
              "不急着答应：I'd like a few days to think it over.（争取时间）",
            ],
            quiz: [
              { q: "compensation 在职场中通常指？", options: ["加班", "总薪酬", "补偿金", "奖金"], answer: 1 },
              { q: "I'd expect around Y. 中 expect 的意思是？", options: ["期待", "期望（基于事实）", "等待", "接受"], answer: 1 },
              { q: "Could you walk me through the benefits? 中 walk through 的意思是？", options: ["走过去", "一步步过一遍", "跑过去", "走出去"], answer: 1 },
              { q: "think it over 的意思是？", options: ["想清楚", "想太多", "想不起来", "想出来"], answer: 0 },
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
            sentences: [
              ["Hi, I'm the new joiner. Nice to meet you!", "你好，我是新同事，请多关照！", "new joiner 新入职员工"],
              ["Where should I set up my workstation?", "我应该在哪里搭工位？", "workstation 工位"],
              ["Could you show me around the office?", "能带我转一下办公室吗？", "show sb around 带某人参观"],
              ["Who should I reach out to for IT issues?", "IT 问题应该找谁？", "reach out to 找/联系某人"],
              ["I'm excited to get started!", "我很期待开始工作！", "get started 开始"],
            ],
            summary: [
              "打招呼：Hi, I'm the new joiner. Nice to meet you!",
              "找工位：Where should I set up my workstation?",
              "熟悉环境：Could you show me around the office?",
              "找对人：Who should I reach out to for + 问题？",
            ],
            quiz: [
              { q: "new joiner 的意思是？", options: ["新员工", "新老板", "新客户", "新人（新来的同事）"], answer: 3 },
              { q: "Could you show me around the office? 中 show around 的意思是？", options: ["展示", "带...参观/转转", "介绍", "表演"], answer: 1 },
              { q: "Who should I reach out to for IT issues? 中 reach out to 的意思是？", options: ["触达", "联系/找", "举手", "抗议"], answer: 1 },
              { q: "I'm excited to get started! 的意思是？", options: ["我紧张", "我很期待开始", "我累了", "我想离开"], answer: 1 },
            ],
          },
          {
            id: "colleagues",
            title: "同事互动",
            sentences: [
              ["Would you like to grab a coffee?", "一起去喝杯咖啡？", "grab a coffee 顺路喝咖啡"],
              ["I'm working on the RAG module this week.", "我这周在做 RAG 模块。", "work on 从事/做某项目"],
              ["Could you send me that file when you get a chance?", "有空时能把那个文件发我吗？", "when you get a chance 有空时"],
              ["Happy to help!", "乐意效劳。", "happy to + do 乐意做某事"],
              ["Let me know if you need anything.", "需要什么跟我说。", "let me know 告诉我"],
            ],
            summary: [
              "约咖啡：Would you like to grab a coffee? / Let's grab lunch.",
              "请求不紧急：when you get a chance / whenever you're free",
              "主动帮忙：Happy to help! / Let me know if you need anything.",
              "工作描述：I'm working on + 项目；I've finished + 任务",
            ],
            quiz: [
              { q: "grab a coffee 在职场中通常意味着？", options: ["抢咖啡", "顺路喝杯咖啡", "买咖啡", "做咖啡"], answer: 1 },
              { q: "Could you send me that file when you get a chance? 的意思是？", options: ["请立刻发文件", "有空时把文件发我", "不要发文件", "我会发文件"], answer: 1 },
              { q: "Happy to help! 的同义句？", options: ["I help.", "I am happy.", "Glad to assist!", "No problem!"], answer: 2 },
              { q: "Let me know if you need anything. 的语气是？", options: ["命令", "礼貌主动关心", "抱怨", "感谢"], answer: 1 },
            ],
          },
          {
            id: "asking",
            title: "求助与提问",
            sentences: [
              ["Sorry to bother you, but I have a quick question.", "不好意思打扰，有个简短问题。", "bother 打扰；quick question 不占时间"],
              ["Could I pick your brain about something?", "能向你请教个事吗？", "pick your brain 字面'挑脑'= 请教"],
              ["Do you have a moment?", "您有空吗？", "Do you have a moment? 礼貌问'有空吗'"],
              ["I'm a bit stuck on this issue.", "我这个问题卡住了。", "be stuck on 卡在...上"],
              ["Thanks for your help — really appreciate it.", "谢谢帮忙，真的很感激。", "appreciate 感激（比 thanks 更郑重）"],
            ],
            summary: [
              "先铺垫：Sorry to bother you / Do you have a moment?",
              "请教：Could I pick your brain about + 主题？",
              "表达困境：I'm stuck on ... / I'm not sure how to ...",
              "道谢升级：Thanks → I appreciate it → I really appreciate it",
            ],
            quiz: [
              { q: "Sorry to bother you 中 bother 的意思是？", options: ["打扰", "帮助", "生气", "感谢"], answer: 0 },
              { q: "Could I pick your brain about something? 的意思是？", options: ["挑你脑子里的东西", "向你请教", "请你回忆", "让你想一下"], answer: 1 },
              { q: "I'm a bit stuck on this issue. 中 stuck 的意思是？", options: ["粘住", "卡住/受阻", "兴奋", "决定"], answer: 1 },
              { q: "appreciate 比 thanks 更？", options: ["随意", "郑重", "口语化", "轻蔑"], answer: 1 },
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
            sentences: [
              ["I'm writing to follow up on the proposal.", "我写信来跟进一下提案。", "follow up on 跟进..."],
              ["Please find the attachment for your reference.", "请查收附件以供参考。", "商务邮件经典客套句"],
              ["Could you revert by end of day?", "能在下班前回复吗？", "revert 回复（商务用语）"],
              ["Thanks for your prompt reply.", "感谢您的及时回复。", "prompt 及时的"],
              ["Looking forward to hearing from you.", "期待您的回信。", "look forward to 期待（接名词/动名词）"],
            ],
            summary: [
              "邮件开头：I'm writing to ... / Further to our last email...",
              "夹附件：Please find the attachment for your reference.",
              "请回复：Could you revert by + 时间？ / Looking forward to hearing from you.",
              "客套：Thanks for your prompt reply / Kind regards / Best regards",
            ],
            quiz: [
              { q: "follow up on 的意思是？", options: ["跟着走", "跟进", "追随", "放下"], answer: 1 },
              { q: "Please find the attachment for your reference. 是？", options: ["非正式", "正式商务邮件", "朋友聊天", "投诉"], answer: 1 },
              { q: "revert 在商务邮件中的意思是？", options: ["返回", "回复", "撤销", "倒转"], answer: 1 },
              { q: "prompt 在 prompt reply 中的意思是？", options: ["提示", "及时的", "快嘴", "催促"], answer: 1 },
            ],
          },
          {
            id: "meeting",
            title: "会议参与",
            sentences: [
              ["Could everyone hear me clearly?", "大家能听清我说话吗？", "线上会议开场自检"],
              ["Let's start with a quick round-up.", "咱们先简单回顾一下。", "round-up 总结/回顾"],
              ["I'd like to defer to my colleague on this.", "这点我想请我同事来讲。", "defer to 遵从/让位"],
              ["Does anyone have any objections?", "有人有异议吗？", "objection 异议（会议表决用语）"],
              ["Let's take this offline.", "这个我们线下再聊。", "take ... offline 线下再讨论"],
            ],
            summary: [
              "开场自检：Could everyone hear me clearly? / Can you see my screen?",
              "推进议程：Let's start with + 主题 / Let's move on to ...",
              "表态：I'd like to defer to + 人 / I'd like to table this.（暂搁）",
              "收尾：Let's take this offline / Let's sync up after the meeting",
            ],
            quiz: [
              { q: "round-up 在会议中通常指？", options: ["圆圈", "总结回顾", "开场", "投票"], answer: 1 },
              { q: "I'd like to defer to my colleague. 中 defer to 的意思是？", options: ["延迟", "遵从/让位", "参考", "同意"], answer: 1 },
              { q: "Does anyone have any objections? 是用于？", options: ["请求帮助", "会议表决", "邀请发言", "请人离开"], answer: 1 },
              { q: "Let's take this offline. 中 take offline 的意思是？", options: ["下线", "线下再讨论", "取消", "停止"], answer: 1 },
            ],
          },
          {
            id: "progress",
            title: "进度汇报",
            sentences: [
              ["Here's where we are so far.", "这是我们目前的进展。", "汇报进度开场白"],
              ["I've wrapped up the preprocessing.", "预处理我已经做完了。", "wrap up 完成/收尾"],
              ["We're slightly behind schedule.", "我们稍微落后于进度。", "behind schedule 落后于进度"],
              ["I'm confident we'll catch up next week.", "我有信心下周能赶上。", "catch up 赶上"],
              ["Do you have any concerns?", "您有什么顾虑吗？", "concern 顾虑（vs question 提问）"],
            ],
            summary: [
              "汇报结构：已完成 → 进行中 → 风险 / 下一步",
              "完成：wrap up / finish up / get done；进行中：in progress / under way",
              "风险：We're slightly behind schedule / I'm running into an issue",
              "主动求反馈：Do you have any concerns? / Anything you'd like me to adjust?",
            ],
            quiz: [
              { q: "wrap up 的意思是？", options: ["包起来", "完成/收尾", "开始", "打包"], answer: 1 },
              { q: "behind schedule 的意思是？", options: ["落后于进度", "在计划之前", "在时间表后", "按时"], answer: 0 },
              { q: "catch up 的意思是？", options: ["抓住", "赶上", "追上", "追捕"], answer: 1 },
              { q: "Do you have any concerns? 的语气是？", options: ["命令", "主动征求反馈", "质疑", "拒绝"], answer: 1 },
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