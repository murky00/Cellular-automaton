import React from 'react';
import { WEAPONS } from '../constants';
import { Team } from '../types';

interface ArmoryProps {
  team: Team;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const Armory: React.FC<ArmoryProps> = ({ team, selectedId, onSelect }) => {
  const isRed = team === Team.Red;
  const borderColor = isRed ? 'border-red-600' : 'border-blue-600';
  const bgColor = isRed ? 'bg-red-950/20' : 'bg-blue-950/20';
  const activeBg = isRed ? 'bg-red-900' : 'bg-blue-900';
  const activeBorder = isRed ? 'border-red-400' : 'border-blue-400';
  
  return (
    <div className={`flex flex-col w-64 ${bgColor} border-t-4 ${borderColor} bg-opacity-30 p-4 gap-3 h-[600px] overflow-y-auto backdrop-blur-sm rounded-b-lg`}>
      <div className="text-center mb-2">
        <h2 className={`text-xl font-black tracking-widest ${isRed ? 'text-red-500' : 'text-blue-500'}`}>
          {isRed ? 'RED FLEET' : 'BLUE FLEET'}
        </h2>
        <p className="text-xs text-gray-500 uppercase tracking-widest">
          {isRed ? 'Horizontal Assault' : 'Counter-Offensive'}
        </p>
      </div>

      {WEAPONS.map((wpn) => {
        const isActive = selectedId === wpn.id;
        const isUltimate = wpn.isUltimate;

        let btnClass = `
            relative group flex flex-col p-3 border border-gray-800 rounded transition-all duration-200
            hover:border-opacity-100 hover:shadow-lg text-left
        `;
        
        if (isActive) {
            btnClass += ` ${activeBg} ${activeBorder} border-l-4 shadow-md text-white`;
        } else {
            btnClass += ` bg-gray-900/80 border-l-4 border-l-gray-700 text-gray-400 hover:bg-gray-800 hover:text-gray-200 hover:border-l-gray-500`;
        }

        if (isUltimate) {
            btnClass += ` mt-4 border-red-900/50 bg-gradient-to-r from-black to-red-950/30`;
        }

        return (
          <button
            key={wpn.id}
            onClick={() => onSelect(wpn.id)}
            className={btnClass}
          >
             <div className="flex justify-between items-center w-full">
                <span className={`font-bold text-sm ${isUltimate ? 'text-red-500 animate-pulse' : ''}`}>
                    {wpn.name}
                </span>
                <span className="text-[10px] font-mono opacity-50 border border-gray-700 px-1 rounded">
                    ${wpn.cost}k
                </span>
             </div>
             <span className="text-[10px] mt-1 opacity-70 leading-tight">
                {wpn.description}
             </span>
             
             {/* Hover Effect Line */}
             <div className={`absolute bottom-0 left-0 h-[1px] bg-white transition-all duration-300 w-0 group-hover:w-full ${isActive ? 'w-full opacity-50' : 'opacity-20'}`}></div>
          </button>
        );
      })}
      
      <div className="mt-auto p-3 bg-black/40 rounded border border-gray-800 text-[10px] text-gray-500">
        <strong className="block mb-1 text-gray-400">Tactical Tip:</strong>
        {isRed ? "Drag down to paint walls of ships." : "Place interceptors to break formations."}
      </div>
    </div>
  );
};

export default Armory;
