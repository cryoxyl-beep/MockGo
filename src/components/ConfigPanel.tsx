import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Sliders, 
  HelpCircle, 
  Zap, 
  GraduationCap, 
  Clock,
  Award
} from 'lucide-react';
import { PDFFile } from '../types';
import { motion } from 'motion/react';

interface ConfigPanelProps {
  pdfs: PDFFile[];
  preselectedPdfId?: string | null;
  onClose: () => void;
  onGenerate: (config: {
    title: string;
    sourcePdfId?: string;
    sourcePdfName?: string;
    questionCount: number;
    difficulty: 'easy' | 'medium' | 'hard';
    timeLimit: number;
    markingScheme: { correct: number; incorrect: number };
    subject: string;
  }) => void;
}

export default function ConfigPanel({
  pdfs,
  preselectedPdfId,
  onClose,
  onGenerate
}: ConfigPanelProps) {
  const defaultPdf = pdfs.find(p => p.id === preselectedPdfId) || pdfs[0];

  const [selectedPdfId, setSelectedPdfId] = useState<string>(defaultPdf?.id || 'none');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [timeLimit, setTimeLimit] = useState<number>(10);
  const [markingCorrect, setMarkingCorrect] = useState<number>(4);
  const [markingIncorrect, setMarkingIncorrect] = useState<number>(-1);
  const [customTitle, setCustomTitle] = useState<string>('');

  const handleCreateAndCompile = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Determine subject and title
    const activePdf = pdfs.find(p => p.id === selectedPdfId);
    const subject = activePdf ? activePdf.subject : 'Academic Study';
    const sourcePdfName = activePdf ? activePdf.name : undefined;
    
    // Default Title generator
    const title = customTitle.trim() || 
      `${subject} Mock Test: ${difficulty.toUpperCase()} Setup (${questionCount}Qs)`;

    onGenerate({
      title,
      sourcePdfId: selectedPdfId !== 'none' ? selectedPdfId : undefined,
      sourcePdfName,
      questionCount,
      difficulty,
      timeLimit,
      markingScheme: {
        correct: markingCorrect,
        incorrect: markingIncorrect
      },
      subject
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl bg-[#0C0C0C] border border-[#1F1F1F] rounded-2xl shadow-2xl p-6 md:p-8 relative select-none font-sans text-[#EDEDED]"
      >
        
        {/* Floating header close trigger */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1.5 rounded text-[#555] hover:text-white hover:bg-[#121212] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header visual branding */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded bg-[#121212] border border-[#222] flex items-center justify-center">
            <Sliders className="w-5 h-5 text-[#888]" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-xl text-white tracking-tight flex items-center gap-2">
              <span>Exam Calibration Hub</span>
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            </h3>
            <p className="font-mono text-[9px] text-[#555] uppercase tracking-widest font-bold">Configure syllabus parameters</p>
          </div>
        </div>

        <form onSubmit={handleCreateAndCompile} className="space-y-6">
          
          {/* 1. SOURCE SELECTOR */}
          <div>
            <label className="block font-mono text-[9px] text-[#555] font-bold uppercase tracking-widest mb-2">
              1. Primary PDF Catalog Linkage
            </label>
            <select
              id="config-pdf-select"
              value={selectedPdfId}
              onChange={(e) => setSelectedPdfId(e.target.value)}
              className="w-full bg-[#121212] border border-[#1F1F1F] focus:border-[#333] rounded p-3 text-xs text-[#EDEDED] outline-none"
            >
              <option value="none">Choose source from directory...</option>
              {pdfs.map((pdf) => (
                <option key={pdf.id} value={pdf.id}>
                  {pdf.name} ({pdf.subject})
                </option>
              ))}
            </select>
          </div>

          {/* Optional custom title input */}
          <div>
            <label className="block font-mono text-[9px] text-[#555] font-bold uppercase tracking-widest mb-2">
              Custom Title / Academic Tag (Optional)
            </label>
            <input
              id="config-title-input"
              type="text"
              placeholder="e.g. Midterm Mechanics Special, Organic Review, CUET Mock..."
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full bg-[#121212] border border-[#1F1F1F] focus:border-[#333] rounded p-3 text-xs text-[#EDEDED] placeholder-[#555] outline-none"
            />
          </div>

          {/* 2. QUESTION COUNT SELECTOR & DIFFICULT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Question count setter using compact grid buttons */}
            <div>
              <label className="block font-mono text-[9px] text-[#555] font-bold uppercase tracking-widest mb-2.5">
                2. Question Density ({questionCount} Items)
              </label>
              <div className="flex gap-1 bg-[#121212] p-1 rounded border border-[#1F1F1F]">
                {[3, 5, 10, 15].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setQuestionCount(count)}
                    className={`flex-1 py-1.5 rounded font-mono text-xs font-bold transition-all ${
                      questionCount === count 
                        ? 'bg-[#1A1A1A] text-white border border-[#222]' 
                        : 'text-[#555] hover:text-[#888] bg-transparent'
                    }`}
                  >
                    {count}Q
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty selector pills */}
            <div>
              <label className="block font-mono text-[9px] text-[#555] font-bold uppercase tracking-widest mb-2.5">
                3. Analytical Level
              </label>
              <div className="flex gap-1 bg-[#121212] p-1 rounded border border-[#1F1F1F]">
                {['easy', 'medium', 'hard'].map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff as any)}
                    className={`flex-1 py-1.5 rounded font-sans text-xs font-bold uppercase tracking-wider capitalize transition-all ${
                      difficulty === diff 
                        ? 'bg-[#1A1A1A] text-white border border-[#222]' 
                        : 'text-[#555] hover:text-[#888] bg-transparent'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* 3. TIME LIMIT SLIDER & MARKING SCHEME */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
            
            {/* Time limit setter */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-mono text-[9px] text-[#555] font-bold uppercase tracking-widest">
                  4. Time Bound Constraints
                </label>
                <span className="font-mono text-xs text-[#EDEDED] font-bold">{timeLimit} Minutes</span>
              </div>
              <input
                id="config-time-range"
                type="range"
                min="3"
                max="60"
                step="1"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className="w-full h-1 bg-[#121212] accent-white rounded appearance-none cursor-pointer border border-[#1F1F1F]"
              />
              <div className="flex justify-between text-[8px] font-mono text-[#555] mt-1 font-bold">
                <span>3m</span>
                <span>30m</span>
                <span>60m</span>
              </div>
            </div>

            {/* Marking Scheme options */}
            <div>
              <label className="block font-mono text-[9px] text-[#555] font-bold uppercase tracking-widest mb-2.5">
                5. System Evaluation Matrix
              </label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <div className="flex items-center bg-[#121212] rounded border border-[#1F1F1F] overflow-hidden text-xs">
                    <span className="bg-[#121212] px-2 py-1.5 text-[#555] border-r border-[#1F1F1F] font-mono font-bold">+</span>
                    <input
                      type="number"
                      value={markingCorrect}
                      onChange={(e) => setMarkingCorrect(Number(e.target.value))}
                      className="w-full bg-transparent px-2.5 text-white outline-none font-mono"
                    />
                  </div>
                  <span className="text-[8px] font-mono text-[#555] font-bold block mt-1 uppercase tracking-widest">Correct Answer</span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center bg-[#121212] rounded border border-[#1F1F1F] overflow-hidden text-xs">
                    <span className="bg-[#121212] px-2.5 py-1.5 text-[#555] border-r border-[#1F1F1F] font-mono font-bold">-</span>
                    <input
                      type="number"
                      value={Math.abs(markingIncorrect)}
                      onChange={(e) => setMarkingIncorrect(-Math.abs(Number(e.target.value)))}
                      className="w-full bg-transparent px-2.5 text-white outline-none font-mono"
                    />
                  </div>
                  <span className="text-[8px] font-mono text-[#555] font-bold block mt-1 uppercase tracking-widest">Incorrect Penalty</span>
                </div>
              </div>
            </div>

          </div>

          <div className="p-4 bg-[#121212]/50 rounded-xl border border-[#1F1F1F] flex gap-3 text-xs">
            <Award className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-sans font-bold text-[#EDEDED]">Intelligent Calibration Pipeline</p>
              <p className="font-sans text-[#888] leading-relaxed font-light mt-0.5">
                Each mock is generated in real-time. Questions are selected from mapped PYQ vectors and paired with complete academic explanation notes for review.
              </p>
            </div>
          </div>

          {/* Trigger compiler */}
          <button
            id="config-submit-btn"
            type="submit"
            className="w-full py-3.5 bg-white text-black font-sans text-xs font-bold rounded flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:scale-[1.01]"
          >
            <Zap className="w-3.5 h-3.5 fill-current text-black" />
            <span>Generate & Start Mock Exam</span>
          </button>

        </form>

      </motion.div>
    </div>
  );
}
