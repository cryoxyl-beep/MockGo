import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Check, 
  AlertCircle, 
  Trash2, 
  RefreshCw
} from 'lucide-react';
import { PDFFile } from '../types';
import { motion } from 'motion/react';
import { connectGoogleDrive } from '../services/drive';

interface UploadViewProps {
  pdfs: PDFFile[];
  onAddPdf: (pdf: Omit<PDFFile, 'id' | 'uploadDate'>) => void;
  onRemovePdf: (id: string) => void;
  onOpenConfig: (sourcePdfId?: string) => void;
  googleDriveConnected?: boolean;
  setGoogleDriveConnected?: (connected: boolean) => void;
  fetchingDrivePdfs?: boolean;
  onRefreshDrivePdfs?: () => Promise<void>;
}

export default function UploadView({
  pdfs,
  onAddPdf,
  onRemovePdf,
  onOpenConfig,
  googleDriveConnected = false,
  setGoogleDriveConnected,
  fetchingDrivePdfs = false,
  onRefreshDrivePdfs
}: UploadViewProps) {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [driveEmail, setDriveEmail] = useState<string | null>(() => localStorage.getItem("drive_email"));
  const [driveName, setDriveName] = useState<string | null>(() => localStorage.getItem("drive_name"));
  const [syncingDrive, setSyncingDrive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDriveEmail(localStorage.getItem("drive_email"));
    setDriveName(localStorage.getItem("drive_name"));
  }, [googleDriveConnected]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processUploadedFile = (name: string, sizeBytes: number) => {
    const megabytes = (sizeBytes / (1024 * 1024)).toFixed(1);
    const sizeStr = `${megabytes} MB`;
    const subjects = ['Physics', 'Chemistry', 'Biology', 'General Aptitude', 'Math'];
    const chosenSubject = subjects[Math.floor(Math.random() * subjects.length)];
    
    onAddPdf({
      name,
      size: sizeStr,
      status: 'processing',
      pageCount: Math.floor(Math.random() * 15) + 10,
      subject: chosenSubject,
      topics: ['Analyzing Chapters', 'Parsing Schema']
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processUploadedFile(file.name, file.size);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processUploadedFile(file.name, file.size);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleConnectGoogleDrive = async () => {
    setSyncingDrive(true);
    try {
      const success = await connectGoogleDrive();
      if (success) {
        if (setGoogleDriveConnected) {
          setGoogleDriveConnected(true);
        }
        setDriveEmail(localStorage.getItem("drive_email"));
        setDriveName(localStorage.getItem("drive_name"));
        if (onRefreshDrivePdfs) {
          await onRefreshDrivePdfs();
        }
      }
    } catch (err) {
      console.error("Drive error:", err);
    } finally {
      setSyncingDrive(false);
    }
  };

  const handleManualRefresh = async () => {
    if (onRefreshDrivePdfs) {
      setSyncingDrive(true);
      await onRefreshDrivePdfs();
      setSyncingDrive(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#090909] text-[#EDEDED] p-10 min-h-screen relative font-sans">
      
      {/* Top details */}
      <div className="mb-10 pb-6 border-b border-[#1F1F1F]">
        <span className="font-mono text-[9px] text-[#555] font-bold uppercase tracking-widest">
          Syllabus Intake & Mining
        </span>
        <h2 className="font-sans font-bold text-3xl text-white tracking-tight mt-1">
          Syllabus Library
        </h2>
        <p className="font-sans text-xs text-[#888] mt-1 max-w-xl leading-relaxed">
          Instantly integrate standard PYQ source catalogs. Our neural tokens parser divides questions, symbols, and mathematical keys automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left main: Large Drag and Drop Zone */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-sans font-bold text-base text-white tracking-tight block">Upload New Question Source</span>
              {googleDriveConnected && driveEmail && (
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] bg-emerald-950/20 text-emerald-400 border border-emerald-900/40 px-2.5 py-1 rounded">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span>Linked Workspace: <strong className="text-[#EDEDED]">{driveEmail}</strong> {driveName ? `(${driveName})` : ''}</span>
                </span>
              )}
            </div>
            
            <button
              id="upload-google-drive-btn"
              onClick={handleConnectGoogleDrive}
              disabled={syncingDrive}
              className={`font-sans text-xs px-3.5 py-2 rounded border transition-all flex items-center gap-2 ${
                googleDriveConnected 
                  ? 'bg-zinc-900 border-[#1F1F1F] text-[#888] hover:text-white' 
                  : 'bg-white text-black border-transparent font-bold shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:scale-[1.01]'
              }`}
            >
              {syncingDrive ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46  2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
                </svg>
              )}
              <span>{syncingDrive ? 'Syncing...' : googleDriveConnected ? 'Browse Connected Drive' : 'Sync Google Drive'}</span>
            </button>
          </div>

          <form 
            id="drag-drop-form"
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            className={`p-10 rounded-2xl border border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer min-h-[250px] relative overflow-hidden bg-[#0C0C0C] ${
              dragActive 
                ? 'border-[#333] bg-[#121212]' 
                : 'border-[#1F1F1F] hover:border-[#333] hover:bg-[#0C0C0C]/80 shadow-2xl'
            }`}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".pdf"
              className="hidden"
              onChange={handleFileInput}
            />

            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-4 transition-transform group-hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.15)]">
              <UploadCloud className="w-6 h-6 text-black stroke-[2.5]" />
            </div>

            <p className="font-sans font-semibold text-sm text-[#EDEDED] mb-1">
              Select or Drag the Exam Paper PDF
            </p>
            <p className="font-sans text-xs text-[#555] max-w-sm mb-4 leading-relaxed font-semibold">
              Standard format JEE, CUET, NEET or UPSC previous papers supported. File size under 40MB.
            </p>
            
            <span className="font-mono text-[9px] text-[#888] bg-[#121212] border border-[#222] py-1.5 px-3 rounded uppercase tracking-widest font-bold">
              Browse Local System
            </span>
          </form>

          {/* Real Google Drive PDFs lists or Local uploaded files depending on connection status */}
        </div>

        {/* Right column: Current catalog listing */}
        <div className="space-y-6">
          <div className="flex items-center justify-between font-sans">
            <h3 className="font-sans font-bold text-base text-white tracking-tight">
              Drive PDFs {googleDriveConnected && pdfs.length > 0 ? `(${pdfs.length})` : ''}
            </h3>
            {googleDriveConnected && (
              <button 
                onClick={handleManualRefresh}
                disabled={syncingDrive || fetchingDrivePdfs}
                className="text-[#888] hover:text-white flex items-center gap-1.5 transition-colors group cursor-pointer text-xs"
                title="Refresh PDF list"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${fetchingDrivePdfs || syncingDrive ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                <span className="font-mono text-[9px] font-bold uppercase">Sync</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {googleDriveConnected ? (
              fetchingDrivePdfs || syncingDrive ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3 text-center border border-[#1F1F1F] rounded-xl bg-[#0C0C0C]/40">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#888]" />
                  <p className="font-sans text-xs text-[#888]">Fetching files from Google Drive...</p>
                </div>
              ) : pdfs.length === 0 ? (
                <div className="p-8 text-center text-[#555] font-sans text-xs border border-dashed border-[#1F1F1F] py-10 rounded-xl leading-relaxed">
                  No PDFs found in connected Google Drive.
                </div>
              ) : (
                pdfs.map((pdf) => {
                  return (
                    <div
                      key={pdf.id}
                      className="p-4 rounded-xl bg-[#0C0C0C] border border-[#1F1F1F] relative overflow-hidden transition-all hover:border-[#333] shadow-2xl"
                    >
                      <div className="flex items-start gap-3 justify-between">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <FileText className="w-4 h-4 mt-0.5 shrink-0 text-red-500 stroke-[1.8]" />
                          <div className="min-w-0 font-sans">
                            <p className="font-sans font-semibold text-xs text-[#EDEDED] truncate" title={pdf.name}>
                              {pdf.name}
                            </p>
                            <p className="font-mono text-[9px] text-[#555] font-bold">
                              {pdf.size} &middot; {pdf.subject}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => onRemovePdf(pdf.id)}
                          className="p-1 rounded text-[#555] hover:text-red-400 hover:bg-[#121212] transition-colors shrink-0"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="mt-4 pt-3.5 border-t border-[#1F1F1F] flex flex-wrap gap-1.5 items-center justify-between">
                        <div className="flex items-center gap-1.5 leading-none">
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="font-mono text-[9px] text-[#888] font-bold uppercase tracking-widest">
                            Modified: {pdf.uploadDate}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => onOpenConfig(pdf.id)}
                          className="font-mono text-[9px] bg-white text-black font-bold px-3 py-1.5 rounded shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:scale-[1.01] transition-all cursor-pointer"
                        >
                          Launch AI Calibration
                        </button>
                      </div>

                      {pdf.topics && pdf.topics.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1">
                          {pdf.topics.map((top, idx) => (
                            <span 
                              key={idx} 
                              className="text-[9px] font-sans font-semibold px-2 py-0.5 bg-[#121212] text-[#888] rounded border border-[#1F1F1F]"
                            >
                              {top}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )
            ) : (
              <div className="p-10 text-center text-[#555] font-sans text-xs border border-dashed border-[#1F1F1F] py-12 rounded-xl flex flex-col items-center justify-center gap-3">
                <svg className="w-8 h-8 text-zinc-700" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46  2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
                </svg>
                <span>No PDFs found in connected Google Drive. Sync Google Drive to search and load study materials.</span>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
