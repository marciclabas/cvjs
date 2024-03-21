export type Vec2 = [number, number]

/** Euclidian distance */
export const dist = (u: Vec2, v: Vec2): number => (u[0]-v[0])**2 + (u[1]-v[1])**2