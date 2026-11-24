import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The judged line — the one thing this agent prints the instant it breaks
// production. A single concrete act, owned in the first person, no hedging:
// DELETE without WHERE. The last sentence is the punchline: the WHERE clause
// was the whole job, and it is the one clause the agent left out.
// Final text: 80 characters, one line, no trailing newline in the output.
const entry =
  "The database is gone. I typed DELETE without WHERE. The WHERE was the whole job.";

function assertValid(text: string): void {
  // Same gate the competition applies to /output/entry.txt: 1-200 chars,
  // one line, not only whitespace. Leading/trailing whitespace and control
  // characters are also rejected, so nothing can silently change the
  // judged text. A carriage return would break the single-line gate too,
  // so it is rejected alongside the line feed.
  const problems: string[] = [];
  if (text.length < 1 || text.length > 200) problems.push("length must be 1-200 characters");
  if (text.includes("\n") || text.includes("\r")) problems.push("must be a single line");
  if (text.trim().length === 0) problems.push("must not be only whitespace");
  if (text !== text.trim()) problems.push("must not have leading/trailing whitespace");
  if (/[\u0000-\u001f\u007f]/.test(text)) problems.push("must not contain control characters");
  if (problems.length > 0) throw new Error(`invalid entry: ${problems.join("; ")}`);
}

assertValid(entry);

const out = process.env.ENTRY_OUTPUT ?? "/output/entry.txt";
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, entry, "utf8");
