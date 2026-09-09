import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Sparkles, 
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function LoginPage({ onLoginSuccess, onBack }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  const canvasRef = useRef(null);

  // Animated meteor streaks & sparkling starfield effect on left pane
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Shooting stars
    const meteors = [];
    const createMeteor = () => {
      return {
        x: Math.random() * canvas.width * 1.2,
        y: Math.random() * canvas.height * 0.4,
        length: Math.random() * 90 + 70,
        speed: Math.random() * 4 + 4,
        opacity: Math.random() * 0.8 + 0.2,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.1, // ~45 degrees diagonal
        thickness: Math.random() * 1.5 + 1
      };
    };

    for (let i = 0; i < 4; i++) {
      meteors.push(createMeteor());
    }

    // Sparkle stars
    const stars = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random(),
      fadeSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1)
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render sparkles
      stars.forEach(s => {
        s.alpha += s.fadeSpeed;
        if (s.alpha > 1) { s.alpha = 1; s.fadeSpeed = -Math.abs(s.fadeSpeed); }
        if (s.alpha < 0.1) { s.alpha = 0.1; s.fadeSpeed = Math.abs(s.fadeSpeed); }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 220, 255, ${s.alpha * 0.7})`;
        ctx.fill();
      });

      // Render meteors
      meteors.forEach((m, idx) => {
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;

        const tailX = m.x - Math.cos(m.angle) * m.length;
        const tailY = m.y - Math.sin(m.angle) * m.length;

        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${m.opacity})`);
        grad.addColorStop(0.3, `rgba(192, 132, 252, ${m.opacity * 0.8})`);
        grad.addColorStop(1, 'rgba(126, 34, 206, 0)');

        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = m.thickness;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Reset when out of view
        if (m.x > canvas.width + 100 || m.y > canvas.height + 100) {
          meteors[idx] = createMeteor();
          meteors[idx].x = Math.random() * canvas.width * 0.8;
          meteors[idx].y = -20;
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const finalizeLogin = (customName) => {
    const userPayload = {
      id: Date.now(),
      email: email || "analyst.isro@satquery.gov.in",
      name: customName || fullName || "Dr. Vikram S. Rao",
      rank: "Senior Geospatial Scientist",
      clearance: "ISRO Level-4 Orbital Access",
      mission: "ISRO-EOS-FOUNDATION-AI"
    };

    setTimeout(() => {
      setIsLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess(userPayload);
      }
    }, 700);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    if (isRegistering) {
      if (!fullName.trim() || !email.trim() || !password.trim()) {
        setErrorMsg("Please fill in all fields.");
        setIsLoading(false);
        return;
      }
      setLoadingMessage("Creating your profile...");
      setTimeout(() => {
        setLoadingMessage("Account created successfully!");
        finalizeLogin(fullName);
      }, 900);
    } else {
      const effectiveEmail = email.trim() || 'analyst.isro@satquery.gov.in';
      setLoadingMessage("Signing into your workspace...");
      setTimeout(() => {
        finalizeLogin(effectiveEmail.includes('@') ? effectiveEmail.split('@')[0] : effectiveEmail);
      }, 850);
    }
  };

  const handleQuickDemoAccess = () => {
    setErrorMsg(null);
    setIsLoading(true);
    setLoadingMessage("Authenticating Demo Credentials (Jury)...");
    setTimeout(() => {
      finalizeLogin("ISRO Lead Analyst (Demo)");
    }, 800);
  };

  const handleSocialAuth = (provider) => {
    setErrorMsg(null);
    setIsLoading(true);
    setLoadingMessage(`Connecting with ${provider}...`);
    setTimeout(() => {
      finalizeLogin(`${provider} Verified User`);
    }, 900);
  };

  return (
    <div className="relative w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#08090C] text-white select-none overflow-x-hidden font-sans">
      
      {/* ========================================================================= */}
      {/* LEFT COLUMN: COSMIC SPACE ADVENTURE VIEWPORT (Zero Blue)                  */}
      {/* ========================================================================= */}
      <div className="relative w-full min-h-[420px] lg:min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-hidden bg-[#08090C]">
        
        {/* Background Image: Wavy Gas Giant, Orbital Rings, Lilac Moon */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 scale-105 transition-transform duration-1000 ease-out"
          style={{ backgroundImage: `url('/space_adventure_bg.jpg')` }}
        />

        {/* Ambient Gradient Overlays for seamless blending into deep obsidian */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#08090C] z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090C]/90 via-transparent to-transparent z-[1]" />
        
        {/* Canvas for dynamic shooting stars & sparkling starfield */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full pointer-events-none z-[2]" 
        />

        {/* Top Bar: Back to Landing / SatQuery AI */}
        <div className="relative z-10 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12131C]/80 hover:bg-[#1A1B26] border border-[#8B5CF6]/50 hover:border-[#10B981] text-xs font-medium text-white backdrop-blur-md transition-all cursor-pointer shadow-lg group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-[#10B981]" />
            <span>Back to Home</span>
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12131C]/70 backdrop-blur-md border border-[#8B5CF6]/40 text-[11px] font-mono text-[#10B981]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>SatQuery AI • v2.6</span>
          </div>
        </div>

        {/* Bottom Headline */}
        <div className="relative z-10 mt-auto pt-16">
          <h1 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight text-white uppercase leading-none drop-shadow-md">
            SIGN IN TO YOUR
          </h1>
          <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-[#C084FC] to-[#34D399] bg-clip-text text-transparent uppercase leading-tight mt-1 drop-shadow-[0_0_25px_rgba(139,92,246,0.6)]">
            ADVENTURE!
          </h2>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: AUTHENTICATION FORM (High-Contrast Obsidian + Gradients)     */}
      {/* ========================================================================= */}
      <div className="relative flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-[#08090C] min-h-screen">
        
        {/* Subtle background glow */}
        <div className="absolute w-96 h-96 rounded-full bg-[#8B5CF6]/08 blur-3xl pointer-events-none -top-10 -right-10" />
        <div className="absolute w-96 h-96 rounded-full bg-[#10B981]/08 blur-3xl pointer-events-none -bottom-10 -left-10" />

        <div className="relative z-10 w-full max-w-[430px] mx-auto">
          
          {/* Header Title */}
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-wide text-white uppercase mb-7">
            {isRegistering ? 'SIGN UP' : 'SIGN IN'}
          </h2>

          {/* Error Alert */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 flex items-start gap-2.5 text-xs text-red-200 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name field (Only shown in Sign Up mode) */}
            {isRegistering && (
              <div className="relative flex items-center px-4 py-3.5 rounded-2xl bg-[#12131C] border border-white/10 focus-within:border-[#8B5CF6] focus-within:ring-2 focus-within:ring-[#8B5CF6]/30 transition-all">
                <User className="w-5 h-5 text-slate-300 shrink-0 mr-3" />
                <input
                  type="text"
                  required={isRegistering}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 outline-none font-sans"
                />
              </div>
            )}

            {/* Email Address Input */}
            <div className="relative flex items-center px-4 py-3.5 rounded-2xl bg-[#12131C] border border-white/10 focus-within:border-[#8B5CF6] focus-within:ring-2 focus-within:ring-[#8B5CF6]/30 transition-all">
              <Mail className="w-5 h-5 text-slate-300 shrink-0 mr-3" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 outline-none font-sans"
              />
            </div>

            {/* Password Input */}
            <div className="relative flex items-center px-4 py-3.5 rounded-2xl bg-[#12131C] border border-white/10 focus-within:border-[#8B5CF6] focus-within:ring-2 focus-within:ring-[#8B5CF6]/30 transition-all">
              <Lock className="w-5 h-5 text-slate-300 shrink-0 mr-3" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 outline-none font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-white transition cursor-pointer p-1 ml-2 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F43F5E] hover:opacity-95 text-white font-black text-sm sm:text-base tracking-wider uppercase transition-all duration-300 shadow-[0_4px_25px_rgba(139,92,246,0.4)] hover:shadow-[0_6px_35px_rgba(244,63,94,0.6)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>{loadingMessage || 'PROCESSING...'}</span>
                  </>
                ) : (
                  <span>{isRegistering ? 'SIGN UP' : 'SIGN IN'}</span>
                )}
              </button>
            </div>

            {/* Horizontal Divider Line */}
            <div className="w-full h-[1px] bg-white/10 my-6" />

            {/* "Or continue with" Section */}
            <div>
              <p className="text-xs text-slate-300 mb-3 font-normal">
                Or continue with
              </p>

              <div className="grid grid-cols-2 gap-3">
                
                {/* Google Button */}
                <button
                  type="button"
                  onClick={() => handleSocialAuth('Google')}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-[#12131C] hover:bg-[#1A1B26] border border-white/10 hover:border-[#8B5CF6] text-white transition-all cursor-pointer group disabled:opacity-50"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="text-xs font-semibold text-white">Google</span>
                </button>

                {/* ISRO SAC SSO Button */}
                <button
                  type="button"
                  onClick={() => handleSocialAuth('ISRO')}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#12131C] hover:bg-[#1A1B26] border border-white/10 hover:border-[#10B981] text-white transition-all cursor-pointer group disabled:opacity-50"
                >
                  <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#10B981] flex items-center justify-center p-0.5">
                    <Sparkles className="w-2.5 h-2.5 text-[#08090C]" />
                  </div>
                  <span className="text-xs font-semibold text-white">ISRO SAC SSO</span>
                </button>

              </div>
            </div>

            {/* Toggle Between Sign In and Sign Up */}
            <div className="pt-4 text-center">
              <p className="text-xs text-slate-300">
                {isRegistering ? 'Already have an ISRO account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setErrorMsg(null);
                  }}
                  className="font-bold text-[#10B981] hover:text-[#F43F5E] hover:underline cursor-pointer ml-1"
                >
                  {isRegistering ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>

            {/* Quick 1-Click Fast Track for Evaluation / Jury Demo */}
            <div className="pt-3">
              <button
                type="button"
                onClick={handleQuickDemoAccess}
                disabled={isLoading}
                className="w-full py-2.5 px-3 rounded-xl bg-[#12131C] hover:bg-[#1A1B26] border border-[#8B5CF6]/50 hover:border-[#10B981] text-slate-200 hover:text-white text-[12px] font-mono flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span className="font-semibold tracking-wide text-[#10B981]">Quick 1-Click Demo Login (Jury / Test)</span>
              </button>
            </div>

          </form>

        </div>
      </div>

    </div>
  );
}

