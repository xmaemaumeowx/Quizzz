import React, { useState } from 'react';
import QuizLibrary from './components/QuizLibrary';
import QuizCreator from './components/QuizCreator';
import HostGame from './components/HostGame';
import PlayerGame from './components/PlayerGame';
import MySQLWorkbenchReplica from './components/MySQLWorkbenchReplica';
import { Quiz } from './types';
import { Sparkles, BookOpen, User, Keyboard, HelpCircle, ArrowLeft, Layers, PlayCircle, Bot, Database } from 'lucide-react';

export default function App() {
  // Navigation: 'home' | 'host_hub' | 'player_hub' | 'creator' | 'active_host' | 'active_player' | 'sandbox' | 'mysql_replica'
  const [view, setView] = useState<'home' | 'host_hub' | 'player_hub' | 'creator' | 'active_host' | 'active_player' | 'sandbox' | 'mysql_replica'>('home');
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  
  // Sandbox specific states to feed PIN from left side to right side easily
  const [sandboxPin, setSandboxPin] = useState('');

  // Handle quiz selected to host
  const handleHostQuiz = (quizId: string) => {
    setSelectedQuizId(quizId);
    setView('active_host');
  };

  // Handle quiz created manually or by AI
  const handleQuizCreated = (newQuiz: Quiz) => {
    // Re-rout back to Host Hub library so they see their new quiz featured first!
    setView('host_hub');
  };

  return (
    <div className="min-h-screen bg-vibrant-pattern text-slate-100 font-sans" id="app-root">
      {/* Visual background details */}
      <div className="fixed inset-0 bg-grid-white/5 bg-[size:32px_32px] pointer-events-none opacity-40" />

      {/* TOP NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-vibrant-purple-medium/90 backdrop-blur-md border-b border-white/10 shadow-lg px-6 py-4 flex items-center justify-between text-white">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView('home')}>
          <div className="bg-white text-vibrant-purple-primary font-black px-3 py-1.5 rounded-lg text-2xl italic tracking-tighter quizz-logo-glow shadow-[0_0_15px_rgba(255,204,0,0.3)]">
            QUIZZ!
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white leading-none">GAME TIME!</h1>
            <span className="text-[10px] text-vibrant-gold font-bold uppercase tracking-wider leading-none">Vibrant Live Buzzer Panel</span>
          </div>
        </div>

        {view !== 'home' && (
          <button
            onClick={() => setView('home')}
            className="flex items-center space-x-1.5 py-2 px-4 rounded-full bg-white text-vibrant-purple-primary hover:bg-vibrant-gold hover:text-vibrant-purple-dark text-xs font-black transition-all shadow-md cursor-pointer"
            id="global-home-btn"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[3px]" />
            <span>Main Menu</span>
          </button>
        )}
      </header>

      {/* CORE VIEW ROUTER PORTPORTS */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 relative z-10">
        {view === 'home' && (
          <div className="max-w-4xl mx-auto space-y-12 py-6 text-center" id="home-portal">
            <div className="space-y-4 max-w-2xl mx-auto">
              <span className="px-4 py-1.5 bg-vibrant-purple-medium/60 text-vibrant-gold border border-vibrant-gold/30 rounded-full text-xs font-black uppercase tracking-wider shadow animate-pulse">
                ✨ GAME TIME!
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-lg">
                Experiential Learning
              </h2>
              <p className="text-white/80 leading-relaxed text-sm md:text-base max-w-2xl mx-auto">
                Host multiple choice quiz games where student devices lock response shapes in real-time. Created for smartboards, with automated AI question generation and live scoreboard tracking!
              </p>
            </div>

            {/* Portal Paths Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 max-w-7xl mx-auto">
              
              {/* Path 1: Teacher/Host */}
              <div className="bg-vibrant-purple-medium/90 border border-white/10 text-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 text-center flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center mx-auto text-2xl font-bold border border-white/10">
                    👨‍🏫
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-md tracking-tight">Presenter & Teacher Hub</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Explore prebaked quizzes, draft your own custom lists, or use AI to generate curriculum questions instantly.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setView('host_hub')}
                  className="w-full py-3 px-4 rounded-xl bg-white text-vibrant-purple-primary hover:bg-vibrant-gold hover:text-vibrant-purple-dark text-xs font-bold shadow-lg h-11 transition-all duration-200 uppercase tracking-wider cursor-pointer"
                  id="portal-host-btn"
                >
                  Host a Live Game
                </button>
              </div>

              {/* Path 2: Student Buzzer */}
              <div className="bg-vibrant-purple-medium/90 border border-white/10 text-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 text-center flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center mx-auto text-2xl font-bold border border-white/10">
                    📱
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-md tracking-tight">Student Answer Buzzer</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Got a PIN code shown on the smartboard? Enter the PIN, pick a funny emoji avatar, and submit your answers!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setView('player_hub')}
                  className="w-full py-3 px-4 rounded-xl bg-white text-vibrant-purple-primary hover:bg-vibrant-gold hover:text-vibrant-purple-dark text-xs font-bold shadow-lg h-11 transition-all duration-200 uppercase tracking-wider cursor-pointer"
                  id="portal-student-btn"
                >
                  Join Game as Student
                </button>
              </div>

              {/* Path 3: Sandbox split screen */}
              <div className="bg-vibrant-purple-medium/90 border border-white/10 text-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 text-center flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center mx-auto text-2xl font-bold border border-white/10">
                    🚀
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-md tracking-tight">Play Solo (Splitscreen)</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Testing alone? Launch our interactive split-screen. Renders the Host and Student controllers side-by-side with real-time sync!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setView('sandbox')}
                  className="w-full py-3 px-4 rounded-xl bg-white text-vibrant-purple-primary hover:bg-vibrant-gold hover:text-vibrant-purple-dark text-xs font-bold shadow-lg h-11 transition-all duration-200 uppercase tracking-wider cursor-pointer"
                  id="portal-sandbox-btn"
                >
                  Demo Live Sandbox
                </button>
              </div>

              {/* Path 4: MySQL Workbench Replica Laboratory */}
              <div className="bg-gradient-to-br from-vibrant-purple-medium/95 to-vibrant-purple-dark border-2 border-vibrant-gold/60 text-white rounded-3xl p-6 shadow-2xl hover:shadow-yellow-500/10 transition-all duration-300 text-center flex flex-col justify-between space-y-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-vibrant-gold text-slate-950 font-black text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-bl-xl shadow-lg">
                  SQL Workbench
                </div>
                
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-vibrant-gold/10 text-vibrant-gold flex items-center justify-center mx-auto border border-vibrant-gold/20">
                    <Database className="w-6 h-6 text-vibrant-gold" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-md tracking-tight">MySQL DB Catalog Lab</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Optimize Philippine MotorPH databases. Build active B-Tree indices, SQL views, and transactional stored procedures.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setView('mysql_replica')}
                  className="w-full py-3 px-4 rounded-xl bg-vibrant-gold text-vibrant-purple-dark hover:brightness-110 font-black text-xs shadow-lg h-11 transition-all duration-200 uppercase tracking-wider cursor-pointer"
                  id="portal-workbench-btn"
                >
                  Configure Databases
                </button>
              </div>

            </div>

            {/* Platform benefits badges */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap justify-center gap-6 text-xs text-slate-300 font-medium">
              <div className="flex items-center space-x-1.5 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
                <Sparkles className="w-4 h-4 text-vibrant-gold fill-vibrant-gold/20" />
                <span>AI-Driven (Gemini 3.5 Flash)</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
                <Layers className="w-4 h-4 text-sky-400" />
                <span>Real-Time WebSockets</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
                <Bot className="w-4 h-4 text-emerald-400" />
                <span>Roster Bot Simulation</span>
              </div>
            </div>
          </div>
        )}

        {/* TEACHER HOST HUB (Library list) */}
        {view === 'host_hub' && (
          <QuizLibrary
            onHostQuiz={handleHostQuiz}
            onCreateNewClick={() => setView('creator')}
          />
        )}

        {/* STUDENT BUZZER HUB */}
        {view === 'player_hub' && (
          <div className="pt-4">
            <PlayerGame
              onExit={() => setView('home')}
            />
          </div>
        )}

        {/* QUIZ MANUAL / AI CREATOR */}
        {view === 'creator' && (
          <QuizCreator
            onQuizCreated={(quiz) => {
              handleQuizCreated(quiz);
            }}
            onCancel={() => setView('host_hub')}
          />
        )}

        {/* ACTIVE HOST SCREEN */}
        {view === 'active_host' && selectedQuizId && (
          <HostGame
            quizId={selectedQuizId}
            onExit={() => {
              setSelectedQuizId(null);
              setView('host_hub');
            }}
          />
        )}

        {/* SANDBOX SPLIT SCREEN DEMO (Absolute genius!) */}
        {view === 'sandbox' && (
          <div className="space-y-6" id="sandbox-root">
            <div className="bg-slate-900 rounded-2xl p-4 text-white flex flex-col md:flex-row items-center justify-between border border-slate-805 gap-3">
              <div className="space-y-1">
                <span className="text-xs uppercase bg-indigo-500/10 text-indigo-400 font-bold px-2.5 py-0.5 rounded-lg border border-indigo-500/20">
                  Real-time Sandbox Space
                </span>
                <h3 className="text-md font-extrabold">Split-Screen Evaluator</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Below is a double viewport on port 3000. Left screen hosts. Right screen connects. Toggle <b>Bots</b> on the left to add roster participants instantly!
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">Copy Room Pin to input:</span>
                <input
                  type="text"
                  placeholder="Paste PIN here"
                  value={sandboxPin}
                  onChange={(e) => setSandboxPin(e.target.value)}
                  className="px-3 py-1 bg-slate-950 border border-slate-800 text-slate-100 font-bold tracking-wider font-mono rounded text-sm w-32 focus:outline-none focus:ring-1 focus:ring-indigo-550"
                />
              </div>
            </div>

            {/* Left Host viewport - Right Student Viewport split-container */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
              
              {/* Host presentator viewport (60% width) */}
              <div className="lg:col-span-3 space-y-4">
                <div className="bg-white border border-gray-150 p-2 rounded-t-xl text-center text-xs text-gray-400 font-bold bg-slate-50 border-b-none flex items-center justify-center space-x-1 uppercase">
                  <span>Presenter Monitor</span>
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse inline-block" />
                </div>
                <HostGame
                  quizId="sql-quiz" // default SQL quiz for sandbox gameplay
                  onExit={() => setView('home')}
                />
              </div>

              {/* Student controller viewport (40% width) */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white border border-gray-150 p-2 rounded-t-xl text-center text-xs text-gray-400 font-bold bg-slate-50 border-b-none flex items-center justify-center space-x-1 uppercase">
                  <span>Student Screen Viewport</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                </div>
                <PlayerGame
                  initialPin={sandboxPin}
                  onExit={() => setView('home')}
                />
              </div>

            </div>
          </div>
        )}

        {view === 'mysql_replica' && (
          <div className="space-y-6" id="mysql-replica-wrapper">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/40 p-4 px-6 rounded-3xl border border-white/5">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-vibrant-gold bg-vibrant-gold/10 px-2 py-0.5 rounded border border-vibrant-gold/20 mr-2 inline-block">
                  MotorPH Enterprise Lab
                </span>
                <h3 className="text-md font-black text-white inline-block">Live MySQL DB Catalog & Query Sandbox</h3>
                <p className="text-xs text-slate-300">
                  Observe and evaluate schema indices, virtual views, and ACID rollback procedures on a mock 24,380 row database.
                </p>
              </div>
              <button
                onClick={() => setView('home')}
                className="py-2.5 px-5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-bold cursor-pointer uppercase transition-all"
              >
                Exit Lab
              </button>
            </div>
            <MySQLWorkbenchReplica />
          </div>
        )}
      </main>
    </div>
  );
}
