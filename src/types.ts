export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameMode = 'normal' | 'tournament' | 'elimination';

export interface SubCategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: SubCategory[];
}

export interface Item {
  id: string;
  name: string;
  categoryId: string;
  subcategoryId: string;
  difficulty: Difficulty;
  image: string;
  fallbackImage?: string;
  keywords: string[];
}

export interface Player {
  id: 0 | 1;
  name: string;
  score: number;
}

export interface GameSettings {
  mode: GameMode;
  targetScore: number; // rounds to play (normal) or wins needed (tournament)
  
  // For tournament varied categories
  tournamentCategoryMode?: 'single' | 'multiple';
  selectedCategories?: string[]; 
  
  // For single category
  categoryId?: string | 'random';
  subcategoryId?: string | 'all';
  
  difficulty: Difficulty | 'all';
}

export interface GameState {
  status: 'home' | 'setup' | 'playing' | 'game_over' | 'how_to_play' | 'settings' | 'setup_elimination' | 'elimination_game' | 'encyclopedia';
  players: Player[];
  settings: GameSettings;
  roundNumber: number;
  playedItemIds: string[];
  winner: Player | null;
}
