import React from 'react';
import { PlayCircle, Shuffle, X } from 'lucide-react';

const ExerciseControls = ({ onStartRandom, onClearSelection, onStartExercise }) => {
  return (
    <div className="flex space-x-2 mb-4">
      <button onClick={onStartRandom} className="bg-transparent border border-gray-500 text-black text-xs px-3 font-semibold py-1 rounded hover:bg-gray-600 hover:text-white transition flex items-center">
        <Shuffle className="w-4 mr-2" /> Random
      </button>
      <button onClick={onClearSelection} className="bg-transparent border border-gray-500 text-black text-xs px-3 font-semibold py-1 rounded hover:bg-gray-600 hover:text-white transition flex items-center">
        <X className="w-4 mr-2" /> Clear Selection
      </button>
      <button onClick={onStartExercise} className="bg-transparent border border-gray-500 text-black text-xs px-3 font-semibold py-1 rounded hover:bg-gray-600 hover:text-white transition flex items-center">
        <PlayCircle className="w-4 mr-2" /> Start Exercise
      </button>
    </div>
  );
};

export default ExerciseControls;