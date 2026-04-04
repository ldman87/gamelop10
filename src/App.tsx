import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  RotateCcw, 
  Trophy, 
  Timer, 
  BookOpen,
  BrainCircuit,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { questions, Question } from './data/questions';
import { MathRenderer } from './components/MathRenderer';
import { cn } from './lib/utils';

type GameState = 'start' | 'playing' | 'result';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [tfAnswers, setTfAnswers] = useState<boolean[]>([]);
  const [shortAnswer, setShortAnswer] = useState('');

  const currentQuestion = questions[currentQuestionIndex];

  // Timer logic
  useEffect(() => {
    let timer: any;
    if (gameState === 'playing' && !isAnswered && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isAnswered) {
      handleAnswer(null);
    }
    return () => clearInterval(timer);
  }, [gameState, isAnswered, timeLeft]);

  const startGame = () => {
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsAnswered(false);
    setSelectedAnswer(null);
    setTimeLeft(30);
    setUserAnswers([]);
    setTfAnswers([]);
    setShortAnswer('');
  };

  const handleAnswer = (answer: any) => {
    if (isAnswered) return;

    let isCorrect = false;
    if (currentQuestion.type === 'multiple-choice') {
      isCorrect = answer === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === 'true-false') {
      isCorrect = JSON.stringify(answer) === JSON.stringify(currentQuestion.correctAnswer);
    } else if (currentQuestion.type === 'short-answer') {
      isCorrect = answer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
    }

    if (isCorrect) {
      setScore((prev) => prev + 1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#14b8a6', '#2dd4bf', '#0d9488']
      });
    }

    setSelectedAnswer(answer);
    setIsAnswered(true);
    setUserAnswers([...userAnswers, { questionId: currentQuestion.id, answer, isCorrect }]);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setIsAnswered(false);
      setSelectedAnswer(null);
      setTimeLeft(30);
      setTfAnswers([]);
      setShortAnswer('');
    } else {
      setGameState('result');
    }
  };

  const renderQuestionContent = () => {
    switch (currentQuestion.type) {
      case 'multiple-choice':
        return (
          <div className="grid grid-cols-1 gap-3 mt-6">
            {currentQuestion.options?.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === currentQuestion.correctAnswer;
              const showCorrect = isAnswered && isCorrect;
              const showWrong = isAnswered && isSelected && !isCorrect;

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  disabled={isAnswered}
                  className={cn(
                    "p-4 text-left rounded-xl border-2 transition-all duration-200 flex items-center justify-between group",
                    !isAnswered && "hover:border-teal-400 hover:bg-teal-50 border-slate-200",
                    showCorrect && "border-green-500 bg-green-50",
                    showWrong && "border-red-500 bg-red-50",
                    isAnswered && !isCorrect && !isSelected && "border-slate-100 opacity-60"
                  )}
                >
                  <MathRenderer content={option} className="text-lg font-medium" />
                  {showCorrect && <CheckCircle2 className="text-green-500" size={24} />}
                  {showWrong && <XCircle className="text-red-500" size={24} />}
                </button>
              );
            })}
          </div>
        );

      case 'true-false':
        return (
          <div className="mt-6 space-y-4">
            {currentQuestion.statements?.map((statement, idx) => {
              const currentVal = tfAnswers[idx];
              const isCorrect = currentQuestion.correctAnswer[idx];
              
              return (
                <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <MathRenderer content={statement} className="mb-3 font-medium" />
                  <div className="flex gap-4">
                    {[true, false].map((val) => {
                      const isSelected = tfAnswers[idx] === val;
                      const showCorrect = isAnswered && val === isCorrect;
                      const showWrong = isAnswered && isSelected && val !== isCorrect;

                      return (
                        <button
                          key={val.toString()}
                          onClick={() => {
                            const newAnswers = [...tfAnswers];
                            newAnswers[idx] = val;
                            setTfAnswers(newAnswers);
                          }}
                          disabled={isAnswered}
                          className={cn(
                            "flex-1 py-2 rounded-lg border-2 font-bold transition-all",
                            !isAnswered && isSelected && "border-teal-500 bg-teal-500 text-white",
                            !isAnswered && !isSelected && "border-slate-200 hover:border-teal-300",
                            isAnswered && showCorrect && "border-green-500 bg-green-500 text-white",
                            isAnswered && showWrong && "border-red-500 bg-red-500 text-white",
                            isAnswered && !showCorrect && !showWrong && "opacity-40 border-slate-200"
                          )}
                        >
                          {val ? 'Đúng' : 'Sai'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {!isAnswered && (
              <button
                onClick={() => handleAnswer(tfAnswers)}
                disabled={tfAnswers.length < (currentQuestion.statements?.length || 0)}
                className="w-full mt-4 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 disabled:opacity-50"
              >
                Xác nhận câu trả lời
              </button>
            )}
          </div>
        );

      case 'short-answer':
        return (
          <div className="mt-6 space-y-4">
            <div className="relative">
              <input
                type="text"
                value={shortAnswer}
                onChange={(e) => setShortAnswer(e.target.value)}
                disabled={isAnswered}
                placeholder="Nhập câu trả lời của bạn..."
                className={cn(
                  "w-full p-4 pr-12 rounded-xl border-2 outline-none transition-all text-lg font-medium",
                  !isAnswered && "border-slate-200 focus:border-teal-500",
                  isAnswered && shortAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase() && "border-green-500 bg-green-50",
                  isAnswered && shortAnswer.trim().toLowerCase() !== currentQuestion.correctAnswer.toLowerCase() && "border-red-500 bg-red-50"
                )}
              />
              {isAnswered && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {shortAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase() ? (
                    <CheckCircle2 className="text-green-500" size={24} />
                  ) : (
                    <XCircle className="text-red-500" size={24} />
                  )}
                </div>
              )}
            </div>
            {!isAnswered && (
              <button
                onClick={() => handleAnswer(shortAnswer)}
                disabled={!shortAnswer.trim()}
                className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 disabled:opacity-50"
              >
                Gửi câu trả lời
              </button>
            )}
            {isAnswered && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-green-800 font-bold">Đáp án đúng: {currentQuestion.correctAnswer}</p>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
      <AnimatePresence mode="wait">
        {gameState === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-teal-100"
          >
            <div className="bg-teal-600 p-12 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <BrainCircuit className="absolute -top-10 -left-10 w-48 h-48" />
                <BookOpen className="absolute -bottom-10 -right-10 w-48 h-48" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="inline-block p-4 bg-white/20 backdrop-blur-md rounded-2xl mb-6"
              >
                <Trophy size={48} />
              </motion.div>
              <h1 className="text-4xl font-black mb-4 tracking-tight">CHINH PHỤC TOÁN 10</h1>
              <p className="text-teal-50 text-lg opacity-90">Chương 1: Mệnh đề & Tập hợp</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-teal-50 rounded-2xl text-center">
                  <HelpCircle className="mx-auto text-teal-600 mb-2" />
                  <p className="text-xs text-teal-800 font-bold uppercase">8 Câu hỏi</p>
                </div>
                <div className="p-4 bg-teal-50 rounded-2xl text-center">
                  <Timer className="mx-auto text-teal-600 mb-2" />
                  <p className="text-xs text-teal-800 font-bold uppercase">30s / Câu</p>
                </div>
                <div className="p-4 bg-teal-50 rounded-2xl text-center">
                  <BrainCircuit className="mx-auto text-teal-600 mb-2" />
                  <p className="text-xs text-teal-800 font-bold uppercase">Đa dạng</p>
                </div>
              </div>
              <button
                onClick={startGame}
                className="w-full py-5 bg-teal-600 text-white rounded-2xl text-xl font-black shadow-lg shadow-teal-200 hover:bg-teal-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
              >
                BẮT ĐẦU NGAY <ArrowRight />
              </button>
            </div>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl w-full"
          >
            {/* Header Info */}
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-teal-100 flex items-center justify-center font-black text-teal-600 text-xl">
                  {currentQuestionIndex + 1}
                </div>
                <div>
                  <p className="text-xs font-bold text-teal-600 uppercase tracking-widest">{currentQuestion.topic}</p>
                  <div className="flex gap-1 mt-1">
                    {questions.map((_, idx) => (
                      <div 
                        key={idx} 
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-300",
                          idx === currentQuestionIndex ? "w-8 bg-teal-500" : 
                          idx < currentQuestionIndex ? "w-4 bg-teal-200" : "w-4 bg-slate-200"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-2xl font-black shadow-sm border",
                timeLeft < 10 ? "bg-red-50 text-red-600 border-red-100 animate-pulse" : "bg-white text-teal-600 border-teal-100"
              )}>
                <Timer size={20} />
                {timeLeft}s
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-teal-50 overflow-hidden">
              <div className="p-8 sm:p-10">
                <MathRenderer 
                  content={currentQuestion.content} 
                  className="text-2xl sm:text-3xl font-bold text-slate-800 leading-relaxed" 
                />

                {currentQuestion.image === 'venn-diagram' && (
                  <div className="mt-6 flex justify-center">
                    <svg width="200" height="120" viewBox="0 0 200 120" className="bg-teal-50/50 rounded-xl p-4">
                      <circle cx="70" cy="60" r="40" fill="rgba(20, 184, 166, 0.2)" stroke="#0d9488" strokeWidth="2" />
                      <circle cx="130" cy="60" r="40" fill="white" stroke="#0d9488" strokeWidth="2" />
                      <path d="M 70 20 A 40 40 0 0 0 70 100 A 40 40 0 0 0 94.5 91.5 A 40 40 0 0 1 94.5 28.5 A 40 40 0 0 0 70 20" fill="#14b8a6" />
                      <text x="50" y="65" fontSize="16" fontWeight="bold" fill="#042f2e">A</text>
                      <text x="145" y="65" fontSize="16" fontWeight="bold" fill="#042f2e">B</text>
                    </svg>
                  </div>
                )}
                
                {renderQuestionContent()}

                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-6 bg-teal-50 rounded-2xl border border-teal-100"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-teal-600 text-white rounded-lg mt-1">
                        <BookOpen size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-teal-900 mb-1">Giải thích:</h4>
                        <MathRenderer content={currentQuestion.explanation} className="text-teal-800 leading-relaxed" />
                      </div>
                    </div>
                    <button
                      onClick={nextQuestion}
                      className="w-full mt-6 py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 flex items-center justify-center gap-2"
                    >
                      {currentQuestionIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}
                      <ChevronRight size={20} />
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {gameState === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-teal-100 p-12 text-center"
          >
            <div className="inline-block p-6 bg-teal-100 text-teal-600 rounded-full mb-6">
              <Trophy size={64} />
            </div>
            <h2 className="text-4xl font-black text-slate-800 mb-2">HOÀN THÀNH!</h2>
            <p className="text-slate-500 mb-8 text-lg">Bạn đã hoàn thành bài luyện tập Chương 1</p>
            
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="p-6 bg-teal-50 rounded-3xl border border-teal-100">
                <p className="text-sm font-bold text-teal-600 uppercase mb-1">Điểm số</p>
                <p className="text-5xl font-black text-teal-900">{score}/{questions.length}</p>
              </div>
              <div className="p-6 bg-teal-50 rounded-3xl border border-teal-100">
                <p className="text-sm font-bold text-teal-600 uppercase mb-1">Tỉ lệ</p>
                <p className="text-5xl font-black text-teal-900">{Math.round((score / questions.length) * 100)}%</p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={startGame}
                className="w-full py-5 bg-teal-600 text-white rounded-2xl text-xl font-black shadow-lg shadow-teal-200 hover:bg-teal-700 flex items-center justify-center gap-3"
              >
                <RotateCcw /> CHƠI LẠI
              </button>
              <p className="text-slate-400 text-sm">Hãy tiếp tục rèn luyện để đạt kết quả tốt nhất!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
