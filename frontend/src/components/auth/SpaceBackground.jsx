import React, { useEffect, useRef } from 'react';

export default function SpaceBackground({ isAuthenticating }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles = [];
    const numParticles = 150;
    
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.6 + 0.1,
        color: Math.random() > 0.5 ? '16, 185, 129' : '6, 182, 212' // emerald or cyan
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Speed up particles during authentication
      const speedMultiplier = isAuthenticating ? 5 : 1;

      particles.forEach(p => {
        p.x += p.speedX * speedMultiplier;
        p.y += p.speedY * speedMultiplier;
        
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
        ctx.fill();
      });
      
      animationFrameId = requestAnimationFrame(draw);
    };
    
    draw();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isAuthenticating]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden bg-[#020617] z-0">
      {/* Layer 1: Dark space gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0a192f] via-[#020617] to-black opacity-90" />
      
      {/* Layer 2: Animated Canvas Stars/Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-70" />
      
      {/* Layer 3: Faint Orbital Lines */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] sm:w-[80vw] sm:h-[80vw] border border-cyan-500/5 rounded-full rotate-45" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] sm:w-[100vw] sm:h-[100vw] border border-emerald-500/5 rounded-full -rotate-12" />
      
      {/* Layer 4: Subtle dot/grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03]" />
      
      {/* Layer 5: Glowing cyan/teal atmospheric effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px] mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] mix-blend-screen" />
    </div>
  );
}
