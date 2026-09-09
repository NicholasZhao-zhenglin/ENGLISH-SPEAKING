/* ==================== 题库 ==================== */

const DATA = {
  life: {
    label: "生活",
    scenarios: [
      { title: "食堂点菜", prompt: "你正在食堂点菜，怎么叫服务员，并告诉他你想要一杯热水？", answers: ["Excuse me, could I have a cup of hot water, please?", "Excuse me, may I have a cup of hot water?", "Excuse me, I would like a cup of hot water, please."] },
      { title: "点外卖", prompt: "你在外卖 App 上点了餐，送餐员打电话说到了楼下，你怎么让他把外卖放在门口？", answers: ["Could you please leave it at my door?", "Please just leave it at the door, thank you.", "You can leave it at my door. Thanks a lot."] },
      { title: "超市购物", prompt: "你在超市找不到酱油，怎么问工作人员？", answers: ["Excuse me, where can I find soy sauce?", "Excuse me, could you tell me where the soy sauce is?", "Hi, I am looking for soy sauce. Where is it?"] },
      { title: "问路", prompt: "你在陌生城市迷路了，想问路去最近的地铁站，怎么开口？", answers: ["Excuse me, could you tell me how to get to the nearest subway station?", "Excuse me, could you tell me the way to the nearest metro station?", "Excuse me, how can I get to the nearest subway station?"] },
      { title: "公交车上", prompt: "你不知道该在哪站下车，想请旁边乘客到站时提醒你，怎么说？", answers: ["Excuse me, could you let me know when we get to the next stop?", "Excuse me, would you please tell me when my stop comes?", "Sorry, could you remind me when we arrive at the next stop?"] },
      { title: "医院挂号", prompt: "你感冒发烧想去医院看病，怎么跟挂号处说？", answers: ["I would like to see a doctor. I have a fever and a sore throat.", "I need to register. I have a bad cold and a fever.", "I feel sick. I have a fever and I need to see a doctor."] },
      { title: "药店买药", prompt: "你去药店想买止咳糖浆，怎么跟店员说？", answers: ["I am looking for cough syrup. Could you recommend one?", "Do you have any cough syrup?", "I would like to buy some cough syrup, please."] },
      { title: "理发店", prompt: "你去理发店，想把头发剪短一点，怎么跟理发师说？", answers: ["I would like to get a haircut, just a little shorter, please.", "Could you cut my hair a bit shorter?", "I want to trim my hair a little, please."] },
      { title: "租房看房", prompt: "你打电话咨询一间出租房，想问月租多少、是否包水电，怎么开口？", answers: ["Hi, I am calling about the apartment for rent. How much is the monthly rent, and are utilities included?", "Hello, I saw your listing. Could you tell me the rent and whether utilities are included?", "Hi, I am interested in the apartment. What is the rent per month? Does it include water and electricity?"] },
      { title: "快递寄送", prompt: "你去快递点寄一个包裹，想问多久能到，怎么说？", answers: ["I would like to send this package. How long does it take to arrive?", "Hi, I want to ship this box. When will it be delivered?", "Could you tell me how many days it takes to deliver this package?"] },
      { title: "健身房咨询", prompt: "你想办一张健身房月卡，怎么向前台咨询价格和设施？", answers: ["Hi, I am interested in a monthly membership. How much does it cost, and what facilities do you have?", "Hello, could you tell me the price for a one-month pass and what equipment is available?", "I would like to know about your monthly plan and the gym facilities."] },
      { title: "餐厅订位", prompt: "你想打电话给餐厅预订今晚七点四人桌，怎么说？", answers: ["Hi, I would like to book a table for four at seven tonight, please.", "Could I make a reservation for four people at 7 PM this evening?", "I would like to reserve a table for four tonight at seven o'clock."] },
      { title: "酒店入住", prompt: "你到达酒店想办理入住，怎么跟前台说？", answers: ["Hi, I have a reservation under the name Zhang. I would like to check in, please.", "Hello, I have a booking for tonight. Could I check in now?", "Good afternoon, I would like to check in. My name is on the reservation."] },
      { title: "退房", prompt: "你第二天要退房，想问前台是否可以延迟退房到下午两点，怎么说？", answers: ["Hi, is it possible to check out at 2 PM instead?", "Could I have a late check-out until two o'clock this afternoon?", "Excuse me, would it be possible to extend my check-out time to 2 PM?"] },
      { title: "景点买票", prompt: "你在景点售票处想买两张成人票，怎么开口？", answers: ["I would like two adult tickets, please.", "Could I have two adult tickets, please?", "Two adult tickets, please."] },
      { title: "旅游问景点", prompt: "你在旅游问询处想了解附近有什么值得去的景点，怎么问？", answers: ["Excuse me, could you recommend some places to visit around here?", "Hi, what are the must-see attractions nearby?", "Could you tell me what is worth visiting in this area?"] },
      { title: "购物退换货", prompt: "你买的鞋子尺码不合适，想换一双大一号的，怎么跟店员说？", answers: ["Hi, these shoes do not fit. Could I exchange them for a larger size?", "Excuse me, I would like to return these shoes and get a bigger size, please.", "These shoes are too small. Could you exchange them for one size up?"] },
      { title: "咖啡店点单", prompt: "你在咖啡店想点一杯大杯拿铁，少糖，怎么跟店员说？", answers: ["I would like a large latte with less sugar, please.", "Could I have a large latte, low sugar, please?", "A large latte with less sugar, please."] },
      { title: "银行开户", prompt: "你想在银行开一个新账户，怎么跟柜台说？", answers: ["I would like to open a new bank account, please.", "Hello, I want to open an account. What documents do I need?", "Could you help me open a new account? What should I prepare?"] },
      { title: "修手机", prompt: "你的手机屏幕碎了，去维修店咨询换屏价格和时间，怎么开口？", answers: ["Hi, my phone screen is broken. How much does it cost to replace it, and how long will it take?", "Excuse me, I cracked my phone screen. Could you tell me the price for a screen repair?", "My screen is cracked. How much for a replacement and when can I pick it up?"] },
      { title: "宠物医院", prompt: "你带生病的猫去看兽医，想描述症状（不吃东西、没精神），怎么开口？", answers: ["My cat has not been eating and seems very tired. Could you take a look at her?", "Hello, my cat is not eating and has no energy. What could be wrong?", "I am worried about my cat. She has not eaten anything and is very listless."] },
      { title: "乘坐出租车", prompt: "你上了一辆出租车，告诉司机去北京西站，怎么开口？", answers: ["Hi, could you take me to Beijing West Railway Station, please?", "Excuse me, I need to go to Beijing West Station.", "To Beijing West Railway Station, please."] },
      { title: "搬家", prompt: "你打电话给搬家公司，想预约周六搬家并询问价格，怎么开口？", answers: ["Hi, I would like to schedule a move on Saturday. How much do you charge?", "Hello, I need movers this Saturday. Could you tell me your rates?", "I am looking to move this weekend. What are your prices?"] },
      { title: "网购客服", prompt: "你网购的书三天了还没到，打电话给客服。你可能会说什么？", answers: ["Hi, I ordered a book three days ago and it has not arrived yet. Could you check the status for me?", "Hello, my order has not been delivered after three days. What is going on?", "Excuse me, I have not received my book yet. It has been three days. When will it arrive?"] },
      { title: "游泳池咨询", prompt: "你想去小区附近的游泳馆，打电话问开放时间和票价，怎么开口？", answers: ["Hi, could you tell me your opening hours and how much a ticket costs?", "Hello, I would like to know what time you open and the entrance fee.", "Excuse me, when are you open and how much is admission?"] },
      { title: "理发染发", prompt: "你在理发店想染一个深棕色，怎么跟理发师描述？", answers: ["I would like to dye my hair dark brown, please.", "Could you color my hair dark brown?", "I want to get my hair dyed dark brown. Is that possible?"] },
    ],
    opens: [
      { title: "服务员询问", prompt: "服务员问：'先生，您需要什么？'你可能会说什么？（自由回答）", hints: ["说明想要的食物或饮品", "使用礼貌句式 Would like / Could I have"] },
      { title: "新同学见面", prompt: "开学第一天，同实验室的新同学跟你打招呼。你会说什么？（自由回答）", hints: ["自我介绍：姓名、专业、研究方向", "使用 Nice to meet you"] },
      { title: "邻里打招呼", prompt: "你在电梯里遇到邻居。你可能会说什么？（自由回答）", hints: ["简短寒暄：Good morning / How are you", "可以聊天气或楼层"] },
      { title: "朋友聚会", prompt: "你参加朋友的生日聚会。你可能会说什么？（自由回答）", hints: ["祝生日快乐 Happy birthday", "可以聊近况或赞美场地"] },
      { title: "遇到老朋友", prompt: "你在街上偶遇多年未见的老朋友。你可能会说什么？（自由回答）", hints: ["表达惊讶：It has been so long", "询问近况：How have you been"] },
      { title: "餐厅投诉", prompt: "你在餐厅发现菜品里有异物，想向服务员反映。你可能会说什么？（自由回答）", hints: ["礼貌说明问题：I am sorry but", "提出诉求：能否换一道菜"] },
      { title: "借钱", prompt: "你想向好朋友借 500 块钱，下个月还。你可能会说什么？（自由回答）", hints: ["说明原因和金额", "承诺还款时间"] },
      { title: "约朋友吃饭", prompt: "你想约朋友这周六一起吃午饭。你可能会说什么？（自由回答）", hints: ["提出时间和地点", "询问对方是否方便"] },
      { title: "拒绝邀请", prompt: "朋友邀请你周末去爬山，但你已经安排了其他事。你可能会说什么？（自由回答）", hints: ["先感谢邀请", "礼貌拒绝并说明原因"] },
      { title: "交换联系方式", prompt: "你在一次活动中认识了新朋友，想交换微信。你可能会说什么？（自由回答）", hints: ["表达聊得开心的感受", "主动提出加联系方式"] },
      { title: "谈论天气", prompt: "你在等公交车，旁边的人说今天天气很好。你可能会接什么话？（自由回答）", hints: ["表示同意并展开", "可以聊周末计划"] },
      { title: "安慰朋友", prompt: "朋友考试没考好，情绪低落。你可能会说什么？（自由回答）", hints: ["先表达理解 I understand", "给予鼓励：下一次会更好"] },
      { title: "祝贺升职", prompt: "你的好朋友升职了。你可能会说什么？（自由回答）", hints: ["表达祝贺 Congratulations", "表示为他高兴"] },
      { title: "道歉", prompt: "你昨天答应了帮朋友带东西，但忘记了。你可能会说什么？（自由回答）", hints: ["真诚道歉 I am really sorry", "提出补救方案"] },
      { title: "问朋友的爱好", prompt: "你新认识了一个朋友，想了解对方的兴趣爱好。你可能会说什么？（自由回答）", hints: ["使用开放性问题：What do you like to do", "分享自己的爱好"] },
      { title: "讨论电影", prompt: "你和朋友们讨论最近看的一部电影。你可能会说什么？（自由回答）", hints: ["表达喜好：I really liked / I did not enjoy", "说明原因"] },
      { title: "购物砍价", prompt: "你在小商品市场看中一件衣服，想砍价。你可能会说什么？（自由回答）", hints: ["询问能否便宜一些", "对比其他摊位价格"] },
      { title: "分享美食", prompt: "你发现了一家特别好吃的餐厅，想推荐给朋友。你可能会说什么？（自由回答）", hints: ["描述菜品和味道", "约朋友一起去"] },
      { title: "旅行计划", prompt: "你和朋友们计划一起去旅行，你想表达自己的想法。你可能会说什么？（自由回答）", hints: ["提出目的地建议", "讨论预算和交通方式"] },
      { title: "宠物话题", prompt: "朋友问你有没有养宠物。你可能会说什么？（自由回答）", hints: ["回答有或没有", "分享养宠物的经历或看法"] },
      { title: "周末安排", prompt: "同事问你周末一般做什么。你可能会说什么？（自由回答）", hints: ["描述你的日常爱好", "可以反问对方"] },
      { title: "搬新家", prompt: "你刚搬了新家，邀请朋友来家里做客。你可能会说什么？（自由回答）", hints: ["告知新地址", "表达欢迎和期待"] },
      { title: "请朋友帮忙", prompt: "你需要朋友帮你照看一天宠物。你可能会说什么？（自由回答）", hints: ["说明原因和时间", "表达感谢"] },
      { title: "回请吃饭", prompt: "朋友上次请你吃了饭，你想回请。你可能会说什么？（自由回答）", hints: ["提及上次的事", "提出回请的时间和地点"] },
      { title: "聊学习", prompt: "你和朋友聊最近在学什么新技能。你可能会说什么？（自由回答）", hints: ["说明你在学什么、为什么", "分享学习心得或困难"] },
      { title: "讨论运动", prompt: "朋友问你平时做什么运动。你可能会说什么？（自由回答）", hints: ["描述运动类型和频率", "邀请一起运动"] },
    ],
  },
  work: {
    label: "工作",
    scenarios: [
      { title: "导师办公室", prompt: "你去导师办公室讨论论文进度，需要预约时间。怎么开口？", answers: ["Professor, could I schedule a meeting with you to discuss my thesis progress?", "Excuse me, Professor, when would be a good time to talk about my paper?", "Professor Zhang, I was wondering if you have time this week to discuss my research progress."] },
      { title: "学术会议提问", prompt: "你在学术会议上听完报告，想向报告人提问。怎么开口？", answers: ["Thank you for your presentation. I have a question about the methodology you mentioned.", "Thanks for the great talk. Could you elaborate on how you handled the data preprocessing?", "I enjoyed your presentation. My question is about the evaluation metrics you used."] },
      { title: "邮件请假", prompt: "你因为感冒需要请一天病假，怎么给导师写邮件开头？", answers: ["Dear Professor, I am writing to request a sick leave for tomorrow as I have caught a cold.", "Dear Professor, I am feeling unwell and would like to take one day off to recover.", "Dear Professor, I apologize for the short notice, but I am not feeling well today and would like to request sick leave."] },
      { title: "实验室值日", prompt: "你想跟同学交换实验室值日的时间。怎么开口？", answers: ["Hi, would you mind swapping lab duty with me this week?", "Excuse me, could we exchange our cleaning shifts? I have a conflict on Thursday.", "Hey, I was wondering if you could trade duty days with me. I have an appointment that day."] },
      { title: "组会汇报", prompt: "轮到你做组会汇报了，你的开场白怎么说？", answers: ["Good morning, everyone. Today I will present my recent progress on the topic of.", "Hello everyone, thank you for joining. Let me start with an overview of my work this week.", "Hi everyone, I will be sharing my current findings on. Please feel free to interrupt with questions."] },
      { title: "技术讨论", prompt: "你不赞同同事提出的技术方案，想委婉表达。怎么开口？", answers: ["I see your point, but I am wondering if we could also consider an alternative approach.", "That is an interesting idea. However, have we thought about the potential risks?", "I understand your reasoning, but I have some concerns about scalability. Could we discuss further?"] },
      { title: "面试自我介绍", prompt: "面试官让你做个简短的自我介绍。你怎么说？", answers: ["Good morning. My name is Zhao Zhenglin. I am a master's student in AI at USTB, focusing on large language models and RAG.", "Hello, I am Zhao Zhenglin, a second-year graduate student studying artificial intelligence with a focus on NLP.", "Hi, I am Zhao. I am currently pursuing my master's degree in AI, and my research covers LLMs and agents."] },
      { title: "面试提问", prompt: "面试官问「你有什么问题想问我们吗？」你怎么回应？", answers: ["Yes, I would like to know more about the team structure and the projects I would be working on.", "Could you tell me what a typical day looks like for this position?", "I am curious about the growth opportunities and mentorship within the team."] },
      { title: "项目延期", prompt: "你的项目因为数据问题可能延期，怎么跟导师说明？", answers: ["Professor, I encountered some issues with the dataset. It may take a few more days to clean it, which could delay the timeline slightly.", "I am afraid the data preprocessing is taking longer than expected. I might need an extension.", "Due to unexpected data quality issues, I may need additional time to complete the next milestone."] },
      { title: "请求帮助", prompt: "你在调试代码时遇到困难，想请师兄帮忙。怎么开口？", answers: ["Senior, I am stuck on a bug in my code. Could you take a look when you have time?", "Excuse me, I have been trying to fix this error for hours. Would you mind helping me debug it?", "Hi, I am having trouble with this piece of code. Could you point me in the right direction?"] },
      { title: "borrow实验设备", prompt: "你想借用另一个课题组的 GPU 服务器跑实验。怎么开口？", answers: ["Hello, I was wondering if we could borrow some GPU time on your server for a quick experiment?", "Excuse me, my lab is running out of GPU resources. Would it be possible to use your cluster for a day or two?", "Hi, I am from the NLP group. Could we temporarily use one of your GPU nodes? I promise to return it promptly."] },
      { title: "电话会议开场", prompt: "你主持一个线上组会，需要开场。怎么开口？", answers: ["Good morning, everyone. Thank you for joining. Let us get started with today's agenda.", "Hello all, I hope you can hear me well. We have three items to discuss today.", "Hi everyone, welcome to our weekly meeting. Shall we begin?"] },
      { title: "分配任务", prompt: "你是组长，需要给组员分配一个新任务。怎么开口？", answers: ["Hi, I would like you to take charge of the data collection module for this project. Is that okay with you?", "I have a new task for you. It involves setting up the evaluation pipeline. Do you have the bandwidth?", "Could you handle the data preprocessing part? Let me know if you need any support."] },
      { title: "提交代码", prompt: "你完成了一个功能模块，想请同事帮忙 review 你的代码。怎么开口？", answers: ["Hi, I have finished the feature. Could you review my pull request when you get a chance?", "I just pushed a new commit. Would you mind taking a look at my code?", "Hey, the implementation is ready. Could you do a quick code review for me?"] },
      { title: "报告进度", prompt: "导师问你项目进展如何。你需要汇报当前状态和下一步计划。怎么开口？", answers: ["So far I have completed the data preprocessing. Next week I plan to start model training.", "The literature review is done. I am now moving on to the experiment design phase.", "I have made good progress on the implementation. The next step is to run the baseline experiments."] },
      { title: "请教论文", prompt: "你读了一篇论文不太理解其中一段，想请教师兄。怎么开口？", answers: ["Senior, I am reading this paper and I do not quite understand the part about the attention mechanism. Could you explain it to me?", "Excuse me, could you help me with this paragraph in the paper? I find it confusing.", "Hey, I came across a section in this paper that I find confusing. Would you mind walking me through it?"] },
      { title: "回复审稿意见", prompt: "你的论文收到审稿意见，其中一条你不同意。怎么委婉回应？", answers: ["We appreciate the reviewer's feedback. However, we respectfully believe that the proposed baseline may not be directly comparable due to differences in dataset scale.", "Thank you for the constructive comment. While we understand the concern, we would like to clarify that our experimental setup follows the standard protocol.", "We thank the reviewer for this observation. That said, we have conducted additional experiments to address this point, as shown in the revised version."] },
      { title: "申请设备采购", prompt: "你向导师申请购买一台新的工作站。怎么写申请理由？", answers: ["Professor, our current workstation is insufficient for the large-scale experiments. I would like to request the purchase of a new machine with higher GPU memory.", "I would like to propose upgrading our hardware, as the existing setup cannot handle the model sizes we are working with.", "Given the increasing computational demands of our experiments, I recommend investing in a new workstation."] },
      { title: "同事冲突", prompt: "你跟同事在技术方案上有分歧，气氛有些紧张。你想缓和一下。怎么开口？", answers: ["I think we both want the best for the project. Let us take a step back and look at the data together.", "I did not mean to sound dismissive earlier. How about we try combining both approaches?", "Let us not get stuck on this. Perhaps we can prototype both ideas and compare the results."] },
      { title: "接待访问学者", prompt: "一位外国访问学者来你们实验室交流，你负责接待。怎么开口？", answers: ["Welcome to our lab! Let me give you a quick tour and introduce you to the team.", "It is a pleasure to have you here. Please make yourself at home. Would you like some coffee first?", "Hello and welcome! I will be your host today. Feel free to ask me anything about our lab."] },
      { title: "会议纪要", prompt: "你负责整理会议纪要，需要向参会人员确认行动项。怎么开口？", answers: ["Hi everyone, I have summarized the key points from today's meeting. Could you review and confirm the action items?", "Here is a draft of the meeting minutes. Please let me know if I missed anything.", "I have put together the notes from our discussion. Could everyone verify their assigned tasks?"] },
      { title: "电话面试", prompt: "你接到一个电话面试，对方先做自我介绍。你怎么礼貌回应？", answers: ["Thank you for reaching out. It is a pleasure to speak with you. I am ready whenever you are.", "Hello, thank you for calling. I have been looking forward to this conversation.", "Hi, it is great to hear from you. Please go ahead with your questions."] },
      { title: "成果展示", prompt: "你需要在开放日向参观者介绍你的研究项目。怎么开场？", answers: ["Welcome! Today I would like to show you our work on large language model applications.", "Thank you for visiting. Let me walk you through what our team has been working on.", "Hi, I am excited to present our research on natural language processing. Let me start with a brief overview."] },
      { title: "投稿咨询", prompt: "你想咨询期刊编辑关于投稿格式的问题。怎么写邮件？", answers: ["Dear Editor, I am preparing a submission to your journal and would like to confirm the formatting requirements for figures.", "Dear Editor, could you please clarify whether the supplementary materials should be included in the main manuscript or submitted separately?", "Dear Editor, I have a question regarding the reference format required for your journal."] },
      { title: "找工作内推", prompt: "你想请学长内推你去他所在的公司。怎么开口？", answers: ["Senior, I saw that your company is hiring for a position that fits my background well. Would you be willing to refer me?", "Hi, I am applying for a role at your company. If you feel comfortable, could you submit a referral for me?", "Excuse me, I noticed an opening at your company. I would really appreciate it if you could put in a good word for me."] },
    ],
    opens: [
      { title: "教授办公室", prompt: "你去导师办公室讨论论文进度。你可能会说什么？（自由回答）", hints: ["说明当前进度或遇到的问题", "使用礼貌句式 I was wondering / Could you"] },
      { title: "面试问答", prompt: "面试官问你最大的优点是什么。你可能会说什么？（自由回答）", hints: ["举一个具体例子支撑", "与应聘岗位相关"] },
      { title: "团队协作", prompt: "同事问你能否帮忙完成一部分工作。你可能会说什么？（自由回答）", hints: ["评估自己的时间", "给出明确答复（同意或有条件同意）"] },
      { title: "迟到解释", prompt: "你因为堵车开会迟到了十分钟。你可能会说什么？（自由回答）", hints: ["先道歉 I apologize for", "简短说明原因"] },
      { title: "请假", prompt: "你因为家中有急事需要请两天假。你可能会说什么？（自由回答）", hints: ["说明原因（不必过于详细）", "说明工作交接安排"] },
      { title: "提建议", prompt: "你觉得实验室的设备管理流程可以优化。你会怎么向导师提建议？（自由回答）", hints: ["先肯定现有做法", "用委婉语气提出改进建议"] },
      { title: "学术讨论", prompt: "同门提出一个想法，你觉得有风险但也不完全否定。你会怎么回应？（自由回答）", hints: ["先肯定优点", "委婉提出顾虑"] },
      { title: "汇报失败", prompt: "你的实验结果不理想，需要向导师汇报。你可能会说什么？（自由回答）", hints: ["诚实汇报结果", "分析原因和下一步计划"] },
      { title: "写推荐信", prompt: "你想请导师为你写一封推荐信。你可能会说什么？（自由回答）", hints: ["说明申请的学校和项目", "提供你的 CV 和成绩单"] },
      { title: "国际合作", prompt: "一位外国教授来你们实验室交流，你负责介绍你们的课题。你可能会说什么？（自由回答）", hints: ["简要介绍研究背景和目标", "使用专业术语但保持清晰"] },
      { title: "加班沟通", prompt: "老板要求你周末加班，但你有安排。你可能会说什么？（自由回答）", hints: ["理解项目紧急性", "提出替代方案"] },
      { title: "反馈问题", prompt: "你发现同组的代码有一个严重 bug。你会怎么告诉他？（自由回答）", hints: ["客观描述问题", "提出解决方案或建议"] },
      { title: "争取资源", prompt: "你需要向导师申请更多 GPU 资源来跑实验。你可能会说什么？（自由回答）", hints: ["说明实验的必要性", "承诺合理使用资源"] },
      { title: "讨论分工", prompt: "你和同学合作一个项目，需要讨论分工。你可能会说什么？（自由回答）", hints: ["列出任务模块", "根据各自专长提出分配建议"] },
      { title: "反驳观点", prompt: "学术会议上有人对你的报告提出质疑。你会怎么回应？（自由回答）", hints: ["感谢提问 Thank you for the question", "用数据或逻辑回应"] },
      { title: "学习新技能", prompt: "导师建议你学习一门新技术。你可能会怎么回应？（自由回答）", hints: ["表示愿意学习", "询问学习资源或优先级"] },
      { title: "讨论职业规划", prompt: "导师问你毕业后打算继续读博还是工作。你可能会说什么？（自由回答）", hints: ["说明你的考虑", "征求导师建议"] },
      { title: "指导新生", prompt: "一位研一新生请教你科研入门经验。你可能会说什么？（自由回答）", hints: ["分享你的经历", "给出具体建议（读论文、跑代码等）"] },
      { title: "会议冲突", prompt: "两个会议时间冲突了，你需要跟组织者沟通。你可能会说什么？（自由回答）", hints: ["说明冲突情况", "请求调整或请假"] },
      { title: "分享成果", prompt: "你的论文被录用了，想跟团队分享这个好消息。你可能会说什么？（自由回答）", hints: ["表达感谢团队支持", "简述论文要点"] },
      { title: "讨论数据处理", prompt: "你和同事讨论数据清洗的最佳方案。你可能会说什么？（自由回答）", hints: ["描述当前数据的问题", "提出你的处理思路"] },
      { title: "写工作总结", prompt: "月底了，导师让你写一份工作总结。你可能会说什么？（自由回答）", hints: ["列举完成的工作", "列出遇到的问题和下月计划"] },
      { title: "参加学术沙龙", prompt: "你在一个学术沙龙上，想主动认识一位同行研究者。你可能会说什么？（自由回答）", hints: ["自我介绍", "表达对对方工作的兴趣"] },
      { title: "面对批评", prompt: "导师批评了你的实验设计不够严谨。你可能会说什么？（自由回答）", hints: ["接受批评并感谢", "提出改进计划"] },
      { title: "争取发言机会", prompt: "组会上你想主动分享一个新想法。你可能会说什么？（自由回答）", hints: ["提出想分享的内容", "请求时间许可"] },
    ],
  },
};

/* ==================== 工具函数 ==================== */

const $ = (id) => document.getElementById(id);

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[.,!?;:"']/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ");
}

function lcsScore(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return dp[a.length][b.length];
}

function lcsDiff(a, b) {
  const n = a.length, m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const tokens = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { tokens.push({ word: a[i], type: "hit" }); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { tokens.push({ word: a[i], type: "extra" }); i++; }
    else { tokens.push({ word: b[j], type: "miss" }); j++; }
  }
  while (i < n) tokens.push({ word: a[i++], type: "extra" });
  while (j < m) tokens.push({ word: b[j++], type: "miss" });
  return tokens;
}

/* ==================== 状态 ==================== */

let currentCategory = "life";
let scenarioIdx = 0;
let openIdx = 0;

function getScenarios() { return DATA[currentCategory].scenarios; }
function getOpens() { return DATA[currentCategory].opens; }

/* ==================== 分类切换 ==================== */

function switchCategory(cat) {
  currentCategory = cat;
  scenarioIdx = 0;
  openIdx = 0;
  document.querySelectorAll(".cat-tab").forEach(b => b.classList.toggle("active", b.dataset.cat === cat));
  renderScenario();
  renderOpen();
}

/* ==================== 情景模拟 ==================== */

function renderScenario() {
  const list = getScenarios();
  const s = list[scenarioIdx];
  $("scenario-index").textContent = `${DATA[currentCategory].label} · 情景 ${scenarioIdx + 1} / ${list.length}`;
  $("scenario-title").textContent = s.title;
  $("scenario-prompt").textContent = s.prompt;
  $("scenario-input").value = "";
  $("scenario-result").classList.add("hidden");
}

function checkScenario() {
  const input = $("scenario-input").value.trim();
  if (!input) return;
  const list = getScenarios();
  const s = list[scenarioIdx];
  const userTok = normalize(input);
  let best = { ans: s.answers[0], score: 0 };
  for (const ans of s.answers) {
    const sc = lcsScore(userTok, normalize(ans));
    if (sc > best.score) best = { ans, score: sc };
  }
  const expTok = normalize(best.ans);
  const diff = lcsDiff(userTok, expTok);
  const hits = diff.filter(t => t.type === "hit").length;
  const pct = expTok.length ? Math.round(hits / expTok.length * 100) : 0;
  $("scenario-expected").textContent = best.ans;
  $("scenario-diff").innerHTML = diff.map(t => `<span class="${t.type}">${t.word}</span>`).join(" ");
  $("scenario-score").textContent = `${pct}%`;
  const verdict = $("scenario-verdict");
  if (pct === 100) { verdict.textContent = "✓ 完全匹配"; verdict.className = "badge-ok"; }
  else if (pct >= 60) { verdict.textContent = "接近标准答案"; verdict.className = "badge-part"; }
  else { verdict.textContent = "与标准答案差距较大"; verdict.className = "badge-bad"; }
  const alts = s.answers.filter(a => a !== best.ans);
  $("scenario-alt").innerHTML = alts.length ? alts.map(a => `<li>${a}</li>`).join("") : "<li>（无）</li>";
  $("scenario-result").classList.remove("hidden");
  saveAttempt("scenario", scenarioIdx, s.title, input, pct, { expected: best.ans, diff });
}

/* ==================== 真实问答 ==================== */

function renderOpen() {
  const list = getOpens();
  const q = list[openIdx];
  $("open-index").textContent = `${DATA[currentCategory].label} · 问题 ${openIdx + 1} / ${list.length}`;
  $("open-title").textContent = q.title;
  $("open-prompt").textContent = q.prompt;
  $("open-hints").innerHTML = q.hints && q.hints.length
    ? `<ul>${q.hints.map(h => `<li>${h}</li>`).join("")}</ul>`
    : "";
  $("open-input").value = "";
  $("open-result").classList.add("hidden");
}

function checkOpen() {
  const input = $("open-input").value.trim();
  if (!input) return;
  const q = getOpens()[openIdx];
  const feedback = [];
  let score = 100;
  if (!/^[A-Z]/.test(input)) { feedback.push("句子首字母建议大写。"); score -= 10; }
  if (!/[.!?]$/.test(input)) { feedback.push("句子末尾缺少标点符号（. ? !）。"); score -= 10; }
  const words = input.split(/\s+/);
  if (words.length < 3) { feedback.push("回答太短，建议至少包含一个完整句子。"); score -= 30; }
  const verbs = /\b(is|am|are|was|were|have|has|had|do|does|did|will|would|can|could|should|want|need|like|know|think|say|see|look|take|give|make|call|order|help|borrow|get|find|put|let|may|might|must|be)\b/i;
  if (!verbs.test(input)) { feedback.push("未检测到明确的谓语动词，请检查句子结构。"); score -= 25; }
  score = Math.max(0, Math.min(100, score));
  $("open-score").textContent = `${score} 分`;
  const verdict = $("open-verdict");
  if (score >= 80) { verdict.textContent = "✓ 语法与结构基本正确"; verdict.className = "badge-ok"; }
  else if (score >= 50) { verdict.textContent = "基本可以，仍有改进空间"; verdict.className = "badge-part"; }
  else { verdict.textContent = "回答不够完整"; verdict.className = "badge-bad"; }
  if (!feedback.length) feedback.push("✓ 通过了所有基础检查，继续保持！");
  $("open-feedback").innerHTML = feedback.map(f => `<li>${f}</li>`).join("");
  $("open-result").classList.remove("hidden");
  saveAttempt("open", openIdx, q.title, input, score, { feedback });
}

/* ==================== 保存与提示 ==================== */

let currentMode = "scenario";

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function toast(msg, kind) {
  let el = $("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.className = "toast show" + (kind ? " " + kind : "");
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.className = "toast"; }, 2600);
}

async function saveAttempt(mode, idx, title, answer, score, detail) {
  const res = await Store.save({
    category: currentCategory,
    mode,
    item_index: idx,
    item_title: title,
    answer,
    score,
    detail,
  });
  if (!res.ok) toast("保存失败：" + res.error, "bad");
  else if (!Store.isCloud()) toast("已记录到本机");
  else if (!Store.isSignedIn()) toast("已记录到本机（未绑定同步码）");
  else toast(res.cloud ? "已同步到云端" : "已存本机，联网后自动补传");
  renderSyncState();
  if (currentMode === "stats") renderStats();
}

/* ==================== 语音输入 ==================== */

const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

function initMic(btnId, inputId) {
  const btn = document.getElementById(btnId);
  const input = document.getElementById(inputId);
  if (!btn || !input) return;

  if (!SpeechRecognitionAPI) {
    btn.disabled = true;
    btn.title = "当前浏览器不支持语音识别，请用 Chrome 或 Edge";
    return;
  }

  let rec = null;
  let listening = false;
  let silenceTimer = null;

  function reset() {
    listening = false;
    btn.classList.remove("mic-listening");
    clearTimeout(silenceTimer);
    silenceTimer = null;
  }

  btn.addEventListener("click", () => {
    if (listening) {
      try { rec && rec.stop(); } catch {}
      reset();
      return;
    }

    rec = new SpeechRecognitionAPI();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;

    listening = true;
    btn.classList.add("mic-listening");

    let finalText = "";

    // 超过 9 秒没有任何识别结果就自动停，避免一直挂着
    silenceTimer = setTimeout(() => {
      try { rec && rec.stop(); } catch {}
      reset();
    }, 9000);

    rec.onresult = (e) => {
      clearTimeout(silenceTimer);
      silenceTimer = setTimeout(() => {
        try { rec && rec.stop(); } catch {}
        reset();
      }, 9000);

      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interim += r[0].transcript;
      }
      input.value = (finalText + interim).trim();
    };

    rec.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        toast("麦克风权限被拒绝，请在浏览器地址栏允许使用麦克风", "bad");
      } else if (e.error === "no-speech") {
        toast("没听到声音，请靠近麦克风重试", "warn");
      } else if (e.error === "audio-capture") {
        toast("找不到麦克风设备", "bad");
      } else if (e.error !== "aborted") {
        toast("语音识别出错：" + e.error, "bad");
      }
      reset();
    };

    rec.onend = () => reset();

    try { rec.start(); }
    catch { reset(); toast("无法启动语音识别", "bad"); }
  });
}

initMic("scenario-mic-btn", "scenario-input");
initMic("open-mic-btn", "open-input");

/* ==================== 状态显示 ==================== */

function renderAuthStatus() {
  const el = $("auth-status");
  const btn = $("auth-btn");
  if (!Store.isCloud()) {
    el.textContent = "未配置后端 · 数据仅存本机";
    btn.textContent = "怎么开启同步？";
    btn.dataset.action = "help";
  } else if (Store.isSignedIn()) {
    el.textContent = `已绑定 · ${Store.displayCode()}`;
    btn.textContent = "同步设置";
    btn.dataset.action = "manage";
  } else {
    el.textContent = "云端已连接 · 未绑定同步码";
    btn.textContent = "开启同步";
    btn.dataset.action = "login";
  }
}

function renderSyncState() {
  const el = $("sync-state");
  if (!Store.isCloud()) {
    el.textContent = "本机模式 · 数据只存在这台浏览器，换设备或清缓存会丢";
    el.className = "sync-badge sync-local";
  } else if (Store.isSignedIn()) {
    const pending = Store.pendingCount;
    el.textContent = pending
      ? `有 ${pending} 条待同步 · 已存在本机，联网后自动补传`
      : Store.degraded ? "云端暂时连不上，已存在本机" : `已同步 · 同步码 ${Store.displayCode()}`;
    el.className = "sync-badge " + (pending || Store.degraded ? "sync-warn" : "sync-ok");
  } else {
    el.textContent = "云端已连接 · 绑定同步码后可在多设备间同步";
    el.className = "sync-badge sync-warn";
  }
}

function renderStats() {
  const s = Store.stats();
  const cards = [
    ["总练习次数", s.total],
    ["平均得分", s.avg],
    ["连续打卡", s.streak + " 天"],
    ["已掌握（≥80）", s.mastered],
    ["待加强（<60）", s.weak],
    ["生活 / 工作", `${s.byCategory.life} / ${s.byCategory.work}`],
  ];
  $("stat-grid").innerHTML = cards
    .map(([k, v]) => `<div class="stat-card"><div class="stat-v">${v}</div><div class="stat-k">${k}</div></div>`)
    .join("");

  const list = Store.history().slice(0, 40);
  $("history-list").innerHTML = list.length
    ? list.map(r => {
        const d = new Date(r.created_at);
        const time = `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
        const cls = r.score >= 80 ? "badge-ok" : r.score >= 60 ? "badge-part" : "badge-bad";
        const tag = `${r.category === "life" ? "生活" : "工作"}·${r.mode === "scenario" ? "情景" : "问答"}`;
        return `<li><span class="h-time">${time}</span><span class="h-title">${tag} ${escapeHtml(r.item_title)}</span><span class="h-score ${cls}">${r.score}</span></li>`;
      }).join("")
    : `<li class="h-empty">还没有练习记录，先去练一道。</li>`;
}

/* ==================== 登录 ==================== */

function openAuth(tab) {
  $("auth-modal").classList.remove("hidden");
  $("auth-msg").textContent = "";
  switchAuthTab(tab || "mine");
  refreshAuthView();
}

function closeAuth() { $("auth-modal").classList.add("hidden"); }

// 弹窗内容随绑定状态变化：未绑定时主按钮是「生成」，绑定后变成「复制」
function refreshAuthView() {
  const bound = Store.isSignedIn();
  renderMyCode(bound ? Store.displayCode() : "--------");
  $("auth-copy-btn").textContent = bound ? "复制同步码" : "生成我的同步码";
  $("auth-gen-btn").classList.toggle("hidden", !bound);
  $("auth-unbind-btn").classList.toggle("hidden", !bound);
}

function switchAuthTab(tab) {
  $("auth-tab-mine").classList.toggle("active", tab === "mine");
  $("auth-tab-bind").classList.toggle("active", tab === "bind");
  $("auth-step-mine").classList.toggle("hidden", tab !== "mine");
  $("auth-step-bind").classList.toggle("hidden", tab !== "bind");
  $("auth-msg").textContent = "";
  if (tab === "bind") $("bind-code").focus();
}

function renderMyCode(text) {
  $("my-code").textContent = text;
  $("auth-unbind-btn").classList.toggle("hidden", !Store.isSignedIn());
}

function setAuthMsg(text, kind) {
  $("auth-msg").textContent = text;
  $("auth-msg").className = "auth-msg" + (kind ? " " + kind : "");
}

async function authPrimaryAction() {
  if (!Store.isSignedIn()) {
    setAuthMsg("生成中…");
    const r = await Store.createAndBind();
    if (!r.ok) { setAuthMsg(r.error, "err"); return; }
    refreshAuthView();
    renderAuthStatus();
    renderSyncState();
    setAuthMsg(r.error || "已生成。在另一台设备打开本页，切到「输入已有的码」填进去", r.error ? "" : "ok");
    return;
  }

  const code = Store.displayCode();
  try {
    await navigator.clipboard.writeText(code);
    toast("同步码已复制：" + code);
  } catch {
    // 非 HTTPS 或旧浏览器下 clipboard API 不可用，退回选中文本让用户手动复制
    const range = document.createRange();
    range.selectNodeContents($("my-code"));
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    toast("已选中，按 Ctrl/Cmd + C 复制");
  }
}

/* ==================== 事件绑定 ==================== */

$("scenario-check-btn").addEventListener("click", checkScenario);
$("scenario-input").addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); checkScenario(); } });
$("next-scenario-btn").addEventListener("click", () => { scenarioIdx = (scenarioIdx + 1) % getScenarios().length; renderScenario(); });

$("open-check-btn").addEventListener("click", checkOpen);
$("open-input").addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); checkOpen(); } });
$("next-open-btn").addEventListener("click", () => { openIdx = (openIdx + 1) % getOpens().length; renderOpen(); });

document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentMode = btn.dataset.mode;
    $("scenario-mode").classList.toggle("hidden", currentMode !== "scenario");
    $("open-mode").classList.toggle("hidden", currentMode !== "open");
    $("stats-mode").classList.toggle("hidden", currentMode !== "stats");
    $("cat-tabs").classList.toggle("hidden", currentMode === "stats");
    if (currentMode === "stats") renderStats();
  });
});

document.querySelectorAll(".cat-tab").forEach(btn => {
  btn.addEventListener("click", () => switchCategory(btn.dataset.cat));
});

$("auth-btn").addEventListener("click", () => {
  const action = $("auth-btn").dataset.action;
  if (action === "manage") { openAuth("mine"); return; }
  if (action === "help") {
    alert(
      "开启多端同步只需两步：\n\n" +
      "1. 用编辑器打开本项目根目录的 config.js\n" +
      "   填入 SUPABASE_URL 和 SUPABASE_ANON_KEY\n" +
      "   （Supabase 控制台 → Project Settings → API）\n\n" +
      "2. 在 Supabase 控制台 SQL Editor 里执行\n" +
      "   项目根目录的 supabase-sync-schema.sql\n\n" +
      "改完推到 gh-pages 分支即可生效。\n" +
      "详细步骤见同目录的 SETUP.md。"
    );
    return;
  }
  openAuth("mine");
});

$("auth-close-btn").addEventListener("click", closeAuth);
$("auth-modal").addEventListener("click", e => { if (e.target === $("auth-modal")) closeAuth(); });

$("auth-tab-mine").addEventListener("click", () => { switchAuthTab("mine"); refreshAuthView(); });
$("auth-tab-bind").addEventListener("click", () => switchAuthTab("bind"));

$("auth-copy-btn").addEventListener("click", authPrimaryAction);

$("auth-gen-btn").addEventListener("click", async () => {
  if (!confirm("换一个新的同步码？\n\n旧码会失效，已经绑定旧码的其他设备需要重新绑定。\n本机数据不受影响，会归到新码下。")) return;
  setAuthMsg("生成中…");
  const r = await Store.createAndBind();
  if (!r.ok) { setAuthMsg(r.error, "err"); return; }
  refreshAuthView();
  renderAuthStatus();
  renderSyncState();
  setAuthMsg(r.error || "已换成新码，其他设备记得重新绑定", r.error ? "" : "ok");
});

$("auth-unbind-btn").addEventListener("click", () => {
  if (!confirm("解绑后这台设备不再同步云端，已存在的本地记录会保留。\n确定解绑？")) return;
  Store.unbind();
  refreshAuthView();
  renderAuthStatus();
  renderSyncState();
  setAuthMsg("已解绑，当前为本机模式");
  toast("已解绑同步");
});

$("auth-bind-btn").addEventListener("click", async () => {
  const raw = $("bind-code").value.trim();
  if (!Store.isValidCode(raw)) {
    setAuthMsg("同步码是 8 位字母或数字（如 K7M2-9XQ4），检查一下有没有输错", "err");
    return;
  }
  setAuthMsg("绑定并同步中…");
  const res = await Store.bindCode(raw);
  if (!res.ok) { setAuthMsg(res.error, "err"); return; }
  refreshAuthView();
  renderAuthStatus();
  renderSyncState();
  if (currentMode === "stats") renderStats();
  $("bind-code").value = "";
  if (res.error) { setAuthMsg(res.error, "err"); return; }
  setAuthMsg("绑定成功，多端数据已合并", "ok");
  toast("同步已开启");
});

$("bind-code").addEventListener("keydown", e => { if (e.key === "Enter") $("auth-bind-btn").click(); });

// 输入时自动转大写并补上中间的连字符，减少手输错误
$("bind-code").addEventListener("input", e => {
  const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
  e.target.value = raw.length > 4 ? raw.slice(0, 4) + "-" + raw.slice(4) : raw;
});

$("export-btn").addEventListener("click", () => {
  Store.exportJSON();
  toast("已导出 JSON 备份");
});

/* ==================== 初始化 ==================== */

Store.onAuthChange(() => {
  renderAuthStatus();
  renderSyncState();
  if (currentMode === "stats") renderStats();
});

Store.init();
switchCategory("life");
renderAuthStatus();
renderSyncState();
renderStats();
