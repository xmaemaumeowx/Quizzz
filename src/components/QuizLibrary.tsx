import React, { useEffect, useState } from 'react';
import { Quiz } from '../types';
import { Search, Play, Plus, BookOpen, Clock, Tag, Brain, HelpCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface QuizLibraryProps {
  onHostQuiz: (quizId: string) => void;
  onCreateNewClick: () => void;
}

export default function QuizLibrary({ onHostQuiz, onCreateNewClick }: QuizLibraryProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/quizzes');
      if (res.ok) {
        const data = await res.json();
        setQuizzes(data);
      }
    } catch (err) {
      console.error('Failed to fetch quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  // Filter quizzes
  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(search.toLowerCase()) ||
      quiz.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory =
      selectedCategory === 'All' || quiz.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Get distinct categories
  const categories = ['All', ...Array.from(new Set(quizzes.map((q) => q.category)))];

  return (
    <div className="space-y-6" id="quiz-library-root">
      {/* Top Banner introducing the application */}
      <div className="bg-gradient-to-r from-vibrant-purple-medium to-vibrant-purple-dark text-white rounded-3xl p-6 md:p-8 border border-white/10 shadow-xl relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-vibrant-gold/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="bg-vibrant-purple-dark/70 border border-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-vibrant-gold leading-none">
            🎨 Classroom Interactivity
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
            Host a Live Classroom Quiz Show!
          </h1>
          <p className="text-slate-200 leading-relaxed text-sm md:text-base">
            Deliver energetic interactive multiple-choice questions. Students join using their phones or computers via a unique room code, choose their avatars, and tap color panels in real time!
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onCreateNewClick}
              className="px-5 py-3 rounded-2xl bg-vibrant-gold hover:scale-[1.02] text-vibrant-purple-dark font-black transition flex items-center space-x-1.5 shadow-lg shadow-vibrant-gold/20"
              id="library-create-button"
            >
              <Plus className="w-4 h-4 stroke-[3px]" />
              <span>Create New Quiz & AI Gen</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Quiz list and searching */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-vibrant-purple-medium/80 backdrop-blur-md rounded-2xl border border-white/10 p-4 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-300" />
              <input
                type="text"
                placeholder="Search quizzes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-vibrant-purple-dark/50 border border-white/10 hover:border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-vibrant-gold text-sm text-white placeholder-slate-400"
              />
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none items-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-vibrant-gold text-vibrant-purple-dark'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3 bg-vibrant-purple-medium/40 border border-white/10 rounded-2xl shadow-lg">
              <Loader2 className="w-8 h-8 text-vibrant-gold animate-spin" />
              <span className="text-slate-300 text-sm font-semibold">Loading classroom quizzes...</span>
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="bg-vibrant-purple-medium/40 border border-dashed border-white/15 rounded-2xl p-12 text-center">
              <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-white font-black mb-1 col-span-full">No quizzes match your search</h3>
              <p className="text-sm text-slate-300 mb-4 max-w-sm mx-auto">
                Try searching for another topic, or generate one in 3 seconds using our Gemini-powered template!
              </p>
              <button
                onClick={onCreateNewClick}
                className="px-4 py-2.5 rounded-xl bg-white/10 text-vibrant-gold hover:bg-white/20 border border-vibrant-gold/20 font-bold text-xs transition"
              >
                Create a custom Quiz
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  onClick={() => setSelectedQuiz(quiz)}
                  className={`bg-vibrant-purple-medium/30 rounded-2xl border p-5 shadow-lg hover:shadow-xl hover:scale-[1.01] hover:bg-vibrant-purple-medium/55 cursor-pointer transition-all duration-250 flex flex-col justify-between ${
                    selectedQuiz?.id === quiz.id ? 'ring-2 ring-vibrant-gold border-vibrant-gold bg-vibrant-purple-medium/70' : 'border-white/15'
                  }`}
                  id={`quiz-card-${quiz.id}`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-vibrant-gold/15 text-vibrant-gold rounded-md text-[10px] font-black uppercase tracking-wider border border-vibrant-gold/25">
                        {quiz.category}
                      </span>
                      <span className="text-xs text-slate-300 font-heavy font-mono">
                        {quiz.questions.length} questions
                      </span>
                    </div>
                    <h3 className="text-md font-extrabold text-white tracking-tight leading-snug">
                      {quiz.title}
                    </h3>
                    <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                      {quiz.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-300 font-semibold">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-vibrant-gold" />
                      <span>{quiz.questions.reduce((acc, q) => acc + q.timeLimit, 0)}s play</span>
                    </div>
                    <span className="text-vibrant-gold font-black flex items-center space-x-0.5 hover:underline">
                      <span>View details</span>
                      <span>&rarr;</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Quiz Preview and Play Panel */}
        <div className="lg:col-span-1">
          {selectedQuiz ? (
            <div className="bg-vibrant-purple-medium rounded-2xl border border-white/15 shadow-xl p-5 sticky top-24 space-y-5 animate-in fade-in slide-in-from-right-4 duration-300" id="quiz-preview-panel">
              <div className="border-b border-white/10 pb-4">
                <span className="text-xs font-black text-vibrant-gold uppercase tracking-wider">{selectedQuiz.category}</span>
                <h3 className="text-lg font-black text-white leading-snug mt-1">{selectedQuiz.title}</h3>
                <p className="text-xs text-slate-200 leading-relaxed mt-1.5">{selectedQuiz.description}</p>
              </div>

              {/* Action buttons */}
              <button
                onClick={() => onHostQuiz(selectedQuiz.id)}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-vibrant-gold text-vibrant-purple-dark font-black text-sm transition-all duration-150 cursor-pointer shadow-[0_5px_0_#9c7c00] active:translate-y-[5px] active:shadow-none hover:brightness-110 uppercase tracking-wider font-sans"
                id="library-host-btn"
              >
                <Play className="w-4 h-4 fill-current text-vibrant-purple-dark" />
                <span>Host Game Live</span>
              </button>

              {/* Questions review */}
              <div>
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider mb-2">
                  Question List ({selectedQuiz.questions.length})
                </h4>
                <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {selectedQuiz.questions.map((q, idx) => (
                    <div key={q.id} className="bg-vibrant-purple-dark/60 rounded-xl p-3 border border-white/10 text-xs">
                      <div className="font-extrabold text-vibrant-gold flex justify-between mb-1">
                        <span>{idx + 1}. Multiple Choice</span>
                        <span>⏱️ {q.timeLimit}s</span>
                      </div>
                      <p className="text-white font-heavy mb-1.5">{q.text}</p>
                      <div className="grid grid-cols-2 gap-1 font-sans text-[10px] text-slate-300 border-none">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`px-1.5 py-0.5 rounded ${
                              oIdx === q.correctOptionIndex
                                ? 'bg-vibrant-green/20 text-green-300 font-extrabold border border-vibrant-green/45'
                                : 'bg-white/5 border border-white/5 text-slate-300'
                            }`}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-vibrant-purple-medium/30 border border-dashed border-white/15 rounded-2xl p-8 text-center text-slate-400 space-y-3 lg:h-full lg:flex lg:flex-col lg:justify-center">
              <BookOpen className="w-12 h-12 mx-auto text-slate-300" />
              <div>
                <h4 className="font-bold text-white text-md">Select a Quiz</h4>
                <p className="text-xs text-slate-300 max-w-xs mx-auto mt-1 leading-relaxed">
                  Click on any card on the left to review its questions, see answers, and click <b>Host Game</b> to project the presenter screen.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
