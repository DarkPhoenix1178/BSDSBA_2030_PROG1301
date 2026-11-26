#!/usr/bin/env python3
"""The Ledger: static game server plus a small SQLite leaderboard API."""

import json
import os
import sqlite3
import time
import unicodedata
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

ROOT = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(ROOT, "leaderboard.db")
MAX_BODY = 4096
MODES = {"exam", "marathon", "chapter"}
ALLOWED_EXT = {".html", ".js", ".css", ".svg", ".png", ".ico", ".webmanifest"}
RATE = {}
RATE_LIMIT = 60
RATE_WINDOW = 60
NAME_MAX = 20

# Rule-based profanity detection. Names are normalized for separators, repeated
# letters, accents, homoglyphs, and common leet spellings before matching. Short
# or ambiguous roots are exact/compound only, so ordinary names such as Cassidy,
# Hancock, Dickens, and Michelle survive.
EXACT_BAD = {
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
    "pusy", "shemale", "shemales", "kunt", "fagit", "crap", "molest",
}

PART_BAD = (
    "fuck", "motherfuck", "shithead", "shitface", "bullshit", "nigg",
    "fagg", "retard", "wanker", "asshole", "dumbass", "jackass", "dickhead",
    "dickface", "dickwad", "cocksuck", "cuntface", "bitchface", "fuckface",
    "fucktard", "twatface", "whoreface", "slutface", "pussy", "douchebag",
    "pissant", "pedophile", "tranny", "spastic", "nazism", "nignog",
    "biatch", "beyotch", "beotch", "dikhead", "dikface", "cokhead",
    "cokface", "rapist", "kuntface",
)

COMPOUND_BAD = (
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
    "molesting", "molestation",
)

CONFUSABLES = {
    "а": "a", "в": "b", "е": "e", "ё": "e", "і": "i", "ї": "i", "ј": "j",
    "к": "k", "м": "m", "н": "h", "о": "o", "р": "p", "с": "c", "т": "t",
    "у": "y", "х": "x", "ѕ": "s", "ԁ": "d", "ӏ": "l", "һ": "h", "ԛ": "q",
    "ԝ": "w", "ν": "v", "α": "a", "β": "b", "γ": "y", "ε": "e", "η": "n",
    "ι": "i", "κ": "k", "μ": "u", "ο": "o", "π": "n", "ρ": "p", "σ": "o",
    "τ": "t", "υ": "u", "φ": "f", "χ": "x", "ψ": "w", "ω": "w", "ł": "l",
    "đ": "d", "ø": "o", "æ": "ae", "œ": "oe", "ß": "ss", "þ": "th",
    "ð": "d", "ı": "i", "ȷ": "j", "ɑ": "a", "ɡ": "g", "ɩ": "i", "ʟ": "l",
    "ʀ": "r", "ʏ": "y",
}
LEET = {
    "0": "o", "1": "i", "2": "z", "3": "e", "4": "a", "5": "s", "7": "t",
    "8": "b", "9": "g", "@": "a", "$": "s", "!": "i", "|": "i", "+": "t",
}


def deburr(s):
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = s.lower()
    s = "".join(CONFUSABLES.get(c, LEET.get(c, c)) for c in s)
    return "".join(c for c in s if "a" <= c <= "z")


def squeeze(s, max_run):
    out = []
    prev = None
    run = 0
    for c in s:
        if c == prev:
            run += 1
            if run <= max_run:
                out.append(c)
        else:
            prev = c
            run = 1
            out.append(c)
    return "".join(out)


def variants_of(base):
    maps = [
        ("ph", "f"), ("ck", "k"), ("qu", "k"), ("q", "k"), ("x", "ks"),
        ("z", "s"), ("v", "u"), ("y", "i"), ("w", "u"),
    ]
    seen = set()
    out = []

    def add(x):
        if x and x not in seen:
            seen.add(x)
            out.append(x)
        for v in (squeeze(x, 1), squeeze(x, 2)):
            if v and v not in seen:
                seen.add(v)
                out.append(v)

    def expand(x, idx):
        if idx >= len(maps):
            add(x)
            return
        expand(x, idx + 1)
        a, b = maps[idx]
        t = x.replace(a, b)
        if t != x:
            expand(t, idx + 1)

    for b in (base, squeeze(base, 1), squeeze(base, 2)):
        add(b)
        expand(b, 0)
    return out


def is_profane(name):
    base = deburr(name)
    if not base:
        return False
    for v in variants_of(base):
        if v in EXACT_BAD:
            return True
        if any(p in v for p in PART_BAD):
            return True
        if any(p in v for p in COMPOUND_BAD):
            return True
    return False


def connect():
    con = sqlite3.connect(DB_PATH, timeout=8)
    con.row_factory = sqlite3.Row
    con.execute("PRAGMA journal_mode=WAL")
    con.execute("PRAGMA busy_timeout=8000")
    return con


def init_db():
    con = connect()
    con.execute(
        """
        CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            mode TEXT NOT NULL,
            score INTEGER NOT NULL,
            accuracy REAL NOT NULL,
            correct INTEGER NOT NULL,
            total INTEGER NOT NULL,
            duration_ms INTEGER NOT NULL,
            created_at TEXT NOT NULL
        )
        """
    )
    con.execute(
        "CREATE INDEX IF NOT EXISTS idx_scores_mode "
        "ON scores(mode, score DESC, duration_ms ASC)"
    )
    con.commit()
    con.close()


def clean_name(value):
    if not isinstance(value, str):
        return None
    value = "".join(ch for ch in value if ch.isprintable()).strip()
    if not value or len(value) > NAME_MAX:
        return None
    if any(ch.isdigit() for ch in value):
        return None
    if any(not (ch.isalpha() or ch in "'-") for ch in value):
        return None
    if is_profane(value):
        return None
    return value


def best_rows(con, mode):
    return con.execute(
        """
        SELECT name, score, accuracy, correct, total, duration_ms, created_at
        FROM (
            SELECT *, ROW_NUMBER() OVER (
                PARTITION BY lower(name)
                ORDER BY score DESC, duration_ms ASC, id ASC
            ) AS rn
            FROM scores WHERE mode = ?
        )
        WHERE rn = 1
        ORDER BY score DESC, duration_ms ASC, name ASC
        """,
        (mode,),
    ).fetchall()


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "same-origin")
        if not self.path.startswith("/api/"):
            self.send_header("Cache-Control", "no-store, max-age=0")
            self.send_header("Pragma", "no-cache")
            self.send_header("Expires", "0")
        super().end_headers()

    def send_json(self, payload, status=200):
        body = json.dumps(payload, separators=(",", ":")).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/health":
            return self.send_json({"ok": True})
        if parsed.path == "/api/leaderboard":
            return self.leaderboard(parse_qs(parsed.query))
        if parsed.path.startswith("/api/"):
            return self.send_json({"error": "not found"}, 404)
        if parsed.path not in ("/", "/index.html"):
            ext = os.path.splitext(parsed.path)[1].lower()
            if ext not in ALLOWED_EXT:
                return self.send_error(404)
        return super().do_GET()

    def do_POST(self):
        if urlparse(self.path).path != "/api/score":
            return self.send_json({"error": "not found"}, 404)
        return self.submit_score()

    def leaderboard(self, qs):
        mode = (qs.get("mode") or ["exam"])[0]
        if mode not in MODES:
            mode = "exam"
        try:
            limit = max(1, min(int((qs.get("limit") or ["10"])[0]), 50))
        except ValueError:
            limit = 10
        con = connect()
        try:
            rows = best_rows(con, mode)
        finally:
            con.close()
        payload = {
            "mode": mode,
            "players": len(rows),
            "scores": [
                {
                    "name": r["name"],
                    "score": r["score"],
                    "accuracy": round(float(r["accuracy"]), 4),
                    "correct": r["correct"],
                    "total": r["total"],
                    "duration_ms": r["duration_ms"],
                    "created_at": r["created_at"],
                }
                for r in rows[:limit]
            ],
        }
        return self.send_json(payload)

    def submit_score(self):
        ip = self.client_address[0]
        now = time.time()
        bucket = RATE.setdefault(ip, [])
        bucket[:] = [t for t in bucket if now - t < RATE_WINDOW]
        if len(bucket) >= RATE_LIMIT:
            return self.send_json({"error": "too many submissions"}, 429)
        bucket.append(now)

        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            length = 0
        if length <= 0 or length > MAX_BODY:
            return self.send_json({"error": "bad body"}, 413)
        try:
            data = json.loads(self.rfile.read(length).decode("utf-8"))
        except Exception:
            return self.send_json({"error": "bad json"}, 400)
        if not isinstance(data, dict):
            return self.send_json({"error": "bad json"}, 400)

        name = clean_name(data.get("name"))
        mode = data.get("mode")
        try:
            score = int(data.get("score"))
            accuracy = float(data.get("accuracy"))
            correct = int(data.get("correct"))
            total = int(data.get("total"))
            duration = int(data.get("duration_ms"))
        except (TypeError, ValueError):
            return self.send_json({"error": "bad numbers"}, 400)

        if not name:
            return self.send_json({"error": "bad name"}, 400)
        if mode not in MODES:
            return self.send_json({"error": "bad mode"}, 400)
        if not (1 <= total <= 500 and 0 <= correct <= total):
            return self.send_json({"error": "bad counts"}, 400)
        if not (0 <= score <= total * 200):
            return self.send_json({"error": "bad score"}, 400)
        if not (0 <= accuracy <= 1) or abs(accuracy - (correct / total)) > 0.02:
            return self.send_json({"error": "bad accuracy"}, 400)
        if not (0 < duration <= 6 * 3600 * 1000):
            return self.send_json({"error": "bad duration"}, 400)

        con = connect()
        try:
            con.execute(
                "INSERT INTO scores(name,mode,score,accuracy,correct,total,"
                "duration_ms,created_at) VALUES(?,?,?,?,?,?,?,?)",
                (
                    name,
                    mode,
                    score,
                    accuracy,
                    correct,
                    total,
                    duration,
                    datetime.now(timezone.utc).isoformat(timespec="seconds"),
                ),
            )
            con.commit()
            rows = best_rows(con, mode)
            rank = next(
                (i + 1 for i, r in enumerate(rows) if r["name"].lower() == name.lower()),
                None,
            )
            players = len(rows)
        finally:
            con.close()
        return self.send_json({"ok": True, "rank": rank, "players": players})


if __name__ == "__main__":
    init_db()
    port = int(os.environ.get("PORT", "8787"))
    server = ThreadingHTTPServer(("0.0.0.0", port), Handler)
    print(f"The Ledger serving on 0.0.0.0:{port} (db: {DB_PATH})", flush=True)
    server.serve_forever()
