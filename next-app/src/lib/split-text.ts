/**
 * 純 JS 文字分割工具 — 不依賴任何第三方付費插件
 * 使用 getBoundingClientRect 分析每個 word 的垂直位置，按行分組，
 * 建立 .line-mask > .line-inner 的 DOM 結構以實現 overflow:hidden mask reveal 動畫。
 */

/**
 * React-safe 版本：在渲染時輸出已分割的 HTML 字串，
 * 透過 dangerouslySetInnerHTML 交給 React 管理 DOM，避免在 useEffect 裡直接改 DOM。
 */
export function buildSplitHTML(text: string): string {
  return text
    .split(/\s+/)
    .map(
      (word, i, arr) =>
        `<span class="line-mask" style="display:inline-block"><span class="line-inner" style="display:inline-block">${word}${i < arr.length - 1 ? '\u00A0' : ''}</span></span>`
    )
    .join('');
}

export function buildCharSplitHTML(text: string): string {
  return text
    .split('')
    .map(
      (char) =>
        `<span class="line-mask" style="display:inline-block"><span class="line-inner" style="display:inline-block">${char === ' ' ? '\u00A0' : char}</span></span>`
    )
    .join('');
}

export interface SplitResult {
  lines: HTMLElement[];
  inners: HTMLElement[];
  originalHTML: string;
}

export function splitLines(el: HTMLElement): SplitResult {
  const originalHTML = el.innerHTML;

  // 先取出純文字，按空格拆成 words
  const text = el.innerText.trim();
  const words = text.split(/\s+/);

  // 暫時清空，逐字建立 span 後測量 Y 位置
  el.innerHTML = '';
  const wordSpans: HTMLElement[] = [];

  words.forEach((word, i) => {
    const span = document.createElement('span');
    span.style.display = 'inline-block';
    span.style.whiteSpace = 'pre';
    span.textContent = i < words.length - 1 ? word + ' ' : word;
    el.appendChild(span);
    wordSpans.push(span);
  });

  // 按 Y 位置分組成行
  const lineGroups: HTMLElement[][] = [];
  let currentLine: HTMLElement[] = [];
  let currentY = -1;

  wordSpans.forEach((span) => {
    const rect = span.getBoundingClientRect();
    const y = Math.round(rect.top);
    if (currentY === -1) currentY = y;
    if (Math.abs(y - currentY) > 4) {
      if (currentLine.length) lineGroups.push(currentLine);
      currentLine = [span];
      currentY = y;
    } else {
      currentLine.push(span);
    }
  });
  if (currentLine.length) lineGroups.push(currentLine);

  // 重建 DOM：.line-mask > .line-inner
  el.innerHTML = '';
  const lines: HTMLElement[] = [];
  const inners: HTMLElement[] = [];

  lineGroups.forEach((group) => {
    const mask = document.createElement('span');
    mask.className = 'line-mask';

    const inner = document.createElement('span');
    inner.className = 'line-inner';
    inner.textContent = group.map((s) => s.textContent).join('').trimEnd();

    mask.appendChild(inner);
    el.appendChild(mask);
    lines.push(mask);
    inners.push(inner);
  });

  return { lines, inners, originalHTML };
}

export function splitChars(el: HTMLElement): SplitResult {
  const originalHTML = el.innerHTML;
  const text = el.innerText.trim();

  el.innerHTML = '';
  const lines: HTMLElement[] = [];
  const inners: HTMLElement[] = [];

  text.split('').forEach((char) => {
    const mask = document.createElement('span');
    mask.className = 'line-mask';
    mask.style.display = 'inline-block';

    const inner = document.createElement('span');
    inner.className = 'line-inner';
    inner.style.display = 'inline-block';
    inner.textContent = char === ' ' ? '\u00A0' : char;

    mask.appendChild(inner);
    el.appendChild(mask);
    lines.push(mask);
    inners.push(inner);
  });

  return { lines, inners, originalHTML };
}

export function revertSplit(el: HTMLElement, originalHTML: string): void {
  if (el) el.innerHTML = originalHTML;
}
