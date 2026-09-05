export interface Position {
  line: number;
  column: number;
}

/** One-based line and column (UTF-16 code units) of an offset. LF and CRLF both end a line. */
export function positionOf(text: string, index: number): Position {
  const before = text.slice(0, index);
  const line = (before.match(/\n/g)?.length ?? 0) + 1;
  const lineStart = before.lastIndexOf('\n') + 1;
  return { line, column: index - lineStart + 1 };
}

/** The line containing the offset, without its line ending. */
export function lineAt(text: string, index: number): string {
  const start = text.lastIndexOf('\n', index - 1) + 1;
  const end = text.indexOf('\n', index);
  return text.slice(start, end === -1 ? text.length : end).replace(/\r$/, '');
}

/** A short excerpt of the line around the offset, for the report line. */
export function snippetAround(text: string, index: number, width = 40): string {
  const line = lineAt(text, index);
  const column = index - (text.lastIndexOf('\n', index - 1) + 1);
  const start = Math.max(0, column - width);
  const end = Math.min(line.length, column + width);
  return `${start > 0 ? '...' : ''}${line.slice(start, end)}${end < line.length ? '...' : ''}`;
}
