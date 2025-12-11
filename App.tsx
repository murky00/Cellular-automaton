import React, { useState } from 'react';
import GameCanvas from './components/GameCanvas';
import Armory from './components/Armory';
import { Team, GameStats } from './types';
import { WEAPONS } from './constants';

const App: React.FC = () => {
  const [speed, setSpeed] = useState<number>(1);
  const [resetSignal, setResetSignal] = useState<number>(0);
  const [stats, setStats] = useState<GameStats>({ generation: 0, redCells: 0, blueCells: 0, fps: 0 });
  
  const [selectedRed, setSelectedRed] = useState<string>(WEAPONS[0].id);
  const [selectedBlue, setSelectedBlue] = useState<string>(WEAPONS[0].id);

  // Calculate territory percentage
  const totalCells = stats.redCells + stats.blueCells;
  const redPct = totalCells > 0 ? (stats.redCells / totalCells) * 100 : 50;
  const bluePct = 100 - redPct;

  return (
    <div className="flex flex-col h-screen w-full bg-neutral-950 text-gray-200 font-sans selection:bg-red-500/30">
      
      {/* HEADER HUD */}
      <header className="flex-none bg-neutral-900 border-b border-gray-800 p-4 shadow-lg z-10">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          
          {/* Title and Controls Row */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
               <h1 className="text-2xl font-black tracking-tighter text-white bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-blue-500">
                  CELLULAR WARFARE
               </h1>
               <div className="h-6 w-px bg-gray-700 mx-2"></div>
               <div className="flex gap-1 bg-black p-1 rounded border border-gray-800">
                  {[0, 0.2, 1, 2, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      className={`
                        px-3 py-1 text-xs font-bold rounded transition-colors
                        ${speed === s ? 'bg-gray-200 text-black' : 'text-gray-500 hover:text-white hover:bg-gray-800'}
                      `}
                    >
                      {s === 0 ? 'PAUSE' : `${s}x`}
                    </button>
                  ))}
               </div>
            </div>

            <div className="flex items-center gap-6 text-xs font-mono">
               <div className="flex flex-col items-end">
                 <span className="text-gray-500">GENERATION</span>
                 <span className="text-xl text-white">{stats.generation.toLocaleString()}</span>
               </div>
               <div className="flex flex-col items-end w-16">
                 <span className="text-gray-500">FPS</span>
                 <span className="text-xl text-green-500">{stats.fps}</span>
               </div>
               
               <button 
                onClick={() => setResetSignal(s => s + 1)}
                className="px-4 py-2 bg-red-900/20 text-red-500 border border-red-900/50 hover:bg-red-900/50 hover:text-red-200 rounded text-xs font-bold tracking-widest transition-all"
               >
                 NUKE GRID
               </button>
            </div>
          </div>

          {/* Territory Bar */}
          <div className="relative w-full h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
             <div 
               className="absolute top-0 bottom-0 left-0 bg-red-600 transition-all duration-500 ease-out"
               style={{ width: `${redPct}%` }}
             />
             <div 
               className="absolute top-0 bottom-0 right-0 bg-blue-600 transition-all duration-500 ease-out"
               style={{ width: `${bluePct}%` }}
             />
             
             {/* Center Marker */}
             <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white z-10 transform -translate-x-1/2 opacity-50"></div>
          </div>
          
          <div className="flex justify-between text-[10px] font-bold tracking-widest opacity-60">
             <span className="text-red-500">RED DOMINANCE: {Math.round(redPct)}%</span>
             <span className="text-blue-500">BLUE DOMINANCE: {Math.round(bluePct)}%</span>
          </div>

        </div>
      </header>

      {/* MAIN STAGE */}
      <main className="flex-1 overflow-hidden relative flex justify-center items-start pt-8 pb-4 gap-8">
        
        {/* Red Armory */}
        <div className="flex-none z-10">
          <Armory 
            team={Team.Red} 
            selectedId={selectedRed} 
            onSelect={setSelectedRed} 
          />
        </div>

        {/* Viewport */}
        <div className="flex-none shadow-2xl relative group">
           <GameCanvas 
             selectedToolRed={selectedRed}
             selectedToolBlue={selectedBlue}
             speed={speed}
             onStatsUpdate={setStats}
             resetSignal={resetSignal}
           />
           
           {/* Hint Overlay */}
           <div className="absolute -bottom-8 left-0 right-0 text-center text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
              Drag on left/right zones to spawn units • Patterns inherit team color
           </div>
        </div>

        {/* Blue Armory */}
        <div className="flex-none z-10">
          <Armory 
            team={Team.Blue} 
            selectedId={selectedBlue} 
            onSelect={setSelectedBlue} 
          />
        </div>
      </main>
    </div>
  );
};

export default App;
