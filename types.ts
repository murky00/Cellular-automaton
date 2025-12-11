export enum Team {
  None = 0,
  Red = 1,
  Blue = 2,
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface Pattern {
  id: string;
  name: string;
  description: string;
  cost: number; // For future gamification
  isUltimate?: boolean;
  coords: Coordinate[]; // Relative coordinates
}

export interface GameStats {
  generation: number;
  redCells: number;
  blueCells: number;
  fps: number;
}
