import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause, X, Maximize2, Gauge, Info, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Waveform = ({ audioPath, isExpanded, speed, isPlaying, setIsPlaying }) => {
  const containerRef = useRef();
  const wavesurfer = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!containerRef.current) return;
      if (wavesurfer.current) wavesurfer.current.destroy();

      wavesurfer.current = WaveSurfer.create({
        container: containerRef.current,
        waveColor: '#d1d5db',
        progressColor: '#6B7F6D',
        cursorColor: '#C68E6B',
        barWidth: 2,
        barGap: 3,
        barRadius: 10,
        height: isExpanded ? 140 : 60,
        url: audioPath,
        normalize: true,
        interact: true,
      });

      wavesurfer.current.on('play', () => setIsPlaying(true));
      wavesurfer.current.on('pause', () => setIsPlaying(false));
      wavesurfer.current.on('ready', () => {
        setIsReady(true);
        wavesurfer.current.setPlaybackRate(speed);
      });
    }, 600); 

    return () => {
      clearTimeout(timer);
      if (wavesurfer.current) wavesurfer.current.destroy();
    };
  }, [audioPath, isExpanded]);

  useEffect(() => {
    if (wavesurfer.current && isReady) {
      isPlaying ? wavesurfer.current.play().catch(() => {}) : wavesurfer.current.pause();
    }
  }, [isPlaying, isReady]);

  useEffect(() => {
    if (wavesurfer.current) wavesurfer.current.setPlaybackRate(speed);
  }, [speed]);

  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: isReady ? 1 : 0 }} transition={{ duration: 0.5 }} ref={containerRef} className="w-full" />;
};

export default function DiagnosisCard({ title, audioPath, clinicalNote, isQuizMode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showHint, setShowHint] = useState(false);

  const spring = { type: "spring", stiffness: 200, damping: 25 };

  const toggleSpeed = (e) => {
    e.stopPropagation();
    const speeds = [1, 0.75, 0.5]; // New speed array
    const currentIndex = speeds.indexOf(speed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setSpeed(speeds[nextIndex]);
  };

  const handleClose = (e) => {
    e?.stopPropagation();
    setIsPlaying(false);
    setIsExpanded(false);
    setShowHint(false);
  };

  return (
    <>
      <motion.div
        layoutId={`card-${audioPath}`}
        transition={spring}
        onClick={() => setIsExpanded(true)}
        className="bg-white/90 backdrop-blur-xl border border-white p-7 rounded-[2.5rem] shadow-xl cursor-pointer flex flex-col h-full min-h-[340px] relative overflow-hidden group"
      >
        <div className="flex justify-between items-start mb-2 relative z-10">
          <motion.div layout="position">
            <h3 className="text-xl font-bold text-vet-dark leading-tight">{isQuizMode ? "???" : title}</h3>
            <p className="text-vet-sage text-[10px] font-bold uppercase tracking-[0.2em] mt-2 block opacity-60">Canine Specimen</p>
          </motion.div>
          <Maximize2 size={18} className="text-stone-200 group-hover:text-vet-clay transition-colors shrink-0" />
        </div>

        <div className="my-6 h-[70px] flex items-center bg-stone-50/50 rounded-[1.5rem] px-3 border border-stone-100/30 overflow-hidden relative z-10">
          {!isExpanded && <Waveform audioPath={audioPath} isExpanded={false} speed={speed} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />}
        </div>

        <div className="flex items-center gap-5 mt-auto relative z-10">
          <motion.div layout="position" className="h-12 w-12 rounded-full bg-vet-dark text-white flex items-center justify-center shrink-0 shadow-lg">
            <button onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}>
              {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} className="ml-1" fill="white" />}
            </button>
          </motion.div>
          {!isQuizMode && <p className="text-[11px] text-stone-400 font-medium italic line-clamp-2 leading-relaxed">{clinicalNote}</p>}
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} className="absolute inset-0 bg-vet-dark/40 backdrop-blur-md" />

            <motion.div
              layoutId={`card-${audioPath}`}
              transition={spring}
              className="bg-white w-full max-w-4xl h-[95vh] md:h-auto p-6 md:p-12 rounded-t-[3rem] md:rounded-[3rem] shadow-2xl relative z-20 flex flex-col overflow-hidden"
            >
              <button onClick={handleClose} className="absolute top-8 right-8 p-2 bg-stone-100 rounded-full z-30"><X size={24} /></button>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col h-full overflow-hidden">
                <div className="mb-8 pr-12">
                  <h3 className="text-3xl md:text-5xl font-semibold text-vet-dark tracking-tighter">{isQuizMode && !showHint ? "Specimen Analysis" : title}</h3>
                  <p className="text-vet-clay text-[10px] font-black uppercase tracking-widest mt-2">Auscultation Diagnostic</p>
                </div>

                <div className="bg-stone-50 p-6 md:p-10 rounded-[2.5rem] mb-8 border border-stone-100 min-h-[160px] md:min-h-[240px] flex items-center overflow-hidden">
                  <Waveform audioPath={audioPath} isExpanded={true} speed={speed} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
                </div>

                <div className="flex flex-col flex-1 min-h-0">
                  <div className="flex gap-4 mb-8 shrink-0">
                    <button onClick={() => setIsPlaying(!isPlaying)} className="h-20 w-20 rounded-full bg-vet-dark text-white flex items-center justify-center shadow-xl shrink-0">
                      {isPlaying ? <Pause size={32} fill="white" /> : <Play size={32} className="ml-1" fill="white" />}
                    </button>
                    <button onClick={toggleSpeed} className="flex-1 h-20 rounded-full border-2 border-stone-100 flex items-center justify-center gap-3 bg-white hover:bg-stone-50 transition-colors">
                      <Gauge size={20} className="text-vet-clay" />
                      <span className="text-sm font-bold">{speed}x Analysis Speed</span>
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto bg-vet-cream rounded-[2.2rem] border border-vet-sage/10 p-8 shadow-inner custom-scrollbar">
                    <div className="flex items-center justify-between mb-4 sticky top-0 bg-vet-cream/90 backdrop-blur-md py-1 z-10">
                      <div className="flex items-center gap-2 text-vet-sage uppercase text-[10px] font-black tracking-widest"><Info size={16} /> Clinical Reference</div>
                      {isQuizMode && (
                        <button onClick={() => setShowHint(!showHint)} className="text-[10px] font-bold text-vet-clay uppercase border-b-2 border-vet-clay/30 pb-1">
                          {showHint ? <EyeOff size={14} className="inline mr-1" /> : <Eye size={14} className="inline mr-1" />}
                          {showHint ? "Hide Answer" : "Reveal Answer"}
                        </button>
                      )}
                    </div>
                    
                    <AnimatePresence mode="wait">
                      {(showHint || !isQuizMode) ? (
                        <motion.p key="ans" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-lg md:text-2xl text-stone-700 italic leading-relaxed font-serif">
                          {clinicalNote}
                        </motion.p>
                      ) : (
                        <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center py-12 text-stone-300 italic text-sm border-2 border-dashed border-stone-200 rounded-[2rem] text-center">
                           Determine the diagnosis to solve the quiz.
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}