import React, { useState, useEffect } from 'react';
import HeroSection from './components/HeroSection.jsx';
import Workstation from './components/Workstation.jsx';
import IsroLoadingSequence from './components/IsroLoadingSequence.jsx';

export default function App() {
  const [isLoadingComplete, setIsLoadingComplete] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('nointro') === '1' || params.get('skip_intro') === '1') {
        const cleanUrl = window.location.pathname + (window.location.hash || '');
        window.history.replaceState({}, document.title, cleanUrl);
        return true;
      }
    }
    return false;
  });

  const [activeModality, setActiveModality] = useState('single');

  const scrollToWorkstation = (modality = null) => {
    if (modality) {
      setActiveModality(modality);
    }
    const targetElement = document.getElementById('workstation-viewport');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToHero = () => {
    const heroElement = document.getElementById('hero-viewport');
    if (heroElement) {
      heroElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReplayIntro = () => {
    setIsLoadingComplete(false);
  };

  useEffect(() => {
    if (window.location.hash === '#workstation-viewport' || window.location.search.includes('view=workstation')) {
      const el = document.getElementById('workstation-viewport');
      if (el) {
        window.scrollTo({ top: el.offsetTop, behavior: 'auto' });
      }
    }
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#020617] text-slate-100 overflow-x-hidden">
      {/* 1. Cinematic ISRO Satellite Ground-Station Loading Sequence */}
      {!isLoadingComplete && (
        <IsroLoadingSequence onComplete={() => {
          setIsLoadingComplete(true);
          window.scrollTo({ top: 0, behavior: 'instant' });
        }} />
      )}

      {/* 2. Direct Workstation & Portal Access (No Login Gate) */}
      {isLoadingComplete && (
        <>
          {/* Viewport 1: Space Entry Portal Landing Page */}
          <HeroSection 
            onGetStarted={() => scrollToWorkstation()}
            onSelectModality={(modalityId) => scrollToWorkstation(modalityId)}
          />

          {/* Viewport 2: Single-Viewport 3-Pane Engineering Workstation */}
          <Workstation 
            activeModality={activeModality}
            onBackToHero={scrollToHero}
            onReplayIntro={handleReplayIntro}
          />
        </>
      )}
    </div>
  );
}
