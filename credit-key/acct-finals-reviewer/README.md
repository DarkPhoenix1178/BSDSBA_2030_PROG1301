# Accounting Finals Reviewer

An interactive reviewer for the BSDSBA 2030 accounting finals. The whole thing is a single-page app with a small Python server behind it, so a run can be played offline once the page has loaded, and scores can be compared across devices.

## What it covers

203 questions across 13 chapters, written from the course slides and my own notes.

| # | Chapter | Questions |
|---|---|---|
| 1 | Foundations & the Cycle | 20 |
| 2 | Daily Operating Entries | 12 |
| 3 | Adjusting Entries & Receivables | 21 |
| 4 | PPE, Depreciation & Disposals | 23 |
| 5 | Liabilities & Bonds | 24 |
| 6 | Statements & Closing | 14 |
| 7 | Ratios & DuPont | 20 |
| 8 | Exam Traps | 10 |
| 9 | Cash & Bank Reconciliation | 12 |
| 10 | Inventory & Cost Flow | 13 |
| 11 | Shareholders' Equity | 15 |
| 12 | Statement of Cash Flows | 10 |
| 13 | Trend Analysis | 9 |

61 of those are journal-entry questions. Instead of picking a letter, you assemble the entry line by line, debit and credit, account and amount.

## Modes

- **Marathon** — all 203 questions in one run.
- **Full Exam** — 40 questions sampled evenly across all 13 chapters.
- **Chapter drills** — one chapter at a time, for when a single topic is the problem.

Marathon and Full Exam have leaderboards. Drills do not, because a ten-question drill is not comparable to a full run.

## How the answering works

Every option carries its own reason, so a wrong answer tells you what you confused it with rather than just marking you down. The correct option gets a separate explanation of why it is right.

Journal-entry questions are graded on the full entry: right accounts, right side, right amounts. Amounts are always either stated in the question or computable from what is stated, which is the rule I used when auditing the bank.

The rest of the run state is straightforward but was worth getting right:

- The timer runs per attempt and the completion time is kept with the score.
- A run survives a refresh and can be resumed.
- You can navigate back to questions you have already answered and review them.
- The name is set once, stored locally, and used on both leaderboards.

## Running it

```bash
python3 server.py
```

Then open `http://localhost:8787`. The port can be overridden with `PORT`. The SQLite database and its table are created on first start, so there is nothing to set up.

## Files

| File | Purpose |
|---|---|
| `index.html` | Markup and all styling |
| `app.js` | Game logic, scoring, timer, navigation, leaderboard client |
| `bank-a.js` … `bank-e.js` | The question bank, split for manageable file sizes |
| `notes.js` | The exam notes section and its printable layout |
| `server.py` | Static file server plus the score API |

## Leaderboard

Scores are written through `POST /api/score` and read back per mode. Only the display name, mode, score, accuracy, correct count, question count, duration, and timestamp are stored. The database file itself is not in the repo, since it holds other people's plays rather than anything needed to run the project.

Names are validated on both sides: one word, 20 characters, letters only, no digits, and a rule-based profanity check that normalises separators, repeated letters, accents, homoglyphs, and leet substitutions before matching.
