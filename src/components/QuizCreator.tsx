import React, { useState } from 'react';
import { Quiz, Question } from '../types';
import { Sparkles, Plus, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface QuizCreatorProps {
  onQuizCreated: (quiz: Quiz) => void;
  onCancel: () => void;
}

export default function QuizCreator({ onQuizCreated, onCancel }: QuizCreatorProps) {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [ageGroup, setAgeGroup] = useState('10-15 years');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Manual creation states
  const [manualTitle, setManualTitle] = useState('');
  const [manualDesc, setManualDesc] = useState('');
  const [manualCategory, setManualCategory] = useState('General');
  const [manualQuestions, setManualQuestions] = useState<Partial<Question>[]>([
    { text: '', options: ['', '', '', ''], correctOptionIndex: 0, timeLimit: 20 }
  ]);
  const [activeTab, setActiveTab] = useState<'ai' | 'manual'>('ai');

  // Handle Gemini Auto Quiz generation
  const handleAIGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          difficulty,
          ageGroup,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate quiz');
      }

      onQuizCreated(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Connecting to Gemini model failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Manual Quiz Handlers
  const handleAddQuestion = () => {
    setManualQuestions([
      ...manualQuestions,
      { text: '', options: ['', '', '', ''], correctOptionIndex: 0, timeLimit: 20 }
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    const qList = [...manualQuestions];
    qList.splice(index, 1);
    setManualQuestions(qList);
  };

  const handleQuestionTextChange = (index: number, text: string) => {
    const qList = [...manualQuestions];
    qList[index].text = text;
    setManualQuestions(qList);
  };

  const handleOptionChange = (qIdx: number, oIdx: number, val: string) => {
    const qList = [...manualQuestions];
    const options = [...(qList[qIdx].options || ['', '', '', ''])];
    options[oIdx] = val;
    qList[qIdx].options = options;
    setManualQuestions(qList);
  };

  const handleCorrectIndexChange = (qIdx: number, val: number) => {
    const qList = [...manualQuestions];
    qList[qIdx].correctOptionIndex = val;
    setManualQuestions(qList);
  };

  const handleTimerChange = (qIdx: number, val: number) => {
    const qList = [...manualQuestions];
    qList[qIdx].timeLimit = val;
    setManualQuestions(qList);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim()) {
      setError('Quiz Title is required');
      return;
    }

    // Validation
    for (let i = 0; i < manualQuestions.length; i++) {
      const q = manualQuestions[i];
      if (!q.text?.trim()) {
        setError(`Question #${i + 1} must have a valid question prompt`);
        return;
      }
      if (!q.options || q.options.some(opt => !opt.trim())) {
        setError(`All 4 options must be filled for Question #${i + 1}`);
        return;
      }
    }

    const newQuiz: Quiz = {
      id: `quiz-manual-${Date.now()}`,
      title: manualTitle,
      description: manualDesc || 'A teacher-created quiz manual compilation.',
      category: manualCategory,
      createdAt: new Date().toISOString(),
      questions: manualQuestions.map((q, idx) => ({
        id: `q-manual-${idx}-${Date.now()}`,
        text: q.text!,
        options: q.options!,
        correctOptionIndex: q.correctOptionIndex || 0,
        timeLimit: q.timeLimit || 20,
      }))
    };

    onQuizCreated(newQuiz);
  };

  return (
    <div className="bg-vibrant-purple-medium/60 rounded-3xl shadow-2xl border border-white/10 overflow-hidden" id="quiz-creator-root">
      <div className="bg-vibrant-purple-medium px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-white border-b border-white/10 gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onCancel}
            className="p-1.5 px-3 flex items-center space-x-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-black transition cursor-pointer"
            id="back-create-btn"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3px]" />
            <span>Back</span>
          </button>
          <h2 className="text-xl font-black font-sans tracking-tight text-white leading-tight">Classroom Quiz Creator</h2>
        </div>
        <div className="flex bg-vibrant-purple-dark p-1 rounded-xl text-xs font-bold border border-white/5">
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2 rounded-lg transition-all duration-150 cursor-pointer flex items-center ${activeTab === 'ai' ? 'bg-vibrant-gold text-vibrant-purple-dark font-black shadow-md' : 'text-slate-300 hover:text-white'}`}
            id="ai-tab-btn"
          >
            <Sparkles className="w-3.5 h-3.5 inline-block mr-1.5 fill-current" />
            AI Gen (Gemini)
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-4 py-2 rounded-lg transition-all duration-150 cursor-pointer ${activeTab === 'manual' ? 'bg-vibrant-gold text-vibrant-purple-dark font-black shadow-md' : 'text-slate-300 hover:text-white'}`}
            id="manual-tab-btn"
          >
            Create Manually
          </button>
        </div>
      </div>

      <div className="p-6">
        {error && (
          <div className="bg-vibrant-red/15 text-red-200 border border-vibrant-red/30 rounded-2xl p-4 mb-6 text-sm" id="creator-error">
            ⚠️ {error}
          </div>
        )}

        {activeTab === 'ai' ? (
          /* AI Quiz Generator form */
          <form onSubmit={handleAIGenerate} className="space-y-6">
            <div className="bg-vibrant-purple-dark/80 border border-white/10 rounded-2xl p-5 mb-4 flex items-start space-x-4">
              <span className="text-2xl mt-0.5">💡</span>
              <div className="text-sm text-slate-200">
                <span className="font-black text-vibrant-gold text-md">How does Gemini AI work?</span>
                <p className="mt-1 leading-relaxed text-slate-300">
                  Enter any topic (e.g., "Mitochondria structures", "Adding Fractions", "Grammar Tenses") and choose the difficulty. Gemini will instantly formulate a balanced 5-question multiple choice quiz with exact options, answers, and timers!
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-black text-white tracking-wide">What do you want the quiz to be about?</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., The Solar System, Basic Multiplication, Ancient Egypt..."
                className="w-full px-4 py-3 rounded-xl bg-vibrant-purple-dark/50 border border-white/10 focus:border-vibrant-gold text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-vibrant-gold transition font-medium"
                required
                maxLength={80}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-black text-white tracking-wide">Difficulty Rating</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Easy', 'Medium', 'Hard'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDifficulty(lvl)}
                      className={`py-2 px-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                        difficulty === lvl
                          ? 'border-vibrant-gold bg-vibrant-gold/25 text-vibrant-gold font-black'
                          : 'border-white/10 text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-black text-white tracking-wide">Target Grade / Age Range</label>
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-vibrant-purple-dark focus:border-vibrant-gold focus:ring-2 focus:ring-vibrant-gold text-white text-sm"
                >
                  <option value="6-9 years" className="bg-vibrant-purple-dark text-white">Elementary (6-9 years)</option>
                  <option value="10-15 years" className="bg-vibrant-purple-dark text-white">Middle School (10-15 years)</option>
                  <option value="16+ years" className="bg-vibrant-purple-dark text-white">High School / Adult (16+ years)</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isGenerating || !topic.trim()}
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-2xl bg-vibrant-gold text-vibrant-purple-dark font-black shadow-[0_5px_0_#9c7c00] active:translate-y-[5px] active:shadow-none hover:brightness-110 transition-all duration-150 uppercase tracking-wider cursor-pointer disabled:opacity-50"
                id="generate-quiz-btn"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Gemini is modeling your quiz... (~3 seconds)</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 font-bold fill-current" />
                    <span>Generate Quiz with Gemini AI</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Manual Quiz Creator form */
          <form onSubmit={handleManualSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-black text-white tracking-wide">Quiz Title</label>
                <input
                  type="text"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="e.g., Chemistry Periodic Table Blast"
                  className="w-full px-4 py-2.5 rounded-xl bg-vibrant-purple-dark/50 border border-white/10 focus:border-vibrant-gold text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-vibrant-gold transition font-medium text-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-black text-white tracking-wide">Subject Category</label>
                <input
                  type="text"
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value)}
                  placeholder="e.g., Science, Math"
                  className="w-full px-4 py-2.5 bg-vibrant-purple-dark/50 border border-white/10 focus:border-vibrant-gold rounded-xl focus:outline-none focus:ring-2 focus:ring-vibrant-gold text-white text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-black text-white tracking-wide">Short Description</label>
              <input
                type="text"
                value={manualDesc}
                onChange={(e) => setManualDesc(e.target.value)}
                placeholder="A fun interactive quiz testing elements"
                className="w-full px-4 py-2.5 bg-vibrant-purple-dark/50 border border-white/10 focus:border-vibrant-gold focus:ring-2 focus:ring-vibrant-gold text-white rounded-xl text-sm font-medium focus:outline-none placeholder-slate-400"
              />
            </div>

            {/* Questions list */}
            <div className="space-y-6 border-t border-white/5 pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-md font-black text-white">Quiz Questions ({manualQuestions.length})</h3>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="flex items-center space-x-1.5 py-2 px-4 rounded-xl bg-vibrant-gold/15 text-vibrant-gold hover:bg-vibrant-gold/25 border border-vibrant-gold/20 font-bold text-xs transition cursor-pointer"
                  id="add-manual-q-btn"
                >
                  <Plus className="w-4 h-4 stroke-[3px]" />
                  <span>Add Question</span>
                </button>
              </div>

              {manualQuestions.map((q, qIdx) => (
                <div key={qIdx} className="bg-vibrant-purple-dark/60 border border-white/10 rounded-2xl p-5 relative">
                  {manualQuestions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIdx)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-vibrant-red transition cursor-pointer"
                      title="Remove Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <div className="space-y-3">
                    <div className="font-extrabold text-vibrant-gold text-sm uppercase tracking-wider">Question {qIdx + 1}</div>
                    <div>
                      <input
                        type="text"
                        value={q.text || ''}
                        onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                        placeholder="Type the question prompt here..."
                        className="w-full px-4 py-2.5 rounded-xl bg-vibrant-purple-dark border border-white/10 focus:border-vibrant-gold focus:ring-2 focus:ring-vibrant-gold text-white font-medium focus:outline-none placeholder-slate-400 text-sm"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      {/* 4 Answers */}
                      {[0, 1, 2, 3].map((oIdx) => {
                        const colors = [
                          'border-[#E21B3C]/50 focus-within:border-[#E21B3C] focus-within:ring-[#E21B3C]/30',
                          'border-[#1368CE]/50 focus-within:border-[#1368CE] focus-within:ring-[#1368CE]/30',
                          'border-[#D89E00]/50 focus-within:border-[#D89E00] focus-within:ring-[#D89E00]/30',
                          'border-[#26890C]/50 focus-within:border-[#26890C] focus-within:ring-[#26890C]/30'
                        ];
                        const labels = ['Answer A (▲ Red)', 'Answer B (◆ Blue)', 'Answer C (● Yellow)', 'Answer D (■ Green)'];
                        
                        return (
                          <div key={oIdx} className={`flex items-center space-x-2 border p-2 rounded-xl bg-vibrant-purple-dark/30 hover:bg-vibrant-purple-dark/50 transition-all ${colors[oIdx]}`}>
                            <input
                              type="radio"
                              name={`correct-${qIdx}`}
                              checked={q.correctOptionIndex === oIdx}
                              onChange={() => handleCorrectIndexChange(qIdx, oIdx)}
                              className="accent-vibrant-gold w-4 h-4 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={q.options?.[oIdx] || ''}
                              onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                              placeholder={labels[oIdx]}
                              className="w-full bg-transparent text-white text-sm outline-none placeholder-slate-400 font-medium"
                              required
                            />
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-300 mt-3 pt-2 border-t border-white/5">
                      <div>Select the radio button next to the correct answer.</div>
                      <div className="flex items-center space-x-2">
                        <span>Timer:</span>
                        <select
                          value={q.timeLimit || 20}
                          onChange={(e) => handleTimerChange(qIdx, Number(e.target.value))}
                          className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-vibrant-purple-dark text-white text-xs cursor-pointer focus:border-vibrant-gold outline-none"
                        >
                          <option value={10}>10s</option>
                          <option value={15}>15s</option>
                          <option value={20}>20s</option>
                          <option value={30}>30s</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 font-semibold text-xs uppercase tracking-wider transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-vibrant-gold text-vibrant-purple-dark font-black text-xs transition duration-150 shadow-[0_4px_0_#9c7c00] active:translate-y-[4px] active:shadow-none hover:brightness-110 uppercase tracking-widest cursor-pointer"
                id="save-manual-quiz-btn"
              >
                Save & Play Quiz
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
