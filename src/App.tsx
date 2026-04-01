import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white font-terminal overflow-hidden relative flex flex-col items-center justify-center p-4 static-noise">
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-50" />

      <header className="relative z-10 mb-8 text-center screen-tear">
        <h1 
          className="text-4xl md:text-6xl font-pixel text-cyan-400 glitch-text uppercase tracking-tighter" 
          data-text="SYS.EXEC(SNAKE)"
        >
          SYS.EXEC(SNAKE)
        </h1>
        <p className="text-fuchsia-500 font-terminal text-xl tracking-widest mt-4 uppercase border-b-2 border-fuchsia-500 inline-block">
          &gt; NEURAL_LINK_ESTABLISHED_
        </p>
      </header>

      <main className="relative z-10 flex flex-col xl:flex-row items-center justify-center gap-8 w-full max-w-6xl">
        <div className="flex-1 flex justify-center w-full">
          <SnakeGame />
        </div>
        
        <div className="xl:w-96 w-full flex justify-center xl:justify-start">
          <MusicPlayer />
        </div>
      </main>
    </div>
  );
}
