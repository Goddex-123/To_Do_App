'use client';

import { memo, useEffect, useState } from 'react';

// Full JARVIS-style animated HUD background
export const OperatorBackground = memo(function OperatorBackground() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#050508]">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-[#0a1628] via-[#050510] to-[#020204]" />
      
      {/* Animated grid */}
      <div className="absolute inset-0 grid-animated opacity-40" />
      
      {/* Main scanning beam */}
      <div className="scan-beam" />
      
      {/* Center HUD - Main circular element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
        {/* Outer ring */}
        <div className="absolute w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-500/30 animate-spin-very-slow" />
        
        {/* Middle ring with dashes */}
        <div className="absolute w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-emerald-500/20 animate-spin-reverse-slow" />
        
        {/* Inner ring */}
        <div className="absolute w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/25 animate-spin-slow" />
        
        {/* Core glow */}
        <div className="absolute w-[100px] h-[100px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-xl animate-pulse-glow" />
      </div>

      {/* Top-left HUD cluster */}
      <div className="absolute top-16 left-16 hidden md:block">
        <HudCircle size={120} color="cyan" delay={0} />
        <HudArc size={140} startAngle={-30} endAngle={60} color="emerald" delay={0.5} />
        <OrbitingDot size={100} duration={4} color="cyan" />
      </div>
      
      {/* Top-right HUD cluster */}
      <div className="absolute top-20 right-20 hidden md:block">
        <HudCircle size={80} color="emerald" delay={1} />
        <HudArc size={100} startAngle={120} endAngle={240} color="cyan" delay={0} />
        <OrbitingDot size={70} duration={3} color="emerald" />
      </div>
      
      {/* Bottom-left HUD */}
      <div className="absolute bottom-24 left-24 hidden lg:block">
        <HudCircle size={90} color="cyan" delay={0.3} />
        <OrbitingDot size={80} duration={5} color="cyan" />
      </div>
      
      {/* Bottom-right HUD */}
      <div className="absolute bottom-16 right-16 hidden lg:block">
        <HudCircle size={100} color="emerald" delay={0.7} />
        <HudArc size={120} startAngle={200} endAngle={340} color="cyan" delay={1} />
      </div>

      {/* Floating data streams - Left side */}
      <div className="absolute left-4 top-1/3 flex flex-col gap-3 hidden lg:flex">
        <DataLine width={80} delay={0} />
        <DataLine width={120} delay={0.3} />
        <DataLine width={60} delay={0.6} />
        <DataLine width={100} delay={0.9} />
        <DataLine width={70} delay={1.2} />
      </div>
      
      {/* Floating data streams - Right side */}
      <div className="absolute right-4 top-1/2 flex flex-col gap-3 items-end hidden lg:flex">
        <DataLine width={90} delay={0.2} direction="left" />
        <DataLine width={60} delay={0.5} direction="left" />
        <DataLine width={110} delay={0.8} direction="left" />
        <DataLine width={75} delay={1.1} direction="left" />
      </div>

      {/* Corner brackets with animated glow */}
      <CornerBracket position="top-left" />
      <CornerBracket position="top-right" />
      <CornerBracket position="bottom-left" />
      <CornerBracket position="bottom-right" />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <Particle key={i} index={i} />
        ))}
      </div>
      
      {/* Horizontal scan lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        {[...Array(100)].map((_, i) => (
          <div key={i} className="h-px bg-white" style={{ marginTop: i * 8 }} />
        ))}
      </div>
    </div>
  );
});

// Animated HUD circle with pulse
const HudCircle = memo(function HudCircle({ 
  size, 
  color, 
  delay 
}: { 
  size: number; 
  color: 'cyan' | 'emerald'; 
  delay: number;
}) {
  const colorClass = color === 'cyan' ? 'border-cyan-500' : 'border-emerald-500';
  
  return (
    <div 
      className={`absolute rounded-full border ${colorClass}/30 animate-pulse-ring`}
      style={{ 
        width: size, 
        height: size,
        left: -size/2,
        top: -size/2,
        animationDelay: `${delay}s`,
      }}
    >
      {/* Inner rotating border segment */}
      <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 100 100">
        <circle 
          cx="50" cy="50" r="48"
          fill="none"
          stroke={color === 'cyan' ? '#06b6d4' : '#10b981'}
          strokeWidth="1"
          strokeDasharray="30 70"
          opacity="0.5"
        />
      </svg>
    </div>
  );
});

// Animated arc segment
const HudArc = memo(function HudArc({ 
  size, 
  startAngle, 
  endAngle, 
  color, 
  delay 
}: { 
  size: number; 
  startAngle: number; 
  endAngle: number;
  color: 'cyan' | 'emerald'; 
  delay: number;
}) {
  const strokeColor = color === 'cyan' ? '#06b6d4' : '#10b981';
  
  // Calculate arc path
  const radius = 45;
  const startRad = (startAngle - 90) * Math.PI / 180;
  const endRad = (endAngle - 90) * Math.PI / 180;
  const x1 = 50 + radius * Math.cos(startRad);
  const y1 = 50 + radius * Math.sin(startRad);
  const x2 = 50 + radius * Math.cos(endRad);
  const y2 = 50 + radius * Math.sin(endRad);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  
  return (
    <div 
      className="absolute animate-spin-reverse-slow"
      style={{ 
        width: size, 
        height: size,
        left: -size/2,
        top: -size/2,
        animationDelay: `${delay}s`,
      }}
    >
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <path 
          d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.4"
          className="animate-pulse-glow"
        />
      </svg>
    </div>
  );
});

// Orbiting dot
const OrbitingDot = memo(function OrbitingDot({ 
  size, 
  duration, 
  color 
}: { 
  size: number; 
  duration: number;
  color: 'cyan' | 'emerald';
}) {
  const bgColor = color === 'cyan' ? 'bg-cyan-400' : 'bg-emerald-400';
  const shadowColor = color === 'cyan' ? 'shadow-cyan-400/50' : 'shadow-emerald-400/50';
  
  return (
    <div 
      className="absolute"
      style={{ 
        width: size, 
        height: size,
        left: -size/2,
        top: -size/2,
        animation: `orbit ${duration}s linear infinite`,
      }}
    >
      <div 
        className={`absolute w-2 h-2 rounded-full ${bgColor} shadow-lg ${shadowColor}`}
        style={{ 
          top: 0, 
          left: '50%', 
          transform: 'translateX(-50%)',
          boxShadow: `0 0 10px currentColor`,
        }}
      />
    </div>
  );
});

// Animated data line
const DataLine = memo(function DataLine({ 
  width, 
  delay,
  direction = 'right'
}: { 
  width: number; 
  delay: number;
  direction?: 'left' | 'right';
}) {
  return (
    <div 
      className="relative h-px overflow-hidden"
      style={{ width }}
    >
      <div 
        className={`absolute inset-y-0 w-1/2 bg-gradient-to-${direction === 'right' ? 'r' : 'l'} from-transparent via-cyan-500 to-transparent animate-data-flow`}
        style={{ 
          animationDelay: `${delay}s`,
          animationDirection: direction === 'left' ? 'reverse' : 'normal',
        }}
      />
      <div className="absolute inset-0 bg-cyan-500/20" />
    </div>
  );
});

// Corner bracket with glow
const CornerBracket = memo(function CornerBracket({ 
  position 
}: { 
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}) {
  const positionClasses = {
    'top-left': 'top-3 left-3',
    'top-right': 'top-3 right-3 rotate-90',
    'bottom-left': 'bottom-3 left-3 -rotate-90',
    'bottom-right': 'bottom-3 right-3 rotate-180',
  };
  
  return (
    <div className={`absolute ${positionClasses[position]} w-12 h-12`}>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-cyan-500/60 to-transparent animate-pulse-glow" />
      <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-cyan-500/60 to-transparent animate-pulse-glow" />
      <div className="absolute top-0 left-0 w-2 h-2 bg-cyan-500/40 rounded-full blur-sm" />
    </div>
  );
});

// Floating particle
const Particle = memo(function Particle({ index }: { index: number }) {
  const size = 1 + (index % 3);
  const left = (index * 7) % 100;
  const top = (index * 13) % 100;
  const duration = 8 + (index % 5) * 2;
  const delay = index * 0.5;
  
  return (
    <div
      className="absolute rounded-full bg-cyan-400/60 animate-float-up"
      style={{
        width: size,
        height: size,
        left: `${left}%`,
        top: `${top}%`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        boxShadow: '0 0 4px rgba(6, 182, 212, 0.5)',
      }}
    />
  );
});
