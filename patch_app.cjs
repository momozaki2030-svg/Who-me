const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Imports
if (!content.includes('EliminationSetupScreen')) {
  content = content.replace(
    "import { SettingsScreen } from './screens/SettingsScreen';",
    "import { SettingsScreen } from './screens/SettingsScreen';\nimport { EliminationSetupScreen } from './screens/EliminationSetupScreen';\nimport { EliminationGameScreen } from './screens/EliminationGameScreen';"
  );
}

// State
if (!content.includes('eliminationItems')) {
  content = content.replace(
    "const [initError, setInitError] = useState<string | null>(null);",
    "const [initError, setInitError] = useState<string | null>(null);\n  const [eliminationItems, setEliminationItems] = useState<Item[]>([]);"
  );
}

// Handlers
if (!content.includes('handleStartElimination')) {
  const handler = `
  const handleStartElimination = (players: Player[], categoryId: string) => {
    let pool = validItems.filter(i => i.categoryId === categoryId);
    // Shuffle and pick up to 30
    pool = [...pool].sort(() => Math.random() - 0.5).slice(0, 30);
    
    setEliminationItems(pool);
    setGameState({
      status: 'elimination_game',
      players,
      settings: { mode: 'normal', categoryId, difficulty: 'all', targetScore: 1 },
      roundNumber: 1,
      playedItemIds: [],
      winner: null
    });
  };
  `;
  content = content.replace("const handleRoundComplete", handler + "\n  const handleRoundComplete");
}

// Render screens
if (!content.includes('setup_elimination')) {
  const cases = `
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
  `;
  content = content.replace("{gameState.status === 'game_over' && (", cases + "\n          {gameState.status === 'game_over' && (");
}

fs.writeFileSync('src/App.tsx', content, 'utf-8');
console.log("Patched App.tsx");
