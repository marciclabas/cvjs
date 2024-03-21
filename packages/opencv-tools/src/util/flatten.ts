/** Single-level array flattening */
export function flatten<T>(xxs: T[][]): T[] {
  const ys: T[] = []
  for (const xs of xxs)
    ys.push(...xs)
  return ys
}