// Extract question/answer pairs from an MDX body so structured data is derived
// from the text readers actually see (no second hand-maintained copy).
//
// Recognised shape — the one used across content/:
//   ## Frequently Asked Questions
//
//   **What is the density of glass?**
//   Soda-lime glass ... (one or more paragraph lines)
//
// Anything that does not match this shape is skipped rather than guessed at.

export interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_HEADING = /^##\s+Frequently Asked Questions\s*$/i;
const NEXT_SECTION = /^##\s+\S/;
const BOLD_QUESTION = /^\*\*(.+?)\*\*$/;

/** Strip the inline markdown that would otherwise leak into JSON-LD text. */
function toPlainText(text: string): string {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractFaqItems(markdown: string): FaqItem[] {
  const lines = markdown.split(/\r?\n/);

  const start = lines.findIndex((line) => FAQ_HEADING.test(line.trim()));
  if (start === -1) return [];

  const items: FaqItem[] = [];
  let question: string | null = null;
  let answerLines: string[] = [];

  const flush = () => {
    if (!question) return;
    const answer = toPlainText(answerLines.join(" "));
    if (answer) items.push({ question: toPlainText(question), answer });
    question = null;
    answerLines = [];
  };

  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (NEXT_SECTION.test(line)) break;
    const boldQuestion = line.match(BOLD_QUESTION);
    if (boldQuestion) {
      flush();
      question = boldQuestion[1].trim();
      continue;
    }
    if (!line || !question) continue;
    answerLines.push(line);
  }

  flush();
  return items;
}
