import { useTheme } from './hooks/useTheme';
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { GameState, GameSettings, Player, Item, Difficulty } from './types';
import { HomeScreen } from './screens/HomeScreen';
import { SetupScreen } from './screens/SetupScreen';
import { GameScreen } from './screens/GameScreen';
import { ResultScreen } from './screens/ResultScreen';
import { HowToPlayScreen } from './screens/HowToPlayScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { EncyclopediaScreen } from './screens/EncyclopediaScreen';
import { EliminationSetupScreen } from './screens/EliminationSetupScreen';
import { EliminationGameScreen } from './screens/EliminationGameScreen';
import { items as rawItems } from './data/items';
import { getValidItems, validateDatabase } from './utils/validator';

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    status: 'home',
    players: [],
    settings: { mode: 'normal', categoryId: 'random', difficulty: 'all', targetScore: 3 },
    roundNumber: 1,
    playedItemIds: [],
    winner: null
  });

  const [currentSecretItem1, setCurrentSecretItem1] = useState<Item | null>(null);
  const [currentSecretItem2, setCurrentSecretItem2] = useState<Item | null>(null);
  
  const [validItems, setValidItems] = useState<Item[]>([]);
  const { theme } = useTheme();
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const [eliminationItems, setEliminationItems] = useState<Item[]>([]);

  useEffect(() => {
    setValidItems(rawItems);
    setIsInitializing(false);
  }, []);

  const navigate = (status: GameState['status'], mode?: 'normal' | 'tournament' | 'elimination') => {
    setGameState(prev => ({
      ...prev,
      status,
      settings: mode ? { ...prev.settings, mode } : prev.settings
    }));
  };

  const getTwoRandomItems = (settings: GameSettings, playedIds: string[]): [Item, Item] => {
    let pool = validItems;

    // First filter by category
    if (settings.categoryId && settings.categoryId !== 'random') {
      pool = pool.filter(i => i.categoryId === settings.categoryId);
      if (settings.subcategoryId && settings.subcategoryId !== 'all') {
        const subPool = pool.filter(i => i.subcategoryId === settings.subcategoryId);
        if (subPool.length >= 2) pool = subPool;
      }
    } else if (settings.selectedCategories && settings.selectedCategories.length > 0) {
      pool = pool.filter(i => settings.selectedCategories!.includes(i.categoryId));
    }

    // Then filter by difficulty if possible
    if (settings.difficulty !== 'all') {
      const diffPool = pool.filter(i => i.difficulty === settings.difficulty);
      // Only apply difficulty filter if it leaves us with at least 2 items
      if (diffPool.length >= 2) {
        pool = diffPool;
      }
    }
    
    // Filter out played items if possible
    let available = pool.filter(i => !playedIds.includes(i.id));
    if (available.length < 2) {
      // If exhausted, reuse pool (reset played items for this category)
      available = pool;
    }
    
    // Extreme fallback if still < 2 items (e.g. database error)
    if (available.length < 2) {
      return [validItems[0] || rawItems[0], validItems[1] || rawItems[1]];
    }
    
    // Pick two different random items
    const idx1 = Math.floor(Math.random() * available.length);
    let idx2 = Math.floor(Math.random() * available.length);
    while (idx1 === idx2) {
      idx2 = Math.floor(Math.random() * available.length);
    }

    return [available[idx1], available[idx2]];
  };

  const handleStartGame = (players: Player[], settings: GameSettings) => {
    const [item1, item2] = getTwoRandomItems(settings, []);
    setCurrentSecretItem1(item1);
    setCurrentSecretItem2(item2);
    
    setGameState({
      status: 'playing',
      players,
      settings,
      roundNumber: 1,
      playedItemIds: [item1.id, item2.id],
      winner: null
    });
  };

  
  const handleStartElimination = (players: Player[], categoryId: string, subcategoryId: string) => {
    let pool = validItems.filter(i => i.categoryId === categoryId);
    if (subcategoryId && subcategoryId !== 'all') {
      pool = pool.filter(i => i.subcategoryId === subcategoryId);
    }
    // Remove duplicates by name to ensure clean list
    pool = pool.filter((v,i,a)=>a.findIndex(t=>(t.name === v.name))===i);
    // Shuffle and pick up to 30
    pool = [...pool].sort(() => Math.random() - 0.5).slice(0, 30);
    
    setEliminationItems(pool);
    setGameState({
      status: 'elimination_game',
      players,
      settings: { mode: 'elimination', categoryId, subcategoryId, difficulty: 'all', targetScore: 1 },
      roundNumber: 1,
      playedItemIds: [],
      winner: null
    });
  };
  
  const handleRoundComplete = (winnerId: number | null) => {
    let newPlayers = [...gameState.players];
    if (winnerId !== null) {
      newPlayers[winnerId].score += 1;
    }

    // Check win conditions
    const target = gameState.settings.targetScore;
    let isGameOver = false;

    if (gameState.settings.mode === 'tournament') {
      if (newPlayers[0].score >= target || newPlayers[1].score >= target) {
        isGameOver = true;
      }
    } else {
      // Normal mode: end after target number of rounds
      if (gameState.roundNumber >= target) {
        isGameOver = true;
      }
    }

    if (isGameOver) {
      setGameState(prev => ({ ...prev, players: newPlayers, status: 'game_over' }));
      return;
    }

    // Next round
    const nextRound = gameState.roundNumber + 1;
    const [item1, item2] = getTwoRandomItems(gameState.settings, gameState.playedItemIds);
    
    setCurrentSecretItem1(item1);
    setCurrentSecretItem2(item2);
    
    setGameState(prev => ({
      ...prev,
      players: newPlayers,
      roundNumber: nextRound,
      playedItemIds: [...prev.playedItemIds, item1.id, item2.id]
    }));
  };

  return (
    <div className="w-full min-h-screen bg-base overflow-hidden font-sans text-content" dir="rtl">
      {initError && (
        <div className="fixed top-4 left-4 right-4 bg-rose-500 text-white p-4 rounded-2xl shadow-xl z-50 font-bold text-center flex items-center justify-center gap-2">
          <span>⚠️</span>
          {initError}
          <button onClick={() => setInitError(null)} className="mr-auto bg-surface/20 hover:bg-surface/30 rounded-full w-8 h-8 flex items-center justify-center">✕</button>
        </div>
      )}
      {isInitializing ? (
        <div className="w-full min-h-screen flex flex-col items-center justify-center bg-indigo-600 text-white">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4" />
          <h2 className="text-2xl font-bold">جاري تحميل اللعبة...</h2>
          <p className="text-indigo-200 mt-2">نستعد لتجربة ممتعة</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {gameState.status === 'home' && (
            <HomeScreen key="home" onNavigate={navigate} />
          )}
          
          {gameState.status === 'setup' && (
            <SetupScreen 
              key="setup" 
              mode={gameState.settings.mode} 
              onStart={handleStartGame} 
              onBack={() => navigate('home')} 
            />
          )}
          
          {gameState.status === 'playing' && currentSecretItem1 && currentSecretItem2 && (
            <GameScreen 
              key={`game-${gameState.roundNumber}`}
              player1={gameState.players[0]}
              player2={gameState.players[1]}
              item1={currentSecretItem1}
              item2={currentSecretItem2}
              settings={gameState.settings}
              onRoundComplete={handleRoundComplete}
              onQuit={() => navigate('home')}
            />
          )}

          
          {gameState.status === 'setup_elimination' && (
            <EliminationSetupScreen 
              key="setup_elimination"
              onStart={handleStartElimination}
              onBack={() => navigate('home')}
            />
          )}

          {gameState.status === 'elimination_game' && (
            <EliminationGameScreen 
              key="elimination_game"
              players={gameState.players}
              items={eliminationItems}
              onFinish={(winnerId) => {
                let newPlayers = [...gameState.players];
                newPlayers[winnerId].score += 1;
                setGameState(prev => ({ ...prev, players: newPlayers, status: 'game_over' }));
              }}
              onQuit={() => navigate('home')}
            />
          )}
  
          {gameState.status === 'game_over' && (
            <ResultScreen 
              key="result"
              players={gameState.players}
              settings={gameState.settings}
              onNewGame={() => gameState.settings.mode === 'elimination' ? navigate('setup_elimination') : navigate('setup', gameState.settings.mode)}
              onHome={() => navigate('home')}
            />
          )}

          {gameState.status === 'how_to_play' && (
            <HowToPlayScreen key="how_to_play" onBack={() => navigate('home')} />
          )}


          {gameState.status === 'encyclopedia' && (
            <EncyclopediaScreen key="encyclopedia" onBack={() => navigate('home')} />
          )}

          {gameState.status === 'settings' && (
            <SettingsScreen key="settings" onBack={() => navigate('home')} />
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
