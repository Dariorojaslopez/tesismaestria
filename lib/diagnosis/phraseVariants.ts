/** Elige una redacción equivalente. El criterio del diagnóstico no cambia. */
export function pickPhrase(options: readonly string[]): string {
  if (options.length === 0) return "";
  const index = Math.floor(Math.random() * options.length);
  return options[index] ?? options[0];
}
