/* ---------- 情景模拟题库 ---------- */
const SCENARIOS = [
  {
    title: "食堂点菜",
    prompt: "你正在食堂点菜，怎么叫服务员，并告诉他你想要一杯热水？",
    answers: [
      "Excuse me, could I have a cup of hot water, please?",
      "Excuse me, may I have a cup of hot water?",
      "Excuse me, I would like a cup of hot water, please."
    ]
  },
  {
    title: "图书馆借书",
    prompt: "你想借一本关于人工智能的书，怎么向图书馆管理员开口？",
    answers: [
      "Excuse me, I would like to borrow a book about artificial intelligence.",
      "Excuse me, could I borrow a book on artificial intelligence?",
      "Hi, I am looking for a book about artificial intelligence."
    ]
  },
  {
    title: "机场值机",
    prompt: "你在机场办理登机手续，想确认自己的座位靠窗，怎么说？",
    answers: [
      "Excuse me, could I have a window seat, please?",
      "Excuse me, is it possible to get a window seat?",
      "Hi, I would like a window seat if possible."
    ]
  },
  {
    title: "餐厅点牛排",
    prompt: "你在西餐厅想点一份七分熟的牛排，怎么表达？",
    answers: [
      "I would like a medium-well steak, please.",
      "Could I have a medium-well steak, please?",
      "I will have a medium-well steak, please."
    ]
  },
  {
    title: "问路",
    prompt: "你在校园里迷路了，想问路去图书馆，怎么开口？",
    answers: [
      "Excuse me, could you tell me how to get to the library?",
      "Excuse me, could you tell me the way to the library?",
      "Excuse me, how can I get to the library?"
    ]
  }
];

/* ---------- 真实问答题库 ---------- */
const OPEN_QUESTIONS = [
  {
    title: "服务员询问",
    prompt: "服务员问：'先生，您需要什么？'你可能会说什么？（自由回答）",
    hints: ["说明想要的食物或饮品", "使用礼貌句式 Would like / Could I have"]
  },
  {
    title: "新同学见面",
    prompt: "开学第一天，同实验室的新同学跟你打招呼。你会说什么？（自由回答）",
    hints: ["自我介绍：姓名、专业、研究方向", "使用 Nice to meet you"]
  },
  {
    title: "教授办公室",
    prompt: "你去导师办公室讨论论文进度。你可能会说什么？（自由回答）",
    hints: ["说明当前进度或遇到的问题", "使用礼貌句式 I was wondering / Could you"]
  },
  {
    title: "电话客服",
    prompt: "你网购的书三天了还没到，打电话给客服。你可能会说什么？（自由回答）",
    hints: ["描述问题：订单号、已等待天数", "提出诉求：什么时候能到 / 能否退款"]
  },
  {
    title: "学术会议",
    prompt: "你在学术会议上听完报告，想向报告人提问。你可能会说什么？（自由回答）",
    hints: ["先感谢报告 Thank you for your presentation", "提出一个具体问题"]
  }
];

/* ---------- 工具函数 ---------- */
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

/* ---------- 情景模拟 ---------- */
let scenarioIdx = 0;

function renderScenario() {
  const s = SCENARIOS[scenarioIdx];
  $("scenario-index").textContent = `情景 ${scenarioIdx + 1} / ${SCENARIOS.length}`;
  $("scenario-title").textContent = s.title;
  $("scenario-prompt").textContent = s.prompt;
  $("scenario-input").value = "";
  $("scenario-result").classList.add("hidden");
}

function checkScenario() {
  const input = $("scenario-input").value.trim();
  if (!input) return;

  const s = SCENARIOS[scenarioIdx];
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
  $("scenario-diff").innerHTML = diff
    .map(t => `<span class="${t.type}">${t.word}</span>`)
    .join(" ");
  $("scenario-score").textContent = `${pct}%`;

  const verdict = $("scenario-verdict");
  if (pct === 100) { verdict.textContent = "✓ 完全匹配"; verdict.className = "badge-ok"; }
  else if (pct >= 60) { verdict.textContent = "接近标准答案"; verdict.className = "badge-part"; }
  else { verdict.textContent = "与标准答案差距较大"; verdict.className = "badge-bad"; }

  const alts = s.answers.filter(a => a !== best.ans);
  $("scenario-alt").innerHTML = alts.length ? alts.map(a => `<li>${a}</li>`).join("") : "<li>（无）</li>";
  $("scenario-result").classList.remove("hidden");
}

/* ---------- 真实问答 ---------- */
let openIdx = 0;

function renderOpen() {
  const q = OPEN_QUESTIONS[openIdx];
  $("open-index").textContent = `问题 ${openIdx + 1} / ${OPEN_QUESTIONS.length}`;
  $("open-title").textContent = q.title;
  $("open-prompt").textContent = q.prompt;
  $("open-input").value = "";
  $("open-result").classList.add("hidden");
}

function checkOpen() {
  const input = $("open-input").value.trim();
  if (!input) return;

  const feedback = [];
  let score = 100;

  if (!/^[A-Z]/.test(input)) {
    feedback.push("句子首字母建议大写。");
    score -= 10;
  }
  if (!/[.!?]$/.test(input)) {
    feedback.push("句子末尾缺少标点符号（. ? !）。");
    score -= 10;
  }
  const words = input.split(/\s+/);
  if (words.length < 3) {
    feedback.push("回答太短，建议至少包含一个完整句子。");
    score -= 30;
  }
  const verbPattern = /\b(is|am|are|was|were|have|has|had|do|does|did|will|would|can|could|should|want|need|like|know|think|say|see|look|take|give|make|call|order|help|borrow|get|find|put|let|may|might|must|be)\b/i;
  if (!verbPattern.test(input)) {
    feedback.push("未检测到明确的谓语动词，请检查句子结构。");
    score -= 25;
  }

  score = Math.max(0, Math.min(100, score));
  $("open-score").textContent = `${score} 分`;

  const verdict = $("open-verdict");
  if (score >= 80) { verdict.textContent = "✓ 语法与结构基本正确"; verdict.className = "badge-ok"; }
  else if (score >= 50) { verdict.textContent = "基本可以，仍有改进空间"; verdict.className = "badge-part"; }
  else { verdict.textContent = "回答不够完整"; verdict.className = "badge-bad"; }

  if (!feedback.length) feedback.push("✓ 通过了所有基础检查，继续保持！");
  $("open-feedback").innerHTML = feedback.map(f => `<li>${f}</li>`).join("");
  $("open-result").classList.remove("hidden");
}

/* ---------- 事件绑定 ---------- */
$("scenario-check-btn").addEventListener("click", checkScenario);
$("scenario-input").addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); checkScenario(); }
});
$("next-scenario-btn").addEventListener("click", () => {
  scenarioIdx = (scenarioIdx + 1) % SCENARIOS.length;
  renderScenario();
});

$("open-check-btn").addEventListener("click", checkOpen);
$("open-input").addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); checkOpen(); }
});
$("next-open-btn").addEventListener("click", () => {
  openIdx = (openIdx + 1) % OPEN_QUESTIONS.length;
  renderOpen();
});

document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const mode = btn.dataset.mode;
    $("scenario-mode").classList.toggle("hidden", mode !== "scenario");
    $("open-mode").classList.toggle("hidden", mode !== "open");
  });
});

/* ---------- 初始化 ---------- */
renderScenario();
renderOpen();
