import React, { useState, useEffect } from 'react';
import DiagnosisCard from './components/DiagnosisCard';
import { Linkedin } from 'lucide-react'; // Import the icon
import { motion } from 'framer-motion';

function App() {
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [displayLibrary, setDisplayLibrary] = useState([]);

  const originalLibrary = [
    { title: "Normal Rhythm", audioPath: "/audio/normal.mp3", clinicalNote: "Pure S1 and S2 'lub-dub'. No murmurs, gallops, or clicks." },
    { title: "Aortic Stenosis", audioPath: "/audio/aortic_stenosis.mp3", clinicalNote: "Systolic crescendo-decrescendo murmur. Loudest at the left heart base." },
    { title: "Aortic Regurgitation", audioPath: "/audio/aortic_regurgitation.mp3", clinicalNote: "Diastolic decrescendo 'sighing' murmur. Look for bounding pulses." },
    { title: "Mitral Regurgitation", audioPath: "/audio/mitral_regurgitation.mp3", clinicalNote: "Holosystolic plateau murmur. Most common in small breeds; loudest at the left apex." },
    { title: "Mitral Stenosis", audioPath: "/audio/mitral_stenosis.mp3", clinicalNote: "Rare in dogs. A diastolic rumble best heard at the left apex with the bell." },
    { title: "Patent Ductus Arteriosus (PDA)", audioPath: "/audio/patent_ductus_arteriosus.mp3", clinicalNote: "Continuous 'machinery' murmur heard throughout both systole and diastole." },
    { title: "Atrial Fibrillation", audioPath: "/audio/atrial_fibrillation.mp3", clinicalNote: "Rapid, irregularly irregular rhythm. Often described as sounding like 'shoes in a dryer.' Pulse deficits are frequently present." },
    { title: "Mitral Valve Prolapse with Late Systolic Click", audioPath: "/audio/mitral_valve_prolapse_late-systolic_click.mp3", clinicalNote: "Mid-to-late systolic click. Often an early indicator of myxomatous mitral valve disease (endocardiosis) before a murmur develops." },
    { title: "Respiratory Arrhythmia", audioPath: "/audio/respiratory_arrythmia.mp3", clinicalNote: "Normal physiological finding in dogs. The heart rate increases during inspiration and decreases during expiration." },
    { title: "Ventricular Septal Defect (VSD)", audioPath: "/audio/ventricular_septal_defect.mp3", clinicalNote: "Harsh holosystolic murmur. Paradoxically, it is loudest on the right cranial sternal border despite being a left-to-right shunt." },
  ];
  

  useEffect(() => {
    if (isQuizMode) {
      const shuffled = [...originalLibrary].sort(() => Math.random() - 0.5);
      setDisplayLibrary(shuffled);
    } else {
      setDisplayLibrary(originalLibrary);
    }
  }, [isQuizMode]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow w-full max-w-7xl mx-auto px-6 py-10">
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-light text-vet-dark leading-tight">
              Auscultation <span className="italic font-serif text-vet-clay text-5xl block md:inline">Guide</span>
            </h1>
            <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Canine Cardiology Lab</p>
          </div>

          <button 
            onClick={() => setIsQuizMode(!isQuizMode)}
            className={`w-full md:w-auto px-8 py-4 rounded-full font-bold text-[10px] tracking-widest uppercase transition-all shadow-lg active:scale-95 ${
              isQuizMode ? 'bg-vet-clay text-white' : 'bg-white text-vet-sage border border-stone-100'
            }`}
          >
            {isQuizMode ? 'Stop Quiz & Reset' : 'Start Randomized Quiz'}
          </button>
        </header>
        
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayLibrary.map((item) => (
            <DiagnosisCard key={item.audioPath} {...item} isQuizMode={isQuizMode} />
          ))}
        </main>
      </div>

      {/* FOOTER WITH LINKEDIN ICON */}
      <footer className="w-full py-16 px-6 border-t border-stone-200/40 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
          

          <div className="text-center">
            <p className="text-stone-400 text-[9px] font-bold uppercase tracking-[0.5em] leading-loose">
              Created by Jyot Patel • DVM student at WSUCVM • © 2026 Auscultation Lab
            </p>
          </div>
                    <motion.a 
            href="https://www.linkedin.com/in/jyotpatel28/" // Replace with your link
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 bg-vet-dark text-white rounded-2xl shadow-lg hover:bg-vet-clay transition-colors group"
          >
            <Linkedin size={15} className="group-hover:animate-pulse" />
          </motion.a>
        </div>
      </footer>
    </div>
  );
}

export default App;