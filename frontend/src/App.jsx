import React, { useState, useEffect } from 'react';
import HeroSection from './components/HeroSection.jsx';
import ModelShowcase from './components/ModelShowcase.jsx';
import ModelDetailPage from './components/ModelDetailPage.jsx';
import MissionHub from './components/MissionHub.jsx';
import Workstation from './components/Workstation.jsx';
import LoginPage from './components/LoginPage.jsx';
import Footer from './components/Footer.jsx';
import { subscribeToAuth, logoutUser } from './firebase/authService';

export default function App() {
  const defaultUser = {
    name: 'Dr. Vikram S. Rao',
    rank: 'Level-4 Senior Geospatial Commander',
    clearance: 'ISRO SAC Level-4 Orbital Access'
  };

  const [authenticatedUser, setAuthenticatedUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('satquery_auth');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return null;
  });

  const [currentRoute, setCurrentRoute] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('satquery_auth');
      if (stored) {
        return 'hub'; // Authenticated users land directly in Mission Control Hub
      }
    }
    return 'home'; // Unauthenticated guests start at the public landing page
  });

  const [activeModality, setActiveModality] = useState('single');
  const [selectedModelDetail, setSelectedModelDetail] = useState(null);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [refreshSessionsTrigger, setRefreshSessionsTrigger] = useState(0);

  // Subscribe to real-time Firebase Auth state changes across sessions & page refreshes
  useEffect(() => {
    const unsubscribe = subscribeToAuth((realFirebaseUser) => {
      if (realFirebaseUser) {
        setAuthenticatedUser(realFirebaseUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('satquery_auth', JSON.stringify(realFirebaseUser));
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync real authenticated user with backend SQLite database
  useEffect(() => {
    if (authenticatedUser?.id) {
      const backendHttp = import.meta.env.VITE_BACKEND_URL || "http://localhost:7001";
      fetch(`${backendHttp}/api/history/users/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: authenticatedUser.id,
          email: authenticatedUser.email || '',
          name: authenticatedUser.name || '',
          rank: authenticatedUser.rank || 'Senior Geospatial Analyst'
        })
      }).catch(() => {});
    }
  }, [authenticatedUser]);

  // Authentication Handlers
  const handleLoginSuccess = (user) => {
    setAuthenticatedUser(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('satquery_auth', JSON.stringify(user));
    }
    setCurrentRoute('hub'); // Directly enter Mission Control Hub post-login
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.warn("Logout error:", e);
    }
    setAuthenticatedUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('satquery_auth');
    }
    setCurrentRoute('home');
    setSelectedModelDetail(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Launch Workstation from Hub or Preset with specific modality
  const handleLaunchWorkstation = (modalityId = 'single') => {
    setActiveModality(modalityId);
    if (!authenticatedUser) {
      setCurrentRoute('login');
      return;
    }
    setCurrentRoute('hub');
    setTimeout(() => {
      const el = document.getElementById('workstation-viewport');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleSelectModel = (modelId) => {
    setSelectedModelDetail(modelId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromDetail = () => {
    setSelectedModelDetail(null);
    setTimeout(() => {
      const el = document.getElementById('models-showcase');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleLaunchFromDetail = (modelId) => {
    setSelectedModelDetail(null);
    const modalityMap = {
      vqa: 'single',
      bitemporal: 'bitemporal',
      crossmodal: 'crossmodal'
    };
    const targetModality = modalityMap[modelId] || 'single';
    setActiveModality(targetModality);

    if (authenticatedUser) {
      setCurrentRoute('hub');
      setTimeout(() => {
        const el = document.getElementById('workstation-viewport');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } else {
      setCurrentRoute('login');
    }
  };

  // =========================================================================
  // VIEW 1: LOGIN PORTAL (Cosmic Split Screen)
  // =========================================================================
  if (currentRoute === 'login') {
    return (
      <LoginPage 
        onLoginSuccess={handleLoginSuccess} 
        onBack={() => setCurrentRoute('home')}
      />
    );
  }

  // =========================================================================
  // VIEW 2: DEDICATED MODEL DETAIL DEEP-DIVE
  // =========================================================================
  if (selectedModelDetail) {
    return (
      <ModelDetailPage 
        modelId={selectedModelDetail}
        onBack={handleBackFromDetail}
        onLaunchInWorkstation={handleLaunchFromDetail}
        isAuthenticated={!!authenticatedUser}
      />
    );
  }

  // =========================================================================
  // VIEW 3: AUTHENTICATED COMMAND CONSOLE + WORKSTATION (Directly on Scroll)
  // =========================================================================
  if (currentRoute === 'hub' || currentRoute === 'workstation') {
    if (!authenticatedUser) {
      return (
        <LoginPage 
          onLoginSuccess={handleLoginSuccess} 
          onBack={() => setCurrentRoute('home')}
        />
      );
    }

    const scrollToWorkstation = () => {
      const el = document.getElementById('workstation-viewport');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const scrollToHub = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
      <div className="w-full min-h-screen bg-aurora-animated text-slate-100 overflow-x-hidden scroll-smooth flex flex-col">
        {/* Section 1: Command Hub with ChatGPT-Style Session History (Matching Image 1) */}
        <MissionHub 
          currentUser={authenticatedUser}
          activeSessionId={activeSessionId}
          onSelectSession={setActiveSessionId}
          refreshTrigger={refreshSessionsTrigger}
          onLaunchWorkstation={(modalityId) => {
            setActiveModality(modalityId);
            setTimeout(scrollToWorkstation, 50);
          }}
          onScrollToWorkstation={scrollToWorkstation}
          onLogout={handleLogout}
          onViewPortal={() => setCurrentRoute('home')}
        />

        {/* Section 2: Interactive Geospatial Workstation */}
        <Workstation 
          currentUser={authenticatedUser}
          activeModality={activeModality}
          activeSessionId={activeSessionId}
          onSessionUpdated={() => setRefreshSessionsTrigger(prev => prev + 1)}
          onBackToHub={scrollToHub}
          onBackToHero={() => setCurrentRoute('home')}
          isAuthenticated={true}
          onLogoutClick={handleLogout}
        />
      </div>
    );
  }

  // =========================================================================
  // VIEW 5: PUBLIC LANDING FLOW (Clean Hero -> Model Showcase -> Footer)
  // =========================================================================
  return (
    <div className="w-full min-h-screen bg-aurora-animated text-slate-100 overflow-x-hidden flex flex-col">
      {/* Viewport 1: Space Entry Portal Landing Page (Cleaned Hero) */}
      <HeroSection 
        currentUser={authenticatedUser || defaultUser}
        isAuthenticated={!!authenticatedUser}
        onLoginClick={() => {
          if (authenticatedUser) {
            setCurrentRoute('hub');
          } else {
            setCurrentRoute('login');
          }
        }}
        onLogoutClick={handleLogout}
        onGetStarted={() => {
          if (authenticatedUser) {
            setCurrentRoute('hub');
          } else {
            const el = document.getElementById('models-showcase');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }}
        onSelectModality={(modalityId) => {
          setActiveModality(modalityId);
          if (authenticatedUser) {
            setCurrentRoute('hub');
          } else {
            setCurrentRoute('login');
          }
        }}
      />

      {/* Section 2: AI Foundation Models Showcase in Row */}
      <ModelShowcase 
        onSelectModel={handleSelectModel}
      />

      {/* Section 3: Comprehensive Futuristic Footer */}
      <Footer 
        onSelectModel={handleSelectModel}
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />
    </div>
  );
}
