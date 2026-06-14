import React, { useState, useEffect, useRef } from 'react';
import { Player, WSMessage } from '../types';
import { OPTION_STYLES } from '../data/optionStyles';
import { Loader2, ArrowRight, User, CircleHelp, AlertCircle, CheckCircle, XCircle, Flame, Trophy, Play, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Avatars lists
const ANIMALS_AVATARS = ['🦊', '🐱', '🐼', '🦁', '🐨', '🦖', '🐯', '🐙', '🦖', '🦄', '🐝', '🐷', '🚀', '🍩', '🥑', '👾'];

interface PlayerGameProps {
  initialPin?: string;
  onExit: () => void;
}

export default function PlayerGame({ initialPin = '', onExit }: PlayerGameProps) {
  const [pin, setPin] = useState(initialPin);
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🦊');
  
  // Game state
  const [joined, setJoined] = useState(false);
  const [player, setPlayer] = useState<Player | null>(null);
  const [roomState, setRoomState] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeFeedback, setActiveFeedback] = useState<any>(null); // tracks current question result
  const [loading, setLoading] = useState(false);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState<number | null>(null);

  const wsRef = useRef<WebSocket | null>(null);

  // Auto connect or join WS on form submit
  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim() || !nickname.trim()) return;

    setLoading(true);
    setError(null);

    // Open connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      // Send join message
      const msg: WSMessage = {
        type: 'player:join',
        payload: {
          pin: pin.trim(),
          nickname: nickname.trim().slice(0, 15),
          avatar: selectedAvatar,
        }
      };
      ws.send(JSON.stringify(msg));
    };

    ws.onmessage = (event) => {
      try {
        const message: WSMessage = JSON.parse(event.data);
        const { type, payload } = message;

        if (type === 'server:player_feedback') {
          if (payload.joined) {
            setJoined(true);
            setPlayer(payload.player);
            setLoading(false);
          } else {
            // Direct answer feedback! (correct/incorrect)
            setActiveFeedback(payload);
            setSubmittingAnswer(false);
            if (player) {
              setPlayer({
                ...player,
                score: payload.totalScore,
                streak: payload.currentStreak
              });
            }
          }
        } else if (type === 'server:game_state') {
          setRoomState(payload);

          // If the host transitioned back to a question, reset player states
          if (payload.state === 'question' && activeFeedback) {
            setActiveFeedback(null);
            setAnswerSubmitted(null);
          }
          if (payload.state === 'lobby' && joined) {
            // Updated roster details
            const matchedMe = payload.players[player?.id || ''];
            if (matchedMe) {
              setPlayer(matchedMe);
            }
          }
        } else if (type === 'server:error') {
          setError(payload);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to parse student message:', err);
      }
    };

    ws.onclose = () => {
      setLoading(false);
      setError('Room closed or disconnected from classroom host.');
    };

    ws.onerror = () => {
      setLoading(false);
      setError('Communication server error. Check your PIN.');
    };
  };

  const submitAnswer = (optionIdx: number) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    if (answerSubmitted !== null || roomState?.state !== 'question') return;

    setAnswerSubmitted(optionIdx);
    setSubmittingAnswer(true);

    const msg: WSMessage = {
      type: 'player:submit_answer',
      payload: { optionIndex: optionIdx }
    };
    wsRef.current.send(JSON.stringify(msg));
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    setJoined(false);
    setPlayer(null);
    setRoomState(null);
    setError(null);
    setAnswerSubmitted(null);
    setActiveFeedback(null);
    onExit();
  };

  // 1. PIN & REGISTER SCREEN
  if (!joined) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl text-white relative max-w-md mx-auto flex flex-col justify-between" id="player-join-screen">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,rgba(99,102,241,0.12),rgba(255,255,255,0))]" />
        
        <div className="relative z-10 space-y-4">
          <div className="text-center pb-2">
            <span className="text-3xl">🎒</span>
            <h2 className="text-2xl font-black tracking-tight text-white mt-1">Student Buzzer</h2>
            <p className="text-xs text-slate-400">Join the live game board using the Game PIN</p>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl p-3 text-xs flex items-center space-x-2" id="join-error">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleJoinGame} className="space-y-4">
            {/* PIN field */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Game PIN</label>
              <input
                type="number"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="6-digit PIN"
                maxLength={6}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 font-mono text-center text-lg font-bold tracking-widest text-amber-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-inner [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                required
                disabled={loading}
              />
            </div>

            {/* Nickname field */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Nickname</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g., Einstein, Ada, Rocket"
                maxLength={15}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                required
                disabled={loading}
              />
            </div>

            {/* Avatar Select Grid */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Choose Character</label>
              <div className="grid grid-cols-4 gap-2 bg-slate-950 p-2.5 border border-slate-800 rounded-xl max-h-36 overflow-y-auto" id="avatar-grid">
                {ANIMALS_AVATARS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setSelectedAvatar(av)}
                    className={`p-1.5 text-2xl rounded-lg transition-all ${
                      selectedAvatar === av
                        ? 'bg-indigo-600 scale-110 shadow-md border border-indigo-400'
                        : 'bg-slate-900/50 hover:bg-slate-800 border border-transparent'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* JOIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-1.5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 font-extrabold text-sm shadow cursor-pointer transition disabled:opacity-40"
              id="join-submit-btn"
            >
              {loading ? (
                <span>Locking connection...</span>
              ) : (
                <>
                  <span>Join Classroom Game</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <button
          onClick={onExit}
          className="text-xs text-slate-500 hover:text-slate-300 text-center w-full mt-4 underline select-none"
        >
          Cancel & Return Home
        </button>
      </div>
    );
  }

  // 2. LOBBY WAITING SCREEN
  if (roomState?.state === 'lobby') {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl text-white text-center space-y-6 max-w-sm mx-auto relative flex flex-col justify-between min-h-[350px]" id="player-lobby-wait">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,rgba(16,185,129,0.1),rgba(255,255,255,0))]" />
        
        <div className="relative z-10 space-y-4">
          <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 inline-block">
            ● Logged In Successfully!
          </div>

          <div className="py-2 flex flex-col items-center">
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="text-6xl bg-slate-950 p-4 rounded-3xl border border-slate-800 shadow shadow-inner"
            >
              {player?.avatar}
            </motion.div>
            <h3 className="text-xl font-extrabold text-slate-100 mt-3">{player?.nickname}</h3>
            <span className="text-xs text-slate-400 font-mono">Room code: PIN {pin}</span>
          </div>

          <div className="bg-slate-950/60 p-4 border border-slate-850 rounded-xl text-xs space-y-1.5 text-slate-300">
            <p className="font-bold">You are in!</p>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Look at the Presenter screen or Smartboard on the left. Once the presenter clicks <b>Start</b>, questions will appear!
            </p>
          </div>
        </div>

        <button
          onClick={disconnect}
          className="text-xs text-slate-500 hover:text-slate-400 inline-block underline pt-4"
        >
          Leave Room
        </button>
      </div>
    );
  }

  // 3. GET READY COUNTDOWN SCREEN
  if (roomState?.state === 'get_ready') {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl text-white text-center space-y-4 max-w-xs mx-auto flex flex-col items-center justify-center min-h-[300px]" id="player-get-ready">
        <div className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-2" />
        <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold font-mono">Get Ready!</span>
        <h3 className="text-lg font-black text-slate-200">
          Question {roomState.currentQuestionIndex + 1}
        </h3>
        <p className="text-xs text-slate-400 italic font-mono">"{roomState.quizTitle}"</p>
        <p className="text-[11px] text-slate-500">Look at the main screen for the question prompt!</p>
      </div>
    );
  }

  // 4. ACTIVE QUESTION INPUT BUZZER
  if (roomState?.state === 'question') {
    const currentQuestion = roomState.questions[roomState.currentQuestionIndex];
    
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 md:p-6 shadow-xl text-white flex flex-col justify-between space-y-4 max-w-sm mx-auto min-h-[380px]" id="player-buzzer-screen">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-mono font-bold text-slate-400">
            Q {roomState.currentQuestionIndex + 1} &middot; {roomState.timer}s left
          </span>
          <span className="text-xs text-amber-500 font-bold font-mono">{player?.score} pts</span>
        </div>

        {answerSubmitted !== null ? (
          /* Answer locked screen */
          <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4 py-8">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="w-14 h-14 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-xl shadow shadow-inner"
            >
              🔒
            </motion.div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-200 text-sm">Lock Successful!</h3>
              <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">
                Waiting for remaining classmates or AI Bots to lock answers...
              </p>
            </div>
            {/* Show which shape they chose */}
            <div className="flex items-center space-x-1.5 py-1 px-2.5 bg-slate-950 border border-slate-850 rounded-full text-[10px]">
              <span className={`w-3.5 h-3.5 rounded ${OPTION_STYLES[answerSubmitted].bg} inline-block`} />
              <span className="text-slate-400 font-medium">Chose {OPTION_STYLES[answerSubmitted].shape}</span>
            </div>
          </div>
        ) : (
          /* Tactile Big Colors Grid buzzer buttons */
          <div className="flex-grow flex flex-col justify-center space-y-3">
            <div className="text-center pb-2.5">
              <p className="text-xs text-indigo-300 font-bold">TAP THE MATCHING COLOR CODE:</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3" id="player-buttons-grid">
              {OPTION_STYLES.map((style, idx) => (
                <button
                  key={idx}
                  onClick={() => submitAnswer(idx)}
                  className={`h-24 md:h-28 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 shadow-md hover:shadow-lg text-white ${style.bg} ${style.hoverBg}`}
                  aria-label={`Buzzer Choice ${style.shape}`}
                  id={`buzzer-tile-${idx}`}
                >
                  <span className="text-3xl font-black mb-1 drop-shadow-md select-none">{style.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-950/20 px-2 py-0.5 rounded-full select-none">
                    {style.shape}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="text-[10px] text-slate-500 text-center pt-2 border-t border-slate-855 select-none leading-relaxed">
          Questions are shown on the Host Presenter screen on the left.
        </div>
      </div>
    );
  }

  // 5. REVEAL RESULT / SPLASH CORRECTION FEEDBACK
  if (roomState?.state === 'reveal') {
    const gotItCorrect = activeFeedback?.isCorrect;

    return (
      <div
        className={`border-4 rounded-3xl p-6 text-white text-center space-y-6 max-w-sm mx-auto flex flex-col justify-between min-h-[380px] shadow-2xl transition duration-500 ${
          gotItCorrect
            ? 'bg-emerald-900/90 border-emerald-500 ring-4 ring-emerald-500/20'
            : 'bg-rose-950 border-rose-500'
        }`}
        id="player-reveal-splash"
      >
        <div className="space-y-4 pt-4">
          <div className="flex justify-center">
            {gotItCorrect ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.2, 1] }}
                className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-3xl shadow-lg border-2 border-emerald-300"
              >
                <Check className="w-10 h-10 text-white stroke-[4px]" />
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 rounded-full bg-rose-600 flex items-center justify-center text-white font-black text-xl shadow-lg border-2 border-rose-400"
              >
                ❌
              </motion.div>
            )}
          </div>

          <div className="space-y-1 select-none">
            <h3 className="text-2xl font-black tracking-tight">{gotItCorrect ? 'CORRECT!' : 'INCORRECT'}</h3>
            <p className="text-xs text-slate-300">
              {gotItCorrect ? 'Outstanding speed!' : 'Streak lost. Don\'t lose focus!'}
            </p>
          </div>

          <div className="bg-slate-950/40 border border-white/5 p-4 rounded-2xl max-w-xs mx-auto space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Points Gained</div>
            <div className="text-3xl font-black font-mono tracking-tight text-white">
              {gotItCorrect ? `+${activeFeedback?.pointsEarned || 0}` : '+0'}
            </div>
            <div className="text-xs text-slate-400 font-mono">Total Score: {player?.score}</div>
          </div>

          {gotItCorrect && player && player.streak > 1 && (
            <div className="flex items-center justify-center space-x-1 text-slate-100 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-bold max-w-max mx-auto animate-bounce">
              <Flame className="w-4 h-4 text-amber-500 mr-0.5 fill-amber-500" />
              <span>🔥 Answer Streak: {player.streak} In a Row!</span>
            </div>
          )}
        </div>

        <span className="text-[10px] text-slate-400 italic">Look at the Presenter screen on the left.</span>
      </div>
    );
  }

  // 6. SCOREBOARD WAITING VIEW
  if (roomState?.state === 'scoreboard') {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl text-white text-center space-y-4 max-w-xs mx-auto flex flex-col items-center justify-center min-h-[300px]" id="player-score-wait">
        <Trophy className="w-10 h-10 text-amber-500" />
        <span className="text-xs uppercase tracking-widest text-slate-400 font-bold font-mono">Waiting for Host</span>
        <h3 className="text-lg font-black text-slate-200">Reviewing Scoreholder Standings</h3>
        <p className="text-xs text-slate-400">
          Check if your name cracked the Top 5 roster list on the Presenter screen!
        </p>
        <div className="py-1 px-3 bg-slate-950 rounded-full border border-slate-850 font-mono font-bold text-xs text-indigo-400">
          Your score: {player?.score} pts
        </div>
      </div>
    );
  }

  // 7. FINAL PODIUM / GAME OVER SUMMARY VIEW
  if (roomState?.state === 'podium') {
    // Sort room players to see my absolute rank
    const scoreboardList = Object.values(roomState.players || {}) as Player[];
    const sorted = scoreboardList.sort((a, b) => b.score - a.score);
    const myRankIdx = sorted.findIndex(p => p.id === player?.id);
    const myRank = myRankIdx === -1 ? sorted.length : myRankIdx + 1;

    const rankEmojis = ['🥇 1st Place! Champion! 🏆', '🥈 2nd Place! Outstanding! 🥈', '🥉 3rd Place! Magnificent! 🥉'];

    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl text-white text-center space-y-6 max-w-sm mx-auto flex flex-col justify-between min-h-[380px]" id="player-gameover-podium">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,rgba(234,179,8,0.1),rgba(255,255,255,0))]" />
        
        <div className="relative z-10 space-y-5">
          <span className="text-3xl">🏁</span>
          <h2 className="text-2xl font-black text-white tracking-tight leading-none">Game Finished!</h2>

          <div className="py-4 flex flex-col items-center">
            <span className="text-5xl mb-2">{player?.avatar}</span>
            <span className="font-extrabold text-slate-200">{player?.nickname}</span>
          </div>

          <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl max-w-xs mx-auto space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">Your Standing</span>
            <div className="text-lg font-black text-amber-400">
              {myRank <= 3 ? rankEmojis[myRank - 1] : `Rank #${myRank} of ${sorted.length}`}
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">Final Score: {player?.score} points</p>
          </div>
        </div>

        <button
          onClick={disconnect}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs select-none transition cursor-pointer"
        >
          Exit Game Lobby
        </button>
      </div>
    );
  }

  // Fallback waiting
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-white text-center space-y-4 max-w-xs mx-auto">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
      <span className="text-xs text-slate-400">Connecting to game server...</span>
    </div>
  );
}
