import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  { 
    id: 1, 
    title: 'Neon Dreams', 
    artist: 'AI Synthwave', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '6:12'
  },
  { 
    id: 2, 
    title: 'Cybernetic Pulse', 
    artist: 'Neural Network', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '7:05'
  },
  { 
    id: 3, 
    title: 'Digital Horizon', 
    artist: 'Algorithm 09', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '5:44'
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => {
        console.error("Audio playback failed:", e);
        setIsPlaying(false);
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    handleNext();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setProgress(value);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (value / 100) * audioRef.current.duration;
    }
  };

  return (
    <div className="w-full max-w-md bg-black border-4 border-fuchsia-500 p-6 relative screen-tear">
      <div className="absolute bottom-0 right-0 w-full h-1 bg-cyan-500 animate-pulse" />
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />
      
      <div className="flex items-center gap-4 mb-6 border-b-2 border-cyan-500 pb-4">
        <div className="w-16 h-16 bg-black border-2 border-cyan-500 flex items-center justify-center relative overflow-hidden">
          <Music className={`text-fuchsia-500 relative z-10 ${isPlaying ? 'animate-ping' : ''}`} size={28} />
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-80">
              <div className="w-1 h-8 bg-cyan-500 animate-[bounce_0.5s_infinite_0.1s]"></div>
              <div className="w-1 h-12 bg-fuchsia-500 animate-[bounce_0.5s_infinite_0.3s]"></div>
              <div className="w-1 h-6 bg-cyan-500 animate-[bounce_0.5s_infinite_0.2s]"></div>
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-hidden">
          <h3 className="text-cyan-400 font-pixel text-xs truncate uppercase mb-2">
            &gt; {currentTrack.title}
          </h3>
          <p className="text-fuchsia-500 text-lg font-terminal truncate uppercase">
            SRC: {currentTrack.artist}
          </p>
        </div>
        
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="text-cyan-500 hover:text-fuchsia-500 hover:bg-cyan-500/20 border-2 border-transparent hover:border-cyan-500 p-2"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      <div className="mb-6 group">
        <div className="text-cyan-500 font-terminal text-lg mb-2 flex justify-between">
          <span>&gt; DECODING_STREAM</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={progress || 0}
          onChange={handleSeek}
          className="w-full h-4 bg-black border-2 border-cyan-500 appearance-none cursor-pointer accent-fuchsia-500"
          style={{
            background: `linear-gradient(to right, #f0f ${progress}%, #000 ${progress}%)`
          }}
        />
      </div>

      <div className="flex items-center justify-center gap-6">
        <button 
          onClick={handlePrev}
          className="text-cyan-500 border-2 border-cyan-500 p-2 hover:bg-cyan-500 hover:text-black active:scale-90"
        >
          <SkipBack size={24} fill="currentColor" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-16 h-16 flex items-center justify-center bg-black border-4 border-fuchsia-500 text-fuchsia-500 hover:bg-fuchsia-500 hover:text-black active:scale-90"
        >
          {isPlaying ? (
            <Pause size={28} fill="currentColor" />
          ) : (
            <Play size={28} fill="currentColor" className="ml-1" />
          )}
        </button>
        
        <button 
          onClick={handleNext}
          className="text-cyan-500 border-2 border-cyan-500 p-2 hover:bg-cyan-500 hover:text-black active:scale-90"
        >
          <SkipForward size={24} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}
