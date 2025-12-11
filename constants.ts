import { Pattern } from './types';

// Grid Configuration
export const GRID_WIDTH = 200;
export const GRID_HEIGHT = 100;
export const CELL_SIZE = 6; // px
export const SPAWN_ZONE_WIDTH = 45; // cells from edge

// Visuals
export const COLOR_BG = '#000000';
export const COLOR_GRID = '#111111';
export const COLOR_RED = '#ef4444'; // red-500
export const COLOR_RED_DIM = '#7f1d1d';
export const COLOR_BLUE = '#3b82f6'; // blue-500
export const COLOR_BLUE_DIM = '#1e3a8a';

export const WEAPONS: Pattern[] = [
  {
    id: 'glider',
    name: 'Scout (Glider)',
    description: 'Basic diagonal unit.',
    cost: 1,
    coords: [
      { x: 0, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 0, y: 2 }, { x: -1, y: 2 }
    ]
  },
  {
    id: 'lwss',
    name: 'Fighter (LWSS)',
    description: 'Fast orthogonal ship.',
    cost: 2,
    coords: [
      { x: 0, y: 1 }, { x: 0, y: 3 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, 
      { x: 3, y: 3 }, { x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 }
    ]
  },
  {
    id: 'hwss',
    name: 'Cruiser (HWSS)',
    description: 'Heavy armored ship.',
    cost: 3,
    coords: [
      { x: 0, y: 1 }, { x: 0, y: 3 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, 
      { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 5, y: 3 }, { x: 6, y: 0 }, { x: 6, y: 1 }, 
      { x: 6, y: 2 }
    ]
  },
  {
    id: 'shield',
    name: 'Shield Wall',
    description: 'Static defense blocks.',
    cost: 2,
    coords: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, 
      { x: 0, y: 3 }, { x: 1, y: 3 }, { x: 0, y: 4 }, { x: 1, y: 4 }, 
      { x: 0, y: 6 }, { x: 1, y: 6 }, { x: 0, y: 7 }, { x: 1, y: 7 }
    ]
  },
  {
    id: 'phalanx',
    name: 'Phalanx',
    description: 'Vertical wall of ships.',
    cost: 5,
    coords: [
      // Ship 1
      { x: 0, y: 1 }, { x: 0, y: 3 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, 
      { x: 3, y: 3 }, { x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 },
      // Ship 2 (Spacing is critical)
      { x: 0, y: 10 }, { x: 0, y: 12 }, { x: 1, y: 9 }, { x: 2, y: 9 }, { x: 3, y: 9 }, 
      { x: 3, y: 12 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 11 },
      // Ship 3
      { x: 0, y: 19 }, { x: 0, y: 21 }, { x: 1, y: 18 }, { x: 2, y: 18 }, { x: 3, y: 18 }, 
      { x: 3, y: 21 }, { x: 4, y: 18 }, { x: 4, y: 19 }, { x: 4, y: 20 }
    ]
  },
  {
    id: 'supernova',
    name: 'SUPERNOVA',
    description: 'Chaos generator.',
    cost: 10,
    isUltimate: true,
    coords: [
      { x: 10, y: 0 }, { x: 12, y: 1 }, { x: 9, y: 2 }, { x: 10, y: 2 }, { x: 13, y: 2 }, 
      { x: 14, y: 2 }, { x: 15, y: 2 },
      { x: 0, y: 10 }, { x: 2, y: 11 }, { x: -1, y: 12 }, { x: 0, y: 12 }, { x: 3, y: 12 }, 
      { x: 4, y: 12 }, { x: 5, y: 12 },
      { x: 20, y: 10 }, { x: 22, y: 11 }, { x: 19, y: 12 }, { x: 20, y: 12 }, { x: 23, y: 12 }, 
      { x: 24, y: 12 }, { x: 25, y: 12 },
      { x: 12, y: 6 }, { x: 13, y: 6 }, { x: 11, y: 7 }, { x: 12, y: 7 }, { x: 12, y: 8 }
    ]
  }
];