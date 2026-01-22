'use client';

import { memo, useEffect, useRef, useState } from 'react';

// Full JARVIS-style animated HUD background with Canvas
export const OperatorBackground = memo(function OperatorBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Canvas animation for particles and lines
  useEffect(() => {
    if (!mounted) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationId: number;
    let particles: Particle[] = [];
    let connections: Connection[] = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    // Create particles
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.alpha = Math.random() * 0.5 + 0.2;
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      
      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(6, 182, 212, ${this.alpha})`;
        ctx!.fill();
        
        // Glow
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(6, 182, 212, ${this.alpha * 0.3})`;
        ctx!.fill();
      }
    }
    
    // Create connection lines between nearby particles
    class Connection {
      p1: Particle;
      p2: Particle;
      
      constructor(p1: Particle, p2: Particle) {
        this.p1 = p1;
        this.p2 = p2;
      }
      
      draw() {
        const dist = Math.hypot(this.p1.x - this.p2.x, this.p1.y - this.p2.y);
        if (dist < 150) {
          const alpha = (1 - dist / 150) * 0.3;
          ctx!.beginPath();
          ctx!.moveTo(this.p1.x, this.p1.y);
          ctx!.lineTo(this.p2.x, this.p2.y);
          ctx!.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
          ctx!.lineWidth = 0.5;
          ctx!.stroke();
        }
      }
    }
    
    // Initialize particles
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle());
    }
    
    // Animation loop
    let scanY = 0;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Draw scan line
      scanY += 2;
      if (scanY > canvas.height) scanY = 0;
      
      const gradient = ctx.createLinearGradient(0, scanY - 50, 0, scanY + 50);
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0)');
      gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.5)');
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, scanY - 50, canvas.width, 100);
      
      // Bright scan line
      ctx.fillStyle = 'rgba(16, 185, 129, 0.8)';
      ctx.fillRect(0, scanY - 1, canvas.width, 2);
      
      // Update and draw particles
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const conn = new Connection(particles[i], particles[j]);
          conn.draw();
        }
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#030308]">
      {/* Canvas for particle animation */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Radial glow from center */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)',
        }}
      />

      {/* Rotating HUD - Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden lg:block">
        <HudRing size={400} duration={60} direction="normal" opacity={0.1} />
        <HudRing size={350} duration={45} direction="reverse" opacity={0.15} dashed />
        <HudRing size={300} duration={30} direction="normal" opacity={0.1} />
        <HudRing size={200} duration={20} direction="reverse" opacity={0.2} segments={4} />
      </div>

      {/* Top-left HUD */}
      <div className="absolute top-12 left-12 hidden md:block">
        <HudRing size={100} duration={8} direction="normal" opacity={0.4} />
        <HudRing size={80} duration={6} direction="reverse" opacity={0.3} segments={3} />
        <OrbitDot radius={50} duration={3} color="cyan" />
        <OrbitDot radius={35} duration={2} color="emerald" offsetAngle={180} />
        <DataBars />
      </div>
      
      {/* Top-right HUD */}
      <div className="absolute top-16 right-16 hidden md:block">
        <HudRing size={80} duration={10} direction="reverse" opacity={0.3} />
        <HudRing size={60} duration={5} direction="normal" opacity={0.4} segments={2} />
        <OrbitDot radius={40} duration={4} color="emerald" />
        <PulseCircle />
      </div>
      
      {/* Bottom-left HUD */}
      <div className="absolute bottom-20 left-20 hidden lg:block">
        <HudRing size={70} duration={7} direction="normal" opacity={0.35} />
        <OrbitDot radius={35} duration={2.5} color="cyan" />
      </div>
      
      {/* Bottom-right HUD */}
      <div className="absolute bottom-16 right-16 hidden lg:block">
        <HudRing size={90} duration={12} direction="reverse" opacity={0.25} dashed />
        <HudRing size={65} duration={6} direction="normal" opacity={0.35} segments={3} />
        <OrbitDot radius={45} duration={3.5} color="cyan" />
      </div>

      {/* Animated corner brackets */}
      <CornerBracket position="top-left" />
      <CornerBracket position="top-right" />
      <CornerBracket position="bottom-left" />
      <CornerBracket position="bottom-right" />
      
      {/* Moving data lines - Left */}
      <div className="absolute left-0 top-1/4 hidden lg:block">
        <MovingDataLine delay={0} width={100} />
        <MovingDataLine delay={0.5} width={150} />
        <MovingDataLine delay={1} width={80} />
        <MovingDataLine delay={1.5} width={120} />
      </div>
      
      {/* Moving data lines - Right */}
      <div className="absolute right-0 top-2/3 hidden lg:block">
        <MovingDataLine delay={0.3} width={90} reverse />
        <MovingDataLine delay={0.8} width={130} reverse />
        <MovingDataLine delay={1.3} width={70} reverse />
      </div>
    </div>
  );
});

// Rotating HUD ring
const HudRing = memo(function HudRing({ 
  size, 
  duration, 
  direction,
  opacity,
  dashed = false,
  segments = 0,
}: { 
  size: number; 
  duration: number;
  direction: 'normal' | 'reverse';
  opacity: number;
  dashed?: boolean;
  segments?: number;
}) {
  return (
    <div 
      className="absolute rounded-full border"
      style={{
        width: size,
        height: size,
        left: -size / 2,
        top: -size / 2,
        borderColor: `rgba(6, 182, 212, ${opacity})`,
        borderStyle: dashed ? 'dashed' : 'solid',
        animation: `spin ${duration}s linear infinite ${direction}`,
      }}
    >
      {segments > 0 && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="rgba(16, 185, 129, 0.5)"
            strokeWidth="2"
            strokeDasharray={`${300 / segments} ${300 / segments}`}
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
});

// Orbiting dot
const OrbitDot = memo(function OrbitDot({ 
  radius, 
  duration,
  color,
  offsetAngle = 0,
}: { 
  radius: number; 
  duration: number;
  color: 'cyan' | 'emerald';
  offsetAngle?: number;
}) {
  const dotColor = color === 'cyan' ? '#06b6d4' : '#10b981';
  
  return (
    <div 
      className="absolute w-0 h-0"
      style={{
        animation: `spin ${duration}s linear infinite`,
        animationDelay: `${-duration * offsetAngle / 360}s`,
      }}
    >
      <div 
        className="absolute w-3 h-3 rounded-full"
        style={{
          top: -radius,
          left: -6,
          background: dotColor,
          boxShadow: `0 0 10px ${dotColor}, 0 0 20px ${dotColor}, 0 0 30px ${dotColor}`,
        }}
      />
      {/* Trail */}
      <div 
        className="absolute rounded-full opacity-50"
        style={{
          width: 2,
          height: 2,
          top: -radius + 4,
          left: -6,
          background: dotColor,
          boxShadow: `0 0 5px ${dotColor}`,
        }}
      />
    </div>
  );
});

// Pulse circle effect
const PulseCircle = memo(function PulseCircle() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-4 h-4 rounded-full bg-cyan-500/50 animate-ping" />
      <div className="absolute w-2 h-2 rounded-full bg-cyan-400" />
    </div>
  );
});

// Data bars visualization
const DataBars = memo(function DataBars() {
  return (
    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-1">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-1 bg-cyan-500/60 rounded-full"
          style={{
            height: 8 + Math.random() * 12,
            animation: `dataBar 1s ease-in-out infinite`,
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
});

// Moving data line
const MovingDataLine = memo(function MovingDataLine({ 
  delay, 
  width,
  reverse = false,
}: { 
  delay: number; 
  width: number;
  reverse?: boolean;
}) {
  return (
    <div 
      className="relative h-px mb-3 overflow-hidden"
      style={{ width }}
    >
      <div className="absolute inset-0 bg-cyan-500/20" />
      <div 
        className="absolute h-full w-8 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
        style={{
          animation: `dataFlow 2s ease-in-out infinite`,
          animationDelay: `${delay}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      />
    </div>
  );
});

// Corner bracket
const CornerBracket = memo(function CornerBracket({ 
  position 
}: { 
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}) {
  const positions = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2 rotate-90',
    'bottom-left': 'bottom-2 left-2 -rotate-90',
    'bottom-right': 'bottom-2 right-2 rotate-180',
  };
  
  return (
    <div className={`absolute ${positions[position]} w-16 h-16`}>
      <div 
        className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 to-transparent"
        style={{ boxShadow: '0 0 10px rgba(6, 182, 212, 0.5)' }}
      />
      <div 
        className="absolute top-0 left-0 h-full w-0.5 bg-gradient-to-b from-cyan-500 to-transparent"
        style={{ boxShadow: '0 0 10px rgba(6, 182, 212, 0.5)' }}
      />
      <div className="absolute top-0 left-0 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
    </div>
  );
});
