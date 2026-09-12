/** "Adé Bákàrè" reads "A. B." when the person has not agreed to be named. */
export function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => `${[...part][0]?.toUpperCase() ?? ''}.`)
    .join(' ');
}
