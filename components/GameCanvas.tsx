import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  GRID_WIDTH, 
  GRID_HEIGHT, 
  CELL_SIZE, 
  COLOR_RED, 
  COLOR_BLUE, 
  COLOR_BG,
  SPAWN_ZONE_WIDTH,
  WEAPONS 
} from '../constants';
import { Team, Pattern, GameStats } from '../types';

interface GameCanvasProps {
  selectedToolRed: string | null;
  selectedToolBlue: string | null;
  speed: number;
  onStatsUpdate: (stats: GameStats) => void;
  resetSignal: number; // increment to trigger reset
}

const GameCanvas: React.FC<GameCanvasProps> = ({ 
  selectedToolRed, 
  selectedToolBlue, 
  speed, 
  onStatsUpdate,
  resetSignal 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<Uint8Array>(new Uint8Array(GRID_WIDTH * GRID_HEIGHT));
  const bufferRef = useRef<Uint8Array>(new Uint8Array(GRID_WIDTH * GRID_HEIGHT));
  const requestRef = useRef<number>(0);
  const generationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const lastDrawPosRef = useRef<{x: number, y: number} | null>(null);
  
  // Track mouse state for dragging
  const isMouseDownRef = useRef<boolean>(false);

  // Helper: Get grid index
  const idx = (x: number, y: number) => y * GRID_WIDTH + x;

  // Initialize/Reset Grid
  const resetGrid = useCallback(() => {
    gridRef.current.fill(0);
    generationRef.current = 0;
    
    // Draw initial state
    draw();
  }, []);

  useEffect(() => {
    resetGrid();
  }, [resetSignal, resetGrid]);

  // Simulation Step
  const step = () => {
    const grid = gridRef.current;
    const next = bufferRef.current;
    let redCount = 0;
    let blueCount = 0;

    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const i = idx(x, y);
        const self = grid[i];
        
        // Count neighbors
        let neighbors = 0;
        let redNeighbors = 0;
        let blueNeighbors = 0;

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            
            // Wrap Y, Clamp X (Cylinder topology often works best for side-vs-side)
            // But user used simple wrap Y before.
            const ny = (y + dy + GRID_HEIGHT) % GRID_HEIGHT;
            const nx = x + dx;

            if (nx >= 0 && nx < GRID_WIDTH) {
              const val = grid[idx(nx, ny)];
              if (val > 0) {
                neighbors++;
                if (val === Team.Red) redNeighbors++;
                else if (val === Team.Blue) blueNeighbors++;
              }
            }
          }
        }

        // Apply Rules
        let newVal = 0;
        if (self > 0) {
          // Survival
          if (neighbors === 2 || neighbors === 3) newVal = self;
          else newVal = 0; // Under/Over population
        } else {
          // Birth
          if (neighbors === 3) {
            // Immigration rule: Majority parent determines color
            newVal = redNeighbors > blueNeighbors ? Team.Red : Team.Blue;
          }
        }

        // Base Integrity Protection (Spawn Zones)
        // Red Spawn (Left) - Cleans Blue
        if (x < SPAWN_ZONE_WIDTH && newVal === Team.Blue) newVal = Team.Red;
        // Blue Spawn (Right) - Cleans Red
        else if (x >= GRID_WIDTH - SPAWN_ZONE_WIDTH && newVal === Team.Red) newVal = Team.Blue;

        next[i] = newVal;
        if (newVal === Team.Red) redCount++;
        else if (newVal === Team.Blue) blueCount++;
      }
    }

    // Swap buffers
    const temp = gridRef.current;
    gridRef.current = bufferRef.current;
    bufferRef.current = temp;
    
    generationRef.current++;
    
    return { redCount, blueCount };
  };

  // Render Loop
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Clear background
    ctx.fillStyle = COLOR_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Spawn Zones (Subtle background)
    ctx.fillStyle = '#1a0505'; // Very dark red
    ctx.fillRect(0, 0, SPAWN_ZONE_WIDTH * CELL_SIZE, canvas.height);
    
    ctx.fillStyle = '#050a1a'; // Very dark blue
    ctx.fillRect((GRID_WIDTH - SPAWN_ZONE_WIDTH) * CELL_SIZE, 0, SPAWN_ZONE_WIDTH * CELL_SIZE, canvas.height);

    // Draw Grid (Optional, maybe too noisy for large grid, let's skip or make very faint)
    // Draw Divider
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(SPAWN_ZONE_WIDTH * CELL_SIZE, 0);
    ctx.lineTo(SPAWN_ZONE_WIDTH * CELL_SIZE, canvas.height);
    ctx.moveTo((GRID_WIDTH - SPAWN_ZONE_WIDTH) * CELL_SIZE, 0);
    ctx.lineTo((GRID_WIDTH - SPAWN_ZONE_WIDTH) * CELL_SIZE, canvas.height);
    ctx.stroke();

    const grid = gridRef.current;
    
    // Batch rendering by color to minimize state changes
    ctx.beginPath();
    ctx.fillStyle = COLOR_RED;
    for (let i = 0; i < grid.length; i++) {
        if (grid[i] === Team.Red) {
            const x = (i % GRID_WIDTH) * CELL_SIZE;
            const y = Math.floor(i / GRID_WIDTH) * CELL_SIZE;
            ctx.rect(x, y, CELL_SIZE - 1, CELL_SIZE - 1);
        }
    }
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = COLOR_BLUE;
    for (let i = 0; i < grid.length; i++) {
        if (grid[i] === Team.Blue) {
            const x = (i % GRID_WIDTH) * CELL_SIZE;
            const y = Math.floor(i / GRID_WIDTH) * CELL_SIZE;
            ctx.rect(x, y, CELL_SIZE - 1, CELL_SIZE - 1);
        }
    }
    ctx.fill();
  };

  // Main Loop
  const loop = (time: number) => {
    if (speed > 0) {
        const delta = time - lastTimeRef.current;
        const interval = 1000 / (60 * speed); // 60 FPS base * multiplier

        if (delta >= interval) {
            // If speed is very high (e.g. 5x), we might want to step multiple times per frame
            // to keep visual smooth but logic fast
            const steps = speed > 2 ? 2 : 1;
            let stats = { redCount: 0, blueCount: 0 };
            
            for(let i=0; i<steps; i++) {
                stats = step();
            }

            // Update stats every 10 frames to save React renders
            if (generationRef.current % 10 === 0) {
                onStatsUpdate({
                    generation: generationRef.current,
                    redCells: stats.redCount,
                    blueCells: stats.blueCount,
                    fps: Math.round(1000 / delta)
                });
            }
            lastTimeRef.current = time;
            draw();
        }
    } else {
        // Even when paused, we might want to redraw if we painted
        draw();
        lastTimeRef.current = time;
    }
    
    requestRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed]); 

  // Interaction Handlers
  const placePattern = (gridX: number, gridY: number, team: Team, patternId: string) => {
    const pattern = WEAPONS.find(w => w.id === patternId);
    if (!pattern) return;

    const grid = gridRef.current;
    
    // Determine orientation based on team
    // Red moves Right (Default), Blue moves Left (Mirror X)
    const directionX = team === Team.Red ? 1 : -1;
    
    pattern.coords.forEach(coord => {
        // Red uses standard coords, Blue mirrors them
        const px = coord.x * directionX;
        const py = coord.y;
        
        // Offset centering (approximate)
        const offsetX = team === Team.Red ? -2 : 2;

        const x = gridX + px + offsetX;
        const y = (gridY + py + GRID_HEIGHT) % GRID_HEIGHT; // Wrap Y

        if (x >= 0 && x < GRID_WIDTH) {
            grid[idx(x, y)] = team;
        }
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isMouseDownRef.current = true;
    handlePointerMove(e);
  };

  const handlePointerUp = () => {
    isMouseDownRef.current = false;
    lastDrawPosRef.current = null;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isMouseDownRef.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);

    // Debounce distance to prevent stacking patterns too densely
    if (lastDrawPosRef.current) {
        const dx = Math.abs(x - lastDrawPosRef.current.x);
        const dy = Math.abs(y - lastDrawPosRef.current.y);
        if (dx + dy < 4) return; // Must move at least a bit
    }

    let activeTeam = Team.None;
    let activeTool = null;

    if (x < SPAWN_ZONE_WIDTH) {
        activeTeam = Team.Red;
        activeTool = selectedToolRed;
    } else if (x >= GRID_WIDTH - SPAWN_ZONE_WIDTH) {
        activeTeam = Team.Blue;
        activeTool = selectedToolBlue;
    }

    if (activeTeam !== Team.None && activeTool) {
        placePattern(x, y, activeTeam, activeTool);
        lastDrawPosRef.current = { x, y };
        // Immediate draw for feedback
        draw(); 
    }
  };

  return (
    <div className="relative border-2 border-gray-800 rounded-sm shadow-2xl shadow-black overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        width={GRID_WIDTH * CELL_SIZE}
        height={GRID_HEIGHT * CELL_SIZE}
        className="block touch-none cursor-crosshair"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerMove={handlePointerMove}
      />
      {/* Overlay Guidelines */}
      <div 
        className="absolute top-0 bottom-0 pointer-events-none border-r border-dashed border-red-900/30"
        style={{ width: SPAWN_ZONE_WIDTH * CELL_SIZE, left: 0 }}
      />
      <div 
        className="absolute top-0 bottom-0 right-0 pointer-events-none border-l border-dashed border-blue-900/30"
        style={{ width: SPAWN_ZONE_WIDTH * CELL_SIZE }}
      />
    </div>
  );
};

export default GameCanvas;
