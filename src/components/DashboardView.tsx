import React, { useState } from 'react';
import { 
  Plus, 
  Sparkles, 
  FileText, 
  Brain, 
  Award, 
  BarChart3, 
  ArrowUpRight, 
  AlertCircle,
  Play,
  RotateCcw,
  CheckCircle2,
  FolderOpen,
  ArrowRight,
  Database
} from 'lucide-react';
import { MockTest, PDFFile } from '../types';
import { motion } from 'motion/react';

interface DashboardViewProps {
  mocks: MockTest[];
  pdfs: PDFFile[];
  onStartMock: (mockId: string) => void;
  onViewResults: (mockId: string) => void;
  onOpenConfig: (sourcePdfId?: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function DashboardView({
  mocks,
  pdfs,
  onStartMock,
  onViewResults,
  onOpenConfig,
  setActiveTab
}: DashboardViewProps) {
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [connectingDrive, setConnectingDrive] = useState(false);
  const [driveConnected, setDriveConnected] = useState(false);

  // Compute stats
  const totalMocks = mocks.length;
  const attemptedMocks = mocks.filter(m => m.hasAttempted);
  const attemptedCount = attemptedMocks.length;
  
  const averageAccuracy = attemptedCount > 0 
    ? Math.round(attemptedMocks.reduce((acc, m) => acc + (m.bestScore?.accuracy || 0), 0) / attemptedCount) 
    : 0;

  const totalPointsEarned = attemptedMocks.reduce((acc, m) => acc + (m.bestScore?.score || 0), 0);
  const maxPossiblePoints = attemptedMocks.reduce((acc, m) => acc + (m.bestScore?.maxScore || 0), 0);

  // Core subjects listed
  const subjects = ['all', ...Array.from(new Set(mocks.map(m => m.subject)))];

  const filteredMocks = selectedSubjectFilter === 'all' 
    ? mocks 
    : mocks.filter(m => m.subject === selectedSubjectFilter);

  const simulateGoogleDriveConnect = () => {
    setConnectingDrive(true);
    setTimeout(() => {
      setConnectingDrive(false);
      setDriveConnected(true);
      // Navigate to upload tab so they can see the files or import them
      setActiveTab('upload');
    }, 1200);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#090909] text-[#EDEDED] p-10 min-h-screen font-sans">
      
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-[#1F1F1F]">
        <div>
          <span className="font-mono text-[9px] text-[#555] font-bold uppercase tracking-widest">
            Institutional Control Center
          </span>
          <h2 className="font-sans font-bold text-3xl text-white tracking-tight mt-1">
            Sandbox Intelligence
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="dash-upload-nav-btn"
            onClick={() => setActiveTab('upload')}
            className="px-4 py-2 bg-[#121212] border border-[#222] hover:border-[#333] text-[#888] hover:text-white rounded font-sans text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Document</span>
          </button>
          
          <button
            id="dash-ai-builder-nav-btn"
            onClick={() => setActiveTab('ai-builder')}
            className="px-4 py-2 bg-white text-black hover:opacity-95 rounded font-sans text-xs font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:scale-[1.01] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>AI Builder</span>
          </button>
        </div>
      </div>

      {/* Bento Stats Block (Only show actual data if any tests have been built or attempted, otherwise keep a clean summary card) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        
        {/* KPI 1 */}
        <div className="p-6 bg-[#0C0C0C] border border-[#1F1F1F] rounded-2xl relative overflow-hidden transition-all hover:border-[#333]">
          <div className="flex justify-between items-start mb-4">
            <span className="font-mono text-[9px] text-[#555] font-bold uppercase tracking-widest">Tests Available</span>
            <div className="w-7 h-7 rounded bg-[#121212] border border-[#222] flex items-center justify-center">
              <Brain className="w-3.5 h-3.5 text-[#888]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-light text-white tracking-tighter">{totalMocks}</span>
            <span className="text-xs text-[#555] font-semibold">configurations</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-[#888]">
            <span className="text-[#34D399] font-bold">● {attemptedCount}</span>
            <span>Attempted</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-6 bg-[#0C0C0C] border border-[#1F1F1F] rounded-2xl relative overflow-hidden transition-all hover:border-[#333]">
          <div className="flex justify-between items-start mb-4">
            <span className="font-mono text-[9px] text-[#555] font-bold uppercase tracking-widest">Avg Accuracy</span>
            <div className="w-7 h-7 rounded bg-[#121212] border border-[#222] flex items-center justify-center">
              <Award className="w-3.5 h-3.5 text-[#888]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-light text-white tracking-tighter">{averageAccuracy}%</span>
            <span className="text-xs text-[#555] font-semibold">Correct Avg</span>
          </div>
          <div className="mt-4">
            <div className="h-1 bg-[#121212] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-400 to-rose-400 rounded-full transition-all duration-500"
                style={{ width: `${averageAccuracy}%` }}
              />
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-6 bg-[#0C0C0C] border border-[#1F1F1F] rounded-2xl relative overflow-hidden transition-all hover:border-[#333]">
          <div className="flex justify-between items-start mb-4">
            <span className="font-mono text-[9px] text-[#555] font-bold uppercase tracking-widest">Mastery Points</span>
            <div className="w-7 h-7 rounded bg-[#121212] border border-[#222] flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#888]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-light text-white tracking-tighter">{totalPointsEarned}</span>
            <span className="text-xs text-[#555] font-semibold">/ {maxPossiblePoints || 0} pts</span>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[10px] font-mono text-[#888]">
            <span>Active curriculum progress tracker</span>
          </div>
        </div>

        {/* KPI 4: Pure aesthetic vector Linear-style line graph */}
        <div className="p-6 bg-[#0C0C0C] border border-[#1F1F1F] rounded-2xl transition-all hover:border-[#333] flex flex-col justify-between">
          <div>
            <span className="font-mono text-[9px] text-[#555] font-bold uppercase tracking-widest block mb-1">Pulse Monitor</span>
            <span className="text-xs font-mono text-[#888]">Syllabus matching: {pdfs.length > 0 ? 'Optimal' : 'Pending Intake'}</span>
          </div>
          
          {/* Custom vector outline graph */}
          <div className="h-10 w-full mt-2 flex items-end">
            <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
              <path
                d="M 0 25 L 20 25 L 40 25 L 60 25 L 80 25 L 100 25"
                fill="none"
                stroke="#1F1F1F"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {totalMocks > 0 && (
                <path
                  d="M 0 25 Q 15 10 30 20 T 60 5 T 90 12 T 100 2"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.4)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </div>
        </div>
      </div>

      {/* Main Grid: Mocks left, PDFs right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Span 2): Mock Tests List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="font-sans font-bold text-lg text-white tracking-tight">
                Calibrated Mock Systems
              </h3>
            </div>

            {/* Aesthetic filters */}
            {subjects.length > 1 && (
              <div className="flex outline-none select-none rounded bg-[#0C0C0C] p-0.5 border border-[#1F1F1F]">
                {subjects.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubjectFilter(sub)}
                    className={`px-3 py-1 rounded text-[10px] font-mono tracking-wider transition-all uppercase ${
                      selectedSubjectFilter === sub 
                        ? 'bg-[#1A1A1A] text-white font-bold border border-[#222]' 
                        : 'text-[#555] hover:text-white'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            {filteredMocks.map((mock) => {
              return (
                <div
                  key={mock.id}
                  className="p-5 bg-[#0C0C0C] hover:bg-[#0F0F0F] border border-[#1F1F1F] hover:border-[#333] rounded-xl shadow-2xl transition-all duration-300 group flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 max-w-md">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[9px] font-bold px-2 py-0.5 bg-[#121212] rounded border border-[#222] text-[#888] uppercase tracking-widest">
                        {mock.subject}
                      </span>
                      <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-widest ${
                        mock.difficulty === 'hard' 
                          ? 'border-red-950 bg-red-950/20 text-red-400' 
                          : mock.difficulty === 'medium'
                            ? 'border-amber-950 bg-amber-950/10 text-amber-400'
                            : 'border-emerald-950 bg-emerald-950/10 text-emerald-400'
                      }`}>
                        {mock.difficulty}
                      </span>
                    </div>

                    <h4 className="font-sans font-bold text-base text-[#EDEDED] group-hover:text-white transition-colors">
                      {mock.title}
                    </h4>

                    {mock.sourcePdfName && (
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#555] font-semibold">
                        <FileText className="w-3 h-3" />
                        <span className="truncate max-w-xs">{mock.sourcePdfName}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions & Completion indicators */}
                  <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end border-t border-[#1F1F1F] md:border-t-0 pt-3 md:pt-0">
                    {mock.hasAttempted && mock.bestScore ? (
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <p className="font-mono text-[9px] text-[#555] uppercase tracking-widest font-bold">Best Score</p>
                          <p className="font-sans font-bold text-sm text-[#EDEDED]">
                            {mock.bestScore.score} <span className="text-[#555] font-light">/ {mock.bestScore.maxScore}</span>
                          </p>
                        </div>
                        <div className="h-8 w-[1px] bg-[#1F1F1F]" />
                        <div>
                          <p className="font-mono text-[9px] text-[#555] uppercase tracking-widest font-bold">Accuracy</p>
                          <p className="font-sans font-bold text-sm text-[#34D399]">
                            {mock.bestScore.accuracy}%
                          </p>
                        </div>
                        <button
                          onClick={() => onViewResults(mock.id)}
                          className="p-2 bg-[#121212] hover:bg-[#1A1A1A] rounded text-[#888] hover:text-white transition-colors border border-[#222] cursor-pointer"
                          title="View detailed scorecard"
                        >
                          <BarChart3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onStartMock(mock.id)}
                          className="px-3 py-1.5 bg-[#121212] hover:bg-[#1A1A1A] duration-200 rounded text-[#888] hover:text-white font-sans text-xs font-bold flex items-center gap-1.5 border border-[#222] cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Re-test</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onStartMock(mock.id)}
                        className="px-4 py-2 bg-white text-black rounded font-sans text-xs font-bold transition-all duration-200 flex items-center gap-2 group-hover:scale-[1.01] shadow-[0_0_15px_rgba(255,255,255,0.1)] cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Begin Evaluation</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* BEAUTIFUL SPACIOUS ONBOARDING EMPTY STATE - NO MOCK HISTORY YET */}
            {filteredMocks.length === 0 && (
              <div className="p-12 text-center rounded-2xl border border-dashed border-[#1F1F1F] bg-[#0A0A0A]/50 flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-12 h-12 rounded-xl bg-[#121212] border border-[#1F1F1F] flex items-center justify-center mb-6">
                  <Plus className="w-6 h-6 text-[#555]" />
                </div>
                <h4 className="font-sans font-bold text-lg text-white mb-2">No mock history yet</h4>
                <p className="font-sans text-xs text-[#888] max-w-sm mb-6 leading-relaxed">
                  You haven't generated or taken any custom tests. Use our AI Mock Builder to map chapter concepts into modular quizzes.
                </p>
                <button
                  onClick={() => setActiveTab('ai-builder')}
                  className="px-5 py-2.5 bg-[#121212] hover:bg-[#1A1A1A] border border-[#1F1F1F] rounded font-sans text-xs font-bold text-white transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Launch AI Mock Builder</span>
                  <ArrowRight className="w-3 h-3 text-[#888]" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Uploaded PDFs Quick Menu */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-sans font-bold text-lg text-white tracking-tight">
              Syllabus Library (PDFs)
            </h3>
            {pdfs.length > 0 && (
              <button
                onClick={() => setActiveTab('upload')}
                className="text-[#555] hover:text-white font-mono text-[9px] tracking-widest font-bold uppercase flex items-center gap-1 cursor-pointer"
              >
                <span>Manage</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="space-y-3 bg-[#0C0C0C] p-5 rounded-2xl border border-[#1F1F1F] shadow-2xl">
            {pdfs.map((pdf) => (
              <div
                key={pdf.id}
                className="p-3.5 rounded bg-[#0F0F0F] border border-[#1F1F1F] flex flex-col gap-2 transition-colors hover:bg-[#121212]"
              >
                <div className="flex items-start justify-between gap-3 font-sans">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-4 h-4 text-[#555] shrink-0" />
                    <span className="font-sans font-medium text-xs text-[#EDEDED] truncate" title={pdf.name}>
                      {pdf.name}
                    </span>
                  </div>
                  <span className="font-mono text-[8px] bg-[#121212] border border-[#222] text-[#888] px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 font-bold">
                    {pdf.pageCount} pgs
                  </span>
                </div>

                <div className="flex items-center justify-between mt-1.5 text-[10px] font-mono text-[#555] font-bold">
                  <span>{pdf.subject}</span>
                  <button
                    onClick={() => onOpenConfig(pdf.id)}
                    className="text-[#EDEDED] hover:text-white underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Build Mock</span>
                    <Plus className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            ))}

            {/* BEAUTIFUL SPACIOUS ONBOARDING EMPTY STATE - NO UPLOADS YET & CONNECT GOOGLE DRIVE CONNECT CTA */}
            {pdfs.length === 0 && (
              <div className="py-6 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-lg bg-[#121212] border border-[#1F1F1F] flex items-center justify-center mb-4 text-[#555]">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <h5 className="font-sans font-bold text-sm text-white mb-1">No uploads yet</h5>
                <p className="font-sans text-[11px] text-[#555] max-w-[200px] leading-relaxed mb-5">
                  Syllabus reference files are empty. Attach local files or link Drive files.
                </p>
                
                {/* primary onboarding CTA: Connect Google Drive to begin! */}
                <button
                  onClick={simulateGoogleDriveConnect}
                  disabled={connectingDrive}
                  className="w-full py-2.5 bg-white text-black font-semibold font-sans text-xs rounded shadow-lg flex items-center justify-center gap-2 hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  {connectingDrive ? (
                    <span className="h-3 w-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Database className="w-3.5 h-3.5 text-black" />
                  )}
                  <span>{connectingDrive ? 'Connecting...' : 'Connect Google Drive to begin'}</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('upload')}
                  className="mt-3 text-xs font-mono text-[#555] hover:text-white underline cursor-pointer"
                >
                  Or upload local PDFs
                </button>
              </div>
            )}
          </div>

          {/* Structured Guidance Box */}
          <div className="p-5 rounded-2xl bg-[#0C0C0C] border border-[#1F1F1F] flex gap-3 shadow-2xl">
            <AlertCircle className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-sans font-bold text-xs text-white mb-1">
                Awaiting Onboarding Setup
              </p>
              <p className="font-sans text-[11px] text-[#555] leading-relaxed font-light">
                Once standard question patterns are uploaded, our platform will dynamically suggest optimization paths here.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
