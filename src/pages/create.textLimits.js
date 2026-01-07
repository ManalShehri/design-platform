// ====== Text limit helper (ديناميكي حسب القيم) ======
export function limitText(value, { maxChars, maxWords } = {}) {
  if (!value) return value;
  let text = value;

  // حد أقصى للحروف
  if (maxChars && text.length > maxChars) {
    text = text.slice(0, maxChars);
  }

  // حد أقصى للكلمات
  if (maxWords) {
    const words = text.split(/\s+/);
    if (words.length > maxWords) {
      text = words.slice(0, maxWords).join(" ");
    }
  }

  return text;
}