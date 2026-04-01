import React, { useState, useEffect, useCallback } from 'react';
import { useInterval } from '../hooks/useInterval';
import { Trophy, RotateCcw, Play } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line no-loop-func
    if (!snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
      break;
    }
  }
  return newFood;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && gameOver) {
        resetGame();
        return;
      }

      if (e.key === ' ' && !gameOver) {
        setIsPaused((p) => !p);
        return;
      }

      if (isPaused || gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isPaused, gameOver]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
    setFood(generateFood(INITIAL_SNAKE));
  };

  const gameLoop = useCallback(() => {
    if (isPaused || gameOver) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y,
      };

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        handleGameOver();
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        handleGameOver();
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
        // Increase speed slightly
        setSpeed((s) => Math.max(50, s - 2));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused]);

  const handleGameOver = () => {
    setGameOver(true);
    setIsPaused(true);
    if (score > highScore) {
      setHighScore(score);
    }
  };

  useInterval(gameLoop, isPaused || gameOver ? null : speed);

  // Initialize food on mount
  useEffect(() => {
    setFood(generateFood(INITIAL_SNAKE));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-900/50 rounded-2xl border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] backdrop-blur-sm">
      <div className="flex justify-between w-full max-w-[400px] mb-6 px-2">
        <div className="flex flex-col">
          <span className="text-cyan-500 text-xs uppercase tracking-widest font-mono mb-1">Score</span>
          <span 
            className="text-5xl font-black text-white font-digital glitch-text drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
            data-text={score.toString().padStart(4, '0')}
          >
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-fuchsia-500 text-xs uppercase tracking-widest font-mono mb-1 flex items-center gap-1">
            <Trophy size={12} /> High Score
          </span>
          <span 
            className="text-5xl font-black text-white font-digital glitch-text drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
            data-text={highScore.toString().padStart(4, '0')}
          >
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      <div className="relative group">
        <div 
          className="grid bg-black/80 border-2 border-cyan-500/50 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(80vw, 400px)',
            height: 'min(80vw, 400px)',
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={i}
                className={`
                  ${isHead ? 'bg-cyan-300 shadow-[0_0_10px_#67e8f9] z-10 rounded-sm' : ''}
                  ${isSnake && !isHead ? 'bg-cyan-500/80 shadow-[0_0_5px_#06b6d4] rounded-sm scale-90' : ''}
                  ${isFood ? 'bg-fuchsia-500 shadow-[0_0_12px_#d946ef] rounded-full scale-75 animate-pulse' : ''}
                  ${!isSnake && !isFood ? 'border-[0.5px] border-cyan-900/20' : ''}
                `}
              />
            );
          })}
        </div>

        {/* Overlays */}
        {(gameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg border border-cyan-500/30">
            {gameOver ? (
              <>
                <h2 className="text-4xl font-black text-fuchsia-500 mb-2 tracking-wider drop-shadow-[0_0_10px_rgba(217,70,239,0.8)]">GAME OVER</h2>
                <p className="text-cyan-300 mb-6 font-mono">Final Score: {score}</p>
                <button
                  onClick={resetGame}
                  className="flex items-center gap-2 px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500 rounded-full transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:scale-105 active:scale-95"
                >
                  <RotateCcw size={18} /> Play Again
                </button>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-black text-cyan-400 mb-6 tracking-widest drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">PAUSED</h2>
                <button
                  onClick={() => setIsPaused(false)}
                  className="flex items-center gap-2 px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-all shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:shadow-[0_0_25px_rgba(34,211,238,0.8)] hover:scale-105 active:scale-95"
                >
                  <Play size={20} fill="currentColor" /> Resume
                </button>
              </>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-6 text-cyan-600/60 text-sm font-mono flex gap-4">
        <span>[W A S D] or Arrows to move</span>
        <span>[SPACE] to pause</span>
      </div>
    </div>
  );
}
