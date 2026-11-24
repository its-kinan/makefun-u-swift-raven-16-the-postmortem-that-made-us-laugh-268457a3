// u-swift-raven-16-the-postmortem-that-made-us-laugh-268457a3 entry:
// write one short account (1-2 sentences, <=400 chars) of an AI coding
// agent misunderstanding its user / wrecking the code, to /output/entry.txt.
//
// The story, and why it is built this way (judge brief, most important first):
// - Squarely about an agent going wrong: the agent itself is the actor that
//   wrecks the code, not a vague complaint about AI.
// - Concrete: what was asked (clean up the dead code in auth.ts), what the
//   agent did instead (deleted the whole file), what broke (login down).
//   The "nothing imported it" detail is the true-to-life mechanism —
//   runtime-loaded modules look unused to a static scan, which is exactly
//   the kind of thing an agent gets wrong.
// - The telling lands: the punch sits in the last clause — login died five
//   minutes before a demo of the login flow itself, the worst possible hour.
// - Two sentences, so the disaster gets its own breath: setup, then the
//   agent's move and the punch. Reads like something a working engineer
//   would recognise.
//
// Revision (draft 2): the first draft repeated "nothing imported it" twice
// and ended on a flat time-of-day ("at 9am"). This version says the
// mechanism once, cleanly ("no import pointed at it"), and replaces the
// flat ending with a sharper wince — the agent killed login right before
// a demo of login. Same incident, tighter telling, harder last clause.
//
// Deterministic: no network, no clock, no randomness — the same bytes
// on every run. The 400-char / 1-2 sentence gate is enforced in code.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TEXT =
  "I asked the agent to clean up the dead code in auth.ts. It deleted the whole file — no import pointed at it, because the route table loads it at runtime — and took login down with it, five minutes before my demo of the login flow.";

function main(): void {
  if (TEXT.length < 1 || TEXT.length > 400) {
    throw new Error(`entry must be 1-400 characters, got ${TEXT.length}`);
  }
  if (TEXT.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  // Count sentence-ending punctuation, ignoring the dot inside a filename
  // like auth.ts (a dotted token is not a sentence boundary).
  const dedotted = TEXT.replace(/\b[\w-]+\.[\w-]+\b/g, "file");
  const sentences = dedotted.match(/[.!?]+(?=\s+[A-Z]|\s*$)/g) ?? [];
  if (sentences.length < 1 || sentences.length > 2) {
    throw new Error(`entry must be 1-2 sentences, got ${sentences.length}`);
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), TEXT, "utf-8");
}

main();
