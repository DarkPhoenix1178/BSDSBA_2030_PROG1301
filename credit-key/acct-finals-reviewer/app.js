/* The Ledger - game logic */
(function () {
  "use strict";

  var BANK = window.BANK || [];
  var app = document.getElementById("app");

  var CH = [
    { n: 1, t: "Foundations & the Cycle", d: "The equation, normal balances, and the nine steps." },
    { n: 2, t: "Daily Operating Entries", d: "Financing, purchases, services, and perpetual inventory." },
    { n: 3, t: "Adjusting Entries & Receivables", d: "Deferrals, accruals, notes, and doubtful accounts." },
    { n: 4, t: "PPE, Depreciation & Disposals", d: "Capitalization, three methods, intangibles, and sales." },
    { n: 5, t: "Liabilities & Bonds", d: "Current portions, discounts, premiums, and maturity." },
    { n: 6, t: "Statements & Closing", d: "Statement order, classified balance sheet, four closing steps." },
    { n: 7, t: "Ratios & DuPont", d: "Liquidity, efficiency, profitability, solvency, and ROE." },
    { n: 8, t: "Exam Traps", d: "The distinctions that decide the grade." },
    { n: 9, t: "Cash & Bank Reconciliation", d: "Controls, deposits in transit, outstanding checks, and book-side entries." },
    { n: 10, t: "Inventory & Cost Flow", d: "FIFO, weighted average, NRV, shrinkage, and turnover." },
    { n: 11, t: "Shareholders' Equity", d: "Common, preferred, treasury, dividends, and book value." },
    { n: 12, t: "Statement of Cash Flows", d: "Operating, investing, financing, and free cash flow." },
    { n: 13, t: "Trend Analysis", d: "Horizontal, vertical, common-size, and benchmarking." }
  ];
  var SHORT = { 1: "Foundations", 2: "Operating entries", 3: "Adjusting", 4: "PPE", 5: "Bonds", 6: "Closing", 7: "Ratios", 8: "Traps", 9: "Cash", 10: "Inventory", 11: "Equity", 12: "Cash flows", 13: "Trends" };

  var NAME_MAX = 20;

  // Profanity detection is rule-based. Names are normalized for separators,
  // repeated letters, accents, homoglyphs, and common leet spellings before
  // matching. Short or ambiguous roots are exact/compound only, so ordinary
  // names such as Cassidy, Hancock, Dickens, and Michelle survive.
  var EXACT_BAD = new Set([
    "ass", "asses", "arse", "anal", "anus", "bastard", "bitch", "bollock",
    "bollocks", "bugger", "cock", "cum", "cunt", "cunts", "damn", "dick",
    "douche", "fag", "faggot", "fuck", "fucks", "fuk", "fukn", "fukka",
    "fux", "fuxn", "fck", "fckn", "phuk", "phuck", "fvck", "hell",
    "jackass", "jerkoff", "nazi", "nazis", "hitler", "piss", "porn",
    "prick", "pricks", "pussy", "retard", "sex", "shit", "shits", "shite",
    "shyt", "sheit", "slut", "sluts", "tit", "tits", "twat", "twats",
    "wank", "wanks", "whore", "whores", "penis", "penises", "vagina",
    "vaginas", "boob", "boobs", "semen", "orgy", "orgasm", "rape", "rapist",
    "pedo", "pedophile", "coon", "kike", "kikes", "spic", "spics", "chink",
    "chinks", "gook", "gooks", "paki", "pakis", "dyke", "midget", "midgets",
    "kkk", "niga", "nigah", "niger", "nignog", "biatch", "beyotch", "beotch",
    "pusy", "shemale", "shemales", "kunt", "fagit", "crap", "molest"
  ]);

  var PART_BAD = [
    "fuck", "motherfuck", "shithead", "shitface", "bullshit", "nigg",
    "fagg", "retard", "wanker", "asshole", "dumbass", "jackass", "dickhead",
    "dickface", "dickwad", "cocksuck", "cuntface", "bitchface", "fuckface",
    "fucktard", "twatface", "whoreface", "slutface", "pussy", "douchebag",
    "pissant", "pedophile", "tranny", "spastic", "nazism", "nignog",
    "biatch", "beyotch", "beotch", "dikhead", "dikface", "cokhead",
    "cokface", "rapist", "kuntface"
  ];

  var COMPOUND_BAD = [
    "asshat", "asswipe", "assface", "hardass", "fatass", "lardass",
    "smartass", "kickass", "badass", "dickhole", "dickweed", "dickbag",
    "cockhead", "cockface", "cockbite", "cumshot", "cumdump", "cumslut",
    "titty", "titties", "titjob", "titfuck", "faggot", "fagot", "faggy",
    "fagget", "fagit", "raped", "raping", "rapey", "pedophilia", "pissed",
    "pissface", "pisshead", "crapface", "pornstar", "pornography", "slutty",
    "slutbag", "whorehouse", "whoring", "bitchy", "bitches", "bitching",
    "cunty", "cuntish", "twatwaffle", "prickface", "douchecanoe", "buggery",
    "buggered", "bollocking", "wanking", "wankstain", "horehouse", "horeface",
    "sexgod", "sexmachine", "sexslave", "shitbag", "shitstain", "shitstorm",
    "fukhead", "fukface", "fuxhead", "fckhead", "sonofabitch", "molester",
    "molesting", "molestation"
  ];

  var CONFUSABLES = {
    "а": "a", "в": "b", "е": "e", "ё": "e", "і": "i", "ї": "i", "ј": "j",
    "к": "k", "м": "m", "н": "h", "о": "o", "р": "p", "с": "c", "т": "t",
    "у": "y", "х": "x", "ѕ": "s", "ԁ": "d", "ӏ": "l", "һ": "h", "ԛ": "q",
    "ԝ": "w", "ν": "v", "α": "a", "β": "b", "γ": "y", "ε": "e", "η": "n",
    "ι": "i", "κ": "k", "μ": "u", "ο": "o", "π": "n", "ρ": "p", "σ": "o",
    "τ": "t", "υ": "u", "φ": "f", "χ": "x", "ψ": "w", "ω": "w", "ł": "l",
    "đ": "d", "ø": "o", "æ": "ae", "œ": "oe", "ß": "ss", "þ": "th",
    "ð": "d", "ı": "i", "ȷ": "j", "ɑ": "a", "ɡ": "g", "ɩ": "i", "ʟ": "l",
    "ʀ": "r", "ʏ": "y"
  };
  var LEET = {
    "0": "o", "1": "i", "2": "z", "3": "e", "4": "a", "5": "s", "7": "t",
    "8": "b", "9": "g", "@": "a", "$": "s", "!": "i", "|": "i", "+": "t"
  };

  function deburr(s) {
    try { s = s.normalize("NFKD").replace(/[\u0300-\u036f]/g, ""); } catch (e) {}
    s = s.toLowerCase();
    var out = "";
    for (var i = 0; i < s.length; i++) out += (CONFUSABLES[s[i]] || LEET[s[i]] || s[i]);
    return out.replace(/[^a-z]/g, "");
  }
  function squeeze(s, maxRun) {
    var out = "", prev = "", run = 0;
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      if (c === prev) {
        run++;
        if (run <= maxRun) out += c;
      } else {
        prev = c;
        run = 1;
        out += c;
      }
    }
    return out;
  }
  function variantsOf(base) {
    var maps = [["ph","f"],["ck","k"],["qu","k"],["q","k"],["x","ks"],["z","s"],["v","u"],["y","i"],["w","u"]];
    var seen = {};
    var out = [];
    function add(x) {
      if (x && !seen[x]) { seen[x] = 1; out.push(x); }
      var a = squeeze(x, 1), b = squeeze(x, 2);
      if (a && !seen[a]) { seen[a] = 1; out.push(a); }
      if (b && !seen[b]) { seen[b] = 1; out.push(b); }
    }
    function expand(x, idx) {
      if (idx >= maps.length) { add(x); return; }
      expand(x, idx + 1);
      var t = x.split(maps[idx][0]).join(maps[idx][1]);
      if (t !== x) expand(t, idx + 1);
    }
    [base, squeeze(base, 1), squeeze(base, 2)].forEach(function (b) {
      add(b);
      expand(b, 0);
    });
    return out;
  }
  function isProfane(name) {
    var base = deburr(name);
    if (!base) return false;
    var vs = variantsOf(base);
    for (var i = 0; i < vs.length; i++) {
      var v = vs[i];
      if (EXACT_BAD.has(v)) return true;
      for (var j = 0; j < PART_BAD.length; j++) if (v.indexOf(PART_BAD[j]) !== -1) return true;
      for (var k = 0; k < COMPOUND_BAD.length; k++) if (v.indexOf(COMPOUND_BAD[k]) !== -1) return true;
    }
    return false;
  }

  var RUN_KEY = "ledger.run.v1";
  var PENDING_KEY = "ledger.pendingScore";

  var S = {
    screen: "home", qs: [], i: 0, view: 0, score: 0, streak: 0, bestStreak: 0,
    ans: [], t0: 0, timer: null, locked: false, mode: "", key: "", label: "", ch: 0,
    elapsed: 0, missed: [], last: null, name: "", pending: null, submitted: false,
    boardMode: "exam", paused: false, pauseElapsed: 0
  };

  var sndOn = true;
  try { sndOn = localStorage.getItem("ledger.sound") !== "0"; } catch (e) {}

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(v) {
    return String(v).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function fmt(ms) {
    var t = Math.max(0, Math.floor(ms / 1000));
    return pad(Math.floor(t / 60)) + ":" + pad(t % 60);
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var x = a[i]; a[i] = a[j]; a[j] = x;
    }
    return a;
  }
  function sample(a, n) { return shuffle(a).slice(0, n); }
  function getLS(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function setLS(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function delLS(k) { try { localStorage.removeItem(k); } catch (e) {} }

  function setCookie(k, v, days) {
    try {
      var d = new Date();
      d.setTime(d.getTime() + days * 864e5);
      document.cookie = k + "=" + encodeURIComponent(v) + "; expires=" + d.toUTCString() + "; path=/; SameSite=Lax";
    } catch (e) {}
  }
  function getCookie(k) {
    try {
      var parts = document.cookie ? document.cookie.split("; ") : [];
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i].split("=");
        if (p[0] === k) return decodeURIComponent(p.slice(1).join("="));
      }
    } catch (e) {}
    return "";
  }
  function getName() {
    var ls = getLS("ledger.name");
    var ck = getCookie("ledger_name");
    if (ls && !nameError(ls)) return ls;
    if (ck && !nameError(ck)) return ck;
    if (ls) delLS("ledger.name");
    if (ck) setCookie("ledger_name", "", -1);
    return "";
  }
  function saveName(n) {
    setLS("ledger.name", n);
    setCookie("ledger_name", n, 365);
  }
  function syncName() {
    var n = getName();
    if (n) saveName(n);
  }

  function bestFor(key) {
    try { return JSON.parse(localStorage.getItem("ledger.best." + key) || "null"); } catch (e) { return null; }
  }
  function saveBest(key, score, acc, ms) {
    var prev = bestFor(key);
    if (!prev || score > prev.score) {
      try {
        localStorage.setItem("ledger.best." + key, JSON.stringify({ score: score, acc: Math.round(acc * 100), time: Math.round(ms / 1000) }));
      } catch (e) {}
    }
  }

  function api(path, opts) {
    opts = opts || {};
    if (!opts.method) opts.cache = "no-store";
    return fetch(path, opts).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) {
        if (!r.ok) throw new Error(d.error || ("HTTP " + r.status));
        return d;
      });
    });
  }

  function nameError(raw) {
    var v = (raw || "").trim();
    if (!v) return "Enter a name.";
    if (v.length > NAME_MAX) return "Keep it to 20 characters.";
    if (/\s/.test(v)) return "One word only.";
    if (/[0-9]/.test(v)) return "No numbers.";
    if (!/^[\p{L}'-]+$/u.test(v)) return "Letters, apostrophes, and hyphens only.";
    if (isProfane(v)) return "Pick a different name.";
    return "";
  }

  /* ---------- sound ---------- */
  var AC = null;
  function ac() {
    if (!AC) {
      var C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      AC = new C();
    }
    if (AC.state === "suspended") { try { AC.resume(); } catch (e) {} }
    return AC;
  }
  function tone(f, d, type, v, delay, f2) {
    var c = ac(); if (!c) return;
    var t = c.currentTime + (delay || 0);
    var o = c.createOscillator(), g = c.createGain();
    o.type = type || "sine";
    o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v || 0.12, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + d + 0.03);
  }
  function sfx(kind) {
    if (!sndOn) return;
    if (kind === "ok") {
      tone(659, 0.13, "triangle", 0.10);
      tone(988, 0.18, "triangle", 0.09, 0.07);
      if (S.streak >= 3) tone(1319, 0.16, "sine", 0.055, 0.15);
    } else if (kind === "bad") {
      tone(233, 0.24, "sawtooth", 0.075, 0, 110);
      tone(92, 0.20, "sine", 0.07, 0.02);
    } else if (kind === "click") {
      tone(620, 0.045, "sine", 0.045);
    } else if (kind === "fire") {
      tone(140, 0.42, "sawtooth", 0.05, 0, 70);
      tone(320, 0.30, "triangle", 0.045, 0.04, 160);
    } else if (kind === "finish") {
      [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0.30, "triangle", 0.075, i * 0.105); });
    }
  }
  function toggleSound() {
    sndOn = !sndOn;
    try { localStorage.setItem("ledger.sound", sndOn ? "1" : "0"); } catch (e) {}
    $$('[data-act="sound"]').forEach(function (b) {
      b.classList.toggle("off", !sndOn);
      if (b.classList.contains("iconbtn")) b.innerHTML = soundIcon(sndOn);
      else b.innerHTML = "<i></i>" + (sndOn ? "Sound on" : "Muted");
    });
    if (sndOn) sfx("click");
  }

  /* ---------- run persistence ---------- */
  function saveRun() {
    if (S.screen !== "game") return;
    try {
      S.elapsed = S.paused ? S.pauseElapsed : (performance.now() - S.t0);
      var data = {
        v: 1, name: S.name, qs: S.qs, i: S.i, score: S.score,
        streak: S.streak, bestStreak: S.bestStreak,
        ans: S.ans.map(function (a) {
          return { qi: S.qs.indexOf(a.q), pick: a.pick, ok: a.ok, pts: a.pts };
        }),
        mode: S.mode, key: S.key, label: S.label, ch: S.ch,
        elapsed: S.elapsed, savedAt: Date.now()
      };
      localStorage.setItem(RUN_KEY, JSON.stringify(data));
    } catch (e) {}
  }
  function loadRun() {
    try {
      var d = JSON.parse(localStorage.getItem(RUN_KEY) || "null");
      if (!d || d.v !== 1 || !Array.isArray(d.qs) || !d.qs.length) return null;
      return d;
    } catch (e) { return null; }
  }
  function clearRun() { delLS(RUN_KEY); }
  function restoreRun(d) {
    closePause();
    S.paused = false;
    S.pauseElapsed = 0;
    // Migrate an older saved run that had the incomplete loss-disposal question.
    var fixedDisposal = null;
    BANK.forEach(function (b) {
      if (b.c === 4 && b.p === "What is the disposal entry?" && b.s && b.s.indexOf("Equipment costing ₱500,000 has accumulated depreciation") === 0) fixedDisposal = b;
    });
    (d.qs || []).forEach(function (q) {
      if (q.s === "The same equipment, book value ₱100,000, is sold for ₱70,000 cash.") {
        if (fixedDisposal) {
          q.s = fixedDisposal.s;
          if (q.o.every(Array.isArray) && fixedDisposal.r) {
            var reasonByOption = {};
            fixedDisposal.o.forEach(function (o, idx) { reasonByOption[JSON.stringify(o)] = fixedDisposal.r[idx]; });
            q.r = q.o.map(function (o) { return reasonByOption[JSON.stringify(o)] || ""; });
          }
        } else {
          q.s = "Equipment costing ₱500,000 has accumulated depreciation of ₱400,000, so its book value is ₱100,000. It is sold for ₱70,000 cash.";
        }
      }
    });
    // Migrate older saved runs that still say Warranty Liability.
    (d.qs || []).forEach(function (q) {
      if (/warranty/i.test((q.s || "") + " " + (q.p || ""))) {
        function fixW(x) {
          return typeof x === "string"
            ? x.replace(/Warranty Liability/g, "Warranty Provision").replace(/\bliability\b/g, "provision").replace(/\bLiability\b/g, "Provision")
            : x;
        }
        q.s = fixW(q.s);
        q.p = fixW(q.p);
        q.e = fixW(q.e);
        if (Array.isArray(q.o)) q.o = q.o.map(function (o) { return Array.isArray(o) ? o.map(fixW) : fixW(o); });
        if (Array.isArray(q.r)) q.r = q.r.map(fixW);
      }
    });
    // Migrate older saved runs that still have the bare closing-entry questions.
    var closingFix = {"What is the first closing entry?": {"p": "What is the first closing entry in the four-step closing process?", "s": "Central Perk Dance Academy: service revenue ₱170,000, total expenses ₱70,000, dividends ₱10,000. The four closing steps are: 1 close revenues to Income Summary, 2 close expenses to Income Summary, 3 close Income Summary to Retained Earnings, 4 close Dividends to Retained Earnings."}, "What is the second closing entry?": {"p": "What is the second closing entry in the four-step closing process?", "s": "Central Perk Dance Academy: service revenue ₱170,000; salaries ₱33,000, supplies ₱21,000, rent ₱11,000, depreciation ₱3,000, insurance ₱2,000; dividends ₱10,000. The four closing steps are: 1 close revenues to Income Summary, 2 close expenses to Income Summary, 3 close Income Summary to Retained Earnings, 4 close Dividends to Retained Earnings. The first entry has already closed Service Revenue to Income Summary."}, "What is the third closing entry?": {"p": "What is the third closing entry in the four-step closing process?", "s": "Central Perk Dance Academy: service revenue ₱170,000; salaries ₱33,000, supplies ₱21,000, rent ₱11,000, depreciation ₱3,000, insurance ₱2,000; dividends ₱10,000. The four closing steps are: 1 close revenues to Income Summary, 2 close expenses to Income Summary, 3 close Income Summary to Retained Earnings, 4 close Dividends to Retained Earnings. The first two entries have closed revenues and expenses, leaving a ₱100,000 credit balance in Income Summary."}, "What is the fourth closing entry?": {"p": "What is the fourth closing entry in the four-step closing process?", "s": "Central Perk Dance Academy: service revenue ₱170,000; salaries ₱33,000, supplies ₱21,000, rent ₱11,000, depreciation ₱3,000, insurance ₱2,000; dividends ₱10,000. The four closing steps are: 1 close revenues to Income Summary, 2 close expenses to Income Summary, 3 close Income Summary to Retained Earnings, 4 close Dividends to Retained Earnings. The first three entries have been recorded."}};
    (d.qs || []).forEach(function (q) {
      var fix = q.c === 6 ? closingFix[q.p] : null;
      if (fix) {
        q.p = fix.p;
        q.s = fix.s;
      }
    });
    // Migrate older saved runs with the bare note-maturity scenario.
    var noteMaturity = "A company holds a ₱100,000, 90-day, 6% note receivable dated November 1, 2026. On January 30, 2027 the note matures. Interest for all 90 days is ₱1,500, and ₱1,000 was already accrued at year-end.";
    (d.qs || []).forEach(function (q) {
      if (q.c === 3 && q.p === "What is the entry on January 30?") q.s = noteMaturity;
    });
    S.qs = d.qs;
    S.i = Math.max(0, Math.min(d.i || 0, d.qs.length - 1));
    S.score = d.score || 0;
    S.streak = d.streak || 0;
    S.bestStreak = d.bestStreak || 0;
    S.ans = (d.ans || []).map(function (a) {
      return { q: S.qs[a.qi], pick: a.pick, ok: a.ok, pts: a.pts };
    }).filter(function (a) { return a.q; });
    var trimmed = false;
    for (var k = 0; k < S.ans.length; k++) {
      if (S.ans[k].q !== S.qs[k]) {
        S.ans = S.ans.slice(0, k);
        trimmed = true;
        break;
      }
    }
    if (S.i > S.ans.length) S.i = S.ans.length;
    if (trimmed) {
      S.score = S.ans.reduce(function (sum, a) { return sum + (a.pts || 0); }, 0);
      S.streak = 0;
      S.bestStreak = 0;
      S.ans.forEach(function (a) {
        if (a.ok) {
          S.streak += 1;
          if (S.streak > S.bestStreak) S.bestStreak = S.streak;
        } else {
          S.streak = 0;
        }
      });
    }
    S.mode = d.mode || "exam";
    S.key = d.key || "exam";
    S.label = d.label || "Run";
    S.ch = d.ch || 0;
    S.name = getName() || d.name || "Player";
    S.submitted = false;
    S.screen = "game";
    S.locked = false;
    S.elapsed = d.elapsed || 0;
    S.t0 = performance.now() - S.elapsed;
    S.last = { list: d.qs, label: d.label, key: d.key, mode: d.mode, ch: d.ch };
    document.body.classList.toggle("marathon-mode", S.mode === "marathon");

    // If the current question was answered before the refresh, move to the next
    // unanswered one. If the whole run was answered, go to the results.
    var next = Math.max(S.i, S.ans.length);
    if (next >= S.qs.length) {
      S.i = S.qs.length - 1;
      S.view = S.i;
      finish();
      return;
    }
    S.i = next;
    S.view = S.i;

    startTimer();
    renderGame();
  }

  function flushPending() {
    var raw = getLS(PENDING_KEY);
    if (!raw) return;
    try {
      var d = JSON.parse(raw);
      if (!d || !d.payload) return;
      api("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(d.payload)
      }).then(function () {
        delLS(PENDING_KEY);
        if (S.screen === "home") renderBoard(S.boardMode);
      }).catch(function () {});
    } catch (e) {}
  }

  /* ---------- render helpers ---------- */
  function soundBtn() {
    return '<button class="sound ' + (sndOn ? "" : "off") + '" data-act="sound" aria-label="Toggle sound"><i></i>' + (sndOn ? "Sound on" : "Muted") + "</button>";
  }
  function soundIcon(on) {
    return on
      ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 010 7"/></svg>'
      : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M22 9l-6 6M16 9l6 6"/></svg>';
  }
  function optHTML(o) {
    if (typeof o === "string") return '<div class="txt">' + esc(o) + "</div>";
    return '<div class="entry">' + o.map(function (l) {
      if (l === "SEP") return '<div class="sep"></div>';
      var p = l.split("|");
      return '<div class="ln"><span class="dc ' + (p[0] === "DR" ? "dr" : "cr") + '">' + p[0] + '</span><span class="acct">' + esc(p[1]) + '</span><span class="amt">' + esc(p[2]) + "</span></div>";
    }).join("") + "</div>";
  }
  function flameSVG(cls) {
    return '<svg class="' + (cls || "") + '" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2c.7 4.2-2.7 5.4-2.7 8.4a2.7 2.7 0 005.4 0c0-1.1-.4-2.1-1.1-3.1 3.3 2 5.4 5.2 5.4 8.4a7 7 0 11-14 0C4.9 10.2 8.6 7.3 12 2z" fill="currentColor"/></svg>';
  }

  /* ---------- gate ---------- */
  function pendingLabel(p) {
    if (!p) return "Run";
    if (p.kind === "exam") return "Full exam / 40 questions";
    if (p.kind === "marathon") return "Marathon / " + BANK.length + " questions";
    if (p.kind === "chapter") return "Chapter " + p.ch;
    if (p.kind === "retry") return "Play again";
    if (p.kind === "drill") return "Drill missed";
    return "Run";
  }
  function openGate() {
    closeGate();
    var saved = getLS("ledger.name") || "";
    var el = document.createElement("div");
    el.className = "gate";
    el.id = "gate";
    el.innerHTML =
      '<div class="gate-card" role="dialog" aria-modal="true" aria-labelledby="gateTitle">' +
        '<p class="eyebrow">' + esc(pendingLabel(S.pending)) + "</p>" +
        '<h2 id="gateTitle">What should we call you?</h2>' +
        '<p class="gate-sub">One word, up to 20 characters. No numbers. You enter this once, so check the spelling.</p>' +
        '<input id="nameInput" maxlength="20" autocomplete="nickname" spellcheck="false" placeholder="Your name">' +
        '<p class="gate-err" id="gateErr"></p>' +
        '<div class="gate-actions"><button class="btn primary" data-act="gate-start">Start</button><button class="btn ghost" data-act="gate-cancel">Cancel</button></div>' +
      "</div>";
    document.body.appendChild(el);
    document.body.style.overflow = "hidden";
    var input = $("#nameInput");
    if (input) {
      input.value = saved;
      input.addEventListener("input", function () {
        var e = $("#gateErr");
        if (e) e.textContent = "";
      });
      setTimeout(function () { input.focus(); input.select(); }, 50);
    }
  }
  function closeGate() {
    var g = $("#gate");
    if (g) g.remove();
    if (!$("#sheet")) document.body.style.overflow = "";
  }
  function dispatchStart(p) {
    if (!p) return;
    if (p.kind === "exam") startExam();
    else if (p.kind === "marathon") startMarathon();
    else if (p.kind === "chapter") startChapter(p.ch);
    else if (p.kind === "retry" && S.last) start(S.last.list, S.last.label, S.last.key, S.last.mode, S.last.ch);
    else if (p.kind === "drill") {
      var pool = S.missed.map(function (x) { return x.q; });
      if (pool.length) start(pool, "Drill / missed questions", "drill", "drill", 0);
    }
  }
  function gateStart() {
    var input = $("#nameInput");
    if (!input) return;
    var err = nameError(input.value);
    var errEl = $("#gateErr");
    if (err) {
      if (errEl) errEl.textContent = err;
      input.focus();
      return;
    }
    var name = input.value.trim();
    saveName(name);
    S.name = name;
    var p = S.pending;
    S.pending = null;
    closeGate();
    dispatchStart(p);
  }
  function gateCancel() {
    S.pending = null;
    closeGate();
    sfx("click");
  }
  function requestStart(pending) {
    var name = getName();
    if (name) {
      S.name = name;
      dispatchStart(pending);
      return;
    }
    S.pending = pending;
    openGate();
  }

  /* ---------- home ---------- */
  function boardHTML() {
    return '<div class="board">' +
      '<div class="board-tabs">' +
        '<button class="tab ' + (S.boardMode === "exam" ? "on" : "") + '" data-act="board" data-mode="exam">Full exam</button>' +
        '<button class="tab ' + (S.boardMode === "marathon" ? "on" : "") + '" data-act="board" data-mode="marathon">Marathon</button>' +
      "</div>" +
      '<div class="lb-head"><span>#</span><span>Player</span><span>Score</span><span>Acc</span><span>Time</span></div>' +
      '<div id="board-body"><div class="board-empty">Loading...</div></div>' +
    "</div>";
  }

  function renderBoard(mode) {
    S.boardMode = (mode === "marathon") ? "marathon" : "exam";
    $$(".tab").forEach(function (t) {
      t.classList.toggle("on", t.getAttribute("data-mode") === S.boardMode);
    });
    var box = $("#board-body");
    if (!box) return;
    box.innerHTML = '<div class="board-empty">Loading...</div>';
    api("/api/leaderboard?mode=" + encodeURIComponent(S.boardMode) + "&limit=10").then(function (d) {
      if (!$("#board-body")) return;
      var players = $("#board-players");
      if (players) players.textContent = d.players ? d.players + " player" + (d.players === 1 ? "" : "s") : "No scores yet";
      if (!d.scores || !d.scores.length) {
        box.innerHTML = '<div class="board-empty">No scores on this board yet. Finish a run to take the top spot.</div>';
        return;
      }
      box.innerHTML = d.scores.map(function (s, i) {
        return '<div class="lb-row ' + (i === 0 ? "top" : "") + '">' +
          '<span class="lb-rank">' + pad(i + 1) + "</span>" +
          '<span class="lb-name">' + esc(s.name) + "</span>" +
          '<span class="lb-score">' + s.score + "</span>" +
          '<span class="lb-acc">' + Math.round(s.accuracy * 100) + "%</span>" +
          '<span class="lb-time">' + fmt(s.duration_ms) + "</span>" +
        "</div>";
      }).join("");
    }).catch(function () {
      var b = $("#board-body");
      if (b) b.innerHTML = '<div class="board-empty">Leaderboard offline. Scores still save in this browser.</div>';
      var p = $("#board-players");
      if (p) p.textContent = "Offline";
    });
  }

  function renderNotes() {
    stopTimer();
    S.screen = "notes";
    closePause();
    S.paused = false; S.pauseElapsed = 0;
    closeGate();
    closeConfirm();
    var sh = $("#sheet"); if (sh) sh.remove();
    document.body.classList.remove("marathon-mode");
    document.body.style.overflow = "";
    var cards = (window.NOTES || []).map(function (side) {
      return '<section class="note-side">' +
        '<p class="nlabel">' + esc(side.side) + "</p>" +
        "<h3>" + esc(side.title) + "</h3>" +
        side.blocks.map(function (b) {
          return '<div class="n-block' + (b.m ? " mono" : "") + '"><h4>' + esc(b.h) + "</h4><ul>" +
            b.items.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") +
          "</ul></div>";
        }).join("") +
      "</section>";
    }).join("");
    if (!cards) cards = '<div class="board-empty">Notes failed to load.</div>';
    app.innerHTML =
      '<div class="top">' +
        '<div class="notes-left">' +
          '<button class="iconbtn" data-act="home" aria-label="Back to home">' +
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>' +
          "</button>" +
          '<div class="brand"><span class="mark"></span>The Ledger <span>/ exam notes</span></div>' +
        "</div>" +
        '<button class="btn ghost notes-print" data-act="print">Print</button>' +
      "</div>" +
      '<main class="wrap notes">' +
        '<div class="notes-head">' +
          '<p class="eyebrow">Exam notes</p>' +
          '<h1>Two short bond papers.<br><span class="pink">Front and back.</span></h1>' +
          '<p class="lede">Four sides, built the way the exam flows. Copy them by hand, or print double-sided if your exam allows it.</p>' +
        "</div>" +
        '<div class="note-grid">' + cards + "</div>" +
        '<div class="notes-foot"><p>Four sides. Two short bond papers. Nothing else.</p><button class="btn ghost" data-act="home">Back to chapters</button></div>' +
      "</main>";
    window.scrollTo(0, 0);
  }

  function home() {
    stopTimer();
    S.screen = "home";
    S.pending = null;
    closePause();
    S.paused = false; S.pauseElapsed = 0;
    document.body.classList.remove("marathon-mode");
    closeGate();
    document.body.style.overflow = "";
    var old = $("#sheet"); if (old) old.remove();
    var counts = {};
    BANK.forEach(function (q) { counts[q.c] = (counts[q.c] || 0) + 1; });
    var savedName = getLS("ledger.name") || "";

    var cards = CH.map(function (c) {
      var b = bestFor("ch" + c.n);
      var meta = counts[c.n] + " questions" + (b ? " &middot; best " + b.acc + "%" : " &middot; not attempted");
      return '<button class="card" data-act="chapter" data-ch="' + c.n + '">' +
        '<span class="no">' + pad(c.n) + "</span>" +
        "<span>" +
        "<h3>" + c.t + "</h3>" +
        "<p>" + c.d + "</p>" +
        '<span class="row">' + meta + "</span>" +
        "</span></button>";
    }).join("");

    app.innerHTML =
      '<div class="top">' +
        '<div class="brand"><span class="mark"></span>The Ledger <span>/ by Daksh</span></div>' +
        soundBtn() +
      "</div>" +
      '<main class="wrap home">' +
        '<p class="eyebrow">Accounting exam trainer</p>' +
        '<h1>Think in<br><span class="pink">debits &amp; credits.</span></h1>' +
        '<p class="lede">' + BANK.length + ' scenarios from the full review guide. Journal entries, bank reconciliation, inventory, depreciation, bonds, equity, cash flows, trend analysis, closing, and ratios. Pick the right entry. The clock starts with the run.</p>' +
        '<div class="cta">' +
          '<button class="btn primary" data-act="exam">Start full exam <span class="k">40 Q</span></button>' +
          '<span class="cta-note">A balanced sample across every chapter.</span>' +
        "</div>" +
        '<button class="marathon" data-act="marathon" aria-label="Start Marathon mode, all ' + BANK.length + ' questions">' +
          '<span class="m-bigflame" aria-hidden="true">' + flameSVG("") + '</span>' +
          '<span class="embers" aria-hidden="true">' +
            '<i style="--x:8%;--d:3.6s;--t:.2s"></i><i style="--x:22%;--d:4.2s;--t:1.1s"></i><i style="--x:38%;--d:3.2s;--t:.6s"></i>' +
            '<i style="--x:58%;--d:4.6s;--t:1.8s"></i><i style="--x:74%;--d:3.8s;--t:.9s"></i><i style="--x:90%;--d:4.4s;--t:2.3s"></i>' +
          "</span>" +
          '<span class="m-flame" aria-hidden="true">' + flameSVG("") + "</span>" +
          '<span class="m-copy">' +
            '<span class="m-top"><span class="m-badge">On fire</span><span class="m-title">Marathon mode</span><span class="m-tag">' + BANK.length + " Q</span></span>" +
            '<span class="m-desc">The full run. Every scenario in the guide, all ' + BANK.length + ' questions, one sitting.</span>' +
          "</span>" +
          '<span class="m-go">Start run <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>' +
        "</button>" +
        '<p class="hero-meta">' + BANK.length + ' scenarios &middot; ' + CH.length + ' chapters &middot; 1 timer</p>' +
        (savedName ? '<p class="who">Playing as <b>' + esc(savedName) + "</b>.</p>" : "") +
        '<div class="section-head"><h2>Chapters</h2><p>Pick one to drill</p></div>' +
        '<div class="grid">' + cards + "</div>" +
        '<div class="section-head"><h2>Exam Notes</h2><p>2 short bond papers</p></div>' +
        '<div class="notes-teaser"><div><h3>The four sides worth writing</h3><p>Foundations and daily entries, adjustments and receivables, cash and inventory, PPE and bonds, equity, cash flows, ratios, and trend analysis. Built to fit two short bond papers, front and back.</p></div><button class="btn primary" data-act="notes">Open exam notes</button></div>' +
        '<div class="section-head"><h2>Leaderboard</h2><p id="board-players">Top scores on this server</p></div>' +
        boardHTML() +
        '<div class="foot"><span>MADE BY DAKSH / V3.7</span><span>Sound on by default. Press M to mute.</span></div>' +
      "</main>";
    window.scrollTo(0, 0);
    renderBoard(S.boardMode);
  }

  /* ---------- game ---------- */
  function start(list, label, key, mode, ch) {
    if (!list.length) return;
    S.qs = list.map(prep);
    S.i = 0; S.view = 0; S.score = 0; S.streak = 0; S.bestStreak = 0;
    S.ans = []; S.locked = false; S.mode = mode; S.key = key; S.label = label; S.ch = ch || 0;
    S.missed = []; S.elapsed = 0;
    S.paused = false; S.pauseElapsed = 0; closePause();
    S.name = getName() || "Player";
    S.submitted = false;
    S.last = { list: list.slice(), label: label, key: key, mode: mode, ch: ch || 0 };
    S.screen = "game";
    clearRun();
    document.body.classList.toggle("marathon-mode", mode === "marathon");
    if (mode === "marathon") sfx("fire");
    S.t0 = performance.now();
    startTimer();
    renderGame();
  }

  function prep(q) {
    var idx = q.o.map(function (_, i) { return i; });
    for (var i = idx.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var x = idx[i]; idx[i] = idx[j]; idx[j] = x;
    }
    return {
      c: q.c, p: q.p, s: q.s, e: q.e,
      o: idx.map(function (i) { return q.o[i]; }),
      r: idx.map(function (i) { return q.r ? q.r[i] : ""; }),
      a: idx.indexOf(q.a)
    };
  }

  function dotsHTML() {
    return S.qs.map(function (_, i) {
      var cls = "";
      if (i < S.ans.length) cls = S.ans[i].ok ? "ok" : "bad";
      else if (i === S.i) cls = "cur";
      if (i === S.view && i !== S.i) cls += " view";
      var clickable = i <= S.i;
      return '<span class="dot ' + cls + '"' + (clickable ? ' data-q="' + i + '" title="Question ' + (i + 1) + '"' : "") + "></span>";
    }).join("");
  }

  function goView(idx) {
    if (S.screen !== "game") return;
    if (idx < 0 || idx > S.i) return;
    if (idx < S.i && !S.ans[idx]) return;
    S.view = idx;
    renderGame();
  }

  function reviewHTML(q, a) {
    if (a.ok) {
      return '<div class="review-explain"><p class="lbl g">Your answer, correct</p>' +
        '<div class="blk good">' + optHTML(q.o[a.pick]) + "</div>" +
        '<p class="why last"><b>Why it works.</b> ' + esc(q.e) + "</p></div>";
    }
    return '<div class="review-explain"><p class="lbl r">Your answer</p>' +
      '<div class="blk bad">' + optHTML(q.o[a.pick]) + "</div>" +
      '<p class="why"><b>Why it fails.</b> ' + esc(q.r[a.pick] || "") + "</p>" +
      '<p class="lbl g" style="margin-top:14px">Correct answer</p>' +
      '<div class="blk good">' + optHTML(q.o[q.a]) + "</div>" +
      '<p class="why last"><b>Why it works.</b> ' + esc(q.e) + "</p></div>";
  }

  function renderGame() {
    if (S.i >= S.qs.length) S.i = S.qs.length - 1;
    if (S.ans.length < S.i) {
      S.i = S.ans.length;
      S.view = S.i;
    }
    var vi = S.view;
    var q = S.qs[vi];
    var reviewing = vi !== S.i;
    var a = reviewing ? S.ans[vi] : null;
    var opts = q.o.map(function (o, j) {
      var cls = "";
      if (reviewing) {
        if (j === q.a) cls = " correct";
        else if (a && j === a.pick) cls = " wrong";
        else cls = " dead";
      }
      return '<button class="opt' + cls + (reviewing ? " locked" : "") + '" data-opt="' + j + '"' + (reviewing ? " disabled" : "") + '><span class="idx">' + (j + 1) + "</span>" + optHTML(o) + "</button>";
    }).join("");
    var lab = esc(S.label);
    if (S.mode === "marathon") lab = '<span class="lab-fire">' + flameSVG("") + "</span>" + lab;
    var banner = "";
    if (reviewing && a) {
      banner = '<div class="review-banner ' + (a.ok ? "good" : "bad") + '"><span>Reviewing question ' + (vi + 1) + " of " + S.qs.length + ". Answered " + (a.ok ? "correctly" : "incorrectly") + '.</span><button data-act="current">Back to current</button></div>';
    }

    app.innerHTML =
      '<header class="hud">' +
        '<div class="hud-row">' +
          '<button class="iconbtn" data-act="home" aria-label="Exit to chapters">' +
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>' +
          "</button>" +
          '<div class="hud-label">' + lab + "</div>" +
          '<div class="hud-timer" id="timer">00:00</div>' +
          '<div class="hud-score"><span id="score">' + S.score + "</span><small>PTS</small></div>" +
          '<button class="iconbtn" data-act="pause" aria-label="Pause session" title="Pause (P)"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1.2"/><rect x="14" y="4" width="4" height="16" rx="1.2"/></svg></button>' +
          '<button class="iconbtn" data-act="sound" aria-label="Toggle sound">' + soundIcon(sndOn) + "</button>" +
        "</div>" +
        '<div class="dots" id="dots">' + dotsHTML() + "</div>" +
      "</header>" +
      '<main class="wrap game">' +
        '<div class="qmeta"><span class="qnum">' + (reviewing ? "Review" : "Scenario") + " " + pad(vi + 1) + " / " + pad(S.qs.length) + "</span>" +
          '<span class="chip">' + (SHORT[q.c] || "") + "</span></div>" +
        '<div class="qcard" id="qcard">' +
          banner +
          (q.s ? '<p class="scenario">' + esc(q.s) + "</p>" : "") +
          '<h2 class="prompt">' + esc(q.p) + "</h2>" +
          '<div class="opts">' + opts + "</div>" +
          (reviewing && a ? reviewHTML(q, a) : "") +
        "</div>" +
        '<div class="qnav">' +
          '<button class="navbtn" data-act="prev"' + (vi === 0 ? " disabled" : "") + '><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg> Previous</button>' +
          '<span class="qpos">' + (reviewing ? "Reviewing" : "Question " + pad(vi + 1) + " of " + pad(S.qs.length)) + "</span>" +
          '<button class="navbtn" data-act="nextq"' + (vi >= S.i ? " disabled" : "") + '>Next <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg></button>' +
        "</div>" +
        '<p class="hint">' + (reviewing ? "Review only. Answers cannot be changed." : "Press 1-4 to answer &middot; Enter to continue &middot; arrows to review") + "</p>" +
      "</main>";
    window.scrollTo(0, 0);
    var el = $("#timer");
    if (el) el.textContent = fmt(performance.now() - S.t0);
    saveRun();
  }

  function flash(ok) {
    var f = $("#flash"); if (!f) return;
    f.className = "";
    void f.offsetWidth;
    f.className = ok ? "ok" : "bad";
    setTimeout(function () { f.className = ""; }, 780);
  }

  function pick(i) {
    if (S.locked || S.screen !== "game" || S.view !== S.i) return;
    var q = S.qs[S.i];
    if (i < 0 || i >= q.o.length) return;
    S.locked = true;
    var ok = i === q.a;
    var pts = ok ? 100 + Math.min(S.streak, 5) * 20 : 0;

    if (ok) {
      S.score += pts;
      S.streak += 1;
      if (S.streak > S.bestStreak) S.bestStreak = S.streak;
    } else {
      S.streak = 0;
    }
    S.ans.push({ q: q, pick: i, ok: ok, pts: pts });
    saveRun();

    $$(".opt").forEach(function (el, j) {
      el.classList.add("locked");
      if (j === q.a) el.classList.add("correct");
      else if (j === i) el.classList.add("wrong");
      else el.classList.add("dead");
    });
    var d = $("#dots"); if (d) d.innerHTML = dotsHTML();
    var sc = $("#score");
    if (sc) {
      sc.textContent = S.score;
      if (sc.animate) sc.animate([{ transform: "scale(1)" }, { transform: "scale(1.28)" }, { transform: "scale(1)" }], { duration: 320, easing: "ease-out" });
    }

    flash(ok);
    if (!ok) {
      var card = $("#qcard");
      if (card) { card.classList.add("shake"); setTimeout(function () { card.classList.remove("shake"); }, 480); }
    }
    sfx(ok ? "ok" : "bad");
    showSheet(q, i, ok, pts);
  }

  function showSheet(q, picked, ok, pts) {
    var old = $("#sheet"); if (old) old.remove();
    var body = "";
    if (ok) {
      body =
        '<div class="blk good"><p class="lbl g">Correct entry</p>' + optHTML(q.o[q.a]) + "</div>" +
        '<p class="why last"><b>Why it works.</b> ' + esc(q.e) + "</p>";
    } else {
      body =
        '<p class="lbl r">Your answer</p>' +
        '<div class="blk bad">' + optHTML(q.o[picked]) + "</div>" +
        '<p class="why"><b>Why it fails.</b> ' + esc(q.r[picked] || "") + "</p>" +
        '<p class="lbl g" style="margin-top:16px">Correct answer</p>' +
        '<div class="blk good">' + optHTML(q.o[q.a]) + "</div>" +
        '<p class="why last"><b>Why it works.</b> ' + esc(q.e) + "</p>";
    }
    var html =
      '<div class="sheet ' + (ok ? "ok" : "bad") + '" id="sheet" role="dialog" aria-live="polite" aria-label="Answer feedback">' +
        '<div class="sheet-top"><span class="verdict ' + (ok ? "ok" : "bad") + '">' + (ok ? "Correct" : "Not quite") + "</span>" +
          '<span class="pts ' + (ok ? "" : "zero") + '">' + (ok ? "+" + pts : "0") + "</span></div>" +
        '<div class="sheet-body">' + body + "</div>" +
        '<button class="btn primary wide" data-act="next">Continue <span class="k">ENTER</span></button>' +
      "</div>";
    document.body.insertAdjacentHTML("beforeend", html);
    document.body.style.overflow = "hidden";
    var sh = $("#sheet");
    requestAnimationFrame(function () { sh.classList.add("on"); });
  }

  function next() {
    if (S.screen !== "game") return;
    // Only advance when the current question has exactly one answer. This stops
    // a second Enter or click from skipping an unanswered question.
    if (S.ans.length !== S.i + 1) {
      if (S.ans.length <= S.i) {
        S.i = S.ans.length;
        S.view = S.i;
        renderGame();
      }
      return;
    }
    var sh = $("#sheet");
    if (sh) {
      sh.classList.remove("on");
      sh.style.pointerEvents = "none";
      setTimeout(function () { if (sh.parentNode) sh.remove(); }, 220);
    }
    document.body.style.overflow = "";
    S.locked = false;
    if (S.i >= S.qs.length - 1) {
      setTimeout(finish, 160);
    } else {
      S.i += 1;
      S.view = S.i;
      renderGame();
    }
  }

  /* ---------- results ---------- */
  function rank(acc) {
    if (acc >= 0.95) return ["Ledger master", "Clean entries, clean mind. Nothing here surprised you."];
    if (acc >= 0.85) return ["Controller", "Strong command of the full cycle. A few details left to tighten."];
    if (acc >= 0.72) return ["Senior accountant", "The framework is there. The traps are what cost you."];
    if (acc >= 0.55) return ["Staff accountant", "Solid start. Drill the chapters where the red showed up."];
    return ["Junior clerk", "Plenty of runway. Work chapter by chapter, then run it back."];
  }

  function renderResultBoard(mode, name) {
    var box = $("#result-board-body");
    if (!box) return;
    if (mode === "drill" || mode === "chapter") {
      box.innerHTML = '<div class="board-empty">' + (mode === "chapter" ? "Chapter drills are practice only. The leaderboard is for Full Exam and Marathon." : "Practice run. Not posted to the leaderboard.") + "</div>";
      return;
    }
    api("/api/leaderboard?mode=" + encodeURIComponent(mode) + "&limit=10").then(function (d) {
      if (!box || !document.body.contains(box)) return;
      if (!d.scores || !d.scores.length) {
        box.innerHTML = '<div class="board-empty">No scores on this board yet.</div>';
        return;
      }
      var me = (name || "").toLowerCase();
      box.innerHTML = '<div class="lb-head"><span>#</span><span>Player</span><span>Score</span><span>Acc</span><span>Time</span></div>' +
        d.scores.map(function (s, i) {
          var mine = s.name.toLowerCase() === me;
          var cls = "lb-row" + (i === 0 ? " top" : "") + (mine ? " me" : "");
          return '<div class="' + cls + '">' +
            '<span class="lb-rank">' + pad(i + 1) + "</span>" +
            '<span class="lb-name">' + esc(s.name) + (mine ? "<em>you</em>" : "") + "</span>" +
            '<span class="lb-score">' + s.score + "</span>" +
            '<span class="lb-acc">' + Math.round(s.accuracy * 100) + "%</span>" +
            '<span class="lb-time">' + fmt(s.duration_ms) + "</span>" +
          "</div>";
        }).join("");
    }).catch(function () {
      if (box) box.innerHTML = '<div class="board-empty">Leaderboard offline.</div>';
    });
  }

  function submitScore(result, mode) {
    var line = $("#lb-line");
    if (mode === "drill" || mode === "chapter") {
      if (line) {
        line.textContent = mode === "chapter" ? "Chapter runs are practice. Not posted to the leaderboard." : "Practice run. Not posted to the leaderboard.";
        line.classList.add("off");
      }
      renderResultBoard(mode, S.name);
      return;
    }
    var payload = {
      name: S.name, mode: mode, score: result.score, accuracy: result.accuracy,
      correct: result.correct, total: result.total, duration_ms: result.duration_ms
    };
    setLS(PENDING_KEY, JSON.stringify({ payload: payload, at: Date.now() }));
    api("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(function (d) {
      if (line) {
        line.textContent = d.rank ? "#" + d.rank + " of " + d.players + " on the " + mode + " board." : "Score posted.";
        line.classList.remove("off");
      }
      delLS(PENDING_KEY);
      renderResultBoard(mode, payload.name);
    }).catch(function () {
      setLS(PENDING_KEY, JSON.stringify({ payload: payload, at: Date.now() }));
      if (line) {
        line.textContent = "Leaderboard offline. Saved here and will retry.";
        line.classList.add("off");
      }
      renderResultBoard(mode, payload.name);
    });
  }

  function finish() {
    var wasPaused = S.paused;
    var pausedElapsed = S.pauseElapsed;
    closePause();
    stopTimer();
    S.elapsed = wasPaused ? pausedElapsed : (performance.now() - S.t0);
    S.screen = "results";
    document.body.style.overflow = "";
    document.body.classList.remove("marathon-mode");
    var sh = $("#sheet"); if (sh) sh.remove();
    clearRun();

    var correct = S.ans.filter(function (a) { return a.ok; }).length;
    var total = S.ans.length || 1;
    var acc = correct / total;
    S.missed = S.ans.filter(function (a) { return !a.ok; });
    var prevBest = bestFor(S.key);
    saveBest(S.key, S.score, acc, S.elapsed);
    var isBest = !prevBest || S.score > prevBest.score;
    var r = rank(acc);

    var byCh = {};
    S.ans.forEach(function (a) {
      var c = a.q.c;
      if (!byCh[c]) byCh[c] = { ok: 0, n: 0 };
      byCh[c].n += 1;
      if (a.ok) byCh[c].ok += 1;
    });
    var brk = Object.keys(byCh).sort().map(function (c) {
      var p = Math.round(byCh[c].ok / byCh[c].n * 100);
      return '<div class="brk"><span>' + (SHORT[c] || "Chapter " + c) + '</span><span class="track"><span class="fill ' + (p >= 70 ? "good" : "") + '" style="width:' + p + '%"></span></span><span class="pct">' + p + "%</span></div>";
    }).join("");

    var missedHTML = S.missed.map(function (a) {
      var q = a.q;
      var qn = S.ans.indexOf(a) + 1;
      return '<details class="miss" open><summary><span class="mq">Q' + qn + "</span><span>" + esc(q.p) + "</span></summary>" +
        '<div class="body">' +
          (q.s ? '<p class="why" style="margin-top:0;color:var(--muted)">' + esc(q.s) + "</p>" : "") +
          '<p class="lbl r">Your answer</p><div class="blk bad">' + optHTML(q.o[a.pick]) + "</div>" +
          '<p class="why"><b>Why it fails.</b> ' + esc(q.r[a.pick] || "") + "</p>" +
          '<p class="lbl g" style="margin-top:14px">Correct answer</p><div class="blk good">' + optHTML(q.o[q.a]) + "</div>" +
          '<p class="why last"><b>Why it works.</b> ' + esc(q.e) + "</p>" +
        "</div></details>";
    }).join("");

    var avg = S.elapsed / total;
    var hot = S.mode === "marathon";

    app.innerHTML =
      '<div class="top"><div class="brand"><span class="mark"></span>The Ledger <span>/ run complete</span></div>' + soundBtn() + "</div>" +
      '<main class="wrap results">' +
        '<div class="res-head">' +
          '<p class="eyebrow' + (hot ? " hot" : "") + '">' + (hot ? "Marathon complete" : "Run complete") + "</p>" +
          '<h1 class="rank">' + esc(r[0]) + "</h1>" +
          '<p class="rank-sub">' + esc(r[1]) + "</p>" +
        "</div>" +
        '<div class="stats">' +
          '<div class="stat"><div class="v pink">' + fmt(S.elapsed) + '</div><div class="l">Completion time</div></div>' +
          '<div class="stat"><div class="v">' + S.score + '</div><div class="l">Score</div></div>' +
          '<div class="stat"><div class="v">' + Math.round(acc * 100) + '%</div><div class="l">Accuracy</div></div>' +
          '<div class="stat"><div class="v">' + correct + '/' + total + '</div><div class="l">Correct</div></div>' +
        "</div>" +
        '<p class="hint" style="margin-top:0">Best streak ' + S.bestStreak + " &middot; " + fmt(avg) + " average per question" + (isBest ? " &middot; new personal best" : "") + "</p>" +
        '<p class="lb-line" id="lb-line">Posting score...</p>' +
        '<div class="note-card"><p>Do your best, and let god do the rest</p></div>' +
        (S.missed.length ? '<p class="jump"><a href="#mistakes">Review your ' + S.missed.length + ' mistakes</a></p>' : "") +
        '<div class="panel result-board"><h3>Leaderboard</h3><div id="result-board-body"><div class="board-empty">Loading...</div></div></div>' +
        '<div class="panel"><h3>Chapter breakdown</h3>' + brk + "</div>" +
        (S.missed.length ? '<div class="panel" id="mistakes"><h3>Review your mistakes (' + S.missed.length + ')</h3><p class="panel-sub">Your answer, the correct entry, and the reason for every question you missed.</p>' + missedHTML + "</div>" : "") +
        '<div class="res-actions">' +
          (S.missed.length ? '<button class="btn primary" data-act="drill">Drill missed <span class="k">' + S.missed.length + " Q</span></button>" : "") +
          '<button class="btn" data-act="retry">Play again</button>' +
          '<button class="btn ghost" data-act="board-home">Leaderboard</button>' +
          '<button class="btn ghost" data-act="home">All chapters</button>' +
        "</div>" +
      "</main>";

    submitScore({ score: S.score, accuracy: acc, correct: correct, total: total, duration_ms: Math.round(S.elapsed) }, S.mode);
    sfx("finish");
    if (acc >= 0.8) confetti(S.mode);
    window.scrollTo(0, 0);
  }

  /* ---------- confetti ---------- */
  var cv = document.getElementById("fx");
  var ctx = cv ? cv.getContext("2d") : null;
  var parts = [], raf = null;
  function sizeFx() {
    if (!cv) return;
    var d = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.floor(window.innerWidth * d);
    cv.height = Math.floor(window.innerHeight * d);
    ctx.setTransform(d, 0, 0, d, 0, 0);
  }
  function confetti(mode) {
    if (!cv || !ctx) return;
    sizeFx();
    var colors = mode === "marathon"
      ? ["#ff6a00", "#ffb347", "#e0306f", "#ffd08a", "#c2410c"]
      : ["#e0306f", "#ff8fb4", "#0e9f6e", "#251621", "#ffd0e2"];
    parts = [];
    for (var i = 0; i < 110; i++) {
      parts.push({
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * window.innerHeight * 0.4,
        vx: (Math.random() - 0.5) * 1.6,
        vy: 2 + Math.random() * 3.4,
        r: Math.random() * 5 + 3,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.18,
        c: colors[i % colors.length],
        sq: Math.random() > 0.35
      });
    }
    var start = performance.now();
    cancelAnimationFrame(raf);
    function frame(t) {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      parts.forEach(function (p) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.03; p.rot += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c;
        if (p.sq) ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
        else { ctx.beginPath(); ctx.arc(0, 0, p.r / 1.6, 0, 6.283); ctx.fill(); }
        ctx.restore();
      });
      if (t - start < 2800) raf = requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
    raf = requestAnimationFrame(frame);
  }
  window.addEventListener("resize", function () { if (cv) sizeFx(); });

  /* ---------- navigation ---------- */
  function stopTimer() { if (S.timer) { clearInterval(S.timer); S.timer = null; } }
  function startTimer() {
    stopTimer();
    S.timer = setInterval(function () {
      var el = $("#timer");
      if (el) el.textContent = fmt(performance.now() - S.t0);
    }, 100);
  }
  function closePause() {
    var p = $("#pause");
    if (p) p.remove();
    document.body.classList.remove("paused");
    S.paused = false;
  }
  function pauseGame() {
    if (S.screen !== "game" || S.paused) return;
    S.paused = true;
    S.pauseElapsed = performance.now() - S.t0;
    stopTimer();
    saveRun();
    document.body.classList.add("paused");
    document.body.style.overflow = "hidden";
    var el = document.createElement("div");
    el.className = "pause";
    el.id = "pause";
    el.innerHTML =
      '<div class="pause-card" role="dialog" aria-modal="true" aria-labelledby="pauseTitle">' +
        '<div class="pause-mark" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1.2"/><rect x="14" y="4" width="4" height="16" rx="1.2"/></svg></div>' +
        '<h2 id="pauseTitle">Session paused</h2>' +
        '<p class="gate-sub">The timer is stopped and the question is hidden. Resume when you are ready.</p>' +
        '<button class="btn primary" data-act="resume">Resume</button>' +
      "</div>";
    document.body.appendChild(el);
    setTimeout(function () { var b = $('[data-act="resume"]'); if (b) b.focus(); }, 50);
    sfx("click");
  }
  function resumeGame() {
    if (!S.paused) { closePause(); return; }
    S.paused = false;
    S.t0 = performance.now() - S.pauseElapsed;
    var p = $("#pause"); if (p) p.remove();
    document.body.classList.remove("paused");
    document.body.style.overflow = $("#sheet") ? "hidden" : "";
    startTimer();
    saveRun();
    sfx("click");
  }

  function startExam() {
    var per = Math.floor(40 / CH.length);
    var list = [];
    CH.forEach(function (c) {
      var pool = BANK.filter(function (q) { return q.c === c.n; });
      list = list.concat(sample(pool, Math.min(per, pool.length)));
    });
    while (list.length < 40) {
      var pool = BANK.filter(function (q) { return list.indexOf(q) === -1; });
      if (!pool.length) break;
      list.push(pool[Math.floor(Math.random() * pool.length)]);
    }
    start(shuffle(list), "Full exam / 40 questions", "exam", "exam", 0);
  }
  function startMarathon() {
    start(shuffle(BANK), "Marathon / all " + BANK.length, "marathon", "marathon", 0);
  }
  function startChapter(n) {
    var c = CH[n - 1];
    start(BANK.filter(function (q) { return q.c === n; }), "Chapter " + n + " / " + c.t, "ch" + n, "chapter", n);
  }

  function askExit() {
    var el = document.createElement("div");
    el.className = "gate";
    el.id = "confirm";
    el.innerHTML =
      '<div class="gate-card confirm" role="dialog" aria-modal="true" aria-labelledby="confirmTitle">' +
        '<p class="eyebrow">Leave run</p>' +
        '<h2 id="confirmTitle">Exit this run?</h2>' +
        '<p class="gate-sub">Your saved progress will be cleared. Finished runs stay on the leaderboard.</p>' +
        '<div class="gate-actions"><button class="btn danger" data-act="confirm-yes">Exit run</button><button class="btn ghost" data-act="confirm-no">Keep playing</button></div>' +
      "</div>";
    document.body.appendChild(el);
    document.body.style.overflow = "hidden";
    setTimeout(function () { var b = $('[data-act="confirm-no"]'); if (b) b.focus(); }, 50);
  }
  function closeConfirm() {
    var c = $("#confirm");
    if (c) c.remove();
    if (!$("#sheet") && !$("#gate")) document.body.style.overflow = "";
  }
  function doExit() {
    closeConfirm();
    if (S.screen === "game") clearRun();
    sfx("click");
    home();
  }

  document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "gate") { gateCancel(); return; }
    if (e.target && e.target.id === "confirm") { closeConfirm(); return; }
    var a = e.target.closest("[data-act]");
    if (a) {
      var act = a.getAttribute("data-act");
      if (act === "sound") { toggleSound(); return; }
      if (act === "pause") { pauseGame(); return; }
      if (act === "resume") { resumeGame(); return; }
      if (act === "exam") { sfx("click"); requestStart({ kind: "exam" }); return; }
      if (act === "marathon") { sfx("click"); requestStart({ kind: "marathon" }); return; }
      if (act === "chapter") { sfx("click"); requestStart({ kind: "chapter", ch: +a.getAttribute("data-ch") }); return; }
      if (act === "gate-start") { gateStart(); return; }
      if (act === "gate-cancel") { gateCancel(); return; }
      if (act === "board") { sfx("click"); renderBoard(a.getAttribute("data-mode")); return; }
      if (act === "notes") { sfx("click"); renderNotes(); return; }
      if (act === "print") { window.print(); return; }
      if (act === "next") { next(); return; }
      if (act === "prev") { goView(S.view - 1); return; }
      if (act === "nextq") { goView(S.view + 1); return; }
      if (act === "current") { S.view = S.i; renderGame(); return; }
      if (act === "confirm-yes") { doExit(); return; }
      if (act === "confirm-no") { closeConfirm(); return; }
      if (act === "retry") { sfx("click"); requestStart({ kind: "retry" }); return; }
      if (act === "drill") { sfx("click"); requestStart({ kind: "drill" }); return; }
      if (act === "board-home") {
        S.boardMode = S.mode === "marathon" ? "marathon" : "exam";
        sfx("click"); home();
        setTimeout(function () { var b = $(".board"); if (b) b.scrollIntoView({ behavior: "smooth", block: "start" }); }, 260);
        return;
      }
      if (act === "home") {
        if (S.screen === "game" && S.ans.length) { askExit(); return; }
        if (S.screen === "game") clearRun();
        sfx("click"); home(); return;
      }
    }
    var qd = e.target.closest("[data-q]");
    if (qd && S.screen === "game") { goView(+qd.getAttribute("data-q")); return; }
    var o = e.target.closest("[data-opt]");
    if (o && S.screen === "game" && !S.locked) pick(+o.getAttribute("data-opt"));
  });

  document.addEventListener("keydown", function (e) {
    if ($("#confirm")) {
      if (e.key === "Escape") { e.preventDefault(); closeConfirm(); }
      return;
    }
    if ($("#gate")) {
      if (e.key === "Enter") { e.preventDefault(); gateStart(); }
      else if (e.key === "Escape") { e.preventDefault(); gateCancel(); }
      return;
    }
    if ($("#pause")) {
      if (e.key === "Escape" || e.key === "p" || e.key === "P") { e.preventDefault(); resumeGame(); }
      return;
    }
    if (e.key === "m" || e.key === "M") { toggleSound(); return; }
    if (S.screen === "notes") {
      if (e.key === "Escape") { e.preventDefault(); home(); }
      return;
    }
    if (S.screen !== "game") return;
    if (e.key === "p" || e.key === "P") { e.preventDefault(); pauseGame(); return; }
    if ($("#sheet")) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); next(); }
      return;
    }
    if (e.key === "ArrowLeft") { e.preventDefault(); goView(S.view - 1); return; }
    if (e.key === "ArrowRight") { e.preventDefault(); goView(S.view + 1); return; }
    if (e.key === "Enter" && S.view !== S.i) { e.preventDefault(); S.view = S.i; renderGame(); return; }
    if (/^[1-9]$/.test(e.key)) {
      var i = +e.key - 1;
      if (S.qs[S.i] && i < S.qs[S.i].o.length) pick(i);
    }
    if (e.key === "Escape") {
      if (S.ans.length) { askExit(); return; }
      clearRun();
      home();
    }
  });

  window.addEventListener("beforeunload", function () {
    if (S.screen === "game") saveRun();
  });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden && S.screen === "game") saveRun();
  });

  window.__LEDGER = S;
  window.__nameError = nameError;
  window.__isProfane = isProfane;

  /* ---------- boot ---------- */
  if (!BANK.length) {
    app.innerHTML = '<main class="wrap home"><h1>Question bank failed to load.</h1><p class="lede">Check that bank-a.js, bank-b.js, and bank-c.js are being served next to index.html.</p></main>';
  } else {
    syncName();
    flushPending();
    var saved = loadRun();
    if (saved && Date.now() - (saved.savedAt || 0) < 7 * 864e5 && saved.i < saved.qs.length) {
      restoreRun(saved);
    } else {
      clearRun();
      home();
    }
  }
})();
