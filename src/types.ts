export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  timeLimit: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  questions: Question[];
  createdAt: string;
}

export interface Player {
  id: string;
  nickname: string;
  avatar: string;
  score: number;
  streak: number;
  lastAnswerCorrect: boolean | null;
  lastPointsEarned: number;
  answeredThisQuestion: boolean;
  isBot: boolean;
}

export type GameState = 'lobby' | 'get_ready' | 'question' | 'reveal' | 'scoreboard' | 'podium';

export interface GameSession {
  pin: string;
  quizId: string;
  quizTitle: string;
  questions: Question[];
  currentQuestionIndex: number;
  state: GameState;
  timer: number;
  players: { [id: string]: Player };
  answersCount: number;
  totalQuestions: number;
  questionStartTime: number;
  hasBots: boolean;
}

// WS Message Types
export type WSMessageType =
  // Host Messages
  | 'host:create'
  | 'host:start_game'
  | 'host:next_question'
  | 'host:reveal_answer'
  | 'host:show_scoreboard'
  | 'host:toggle_bots'
  // Player Messages
  | 'player:join'
  | 'player:submit_answer'
  // Server Broadcasts / Direct Messages
  | 'server:lobby_state'
  | 'server:game_state'
  | 'server:player_feedback'
  | 'server:error';

export interface WSMessage {
  type: WSMessageType;
  payload: any;
}
